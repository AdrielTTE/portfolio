# Developer portfolio redirect: design spec

Date: 2026-09-29. Branch: `revamp-astro`. Owner: Adriel Tang Thien Ern.
Supersedes the *visual language* of `docs/design-spec.md` (studio/object-cover direction). The build type, hosting, content rules and confirmed facts in that file and in `docs/copy.md` still apply unless this spec says otherwise.

## 1. Intent

**Goal:** reposition the portfolio from "designer showing artefacts" to "developer who ships," with the emphasis on winning freelance work, while still serving hiring managers and dev peers.

**Audience, in priority order:**
1. Freelance clients (small businesses, founders) who want a business website, a custom web app, or a mobile app.
2. Hiring managers and recruiters.
3. Developer peers.

**Offers:** business websites, custom web apps, mobile apps (Flutter).

**Success criteria:**
- A client understands within one screen what Adriel builds and how to start a project.
- Every claim is backed by real proof: a project, a real measured number, or source code.
- The site itself works as project #0 and is visibly fast, accessible and well made.
- Motion feels fluid on a mid-range Android phone (60fps at 4x CPU throttle in Chrome DevTools).
- Adding a project needs only a Markdown file and screenshots, with no new code.

**Constraints:**
- Only two real projects today (Habitect, Package Tracker). More will follow, so the design must carry thin content and scale to 40+.
- The home page must never name the employer. No Bantu2U work is shown anywhere. The About page timeline may name Bantu2U.
- Nothing is invented. Technical decisions, "what I'd change," and numbers are real or they don't render.
- Static Astro on Vercel (git CI). No CMS; content is edited in git.
- Global rules: responsive from 360px to wide desktop, animate only `transform`/`opacity`, no scroll listeners, decorative motion desktop-only, no AI-look tells.

## 2. References

| Site | Borrowed |
|---|---|
| brittanychiang.com | Scannable developer layout, with stack chips on each work row. |
| emilkowal.ski, rauno.me | Interaction craft: small, precise, interruptible motion. The copy-email "Copied" state. |
| joshwcomeau.com | Interactive explanations inside long-form writing (the diagram in case studies). |
| linear.app/changelog | Dated log rhythm (the commit log). |
| stripe.com/docs | Diagram and reading rhythm in technical prose. |
| paco.me | Plain headings with no eyebrows, and short one-line project descriptions. |

The design-agent must verify these live and record what was observed, as in `docs/design-spec.md` §1.

## 3. Page map

Routes are unchanged: `/`, `/work/[slug]`, `/about`, `/contact`, `/404`. The new collection entry `this-site` renders at `/work/this-site`.

### 3.1 Home (`/`)

1. **Intro.** The name, then the plain role line (no employer). Then one sentence on what clients get, final wording by copy-writer, along the lines of: "I build business websites, custom web apps and mobile apps: fast, maintainable, and handed over properly." Actions are a primary `Start a project →` (links to `/contact`) and the CopyEmail button. A colophon line follows with the KL LiveClock and an availability line.
2. **Offer switcher.** Tabs: Websites · Web apps · Mobile apps. Each panel holds one line describing the work, the typical stack, and the project(s) that prove it, pulled from work-collection frontmatter `offers: ('websites'|'webapps'|'mobile')[]`. Initial mapping: websites → this-site, webapps → package-tracker, mobile → habitect. It is an accessible tablist (arrow keys, `aria-selected`, roving tabindex).
3. **Work.** The lead project is shown large (screenshot in DeviceFrame plus caption), and the rest as rows. Each row shows the name, one line, stack chips (mono) and the year.
   - Desktop hover shows the cursor-follow screenshot preview.
   - Touch gets no hover preview; the row links straight through, and the thumbnail shows inline on narrow widths.
   - Scope filters render only at 6+ projects, reusing the existing `lib/work.ts` logic.
4. **Build receipts.** A strip of real numbers produced at build (§6): total page weight (KB, gzip), JS shipped (KB), Lighthouse performance score, and the deploy commit short SHA linking to the commit on GitHub. Any metric with no source data is hidden, never faked. The strip links to `/work/this-site`.
5. **Commit log.** The five most recent `lately.yaml` entries, rendered as `YYYY-MM  <type>: <message>`. The full log lives on `/about`.
6. **Footer.** Contact line, socials, a ⌘K hint and the commit SHA.

### 3.2 Global chrome

- **Header:** name/home link, Work, About, Contact, ThemeToggle, and a visible "Menu ⌘K" button that opens the command palette. The button is the touch equivalent of the shortcut.
- **Command palette** (⌘K / Ctrl+K / `/`): go to pages and projects, copy email, toggle theme, open GitHub, open LinkedIn. It uses the dialog pattern with a focus trap, Esc to close, and arrow/enter selection, and it filters as you type. It is plain HTML generated at build (no framework).

### 3.3 Case study (`/work/[slug]`)

- **Header:** the title, a one-line summary, then a facts row (role · team · year · stack · repo · live link if present). The hero is the screenshot in a DeviceFrame: `phone` for Habitect, `browser` for Package Tracker and this-site, chosen by frontmatter `device`.
- **Body sections.** Each renders only when its content exists:
  1. **The problem.** Who it's for and what was hard.
  2. **How it's built.** ArchDiagram, an inline SVG generated from frontmatter `diagram: { nodes: [{id, label, note}], edges: [[from, to]] }`. Hovering, focusing or tapping a node highlights its edges and shows its note. Nodes are keyboard-focusable. Diagram content must be derived from the real repo code.
  3. **Data model.** SchemaCard from frontmatter `schema: [{table, fields: []}]`, where relevant.
  4. **A decision worth explaining.** One real trade-off.
  5. **What I'd change.** One honest line.
  6. **What this means for your project.** Two or three lines translating the work for a freelance client.
  7. PrevNext (existing).
- **Honesty gate.** Content for sections 4–5 (and any architecture claim) is drafted from the repo code and presented to Adriel as candidates. Only confirmed items ship. If none are confirmed, the section does not render.
- **This-site case study:** stack (Astro, Vercel, vanilla TS), why static, the performance budget, the motion rules, a link to the receipts, and a source link.
- **Screenshots:** Adriel supplies them, or they are captured if the app runs locally. Until then, DeviceFrame shows a text-only placeholder built from real UI strings (no gradients, no stock images).

### 3.4 About / Contact / 404

These keep their current content. The About page gains the full commit log. All three pages adopt the new tokens, type and motion.

## 4. Visual direction

The design-agent finalises this within these constraints:
- **Neutral base, one functional accent.** The accent is used only for interactive states and data highlights. Light and dark themes both have real values (no invert hack).
- **Two typefaces:** a sans for prose and UI, and a mono for data (receipts, log, SHA, stack chips, schema, diagram labels). Banned as defaults: Inter, Space Grotesk, Fraunces, and serif + cream + terracotta. Fonts are self-hosted with `font-display: swap` and subset.
- **Mono means data, not costume.** No fake prompts, no green-on-black, no typing effect, no terminal hero.
- **Still banned:** eyebrow labels over headings, decorative 01–04 numbering, gradient placeholders, generic agency copy, and the hero → services → process → testimonial → CTA skeleton.
- Scannable density on home. Case-study prose is capped at roughly 68ch.

## 5. Motion system

### 5.1 Rules
- Animate `transform` and `opacity` only.
- No scroll event listeners. Use IntersectionObserver, or CSS `animation-timeline: view()` inside `@supports` with an IO fallback.
- Under `prefers-reduced-motion: reduce`, all motion becomes instant or an opacity-only crossfade of 150ms or less.
- Decorative motion runs only under `(hover: hover) and (pointer: fine)`. Touch gets functional motion only (state changes, palette, tabs).
- Banned: animated `filter`/`blur`, animated `clip-path`, animated `box-shadow`, `mix-blend-mode`, scroll-jacking, smooth-scroll libraries, parallax on large images, and a cursor-follower dot.
- Library: vanilla CSS plus the Web Animations API. Motion One (~4KB) is permitted only if springs are needed for palette/tabs. No GSAP, no framer-motion.

### 5.2 Tokens
- Enter easing: `cubic-bezier(0.22, 1, 0.36, 1)`. Exit easing: `cubic-bezier(0.4, 0, 1, 1)`.
- Durations: `--dur-fast: 150ms`, `--dur-base: 250ms`, `--dur-slow: 450ms`.

### 5.3 Moments
1. **Load.** The intro reveals line by line (overflow-hidden line wrapper, child `translateY(100%)`→0 with opacity, 40ms stagger). It runs once per session (sessionStorage flag, in a try/catch).
2. **Page transitions.** Astro View Transitions (`<ClientRouter />`). A work row's or lead's screenshot morphs into the case-study hero via a shared `view-transition-name: shot-<slug>`. Everything else gets a short crossfade. Browsers without support fall back to normal navigation.
3. **Offer switcher.** The active indicator slides via `transform: translateX() scaleX()`. The panel crossfades with a 6px y shift. It is interruptible: rapid switching cancels running animations instead of queueing them.
4. **Work rows (desktop only).** One fixed-size preview element follows the cursor with lerp, as a `transform` updated in a rAF loop that runs only while the pointer is inside the list. Row text shifts 4px on hover.
5. **Scroll reveals.** Sections fade and rise 12px once on first intersection. They never re-animate.
6. **Receipts.** Numbers count up once on enter, set in tabular figures with the width reserved, so there is no layout shift.
7. **Diagram.** Edges reveal on enter by opacity and a scale on a wrapper group, transform only. Hovering a node dims unrelated nodes and edges by opacity.
8. **Command palette.** It opens with scale 0.96→1 plus a fade over `--dur-base`, and the backdrop fades by opacity. The selection highlight is one element that translates between items.
9. **Theme toggle.** On desktop, a View Transition circular reveal from the toggle's position (the transition pseudo-element's `clip-path` is animated by the browser compositor, acceptable). On touch or with reduced motion it is a plain crossfade.
10. **Magnetic CTA (desktop only).** `Start a project →` translates up to 6px toward the pointer when it is within 80px, and springs back on leave.

### 5.4 Budget
- JS: 25KB gzip or less site-wide (excluding View Transitions, which are native).
- Total home page weight: 300KB or less excluding screenshots. Screenshots are AVIF/WebP via `astro:assets`, lazy below the fold, with the lead eager plus `fetchpriority="high"`.
- Lighthouse performance 95+ on mobile. CLS < 0.02.

## 6. Build receipts pipeline

- `scripts/receipts.mjs` runs after `astro build`:
  - It measures the gzip size of `dist/index.html` plus its linked CSS/JS and the total JS in `dist/`.
  - It reads `VERCEL_GIT_COMMIT_SHA` (falling back to `git rev-parse --short HEAD`, and omitting the value if both fail).
  - It reads `receipts/lighthouse.json` if present.
  - It then **injects** the values into placeholder elements (`data-receipt="page-kb"`, etc.) in the built `dist/*.html` files. This makes the numbers come from the current build. The injected text changes the page size by a few bytes, and that is accepted.
- It is wired as `"build": "astro build && node scripts/receipts.mjs"`, so Vercel CI runs it automatically. Placeholders render with the `hidden` attribute and are un-hidden only when a value is injected.
- The Lighthouse score comes from a manual `npm run lighthouse` (writes `receipts/lighthouse.json`) run against the deployed preview. The score is hidden if the file is missing.

## 7. Components

**Keep:** ThemeToggle, LiveClock, CopyEmail, ContactForm (Formspree), SkipLink, PrevNext, ProgressBar, SiteHeader/SiteFooter (reworked), Prose, Timeline, SkillGroups, `lib/work.ts`, `scripts/stress.ts`, and the `tokens.css` structure.

**Remove:**
- `src/covers/*` (Barcode, CompactLabel, Obj, Cover, all covers, registry) and `lib/plate.ts`
- ViewToggle and WorkTile (grid view returns only past 12 projects, out of scope now)
- IndexPreview (replaced)
- the `plate` frontmatter field, replaced by optional `accent`, which tints only the DeviceFrame backdrop

**Add:** DeviceFrame, OfferSwitcher, WorkList (rows plus preview), ShotPreview, ArchDiagram, SchemaCard, BuildReceipts, CommitLog (replaces LatelyLog), CommandPalette, MagneticLink, and View Transitions setup in BaseLayout.

**Content schema changes** (`src/content.config.ts`, work collection):
- `offers: enum[]`
- `device: 'phone' | 'browser'`
- `shots: image[]` (optional)
- `live: url` (optional)
- `diagram` (optional)
- `schema` (optional)
- `accent` (optional)
- `plate` is removed

`lately.yaml` gains `type` (`feat` | `fix` | `ship` | `learn` | `life`).

## 8. Content work

- **copy-writer:** intro line, offer blurbs (3), "what this means for your project" per project, the this-site case study, commit-log entry types and messages, and an updated home meta description mentioning freelance offers. The employer rule stays enforced on home.
- **Repo research:** read `github.com/AdrielTTE/Habitect` and the Package Tracker repo to draft diagram nodes/edges, the schema, and candidate decisions. Candidates go to Adriel for confirmation before they are written into content.

## 9. Testing / QA

- `astro check` and the build pass. The stress test runs at 40 projects (rows, filters, offer tabs, palette).
- Responsive at 360, 390, 768, 1024, 1440 and 1920px.
- Keyboard: tablist, palette, diagram nodes and the skip link all work. Visible focus everywhere.
- Reduced motion verified, with no content hidden behind an animation that never runs.
- Perf: Lighthouse mobile ≥ 95, and a DevTools performance trace at 4x CPU throttle shows no long frames during the palette, tabs, preview and page transitions.
- No employer name on `/` (grep of `dist/index.html`). No `[CONFIRM` strings in `dist/`.
- qa-reviewer does a final pass before merge.

## 10. Out of scope

A blog or writing section, a CMS, a CV PDF, testimonials, pricing, grid view, i18n, and analytics.
