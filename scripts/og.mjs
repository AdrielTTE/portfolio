// Builds one 1200x630 share image per case study into public/og/<id>.png.
// Run by hand when a project's title, summary or first screenshot changes:
//   node scripts/og.mjs
// It draws an HTML card with the site's own font in headless Chrome, so the
// card matches the site. Set CHROME to a Chrome/Chromium binary if it is not
// in the usual Windows or macOS place. Output is committed; the site build does
// not run this.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';

const root = resolve(import.meta.dirname, '..');
const chrome = [
  process.env.CHROME,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find((p) => p && existsSync(p));
if (!chrome) throw new Error('No Chrome found. Set CHROME to its path.');

const font = pathToFileURL(join(root, 'node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2')).href;
const outDir = join(root, 'public/og');
mkdirSync(outDir, { recursive: true });
const tmp = mkdtempSync(join(tmpdir(), 'og-'));

const field = (md, key) => {
  const m = md.match(new RegExp(`^${key}:\\s*"?(.*?)"?\\s*$`, 'm'));
  return m ? m[1] : '';
};
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

for (const file of readdirSync(join(root, 'src/content/work')).filter((f) => f.endsWith('.md'))) {
  const id = file.replace(/\.md$/, '');
  const md = readFileSync(join(root, 'src/content/work', file), 'utf8');
  const title = field(md, 'title');
  const summary = field(md, 'summary');
  const shot = md.match(/shots:\s*\n\s*- src:\s*"\.\.\/\.\.\/(assets\/work\/[^"]+)"/)?.[1];
  if (!title || !shot) continue;

  const shotPath = join(root, 'src', shot);
  const { width, height } = await sharp(shotPath).metadata();
  const phone = width / height < 1;
  const img = pathToFileURL(shotPath).href;
  const stage = phone
    ? `<div class="phone"><img src="${img}" style="height:500px;aspect-ratio:${width}/${height}"></div>`
    : `<div class="win"><img src="${img}" style="width:440px"></div>`;

  // Condensed caps run about 0.49em per letter; keep the title inside the 588px measure.
  const titleSize = Math.min(170, Math.floor(588 / (title.length * 0.49)));

  const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:A;src:url("${font}");font-weight:100 900;font-stretch:62% 125%}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;background:#f3f4f2;color:#14161f;font-family:A,sans-serif;display:flex;overflow:hidden}
.l{width:700px;padding:56px;display:flex;flex-direction:column;justify-content:space-between}
.mark{font:500 24px ui-monospace,Consolas,monospace}.mark b{color:#c2410c;font-weight:500}
h1{font-size:${titleSize}px;line-height:.82;font-weight:800;font-stretch:68%;text-transform:uppercase;letter-spacing:-.02em}
p{font-size:30px;line-height:1.25;font-weight:500;max-width:560px;color:#14161f}
.r{width:500px;background:#14161f;display:flex;align-items:center;justify-content:center}
.phone{padding:7px;border-radius:30px;background:#0b0a09;box-shadow:0 0 0 1px #2a2f3a}
.phone img{display:block;border-radius:23px}
.win{border-radius:12px;overflow:hidden;box-shadow:0 0 0 1px #2a2f3a}.win img{display:block}
</style><div class="l"><div class="mark">applied.theory<b>()</b></div><div><h1>${esc(title)}</h1></div><p>${esc(summary)}</p></div><div class="r">${stage}</div>`;

  const htmlPath = join(tmp, `${id}.html`);
  writeFileSync(htmlPath, html);
  execFileSync(chrome, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
    `--user-data-dir=${join(tmp, 'profile')}`, '--window-size=1200,630', '--virtual-time-budget=3000',
    `--screenshot=${join(outDir, `${id}.png`)}`, pathToFileURL(htmlPath).href,
  ], { stdio: 'ignore' });
  console.log(`og/${id}.png`);
}
