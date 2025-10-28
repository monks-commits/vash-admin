<script type="module">
// /scripts/include.js

async function inject(ref, url) {
  const host = document.getElementById(ref);
  if (!host) return; // на странице нет плейсхолдера — тихо выходим
  try {
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) throw new Error("HTTP " + r.status);
    host.innerHTML = await r.text();

    // Подсветка активного пункта меню в шапке
    if (ref === "site-header") {
      const path = location.pathname.replace(/\/index\.html$/, "");
      document.querySelectorAll(".nav a").forEach(a => {
        const href = a.getAttribute("href") || "";
        // абсолютные ссылки сравниваем по началу пути
        if (href && href.startsWith("/") && path.startsWith(href.replace(/\/index\.html$/, ""))) {
          a.classList.add("active");
        } else if (href && !href.startsWith("/") && location.pathname.endsWith(href)) {
          a.classList.add("active");
        }
      });
    }
  } catch (e) {
    console.error("Include failed for", url, e);
  }
}

// грузим из корня, чтобы работало и на /spectacles/hall.html
inject("site-header", "/header.html");
inject("site-footer", "/footer.html");
</script>
