# Патч: Академія руху — карта зала + лічильник + передача в checkout

**Структура для копирования в ваш репозиторий (`vash-admin`)**:
```
/data/akademia_hall.json
/scripts/seatmap-akademia.js
/theatre_akademia.html   (если у вас уже есть — сравните и слейте изменения)
```

## Быстрые шаги
1) Скопируйте файлы из этого архива в корень репозитория, соблюдая папки `/data` и `/scripts`.
2) Откройте `/theatre_akademia.html` — проверьте, что страница подхватывает общий `header.html` и `footer.html` из `/partials/`.
3) Отредактируйте цены/ряды в `/data/akademia_hall.json` под реальную схему Академії.
4) Убедитесь, что `checkout.html` на вашей стороне читает `localStorage.selectedTickets`. Если нет — добавьте фрагмент:
```html
<div id="selected-list"></div>
<p><strong>До сплати:</strong> <span id="selected-total">0</span> ₴</p>
<script>
  (function () {
    const box = document.getElementById('selected-list');
    const totalEl = document.getElementById('selected-total');
    const raw = localStorage.getItem('selectedTickets');
    if (!raw) return;
    const data = JSON.parse(raw);
    let sum = 0;
    box.innerHTML = '';
    data.seats.forEach(item => {
      sum += item.price;
      const p = document.createElement('p');
      p.textContent = `Ряд ${item.row}, Місце ${item.seat} — ${item.price} ₴`;
      box.appendChild(p);
    });
    totalEl.textContent = sum.toString();
  })();
</script>
```
5) Залейте изменения и задеплойте на GitHub Pages/Vercel.

## Примечания
- По умолчанию сетка мест рассчитана на 12 кресел в ряду (подстроить можно через `grid-template-columns` в `<style>` или в `styles.css`).
- Кнопка «Придбати квитки» активируется только при наличии выбранных мест.
- Выбор сохраняется в `localStorage` и переносится на `checkout.html`.
- Для блокировки проданных мест можно будет добавить массив `disabled: ["ряд-місце"]` в JSON и отмечать их классом `.seat.disabled` в скрипте.