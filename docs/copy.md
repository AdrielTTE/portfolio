> On-page copy for the portfolio rebuild. Plain, factual, no filler. This is the single consistent
> version: earlier drafts and the two rounds of "Confirmed facts" have been folded into the sections
> below, so there is nothing left to override elsewhere in this file. Anything still open is listed
> under "Facts to confirm" at the end, and nothing outside that list should be treated as pending.

---

## 1. Page titles and meta descriptions

### `/` — Home
- **Title:** `Adriel Tang: Full Stack Developer in Kuala Lumpur` (49 chars)
- **Meta description:** `Full stack developer in Kuala Lumpur. Adriel Tang builds web and mobile apps with Next.js, Flutter, and Laravel. View recent projects and get in touch.` (154 chars)

### `/about`
- **Title:** `About: Adriel Tang` (19 chars — short on purpose, pair with site name in the template if one is added)
- **Meta description:** `Background, timeline, and skills for Adriel Tang, a full stack developer at Bantu2U Holdings in Kuala Lumpur, with a BIT (Honours) from TAR UMT.` (147 chars)

### `/contact`
- **Title:** `Contact: Adriel Tang` (21 chars)
- **Meta description:** `Get in touch with Adriel Tang, a full stack developer in Kuala Lumpur. Email, WhatsApp, LinkedIn, or send a message through the contact form.` (144 chars)

### `/work/habitect`
- **Title:** `Habitect: A Flutter Habit-Tracking App` (39 chars)
- **Meta description:** `Habitect is a habit-tracking mobile app built with Flutter and Dart by a team of four at TAR UMT. See the stack and the code on GitHub.` (137 chars)

### `/work/package-tracker`
- **Title:** `Package Tracker: A Laravel Web App` (35 chars)
- **Meta description:** `Package Tracker is a Laravel, PHP, and MySQL web app for tracking deliveries across customer, admin, and driver logins. See the stack and the code.` (150 chars)

### 404
- **Title:** `Page Not Found: Adriel Tang` (28 chars)
- **Meta description:** `This page doesn't exist. Head back to Adriel Tang's homepage for recent projects and contact details.` (104 chars)

---

## 2. Home (`/`)

**Role line** (one main sentence, under the name; the home page must not name the
employer anywhere - see "Confirmed facts" below):
> Full stack developer in Kuala Lumpur, building web and mobile applications with Next.js, Flutter, and Laravel.

**Lead project caption pattern** (per project, matches the work-collection frontmatter; worked example below is the real Habitect data):
> No. 1  Habitect  Mobile app, group coursework · 2025  View project →

(No em dash in running copy; this arrow-caption pattern is a UI convention, not prose. The separators are spacing and `·`, per the design spec, not a dash.)

**Colophon** (four lines, per the design spec's layout; the employer is not
named here - the home page must not name it anywhere, per the confirmed facts):
1. `Kuala Lumpur, GMT+8` (the server-rendered fallback; JS swaps in the live time via `LiveClock`).
2. On the desk: developing in-house software.
3. Availability: Happy to hear about side projects.
4. Links: email, GitHub ↗, LinkedIn ↗ (targets below).

Links block (existing targets, reuse as-is): GitHub (`https://github.com/AdrielTTE`), LinkedIn (`https://www.linkedin.com/in/adriel-tang-6a5a941a0/`), email `adrieltangte@gmail.com`.

**Lately** (dated log, newest first, one line each; entries dated 2025-10 and
later must not name the employer, per the confirmed facts - the About page's
timeline is the exception, and still names Bantu2U Holdings):
- `Sep 2026` — Rebuilt this site in Astro, replacing the old Next.js build and dropping the placeholder weather app project.
- `May 2026` — Started full-time as a Software Developer, working on in-house software.
- `Apr 2026` — Completed a BIT (Honours) in Software Systems Development at TAR UMT, with First Class Honours, CGPA 3.78.
- `Oct 2025` — Started a software development internship, working on in-house software.
- `Aug 2025` — Built Package Tracker, a Laravel web app, as TAR UMT coursework with a team of five.
- `Mar 2025` — Started building the habit-tracking part of Habitect, a Flutter app, with a team of four.

(Formatting note: use a period or an en dash between date and text in the built component, not the em dash shown above for readability in this doc — no em dashes in running prose, per the studio playbook.)

---

## 3. About (`/about`)

**Hero role line** (under the full name):
> Full stack developer in Kuala Lumpur, working at Bantu2U Holdings.

**Bio** (2 short paragraphs):
> Adriel Tang Thien Ern is a full stack developer based in Kuala Lumpur, Malaysia. He works across web and mobile: React and Next.js on the front end, Node.js, ASP.NET Core, and Laravel on the back end, and Flutter for cross-platform apps.
>
> He completed a Bachelor of Information Technology (Honours) in Software Systems Development at TAR UMT in April 2026, with First Class Honours, CGPA 3.78. He joined Bantu2U Holdings as a Software Development Executive Intern in October 2025 and now works there full-time as a Software Developer, developing in-house software.

**Timeline** ("Education and work," newest first):

1. **2026 – now** `[CONFIRM: start month]`
   Software Developer
   Bantu2U Holdings Sdn Bhd
   Developing in-house software.

2. **October 2025 – April 2026**
   Software Development Executive Intern
   Bantu2U Holdings Sdn Bhd
   Developing in-house software.

3. **June 2023 – April 2026**
   Bachelor of Information Technology (Honours) in Software Systems Development
   Tunku Abdul Rahman University of Management and Technology (TAR UMT)
   First Class Honours, CGPA 3.78.

**Skills** (plain grouped list, no icons, no blurbs):

- **Frameworks & libraries:** Next.js, React, Flutter, Dart, ASP.NET Core, Node.js, Tailwind CSS, Laravel
- **Languages:** TypeScript, C#, Java, Python, JavaScript, C++
- **Tools & data:** MySQL, SQL Server, Git, GitHub, unit and integration testing, HTML5, CSS3, REST APIs, npm, Yarn

**AV / live music paragraph** ("Sound and music," one factual paragraph):
> Outside development, Adriel has 8 years of experience in audio and visual (AV) production, including 2 years as an AV coordinator, and 7 years performing live music on guitar. `[CONFIRM: the organization or venue for the AV coordinator role, and whether it can be named; also confirm whether this experience is ongoing or in the past, which affects the verb tense]`

**Photo alt text** (`tempProfile.jpg`, used here and optionally as a smaller crop on the home hero):
> "Adriel Tang playing acoustic guitar with a capo on the fretboard, seated in a black shirt during a live performance, with another musician visible behind him." `[CONFIRM: the event/occasion, in case a caption is wanted alongside the alt text]`

---

## 4. Contact (`/contact`)

**Intro line** (replaces "Let's build something great together"):
> Reach out by email, WhatsApp, or the form below.

**Other ways to reach me** (section heading, replaces "Reach Me Directly"):
- Email: `adrieltangte@gmail.com` — confirmed for display, with a "Copy" button next to it (states: "Copy" → "Copied" for 2 seconds).
- WhatsApp: link text "Message on WhatsApp" → existing number `60163231053`, existing prefilled message "Hello there, I am interested in your services" (plain enough to keep, or drop the prefilled text entirely and let people write their own).

**Form section heading** (replaces "Or Send a Message Securely" — drop "Securely," it's not backed by anything on the page):
> Or send a message

**Form labels** (real `<label>` elements, not just placeholders):
- Name
- Email
- Message

**Submit button:**
- Default: `Send message`
- While sending: `Sending…`

**Success message:**
> Message sent. I'll get back to you soon.

**Error message:**
> Something went wrong. Try WhatsApp or email instead.

(Formspree endpoint `https://formspree.io/f/mwpgnwzl` stays as-is; no copy change needed there.)

---

## 5. 404 page

> Page not found.
>
> That page doesn't exist. Head back to the [homepage](/) or the [work list](/#work).

---

## 6. Work entries: facts and frontmatter strings

Both projects are 2025, TAR UMT coursework, built with a team, with no live demo and no real screenshot yet (both use a drawn placeholder cover, not an image file — see §7).

| Field | Habitect | Package Tracker |
|---|---|---|
| Title | Habitect | Package Tracker |
| Summary | A habit-tracking mobile app for setting habits and checking them off day by day. | A Laravel web app for tracking package deliveries across customer, admin, and driver logins. |
| Scope | Mobile app | Web app |
| Stack | Flutter, Dart | Laravel, PHP, MySQL |
| Year | 2025 | 2025 |
| Role | Habit tracking features (his part of the app) | Member of a five-person team `[no specific part claimed — see Facts to confirm]` |
| Team | Group of 4, coursework | Group of 5, coursework |
| Repo | `https://github.com/AdrielTTE/Habitect` | `https://github.com/AdrielTTE/Integrative-Programming-Assignment` |
| Live | none | none |
| Plate | `#24483A` | `#F2C12E` |
| Cover | Drawn composition (registry), no `cover` image file | Drawn composition (registry), no `cover` image file |
| Cover alt | "Habitect: the app's Today screen with a habit list, a streak grid, and a paper habit checklist." | "Package Tracker: a parcel waybill, the driver's delivery screen, and the admin status log." |
| Featured | true | true |
| Order | 1 | 2 |

Case-study facts row (`/work/[slug]`) reads directly from this table: **Role, Team, Scope, Stack, Year, Links** (Repository ↗ for both; no Live link for either).

**Case-study body credit line:** name the team honestly without over-claiming. Habitect: "Built with three other TAR UMT students; Adriel built the habit-tracking part of the app." Package Tracker: "Built with four other TAR UMT students as coursework; Adriel was one of the five" (no specific module claimed until confirmed).

---

## 7. Cover composition printed text

Both covers are drawn placeholder compositions, not screenshots (`habitects.png` is not used anywhere — see §8 and Facts to confirm). The printed text below is invented, plausible content that fits each app's story; it is not pulled from either repo, since both READMEs are the framework default (Flutter's and Laravel's) with no real feature detail to draw from. Swap in real content once the owner has it.

**Habitect** (plate `#24483A`, printed in Roboto to read as a Flutter app):
- Paper checklist: heading "Week of 8 Sep," a 7-day grid (M T W T F S S), rows "Drink 2 L water," "Read 20 pages," "Walk 6,000 steps," "Sleep by 00:30," "Guitar, 30 min."
- Phone screen: status bar "9:41," app bar "Today" with date "Tue, 16 Sep," progress line "3 of 5 done," the same five habits as list tiles (done/in-progress states), bottom nav "Today / Habits / Stats."
- Streak card: "Streak · 12 days," a 7×4 day grid, row labels "Aug," "Sep."
- `coverAlt`: "Habitect: the app's Today screen with a habit list, a streak grid, and a paper habit checklist."

**Package Tracker** (plate `#F2C12E`):
- Waybill: "STANDARD," "1.2 kg · 1 of 1." FROM "Kedai Buku Rahman, 12 Jalan Genting Klang, 53300 Setapak, Kuala Lumpur." TO "Lim Wei Jie, 8-3 Residensi Wangsa, Jalan 1/27A, 53300 Wangsa Maju, Kuala Lumpur." Tracking "PT 2025 0417 8832 MY" over a barcode. Footer "Route KL-03 · Driver 07 · Hub Setapak."
- Driver's phone: status bar "11:05," header "Stop 4 of 11," card "Out for delivery," address and tracking number, a stops list with times, button "Mark as delivered."
- Admin status slip: "SHIPMENT 8832 · STATUS LOG," a four-line timestamped log ending "Delivered."
- `coverAlt`: "Package Tracker: a parcel waybill, the driver's delivery screen, and the admin status log."

---

## 8. Image alt text reference

- **`habitects.png`**: not used anywhere on the rebuilt site. It's a generic illustration of a cartoon figure in outdoor/hiking gear (orange beanie, purple puffer vest) on a white background with abstract paint-splash shapes, with no visible connection to a habit-tracking app. Habitect uses the drawn composition cover in §7 instead. This file (and the unrelated `dev-blog.jpg` / `weather-app.jpg`) can be deleted from `public/images/`.
- **`tempProfile.jpg`**: "Adriel Tang playing acoustic guitar with a capo on the fretboard, seated in a black shirt during a live performance, with another musician visible behind him."

---

## 9. Footer (all pages)

- Section heading: "Latest work"
- Trailing link: "All work →"
- Links row: email (`adrieltangte@gmail.com`), "GitHub ↗", "LinkedIn ↗", "Source ↗" `[CONFIRM: only include if the site's own repo is made public]`, "Sitemap"
- Colophon line: "Built with Astro. Set in Hanken Grotesk and JetBrains Mono."
- Copyright: "© {build year} Adriel Tang" (dynamic year, not a fixed string)

---

## Facts to confirm

Resolved since the first draft (kept here for history; see `docs/open-items.md`
for the full list of every `[CONFIRM]` resolution):

- **Bantu2U start month**: May 2026. Used in the About timeline and the
  matching Lately entry.
- **Availability line wording**: "Happy to hear about side projects." with no
  employer named anywhere on the home page (colophon's "on the desk" line and
  the Lately entries from Oct 2025 onward also had the employer name removed
  for the same reason - the About page is the exception and still names it).
- **AV coordinator role context**: Emmanuel EFC, ongoing (present tense) for
  both the AV work and the live music.

Still open:

1. **Habitect specifics.** Team size (4), his part (habit tracking), and year
   (2025) are confirmed. Still open: which screens/features specifically make
   up "the habit tracking part," one real constraint or decision made while
   building it, and one honest thing he'd change now. Both repos' READMEs are
   framework defaults with no feature detail, so these need to come from
   Adriel directly. (The case study currently omits the "constraint" and
   "what he'd change" sections rather than guessing.)
2. **Package Tracker: no specific part claimed yet.** Confirmed as a
   five-person TAR UMT team project, 2025, with Laravel/PHP/MySQL. Adriel
   asked not to claim a specific module until it's confirmed. If he later
   wants to name his actual contribution (e.g. one role's screens, the
   database), update the case study's "Adriel's part" section and the Role
   field in §6.
3. **`tempProfile.jpg` occasion.** The alt text describes what's visible
   (guitar, capo, black shirt, another musician in the background). If
   there's a specific event worth naming in a caption, confirm it.
4. **Footer "Source ↗" link.** Only add this if the owner is comfortable
   making this site's own repository public. Currently omitted.
5. **Production URL.** The site deploys to Vercel automatically from this
   repo; the real domain isn't known yet, so `astro.config.mjs`'s `site` is a
   placeholder (`https://adrieltang.vercel.app`).
