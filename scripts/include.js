// /scripts/include.js  (ES-module, без HTML-комментариев)
async function inject(partialName, targetId) {
  try {
    const res = await fetch(`/${partialName}.html`, { cache: "no-cache" });
    if (!res.ok) return;
    const html = await res.text();
    const mount = document.getElementById(targetId);
    if (mount) mount.innerHTML = html;
  } catch (e) {
    console.error("include.js:", e);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  inject("header", "site-header");
  inject("footer", "site-footer");
});

export {}; // чтобы файл точно трактовался как модуль
