(function () {
  const hallWrap = document.getElementById('hall');
  const counterEl = document.getElementById('tickets-counter');
  const totalEl = document.getElementById('total-amount');
  const buyBtn = document.getElementById('buy-btn');
  const noteEl = document.getElementById('buy-note'); // optional hint

  let cfg;

  fetch('/data/akademia_layout.json', { cache: 'no-store' })
    .then(r => r.json())
    .then(config => {
      cfg = config;
      renderHall(config);
    })
    .catch(() => {
      console.error('Не удалось загрузить /data/akademia_layout.json');
    });

  // Utility for price lookup
  function getSeatPrice(row, seatNumber) {
    const key = `${row}-${seatNumber}`;
    if (cfg.seatPrices && cfg.seatPrices.hasOwnProperty(key)) {
      return cfg.seatPrices[key];
    }
    // Zones support (optional; can be extended later)
    if (Array.isArray(cfg.zones)) {
      for (const z of cfg.zones) {
        if (Array.isArray(z.rows) && z.rows.includes(row)) {
          // Simple example: one price per row zone
          if (typeof z.price === 'number') return z.price;
        }
      }
    }
    return null; // unpriced by default
  }

  const selected = new Map(); // key: "row-seat", val: {row, seat, price}

  function renderHall(config) {
    hallWrap.innerHTML = '';
    (config.rows || []).forEach(r => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'row';

      const rowLabel = document.createElement('span');
      rowLabel.className = 'row-label';
      rowLabel.textContent = `Ряд ${r.row}`;
      rowDiv.appendChild(rowLabel);

      const seatsDiv = document.createElement('div');
      seatsDiv.className = 'seats';

      // Build continuous numbering across segments, 0 = aisle
      let seatCounter = 0;
      (r.segments || []).forEach(seg => {
        if (seg === 0) {
          const gap = document.createElement('div');
          gap.className = 'gap';
          seatsDiv.appendChild(gap);
        } else {
          for (let i = 0; i < seg; i++) {
            seatCounter += 1;
            const btn = document.createElement('button');
            btn.className = 'seat';
            btn.type = 'button';
            btn.dataset.row = r.row;
            btn.dataset.seat = seatCounter;

            const price = getSeatPrice(r.row, seatCounter);
            if (price != null) btn.dataset.price = String(price);

            const key = `${r.row}-${seatCounter}`;

            // Disable if in cfg.disabled
            if (Array.isArray(cfg.disabled) && cfg.disabled.includes(key)) {
              btn.classList.add('disabled');
              btn.disabled = true;
            }

            btn.textContent = seatCounter;

            btn.addEventListener('click', () => {
              if (btn.classList.contains('disabled')) return;

              if (selected.has(key)) {
                selected.delete(key);
                btn.classList.remove('selected');
              } else {
                const priceVal = btn.dataset.price ? Number(btn.dataset.price) : null;
                selected.set(key, { row: r.row, seat: seatCounter, price: priceVal });
                btn.classList.add('selected');
              }
              updateTotals();
            });

            seatsDiv.appendChild(btn);
          }
        }
      });

      rowDiv.appendChild(seatsDiv);
      hallWrap.appendChild(rowDiv);
    });
  }

  function updateTotals() {
    const values = [...selected.values()];
    const count = values.length;
    const priced = values.filter(v => typeof v.price === 'number');
    const hasUnpriced = count > priced.length;

    const sum = priced.reduce((a, b) => a + (b.price || 0), 0);
    counterEl.textContent = String(count);
    totalEl.textContent = hasUnpriced ? '—' : String(sum);

    // Disable checkout if unpriced seats present and policy forbids
    const allowUnpriced = !!(cfg && cfg.allowUnpricedCheckout);
    const canCheckout = count > 0 && (!hasUnpriced || allowUnpriced);
    buyBtn.disabled = !canCheckout;

    if (noteEl) {
      if (hasUnpriced && !allowUnpriced) {
        noteEl.textContent = 'Ціни ще не призначені. Оформлення буде доступне після встановлення цін.';
      } else {
        noteEl.textContent = '';
      }
    }
  }

  buyBtn?.addEventListener('click', () => {
    const payload = {
      venue: cfg?.venue || 'Академія руху',
      currency: cfg?.currency || 'UAH',
      seats: [...selected.values()] // seats may include null price if allowedUnpricedCheckout is true
    };
    localStorage.setItem('selectedTickets', JSON.stringify(payload));
    window.location.href = '/checkout.html';
  });

})();
