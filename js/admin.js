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

  /* =========================
     LOAD EXISTING VALUES
  ========================= */

  SiteConfig.load().then(() => {
    const cfg = SiteConfig.get();

    // Membership
    const membershipNotice = document.getElementById("membership-fee-notice");
    if (membershipNotice) {
      membershipNotice.value = cfg.membershipFeeNotice || "";
    }

    // About
    const vision = document.getElementById("about-vision");
    if (vision) {
      vision.value = cfg.about?.vision || "";
    }

    const mission = document.getElementById("about-mission");
    if (mission) {
      mission.value = cfg.about?.mission || "";
    }

    const paragraphs = document.getElementById("about-paragraphs-edit");
    if (paragraphs) {
      paragraphs.value = (cfg.about?.paragraphs || []).join("\n");
    }

    // Hero
    const heroTitle = document.getElementById("hero-title");
    if (heroTitle) {
      heroTitle.value = cfg.hero?.title || "";
    }

    const heroSubtitle = document.getElementById("hero-subtitle");
    if (heroSubtitle) {
      heroSubtitle.value = cfg.hero?.subtitle || "";
    }

    const heroTagline = document.getElementById("hero-tagline");
    if (heroTagline) {
      heroTagline.value = cfg.hero?.tagline || "";
    }

    // Contact
    const email = document.getElementById("contact-email");
    if (email) {
      email.value = cfg.contact?.email || "";
    }

    const facebook = document.getElementById("contact-facebook");
    if (facebook) {
      facebook.value = cfg.contact?.facebook || "";
    }

    const instagram = document.getElementById("contact-instagram");
    if (instagram) {
      instagram.value = cfg.contact?.instagram || "";
    }

    // R101 toggle
    const r101Toggle = document.getElementById("r101-toggle");
    if (r101Toggle) {
      r101Toggle.checked = !!cfg.membershipR101Open;
    }
  });

  /* =========================
     SAVE BUTTON
  ========================= */

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {

      const executiveBoard = collectBoard();

      SiteConfig.save({

        executiveBoard,

        membershipR101Open:
          document.getElementById("r101-toggle")?.checked || false,

        membershipFeeNotice:
          document.getElementById("membership-fee-notice")?.value || "",

        hero: {
          title:
            document.getElementById("hero-title")?.value || "",

          subtitle:
            document.getElementById("hero-subtitle")?.value || "",

          tagline:
            document.getElementById("hero-tagline")?.value || "",
        },

        contact: {
          email:
            document.getElementById("contact-email")?.value || "",

          facebook:
            document.getElementById("contact-facebook")?.value || "",

          instagram:
            document.getElementById("contact-instagram")?.value || "",
        },

        about: {
          vision:
            document.getElementById("about-vision")?.value || "",

          mission:
            document.getElementById("about-mission")?.value || "",

          paragraphs:
            document.getElementById("about-paragraphs-edit")
              ?.value
              .split("\n")
              .filter(Boolean) || [],
        },
      });

      alert("Saved successfully!");
    });
  }

  /* =========================
     ADD MEMBER
  ========================= */

  if (addBtn) {
    addBtn.addEventListener("click", () => {
      document
        .getElementById("board-editor")
        .appendChild(createBoardMember());
    });
  }

  /* =========================
     LOAD BOARD
  ========================= */

  loadBoardEditor();
}

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", initLogin);
