// Palette behaviour: open (⌘K, Ctrl+K, "/", or any [data-palette-open]),
// filter, arrow/enter selection, sliding highlight (transform only).
// Markup/ARIA/interfaces: task-8 brief. Visuals: docs/design-addendum.md §7.6.
import { filterCommands, groupHeadersFor, type Command } from '../lib/palette';
import { project, rubberband } from '../lib/motion';

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
// The dialog persists across client-side navigation; bind once.
if (dialog && !dialog.dataset.bound) {
  dialog.dataset.bound = '1';
  const input = document.getElementById('palette-q') as HTMLInputElement;
  const list = document.getElementById('palette-list') as HTMLUListElement;
  const empty = document.getElementById('palette-empty') as HTMLElement;
  const hl = dialog.querySelector<HTMLElement>('.hl')!;
  const closeBtn = dialog.querySelector<HTMLButtonElement>('.close-btn');
  const status = document.getElementById('palette-status');
  const all: Command[] = JSON.parse(document.getElementById('palette-data')!.textContent || '[]');

  // Exit animation (spec §5.3 item 8; addendum §7.6): .closing plays the
  // opacity + slight scale-down over --dur-fast, then the dialog really
  // closes on animationend. Instant under reduced motion. A timer backs up
  // animationend in case the animation never runs.
  let closing = false;
  let closeTimer = 0;
  const finishClose = () => {
    if (!closing) return;
    closing = false;
    clearTimeout(closeTimer);
    dialog.classList.remove('closing');
    dialog.close();
  };
  const closeAnimated = () => {
    if (!dialog.open || closing) return;
    // Mid-drag or settling: the sheet's own animation owns the exit.
    if (sheetBusy()) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      dialog.close();
      return;
    }
    closing = true;
    dialog.classList.add('closing');
    closeTimer = window.setTimeout(finishClose, 400);
  };
  dialog.addEventListener('animationend', (e) => {
    if (e.animationName.endsWith('pal-out')) finishClose();
  });
  // Esc: take over the native instant close so it animates too.
  dialog.addEventListener('cancel', (e) => {
    e.preventDefault();
    closeAnimated();
  });
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeAnimated();
    }
  });
  // Phone sheet: drag the grabber up to dismiss ------------------------------
  // 1:1 with the finger, resists when pulled down, and on release projects
  // where the flick was heading: a flick up goes, a slow drag goes once it is
  // past a third of the sheet (at most 160px), otherwise it springs back. Grabbing it again mid-settle picks up from where
  // it is on screen, not from where it was going.
  const sheet = matchMedia('(max-width: 599px)');
  const grab = dialog.querySelector<HTMLElement>('[data-grab]');
  type Drag = { id: number; y0: number; base: number; off: number; trail: { y: number; t: number }[] };
  let drag: Drag | null = null;
  let settleTimer = 0;
  const sheetBusy = () => drag !== null;
  const setDy = (dy: number) => {
    const h = dialog.offsetHeight || 1;
    dialog.style.setProperty('--dy', `${dy}px`);
    dialog.style.setProperty('--p', String(Math.max(0, Math.min(1, -dy / h))));
  };
  const clearSheet = () => {
    clearTimeout(settleTimer);
    dialog.classList.remove('dragging', 'settling');
    dialog.style.removeProperty('--dy');
    dialog.style.removeProperty('--p');
  };
  const settle = (to: number, then?: () => void) => {
    dialog.classList.remove('dragging');
    dialog.classList.add('settling');
    setDy(to);
    const done = () => {
      dialog.removeEventListener('transitionend', onEnd);
      clearTimeout(settleTimer);
      then?.();
    };
    const onEnd = (e: TransitionEvent) => {
      if (e.target === dialog && e.propertyName === 'transform') done();
    };
    dialog.addEventListener('transitionend', onEnd);
    // transitionend never fires if nothing moved (or under reduced motion).
    settleTimer = window.setTimeout(done, 600);
  };
  grab?.addEventListener('pointerdown', (e) => {
    if (!sheet.matches || closing) return;
    clearTimeout(settleTimer);
    // Pick up from the live on-screen position.
    const base = new DOMMatrix(getComputedStyle(dialog).transform).m42 || 0;
    dialog.classList.remove('settling');
    dialog.classList.add('dragging');
    setDy(base);
    grab.setPointerCapture(e.pointerId);
    drag = { id: e.pointerId, y0: e.clientY, base, off: base, trail: [{ y: e.clientY, t: e.timeStamp }] };
  });
  grab?.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dy = drag.base + (e.clientY - drag.y0);
    drag.off = dy > 0 ? rubberband(dy, 160) : dy;
    drag.trail.push({ y: e.clientY, t: e.timeStamp });
    while (drag.trail.length > 2 && e.timeStamp - drag.trail[0].t > 100) drag.trail.shift();
    setDy(drag.off);
  });
  const dragEnd = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.id) return;
    const { off, trail } = drag;
    drag = null;
    const a = trail[0];
    const b = trail[trail.length - 1];
    const v = e.type === 'pointercancel' || b.t <= a.t ? 0 : ((b.y - a.y) / (b.t - a.t)) * 1000;
    const h = dialog.offsetHeight;
    // A real flick decides by its direction; a slow drag by how far it went.
    const dismiss = Math.abs(v) > 300 ? v < 0 && off < -20 : off + project(v) < -Math.min(h * 0.3, 160);
    if (dismiss) {
      settle(-(h + 32), () => {
        clearSheet();
        dialog.close();
      });
    } else {
      settle(0, clearSheet);
    }
  };
  grab?.addEventListener('pointerup', dragEnd);
  grab?.addEventListener('pointercancel', dragEnd);

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
    const query = input.value;
    results = filterCommands(all, query);
    active = 0;
    // Empty query: the list is still in source (group-contiguous) order, so
    // it renders as Pages/Projects/Actions header rows with a path/action
    // hint per item. A non-empty query lets ranking interleave groups, so
    // there are no headers (groupHeadersFor returns none) - instead each row
    // names its own group, the palette's original flat-list design.
    const grouped = query.trim() === '';
    const headers = groupHeadersFor(results, query);
    const frag = document.createDocumentFragment();
    let headerIndex = 0;
    results.forEach((c, i) => {
      if (grouped && headers[headerIndex]?.before === i) {
        const gh = document.createElement('li');
        gh.className = 'grp-label';
        gh.setAttribute('role', 'presentation');
        gh.textContent = headers[headerIndex].group;
        frag.appendChild(gh);
        headerIndex++;
      }
      const li = document.createElement('li');
      li.id = `pal-${c.id}`;
      li.className = 'item';
      li.setAttribute('role', 'option');
      const label = document.createElement('span');
      label.className = 'label';
      label.textContent = c.label;
      const right = document.createElement('span');
      right.setAttribute('aria-hidden', 'true');
      if (grouped) {
        right.className = 'hint';
        right.textContent = hintFor(c);
      } else {
        right.className = 'grp';
        right.textContent = c.group;
      }
      li.append(label, right);
      li.addEventListener('pointermove', () => {
        const idx = results.indexOf(c);
        if (active !== idx) {
          active = idx;
          moveHl();
        }
      });
      li.addEventListener('click', () => run(c));
      frag.appendChild(li);
    });
    list.replaceChildren(frag);
    // Live region (role="status"): text only when nothing matches, so the
    // miss is announced; cleared, not hidden, so it keeps working.
    empty.textContent = results.length > 0 ? '' : `No match for "${query.trim()}"`;
    moveHl();
  };

  const run = async (c: Command | undefined) => {
    if (!c) return;
    if (c.href) {
      dialog.close();
      if (/^https?:/.test(c.href)) window.open(c.href, '_blank', 'noopener');
      else if ((window as any).__router) (window as any).__router.go(c.href);
      else location.href = c.href;
    } else if (c.action === 'copy-email') {
      // Visible and announced feedback in the row itself, then close after a
      // beat. A failed copy (permissions, insecure context) keeps the palette
      // open and shows the address so it can be copied by hand.
      const email = document.getElementById('palette-email')!.textContent!.trim();
      const row = document.getElementById(`pal-${c.id}`);
      const rowLabel = row?.querySelector('.label');
      const rowHint = row?.querySelector('.hint, .grp');
      let ok = true;
      try {
        await navigator.clipboard.writeText(email);
      } catch {
        ok = false;
      }
      row?.classList.add('is-done');
      if (rowLabel) rowLabel.textContent = ok ? 'Email address copied' : `Copy failed: ${email}`;
      if (rowHint) rowHint.textContent = ok ? 'Copied' : '';
      if (status) status.textContent = ok ?'Email address copied' : `Copy failed. The address is ${email}`;
      if (ok) window.setTimeout(closeAnimated, 700);
    } else if (c.action === 'toggle-theme') {
      dialog.close();
      document.getElementById('theme-toggle')?.click();
    }
  };

  // Where the palette grows from: the middle of whatever opened it, as an
  // offset inside the dialog. Keyboard opens have no trigger, so the origin is
  // the top centre. Skipped for the phone sheet, which drops from the top.
  const setOrigin = (from?: Element | null) => {
    if (!from || sheet.matches) {
      dialog.style.removeProperty('--ox');
      dialog.style.removeProperty('--oy');
      return;
    }
    const t = from.getBoundingClientRect();
    const d = dialog.getBoundingClientRect();
    dialog.style.setProperty('--ox', `${t.left + t.width / 2 - d.left}px`);
    dialog.style.setProperty('--oy', `${t.top + t.height / 2 - d.top}px`);
  };

  const open = (from?: Element | null) => {
    if (closing) {
      // Reopened mid-exit: cancel the exit and keep the dialog open.
      closing = false;
      clearTimeout(closeTimer);
      dialog.classList.remove('closing');
      return;
    }
    if (dialog.open) return;
    input.value = '';
    if (status) status.textContent = '';
    clearSheet();
    dialog.showModal();
    setOrigin(from);
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
    if (e.target === dialog) closeAnimated();
  });
  closeBtn?.addEventListener('click', closeAnimated);

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
      open(e.currentTarget as Element);
    }),
  );
}

export {};
