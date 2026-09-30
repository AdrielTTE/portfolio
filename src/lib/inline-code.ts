// Frontmatter prose (case-study sections) is plain text, but may mark code
// with `backticks`. Escape everything first, then turn backtick pairs into
// <code>, so no HTML in the source can ever reach the page unescaped.
const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

export function inlineCode(text: string): string {
  return escapeHtml(text).replace(/`([^`\n]+)`/g, '<code>$1</code>');
}
