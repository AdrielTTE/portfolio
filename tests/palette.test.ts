import { describe, it, expect } from 'vitest';
import { filterCommands, type Command } from '../src/lib/palette';

const cmds: Command[] = [
  { id: 'work', label: 'Work', group: 'Pages', href: '/#work' },
  { id: 'about', label: 'About', group: 'Pages', href: '/about/' },
  { id: 'habitect', label: 'Habitect', group: 'Projects', href: '/work/habitect/', keywords: 'flutter mobile' },
  { id: 'copy', label: 'Copy email', group: 'Actions', action: 'copy-email' },
];

describe('filterCommands', () => {
  it('empty query returns all in original order', () => {
    expect(filterCommands(cmds, '  ').map((c) => c.id)).toEqual(['work', 'about', 'habitect', 'copy']);
  });
  it('prefix beats substring; ties keep original order', () => {
    const extra: Command = { id: 'x', label: 'Contact about', group: 'Pages', href: '/contact/' };
    expect(filterCommands([...cmds, extra], 'ab').map((c) => c.id)).toEqual(['about', 'habitect', 'x']);
  });
  it('substring beats subsequence', () => {
    // "cpy": not a substring of anything; a subsequence of "copy email" only.
    expect(filterCommands(cmds, 'cpy').map((c) => c.id)).toEqual(['copy']);
    const withSub: Command = { id: 'cpy', label: 'Recpy', group: 'Actions', href: '/x' };
    expect(filterCommands([...cmds, withSub], 'cpy').map((c) => c.id)).toEqual(['cpy', 'copy']);
  });
  it('matches keywords', () => {
    expect(filterCommands(cmds, 'flutter').map((c) => c.id)).toEqual(['habitect']);
  });
  it('no match returns empty', () => {
    expect(filterCommands(cmds, 'zzqq')).toEqual([]);
  });
});
