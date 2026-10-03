// Work index: a small card follows the pointer while a row is hovered. Fine
// pointers only, and not under reduced motion. One rAF loop runs only while a
// row is hovered; the card moves with transform and fades with opacity.
import { lerp } from '../lib/motion';

const W = 300;
const H = 200;
const OFFSET = 28;

if (
  matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !matchMedia('(prefers-reduced-motion: reduce)').matches
) {
  document.querySelectorAll<HTMLElement>('.work-row').forEach((row) => {
    const peek = row.querySelector<HTMLElement>('.peek');
    if (!peek) return;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;
    let first = true;

    const place = (e: PointerEvent) => {
      // Flip to the left / above the pointer near the right and bottom edges.
      tx = e.clientX + OFFSET + W > innerWidth ? e.clientX - OFFSET - W : e.clientX + OFFSET;
      ty = Math.min(Math.max(e.clientY - H / 2, 12), innerHeight - H - 12);
      if (first) {
        x = tx;
        y = ty;
        first = false;
      }
    };
    const loop = () => {
      x = lerp(x, tx, 0.18);
      y = lerp(y, ty, 0.18);
      peek.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    row.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse') return;
      first = true;
      place(e);
      peek.classList.add('on');
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);
    });
    row.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'mouse') place(e);
    });
    row.addEventListener('pointerleave', () => {
      peek.classList.remove('on');
      cancelAnimationFrame(raf);
    });
  });
}
export {};
