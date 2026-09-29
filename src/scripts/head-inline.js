// Inlined in <head> (is:inline) so theme, view and reveal classes are set
// before first paint. No dependencies, must never throw.
(function () {
  var root = document.documentElement;
  root.classList.add('js');

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced) root.classList.add('js-reveal');

  try {
    var theme = localStorage.getItem('theme');
    if (theme === 'light' || theme === 'dark') {
      root.setAttribute('data-theme', theme);
    }
  } catch (e) {
    /* localStorage unavailable (private mode, etc.): fall back to system theme */
  }
})();
