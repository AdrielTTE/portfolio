// Client-side navigation. A click on a same-site link fetches the next page,
// swaps <main>, the footer, the head metadata and the page CSS into the live
// document, and runs the change inside document.startViewTransition so every
// browser that has it (Chrome, Safari, Firefox and forks such as Zen) plays the
// same push: the old page slides left while the new one comes in from the
// right, and Back reverses it. The header, command palette, font and theme
// stay alive across pages, so nothing is reparsed or re-laid-out from scratch.
//
// It never traps anyone: anything unexpected (a non-HTML or non-200 response,
// a page without <main>, any error) falls back to a normal page load. Reduced
// motion swaps without the transition. The per-page scripts are small module
// scripts; after a swap they are run again against the new content (the
// persistent ones, in the header and palette, guard against binding twice).
declare global {
  interface Window {
    __router?: { go: (href: string) => void };
  }
}

const HEAD_SELECTORS = [
  'meta[name="description"]',
  'meta[name="robots"]',
  'link[rel="canonical"]',
  'meta[property^="og:"]',
  'meta[name^="twitter:"]',
  'script[type="application/ld+json"]',
];

function install() {
  const root = document.documentElement;
  const cache = new Map<string, Promise<string | null>>();
  let navId = 0;
  let idx = 0;
  let current = location.pathname + location.search;
  let runs = 0;

  // A swap is silent to a screen reader (no page load), so say where we are.
  const announcer = document.createElement('div');
  announcer.className = 'visually-hidden';
  announcer.setAttribute('role', 'status');
  announcer.setAttribute('aria-live', 'polite');
  document.body.appendChild(announcer);

  history.scrollRestoration = 'manual';
  history.replaceState({ ...(history.state || {}), idx }, '');

  // The home intro plays once per session; after it has played, mark it seen
  // so coming back to the home page by navigation does not replay it.
  const settleIntro = () => {
    if (location.pathname === '/' && !root.classList.contains('intro-seen')) {
      setTimeout(() => root.classList.add('intro-seen'), 2500);
    }
  };
  settleIntro();

  // Only the site's own pages. Not assets, and not /cdn-cgi/: Cloudflare serves
  // its own pages there (the email-protection link it puts in place of a
  // mailto, for one), and those must be left to the browser.
  const isPage = (u: URL) =>
    (u.protocol === 'http:' || u.protocol === 'https:') &&
    u.origin === location.origin &&
    !/\.[a-z0-9]{2,5}$/i.test(u.pathname.replace(/\.html$/i, '')) &&
    !u.pathname.startsWith('/_astro/') &&
    !u.pathname.startsWith('/cdn-cgi/');

  const load = (u: URL): Promise<string | null> => {
    const key = u.pathname + u.search;
    let hit = cache.get(key);
    if (!hit) {
      hit = fetch(key, { credentials: 'same-origin' })
        .then((r) => (r.ok && /text\/html/.test(r.headers.get('content-type') || '') ? r.text() : null))
        .catch(() => null);
      if (cache.size > 16) cache.delete(cache.keys().next().value as string);
      cache.set(key, hit);
    }
    return hit;
  };

  const hardNavigate = (href: string) => location.assign(href);

  const syncHead = (doc: Document) => {
    for (const sel of HEAD_SELECTORS) {
      document.head.querySelectorAll(sel).forEach((el) => el.remove());
      doc.head.querySelectorAll(sel).forEach((el) => document.head.appendChild(document.adoptNode(el)));
    }
  };

  // The page CSS is inlined per page: add the new page's <style> before
  // removing the old, so there is never an unstyled frame.
  const syncStyles = (doc: Document) => {
    const olds = [...document.head.querySelectorAll('style')];
    const news = [...doc.head.querySelectorAll('style')];
    // Case study to case study shares identical CSS: nothing to parse or recalc.
    if (olds.length === news.length && olds.every((o, i) => o.textContent === news[i].textContent)) return;
    news.forEach((el) => document.head.appendChild(document.adoptNode(el)));
    olds.forEach((el) => el.remove());
  };

  const syncHeader = (doc: Document) => {
    doc.querySelectorAll<HTMLAnchorElement>('header.site-header a[href]').forEach((next) => {
      const cur = document.querySelector(`header.site-header a[href="${next.getAttribute('href')}"]`);
      if (!cur) return;
      const v = next.getAttribute('aria-current');
      if (v === null) cur.removeAttribute('aria-current');
      else cur.setAttribute('aria-current', v);
    });
  };

  // The new page's module scripts, read before the swap: the ones inside
  // <main> and the footer travel with those elements and are gone from the
  // parsed copy afterwards.
  const collectScripts = (doc: Document) =>
    [...doc.querySelectorAll<HTMLScriptElement>('script[type="module"]')].map((s) => ({
      src: s.getAttribute('src'),
      code: s.textContent || '',
    }));

  // Run them again. Inline ones are imported from a Blob so we can wait for
  // them; ones with imports, and external ones, are loaded by URL with a fresh
  // query so the browser executes them again.
  const rerun = async (scripts: { src: string | null; code: string }[]) => {
    const jobs: Promise<unknown>[] = [];
    scripts.forEach((s) => {
      const src = s.src;
      if (src) {
        jobs.push(import(/* @vite-ignore */ new URL(src, location.href).href + '?r=' + ++runs).catch(() => null));
      } else {
        const code = s.code;
        if (!code.trim()) return;
        if (/^\s*import[\s{*"']/m.test(code)) {
          const el = document.createElement('script');
          el.type = 'module';
          el.textContent = code;
          document.body.appendChild(el);
        } else {
          const url = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));
          jobs.push(import(/* @vite-ignore */ url).catch(() => null).finally(() => URL.revokeObjectURL(url)));
        }
      }
    });
    await Promise.all(jobs);
  };

  const swap = (doc: Document, url: URL, opts: { pop: boolean; scroll?: number }) => {
    if (opts.pop) idx = history.state?.idx ?? idx;
    else {
      idx += 1;
      history.pushState({ idx }, '', url.pathname + url.search + url.hash);
    }
    current = url.pathname + url.search;
    document.title = doc.title;
    syncHead(doc);
    syncStyles(doc);
    syncHeader(doc);
    const main = document.getElementById('main');
    const nextMain = doc.getElementById('main');
    if (!main || !nextMain) throw new Error('no main');
    main.replaceWith(document.adoptNode(nextMain));
    const foot = document.getElementById('site-footer');
    const nextFoot = doc.getElementById('site-footer');
    if (foot && nextFoot) foot.replaceWith(document.adoptNode(nextFoot));
    else if (foot) foot.remove();
    else if (nextFoot) document.body.insertBefore(document.adoptNode(nextFoot), document.querySelector('#palette'));
    const target = url.hash ? document.getElementById(decodeURIComponent(url.hash.slice(1))) : null;
    if (target) target.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
    else window.scrollTo({ top: opts.pop ? opts.scroll ?? 0 : 0, behavior: 'instant' as ScrollBehavior });
    document.getElementById('main')?.focus({ preventScroll: true });
    announcer.textContent = '';
    setTimeout(() => (announcer.textContent = doc.title), 60);
    settleIntro();
  };

  const navigate = async (href: string, dir: 'forward' | 'back', opts: { pop: boolean; scroll?: number }) => {
    const id = ++navId;
    const url = new URL(href, location.href);
    try {
      const text = await load(url);
      if (id !== navId) return;
      if (text === null) return hardNavigate(href);
      const doc = new DOMParser().parseFromString(text, 'text/html');
      if (!doc.getElementById('main')) return hardNavigate(href);
      history.replaceState({ ...(history.state || {}), idx, scroll: window.scrollY }, '');

      const scripts = collectScripts(doc);
      const update = async () => {
        swap(doc, url, opts);
        await rerun(scripts);
      };
      const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!calm && typeof document.startViewTransition === 'function') {
        root.dataset.nav = dir;
        const vt = document.startViewTransition(update);
        vt.finished.then(
          () => {
            if (id === navId) delete root.dataset.nav;
          },
          () => {
            if (id === navId) delete root.dataset.nav;
          },
        );
        await vt.updateCallbackDone;
      } else {
        await update();
      }
    } catch {
      hardNavigate(href);
    }
  };

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
    if (!a || a.target === '_blank' || a.hasAttribute('download') || a.hasAttribute('data-no-router') || /\bexternal\b/.test(a.rel)) return;
    const url = new URL(a.href, location.href);
    if (!isPage(url)) return;
    if (url.pathname + url.search === current) {
      // Same page: let #hash links scroll natively; the logo just goes to the top.
      if (!url.hash) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    e.preventDefault();
    void navigate(url.href, 'forward', { pop: false });
  });

  addEventListener('popstate', () => {
    const key = location.pathname + location.search;
    if (key === current) return; // a #hash change on the same page
    const toIdx = history.state?.idx ?? 0;
    const dir = toIdx < idx ? 'back' : 'forward';
    void navigate(location.href, dir, { pop: true, scroll: history.state?.scroll });
  });

  // Warm the cache when a link is about to be used.
  const warm = (e: Event) => {
    const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
    if (!a || a.target === '_blank' || a.hasAttribute('data-no-router')) return;
    const url = new URL(a.href, location.href);
    if (isPage(url) && url.pathname + url.search !== current) void load(url);
  };
  document.addEventListener('pointerover', warm, { passive: true });
  document.addEventListener('focusin', warm);
  document.addEventListener('touchstart', warm, { passive: true });

  window.__router = { go: (href: string) => void navigate(new URL(href, location.href).href, 'forward', { pop: false }) };
}

// The script is part of every page, so it runs again after each swap: install once.
if (!window.__router) install();

export {};
