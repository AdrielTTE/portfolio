# Design addendum: developer portfolio

Date: 2026-09-29. Branch: `revamp-astro`. Author: design-agent (Task 0, Step 1).
Binding parent: `docs/superpowers/specs/2026-09-29-dev-portfolio-design.md` (called "the spec" below). This file fixes the values the spec left open: references verified, colour tokens, font pair, type scale, layouts, and spacing rhythm. Where this file and the spec disagree, the spec wins, and QA should flag the conflict.

## 0. Visual revision, 2026-09-30 (supersedes §1 "original", §2 values, the font pair, the ledger rail and the home layout below)

Owner feedback: "too busy", "looks quite UI", "less AI". The visual layer was rebuilt; the content, truth rules, routes, palette, theme toggle, progress bar and form behaviour are unchanged.

- **Direction:** a two-colour print job. Bottle-green ink on pale green-grey paper plus one spot colour, saffron, used only as a solid block (the site footer). Dark mode reverses it: green paper, saffron as the clickable/display colour.
- **Tokens** (source of truth: `src/styles/tokens.css`, checked by `tests/contrast.test.ts`): light bg `#ECEEE6`, bg-2 `#E0E3D8`, ink `#0F2019`, ink-2 `#4A5A51`, rule `#C9CFC2`, accent `#11513A`. Dark bg `#0F2A20`, bg-2 `#16362A`, ink `#E8EDE3`, ink-2 `#A3B4A9`, rule `#2B4A3D`, accent `#F2BE22`. Block `#F2BE22` with ink `#0F2019` / `#3D4A3F` in both themes.
- **Type:** one family, Archivo Variable (Fontsource, `wdth` file: weight 100-900, width 62-125%, one 90KB latin woff2). Condensed 68%/800 is the display voice (`.display`); normal width is the text. Code uses system mono; no mono micro-labels.
- **Home:** masthead name → pitch and role → type-led work index → "What I build" as a plain statement (the offer switcher, facts strip, receipts, Lately log and closing block are gone). The hire moment is the saffron footer on every page except /contact.
- **References:** henry.codes (full-width condensed masthead, big condensed titles), frankchimero.com (name-left / list-right index, quiet sublines, a non-default coloured ground), felixpeault.com (solid colour-blocked sections, Archivo). Screenshotted live 2026-09-30.
- **Moved:** build receipts → the This site case study ("The numbers", `receipts: true` in frontmatter). Lately → /about. Case studies show real screenshots on a colour field only when they exist; no device frames.

**Build type (unchanged):** static Astro site on Vercel. Content lives in git (Markdown collections plus YAML). No CMS and no stored data. Formspree handles the contact form.

---

## 1. Reference verification (fetched live 2026-09-29)

WebFetch returns markup or markdown, not rendered pixels, so QA should still screenshot these sites side by side before sign-off.

| Site | Observed 2026-09-29 | Borrowed | Not borrowed |
|---|---|---|---|
| **brittanychiang.com** | Single column. Header: "Brittany Chiang", "Frontend Engineer", in-page nav About / Experience / Projects, social icons. Experience rows show a date range, "Title · Company", a paragraph, then **technology tags** (JavaScript, React, TypeScript…). Project rows show title, paragraph, tags and image. Footer credits the tools (Figma, VS Code, Next.js, Tailwind). | **One row = name, one line, stack, year**, scannable top to bottom. Stack shown per row. The footer build credit becomes our receipts and SHA. | Filled teal pill tags: ours are hairline mono chips (§6.3). The sticky left column: our rail headings are not sticky. The paragraph per row: we use one line. |
| **emilkowal.ski** | "Design Engineer… on the Web team at Linear." Projects are a title plus one line ("Sonner — An opinionated toast component for React", "Vaul — A drawer component for React"). Writing is a title plus subtitle. A newsletter form. Footer links to Twitter and GitHub. No copy-email control was visible in the markup today. | The register: short, factual one-liners. Small, interruptible motion (the spec §5 rules). | Newsletter, course banner. |
| **rauno.me** | "Rauno Freiberg is an Estonian interaction designer working with Vercel and Devouring Details." An **"Email" button that copies to the clipboard and shows "Copied"** beside it. Dated archive links (2023, 2022). Footer manifesto "Make it fast. Make it beautiful…". | **The CopyEmail "Copied" state** (confirmed here, not on emilkowal.ski as the spec implies). A plain one-sentence intro. | The seven-line manifesto (a slogan tell). |
| **joshwcomeau.com** (`/css/interactive-guide-to-flexbox/`) | Interactive demos sit **between paragraphs**. The prose sets up the idea first, then the reader manipulates it ("Drag me!" resize handle, toggles for `flex-direction` and `justify-content` values). Callouts include "Way better on desktop!". | **ArchDiagram sits inline in the prose flow**: the prose sets it up, the reader focuses or taps a node, the note explains. | The "better on desktop" caveat. Our diagram must be complete at 360px (§5.3), and has no playful illustrations. |
| **linear.app/changelog** | Entries headed by a full date ("September 24, 2026"), then feature titles ("Priority inbox", "Loops for product management"), then grouped lists: **Fixes**, **Improvements**, **API**. Generous space between dates. | **Date first, dense lines under it**, typed entries. Our compressed form: `YYYY-MM  type: message`, with the type acting as Linear's Fixes/Improvements grouping but inline. | Long feature write-ups and hero images per entry. |
| **stripe.com/docs** (`docs.stripe.com/payments/accept-a-payment`, Checkout variant) | Plain, imperative H2s: "Redirect your customer to Stripe Checkout", "Show a success page", "Handle post-payment events", "Test your integration", with context tags "[Client-side] [Server-side]". Each section goes prose → code or table → a short `>` note. The page served markdown to the fetcher, so no flow diagram was visible. | **Case-study reading rhythm: heading → short prose → one artifact (diagram, schema card) → one short note.** The context tag idea becomes **each diagram node note citing its source file path**. | The left nav tree and language switchers. |
| **paco.me** | Headings in order: "Building", "Projects", "Writing", "Now", "Connect", with **nothing above them**. Projects: "⌘K — Composable command menu React component.", "Writer — Plain text editor with a focus on performance." | **Plain one-word or short headings with no eyebrow.** A one-line project description. The ⌘K palette is itself a nod to his cmdk. | The italic aphorisms. |

**Original to this site (not borrowed):**
1. **The ledger rail.** On desktop, every home and case-study section puts its short heading in the left 3 columns and its content in columns 4–12, under a hairline that runs the full width. It reads like a spec sheet, and it is not sticky.
2. **Measured numbers set large in mono.** The build receipts are the second-largest type on the home page, after the intro sentence. The proof literally outweighs the pitch.
3. **Ultramarine on cool grey.** One saturated blue, used only where you can click or where a number is being highlighted.

---

## 2. Colour tokens

Neutral base, cool rather than warm (no cream). There is one functional accent, a saturated ultramarine, used only for interactive states (primary button, active tab indicator, links on hover, palette selection bar, focus) and data highlights (a receipt value on count-up completion, the active diagram node). Both themes have their own values. Do not invert.

### 2.1 Values

| Token | Light | Dark | Role |
|---|---|---|---|
| `--c-bg` | `#F4F5F6` | `#0E0F11` | Page background, input background, dialog surface |
| `--c-bg-2` | `#E9EBED` | `#17191C` | Row hover (desktop), DeviceFrame default backdrop, palette selection fill, code and schema card fill, secondary button hover |
| `--c-ink` | `#111316` | `#ECEDEF` | Body text, headings |
| `--c-ink-2` | `#565B63` | `#9CA1A9` | Secondary text: one-liners, meta, labels, years, log dates. Also **input borders and the secondary-button border** (≥3:1 non-text) |
| `--c-rule` | `#D5D8DC` | `#2A2D32` | Hairlines between sections and rows, chip borders. Decorative only, never the sole boundary of a control |
| `--c-accent` | `#2B34E5` | `#5C8DFF` | Primary button fill, active tab bar, palette selection bar, link hover, focused diagram node stroke |
| `--c-accent-ink` | `#FFFFFF` | `#0E0F11` | Text and icons on `--c-accent` |
| `--c-focus` | `#2B34E5` | `#5C8DFF` | `:focus-visible` outline (2px, offset 3px, so it always sits on bg) |
| `--c-error` | `#B42318` | `#FF8A7A` | Form error text and invalid input border only |

Dark accent note: the dark value shifts from 237° to about 222° hue. A lighter ultramarine at the same hue drifts into periwinkle and violet, which is the common "AI indigo" tell. The shift keeps it reading as blue.

`--c-focus` equals the accent today. It stays a separate token so it can diverge if a future `accent` frontmatter backdrop clashes.

Also set:
- `<meta name="theme-color">`: `#F4F5F6` for light and `#0E0F11` for dark.
- `::selection { background: var(--c-accent); color: var(--c-accent-ink); }`

### 2.2 Computed contrast (WCAG 2.x relative luminance)

Luminances: light bg 0.9119, light bg-2 0.8286, light ink 0.0064, light ink-2 0.1036, light accent 0.0863, light error 0.1097. Dark bg 0.00476, dark bg-2 0.00961, dark ink 0.8463, dark ink-2 0.3542, dark accent 0.2855, dark error 0.4084.

| Pair | Light | Dark | Requirement | Pass |
|---|---|---|---|---|
| ink on bg | 17.05:1 | 16.37:1 | 4.5 | yes |
| **ink-2 on bg** | **6.26:1** | **7.38:1** | **4.5** | yes |
| ink-2 on bg-2 (hovered row) | 5.72:1 | 6.78:1 | 4.5 | yes |
| **accent on bg** | **7.06:1** | **6.13:1** | **3.0** (UI) | yes. It also passes 4.5, so accent may be used as link text |
| accent on bg-2 | 6.45:1 | 5.63:1 | 3.0 | yes |
| **accent-ink on accent** | **7.71:1** | **6.13:1** | **4.5** | yes |
| focus on bg | 7.06:1 | 6.13:1 | 3.0 | yes |
| error on bg | 6.02:1 | 8.37:1 | 4.5 | yes |
| ink-2 as input border on bg | 6.26:1 | 7.38:1 | 3.0 | yes |

The builder should re-check with a tool (e.g. the DevTools contrast picker) after implementing. These were computed by hand from the sRGB formula.

### 2.3 Theme mechanics

These are unchanged from `docs/design-spec.md` §3.2:
- Light tokens go on `:root`. Dark tokens go under both `@media (prefers-color-scheme: dark) { :root:not([data-theme='light']) }` and `:root[data-theme='dark']`.
- An inline head script prevents the flash of the wrong theme.
- There are no colour transitions. The theme change motion is the View Transition in spec §5.3.9.

Retire these tokens: `--c-paper`, `--c-paper-2`, `--c-field-border`, `--c-signal`. `--c-field-border` is folded into `--c-ink-2`.

---

## 3. Fonts

### 3.1 The pair

| Role | Family | Fontsource package | Axes used | Preload file (inside the package) |
|---|---|---|---|---|
| Sans: prose, UI, headings | **Hanken Grotesk** (variable) | `@fontsource-variable/hanken-grotesk` | `wght` 400, 500, 600. No italic | `@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2` |
| Mono: data only | **JetBrains Mono** (variable) | `@fontsource-variable/jetbrains-mono` | `wght` 400, 500. No italic | `@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2` |

Both files are confirmed present in `node_modules`. Import them with `?url` for the `<link rel="preload" as="font" type="font/woff2" crossorigin>`.

**Why keep Hanken Grotesk:**
1. **It is not a default tell.** It isn't Inter, Space Grotesk or Fraunces, and it isn't one of the current default-font faces either (Geist, Satoshi, General Sans).
2. **It fits the new direction.** It is a neutral, slightly narrow-apertured grotesk with real tabular figures and a 100–900 wght axis. That suits the new "developer who ships" register: plain, legible at 16px on Android, and quiet next to JetBrains Mono. The two share a similar x-height, so mono chips sit on the same line as sans text without looking dropped.
3. **Replacing it gains nothing measurable.** It is already installed, subset and metric-matched, so a replacement would add a font-loading and fallback-tuning cycle to the build.

The repositioning is carried by layout, colour and the receipts, not by a new face.

**Drop:** `@fontsource-variable/archivo` and `@fontsource-variable/roboto`. They existed only for the removed covers. DeviceFrame placeholders use the `--font-device` system stack. Remove the `--font-waybill` and `--font-habitect` tokens and the imports. Uninstalling the packages is the builder's call.

### 3.2 Tokens and metric-override fallbacks

```css
--font-sans: 'Hanken Grotesk Variable', 'Hanken Fallback', system-ui, sans-serif;
--font-mono: 'JetBrains Mono Variable', 'JetBrains Mono Fallback', ui-monospace, 'Cascadia Mono', Menlo, monospace;
--font-device: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
```

| Fallback face | `src` | ascent-override | descent-override | line-gap-override | size-adjust |
|---|---|---|---|---|---|
| `'Hanken Fallback'` | `local('Arial')` | `81%` | `24.5%` | `0%` | `123.5%` |
| `'JetBrains Mono Fallback'` | `local('Courier New')` | `101.7%` | `29.9%` | `0%` | `100.3%` |

These are the values already in `src/styles/tokens.css`, which records them as computed with fontkit from these exact woff2 files. I could not execute code in this pass to re-derive them. **Builder check:** re-run `fontaine` or `capsize` (`@capsizecss/metrics`) against both woff2 files. If a value differs by more than 1 percentage point, use the tool's value. Then confirm the swap visually: throttle to Slow 4G, screenshot the intro before and after the font loads, and look for a line-count change in the intro sentence. That is the biggest CLS risk on the page.

### 3.3 Font rules

- `font-synthesis: none`, and `font-variant-numeric: tabular-nums` on every number (clock, years, receipts, log dates, SHA).
- **Mono is only for data:**
  - stack chips
  - receipts values and units
  - the log date and type
  - the SHA
  - the clock time
  - schema field names and types
  - diagram node labels
  - the URL in the browser DeviceFrame bar
  - palette key hints

  Nothing else is mono. No prompts (`$`, `>`), no cursor blink, no green.
- Arrows `→ ↗` go in `<span class="arrow" aria-hidden="true">` set in mono if Hanken's latin subset lacks them. This is the same check as the old spec §2.1.

---

## 4. Type scale (`--step--1` … `--step-5`, fluid 360 → 1440)

The endpoints were checked: each `clamp()` hits its min at 360px and its max at 1440px, within 0.1px.

| Token | Value | Face / weight | Line height | Tracking | Used for |
|---|---|---|---|---|---|
| `--step--1` | `clamp(12px, 0.09vw + 11.67px, 13px)` | mono 400 (data) or sans 400 (labels) | 1.45 | 0 | Chips, log date/type, SHA, receipt units and labels, facts-row labels, palette hints, footer colophon |
| `--step-0` | `16px` | sans 400/500 | 1.5 | 0 | UI, nav, buttons, row one-liners, log messages, form fields |
| `--step-1` | `clamp(17px, 0.19vw + 16.3px, 19px)` | sans 400; 600 for rail headings | 1.55 | 0 | Case-study prose, palette input, **section headings in the rail**, home name (600) |
| `--step-2` | `clamp(19px, 0.46vw + 17.3px, 24px)` | sans 500 | 1.3 | -0.005em | Work row names, offer panel line, lead caption title, prev/next |
| `--step-3` | `clamp(22px, 0.93vw + 18.7px, 32px)` | sans 500 | 1.25 | -0.01em | Case-study summary, contact email |
| `--step-4` | `clamp(30px, 1.67vw + 24px, 48px)` | sans 500 (intro); mono 500 (receipts) | 1.12 (sans) / 1.0 (mono) | -0.02em sans / 0 mono | **Home intro sentence**, **receipt values**, About/Contact/404 H1 |
| `--step-5` | `clamp(36px, 3.7vw + 22.7px, 76px)` | sans 600 | 1.02 | -0.03em | Case-study H1 (project title) only |

This changes the old scale in three ways:
- `--step--1` grows 1px at desktop, because mono data is read, not decorated.
- `--step-5` drops from 104px to 76px. A developer's case-study title shouldn't shout like a studio plate.
- The home H1 (the name) is now small, and the intro sentence carries the size (see §5.1).

Measure: case-study prose `max-inline-size: 68ch`, the intro sentence `24ch`, and row one-liners `48ch`.

---

## 5. Grid, spacing and section rhythm

### 5.1 Grid (names kept)

| Range | `--cols` | `--gutter` | `--margin` |
|---|---|---|---|
| 0–599 (designed at 360) | 4 | 16px | 16px |
| 600–1023 | 8 | 20px | 24px |
| ≥1024 | 12 | 24px | 40px |

- Container: `max-width: 1600px; margin-inline: auto; padding-inline: var(--margin)`.
- At 1440 the content box is 1360px, so one column is about 91px and 3 columns (the rail) are about 322px.
- At 1920 the content is capped at 1600, and prose stays capped by `ch`.

**Rail layout (the ledger):**

| Width | Rail heading | Content |
|---|---|---|
| ≥1024 | cols 1–3 | cols 4–12 |
| 600–1023 | cols 1–8, above the content | cols 1–8 |
| <600 | cols 1–4, above the content | cols 1–4 |

### 5.2 Spacing tokens

Keep `--space-1…--space-10` (4px base) and `--header-h: 56px`.

Change `--section` to `clamp(56px, 3.7vw + 42.7px, 96px)` (56px at 360, 96px at 1440). The home is scannable and dense, not a gallery.

### 5.3 Section rhythm (home and case study)

- Every section starts with a full-width 1px `--c-rule` top border. Above the border is `--section` of space, and below it is `--space-4` (16px) before the heading and content.
  - The hairline is what separates sections. There are no background bands, no cards and no alternating fills.
  - On desktop, the rail heading and the first line of content share a baseline: align the grid items to start, and use the same line-height box.
- Heading to content on mobile: `--space-4`.
- Rows (work, log): each row gets `padding-block: var(--space-4)` on mobile and `var(--space-5)` at ≥1024, with a 1px `--c-rule` between rows. The last row has no bottom rule, because the next section's top rule closes it.
- Inside prose: paragraphs are separated by `1em`, h2 in the rail. An artifact (diagram, schema) gets `--space-7` above and below it.
- The intro is the exception: it has no top rule, and it gets `--space-8` (360) / `--space-9` (1440) of space below the header.

---

## 6. Components (visual states)

### 6.1 Buttons

- **Primary** (`Start a project →`):
  - Default: fill `--c-accent`, text `--c-accent-ink`, sans 500 `--step-0`, height 48px, padding-inline 20px, radius 4px.
  - Hover (fine pointer only): the fill changes instantly to `color-mix(in oklab, var(--c-accent) 86%, var(--c-ink))`, with no colour transition, and the arrow does `translateX(3px)` over `--dur-fast`.
  - Active: `translateY(1px)`.
  - Focus: 2px `--c-focus` outline, offset 3px.
  - The magnetic effect (spec §5.3.10) wraps this.
- **Secondary** (CopyEmail):
  - Default: transparent, 1px `--c-ink-2` border, text `--c-ink`, same box as primary.
  - Hover: fill `--c-bg-2`.
  - "Copied" state: the label crossfades over 150ms and holds for 1.6s. Announce it through an `aria-live="polite"` sibling.
- **Header "Menu ⌘K"**: 36px high, 1px `--c-rule` border, radius 4px.
  - The label is "Menu" plus a mono `⌘K` hint (`Ctrl K` on non-Apple platforms).
  - Under `(pointer: coarse)` the hint is hidden and it reads just "Menu".

### 6.2 Tabs (OfferSwitcher)

- Three equal-width tabs, sans 500 `--step-0`, height 44px, text `--c-ink-2`. The selected tab's text is `--c-ink`.
- One shared indicator: a 2px `--c-accent` bar on the tab row's bottom rule, moved with `translateX()` and `scaleX()`.
- Focus: an outline on the tab itself.
- Panels are stacked in one grid cell (`grid-area: 1 / 1`), so the container height equals the tallest panel and there is zero CLS.
- Inactive panels get `inert` + `visibility: hidden` + `opacity: 0`. `visibility` flips at the end of the fade-out, via a `transition-behavior` / `transition-delay` pattern, or it is set in the WAAPI `finish` handler.

### 6.3 Stack chip

- Mono `--step--1`, text `--c-ink-2`, 1px `--c-rule` border, radius 3px, padding 2px 6px, no fill.
- Chips wrap with an 8px gap. They are not links and have no hover.

### 6.4 Links

- Inline prose links: `--c-ink` text, a 1px underline in `--c-ink-2` with `text-underline-offset: 3px`.
- On hover the underline and text change to `--c-accent` (an instant change).
- Trailing `→` arrows shift 3px on hover.

### 6.5 DeviceFrame

- Backdrop: frontmatter `accent`, else `--c-bg-2`. Radius 6px.
- Fixed aspect ratios so there is zero CLS:
  - lead on home: `16 / 10`
  - case-study hero: `16 / 9` at ≥600 and `4 / 5` below
- `browser` frame:
  - Width 88% of the backdrop, centered, sitting 8% from the top. Its bottom is cropped by the backdrop with `overflow: hidden`. That is a static clip, not animated.
  - 32px top bar in `--c-bg` with the host in mono `--step--1` `--c-ink-2`. No traffic-light dots.
  - 1px `--c-rule` border.
- `phone` frame:
  - Height 88% of the backdrop, with a `9 / 19.5` aspect, radius 28px, 1px `--c-rule` border, and a 6px `--c-bg` bezel.
  - It holds the same `view-transition-name: shot-<slug>` target as the browser frame.
- Placeholder (no screenshots yet): real UI strings from the app, set in `--font-device` on `--c-bg`, laid out as the app's first screen text. No fills, no gradients.

---

## 7. Layout sketches

Column spans refer to the §5.1 grid.

### 7.1 Header (all pages)

**1440:**

```
| Adriel Tang                                 Work   About   Contact   [◐]  [Menu ⌘K] |
  cols 1-3 (sans 600 step-0)                  cols 7-12, right-aligned, gap 24px
  height 56px, bottom 1px rule, not sticky (keeps scroll cheap; the palette is the fast nav)
```

**360:**

```
| Adriel Tang                        [◐] [Menu] |
```

Work, About and Contact are hidden under 600px. The Menu button opens the palette, which *is* the mobile nav, so every route stays two taps away. The theme button is 44×44.

### 7.2 Home, 1440

```
header
────────────────────────────────────────────────────────────── (no rule, space-9 below the header)
INTRO
cols 1-3                 | cols 4-11
Adriel Tang  (h1, s1 600)| I build business websites, custom web apps and
Full stack developer,    | mobile apps: fast, maintainable, and handed
Kuala Lumpur (ink-2, s0) | over properly.               (p, step-4, 24ch)
                         |
                         | [Start a project →]  [Copy email]     (space-6 above)
                         |
                         | 14:32 KL · Taking new projects from Nov 2026  (space-5 above;
                         |   the time is mono s-1, the rest sans s-1, ink-2)
──────────────────────────────────────────────────────────────  rule
OFFERS
What I build (s1 600)    | Websites     Web apps     Mobile apps        (cols 4-9, 3 equal tabs)
                         | ▔▔▔▔▔▔▔▔▔                                     (accent bar on tab rule)
                         | One line describing the work.  (step-2, cols 4-10)
                         | [Astro] [TypeScript] [Vercel]  (chips, space-4 above)
                         | See it in: This site →         (step-0, space-4 above)
──────────────────────────────────────────────────────────────  rule
WORK
Work (s1 600)            | ┌─────────────────────────────────┐ Habitect
                         | │ DeviceFrame 16:10                │ One-line summary
                         | │ cols 4-9                         │ (cols 10-12, bottom-aligned
                         | └─────────────────────────────────┘  to the frame)
                         |                                      [Flutter] [Dart]  2025
                         | ─────────────────────────────────────────────────────────  rows
                         | Package Tracker | One line.............. | [Laravel] [MySQL] | 2024
                         |  cols 4-5 s2    | cols 6-8 ink-2         | cols 9-11 chips   | col 12 mono, right
                         | ─────────────────────────────────────────────────────────
                         | This site       | ...                    | ...               | 2026
                         |                     [ preview 320×200 follows the cursor over the rows ]
──────────────────────────────────────────────────────────────  rule
RECEIPTS
Built like this (s1 600) | 142        |  18         |  99          |  a1b2c3d ↗
                         | KB page    |  KB JS      |  Lighthouse  |  deploy commit
                         | cols 4-6   |  cols 7-8   |  cols 9-10   |  cols 11-12
                         | values: mono 500 step-4, tabular, width reserved in ch;
                         | labels: sans s-1 ink-2; the whole strip links to /work/this-site
──────────────────────────────────────────────────────────────  rule
LOG
Lately (s1 600)          | 2026-09  ship: Portfolio rebuilt as a developer site
                         | 2026-08  learn: ...
                         | date 8ch mono ink-2 | type 7ch mono ink-2 | message sans s0 ink
                         | Full log →  (links to /about#log)
──────────────────────────────────────────────────────────────  rule
FOOTER
cols 1-3                 | cols 4-8                       | cols 9-12, right-aligned
adrieltangte@gmail.com   | GitHub  LinkedIn               | Press ⌘K to jump  ·  a1b2c3d
(copy button inline)     |                                |  (hint + SHA mono s-1 ink-2)
```

Content strings above are shape only. The copy-writer owns the final wording in `docs/copy-dev.md`.

Details:
- **Receipts:** the cells use `display: grid` with auto-placement, so a hidden metric (spec §6: `hidden` until injected) closes up rather than leaving a hole. Each value's box is `min-inline-size` set in `ch` to its final digit count, so the count-up doesn't cause layout shift.
- **Lead, when the device is `phone`:** the phone sits centered in the 16:10 backdrop. The backdrop keeps the landscape ratio, so the lead is the same height whichever project leads.

### 7.3 Home, 360

```
header (56)
space-8
Adriel Tang                (h1, s1 600)
Full stack developer, Kuala Lumpur (ink-2)
space-5
I build business websites, (step-4, 30px, about 6 lines at 328px)
custom web apps and mobile
apps: fast, maintainable,
and handed over properly.
space-6
[Start a project →] [Copy email]   (side by side; they wrap to full-width
                                    stacked buttons only below 340px)
space-5
14:32 KL · Taking new projects…    (s-1, wraps)
──────────────── rule
What I build
[ Websites | Web apps | Mobile apps ]   3 equal tabs across 4 cols, 44px high
One line (step-2)
[chips]
See it in: This site →
──────────────── rule
Work
┌───────────────────────────┐  lead DeviceFrame, full width, 16:10
└───────────────────────────┘
Habitect                2025   (name s2 left, year mono right)
One-line summary (ink-2)
[Flutter] [Dart]
──────────────── row rule
┌──────┐ Package Tracker 2024  (thumb 72×54, 4:3, radius 4, left;
│ thumb│ One line...            text block to its right; chips go on the next line,
└──────┘ [Laravel] [MySQL]      under the text block, not the thumb)
──────────────── row rule
(the whole row is the link; no hover preview on touch)
──────────────── rule
Built like this
142         18          (2×2 grid, cols 1-2 / 3-4)
KB page     KB JS
99          a1b2c3d ↗
Lighthouse  deploy commit
──────────────── rule
Lately
2026-09 ship:              (date + type on line 1, mono s-1 ink-2)
Portfolio rebuilt as ...   (message on line 2, sans s0)
──────────────── rule
Footer, stacked: email + copy / socials / "Menu opens everything" hint hidden on touch / SHA
```

**Stacking order at 360:** intro → offers → work → receipts → log → footer. It is identical to desktop, and nothing is hidden except:
- the cursor preview (fine pointer only)
- the ⌘K text hints (coarse pointer)
- header nav links (moved into the palette)

### 7.4 Case study `/work/[slug]`, 1440

```
header
space-8
← Work (s0, ink-2, links back)                                      cols 1-3
Habitect  (h1, step-5)                                              cols 1-10
One-line summary (step-3, ink, max 40ch)                            cols 1-8
space-6
Role          Team        Year     Stack                 Repo         Live
Full stack    Solo        2025     [Flutter] [Dart]      GitHub ↗     —(omitted if none)
(dl as a 12-col grid, each item 2 cols; labels sans s-1 ink-2; year/stack mono; links s0)
space-7
┌──────────────────────────────────────────────────────────────────────────┐
│ DeviceFrame hero, cols 1-12, 16:9, view-transition-name: shot-<slug>      │
└──────────────────────────────────────────────────────────────────────────┘
──────────────────────────────────────────────────────────────  rule
The problem (rail, s1 600)  | Prose, cols 4-9, max 68ch, step-1
──────────────────────────────────────────────────────────────  rule
How it's built              | Short setup prose, cols 4-9
                            | ┌ ArchDiagram, cols 4-12, horizontal ranks ──────┐
                            | │ [App UI]──▶[State]──▶[Local store]            │
                            | └────────────────────────────────────────────────┘
                            | Note panel (cols 4-9, min-height 2 lines, aria-live polite):
                            | "Local store — lib/data/... (mono path)"
──────────────────────────────────────────────────────────────  rule
Data model                  | SchemaCards: grid auto-fill minmax(240px, 1fr), cols 4-12
                            | card: table name mono 500 s0, fields mono s-1, bg-2 fill,
                            |       1px rule, radius 4, padding space-4
──────────────────────────────────────────────────────────────  rule
A decision worth explaining | Prose cols 4-9
──────────────────────────────────────────────────────────────  rule
What I'd change             | One line, step-2, cols 4-9
──────────────────────────────────────────────────────────────  rule
What this means for         | 2-3 lines, step-1, cols 4-9
your project                | [Start a project →] (primary, space-5 above). This is the one
                            | in-page CTA, and it closes the section. It is not a band.
──────────────────────────────────────────────────────────────  rule
PrevNext: ← Previous title (cols 1-6)          Next title → (cols 7-12, right)
footer
```

Sections that have no content don't render, and their rule goes with them. The rail headings are the section names from spec §3.3, written plainly with no numbering.

### 7.5 Case study, 360

```
← Work
Habitect (step-5, 36px)
Summary (step-3, 22px)
Facts: dl as a 2-col grid (cols 1-2 / 3-4), 16px row gap; Stack spans both columns
Hero DeviceFrame full width, 4:5 backdrop (the phone reads larger, the browser crops lower)
──── rule
The problem (s1 600)
prose (step-1, 17px, full width, about 38ch at 328px)
──── rule
How it's built
ArchDiagram: vertical rank layout (the ranks stack top to bottom, edges run downward),
  nodes full-width minus 32px, min 44px tall tap targets
Note panel directly under the diagram; a tap selects a node and writes its note there
──── rule
Data model: SchemaCards stacked, full width
... remaining sections stacked in the same order
PrevNext: stacked, Previous then Next, each full width, 56px tall
```

**Diagram at mobile:** do not scale the desktop SVG down, because its labels would be unreadable. At build, the component computes two layouts from the same `nodes`/`edges`: horizontal ranks for ≥768 and vertical ranks for <768. It emits both SVGs and switches them with `display` in a media query. There is only one focusable set: the hidden SVG has `aria-hidden="true"` and `display: none`, so it is also out of the tab order. Touch uses tap-to-select; there is no hover-only information.

### 7.6 Command palette

**1440:**

```
backdrop: fixed full-screen, --c-ink at 40% opacity (light) / #000 at 60% (dark),
          opacity fade only, no blur
dialog: width 640px, centred horizontally, top 12vh, bg --c-bg, 1px --c-rule border,
        radius 8, no box-shadow animation (a static shadow is fine)
┌──────────────────────────────────────────────────────────────┐
│ Search or jump to…                                    esc     │  input row 56px, step-1;
├──────────────────────────────────────────────────────────────┤  esc hint mono s-1
│ Pages                                                         │  group label s-1 ink-2 (a list
│ ▌Work                                            /work        │   label, not a heading eyebrow)
│  About                                           /about       │  items 44px, s0; right hint
│  Contact                                         /contact     │   mono s-1 ink-2
│ Projects                                                      │
│  Habitect                                        /work/habitect│
│ Actions                                                       │
│  Copy email                                      ↵            │
│  Toggle theme                                                 │
│  Open GitHub                                     ↗            │
├──────────────────────────────────────────────────────────────┤
│ ↑↓ move   ↵ open   esc close                                  │  footer 36px, mono s-1 ink-2
└──────────────────────────────────────────────────────────────┘
results: max-height 60vh, overflow auto
selection: one absolutely positioned element (bg-2 fill + a 2px accent bar on the left),
           moved with translateY; items are role="option" in a role="listbox"
           with aria-activedescendant
empty state: "No match for "xyz"" (s0 ink-2), with the selection element hidden
```

**360:**

```
dialog: inset 8px, top 8px, width calc(100% - 16px), max-height calc(100dvh - 16px),
        so it is top-anchored and stays clear of the on-screen keyboard
┌────────────────────────────────┐
│ Search or jump to…     [Close] │  input 52px; Close is a visible 44×44 text button
├────────────────────────────────┤  (touch has no Esc)
│ Pages                          │
│ ▌Work                          │  items 48px; right-hand path hints hidden <600
│  About                         │
│  …                             │  results scroll inside the dialog;
└────────────────────────────────┘  body scroll is locked
footer key-hints row: hidden under (pointer: coarse)
```

Motion, as in spec §5.3.8:
- The dialog opens with scale 0.96→1 and opacity 0→1, `transform-origin: top center`, over `--dur-base` with the enter easing. It closes over `--dur-fast` with the exit easing.
- The backdrop is opacity only.
- With reduced motion, it is an opacity crossfade of 150ms or less.

---

## 8. Motion notes that affect layout

These only clarify the spec. They don't change it.

- **Intro "line by line" (spec §5.3.1):** a "line" is each intro block (name, role, sentence, actions, colophon), not a typographic line.
  - Splitting fluid text into rendered lines needs JS measurement, and it re-breaks on resize and font swap, which is a CLS and jank risk.
  - Five wrappers with `overflow: hidden`, 40ms stagger, and `--dur-slow` with the enter easing.
- **Scroll reveals:** each section wrapper, including its top rule, rises 12px. Rows inside a section don't stagger individually, which keeps 40-row stress pages cheap.
- **The cursor preview** is one 320×200 element with `position: fixed; top: 0; left: 0`, moved only by `transform`. It is created only under `(hover: hover) and (pointer: fine)`.

---

## 9. Tradeoffs and flags

1. **Fallback metrics were not re-derived in this pass.** No code execution was available, so the values are carried over from the existing tokens.css. The builder must verify them with fontaine or capsize (§3.2).
2. **Hidden nav links under 600px.** Hiding them means the palette carries mobile navigation. It is a native `<dialog>`, reached by a visible "Menu" button, so it is accessible. But if JS fails, mobile users lose the nav. **Mitigation:** the Menu button is an `<a href="#site-footer">` progressively enhanced into the palette trigger, and the footer carries Work, About and Contact links.
3. **Two diagram SVGs per case study.** This duplicates a few KB of inline SVG. It is accepted, because it is far cheaper than a runtime layout engine and needs no JS for layout.
4. **Accent as link text.** The accent passes 4.5:1 in both themes, but using it for resting links would spend the "one functional accent" budget everywhere. Resting links stay ink with an underline, and the accent appears on hover and focus only.
