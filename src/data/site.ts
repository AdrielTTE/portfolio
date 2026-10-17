// Site-wide facts: identity, contact links and the availability line.
// Keep this file the single source for anything reused across pages.
import type { OfferId } from "../lib/offers";

export const site = {
  name: "Adriel Tang",
  email: "adrieltangte@gmail.com",
  github: "https://github.com/AdrielTTE",
  linkedin: "https://www.linkedin.com/in/adriel-tang-6a5a941a0/",
  whatsappNumber: "60163231053",
  whatsappMessage: "Hello there, I am interested in your services",
  formspreeEndpoint: "https://formspree.io/f/mwpgnwzl",
  // Footer hire block (every page). The availability line intentionally
  // does not name an employer - see docs/open-items.md.
  availability: "Taking on freelance projects.",
  // Response-time promise shown in the footer and on /contact. Owner to confirm.
  replyTime: "I reply within 1 working day.",
  city: "Kuala Lumpur",
  country: "MY",
  // Working hours behind the hero's "Online now" line (lib/availability.ts).
  // Days are 0 = Sunday ... 6 = Saturday; hours are local (UTC+8). Owner to confirm.
  hours: { days: [1, 2, 3, 4, 5], open: 9, close: 18, utcOffset: 8 },
} as const;

export function whatsappUrl(): string {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(site.whatsappMessage)}`;
}

// Home meta and intro copy. Source: docs/copy-dev.md §1.
export const home = {
  title: "Adriel Tang: ASP.NET and Flutter developer in Kuala Lumpur",
  description:
    "Adriel Tang is a full stack developer in Kuala Lumpur building web apps, backend APIs and databases in ASP.NET Core, and mobile apps in Flutter.",
  // Leads with what has shipped, and says once that Applied Theory is Adriel's
  // studio. The degree lives on /about.
  roleLine:
    "Adriel Tang is a full stack developer in Kuala Lumpur and the developer behind Applied Theory. Building with ASP.NET Core, C#, Flutter and Dart.",
  // Two checkable facts under the intro. Both also appear elsewhere on the site
  // (about timeline, Crest case study); nothing here is new.
  proof: [
    { label: "First Class Honours", note: "TAR UMT, 2026" },
    { label: "Crest", note: "In closed testing on Google Play" },
  ],
  pitch: "I build web apps and mobile apps, and I publish them.",
  // One casual line under the pitch. The music stays on /about.
  intro: "Open to taking freelance projects.",
};

// How a project runs, in three plain steps. Shown as
// "What happens next" on /contact. Owner to confirm.
export const projectSteps = [
  "We discuss what you need, over messages or a quick call.",
  "I write up the scope and timeline so we're both clear before I start.",
  "I build it in small pieces you can try along the way, then hand it over with the logins and a short guide.",
];

// Contact-page FAQ (also emitted as FAQPage schema). Every answer restates a
// fact already on the site; no prices or promises beyond it. How a project
// runs and the reply time sit elsewhere on the page, so they are not repeated here.
export const faq = [
  {
    q: "What do you build?",
    a: "Websites, web apps with logins and dashboards, backend APIs and the databases behind them (ASP.NET Core, C#, SQL), and Android apps in Flutter, taken all the way to a Google Play release.",
  },
  {
    q: "Where are you, and do you take freelance work?",
    a: "I'm in Kuala Lumpur, Malaysia. I have a day job, and I take on freelance projects on the side.",
  },
  {
    q: "Can you publish the app to the store for me?",
    a: "For Google Play, yes. I'm taking my own apps through it right now (Crest is in closed testing), so I've dealt with signing, the store listing, the privacy policy and testing tracks.",
  },
];

// "What I build" copy per offer on the home page. Source: docs/copy-dev.md §2.
// Stacks lead with the core tools; the rest are ones the proof projects use.
export const offerCopy: Record<OfferId, { line: string; stack: string[] }> = {
  webapps: {
    line: "Web apps with user logins, dashboards, and the workflows your team runs every day.",
    stack: ["ASP.NET Core", "C#", "Laravel"],
  },
  apis: {
    line: "Backend APIs and the databases behind them, with tables and rules that keep the data correct.",
    stack: ["ASP.NET Core", "REST APIs", "SQL", "MySQL", "Firestore"],
  },
  mobile: {
    line: "Mobile apps built in Flutter and taken through to Google Play: app signing, release builds, the store listing and closed testing.",
    stack: ["Flutter", "Dart", "Drift", "SQLite", "Google Play Console"],
  },
};
