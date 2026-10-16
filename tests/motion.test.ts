import { describe, it, expect } from 'vitest';
import { lerp, magnetOffset, project, rubberband } from '../src/lib/motion';

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
  it('project: a flick lands further along, in its own direction', () => {
    expect(project(0)).toBe(0);
    expect(project(1000, 0.998)).toBeCloseTo(499);
    expect(project(-500)).toBeCloseTo(-project(500));
  });
  it('rubberband: follows less the further you pull, and stays under the dimension', () => {
    expect(rubberband(0, 300)).toBe(0);
    expect(rubberband(20, 300)).toBeLessThan(20);
    expect(rubberband(-20, 300)).toBeCloseTo(-rubberband(20, 300));
    expect(rubberband(10000, 300)).toBeLessThan(300);
  });
});
