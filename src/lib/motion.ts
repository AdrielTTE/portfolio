// Pure motion maths shared by the preview and magnetic scripts. Spec §5.3.
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// Pull toward the pointer: linear falloff from `max` px near the centre to 0
// at `radius`. Zero at exactly the centre (no direction) and outside radius.
export function magnetOffset(dx: number, dy: number, radius: number, max: number) {
  const d = Math.hypot(dx, dy);
  if (d === 0 || d >= radius) return { x: 0, y: 0 };
  const strength = (1 - d / radius) * max;
  return { x: (dx / d) * strength, y: (dy / d) * strength };
}

// Weight of a masthead letter at distance `d` from the pointer: `rest` outside
// `radius`, easing down to `min` right under it (quadratic falloff, so the
// dip is a soft pool around the pointer rather than a cone).
export function pressureWeight(d: number, radius: number, rest: number, min: number): number {
  if (d >= radius) return rest;
  const t = 1 - Math.max(0, d) / radius;
  return rest - (rest - min) * t * t;
}
