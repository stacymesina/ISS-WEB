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
  renderExecutiveBoard(cfg);
  updateMembershipNav(cfg);
  highlightAdminNav();
}

function highlightAdminNav() {
  if (SiteConfig.isAdmin()) {
    document.querySelectorAll(".staff-access").forEach((el) => {
      el.classList.add("staff-access-active");
      const link = el.querySelector("a");
      if (link) link.textContent = "Editor (signed in)";
    });
  }
}

function renderEventsList(cfg) {
  const list = document.getElementById("events-list");
  if (!list || !cfg.announcements) return;

  list.innerHTML = cfg.announcements
    .map(
      (e) => `
    <article class="event-card">
      <h3>${escapeHtml(e.title)}</h3>
      <p class="event-date">${escapeHtml(e.date)}</p>
      <p class="event-desc">${escapeHtml(e.desc)}</p>
    </article>
  `
    )
    .join("");
}

function renderAboutParagraphs(cfg) {
  const container = document.getElementById("about-paragraphs");
  if (!container || !cfg.about?.paragraphs) return;

  container.innerHTML = cfg.about.paragraphs
    .map((p) => `<p style="margin-top:1rem">${escapeHtml(p)}</p>`)
    .join("");
  if (container.firstElementChild) {
    container.firstElementChild.style.marginTop = "0";
  }
}

function getByPath(obj, path) {
  return path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);
}

function renderAnnouncements(cfg) {
  const slider = document.getElementById("announcement-slider");
  if (!slider || !cfg.announcements) return;

  slider.innerHTML = "";
  cfg.announcements.forEach((a) => {
    const slide = document.createElement("div");
    slide.className = "announcement-slide";
    slide.innerHTML = `
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

function renderExecutiveBoard(cfg) {
  const board = document.getElementById("executive-board");
  if (!board || !cfg.executiveBoard) return;

  board.innerHTML = cfg.executiveBoard
    .map(
      (m) => `
    <div class="member">
      <strong>${escapeHtml(m.role)}</strong><br>${escapeHtml(m.name)}
    </div>
  `
    )
    .join("");
}

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

function escapeHtml(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

document.addEventListener("DOMContentLoaded", initSiteRender);
