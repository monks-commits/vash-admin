// Подтягиваем header и footer на страницах, где есть контейнеры #site-header и #site-footer
(async () => {
  try {
    const header = document.getElementById('site-header');
    if (header) {
      const r = await fetch('/header.html', { cache: 'no-store' });
      header.innerHTML = await r.text();
    }

    const footer = document.getElementById('site-footer');
    if (footer) {
      const r = await fetch('/footer.html', { cache: 'no-store' });
      footer.innerHTML = await r.text();
    }
  } catch (e) {
    console.warn('include.js:', e);
  }
})();
