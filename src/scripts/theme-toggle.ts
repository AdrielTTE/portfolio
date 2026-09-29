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
    apply(next);
    if (textEl) textEl.textContent = label(next);
    button.setAttribute('aria-label', `Colour theme: ${label(next)}`);
  });
}

export {};
