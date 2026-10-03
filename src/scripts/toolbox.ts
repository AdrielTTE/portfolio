// Toolbox: chips become draggable with inertia inside their tray. Fine
// pointers only (touch keeps page scrolling). Under reduced motion they can
// still be dragged, but they stop where released instead of gliding.
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';

gsap.registerPlugin(Draggable, InertiaPlugin);

const tray = document.querySelector<HTMLElement>('[data-tray]');
const hint = document.querySelector<HTMLElement>('[data-hint]');
if (tray) {
  const mm = gsap.matchMedia();
  mm.add('(hover: hover) and (pointer: fine)', () => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const chips = [...tray.querySelectorAll<HTMLElement>('[data-chip]')];
    tray.classList.add('live');
    if (hint) hint.hidden = false;

    // Slightly off-square so they read as loose objects, not a tag list.
    chips.forEach((c, i) => gsap.set(c, { rotation: ((i * 37) % 9) - 4 }));

    let z = 1;
    const drags = Draggable.create(chips, {
      type: 'x,y',
      bounds: tray,
      inertia: !reduced,
      edgeResistance: 0.8,
      onPress() {
        this.target.style.zIndex = String(++z);
        gsap.to(this.target, { scale: 1.08, duration: 0.2, ease: 'power2.out' });
      },
      onRelease() {
        gsap.to(this.target, { scale: 1, duration: 0.3, ease: 'power2.out' });
      },
    });

    return () => {
      drags.forEach((d) => d.kill());
      tray.classList.remove('live');
      if (hint) hint.hidden = true;
      gsap.set(chips, { clearProps: 'all' });
    };
  });
}
export {};
