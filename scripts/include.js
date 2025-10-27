<script type="module">
// /scripts/include.js
async function inject(ref, url){
  const host = document.getElementById(ref);
  if (!host) return;
  try{
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) throw new Error(r.status);
    host.innerHTML = await r.text();

    // активный пункт меню после вставки header
    if (ref === 'site-header') {
      const path = location.pathname.replace(/\/index\.html$/, '');
      document.querySelectorAll('.nav a').forEach(a => {
        const href = a.getAttribute('href');
        if (!href) return;
        // абсолютные ссылки
        if (href.startsWith('/') && path.startsWith(href.replace(/\/index\.html$/, ''))){
          a.classList.add('active');
        } else
        // относительные (для корня)
        if (!href.startsWith('/') && location.pathname.endsWith(href)){
          a.classList.add('active');
        }
      });
    }
  }catch(e){
    console.error('Include failed', ref, url, e);
  }
}

inject('site-header', '/header.html');
inject('site-footer', '/footer.html');
</script>
