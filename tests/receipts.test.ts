import { describe, it, expect } from 'vitest';
import { formatKB, injectReceipts, inlineScripts } from '../scripts/receipts-lib.mjs';

// Astro scoped styles append data-astro-cid-* attributes, so fixtures include them.
const html =
  '<div class="receipt" data-receipt-wrap="page-kb" hidden data-astro-cid-x1><span data-receipt="page-kb" hidden data-astro-cid-x1></span></div>' +
  '<div class="receipt" data-receipt-wrap="sha" hidden><a data-receipt="sha" data-href-template="https://github.com/AdrielTTE/portfolio/commit/{v}" hidden></a></div>' +
  '<footer><span data-receipt-wrap="sha" hidden><a data-receipt="sha" data-href-template="https://github.com/AdrielTTE/portfolio/commit/{v}" hidden data-astro-cid-f2></a></span></footer>';

describe('receipts', () => {
  it('formats KB with one decimal under 100', () => {
    expect(formatKB(12_345)).toBe('12.1');
    expect(formatKB(150_000)).toBe('146');
  });
  it('injects values and unhides only filled receipts, despite scoped attrs', () => {
    const out = injectReceipts(html, { 'page-kb': '42.0' });
    expect(out).toContain('<span data-receipt="page-kb" data-astro-cid-x1>42.0</span>');
    expect(out).toContain('data-receipt-wrap="page-kb" data-astro-cid-x1>');
    expect(out).toContain('data-receipt-wrap="sha" hidden');
  });
  it('fills every occurrence, including href templates', () => {
    const out = injectReceipts(html, { sha: 'abc1234' });
    expect(out.match(/href="https:\/\/github\.com\/AdrielTTE\/portfolio\/commit\/abc1234"/g)).toHaveLength(2);
    expect(out.match(/>abc1234<\/a>/g)).toHaveLength(2);
    expect(out).not.toContain('data-receipt-wrap="sha" hidden');
  });
  it('escapes injected values', () => {
    expect(injectReceipts(html, { 'page-kb': '<b>' })).toContain('>&lt;b&gt;</span>');
  });
  it('leaves html untouched when no values', () => {
    expect(injectReceipts(html, {})).toBe(html);
  });
});

describe('inlineScripts', () => {
  const page =
    '<script type="application/json">{"a":1}</script>' +
    '<script type="application/ld+json">{"@type":"Person"}</script>' +
    '<script src="/assets/entry.js"></script>' +
    '<script type="module" src="/assets/entry2.js"></script>' +
    '<script>console.log("hi")</script>' +
    '<script type="module">const x = 1;</script>';

  it('excludes application/json and application/ld+json bodies', () => {
    const scripts = inlineScripts(page);
    expect(scripts.join('\n')).not.toContain('"@type":"Person"');
    expect(scripts.join('\n')).not.toContain('"a":1');
  });
  it('excludes scripts with a src attribute', () => {
    const scripts = inlineScripts(page);
    expect(scripts.join('\n')).not.toContain('entry.js');
    expect(scripts.join('\n')).not.toContain('entry2.js');
  });
  it('includes plain and module inline scripts', () => {
    const scripts = inlineScripts(page);
    expect(scripts).toContain('console.log("hi")');
    expect(scripts).toContain('const x = 1;');
  });
});
