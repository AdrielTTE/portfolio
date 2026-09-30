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

// Preview box (WorkList.astro): 320x200. It sits above the hovered row
// (below it near the top of the viewport), never over the row being read,
// and follows the cursor horizontally, clamped inside the viewport.
const PW = 320, PH = 200, GAP = 12, EDGE = 8;

// Only rows with a real screenshot get a preview; with none, nothing is made.
if (list && preview && fine && list.querySelector('.work-row .thumb img')) {
  preview.hidden = false;
  let tx = 0, ty = 0, x = 0, y = 0, raf = 0, current = '';
  const tick = () => {
    x = reduced ? tx : lerp(x, tx, 0.18);
    y = reduced ? ty : lerp(y, ty, 0.18);
    preview.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    raf = requestAnimationFrame(tick);
  };
  const target = (e: PointerEvent, row: HTMLElement | null) => {
    tx = Math.min(e.clientX + 24, innerWidth - PW - EDGE);
    if (!row) return;
    const r = row.getBoundingClientRect();
    ty = r.top - PH - GAP >= EDGE ? r.top - PH - GAP : r.bottom + GAP;
  };
  list.addEventListener('pointerenter', (e) => {
    target(e, (e.target as HTMLElement).closest<HTMLElement>('.work-row'));
    x = tx; y = ty;
    if (!raf) raf = requestAnimationFrame(tick);
  });
  list.addEventListener('pointermove', (e) => {
    const row = (e.target as HTMLElement).closest<HTMLElement>('.work-row');
    target(e, row);
    if (row && row.dataset.slug !== current) {
      current = row.dataset.slug ?? '';
      const frame = row.querySelector('.thumb .frame');
      if (frame) {
        preview.replaceChildren(frame.cloneNode(true));
        preview.classList.add('on');
      } else {
        preview.classList.remove('on');
      }
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
