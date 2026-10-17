// Tap a screenshot to see it large. The picture grows out of the thumbnail
// (and returns to it), follows a finger or pointer when dragged, and goes away
// if it is let go past a short distance or flicked. Everything moves with
// transform and opacity, through the Web Animations API, so it can be grabbed
// mid-flight: the animation is stopped where it is and the drag carries on from
// there. This is a pointer and touch enhancement; the screens are all reachable
// without it (tabs, arrow keys, the case study text).
import { project } from '../lib/motion';

type State = { x: number; y: number; s: number };
declare global {
  interface Window {
    __lightbox?: boolean;
  }
}

const TARGETS = '.viewer.live .phone.on, .strip .frame, .shots:not(.viewer) figure';

function install() {
  const calm = matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;

  // The dialog is built once, on first use.
  let dialog: HTMLDialogElement | null = null;
  let scrim: HTMLElement;
  let img: HTMLImageElement;
  let closeBtn: HTMLButtonElement;
  let origin: HTMLElement | null = null; // the thumbnail the picture grows from
  let anim: Animation | null = null;
  let scrimAnim: Animation | null = null;
  let busy = false;
  let st: State = { x: 0, y: 0, s: 1 };

  const spring = () => getComputedStyle(root).getPropertyValue('--spring').trim() || 'cubic-bezier(0.22, 1, 0.36, 1)';
  const css = (v: State) => `translate(${v.x}px, ${v.y}px) scale(${v.s})`;

  const build = () => {
    dialog = document.createElement('dialog');
    dialog.className = 'lb';
    dialog.setAttribute('aria-label', 'Screenshot');
    scrim = document.createElement('div');
    scrim.className = 'lb-scrim';
    img = document.createElement('img');
    img.className = 'lb-img';
    img.draggable = false;
    closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'lb-close';
    closeBtn.textContent = 'Close';
    dialog.append(scrim, img, closeBtn);
    document.body.append(dialog);

    dialog.addEventListener('cancel', (e) => {
      e.preventDefault();
      dismiss();
    });
    closeBtn.addEventListener('click', () => dismiss());
    // A tap on the empty space around the picture closes it too.
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog || e.target === scrim) dismiss();
    });

    // Drag --------------------------------------------------------------------
    type Drag = { id: number; x0: number; y0: number; base: State; drag: boolean; trail: { x: number; y: number; t: number }[] };
    let d: Drag | null = null;
    let swallow = false;
    img.addEventListener('pointerdown', (e) => {
      if (d || (e.pointerType === 'mouse' && e.button !== 0)) return;
      freeze();
      d = { id: e.pointerId, x0: e.clientX, y0: e.clientY, base: { ...st }, drag: false, trail: [{ x: e.clientX, y: e.clientY, t: e.timeStamp }] };
    });
    img.addEventListener('pointermove', (e) => {
      if (!d || e.pointerId !== d.id) return;
      const dx = e.clientX - d.x0;
      const dy = e.clientY - d.y0;
      if (!d.drag) {
        if (Math.hypot(dx, dy) < 8) return;
        d.drag = true;
        img.setPointerCapture(e.pointerId);
      }
      const away = Math.min(1, Math.hypot(dx, dy) / 400);
      st = { x: d.base.x + dx, y: d.base.y + dy, s: d.base.s * (1 - away * 0.25) };
      img.style.transform = css(st);
      scrim.style.opacity = String(1 - away * 0.9);
      d.trail.push({ x: e.clientX, y: e.clientY, t: e.timeStamp });
      while (d.trail.length > 2 && e.timeStamp - d.trail[0].t > 100) d.trail.shift();
    });
    const up = (e: PointerEvent) => {
      if (!d || e.pointerId !== d.id) return;
      const { drag, trail, x0, y0 } = d;
      d = null;
      if (!drag) return; // a tap: the click handler closes it
      swallow = true;
      setTimeout(() => (swallow = false), 0);
      const a = trail[0];
      const b = trail[trail.length - 1];
      const dt = b.t - a.t;
      const vx = e.type === 'pointercancel' || dt <= 0 ? 0 : ((b.x - a.x) / dt) * 1000;
      const vy = e.type === 'pointercancel' || dt <= 0 ? 0 : ((b.y - a.y) / dt) * 1000;
      const dx = e.clientX - x0;
      const dy = e.clientY - y0;
      const reach = Math.hypot(dx + project(vx), dy + project(vy));
      if (reach > 160) dismiss();
      else settleBack();
    };
    img.addEventListener('pointerup', up);
    img.addEventListener('pointercancel', up);
    // The tap that ends a drag must not also count as "tap to close".
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!swallow) dismiss();
    });
  };

  // Stop whatever is animating, keeping the picture where it is on screen.
  const freeze = () => {
    if (!anim && !scrimAnim) return;
    const m = new DOMMatrix(getComputedStyle(img).transform);
    st = { x: m.m41, y: m.m42, s: m.m11 };
    const so = getComputedStyle(scrim).opacity;
    anim?.cancel();
    scrimAnim?.cancel();
    anim = scrimAnim = null;
    img.style.transform = css(st);
    scrim.style.opacity = so;
    busy = false;
  };

  // Where the thumbnail is, as a transform of the picture's resting rect.
  const toThumb = (): State | null => {
    if (!origin || !origin.isConnected) return null;
    const t = (origin.querySelector('img') ?? origin).getBoundingClientRect();
    if (t.width === 0 || t.bottom < 0 || t.top > innerHeight || t.right < 0 || t.left > innerWidth) return null;
    img.style.transform = 'none';
    const r = img.getBoundingClientRect();
    return { x: t.left - r.left, y: t.top - r.top, s: t.width / r.width };
  };

  const run = (from: State, to: State, scrimFrom: number, scrimTo: number, ms: number, done?: () => void) => {
    if (calm.matches) {
      img.style.transform = css(to);
      scrim.style.opacity = String(scrimTo);
      done?.();
      return;
    }
    busy = true;
    const easing = spring();
    anim = img.animate([{ transform: css(from) }, { transform: css(to) }], { duration: ms, easing, fill: 'forwards' });
    scrimAnim = scrim.animate([{ opacity: scrimFrom }, { opacity: scrimTo }], { duration: ms * 0.8, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' });
    anim.onfinish = () => {
      img.style.transform = css(to);
      scrim.style.opacity = String(scrimTo);
      anim?.cancel();
      scrimAnim?.cancel();
      anim = scrimAnim = null;
      busy = false;
      done?.();
    };
  };

  const settleBack = () => {
    const s0 = parseFloat(scrim.style.opacity || '1');
    run({ ...st }, { x: 0, y: 0, s: 1 }, s0, 1, 380, () => (st = { x: 0, y: 0, s: 1 }));
  };

  const dismiss = () => {
    if (!dialog?.open) return;
    freeze();
    const s0 = parseFloat(scrim.style.opacity || '1');
    const home = toThumb();
    const target = home ?? { x: st.x, y: st.y + 40, s: st.s * 0.9 };
    img.style.transform = css(st);
    const finish = () => {
      img.getAnimations().forEach((a) => a.cancel());
      dialog!.close();
      root.style.overflow = '';
      origin?.focus?.({ preventScroll: true });
      origin = null;
    };
    run({ ...st }, target, s0, 0, 360, finish);
    if (!home && !calm.matches) img.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' });
  };

  const open = (target: HTMLElement) => {
    const thumb = target.querySelector('img');
    if (!thumb) return;
    if (!dialog) build();
    origin = target;
    // The largest size the page already offers.
    const candidates = (thumb.srcset || '').split(',').map((c) => c.trim().split(/\s+/)[0]).filter(Boolean);
    img.alt = thumb.alt;
    dialog!.setAttribute('aria-label', thumb.alt || 'Screenshot');
    img.src = candidates[candidates.length - 1] || thumb.currentSrc || thumb.src;
    img.style.opacity = '';
    img.style.transform = 'none';
    scrim.style.opacity = '0';
    const start = () => {
      if (!dialog || dialog.open) return;
      root.style.overflow = 'hidden';
      dialog.showModal();
      closeBtn.blur();
      const from = toThumb() ?? { x: 0, y: 24, s: 0.92 };
      st = { x: 0, y: 0, s: 1 };
      run(from, { x: 0, y: 0, s: 1 }, 0, 1, 460);
    };
    // Wait for the picture so it can be measured; never wait long.
    const ready = img.decode ? img.decode().catch(() => {}) : Promise.resolve();
    Promise.race([ready, new Promise((r) => setTimeout(r, 600))]).then(start);
  };

  // Which thumbnail was already the chosen one when the press began (a press on
  // a neighbour in the phone fan selects it; only the chosen one enlarges).
  let chosenAtDown: HTMLElement | null = null;
  document.addEventListener(
    'pointerdown',
    (e) => {
      const t = (e.target as Element | null)?.closest<HTMLElement>(TARGETS);
      chosenAtDown = t ?? null;
    },
    true,
  );
  document.addEventListener('click', (e) => {
    if (busy && dialog?.open) return;
    const t = (e.target as Element | null)?.closest<HTMLElement>(TARGETS);
    if (!t || t !== chosenAtDown || (e.target as Element).closest('a, button')) return;
    open(t);
  });
}

if (!window.__lightbox) {
  window.__lightbox = true;
  install();
}

export {};
