import { describe, expect, it } from 'vitest';
import { findStructuralAlternative, rankStructuralAlternatives } from './alternatives';
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

  it('constrained to only a Smith machine + bench: narrows to the incline presses that setup allows', () => {
    // Since Phase 7 Stage 5.6/5.7 the feet-elevated push-up (bodyweight +
    // bench) is eligible too. It ties with the Smith incline press on every
    // structural criterion (same primary-target wording, no shared coverage
    // category with the dumbbell press). That tie used to fall to the
    // alphabetical id (feet-elevated push-up first). Since the Quality Gate
    // structural tie-break, the curated overlap decides it: the Smith incline
    // press is listed in the dumbbell press's `overlaps_with`, the push-up is
    // not (QUALITY-GATE-IMPLEMENTATION.md, Stage 2).
    const ranked = rankStructuralAlternatives(target, exercises, ['smith machine', 'bench']);
    expect(ranked.map((e) => e.id)).toEqual(['smith-machine-incline-press', 'feet-elevated-push-up']);
    expect(findStructuralAlternative(target, exercises, ['smith machine', 'bench'])?.id).toBe('smith-machine-incline-press');
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
