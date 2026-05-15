const SiteConfig = (() => {
  const STORAGE_KEY = "isnexus_site_config";
  const SESSION_KEY = "isnexus_admin_session";
  let config = null;

  async function load() {
  if (config) return config;

  let base = typeof SITE_DEFAULTS !== "undefined"
    ? JSON.parse(JSON.stringify(SITE_DEFAULTS))
    : {};

  try {
    const res = await fetch("data/site-config.json");
    if (res.ok) {
      const json = await res.json();
      base = deepMerge(base, json);
    }
  } catch (_) {}

  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored) {
    try {
      base = deepMerge(base, JSON.parse(stored));
    } catch {}
  }

  config = base;

  return config;
}

  function get() {
    return config;
  }

  function save(updates) {
    config = deepMerge(config || {}, updates);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    return config;
  }

  function login(password) {
  if (!config) return false;
  return password === config.adminPassword;
}

  function isAdmin() {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  }

  function deepMerge(target, source) {
    const out = { ...target };

    for (const key of Object.keys(source)) {
      if (
        source[key] &&
        typeof source[key] === "object" &&
        !Array.isArray(source[key]) &&
        target[key] &&
        typeof target[key] === "object"
      ) {
        out[key] = deepMerge(target[key], source[key]);
      } else {
        out[key] = source[key];
      }
    }

    return out;
  }

  return { load, get, save, isAdmin, login };
})();
