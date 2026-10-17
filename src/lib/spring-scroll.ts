// Scroll the page to a height with a critically damped spring: no fixed
// duration, so a short hop and a long one both settle smoothly, and no
// overshoot. Anything the reader does (wheel, touch, a key, a press) takes over
// at once from where the page is. Reduced motion jumps.
let raf = 0;
let stop: (() => void) | null = null;

export function cancelSpringScroll(): void {
  stop?.();
}

export function springScrollTo(target: number, response = 0.5): void {
  cancelSpringScroll();
  const max = document.documentElement.scrollHeight - innerHeight;
  const to = Math.max(0, Math.min(max, target));
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || Math.abs(to - scrollY) < 2) {
    scrollTo({ top: to, behavior: 'instant' as ScrollBehavior });
    return;
  }
  const w = (2 * Math.PI) / response;
  const a = scrollY - to;
  const t0 = performance.now();
  const events = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;
  const end = () => {
    cancelAnimationFrame(raf);
    events.forEach((ev) => removeEventListener(ev, end));
    stop = null;
  };
  stop = end;
  events.forEach((ev) => addEventListener(ev, end, { passive: true, once: true }));
  const step = (now: number) => {
    const t = (now - t0) / 1000;
    const x = to + a * (1 + w * t) * Math.exp(-w * t);
    if (t > 1.5 || Math.abs(x - to) < 0.5) {
      scrollTo({ top: to, behavior: 'instant' as ScrollBehavior });
      end();
      return;
    }
    scrollTo({ top: x, behavior: 'instant' as ScrollBehavior });
    raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
}
