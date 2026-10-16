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

// Where a flick would come to rest: exponential-decay projection, as in
// Apple's "Designing Fluid Interfaces" sample. `velocity` is px/s. A rate of
// 0.998 is a scroll view; 0.99 is snappier and suits a short carousel.
export function project(velocity: number, rate = 0.99): number {
  return ((velocity / 1000) * rate) / (1 - rate);
}

// Resistance past an edge: follows the pointer less the further it goes, and
// never travels further than `dimension`.
export function rubberband(overshoot: number, dimension: number, constant = 0.55): number {
  const o = Math.abs(overshoot);
  return Math.sign(overshoot) * ((o * dimension * constant) / (dimension + constant * o));
}
