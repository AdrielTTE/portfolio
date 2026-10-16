import { describe, it, expect } from 'vitest';
import { availability, type Hours } from '../src/lib/availability';

const kl: Hours = { days: [1, 2, 3, 4, 5], open: 9, close: 18, utcOffset: 8 };
// 2026-10-14 is a Wednesday. KL time = UTC + 8.
const at = (isoUtc: string) => availability(new Date(isoUtc), kl);

describe('availability', () => {
  it('is online during working hours', () => {
    expect(at('2026-10-14T02:00:00Z')).toEqual({ online: true, label: 'Online now' }); // Wed 10:00 KL
    expect(at('2026-10-14T01:00:00Z').online).toBe(true); // 09:00 sharp
  });
  it('is back at opening time before the day starts', () => {
    expect(at('2026-10-14T00:00:00Z')).toEqual({ online: false, label: 'Back at 09:00' }); // 08:00 KL
  });
  it('is back tomorrow after closing on a weekday', () => {
    expect(at('2026-10-14T10:00:00Z')).toEqual({ online: false, label: 'Back tomorrow at 09:00' }); // Wed 18:00 KL
  });
  it('skips the weekend', () => {
    expect(at('2026-10-16T11:00:00Z').label).toBe('Back Monday at 09:00'); // Fri 19:00 KL
    expect(at('2026-10-17T04:00:00Z').label).toBe('Back Monday at 09:00'); // Sat
    expect(at('2026-10-18T04:00:00Z').label).toBe('Back tomorrow at 09:00'); // Sun: Monday is tomorrow
  });
  it('uses the local date, not the UTC one', () => {
    // Thu 02:00 KL is still Wed 18:00 UTC: before opening on a working day.
    expect(at('2026-10-14T18:00:00Z').label).toBe('Back at 09:00');
  });
  it('formats half hours', () => {
    expect(availability(new Date('2026-10-14T00:00:00Z'), { ...kl, open: 9.5 }).label).toBe('Back at 09:30');
  });
});
