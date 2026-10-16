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
