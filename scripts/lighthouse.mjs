// Manual: `npm run lighthouse -- <url>` writes receipts/lighthouse.json (mobile).
// Commit the file; the next build shows the score. Spec §6.
import { execSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const url = process.argv[2];
if (!url) {
  console.error('usage: npm run lighthouse -- https://preview-url');
  process.exit(1);
}
mkdirSync('receipts', { recursive: true });
execSync(
  `npx -y lighthouse@12 ${url} --only-categories=performance --form-factor=mobile --output=json --output-path=receipts/lighthouse.json --chrome-flags="--headless=new" --quiet`,
  { stdio: 'inherit' },
);
