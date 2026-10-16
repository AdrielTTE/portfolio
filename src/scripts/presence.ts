// The hero's "Online now" / "Back Monday at 09:00": whether it is working time
// in Kuala Lumpur, from the hours in data/site.ts. Updates once a minute,
// aligned to the minute change. The line stays hidden without JS, like the
// clock beside it.
import { availability, type Hours } from '../lib/availability';

document.querySelectorAll<HTMLElement>('[data-presence]').forEach((el) => {
  let hours: Hours;
  try {
    hours = JSON.parse(el.dataset.hours ?? '');
  } catch {
    return;
  }
  const text = el.querySelector<HTMLElement>('[data-presence-text]');
  if (!text) return;
  const tick = () => {
    if (!el.isConnected) return; // swapped out by the router
    const now = availability(new Date(), hours);
    if (text.textContent !== now.label) text.textContent = now.label;
    el.dataset.online = String(now.online);
    el.removeAttribute('hidden');
    setTimeout(tick, 60000 - (Date.now() % 60000) + 50);
  };
  tick();
});
export {};
