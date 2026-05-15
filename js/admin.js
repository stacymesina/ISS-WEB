/* =========================
   IMAGE UTIL
========================= */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* =========================
   LOGIN
========================= */
function initLogin() {
  const form = document.getElementById("login-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    await SiteConfig.load();

    const password = document.getElementById("admin-password").value;
    const error = document.getElementById("login-error");

    const success = SiteConfig.login(password);

    if (success) {
      document.getElementById("admin-login").style.display = "none";
      document.getElementById("admin-dashboard").hidden = false;

      initDashboard();
    } else {
      error.textContent = "Incorrect password";
    }
  });
}

/* =========================
   BOARD (RESTORED LOGIC + IMAGE ONLY ADDITION)
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
    <input type="file" class="board-image" accept="image/*">

    <img class="board-preview" src="${image || ""}" 
      style="width:60px;height:60px;border-radius:50%;margin-top:8px;">
  `;

  const fileInput = div.querySelector(".board-image");
  const preview = div.querySelector(".board-preview");

  fileInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const base64 = await fileToBase64(file);
    preview.src = base64;
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

  (cfg.executiveBoard || []).forEach((m) => {
    container.appendChild(
      createBoardMember(m.role, m.name, m.image || "")
    );
  });
}

/* =========================
   COLLECT BOARD
========================= */

function collectBoard() {
  const members = [];

  document.querySelectorAll(".board-member").forEach((row) => {
    const role = row.querySelector(".board-role").value;
    const name = row.querySelector(".board-name").value;
    const image = row.querySelector(".board-preview").src;

    members.push({ role, name, image });
  });

  return members;
}

/* =========================
   DASHBOARD INIT
========================= */

function initDashboard() {
  const saveBtn = document.getElementById("save-btn");
  const addBtn = document.getElementById("add-board-member");

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const executiveBoard = collectBoard();
      SiteConfig.save({ executiveBoard });
      alert("Saved successfully!");
    });
  }

  if (addBtn) {
    addBtn.addEventListener("click", () => {
      document.getElementById("board-editor")
        .appendChild(createBoardMember());
    });
  }

  loadBoardEditor();
}

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", initLogin);
