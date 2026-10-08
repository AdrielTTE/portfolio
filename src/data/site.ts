// Site-wide facts: identity, contact links and the availability line.
// Keep this file the single source for anything reused across pages.
import type { OfferId } from '../lib/offers';

export const site = {
  name: 'Adriel Tang',
  email: 'adrieltangte@gmail.com',
  github: 'https://github.com/AdrielTTE',
  linkedin: 'https://www.linkedin.com/in/adriel-tang-6a5a941a0/',
  whatsappNumber: '60163231053',
  whatsappMessage: 'Hello there, I am interested in your services',
  formspreeEndpoint: 'https://formspree.io/f/mwpgnwzl',
  // Footer hire block (every page). The availability line intentionally
  // does not name an employer - see docs/open-items.md.
  availability: 'Taking on freelance projects.',
  // Response-time promise shown in the footer and on /contact. Owner to confirm.
  replyTime: 'I reply within 1 working day.',
  city: 'Kuala Lumpur',
  country: 'MY',
} as const;

export function whatsappUrl(): string {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(site.whatsappMessage)}`;
}

// Home meta and intro copy. Source: docs/copy-dev.md §1.
export const home = {
  title: 'Adriel Tang: ASP.NET and Flutter developer in Kuala Lumpur',
  description:
    'Adriel Tang is a full stack developer in Kuala Lumpur building web apps, backend APIs and databases in ASP.NET Core, and mobile apps in Flutter.',
  roleLine: 'Full stack developer in Kuala Lumpur, working mainly in ASP.NET Core, C#, Flutter, and Dart.',
  pitch: 'I build websites, web apps and mobile apps.',
  // One casual line under the pitch. The music stays on /about.
  intro: "I'm a developer by day and I take freelance projects on the side. Got something you want built? Let's discuss.",
};

// How a project runs, in three plain steps. Shown as
// "What happens next" on /contact. Owner to confirm.
export const projectSteps = [
  'We talk through what you need, by message or a short call.',
  'I send a written scope and timeline, so we agree on the work before it starts.',
  'I build in small steps you can see and try, then hand it over with the logins and a short guide.',
];

// "What I build" copy per offer on the home page. Source: docs/copy-dev.md §2.
// Stacks lead with the core tools; the rest are ones the proof projects use.
export const offerCopy: Record<OfferId, { line: string; stack: string[] }> = {
  webapps: {
    line: 'Web apps with user logins, dashboards, and the workflows your team runs every day.',
    stack: ['ASP.NET Core', 'C#', 'Laravel'],
  },
  apis: {
    line: 'Backend APIs and the databases behind them, with tables and rules that keep the data correct.',
    stack: ['ASP.NET Core', 'REST APIs', 'SQL', 'MySQL', 'Firestore'],
  },
  mobile: {
    line: 'Cross-platform mobile apps built once in Flutter, shipped to iOS and Android.',
    stack: ['Flutter', 'Dart', 'Drift', 'SQLite'],
  },
};
