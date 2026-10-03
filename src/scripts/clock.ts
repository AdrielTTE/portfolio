// Live Kuala Lumpur time in the footer. Rewrites one text node once a minute,
// aligned to the minute change; nothing is shown without JS.
const el = document.querySelector<HTMLElement>('[data-clock]');
if (el) {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kuala_Lumpur',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const tick = () => {
    el.textContent = fmt.format(new Date());
    el.closest<HTMLElement>('[data-clock-wrap]')?.removeAttribute('hidden');
    setTimeout(tick, 60000 - (Date.now() % 60000) + 50);
  };
  tick();
}
export {};
