import { describe, expect, it } from 'vitest';
import { exercises, programming } from './index';

// Workout Logger change requests 1.1-1.3. validate-data.js enforces the
// same rules on the YAML; these pin the generated data the logger syncs.
describe('volume model', () => {
  const targetIds = programming.physiqueTargets.map((t) => t.id);
  const groupIds = programming.volumeGroups.map((g) => g.id);
  const parentOf = new Map(programming.physiqueTargets.filter((t) => t.parent).map((t) => [t.id, t.parent!]));

  it('every physique target and volume group has exactly one volume entry', () => {
    const ids = programming.volumeTargets.map((v) => v.target_id).sort();
    expect(ids).toEqual([...targetIds, ...groupIds].sort());
  });

  it('children take their parent\'s number; everything else states minimum <= efficient <= priority', () => {
    for (const entry of programming.volumeTargets) {
      if (parentOf.has(entry.target_id)) {
        expect(entry.volume_from_parent, entry.target_id).toBe(parentOf.get(entry.target_id));
        expect(entry.weekly_sets).toBeUndefined();
      } else {
        const w = entry.weekly_sets!;
        expect(w.minimum, entry.target_id).toBeLessThanOrEqual(w.efficient);
        expect(w.efficient, entry.target_id).toBeLessThanOrEqual(w.priority);
        expect(w.priority, entry.target_id).toBeLessThanOrEqual(programming.globalPrinciples.weekly_volume.practical_range_sets[1]);
      }
    }
  });

  it('children of one parent share at most 1.0 of its volume', () => {
    for (const parent of new Set(parentOf.values())) {
      const children = programming.physiqueTargets.filter((t) => t.parent === parent);
      expect(children.reduce((sum, t) => sum + (t.volume_share ?? 0), 0), parent).toBeLessThanOrEqual(1.0001);
    }
  });

  it('every strength exercise with a physique target has target_credit, and credits only known ids in (0, 1]', () => {
    const known = new Set([...targetIds, ...groupIds]);
    for (const exercise of exercises.filter((e) => !e.training_mode && (e.physique_targets ?? []).length > 0)) {
      const credit = exercise.target_credit!;
      expect(credit, exercise.id).toBeDefined();
      for (const [id, weight] of Object.entries(credit)) {
        expect(known.has(id), `${exercise.id} → ${id}`).toBe(true);
        expect(weight).toBeGreaterThan(0);
        expect(weight).toBeLessThanOrEqual(1);
      }
    }
  });

  it('a press credits the front delt, so pressing alone can reach its efficient number', () => {
    expect(getCredit('flat-barbell-bench-press', 'front-delt')).toBe(0.5);
    expect(getCredit('incline-barbell-press', 'upper-pec')).toBe(1.0);
    expect(getCredit('incline-barbell-press', 'chest')).toBe(1.0);
    expect(getCredit('overhead-triceps-extension', 'triceps-long-head')).toBe(1.0);
  });
});

function getCredit(id: string, target: string): number | undefined {
  return exercises.find((e) => e.id === id)?.target_credit?.[target];
}
