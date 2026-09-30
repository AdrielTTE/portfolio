import { describe, it, expect } from 'vitest';
import { toLatelyLine, newestFirst } from '../src/lib/lately';

describe('lately lines', () => {
  it('formats the month from a UTC date and keeps the sentence as written', () => {
    expect(toLatelyLine({ date: new Date('2026-05-01T00:00:00Z'), text: ' Started full-time. ' })).toEqual({
      iso: '2026-05',
      label: 'May 2026',
      text: 'Started full-time.',
    });
  });
  it('sorts newest first without mutating the input', () => {
    const a = { date: new Date('2025-08-01T00:00:00Z') };
    const b = { date: new Date('2026-09-01T00:00:00Z') };
    const input = [a, b];
    expect(newestFirst(input)).toEqual([b, a]);
    expect(input).toEqual([a, b]);
  });
});
