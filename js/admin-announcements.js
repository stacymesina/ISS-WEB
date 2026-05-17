function escapeAttr(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function syncAnnouncementsToConfig() {
  const cfg = SiteConfig.get();
  if (!cfg) return;
  cfg.announcements = collectAnnouncements();
}

function renderAnnouncementsEditor() {
  const container = document.getElementById("announcements-editor");
  if (!container) return;

  const cfg = SiteConfig.get();

  if (!Array.isArray(cfg.announcements)) {
    cfg.announcements = [];
  }

  container.innerHTML = "";

  cfg.announcements.forEach((a, i) => {

    const block = document.createElement("div");
    block.className = "admin-panel";

    block.innerHTML = `
      <h2 style="margin-bottom:10px;font-size:1rem;">
        Upcoming Event #${i + 1}
      </h2>

      <label>Title</label>
      <input type="text" data-ann-title="${i}" value="${escapeAttr(a.title)}">

      <label>Date</label>
      <input type="text" data-ann-date="${i}" value="${escapeAttr(a.date || "")}">

      <label>Description</label>
      <textarea rows="3" data-ann-desc="${i}">${escapeAttr(a.desc || "")}</textarea>

      <label>Event Image</label>
      <input type="file" class="announcement-image" data-ann-image-upload="${i}" accept="image/*">

      <img 
        src="${a.image || ""}" 
        class="announcement-preview"
        style="width:100%;max-width:260px;border-radius:10px;margin-top:10px;border:1px solid var(--primary);"
      >

      <button 
        type="button"
        class="btn"
        data-remove-ann="${i}"
        style="margin-top:12px;background:#444;color:#fff;"
      >
        Remove
      </button>
    `;

    container.appendChild(block);

    const fileInput = block.querySelector(".announcement-image");
    const preview = block.querySelector(".announcement-preview");

    fileInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const base64 = await fileToBase64(file);
      preview.src = base64;
    });
  });

  container.querySelectorAll("[data-remove-ann]").forEach((btn) => {
    btn.addEventListener("click", () => {

      syncAnnouncementsToConfig();

      const cfg = SiteConfig.get();

      const i = Number(btn.dataset.removeAnn);

      cfg.announcements.splice(i, 1);

      renderAnnouncementsEditor();
    });
  });
}

function collectAnnouncements() {

  const titles = document.querySelectorAll("[data-ann-title]");

  return Array.from(titles).map((el) => {

    const i = el.dataset.annTitle;

    const block = el.closest(".admin-panel");

    return {
      title: el.value.trim(),
      date: document.querySelector(`[data-ann-date="${i}"]`)?.value.trim() || "",
      desc: document.querySelector(`[data-ann-desc="${i}"]`)?.value.trim() || "",
      image: block.querySelector(".announcement-preview")?.src || "",
    };
  });
}

function bindAnnouncementAddButton() {

  const addBtn = document.getElementById("add-announcement");

  if (!addBtn || addBtn.dataset.bound === "1") return;

  addBtn.dataset.bound = "1";

  addBtn.addEventListener("click", () => {

    const cfg = SiteConfig.get();

    syncAnnouncementsToConfig();

    cfg.announcements.push({
      title: "New Upcoming Event",
      date: "",
      desc: "",
      image: "",
    });

    renderAnnouncementsEditor();
  });
}
