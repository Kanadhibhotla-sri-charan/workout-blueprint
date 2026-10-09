import { describe, expect, it } from 'vitest';
import { exercises } from '../data';
import type { Exercise } from '../types/exercise';
import { makeRecommendation } from './decisionEngine';
import type { DecisionInput, Goal } from './types';

// Build-base tie resolution: `selection_role: secondary` is the last
// selection-ranking key before the alphabetical id. These fixtures are
// otherwise identical, so the only difference under test is the field (or
// the one earlier key a test deliberately varies).

const TEMPLATE = exercises.find((e) => e.id === 'dumbbell-curl')!;

function fixture(id: string, overrides: Partial<Exercise> = {}): Exercise {
  return {
    ...TEMPLATE,
    id,
    name: id,
    alternatives: [],
    complements: [],
    overlaps_with: [],
    physique_targets: ['biceps'],
    coverage_categories: ['isolation'],
    equipment: ['dumbbell'],
    equipment_setups: null,
    fatigue_cost: 'low',
    setup_time: 'low',
    skill_demand: 'low',
    stability_demand: 'low',
    selection_role: null,
    ...overrides,
  };
}

const BASE: DecisionInput = {
  bodyRegion: 'arms', physiqueTarget: 'biceps', supportingPhysiqueTargets: null, aestheticOutcome: null,
  functionalGoal: null, goal: 'build-base', equipmentAvailable: null, maxSetupTime: null,
  maxFatigueCost: null, maxStabilityDemand: null, maxSkillDemand: null, currentExerciseId: null,
};

const SELECTION_GOALS: Goal[] = ['build-base', 'visual-area', 'low-fatigue', 'limited-equipment'];

function bestFit(pool: Exercise[], input: Partial<DecisionInput> = {}): string {
  const result = makeRecommendation({ ...BASE, ...input }, pool);
  if (result.status !== 'ok') throw new Error(`expected a recommendation, got ${result.status}`);
  return result.bestFit.id;
}

describe('selection_role: secondary', () => {
  it('only deliberately reviewed records are classified secondary', () => {
    // Each classification is its own reviewed change with a coverage check
    // (SCHEMA.md selection_role). Adding a record here is that review.
    expect(exercises.filter((e) => e.selection_role != null).map((e) => e.id).sort()).toEqual([
      'cable-curl', // Final Exercise Expansion Pass
      'cable-pull-through', // Exercise Expansion Batch 7
      'hamstring-bridge', // Exercise Expansion Batch 7
    ]);
  });

  it('unmarked records keep the existing alphabetical fallback', () => {
    const pool = [fixture('z-curl'), fixture('a-curl')];
    for (const goal of SELECTION_GOALS) expect(bestFit(pool, { goal })).toBe('a-curl');
  });

  it('a secondary record yields to an unmarked one only when every earlier key ties, in every selection goal', () => {
    // The secondary record would win on id alone.
    const pool = [fixture('a-stand-in', { selection_role: 'secondary' }), fixture('z-primary')];
    for (const goal of SELECTION_GOALS) expect(bestFit(pool, { goal })).toBe('z-primary');
  });

  it('a secondary record still wins when its build-base goal key is better', () => {
    const pool = [
      fixture('z-stand-in', { selection_role: 'secondary', exercise_type: 'compound', coverage_categories: ['heavy-compound'] }),
      fixture('a-primary'),
    ];
    expect(bestFit(pool, { goal: 'build-base' })).toBe('z-stand-in');
  });

  it('a secondary record still wins when its visual-area goal key is better', () => {
    const pool = [
      fixture('z-stand-in', { selection_role: 'secondary', coverage_categories: ['isolation', 'lengthened-position-emphasis'] }),
      fixture('a-primary'),
    ];
    expect(bestFit(pool, { goal: 'visual-area' })).toBe('z-stand-in');
  });

  it('a secondary record still wins when its fatigue (low-fatigue goal key) is lower', () => {
    const pool = [fixture('z-stand-in', { selection_role: 'secondary' }), fixture('a-primary', { fatigue_cost: 'medium' })];
    expect(bestFit(pool, { goal: 'low-fatigue' })).toBe('z-stand-in');
  });

  it('a secondary record still wins when it needs less equipment (limited-equipment goal key)', () => {
    const pool = [
      fixture('z-stand-in', { selection_role: 'secondary', equipment: ['bodyweight'] }),
      fixture('a-primary', { equipment: ['dumbbell'] }),
    ];
    expect(bestFit(pool, { goal: 'limited-equipment' })).toBe('z-stand-in');
  });

  it('a secondary record still wins the existing cost tie-break (setup, then skill, then stability)', () => {
    for (const field of ['setup_time', 'skill_demand', 'stability_demand'] as const) {
      const pool = [fixture('z-stand-in', { selection_role: 'secondary' }), fixture('a-primary', { [field]: 'medium' })];
      for (const goal of ['low-fatigue', 'limited-equipment'] as Goal[]) expect(bestFit(pool, { goal })).toBe('z-stand-in');
    }
  });

  it('target tiers stay above it: a secondary primary-target match beats an unmarked supporting-target match', () => {
    const pool = [
      fixture('z-stand-in', { selection_role: 'secondary', body_regions: ['arms'], physique_targets: ['triceps'] }),
      fixture('a-primary', { body_regions: ['arms'], physique_targets: ['triceps-long-head'] }),
    ];
    for (const goal of SELECTION_GOALS) {
      expect(bestFit(pool, { goal, physiqueTarget: 'triceps', supportingPhysiqueTargets: ['triceps-long-head'] })).toBe('z-stand-in');
    }
  });

  it('aesthetic roles stay above it: a secondary record named as the outcome\'s direct exercise beats an unmarked unspecified one', () => {
    // upper-back-fullness names barbell-dumbbell-shrug as its `direct` exercise.
    const shrug = exercises.find((e) => e.id === 'barbell-dumbbell-shrug')!;
    const pool = [
      { ...shrug, selection_role: 'secondary' as const },
      fixture('a-trap-raise', { body_regions: ['back'], physique_targets: ['upper-traps'], movement_patterns: shrug.movement_patterns, equipment: shrug.equipment, equipment_setups: shrug.equipment_setups }),
    ];
    for (const goal of SELECTION_GOALS) {
      expect(bestFit(pool, { goal, bodyRegion: 'back', physiqueTarget: 'upper-traps', aestheticOutcome: 'upper-back-fullness' })).toBe('barbell-dumbbell-shrug');
    }
  });

  it('two secondary records fall back to the alphabetical id, whatever the library order', () => {
    const a = fixture('a-stand-in', { selection_role: 'secondary' });
    const z = fixture('z-stand-in', { selection_role: 'secondary' });
    for (const goal of SELECTION_GOALS) {
      expect(bestFit([z, a], { goal })).toBe('a-stand-in');
      expect(bestFit([a, z], { goal })).toBe('a-stand-in');
    }
  });

  it('a secondary record is still recommended when it is the only fit', () => {
    const pool = [fixture('only-option', { selection_role: 'secondary', equipment: ['band'] }), fixture('needs-dumbbell')];
    for (const goal of SELECTION_GOALS) expect(bestFit(pool, { goal, equipmentAvailable: ['band'] })).toBe('only-option');
  });
});
