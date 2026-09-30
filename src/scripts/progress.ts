// Draggable scroll-progress bar. Where supported, fill/knob use
// `animation-timeline: scroll(root)` (see ProgressBar.astro) with no scroll
// listener; elsewhere a passive rAF-throttled listener paints them. Drag-to-scrub
// and the ARIA value work in both paths.
const bar = document.getElementById('progress');
if (bar) {
  const fill = bar.querySelector<HTMLElement>('.fill');
  const knob = bar.querySelector<HTMLElement>('.knob');

  // Browsers without scroll-driven animations (Firefox, older Safari): update
  // fill/knob from a passive, rAF-throttled scroll listener instead.
  if (!CSS.supports('animation-timeline: scroll()') && fill && knob) {
    let queued = false;
    const paint = () => {
      queued = false;
      const el = document.scrollingElement;
      const max = el ? el.scrollHeight - window.innerHeight : 0;
      const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      fill.style.transform = `scaleX(${ratio})`;
      knob.style.translate = `${ratio * bar.clientWidth - 5}px -50%`;
      bar.setAttribute('aria-valuenow', String(Math.round(ratio * 100)));
    };
    const queue = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(paint);
      }
    };
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue, { passive: true });
    paint();
  }

  const scrubTo = (clientX: number) => {
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const max = document.scrollingElement
      ? document.scrollingElement.scrollHeight - window.innerHeight
      : 0;
    window.scrollTo({ top: ratio * max, behavior: 'instant' });
    bar.setAttribute('aria-valuenow', String(Math.round(ratio * 100)));
  };

  bar.addEventListener('pointerdown', (e) => {
    bar.setPointerCapture(e.pointerId);
    bar.classList.add('drag');
    scrubTo(e.clientX);
  });
  bar.addEventListener('pointermove', (e) => {
    if (bar.classList.contains('drag')) scrubTo(e.clientX);
  });
  const stopDrag = () => bar.classList.remove('drag');
  bar.addEventListener('pointerup', stopDrag);
  bar.addEventListener('pointercancel', stopDrag);
}

export {};
