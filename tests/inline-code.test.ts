import { it, expect } from 'vitest';
import { inlineCode } from '../src/lib/inline-code';

it('wraps backtick spans in <code>', () => {
  expect(inlineCode('see `streakTracking.dart` here')).toBe('see <code>streakTracking.dart</code> here');
});

it('escapes HTML before adding code tags', () => {
  expect(inlineCode('<script>x</script> `<b>`')).toBe('&lt;script&gt;x&lt;/script&gt; <code>&lt;b&gt;</code>');
  expect(inlineCode('"a" & \'b\'')).toBe('&quot;a&quot; &amp; &#39;b&#39;');
});

it('leaves an unpaired backtick as text', () => {
  expect(inlineCode('one ` only')).toBe('one ` only');
});
