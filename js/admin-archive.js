// Archive editor helpers for admin.html (events archive)
// Loaded by js/admin.js via global functions (admin.js will call renderArchiveEditor())

function renderArchiveEditor() {
  const container = document.getElementById("events-archive-editor");
  if (!container) return;
  container.innerHTML = "";

  if (!window.draftConfig) return;

  (draftConfig.eventsArchive || []).forEach((a, i) => {
    const block = document.createElement("div");
    block.className = "admin-panel";
    block.style.marginBottom = "12px";
    block.innerHTML = `
      <h2 style="margin-bottom:10px;">Archive Event #${i + 1}</h2>

      <label>Title</label>
      <input type="text" data-arc-title="${i}" value="${escapeAttr(a.title)}">

      <label>Description</label>
      <textarea rows="3" data-arc-desc="${i}">${escapeAttr(a.desc)}</textarea>

      <label>Image filename / path</label>
      <input type="text" data-arc-image="${i}" value="${escapeAttr(a.image || "")}" placeholder="pastEvent1.jpg">

      <button type="button" class="btn" data-remove-arc="${i}" style="margin-top:8px;background:#444;color:#fff;">Remove</button>
    `;

    container.appendChild(block);
  });

  container.querySelectorAll("[data-arc-title]").forEach((el) => {
    el.addEventListener("input", () => syncArchiveFromDom());
  });
  container.querySelectorAll("[data-arc-desc]").forEach((el) => {
    el.addEventListener("input", () => syncArchiveFromDom());
  });
  container.querySelectorAll("[data-arc-image]").forEach((el) => {
    el.addEventListener("input", () => syncArchiveFromDom());
  });

  container.querySelectorAll("[data-remove-arc]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = Number(btn.getAttribute("data-remove-arc"));
      draftConfig.eventsArchive.splice(i, 1);
      renderArchiveEditor();
    });
  });
}

function syncArchiveFromDom() {
  const titles = document.querySelectorAll("[data-arc-title]");
  const next = Array.from(titles).map((el) => {
    const i = el.getAttribute("data-arc-title");
    return {
      title: el.value,
      desc: document.querySelector(`[data-arc-desc="${i}"]`)?.value || "",
      image: document.querySelector(`[data-arc-image="${i}"]`)?.value || "",
    };
  });

  draftConfig.eventsArchive = next;
}

function bindArchiveAddButton() {
  const addBtn = document.getElementById("add-archive-event");
  if (!addBtn) return;

  addBtn.addEventListener("click", () => {
    if (!Array.isArray(draftConfig.eventsArchive)) draftConfig.eventsArchive = [];
    syncArchiveFromDom();
    draftConfig.eventsArchive.push({ title: "New Archive Event", desc: "", image: "" });
    renderArchiveEditor();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // If admin.js hasn't called renderArchiveEditor yet, it will soon.
  bindArchiveAddButton();
});

