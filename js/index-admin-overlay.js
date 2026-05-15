// Admin overlay for index.html (single-page editor UI)

async function initIndexAdminOverlay() {
  await SiteConfig.load();
  const cfg = SiteConfig.get();
  if (!cfg) return;

  const overlay = document.getElementById("admin-overlay");
  const loginForm = document.getElementById("overlay-login-form");
  const passwordInput = document.getElementById("overlay-password");
  const errorEl = document.getElementById("overlay-login-error");
  const editorWrap = document.getElementById("admin-overlay-editor");

  if (!overlay || !loginForm || !passwordInput || !editorWrap) return;

  function openOverlay() {
    overlay.classList.add("show");
    overlay.setAttribute("aria-hidden", "false");
    errorEl.textContent = "";
  }

  function closeOverlay() {
    overlay.classList.remove("show");
    overlay.setAttribute("aria-hidden", "true");
  }

  function hideOrShowByAdmin() {
    const isAdmin = SiteConfig.isAdmin();
    if (isAdmin) {
      closeOverlay();
      editorWrap.hidden = false;
    } else {
      editorWrap.hidden = true;
      openOverlay();
    }
  }

  function bindLogin() {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const pw = passwordInput.value;
      if (SiteConfig.login(pw)) {
        errorEl.textContent = "";
        hideOrShowByAdmin();
      } else {
        errorEl.textContent = "Incorrect password.";
      }
    });

    document.getElementById("overlay-close")?.addEventListener("click", () => {
      if (SiteConfig.isAdmin()) closeOverlay();
    });

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay && SiteConfig.isAdmin()) closeOverlay();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && SiteConfig.isAdmin()) closeOverlay();
    });
  }

  function initEditorInputs() {
    // Hero
    document.getElementById("overlay-hero-title").value = cfg.hero?.title || "";
    document.getElementById("overlay-hero-subtitle").value = cfg.hero?.subtitle || "";
    document.getElementById("overlay-hero-tagline").value = cfg.hero?.tagline || "";

    // Contact
    document.getElementById("overlay-contact-email").value = cfg.contact?.email || "";
    document.getElementById("overlay-contact-facebook").value = cfg.contact?.facebook || "";
    document.getElementById("overlay-contact-instagram").value = cfg.contact?.instagram || "";

    // About
    document.getElementById("overlay-about-vision").value = cfg.about?.vision || "";
    document.getElementById("overlay-about-mission").value = cfg.about?.mission || "";
    document.getElementById("overlay-about-paragraphs").value = (cfg.about?.paragraphs || []).join("\n");

    syncAnnouncementOverlayFromConfig();
  }

  function syncAnnouncementOverlayFromConfig() {
    const container = document.getElementById("overlay-announcements");
    if (!container) return;
    container.innerHTML = "";

    (cfg.announcements || []).forEach((a, i) => {
      const row = document.createElement("div");
      row.className = "admin-panel";
      row.style.marginBottom = "14px";
      row.innerHTML = `
        <h2 style="margin:0 0 10px;font-size:1rem;">Announcement/Event #${i + 1}</h2>

        <label>Title</label>
        <input type="text" id="ov-ann-title-${i}" value="${escapeAttr(a.title)}" />

        <label>Date</label>
        <input type="text" id="ov-ann-date-${i}" value="${escapeAttr(a.date)}" />

        <label>Description</label>
        <textarea rows="3" id="ov-ann-desc-${i}">${escapeAttr(a.desc)}</textarea>

        <label>Image URL/path</label>
        <input type="text" id="ov-ann-image-${i}" value="${escapeAttr(a.image || "")}" placeholder="/uploads/events/xxx.jpg" />

        <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:8px;">
          <input type="file" accept="image/*" id="ov-ann-file-${i}" />
          <button type="button" class="btn" style="margin-top:0;background:#444;color:#fff;" id="ov-ann-upload-${i}">Upload</button>
          <img id="ov-ann-preview-${i}" src="${escapeAttr(a.image || "")}" alt="Preview" style="width:140px;height:85px;object-fit:cover;border:1px solid var(--primary);border-radius:8px;opacity:${a.image ? 1 : 0.35};background:#0b0b10;">
        </div>

        <button type="button" class="btn" id="ov-ann-remove-${i}" style="background:#333;color:#fff;">Remove</button>
      `;

      container.appendChild(row);

      row.querySelector(`#ov-ann-remove-${i}`).addEventListener("click", () => {
        cfg.announcements.splice(i, 1);
        initEditorInputs();
      });

      row.querySelector(`#ov-ann-upload-${i}`).addEventListener("click", async () => {
        const fileInput = document.getElementById(`ov-ann-file-${i}`);
        const file = fileInput?.files?.[0];
        if (!file) return alert("Choose an image first.");

        const fd = new FormData();
        fd.append("image", file);
        fd.set("eventIndex", String(i));

        try {
          const res = await fetch("/api/admin/upload-event-image", {
            method: "POST",
            headers: { "x-admin-password": cfg.adminPassword },
            body: fd,
          });
          const data = await res.json();
          if (!res.ok || !data.ok) return alert(data.error || "Upload failed");

          cfg.announcements[i].image = data.imageUrl;
          document.getElementById(`ov-ann-image-${i}`).value = data.imageUrl;
          document.getElementById(`ov-ann-preview-${i}`).src = data.imageUrl;
        } catch (e) {
          console.error(e);
          alert("Upload error");
        }
      });

      ["ov-ann-title", "ov-ann-date", "ov-ann-desc", "ov-ann-image"].forEach((prefix) => {
        const id = `${prefix}-${i}`;
        document.getElementById(id)?.addEventListener("input", () => {
          syncAnnouncementOverlayToConfig(i);
        });
      });
    });
  }

  function syncAnnouncementOverlayToConfig(i) {
    cfg.announcements[i].title = document.getElementById(`ov-ann-title-${i}`).value;
    cfg.announcements[i].date = document.getElementById(`ov-ann-date-${i}`).value;
    cfg.announcements[i].desc = document.getElementById(`ov-ann-desc-${i}`).value;
    cfg.announcements[i].image = document.getElementById(`ov-ann-image-${i}`).value;
  }

  function bindEditorActions() {
    document.getElementById("overlay-save-btn").addEventListener("click", () => {
      cfg.hero.title = document.getElementById("overlay-hero-title").value;
      cfg.hero.subtitle = document.getElementById("overlay-hero-subtitle").value;
      cfg.hero.tagline = document.getElementById("overlay-hero-tagline").value;

      cfg.contact.email = document.getElementById("overlay-contact-email").value;
      cfg.contact.facebook = document.getElementById("overlay-contact-facebook").value;
      cfg.contact.instagram = document.getElementById("overlay-contact-instagram").value;

      cfg.about.vision = document.getElementById("overlay-about-vision").value;
      cfg.about.mission = document.getElementById("overlay-about-mission").value;
      cfg.about.paragraphs = document
        .getElementById("overlay-about-paragraphs")
        .value.split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      SiteConfig.save(cfg);

      // Update [data-site] fields in this browser
      document.querySelectorAll("[data-site]").forEach((el) => {
        const path = el.getAttribute("data-site");
        const value = getByPath(cfg, path);
        if (value === undefined || value === null) return;
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") el.value = value;
        else el.textContent = value;
      });

      location.reload();
    });

    document.getElementById("overlay-export-btn").addEventListener("click", () => {
      SiteConfig.save(cfg);
      const blob = new Blob([JSON.stringify(cfg, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "site-config.json";
      a.click();
      URL.revokeObjectURL(a.href);
    });

    document.getElementById("overlay-logout-btn").addEventListener("click", () => {
      SiteConfig.logout();
      location.reload();
    });
  }

  function getByPath(obj, path) {
    return path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);
  }

  function escapeAttr(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");
  }

  bindLogin();
  initEditorInputs();
  bindEditorActions();
  hideOrShowByAdmin();
}

// Admin button launcher
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("admin-overlay-launch");
  const overlay = document.getElementById("admin-overlay");
  if (!btn || !overlay) return;
  btn.style.display = "none";

  // (button is only a launcher; overlay UI is handled inside initIndexAdminOverlay)
  // no-op
});

document.addEventListener("DOMContentLoaded", initIndexAdminOverlay);

