// Upcoming events editor for admin.html (announcements → home slider + events page)

function escapeAttr(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function syncAnnouncementsToConfig() {
  const cfg = SiteConfig.get();
  if (!cfg) return;
  const collected = collectAnnouncements();
  cfg.announcements = collected;
}

function renderAnnouncementsEditor() {
  const container = document.getElementById("announcements-editor");
  if (!container || typeof SiteConfig === "undefined") return;

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
      <input type="text" data-ann-date="${i}" value="${escapeAttr(a.date || "")}" placeholder="May 19, 2026">

      <label>Description</label>
      <textarea rows="3" data-ann-desc="${i}">${escapeAttr(a.desc || "")}</textarea>

      <label>Image filename / path</label>
      <input type="text" data-ann-image="${i}" value="${escapeAttr(a.image || "")}" placeholder="img2.jpg">

      <button type="button" class="btn" data-remove-ann="${i}" style="margin-top:8px;background:#444;color:#fff;">Remove</button>
    `;

    container.appendChild(block);
  });

  container.querySelectorAll("[data-remove-ann]").forEach((btn) => {
    btn.addEventListener("click", () => {
      syncAnnouncementsToConfig();
      const cfg = SiteConfig.get();
      if (!cfg?.announcements) return;
      const i = Number(btn.getAttribute("data-remove-ann"));
      cfg.announcements.splice(i, 1);
      renderAnnouncementsEditor();
    });
  });
}

function collectAnnouncements() {
  const titles = document.querySelectorAll("[data-ann-title]");
  return Array.from(titles).map((el) => {
    const i = el.getAttribute("data-ann-title");
    return {
      title: el.value.trim(),
      date: document.querySelector(`[data-ann-date="${i}"]`)?.value.trim() || "",
      desc: document.querySelector(`[data-ann-desc="${i}"]`)?.value.trim() || "",
      image: document.querySelector(`[data-ann-image="${i}"]`)?.value.trim() || "",
    };
  });
}

function bindAnnouncementAddButton() {
  const addBtn = document.getElementById("add-announcement");
  if (!addBtn) return;

  if (addBtn.dataset.bound === "1") return;
  addBtn.dataset.bound = "1";

  addBtn.addEventListener("click", async () => {
    await SiteConfig.load();

    const cfg = SiteConfig.get();
    if (!cfg) {
      alert("Site configuration is not loaded. Please refresh the page and sign in again.");
      return;
    }

    syncAnnouncementsToConfig();

    if (!Array.isArray(cfg.announcements)) cfg.announcements = [];

    cfg.announcements.push({
      title: "New Upcoming Event",
      date: "",
      desc: "",
      image: "",
    });

    renderAnnouncementsEditor();
  });
}
