// Masthead pressure: on a mouse, the letters under the pointer relax from
// weight 800 toward 450 and spring back as it leaves. Desktop only; touch and
// reduced motion keep the plain masthead, which is also what renders without
// JavaScript.
//
// Splitting a word into letter boxes would normally lose kerning and change
// the width the masthead was sized to fill. So each box is given the exact
// advance the letter had in the intact word (measured with a Range, kerning
// included), and glyphs are centred in it. Boxes never change size, so the
// weight change moves nothing else on the page.
import { pressureWeight } from '../lib/motion';

const REST = 800;
const MIN = 450;
const REACH = 1.1; // radius, in font sizes
const EASE = 0.2; // share of the gap closed per frame

function init() {
  const h1 = document.querySelector<HTMLElement>('.masthead');
  const zone = h1?.closest<HTMLElement>('.intro');
  if (!h1 || !zone || h1.dataset.pressure) return;
  h1.dataset.pressure = '1';

  const fontPx = parseFloat(getComputedStyle(h1).fontSize);
  const letters: HTMLElement[] = [];

  h1.querySelectorAll<HTMLElement>('.line-mask > span').forEach((word) => {
    const node = word.firstChild;
    const text = word.textContent ?? '';
    if (!node || node.nodeType !== Node.TEXT_NODE || !text) return;
    // Left edge of each character in the intact word; the last one ends at the
    // word's right edge.
    const range = document.createRange();
    const edges: number[] = [];
    for (let i = 0; i < text.length; i++) {
      range.setStart(node, i);
      range.setEnd(node, i + 1);
      const r = range.getBoundingClientRect();
      edges.push(r.left);
      if (i === text.length - 1) edges.push(r.right);
    }
    const chs = document.createElement('span');
    chs.className = 'chs';
    chs.setAttribute('aria-hidden', 'true');
    [...text].forEach((ch, i) => {
      const el = document.createElement('span');
      el.className = 'ch';
      el.style.width = `${(edges[i + 1] - edges[i]) / fontPx}em`;
      el.textContent = ch;
      chs.append(el);
      letters.push(el);
    });
    const sr = document.createElement('span');
    sr.className = 'visually-hidden';
    sr.textContent = text;
    word.replaceChildren(sr, chs);
  });
  if (letters.length === 0) return;

  const weights = letters.map(() => REST);
  let target = letters.map(() => REST);
  let raf = 0;
  let pointer: { x: number; y: number } | null = null;

  const aim = () => {
    // Read every rect first, then write, so the frame does one layout.
    const reach = fontPx * REACH;
    target = letters.map((el) => {
      if (!pointer) return REST;
      const r = el.getBoundingClientRect();
      const dx = pointer.x - (r.left + r.width / 2);
      const dy = pointer.y - (r.top + r.height / 2);
      return pressureWeight(Math.hypot(dx, dy), reach, REST, MIN);
    });
  };

  const tick = () => {
    raf = 0;
    aim();
    let moving = false;
    letters.forEach((el, i) => {
      const gap = target[i] - weights[i];
      if (Math.abs(gap) < 0.5) weights[i] = target[i];
      else {
        weights[i] += gap * EASE;
        moving = true;
      }
      el.style.fontWeight = weights[i] >= REST ? '' : String(Math.round(weights[i]));
    });
    if (moving) raf = requestAnimationFrame(tick);
  };
  const wake = () => {
    if (!raf) raf = requestAnimationFrame(tick);
  };

  zone.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    pointer = { x: e.clientX, y: e.clientY };
    wake();
  });
  zone.addEventListener('pointerleave', () => {
    pointer = null;
    wake();
  });
}

if (
  matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !matchMedia('(prefers-reduced-motion: reduce)').matches &&
  document.fonts
) {
  // Measure only once the heavy face is in, or the advances are the fallback's.
  document.fonts.load('800 1em "Archivo Variable"').then(
    () => requestAnimationFrame(init),
    () => {},
  );
}
