async function initSiteRender() {
  await SiteConfig.load();

  const cfg = SiteConfig.get();
  if (!cfg) return;

  renderExecutiveBoard(cfg);
  renderAbout(cfg);
  renderAnnouncements(cfg);
  renderEvents(cfg);
  renderEventsArchive(cfg);
}

function renderExecutiveBoard(cfg) {
  const board = document.getElementById("executive-board");
  if (!board || !cfg.executiveBoard) return;

  board.innerHTML = cfg.executiveBoard.map(m => {
    const img = m.image
      ? `<img src="${m.image}" alt="${m.role}">`
      : `<img src="default.png">`;

    return `
      <div class="member">
        ${img}
        <strong>${m.role}</strong><br>
        ${m.name}
      </div>
    `;
  }).join("");
}

function renderAbout(cfg) {
  const el = document.getElementById("about-paragraphs");
  if (!el || !cfg.about?.paragraphs) return;

  el.innerHTML = cfg.about.paragraphs
    .map(p => `<p>${p}</p>`)
    .join("");
}

function hasUpcomingEvents(cfg) {
  return (
    cfg.upcomingEventsOpen !== false &&
    Array.isArray(cfg.announcements) &&
    cfg.announcements.length > 0
  );
}

function renderAnnouncements(cfg) {
  const slider = document.getElementById("announcement-slider");
  if (!slider || !hasUpcomingEvents(cfg)) {
    if (slider) slider.innerHTML = "";
    return;
  }

  slider.innerHTML = cfg.announcements
    .map(
      (a) => `
      <div class="announcement-slide">
        <h2>${a.title}</h2>
        <p class="date">${a.date || ""}</p>
        <p>${a.desc || ""}</p>
      </div>
    `
    )
    .join("");

  if (typeof initAnnouncementSlider === "function") {
    initAnnouncementSlider(cfg.announcements.length);
  }
}

function renderEvents(cfg) {
  const el = document.getElementById("events-list");
  const noneEl = document.getElementById("upcoming-events-none");
  const activeEl = document.getElementById("upcoming-events-active");
  const showUpcoming = hasUpcomingEvents(cfg);

  if (noneEl) noneEl.hidden = showUpcoming;
  if (activeEl) activeEl.hidden = !showUpcoming;

  if (!el) return;

  if (!showUpcoming) {
    el.innerHTML = "";
    return;
  }

  el.innerHTML = cfg.announcements.map(e => {
    const img = e.image
      ? `<img class="event-image" src="${e.image}" alt="">`
      : "";
    return `
      <div class="event-card clickable">
        ${img}
        <div class="event-content">
          <h3 class="event-title">${e.title}</h3>
          <div class="event-meta">
            <span class="date">${e.date || ""}</span>
          </div>
          <p class="event-desc">${e.desc || ""}</p>
        </div>
      </div>
    `;
  }).join("");
}

function renderEventsArchive(cfg) {
  const el = document.getElementById("events-archive");
  if (!el || !cfg.eventsArchive?.length) return;

  el.innerHTML = cfg.eventsArchive.map((e) => {
    const img = e.image
      ? `<img class="event-image" src="${e.image}" alt="">`
      : "";
    return `
      <div class="event-card">
        ${img}
        <div class="event-content">
          <h3 class="event-title">${e.title}</h3>
          <p class="event-desc">${e.desc || ""}</p>
        </div>
      </div>
    `;
  }).join("");
}

document.addEventListener("DOMContentLoaded", initSiteRender);
