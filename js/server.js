const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();

const ROOT = __dirname;
const CONFIG_PATH = path.join(ROOT, 'site-config.json');
const UPLOAD_DIR = path.join(ROOT, 'uploads');
const EVENTS_UPLOAD_DIR = path.join(UPLOAD_DIR, 'events');

fs.mkdirSync(EVENTS_UPLOAD_DIR, { recursive: true });

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Serve static files from project root (so uploaded images are reachable)
app.use(express.static(ROOT));

function readConfig() {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function writeConfig(cfg) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2), 'utf8');
}

function ensureAdmin(req, res) {
  const pw = req.headers['x-admin-password'];
  const cfg = readConfig();
  if (!cfg) return res.status(500).json({ ok: false, error: 'Missing site-config.json' });

  // If ADMIN_PASSWORD is provided via env, use it; otherwise fall back to site-config.json.
  const expected = process.env.ADMIN_PASSWORD || cfg.adminPassword;

  if (!pw || pw !== expected) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }
  return null;
}


// Upload an events image. Expected field name: image
// Body should include: eventIndex (number)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, EVENTS_UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const safeExt = path.extname(file.originalname).toLowerCase() || '.png';
    const base = path.basename(file.originalname, safeExt).replace(/[^a-z0-9_-]/gi, '');
    const stamp = Date.now();
    cb(null, `${base || 'event'}_${stamp}${safeExt}`);
  },
});

const upload = multer({ storage });

// NOTE: For security, production should validate mimetypes & limit file size further.
app.post('/api/admin/upload-event-image', ensureAdmin, upload.single('image'), (req, res) => {
  const { eventIndex } = req.body || {};
  const cfg = readConfig();
  if (!cfg) return res.status(500).json({ ok: false, error: 'Missing site-config.json' });

  const idx = Number(eventIndex);
  if (Number.isNaN(idx)) {
    return res.status(400).json({ ok: false, error: 'eventIndex must be a number' });
  }

  if (!cfg.announcements) cfg.announcements = [];
  if (!cfg.announcements[idx]) {
    return res.status(400).json({ ok: false, error: `No announcement/event found at index ${idx}` });
  }

  const file = req.file;
  if (!file) return res.status(400).json({ ok: false, error: 'No file uploaded' });

  // Persist filename so frontend can load it from /uploads/events/<filename>
  cfg.announcements[idx].image = `/uploads/events/${file.filename}`;
  writeConfig(cfg);

  return res.json({ ok: true, imageUrl: cfg.announcements[idx].image, filename: file.filename });
});

app.post('/api/admin/refresh-config', (req, res) => {
  const cfg = readConfig();
  if (!cfg) return res.status(500).json({ ok: false, error: 'Missing site-config.json' });
  res.json({ ok: true, config: cfg });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`IS Nexus server listening on port ${port}`);
});

