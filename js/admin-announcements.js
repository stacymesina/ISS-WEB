// Upcoming events editor (WITH IMAGE UPLOAD FIXED)

function escapeAttr(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function renderAnnouncementsEditor() {
  const container = document.getElementById("announcements-editor");
  if (!container) return;

  const cfg = SiteConfig.get();
  if (!cfg) return;

  if (!Array.isArray(cfg.announcements)) cfg.announcements = [];

  container.innerHTML = "";

  cfg.announcements.forEach((a, i) => {
    const block = document.createElement("div");
    block.className = "admin-panel";
    block.style.marginBottom = "12px";

    block.innerHTML = `
      <h2 style="margin-bottom:10px;font-size:1rem;">Upcoming Event #${i + 1}</h2>

      <label>Title</label>
      <input type="text" data-ann-title="${i}" value="${escapeAttr(a.title)}">

      <label>Date</label>
      <input type="text" data-ann-date="${i}" value="${escapeAttr(a.date || "")}">

      <label>Description</label>
      <textarea rows="3" data-ann-desc="${i}">${escapeAttr(a.desc || "")}</textarea>

      <label>Image</label>
      <input type="file" data-ann-file="${i}" accept="image/*">

      <img data-ann-preview="${i}" src="${a.image || ""}" 
        style="width:120px;margin-top:8px;border-radius:8px;display:block;">
    `;

    container.appendChild(block);
  });

  // IMAGE HANDLER
  container.querySelectorAll("[data-ann-file]").forEach((input) => {
    input.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const base64 = await fileToBase64(file);
      const i = input.getAttribute("data-ann-file");

      const preview = container.querySelector(`[data-ann-preview="${i}"]`);
      if (preview) {
        preview.src = base64;
        preview.dataset.image = base64;
      }
    });
  });
}

function collectAnnouncements() {
  const titles = document.querySelectorAll("[data-ann-title]");

  return Array.from(titles).map((el) => {
    const i = el.getAttribute("data-ann-title");

    return {
      title: el.value,
      date: document.querySelector(`[data-ann-date="${i}"]`)?.value || "",
      desc: document.querySelector(`[data-ann-desc="${i}"]`)?.value || "",
      image:
        document.querySelector(`[data-ann-preview="${i}"]`)?.dataset.image ||
        ""
    };
  });
}

function bindAnnouncementAddButton() {
  const btn = document.getElementById("add-announcement");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const cfg = SiteConfig.get();
    cfg.announcements.push({
      title: "New Event",
      date: "",
      desc: "",
      image: ""
    });

    renderAnnouncementsEditor();
  });
}
