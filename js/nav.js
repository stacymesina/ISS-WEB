/**
 * Keeps admin access out of the navbar (footer staff link on home only).
 */
document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll('header nav a[href="admin.html"], header nav a.nav-admin')
    .forEach((link) => link.remove());
});
