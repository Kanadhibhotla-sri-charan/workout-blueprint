import { describe, expect, it } from 'vitest';
import { exercises } from '../data';
import type { Exercise } from '../types/exercise';
import { makeRecommendation } from './decisionEngine';
import { equipmentCost, isEquipmentFeasible, setupCost } from './equipment';
import type { DecisionInput, Goal } from './types';

// Phase 7 Stage 5.1 — ranking consistency. See
// docs/dev/reports/PHASE-7-STAGE-5-DECISION-COVERAGE-REVIEW.md §6.

const byId = (id: string): Exercise => {
  const exercise = exercises.find((e) => e.id === id);
  if (!exercise) throw new Error(`missing exercise ${id}`);
  return exercise;
};

const BASE: DecisionInput = {
  bodyRegion: 'synthetic', physiqueTarget: null, supportingPhysiqueTargets: null, aestheticOutcome: null,
  functionalGoal: null, goal: 'limited-equipment', equipmentAvailable: null, maxSetupTime: null,
  maxFatigueCost: null, maxStabilityDemand: null, maxSkillDemand: null, currentExerciseId: null,
};

// Two otherwise identical exercises in an isolated region. The "z" one
// always sorts last alphabetically, so whenever it wins, something other
// than the id fallback decided it.
function synthetic(id: string, over: Partial<Exercise> = {}): Exercise {
  return {
    ...byId('cable-curl'),
    id,
    name: id,
    body_regions: ['synthetic'],
    physique_targets: null,
    functional_goals: null,
    aesthetic_characteristics: null,
    coverage_categories: ['isolation'],
    equipment: ['machine'],
    equipment_setups: null,
    fatigue_cost: 'medium',
    setup_time: 'medium',
    skill_demand: 'medium',
    stability_demand: 'medium',
    review_status: 'reviewed',
    alternatives: null,
    complements: null,
    overlaps_with: null,
    ...over,
  } as Exercise;
}

function bestFit(goal: Goal, pool: Exercise[], equipmentAvailable: string[] | null = null): string {
  const result = makeRecommendation({ ...BASE, goal, equipmentAvailable }, pool);
  if (result.status !== 'ok') throw new Error(`no result: ${result.status}`);
  return result.bestFit.id;
}

describe('limited-equipment cost: bodyweight counts as 0 items', () => {
  it('bodyweight-only setups cost 0; real equipment is counted from the usable setup', () => {
    expect(setupCost(['bodyweight'])).toBe(0);
    expect(setupCost(['pull-up bar', 'bodyweight'])).toBe(1);
    expect(equipmentCost(byId('push-up-chest'), null)).toBe(0);
    expect(equipmentCost(byId('push-up-chest'), [])).toBe(0);
    expect(equipmentCost(byId('pull-up-pronated'), ['pull-up bar'])).toBe(1);
    expect(equipmentCost(byId('smith-machine-bench-press'), null)).toBe(2);
  });

  it('alternative setups are costed by the smallest usable one', () => {
    const hipThrust = byId('hip-thrust');
    expect(equipmentCost(hipThrust, ['barbell', 'bench'])).toBe(2);
    expect(equipmentCost(hipThrust, ['hip-thrust machine', 'barbell', 'bench'])).toBe(1);
    expect(equipmentCost(byId('overhead-triceps-extension'), ['dumbbell'])).toBe(1);
  });

  it('a bodyweight exercise wins the equipment-cost tie over a one-item exercise', () => {
    const machine = synthetic('a-machine-move', { equipment: ['machine'], fatigue_cost: 'low', setup_time: 'low', skill_demand: 'low', stability_demand: 'low' });
    const bodyweight = synthetic('z-bodyweight-move', { equipment: ['bodyweight'], fatigue_cost: 'high', setup_time: 'high', skill_demand: 'high', stability_demand: 'high' });
    expect(bestFit('limited-equipment', [machine, bodyweight])).toBe('z-bodyweight-move');
  });

  it('on real data, unrestricted chest limited-equipment now picks the push-up over a one-item machine/cable press', () => {
    const result = makeRecommendation({ ...BASE, bodyRegion: 'chest', goal: 'limited-equipment' }, exercises);
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.bestFit.id).toBe('push-up-chest');
      expect(result.why).toBe('Needs no equipment at all.');
    }
  });

  it('feasibility is unchanged: a zero-cost-looking setup still needs its other items', () => {
    const pullUpOnly = synthetic('z-pull-up-move', { equipment: ['pull-up bar', 'bodyweight'] });
    expect(isEquipmentFeasible(pullUpOnly, [])).toBe(false);
    expect(isEquipmentFeasible(pullUpOnly, ['pull-up bar'])).toBe(true);
    const result = makeRecommendation({ ...BASE, equipmentAvailable: [] }, [pullUpOnly]);
    expect(result.status).toBe('no-candidates');
  });
});

describe('cost tie-break for low-fatigue and limited-equipment', () => {
  const tied = (over: Partial<Exercise>) => [synthetic('a-move'), synthetic('z-move', over)];

  it('lower fatigue resolves an otherwise equal limited-equipment tie', () => {
    expect(bestFit('limited-equipment', tied({ fatigue_cost: 'low' }))).toBe('z-move');
  });

  it('fatigue outranks setup, skill and stability in the tie-break', () => {
    const pool = [
      synthetic('a-move', { fatigue_cost: 'medium', setup_time: 'low', skill_demand: 'low', stability_demand: 'low' }),
      synthetic('z-move', { fatigue_cost: 'low', setup_time: 'high', skill_demand: 'high', stability_demand: 'high' }),
    ];
    expect(bestFit('limited-equipment', pool)).toBe('z-move');
  });

  for (const goal of ['low-fatigue', 'limited-equipment'] as const) {
    it(`${goal}: lower setup resolves the next tie`, () => {
      expect(bestFit(goal, tied({ setup_time: 'low', skill_demand: 'high', stability_demand: 'high' }))).toBe('z-move');
    });

    it(`${goal}: lower skill resolves the next tie`, () => {
      expect(bestFit(goal, tied({ skill_demand: 'low', stability_demand: 'high' }))).toBe('z-move');
    });

    it(`${goal}: lower stability resolves the next tie`, () => {
      expect(bestFit(goal, tied({ stability_demand: 'low' }))).toBe('z-move');
    });

    it(`${goal}: id stays the final fallback`, () => {
      expect(bestFit(goal, tied({}))).toBe('a-move');
      expect(bestFit(goal, [synthetic('z-move'), synthetic('a-move')])).toBe('a-move');
    });
  }

  it('low-fatigue: the goal key itself (fatigue) still comes first', () => {
    const pool = [
      synthetic('a-move', { fatigue_cost: 'high', setup_time: 'low', skill_demand: 'low', stability_demand: 'low' }),
      synthetic('z-move', { fatigue_cost: 'medium', setup_time: 'high' }),
    ];
    expect(bestFit('low-fatigue', pool)).toBe('z-move');
  });
});

describe('other goals keep the plain id fallback', () => {
  // z-move is cheaper on every dimension; only the alphabet separates them.
  const pool = [
    synthetic('a-move', { fatigue_cost: 'high', setup_time: 'high', skill_demand: 'high', stability_demand: 'high' }),
    synthetic('z-move', { fatigue_cost: 'low', setup_time: 'low', skill_demand: 'low', stability_demand: 'low' }),
  ];

  for (const goal of ['build-base', 'visual-area'] as const) {
    it(`${goal} is not changed by the cost tie-break`, () => {
      expect(bestFit(goal, pool)).toBe('a-move');
    });
  }

  it('build-base and visual-area keep their real-data picks', () => {
    const pick = (input: Partial<DecisionInput>) => {
      const result = makeRecommendation({ ...BASE, ...input }, exercises);
      return result.status === 'ok' ? result.bestFit.id : null;
    };
    expect(pick({ bodyRegion: 'chest', goal: 'build-base' })).toBe('dip-chest-biased');
    expect(pick({ bodyRegion: 'quads', physiqueTarget: 'quads', goal: 'build-base' })).toBe('back-squat');
    expect(pick({ bodyRegion: 'hamstrings', physiqueTarget: 'hamstrings', goal: 'visual-area' })).toBe('romanian-deadlift');
  });
});
