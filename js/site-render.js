/**
 * Applies editable site content from SiteConfig to pages with data-site-* hooks.
 */
async function initSiteRender() {
  await SiteConfig.load();

  const cfg = SiteConfig.get();
  if (!cfg) return;

  document.querySelectorAll("[data-site]").forEach((el) => {
    const path = el.getAttribute("data-site");
    const value = getByPath(cfg, path);

    if (value === undefined || value === null) return;

    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
      el.value = value;
    } else {
      el.textContent = value;
    }
  });

  renderAboutParagraphs(cfg);
  renderAnnouncements(cfg);
  renderEventsList(cfg);
  renderEventsArchive(cfg);
  renderExecutiveBoard(cfg);

  updateMembershipNav(cfg);
  highlightAdminNav();
}

/* =========================
   NAV / ADMIN
========================= */

function highlightAdminNav() {
  if (SiteConfig.isAdmin()) {
    document.querySelectorAll(".staff-access").forEach((el) => {
      el.classList.add("staff-access-active");
      const link = el.querySelector("a");
      if (link) link.textContent = "Editor (signed in)";
    });
  }
}

/* =========================
   EVENTS
========================= */

function renderEventsList(cfg) {
  const list = document.getElementById("events-list");
  if (!list || !cfg.announcements) return;

  list.innerHTML = cfg.announcements.map((e) => {
    const img = e.image
      ? `<img class="event-card-img" src="${escapeHtml(e.image)}" alt="${escapeHtml(e.title)}">`
      : "";

    return `
      <article class="event-card clickable">
        ${img}
        <h3>${escapeHtml(e.title)}</h3>
        <p class="event-date">${escapeHtml(e.date)}</p>
        <p class="event-desc">${escapeHtml(e.desc)}</p>
      </article>
    `;
  }).join("");
}

function renderEventsArchive(cfg) {
  const archive = document.getElementById("events-archive");
  if (!archive) return;

  const list = cfg.eventsArchive;
  if (!Array.isArray(list) || list.length === 0) return;

  archive.innerHTML = list.map((e) => {
    const img = e.image
      ? `<img class="event-card-img" src="${escapeHtml(e.image)}" alt="${escapeHtml(e.title)}">`
      : "";

    return `
      <article class="event-card">
        ${img}
        <h3>${escapeHtml(e.title)}</h3>
        <p class="event-desc">${escapeHtml(e.desc)}</p>
      </article>
    `;
  }).join("");
}

/* =========================
   ABOUT
========================= */

function renderAboutParagraphs(cfg) {
  const container = document.getElementById("about-paragraphs");
  if (!container || !cfg.about?.paragraphs) return;

  container.innerHTML = cfg.about.paragraphs
    .map((p, i) => `<p style="margin-top:${i === 0 ? "0" : "1rem"}">${escapeHtml(p)}</p>`)
    .join("");
}

/* =========================
   ANNOUNCEMENTS
========================= */

function renderAnnouncements(cfg) {
  const slider = document.getElementById("announcement-slider");
  if (!slider || !cfg.announcements) return;

  slider.innerHTML = "";

  cfg.announcements.forEach((a) => {
    const slide = document.createElement("div");
    slide.className = "announcement-slide";

    const img = a.image
      ? `<img class="announcement-img" src="${escapeHtml(a.image)}" alt="${escapeHtml(a.title)}">`
      : "";

    slide.innerHTML = `
      ${img}
      <h2>${escapeHtml(a.title)}</h2>
      <p class="date">${escapeHtml(a.date)}</p>
      <p>${escapeHtml(a.desc)}</p>
    `;

    slider.appendChild(slide);
  });

  if (typeof initAnnouncementSlider === "function") {
    initAnnouncementSlider(cfg.announcements.length);
  }
}

/* =========================
   EXECUTIVE BOARD (FIXED)
========================= */

function renderExecutiveBoard(cfg) {
  const board = document.getElementById("executive-board");
  if (!board || !cfg.executiveBoard) return;

  board.innerHTML = cfg.executiveBoard.map((m) => {
    const image = m.image
      ? `<img src="${escapeHtml(m.image)}" alt="${escapeHtml(m.role)}">`
      : `<img src="images/default-profile.png" alt="default">`;

    return `
      <div class="member">
        ${image}
        <strong>${escapeHtml(m.role)}</strong>
        ${escapeHtml(m.name)}
      </div>
    `;
  }).join("");
}

/* =========================
   NAV STATE
========================= */

function updateMembershipNav(cfg) {
  document.querySelectorAll('a[href="membership.html"]').forEach((link) => {
    if (cfg.membershipR101Open) {
      link.classList.remove("nav-closed");
      link.removeAttribute("title");
    } else {
      link.classList.add("nav-closed");
      link.title = "Applications open during R101 only";
    }
  });
}

/* =========================
   HELPERS
========================= */

function getByPath(obj, path) {
  return path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", initSiteRender);
