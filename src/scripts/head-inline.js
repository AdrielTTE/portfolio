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
    var addType = function (vt, type) {
      if (vt && vt.types && vt.types.add) vt.types.add(type);
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
      if (isHome(here) && workId(to)) {
        name(rowParts(workId(to)));
        addType(e.viewTransition, 'forward');
      } else if (workId(here) && isHome(to)) {
        name(caseParts());
        addType(e.viewTransition, 'back');
      }
    });
    // Arriving: name the matching elements before the first frame.
    addEventListener('pagereveal', function (e) {
      var nav = window.navigation;
      var from = nav && nav.activation && nav.activation.from && nav.activation.from.url;
      if (!e.viewTransition || !from) return;
      var prev = new URL(from);
      var here = new URL(location.href);
      var clear;
      if (isHome(prev) && workId(here)) {
        clear = name(caseParts());
        addType(e.viewTransition, 'forward');
      } else if (workId(prev) && isHome(here)) {
        clear = name(rowParts(workId(prev)));
        addType(e.viewTransition, 'back');
      }
      // Every page change gets the sweep; drop the class once it has played.
      var rootEl = document.documentElement;
      rootEl.classList.add('nav-sweep-on');
      setTimeout(function () {
        rootEl.classList.remove('nav-sweep-on');
      }, 800);
      var done = function () {
        if (clear) clear();
      };
      e.viewTransition.finished.then(done, done);
    });
    // Browsers without cross-document view transitions (Firefox and forks such
    // as Zen): the same page changes by hand. A click on a same-site link
    // first plays a short exit on the page, then navigates; the next page
    // plays the matching enter (global.css, .enter-*). Direction is kept in
    // sessionStorage for that one hop. Browser Back/Forward still gets the
    // enter. Not used when motion is reduced.
    var noVT = !('onpagereveal' in window);
    var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (noVT && !calm) {
      var rootEl2 = document.documentElement;
      var dirTo = function (from, to) {
        if (isHome(from) && workId(to)) return 'forward';
        if (workId(from) && isHome(to)) return 'back';
        return 'sibling';
      };
      try {
        var navEntry = performance.getEntriesByType('navigation')[0];
        var saved = sessionStorage.getItem('navDir');
        sessionStorage.removeItem('navDir');
        var dir = navEntry && navEntry.type === 'back_forward' ? 'back' : saved;
        // First visit to the home page has its own intro; skip the enter there.
        var introPlays = isHome(new URL(location.href)) && !rootEl2.classList.contains('intro-seen');
        if (dir && !introPlays) rootEl2.classList.add('enter-' + dir);
      } catch (e2) {
        /* storage blocked: no enter animation */
      }
      document.addEventListener('click', function (e) {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
        if (!a || a.target === '_blank' || a.hasAttribute('download') || a.origin !== location.origin) return;
        var to = new URL(a.href);
        var here = new URL(location.href);
        if (to.pathname === here.pathname && to.search === here.search) return; // same page or #hash
        e.preventDefault();
        try {
          sessionStorage.setItem('navDir', dirTo(here, to));
        } catch (e3) {
          /* no enter animation */
        }
        rootEl2.classList.add('leaving');
        setTimeout(function () {
          location.assign(a.href);
        }, 150);
      });
      // Back/Forward cache can restore a page that was mid-exit.
      addEventListener('pageshow', function (e) {
        if (e.persisted) rootEl2.classList.remove('leaving');
      });
    }
  } catch (err) {
    /* view transitions unsupported: plain fade */
  }
})();
