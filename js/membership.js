const committeeData = {
  president: ["Productions Committee", "Technical Operations Committee", "Talents Committee"],
  ivp: ["Internal Partnerships Committee", "Community Development Committee"],
  evp: ["Sponsorships Committee", "Partnerships Committee"],
  secretary: ["Academics Committee", "Documents Committee"],
  treasurer: ["Finance Committee"],
  auditor: ["Audit and Logistics Committee"],
  pro: ["Creatives Committee", "Video Contents Committee", "Documentation Committee"],
  cos: ["Student Relations Committee"],
};

const NAME_PATTERN = /^[A-Za-z\s.,]+$/;
const UST_EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@ust\.edu\.ph$/i;

function updateCommittees() {
  const team = document.getElementById("team").value;
  const committee = document.getElementById("committee");

  committee.innerHTML = '<option value="" disabled selected hidden>Committee</option>';

  if (committeeData[team]) {
    committeeData[team].forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      committee.appendChild(opt);
    });
  }
}

function toggleRole() {
  const role = document.getElementById("role").value;
  const team = document.getElementById("team");
  const committee = document.getElementById("committee");

  if (role === "member") {
    team.disabled = true;
    committee.disabled = true;
    team.removeAttribute("required");
    committee.removeAttribute("required");
  } else {
    team.disabled = false;
    committee.disabled = false;
    team.setAttribute("required", "");
    committee.setAttribute("required", "");
  }
}

function showFieldError(input, message) {
  const id = input.id + "-error";
  let err = document.getElementById(id);
  if (!err) {
    err = document.createElement("p");
    err.id = id;
    err.className = "field-error";
    input.insertAdjacentElement("afterend", err);
  }
  err.textContent = message;
  input.setAttribute("aria-invalid", "true");
}

function clearFieldError(input) {
  const err = document.getElementById(input.id + "-error");
  if (err) err.remove();
  input.removeAttribute("aria-invalid");
}

function validateFullName(input) {
  const value = input.value.trim();
  if (!value) {
    showFieldError(input, "Full name is required.");
    return false;
  }
  if (value.length < 2) {
    showFieldError(input, "Please enter your full name.");
    return false;
  }
  if (!NAME_PATTERN.test(value)) {
    showFieldError(
      input,
      "Use letters only, with spaces, periods (.), and commas (,) — e.g. Juan Dela Cruz or Maria A. Santos, Jr."
    );
    return false;
  }
  clearFieldError(input);
  return true;
}

function validateEmail(input) {
  const value = input.value.trim();
  if (!value) {
    showFieldError(input, "Email is required.");
    return false;
  }
  if (!UST_EMAIL_PATTERN.test(value)) {
    showFieldError(input, "Enter your UST email ending in @ust.edu.ph (e.g. juan.delacruz@ust.edu.ph).");
    return false;
  }
  clearFieldError(input);
  return true;
}

function restrictNameInput(e) {
  const allowed = /[A-Za-z\s.,]/;
  if (e.key.length === 1 && !allowed.test(e.key) && !e.ctrlKey && !e.metaKey) {
    e.preventDefault();
  }
}

async function initMembershipPage() {
  await SiteConfig.load();
  const cfg = SiteConfig.get();

  const closedEl = document.getElementById("membership-closed");
  const openEl = document.getElementById("membership-open");
  const feeNotice = document.getElementById("fee-notice");
  const periodLabel = document.getElementById("period-label");

  if (periodLabel && cfg.membershipPeriodLabel) {
    periodLabel.textContent = cfg.membershipPeriodLabel;
  }

  if (feeNotice && cfg.membershipFeeNotice) {
    feeNotice.textContent = cfg.membershipFeeNotice;
  }

  const isOpen = cfg.membershipR101Open === true;

  if (isOpen) {
    closedEl.hidden = true;
    openEl.hidden = false;
    setupFormValidation();
  } else {
    closedEl.hidden = false;
    openEl.hidden = true;
  }
}

function setupFormValidation() {
  const form = document.getElementById("membership-form");
  const fullName = document.getElementById("full-name");
  const email = document.getElementById("email");

  fullName.addEventListener("keydown", restrictNameInput);
  fullName.addEventListener("blur", () => validateFullName(fullName));
  email.addEventListener("blur", () => {
    email.value = email.value.trim().toLowerCase();
    validateEmail(email);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameOk = validateFullName(fullName);
    const emailOk = validateEmail(email);

    if (!nameOk || !emailOk) return;

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = "Application received!";
    form.reset();
    toggleRole();
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = "Submit Application";
    }, 4000);
  });
}

document.addEventListener("DOMContentLoaded", initMembershipPage);
