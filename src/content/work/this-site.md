---
title: "This site"
seoTitle: "This Site: A Static Astro Build"
seoDescription: "How this portfolio is built: Astro static output, a 25KB JS budget, and build receipts for page weight and JS shipped, measured at every build."
summary: "This site itself: an Astro build with a strict JS budget, measured at every build and built to the same standard offered to clients."
scope: "Website"
stack: ["Astro", "TypeScript", "CSS", "Vercel"]
year: 2026
role: "Design and build"
repo: "https://github.com/AdrielTTE/portfolio"
offers: []
receipts: true
featured: false
shots:
  - src: "../../assets/work/this-site/home-desktop.png"
    alt: "Home page at desktop width"
  - src: "../../assets/work/this-site/case-study-desktop.png"
    alt: "Habitect case study architecture diagram"
  - src: "../../assets/work/this-site/home-phone.png"
    alt: "Home page on a phone"
order: 0
problem: |-
  A portfolio that claims to build fast, accessible sites has to prove it, not just say it. The
  brief here was to keep the site itself measured: real page weight and real JS shipped, counted
  at every build, plus a real Lighthouse score, without adding runtime weight just to produce
  the numbers.
decision: |-
  Static Astro instead of a JS framework was the call, because a portfolio doesn't need
  client-side routing or app state. That keeps the JS budget close to zero by default, and the
  few places that do need interactivity (palette, theme toggle, diagram) can each be built as a small,
  self-contained script instead of loading a framework runtime for the whole page.
forYou: |-
  This site is the clearest proof, since it's not a demo: every build measures its page weight
  and the JavaScript it ships. It shows the standard applied to a client site: fast load times,
  accessible markup, and no unnecessary framework weight. The build receipts are numbers from
  the actual build, not a claim.
diagram:
  nodes:
    - id: content
      label: Markdown content
      note: "Case studies and copy live as Markdown and YAML in the content collections."
    - id: astro
      label: Astro build
      note: "Astro compiles the content to static HTML, CSS, and a small amount of vanilla JS."
    - id: receipts
      label: Build receipts
      note: "A build script measures gzip size and JS shipped after every build, and adds the latest Lighthouse run."
    - id: vercel
      label: Vercel deploy
      note: "Vercel deploys the static output from this repo's git history."
    - id: browser
      label: Browser
      note: "The browser renders static HTML with native View Transitions, no client framework."
  edges:
    - [content, astro]
    - [astro, receipts]
    - [receipts, vercel]
    - [vercel, browser]
---

The site is static Astro, deployed on Vercel from this repo's git history. There's no client
framework: interactive pieces (the command palette, the theme toggle, the diagrams) are
vanilla TypeScript, shipped only where they're needed. Page navigation uses native View
Transitions instead of a JS router.

### The performance budget

The budget each build is measured against:

- JS shipped: 25KB gzip or less, site-wide, not counting native View Transitions.
- Total home page weight: 300KB or less, excluding screenshots.
- Lighthouse performance: 95 or higher on mobile.
- Layout shift (CLS): under 0.02.

A small build script measures the real gzip size of the shipped HTML, CSS, and JS after
every build, plus the deploy commit, and writes them into the next section of this page.
Lighthouse is run by hand against a production build, and the build shows
the latest saved score. If a number isn't available, it's hidden, not faked.
