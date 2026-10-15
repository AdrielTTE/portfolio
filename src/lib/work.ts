// Shared helpers for turning the `work` collection into the shapes the home
// page, command palette and case-study pages need. Ordering is the `order`
// field directly: stable as new work is added.
import type { CollectionEntry } from 'astro:content';

export type WorkEntry = CollectionEntry<'work'>;

export function sortByOrder(entries: WorkEntry[]): WorkEntry[] {
  return [...entries].sort((a, b) => a.data.order - b.data.order);
}

/** How many compact "More work" cards show before "Show more". */
export const MORE_PAGE = 12;

/**
 * The home page's two tiers. The lead and anything marked `featured` are full
 * blocks with a screenshot strip; the rest are compact cards under "More work",
 * so the page stays short as the archive grows. Lead first, then newest. If
 * nothing is marked, the first project is promoted so the section is never
 * only small cards.
 */
export function tierWork(entries: WorkEntry[]): { blocks: WorkEntry[]; more: WorkEntry[] } {
  const newest = (a: WorkEntry, b: WorkEntry) =>
    Number(Boolean(b.data.lead)) - Number(Boolean(a.data.lead)) || b.data.year - a.data.year || a.data.order - b.data.order;
  const blocks = entries.filter((e) => e.data.lead || e.data.featured).sort(newest);
  const more = entries.filter((e) => !(e.data.lead || e.data.featured)).sort(newest);
  if (blocks.length === 0 && more.length > 0) blocks.push(more.shift()!);
  return { blocks, more };
}

export interface AdjacentRef {
  title: string;
  slug: string;
  stage?: string;
  accent?: string;
}

export function getPrevNext(entries: WorkEntry[], currentId: string): {
  prev?: AdjacentRef;
  next?: AdjacentRef;
} {
  const sorted = sortByOrder(entries);
  const index = sorted.findIndex((e) => e.id === currentId);
  if (index === -1) return {};
  const prev = index > 0 ? sorted[index - 1] : undefined;
  const next = index < sorted.length - 1 ? sorted[index + 1] : undefined;
  return {
    prev: prev ? { title: prev.data.title, slug: prev.id, stage: prev.data.stage, accent: prev.data.accent } : undefined,
    next: next ? { title: next.data.title, slug: next.id, stage: next.data.stage, accent: next.data.accent } : undefined,
  };
}
