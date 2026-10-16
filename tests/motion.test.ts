import { describe, it, expect } from 'vitest';
import { lerp, magnetOffset, pressureWeight } from '../src/lib/motion';

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

import { pressureWeight } from '../src/lib/motion';

describe('pressureWeight', () => {
  it('stays at rest outside the radius', () => {
    expect(pressureWeight(300, 200, 800, 450)).toBe(800);
    expect(pressureWeight(200, 200, 800, 450)).toBe(800);
  });
  it('reaches the minimum under the pointer', () => {
    expect(pressureWeight(0, 200, 800, 450)).toBe(450);
  });
  it('falls monotonically toward the pointer', () => {
    const a = pressureWeight(150, 200, 800, 450);
    const b = pressureWeight(60, 200, 800, 450);
    expect(a).toBeGreaterThan(b);
    expect(a).toBeLessThan(800);
  });
});
