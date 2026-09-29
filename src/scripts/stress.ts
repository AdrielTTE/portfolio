// QA-only stress switch: `?projects=40` on the home page duplicates work
// entries client-side so the grid tiers, "Show more"/"Show fewer" and the
// Index year groups can be checked at scale. Never runs without the query
// param, and never ships real fake content - it only clones existing DOM
// structure and relabels it. docs/design-spec.md §11 / studio-site-playbook §5.
const params = new URLSearchParams(location.search);
const requested = Number(params.get('projects'));

if (Number.isFinite(requested) && requested > 0) {
  const SCOPES = ['Mobile app', 'Web app', 'Design system', 'Data tool'];
  const STACKS = [
    ['TypeScript', 'React'],
    ['Vue', 'Node.js'],
    ['Swift', 'iOS'],
    ['Python', 'Django'],
  ];
  const PALETTE = ['#BFC3C0', '#3C4A57', '#56643F', '#9C3B2E', '#9DBBD6', '#5B3A57', '#1F5E5E', '#2B2B2B'];

  const featuredGrid = document.getElementById('featured-grid');
  const indexList = document.getElementById('index-list');
  const workSection = document.getElementById('work');
  const workCount = document.getElementById('work-count');

  const realFeature = featuredGrid ? featuredGrid.querySelectorAll('.tile--feature').length : 0;
  const realArchive = document.querySelectorAll('.tile--archive').length;
  const realTotal = realFeature + realArchive + 1; // +1 for the lead, excluded from both grids
  const extra = Math.max(0, requested - realTotal);

  if (extra > 0 && workSection) {
    let archiveBlock = document.querySelector<HTMLElement>('.archive-block');
    let archiveGrid = document.getElementById('archive-grid');
    const gridView = document.querySelector('.grid-view');

    if (!archiveBlock && gridView) {
      archiveBlock = document.createElement('div');
      archiveBlock.className = 'archive-block';
      archiveBlock.innerHTML = `
        <h3 id="more-h" tabindex="-1">More work · <span id="archive-total">0</span></h3>
        <div class="archive-grid grid" id="archive-grid"></div>
        <div class="archive-controls">
          <button type="button" id="show-more" class="control-btn" hidden>Show 12 more</button>
          <button type="button" id="show-fewer" class="control-btn" hidden>Show fewer</button>
        </div>
      `;
      gridView.appendChild(archiveBlock);
      archiveGrid = document.getElementById('archive-grid');
    }

    const yearSections = new Map<number, HTMLOListElement>();
    if (indexList) {
      for (const section of Array.from(indexList.querySelectorAll<HTMLElement>('section'))) {
        const year = Number(section.querySelector('h3')?.textContent);
        const ol = section.querySelector('ol');
        if (year && ol) yearSections.set(year, ol);
      }
    }

    let maxOrder = 2;
    for (const el of document.querySelectorAll<HTMLElement>('[data-order]')) {
      maxOrder = Math.max(maxOrder, Number(el.dataset.order) || 0);
    }

    for (let i = 0; i < extra; i++) {
      const order = maxOrder + i + 1;
      const scope = SCOPES[i % SCOPES.length];
      const stack = STACKS[i % STACKS.length];
      const year = 2021 + (i % 6);
      const plate = PALETTE[order % PALETTE.length];
      const title = `Fake Project ${order}`;
      const isFeatured = i % 7 === 0;

      if (isFeatured && featuredGrid) {
        const slot = ((featuredGrid.querySelectorAll('.tile--feature').length % 4) + 1) as 1 | 2 | 3 | 4;
        const a = document.createElement('a');
        a.href = '#';
        a.className = 'tile tile--feature';
        a.dataset.slot = String(slot);
        a.dataset.scope = scope;
        a.dataset.year = String(year);
        a.dataset.order = String(order);
        a.style.gridColumn = '1 / -1';
        a.innerHTML = `
          <div class="plate plate--feature in" data-slot="${slot}" style="--plate:${plate};--c-on-plate:#fff;position:relative;overflow:hidden;container-type:size;aspect-ratio:4/3" role="img" aria-label="${title}">
            <span class="compact-label" aria-hidden="true" style="position:absolute;left:6cqh;right:6cqh;bottom:6cqh;font-weight:600;font-size:14cqh;line-height:.95;">${title}</span>
          </div>
          <span class="caption">
            <span class="line-1"><span class="name">${title}</span> <span class="year">${year}</span></span>
            <span class="line-2">${scope} · ${stack.join(', ')}</span>
          </span>
        `;
        featuredGrid.appendChild(a);
      } else if (archiveGrid) {
        const a = document.createElement('a');
        a.href = '#';
        a.className = 'tile tile--archive';
        a.dataset.scope = scope;
        a.dataset.year = String(year);
        a.dataset.order = String(order);
        a.style.gridColumn = '1 / -1';
        a.innerHTML = `
          <div class="plate plate--archive in" style="--plate:${plate};--c-on-plate:#fff;position:relative;overflow:hidden;container-type:size;aspect-ratio:4/3" role="img" aria-label="${title}">
            <span class="compact-label" aria-hidden="true" style="position:absolute;left:6cqh;right:6cqh;bottom:6cqh;font-weight:600;font-size:14cqh;line-height:.95;">${title}</span>
          </div>
          <span class="caption">
            <span class="line-1"><span class="name">${title}</span> <span class="year">${year}</span></span>
          </span>
        `;
        archiveGrid.appendChild(a);
      }

      if (indexList) {
        let ol = yearSections.get(year);
        if (!ol) {
          const section = document.createElement('section');
          section.innerHTML = `<h3>${year}</h3><ol></ol>`;
          indexList.appendChild(section);
          ol = section.querySelector('ol')!;
          yearSections.set(year, ol);
        }
        const li = document.createElement('li');
        li.innerHTML = `
          <a href="#" class="index-row" data-scope="${scope}" data-year="${year}" data-slug="fake-${order}">
            <span class="no">No. ${order}</span>
            <span class="thumb"></span>
            <span class="name">${title} <span class="name-scope">${scope}</span></span>
            <span class="scope">${scope}</span>
            <span class="stack">${stack.join(', ')}</span>
            <span class="year">${year}</span>
          </a>
        `;
        ol.appendChild(li);
      }
    }

    if (workCount) workCount.textContent = String(requested);
    (window as unknown as { __applyWorkGrid?: () => void }).__applyWorkGrid?.();
  }
}

export {};
