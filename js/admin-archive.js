// Archive editor helpers for admin.html (events archive)

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
  if (!container || typeof SiteConfig === "undefined") return;

  const cfg = SiteConfig.get();
  if (!cfg) return;

  if (!Array.isArray(cfg.eventsArchive)) cfg.eventsArchive = [];

  container.innerHTML = "";

  cfg.eventsArchive.forEach((a, i) => {
    const block = document.createElement("div");
    block.className = "admin-panel";
    block.style.marginBottom = "12px";
    block.innerHTML = `
      <h2 style="margin-bottom:10px;">Archive Event #${i + 1}</h2>

      <label>Title</label>
      <input type="text" data-arc-title="${i}" value="${escapeAttr(a.title)}">

      <label>Description</label>
      <textarea rows="3" data-arc-desc="${i}">${escapeAttr(a.desc || "")}</textarea>

      <label>Image filename / path</label>
      <input type="text" data-arc-image="${i}" value="${escapeAttr(a.image || "")}" placeholder="pastEvent1.jpg">

      <button type="button" class="btn" data-remove-arc="${i}" style="margin-top:8px;background:#444;color:#fff;">Remove</button>
    `;

    container.appendChild(block);
  });

  container.querySelectorAll("[data-remove-arc]").forEach((btn) => {
    btn.addEventListener("click", () => {
      syncArchiveToConfig();
      const cfg = SiteConfig.get();
      if (!cfg?.eventsArchive) return;
      const i = Number(btn.getAttribute("data-remove-arc"));
      cfg.eventsArchive.splice(i, 1);
      renderArchiveEditor();
    });
  });
}

function collectArchive() {
  const titles = document.querySelectorAll("[data-arc-title]");
  return Array.from(titles).map((el) => {
    const i = el.getAttribute("data-arc-title");
    return {
      title: el.value.trim(),
      desc: document.querySelector(`[data-arc-desc="${i}"]`)?.value.trim() || "",
      image: document.querySelector(`[data-arc-image="${i}"]`)?.value.trim() || "",
    };
  });
}

function bindArchiveAddButton() {
  const addBtn = document.getElementById("add-archive-event");
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

    syncArchiveToConfig();

    if (!Array.isArray(cfg.eventsArchive)) cfg.eventsArchive = [];

    cfg.eventsArchive.push({ title: "New Archive Event", desc: "", image: "" });
    renderArchiveEditor();
  });
}
