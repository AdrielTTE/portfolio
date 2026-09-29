// Inlined in <head> (is:inline) so theme, view and reveal classes are set
// before first paint. No dependencies, must never throw.
(function () {
  var root = document.documentElement;
  root.classList.add('js');

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced) {
    root.classList.add('js-reveal');
    // Intro reveal plays once per session (spec §5.3 item 1). Only the home
    // page has an intro, so only a home load marks it seen.
    try {
      if (sessionStorage.getItem('introSeen')) root.classList.add('intro-seen');
      else if (location.pathname === '/') sessionStorage.setItem('introSeen', '1');
    } catch (e) {
      /* storage blocked: play the intro every time */
    }
  }

  try {
    var theme = localStorage.getItem('theme');
    if (theme === 'light' || theme === 'dark') {
      root.setAttribute('data-theme', theme);
    }
  } catch (e) {
    /* localStorage unavailable (private mode, etc.): fall back to system theme */
  }
})();
