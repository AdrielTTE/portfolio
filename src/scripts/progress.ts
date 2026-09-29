// Draggable scroll-progress bar. No scroll listener: the fill/knob use
// `animation-timeline: scroll(root)` (see ProgressBar.astro). This script only
// handles the drag-to-scrub interaction and the ARIA value during drag.
const bar = document.getElementById('progress');
if (bar && CSS.supports('animation-timeline: scroll()')) {
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
