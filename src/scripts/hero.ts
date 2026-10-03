// Home masthead: each letter lifts as the pointer passes near it, so the big
// name reacts to the cursor like a row of keys. Desktop pointers only; the
// masthead is untouched on phones, without JS and under reduced motion.
// SplitText keeps the heading readable to screen readers (aria-label + hidden
// copies).
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

const REACH = 280;
const LIFT = 30;

const zone = document.querySelector<HTMLElement>('.intro');
const words = zone ? [...zone.querySelectorAll<HTMLElement>('.masthead .line-mask > span')] : [];

if (zone && words.length) {
  const mm = gsap.matchMedia();
  mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
    // The intro's rise-in mask would clip letters that lift; let them out once
    // the rise has played.
    const release = window.setTimeout(() => {
      zone.querySelectorAll<HTMLElement>('.masthead .line-mask').forEach((m) => (m.style.overflow = 'visible'));
    }, 900);

    const split = SplitText.create(words, { type: 'chars', charsClass: 'ch', aria: 'auto' });
    const chars = split.chars as HTMLElement[];
    const lifts = chars.map((c) => gsap.quickTo(c, 'y', { duration: 0.5, ease: 'power3' }));

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      chars.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
        lifts[i](-LIFT * Math.max(0, 1 - d / REACH) ** 2);
      });
    };
    const onLeave = () => lifts.forEach((l) => l(0));
    zone.addEventListener('pointermove', onMove);
    zone.addEventListener('pointerleave', onLeave);

    return () => {
      window.clearTimeout(release);
      zone.removeEventListener('pointermove', onMove);
      zone.removeEventListener('pointerleave', onLeave);
      split.revert();
    };
  });
}
export {};
