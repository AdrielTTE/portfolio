// Phone viewer on case studies: tabs swap the screen shown in the frame.
// Click or tap, hover (fine pointers), and arrow keys all work. Without JS the
// screens stay side by side (see Shots.astro).
document.querySelectorAll<HTMLElement>('[data-viewer]').forEach((viewer) => {
  const tabs = [...viewer.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
  const phones = [...viewer.querySelectorAll<HTMLElement>('.phone')];
  const cap = viewer.querySelector<HTMLElement>('.cap');
  if (tabs.length < 2 || tabs.length !== phones.length) return;
  viewer.classList.add('live');

  const select = (i: number, focus = false) => {
    tabs.forEach((t, j) => {
      t.setAttribute('aria-selected', String(i === j));
      t.tabIndex = i === j ? 0 : -1;
    });
    phones.forEach((p, j) => p.classList.toggle('on', i === j));
    if (cap) cap.textContent = phones[i].querySelector('img')?.alt ?? '';
    if (focus) tabs[i].focus();
  };

  const hover = matchMedia('(hover: hover) and (pointer: fine)').matches;
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(i));
    if (hover) tab.addEventListener('pointerenter', () => select(i));
    tab.addEventListener('keydown', (e) => {
      const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
      if (!step) return;
      e.preventDefault();
      select((i + step + tabs.length) % tabs.length, true);
    });
  });
});
export {};
