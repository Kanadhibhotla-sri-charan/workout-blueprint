import { describe, expect, it } from 'vitest';
import { makeRecommendation } from './decisionEngine';
import { exercises } from '../data';
import type { DecisionInput } from './types';

const BASE_INPUT: DecisionInput = {
  bodyRegion: 'chest',
  physiqueTarget: null,
  supportingPhysiqueTargets: null,
  goal: 'build-base',
  equipmentAvailable: null,
  maxSetupTime: null,
  maxFatigueCost: null,
  maxStabilityDemand: null,
  maxSkillDemand: null,
  currentExerciseId: null,
};

// The six representative scenarios PHASE-3-MVP.md §24 lists for testing
// the Decision Maker, run directly against the engine (3G's UI will call
// the same function, so a passing engine here is a precondition for a
// working UI, not a separate concern).
describe('makeRecommendation — §24 representative scenarios', () => {
  it('1. goal-only selection returns a heavy-compound chest pick', () => {
    const result = makeRecommendation(BASE_INPUT, exercises);
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.bestFit.body_regions).toContain('chest');
      expect(result.bestFit.coverage_categories).toContain('heavy-compound');
    }
  });

  it('2. equipment restriction narrows to only equipment-feasible picks', () => {
    const result = makeRecommendation(
      { ...BASE_INPUT, equipmentAvailable: ['bodyweight'] },
      exercises
    );
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.bestFit.equipment).toEqual(['bodyweight']);
    }
  });

  it('3. low-fatigue constraint only returns low-fatigue candidates', () => {
    const result = makeRecommendation(
      { ...BASE_INPUT, goal: 'low-fatigue', maxFatigueCost: 'low' },
      exercises
    );
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.bestFit.fatigue_cost).toBe('low');
    }
  });

  it('4. existing exercise + complement request resolves a materially different movement', () => {
    const result = makeRecommendation(
      {
        ...BASE_INPUT,
        goal: 'complement-current',
        currentExerciseId: 'incline-dumbbell-press',
      },
      exercises
    );
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.bestFit.movement_patterns[0]).not.toBe('incline horizontal press');
    }
  });

  it('5. existing exercise + alternative (replace) request resolves the same movement pattern', () => {
    const result = makeRecommendation(
      {
        ...BASE_INPUT,
        goal: 'replace-exercise',
        currentExerciseId: 'incline-dumbbell-press',
      },
      exercises
    );
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.bestFit.movement_patterns[0]).toBe('incline horizontal press');
      expect(result.bestFit.id).not.toBe('incline-dumbbell-press');
    }
  });

  it('6. an impossible constraint combination returns no-candidates, not a fabricated pick', () => {
    const result = makeRecommendation(
      { ...BASE_INPUT, equipmentAvailable: ['sandbag'] },
      exercises
    );
    expect(result.status).toBe('no-candidates');
  });
});

describe('makeRecommendation — complements cap', () => {
  it('never returns more than 3 complements, even when many structurally qualify (§16)', () => {
    const result = makeRecommendation(
      { ...BASE_INPUT, goal: 'replace-exercise', currentExerciseId: 'incline-dumbbell-press' },
      exercises
    );
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.complements.length).toBeLessThanOrEqual(3);
    }
  });
});

describe('makeRecommendation — goal requiring a current exercise, none given', () => {
  it('returns a missing-current-exercise status rather than guessing', () => {
    const result = makeRecommendation({ ...BASE_INPUT, goal: 'replace-exercise' }, exercises);
    expect(result.status).toBe('missing-current-exercise');
  });
});

describe('makeRecommendation — Phase 4 physique-target awareness', () => {
  it('a resolved target with curated exercises narrows candidates and populates target/visualObjective', () => {
    const result = makeRecommendation({ ...BASE_INPUT, physiqueTarget: 'upper-pec' }, exercises);
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.target?.id).toBe('upper-pec');
      expect(result.visualObjective).toContain('upper chest shelf');
      expect(result.bestFit.physique_targets).toContain('upper-pec');
    }
  });

  it('an unknown target id falls back to body-region selection without target/visualObjective', () => {
    const result = makeRecommendation({ ...BASE_INPUT, physiqueTarget: 'not-a-real-target' }, exercises);
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.target).toBeNull();
      expect(result.visualObjective).toBeNull();
      expect(result.bestFit.body_regions).toContain('chest');
    }
  });

  it('the golden test case: Upper Pec + Incline Dumbbell Press + complement-current resolves a genuinely different, relevant movement', () => {
    const result = makeRecommendation(
      {
        ...BASE_INPUT,
        physiqueTarget: 'upper-pec',
        goal: 'complement-current',
        currentExerciseId: 'incline-dumbbell-press',
      },
      exercises
    );
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      // Target recognition survives even though the chosen complement
      // (Cable Fly) isn't itself tagged upper-pec yet — see
      // decisionEngine.ts's buildResultFromRanked comment for why.
      expect(result.target?.id).toBe('upper-pec');
      expect(result.bestFit.id).toBe('cable-fly');
      expect(result.bestFit.movement_patterns[0]).not.toBe('incline horizontal press');
      expect(result.programming.repRange.primaryRange).toEqual([10, 20]);
      expect(result.programming.intensityTechnique?.id).toBe('drop-set');
    }
  });

  it('every "ok" result includes programming guidance', () => {
    const result = makeRecommendation(BASE_INPUT, exercises);
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.programming.repRange.primaryRange.length).toBe(2);
      expect(result.programming.rirTypicalRange.length).toBe(2);
    }
  });
});

describe('makeRecommendation — taxonomy expansion beyond Upper Pec', () => {
  it('side-delt (a newly expanded target) resolves and stays within the shoulders region', () => {
    const result = makeRecommendation(
      { ...BASE_INPUT, bodyRegion: 'shoulders', physiqueTarget: 'side-delt', goal: 'build-base' },
      exercises
    );
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.target?.id).toBe('side-delt');
      expect(result.bestFit.physique_targets).toContain('side-delt');
    }
  });

  it('replace-exercise for a biceps target stays within the same movement pattern', () => {
    const result = makeRecommendation(
      {
        ...BASE_INPUT,
        bodyRegion: 'arms',
        physiqueTarget: 'biceps',
        goal: 'replace-exercise',
        currentExerciseId: 'dumbbell-curl',
      },
      exercises
    );
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.target?.id).toBe('biceps');
      expect(result.bestFit.id).not.toBe('dumbbell-curl');
      expect(result.bestFit.movement_patterns[0]).toBe('elbow flexion');
    }
  });

  it('back-thickness and lat-width are distinct targets that narrow to different candidate pools', () => {
    const thickness = makeRecommendation(
      { ...BASE_INPUT, bodyRegion: 'back', physiqueTarget: 'back-thickness', goal: 'build-base' },
      exercises
    );
    const width = makeRecommendation(
      { ...BASE_INPUT, bodyRegion: 'back', physiqueTarget: 'lat-width', goal: 'build-base' },
      exercises
    );
    expect(thickness.status).toBe('ok');
    expect(width.status).toBe('ok');
    if (thickness.status === 'ok' && width.status === 'ok') {
      expect(thickness.bestFit.physique_targets).toContain('back-thickness');
      expect(width.bestFit.physique_targets).toContain('lat-width');
    }
  });
});

// Phase 4 Corrections §6-8: an aesthetic outcome's contributing targets
// must not be permanently reduced to physique_targets[0] — the primary
// target drives the recommendation, but supporting targets must broaden
// the candidate pool and never be silently discarded.
describe('makeRecommendation — primary + supporting physique targets (Phase 4 Corrections)', () => {
  it('one primary target with no supporting targets behaves exactly as before (supportingTargets is an empty array, not omitted)', () => {
    const result = makeRecommendation({ ...BASE_INPUT, physiqueTarget: 'upper-pec' }, exercises);
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.target?.id).toBe('upper-pec');
      expect(result.supportingTargets).toEqual([]);
    }
  });

  it('a primary target plus a supporting target resolves both, and the supporting target is not silently discarded', () => {
    const result = makeRecommendation(
      {
        ...BASE_INPUT,
        bodyRegion: 'arms',
        physiqueTarget: 'brachialis-arm-thickness',
        supportingPhysiqueTargets: ['triceps'],
        goal: 'build-base',
      },
      exercises
    );
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.target?.id).toBe('brachialis-arm-thickness');
      expect(result.supportingTargets.map((t) => t.id)).toEqual(['triceps']);
    }
  });

  it('the supporting target materially broadens the candidate pool — a brachialis-only pool has no heavy-compound option, but folding in triceps produces one', () => {
    const primaryOnly = makeRecommendation(
      { ...BASE_INPUT, bodyRegion: 'arms', physiqueTarget: 'brachialis-arm-thickness', goal: 'build-base' },
      exercises
    );
    const withSupporting = makeRecommendation(
      {
        ...BASE_INPUT,
        bodyRegion: 'arms',
        physiqueTarget: 'brachialis-arm-thickness',
        supportingPhysiqueTargets: ['triceps'],
        goal: 'build-base',
      },
      exercises
    );
    expect(primaryOnly.status).toBe('ok');
    expect(withSupporting.status).toBe('ok');
    if (primaryOnly.status === 'ok' && withSupporting.status === 'ok') {
      // Every brachialis-arm-thickness-tagged exercise is isolation-only,
      // so the primary-only pool can't produce a heavy-compound pick.
      expect(primaryOnly.bestFit.coverage_categories).not.toContain('heavy-compound');
      // Once triceps (supporting) is folded in, a heavy-compound triceps
      // exercise becomes reachable and wins build-base's ranking — proof
      // the supporting target genuinely changed the outcome, not just
      // decorated it.
      expect(withSupporting.bestFit.coverage_categories).toContain('heavy-compound');
      expect(withSupporting.bestFit.id).toBe('close-grip-bench-press');
    }
  });

  it('supportingPhysiqueTargets has no effect when the primary target itself has no matches (never rescues an unresolved primary)', () => {
    const result = makeRecommendation(
      {
        ...BASE_INPUT,
        physiqueTarget: 'not-a-real-target',
        supportingPhysiqueTargets: ['upper-pec'],
      },
      exercises
    );
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.target).toBeNull();
      expect(result.supportingTargets).toEqual([]);
    }
  });
});
