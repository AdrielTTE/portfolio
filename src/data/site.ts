// Site-wide facts: identity, contact links and the two short colophon lines.
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
  // Colophon (home page). The availability line intentionally does not name an
  // employer - see docs/open-items.md.
  desk: 'Developing in-house software.',
  availability: 'Taking on freelance projects.',
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

// OfferSwitcher panel copy per offer. Source: docs/copy-dev.md §2.
export const offerCopy: Record<OfferId, { line: string; stack: string[] }> = {
  websites: {
    line: 'Fast, content-driven business sites that load quickly and rank well.',
    stack: ['Astro', 'Next.js', 'Tailwind CSS'],
  },
  webapps: {
    line: 'Custom web apps with logins, dashboards, and real business logic.',
    stack: ['Laravel', 'ASP.NET Core', 'Node.js', 'MySQL'],
  },
  mobile: {
    line: 'Cross-platform mobile apps built once in Flutter, shipped to iOS and Android.',
    stack: ['Flutter', 'Dart'],
  },
};
