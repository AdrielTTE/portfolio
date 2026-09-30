# Adriel Tang: portfolio

Static [Astro](https://astro.build) site for Adriel Tang, deployed to [Vercel](https://vercel.com) as static output (no adapter). Content lives in Markdown/YAML content collections under `src/content/`; there's no CMS, and edits go through git.

See `docs/design-spec.md` for the full design spec, `docs/copy.md` for on-page copy, and `docs/open-items.md` for facts still open with the owner.

## Getting started

```bash
npm install
npm run dev      # http://localhost:4321
npm run check    # astro check (TypeScript + template diagnostics)
npm run build    # static build to dist/
npm run preview  # serve the dist/ build locally
npm test         # vitest unit tests
npm run lighthouse -- <url>  # manual: writes receipts/lighthouse.json; commit it
```

`npm run build` also runs `scripts/receipts.mjs`, which measures page weight and JS shipped on every build and injects them into the "Built like this" receipts. The Lighthouse receipt only appears when a committed `receipts/lighthouse.json` exists; it is a manual run, not part of the build.

## Project structure

- `src/content/work/*.md` - one file per project (case study body + frontmatter facts)
- `src/content/lately.yaml` - the home page's dated "Lately" log
- `src/data/` - typed data that isn't a content collection (site links, about-page bio/timeline/skills)
- `src/lib/` - small typed helpers (work ordering, offers, diagram layout, palette, inline code), unit-tested in `tests/`
- `src/components/`, `src/layouts/` - Astro components and the shared page layout
- `src/scripts/` - vanilla TypeScript, one file per behaviour (theme, progress bar, work list, view transitions, etc.)
- `src/styles/` - design tokens and global CSS

## Deploying

Deploys to Vercel automatically from this repo (static build, no server runtime). `vercel.json` holds the redirects from the old Next.js site's URLs. See `docs/open-items.md` for the production URL, which is not yet confirmed - `astro.config.mjs`'s `site` value (and the OG/canonical/sitemap URLs derived from it) plus the `Sitemap:` line in `public/robots.txt` will need updating once it is. Internal links use trailing slashes (`/about/`, `/work/<slug>/`).
