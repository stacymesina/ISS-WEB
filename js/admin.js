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
  const passwordInput = document.getElementById("admin-password");
  const toggleBtn = document.getElementById("toggle-password");

  if (!form) return;

  // ✅ PASSWORD TOGGLE FIX (THIS IS THE IMPORTANT PART)
  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener("click", () => {
      const isHidden = passwordInput.type === "password";
      passwordInput.type = isHidden ? "text" : "password";
      toggleBtn.textContent = isHidden ? "Hide" : "Show";
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    await SiteConfig.load();

    const password = passwordInput.value;
    const error = document.getElementById("login-error");

    const success = SiteConfig.login(password);

    if (success) {
      document.getElementById("admin-login").style.display = "none";
      document.getElementById("admin-dashboard").hidden = false;

      await initDashboard();
    } else {
      error.textContent = "Incorrect password";
    }
  });
}

/* =========================
   BOARD IMAGE
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
   BOARD + DASHBOARD
   (UNCHANGED CORE LOGIC)
========================= */

async function loadBoardEditor() {
  await SiteConfig.load();
  const cfg = SiteConfig.get();

  const container = document.getElementById("board-editor");
  if (!container) return;

  container.innerHTML = "";

  (cfg.executiveBoard || []).forEach((m) => {
    container.appendChild(createBoardMember(m.role, m.name, m.image || ""));
  });
}

function collectBoard() {
  const members = [];

  document.querySelectorAll(".board-member").forEach((row) => {
    members.push({
      role: row.querySelector(".board-role").value,
      name: row.querySelector(".board-name").value,
      image: row.querySelector(".board-preview").src
    });
  });

  return members;
}

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", initLogin);   

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

function updateUpcomingEventsStatus(isOpen) {
  const upcomingStatus = document.getElementById("upcoming-events-status");
  if (!upcomingStatus) return;
  upcomingStatus.textContent = isOpen ? "OPEN" : "CLOSED";
  upcomingStatus.classList.toggle("open", isOpen);
  upcomingStatus.classList.toggle("closed", !isOpen);
}

/* =========================
   DASHBOARD INIT
========================= */

async function initDashboard() {
  const saveBtn = document.getElementById("save-btn");
  const addBtn = document.getElementById("add-board-member");

  await SiteConfig.load();

  /* =========================
     LOAD EXISTING VALUES
  ========================= */

  (() => {
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

    // Upcoming events toggle
    const upcomingToggle = document.getElementById("upcoming-events-toggle");
    const upcomingStatus = document.getElementById("upcoming-events-status");
    if (upcomingToggle) {
      upcomingToggle.checked = cfg.upcomingEventsOpen !== false;
    }
    if (upcomingStatus) {
      updateUpcomingEventsStatus(cfg.upcomingEventsOpen !== false);
    }
    if (upcomingToggle) {
      upcomingToggle.addEventListener("change", () => {
        updateUpcomingEventsStatus(upcomingToggle.checked);
      });
    }

    // Site terms
    const siteTermsEnabled = document.getElementById("site-terms-enabled");
    if (siteTermsEnabled) {
      siteTermsEnabled.checked = cfg.siteTerms?.enabled !== false;
    }
    const siteTermsTitle = document.getElementById("site-terms-title-edit");
    if (siteTermsTitle) {
      siteTermsTitle.value = cfg.siteTerms?.title || "";
    }
    const siteTermsContent = document.getElementById("site-terms-content");
    if (siteTermsContent) {
      siteTermsContent.value = cfg.siteTerms?.content || "";
    }

    // Event registration terms
    const eventTermsTitle = document.getElementById("event-terms-title-edit");
    if (eventTermsTitle) {
      eventTermsTitle.value = cfg.eventRegistration?.termsTitle || "";
    }
    const eventTermsContent = document.getElementById("event-terms-content");
    if (eventTermsContent) {
      eventTermsContent.value = cfg.eventRegistration?.termsContent || "";
    }
    const eventFormUrl = document.getElementById("event-google-form-url");
    if (eventFormUrl) {
      eventFormUrl.value = cfg.eventRegistration?.googleFormUrl || "";
    }
  })();

  renderAnnouncementsEditor();
  bindAnnouncementAddButton();
  renderArchiveEditor();
  bindArchiveAddButton();
  loadBoardEditor();

  /* =========================
     SAVE BUTTON
  ========================= */

  if (saveBtn && saveBtn.dataset.bound !== "1") {
    saveBtn.dataset.bound = "1";
    saveBtn.addEventListener("click", () => {

      const executiveBoard = collectBoard();
      const announcements =
        typeof collectAnnouncements === "function" ? collectAnnouncements() : [];
      const eventsArchive =
        typeof collectArchive === "function" ? collectArchive() : [];

      SiteConfig.save({

        executiveBoard,
        announcements,
        eventsArchive,

        membershipR101Open:
          document.getElementById("r101-toggle")?.checked || false,

        upcomingEventsOpen:
          document.getElementById("upcoming-events-toggle")?.checked !== false,

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

        siteTerms: {
          enabled: document.getElementById("site-terms-enabled")?.checked !== false,
          title: document.getElementById("site-terms-title-edit")?.value || "",
          content: document.getElementById("site-terms-content")?.value || "",
        },

        eventRegistration: {
          termsTitle: document.getElementById("event-terms-title-edit")?.value || "",
          termsContent: document.getElementById("event-terms-content")?.value || "",
          googleFormUrl: document.getElementById("event-google-form-url")?.value || "",
        },
      });

      alert("Saved successfully!");
    });
  }

  /* =========================
     ADD MEMBER
  ========================= */

  if (addBtn && addBtn.dataset.bound !== "1") {
    addBtn.dataset.bound = "1";
    addBtn.addEventListener("click", () => {
      document
        .getElementById("board-editor")
        .appendChild(createBoardMember());
    });
  }
}

/* =========================
   EXPORT CONFIG
========================= */

const exportBtn = document.getElementById("export-btn");

if (exportBtn) {
  exportBtn.addEventListener("click", () => {

    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(
        JSON.stringify(SiteConfig.get(), null, 2)
      );

    const dl = document.createElement("a");

    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", "site-config.json");

    document.body.appendChild(dl);

    dl.click();

    dl.remove();
  });
}

/* =========================
   RESET DEFAULTS
========================= */

const resetBtn = document.getElementById("reset-btn");

if (resetBtn) {
  resetBtn.addEventListener("click", () => {

    const confirmReset = confirm(
      "Reset all local changes?"
    );

    if (!confirmReset) return;

    localStorage.clear();

    alert("Reset complete.");

    location.reload();
  });
}

/* =========================
   LOGOUT
========================= */

const logoutBtn = document.getElementById("logout-btn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {

    sessionStorage.clear();

    location.reload();
  });
}

/* =========================
   INIT
========================= */

document.addEventListener("click", (e) => {

  if (e.target.id === "toggle-password") {

    const input = document.getElementById("admin-password");

    if (!input) return;

    if (input.type === "password") {
      input.type = "text";
      e.target.textContent = "Hide";
    } else {
      input.type = "password";
      e.target.textContent = "Show";
    }
  }
});

document.addEventListener("DOMContentLoaded", initLogin);
