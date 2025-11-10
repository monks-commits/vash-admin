<!-- scripts/include.js (ES module) -->
<script type="module">
const SUPABASE_URL  = "https://yqhzekifwxotizsmaeaf.supabase.co";
const SUPABASE_ANON = "sb_publi...Ваш_anon_key...";
const LIQPAY_SIGN_URL = "https://yqhzekifwxotizsmaeaf.functions.supabase.co/liqpay-sign";

// --- утилиты ---
function $(sel){ return document.querySelector(sel); }
function toast(msg, type="error"){
  const el = document.createElement("div");
  el.textContent = msg;
  el.style.cssText = `
    position:fixed;left:50%;bottom:24px;transform:translateX(-50%);
    padding:10px 14px;border-radius:10px;background:${type==="ok"?"#36a267":"#e34d4d"};
    color:#fff;font-weight:600;z-index:9999`;
  document.body.appendChild(el);
  setTimeout(()=>el.remove(), 3500);
}

// --- получаем параметры из URL ---
const qs = new URLSearchParams(location.search);
const show    = qs.get("show")   || "";
const seats   = (qs.get("seats") || "").split(",").filter(Boolean);
const amount  = Number(qs.get("amount") || 0);
const order_id= qs.get("order_id") || ("ORD-" + Date.now());

// --- подставляем в верстку (если есть такие элементы) ---
const elShow   = document.getElementById("order-show");
const elOrder  = document.getElementById("order-id");
const elAmount = document.getElementById("order-amount");
if (elShow)   elShow.textContent = show.replace("/", " — ");
if (elOrder)  elOrder.textContent = order_id;
if (elAmount) elAmount.textContent = amount + " грн";

// --- основная логика оплаты ---
async function startPay(){
  const name  = $("#buyer-name")?.value?.trim()  || "";
  const phone = $("#buyer-phone")?.value?.trim() || "";
  const email = $("#buyer-email")?.value?.trim() || "";

  if (!seats.length || !amount || !order_id) {
    toast("Не вказані квитки або сума."); return;
  }
  if (!name || !phone || !email) {
    toast("Заповніть ПІБ, телефон, e-mail."); return;
  }

  // формируем полезную нагрузку на подписание
  const payload = {
    order_id,
    amount,
    currency: "UAH",
    description: `Квитки: ${show} | ${seats.join(", ")}`,
    customer: { name, phone, email },
    meta: { show, seats }
  };

  // ВАЖНО: передаём JSON + Content-Type
  let resp;
  try {
    resp = await fetch(LIQPAY_SIGN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (e){
    toast("Помилка мережі при підготовці LiqPay"); return;
  }

  if (!resp.ok){
    const t = await resp.text().catch(()=> "");
    console.error("liqpay-sign error:", t);
    toast("Не вдалося підготувати оплату (LiqPay).");
    return;
  }

  const { data, signature, checkout_url } = await resp.json();

  // если вернулся прямий checkout_url — переходим
  if (checkout_url){
    location.href = checkout_url;
    return;
  }

  // иначе создаём форму и постим на LiqPay (стандартный способ)
  const form = document.createElement("form");
  form.method = "POST";
  form.action = "https://www.liqpay.ua/api/3/checkout"; // sandbox/боевой — решает LiqPay
  form.target = "_self";

  const fData = document.createElement("input");
  fData.type = "hidden"; fData.name = "data"; fData.value = data;

  const fSig  = document.createElement("input");
  fSig.type  = "hidden"; fSig.name = "signature"; fSig.value = signature;

  form.appendChild(fData);
  form.appendChild(fSig);
  document.body.appendChild(form);
  form.submit();
}

// вешаем обработчик на кнопку
const btn = document.getElementById("pay-btn") || document.querySelector("[data-pay-btn]");
if (btn) btn.addEventListener("click", (e)=>{ e.preventDefault(); startPay(); });

</script>
