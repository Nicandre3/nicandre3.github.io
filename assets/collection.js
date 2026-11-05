(() => {
  const root = document.documentElement;
  const theme = document.getElementById('theme-select');
  try { theme.value = localStorage.getItem('shiyi-theme') || 'system'; } catch (_) {}
  theme.addEventListener('change', () => {
    root.dataset.theme = theme.value;
    try { localStorage.setItem('shiyi-theme', theme.value); } catch (_) {}
  });
  let dataPromise;
  const getItems = () => dataPromise ||= fetch(root.dataset.indexUrl).then(r => {
    if (!r.ok) throw new Error('index'); return r.json();
  });
  const choose = (items, key) => {
    if (!items.length) return null;
    let previous = null;
    try { previous = sessionStorage.getItem(key); } catch (_) {}
    const candidates = items.length > 1 ? items.filter(item => item.id !== previous) : items;
    const result = candidates[Math.floor(Math.random() * candidates.length)];
    try { sessionStorage.setItem(key, result.id); } catch (_) {}
    return result;
  };
  const makeLink = item => { const a = document.createElement('a'); a.href = item.url; a.className = 'result-link';
    const title = document.createElement('strong'); title.textContent = item.title || item.body.slice(0, 60) || '未命名藏品';
    const meta = document.createElement('span'); meta.textContent = [item.date, item.category, item.id].filter(Boolean).join(' · ');
    const summary = document.createElement('p'); summary.textContent = item.body.slice(0, 140);
    a.append(title, meta, summary); return a; };
  const input = document.getElementById('search-input'), results = document.getElementById('search-results'), status = document.getElementById('search-status');
  if (input) {
    let request = 0;
    input.addEventListener('input', async () => {
      const query = input.value.trim().toLocaleLowerCase(); const ticket = ++request;
      results.replaceChildren();
      if (!query) { status.textContent = '输入关键词，寻找收藏。'; return; }
      status.textContent = '正在查找…';
      try { const items = await getItems(); if (ticket !== request) return;
        const found = items.filter(i => [i.title, i.body, (i.tags || []).join(' '), i.note].join(' ').toLocaleLowerCase().includes(query));
        status.textContent = found.length ? '找到 ' + found.length + ' 件藏品。' : '没有找到相关藏品，换个词试试。';
        found.forEach(item => results.append(makeLink(item)));
      } catch (_) { if (ticket === request) status.textContent = '暂时无法读取收藏，请稍后重试。'; }
    });
  }
  const random = document.getElementById('random-pick');
  if (random) random.addEventListener('click', async () => {
    const status = document.getElementById('random-status'); random.disabled = true;
    try { const selected = choose(await getItems(), 'shiyi-random'); if (selected) location.href = selected.url; else status.textContent = '收藏室还是空的，等第一件藏品到来。'; }
    catch (_) { status.textContent = '暂时无法读取收藏，请稍后重试。'; }
    finally { random.disabled = false; }
  });
  const old = document.getElementById('rediscover');
  if (old) getItems().then(items => { const sorted = items.slice().sort((a,b) => a.date.localeCompare(b.date)); const selected = choose(sorted.slice(0, Math.max(1, Math.ceil(sorted.length / 3))), 'shiyi-old'); if (selected) { old.replaceChildren(makeLink(selected)); } else old.textContent = '收藏室还空着，等时间慢慢留下第一件藏品。'; }).catch(() => { old.textContent = '暂时无法读取收藏。'; });
  const images = Array.from(document.querySelectorAll('.item-detail .detail-cover, .item-detail .prose img'));
  if (!images.length) return;
  const dialog = document.getElementById('lightbox'), img = dialog.querySelector('img'), close = dialog.querySelector('[data-close]'), previous = dialog.querySelector('[data-prev]'), next = dialog.querySelector('[data-next]');
  let index = 0, origin, touchX;
  const show = () => { img.src = images[index].currentSrc || images[index].src; img.alt = images[index].alt; previous.hidden = next.hidden = images.length < 2; };
  const step = n => { index = (index + n + images.length) % images.length; show(); };
  images.forEach((image, i) => { image.loading = 'lazy'; image.tabIndex = 0; image.setAttribute('role', 'button'); image.setAttribute('aria-label', '放大查看：' + (image.alt || '图片')); const open = () => { index = i; origin = image; show(); dialog.showModal(); close.focus(); }; image.addEventListener('click', open); image.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } }); });
  close.addEventListener('click', () => dialog.close()); dialog.addEventListener('close', () => origin?.focus());
  previous.addEventListener('click', () => step(-1)); next.addEventListener('click', () => step(1));
  dialog.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') step(-1); if (e.key === 'ArrowRight') step(1); });
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('touchstart', e => { touchX = e.changedTouches[0].clientX; }, {passive:true});
  dialog.addEventListener('touchend', e => { const delta = e.changedTouches[0].clientX - touchX; if (Math.abs(delta) > 50 && images.length > 1) step(delta < 0 ? 1 : -1); }, {passive:true});
})();
