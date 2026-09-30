import { it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { home, offerCopy, site, projectSteps } from '../src/data/site';
import { OFFERS } from '../src/lib/offers';

// The home page must never name the employer (docs/open-items.md item 3).
const NO_EMPLOYER = /bantu/i;

it('home and offer copy are filled in', () => {
  for (const v of Object.values(home)) expect(v.trim().length).toBeGreaterThan(0);
  expect(home.title.length).toBeLessThan(60);
  expect(home.description.length).toBeLessThan(160);
  for (const v of Object.values(home)) expect(v).not.toMatch(NO_EMPLOYER);
  for (const o of Object.values(offerCopy)) {
    expect(o.line.trim().length).toBeGreaterThan(0);
    expect(o.stack.length).toBeGreaterThan(0);
  }
});

it('home leads with ASP.NET and Flutter', () => {
  expect(home.title).toMatch(/ASP\.NET/);
  expect(home.title).toMatch(/Flutter/);
  expect(home.roleLine).toMatch(/ASP\.NET Core/);
  expect(home.roleLine).toMatch(/Flutter/);
  expect(home.description).toMatch(/ASP\.NET Core/);
  expect(home.description).toMatch(/Flutter/);
});

it('footer hire block, project steps and offers never name the employer', () => {
  expect(site.availability).not.toMatch(NO_EMPLOYER);
  expect(site.replyTime).not.toMatch(NO_EMPLOYER);
  for (const step of projectSteps) expect(step).not.toMatch(NO_EMPLOYER);
  for (const o of Object.values(offerCopy)) {
    expect(o.line).not.toMatch(NO_EMPLOYER);
    for (const s of o.stack) expect(s).not.toMatch(NO_EMPLOYER);
  }
  for (const o of OFFERS) expect(o.label).not.toMatch(NO_EMPLOYER);
});

it('Lately entries never name the employer (kept safe to show on home)', () => {
  // Plain line scan (no YAML dependency): every entry's `text:` line.
  const texts = readFileSync('src/content/lately.yaml', 'utf8')
    .split('\n')
    .filter((line) => /^\s*text:/.test(line));
  expect(texts.length).toBeGreaterThan(0);
  for (const t of texts) expect(t).not.toMatch(NO_EMPLOYER);
});
