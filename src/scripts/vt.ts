// @ts-nocheck -- uses experimental browser APIs (Navigation, PageSwapEvent,
// PageRevealEvent) not yet in TypeScript's DOM lib; guarded at runtime below.
// Cross-document View Transition naming (docs/design-spec.md §6.1).
// Written in plain JS (no TypeScript-only syntax) because BaseLayout inlines
// this file's raw source into an `is:inline` head script: `pageswap` and
// `pagereveal` can fire before a deferred module script would even run, so
// the listeners must be registered synchronously during head parsing.
(function () {
  function slugFromWorkUrl(url) {
    if (!url) return null;
    var match = url.match(/\/work\/([^/?#]+)\/?(?:[?#].*)?$/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  function isVisible(el) {
    var rect = el.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
  }

  function nameVisibleTile(slug) {
    var tiles = document.querySelectorAll('[data-shot-slug="' + slug + '"]');
    for (var i = 0; i < tiles.length; i++) {
      if (isVisible(tiles[i])) {
        tiles[i].style.viewTransitionName = 'shot';
        return true;
      }
    }
    return false;
  }

  if ('onpageswap' in window || typeof PageSwapEvent !== 'undefined') {
    window.addEventListener('pageswap', function (event) {
      try {
        var url = event.activation && event.activation.entry && event.activation.entry.url;
        var slug = slugFromWorkUrl(url);
        if (slug) nameVisibleTile(slug);
      } catch (err) {
        /* view transitions are progressive enhancement: never block navigation */
      }
    });
  }

  if ('onpagereveal' in window || typeof PageRevealEvent !== 'undefined') {
    window.addEventListener('pagereveal', function (event) {
      try {
        var nav = window.navigation;
        var fromUrl = nav && nav.activation && nav.activation.from && nav.activation.from.url;
        var slug = slugFromWorkUrl(fromUrl);
        if (slug) {
          // Scroll restoration happens around this point; measure next frame.
          requestAnimationFrame(function () {
            nameVisibleTile(slug);
          });
        }
        if (event.viewTransition) {
          var hero = document.querySelector('.frame[data-variant="hero"]');
          if (hero) hero.classList.add('no-enter');
          event.viewTransition.finished.finally(function () {
            var named = document.querySelectorAll('[data-shot-slug]');
            for (var i = 0; i < named.length; i++) {
              var el = named[i];
              if (el.dataset.variant !== 'hero') el.style.viewTransitionName = '';
            }
          });
        }
      } catch (err) {
        /* ignore */
      }
    });
  }
})();

// No `export {}` here: this file's raw source is inlined verbatim as a
// classic (non-module) <script> in BaseLayout, where `export` is a syntax
// error. The IIFE above already keeps every declaration out of global scope.
