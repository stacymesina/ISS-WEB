// Event Archive editor (WITH IMAGE UPLOAD FIXED)

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

function renderArchiveEditor() {
  const container = document.getElementById("events-archive-editor");
  if (!container) return;

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

      <label>Image</label>
      <input type="file" data-arc-file="${i}" accept="image/*">

      <img data-arc-preview="${i}" src="${a.image || ""}"
        style="width:120px;margin-top:8px;border-radius:8px;display:block;">
    `;

    container.appendChild(block);
  });

  // IMAGE HANDLER
  container.querySelectorAll("[data-arc-file]").forEach((input) => {
    input.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const base64 = await fileToBase64(file);
      const i = input.getAttribute("data-arc-file");

      const preview = container.querySelector(`[data-arc-preview="${i}"]`);
      if (preview) {
        preview.src = base64;
        preview.dataset.image = base64;
      }
    });
  });
}

function collectArchive() {
  const titles = document.querySelectorAll("[data-arc-title]");

  return Array.from(titles).map((el) => {
    const i = el.getAttribute("data-arc-title");

    return {
      title: el.value,
      desc: document.querySelector(`[data-arc-desc="${i}"]`)?.value || "",
      image:
        document.querySelector(`[data-arc-preview="${i}"]`)?.dataset.image ||
        ""
    };
  });
}

function bindArchiveAddButton() {
  const btn = document.getElementById("add-archive-event");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const cfg = SiteConfig.get();

    cfg.eventsArchive.push({
      title: "New Archive Event",
      desc: "",
      image: ""
    });

    renderArchiveEditor();
  });
}
