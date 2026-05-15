/**
 * Site configuration loader.
 * Merges data/site-config.json with optional localStorage overrides (set via admin panel).
 */
const SiteConfig = (() => {
  const STORAGE_KEY = "isnexus_site_config";
  const SESSION_KEY = "isnexus_admin_session";
  let config = null;

  async function load() {
    if (config) return config;

    let base =
      typeof SITE_DEFAULTS !== "undefined"
        ? JSON.parse(JSON.stringify(SITE_DEFAULTS))
        : {};
    try {
      const res = await fetch("data/site-config.json");
      if (res.ok) base = await res.json();
    } catch (_) {
      /* file:// or offline — keep SITE_DEFAULTS */
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        config = deepMerge(base, JSON.parse(stored));
      } catch {
        config = base;
      }
    } else {
      config = base;
    }

    return config;
  }

  // Forces a fresh reload and updates the in-memory config.
  async function refresh() {
    config = null;
    return load();
  }

  function get() {
    return config;
  }

  function save(updates) {
    config = deepMerge(config || {}, updates);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));

    // Notify other pages/tabs in the same browser session that config changed.
    // (Cross-tab sync would use the native `storage` event; this helps
    // when navigation/back-forward caching prevents reload.)
    window.dispatchEvent(new CustomEvent("isnexus:config-changed", { detail: { config } }));

    return config;
  }

  function resetOverrides() {
    localStorage.removeItem(STORAGE_KEY);
    config = null;
    return load();
  }

  function exportJson() {
    return JSON.stringify(config, null, 2);
  }

  function isAdmin() {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  }

  function login(password) {
    if (!config) return false;
    if (password === config.adminPassword) {
      sessionStorage.setItem(SESSION_KEY, "1");
      return true;
    }
    return false;
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
  }

  function deepMerge(target, source) {
    const out = { ...target };
    for (const key of Object.keys(source)) {
      if (
        source[key] &&
        typeof source[key] === "object" &&
        !Array.isArray(source[key]) &&
        target[key] &&
        typeof target[key] === "object" &&
        !Array.isArray(target[key])
      ) {
        out[key] = deepMerge(target[key], source[key]);
      } else {
        out[key] = source[key];
      }
    }
    return out;
  }

  return {
    load,
    refresh,
    get,
    save,
    resetOverrides,
    exportJson,
    isAdmin,
    login,
    logout,
    STORAGE_KEY,
  };
})();
