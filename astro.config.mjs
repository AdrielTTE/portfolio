import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { execFileSync } from 'node:child_process';

// The date of the last commit that touched the files a page is made from. If
// git is unavailable or has no history for them (a shallow clone), the page
// simply gets no lastmod: a missing date is better than a made-up one.
const lastCommit = (paths) => {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', ...paths], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    return out || undefined;
  } catch {
    return undefined;
  }
};
const sourcesFor = (pathname) => {
  // Content files only: the shared layout and templates change often and do
  // not mean a page's content did, so they are left out on purpose.
  if (pathname === '/') return ['src/pages/index.astro', 'src/content/work'];
  if (pathname === '/about/') return ['src/pages/about.astro', 'src/data/about.ts', 'src/content/lately.yaml'];
  if (pathname === '/contact/') return ['src/pages/contact.astro'];
  if (pathname === '/privacy/') return ['src/pages/privacy.astro'];
  const work = pathname.match(/^\/work\/([a-z0-9-]+)\/$/);
  if (work) return [`src/content/work/${work[1]}.md`];
  const app = pathname.match(/^\/([a-z0-9-]+)\/privacy\/$/);
  if (app) return [`src/pages/${app[1]}`];
  return [];
};

// Production URL is not yet confirmed: the project deploys to Vercel automatically
// from the git repo and the assigned *.vercel.app domain (or custom domain) is not
// known yet. This placeholder must be updated once the real URL is confirmed -
// og:url, canonical links and the sitemap all derive from `site` below.
// See docs/open-items.md (also update the Sitemap line in public/robots.txt).
//
// URL convention: trailing slash. Pages build as `<route>/index.html`, so
// canonical URLs, the sitemap and every internal link use `/about/`, `/work/x/`.
export default defineConfig({
  site: 'https://appliedtheory.asia',
  output: 'static',
  integrations: [
    sitemap({
      serialize(item) {
        const sources = sourcesFor(new URL(item.url).pathname);
        const lastmod = sources.length ? lastCommit(sources) : undefined;
        if (lastmod) item.lastmod = lastmod;
        return item;
      },
    }),
  ],
  build: {
    // Inline every stylesheet into its page. A separate CSS file can be served
    // as a (cached) 404 by the CDN right after a deploy, which leaves the site
    // unstyled in some browsers until the cache is purged. Inline CSS travels
    // with the HTML, so it cannot go missing, and it saves a request.
    inlineStylesheets: 'always',
  },
});
