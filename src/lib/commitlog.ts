// Lately entries rendered as a dated commit list. Spec §3.1 item 5.
export type CommitType = 'feat' | 'fix' | 'ship' | 'learn' | 'life';

export function toCommitLine(e: { date: Date; type: CommitType; text: string }) {
  const stamp = `${e.date.getUTCFullYear()}-${String(e.date.getUTCMonth() + 1).padStart(2, '0')}`;
  const trimmed = e.text.trim().replace(/\.$/, '');
  return { stamp, type: e.type, text: trimmed.charAt(0).toLowerCase() + trimmed.slice(1) };
}
