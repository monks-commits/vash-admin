<!-- vash-admin/scripts/include.js -->
<script>
  // простой include для шапки и подвала
  async function injectPart(id, url) {
    try {
      const el = document.getElementById(id);
      if (!el) return;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) return;
      const html = await res.text();
      el.innerHTML = html;
    } catch (e) {
      console.warn("include fail for", id, e);
    }
  }

  // когда документ готов
  document.addEventListener("DOMContentLoaded", () => {
    // пути под твой репозиторий:
    // /vash-admin/ лежит в корне — поэтому части кладём туда же
    injectPart("site-header", "/vash-admin/partials/header.html");
    injectPart("site-footer", "/vash-admin/partials/footer.html");
  });
</script>
