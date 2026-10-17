// A short buzz for a meaningful moment (something was copied, a message was
// sent), never for routine taps. 30ms is about the least most phone motors can
// render. Needs Chrome, Edge, Samsung Internet or Firefox on Android with
// touch vibration on; iOS Safari has no Vibration API, so there it does nothing.
export function haptic(pattern: number | number[] = 30): void {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    // Blocked by the browser or a permissions policy: nothing to do.
  }
}
