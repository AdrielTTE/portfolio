// Magnetic CTA: up to 6px toward the pointer within 80px. Desktop only.
// Listens on the nearest [data-magnet-zone] (or enclosing section) rather
// than the window, and only reads one small rect per move. The halo is not a
// child of the link, so clicking near the button never follows it.
// Spec §5.3 item 10.
import { magnetOffset } from '../lib/motion';

const RADIUS = 80;
const MAX = 6;

if (
  matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !matchMedia('(prefers-reduced-motion: reduce)').matches
) {
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const zone = el.closest<HTMLElement>('[data-magnet-zone], section') ?? el.parentElement;
    if (!zone) return;
    let ox = 0;
    let oy = 0;
    const set = (x: number, y: number) => {
      if (x === ox && y === oy) return;
      ox = x;
      oy = y;
      el.style.transform = x || y ? `translate3d(${x}px, ${y}px, 0)` : '';
    };
    zone.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = el.getBoundingClientRect();
      // Subtract the current offset so the rest position is the reference.
      const cx = r.left - ox + r.width / 2;
      const cy = r.top - oy + r.height / 2;
      // Measure from the button's edge, not its centre, so the 80px reach is
      // the same on every side of a wide pill.
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const ex = Math.sign(dx) * Math.max(0, Math.abs(dx) - r.width / 2);
      const ey = Math.sign(dy) * Math.max(0, Math.abs(dy) - r.height / 2);
      const inside = ex === 0 && ey === 0;
      // Inside the button: lean by the centre offset, reaching MAX at the edge
      // so it meets the outside falloff without a jump.
      const { x, y } = inside
        ? { x: (dx / (r.width / 2)) * MAX, y: (dy / (r.height / 2)) * MAX }
        : magnetOffset(ex, ey, RADIUS, MAX);
      set(Math.round(x * 10) / 10, Math.round(y * 10) / 10);
    });
    zone.addEventListener('pointerleave', () => set(0, 0));
  });
}
export {};
