# Portfolio revamp: design spec

Owner: Adriel Tang Thien Ern. Branch: `revamp-astro`. Spec date: 2026-09-29.
Sources of truth: the approved plan (`C:\Users\Adriel\.claude\plans\using-your-new-skills-merry-falcon.md`), the `studio-site-playbook` skill (SKILL.md + RECIPES.md), and `docs/copy.md` for every on-page string. Where copy.md and its **"Confirmed facts" section** disagree, the confirmed facts win. Where this spec is silent, the playbook applies.

## 0. Build type

- **Static content site.** Astro, `output: 'static'`, deployed to **Vercel** (the approved plan picks Vercel for this project, so no adapter is needed).
- **Content:** Markdown content collections (`work`, `lately`) plus typed data files (`src/data/about.ts`, `src/data/site.ts`). There's no CMS, and the owner edits files in git.
- **Stored data:** none. The contact form posts to Formspree (`https://formspree.io/f/mwpgnwzl`).
- **Client JS:** vanilla `<script>` modules in Astro components. No React, no framer-motion. Plain CSS with the tokens in §3 (no Tailwind needed).
- **Scale target:** 2 projects today, and it must hold at 40+ (§5.1.3, stress test in §11).

---

## 1. References (verified live, 2026-09-29)

I fetched these with WebFetch on 2026-09-29. WebFetch returns page content and markup, not rendered pixels, so QA should still screenshot the references side by side before sign-off (playbook §0.3). The table records what was observed and what is taken from it.

| Site | Observed 2026-09-29 | Borrowed | Deliberately not borrowed |
|---|---|---|---|
| **order.design** | Nav `Work · Contact · Index · OTF · Change`. The homepage is an archive-like list, newest first: project title with categories under it (e.g. "Knoll": Identity, Motion, Guidelines) and small thumbnails. Dated news items sit in the list ("13 May, 2026", "24 April, 2025": "Order teamed up with Queens-based furniture company, Lichen→, to produce a three-dimensional multi-time zone clock."). Restrained sans. | **Index as a first-class view** (folded into the Grid ⇄ Index toggle). **Captions show scope, not a restated name.** **Dated one-line entries** become "Lately". The trailing `→` on links. | Separate routes for Index and News. |
| **pentagram.com** | Home opens with one featured project (Obama Presidential Center), large, with a descriptive caption. After it comes a mixed grid: larger landscape tiles for featured work, smaller square or vertical tiles for the rest. Work filters by discipline and sector. Footer: "© 1972 – 2026 Pentagram". | **Lead project first, large, caption under it.** **Two-tier mixed grid.** **Filters generated from data** (scope), shown only once the archive is big. A plain copyright line. | Tagline over the lead, newsletter, sector taxonomy. |
| **rauno.me** | Opens with one plain sentence: "Rauno Freiberg is an Estonian interaction designer working with Vercel and Devouring Details." Email action with a "Copied" confirmation. Dated archive links (2023, 2022). | **One plain role sentence** under the name. **Email copy button with a "Copied" state.** | The seven-line "Make it …" manifesto (slogan/tricolon tell). |
| **paco.me** | Plain section headings (Building, Projects, Writing, Now, Connect) with nothing above them. Projects are a name plus one short line ("⌘K: Composable command menu React component"). There's a "Now" section. | **Plain headings, no eyebrows.** **Index rows = name + one short line.** "Now" becomes the colophon's "On the desk" line. | Italic-phrase tagline, the aphorism in the footer. |
| **brianlovin.com** | Intro: "a software designer living in San Francisco, currently making AI products at Notion." The footer is three working links: "Source", "llms.txt", "sitemap.xml". | **Role line pattern** (role, city, where now). **Footer of working links** (Source, Sitemap) instead of a logo. | The large sidebar nav (too heavy for 4 routes). |
| **brittanychiang.com** (developer portfolio) | Skip-to-content link. Experience rows: date range ("2018 — 2024"), "Role · Company", description. There's a "View Full Project Archive" link. The footer credits tools and the typeface (Figma, VS Code, Next.js, Tailwind, Vercel, Inter). | **Timeline row format** on /about. **Footer colophon line** naming the build and typefaces. An archive beyond featured work ("More work · N"). | Sticky left-column layout and tech-tag pills (both widely cloned tells). The easter-egg gif. |
| **emilkowal.ski** (developer portfolio) | Intro sentence naming his team. Projects as title + one line, no dates. The footer is a sentence: "You can see more of my work on Twitter and more of my code on GitHub". | Confirms the short, factual copy register. | Newsletter block. |

**Original to this site, not borrowed:** the header's bottom rule that fills with colour as you scroll and scrubs when dragged (§6.4), and per-project printed-object covers (§7).

---

## 2. Typography

### 2.1 Faces (free, self-hosted via Fontsource)

| Role | Family | npm package | Weights / axes used | Files fetched |
|---|---|---|---|---|
| All UI, headings, body | **Hanken Grotesk** (variable) | `@fontsource-variable/hanken-grotesk` | `wght` 400, 500, 600; no italic | 1: `hanken-grotesk-latin-wght-normal.woff2` |
| Meta, captions, dates, numbers, code; also the Package Tracker admin slip | **JetBrains Mono** (variable) | `@fontsource-variable/jetbrains-mono` | `wght` 400, 500; no italic | 1: `jetbrains-mono-latin-wght-normal.woff2` |
| Package Tracker cover: waybill print | **Archivo** (variable, width axis) | `@fontsource-variable/archivo` (import `wdth.css`) | `wdth` 75 and 100, `wght` 400, 700 | 1 latin wdth file, fetched only where that cover renders |
| Habitect cover: app UI + printed checklist | **Roboto** (variable), Flutter's Material default, so the app reads as a Flutter app | `@fontsource-variable/roboto` | `wght` 400, 500, 700 | 1 latin file, fetched only where that cover renders |
| Package Tracker driver phone | System UI stack | none | n/a | 0 |

**4 files** is the stated maximum. Only 2 load on /about, /contact and 404. The home page loads all 4, because both covers render there. Import only the non-italic CSS. Fontsource declares all subsets with `unicode-range`, so only `latin` should be fetched. Verify in DevTools Network, and if `latin-ext`/`vietnamese` appear, write local `@font-face` rules pointing at the latin woff2 only.

Tokens:
```
--font-sans:    "Hanken Grotesk Variable", "Hanken Fallback", system-ui, sans-serif;
--font-mono:    "JetBrains Mono Variable", ui-monospace, "Cascadia Mono", Menlo, monospace;
--font-waybill: "Archivo Variable", "Arial Narrow", Arial, sans-serif;
--font-habitect:"Roboto Variable", Roboto, system-ui, sans-serif;
--font-device:  system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
```

Loading:
- Preload **only** the two site woff2 files, with the URL from `import url from '@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2?url'` (same for JetBrains Mono): `<link rel="preload" as="font" type="font/woff2" crossorigin>`.
- `font-display: swap`. Add a metric-matched fallback `@font-face "Hanken Fallback"` (`src: local("Arial")` plus `size-adjust`/`ascent-override`/`descent-override` from `fontaine` or `capsize`), or use Astro's Fonts API with the Fontsource provider, which does preload and fallbacks for you. Pick one.

**Builder checks (playbook §1):**
1. Render `Habitect, Package Tracker; Flutter: Dart.` in Hanken at 16px and 48px. There must be no visible gap before `,` `;` `:`.
2. Check glyph coverage for `→ ↗ ← ·`. If Hanken's latin file lacks any, wrap arrows in `<span class="arrow">` set in `--font-mono` (JetBrains Mono has them). Never let arrows fall back silently.
3. Use `font-variant-numeric: tabular-nums` wherever numbers align (years, clock, dates).
4. Set `font-synthesis: none` globally, so no faux italic or bold appears.

### 2.2 Type scale (fluid 360 → 1440)

| Token | Size | Face / weight | Line height | Tracking | Used for |
|---|---|---|---|---|---|
| `--step--1` | 12px | mono 400 | 1.4 | 0 | Meta: dates, years, "No.", facts-row labels, counts, footer colophon |
| `--step-0` | 16px | sans 400/500 | 1.5 | 0 | UI, nav, captions, forms, footer, lists |
| `--step-1` | `clamp(17px, 0.19vw + 16.3px, 19px)` | sans 400 | 1.55 | 0 | Case-study prose, bio para 2, music para |
| `--step-2` | `clamp(19px, 0.46vw + 17.3px, 24px)` | sans 400/500 | 1.35 | -0.005em | Role line, colophon lines, section h2, bio para 1 |
| `--step-3` | `clamp(22px, 0.93vw + 18.7px, 32px)` | sans 500 | 1.25 | -0.01em | Case-study summary, prev/next, contact email |
| `--step-4` | `clamp(30px, 1.67vw + 24px, 48px)` | sans 500 | 1.1 | -0.02em | Page H1 (home name, about name, contact, 404) |
| `--step-5` | `clamp(40px, 5.9vw + 18.7px, 104px)` | sans 600 | 1.0 | -0.035em | Case-study H1 (project title) |

Rules:
- Headings are sentence case, and there are no uppercase labels in chrome (uppercase is allowed only on printed cover objects).
- No italic in chrome. Markdown `*em*` renders as weight 500.
- Prose max width is `64ch`, and the role line `40ch`.
- The home H1 is deliberately **not** giant (step 4). The work is the biggest thing on the home page.

---

## 3. Colour

### 3.1 Principle

Chrome is ink on paper. There's **one colour device**: the scroll-progress rule (§6.4), in signal vermilion. All other colour lives inside the work (plates). `--c-error` is functional and appears only on form errors.

Paper is a cool neutral, **not cream**. There are no gradients, glass, glows or tinted card backgrounds.

### 3.2 Tokens

| Token | Light | Dark | Role |
|---|---|---|---|
| `--c-paper` | `#F6F6F3` | `#111110` | Page background, input background |
| `--c-paper-2` | `#ECECE8` | `#1B1B19` | Index row hover (desktop), code blocks, copy-button hover |
| `--c-ink` | `#121212` | `#EDEDE8` | Text, primary button fill, focus ring, strong rules |
| `--c-ink-2` | `#5A5A56` | `#A09F98` | Secondary text: scope, meta, labels, dates |
| `--c-rule` | `#D6D6D0` | `#2E2E2A` | Hairlines, unfilled progress track |
| `--c-field-border` | `#8A8A84` | `#6E6D67` | Input and copy-button borders (≥3:1 on paper) |
| `--c-signal` | `#F03A17` | `#F03A17` | Progress fill + knob. **Nothing else.** |
| `--c-error` | `#B42318` | `#FF8A7A` | Form error text + invalid border only |

Computed contrast: ink-2 on paper is 6.4:1 (light) and 7.2:1 (dark). Signal on paper is 3.7:1 and 4.6:1, which passes 3:1 for an interactive control. Error text is ≥4.5:1 in both modes.

Theme mechanics:
- The default follows `prefers-color-scheme`, and `<html data-theme="light|dark">` overrides it.
- CSS: light tokens on `:root`. Dark tokens under `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {…} }` and under `:root[data-theme="dark"] {…}`. `color-scheme` is set to match.
- An inline blocking head script reads `localStorage.theme` and sets `data-theme` before first paint.
- There are two `<meta name="theme-color">` tags (with `media`), and the script rewrites them when the user overrides.
- **No colour transitions** on theme change.

### 3.3 Plates (per-project colour, never change with theme)

| Project | `plate` | `--c-on-plate` | Reasoning |
|---|---|---|---|
| Habitect | `#24483A` (deep forest green) | `#FFFFFF` | Dark plate so the white phone screen and paper checklist read as objects. Green suits a habit/progress app and is far from Package Tracker's yellow. |
| Package Tracker | `#F2C12E` (courier / warehouse safety yellow) | `#121212` | Reads as logistics without a logo, and is a very different identity to Habitect. |

**Default palette** for projects without `plate`, picked by `palette[hash(slug) % 8]` so the result is stable:
`#BFC3C0` concrete, `#3C4A57` slate, `#56643F` moss, `#9C3B2E` brick, `#9DBBD6` sky, `#5B3A57` plum, `#1F5E5E` teal, `#2B2B2B` charcoal.

`src/lib/plate.ts` exports `plateFor(entry): string` (always returns a hex) and `onPlate(hex)`, which returns `'#121212'` when relative luminance > 0.35, else `'#FFFFFF'`. Because `plateFor` never returns undefined, `--plate:undefined` can't happen (playbook §6).

---

## 4. Space, grid, breakpoints

### 4.1 Spacing (4px base)

```
--space-1: 4px   --space-2: 8px   --space-3: 12px  --space-4: 16px  --space-5: 24px
--space-6: 32px  --space-7: 48px  --space-8: 64px  --space-9: 96px  --space-10: 128px
--section: clamp(64px, 5.9vw + 42.7px, 128px);   /* gap between major home sections */
--header-h: 56px;
```

### 4.2 Breakpoints and grid (mobile first, `min-width`)

| Name | Min width | `--cols` | `--gutter` | `--margin` |
|---|---|---|---|---|
| base | 0 (designed at 360) | 4 | 16px | 16px |
| `sm` | 600px | 8 | 20px | 24px |
| `md` | 768px | 8 | 20px | 24px |
| `lg` | 1024px | 12 | 24px | 40px |
| `xl` | 1440px | 12 | 24px | 40px |

- Container: `max-width: 1600px; margin-inline: auto; padding-inline: var(--margin)`.
- `.grid { display:grid; grid-template-columns: repeat(var(--cols), minmax(0,1fr)); column-gap: var(--gutter); }` Use `minmax(0,1fr)` so nothing forces overflow.

### 4.3 Global rules

`html { scrollbar-gutter: stable; }` · `[hidden] { display:none !important; }` · `img { max-width:100%; height:auto; display:block; }` · `overflow-wrap: anywhere` on emails/URLs · `:focus-visible { outline: 2px solid var(--c-ink); outline-offset: 3px; }` · `scroll-margin-top: calc(var(--header-h) + 16px)` on headings and anchors.

---

## 5. Routes and layouts

Wireframes are schematic, and numbers are at the named viewport width. **All strings come from `docs/copy.md`** (confirmed facts override).

### 5.0 Site header (all pages)

```
1440: | Adriel Tang                                   Work   About   Contact    Auto |
      |============ progress rule: 2px, grey track, vermilion fill ================|
 360: | Adriel Tang                        About   Contact   Auto |
```

- `position: sticky; top: 0; z-index: 10; height: var(--header-h); background: var(--c-paper)`. There's no hide-on-scroll.
- Left: "Adriel Tang" (sans 500, step 0) links to `/`.
- Right: `<nav aria-label="Main">` with **Work** (`/#work`), **About**, **Contact**, then `ThemeToggle`. Gap 24px (≥600), 16px (<600).
- **Mobile, with no hamburger:** below 380px the "Work" link is hidden, because the name already goes to the work.
  - Width at 360 (328px usable): name ≈86 + About ≈44 + Contact ≈58 + toggle ≈40 + 3×16 gaps ≈ 276px, leaving ~52px spare. At 320 (288px usable) it still fits.
  - Every link is a 44px-tall hit area (padding-block 12px) centred in the 56px bar. That leaves 6px clear above and below for the progress rule's hit band.
- Current page: `aria-current="page"` gets a 1px underline, offset 6px, in ink.
- The progress rule (§6.4) is the header's bottom edge, and there's no other border.
- `view-transition-name: site-header`.
- **Skip link** is the first focusable element: "Skip to content", visually hidden until focus, then shown at top-left over the header (ink on paper, 2px ink outline). It targets `<main id="main" tabindex="-1">`.

### 5.1 Home `/`

Order: **Intro, Lead project, Work (Grid ⇄ Index), Colophon + Lately, Footer.**

```
1440 (12 col)
 Adriel Tang (H1, step-4, cols 1–6)          Full stack developer in Kuala Lumpur,   (cols 8–12,
                                             building web and mobile applications…   bottom-aligned)
 ┌────────────────────────────────────────────────────────────────────────────┐
 │                 LEAD COVER  (cols 1–12, height min(680px, 100svh − 240px)) │
 └────────────────────────────────────────────────────────────────────────────┘
 No. 1   Habitect   Mobile app, group coursework · 2025              View project →
                                ↓ --section
 Work  2                                                          Grid   Index
 ─────────────────────────────────────────────────────────────────────────────
 [featured rhythm]
 More work · 30 ──────────────────────────────────────────────────────────────
 [archive tiles, 4 across]                             Show 12 more   Show fewer
                                ↓ --section
 Colophon (cols 1–4)                   Lately (cols 6–12)
```

**5.1.1 Intro**
- `<h1>` "Adriel Tang" in step 4. The role line is a `<p>` in step 2, ink, max 40ch, taken from copy.md §2.
  - Suggestion for copy-writer, following the rauno/brianlovin pattern: add where he is now, e.g. "…with Next.js, Flutter, and Laravel. Currently at Bantu2U Holdings."
- ≥1024: 12-col grid, H1 cols 1–6, role cols 8–12, `align-items: end`, padding 48px top / 32px bottom.
- 768: stacked, role line cols 1–6, gap 12px, padding 40px / 28px.
- 360: stacked, padding 32px / 24px.
- No animation.

**5.1.2 Lead project**
- Lead = the first `featured: true` entry by `order`, which is Habitect today. Rotation per visit (playbook §2) is deferred until there are 5+ featured projects. At that point, add `lead: true` to entries and pick at runtime.
- One `<a href="/work/{slug}" class="lead">` wraps the `Cover variant="lead"` and the caption, and the caption text is the link's name.
- Sizing:
  - ≥1024: full container width, `height: min(680px, calc(100svh - 240px)); min-height: 420px` (a definite height, which `cqh` needs).
  - 768: `aspect-ratio: 4/3`.
  - 360: `aspect-ratio: 1/1` (square, per playbook §2).
- Caption, 12px below the cover:
  - `No. 1` (mono step -1 ink-2), **Habitect** (sans 500 step 0), `Mobile app, group coursework · 2025` (step 0 ink-2), and `View project →` right-aligned (sans 500).
  - At 360: line 1 is `No. 1  Habitect` with `View project →` on the right, and line 2 is scope · year in ink-2.
  - Don't use the em dash shown in copy.md's pattern. The separators are spacing and `·`.
  - **"No."** is the catalogue number: chronological position, oldest = 1. New work gets new numbers and old numbers don't shift. It has no zero padding: it's data, not decoration.
- Covers are drawn compositions (§7), and the objects lay down 120ms after load (§6.2).

**5.1.3 Work section** (`<section id="work" aria-labelledby="work-h">`)

Header row: `<h2 id="work-h">Work</h2>` (step 2, sans 500) followed by the total count in mono step -1 ink-2, counting all projects. `ViewToggle` is right-aligned. A 1px `--c-ink` rule sits under the row, then 24px of space.

**Scope filters** (Pentagram pattern, generated from data): rendered **only if there are ≥ 8 projects and ≥ 2 distinct `scope` values**. Text buttons `All 40 · Mobile app 12 · Web app 21 · …`, with counts covering all work, and `aria-pressed` on the active one. They apply to both Grid and Index. None render today.

**Grid view (default)**: excludes the lead. Two tiers.

*Featured tier* (`featured: true` minus the lead, by `order`). A 4-slot repeating rhythm at ≥1024, borrowed from Pentagram's mixed sizes and offset vertically so it doesn't read as a template:

| Slot (n mod 4) | Placement (12 col) | Cover aspect | Extra |
|---|---|---|---|
| 1 | `1 / span 7` | 4 / 3 | |
| 2 | `9 / span 4` | 4 / 5 | `align-self: end` |
| 3 | `2 / span 5` | 1 / 1 | `margin-top: var(--space-9)` |
| 4 | `7 / span 6` | 3 / 2 | `margin-top: var(--space-10)` |

Row gap 96px.
- 768 (8 col): slot 1 `1 / span 5` 4:3, slot 2 `6 / span 3` 4:5 end-aligned, slot 3 `1 / span 8` 3:2, slot 4 `3 / span 6` 1:1. Row gap 64px.
- 360: one column, aspect alternating 1:1 / 4:5, gap 48px.
- Today only Package Tracker is in this tier, so it sits in slot 1 (7 columns, left). Leave it; don't stretch it or pad the tier with filler.

*Featured tile* (`WorkTile variant="feature"`): an `<a>` that wraps the cover and caption. The caption sits 12px below. Line 1 is **name** (sans 500) with year right-aligned (mono ink-2). Line 2 is `scope · stack` (ink-2), a single line with ellipsis at ≥768 and wrapping at 360.

*Archive tier* (`featured: false`, year desc then `order`): only rendered if there's at least one entry.
- Heading: `<h3 id="more-h" tabindex="-1">More work · {N}</h3>` (sans 500 step 0), with a 1px `--c-rule` line filling the rest of the row. Margin-top 96px (≥1024) / 64px.
- Tiles: cover 4:3. 4 across ≥1024, 3 across 768–1023, 2 across below 768. Row gap 32px. Caption is name + year only.
- Tiles get `content-visibility: auto; contain-intrinsic-size: auto 320px`.
- **12 at a time.** "Show 12 more" (or "Show N more" when fewer remain) plus a quiet "Show fewer", both text buttons.
  - After "Show more", focus moves to the first newly shown tile if the button disappeared, and stays on the button otherwise.
  - "Show fewer" resets to 12, then `moreHeading.scrollIntoView({block:'start', behavior:'instant'})` and focus on the heading (recipe §5).
- No-JS: everything is visible and the buttons are hidden.

**Index view**: includes **all** projects (lead too), grouped by year descending (Order pattern).
- One `<ol>` per year. The year heading is an `<h3>` in mono step -1 ink-2 with a 1px `--c-ink` rule above it.
- Each row is one `<a>` (block link), with a 1px `--c-rule` top border and `min-height: 56px`.
- Columns:
  - ≥1024: `No.` (col 1, mono ink-2) · **Name** (2–5, sans 500) · Scope (6–8, ink-2) · Stack (9–11, ink-2, ellipsis) · Year (12, mono, right).
  - 768: No. (1) · Name (2–4) · Scope (5–7) · Year (8). Stack is hidden.
  - 360: `[thumb 56×42]` · Name with scope below it in ink-2 · Year right. No. is hidden.
- **Hover preview (desktop only)**, `@media (hover:hover) and (pointer:fine)`: a single fixed 280×210 `IndexPreview` holding `Cover variant="preview"`.
  - It sits at the pointer offset (+24px, −105px) and flips left near the right edge.
  - Row hover background is `--c-paper-2`, applied instantly.
- **Touch equivalent:** under `(hover:none)` or below 768px, each row shows a static 56×42 `Cover variant="thumb"`, and the preview element isn't shown.
- Keyboard: rows are links in DOM order, and the preview doesn't appear on focus.

**ViewToggle**
- `role="group" aria-label="View"` containing two text buttons, `Grid` and `Index` (sans 500). The active one has `aria-pressed="true"` and a 1px underline, offset 6px. The inactive one is ink-2.
- Switching is instant, and focus stays on the button.
- Saved in `localStorage.workView` and applied before paint by the head script (`data-work-view` on `<html>`).
- No-JS: Grid shows and the toggle is hidden.

**5.1.4 Colophon + Lately** (`<section aria-labelledby="colophon-h">`)
- The "Colophon" `<h2>` is visually hidden. "Lately" has a visible `<h2>` (step 2, sans 500).
- **Colophon** (step 2, ink, each line a `<p>`):
  1. `Kuala Lumpur, <LiveClock/>`. The time is `HH:MM`, 24h, in mono at the same size, `tabular-nums`, `min-width: 5ch`. The server renders `Kuala Lumpur, GMT+8` and JS swaps in the time (`<time datetime>`).
  2. On the desk (copy-writer, updated for the confirmed facts: he now works at Bantu2U full-time, not as an intern).
  3. Availability: **not** "open to graduate roles". He's employed. Use the confirmed-facts line, e.g. "Working at Bantu2U. Happy to hear about side projects." (owner to confirm the wording).
  4. Links in step 0: email, GitHub ↗, LinkedIn ↗.
  - Drop copy.md's "Finishing a BIT… expected 2026" line (outdated: the degree was completed April 2026).
- **Lately** (`<ol>`, newest first):
  - Each `<li>` is a grid of `9ch 1fr`, gap 16px, with a 1px `--c-rule` top border and padding-block 12px.
  - The date is mono step -1 ink-2 in `MMM YYYY` (e.g. `Sep 2026`) as `<time datetime="2026-09">`. The text is sans step 0.
  - Shows the latest **6**, with the rest in `<details><summary>Show all {N}</summary>…</details>`.
  - Copy-writer must fix the outdated entries: "On track to graduate" becomes a completion entry (Apr 2026), and add the full-time start. The Habitect (2025) and Package Tracker (2025) entries now have years.
- Layout: ≥1024 has colophon in cols 1–4 and Lately in cols 6–12, top-aligned. 768 and 360 stack them (colophon first), gap 64px / 48px.

### 5.2 Case study `/work/[slug]`

```
1440
 Habitect (H1 step-5, cols 1–7)                   Summary, step-3, cols 8–12
 HERO COVER  full width, height min(760px, 100svh − 160px)   view-transition-name: cover
 ─────────────────────────────────────────────────────────────────────────────
 Role          Team                  Scope        Stack           Year   Links
 [CONFIRM]     Group of 4, coursework Mobile app  Flutter, Dart   2025   Repository ↗
 ─────────────────────────────────────────────────────────────────────────────
                     [prose cols 4–10, max 64ch]
 ─────────────────────────────────────────────────────────────────────────────
 ← Package Tracker                     All work                      (next) →
```

- **Title block:** `<h1>` (step 5) plus summary `<p>` (step 3, ink, max 34ch).
  - ≥1024: two columns, `align-items: last baseline`. 768/360: stacked, gap 16px.
  - Top padding 48px / 32px / 24px, then 32px to the cover.
- **Hero cover** (`Cover variant="hero"`): ≥1024 full width with `height: min(760px, calc(100svh - 160px)); min-height: 440px`. 768 is 4:3 and 360 is 1:1. It always has `view-transition-name: cover`.
- **Facts row** (`FactsRow`, a `<dl>`): 1px ink rule above, `--c-rule` below, padding-block 20px, 24px below the cover.
  - Items: **Role** (his part: `[CONFIRM]` for both projects, and until confirmed, render "Developer"), **Team** (e.g. "Group of 4, coursework" / "Group of 5, coursework", from confirmed facts), **Scope**, **Stack**, **Year**, and **Links** (Repository ↗, plus Live ↗ only if `live` exists).
  - `<dt>` in mono step -1 ink-2, `<dd>` in sans step 0.
  - ≥1024: 6 columns (`2fr 2fr 2fr 3fr 1fr 2fr`). 768: 3 columns × 2 rows. 360: 2 columns, and Links spans both.
- **Body** (`Prose`, from Markdown):
  - ≥1024: `4 / span 7`, max 64ch. 768: cols 1–7. 360: full width.
  - `<h2>` in step 2 sans 500, 48px above and 12px below. Lists get a mono `–` marker with a hanging indent.
  - Images fill the prose width, and `<figcaption>` (mono step -1 ink-2) comes from the Markdown title attribute. `<figure class="wide">` (raw HTML) spans `2 / span 10` at ≥1024.
  - Code: Shiki `css-variables` theme mapped to ink tokens, on `--c-paper-2`, 16px padding, `overflow-x:auto` inside the block only, mono 14px.
  - **Structure varies per project** (playbook §2). There's no shared heading template. Credit the group honestly in the body ("Built with four classmates for …"), and only claim the parts Adriel built.
- **Prev / next** (`PrevNext`): 1px ink rule above, padding-block 32px, margin-top 96px.
  - `← {prev title}` on the left and `{next title} →` on the right, in step 3 sans 500. "All work" (step 0, links to `/#work`) is centred at ≥768.
  - At 360 they stack: prev, next, All work, each a 48px-tall full-width target.
  - Order is chronological (matching "No."), with no wrap-around. Omit a missing side.
  - There's no coloured panel and no pill.

### 5.3 About `/about`

```
1440
 ┌ Photo cols 1–4, 4:5, sticky top 88px ┐   Adriel Tang Thien Ern (H1 step-4), cols 6–11
 │                                      │   Role line (step-2)
 │                                      │   Bio
 │                                      │   Education and work (timeline)
 │                                      │   Skills (3 plain lists)
 └──────────────────────────────────────┘   Sound and music (one paragraph)
```

- **H1:** full name "Adriel Tang Thien Ern" (step 4), with the role line from copy.md §3 under it, **updated**: he's no longer studying or interning. Copy-writer to fix.
- **Photo** `public/images/tempProfile.jpg` (him playing acoustic guitar, which ties to the music paragraph):
  - Astro `<Image>`, widths 480/800/1200, AVIF + WebP, explicit dimensions.
  - `object-fit: cover; object-position: 45% 35%` keeps the face and the guitar neck in frame. Radius 0.
  - Alt text from copy.md §6. An optional caption under it (mono step -1 ink-2) only if the owner names the occasion.
  - ≥1024: cols 1–4, `aspect-ratio: 4/5`, `position: sticky; top: 88px`, `loading="eager"`.
  - 768: cols 1–5 of 8, 4:5, after the bio, `loading="lazy"`. 360: full width, 4:5, after the bio, lazy.
  - Use two `<picture>`/`<Image>` instances only if needed. A single image with `loading="lazy"` is acceptable, because on desktop it's in the first viewport and browsers load in-viewport lazy images immediately.
- **Bio:** 2 paragraphs, the first in step 2, the second in step 1, max 58ch. Copy-writer must rewrite para 2 for the confirmed facts (degree completed Apr 2026, now employed at Bantu2U).
- **Timeline**, heading "Education and work" (step 2, sans 500). `<ol>` newest first. Each `<li>` is a `14ch 1fr` grid with a 1px rule on top and padding-block 16px:
  - Left: date range (mono step -1 ink-2).
  - Right: role (sans 500) / org (ink-2) / optional note (step 0).
  - At 360 it's a single column with the date above.
  - Entries, per confirmed facts:
    1. `May 2026 – now` · [CONFIRM job title] · Bantu2U Holdings Sdn Bhd
    2. `Oct 2025 – Apr 2026` · Software Development Executive Intern · Bantu2U Holdings Sdn Bhd
    3. `Jun 2023 – Apr 2026` · BIT (Hons) Software Systems Development · TAR UMT · note: "First Class Honours, CGPA 3.78" [CONFIRM wording]
- **Skills**, heading "Skills". There are three `<h3>` groups from copy.md: Frameworks & libraries, Languages, Tools & data. Each is a plain `<ul>`, one item per line, no bullets, a 4px row gap, no icons or blurbs. 3 columns at ≥768, 2 at 360.
- **Sound and music**, heading "Sound and music", one paragraph in step 1 (copy.md §3, with the owner confirming the organisation and tense).
- Right-column section gap is 64px (≥1024) / 48px.
- Order at 768/360: H1, role line, bio, photo, timeline, skills, sound and music.

### 5.4 Contact `/contact`

```
1440
 Contact (H1 step-4)                               │ Or send a message (h2 step-2)
 Reach out by email, WhatsApp, or the form below.  │ Name    [______________]
 adrieltangte@gmail.com  [Copy]                    │ Email   [______________]
 GitHub ↗ / LinkedIn ↗ / Message on WhatsApp ↗     │ Message [______________]
 (cols 1–6)                                        │ [Send message]  (cols 8–12)
```

- The intro line is from copy.md (step 2).
- **Email:** an `<a href="mailto:">` in step 3 sans 500 with `overflow-wrap: anywhere`, followed by `CopyEmail`.
  - `CopyEmail` is a button with the text "Copy" (mono step -1, 1px `--c-field-border` border, 36px visual height, 44px hit area).
  - On success the text becomes "Copied" for 2000ms, and a visually hidden `aria-live="polite"` region says "Email address copied".
  - If the Clipboard API rejects, select the email text and announce "Press Ctrl+C to copy". (rauno.me pattern.)
- **Links:** a `<ul>` in step 2, 56px rows, 1px rules between them. GitHub (`https://github.com/AdrielTTE`), LinkedIn (`https://www.linkedin.com/in/adriel-tang-6a5a941a0/`), "Message on WhatsApp" (`https://wa.me/60163231053`, plus the prefilled text if the owner keeps it). All get `↗` and `rel="noopener"`, and there are no brand icons.
- **Form** (`ContactForm`):
  - `action="https://formspree.io/f/mwpgnwzl" method="POST"`, which works without JS. With JS, submit with `fetch` + `Accept: application/json`.
  - Fields: Name (`autocomplete="name"`, required), Email (`type=email`, `autocomplete="email"`, required), Message (`<textarea rows=8>`, required, `minlength=10`). Honeypot `_gotcha` (visually hidden, `tabindex=-1`), `_subject` "Portfolio contact".
  - Real `<label for>` above each field (sans 500 step 0), 8px gap.
  - Inputs are 48px tall, padding 12px, `--c-paper` background, 1px `--c-field-border` border, radius 2px, 16px text (no iOS zoom).
  - States:
    - *hover* (desktop): border `--c-ink`.
    - *focus-visible*: 2px ink outline, offset 2px.
    - *invalid*: shown after blur or submit, never while typing. 2px `--c-error` border, a message below in `--c-error` linked by `aria-describedby`, and `aria-invalid="true"`. On a failed submit, focus the first invalid field.
    - *sending*: "Sending…", `disabled`, `aria-busy="true"` on the form.
    - *success*: replace the form with `<h2 tabindex="-1">` holding copy.md's success message, and focus it.
    - *error*: a `role="alert"` line above the button with copy.md's error message. The fields keep their values.
  - Submit is `Button variant="primary"` "Send message": full width at 360, auto at ≥768.
- Layout: ≥1024 has cols 1–6 and 8–12. 768 and 360 stack them (email, links, form), gap 64px.

### 5.5 404

- H1 "Page not found." (step 4), then the copy.md line (step 2) with links to the homepage and `/#work`. Optionally show `location.pathname` in mono (JS, and the server renders without it).
- Nothing else: the footer strip helps people find work. Not animated.
- Title from copy.md, plus `<meta name="robots" content="noindex">`.

### 5.6 Footer (all pages)

```
1440
 ─────────────────────────────────────────────────────────── 1px ink
 Latest work
 [plate  ][plate  ] … up to 8                              All work →
 ───────────────────────────────────────────────────────────
 adrieltangte@gmail.com   GitHub ↗   LinkedIn ↗   Source ↗   Sitemap
 Built with Astro. Set in Hanken Grotesk and JetBrains Mono.    © 2026 Adriel Tang
```

- Margin-top `--section`, padding-bottom 48px.
- **Latest work** (`FooterStrip`, capped at 8, newest first):
  - `<h2>` "Latest work" (sans 500 step 0).
  - Each block is an `<a>`: a plate rectangle (`aspect-ratio: 4/3; background: var(--plate)`) with the project name printed bottom-left in `--c-on-plate` (sans 500, 14px, 10px inset). No image or composition, so it's cheap everywhere.
  - Current project: `aria-current="page"` plus a 2px ink outline, offset 3px.
  - "All work →" is a text link after the blocks.
  - ≥1024: 8-column grid, one row. 768: 4 columns. <600: a horizontal scroller inside the container (`display:flex; overflow-x:auto; scroll-snap-type:x mandatory; gap:12px`), blocks `flex: 0 0 42%`, with the scrollbar visually hidden. "All work →" goes below it. The page itself never overflows.
- **Links row** (step 0, wraps at 360): email, GitHub ↗, LinkedIn ↗, Source ↗ (the site repo, brianlovin pattern: **only if the owner makes it public**), Sitemap (`/sitemap-index.xml`).
- **Colophon line** (mono step -1 ink-2, Brittany Chiang pattern): "Built with Astro. Set in Hanken Grotesk and JetBrains Mono." with "© {build year} Adriel Tang" right-aligned (≥768) or on the next line (360).
- There's **no giant wordmark**.

---

## 6. Motion

Global: animate only `transform`/`translate`/`rotate`/`scale`/`opacity`. No scroll listeners. **Page text never animates.** No staggered fade-ups, parallax, or colour/box-shadow/filter transitions.

```
--ease-settle: cubic-bezier(.2, 0, 0, 1);   /* morph, placing, hover lift */
--ease-out:    cubic-bezier(.3, 0, .2, 1);   /* small UI responses */
--dur-morph: 560ms;  --dur-place: 800ms;  --dur-hover: 600ms;  --dur-ui: 160ms;
```

### 6.1 Project open: cross-document View Transition (the one orchestrated moment)

Use native cross-document View Transitions (`@view-transition { navigation: auto; }`), **not** `<ClientRouter />`, which keeps pages as normal loads so scripts stay simple. Chromium 126+ and Safari 18.2+ morph, and other browsers navigate normally (accepted, with no fallback animation).

**Only one element per page is named `cover`**, so dozens of tiles are never captured:
- Case-study hero: always `view-transition-name: cover`.
- Home → case study: a `pageswap` listener checks whether `event.activation.entry.url` is `/work/{slug}`. If so, it finds the visible `[data-cover-slug="{slug}"]` (lead, featured or archive tile, **not** Index thumbs or footer blocks) and sets `el.style.viewTransitionName = 'cover'`. If none is visible (e.g. the click came from an Index row), no name is set and the page just crossfades.
- Case study → home (back): a `pagereveal` listener checks whether `navigation.activation.from.url` is `/work/{slug}` and the matching tile intersects the viewport after scroll restoration. If so, it names that tile `cover`, and otherwise skips it. Clear the name on `viewTransition.finished`.
- Case study → case study (prev/next): both heroes are named, so it reads as an in-place swap. If testing shows it looks wrong, drop the name in `pageswap` when the destination is another `/work/` page.
- `SiteHeader`: `view-transition-name: site-header`. `ProgressBar`: `progress`.

**No double exposure (playbook §6):** only the **new** snapshot is shown in the cover group, cropped to the growing frame, so the last frame is exactly the target:

```css
@view-transition { navigation: auto; }

::view-transition-group(cover) {
  animation-duration: var(--dur-morph);
  animation-timing-function: var(--ease-settle);
}
::view-transition-image-pair(cover) { overflow: clip; }
::view-transition-old(cover) { animation: none; opacity: 0; }
::view-transition-new(cover) {
  animation: none;
  width: 100%; height: 100%;
  object-fit: cover;              /* one picture, centred, never stretched */
}

::view-transition-old(root) { animation: 180ms var(--ease-out) both vt-fade-out; }
::view-transition-new(root) { animation: 300ms var(--ease-out) 120ms both vt-fade-in; }
::view-transition-group(site-header),
::view-transition-group(progress) { animation-duration: 0s; }

@keyframes vt-fade-out { to { opacity: 0; } }
@keyframes vt-fade-in  { from { opacity: 0; } }

@media (prefers-reduced-motion: reduce) {
  @view-transition { navigation: none; }
}
```

- Timeline: the cover takes 0–560ms. The old page is gone by 180ms and the new page is fully in by 420ms, **inside** the morph, so nothing lands after the cover (the playbook "cut" pitfall).
- Compositions are centred and laid out in `cqh`, so the cropped new snapshot at tile size looks like the tile. The start frame should match.
- If the hero arrived by morph, its lay-down must not play. In `pagereveal`, if `event.viewTransition` exists, add `no-enter` to the hero and never remove it for this page view. On a direct load, the lay-down plays.
- **QA:** at 10% speed (DevTools Animations), inspect frames at 0, 140, 280 and 560ms. At 0ms there should be no jump from the clicked tile, and at 560ms no pop when the pseudo tree is removed. Also test at 4× CPU throttle at 412px, with no frames over 34ms.
- **Cost flag:** the group animates the snapshot's width/height, which isn't pure transform. It's cheap for one element, which is why only one is ever named.

### 6.2 Covers are "placed", not faded

This applies to the printed objects of compositions in the **lead, featured tiles and case-study hero**. It doesn't apply to archive tiles, thumbs, preview or footer blocks.
- The plate is visible from first paint, and only the objects are set down.
- `@keyframes lay-down { from { opacity:0; translate: 0 -6cqh; } to { opacity:1; translate: 0 0; } }`
- `animation: lay-down var(--dur-place) var(--ease-settle) backwards; animation-delay: calc(var(--row-delay, 0ms) + var(--d));` with `--d` = 0, 110, 200 and 280ms for objects 1–4. `backwards` fill keeps the hover transforms working afterwards (recipe §2).
- Trigger: an IntersectionObserver (`threshold: .25`, `rootMargin: 0px 0px -10% 0px`) adds `.in` once and then unobserves. The lead and hero start 120ms after `DOMContentLoaded` without an observer. For featured tiles in the same visual row, the second gets `--row-delay: 90ms`.
- The pre-state (`opacity:0`) applies only under `html.js-reveal`. The head script adds it unless reduced motion is set, so no-JS and reduced-motion users see objects at rest with no animation.

### 6.3 Hover (desktop only: `(hover:hover) and (pointer:fine)`)

- Composition covers: objects get `translate: 0 -1cqh; rotate: calc(var(--r) + var(--hr))` with `--hr` 1.5deg and -1.5deg on even children, over `--dur-hover` `--ease-settle` (recipe §1).
- Image covers (once real screenshots exist): the `<img>` inside the clipped frame goes `scale: 1.02` over `--dur-hover` `--ease-settle`.
- The caption `→` gets `translate: 4px 0` over `--dur-ui` `--ease-out`. The underline appears instantly.
- **Touch:** nothing is needed. It's ornament, the tile is a plain link, and every hover rule sits inside the media query, so nothing sticks.
- **Reduced motion:** the transforms are removed.

### 6.4 Scroll-progress rule (the colour device, draggable)

- **Markup:** `<div class="progress" role="scrollbar" aria-controls="main" aria-orientation="horizontal" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-label="Page position" tabindex="-1">` with `.track` (2px, `--c-rule`, full width), `.fill` (2px, `--c-signal`, `transform-origin: left`) and `.knob` (10×10 square, `--c-signal`, `opacity: 0` at rest).
  - It's `container-type: inline-size` and positioned at the header's bottom edge.
  - `aria-valuenow` updates only during drag.
- **Progress** (recipe §4):
  ```css
  @supports (animation-timeline: scroll()) {
    .progress .fill { animation: fill linear both; animation-timeline: scroll(root); }
    .progress .knob { animation: knob linear both; animation-timeline: scroll(root); }
  }
  @keyframes fill { from { transform: scaleX(0); } to { transform: scaleX(1); } }
  @keyframes knob { from { transform: translateX(-5px); } to { transform: translateX(calc(100cqw - 5px)); } }
  ```
  Unsupported browsers show a static grey hairline, and the drag handlers aren't attached (`CSS.supports('animation-timeline: scroll()')`).
- **Scrub:** `pointerdown` → `setPointerCapture`, `.drag`, `scrubTo`; `pointermove` while `.drag`; `pointerup/cancel` → remove `.drag`. `scrubTo` = `scrollTo({ top: p * (scrollHeight - innerHeight), behavior: 'instant' })`. The hit band is `::before { inset: -6px 0 -10px; }` (18px), with `touch-action: none` on the bar only and cursor `ew-resize`.
- **Hover/drag feedback:** `.track` and `.fill` get `scale: 1 2` (2px → 4px, origin top) and the knob `opacity: 1`, over `--dur-ui` `--ease-out`. On touch, the same applies while `.drag` is set.
- **Mobile:** it's the same component. The band extends 10px below the header into content. If QA sees accidental scrubs on phones, reduce the lower inset to 4px.
- **Reduced motion:** kept, because it shows position (playbook §4). The thickness change becomes instant.
- Short pages (not scrollable) show a full fill and no knob.

### 6.5 Everything else

| Interaction | Motion |
|---|---|
| Index preview show/hide | `opacity` 0→1 over 120ms `--ease-out`. Content swaps instantly between rows. |
| Index preview trailing | JS sets `translate` from `pointermove` on the list element (rAF-batched). CSS `transition: translate 180ms var(--ease-settle)` makes it trail. Reduced motion: `transition: none`. |
| Grid ⇄ Index, Show more/fewer, filters | Instant, with no lay-down on revealed archive tiles. |
| Copy email | Text swap only. |
| Button `:active` | `translate: 0 1px`, instant. |
| Theme toggle | Instant. Add `html.theme-switching * { transition: none !important }` for one frame. |
| Live clock | Updates on the minute boundary, with no motion. |
| Ordinary page load | Nothing fades in. |

---

## 7. Covers

Both projects get **drawn placeholder compositions** until real screenshots arrive (confirmed facts: `habitects.png` is not a screenshot and **must not be used anywhere**; the builder should delete it along with the old `dev-blog.jpg` / `weather-app.jpg` references).

### 7.1 Resolution order (in `Cover`)

1. A composition registered for the slug in `src/covers/registry.ts` (Habitect and Package Tracker today).
2. Else `cover` from frontmatter (an image in `src/assets/work/{slug}/`, via Astro `image()`), rendered with `<Image>` and `object-fit: cover` on the plate.
3. Else `DefaultCover`.

When real screenshots arrive: delete the registry entry, set `cover` + `coverAlt`, and keep the same plate.

### 7.2 Plate mechanics (recipe §1)

```css
.plate { position: relative; container-type: size; overflow: clip;
         background: var(--plate); color: var(--c-on-plate); }
.obj {
  position: absolute;
  left: calc(50% + (var(--x,0) - var(--w,20) / 2) * 1cqh);
  top:  calc(50% + (var(--y,0) - var(--h,20) / 2) * 1cqh);
  width: calc(var(--w,20) * 1cqh); height: calc(var(--h,20) * 1cqh);
  rotate: var(--r, 0deg);
}
```
- Every variant gives the plate a **definite** size, via `height` or `aspect-ratio` on the plate itself, **never `min-height` alone** (otherwise `cqh` = 0). The plate is never inside a `<button>`.
- Keep objects within ±48cqh horizontally, so they fit a 1:1 tile.
- The composition markup is `aria-hidden="true"`. The `.plate` element gets `role="img"` and `aria-label={coverAlt}`.
- All printed text is ≥4.5:1 against its own object surface (axe counts it, playbook §7).
- Object text sizes are in `cqh`. Tiny text reads as print texture, which is fine.
- Shadows: a static `filter: drop-shadow(0 .6cqh .8cqh rgb(0 0 0 / .18))` on objects, **never animated or transitioned**.
- `Obj.astro` emits `<span class="obj {class}" style="--x:…;--y:…;--w:…;--h:…;--r:…deg">`.
- `compact` mode (archive tiles, thumbs, preview) renders **plate + title only** (the DefaultCover compact layout), so heavy composition DOM never repeats at scale.

### 7.3 Habitect (`HabitectCover.astro`)

Story: a Flutter habit tracker, shown as the phone app plus the paper habit it replaces. Plate `#24483A`. Typeface **Roboto** (`--font-habitect`) for everything printed, since that's Flutter's Material default, so it reads as a Flutter app rather than as this site.

| # | Object | `--x --y --w --h --r` | Surface | Printed content (real text, no grey bars) |
|---|---|---|---|---|
| 1 | Paper weekly checklist (A5 sheet, behind) | `-17 3 38 58 -5deg` | `#FBFBF8` paper, faint 0.15cqh `#C9C9C2` ruled lines | Heading **`Week of 8 Sep`** (Roboto 700, 3.4cqh). A 7-column grid headed `M T W T F S S` (Roboto 500), rows `Drink 2 L water`, `Read 20 pages`, `Walk 6,000 steps`, `Sleep by 00:30`, `Guitar, 30 min`. Cells hold ink ticks `✓` or empty squares, and a couple of rows are crossed out in pen (a 0.3cqh `#1B3FA0` rotated line). All text `#121212`/`#4A4A46`. |
| 2 | Phone (Material UI, front) | `12 -3 31 64 3deg` | Bezel `#0E0E0E` (1.2cqh, radius 4cqh), screen `#FFFFFF` | Status bar `9:41`. App bar **`Today`** with the date `Tue, 16 Sep` (ink-2). Progress line `3 of 5 done`, plus a drawn linear progress bar (60%, fill `#24483A`). List tiles, each with a round check (filled `#24483A` with a white tick when done): `Drink 2 L water · Done`, `Read 20 pages · Done`, `Walk 6,000 steps · 4,120`, `Sleep by 00:30`, `Guitar, 30 min · Done`. A FAB-style square `+` bottom-right (`#24483A`). Bottom nav labels `Today  Habits  Stats`. |
| 3 | Streak grid card (widget) | `27 26 26 15 -2deg` | `#FFFFFF`, radius 1.5cqh | Label **`Streak · 12 days`** (Roboto 500). A 7×4 grid of small squares (the last 4 weeks) in 4 steps of `#24483A` opacity (static, not animated), with a few empty. Row labels `Aug`, `Sep` in ink-2. |

- Stacking: checklist, then phone, then streak card.
- Lay-down `--d`: checklist 0ms, phone 110ms, streak card 200ms.
- Horizontal extents: checklist left edge −36, streak card right edge +40. Within ±48.
- `coverAlt`: "Habitect: the app's Today screen with a habit list, a streak grid, and a paper habit checklist."
- **Owner flag:** the habits are invented, plausible content (not from the repo, whose README is the default Flutter template). Swap in real habit names or screens if he has them, and replace the whole composition with screenshots when available.

### 7.4 Package Tracker (`PackageTrackerCover.astro`)

Story: one parcel as seen by each of the app's three user types. The customer gets the waybill, the driver the delivery screen, and the admin the status log. Plate `#F2C12E`.

| # | Object | `--x --y --w --h --r` | Surface | Typeface | Printed content |
|---|---|---|---|---|---|
| 1 | Thermal waybill (4×6 label) | `-15 1 42 64 -4deg` | `#FAFAF7`, 0.3cqh `#121212` rules between blocks | `--font-waybill` (Archivo: `wdth` 75 wght 700 for headings, `wdth` 100 wght 400 for body), all `#121212` | Top band **`STANDARD`** + `1.2 kg · 1 of 1`. **FROM** `Kedai Buku Rahman, 12 Jalan Genting Klang, 53300 Setapak, Kuala Lumpur`. **TO** `Lim Wei Jie, 8-3 Residensi Wangsa, Jalan 1/27A, 53300 Wangsa Maju, Kuala Lumpur`. Tracking **`PT 2025 0417 8832 MY`** over an inline SVG barcode (bars generated deterministically from the tracking string at build time, `fill:#121212`). Footer `Route KL-03 · Driver 07 · Hub Setapak`. |
| 2 | Driver's phone | `20 -4 29 60 3deg` | Bezel `#151515` (radius 3.5cqh), screen `#FFFFFF` | `--font-device` | Status bar `11:05`. Header **`Stop 4 of 11`**. Card with the label `Out for delivery` (`#5A5A56`), `8-3 Residensi Wangsa`, `Wangsa Maju`, `PT 2025 0417 8832 MY`. Stops list: `10:40  Jalan Genting Klang  Delivered`, `11:05  Residensi Wangsa  Now`, `11:30  Taman Melati  Next`. A drawn button (`#121212` fill, white text) `Mark as delivered`. |
| 3 | Admin status slip (narrow printout) | `3 29 34 18 7deg` | `#FFFFFF`, static zig-zag torn bottom via `mask-image` (static only) | `--font-mono` (JetBrains Mono) | `SHIPMENT 8832 · STATUS LOG`, `09:12  Picked up         KL-01`, `10:03  At hub            Setapak`, `11:05  Out for delivery  Driver 07`, `--:--  Delivered`. |

- Stacking: waybill, then slip, then phone.
- Lay-down `--d`: waybill 0ms, slip 110ms, phone 200ms.
- `coverAlt`: "Package Tracker: a parcel waybill, the driver's delivery screen, and the admin status log."
- **Owner flag:** names, addresses and codes are invented placeholders in a plausible KL register (the repo README is the default Laravel one). Swap in seed data if the app had any.

### 7.5 Default cover (`DefaultCover.astro`) for projects with no imagery and no composition

It has to look intentional at 40 repeats without faking a product. It's a **typographic label on the project plate**, not a fake UI:
- Top-left, 6cqh inset: `scope · year` in `--font-mono` at 3cqh.
- Bottom-left, 6cqh inset: **title** in `--font-sans` 600, `font-size: 11cqh; line-height: .95; letter-spacing: -.03em`, max 3 lines (`line-clamp: 3`).
- Bottom-right, 6cqh inset: `stack` joined by ` / `, mono 2.6cqh, right-aligned, max-width 40cqh.
- Colour `--c-on-plate`, plate from `plateFor(entry)`.
- Lay-down: only the title block (one object), `translate 0 -3cqh` + opacity. The meta stays still. This is printed cover text, not page text. Under reduced motion it's static.
- `compact`: title only at 14cqh, no meta.
- `coverAlt` fallback: `"{title} ({scope}, {year})"`.

---

## 8. Components (Astro, typed props)

`WorkEntry` = `CollectionEntry<'work'>`. Components live in `src/components/` and compositions in `src/covers/`.

| Component | Props | Notes / states |
|---|---|---|
| `BaseLayout.astro` | `title: string; description: string; ogImage?: string; noindex?: boolean` | `lang="en"`. Inline head script (theme, `js`, `js-reveal` unless reduced motion, work view). Font preloads, 2× `theme-color`, `og:*`, `twitter:card=summary_large_image`, canonical, favicon (from `app/icon.png` → `public/favicon.png`), `@view-transition` CSS. Titles per copy.md §1. |
| `SkipLink.astro` | none | §5.0. |
| `SiteHeader.astro` | `current?: 'work' \| 'about' \| 'contact'` | Contains `ProgressBar` and `ThemeToggle`. |
| `ThemeToggle.astro` | none | `<button>` in mono step -1. The text cycles `Auto` → `Light` → `Dark`, with `aria-label="Colour theme: {state}"`. Hover shows an underline, active does `translate 0 1px`, and focus-visible shows the ring. |
| `ProgressBar.astro` | none | §6.4. Script `progress.ts`. |
| `SiteFooter.astro` | `projects: WorkEntry[]; currentSlug?: string` | Uses `FooterStrip`, which slices to 8. |
| `FooterStrip.astro` | `projects: WorkEntry[]; currentSlug?: string` | §5.6. |
| `Cover.astro` | `project: WorkEntry; variant: 'lead' \| 'feature' \| 'archive' \| 'hero' \| 'thumb' \| 'preview'; slot?: 1\|2\|3\|4; eager?: boolean; reveal?: boolean` | Resolves per §7.1. Emits `data-cover-slug`, `--plate`, `--c-on-plate`, and variant sizing. `archive`/`thumb`/`preview` are compact. `reveal` defaults to true for lead/feature/hero. |
| `Obj.astro` | `x: number; y: number; w: number; h: number; r?: number; class?: string` | §7.2. |
| `HabitectCover.astro`, `PackageTrackerCover.astro`, `DefaultCover.astro` | `project: WorkEntry; compact?: boolean` | §7.3–7.5. Each imports its own font CSS, so the font loads only where it renders. |
| `Barcode.astro` | `value: string; height?: number` | Deterministic SVG bars for the waybill. |
| `LeadProject.astro` | `project: WorkEntry; no: number` | §5.1.2. |
| `WorkSection.astro` | `projects: WorkEntry[]; leadSlug: string` | Toggle, filters, grid tiers, index. Script `work-list.ts`. |
| `ViewToggle.astro` | none | §5.1.3. |
| `ScopeFilters.astro` | `counts: { scope: string; n: number }[]; total: number` | Renders nothing unless total ≥ 8 and more than one scope. |
| `WorkTile.astro` | `project: WorkEntry; variant: 'feature' \| 'archive'; slot?: 1\|2\|3\|4; no: number` | Default / hover (§6.3) / focus-visible (ring on the `<a>`, offset 3px). `data-scope`, `data-year`. |
| `IndexList.astro` | `groups: { year: number; items: { project: WorkEntry; no: number }[] }[]` | §5.1.3. |
| `IndexRow.astro` | `project: WorkEntry; no: number` | Hover shows `--c-paper-2` (desktop). Focus-visible gets an inset ring (`outline-offset: -2px`). |
| `IndexPreview.astro` | `projects: WorkEntry[]` | One fixed element plus one `<template data-preview-slug>` per project (compact covers). `display:none` unless `(hover:hover) and (pointer:fine)`. |
| `Colophon.astro` | `desk: string; availability: string` | Links from `src/data/site.ts`. |
| `LiveClock.astro` | `timeZone?: string = 'Asia/Kuala_Lumpur'; label?: string = 'Kuala Lumpur'` | `Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })`. |
| `LatelyLog.astro` | `entries: { date: Date; text: string }[]; limit?: number = 6` | `<details>` for the rest. |
| `FactsRow.astro` | `role: string; team?: string; scope: string; stack: string[]; year: number; repo?: string; live?: string` | Omits Team/Live when absent. |
| `Prose.astro` | slot | Markdown styling. |
| `PrevNext.astro` | `prev?: { title: string; slug: string }; next?: { title: string; slug: string }` | §5.2. |
| `Timeline.astro` | `items: { start: string; end: string; role: string; org: string; note?: string }[]` | §5.3. `end` is `'now'` for current roles. |
| `SkillGroups.astro` | `groups: { name: string; items: string[] }[]` | §5.3. |
| `CopyEmail.astro` | `email: string` | States: "Copy" / hover (`--c-paper-2` bg) / focus-visible / "Copied" (2s) / fallback select. |
| `ContactForm.astro` | `endpoint: string; subject?: string` | §5.4. |
| `Button.astro` | `as?: 'a' \| 'button'; href?: string; variant: 'primary' \| 'text'; type?: 'button' \| 'submit'; disabled?: boolean` | **primary:** sans 500 step 0, 48px tall, padding-inline 20px, 1px ink border, radius 2px, ink background with paper text. Hover (desktop) inverts to paper background with ink text, instantly. Active `translate: 0 1px`. Focus-visible ring. Disabled `opacity:.5`. **text:** no border, underline offset 4px, 2px on hover, 44px min hit. **No pills: radius never over 2px.** |
| Links | CSS on `a` | `color: inherit; text-decoration-thickness: 1px; text-underline-offset: 3px`, 2px on hover. External links get `↗` in `.arrow`. |

Scripts (`src/scripts/`): `head-inline.js` (inlined with `is:inline`), `progress.ts`, `work-list.ts`, `reveal.ts`, `clock.ts`, `copy-email.ts`, `contact-form.ts`, `vt.ts`. Each one exits early if its elements are absent.

---

## 9. Content model (plan, with spec additions)

`src/content.config.ts`, the `work` collection (glob loader, `src/content/work/*.md`, id = filename):

```ts
z.object({
  title: z.string(),
  summary: z.string().max(160),
  scope: z.string(),                         // "Mobile app", "Web app"
  stack: z.array(z.string()).min(1),
  year: z.number().int(),
  role: z.string(),                          // his part, e.g. "Backend and database"
  team: z.string().optional(),               // e.g. "Group of 4, coursework"   (spec addition)
  repo: z.string().url().optional(),
  live: z.string().url().optional(),         // omit when none
  cover: image().optional(),                 // src/assets/work/{slug}/…
  coverAlt: z.string().optional(),
  plate: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  featured: z.boolean().default(false),
  order: z.number().default(0),
})
```
Current values: Habitect has year 2025, team "Group of 4, coursework", plate `#24483A`, featured, order 1. Package Tracker has year 2025, team "Group of 5, coursework", plate `#F2C12E`, featured, order 2. Both have role `[CONFIRM]`, no `cover`, no `live`.

`lately`: `src/content/lately.yaml` (file loader), `{ date: z.coerce.date(), text: z.string().max(140) }`.
`src/data/about.ts`: bio, timeline, skills, music. `src/data/site.ts`: name, email, links, WhatsApp number/message, Formspree endpoint, desk line, availability line.

---

## 10. Housekeeping

- Per-page `<title>` and meta description from copy.md §1. Copy-writer must update the /about description, which still says "studying… interning".
- `og:title/description/url/image`: a static 1200×630 default OG PNG (name + role line, ink on paper, Hanken), also used by case studies until they have real covers.
- `theme-color` light/dark, favicon from `app/icon.png`, skip link, `<main id="main">`, `lang="en"`, visible focus rings, `@astrojs/sitemap`.
- `vercel.json` redirects: `/projects` → `/`, `/projects/:slug` → `/work/:slug`, `/experience` → `/about`, plus the old slugs `/projects/Habitect` → `/work/habitect` and `/projects/Package%20Tracker` → `/work/package-tracker`.

---

## 11. Tradeoffs and flags

1. **Both covers are drawn placeholders.** They cost ~40 nodes and some CSS each, and they're only rendered in lead/feature/hero (compact elsewhere), so the cost is bounded at 40+ projects. Replace them with real screenshots when the owner has them.
2. **Fonts: 4 files is the maximum**, and the home page hits it (Hanken, JetBrains Mono, Archivo, Roboto; roughly 35 + 40 + 60 + 45 KB, latin). The two cover fonts aren't preloaded and only load where the covers render. If the budget must drop to 3, set the Habitect cover in the system UI stack (Roboto on Android anyway). That weakens "own typeface" on desktop, so I don't recommend it.
3. **Cross-document View Transitions** work in Chromium and Safari 18.2+ only. Firefox navigates normally.
4. **Scroll-driven progress** needs `animation-timeline`. Where it's unsupported, the bar is a static hairline and isn't draggable. There's no scroll-listener fallback, by rule.
5. **Grid view with 2 projects** shows one featured tile (the lead is excluded). That's honest, so don't pad it.
6. **Live clock** needs JS. The server renders `GMT+8`.
7. **Owner facts still open:** his role on each group project, current job title and start month at Bantu2U, honours wording, the availability line, the AV organisation and tense, the photo occasion (optional caption), and whether the site repo is public (footer "Source").
8. **copy.md is partly stale** against its own Confirmed facts: the /about meta, about role line, bio para 2, timeline, colophon ("expected 2026", "open to graduate developer roles"), and Lately ("On track to graduate"). Copy-writer must reconcile it before the build uses those strings.
9. **Stress test** (plan verification): temporarily add 40 generated entries (mixed scopes, years 2021–2026, ~10 featured, no covers). Check the featured rhythm, "More work · N" + Show more/fewer, Index year groups, filters appearing, the footer capped at 8, no overflow at 360, and that the default palette rarely puts identical plates side by side. Remove the entries afterwards.
