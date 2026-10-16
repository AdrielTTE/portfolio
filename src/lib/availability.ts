// Whether it is working time at the studio, and when it next is. Pure, so the
// hero's "Online now" line can be tested against fixed dates. Malaysia has no
// daylight saving, so a fixed UTC offset is enough.
export interface Hours {
  /** Working days, 0 = Sunday ... 6 = Saturday. */
  days: number[];
  /** Opening and closing hour in local time (24h, decimals allowed: 9.5 = 09:30). */
  open: number;
  close: number;
  /** Hours ahead of UTC. */
  utcOffset: number;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function clock(h: number): string {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

export function availability(now: Date, hours: Hours): { online: boolean; label: string } {
  const local = new Date(now.getTime() + hours.utcOffset * 3_600_000);
  const day = local.getUTCDay();
  const hour = local.getUTCHours() + local.getUTCMinutes() / 60;
  const works = hours.days.includes(day);

  if (works && hour >= hours.open && hour < hours.close) return { online: true, label: 'Online now' };
  if (works && hour < hours.open) return { online: false, label: `Back at ${clock(hours.open)}` };

  for (let ahead = 1; ahead <= 7; ahead++) {
    const next = (day + ahead) % 7;
    if (!hours.days.includes(next)) continue;
    const when = ahead === 1 ? 'tomorrow' : DAYS[next];
    return { online: false, label: `Back ${when} at ${clock(hours.open)}` };
  }
  return { online: false, label: 'Offline' };
}
