// Live Kuala Lumpur time in the footer. Rewrites one text node once a minute,
// aligned to the minute change; nothing is shown without JS.
document.querySelectorAll<HTMLElement>('[data-clock]').forEach((el) => {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kuala_Lumpur',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const tick = () => {
    if (!el.isConnected) return; // the footer was swapped out by the router
    el.textContent = fmt.format(new Date());
    el.closest<HTMLElement>('[data-clock-wrap]')?.removeAttribute('hidden');
    setTimeout(tick, 60000 - (Date.now() % 60000) + 50);
  };
  tick();
});
export {};
