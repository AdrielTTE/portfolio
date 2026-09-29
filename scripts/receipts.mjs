// Postbuild: measure dist/ and inject real numbers into every built page.
// Any metric that can't be measured stays hidden. Never fails the build.
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { gzipSync } from 'node:zlib';
import { execSync } from 'node:child_process';
import { formatKB, injectReceipts, inlineScripts } from './receipts-lib.mjs';

const DIST = 'dist';
const walk = (dir) => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]));
const gz = (p) => gzipSync(readFileSync(p)).length;

const values = {};
try {
  const files = walk(DIST);
  const js = files.filter((f) => extname(f) === '.js');
  const externalBytes = js.reduce((n, f) => n + gz(f), 0);

  // Astro inlines most page scripts rather than emitting separate .js files,
  // so also count the executable inline <script> bodies. The same component
  // script repeats verbatim across pages, so dedupe by body before gzipping.
  const uniqueInline = new Set();
  for (const f of files.filter((f) => f.endsWith('.html'))) {
    for (const body of inlineScripts(readFileSync(f, 'utf8'))) uniqueInline.add(body);
  }
  const inlineBytes = uniqueInline.size ? gzipSync(Buffer.from([...uniqueInline].join('\n'), 'utf8')).length : 0;
  values['js-kb'] = formatKB(externalBytes + inlineBytes);

  const index = readFileSync(join(DIST, 'index.html'), 'utf8');
  const linked = [...index.matchAll(/(?:href|src)="(\/[^"]+\.(?:css|js))"/g)].map((m) => join(DIST, m[1]));
  const pageBytes = gzipSync(index).length + linked.filter(existsSync).reduce((n, f) => n + gz(f), 0);
  values['page-kb'] = formatKB(pageBytes);
} catch (e) {
  console.warn('[receipts] size measurement skipped:', e.message);
}

let sha = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7);
if (!sha) {
  try {
    sha = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {}
}
if (sha) values.sha = sha;

try {
  const lh = JSON.parse(readFileSync('receipts/lighthouse.json', 'utf8'));
  const score = lh?.categories?.performance?.score;
  if (typeof score === 'number') values['lh-perf'] = String(Math.round(score * 100));
} catch {}

let pages = 0;
for (const f of walk(DIST).filter((f) => f.endsWith('.html'))) {
  const html = readFileSync(f, 'utf8');
  const next = injectReceipts(html, values);
  if (next !== html) {
    writeFileSync(f, next);
    pages++;
  }
}
console.log(`[receipts] ${JSON.stringify(values)} → ${pages} pages`);
