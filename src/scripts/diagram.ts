// Diagram interaction: focus/hover/tap lights a node + its neighbours.
// Edges reveal once on view (opacity/transform). Spec §5.3 item 7.
import { connectedTo } from '../lib/diagram';

document.querySelectorAll<HTMLElement>('.arch').forEach((fig) => {
  const edges: [string, string][] = JSON.parse(fig.dataset.edges || '[]');
  const note = fig.querySelector<HTMLElement>('.note');
  const nodes = [...fig.querySelectorAll<SVGGElement>('.node')];
  const paths = [...fig.querySelectorAll<SVGPathElement>('path')];

  const light = (id: string | null) => {
    fig.classList.toggle('focus', !!id);
    const set = id ? connectedTo(id, edges) : new Set<string>();
    nodes.forEach((n) => {
      n.classList.toggle('lit', set.has(n.dataset.id!));
      n.classList.toggle('on', n.dataset.id === id);
    });
    paths.forEach((p) => p.classList.toggle('lit', !!id && (p.dataset.from === id || p.dataset.to === id)));
    if (note) note.textContent = id ? document.getElementById(`note-${id}`)?.textContent ?? '' : 'Select a part to see what it does.';
  };

  nodes.forEach((n) => {
    n.addEventListener('pointerenter', () => light(n.dataset.id!));
    n.addEventListener('focus', () => light(n.dataset.id!));
    n.addEventListener('click', () => light(n.dataset.id!));
    n.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); light(n.dataset.id!); } });
  });
  fig.querySelector('svg')?.addEventListener('pointerleave', () => { if (!fig.contains(document.activeElement)) light(null); });
  fig.addEventListener('focusout', (e) => { if (!fig.contains(e.relatedTarget as Node)) light(null); });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(([en]) => { if (en.isIntersecting) { fig.classList.add('in'); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(fig);
  } else fig.classList.add('in');
});

export {};
