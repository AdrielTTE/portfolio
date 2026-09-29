import { describe, it, expect } from 'vitest';
import { layoutDiagram, connectedTo } from '../src/lib/diagram';

const n = (...ids: string[]) => ids.map((id) => ({ id }));

describe('layoutDiagram', () => {
  it('puts nodes in columns by longest path from a source', () => {
    const { pos, cols, rows } = layoutDiagram(n('ui', 'api', 'db', 'auth'), [['ui', 'api'], ['api', 'db'], ['ui', 'auth'], ['auth', 'api']]);
    expect(pos.ui.col).toBe(0);
    expect(pos.auth.col).toBe(1);
    expect(pos.api.col).toBe(2);
    expect(pos.db.col).toBe(3);
    expect(cols).toBe(4);
    expect(rows).toBe(1);
  });
  it('stacks same-column nodes in rows, in declared order', () => {
    const { pos, rows } = layoutDiagram(n('a', 'b', 'c'), [['a', 'b'], ['a', 'c']]);
    expect([pos.b.row, pos.c.row]).toEqual([0, 1]);
    expect(rows).toBe(2);
  });
  it('terminates on cycles', () => {
    const { pos } = layoutDiagram(n('a', 'b'), [['a', 'b'], ['b', 'a']]);
    expect(Object.keys(pos).sort()).toEqual(['a', 'b']);
  });
  it('isolated nodes go to column 0', () => {
    expect(layoutDiagram(n('a', 'z'), [['a', 'a']]).pos.z.col).toBe(0);
  });
});

describe('connectedTo', () => {
  it('returns self plus direct neighbours in both directions', () => {
    expect([...connectedTo('api', [['ui', 'api'], ['api', 'db'], ['x', 'y']])].sort()).toEqual(['api', 'db', 'ui']);
  });
});
