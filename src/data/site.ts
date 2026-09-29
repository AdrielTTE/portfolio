// Site-wide facts: identity, contact links and the two short colophon lines.
// Keep this file the single source for anything reused across pages.

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
  availability: 'Happy to hear about side projects.',
} as const;

export function whatsappUrl(): string {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(site.whatsappMessage)}`;
}
