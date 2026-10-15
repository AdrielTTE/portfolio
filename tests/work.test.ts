import { describe, it, expect } from 'vitest';
import { getPrevNext, sortByOrder, tierWork } from '../src/lib/work';
import { makeEntry } from './helpers';

const a = makeEntry('a', { title: 'A', order: 1 });
const b = makeEntry('b', { title: 'B', order: 2 });
const c = makeEntry('c', { title: 'C', order: 3 });

describe('work helpers', () => {
  it('sorts by order', () => {
    expect(sortByOrder([c, a, b]).map((e) => e.id)).toEqual(['a', 'b', 'c']);
  });
  it('prev/next follow order and stop at ends', () => {
    expect(getPrevNext([a, b, c], 'a')).toEqual({ prev: undefined, next: { title: 'B', slug: 'b' } });
    expect(getPrevNext([a, b, c], 'c').next).toBeUndefined();
    expect(getPrevNext([a, b, c], 'zzz')).toEqual({});
  });
  it('tiers: lead and featured are blocks, lead first then newest, the rest are more', () => {
    const lead = makeEntry('lead', { year: 2024, lead: true });
    const f1 = makeEntry('f1', { year: 2026, featured: true });
    const f2 = makeEntry('f2', { year: 2025, featured: true });
    const m1 = makeEntry('m1', { year: 2023 });
    const m2 = makeEntry('m2', { year: 2025, order: 2 });
    const m3 = makeEntry('m3', { year: 2025, order: 1 });
    const { blocks, more } = tierWork([m1, f2, m2, lead, f1, m3]);
    expect(blocks.map((e) => e.id)).toEqual(['lead', 'f1', 'f2']);
    expect(more.map((e) => e.id)).toEqual(['m3', 'm2', 'm1']);
  });
  it('tiers: with nothing featured the newest project is promoted to a block', () => {
    const { blocks, more } = tierWork([makeEntry('old', { year: 2022 }), makeEntry('new', { year: 2026 })]);
    expect(blocks.map((e) => e.id)).toEqual(['new']);
    expect(more.map((e) => e.id)).toEqual(['old']);
  });
  it('tiers: empty stays empty', () => {
    expect(tierWork([])).toEqual({ blocks: [], more: [] });
  });
});
