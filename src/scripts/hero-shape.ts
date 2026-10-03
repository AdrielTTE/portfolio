// Hero quarter-circle: drifts a few pixels with the pointer, the way a poster
// layer would sit slightly behind the type. Sets two CSS variables that the
// shape reads through the `translate` property. Fine pointers only, and not
// under reduced motion. rAF runs only while the pointer is moving.
import { lerp } from '../lib/motion';

const MAX = 14;

if (
  matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !matchMedia('(prefers-reduced-motion: reduce)').matches
) {
  const zone = document.querySelector<HTMLElement>('.intro');
  if (zone) {
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;
    const loop = () => {
      x = lerp(x, tx, 0.06);
      y = lerp(y, ty, 0.06);
      zone.style.setProperty('--sx', `${x.toFixed(2)}px`);
      zone.style.setProperty('--sy', `${y.toFixed(2)}px`);
      raf = Math.abs(x - tx) + Math.abs(y - ty) < 0.05 ? 0 : requestAnimationFrame(loop);
    };
    const go = (nx: number, ny: number) => {
      tx = nx * MAX;
      ty = ny * MAX;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    zone.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      go((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1);
    });
    zone.addEventListener('pointerleave', () => go(0, 0));
  }
}
export {};
