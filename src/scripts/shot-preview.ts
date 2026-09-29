// Desktop-only cursor-follow screenshot for work rows. One element, transform
// only, rAF loop runs only while the pointer is inside the list. Also wires
// scope filters (server-rendered at 6+ rows, or built later by stress.ts for
// cloned rows) via one delegated listener on the section, so buttons added
// after this script runs are still wired with no extra listeners. Spec §5.3
// item 4.
import { lerp } from '../lib/motion';

const list = document.getElementById('work-list');
const preview = document.querySelector<HTMLElement>('.work .preview');
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (list && preview && fine) {
  preview.hidden = false;
  let tx = 0, ty = 0, x = 0, y = 0, raf = 0, current = '';
  const tick = () => {
    x = reduced ? tx : lerp(x, tx, 0.18);
    y = reduced ? ty : lerp(y, ty, 0.18);
    preview.style.transform = `translate3d(${x + 24}px, ${y - 120}px, 0)`;
    raf = requestAnimationFrame(tick);
  };
  list.addEventListener('pointerenter', (e) => {
    x = tx = e.clientX; y = ty = e.clientY;
    if (!raf) raf = requestAnimationFrame(tick);
  });
  list.addEventListener('pointermove', (e) => {
    tx = e.clientX; ty = e.clientY;
    const row = (e.target as HTMLElement).closest<HTMLElement>('.work-row');
    if (row && row.dataset.slug !== current) {
      current = row.dataset.slug ?? '';
      const frame = row.querySelector('.frame');
      preview.replaceChildren(frame ? frame.cloneNode(true) : document.createTextNode(''));
      preview.classList.add('on');
    }
  });
  list.addEventListener('pointerleave', () => {
    preview.classList.remove('on');
    current = '';
    cancelAnimationFrame(raf);
    raf = 0;
  });
}

// Delegated on the section (always present), not on `.filters` itself: rows
// past the server-rendered 6+ threshold are cloned client-side by stress.ts,
// which can also build the `.filters` block after this script has already
// run, so a listener bound directly to that element could miss it.
document.getElementById('work')?.addEventListener('click', (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.filters button[data-filter]');
  if (!btn) return;
  const filters = document.querySelectorAll<HTMLButtonElement>('.work .filters button');
  filters.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
  const f = btn.dataset.filter;
  document.querySelectorAll<HTMLElement>('.work-row').forEach((r) => {
    r.hidden = f !== '*' && r.dataset.scope !== f;
  });
});

export {};
