function escapeAttr(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function syncArchiveToConfig() {
  const cfg = SiteConfig.get();
  if (!cfg) return;
  cfg.eventsArchive = collectArchive();
}

function renderArchiveEditor() {

  const container = document.getElementById("events-archive-editor");

  if (!container) return;

  const cfg = SiteConfig.get();

  if (!Array.isArray(cfg.eventsArchive)) {
    cfg.eventsArchive = [];
  }

  container.innerHTML = "";

  cfg.eventsArchive.forEach((a, i) => {

    const block = document.createElement("div");

    block.className = "admin-panel";

    block.innerHTML = `
      <h2 style="margin-bottom:10px;">
        Archive Event #${i + 1}
      </h2>

      <label>Title</label>
      <input type="text" data-arc-title="${i}" value="${escapeAttr(a.title)}">

      <label>Description</label>
      <textarea rows="3" data-arc-desc="${i}">${escapeAttr(a.desc || "")}</textarea>

      <label>Archive Image</label>
      <input type="file" class="archive-image" accept="image/*">

      <img
        src="${a.image || ""}"
        class="archive-preview"
        style="width:100%;max-width:260px;border-radius:10px;margin-top:10px;border:1px solid var(--primary);"
      >

      <button
        type="button"
        class="btn"
        data-remove-arc="${i}"
        style="margin-top:12px;background:#444;color:#fff;"
      >
        Remove
      </button>
    `;

    container.appendChild(block);

    const fileInput = block.querySelector(".archive-image");
    const preview = block.querySelector(".archive-preview");

    fileInput.addEventListener("change", async (e) => {

      const file = e.target.files[0];

      if (!file) return;

      const base64 = await fileToBase64(file);

      preview.src = base64;
    });
  });

  container.querySelectorAll("[data-remove-arc]").forEach((btn) => {

    btn.addEventListener("click", () => {

      syncArchiveToConfig();

      const cfg = SiteConfig.get();

      const i = Number(btn.dataset.removeArc);

      cfg.eventsArchive.splice(i, 1);

      renderArchiveEditor();
    });
  });
}

function collectArchive() {

  const titles = document.querySelectorAll("[data-arc-title]");

  return Array.from(titles).map((el) => {

    const block = el.closest(".admin-panel");

    const i = el.dataset.arcTitle;

    return {
      title: el.value.trim(),
      desc: document.querySelector(`[data-arc-desc="${i}"]`)?.value.trim() || "",
      image: block.querySelector(".archive-preview")?.src || "",
    };
  });
}

function bindArchiveAddButton() {

  const addBtn = document.getElementById("add-archive-event");

  if (!addBtn || addBtn.dataset.bound === "1") return;

  addBtn.dataset.bound = "1";

  addBtn.addEventListener("click", () => {

    const cfg = SiteConfig.get();

    syncArchiveToConfig();

    cfg.eventsArchive.push({
      title: "New Archive Event",
      desc: "",
      image: "",
    });

    renderArchiveEditor();
  });
}
