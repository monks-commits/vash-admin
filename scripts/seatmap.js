(function(){
  const hallWrap = document.getElementById('hall');
  const counterEl = document.getElementById('tickets-counter');
  const totalEl = document.getElementById('total-amount');
  const buyBtn = document.getElementById('buy-btn');
  const noteEl = document.getElementById('buy-note');
  const posterImg = document.getElementById('poster-img');
  const titleEl = document.getElementById('show-title');
  const dateEl = document.getElementById('show-date');

  const params = new URLSearchParams(location.search);
  const venue = params.get('venue') || 'akademia';
  const show = params.get('show'); // slug

  if (!show) {
    hallWrap.innerHTML = '<p>Відсутній параметр <code>?show=&lt;slug&gt;</code>.</p>';
    return;
  }

  let baseCfg, overlayCfg;

  Promise.all([
    fetch(`/data/halls/${venue}_base.json`, {cache:'no-store'}).then(r=>r.json()),
    fetch(`/data/shows/${venue}/${show}.json`, {cache:'no-store'}).then(r=>r.json())
  ]).then(([base, overlay]) => {
    baseCfg = base; overlayCfg = overlay;
    if (titleEl && overlay.title) titleEl.textContent = overlay.title;
    if (posterImg && overlay.poster) posterImg.src = overlay.poster;
    if (dateEl && overlay.date) dateEl.textContent = new Date(overlay.date).toLocaleString('uk-UA');
    render(base, overlay);
  }).catch(err => {
    console.error(err);
    hallWrap.innerHTML = '<p>Не вдалося завантажити конфігурацію.</p>';
  });

  function getSeatPrice(row, seat) {
    const key = `${row}-${seat}`;
    if (overlayCfg && overlayCfg.seatPrices && Object.prototype.hasOwnProperty.call(overlayCfg.seatPrices, key)) {
      return overlayCfg.seatPrices[key];
    }
    if (overlayCfg && Array.isArray(overlayCfg.zones)) {
      for (const z of overlayCfg.zones) {
        if (Array.isArray(z.rows) && z.rows.includes(row) && typeof z.price === 'number') return z.price;
      }
    }
    return null;
  }

  const selected = new Map();

  function render(base, overlay) {
    hallWrap.innerHTML = '';

    (base.rows || []).forEach(r => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'row';

      const rowLabel = document.createElement('span');
      rowLabel.className = 'row-label';
      rowLabel.textContent = `Ряд ${r.row}`;
      rowDiv.appendChild(rowLabel);

      const seatsDiv = document.createElement('div');
      seatsDiv.className = 'seats';

      let seatCounter = 0;
      (r.segments || []).forEach(seg => {
        if (seg === 0) {
          const gap = document.createElement('div');
          gap.className = 'gap';
          seatsDiv.appendChild(gap);
        } else {
          for (let i=0;i<seg;i++) {
            seatCounter += 1;
            const key = `${r.row}-${seatCounter}`;
            const btn = document.createElement('button');
            btn.className = 'seat';
            btn.type = 'button';
            btn.dataset.row = r.row;
            btn.dataset.seat = seatCounter;

            const price = getSeatPrice(r.row, seatCounter);
            if (price != null) btn.dataset.price = String(price);

            if (overlay.disabled && overlay.disabled.includes(key)) {
              btn.classList.add('disabled');
              btn.disabled = true;
            }

            btn.textContent = seatCounter;

            btn.addEventListener('click', () => {
              if (btn.classList.contains('disabled')) return;
              const priceVal = btn.dataset.price ? Number(btn.dataset.price) : null;
              if (selected.has(key)) {
                selected.delete(key);
                btn.classList.remove('selected');
              } else {
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
    const vals = [...selected.values()];
    const priced = vals.filter(v => typeof v.price === 'number');
    const hasUnpriced = vals.length > priced.length;
    const sum = priced.reduce((a,b)=>a+(b.price||0),0);

    counterEl.textContent = String(vals.length);
    totalEl.textContent = hasUnpriced ? '—' : String(sum);

    const allowUnpriced = !!(overlayCfg && overlayCfg.allowUnpricedCheckout);
    buyBtn.disabled = !(vals.length > 0 && (!hasUnpriced || allowUnpriced));

    if (noteEl) {
      noteEl.textContent = (hasUnpriced && !allowUnpriced) ?
        'Ціни ще не призначені для частини місць.' : '';
    }
  }

  buyBtn?.addEventListener('click', () => {
    const payload = {
      venue: baseCfg?.venue || 'Академія руху',
      currency: baseCfg?.currency || 'UAH',
      show: overlayCfg?.slug,
      title: overlayCfg?.title,
      date: overlayCfg?.date,
      seats: [...selected.values()]
    };
    localStorage.setItem('selectedTickets', JSON.stringify(payload));
    window.location.href = '/checkout.html';
  });

})();