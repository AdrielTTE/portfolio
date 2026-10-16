// Masthead misregister: a flat signal-colour copy of the name sits behind it
// and, while a mouse is over the name, steps off register the way a press
// plate does: a few pixels one way, held, then clicking over to the other side
// when the pointer crosses the middle. No tracking loop: the copy only changes
// when the side changes, and a CSS transition makes each step crisp. Desktop
// mouse only; touch, reduced motion and no-JS keep the plain masthead. Only
// transform and opacity change.
const STEP_X = 0.03; // shift, in font sizes
const STEP_Y = 0.017;
const DEAD_X = 0.12; // middle band that keeps the current side, as a share of half the width
const DEAD_Y = 0.2;

function init() {
  const h1 = document.querySelector<HTMLElement>('.masthead');
  if (!h1 || h1.dataset.misregister) return;
  h1.dataset.misregister = '1';

  const fontPx = parseFloat(getComputedStyle(h1).fontSize);
  const stepX = fontPx * STEP_X;
  const stepY = fontPx * STEP_Y;

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

  // Which side the copy sits on: -1 / 1 for each axis. It trails the pointer,
  // so it steps to the far side from where the pointer is.
  let sx = 1;
  let sy = 1;
  const place = () => {
    ghost.style.transform = `translate3d(${sx * stepX}px, ${sy * stepY}px, 0)`;
  };

  h1.addEventListener('pointerenter', (e) => {
    if (e.pointerType !== 'mouse') return;
    hint.classList.add('gone');
    side(e);
    ghost.style.opacity = '1';
  });
  h1.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'mouse') side(e);
  });
  h1.addEventListener('pointerleave', () => {
    ghost.style.opacity = '0';
  });

  function side(e: PointerEvent) {
    const r = h1!.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    const nx = Math.abs(dx) > DEAD_X ? (dx > 0 ? -1 : 1) : sx;
    const ny = Math.abs(dy) > DEAD_Y ? (dy > 0 ? -1 : 1) : sy;
    if (nx === sx && ny === sy && ghost.style.transform) return;
    sx = nx;
    sy = ny;
    place();
  }
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
