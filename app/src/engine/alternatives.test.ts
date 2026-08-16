import { describe, expect, it } from 'vitest';
import { findStructuralAlternative } from './alternatives';
import { exercises, getExerciseById } from '../data';

// Asserts the exact scenarios hand-computed in
// docs/dev/reports/DECISION-ENGINE-RULES.md §3 against the live dataset —
// if the data or the rule ever changes in a way that breaks these, this
// test (not just the doc's prose) catches it.
describe('findStructuralAlternative — incline-dumbbell-press', () => {
  const target = getExerciseById('incline-dumbbell-press')!;

  it('unconstrained: picks incline-barbell-press (tiebreak on shared coverage_categories, then id)', () => {
    const result = findStructuralAlternative(target, exercises, null);
    expect(result?.id).toBe('incline-barbell-press');
  });

  it('constrained to only a Smith machine + bench: narrows to smith-machine-incline-press', () => {
    const result = findStructuralAlternative(target, exercises, ['smith machine', 'bench']);
    expect(result?.id).toBe('smith-machine-incline-press');
  });

  it('never returns the target itself', () => {
    const result = findStructuralAlternative(target, exercises, null);
    expect(result?.id).not.toBe(target.id);
  });

  it('returns null when no equipment-feasible candidate exists', () => {
    const result = findStructuralAlternative(target, exercises, ['sandbag']);
    expect(result).toBeNull();
  });
});

describe('findStructuralAlternative — general invariants', () => {
  it('every candidate returned shares the target movement pattern and exercise type', () => {
    for (const target of exercises.slice(0, 30)) {
      const result = findStructuralAlternative(target, exercises, null);
      if (!result) continue;
      expect(result.movement_patterns[0]).toBe(target.movement_patterns[0]);
      expect(result.exercise_type).toBe(target.exercise_type);
      expect(result.body_regions.some((r) => target.body_regions.includes(r))).toBe(true);
    }
  });
});
