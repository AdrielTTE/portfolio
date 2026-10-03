// Pinned "selected work" scene. Wide screens with a fine pointer and no
// reduced-motion preference only: the section pins, scroll scrubs the
// timeline (phone screens crossfade, then the next project slides in), and the
// phone leans a few degrees toward the pointer. Everywhere else the stacked
// layout in Showcase.astro stays as is.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const scene = document.querySelector<HTMLElement>('[data-scene]');
if (scene) {
  const mm = gsap.matchMedia();
  mm.add(
    '(min-width: 900px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    () => {
      const projs = [...scene.querySelectorAll<HTMLElement>('[data-proj]')];
      const bar = scene.querySelector<HTMLElement>('[data-bar]');
      const stage = scene.querySelector<HTMLElement>('.pin');
      scene.classList.add('pinned');

      // Initial state: first project showing its first screen.
      projs.forEach((p, i) => {
        gsap.set(p, { autoAlpha: i === 0 ? 1 : 0, yPercent: i === 0 ? 0 : 8 });
        p.querySelectorAll('[data-phone]').forEach((ph, j) => gsap.set(ph, { autoAlpha: j === 0 ? 1 : 0 }));
      });

      // Per project: crossfade each extra screen, then hand over to the next.
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: scene,
          start: 'top top',
          end: () => `+=${projs.length * 150}%`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      projs.forEach((p, i) => {
        const phones = [...p.querySelectorAll('[data-phone]')];
        phones.slice(1).forEach((ph) => tl.to(ph, { autoAlpha: 1, duration: 1 }, '+=0.5'));
        const next = projs[i + 1];
        if (next) {
          tl.to(p, { autoAlpha: 0, yPercent: -8, duration: 0.6, ease: 'power1.in' }, '+=0.5');
          tl.fromTo(next, { autoAlpha: 0, yPercent: 8 }, { autoAlpha: 1, yPercent: 0, duration: 0.6, ease: 'power1.out' }, '>');
        }
      });
      tl.to({}, { duration: 0.5 });
      if (bar) tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: tl.duration(), ease: 'none' }, 0);

      // Pointer lean: transform only, no perspective.
      const phoneSets = [...scene.querySelectorAll<HTMLElement>('[data-phones]')];
      const rots = phoneSets.map((el) => gsap.quickTo(el, 'rotation', { duration: 0.6, ease: 'power3' }));
      const xs = phoneSets.map((el) => gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3' }));
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return;
        const nx = (e.clientX / innerWidth) * 2 - 1;
        rots.forEach((r) => r(nx * 3));
        xs.forEach((x) => x(nx * 14));
      };
      stage?.addEventListener('pointermove', onMove);

      return () => {
        stage?.removeEventListener('pointermove', onMove);
        scene.classList.remove('pinned');
        scene
          .querySelectorAll('[data-proj], [data-phone], [data-phones], [data-bar]')
          .forEach((el) => gsap.set(el, { clearProps: 'all' }));
      };
    },
  );
}
export {};
