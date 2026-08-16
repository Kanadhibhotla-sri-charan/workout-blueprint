import { describe, expect, it } from 'vitest';
import { exercises, getExercisesByPhysiqueTarget, getPhysiqueTargetById, physiqueTargets } from './index';

// Taxonomy-expansion coverage: per-target data integrity checks, run
// generically over every defined target rather than one test per target,
// so this doesn't need editing every time a new target is added.
describe('physique-target taxonomy', () => {
  it('every defined target resolves and has a non-empty definition and outcome', () => {
    for (const target of physiqueTargets) {
      expect(getPhysiqueTargetById(target.id)).toBeDefined();
      expect(target.definition.length).toBeGreaterThan(0);
      expect(target.physique_outcome.length).toBeGreaterThan(0);
      expect(target.parent_region.length).toBeGreaterThan(0);
    }
  });

  it('every non-null physique_targets entry on every exercise resolves to a real target', () => {
    const targetIds = new Set(physiqueTargets.map((t) => t.id));
    for (const exercise of exercises) {
      for (const id of exercise.physique_targets ?? []) {
        expect(targetIds.has(id)).toBe(true);
      }
    }
  });

  it('every tagged exercise\'s physique_targets share at least one body_regions value with the target\'s parent_region', () => {
    for (const exercise of exercises) {
      for (const id of exercise.physique_targets ?? []) {
        const target = getPhysiqueTargetById(id)!;
        expect(exercise.body_regions).toContain(target.parent_region);
      }
    }
  });

  it('every target expected to be populated at this stage of the taxonomy has at least one exercise', () => {
    for (const target of physiqueTargets) {
      expect(getExercisesByPhysiqueTarget(target.id).length).toBeGreaterThan(0);
    }
  });

  it('lower-abs is not part of the taxonomy (explicitly excluded per ADR 0003)', () => {
    expect(getPhysiqueTargetById('lower-abs')).toBeUndefined();
  });

  it('a multi-target exercise (e.g. a row hitting both lat width and back thickness) is preserved, not collapsed to one', () => {
    const seatedCableRow = exercises.find((e) => e.id === 'seated-cable-row')!;
    expect(seatedCableRow.physique_targets).toEqual(
      expect.arrayContaining(['lat-width', 'back-thickness'])
    );
    expect(seatedCableRow.physique_targets?.length).toBe(2);
  });

  it('cable-fly (setup-adjustable bias) maps to all three chest targets', () => {
    const cableFly = exercises.find((e) => e.id === 'cable-fly')!;
    expect(cableFly.physique_targets).toEqual(
      expect.arrayContaining(['upper-pec', 'mid-pec', 'lower-pec'])
    );
  });

  it('triceps-long-head is a sub-target: every exercise tagged with it is also tagged general triceps', () => {
    for (const exercise of exercises) {
      if (exercise.physique_targets?.includes('triceps-long-head')) {
        expect(exercise.physique_targets).toContain('triceps');
      }
    }
  });
});
