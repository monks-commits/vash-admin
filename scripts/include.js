<script type="module">
/** Глобальная подгрузка шапки и подвала + подсветка активного пункта */
async function inject(refId, url) {
  const host = document.getElementById(refId);
  if (!host) return;
  try {
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) throw new Error(r.status);
    host.innerHTML = await r.text();

    // подсветка активного меню
    if (refId === "site-header") {
      const path = location.pathname.replace(/\/index\.html$/, "/");
      document.querySelectorAll(".nav a").forEach(a => {
        const href = a.getAttribute("href");
        if (!href) return;
        // абсолютные/относительные пути
        const target = href.replace(/\/index\.html$/, "/");
        if (target === "/" && path === "/") a.classList.add("active");
        else if (target !== "/" && path.startsWith(target)) a.classList.add("active");
      });
    }
  } catch (e) {
    console.error("include failed:", refId, url, e);
  }
}

inject("site-header", "/header.html");
inject("site-footer", "/footer.html");
</script>
