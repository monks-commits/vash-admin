<!-- /scripts/include.js -->
<script>
const HEADER_HTML = `
  <header class="site-header">
    <div class="container header-inner">
      <a href="/" class="logo">Ваш Адмін</a>
      <nav class="nav">
        <a href="/index.html">Головна</a>
        <a href="/afisha.html">Афіша</a>
        <a href="/theatres.html">Театри</a>
        <a href="/contacts.html">Контакти</a>
      </nav>
    </div>
  </header>
`;

const FOOTER_HTML = `
  <footer class="site-footer">
    <div class="container footer-grid">
      <div>
        <strong>Ваш Адмін — квитки без комісії.</strong><br/>
        Дніпро • Кривий Ріг
      </div>
      <div>
        Тел.: <a href="tel:+380981261695">+380 (98) 126-16-95</a><br/>
        Email: <a href="mailto:alexandrryabov@ukr.net">alexandrryabov@ukr.net</a>
      </div>
      <div class="legal">
        ФОП Рябов Олександр Германович<br/>
        Адреса: 49100, м. Дніпро, вул. Мандриківська, буд. 163, кв. 27<br/>
        РНОКПП: 2002240000000166615<br/>
        Безпечна оплата через LiqPay
      </div>
    </div>
    <div class="footer-bottom">© 2025 Ваш Адмін — квитки без комісії</div>
  </footer>
`;

(function inject() {
  const h = document.getElementById("site-header");
  const f = document.getElementById("site-footer");
  if (h) h.innerHTML = HEADER_HTML;
  if (f) f.innerHTML = FOOTER_HTML;
})();
</script>
