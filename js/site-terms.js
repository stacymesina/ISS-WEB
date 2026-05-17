/**
 * Site-wide terms and conditions popup (shown once per browser until accepted).
 */
(function () {
  const STORAGE_KEY = "isnexus_site_terms_accepted";

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

  function showSiteTermsModal(terms) {
    const overlay = document.getElementById("site-terms-overlay");
    const body = document.getElementById("site-terms-body");
    const title = document.getElementById("site-terms-title");
    const acceptBtn = document.getElementById("site-terms-accept");

    if (!overlay || !body) return;

    if (title) title.textContent = terms.title || "Terms and Conditions";
    body.innerHTML = paragraphsToHtml(terms.content);

    overlay.classList.add("show");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    if (acceptBtn) {
      acceptBtn.onclick = () => {
        localStorage.setItem(STORAGE_KEY, "1");
        overlay.classList.remove("show");
        overlay.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      };
    }
  }

  async function initSiteTerms() {
    if (localStorage.getItem(STORAGE_KEY) === "1") return;

    if (typeof SiteConfig === "undefined") return;

    await SiteConfig.load();
    const cfg = SiteConfig.get();
    const terms = cfg?.siteTerms;

    if (!terms || terms.enabled === false) return;

    showSiteTermsModal(terms);
  }

  document.addEventListener("DOMContentLoaded", initSiteTerms);
})();
