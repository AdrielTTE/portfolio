import { describe, it, expect } from 'vitest';
import { lerp, magnetOffset } from '../src/lib/motion';

describe('motion math', () => {
  it('lerp', () => {
    expect(lerp(0, 10, 0.25)).toBe(2.5);
  });
  it('magnet is zero outside radius', () => {
    expect(magnetOffset(100, 0, 80, 6)).toEqual({ x: 0, y: 0 });
  });
  it('magnet scales toward max near centre and never exceeds it', () => {
    const o = magnetOffset(40, 0, 80, 6);
    expect(o.x).toBeCloseTo(3);
    expect(o.y).toBe(0);
    const edge = magnetOffset(79, 79, 80, 6);
    expect(Math.hypot(edge.x, edge.y)).toBe(0);
  });
});
