// Toggles the theme Light <-> Dark (light is the default), persists it, and
// updates the <meta name="theme-color"> tags so the browser chrome matches immediately.
// Storage can throw (private mode, blocked site data), so every access is
// guarded, as in head-inline.js: the toggle still works for the page's life.
const STATES = ['light', 'dark'] as const;
type ThemeState = (typeof STATES)[number];

function readStored(): string | null {
  try {
    return localStorage.getItem('theme');
  } catch {
    return null;
  }
}

function writeStored(state: ThemeState) {
  try {
    localStorage.setItem('theme', state);
  } catch {
    /* storage unavailable: the choice lasts until the next load */
  }
}

function currentState(): ThemeState {
  // The root attribute is the source of truth once the page is up, so a
  // blocked storage write still cycles correctly.
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'light' || attr === 'dark') return attr;
  const stored = readStored();
  return stored === 'dark' ? 'dark' : 'light';
}

const PAPER = { light: '#F1EEEA', dark: '#14100C' };

function updateMetaThemeColor(state: ThemeState) {
  const tag = document.querySelector('meta[name="theme-color"]');
  if (tag) tag.setAttribute('content', PAPER[state]);
}

function apply(state: ThemeState) {
  const root = document.documentElement;
  root.classList.add('theme-switching');
  root.setAttribute('data-theme', state);
  writeStored(state);
  updateMetaThemeColor(state);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => root.classList.remove('theme-switching'));
  });
}

function label(state: ThemeState): string {
  return state === 'light' ? 'Light' : 'Dark';
}

const button = document.getElementById('theme-toggle');
if (button) {
  const textEl = button.querySelector('.theme-label');
  const sync = (state: ThemeState) => {
    if (textEl) textEl.textContent = label(state);
    button.setAttribute('aria-label', `Colour theme: ${label(state)}`);
  };
  const state = currentState();
  sync(state);
  updateMetaThemeColor(state);

  button.addEventListener('click', () => {
    const next = STATES[(STATES.indexOf(currentState()) + 1) % STATES.length];
    // Spec §5.3 item 9, adjusted to the house motion rule (transform and
    // opacity only): the default root crossfade from global.css everywhere,
    // instant without View Transitions or under reduced motion.
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (typeof document.startViewTransition === 'function' && !reduced) {
      document.startViewTransition(() => apply(next)).finished.catch(() => {});
    } else {
      apply(next);
    }
    sync(next);
  });
}

export {};
