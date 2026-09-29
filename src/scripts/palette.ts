// Palette behaviour: open (⌘K, Ctrl+K, "/", or any [data-palette-open]),
// filter, arrow/enter selection, sliding highlight (transform only).
// Markup/ARIA/interfaces: task-8 brief. Visuals: docs/design-addendum.md §7.6.
import { filterCommands, type Command } from '../lib/palette';

// The header button and footer hint render "⌘K" server-side (Apple default).
// Swap it for "Ctrl K" on non-Apple platforms so the hint stays accurate.
// Runs independently of the dialog below, since these hints live outside it.
function isApplePlatform(): boolean {
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const platform = nav.userAgentData?.platform ?? navigator.platform ?? '';
  return /Mac|iPhone|iPad/.test(platform);
}

if (!isApplePlatform()) {
  document.querySelectorAll<HTMLElement>('[data-kbd-mod]').forEach((el) => {
    el.textContent = (el.textContent ?? '').replace('⌘K', 'Ctrl K');
  });
}

const dialog = document.getElementById('palette') as HTMLDialogElement | null;
if (dialog) {
  const input = document.getElementById('palette-q') as HTMLInputElement;
  const list = document.getElementById('palette-list') as HTMLUListElement;
  const empty = document.getElementById('palette-empty') as HTMLElement;
  const hl = dialog.querySelector<HTMLElement>('.hl')!;
  const closeBtn = dialog.querySelector<HTMLButtonElement>('.close-btn');
  const all: Command[] = JSON.parse(document.getElementById('palette-data')!.textContent || '[]');
  let results: Command[] = all;
  let active = 0;

  // Group-label rows share the list with option rows, so highlight/keyboard
  // navigation is indexed over the option elements only, not list.children.
  const options = (): HTMLLIElement[] => Array.from(list.querySelectorAll<HTMLLIElement>('li[role="option"]'));

  const moveHl = () => {
    const opts = options();
    const li = opts[active];
    hl.hidden = !li;
    if (li) hl.style.transform = `translateY(${li.offsetTop + list.offsetTop - list.scrollTop}px)`;
    opts.forEach((el) => el.removeAttribute('aria-selected'));
    if (li) {
      li.setAttribute('aria-selected', 'true');
      input.setAttribute('aria-activedescendant', li.id);
      li.scrollIntoView({ block: 'nearest' });
    } else {
      input.removeAttribute('aria-activedescendant');
    }
  };

  // Right-hand hint per spec §7.6: the destination path for a page link, an
  // external-link arrow, or an enter glyph for the one non-navigating action
  // (copy email). Toggle theme has no hint - it neither navigates nor copies.
  const hintFor = (c: Command): string => {
    if (c.action === 'copy-email') return '↵';
    if (c.action === 'toggle-theme') return '';
    if (c.href && /^https?:/.test(c.href)) return '↗';
    return c.href ?? '';
  };

  const render = () => {
    results = filterCommands(all, input.value);
    active = 0;
    const frag = document.createDocumentFragment();
    let lastGroup: Command['group'] | null = null;
    for (const c of results) {
      if (c.group !== lastGroup) {
        const gh = document.createElement('li');
        gh.className = 'grp-label';
        gh.setAttribute('role', 'presentation');
        gh.textContent = c.group;
        frag.appendChild(gh);
        lastGroup = c.group;
      }
      const li = document.createElement('li');
      li.id = `pal-${c.id}`;
      li.className = 'item';
      li.setAttribute('role', 'option');
      const label = document.createElement('span');
      label.className = 'label';
      label.textContent = c.label;
      const hint = document.createElement('span');
      hint.className = 'hint';
      hint.setAttribute('aria-hidden', 'true');
      hint.textContent = hintFor(c);
      li.append(label, hint);
      li.addEventListener('pointermove', () => {
        const i = results.indexOf(c);
        if (active !== i) {
          active = i;
          moveHl();
        }
      });
      li.addEventListener('click', () => run(c));
      frag.appendChild(li);
    }
    list.replaceChildren(frag);
    empty.hidden = results.length > 0;
    moveHl();
  };

  const run = async (c: Command | undefined) => {
    if (!c) return;
    if (c.href) {
      dialog.close();
      if (/^https?:/.test(c.href)) window.open(c.href, '_blank', 'noopener');
      else location.href = c.href;
    } else if (c.action === 'copy-email') {
      try {
        await navigator.clipboard.writeText(document.getElementById('palette-email')!.textContent!.trim());
      } catch {
        // Clipboard access can fail (permissions, insecure context); swallow silently.
      }
      dialog.close();
    } else if (c.action === 'toggle-theme') {
      dialog.close();
      document.getElementById('theme-toggle')?.click();
    }
  };

  const open = () => {
    if (dialog.open) return;
    input.value = '';
    dialog.showModal();
    render();
    input.focus();
  };

  input.addEventListener('input', render);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (results.length) {
        active = (active + 1) % results.length;
        moveHl();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (results.length) {
        active = (active - 1 + results.length) % results.length;
        moveHl();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      run(results[active]);
    }
  });
  // Scroll listener on the palette list only, while the dialog is open - it
  // repositions the highlight and is not a page scroll listener.
  list.addEventListener('scroll', moveHl, { passive: true });
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  closeBtn?.addEventListener('click', () => dialog.close());

  document.addEventListener('keydown', (e) => {
    const typing = (e.target as HTMLElement).closest('input, textarea, [contenteditable="true"]');
    if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
      e.preventDefault();
      open();
    }
  });
  document.querySelectorAll('[data-palette-open]').forEach((b) =>
    b.addEventListener('click', (e) => {
      // The trigger may be a real <a href="#site-footer"> (no-JS fallback);
      // once JS runs, it opens the dialog instead of following the link.
      e.preventDefault();
      open();
    }),
  );
}

export {};
