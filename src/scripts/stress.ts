// QA-only stress switch: `?projects=N` clones work rows client-side so the
// row list and scope filters can be checked at scale. Never runs without the
// query param, and never ships real fake content — it only clones existing
// DOM structure and relabels it. docs/design-spec.md §11 / studio-site-playbook
// §5.
//
// Clones don't pass through the server-rendered filter block (WorkList.astro
// only renders `.filters` when there are already 6+ real rows), so once
// cloning pushes the row count past that threshold this also builds the
// filter buttons itself, using the same markup WorkList.astro renders. It
// does not attach click handlers to them: shot-preview.ts wires filter clicks
// via one delegated listener on `#work`, so buttons built here just work.
const params = new URLSearchParams(location.search);
const requested = Number(params.get('projects'));

if (Number.isFinite(requested) && requested > 0) {
  const SCOPES = ['Mobile app', 'Web app', 'Website', 'Data tool'];
  const work = document.getElementById('work');
  const list = document.getElementById('work-list');
  const template = list?.querySelector<HTMLLIElement>('li.work-row');

  if (work && list && template) {
    let k = list.querySelectorAll('li.work-row').length;
    while (k < requested) {
      k += 1;
      const clone = template.cloneNode(true) as HTMLLIElement;
      const scope = SCOPES[(k - 1) % SCOPES.length];
      clone.dataset.slug = `stress-${k}`;
      clone.dataset.scope = scope;
      const name = clone.querySelector('.name');
      if (name) name.textContent = `Project ${k}`;
      clone.querySelector('a')?.setAttribute('href', '#');
      list.appendChild(clone);
    }

    if (list.querySelectorAll('li.work-row').length >= 6 && !work.querySelector('.filters')) {
      const counts = new Map<string, number>();
      list.querySelectorAll<HTMLElement>('li.work-row').forEach((r) => {
        const s = r.dataset.scope ?? '';
        counts.set(s, (counts.get(s) ?? 0) + 1);
      });
      const scopes = [...counts.entries()].sort((a, b) => b[1] - a[1]);

      const filters = document.createElement('div');
      filters.className = 'filters';
      filters.setAttribute('role', 'group');
      filters.setAttribute('aria-label', 'Filter by scope');

      const all = document.createElement('button');
      all.type = 'button';
      all.setAttribute('aria-pressed', 'true');
      all.dataset.filter = '*';
      all.textContent = 'All';
      filters.appendChild(all);

      for (const [scope, n] of scopes) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('aria-pressed', 'false');
        btn.dataset.filter = scope;
        btn.innerHTML = `${scope} <span class="n">${n}</span>`;
        filters.appendChild(btn);
      }

      work.insertBefore(filters, list);
    }
  }
}

export {};
