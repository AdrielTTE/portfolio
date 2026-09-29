// Contrast test for the developer-portfolio colour tokens (spec §4;
// values from docs/design-addendum.md §2). Parses the light (:root) and
// dark ([data-theme='dark']) colour values straight out of
// src/styles/tokens.css so this test fails the moment the source of truth
// drifts from the accessibility budget, rather than re-typing hex values
// here that could go stale independently of the CSS.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const tokensPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'styles', 'tokens.css');
const css = readFileSync(tokensPath, 'utf-8');

type Vars = Record<string, string>;

function extractBlock(source: string, pattern: RegExp): string {
  const match = source.match(pattern);
  if (!match) throw new Error(`Could not find block matching ${pattern}`);
  return match[1];
}

function extractVars(block: string, names: string[]): Vars {
  const vars: Vars = {};
  for (const name of names) {
    const re = new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{3,8})\\s*;`);
    const match = block.match(re);
    if (!match) throw new Error(`Could not find --${name} in block`);
    vars[name] = match[1];
  }
  return vars;
}

const NAMES = ['c-bg', 'c-ink-2', 'c-accent', 'c-accent-ink'];

// Light tokens: the first top-level `:root { ... }` block (no nested braces).
const lightBlock = extractBlock(css, /:root\s*\{([^}]*)\}/);
const light = extractVars(lightBlock, NAMES);

// Dark tokens, class-based override: `:root[data-theme='dark'] { ... }`.
const darkAttrBlock = extractBlock(css, /:root\[data-theme=['"]dark['"]\]\s*\{([^}]*)\}/);
const darkAttr = extractVars(darkAttrBlock, NAMES);

// Dark tokens, system preference: the block nested inside
// `@media (prefers-color-scheme: dark) { :root:not([data-theme='light']) { ... } }`.
const darkMediaBlock = extractBlock(
  css,
  /@media \(prefers-color-scheme:\s*dark\)\s*\{\s*:root:not\(\[data-theme=['"]light['"]\]\)\s*\{([^}]*)\}/
);
const darkMedia = extractVars(darkMediaBlock, NAMES);

// --- WCAG 2.x relative luminance / contrast ratio -------------------------
function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace('#', '');
  if (h.length === 3 || h.length === 4) {
    h = h
      .slice(0, 3)
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const num = parseInt(h.slice(0, 6), 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function channelLuminance(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const [R, G, B] = [channelLuminance(r), channelLuminance(g), channelLuminance(b)];
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrastRatio(hexA: string, hexB: string): number {
  const lA = relativeLuminance(hexToRgb(hexA));
  const lB = relativeLuminance(hexToRgb(hexB));
  const lighter = Math.max(lA, lB);
  const darker = Math.min(lA, lB);
  return (lighter + 0.05) / (darker + 0.05);
}

describe('colour token contrast (design-addendum.md §2.2)', () => {
  it('light: ink-2 on bg passes 4.5:1 (text)', () => {
    expect(contrastRatio(light['c-ink-2'], light['c-bg'])).toBeGreaterThanOrEqual(4.5);
  });
  it('light: accent on bg passes 3:1 (UI)', () => {
    expect(contrastRatio(light['c-accent'], light['c-bg'])).toBeGreaterThanOrEqual(3);
  });
  it('light: accent-ink on accent passes 4.5:1 (text)', () => {
    expect(contrastRatio(light['c-accent-ink'], light['c-accent'])).toBeGreaterThanOrEqual(4.5);
  });

  it('dark: ink-2 on bg passes 4.5:1 (text)', () => {
    expect(contrastRatio(darkAttr['c-ink-2'], darkAttr['c-bg'])).toBeGreaterThanOrEqual(4.5);
  });
  it('dark: accent on bg passes 3:1 (UI)', () => {
    expect(contrastRatio(darkAttr['c-accent'], darkAttr['c-bg'])).toBeGreaterThanOrEqual(3);
  });
  it('dark: accent-ink on accent passes 4.5:1 (text)', () => {
    expect(contrastRatio(darkAttr['c-accent-ink'], darkAttr['c-accent'])).toBeGreaterThanOrEqual(4.5);
  });

  it('the prefers-color-scheme dark block matches the [data-theme="dark"] block', () => {
    expect(darkMedia).toEqual(darkAttr);
  });
});
