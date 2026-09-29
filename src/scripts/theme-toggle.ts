// Cycles the theme Auto -> Light -> Dark, persists it, and updates the two
// <meta name="theme-color"> tags so the browser chrome matches immediately.
const STATES = ['auto', 'light', 'dark'] as const;
type ThemeState = (typeof STATES)[number];

function currentState(): ThemeState {
  const stored = localStorage.getItem('theme');
  return stored === 'light' || stored === 'dark' ? stored : 'auto';
}

const PAPER = { light: '#F4F5F6', dark: '#0E0F11' };

function updateMetaThemeColor(state: ThemeState) {
  const light = document.querySelector('meta[name="theme-color"][media*="light"]');
  const dark = document.querySelector('meta[name="theme-color"][media*="dark"]');
  if (!light || !dark) return;
  if (state === 'auto') {
    light.setAttribute('media', '(prefers-color-scheme: light)');
    dark.setAttribute('media', '(prefers-color-scheme: dark)');
  } else {
    // Force both tags to the chosen colour regardless of system scheme.
    light.setAttribute('media', '');
    dark.setAttribute('media', '');
    light.setAttribute('content', PAPER[state]);
    dark.setAttribute('content', PAPER[state]);
  }
}

function apply(state: ThemeState) {
  const root = document.documentElement;
  root.classList.add('theme-switching');
  if (state === 'auto') {
    root.removeAttribute('data-theme');
    localStorage.removeItem('theme');
  } else {
    root.setAttribute('data-theme', state);
    localStorage.setItem('theme', state);
  }
  updateMetaThemeColor(state);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => root.classList.remove('theme-switching'));
  });
}

function label(state: ThemeState): string {
  return state === 'auto' ? 'Auto' : state === 'light' ? 'Light' : 'Dark';
}

const button = document.getElementById('theme-toggle');
if (button) {
  const textEl = button.querySelector('span');
  const state = currentState();
  if (textEl) textEl.textContent = label(state);
  button.setAttribute('aria-label', `Colour theme: ${label(state)}`);
  if (state !== 'auto') updateMetaThemeColor(state);

  button.addEventListener('click', () => {
    const next = STATES[(STATES.indexOf(currentState()) + 1) % STATES.length];
    // Spec §5.3 item 9: circular reveal from the toggle on desktop; plain
    // crossfade on touch; instant under reduced motion.
    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = document.documentElement;
    if (typeof document.startViewTransition === 'function' && !reduced) {
      if (fine) {
        const r = button.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const radius = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy));
        // Scopes the "animation: none" on the root snapshots to this
        // transition only (global.css), so navigations keep their crossfade.
        root.classList.add('theme-vt');
        const vt = document.startViewTransition(() => apply(next));
        vt.ready
          .then(() => {
            root.animate(
              { clipPath: [`circle(0px at ${cx}px ${cy}px)`, `circle(${radius}px at ${cx}px ${cy}px)`] },
              { duration: 450, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' },
            );
          })
          .catch(() => {});
        vt.finished.catch(() => {}).finally(() => root.classList.remove('theme-vt'));
      } else {
        // Default root crossfade from global.css (opacity only).
        document.startViewTransition(() => apply(next));
      }
    } else {
      apply(next);
    }
    if (textEl) textEl.textContent = label(next);
    button.setAttribute('aria-label', `Colour theme: ${label(next)}`);
  });
}

export {};
