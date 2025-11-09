(async function () {
  const hallWrap = document.getElementById('hall');
  const counterEl = document.getElementById('tickets-counter');
  const totalEl = document.getElementById('total-amount');
  const buyBtn = document.getElementById('buy-btn');
  const legendEl = document.getElementById('price-legend');

  // Подтягиваем JSON
  const res = await fetch('/data/akademia_hall.json', { cache: 'no-store' });
  if (!res.ok) {
    console.error('Не удалось загрузить /data/akademia_hall.json');
    return;
  }
  const config = await res.json();

  // Рендер легенды
  legendEl.innerHTML = '';
  (config.priceLegend || []).forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.label}: ${item.price} ₴`;
    legendEl.appendChild(li);
  });

  // Внутренняя модель выбора
  const selected = new Map(); // key: "row-seat", value: {row, seat, price}

  // Генерация мест
  config.sectors.forEach(sec => {
    const sector = document.createElement('section');
    sector.className = 'sector';

    const h3 = document.createElement('h3');
    h3.textContent = sec.name;
    sector.appendChild(h3);

    sec.rows.forEach(r => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'row';
      const rowLabel = document.createElement('span');
      rowLabel.className = 'row-label';
      rowLabel.textContent = `Ряд ${r.row}`;
      rowDiv.appendChild(rowLabel);

      const seatsDiv = document.createElement('div');
      seatsDiv.className = 'seats';

      for (let s = 1; s <= r.seats; s++) {
        const btn = document.createElement('button');
        btn.className = 'seat';
        btn.type = 'button';
        btn.dataset.row = r.row;
        btn.dataset.seat = s;
        btn.dataset.price = r.price;
        btn.textContent = s;

        btn.addEventListener('click', () => {
          const key = `${r.row}-${s}`;
          if (selected.has(key)) {
            selected.delete(key);
            btn.classList.remove('selected');
          } else {
            selected.set(key, { row: r.row, seat: s, price: r.price });
            btn.classList.add('selected');
          }
          updateTotals();
        });

        seatsDiv.appendChild(btn);
      }

      rowDiv.appendChild(seatsDiv);
      sector.appendChild(rowDiv);
    });

    hallWrap.appendChild(sector);
  });

  function updateTotals() {
    const count = selected.size;
    const sum = [...selected.values()].reduce((a, b) => a + b.price, 0);
    counterEl.textContent = count;
    totalEl.textContent = sum.toString();
    buyBtn.disabled = count === 0;
  }

  // Передача выбора на checkout (через localStorage)
  buyBtn.addEventListener('click', () => {
    const payload = {
      venue: config.venue,
      currency: config.currency,
      seats: [...selected.values()]
    };
    localStorage.setItem('selectedTickets', JSON.stringify(payload));
    window.location.href = '/checkout.html';
  });
})();
