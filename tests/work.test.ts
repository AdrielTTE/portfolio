import { describe, it, expect } from 'vitest';
import { getPrevNext, sortByOrder } from '../src/lib/work';
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
});
