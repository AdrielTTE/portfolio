// Minimal stand-in for CollectionEntry<'work'>: only the fields lib code reads.
export function makeEntry(id: string, data: Record<string, unknown>) {
  return {
    id,
    collection: 'work',
    data: { featured: false, order: 0, offers: [], stack: ['x'], year: 2025, scope: 'Web app', ...data },
  } as any;
}
