<script type="module">
// ==============================
// ВАШИ ДАННЫЕ
// ==============================
const SUPABASE_URL      = 'https://yqhzekifwxotizsmaeaf.supabase.co';   // <— ВАШ URL проекта из Supabase (копируйте из Settings)
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....';   // <— ВАШ anon key (из Settings → API)
const SIGN_FN_URL       = SUPABASE_URL + '/functions/v1/liqpay-sign';
const LIQPAY_CHECKOUT   = 'https://www.liqpay.ua/api/3/checkout';

// ==============================
// ВСПОМОГАТЕЛЬНОЕ
// ==============================
function errBox(msg){
  const box = document.getElementById('pay-error') || (() => {
    const n = document.createElement('div');
    n.id = 'pay-error';
    n.style = 'margin:16px 0;padding:12px 14px;border-radius:10px;background:#fee2e2;color:#991b1b;';
    document.querySelector('main')?.prepend(n);
    return n;
  })();
  box.textContent = msg;
}

async function postJSON(url, body, headers={}) {
  const r = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: JSON.stringify(body),
    // чтобы CORS-префлайт прошёл корректно:
    mode: 'cors',
    credentials: 'omit',
  });
  return r;
}

// ==============================
// ОСНОВНОЙ ФЛОУ ОПЛАТЫ
// ==============================
// Вызываем из checkout.html после того как у вас есть:
// orderId, amount, description, resultUrl, serverUrl (если нужен)
export async function initPayment({ amount, description, orderId, resultUrl, serverUrl }) {
  try {
    // 1) Получаем data + signature из нашей Edge-функции
    const payload = {
      public_key:   null,           // сервер сам подставит из секретов
      action:       'pay',
      version:      3,
      amount,
      currency:     'UAH',
      description,
      order_id:     orderId,
      result_url:   resultUrl,
      server_url:   serverUrl || undefined,
      sandbox:      false
    };

    // ВАЖНО: даже если Verify JWT выключен — безопасно и полезно слать
    // Authorization: Bearer <anon key>. Это также устраняет случайные 401.
    const signResp = await postJSON(SIGN_FN_URL, payload, {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'apikey': SUPABASE_ANON_KEY
    });

    if (!signResp.ok) {
      const text = await signResp.text().catch(()=> '');
      throw new Error(`Підпис не отримано (HTTP ${signResp.status}). Відповідь: ${text || '—'}`);
    }

    const { data, signature } = await signResp.json();

    if (!data || !signature) {
      throw new Error('Відповідь підпису без полів data/signature.');
    }

    // 2) Создаём форму и редиректим в LiqPay
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = LIQPAY_CHECKOUT;
    form.acceptCharset = 'utf-8';
    form.innerHTML = `
      <input type="hidden" name="data" value="${data}">
      <input type="hidden" name="signature" value="${signature}">
    `;
    document.body.appendChild(form);
    form.submit();

  } catch (e) {
    console.error(e);
    errBox(`Помилка ініціалізації оплати: ${e.message || e}`);
  }
}

// Если нужно автоматически стартовать оплату на странице checkout.html
const qp = new URLSearchParams(location.search);
if (location.pathname.endsWith('/checkout.html')) {
  const amount = Number(qp.get('amount') || '0');
  const orderId = qp.get('order_id') || ('ORDER-' + Date.now());
  const showSlug = qp.get('show') || '';
  const resultUrl = location.origin + '/thanks.html?order_id=' + encodeURIComponent(orderId) + '&show=' + encodeURIComponent(showSlug);

  if (amount > 0) {
    initPayment({
      amount,
      description: `Оплата квитків • ${showSlug || 'Ваш Адмін'}`,
      orderId,
      resultUrl
    });
  } else {
    errBox('Сума платежу не валідна.');
  }
}
</script>
