function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* =========================
   BOARD EDITOR INIT
========================= */

function createBoardMember(role = "", name = "", image = "") {
  const div = document.createElement("div");
  div.className = "board-member";

  div.innerHTML = `
    <label>Role</label>
    <input class="board-role" value="${role}">

    <label>Name</label>
    <input class="board-name" value="${name}">

    <label>Image</label>
    <input type="file" class="board-image">

    <img class="board-preview" src="${image}" style="width:60px;height:60px;border-radius:50%;margin-top:8px;">
  `;

  const fileInput = div.querySelector(".board-image");
  const preview = div.querySelector(".board-preview");

  fileInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const base64 = await fileToBase64(file);
    preview.src = base64;
    div.dataset.image = base64;
  });

  return div;
}

/* =========================
   LOAD BOARD
========================= */

async function loadBoardEditor() {
  await SiteConfig.load();
  const cfg = SiteConfig.get();

  const container = document.getElementById("board-editor");
  if (!container) return;

  container.innerHTML = "";

  (cfg.executiveBoard || []).forEach(m => {
    const el = createBoardMember(m.role, m.name, m.image);
    container.appendChild(el);
  });
}

/* =========================
   SAVE BOARD
========================= */

function collectBoard() {
  const members = [];

  document.querySelectorAll(".board-member").forEach(row => {
    const role = row.querySelector(".board-role").value;
    const name = row.querySelector(".board-name").value;
    const image = row.querySelector(".board-preview").src;

    members.push({ role, name, image });
  });

  return members;
}

/* =========================
   SAVE BUTTON
========================= */

document.getElementById("save-btn").addEventListener("click", () => {
  const executiveBoard = collectBoard();

  SiteConfig.save({ executiveBoard });

  alert("Saved!");
});

/* =========================
   ADD MEMBER BUTTON
========================= */

document.getElementById("add-board-member").addEventListener("click", () => {
  document.getElementById("board-editor")
    .appendChild(createBoardMember());
});

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", loadBoardEditor);
