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
    // Browsers without cross-document view transitions (Firefox and forks such
    // as Zen) have no page-to-page animation, so they get the orange sweep
    // across the top on load instead (see global.css). The home intro already
    // animates, so skip it when that is about to play.
    if (!('onpagereveal' in window) && !(location.pathname === '/' && !root.classList.contains('intro-seen'))) {
      root.classList.add('no-vt');
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

// Page changes. Chrome and Safari fade the old page out and the new one in with
// cross-document view transitions (global.css); we add the orange sweep when
// one happens. Firefox and forks such as Zen have no such feature, so a click
// plays the exit by hand and the next page plays the enter (.leaving and
// .entering in global.css). Not used when motion is reduced.
(function () {
  try {
    var root = document.documentElement;
    addEventListener('pagereveal', function (e) {
      if (!e.viewTransition) return;
      root.classList.add('nav-sweep-on');
      setTimeout(function () {
        root.classList.remove('nav-sweep-on');
      }, 800);
    });

    var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if ('onpagereveal' in window || calm) return;

    try {
      var navEntry = performance.getEntriesByType('navigation')[0];
      var flagged = sessionStorage.getItem('navEnter');
      sessionStorage.removeItem('navEnter');
      // First visit to the home page has its own intro; skip the enter there.
      var introPlays = location.pathname === '/' && !root.classList.contains('intro-seen');
      if ((flagged || (navEntry && navEntry.type === 'back_forward')) && !introPlays) root.classList.add('entering');
    } catch (e2) {
      /* storage blocked: no enter animation */
    }
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!a || a.target === '_blank' || a.hasAttribute('download') || a.origin !== location.origin) return;
      var to = new URL(a.href);
      if (to.pathname === location.pathname && to.search === location.search) return; // same page or #hash
      e.preventDefault();
      try {
        sessionStorage.setItem('navEnter', '1');
      } catch (e3) {
        /* no enter animation */
      }
      root.classList.add('leaving');
      setTimeout(function () {
        location.assign(a.href);
      }, 120);
    });
    // The back/forward cache can restore a page that was mid-exit.
    addEventListener('pageshow', function (e) {
      if (e.persisted) root.classList.remove('leaving');
    });
  } catch (err) {
    /* view transitions unsupported: plain page change */
  }
})();
