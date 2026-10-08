# Dev portfolio copy (Task 0, Step 3)

Input: `docs/superpowers/specs/2026-09-29-dev-portfolio-design.md` §1, §3, §8; `docs/copy.md`
(tone + confirmed facts); employer rule (home page never names Bantu2U, no Bantu2U work
shown). Plain, factual. No em dashes in running copy. No "passionate," no "crafting digital
experiences," no tricolon slogans. This-site performance numbers are stated as targets, not
achieved results, since nothing has been measured yet.

Anything still needing Adriel's confirmation is marked `[CONFIRM]`.

---

## 1. Home (`/`)

> **Superseded 2026-09-30 (repositioning).** The live copy now leads with ASP.NET Core and
> Flutter; `src/data/site.ts` is the source of truth. Current values:
> title `Adriel Tang: ASP.NET and Flutter developer in Kuala Lumpur`; roleLine `Full stack
> developer in Kuala Lumpur, working mainly in ASP.NET Core, C#, Flutter, and Dart.`; pitch
> `I build full stack applications: web apps, the APIs and databases behind them, and mobile
> apps for iOS and Android.` Offer tabs: Web apps · APIs & data · Mobile apps (webapps →
> package-tracker; apis → habitect, package-tracker; mobile → habitect). See
> `docs/open-items.md` item 14. The drafts below are kept as history.

### home.title
```
Adriel Tang: Full Stack Developer in Kuala Lumpur
```
49 chars. Unchanged from `docs/copy.md` — still accurate and the offers don't fit in the
title budget without crowding it, so the offer mention moves to the description below.

### home.description
```
Adriel Tang is a full stack developer in Kuala Lumpur who builds business websites, web apps, and mobile apps for freelance clients. See recent projects.
```
153 chars. Mentions freelance offers as required.

### home.roleLine
```
Full stack developer in Kuala Lumpur, building web and mobile applications with Next.js, Flutter, and Laravel.
```
No employer named. Reused as-is from `docs/copy.md` §2 — it already fits the rule.

### home.pitch
```
I build business websites, custom web apps, and mobile apps: fast, maintainable, and handed over properly.
```
One sentence, states what a client gets. Sits under the role line, above the CTA.

---

## 2. Offer switcher copy

Tabs: Websites · Web apps · Mobile apps. Mapping per spec §3.1: websites → this-site,
webapps → package-tracker, mobile → habitect.

### Websites
- **Line** (10 words): `Fast, content-driven business sites that load quickly and rank well.`
- **Stack:** `["Astro", "Next.js", "Tailwind CSS"]`

### Web apps
- **Line** (10 words): `Custom web apps with logins, dashboards, and real business logic.`
- **Stack:** `["Laravel", "ASP.NET Core", "Node.js", "MySQL"]`

### Mobile apps
- **Line** (12 words): `Cross-platform mobile apps built once in Flutter, shipped to iOS and Android.`
- **Stack:** `["Flutter", "Dart"]`

---

## 3. "What this means for your project" (per project)

### Habitect
```
This is Flutter used for a real interface: lists, daily progress, and streaks, not a demo screen.
It's TAR UMT coursework, not a client job, but the same Flutter skills carry over directly.
A mobile app for your business, built once and shipped to iOS and Android, would follow the same approach.
```

### Package Tracker
```
Package Tracker has three separate logins (customer, admin, driver), the kind of role-based access most business tools need.
It's coursework built with a team of five, not a client project, but it's a full Laravel app with a real database behind it.
A custom web app for your business would follow the same pattern: real data, defined user roles, and a dashboard for each.
```

### This site
```
This site is the clearest proof, since it's not a demo: it's measured on page weight, JavaScript shipped, and Lighthouse score at every deploy.
It shows the standard applied to a client site: fast load times, accessible markup, and no unnecessary framework weight.
The build receipts are numbers from the actual build, not a claim.
```

---

## 4. This-site case study (`/work/this-site`)

### Facts row values
- **Role:** Solo, personal project
- **Team:** Solo
- **Year:** 2026
- **Stack:** Astro, TypeScript
- **Device:** browser
- **Repo:** `[CONFIRM: only add a "Source ↗" / repo link if Adriel makes this site's repository public — see docs/copy.md §9 "Facts to confirm" item 4]`
- **Live:** the production site itself. `[CONFIRM: real domain — astro.config.mjs currently uses a placeholder per docs/copy.md item 5]`

### summary (≤160 chars)
```
This site itself: an Astro build with a strict JS budget, measured at every deploy and built to the same standard offered to clients.
```
136 chars.

### problem
```
A portfolio that claims to build fast, accessible sites has to prove it, not just say it. The
brief here was to keep the site itself measured: real page weight, real JS shipped, and a real
Lighthouse score, generated at every deploy, without adding runtime weight just to produce
the numbers.
```

### Full Markdown body

```markdown
## The problem

A portfolio that claims to build fast, accessible sites has to prove it, not just say it. The
brief here was to keep the site itself measured: real page weight, real JS shipped, and a
real Lighthouse score, generated at every deploy, without adding runtime weight just to
produce the numbers.

## How it's built

The site is static Astro, deployed on Vercel from this repo's git history. There's no client
framework: interactive pieces (the offer tabs, the command palette, the theme toggle) are
vanilla TypeScript, shipped only where they're needed. Page navigation uses native View
Transitions instead of a JS router.

## The performance budget

These are build targets, not results already hit:

- JS shipped: 25KB gzip or less, site-wide, not counting native View Transitions.
- Total home page weight: 300KB or less, excluding screenshots.
- Lighthouse performance: 95 or higher on mobile.
- Layout shift (CLS): under 0.02.

A small build script measures the real gzip size of the shipped HTML, CSS, and JS after
every build, plus the deploy commit, and writes those numbers into the build receipts strip
on the home page. If a number isn't available, it's hidden, not faked.

## A decision worth explaining

Static Astro instead of a JS framework was the call, because a portfolio doesn't need
client-side routing or app state. That keeps the JS budget close to zero by default, and the
few places that do need interactivity (palette, tabs, diagram) can each be built as a small,
self-contained script instead of loading a framework runtime for the whole page.

## What this means for your project

This site is the clearest proof, since it's not a demo: it's measured on page weight,
JavaScript shipped, and Lighthouse score at every deploy. It shows the standard applied to a
client site: fast load times, accessible markup, and no unnecessary framework weight. The
build receipts are numbers from the actual build, not a claim.
```

Note: the "What I'd change" section is left out of this body on purpose. The honesty gate in
spec §3.3 says a section renders only when its content is confirmed and real; nothing has
shipped yet to look back on and critique honestly. Add it after the site has been live for a
while and there's something real to say.

### Meta title
```
This Site: A Static Astro Build
```
32 chars.

### Meta description
```
How this portfolio is built: Astro static output, a 25KB JS budget, and real build receipts (page weight, JS shipped, Lighthouse) measured at every deploy.
```
155 chars.

---

## 5. `lately.yaml` — `type` per existing entry

| id | text | type |
|---|---|---|
| `2026-09` | Rebuilt this site in Astro... | `ship` |
| `2026-05` | Started full-time as a Software Developer... | `life` |
| `2026-04` | Completed a BIT (Honours)... | `learn` |
| `2025-10` | Started a software development internship... | `life` |
| `2025-08` | Built Package Tracker, a Laravel web app... | `ship` |
| `2025-03` | Started building the habit-tracking part of Habitect... | `feat` |

Reasoning: `ship` for a completed/launched build (this site, Package Tracker), `feat` for
work in progress on a feature (Habitect, still being built at that date), `learn` for
finishing a qualification, `life` for job-status changes (internship start, full-time start).

---

## 6. Command palette labels

Confirmed as given, no changes needed:

- `Home`
- `Work`
- `About`
- `Start a project`
- `Copy email address`
- `Toggle theme`
- `Open GitHub`
- `Open LinkedIn`

`[CONFIRM]` optional addition: the header nav has a separate `Contact` link (spec §3.2), and
"Start a project" already routes to `/contact`. Consider adding a plain `Contact` palette
entry too, so a search for the word "contact" still finds it, even though it's the same
destination as "Start a project." Not required, just flagging it since the palette filters by
typed text.

---

## 7. Primary CTA label

```
Start a project →
```
Confirmed as the default, used for the home hero CTA and the magnetic-hover treatment
(spec §5.3.10). Links to `/contact`.
