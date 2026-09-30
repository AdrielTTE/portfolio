// Shared helpers for turning the `work` collection into the shapes the home
// page, command palette and case-study pages need. Ordering is the `order`
// field directly: stable as new work is added.
import type { CollectionEntry } from 'astro:content';

export type WorkEntry = CollectionEntry<'work'>;

export function sortByOrder(entries: WorkEntry[]): WorkEntry[] {
  return [...entries].sort((a, b) => a.data.order - b.data.order);
}

export function getLead(entries: WorkEntry[]): WorkEntry | undefined {
  return sortByOrder(entries.filter((e) => e.data.featured))[0];
}

export interface ScopeCount {
  scope: string;
  n: number;
}

export function scopeCounts(entries: WorkEntry[]): ScopeCount[] {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    counts.set(entry.data.scope, (counts.get(entry.data.scope) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([scope, n]) => ({ scope, n }));
}

export interface AdjacentRef {
  title: string;
  slug: string;
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
    prev: prev ? { title: prev.data.title, slug: prev.id } : undefined,
    next: next ? { title: next.data.title, slug: next.id } : undefined,
  };
}
