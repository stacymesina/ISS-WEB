async function initSiteRender() {
  await SiteConfig.load();

  const cfg = SiteConfig.get();
  if (!cfg) return;

  renderExecutiveBoard(cfg);
  renderAbout(cfg);
  renderEvents(cfg);
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

function renderEvents(cfg) {
  const el = document.getElementById("events-list");
  if (!el || !cfg.announcements) return;

  el.innerHTML = cfg.announcements.map(e => {
    return `
      <div class="event-card">
        ${e.image ? `<img src="${e.image}">` : ""}
        <h3>${e.title}</h3>
        <p>${e.desc}</p>
      </div>
    `;
  }).join("");
}

document.addEventListener("DOMContentLoaded", initSiteRender);
