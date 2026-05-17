/**
 * Event registration: terms modal with Google Form link (events page).
 */
(function () {
  let pendingFormUrl = "";

  function paragraphsToHtml(text) {
    if (!text) return "";
    return text
      .split(/\n\n+|\n/)
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => `<p>${escapeHtml(p)}</p>`)
      .join("");
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function getEventFormUrl(cfg, eventTitle) {
    const announcements = cfg.announcements || [];
    const match = announcements.find(
      (e) => e.title && eventTitle && e.title.trim() === eventTitle.trim()
    );
    if (match?.registrationFormUrl) return match.registrationFormUrl;

    return cfg.eventRegistration?.googleFormUrl || "";
  }

  function openEventTermsModal(cfg, eventTitle) {
    const reg = cfg.eventRegistration || {};
    const overlay = document.getElementById("event-terms-overlay");
    const body = document.getElementById("event-terms-body");
    const titleEl = document.getElementById("event-terms-title");
    const linkWrap = document.getElementById("event-terms-form-link");
    const linkEl = document.getElementById("event-terms-form-anchor");
    const checkbox = document.getElementById("event-terms-agree");
    const proceedBtn = document.getElementById("event-terms-proceed");

    if (!overlay || !body) return;

    pendingFormUrl = getEventFormUrl(cfg, eventTitle);

    if (titleEl) {
      titleEl.textContent = reg.termsTitle || "Event Registration — Terms and Conditions";
    }

    body.innerHTML = paragraphsToHtml(reg.termsContent);

    if (linkWrap && linkEl) {
      if (pendingFormUrl) {
        linkWrap.hidden = false;
        linkEl.href = pendingFormUrl;
        linkEl.textContent = "Open registration form";
      } else {
        linkWrap.hidden = true;
        linkEl.removeAttribute("href");
      }
    }

    if (checkbox) checkbox.checked = false;
    if (proceedBtn) proceedBtn.disabled = true;

    overlay.classList.add("show");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeEventTermsModal() {
    const overlay = document.getElementById("event-terms-overlay");
    if (!overlay) return;
    overlay.classList.remove("show");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function wireEventTermsModal() {
    const overlay = document.getElementById("event-terms-overlay");
    const closeBtn = document.getElementById("event-terms-close");
    const cancelBtn = document.getElementById("event-terms-cancel");
    const checkbox = document.getElementById("event-terms-agree");
    const proceedBtn = document.getElementById("event-terms-proceed");

    if (checkbox && proceedBtn) {
      checkbox.addEventListener("change", () => {
        proceedBtn.disabled = !checkbox.checked || !pendingFormUrl;
      });
    }

    if (proceedBtn) {
      proceedBtn.addEventListener("click", () => {
        if (!checkbox?.checked || !pendingFormUrl) return;
        window.open(pendingFormUrl, "_blank", "noopener,noreferrer");
        closeEventTermsModal();
      });
    }

    closeBtn?.addEventListener("click", closeEventTermsModal);
    cancelBtn?.addEventListener("click", closeEventTermsModal);

    overlay?.addEventListener("click", (e) => {
      if (e.target === overlay) closeEventTermsModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay?.classList.contains("show")) {
        closeEventTermsModal();
      }
    });
  }

  function wireRegistrationTriggers(cfg) {
    const openBtn = document.getElementById("openRegisterModal");
    const openFromTitle = document.getElementById("openRegisterFromTitle");

    function openRegistration() {
      openEventTermsModal(cfg, "");
    }

    openBtn?.addEventListener("click", openRegistration);
    openFromTitle?.addEventListener("click", (e) => {
      e.preventDefault();
      openRegistration();
    });

    document.getElementById("events-list")?.addEventListener("click", (e) => {
      const card = e.target.closest(".event-card.clickable");
      if (!card) return;
      const titleEl = card.querySelector(".event-title");
      openEventTermsModal(cfg, titleEl?.textContent?.trim() || "");
    });
  }

  async function initEventRegistration() {
    if (typeof SiteConfig === "undefined") return;

    await SiteConfig.load();
    const cfg = SiteConfig.get();
    if (!cfg) return;

    wireEventTermsModal();
    wireRegistrationTriggers(cfg);
  }

  document.addEventListener("DOMContentLoaded", initEventRegistration);
})();
