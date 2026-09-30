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
  // Colophon and closing block (home page). The availability line intentionally
  // does not name an employer - see docs/open-items.md.
  availability: 'Taking on freelance projects.',
  // Response-time promise shown on home and /contact. Owner to confirm.
  replyTime: 'I reply within 1 working day.',
  city: 'Kuala Lumpur',
  country: 'MY',
} as const;

export function whatsappUrl(): string {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(site.whatsappMessage)}`;
}

// Home meta and intro copy. Source: docs/copy-dev.md §1.
export const home = {
  title: 'Adriel Tang: Full Stack Developer in Kuala Lumpur',
  description:
    'Adriel Tang is a full stack developer in Kuala Lumpur who builds business websites, web apps, and mobile apps for freelance clients. See recent projects.',
  roleLine: 'Full stack developer in Kuala Lumpur, building web and mobile applications with Next.js, Flutter, and Laravel.',
  pitch: 'I build business websites, custom web apps, and mobile apps: fast, maintainable, and handed over properly.',
};

// How a project runs, in three plain steps. Shown as prose in the home page's
// closing block and as "What happens next" on /contact. Owner to confirm.
export const projectSteps = [
  'We talk through what you need, by message or a short call.',
  'I send a written scope and timeline, so we agree on the work before it starts.',
  'I build in small steps you can see and try, then hand it over with the logins and a short guide.',
];

// OfferSwitcher panel copy per offer. Source: docs/copy-dev.md §2.
export const offerCopy: Record<OfferId, { line: string; stack: string[] }> = {
  websites: {
    line: 'Business sites that load quickly on any phone and are built to rank in search.',
    stack: ['Astro', 'Next.js', 'Tailwind CSS'],
  },
  webapps: {
    line: 'Custom web apps with user logins, dashboards, and the workflows your team runs every day.',
    stack: ['Laravel', 'ASP.NET Core', 'Node.js', 'MySQL'],
  },
  mobile: {
    line: 'Cross-platform mobile apps built once in Flutter, shipped to iOS and Android.',
    stack: ['Flutter', 'Dart'],
  },
};
