const theme = document.getElementById('theme');
theme.addEventListener('click', () => {
  const root = document.documentElement;
  const current = root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  root.dataset.theme = current === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch (_) {}
});
const tabs = document.querySelectorAll('.tab');
const posts = document.querySelectorAll('.feed-item');
tabs.forEach(tab => tab.addEventListener('click', () => {
  const filter = tab.dataset.filter;
  tabs.forEach(t => { const active = t === tab; t.classList.toggle('active', active); t.setAttribute('aria-pressed', String(active)); });
  let count = 0;
  posts.forEach(post => { post.hidden = filter !== '全部' && post.dataset.category !== filter; if (!post.hidden) count++; });
  const empty = document.querySelector('.empty'); if (empty) empty.hidden = count > 0;
}));
