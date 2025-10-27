// /scripts/include.js  (type="module")
async function injectById(containerId, url) {
  const host = document.getElementById(containerId);
  if (!host) return;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();

    // Вставляем прямо вместо плейсхолдера
    host.outerHTML = html;

    // После вставки — подсветка активного пункта меню в header
    if (containerId === "site-header") {
      highlightActiveNav();
    }
  } catch (e) {
    console.error(`include(${url}) failed:`, e);
    host.innerHTML = `<div style="color:#b91c1c; padding:8px 0">
      Не вдалося завантажити ${url}. Перевірте шлях і наявність файлу.
    </div>`;
  }
}

function highlightActiveNav() {
  const here = location.pathname.replace(/\/+$/, "") || "/";
  const nav = document.querySelector(".nav");
  if (!nav) return;

  // Снимем прежние active
  nav.querySelectorAll("a").forEach(a => a.classList.remove("active"));

  // Ищем ссылку, путь которой совпадает с текущим (без параметров)
  const links = Array.from(nav.querySelectorAll("a"));
  // приоритет — точное совпадение, затем начало пути
  let best = links.find(a => new URL(a.href, location.origin).pathname === here);
  if (!best) {
    best = links.find(a => here.startsWith(new URL(a.href, location.origin).pathname));
  }
  if (best) best.classList.add("active");
}

// Инъекция header/footer
injectById("site-header", "/header.html");
injectById("site-footer", "/footer.html");
