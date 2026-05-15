let draftConfig = null;

async function initAdmin() {
  await SiteConfig.load();
  draftConfig = JSON.parse(JSON.stringify(SiteConfig.get()));

  if (!SiteConfig.isAdmin()) {
    showLogin();
    return;
  }

  showDashboard();
}

function showLogin() {
  document.getElementById("admin-login").hidden = false;
  document.getElementById("admin-dashboard").hidden = true;

  document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const password = document.getElementById("admin-password").value;
    if (SiteConfig.login(password)) {
      document.getElementById("login-error").textContent = "";
      showDashboard();
    } else {
      document.getElementById("login-error").textContent = "Incorrect password.";
    }
  });
}

function showDashboard() {
  document.getElementById("admin-login").hidden = true;
  document.getElementById("admin-dashboard").hidden = false;
  populateForm();
  bindEvents();
}

function populateForm() {
  const c = draftConfig;

  document.getElementById("r101-toggle").checked = c.membershipR101Open === true;
  updateR101Status();

  document.getElementById("membership-fee-notice").value =
    c.membershipFeeNotice || "";
  document.getElementById("contact-email").value = c.contact?.email || "";
  document.getElementById("contact-facebook").value = c.contact?.facebook || "";
  document.getElementById("contact-instagram").value = c.contact?.instagram || "";
  document.getElementById("about-vision").value = c.about?.vision || "";
  document.getElementById("about-mission").value = c.about?.mission || "";
  document.getElementById("about-paragraphs-edit").value =
    (c.about?.paragraphs || []).join("\n");

  document.getElementById("hero-title").value = c.hero?.title || "";
  document.getElementById("hero-subtitle").value = c.hero?.subtitle || "";
  document.getElementById("hero-tagline").value = c.hero?.tagline || "";

  renderAnnouncementEditor();
  renderBoardEditor();
}

function updateR101Status() {
  const badge = document.getElementById("r101-status");
  const open = document.getElementById("r101-toggle").checked;
  badge.textContent = open ? "OPEN" : "CLOSED";
  badge.className = "status-badge " + (open ? "open" : "closed");
}

function renderAnnouncementEditor() {
  const container = document.getElementById("announcements-editor");
  container.innerHTML = "";

  draftConfig.announcements.forEach((a, i) => {
    const block = document.createElement("div");
    block.className = "admin-panel";
    block.style.marginBottom = "12px";
    block.innerHTML = `
      <label>Title</label>
      <input type="text" data-ann-title="${i}" value="${escapeAttr(a.title)}">
      <label>Date</label>
      <input type="text" data-ann-date="${i}" value="${escapeAttr(a.date)}">
      <label>Image filename (e.g. img1.jpg)</label>
      <input type="text" data-ann-image="${i}" value="${escapeAttr(a.image || "")}">
      <label>Description</label>
      <textarea rows="3" data-ann-desc="${i}">${escapeAttr(a.desc)}</textarea>
      <button type="button" class="btn" data-remove-ann="${i}" style="margin-top:8px;background:#444;color:#fff;">Remove</button>
    `;
    container.appendChild(block);
  });

  container.querySelectorAll("[data-ann-title]").forEach((el) => {
    el.addEventListener("input", () => syncAnnouncementsFromDom());
  });
  container.querySelectorAll("[data-ann-date]").forEach((el) => {
    el.addEventListener("input", () => syncAnnouncementsFromDom());
  });
  container.querySelectorAll("[data-ann-desc], [data-ann-image]").forEach((el) => {
    el.addEventListener("input", () => syncAnnouncementsFromDom());
  });
  container.querySelectorAll("[data-remove-ann]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = Number(btn.getAttribute("data-remove-ann"));
      draftConfig.announcements.splice(i, 1);
      renderAnnouncementEditor();
    });
  });
}

function syncAnnouncementsFromDom() {
  const titles = document.querySelectorAll("[data-ann-title]");
  draftConfig.announcements = Array.from(titles).map((el) => {
    const i = el.getAttribute("data-ann-title");
    return {
      title: el.value,
      date: document.querySelector(`[data-ann-date="${i}"]`).value,
      image: document.querySelector(`[data-ann-image="${i}"]`)?.value || "",
      desc: document.querySelector(`[data-ann-desc="${i}"]`).value,
    };
  });
}

function renderBoardEditor() {
  const container = document.getElementById("board-editor");
  container.innerHTML = "";

  draftConfig.executiveBoard.forEach((m, i) => {
    const block = document.createElement("div");
    block.className = "admin-panel";
    block.style.marginBottom = "12px";
    block.innerHTML = `
      <label>Role</label>
      <input type="text" data-board-role="${i}" value="${escapeAttr(m.role)}">
      <label>Name</label>
      <input type="text" data-board-name="${i}" value="${escapeAttr(m.name)}">
      <button type="button" class="btn" data-remove-board="${i}" style="margin-top:8px;background:#444;color:#fff;">Remove</button>
    `;
    container.appendChild(block);
  });

  container.querySelectorAll("[data-board-role], [data-board-name]").forEach((el) => {
    el.addEventListener("input", syncBoardFromDom);
  });
  container.querySelectorAll("[data-remove-board]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = Number(btn.getAttribute("data-remove-board"));
      draftConfig.executiveBoard.splice(i, 1);
      renderBoardEditor();
    });
  });
}

function syncBoardFromDom() {
  const roles = document.querySelectorAll("[data-board-role]");
  draftConfig.executiveBoard = Array.from(roles).map((el) => {
    const i = el.getAttribute("data-board-role");
    return {
      role: el.value,
      name: document.querySelector(`[data-board-name="${i}"]`).value,
    };
  });
}

function bindEvents() {
  document.getElementById("r101-toggle").addEventListener("change", updateR101Status);
  document.getElementById("logout-btn").addEventListener("click", () => {
    SiteConfig.logout();
    location.reload();
  });

  document.getElementById("save-btn").addEventListener("click", saveConfig);
  document.getElementById("export-btn").addEventListener("click", exportConfig);
  document.getElementById("reset-btn").addEventListener("click", async () => {
    if (!confirm("Reset all admin changes and reload defaults from site-config.json?")) return;
    await SiteConfig.resetOverrides();
    location.reload();
  });

  document.getElementById("add-announcement").addEventListener("click", () => {
    syncAnnouncementsFromDom();
    draftConfig.announcements.push({ title: "New Event", date: "", desc: "", image: "" });
    renderAnnouncementEditor();
  });

  document.getElementById("add-board-member").addEventListener("click", () => {
    syncBoardFromDom();
    draftConfig.executiveBoard.push({ role: "Role", name: "Name" });
    renderBoardEditor();
  });
}

function collectFormIntoDraft() {
  syncAnnouncementsFromDom();
  syncBoardFromDom();

  draftConfig.membershipR101Open = document.getElementById("r101-toggle").checked;
  draftConfig.membershipFeeNotice = document.getElementById("membership-fee-notice").value;
  draftConfig.contact = {
    email: document.getElementById("contact-email").value,
    facebook: document.getElementById("contact-facebook").value,
    instagram: document.getElementById("contact-instagram").value,
  };
  draftConfig.hero = {
    title: document.getElementById("hero-title").value,
    subtitle: document.getElementById("hero-subtitle").value,
    tagline: document.getElementById("hero-tagline").value,
  };
  draftConfig.about = {
    vision: document.getElementById("about-vision").value,
    mission: document.getElementById("about-mission").value,
    paragraphs: document
      .getElementById("about-paragraphs-edit")
      .value.split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
  };
}

function saveConfig() {
  collectFormIntoDraft();
  SiteConfig.save(draftConfig);
  document.getElementById("save-message").textContent =
    "Saved! Changes apply in this browser immediately. Export the config file and replace data/site-config.json on your host so all visitors see the same settings.";
}

function exportConfig() {
  collectFormIntoDraft();
  const blob = new Blob([JSON.stringify(draftConfig, null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "site-config.json";
  a.click();
  URL.revokeObjectURL(a.href);
}

function escapeAttr(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

document.addEventListener("DOMContentLoaded", initAdmin);
