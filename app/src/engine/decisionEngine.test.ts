import { describe, expect, it } from 'vitest';
import { makeRecommendation } from './decisionEngine';
import { exercises } from '../data';
import type { DecisionInput } from './types';

const BASE_INPUT: DecisionInput = {
  bodyRegion: 'chest',
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

describe('makeRecommendation — goal requiring a current exercise, none given', () => {
  it('returns a missing-current-exercise status rather than guessing', () => {
    const result = makeRecommendation({ ...BASE_INPUT, goal: 'replace-exercise' }, exercises);
    expect(result.status).toBe('missing-current-exercise');
  });
});
