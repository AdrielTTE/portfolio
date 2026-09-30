// Lately entries (src/content/lately.yaml) as plain dated lines on /about.
// Only month and year are meaningful, and they are stored as the first of the
// month in UTC, so format in UTC to keep the month from slipping a day back.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function toLatelyLine(e: { date: Date; text: string }) {
  const y = e.date.getUTCFullYear();
  const m = e.date.getUTCMonth();
  return {
    iso: `${y}-${String(m + 1).padStart(2, '0')}`,
    label: `${MONTHS[m]} ${y}`,
    text: e.text.trim(),
  };
}

export function newestFirst<T extends { date: Date }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => +b.date - +a.date);
}
