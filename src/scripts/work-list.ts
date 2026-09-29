// Work section behaviour: Grid <-> Index toggle, scope filters, archive
// pagination (12 at a time), and the desktop-only Index hover preview.
// docs/design-spec.md §5.1.3. Each piece exits early if its elements are
// absent, and re-runs cleanly if stress.ts adds more tiles later.
const STEP = 12;
let archiveShown = STEP;
let activeScope = 'all';

const viewToggleButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('.view-toggle .toggle-btn'));
const filterButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('.scope-filters .filter-btn'));
const featuredGrid = document.getElementById('featured-grid');
const indexList = document.getElementById('index-list');

// Looked up fresh on every call (not cached at module init) because
// stress.ts can create the archive block after this script has already run:
// today's real dataset has zero archive entries, so none of this exists yet.
function archiveElements() {
  return {
    grid: document.getElementById('archive-grid'),
    block: document.querySelector<HTMLElement>('.archive-block'),
    heading: document.getElementById('more-h'),
    totalEl: document.getElementById('archive-total'),
    showMoreBtn: document.getElementById('show-more') as HTMLButtonElement | null,
    showFewerBtn: document.getElementById('show-fewer') as HTMLButtonElement | null,
  };
}

// -- View toggle -------------------------------------------------------------
if (viewToggleButtons.length) {
  for (const btn of viewToggleButtons) {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view === 'index' ? 'index' : 'grid';
      document.documentElement.setAttribute('data-work-view', view);
      try {
        if (view === 'index') localStorage.setItem('workView', 'index');
        else localStorage.removeItem('workView');
      } catch {
        /* ignore */
      }
      for (const b of viewToggleButtons) b.setAttribute('aria-pressed', String(b === btn));
    });
  }
  // Reflect the state the head script already applied before paint.
  const current = document.documentElement.getAttribute('data-work-view') === 'index' ? 'index' : 'grid';
  for (const b of viewToggleButtons) b.setAttribute('aria-pressed', String(b.dataset.view === current));
}

// -- Archive pagination -------------------------------------------------------
function currentArchiveTiles(): HTMLElement[] {
  const { grid } = archiveElements();
  if (!grid) return [];
  return Array.from(grid.querySelectorAll<HTMLElement>('.tile--archive'));
}

function applyGrid() {
  const featureTiles = featuredGrid ? Array.from(featuredGrid.querySelectorAll<HTMLElement>('.tile--feature')) : [];
  for (const tile of featureTiles) {
    const match = activeScope === 'all' || tile.dataset.scope === activeScope;
    tile.hidden = !match;
  }

  const { block, totalEl, showMoreBtn, showFewerBtn } = archiveElements();
  const archiveTiles = currentArchiveTiles();
  const matching = archiveTiles.filter((tile) => activeScope === 'all' || tile.dataset.scope === activeScope);
  const matchingSet = new Set(matching);
  for (const tile of archiveTiles) {
    if (!matchingSet.has(tile)) {
      tile.hidden = true;
      continue;
    }
    tile.hidden = matching.indexOf(tile) >= archiveShown;
  }

  if (block) block.hidden = matching.length === 0;
  if (totalEl) totalEl.textContent = String(matching.length);

  const remaining = matching.length - archiveShown;
  if (showMoreBtn) {
    showMoreBtn.hidden = remaining <= 0;
    showMoreBtn.textContent = `Show ${Math.min(STEP, Math.max(remaining, 0))} more`;
  }
  if (showFewerBtn) {
    showFewerBtn.hidden = archiveShown <= STEP || matching.length <= STEP;
  }

  // Index rows and year groups follow the same scope filter.
  if (indexList) {
    const rows = Array.from(indexList.querySelectorAll<HTMLElement>('.index-row'));
    for (const row of rows) {
      const li = row.closest('li');
      if (!li) continue;
      li.hidden = activeScope !== 'all' && row.dataset.scope !== activeScope;
    }
    for (const section of Array.from(indexList.querySelectorAll<HTMLElement>('section'))) {
      const visible = section.querySelectorAll('li:not([hidden])').length;
      section.hidden = visible === 0;
    }
  }
}

// Delegated listeners: the archive block (and its buttons) may not exist yet
// at load and can be created later by stress.ts, so bind on a stable ancestor
// instead of the buttons themselves.
document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  if (target.closest('#show-more')) {
    archiveShown += STEP;
    applyGrid();
    const { showMoreBtn } = archiveElements();
    const tiles = currentArchiveTiles().filter((t) => !t.hidden);
    if (!showMoreBtn || showMoreBtn.hidden) {
      const firstNew = tiles[archiveShown - STEP];
      (firstNew ?? tiles[tiles.length - 1])?.focus?.();
    }
  } else if (target.closest('#show-fewer')) {
    archiveShown = STEP;
    applyGrid();
    const { heading } = archiveElements();
    heading?.scrollIntoView({ block: 'start', behavior: 'instant' });
    heading?.focus();
  }
});

for (const btn of filterButtons) {
  btn.addEventListener('click', () => {
    activeScope = btn.dataset.scope ?? 'all';
    archiveShown = STEP;
    for (const b of filterButtons) b.setAttribute('aria-pressed', String(b === btn));
    applyGrid();
  });
}

applyGrid();

// -- Index hover preview (desktop only) ---------------------------------------
const preview = document.getElementById('index-preview');
const previewInner = document.getElementById('index-preview-inner');

if (indexList && preview && previewInner && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  let targetX = 0;
  let targetY = 0;
  let raf = 0;

  const move = () => {
    previewInner.style.translate = `${targetX}px ${targetY}px`;
    raf = 0;
  };

  const position = (event: PointerEvent) => {
    const flip = event.clientX > window.innerWidth - 320;
    targetX = flip ? event.clientX - 280 - 24 : event.clientX + 24;
    targetY = event.clientY - 105;
    if (!raf) raf = requestAnimationFrame(move);
  };

  let activeSlug: string | null = null;

  indexList.addEventListener('pointermove', (event) => {
    const row = (event.target as HTMLElement).closest<HTMLElement>('.index-row');
    if (!row) {
      preview.classList.remove('visible');
      activeSlug = null;
      return;
    }
    position(event);
    const slug = row.dataset.slug ?? null;
    if (slug !== activeSlug) {
      activeSlug = slug;
      const template = document.querySelector<HTMLTemplateElement>(`template[data-preview-slug="${slug}"]`);
      previewInner.replaceChildren(template ? template.content.cloneNode(true) : document.createDocumentFragment());
    }
    preview.classList.add('visible');
  });

  indexList.addEventListener('pointerleave', () => {
    preview.classList.remove('visible');
    activeSlug = null;
  });
}

// Exposed for stress.ts to re-run after it injects fake tiles.
(window as unknown as { __applyWorkGrid?: () => void }).__applyWorkGrid = applyGrid;

export {};
