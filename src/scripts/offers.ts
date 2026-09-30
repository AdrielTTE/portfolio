// The "What I build" system map: its nodes are an accessible tablist
// (roving tabindex, arrow keys, aria-selected). Choosing a node lights its
// path via data-on and swaps the panel; inactive panels are inert and fade
// out, flipping visibility only once the fade finishes. Hovering a node with
// a fine pointer previews its path without touching the panel. Rapid
// switching restarts animations instead of queueing them. Spec §5.3 item 3.
const sys = document.querySelector<HTMLElement>('.offers .sys');
if (sys) {
  const tabs = [...sys.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
  let selected = sys.dataset.on ?? '';

  // Restart the request-dot run (CSS decides whether it shows at all).
  const light = (id: string) => {
    if (sys.dataset.on === id && sys.classList.contains('run')) return;
    sys.dataset.on = id;
    sys.classList.remove('run');
    void sys.offsetWidth;
    sys.classList.add('run');
  };

  const select = (tab: HTMLButtonElement, focus: boolean) => {
    for (const t of tabs) {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls')!)!;
      panel.toggleAttribute('inert', !on);
      panel.classList.remove('entering');
      if (on && !panel.classList.contains('is-active')) {
        panel.classList.add('is-active');
        void panel.offsetWidth; // restart the enter animation on rapid switching
        panel.classList.add('entering');
      } else if (!on) panel.classList.remove('is-active');
    }
    selected = tab.dataset.node!;
    light(selected);
    if (focus) tab.focus();
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab, false));
    tab.addEventListener('keydown', (e) => {
      const k = e.key;
      let j = -1;
      if (k === 'ArrowRight' || k === 'ArrowDown') j = (i + 1) % tabs.length;
      else if (k === 'ArrowLeft' || k === 'ArrowUp') j = (i - 1 + tabs.length) % tabs.length;
      else if (k === 'Home') j = 0;
      else if (k === 'End') j = tabs.length - 1;
      if (j >= 0) {
        e.preventDefault();
        select(tabs[j], true);
      }
    });
  });

  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    tabs.forEach((tab) => tab.addEventListener('pointerenter', () => light(tab.dataset.node!)));
    sys.addEventListener('pointerleave', () => light(selected));
  }

  // First run once the map scrolls into view (it may sit below the fold).
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting) {
        io.disconnect();
        setTimeout(() => light(selected), 400);
      }
    }, { threshold: 0.6 });
    io.observe(sys);
  }
}

export {};
