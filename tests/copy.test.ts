import { it, expect } from 'vitest';
import { home, offerCopy } from '../src/data/site';

it('home and offer copy are filled in', () => {
  for (const v of Object.values(home)) expect(v.trim().length).toBeGreaterThan(0);
  expect(home.title.length).toBeLessThan(60);
  expect(home.description.length).toBeLessThan(160);
  expect(home.roleLine + home.pitch).not.toMatch(/bantu2u/i);
  for (const o of Object.values(offerCopy)) {
    expect(o.line.trim().length).toBeGreaterThan(0);
    expect(o.stack.length).toBeGreaterThan(0);
  }
});
