# Developer Portfolio Redirect Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the studio-style Astro portfolio into a developer portfolio that wins freelance work: an offer switcher, a technical case-study template with an interactive architecture diagram, real build receipts, a ⌘K command palette, and a fluid transform/opacity-only motion system.

**Architecture:** Static Astro 7 site on Vercel. All logic that can be pure lives in `src/lib/*.ts` and is unit-tested with Vitest. Astro components render at build time, and small vanilla TS `<script>` modules add behaviour. Page transitions use native cross-document View Transitions (already wired through `src/scripts/vt.ts`). Build receipts are measured by a Node postbuild script that injects values into the built HTML.

**Tech Stack:** Astro 7, TypeScript, vanilla CSS with custom properties, Vitest (new dev dependency), Node `zlib`/`fs` for receipts, Fontsource variable fonts.

**Spec:** `docs/superpowers/specs/2026-09-29-dev-portfolio-design.md` (read it before starting any task).

## Global Constraints

- Animate only `transform` and `opacity`. No scroll event listeners (IntersectionObserver only). No animated `filter`, `clip-path` (except the browser-run theme View Transition), `box-shadow`, or `mix-blend-mode`.
- Every motion respects `prefers-reduced-motion: reduce`: instant, or an opacity-only fade of 150ms or less.
- Decorative motion (cursor preview, magnetic CTA, row text shift) runs only under `(hover: hover) and (pointer: fine)`.
- Easing: enter `cubic-bezier(0.22, 1, 0.36, 1)`, exit `cubic-bezier(0.4, 0, 1, 1)`. Durations 150 / 250 / 450ms.
- JS budget: 25KB gzip or less site-wide. No GSAP, no framer-motion, no React. Motion One is allowed only if a task explicitly needs springs; none of these tasks do.
- Fonts: never Inter, Space Grotesk, or Fraunces. Mono is for data only (no fake prompts, no typing effect, no green-on-black).
- No eyebrow labels, no decorative 01–04 numbering, no gradient placeholders.
- The home page (`dist/index.html`) must not contain "Bantu2U". No `[CONFIRM` strings anywhere in `dist/`.
- Nothing invented: diagram, schema, "decision", "what I'd change," and receipt numbers come from real sources, or they do not render.
- Responsive from 360px to 1920px. Every hover affordance has a touch equivalent.
- Keep the existing code idiom: header comment on each file citing the spec section, vanilla TS modules ending in `export {};`, and scoped `<style>` in components.

## Review Focus

1. **An offer with zero projects.** The tab for that offer must not render. An empty panel must never show. Tested in Task 2 (`projectsForOffer`) and enforced in Task 6.
2. **A diagram edge that references an unknown node id, or a diagram with a cycle.** The build must fail with a clear Zod message naming the bad id. Layout must terminate on cycles. Tested in Task 9.
3. **A palette query with no matches.** It shows "No results", and Enter does nothing (no navigation to a stale item). Tested in Task 8.
4. **Receipts with a missing git SHA, missing Lighthouse JSON, or an unreadable dist file.** The affected placeholders stay `hidden`, and the build still succeeds. Tested in Task 7.
5. **JS disabled or reduced motion.** All content is visible. Reveal hiding applies only under `.js-reveal`, which `head-inline.js` sets only when motion is allowed. Verified in Task 12.

---

## File Structure

**Create**
- `vitest.config.ts`: test runner config.
- `src/lib/offers.ts`: offer ids, labels, `projectsForOffer`, `offersWithProjects`.
- `src/lib/commitlog.ts`: `toCommitLine`.
- `src/lib/palette.ts`: `Command` type, `filterCommands`.
- `src/lib/diagram.ts`: `layoutDiagram`, `connectedTo`.
- `src/lib/motion.ts`: `lerp`, `magnetOffset`.
- `scripts/receipts.mjs`: postbuild measure and inject (the CLI entry).
- `scripts/receipts-lib.mjs`: pure functions for receipts (tested).
- `scripts/lighthouse.mjs`: writes `receipts/lighthouse.json`.
- `src/components/DeviceFrame.astro`
- `src/components/OfferSwitcher.astro`
- `src/components/WorkList.astro`
- `src/components/BuildReceipts.astro`
- `src/components/CommitLog.astro`
- `src/components/CommandPalette.astro`
- `src/components/ArchDiagram.astro`
- `src/components/SchemaCard.astro`
- `src/components/CaseSection.astro`
- `src/components/MagneticLink.astro`
- `src/scripts/offers.ts`
- `src/scripts/shot-preview.ts`
- `src/scripts/palette.ts`
- `src/scripts/diagram.ts`
- `src/scripts/magnetic.ts`
- `src/scripts/reveal-sections.ts`
- `src/scripts/count-up.ts`
- `src/content/work/this-site.md`
- `tests/*.test.ts`: one per lib.
- Docs created by the gate task: `docs/design-addendum.md`, `docs/copy-dev.md`, `docs/case-study-candidates.md`.

**Modify**
- `package.json`: scripts, vitest.
- `src/content.config.ts`: schema.
- `src/content/work/*.md` and `src/content/lately.yaml`: content.
- `src/styles/tokens.css` and `src/styles/global.css`: tokens and base styles.
- `src/layouts/BaseLayout.astro`: fonts, palette, and footer SHA.
- `src/components/SiteHeader.astro` and `src/components/SiteFooter.astro`
- `src/pages/index.astro`, `src/pages/work/[slug].astro`, `src/pages/about.astro`, `src/pages/404.astro`, `src/pages/contact.astro`
- `src/scripts/vt.ts`: rename `data-cover-slug` to `data-shot-slug`.
- `src/scripts/theme-toggle.ts`: circular reveal.
- `src/scripts/stress.ts`: target the new list.
- `src/scripts/head-inline.js`: drop `workView`.

**Delete**
- `src/covers/` (whole directory) and `src/lib/plate.ts`
- `src/components/WorkSection.astro`, `WorkTile.astro`, `ViewToggle.astro`, `IndexPreview.astro`, `IndexList.astro`, `IndexRow.astro`, `LeadProject.astro`, `LatelyLog.astro`, `ScopeFilters.astro` (its filter logic moves into WorkList, shown only at 6+ projects)
- `src/scripts/reveal.ts` and `src/scripts/work-list.ts`
- The `@fontsource-variable/archivo` and `@fontsource-variable/roboto` dependencies (they were used only by the covers)

---

### Task 0: Design, copy, and case-study gate (non-code; blocks Tasks 3+)

**Files:**
- Create: `docs/design-addendum.md` (design-agent, opus)
- Create: `docs/case-study-candidates.md` (general-purpose research agent, sonnet)
- Create: `docs/copy-dev.md` (copy-writer, sonnet)

**Interfaces:**
- Produces: the token values for the fixed token names listed in Task 3, the font pair (Fontsource package names), all on-page strings, and a confirmed diagram/schema/decision/change per project.

- [ ] **Step 1: Dispatch design-agent.**
  - Input: the spec, `docs/design-spec.md` §1, and the global CLAUDE.md design rules.
  - It must verify the spec §2 references live and record its observations.
  - It must output values for exactly these tokens, for both light and dark themes: `--c-bg`, `--c-bg-2`, `--c-ink`, `--c-ink-2`, `--c-rule`, `--c-accent`, `--c-accent-ink` (text on accent), `--c-focus`, `--c-error`.
  - It must also output a sans + mono pair as Fontsource variable package names (banned: Inter, Space Grotesk, Fraunces; JetBrains Mono is allowed and already installed) with metric-override fallbacks, a type scale mapped to `--step--1…--step-5`, and layout sketches for the home, case study and palette at 360px and 1440px.
  - Contrast: `--c-ink-2` on `--c-bg` must be 4.5:1 or better, and `--c-accent` on `--c-bg` 3:1 or better for UI.
- [ ] **Step 2: Dispatch the repo research agent.**
  - Read `https://github.com/AdrielTTE/Habitect` and `https://github.com/AdrielTTE/Integrative-Programming-Assignment` (source, not only the README).
  - For each project, output:
    - (a) `diagram` nodes/edges in the exact YAML shape from Task 2, each node with a one-line `note` citing the file path it was derived from
    - (b) a `schema` from migrations/models (Package Tracker) or local storage models (Habitect)
    - (c) 2–3 candidate "decision" statements, and (d) 2–3 candidate "what I'd change" statements, each citing code evidence
  - Nothing may go beyond what the code shows.
- [ ] **Step 3: Dispatch copy-writer.** Input: the spec §3 and §8, `docs/copy.md` (tone and confirmed facts), and the employer rule. Output `docs/copy-dev.md` with:
  - the intro sentence
  - three offer blurbs (15 words or fewer each) and a typical stack per offer
  - a "What this means for your project" line for each project
  - the full body of the this-site case study
  - commit-log `type` values for the existing `lately.yaml` entries
  - the new home meta title/description (under 60 and under 160 characters)
  - palette command labels
- [ ] **Step 4: Ask Adriel to confirm or reject each candidate in `docs/case-study-candidates.md`.** Mark each `CONFIRMED`/`REJECTED` in the file. **Stop here until he answers.** Rejected items are not used.
- [ ] **Step 5: Commit**

```bash
git add docs/design-addendum.md docs/copy-dev.md docs/case-study-candidates.md
git commit -m "docs: design addendum, dev copy, confirmed case-study facts"
```

---

### Task 1: Vitest harness + existing work helpers under test

**Files:**
- Create: `vitest.config.ts`, `tests/work.test.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `npm test` (runs `vitest run`) and a `makeEntry(data)` test helper exported from `tests/helpers.ts`.

- [ ] **Step 1: Install**

Run: `npm i -D vitest@^3`

- [ ] **Step 2: Config and scripts**

`vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: { include: ['tests/**/*.test.ts'], environment: 'node' },
});
```

`package.json` scripts (replace the `build` line and add `test`):
```json
"build": "astro build && node scripts/receipts.mjs",
"test": "vitest run",
"lighthouse": "node scripts/lighthouse.mjs"
```
Note: `scripts/receipts.mjs` does not exist until Task 7. Until then, build with `npx astro build`.

- [ ] **Step 3: Test helper + failing tests for the existing helpers**

`tests/helpers.ts`:
```ts
// Minimal stand-in for CollectionEntry<'work'>: only the fields lib code reads.
export function makeEntry(id: string, data: Record<string, unknown>) {
  return {
    id,
    collection: 'work',
    data: { featured: false, order: 0, offers: [], stack: ['x'], year: 2025, scope: 'Web app', ...data },
  } as any;
}
```

`tests/work.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { getLead, getPrevNext, scopeCounts } from '../src/lib/work';
import { makeEntry } from './helpers';

const a = makeEntry('a', { title: 'A', order: 1, featured: true });
const b = makeEntry('b', { title: 'B', order: 2, featured: true, scope: 'Mobile app' });
const c = makeEntry('c', { title: 'C', order: 3 });

describe('work helpers', () => {
  it('lead is lowest-order featured', () => {
    expect(getLead([c, b, a])?.id).toBe('a');
  });
  it('prev/next follow order and stop at ends', () => {
    expect(getPrevNext([a, b, c], 'a')).toEqual({ prev: undefined, next: { title: 'B', slug: 'b' } });
    expect(getPrevNext([a, b, c], 'c').next).toBeUndefined();
    expect(getPrevNext([a, b, c], 'zzz')).toEqual({});
  });
  it('scopeCounts sorts by count desc', () => {
    expect(scopeCounts([a, b, c])[0]).toEqual({ scope: 'Web app', n: 2 });
  });
});
```

- [ ] **Step 4: Run.** `npm test`. Expected: PASS (3 tests). These pin existing behaviour before the refactor.
- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts package.json package-lock.json tests/
git commit -m "test: add vitest and pin work helpers"
```

---

### Task 2: Content schema, offers lib, commit-log lib, content migration

**Files:**
- Create: `src/lib/offers.ts`, `src/lib/commitlog.ts`, `tests/offers.test.ts`, `tests/commitlog.test.ts`, `src/content/work/this-site.md`
- Modify: `src/content.config.ts`, `src/content/work/habitect.md`, `src/content/work/package-tracker.md`, `src/content/lately.yaml`

**Interfaces:**
- Produces:
  - `type OfferId = 'websites' | 'webapps' | 'mobile'`
  - `OFFERS: { id: OfferId; label: string }[]`
  - `projectsForOffer(entries: WorkEntry[], offer: OfferId): WorkEntry[]`
  - `offersWithProjects(entries: WorkEntry[]): { id: OfferId; label: string; projects: WorkEntry[] }[]`
  - `toCommitLine(e: { date: Date; type: CommitType; text: string }): { stamp: string; type: CommitType; text: string }`
  - `type CommitType = 'feat' | 'fix' | 'ship' | 'learn' | 'life'`
  - Work frontmatter fields `offers`, `device`, `shots`, `live`, `diagram`, `schema`, `accent`, and the body-section fields `problem`, `decision`, `change`, `forYou`

- [ ] **Step 1: Failing tests**

`tests/offers.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { projectsForOffer, offersWithProjects } from '../src/lib/offers';
import { makeEntry } from './helpers';

const site = makeEntry('this-site', { title: 'This site', order: 0, offers: ['websites'] });
const pt = makeEntry('package-tracker', { title: 'PT', order: 2, offers: ['webapps'] });
const hab = makeEntry('habitect', { title: 'Hab', order: 1, offers: ['mobile', 'webapps'] });

describe('offers', () => {
  it('filters by offer, sorted by order', () => {
    expect(projectsForOffer([pt, hab, site], 'webapps').map((e) => e.id)).toEqual(['habitect', 'package-tracker']);
  });
  it('drops offers with no projects', () => {
    const out = offersWithProjects([pt]);
    expect(out.map((o) => o.id)).toEqual(['webapps']);
  });
  it('keeps canonical tab order websites, webapps, mobile', () => {
    expect(offersWithProjects([hab, pt, site]).map((o) => o.id)).toEqual(['websites', 'webapps', 'mobile']);
  });
});
```

`tests/commitlog.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { toCommitLine } from '../src/lib/commitlog';

describe('toCommitLine', () => {
  it('formats YYYY-MM from a UTC date and trims a trailing period', () => {
    expect(toCommitLine({ date: new Date('2026-05-01T00:00:00Z'), type: 'ship', text: 'Started full-time.' })).toEqual({
      stamp: '2026-05',
      type: 'ship',
      text: 'started full-time',
    });
  });
  it('lowercases only the first character', () => {
    expect(toCommitLine({ date: new Date('2025-08-01T00:00:00Z'), type: 'feat', text: 'Built Package Tracker' }).text).toBe(
      'built Package Tracker',
    );
  });
});
```

- [ ] **Step 2: Run.** `npm test`. Expected: FAIL (modules not found).
- [ ] **Step 3: Implement**

`src/lib/offers.ts`:
```ts
// Offer tabs on the home page. A tab renders only when at least one project
// declares that offer in its frontmatter. Spec §3.1 item 2.
import type { WorkEntry } from './work';
import { sortByOrder } from './work';

export type OfferId = 'websites' | 'webapps' | 'mobile';

export const OFFERS: { id: OfferId; label: string }[] = [
  { id: 'websites', label: 'Websites' },
  { id: 'webapps', label: 'Web apps' },
  { id: 'mobile', label: 'Mobile apps' },
];

export function projectsForOffer(entries: WorkEntry[], offer: OfferId): WorkEntry[] {
  return sortByOrder(entries.filter((e) => (e.data.offers as OfferId[]).includes(offer)));
}

export function offersWithProjects(entries: WorkEntry[]) {
  return OFFERS.map((o) => ({ ...o, projects: projectsForOffer(entries, o.id) })).filter((o) => o.projects.length > 0);
}
```

`src/lib/commitlog.ts`:
```ts
// Lately entries rendered as a dated commit list. Spec §3.1 item 5.
export type CommitType = 'feat' | 'fix' | 'ship' | 'learn' | 'life';

export function toCommitLine(e: { date: Date; type: CommitType; text: string }) {
  const stamp = `${e.date.getUTCFullYear()}-${String(e.date.getUTCMonth() + 1).padStart(2, '0')}`;
  const trimmed = e.text.trim().replace(/\.$/, '');
  return { stamp, type: e.type, text: trimmed.charAt(0).toLowerCase() + trimmed.slice(1) };
}
```

- [ ] **Step 4: Schema.** Replace the work schema in `src/content.config.ts` with:

```ts
const node = z.object({ id: z.string().regex(/^[a-z0-9-]+$/), label: z.string(), note: z.string() });

const diagram = z
  .object({ nodes: z.array(node).min(2), edges: z.array(z.tuple([z.string(), z.string()])) })
  .superRefine((d, ctx) => {
    const ids = new Set(d.nodes.map((n) => n.id));
    d.edges.forEach(([from, to], i) => {
      for (const id of [from, to]) {
        if (!ids.has(id)) ctx.addIssue({ code: 'custom', path: ['edges', i], message: `Unknown diagram node id "${id}"` });
      }
    });
  });

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string().max(160),
      scope: z.string(),
      stack: z.array(z.string()).min(1),
      year: z.number().int(),
      role: z.string(),
      team: z.string().optional(),
      repo: z.url().optional(),
      live: z.url().optional(),
      offers: z.array(z.enum(['websites', 'webapps', 'mobile'])).default([]),
      device: z.enum(['phone', 'browser']).default('browser'),
      shots: z.array(z.object({ src: image(), alt: z.string() })).default([]),
      accent: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
      diagram: diagram.optional(),
      schema: z.array(z.object({ table: z.string(), fields: z.array(z.string()).min(1) })).optional(),
      problem: z.string().optional(),
      decision: z.string().optional(),
      change: z.string().optional(),
      forYou: z.string().optional(),
      featured: z.boolean().default(false),
      order: z.number().default(0),
    }),
});
```

Update the lately schema to `z.object({ date: z.coerce.date(), type: z.enum(['feat', 'fix', 'ship', 'learn', 'life']), text: z.string().max(140) })`.

- [ ] **Step 5: Migrate content.**
  - `habitect.md`: remove `plate` and `coverAlt`. Add `offers: ["mobile"]` and `device: "phone"`. Add `problem`, `forYou`, and any **CONFIRMED** `decision`/`change`/`diagram`/`schema` from `docs/case-study-candidates.md`, copied verbatim.
  - `package-tracker.md`: same, with `offers: ["webapps"]` and `device: "browser"`.
  - Create `this-site.md`: `title: "This site"`, `order: 0`, `featured: false`, `offers: ["websites"]`, `device: "browser"`, `stack: ["Astro", "TypeScript", "CSS", "Vercel"]`, `year: 2026`, `role: "Design and build"`, `repo: "https://github.com/AdrielTTE/portfolio"`, `scope: "Website"`, the summary and body from `docs/copy-dev.md`, and a `diagram` with nodes `content`, `astro`, `receipts`, `vercel`, `browser` (edges in that order).
  - `lately.yaml`: add `type` to each entry, per `docs/copy-dev.md`.
- [ ] **Step 6: Run.** `npm test` (expect PASS). Then `npx astro sync`. Expected: no schema errors. A diagram edge typo must print `Unknown diagram node id`: check by temporarily editing an edge in `this-site.md`, running sync, and reverting.
- [ ] **Step 7: Commit**

```bash
git add src/lib/offers.ts src/lib/commitlog.ts tests/ src/content.config.ts src/content/
git commit -m "feat: offers, commit log, and case-study fields in content schema"
```

(The build stays broken until Task 4 removes the `plate` and cover usages. That is expected: only `astro sync` and `npm test` gate this task.)

---

### Task 3: Tokens, fonts, motion tokens

**Files:**
- Modify: `src/styles/tokens.css`, `src/styles/global.css`, `src/layouts/BaseLayout.astro`, `package.json`

**Interfaces:**
- Consumes: `docs/design-addendum.md` values.
- Produces these token names, used by every later task:
  - `--c-bg --c-bg-2 --c-ink --c-ink-2 --c-rule --c-accent --c-accent-ink --c-focus --c-error`
  - `--font-sans --font-mono`
  - `--step--1…--step-5`, and the existing `--space-*`, `--section`, `--gutter`, `--margin`, `--header-h`
  - `--ease-enter --ease-exit --dur-fast --dur-base --dur-slow`

- [ ] **Step 1: Rename the colour tokens.**
  - Replace `--c-paper` with `--c-bg` and `--c-paper-2` with `--c-bg-2` across `src/` (use `grep -rl "c-paper" src`, then edit each file).
  - Delete `--c-signal`, `--c-field-border`, `--font-waybill`, `--font-habitect`, and `--font-device`. Replace any remaining uses of `--c-field-border` with `--c-ink-2`.
  - Set all colour values in `:root`, the dark media block, and `[data-theme='dark']` from the addendum.
- [ ] **Step 2: Motion tokens.** Replace the `/* motion */` block with:

```css
  /* motion (spec §5.2) */
  --ease-enter: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);
  --dur-fast: 150ms;
  --dur-base: 250ms;
  --dur-slow: 450ms;
```

Then run `grep -rn "dur-morph\|dur-place\|dur-hover\|dur-ui\|ease-settle\|ease-out" src` and map each hit: `dur-ui`→`dur-fast`, `dur-hover`→`dur-base`, `dur-morph`/`dur-place`→`dur-slow`, `ease-settle`/`ease-out`→`ease-enter`.

Append to `global.css`:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
  }
}
```

- [ ] **Step 3: Fonts.**
  - Run `npm i <sans package from addendum>` and `npm uninstall @fontsource-variable/archivo @fontsource-variable/roboto` (and `@fontsource-variable/hanken-grotesk` if the addendum drops it).
  - In `BaseLayout.astro`, swap the `hankenWoff2` import and preload for the new sans latin woff2 `?url` import.
  - Update the `--font-sans` stack and the fallback `@font-face` overrides with the addendum's metrics.
  - Update the `theme-color` meta values and `PAPER` in `theme-toggle.ts` to the new `--c-bg` values.
- [ ] **Step 4: Verify.** Run `grep -rn "c-paper\|c-signal\|font-waybill\|font-habitect\|dur-morph" src`. Expected: only hits inside `src/covers/` and the files Task 4 deletes. Run `npm test`: PASS.
- [ ] **Step 5: Commit**

```bash
git add -A src/styles src/layouts package.json package-lock.json src/scripts/theme-toggle.ts
git commit -m "feat: developer palette, font pair, and motion tokens"
```

---

### Task 4: DeviceFrame + remove covers/plates; case-study hero uses screenshots

**Files:**
- Create: `src/components/DeviceFrame.astro`
- Modify: `src/pages/work/[slug].astro`, `src/scripts/vt.ts`, `src/styles/global.css` (the view-transition names), `src/components/FactsRow.astro`, `src/components/FooterStrip.astro`, `src/components/SkillGroups.astro`, `src/components/Timeline.astro`, `src/pages/about.astro` (plate references only)
- Delete: `src/covers/`, `src/lib/plate.ts`, `src/scripts/reveal.ts`

**Interfaces:**
- Produces: `<DeviceFrame project={WorkEntry} variant="hero" | "lead" | "thumb" eager?={boolean} />`. The rendered root carries `data-shot-slug={project.id}` and `data-variant`. The hero variant sets `style="view-transition-name: shot"`.

- [ ] **Step 1: Build DeviceFrame.**

```astro
---
// Screenshot in a phone or browser frame. Placeholder (real UI strings, no
// imagery) when a project has no shots yet. Spec §3.3, §7.
import { Image } from 'astro:assets';
import type { WorkEntry } from '../lib/work';

interface Props { project: WorkEntry; variant: 'hero' | 'lead' | 'thumb'; eager?: boolean }
const { project, variant, eager = false } = Astro.props;
const { device, shots, title, summary, accent } = project.data;
const shot = shots[0];
const widths = variant === 'thumb' ? [240, 480] : [640, 960, 1280, 1920];
---
<figure
  class={`frame frame--${device} frame--${variant}`}
  data-shot-slug={project.id}
  data-variant={variant}
  style={[accent && `--frame-tint:${accent}`, variant === 'hero' && 'view-transition-name: shot'].filter(Boolean).join(';')}
>
  <div class="bezel" aria-hidden={shot ? undefined : 'true'}>
    {device === 'browser' && <div class="chrome"><span></span><span></span><span></span></div>}
    <div class="screen">
      {shot ? (
        <Image
          src={shot.src}
          alt={shot.alt}
          widths={widths}
          sizes={variant === 'thumb' ? '240px' : '(min-width: 1024px) 60vw, 100vw'}
          loading={eager ? 'eager' : 'lazy'}
          fetchpriority={eager ? 'high' : 'auto'}
        />
      ) : (
        <div class="placeholder">
          <strong>{title}</strong>
          <span>{summary}</span>
        </div>
      )}
    </div>
  </div>
</figure>

<style>
  .frame { margin: 0; background: color-mix(in srgb, var(--frame-tint, var(--c-bg-2)) 14%, var(--c-bg-2)); border-radius: 12px; padding: clamp(16px, 4vw, 48px); display: grid; place-items: center; }
  .frame--thumb { padding: 8px; border-radius: 8px; }
  .bezel { width: 100%; border: 1px solid var(--c-rule); background: var(--c-bg); overflow: hidden; }
  .frame--browser .bezel { border-radius: 10px; }
  .frame--phone .bezel { width: min(100%, 320px); aspect-ratio: 9 / 19.5; border-radius: 36px; padding: 10px; }
  .frame--thumb.frame--phone .bezel { width: 60px; border-radius: 12px; padding: 3px; }
  .chrome { display: flex; gap: 6px; padding: 10px 12px; border-bottom: 1px solid var(--c-rule); }
  .chrome span { width: 8px; height: 8px; border-radius: 50%; background: var(--c-rule); }
  .screen { aspect-ratio: 16 / 10; overflow: hidden; }
  .frame--phone .screen { aspect-ratio: auto; height: 100%; border-radius: 28px; }
  .screen :global(img) { width: 100%; height: 100%; object-fit: cover; object-position: top; display: block; }
  .placeholder { height: 100%; display: flex; flex-direction: column; justify-content: center; gap: 8px; padding: 24px; font-family: var(--font-mono); font-size: var(--step--1); color: var(--c-ink-2); }
  .placeholder strong { color: var(--c-ink); font-size: var(--step-1); font-family: var(--font-sans); }
  .frame--thumb .placeholder { padding: 6px; }
  .frame--thumb .placeholder span { display: none; }
</style>
```

- [ ] **Step 2: Swap Cover for DeviceFrame in `[slug].astro`.** Replace the import and the `<Cover project={project} variant="hero" eager />` line with `<DeviceFrame project={project} variant="hero" eager />`. Remove the `reveal.ts` script tag.
- [ ] **Step 3: vt.ts.** Replace `data-cover-slug` with `data-shot-slug` and the `'cover'` view-transition name with `'shot'`. The hero selector becomes `.frame[data-variant="hero"]`. In `global.css`, rename every `(cover)` view-transition pseudo selector to `(shot)`, and set the group animation to `animation-duration: var(--dur-slow); animation-timing-function: var(--ease-enter);`.
- [ ] **Step 4: Remove plate references.** For each file listed under Modify, run `grep -n "plate\|covers/" <file>` and delete the prop or import (these used plate colour for decoration only). Delete `src/covers/`, `src/lib/plate.ts` and `src/scripts/reveal.ts`.
- [ ] **Step 5: Build.** The home page still imports the old components, so temporarily reduce `src/pages/index.astro` to the intro section only (Task 10 rebuilds it). Run `npx astro build`. Expected: success. Open `dist/work/habitect/index.html` and confirm it contains `data-shot-slug="habitect"` and `frame--phone`.
- [ ] **Step 6: Commit**

```bash
git add -A src
git commit -m "feat: DeviceFrame replaces object covers; drop plates"
```

---

### Task 5: WorkList with cursor-follow preview (desktop) and inline thumbs (touch)

**Files:**
- Create: `src/components/WorkList.astro`, `src/scripts/shot-preview.ts`, `src/lib/motion.ts`, `tests/motion.test.ts`
- Delete: `WorkSection.astro`, `WorkTile.astro`, `ViewToggle.astro`, `IndexPreview.astro`, `IndexList.astro`, `IndexRow.astro`, `ScopeFilters.astro`, `src/scripts/work-list.ts`
- Modify: `src/scripts/stress.ts`, `src/scripts/head-inline.js`

**Interfaces:**
- Consumes: `DeviceFrame`, `getArchiveTier`, `scopeCounts`
- Produces:
  - `<WorkList projects={WorkEntry[]} excludeId?={string} />`, rendering `<ol id="work-list">` with `<li class="work-row" data-scope>` children
  - `lerp(a: number, b: number, t: number): number`
  - `magnetOffset(dx: number, dy: number, radius: number, max: number): { x: number; y: number }`

- [ ] **Step 1: Failing test** (`tests/motion.test.ts`):

```ts
import { describe, it, expect } from 'vitest';
import { lerp, magnetOffset } from '../src/lib/motion';

describe('motion math', () => {
  it('lerp', () => {
    expect(lerp(0, 10, 0.25)).toBe(2.5);
  });
  it('magnet is zero outside radius', () => {
    expect(magnetOffset(100, 0, 80, 6)).toEqual({ x: 0, y: 0 });
  });
  it('magnet scales toward max near centre and never exceeds it', () => {
    const o = magnetOffset(40, 0, 80, 6);
    expect(o.x).toBeCloseTo(3);
    expect(o.y).toBe(0);
    const edge = magnetOffset(79, 79, 80, 6);
    expect(Math.hypot(edge.x, edge.y)).toBe(0);
  });
});
```

- [ ] **Step 2: Run.** `npm test`. Expected: FAIL.
- [ ] **Step 3: Implement** `src/lib/motion.ts`:

```ts
// Pure motion maths shared by the preview and magnetic scripts. Spec §5.3.
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// Pull toward the pointer: linear falloff from `max` px near the centre to 0
// at `radius`. Zero at exactly the centre (no direction) and outside radius.
export function magnetOffset(dx: number, dy: number, radius: number, max: number) {
  const d = Math.hypot(dx, dy);
  if (d === 0 || d >= radius) return { x: 0, y: 0 };
  const strength = (1 - d / radius) * max;
  return { x: (dx / d) * strength, y: (dy / d) * strength };
}
```

(At d=40 and r=80 this gives 3. `hypot(79,79)` ≈ 111.7, which is ≥ 80, so it gives 0.)

- [ ] **Step 4: Run.** `npm test`. Expected: PASS.
- [ ] **Step 5: WorkList.astro**

```astro
---
// Work rows: name, one line, stack chips, year. Desktop hover shows a
// cursor-follow screenshot; narrow screens show an inline thumb. Filters only
// at 6+ projects. Spec §3.1 item 3, §5.3 item 4.
import DeviceFrame from './DeviceFrame.astro';
import { scopeCounts, type WorkEntry } from '../lib/work';

interface Props { projects: WorkEntry[]; excludeId?: string }
const { projects, excludeId } = Astro.props;
const rows = [...projects]
  .filter((p) => p.id !== excludeId)
  .sort((a, b) => b.data.year - a.data.year || a.data.order - b.data.order);
const scopes = rows.length >= 6 ? scopeCounts(rows) : [];
---
<section class="work" aria-labelledby="work-h" id="work">
  <h2 id="work-h">Work</h2>
  {scopes.length > 1 && (
    <div class="filters" role="group" aria-label="Filter by scope">
      <button type="button" aria-pressed="true" data-filter="*">All</button>
      {scopes.map((s) => <button type="button" aria-pressed="false" data-filter={s.scope}>{s.scope} <span class="n">{s.n}</span></button>)}
    </div>
  )}
  <ol id="work-list" class="rows">
    {rows.map((p) => (
      <li class="work-row" data-scope={p.data.scope} data-slug={p.id}>
        <a href={`/work/${p.id}/`}>
          <span class="thumb"><DeviceFrame project={p} variant="thumb" /></span>
          <span class="name">{p.data.title}</span>
          <span class="line">{p.data.summary}</span>
          <span class="chips">{p.data.stack.map((s) => <span class="chip">{s}</span>)}</span>
          <span class="year">{p.data.year}</span>
        </a>
      </li>
    ))}
  </ol>
  <div class="preview" aria-hidden="true" hidden></div>
</section>

<script src="../scripts/shot-preview.ts"></script>

<style>
  .rows { list-style: none; padding: 0; margin: 0; border-top: 1px solid var(--c-rule); }
  .work-row a { display: grid; grid-template-columns: 64px 1fr; gap: 4px 16px; padding-block: 16px; border-bottom: 1px solid var(--c-rule); color: inherit; text-decoration: none; }
  .thumb { grid-row: span 3; }
  .name { font-size: var(--step-2); }
  .line { color: var(--c-ink-2); }
  .chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .chip, .year { font-family: var(--font-mono); font-size: var(--step--1); color: var(--c-ink-2); }
  .chip { border: 1px solid var(--c-rule); border-radius: 4px; padding: 1px 6px; }
  .year { display: none; }
  @media (min-width: 1024px) {
    .work-row a { grid-template-columns: 4fr 5fr 3fr 1fr; align-items: baseline; padding-block: 20px; }
    .thumb { display: none; }
    .year { display: block; text-align: right; }
  }
  @media (hover: hover) and (pointer: fine) {
    .name, .line { transition: transform var(--dur-base) var(--ease-enter); }
    .work-row a:hover .name, .work-row a:hover .line { transform: translateX(4px); }
  }
  .work-row a:focus-visible { outline: 2px solid var(--c-focus); outline-offset: 2px; }
  .preview { position: fixed; top: 0; left: 0; width: 320px; pointer-events: none; z-index: 20; opacity: 0; transition: opacity var(--dur-fast) var(--ease-enter); will-change: transform; }
  .preview.on { opacity: 1; }
  .filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
  .filters button { font: inherit; font-family: var(--font-mono); font-size: var(--step--1); padding: 4px 10px; border: 1px solid var(--c-rule); border-radius: 999px; background: none; color: var(--c-ink); min-height: 32px; }
  .filters button[aria-pressed='true'] { background: var(--c-ink); color: var(--c-bg); }
</style>
```

- [ ] **Step 6: `src/scripts/shot-preview.ts`**

```ts
// Desktop-only cursor-follow screenshot for work rows. One element, transform
// only, rAF loop runs only while the pointer is inside the list. Also wires
// scope filters when present. Spec §5.3 item 4.
import { lerp } from '../lib/motion';

const list = document.getElementById('work-list');
const preview = document.querySelector<HTMLElement>('.work .preview');
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (list && preview && fine) {
  preview.hidden = false;
  let tx = 0, ty = 0, x = 0, y = 0, raf = 0, current = '';
  const tick = () => {
    x = reduced ? tx : lerp(x, tx, 0.18);
    y = reduced ? ty : lerp(y, ty, 0.18);
    preview.style.transform = `translate3d(${x + 24}px, ${y - 120}px, 0)`;
    raf = requestAnimationFrame(tick);
  };
  list.addEventListener('pointerenter', (e) => {
    x = tx = e.clientX; y = ty = e.clientY;
    if (!raf) raf = requestAnimationFrame(tick);
  });
  list.addEventListener('pointermove', (e) => {
    tx = e.clientX; ty = e.clientY;
    const row = (e.target as HTMLElement).closest<HTMLElement>('.work-row');
    if (row && row.dataset.slug !== current) {
      current = row.dataset.slug ?? '';
      const frame = row.querySelector('.frame');
      preview.replaceChildren(frame ? frame.cloneNode(true) : document.createTextNode(''));
      preview.classList.add('on');
    }
  });
  list.addEventListener('pointerleave', () => {
    preview.classList.remove('on');
    current = '';
    cancelAnimationFrame(raf);
    raf = 0;
  });
}

const filters = document.querySelectorAll<HTMLButtonElement>('.work .filters button');
filters.forEach((btn) =>
  btn.addEventListener('click', () => {
    filters.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    const f = btn.dataset.filter;
    document.querySelectorAll<HTMLElement>('.work-row').forEach((r) => {
      r.hidden = f !== '*' && r.dataset.scope !== f;
    });
  }),
);

export {};
```

- [ ] **Step 7: Clean up and stress.**
  - Delete the listed components and `work-list.ts`. Remove the `workView` block from `head-inline.js`.
  - Rewrite `stress.ts` so that `?projects=N` clones `#work-list > li` until there are N rows. Each clone gets a relabelled `.name` ("Project k"), `data-slug="stress-k"`, and `data-scope` cycling through `['Mobile app','Web app','Website','Data tool']`.
  - Because clones don't pass through the server-rendered filter block, stress.ts must also build the filter buttons when there are 6+ rows and none exist, using the same markup as WorkList.
- [ ] **Step 8: Verify.** Temporarily add `<WorkList projects={allWork} />` to index.astro. Run `npx astro build && npx astro preview`, then check:
  - at 1440px, hovering rows shows a following preview
  - at 390px, thumbs render inline with no preview element visible
  - `/?projects=40` gives 40 rows and filters work
- [ ] **Step 9: Commit**

```bash
git add -A src tests
git commit -m "feat: work rows with cursor-follow preview and scale filters"
```

---

### Task 6: OfferSwitcher (accessible tabs, sliding indicator, interruptible crossfade)

**Files:**
- Create: `src/components/OfferSwitcher.astro`, `src/scripts/offers.ts`

**Interfaces:**
- Consumes: `offersWithProjects`, `DeviceFrame`, and the offer blurbs/stacks from `docs/copy-dev.md` (put them in `src/data/site.ts` as `offerCopy: Record<OfferId, { line: string; stack: string[] }>`)
- Produces: `<OfferSwitcher projects={WorkEntry[]} />`

- [ ] **Step 1: Add copy to `src/data/site.ts`.** Use the exact strings from `docs/copy-dev.md`. Keep the shape below; each value is replaced with the confirmed string, and no string may be left empty:

```ts
import type { OfferId } from '../lib/offers';

export const home = {
  title: '',       // copy-dev.md: home meta title (<60 chars)
  description: '', // copy-dev.md: home meta description (<160 chars)
  roleLine: '',    // copy-dev.md: role line, no employer
  pitch: '',       // copy-dev.md: intro sentence
};

export const offerCopy: Record<OfferId, { line: string; stack: string[] }> = {
  websites: { line: '', stack: [] },
  webapps: { line: '', stack: [] },
  mobile: { line: '', stack: [] },
};
```

Add `tests/copy.test.ts` so empty strings fail CI:

```ts
import { it, expect } from 'vitest';
import { home, offerCopy } from '../src/data/site';

it('home and offer copy are filled in', () => {
  for (const v of Object.values(home)) expect(v.trim().length).toBeGreaterThan(0);
  expect(home.title.length).toBeLessThan(60);
  expect(home.description.length).toBeLessThan(160);
  expect(home.roleLine + home.pitch).not.toMatch(/bantu2u/i);
  for (const o of Object.values(offerCopy)) {
    expect(o.line.trim().length).toBeGreaterThan(0);
    expect(o.stack.length).toBeGreaterThan(0);
  }
});
```

Run `npm test`. It must fail while any value is empty and pass once filled.
- [ ] **Step 2: Component**

```astro
---
// Offer tabs: Websites · Web apps · Mobile apps, each backed by real projects.
// Tabs without projects don't render. Spec §3.1 item 2, §5.3 item 3.
import { offersWithProjects } from '../lib/offers';
import { offerCopy } from '../data/site';
import type { WorkEntry } from '../lib/work';

interface Props { projects: WorkEntry[] }
const offers = offersWithProjects(Astro.props.projects);
---
{offers.length > 0 && (
  <section class="offers" aria-labelledby="offers-h">
    <h2 id="offers-h">What I build</h2>
    <div class="tabs" role="tablist" aria-labelledby="offers-h">
      {offers.map((o, i) => (
        <button role="tab" id={`tab-${o.id}`} aria-controls={`panel-${o.id}`} aria-selected={i === 0 ? 'true' : 'false'} tabindex={i === 0 ? 0 : -1}>
          {o.label}
        </button>
      ))}
      <span class="indicator" aria-hidden="true"></span>
    </div>
    {offers.map((o, i) => (
      <div class="panel" role="tabpanel" id={`panel-${o.id}`} aria-labelledby={`tab-${o.id}`} hidden={i !== 0} tabindex="0">
        <p class="line">{offerCopy[o.id].line}</p>
        <p class="stack">{offerCopy[o.id].stack.join(' · ')}</p>
        <ul class="proof">
          {o.projects.map((p) => <li><a href={`/work/${p.id}/`}>{p.data.title} <span aria-hidden="true">→</span></a></li>)}
        </ul>
      </div>
    ))}
  </section>
)}

<script src="../scripts/offers.ts"></script>

<style>
  .tabs { position: relative; display: flex; gap: 4px; border-bottom: 1px solid var(--c-rule); overflow-x: auto; }
  [role='tab'] { font: inherit; background: none; border: 0; padding: 12px 14px; min-height: 44px; color: var(--c-ink-2); cursor: pointer; white-space: nowrap; }
  [role='tab'][aria-selected='true'] { color: var(--c-ink); }
  [role='tab']:focus-visible { outline: 2px solid var(--c-focus); outline-offset: -2px; }
  .indicator { position: absolute; left: 0; bottom: -1px; height: 2px; width: 100px; background: var(--c-accent); transform-origin: left; transition: transform var(--dur-base) var(--ease-enter); }
  .panel { padding-block: 24px; }
  .panel.entering { animation: panel-in var(--dur-base) var(--ease-enter); }
  @keyframes panel-in { from { opacity: 0; transform: translateY(6px); } }
  .line { font-size: var(--step-2); max-width: 36ch; }
  .stack { font-family: var(--font-mono); font-size: var(--step--1); color: var(--c-ink-2); margin-top: 8px; }
  .proof { list-style: none; padding: 0; margin-top: 16px; display: flex; flex-wrap: wrap; gap: 8px 24px; }
</style>
```

- [ ] **Step 3: Script** `src/scripts/offers.ts`:

```ts
// Roving-tabindex tablist with a transform-only sliding indicator. Rapid
// switching restarts the panel animation instead of queueing. Spec §5.3 item 3.
const tablist = document.querySelector<HTMLElement>('.offers [role="tablist"]');
if (tablist) {
  const tabs = [...tablist.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
  const indicator = tablist.querySelector<HTMLElement>('.indicator')!;

  const place = (tab: HTMLElement) => {
    indicator.style.transform = `translateX(${tab.offsetLeft}px) scaleX(${tab.offsetWidth / 100})`;
  };

  const select = (tab: HTMLButtonElement, focus: boolean) => {
    for (const t of tabs) {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls')!)!;
      panel.hidden = !on;
      if (on) {
        panel.classList.remove('entering');
        void panel.offsetWidth; // restart the animation on rapid switching
        panel.classList.add('entering');
      }
    }
    place(tab);
    if (focus) tab.focus();
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab, false));
    tab.addEventListener('keydown', (e) => {
      const k = e.key;
      let j = -1;
      if (k === 'ArrowRight') j = (i + 1) % tabs.length;
      else if (k === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      else if (k === 'Home') j = 0;
      else if (k === 'End') j = tabs.length - 1;
      if (j >= 0) {
        e.preventDefault();
        select(tabs[j], true);
      }
    });
  });

  place(tabs.find((t) => t.getAttribute('aria-selected') === 'true') ?? tabs[0]);
  new ResizeObserver(() => place(tabs.find((t) => t.tabIndex === 0) ?? tabs[0])).observe(tablist);
}

export {};
```

- [ ] **Step 4: Verify.**
  - Add the component to index temporarily and build.
  - Keyboard: Tab into the tablist, then use arrows, Home and End. Each moves the selection and the indicator.
  - Clicking fast between tabs never leaves two panels visible.
  - Remove `offers` from `this-site.md` temporarily: the "Websites" tab disappears. Revert.
- [ ] **Step 5: Commit**

```bash
git add -A src
git commit -m "feat: offer switcher backed by real projects"
```

---

### Task 7: Build receipts (postbuild measure and inject) + BuildReceipts + CommitLog

**Files:**
- Create: `scripts/receipts-lib.mjs`, `scripts/receipts.mjs`, `scripts/lighthouse.mjs`, `tests/receipts.test.ts`, `src/components/BuildReceipts.astro`, `src/components/CommitLog.astro`, `src/scripts/count-up.ts`
- Modify: `.gitignore` (nothing; `receipts/lighthouse.json` **is** committed)

**Interfaces:**
- Produces:
  - `formatKB(bytes: number): string`
  - `injectReceipts(html: string, values: Partial<Record<ReceiptKey, string>>): string`, where `ReceiptKey = 'page-kb' | 'js-kb' | 'lh-perf' | 'sha'`
  - `<BuildReceipts />` emits `<span data-receipt="KEY" hidden></span>` placeholders inside `<div class="receipt" data-receipt-wrap="KEY" hidden>`
  - `<CommitLog entries limit? />`

- [ ] **Step 1: Failing tests** (`tests/receipts.test.ts`):

```ts
import { describe, it, expect } from 'vitest';
// @ts-expect-error plain ESM script without types
import { formatKB, injectReceipts } from '../scripts/receipts-lib.mjs';

// Astro scoped styles append data-astro-cid-* attributes, so fixtures include them.
const html =
  '<div class="receipt" data-receipt-wrap="page-kb" hidden data-astro-cid-x1><span data-receipt="page-kb" hidden data-astro-cid-x1></span></div>' +
  '<div class="receipt" data-receipt-wrap="sha" hidden><a data-receipt="sha" data-href-template="https://github.com/AdrielTTE/portfolio/commit/{v}" hidden></a></div>' +
  '<footer><span data-receipt-wrap="sha" hidden><a data-receipt="sha" data-href-template="https://github.com/AdrielTTE/portfolio/commit/{v}" hidden data-astro-cid-f2></a></span></footer>';

describe('receipts', () => {
  it('formats KB with one decimal under 100', () => {
    expect(formatKB(12_345)).toBe('12.1');
    expect(formatKB(150_000)).toBe('146');
  });
  it('injects values and unhides only filled receipts, despite scoped attrs', () => {
    const out = injectReceipts(html, { 'page-kb': '42.0' });
    expect(out).toContain('<span data-receipt="page-kb" data-astro-cid-x1>42.0</span>');
    expect(out).toContain('data-receipt-wrap="page-kb" data-astro-cid-x1>');
    expect(out).toContain('data-receipt-wrap="sha" hidden');
  });
  it('fills every occurrence, including href templates', () => {
    const out = injectReceipts(html, { sha: 'abc1234' });
    expect(out.match(/href="https:\/\/github\.com\/AdrielTTE\/portfolio\/commit\/abc1234"/g)).toHaveLength(2);
    expect(out.match(/>abc1234<\/a>/g)).toHaveLength(2);
    expect(out).not.toContain('data-receipt-wrap="sha" hidden');
  });
  it('escapes injected values', () => {
    expect(injectReceipts(html, { 'page-kb': '<b>' })).toContain('>&lt;b&gt;</span>');
  });
  it('leaves html untouched when no values', () => {
    expect(injectReceipts(html, {})).toBe(html);
  });
});
```

- [ ] **Step 2: Run.** `npm test`. Expected: FAIL.
- [ ] **Step 3: `scripts/receipts-lib.mjs`**

```js
// Pure helpers for the build-receipts postbuild step. Spec §6.
export function formatKB(bytes) {
  const kb = bytes / 1024;
  return kb < 100 ? kb.toFixed(1) : String(Math.round(kb));
}

const escape = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const dropHidden = (attrs) => attrs.replace(/\s+hidden(?=[\s>]|$)/, '');

// Fills every empty placeholder for each key and un-hides its wrapper. Tolerates
// extra attributes (Astro's data-astro-cid-*) anywhere after the key attribute.
export function injectReceipts(html, values) {
  let out = html;
  for (const [key, raw] of Object.entries(values)) {
    if (raw === undefined || raw === null || raw === '') continue;
    const v = escape(raw);
    out = out.replace(new RegExp(`(data-receipt-wrap="${key}")([^>]*)>`, 'g'), (_m, head, attrs) => `${head}${dropHidden(attrs)}>`);
    out = out.replace(new RegExp(`<(span|a) data-receipt="${key}"([^>]*)></\\1>`, 'g'), (_m, tag, attrs) => {
      const clean = dropHidden(attrs);
      const tmpl = /data-href-template="([^"]*)"/.exec(clean);
      const href = tmpl ? ` href="${tmpl[1].replace('{v}', v)}"` : '';
      return `<${tag} data-receipt="${key}"${clean}${href}>${v}</${tag}>`;
    });
  }
  return out;
}
```

- [ ] **Step 4: Run.** `npm test`. Expected: PASS.
- [ ] **Step 5: `scripts/receipts.mjs`**

```js
// Postbuild: measure dist/ and inject real numbers into every built page.
// Any metric that can't be measured stays hidden. Never fails the build.
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { gzipSync } from 'node:zlib';
import { execSync } from 'node:child_process';
import { formatKB, injectReceipts } from './receipts-lib.mjs';

const DIST = 'dist';
const walk = (dir) => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]));
const gz = (p) => gzipSync(readFileSync(p)).length;

const values = {};
try {
  const files = walk(DIST);
  const js = files.filter((f) => extname(f) === '.js');
  values['js-kb'] = formatKB(js.reduce((n, f) => n + gz(f), 0));

  const index = readFileSync(join(DIST, 'index.html'), 'utf8');
  const linked = [...index.matchAll(/(?:href|src)="(\/[^"]+\.(?:css|js))"/g)].map((m) => join(DIST, m[1]));
  const pageBytes = gzipSync(index).length + linked.filter(existsSync).reduce((n, f) => n + gz(f), 0);
  values['page-kb'] = formatKB(pageBytes);
} catch (e) {
  console.warn('[receipts] size measurement skipped:', e.message);
}

let sha = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7);
if (!sha) {
  try {
    sha = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {}
}
if (sha) values.sha = sha;

try {
  const lh = JSON.parse(readFileSync('receipts/lighthouse.json', 'utf8'));
  const score = lh?.categories?.performance?.score;
  if (typeof score === 'number') values['lh-perf'] = String(Math.round(score * 100));
} catch {}

let pages = 0;
for (const f of walk(DIST).filter((f) => f.endsWith('.html'))) {
  const html = readFileSync(f, 'utf8');
  const next = injectReceipts(html, values);
  if (next !== html) {
    writeFileSync(f, next);
    pages++;
  }
}
console.log(`[receipts] ${JSON.stringify(values)} → ${pages} pages`);
```

- [ ] **Step 6: `scripts/lighthouse.mjs`**

```js
// Manual: `npm run lighthouse -- <url>` writes receipts/lighthouse.json (mobile).
// Commit the file; the next build shows the score. Spec §6.
import { execSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const url = process.argv[2];
if (!url) {
  console.error('usage: npm run lighthouse -- https://preview-url');
  process.exit(1);
}
mkdirSync('receipts', { recursive: true });
execSync(
  `npx -y lighthouse@12 ${url} --only-categories=performance --form-factor=mobile --output=json --output-path=receipts/lighthouse.json --chrome-flags="--headless=new" --quiet`,
  { stdio: 'inherit' },
);
```

- [ ] **Step 7: `BuildReceipts.astro`**

```astro
---
// Real numbers measured at build (scripts/receipts.mjs fills these in).
// Each receipt stays hidden unless a value was injected. Spec §3.1 item 4.
const items = [
  { key: 'page-kb', label: 'Home page, gzip', unit: 'KB' },
  { key: 'js-kb', label: 'JavaScript, whole site', unit: 'KB' },
  { key: 'lh-perf', label: 'Lighthouse performance, mobile', unit: '/100' },
];
---
<section class="receipts" aria-labelledby="receipts-h">
  <h2 id="receipts-h">This page, measured</h2>
  <dl>
    {items.map((i) => (
      <div class="receipt" data-receipt-wrap={i.key} hidden>
        <dt>{i.label}</dt>
        <dd><span data-receipt={i.key} hidden></span><span class="unit">{i.unit}</span></dd>
      </div>
    ))}
    <div class="receipt" data-receipt-wrap="sha" hidden>
      <dt>Built from commit</dt>
      <dd><a data-receipt="sha" data-href-template="https://github.com/AdrielTTE/portfolio/commit/{v}" hidden></a></dd>
    </div>
  </dl>
  <a class="more" href="/work/this-site/">How this site is built <span aria-hidden="true">→</span></a>
</section>

<script src="../scripts/count-up.ts"></script>

<style>
  dl { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 24px; margin: 16px 0; }
  dt { color: var(--c-ink-2); font-size: var(--step--1); }
  dd { margin: 4px 0 0; font-family: var(--font-mono); font-size: var(--step-3); font-variant-numeric: tabular-nums; }
  .unit { font-size: var(--step--1); color: var(--c-ink-2); margin-left: 4px; }
</style>
```

- [ ] **Step 8: `src/scripts/count-up.ts`**

```ts
// Count receipts up once on first view. Text width is reserved by setting
// min-width in ch from the final string, so no layout shift. Spec §5.3 item 6.
const els = [...document.querySelectorAll<HTMLElement>('span[data-receipt]:not([hidden])')];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (els.length && !reduced && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      io.unobserve(en.target);
      const el = en.target as HTMLElement;
      const final = el.textContent ?? '';
      const target = parseFloat(final);
      if (!Number.isFinite(target)) continue;
      const decimals = final.includes('.') ? 1 : 0;
      el.style.display = 'inline-block';
      el.style.minWidth = `${final.length}ch`;
      const start = performance.now();
      const step = (t: number) => {
        const p = Math.min(1, (t - start) / 450);
        const eased = 1 - Math.pow(1 - p, 4);
        el.textContent = (target * eased).toFixed(decimals);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = final;
      };
      requestAnimationFrame(step);
    }
  }, { threshold: 0.6 });
  els.forEach((e) => io.observe(e));
}
export {};
```

- [ ] **Step 9: `CommitLog.astro`**

```astro
---
// Lately as a dated commit list. Spec §3.1 item 5.
import { toCommitLine, type CommitType } from '../lib/commitlog';

interface Props { entries: { date: Date; type: CommitType; text: string }[]; limit?: number; heading?: string }
const { entries, limit, heading = 'Log' } = Astro.props;
const lines = [...entries].sort((a, b) => +b.date - +a.date).slice(0, limit ?? entries.length).map(toCommitLine);
---
<section class="log" aria-labelledby="log-h">
  <h2 id="log-h">{heading}</h2>
  <ol>
    {lines.map((l) => (
      <li>
        <time datetime={l.stamp}>{l.stamp}</time>
        <span class={`type type--${l.type}`}>{l.type}:</span>
        <span class="msg">{l.text}</span>
      </li>
    ))}
  </ol>
</section>

<style>
  ol { list-style: none; padding: 0; margin: 16px 0 0; font-family: var(--font-mono); font-size: var(--step--1); }
  li { display: grid; grid-template-columns: 8ch 6ch 1fr; gap: 12px; padding-block: 8px; border-bottom: 1px solid var(--c-rule); }
  time { color: var(--c-ink-2); }
  .type { color: var(--c-accent); }
  .msg { font-family: var(--font-sans); font-size: var(--step-0); }
  @media (max-width: 480px) { li { grid-template-columns: 8ch 1fr; } .type { display: none; } }
</style>
```

- [ ] **Step 9b: Footer SHA (spec §3.1 item 6).** In `SiteFooter.astro`, add:

```astro
<span class="sha" data-receipt-wrap="sha" hidden>Built from <a data-receipt="sha" data-href-template="https://github.com/AdrielTTE/portfolio/commit/{v}" hidden></a></span>
```

Style it with `font-family: var(--font-mono); font-size: var(--step--1); color: var(--c-ink-2);`.

- [ ] **Step 10: Verify.**
  - Add both components to index temporarily and run `npm run build`.
  - `grep -c 'commit/[0-9a-f]\{7\}"' dist/about/index.html` is at least 1: the footer SHA is filled on every page. The log prints something like `[receipts] {"js-kb":"…","page-kb":"…","sha":"…"} → N pages`.
  - `grep -c 'data-receipt-wrap="lh-perf" hidden' dist/index.html` returns 1 (no Lighthouse JSON yet, so it stays hidden).
  - `grep -o 'data-receipt="page-kb">[0-9.]*' dist/index.html` shows a number.
  - With `GIT_DIR=/nonexistent npm run build`, the build still succeeds and sha stays hidden.
- [ ] **Step 11: Commit**

```bash
git add -A scripts src tests package.json
git commit -m "feat: real build receipts injected postbuild, commit log"
```

---

### Task 8: Command palette (⌘K / Ctrl+K / `/`, header button for touch)

**Files:**
- Create: `src/lib/palette.ts`, `tests/palette.test.ts`, `src/components/CommandPalette.astro`, `src/scripts/palette.ts`
- Modify: `src/layouts/BaseLayout.astro`, `src/components/SiteHeader.astro`, `src/components/SiteFooter.astro`

**Interfaces:**
- Produces:
  - `type Command = { id: string; label: string; group: 'Pages' | 'Projects' | 'Actions'; href?: string; action?: 'copy-email' | 'toggle-theme'; keywords?: string }`
  - `filterCommands(cmds: Command[], q: string): Command[]`
  - Any element with `data-palette-open` opens the palette.

- [ ] **Step 1: Failing tests** (`tests/palette.test.ts`):

```ts
import { describe, it, expect } from 'vitest';
import { filterCommands, type Command } from '../src/lib/palette';

const cmds: Command[] = [
  { id: 'work', label: 'Work', group: 'Pages', href: '/#work' },
  { id: 'about', label: 'About', group: 'Pages', href: '/about/' },
  { id: 'habitect', label: 'Habitect', group: 'Projects', href: '/work/habitect/', keywords: 'flutter mobile' },
  { id: 'copy', label: 'Copy email', group: 'Actions', action: 'copy-email' },
];

describe('filterCommands', () => {
  it('empty query returns all in original order', () => {
    expect(filterCommands(cmds, '  ').map((c) => c.id)).toEqual(['work', 'about', 'habitect', 'copy']);
  });
  it('prefix beats substring; ties keep original order', () => {
    const extra: Command = { id: 'x', label: 'Contact about', group: 'Pages', href: '/contact/' };
    expect(filterCommands([...cmds, extra], 'ab').map((c) => c.id)).toEqual(['about', 'habitect', 'x']);
  });
  it('substring beats subsequence', () => {
    // "cpy": not a substring of anything; a subsequence of "copy email" only.
    expect(filterCommands(cmds, 'cpy').map((c) => c.id)).toEqual(['copy']);
    const withSub: Command = { id: 'cpy', label: 'Recpy', group: 'Actions', href: '/x' };
    expect(filterCommands([...cmds, withSub], 'cpy').map((c) => c.id)).toEqual(['cpy', 'copy']);
  });
  it('matches keywords', () => {
    expect(filterCommands(cmds, 'flutter').map((c) => c.id)).toEqual(['habitect']);
  });
  it('no match returns empty', () => {
    expect(filterCommands(cmds, 'zzqq')).toEqual([]);
  });
});
```

Scoring check for `'ab'`:
- "About" is a prefix (score 3).
- "Habitect" contains `ab` as a substring (score 2).
- "Contact about" also contains it (score 2), so the tie keeps the original order: habitect (index 2) before x (index 4).
- "Work" and "Copy email" are excluded.

For `'cpy'`, "Recpy" is a substring match (score 2), which beats "Copy email", a subsequence match (score 1).

- [ ] **Step 2: Run.** `npm test`. Expected: FAIL.
- [ ] **Step 3: `src/lib/palette.ts`**

```ts
// Command palette data + ranking. Spec §3.2.
export type Command = {
  id: string;
  label: string;
  group: 'Pages' | 'Projects' | 'Actions';
  href?: string;
  action?: 'copy-email' | 'toggle-theme';
  keywords?: string;
};

function isSubsequence(q: string, s: string): boolean {
  let i = 0;
  for (const ch of s) if (ch === q[i]) i++;
  return i === q.length;
}

function score(c: Command, q: string): number {
  const label = c.label.toLowerCase();
  const kw = (c.keywords ?? '').toLowerCase();
  if (label.startsWith(q)) return 3;
  if (label.includes(q) || kw.includes(q)) return 2;
  if (isSubsequence(q, label)) return 1;
  return 0;
}

export function filterCommands(cmds: Command[], raw: string): Command[] {
  const q = raw.trim().toLowerCase();
  if (!q) return cmds;
  return cmds
    .map((c, i) => ({ c, i, s: score(c, q) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .map((x) => x.c);
}
```

- [ ] **Step 4: Run.** `npm test`. Expected: PASS.
- [ ] **Step 5: `CommandPalette.astro`.** The commands are built at build time and serialised to JSON.

```astro
---
// ⌘K palette. Native <dialog> gives the focus trap, Esc handling and the
// backdrop. Spec §3.2, §5.3 item 8.
import { getCollection } from 'astro:content';
import { sortByOrder } from '../lib/work';
import { site } from '../data/site';
import type { Command } from '../lib/palette';

const work = sortByOrder(await getCollection('work'));
const commands: Command[] = [
  { id: 'home', label: 'Home', group: 'Pages', href: '/' },
  { id: 'work', label: 'Work', group: 'Pages', href: '/#work' },
  { id: 'about', label: 'About', group: 'Pages', href: '/about/' },
  { id: 'contact', label: 'Start a project', group: 'Pages', href: '/contact/', keywords: 'contact hire email' },
  ...work.map((w) => ({ id: w.id, label: w.data.title, group: 'Projects' as const, href: `/work/${w.id}/`, keywords: w.data.stack.join(' ') })),
  { id: 'copy-email', label: 'Copy email address', group: 'Actions', action: 'copy-email', keywords: site.email },
  { id: 'theme', label: 'Toggle theme', group: 'Actions', action: 'toggle-theme', keywords: 'dark light' },
  { id: 'github', label: 'Open GitHub', group: 'Actions', href: site.github },
  { id: 'linkedin', label: 'Open LinkedIn', group: 'Actions', href: site.linkedin },
];
---
<dialog id="palette" aria-label="Command menu">
  <div class="panel">
    <input id="palette-q" type="text" role="combobox" aria-expanded="true" aria-controls="palette-list" aria-autocomplete="list" placeholder="Type a command or page" autocomplete="off" spellcheck="false" />
    <ul id="palette-list" role="listbox" aria-label="Results"></ul>
    <p id="palette-empty" hidden>No results</p>
    <span class="hl" aria-hidden="true"></span>
  </div>
  <script type="application/json" id="palette-data" set:html={JSON.stringify(commands)} />
  <span id="palette-email" hidden>{site.email}</span>
</dialog>

<script src="../scripts/palette.ts"></script>

<style>
  dialog { padding: 0; border: 1px solid var(--c-rule); border-radius: 12px; width: min(560px, calc(100vw - 32px)); margin: 12vh auto auto; background: var(--c-bg); color: var(--c-ink); }
  dialog[open] { animation: pal-in var(--dur-base) var(--ease-enter); }
  dialog::backdrop { background: rgb(0 0 0 / 0.35); animation: fade var(--dur-base) var(--ease-enter); }
  @keyframes pal-in { from { opacity: 0; transform: scale(0.96); } }
  @keyframes fade { from { opacity: 0; } }
  .panel { position: relative; }
  input { width: 100%; font: inherit; font-size: var(--step-1); padding: 16px; border: 0; border-bottom: 1px solid var(--c-rule); background: none; color: inherit; }
  input:focus { outline: none; }
  ul { list-style: none; margin: 0; padding: 6px; max-height: 50vh; overflow-y: auto; position: relative; }
  :global(#palette-list li) { position: relative; z-index: 1; padding: 10px 12px; border-radius: 8px; display: flex; justify-content: space-between; cursor: pointer; min-height: 44px; align-items: center; }
  :global(#palette-list .grp) { font-family: var(--font-mono); font-size: var(--step--1); color: var(--c-ink-2); }
  .hl { position: absolute; left: 6px; right: 6px; top: 0; height: 44px; border-radius: 8px; background: var(--c-bg-2); transition: transform var(--dur-fast) var(--ease-enter); pointer-events: none; }
  #palette-empty { padding: 16px; color: var(--c-ink-2); }
</style>
```

- [ ] **Step 6: `src/scripts/palette.ts`**

```ts
// Palette behaviour: open (⌘K, Ctrl+K, "/", or any [data-palette-open]),
// filter, arrow/enter selection, sliding highlight (transform only).
import { filterCommands, type Command } from '../lib/palette';

const dialog = document.getElementById('palette') as HTMLDialogElement | null;
if (dialog) {
  const input = document.getElementById('palette-q') as HTMLInputElement;
  const list = document.getElementById('palette-list') as HTMLUListElement;
  const empty = document.getElementById('palette-empty') as HTMLElement;
  const hl = dialog.querySelector<HTMLElement>('.hl')!;
  const all: Command[] = JSON.parse(document.getElementById('palette-data')!.textContent || '[]');
  let results: Command[] = all;
  let active = 0;

  const moveHl = () => {
    const li = list.children[active] as HTMLElement | undefined;
    hl.hidden = !li;
    if (li) hl.style.transform = `translateY(${li.offsetTop + list.offsetTop - list.scrollTop}px)`;
    list.querySelectorAll('[aria-selected]').forEach((el) => el.setAttribute('aria-selected', 'false'));
    if (li) {
      li.setAttribute('aria-selected', 'true');
      input.setAttribute('aria-activedescendant', li.id);
      li.scrollIntoView({ block: 'nearest' });
    }
  };

  const render = () => {
    results = filterCommands(all, input.value);
    active = 0;
    list.replaceChildren(
      ...results.map((c, i) => {
        const li = document.createElement('li');
        li.id = `pal-${c.id}`;
        li.setAttribute('role', 'option');
        li.innerHTML = `<span></span><span class="grp"></span>`;
        (li.firstChild as HTMLElement).textContent = c.label;
        (li.lastChild as HTMLElement).textContent = c.group;
        li.addEventListener('pointermove', () => { if (active !== i) { active = i; moveHl(); } });
        li.addEventListener('click', () => run(c));
        return li;
      }),
    );
    empty.hidden = results.length > 0;
    moveHl();
  };

  const run = async (c: Command | undefined) => {
    if (!c) return;
    if (c.href) {
      dialog.close();
      if (/^https?:/.test(c.href)) window.open(c.href, '_blank', 'noopener');
      else location.href = c.href;
    } else if (c.action === 'copy-email') {
      try { await navigator.clipboard.writeText(document.getElementById('palette-email')!.textContent!.trim()); } catch {}
      dialog.close();
    } else if (c.action === 'toggle-theme') {
      dialog.close();
      document.getElementById('theme-toggle')?.click();
    }
  };

  const open = () => {
    if (dialog.open) return;
    input.value = '';
    dialog.showModal();
    render();
    input.focus();
  };

  input.addEventListener('input', render);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (results.length) { active = (active + 1) % results.length; moveHl(); } }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (results.length) { active = (active - 1 + results.length) % results.length; moveHl(); } }
    else if (e.key === 'Enter') { e.preventDefault(); run(results[active]); }
  });
  list.addEventListener('scroll', moveHl, { passive: true });
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });

  document.addEventListener('keydown', (e) => {
    const typing = (e.target as HTMLElement).closest('input, textarea, [contenteditable="true"]');
    if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
      e.preventDefault();
      open();
    }
  });
  document.querySelectorAll('[data-palette-open]').forEach((b) => b.addEventListener('click', open));
}

export {};
```

Note: `list.addEventListener('scroll', …)` is a scroll listener on the palette list, not on the page. It only repositions the highlight while the palette is open, and it does not conflict with the no-page-scroll-listeners rule. Keep it.

- [ ] **Step 7: Wire it up.**
  - In `BaseLayout.astro`, render `<CommandPalette />` after `<SiteFooter>`.
  - In `SiteHeader.astro`, add `<button type="button" class="menu" data-palette-open aria-haspopup="dialog">Menu <kbd>⌘K</kbd></button>`. The `<kbd>` is hidden under `(pointer: coarse)`, and the button is at least 44px tall.
  - In `SiteFooter.astro`, add a line: `Press <kbd>⌘K</kbd> to jump anywhere`, hidden under `(pointer: coarse)`.
- [ ] **Step 8: Verify.**
  - Build and preview.
  - ⌘K and Ctrl+K open the palette. `/` opens it except while typing in the contact form. Esc closes it.
  - `zzqq` shows "No results", and Enter does nothing.
  - At 390px, tapping "Menu" opens it.
  - Arrows move the highlight smoothly.
- [ ] **Step 9: Commit**

```bash
git add -A src tests
git commit -m "feat: command palette with keyboard and touch entry"
```

---

### Task 9: Case-study template: ArchDiagram, SchemaCard, sections

**Files:**
- Create: `src/lib/diagram.ts`, `tests/diagram.test.ts`, `src/components/ArchDiagram.astro`, `src/scripts/diagram.ts`, `src/components/SchemaCard.astro`, `src/components/CaseSection.astro`
- Modify: `src/pages/work/[slug].astro`

**Interfaces:**
- Produces:
  - `layoutDiagram(nodes: {id:string}[], edges: [string,string][]): { pos: Record<string, { col: number; row: number }>; cols: number; rows: number }`
  - `connectedTo(id: string, edges: [string,string][]): Set<string>` (includes `id` itself)

- [ ] **Step 1: Failing tests** (`tests/diagram.test.ts`):

```ts
import { describe, it, expect } from 'vitest';
import { layoutDiagram, connectedTo } from '../src/lib/diagram';

const n = (...ids: string[]) => ids.map((id) => ({ id }));

describe('layoutDiagram', () => {
  it('puts nodes in columns by longest path from a source', () => {
    const { pos, cols, rows } = layoutDiagram(n('ui', 'api', 'db', 'auth'), [['ui', 'api'], ['api', 'db'], ['ui', 'auth'], ['auth', 'api']]);
    expect(pos.ui.col).toBe(0);
    expect(pos.auth.col).toBe(1);
    expect(pos.api.col).toBe(2);
    expect(pos.db.col).toBe(3);
    expect(cols).toBe(4);
    expect(rows).toBe(1);
  });
  it('stacks same-column nodes in rows, in declared order', () => {
    const { pos, rows } = layoutDiagram(n('a', 'b', 'c'), [['a', 'b'], ['a', 'c']]);
    expect([pos.b.row, pos.c.row]).toEqual([0, 1]);
    expect(rows).toBe(2);
  });
  it('terminates on cycles', () => {
    const { pos } = layoutDiagram(n('a', 'b'), [['a', 'b'], ['b', 'a']]);
    expect(Object.keys(pos).sort()).toEqual(['a', 'b']);
  });
  it('isolated nodes go to column 0', () => {
    expect(layoutDiagram(n('a', 'z'), [['a', 'a']]).pos.z.col).toBe(0);
  });
});

describe('connectedTo', () => {
  it('returns self plus direct neighbours in both directions', () => {
    expect([...connectedTo('api', [['ui', 'api'], ['api', 'db'], ['x', 'y']])].sort()).toEqual(['api', 'db', 'ui']);
  });
});
```

- [ ] **Step 2: Run.** `npm test`. Expected: FAIL.
- [ ] **Step 3: `src/lib/diagram.ts`**

```ts
// Layered layout for case-study architecture diagrams: column = longest path
// from any source (cycle-safe, capped at node count), row = declared order
// within the column. Spec §3.3 item 2.
export function layoutDiagram(nodes: { id: string }[], edges: [string, string][]) {
  const ids = nodes.map((n) => n.id);
  const depth: Record<string, number> = Object.fromEntries(ids.map((id) => [id, 0]));
  const real = edges.filter(([a, b]) => a !== b && a in depth && b in depth);
  // Bellman-Ford style relaxation; at most |V|-1 useful passes, so cycles stop.
  for (let pass = 0; pass < ids.length - 1; pass++) {
    let changed = false;
    for (const [a, b] of real) {
      if (depth[b] < depth[a] + 1 && depth[a] + 1 < ids.length) {
        depth[b] = depth[a] + 1;
        changed = true;
      }
    }
    if (!changed) break;
  }
  const rowsPerCol: Record<number, number> = {};
  const pos: Record<string, { col: number; row: number }> = {};
  for (const id of ids) {
    const col = depth[id];
    const row = rowsPerCol[col] ?? 0;
    rowsPerCol[col] = row + 1;
    pos[id] = { col, row };
  }
  return { pos, cols: Math.max(...ids.map((id) => depth[id])) + 1, rows: Math.max(...Object.values(rowsPerCol)) };
}

export function connectedTo(id: string, edges: [string, string][]): Set<string> {
  const out = new Set([id]);
  for (const [a, b] of edges) {
    if (a === id) out.add(b);
    if (b === id) out.add(a);
  }
  return out;
}
```

Check against the first test: the chain ui→auth→api→db is length 3, so api gets col 2 and db col 3, with 4 columns. Max rows is 1 because every column has exactly one node. PASS.

- [ ] **Step 4: Run.** `npm test`. Expected: PASS.
- [ ] **Step 5: `ArchDiagram.astro`.** An SVG on desktop. Below 600px it renders the same data as a vertical list of nodes with their notes and "→ connects to" lines, so there's no tiny unreadable SVG.

```astro
---
// Interactive architecture diagram from frontmatter. Hover/focus/tap a node:
// its edges stay, others dim (opacity only). Spec §3.3 item 2, §5.3 item 7.
import { layoutDiagram } from '../lib/diagram';

interface Props { diagram: { nodes: { id: string; label: string; note: string }[]; edges: [string, string][] } }
const { nodes, edges } = Astro.props.diagram;
const { pos, cols, rows } = layoutDiagram(nodes, edges);
const W = 160, H = 56, GX = 72, GY = 28;
const x = (id: string) => pos[id].col * (W + GX);
const y = (id: string) => pos[id].row * (H + GY);
const width = cols * W + (cols - 1) * GX;
const height = rows * H + (rows - 1) * GY;
const label = (id: string) => nodes.find((n) => n.id === id)!.label;
---
<figure class="arch" data-edges={JSON.stringify(edges)}>
  <div class="svg-wrap">
    <svg viewBox={`-2 -2 ${width + 4} ${height + 4}`} role="group" aria-label="Architecture diagram">
      <g class="edges" aria-hidden="true">
        {edges.filter(([a, b]) => a !== b).map(([a, b]) => (
          <path data-from={a} data-to={b} d={`M${x(a) + W} ${y(a) + H / 2} C${x(a) + W + GX / 2} ${y(a) + H / 2}, ${x(b) - GX / 2} ${y(b) + H / 2}, ${x(b)} ${y(b) + H / 2}`} />
        ))}
      </g>
      {nodes.map((n) => (
        <g class="node" data-id={n.id} tabindex="0" role="button" aria-describedby={`note-${n.id}`} transform={`translate(${x(n.id)} ${y(n.id)})`}>
          <rect width={W} height={H} rx="8" />
          <text x={W / 2} y={H / 2} dominant-baseline="middle" text-anchor="middle">{n.label}</text>
        </g>
      ))}
    </svg>
    <p class="note" aria-live="polite">Select a part to see what it does.</p>
  </div>
  <ul class="list">
    {nodes.map((n) => {
      const outs = edges.filter(([a, b]) => a === n.id && b !== n.id).map(([, b]) => label(b));
      return (
        <li data-id={n.id}>
          <strong>{n.label}</strong>
          <span id={`note-${n.id}`}>{n.note}</span>
          {outs.length > 0 && <span class="to">→ {outs.join(', ')}</span>}
        </li>
      );
    })}
  </ul>
</figure>

<script src="../scripts/diagram.ts"></script>

<style>
  .arch { margin: 32px 0; }
  .svg-wrap { display: none; }
  .list { list-style: none; padding: 0; display: grid; gap: 12px; }
  .list li { display: grid; gap: 2px; padding: 12px; border: 1px solid var(--c-rule); border-radius: 8px; }
  .list .to, .list span { color: var(--c-ink-2); }
  .list .to { font-family: var(--font-mono); font-size: var(--step--1); }
  @media (min-width: 720px) {
    .svg-wrap { display: block; overflow-x: auto; }
    .list { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
  }
  svg { width: 100%; height: auto; max-height: 420px; }
  path { fill: none; stroke: var(--c-ink-2); stroke-width: 1.25; transition: opacity var(--dur-base) var(--ease-enter); }
  .node rect { fill: var(--c-bg); stroke: var(--c-rule); }
  .node text { fill: var(--c-ink); font-family: var(--font-mono); font-size: 13px; }
  .node { cursor: pointer; transition: opacity var(--dur-base) var(--ease-enter); outline: none; }
  .node:focus-visible rect, .node.on rect { stroke: var(--c-accent); stroke-width: 2; }
  .arch.focus .node:not(.lit), .arch.focus path:not(.lit) { opacity: 0.2; }
  .note { font-size: var(--step-0); color: var(--c-ink-2); min-height: 3em; margin-top: 12px; }
  :global(.js-reveal) .arch:not(.in) .edges { opacity: 0; transform: scaleX(0.96); }
  .edges { transform-origin: left center; transition: opacity var(--dur-slow) var(--ease-enter), transform var(--dur-slow) var(--ease-enter); }
</style>
```

Note on the visually-hidden list: `clip` here is a static screen-reader-only pattern, not an animation. That is allowed.

- [ ] **Step 6: `src/scripts/diagram.ts`**

```ts
// Diagram interaction: focus/hover/tap lights a node + its neighbours.
// Edges reveal once on view (opacity/transform). Spec §5.3 item 7.
import { connectedTo } from '../lib/diagram';

document.querySelectorAll<HTMLElement>('.arch').forEach((fig) => {
  const edges: [string, string][] = JSON.parse(fig.dataset.edges || '[]');
  const note = fig.querySelector<HTMLElement>('.note');
  const nodes = [...fig.querySelectorAll<SVGGElement>('.node')];
  const paths = [...fig.querySelectorAll<SVGPathElement>('path')];

  const light = (id: string | null) => {
    fig.classList.toggle('focus', !!id);
    const set = id ? connectedTo(id, edges) : new Set<string>();
    nodes.forEach((n) => {
      n.classList.toggle('lit', set.has(n.dataset.id!));
      n.classList.toggle('on', n.dataset.id === id);
    });
    paths.forEach((p) => p.classList.toggle('lit', !!id && (p.dataset.from === id || p.dataset.to === id)));
    if (note) note.textContent = id ? document.getElementById(`note-${id}`)?.textContent ?? '' : 'Select a part to see what it does.';
  };

  nodes.forEach((n) => {
    n.addEventListener('pointerenter', () => light(n.dataset.id!));
    n.addEventListener('focus', () => light(n.dataset.id!));
    n.addEventListener('click', () => light(n.dataset.id!));
    n.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); light(n.dataset.id!); } });
  });
  fig.querySelector('svg')?.addEventListener('pointerleave', () => { if (!fig.contains(document.activeElement)) light(null); });
  fig.addEventListener('focusout', (e) => { if (!fig.contains(e.relatedTarget as Node)) light(null); });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(([en]) => { if (en.isIntersecting) { fig.classList.add('in'); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(fig);
  } else fig.classList.add('in');
});

export {};
```

- [ ] **Step 7: `SchemaCard.astro`** and **`CaseSection.astro`**

```astro
---
// SchemaCard: data model tables from frontmatter. Spec §3.3 item 3.
interface Props { schema: { table: string; fields: string[] }[] }
const { schema } = Astro.props;
---
<div class="schema">
  {schema.map((t) => (
    <div class="table">
      <p class="name">{t.table}</p>
      <ul>{t.fields.map((f) => <li>{f}</li>)}</ul>
    </div>
  ))}
</div>
<style>
  .schema { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; margin: 24px 0; }
  .table { border: 1px solid var(--c-rule); border-radius: 8px; overflow: hidden; font-family: var(--font-mono); font-size: var(--step--1); }
  .name { padding: 8px 12px; background: var(--c-bg-2); color: var(--c-ink); }
  ul { list-style: none; margin: 0; padding: 8px 12px; color: var(--c-ink-2); display: grid; gap: 4px; }
</style>
```

```astro
---
// One case-study section. Renders nothing when there's no content, so a
// missing fact never shows as an empty heading. Spec §3.3 honesty gate.
interface Props { title: string; id: string; text?: string; show?: boolean }
const { title, id, text, show } = Astro.props;
const visible = show ?? Boolean(text);
---
{visible && (
  <section class="case-section" aria-labelledby={id}>
    <h2 id={id}>{title}</h2>
    {text && <p>{text}</p>}
    <slot />
  </section>
)}
<style>
  .case-section { margin-top: var(--space-8); max-width: 68ch; }
  .case-section:has(.arch), .case-section:has(.schema) { max-width: none; }
  h2 { font-size: var(--step-3); margin-bottom: 12px; }
</style>
```

- [ ] **Step 8: Restructure `[slug].astro`.** Replace the body after `FactsRow`:

```astro
<CaseSection id="problem" title="The problem" text={project.data.problem} />
<CaseSection id="built" title="How it's built" show={Boolean(project.data.diagram)}>
  {project.data.diagram && <ArchDiagram diagram={project.data.diagram} />}
</CaseSection>
<CaseSection id="data" title="Data model" show={Boolean(project.data.schema)}>
  {project.data.schema && <SchemaCard schema={project.data.schema} />}
</CaseSection>
<CaseSection id="decision" title="A decision worth explaining" text={project.data.decision} />
<CaseSection id="change" title="What I'd change" text={project.data.change} />
<Prose><Content /></Prose>
<CaseSection id="for-you" title="What this means for your project" text={project.data.forYou} />
<PrevNext prev={prev} next={next} />
```

Add the imports. Also add `this-site` to the `titles`/`descriptions` maps, using the strings from `docs/copy-dev.md`.

- [ ] **Step 9: Verify.**
  - `npm test` passes.
  - Build.
  - `/work/this-site/` at 1440px shows the SVG. Hovering or tabbing a node dims the others and updates the note.
  - At 390px the list shows instead.
  - A project with no `decision` has no "A decision worth explaining" heading: run `grep -c 'id="decision"' dist/work/package-tracker/index.html`, which gives 0 if it wasn't confirmed.
- [ ] **Step 10: Commit**

```bash
git add -A src tests
git commit -m "feat: case-study template with interactive architecture diagram"
```

---

### Task 10: Home assembly, intro motion, magnetic CTA, section reveals, theme reveal

**Files:**
- Create: `src/components/MagneticLink.astro`, `src/scripts/magnetic.ts`, `src/scripts/reveal-sections.ts`
- Modify: `src/pages/index.astro`, `src/scripts/theme-toggle.ts`, `src/styles/global.css`, `src/components/Colophon.astro` (single line: clock · availability)

**Interfaces:**
- Consumes: `offersWithProjects`, `getLead`, `magnetOffset`, and all the components above.
- Produces: the final home page. `[data-reveal]` on any element opts it into a one-time reveal.

- [ ] **Step 1: `src/scripts/reveal-sections.ts`**

```ts
// One-time fade/rise for [data-reveal] sections; never re-animates.
// Only active under .js-reveal (motion allowed), so no-JS and reduced
// motion always show content. Spec §5.3 item 5.
const els = document.querySelectorAll<HTMLElement>('.js-reveal [data-reveal]');
if (els.length && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
  els.forEach((el) => io.observe(el));
} else els.forEach((el) => el.classList.add('in'));
export {};
```

Add to `global.css`:
```css
.js-reveal [data-reveal]:not(.in) { opacity: 0; transform: translateY(12px); }
.js-reveal [data-reveal] { transition: opacity var(--dur-slow) var(--ease-enter), transform var(--dur-slow) var(--ease-enter); }

/* Intro line reveal: once per session (head-inline sets .intro-seen). */
.js-reveal:not(.intro-seen) .line-mask { display: block; overflow: hidden; }
.js-reveal:not(.intro-seen) .line-mask > span { display: block; animation: line-up var(--dur-slow) var(--ease-enter) both; animation-delay: calc(var(--i, 0) * 40ms); }
@keyframes line-up { from { opacity: 0; transform: translateY(100%); } }
```

In `head-inline.js`, inside the `if (!reduced)` branch, add:
```js
try {
  if (sessionStorage.getItem('introSeen')) root.classList.add('intro-seen');
  else sessionStorage.setItem('introSeen', '1');
} catch (e) { /* storage blocked: play the intro every time */ }
```

- [ ] **Step 2: `MagneticLink.astro` + `src/scripts/magnetic.ts`**

```astro
---
// Primary CTA that leans toward the pointer on fine-pointer devices only.
interface Props { href: string }
---
<a class="magnetic" href={Astro.props.href} data-magnetic><span><slot /></span></a>
<script src="../scripts/magnetic.ts"></script>
<style>
  .magnetic { display: inline-flex; align-items: center; min-height: 48px; padding: 0 22px; border-radius: 999px; background: var(--c-accent); color: var(--c-accent-ink); text-decoration: none; font-weight: 500; transition: transform var(--dur-base) var(--ease-enter); }
  .magnetic:focus-visible { outline: 2px solid var(--c-focus); outline-offset: 3px; }
</style>
```

```ts
// Magnetic CTA: up to 6px toward the pointer within 80px. Desktop only;
// listens only while the pointer is near (pointermove on the element's
// padded hit area, not the window). Spec §5.3 item 10.
import { magnetOffset } from '../lib/motion';

if (matchMedia('(hover: hover) and (pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const zone = document.createElement('span');
    zone.style.cssText = 'position:absolute;inset:-80px;';
    el.style.position = 'relative';
    el.prepend(zone);
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const { x, y } = magnetOffset(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2), 80, 6);
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}
export {};
```

Note: `getBoundingClientRect` is read inside `pointermove` on one small element. That's acceptable (cheap, and no page scroll listener). The transform does not change the layout box, so there's no thrash loop.

- [ ] **Step 3: Theme circular reveal.** In `theme-toggle.ts`, replace the click handler body's `apply(next);` with:

```ts
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
if (doc.startViewTransition && fine && !reduced) {
  const r = button.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const radius = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy));
  const vt = doc.startViewTransition(() => apply(next));
  vt.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${cx}px ${cy}px)`, `circle(${radius}px at ${cx}px ${cy}px)`] },
      { duration: 450, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' },
    );
  }).catch(() => {});
} else {
  apply(next);
}
```

Add to `global.css`: `::view-transition-old(root), ::view-transition-new(root) { animation: none; mix-blend-mode: normal; }`. Scope this with `html.theme-vt`: add the class before `startViewTransition` and remove it on `vt.finished`, so page-navigation crossfades keep their default animation.

- [ ] **Step 4: Assemble `index.astro`.**

```astro
---
// Home: intro → offers → work → receipts → log. Spec §3.1.
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import DeviceFrame from '../components/DeviceFrame.astro';
import OfferSwitcher from '../components/OfferSwitcher.astro';
import WorkList from '../components/WorkList.astro';
import BuildReceipts from '../components/BuildReceipts.astro';
import CommitLog from '../components/CommitLog.astro';
import CopyEmail from '../components/CopyEmail.astro';
import Colophon from '../components/Colophon.astro';
import MagneticLink from '../components/MagneticLink.astro';
import { getLead } from '../lib/work';
import { site, home } from '../data/site';

const allWork = await getCollection('work');
const lately = await getCollection('lately');
const lead = getLead(allWork);
---
<BaseLayout title={home.title} description={home.description} current="work">
  <div class="container">
    <section class="intro">
      <h1 class="line-mask"><span style="--i:0">Adriel Tang</span></h1>
      <p class="role line-mask"><span style="--i:1">{home.roleLine}</span></p>
      <p class="pitch line-mask"><span style="--i:2">{home.pitch}</span></p>
      <div class="actions">
        <MagneticLink href="/contact/">Start a project →</MagneticLink>
        <CopyEmail />
      </div>
      <Colophon availability={site.availability} />
    </section>

    <div data-reveal><OfferSwitcher projects={allWork} /></div>

    {lead && (
      <a class="lead" href={`/work/${lead.id}/`} data-reveal>
        <DeviceFrame project={lead} variant="lead" eager />
        <span class="cap"><strong>{lead.data.title}</strong> {lead.data.summary} <span aria-hidden="true">→</span></span>
      </a>
    )}

    <div data-reveal><WorkList projects={allWork} excludeId={lead?.id} /></div>
    <div data-reveal><BuildReceipts /></div>
    <div data-reveal>
      <CommitLog entries={lately.map((e) => e.data)} limit={5} />
      <a href="/about/#log">Full log <span aria-hidden="true">→</span></a>
    </div>
  </div>
</BaseLayout>

<script src="../scripts/reveal-sections.ts"></script>
<script src="../scripts/stress.ts"></script>
```

The lead `DeviceFrame` gets `data-shot-slug`, so `vt.ts` morphs it into the hero. The spacing and grid follow the design-addendum layout sketches: `.intro` spans 12 columns at 1024px or wider, with the actions and colophon on one row. Each section uses `margin-top: var(--section)`.

- [ ] **Step 5: About/Contact/404.**
  - About: replace any `LatelyLog` import with `<div id="log"><CommitLog entries={lately.map((e) => e.data)} heading="Full log" /></div>`.
  - Everywhere: check with `grep -rn "c-paper\|plate\|Cover" src/pages`, which should return nothing.
  - Add `data-reveal` to the main sections on each page and include `reveal-sections.ts`.
- [ ] **Step 6: Verify.** Run `npm run build`, then:
  - `grep -c "Bantu2U" dist/index.html` returns 0.
  - `grep -rc "\[CONFIRM" dist | grep -v ":0"` prints nothing.
  - Preview at 360, 390, 768, 1024, 1440 and 1920px.
  - Intro lines rise once, and a reload in the same tab shows no intro animation.
  - The CTA leans toward the cursor on desktop and stays static on touch emulation.
  - Clicking the lead or a row morphs the screenshot into the hero (Chrome).
- [ ] **Step 7: Commit**

```bash
git add -A src
git commit -m "feat: assemble developer home with offers, receipts, log and motion"
```

---

### Task 11: Budget and performance verification + Lighthouse receipt

**Files:**
- Create: `receipts/lighthouse.json` (generated)
- Modify: none, unless a check fails

- [ ] **Step 1: JS budget.** Run `npm run build` and read the `[receipts]` log line. `js-kb` must be 25 or less. If it's over, find the largest chunk with `ls -S dist/_astro/*.js | head` and fix it (usually by moving a shared import out of a page-wide script).
- [ ] **Step 2: Page weight.** `page-kb` must be 300 or less.
- [ ] **Step 3: Deploy the preview** (push the branch; Vercel builds it). Then run `npm run lighthouse -- <preview-url>`. The performance score must be 95 or higher. If lower, read `receipts/lighthouse.json` `audits` for `largest-contentful-paint` and `cumulative-layout-shift`, fix, and re-run.
- [ ] **Step 4: Trace.**
  - Chrome DevTools Performance with 4x CPU throttle and a mobile viewport. Record: open the palette, switch offers 5 times fast, scroll the home page, and navigate to a case study.
  - No frames over 50ms during these interactions.
  - Layout Shift total under 0.02.
- [ ] **Step 5: Commit**

```bash
git add receipts/lighthouse.json
git commit -m "chore: record Lighthouse receipt"
```

---

### Task 12: QA pass (qa-reviewer agent) and Review Focus checks

**Files:** none new. Fixes go into the files QA names.

- [ ] **Step 1: Dispatch qa-reviewer** with the spec §9 checklist plus the Review Focus list above.
- [ ] **Step 2: Specifically verify Review Focus #5.**
  - With JS disabled (DevTools > Disable JavaScript), every section on `/`, `/work/habitect/` and `/about/` is visible, and no element sits at `opacity: 0`.
  - With reduced motion emulated and JS on, the same holds, and the palette opens without scale motion.
- [ ] **Step 3: Keyboard pass.** Skip link → header → Menu → palette → offers tablist (arrows) → rows → diagram nodes (Tab, Enter) → footer. The focus ring is visible on each.
- [ ] **Step 4: Fix findings, re-run `npm test && npm run build`, and commit**

```bash
git add -A
git commit -m "fix: QA findings for developer portfolio"
```

- [ ] **Step 5: Update docs.**
  - Add a note at the top of `docs/design-spec.md` saying the new spec supersedes its visual sections.
  - Update `docs/open-items.md` with anything still open: screenshots, rejected candidates.
  - Commit.
