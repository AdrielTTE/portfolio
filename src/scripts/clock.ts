// Swaps the server-rendered GMT offset for a live HH:MM, updating on each
// minute boundary. No motion, per docs/design-spec.md §6.5.
const el = document.getElementById('live-clock');

if (el) {
  const timeZone = el.dataset.tz || 'Asia/Kuala_Lumpur';
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });

  function render() {
    if (!el) return;
    const now = new Date();
    el.textContent = formatter.format(now);
    el.setAttribute('datetime', now.toISOString());
  }

  function scheduleNextMinute() {
    const now = new Date();
    const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    setTimeout(() => {
      render();
      scheduleNextMinute();
    }, msToNextMinute);
  }

  render();
  scheduleNextMinute();
}

export {};
