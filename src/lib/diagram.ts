// Layered layout for case-study architecture diagrams: column = longest path
// from any source (cycle-safe, capped at node count), row = declared order
// within the column. Spec §3.3 item 2.
export function layoutDiagram(nodes: { id: string }[], edges: [string, string][]) {
  const ids = nodes.map((n) => n.id);
  const depth: Record<string, number> = Object.fromEntries(ids.map((id) => [id, 0]));
  const real = edges.filter(([a, b]) => a !== b && a in depth && b in depth);
  // Bellman-Ford style relaxation; at most |V|-1 useful passes, so cycles stop.
  for (let pass = 0; pass < ids.length - 1; pass++) {
    let changed = false;
    for (const [a, b] of real) {
      if (depth[b] < depth[a] + 1 && depth[a] + 1 < ids.length) {
        depth[b] = depth[a] + 1;
        changed = true;
      }
    }
    if (!changed) break;
  }
  const rowsPerCol: Record<number, number> = {};
  const pos: Record<string, { col: number; row: number }> = {};
  for (const id of ids) {
    const col = depth[id];
    const row = rowsPerCol[col] ?? 0;
    rowsPerCol[col] = row + 1;
    pos[id] = { col, row };
  }
  return { pos, cols: Math.max(...ids.map((id) => depth[id])) + 1, rows: Math.max(...Object.values(rowsPerCol)) };
}

export function connectedTo(id: string, edges: [string, string][]): Set<string> {
  const out = new Set([id]);
  for (const [a, b] of edges) {
    if (a === id) out.add(b);
    if (b === id) out.add(a);
  }
  return out;
}
