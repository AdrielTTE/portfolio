// A soft light that follows the pointer across the espresso fields (the work
// scene, "What I build" and the footer). Plain script, no library: one element
// per field, moved with transform on rAF while the pointer is inside, faded
// with opacity. Fine pointers only, and not under reduced motion.
import { lerp } from '../lib/motion';

if (
  matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !matchMedia('(prefers-reduced-motion: reduce)').matches
) {
  document.querySelectorAll<HTMLElement>('[data-glow]').forEach((field) => {
    const glow = document.createElement('div');
    glow.className = 'glow';
    glow.setAttribute('aria-hidden', 'true');
    field.prepend(glow);

    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;
    let first = true;
    const loop = () => {
      x = lerp(x, tx, 0.14);
      y = lerp(y, ty, 0.14);
      glow.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    field.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = field.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      if (first) {
        x = tx;
        y = ty;
        first = false;
      }
      glow.classList.add('on');
      if (!raf) raf = requestAnimationFrame(loop);
    });
    field.addEventListener('pointerleave', () => {
      glow.classList.remove('on');
      cancelAnimationFrame(raf);
      raf = 0;
    });
  });
}
export {};
