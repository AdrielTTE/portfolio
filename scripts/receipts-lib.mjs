// Pure helpers for the build-receipts postbuild step. Spec §6.
export function formatKB(bytes) {
  const kb = bytes / 1024;
  return kb < 100 ? kb.toFixed(1) : String(Math.round(kb));
}

const escape = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const dropHidden = (attrs) => attrs.replace(/\s+hidden(?=[\s>]|$)/, '');

// Fills every empty placeholder for each key and un-hides its wrapper. Tolerates
// extra attributes (Astro's data-astro-cid-*) anywhere after the key attribute.
export function injectReceipts(html, values) {
  let out = html;
  for (const [key, raw] of Object.entries(values)) {
    if (raw === undefined || raw === null || raw === '') continue;
    const v = escape(raw);
    out = out.replace(new RegExp(`(data-receipt-wrap="${key}")([^>]*)>`, 'g'), (_m, head, attrs) => `${head}${dropHidden(attrs)}>`);
    out = out.replace(new RegExp(`<(span|a) data-receipt="${key}"([^>]*)></\\1>`, 'g'), (_m, tag, attrs) => {
      const clean = dropHidden(attrs);
      const tmpl = /data-href-template="([^"]*)"/.exec(clean);
      const href = tmpl ? ` href="${tmpl[1].replace('{v}', v)}"` : '';
      return `<${tag} data-receipt="${key}"${clean}${href}>${v}</${tag}>`;
    });
  }
  return out;
}
