import { describe, it, expect } from 'vitest';
import { getLead, getPrevNext, scopeCounts } from '../src/lib/work';
import { makeEntry } from './helpers';

const a = makeEntry('a', { title: 'A', order: 1, featured: true });
const b = makeEntry('b', { title: 'B', order: 2, featured: true, scope: 'Mobile app' });
const c = makeEntry('c', { title: 'C', order: 3 });

describe('work helpers', () => {
  it('lead is lowest-order featured', () => {
    expect(getLead([c, b, a])?.id).toBe('a');
  });
  it('prev/next follow order and stop at ends', () => {
    expect(getPrevNext([a, b, c], 'a')).toEqual({ prev: undefined, next: { title: 'B', slug: 'b' } });
    expect(getPrevNext([a, b, c], 'c').next).toBeUndefined();
    expect(getPrevNext([a, b, c], 'zzz')).toEqual({});
  });
  it('scopeCounts sorts by count desc', () => {
    expect(scopeCounts([a, b, c])[0]).toEqual({ scope: 'Web app', n: 2 });
  });
});
