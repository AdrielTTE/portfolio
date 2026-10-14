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

// Container transform between a Work row and its case study: the row's title
// and app icon glide into the case-study headline and icon (and back), on the
// cross-document View Transitions in global.css. This lives here, inline in
// <head>, because pagereveal fires before the first paint: a deferred module
// script registers too late. A view-transition-name must be unique on a page,
// so names go only to the one project involved, only while it travels.
(function () {
  try {
    var TITLE = 'work-title';
    var MARK = 'work-mark';
    var workId = function (u) {
      var m = u.pathname.match(/^\/work\/([a-z0-9-]+)\/?$/);
      return m && m[1];
    };
    var isHome = function (u) {
      return u.pathname === '/';
    };
    var name = function (pairs) {
      var named = [];
      pairs.forEach(function (p) {
        if (p[0]) {
          p[0].style.viewTransitionName = p[1];
          named.push(p[0]);
        }
      });
      return function () {
        named.forEach(function (el) {
          el.style.viewTransitionName = '';
        });
      };
    };
    var rowParts = function (id) {
      var row = document.querySelector('.work-row[data-work="' + id + '"]');
      if (!row) return [];
      row.classList.add('in'); // revealed state, so the morph lands on the real size
      return [[row.querySelector('.tw'), TITLE], [row.querySelector('.mk'), MARK]];
    };
    var caseParts = function () {
      return [
        [document.querySelector('.case-study h1'), TITLE],
        [document.querySelector('.case-study .mark-slot'), MARK],
      ];
    };
    // Leaving: name the elements captured as the old state.
    addEventListener('pageswap', function (e) {
      if (!e.viewTransition || !e.activation || !e.activation.entry) return;
      var to = new URL(e.activation.entry.url);
      var here = new URL(location.href);
      if (isHome(here) && workId(to)) name(rowParts(workId(to)));
      else if (workId(here) && isHome(to)) name(caseParts());
    });
    // Arriving: name the matching elements before the first frame.
    addEventListener('pagereveal', function (e) {
      var nav = window.navigation;
      var from = nav && nav.activation && nav.activation.from && nav.activation.from.url;
      if (!e.viewTransition || !from) return;
      var prev = new URL(from);
      var here = new URL(location.href);
      var clear;
      if (isHome(prev) && workId(here)) clear = name(caseParts());
      else if (workId(prev) && isHome(here)) clear = name(rowParts(workId(prev)));
      var done = function () {
        if (clear) clear();
      };
      e.viewTransition.finished.then(done, done);
    });
  } catch (err) {
    /* view transitions unsupported: plain fade */
  }
})();
