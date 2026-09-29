// Command palette data + ranking. Spec §3.2.
export type Command = {
  id: string;
  label: string;
  group: 'Pages' | 'Projects' | 'Actions';
  href?: string;
  action?: 'copy-email' | 'toggle-theme';
  keywords?: string;
};

function isSubsequence(q: string, s: string): boolean {
  let i = 0;
  for (const ch of s) if (ch === q[i]) i++;
  return i === q.length;
}

function score(c: Command, q: string): number {
  const label = c.label.toLowerCase();
  const kw = (c.keywords ?? '').toLowerCase();
  if (label.startsWith(q)) return 3;
  if (label.includes(q) || kw.includes(q)) return 2;
  if (isSubsequence(q, label)) return 1;
  return 0;
}

export function filterCommands(cmds: Command[], raw: string): Command[] {
  const q = raw.trim().toLowerCase();
  if (!q) return cmds;
  return cmds
    .map((c, i) => ({ c, i, s: score(c, q) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .map((x) => x.c);
}

export type GroupHeader = { before: number; group: Command['group'] };

// Group headers only make sense over the unfiltered (empty-query) list, where
// `results` is still in the source's group-contiguous order - each group's
// header is emitted once, right before its first row. A non-empty query lets
// filterCommands' ranking interleave groups, so headers would repeat; in that
// case there are none, and the caller falls back to a flat list.
export function groupHeadersFor(results: Command[], raw: string): GroupHeader[] {
  if (raw.trim() !== '') return [];
  const headers: GroupHeader[] = [];
  let last: Command['group'] | null = null;
  results.forEach((c, i) => {
    if (c.group !== last) {
      headers.push({ before: i, group: c.group });
      last = c.group;
    }
  });
  return headers;
}
