// "Placed, not faded": adds `.in` once per cover so its printed objects lay
// down. Lead/hero start shortly after load (they are already on screen);
// everything else waits for an IntersectionObserver. Exits immediately under
// reduced motion (no-op: covers render at rest, see global.css). docs/design-spec.md §6.2.
if (document.documentElement.classList.contains('js-reveal')) {
  const plates = Array.from(document.querySelectorAll<HTMLElement>('.plate[data-reveal="true"]'));

  const immediate = plates.filter((p) => p.dataset.variant === 'lead' || p.dataset.variant === 'hero');
  const observed = plates.filter((p) => p.dataset.variant === 'feature');

  const start = () => {
    for (const plate of immediate) plate.classList.add('in');
  };
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(start, 120);
  } else {
    document.addEventListener('DOMContentLoaded', () => setTimeout(start, 120));
  }

  if (observed.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.25, rootMargin: '0px 0px -10% 0px' },
    );
    for (const plate of observed) observer.observe(plate);
  } else {
    for (const plate of observed) plate.classList.add('in');
  }
}

export {};
