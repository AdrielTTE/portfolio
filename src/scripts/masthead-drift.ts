// Home masthead: the two words drift a few pixels in opposite directions as
// the pointer moves across the intro. Uses the `translate` property so it
// doesn't fight the intro's transform animation. Desktop pointers only.
import { lerp } from '../lib/motion';

const MAX = 10;

if (
  matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !matchMedia('(prefers-reduced-motion: reduce)').matches
) {
  const zone = document.querySelector<HTMLElement>('.intro');
  const words = zone ? [...zone.querySelectorAll<HTMLElement>('.masthead .line-mask > span')] : [];
  if (zone && words.length === 2) {
    let target = 0;
    let x = 0;
    let raf = 0;
    const loop = () => {
      x = lerp(x, target, 0.1);
      words[0].style.translate = `${x.toFixed(2)}px 0`;
      words[1].style.translate = `${(-x).toFixed(2)}px 0`;
      raf = Math.abs(x - target) < 0.05 ? 0 : requestAnimationFrame(loop);
    };
    const go = (t: number) => {
      target = t;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    zone.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'mouse') go(((e.clientX / innerWidth) * 2 - 1) * MAX);
    });
    zone.addEventListener('pointerleave', () => go(0));
  }
}
export {};
