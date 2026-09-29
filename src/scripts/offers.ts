// Roving-tabindex tablist with a transform-only sliding indicator. Inactive
// panels are inert and fade out; visibility flips only once the fade
// finishes (CSS transition-delay pattern in OfferSwitcher.astro), so nothing
// is ever briefly both visible and interactive. Rapid switching restarts the
// entering panel's animation instead of queueing. Spec §5.3 item 3; visual
// mechanics per docs/design-addendum.md §6.2.
const tablist = document.querySelector<HTMLElement>('.offers [role="tablist"]');
if (tablist) {
  const tabs = [...tablist.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
  const indicator = tablist.querySelector<HTMLElement>('.indicator')!;

  const place = (tab: HTMLElement) => {
    indicator.style.transform = `translateX(${tab.offsetLeft}px) scaleX(${tab.offsetWidth / 100})`;
  };

  const select = (tab: HTMLButtonElement, focus: boolean) => {
    for (const t of tabs) {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls')!)!;
      panel.toggleAttribute('inert', !on);
      panel.classList.toggle('is-active', on);
      panel.classList.remove('entering');
      if (on) {
        void panel.offsetWidth; // restart the enter animation on rapid switching
        panel.classList.add('entering');
      }
    }
    place(tab);
    if (focus) tab.focus();
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab, false));
    tab.addEventListener('keydown', (e) => {
      const k = e.key;
      let j = -1;
      if (k === 'ArrowRight') j = (i + 1) % tabs.length;
      else if (k === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      else if (k === 'Home') j = 0;
      else if (k === 'End') j = tabs.length - 1;
      if (j >= 0) {
        e.preventDefault();
        select(tabs[j], true);
      }
    });
  });

  place(tabs.find((t) => t.getAttribute('aria-selected') === 'true') ?? tabs[0]);
  new ResizeObserver(() => place(tabs.find((t) => t.tabIndex === 0) ?? tabs[0])).observe(tablist);
}

export {};
