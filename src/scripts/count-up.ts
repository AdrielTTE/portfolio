// Count receipts up once on first view. Text width is reserved by setting
// min-width in ch from the final string, so no layout shift. Spec §5.3 item 6.
const els = [...document.querySelectorAll<HTMLElement>('span[data-receipt]:not([hidden])')];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (els.length && !reduced && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      io.unobserve(en.target);
      const el = en.target as HTMLElement;
      const final = el.textContent ?? '';
      const target = parseFloat(final);
      if (!Number.isFinite(target)) continue;
      const decimals = final.includes('.') ? 1 : 0;
      el.style.display = 'inline-block';
      el.style.minWidth = `${final.length}ch`;
      const start = performance.now();
      const step = (t: number) => {
        const p = Math.min(1, (t - start) / 450);
        const eased = 1 - Math.pow(1 - p, 4);
        el.textContent = (target * eased).toFixed(decimals);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = final;
      };
      requestAnimationFrame(step);
    }
  }, { threshold: 0.6 });
  els.forEach((e) => io.observe(e));
}
export {};
