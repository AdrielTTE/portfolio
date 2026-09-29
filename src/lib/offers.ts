// Offer tabs on the home page. A tab renders only when at least one project
// declares that offer in its frontmatter. Spec §3.1 item 2.
import type { WorkEntry } from './work';
import { sortByOrder } from './work';

export type OfferId = 'websites' | 'webapps' | 'mobile';

export const OFFERS: { id: OfferId; label: string }[] = [
  { id: 'websites', label: 'Websites' },
  { id: 'webapps', label: 'Web apps' },
  { id: 'mobile', label: 'Mobile apps' },
];

export function projectsForOffer(entries: WorkEntry[], offer: OfferId): WorkEntry[] {
  return sortByOrder(entries.filter((e) => (e.data.offers as OfferId[]).includes(offer)));
}

export function offersWithProjects(entries: WorkEntry[]) {
  return OFFERS.map((o) => ({ ...o, projects: projectsForOffer(entries, o.id) })).filter((o) => o.projects.length > 0);
}
