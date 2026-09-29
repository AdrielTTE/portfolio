import { describe, it, expect } from 'vitest';
import { toCommitLine } from '../src/lib/commitlog';

describe('toCommitLine', () => {
  it('formats YYYY-MM from a UTC date and trims a trailing period', () => {
    expect(toCommitLine({ date: new Date('2026-05-01T00:00:00Z'), type: 'ship', text: 'Started full-time.' })).toEqual({
      stamp: '2026-05',
      type: 'ship',
      text: 'started full-time',
    });
  });
  it('lowercases only the first character', () => {
    expect(toCommitLine({ date: new Date('2025-08-01T00:00:00Z'), type: 'feat', text: 'Built Package Tracker' }).text).toBe(
      'built Package Tracker',
    );
  });
});
