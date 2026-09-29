// Per-project plate colour. `plateFor` always returns a hex string, so
// `--plate:undefined` can never happen (studio-site-playbook §6).
import type { CollectionEntry } from 'astro:content';

const DEFAULT_PALETTE = [
  '#BFC3C0', // concrete
  '#3C4A57', // slate
  '#56643F', // moss
  '#9C3B2E', // brick
  '#9DBBD6', // sky
  '#5B3A57', // plum
  '#1F5E5E', // teal
  '#2B2B2B', // charcoal
];

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function plateFor(entry: CollectionEntry<'work'>): string {
  if (entry.data.plate) return entry.data.plate;
  const index = hashString(entry.id) % DEFAULT_PALETTE.length;
  return DEFAULT_PALETTE[index];
}

function relativeLuminance(hex: string): number {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

export function onPlate(hex: string): string {
  return relativeLuminance(hex) > 0.35 ? '#121212' : '#FFFFFF';
}
