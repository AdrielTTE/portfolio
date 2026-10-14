// Rebuilds the two subset fonts in src/assets/fonts/ from the Fontsource files:
//   node scripts/subset-fonts.mjs      (run `npm run build` first)
// Archivo keeps only the characters found in the built pages (plus ASCII and a
// few typographic marks) and only the weight/width range the CSS uses, so it
// ships 36 KB instead of 90 KB. If you add text with a new character, or use a
// weight outside 400-800 or a width outside 68-100%, rerun this and adjust the
// axis range below and the @font-face in src/styles/global.css.
// The DM Mono face holds only the logo text and is inlined by the build.
import subsetFont from 'subset-font';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const chars = new Set();
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name.endsWith('.html')) {
      const text = readFileSync(p, 'utf8')
        .replace(/<style[\s\S]*?<\/style>/g, '')
        .replace(/<script[\s\S]*?<\/script>/g, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&[#a-z0-9]+;/gi, ' ');
      for (const c of text) chars.add(c);
    }
  }
};
walk(join(root, 'dist'));
for (let i = 32; i < 127; i++) chars.add(String.fromCharCode(i));
for (const c of '’‘“”–—…→←↗↑↓×·•©°€£¥é') chars.add(c);

const archivo = readFileSync(join(root, 'node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2'));
const archivoOut = await subsetFont(archivo, [...chars].join(''), {
  targetFormat: 'woff2',
  variationAxes: { wght: { min: 400, max: 800 }, wdth: { min: 68, max: 100 } },
});
writeFileSync(join(root, 'src/assets/fonts/archivo-subset.woff2'), archivoOut);
console.log(`archivo-subset.woff2: ${archivo.length} -> ${archivoOut.length} bytes (${chars.size} characters)`);

const mono = readFileSync(join(root, 'node_modules/@fontsource/dm-mono/files/dm-mono-latin-500-normal.woff2'));
const monoOut = await subsetFont(mono, 'applied.theory()', { targetFormat: 'woff2' });
writeFileSync(join(root, 'src/assets/fonts/dm-mono-wordmark.woff2'), monoOut);
console.log(`dm-mono-wordmark.woff2: ${mono.length} -> ${monoOut.length} bytes`);
