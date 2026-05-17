let attempts = 0;
const MAX_ATTEMPTS = 3;

function initLogin() {
  const form = document.getElementById("login-form");
  const password = document.getElementById("admin-password");
  const toggle = document.getElementById("toggle-password");
  const error = document.getElementById("login-error");
  const attemptText = document.getElementById("login-attempts");

  if (!form) return;

  // Toggle password
  toggle.onclick = () => {
    if (password.type === "password") {
      password.type = "text";
      toggle.textContent = "Hide";
    } else {
      password.type = "password";
      toggle.textContent = "Show";
    }
  };

  // Login
  form.onsubmit = async (e) => {
    e.preventDefault();

    await SiteConfig.load();

    const cfg = SiteConfig.get();
    const correctPassword = cfg.adminPassword;

    if (password.value === correctPassword) {
      document.getElementById("admin-login").style.display = "none";
      document.getElementById("admin-dashboard").hidden = false;

      error.textContent = "";
      attemptText.textContent = "";

      return;
    }

    // WRONG PASSWORD
    attempts++;

    const remaining = MAX_ATTEMPTS - attempts;

    if (remaining > 0) {
      error.textContent = "Wrong password.";
      attemptText.textContent = `You have ${remaining} attempt(s) left.`;
    } else {
      error.textContent = "Too many failed attempts.";

      attemptText.textContent =
        "Access locked. Admin has been notified (backend required).";

      form.querySelector("button[type='submit']").disabled = true;

      // OPTIONAL backend hook
      notifyBackend();
    }
  };

  // logout
  document.getElementById("logout-btn")?.addEventListener("click", () => {
    location.reload();
  });
}

// placeholder for backend alert
function notifyBackend() {
  console.log("Would notify ISS email here (requires Node.js backend)");
}

document.addEventListener("DOMContentLoaded", initLogin);
