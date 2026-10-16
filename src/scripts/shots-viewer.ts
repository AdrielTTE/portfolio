// Phone viewer on case studies: tabs swap the screen shown in the frame.
// Click or tap, hover (fine pointers), arrow keys, and a swipe or drag all
// work. Without JS the screens stay side by side (see Shots.astro).
//
// The swipe follows the pointer 1:1 from where it was grabbed, resists at the
// first and last screen, and on release projects where the flick was heading
// and springs there (a bouncier spring only when there was real momentum).
import { project, rubberband } from '../lib/motion';

const HYSTERESIS = 10; // px before a press becomes a drag (or is given up to scrolling)
const FLICK = 600; // px/s above which the settle gets a little bounce

document.querySelectorAll<HTMLElement>('[data-viewer]').forEach((viewer) => {
  const tabs = [...viewer.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
  const phones = [...viewer.querySelectorAll<HTMLElement>('.phone')];
  const caps = [...viewer.querySelectorAll<HTMLElement>('.cap')];
  const live = viewer.querySelector<HTMLElement>('[data-live]');
  if (tabs.length < 2 || tabs.length !== phones.length) return;
  viewer.classList.add('live');
  const calm = matchMedia('(prefers-reduced-motion: reduce)');

  const select = (i: number, focus = false) => {
    tabs.forEach((t, j) => {
      t.setAttribute('aria-selected', String(i === j));
      t.tabIndex = i === j ? 0 : -1;
    });
    // `--o` is each phone's offset from the chosen one; on wide screens the
    // neighbours sit either side as a dimmed fan (see Shots.astro).
    phones.forEach((p, j) => {
      p.classList.toggle('on', i === j);
      p.classList.toggle('near', Math.abs(j - i) === 1);
      p.style.setProperty('--o', String(j - i));
    });
    caps.forEach((c, j) => c.classList.toggle('on', i === j));
    if (live) live.textContent = phones[i].querySelector('img')?.alt ?? '';
    if (focus) tabs[i].focus();
  };

  let current = 0;
  // The bouncy settle belongs to a flick only; any other change (tab, tap, key)
  // gets the plain critically damped spring.
  const pick = (i: number, focus = false, flick = false) => {
    if (!flick) viewer.removeAttribute('data-flick');
    current = i;
    select(i, focus);
  };
  phones.forEach((p, j) => p.addEventListener('click', () => pick(j)));
  pick(0);

  // Swipe / drag ---------------------------------------------------------------
  const stage = viewer.querySelector<HTMLElement>('.phones');
  const fan = matchMedia('(min-width: 1024px)');
  const last = phones.length - 1;
  type Press = { id: number; x0: number; y0: number; drag: boolean; off: number; trail: { x: number; t: number }[] };
  let press: Press | null = null;
  let swallow = false;

  // How far one screen is from the next, in px.
  const span = () => {
    const w = phones[current].offsetWidth || 240;
    return fan.matches ? w * 0.96 : w;
  };
  const apply = (off: number) => {
    const w = span();
    viewer.style.setProperty('--dx', `${off}px`);
    if (!fan.matches) {
      viewer.style.setProperty('--p', String(Math.min(1, Math.abs(off) / (w * 0.8))));
      const next = off < 0 ? current + 1 : current - 1;
      phones.forEach((el, j) => el.classList.toggle('peek', j === next && off !== 0));
    }
  };
  const reset = () => {
    viewer.classList.remove('dragging');
    viewer.style.removeProperty('--dx');
    viewer.style.removeProperty('--p');
    phones.forEach((el) => el.classList.remove('peek'));
  };
  const velocity = (trail: Press['trail']) => {
    const a = trail[0];
    const b = trail[trail.length - 1];
    return b.t > a.t ? ((b.x - a.x) / (b.t - a.t)) * 1000 : 0;
  };

  stage?.addEventListener('pointerdown', (e) => {
    if (press || (e.pointerType === 'mouse' && e.button !== 0)) return;
    press = { id: e.pointerId, x0: e.clientX, y0: e.clientY, drag: false, off: 0, trail: [{ x: e.clientX, t: e.timeStamp }] };
  });
  stage?.addEventListener('pointermove', (e) => {
    if (!press || e.pointerId !== press.id) return;
    const dx = e.clientX - press.x0;
    const dy = e.clientY - press.y0;
    if (!press.drag) {
      if (Math.hypot(dx, dy) < HYSTERESIS) return;
      // Mostly vertical: that is a scroll, not ours.
      if (Math.abs(dy) > Math.abs(dx)) {
        press = null;
        return;
      }
      press.drag = true;
      stage.setPointerCapture(e.pointerId);
      viewer.classList.add('dragging');
      viewer.removeAttribute('data-flick');
    }
    const w = span();
    // Pulling past the first or last screen: resist, don't stop dead.
    const past = (current === 0 && dx > 0) || (current === last && dx < 0);
    press.off = past ? rubberband(dx, w) : dx;
    press.trail.push({ x: e.clientX, t: e.timeStamp });
    // Velocity is read over the last ~100ms only.
    while (press.trail.length > 2 && e.timeStamp - press.trail[0].t > 100) press.trail.shift();
    apply(press.off);
  });
  const release = (e: PointerEvent) => {
    if (!press || e.pointerId !== press.id) return;
    const { drag, off, trail } = press;
    press = null;
    if (!drag) return; // a plain tap: the click handlers deal with it
    swallow = true;
    setTimeout(() => (swallow = false), 0);
    const v = e.type === 'pointercancel' ? 0 : velocity(trail);
    // Where the flick would have come to rest, in screens.
    const steps = Math.round((off + project(v)) / span());
    const target = Math.max(0, Math.min(last, current - steps));
    const flick = Math.abs(v) > FLICK && !calm.matches;
    if (flick) viewer.setAttribute('data-flick', '');
    reset();
    pick(target, false, flick);
  };
  stage?.addEventListener('pointerup', release);
  stage?.addEventListener('pointercancel', release);
  // A drag that ends over a phone must not also count as a click on it.
  stage?.addEventListener('click', (e) => {
    if (swallow) e.stopPropagation();
  }, true);

  const hover = matchMedia('(hover: hover) and (pointer: fine)').matches;
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => pick(i));
    if (hover) tab.addEventListener('pointerenter', () => pick(i));
    tab.addEventListener('keydown', (e) => {
      const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
      if (!step) return;
      e.preventDefault();
      pick((i + step + tabs.length) % tabs.length, true);
    });
  });
});
export {};
