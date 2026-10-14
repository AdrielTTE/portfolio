// TEMPORARY page-transition tester. Hidden unless a page is opened with ?t=0..6;
// the choice then sticks for the tab (sessionStorage) and a small picker shows
// bottom-left. Delete this file, src/styles/tx-tester.css, its import in
// global.css, the script in BaseLayout and the data-tx guard in head-inline.js
// once a style is chosen. Runs in <head> before first paint.
(function () {
  try {
    var root = document.documentElement;
    var q = new URLSearchParams(location.search).get('t');
    if (q !== null && /^[0-6]$/.test(q)) sessionStorage.setItem('tx', q);
    var tx = sessionStorage.getItem('tx');
    if (tx === null) return;
    root.setAttribute('data-tx', tx);
    var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

    var nav = performance.getEntriesByType('navigation')[0];
    var internal = false;
    try {
      internal = !!document.referrer && new URL(document.referrer).origin === location.origin;
    } catch (e) {}
    if (!calm && nav && ((nav.type === 'navigate' && internal) || nav.type === 'back_forward')) root.classList.add('tx-arrive');

    // Back/forward gets the reverse direction in the lift and push styles.
    addEventListener('pagereveal', function (e) {
      var n = window.navigation;
      if (e.viewTransition && e.viewTransition.types && n && n.activation && n.activation.navigationType === 'traverse') {
        e.viewTransition.types.add('back');
      }
    });

    // Curtain styles (3 and 5): cover the page first, then navigate; the next
    // page starts covered and uncovers.
    try {
      if (sessionStorage.getItem('txCover') === '1') {
        sessionStorage.removeItem('txCover');
        var t0 = sessionStorage.getItem('txTitle') || '';
        root.style.setProperty('--tx-title', JSON.stringify(t0));
        if (!calm) root.classList.add('tx-uncover');
      }
    } catch (e) {}
    document.addEventListener('click', function (e) {
      var cur = root.getAttribute('data-tx');
      if ((cur !== '3' && cur !== '5') || calm) return;
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!a || a.target === '_blank' || a.hasAttribute('download') || a.origin !== location.origin) return;
      var to = new URL(a.href);
      if (to.pathname === location.pathname && to.search === location.search) return;
      e.preventDefault();
      var seg = to.pathname.split('/').filter(Boolean).pop() || 'Home';
      var title = seg.replace(/-/g, ' ');
      try {
        sessionStorage.setItem('txCover', '1');
        sessionStorage.setItem('txTitle', title);
      } catch (e2) {}
      root.style.setProperty('--tx-title', JSON.stringify(title));
      root.classList.add('tx-cover');
      setTimeout(function () {
        location.assign(a.href);
      }, 240);
    });
    addEventListener('pageshow', function (e) {
      if (e.persisted) root.classList.remove('tx-cover');
    });

    // The picker.
    var names = ['Fade (now)', 'Lift away', 'Push', 'Curtain', 'Rise', 'Title', 'Instant'];
    var hints = ['', 'Chrome only', 'Chrome only', '', '', '', ''];
    document.addEventListener('DOMContentLoaded', function () {
      var box = document.createElement('div');
      box.className = 'tx-panel';
      box.setAttribute('role', 'group');
      box.setAttribute('aria-label', 'Page transition style (temporary)');
      var html = '<b>Transition</b>';
      for (var i = 0; i < names.length; i++) {
        html += '<button type="button" data-n="' + i + '">' + i + ' ' + names[i] + (hints[i] ? ' <i>' + hints[i] + '</i>' : '') + '</button>';
      }
      box.innerHTML = html;
      document.body.appendChild(box);
      var mark = function () {
        var cur = root.getAttribute('data-tx');
        [].forEach.call(box.querySelectorAll('button'), function (b) {
          b.setAttribute('aria-pressed', String(b.getAttribute('data-n') === cur));
        });
      };
      mark();
      box.addEventListener('click', function (e) {
        var b = e.target.closest && e.target.closest('button');
        if (!b) return;
        sessionStorage.setItem('tx', b.getAttribute('data-n'));
        root.setAttribute('data-tx', b.getAttribute('data-n'));
        mark();
      });
    });
  } catch (err) {}
})();
