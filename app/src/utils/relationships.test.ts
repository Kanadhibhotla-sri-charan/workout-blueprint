import { describe, expect, it } from 'vitest';
import auditedOverlaps from '../data/audited-overlaps.json';
import { exercises } from '../data';
import { exercisesOverlap, overlapIds, parseRelationshipEntry } from './relationships';

const record = (id: string, overlaps_with: string[] | null) => ({ id, overlaps_with });

describe('parseRelationshipEntry', () => {
  it('parses a bare same-file id', () => {
    expect(parseRelationshipEntry('dumbbell-curl')).toEqual({ id: 'dumbbell-curl' });
  });

  it('parses a cross-file reference with a module note', () => {
    expect(parseRelationshipEntry('seated-cable-row (back module)')).toEqual({ id: 'seated-cable-row', moduleNote: 'back module', trailingNote: undefined });
  });

  it('parses a cross-file reference with a trailing note', () => {
    expect(parseRelationshipEntry('reverse-curl (forearms module) — the eccentric half of this movement.')).toEqual({
      id: 'reverse-curl',
      moduleNote: 'forearms module',
      trailingNote: 'the eccentric half of this movement.',
    });
  });

  it('leaves prose unresolved', () => {
    expect(parseRelationshipEntry('A free-weight curl with a different resistance profile.')).toBeNull();
  });
});

describe('overlap matching', () => {
  it('reads ids from every entry shape and ignores prose', () => {
    expect(overlapIds(record('x', ['a', 'b (back module)', 'c (arms module) — note', 'Some prose.']))).toEqual(['a', 'b', 'c']);
    expect(overlapIds(record('x', null))).toEqual([]);
  });

  it('is symmetric: either record listing the other is enough', () => {
    const a = record('a', ['b (other module)']);
    const b = record('b', []);
    expect(exercisesOverlap(a, b)).toBe(true);
    expect(exercisesOverlap(b, a)).toBe(true);
    expect(exercisesOverlap(b, record('c', null))).toBe(false);
  });

  it('matches the audited relationship set exactly', () => {
    // Pinned after the Next Quality Gate audit (4 removals, 4 additions).
    // overlaps_with is a ranking input for replace / complement answers, so
    // any edit to it must update this snapshot deliberately.
    const pairs = new Set<string>();
    for (const a of exercises) for (const id of overlapIds(a)) pairs.add([a.id, id].sort().join('|'));
    expect([...pairs].sort()).toEqual(auditedOverlaps);
  });

  it('every overlap reference resolves to a real exercise', () => {
    const ids = new Set(exercises.map((e) => e.id));
    expect(exercises.flatMap((e) => overlapIds(e)).filter((id) => !ids.has(id))).toEqual([]);
  });
});
