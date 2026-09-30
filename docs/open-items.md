# Open items

Every `[CONFIRM ...]` marker in `docs/copy.md` and the work drafts was resolved
one way or another before this went into the site (none render as bracketed
text anywhere in the build - verified by grepping `dist/` and `src/`). This
file records what was decided and what is still genuinely open.

## Resolved (facts confirmed directly by Adriel, mid-build)

1. **Bantu2U full-time start date.** May 2026. Used verbatim in the About
   timeline (`src/data/about.ts`) and the home page's Lately log
   (`src/content/lately.yaml`, entry `2026-05`).
2. **Job title.** "Software Developer" (already unbracketed in `docs/copy.md`'s
   timeline and case-study tables; the design spec's placeholder text
   suggesting a "Developer" fallback for the case-study facts row was written
   before that was settled, so the real frontmatter `role` values are used
   instead - see item 6 below).
3. **Availability line.** Must not name the employer. Home page colophon now
   reads "Happy to hear about side projects." with no company mentioned. The
   "On the desk" line was also trimmed to "Developing in-house software."
   (dropped "at Bantu2U Holdings") for the same reason; it has since been
   removed from the site entirely. `tests/copy.test.ts` now fails the build's
   tests if the availability line, the home closing block, offer copy or any
   Lately entry names the employer. The About page's
   timeline and bio still name Bantu2U Holdings - that page is explicitly
   exempted, per the correction. **A QA pass after this was first applied
   found two places it had leaked through and fixed them**: the home page's
   intro role line still had "Currently at Bantu2U Holdings." (now just "Full
   stack developer in Kuala Lumpur, building web and mobile applications with
   Next.js, Flutter, and Laravel."), and the Lately entries for `2026-05` and
   `2025-10` named the employer (now "Started full-time as a Software
   Developer, working on in-house software." and "Started a software
   development internship, working on in-house software."). `docs/copy.md`
   updated to match.
4. **AV / live music.** Ongoing, at Emmanuel EFC. The About page's "Sound and
   music" paragraph names the venue and uses present tense: "Outside
   development, Adriel has 8 years of experience in audio and visual (AV)
   production, including 2 years as an AV coordinator at Emmanuel EFC, and 7
   years performing live music on guitar, both ongoing."

## Resolved (sections dropped rather than guessed)

5. **Habitect: "A real constraint or decision" and "What he'd change."** Both
   sections are omitted from `src/content/work/habitect.md` entirely - they
   had no real content in the draft, only a `[CONFIRM]` placeholder asking for
   specifics only Adriel can supply. **Still open**: if he wants to add either
   section, it needs one real technical decision made while building Habitect,
   and one honest thing he'd change now.
6. **Package Tracker: "Adriel's part."** Kept as the honest placeholder
   sentence already in the draft ("No specific part is claimed here yet."),
   with the `[CONFIRM]` note itself dropped. **Still open**: if he later wants
   to name his actual contribution (e.g. one role's screens, the database
   schema), update this section and the `role` field in
   `src/content/work/package-tracker.md`.
7. **Habitect: "Who it's for."** The draft's general-purpose description was
   kept as-is (it's plausible and doesn't over-claim), and the `[CONFIRM: drop
   this section if...]` note was dropped rather than acted on. If Adriel has a
   more specific target user in mind, this section can be tightened.
8. **Photo caption / occasion.** No caption renders under the About page photo
   - the alt text (which describes what's visible) is used as-is, and no
   `<figcaption>` was added, per the design spec's "only if the owner names
   the occasion." **Still open**: if there's a specific event worth naming,
   add a caption.
9. **Footer "Source" link.** Left out of `SiteFooter.astro` entirely (not
   rendered, not a hidden/disabled state). **Still open**: only add this if
   Adriel is comfortable making the site's own repository public.

## Still open (not a copy question)

10. **Production URL.** The site deploys to Vercel automatically via CI/CD
    from this repo, and the real production domain (a generated `*.vercel.app`
    URL or a custom domain) isn't known yet. `astro.config.mjs` uses
    `https://adrieltang.vercel.app` as a placeholder for the required `site`
    value; `og:url`, the canonical link, and the sitemap all derive from it via
    `Astro.site`. **Action needed**: once the real URL is known, update `site`
    in `astro.config.mjs` (one line) and rebuild - nothing else references a
    hardcoded domain.

11. **Contact promises (proposed, not yet confirmed).** "I reply within 1
    working day." (`site.replyTime` in `src/data/site.ts`) and the three
    "how a project runs" steps (`projectSteps`: talk, written scope and
    timeline, build in small steps and hand over with logins and a guide) are
    shown on home, /about and /contact. **Action needed**: confirm both are
    promises Adriel will keep, or edit them there.
12. **Lighthouse receipt.** `receipts/lighthouse.json` was generated with
    `npm run lighthouse` against a local `astro preview` of the build at
    commit 08fa652 (mobile, simulated throttling: performance 100). It is a
    manual run, not a per-deploy one, and the site copy now says so. Re-run it
    against the real deployment once the production URL exists.
13. **Trailing slashes.** Convention is trailing slash (`/about/`,
    `/work/<slug>/`), matching the build's `<route>/index.html` output and
    canonical URLs. `SiteHeader.astro` and `SiteFooter.astro` still link
    `/about` and `/contact` without the slash and should be updated to match.

## QA fixes (second pass)

These notes describe the first (cover-based) design. `WorkSection`,
`LeadProject`, `WorkTile`, the cover components and the Roboto face no longer
exist; the developer-home rebuild replaced them with `WorkList`,
`DeviceFrame` and Hanken Grotesk + JetBrains Mono only. Kept as history.

A round of measured QA (Playwright, axe-core, CDP-sampled view-transition
frames) found and fixed real bugs beyond the copy issue above:

- Home page had a 0px gap between the lead project's caption and the "Work"
  heading at every width - `WorkSection.astro`'s `.work-section` was missing
  the `margin-top: var(--section)` its neighbouring sections all have. Fixed.
- The home page's footer strip incorrectly marked Habitect as the "current"
  project (`aria-current` + outline) because `index.astro` passed the lead
  project's slug as `currentSlug` to the layout. Home isn't a work page, so
  that's removed - only `/work/[slug]` pages mark a current project now.
- `.tile--feature` used `grid-column: span 12` unconditionally, but the base
  (360px) grid only has 4 columns (`--cols: 4`), which overflowed the page by
  96px at that width - reproduced with `?projects=40` at 360px
  (`scrollWidth` 456 vs `clientWidth` 360 before the fix). Changed to
  `grid-column: 1 / -1`, which spans whatever the current column count is at
  any breakpoint. Re-measured after the fix: `scrollWidth` 345 vs
  `clientWidth` 360 (the 15px gap is `scrollbar-gutter: stable` reserving
  space no scrollbar actually uses in headless Chromium - confirmed by
  toggling it off live, not a real overflow; see the first report).
- **Package Tracker cover**: the admin status-log slip was almost entirely
  hidden behind the driver's phone. Repositioned all three objects
  (`--x/--y/--w/--h` on each `Obj`) so the slip reads clearly with only a
  sliver of overlap against the waybill's very bottom edge; re-verified all
  three are legible at both the lead (wide) and archive-tile (square-ish)
  sizes, and stayed within +-48cqh horizontally (extremes: -36cqh to 36.5cqh).
- **Habitect cover**: the strikethrough line on two checklist rows crossed
  the label text as well as the checkbox columns - it's now inset to start
  after the label column (`left: 11.4cqh` instead of `0`).
- **Font budget**: the ✓ glyph used in the Habitect cover (checklist ticks,
  phone check icons) isn't in Roboto's `latin` subset, so the browser was
  fetching a separate `roboto-symbols` file just for that character -
  confirmed with `fontkit` against the actual shipped woff2s. Forced `.tick`
  and `.phone-check` to `font-family: var(--font-mono)`; JetBrains Mono also
  lacks the glyph in every subset it ships (checked all five), so this
  reliably falls through to the local `JetBrains Mono Fallback`/system
  monospace font with **zero extra network requests** rather than trading one
  custom-font problem for another. Re-verified the home page's network
  requests: still exactly 4 custom font files (Hanken, JetBrains Mono,
  Archivo, Roboto - one weight-range file each), no `roboto-symbols` fetch.
- **axe-core false positive on the streak-card "Aug"/"Sep" labels**: the
  reported hypothesis was that the card's `rotate` caused it; **measured and
  ruled out** - setting the rotation to `0deg` live and re-running axe still
  failed identically (contrast ~1.6 against the plate colour, not the white
  card). Isolated the actual cause by toggling `container-type` on `.plate`
  live: removing it drops the violation count from 2 to 0 with no visual
  change, confirming axe is mis-resolving the effective background through
  the size-containment boundary the whole cover system depends on (can't
  remove it from `.plate` without breaking every `cqh`-based composition).
  Found a working, non-disruptive fix instead: an explicit `background: #fff`
  directly on `.streak-rows` (redundant with `.streak-card`'s, invisible
  change) gives axe an unambiguous background to sample. Re-verified: 0
  `color-contrast` violations, light and dark, on every page.
- **`vercel.json`**: the pre-Astro site's old Package Tracker URL used a
  literal space (`/projects/Package Tracker`), not just the percent-encoded
  form. Added an explicit rule for the literal-space source alongside the
  `%20` one and the `/projects/Habitect` one (both are exact, case-sensitive
  matches - Vercel's redirect matching is case-sensitive, so `/projects/habitect`
  lowercase would still fall through to the generic `/projects/:slug` rule and
  land on `/work/habitect` anyway, which is correct by coincidence since that
  slug is already lowercase). **Action needed**: I could not test any of this
  against a live Vercel deployment (nothing is deployed) - please click
  through all four old URLs after the next deploy.
- Reduced-motion guard was missing on `LeadProject`'s "View project →" hover
  nudge (`@media (hover:hover) and (pointer:fine)` with no
  `prefers-reduced-motion: no-preference` clause) - added. Also added the
  same arrow-nudge treatment (guarded the same way) to `WorkTile`'s feature
  and archive captions for consistency, which didn't have an arrow at all
  before.
- `public/images/habitects.png` left untouched, still unused.

## Deviations from `docs/design-spec.md` worth flagging

- **Case-study Role field.** The spec's §5.2 wireframe shows `[CONFIRM]` with
  a fallback of rendering "Developer" until confirmed. Since `docs/copy.md`'s
  §6 table and the work drafts already provide real, unbracketed `role`
  values ("Habit tracking features", "Member of a five-person team"), those
  are used directly in `FactsRow` instead of the fallback - copy.md is the
  more current source per the task's stated precedence.
