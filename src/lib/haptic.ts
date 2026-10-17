// One short buzz for a meaningful moment (something was copied, a message was
// sent). Android browsers only; everywhere else it is a no-op. Never for
// routine taps.
export function haptic(ms = 12): void {
  try {
    navigator.vibrate?.(ms);
  } catch {
    // Blocked by the browser or a permission policy: nothing to do.
  }
}
