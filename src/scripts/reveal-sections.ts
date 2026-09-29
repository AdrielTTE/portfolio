// One-time fade/rise for [data-reveal] sections; never re-animates.
// Only active under .js-reveal (motion allowed), so no-JS and reduced
// motion always show content. Spec §5.3 item 5.
const els = document.querySelectorAll<HTMLElement>('.js-reveal [data-reveal]');
if (els.length && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      }
    },
    // threshold 0, not a fraction: a section taller than ~10 viewports (the
    // 40-row stress list on a phone) could never reach 10% visible.
    { rootMargin: '0px 0px -10% 0px', threshold: 0 },
  );
  els.forEach((el) => io.observe(el));
} else els.forEach((el) => el.classList.add('in'));
export {};
