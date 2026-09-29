import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Production URL is not yet confirmed: the project deploys to Vercel automatically
// from the git repo and the assigned *.vercel.app domain (or custom domain) is not
// known yet. This placeholder must be updated once the real URL is confirmed -
// og:url, canonical links and the sitemap all derive from `site` below.
// See docs/open-items.md.
export default defineConfig({
  site: 'https://adrieltang.vercel.app',
  output: 'static',
  integrations: [sitemap()],
});
