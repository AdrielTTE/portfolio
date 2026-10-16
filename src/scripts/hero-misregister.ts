// Masthead misregister: a flat orange copy of the name sits behind it and
// slides a few pixels with the pointer, so the letters look like a two-colour
// print job that is slightly off register. Desktop mouse only; touch and
// reduced motion keep the plain masthead, which is also what renders without
// JavaScript. The copy only ever moves (transform) and fades (opacity).
const REACH_X = 0.035; // max shift, in font sizes
const REACH_Y = 0.02;
const EASE = 0.14; // share of the gap closed per frame

function init() {
  const h1 = document.querySelector<HTMLElement>('.masthead');
  const zone = h1?.closest<HTMLElement>('.intro');
  if (!h1 || !zone || h1.dataset.misregister) return;
  h1.dataset.misregister = '1';

  const fontPx = parseFloat(getComputedStyle(h1).fontSize);
  const maxX = fontPx * REACH_X;
  const maxY = fontPx * REACH_Y;

  const ghost = document.createElement('span');
  ghost.className = 'ghost';
  ghost.setAttribute('aria-hidden', 'true');
  h1.querySelectorAll('.line-mask').forEach((word) => ghost.append(word.cloneNode(true)));
  h1.append(ghost);

  // The hint exists only where the effect does, and bows out the first time
  // the pointer reaches the name.
  const hint = document.createElement('p');
  hint.className = 'hint';
  hint.setAttribute('aria-hidden', 'true');
  hint.textContent = 'move over the name';
  h1.after(hint);

  let x = 0;
  let y = 0;
  let o = 0;
  let tx = 0;
  let ty = 0;
  let to = 0;
  let raf = 0;

  const tick = () => {
    raf = 0;
    x += (tx - x) * EASE;
    y += (ty - y) * EASE;
    o += (to - o) * EASE;
    const settled = Math.abs(tx - x) < 0.05 && Math.abs(ty - y) < 0.05 && Math.abs(to - o) < 0.01;
    if (settled) {
      x = tx;
      y = ty;
      o = to;
    }
    ghost.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
    ghost.style.opacity = o.toFixed(3);
    if (!settled) raf = requestAnimationFrame(tick);
  };
  const wake = () => {
    if (!raf) raf = requestAnimationFrame(tick);
  };

  zone.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = h1.getBoundingClientRect();
    // -1..1 across the name, so the copy trails the pointer left to right and
    // top to bottom; clamped so a pointer far below the name holds the edge.
    const dx = ((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) || 0;
    const dy = ((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) || 0;
    tx = -Math.max(-1, Math.min(1, dx)) * maxX;
    ty = -Math.max(-1, Math.min(1, dy)) * maxY;
    to = 1;
    if (e.target instanceof Element && e.target.closest('.masthead')) hint.classList.add('gone');
    wake();
  });
  zone.addEventListener('pointerleave', () => {
    tx = 0;
    ty = 0;
    to = 0;
    wake();
  });
}

if (
  matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !matchMedia('(prefers-reduced-motion: reduce)').matches &&
  document.fonts
) {
  // Copy the name once the heavy face is in, so the copy is set in it too.
  document.fonts.load('800 1em "Archivo Variable"').then(
    () => requestAnimationFrame(init),
    () => {},
  );
}
