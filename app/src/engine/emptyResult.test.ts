import { describe, expect, it } from 'vitest';
import { exercises } from '../data';
import { makeRecommendation } from './decisionEngine';
import type { DecisionInput, DecisionResult } from './types';

// Phase 7 Stage 5.3 — empty-result messaging. Policy:
// docs/knowledge-manual/EQUIPMENT-COVERAGE-POLICY.md.

const BASE: DecisionInput = {
  bodyRegion: 'arms', physiqueTarget: null, supportingPhysiqueTargets: null, aestheticOutcome: null,
  functionalGoal: null, goal: 'build-base', equipmentAvailable: null, maxSetupTime: null,
  maxFatigueCost: null, maxStabilityDemand: null, maxSkillDemand: null, currentExerciseId: null,
};

function empty(input: Partial<DecisionInput>, pool = exercises) {
  const result = makeRecommendation({ ...BASE, ...input }, pool);
  if (result.status !== 'no-candidates' || !result.explanation) throw new Error(`expected an explained empty result, got ${result.status}`);
  return { reason: result.reason, ...result.explanation };
}

const LONG_HEAD = { bodyRegion: 'arms', physiqueTarget: 'triceps-long-head' };

describe('equipment-blocked empty result', () => {
  it('names the selection and lists the existing exercises a different setup would unlock, with their own equipment', () => {
    const result = empty({ ...LONG_HEAD, equipmentAvailable: ['band'] });
    expect(result.kind).toBe('equipment');
    expect(result.bodyweightGap).toBe(false);
    expect(result.subject).toBe('Triceps — Long-Head Emphasis');
    expect(result.reason).toBe(
      'None of the exercises for Triceps — Long-Head Emphasis that fit your limits can be done with the equipment you selected. With different equipment, these would fit:'
    );
    expect(result.unlocks).toEqual([
      { exerciseId: 'cable-overhead-extension-leaning-forward', exerciseName: 'Cable Overhead Extension (Leaning Forward)', equipment: 'cable' },
      { exerciseId: 'overhead-triceps-extension', exerciseName: 'Overhead Triceps Extension', equipment: 'barbell, ez-bar, or dumbbell' },
    ]);
  });

  it('only lists exercises that already fit the user\'s limits, and every one really is unlocked by its own setups', () => {
    const input: Partial<DecisionInput> = { bodyRegion: 'forearms', equipmentAvailable: ['sandbag'], maxSetupTime: 'low' };
    const result = empty(input);
    expect(result.kind).toBe('equipment');
    expect(result.unlocks.map((u) => u.exerciseId)).not.toContain('cable-reverse-curl'); // medium setup
    for (const unlock of result.unlocks) {
      const exercise = exercises.find((e) => e.id === unlock.exerciseId)!;
      const setup = (exercise.equipment_setups ?? [exercise.equipment])[0];
      expect(makeRecommendation({ ...BASE, ...input, equipmentAvailable: setup }, exercises).status).toBe('ok');
    }
  });

  it('a region selection says the region, not "this region" boilerplate', () => {
    expect(empty({ bodyRegion: 'forearms', equipmentAvailable: ['sandbag'] }).reason).toMatch(/^None of the exercises for Forearms /);
  });
});

describe('legitimate bodyweight gap', () => {
  it('nothing selected: says no bodyweight-only exercise directly trains the target, and why that is not a fault', () => {
    const result = empty({ bodyRegion: 'back', physiqueTarget: 'upper-traps', equipmentAvailable: [] });
    expect(result.kind).toBe('equipment');
    expect(result.bodyweightGap).toBe(true);
    expect(result.reason).toBe(
      "Blueprint has no bodyweight-only exercise that directly trains Upper Traps. Some targets can't be meaningfully trained without equipment, and Blueprint doesn't substitute exercises that only work them indirectly. With equipment, these would fit:"
    );
    expect(result.unlocks.map((u) => u.exerciseId)).toEqual(['barbell-dumbbell-shrug', 'rack-pull']);
  });

  it('selecting only "bodyweight" is the same bodyweight-only context', () => {
    const a = empty({ bodyRegion: 'shoulders', physiqueTarget: 'side-delt', equipmentAvailable: [] });
    const b = empty({ bodyRegion: 'shoulders', physiqueTarget: 'side-delt', equipmentAvailable: ['bodyweight'] });
    expect(b).toEqual(a);
    expect(a.bodyweightGap).toBe(true);
  });

  it('is not claimed when some equipment beyond bodyweight was selected', () => {
    // (Upper traps with a band used to be the example here; the band shrug
    // answers it since Exercise Expansion Batch 2.)
    expect(empty({ ...LONG_HEAD, equipmentAvailable: [] }).bodyweightGap).toBe(true);
    expect(empty({ ...LONG_HEAD, equipmentAvailable: ['band'] }).bodyweightGap).toBe(false);
  });

  it('is not claimed when a bodyweight exercise exists but the limits exclude it', () => {
    // The push-up is medium stability. With a low-stability cap, a machine
    // press would fit with different equipment — and relaxing the cap
    // would allow the push-up with no new equipment. Both are said.
    const result = empty({ bodyRegion: 'chest', physiqueTarget: 'mid-pec', equipmentAvailable: [], maxStabilityDemand: 'low' });
    expect(result.bodyweightGap).toBe(false);
    expect(result.kind).toBe('equipment');
    expect(result.blockingLimits).toEqual(['stability']);
    expect(result.reason).toBe(
      'None of the exercises for Mid Chest that fit your limits can be done with the equipment you selected. Relaxing your stability preference would also allow one with your current equipment. With different equipment, these would fit:'
    );
    expect(result.unlocks.map((u) => u.exerciseId)).not.toContain('push-up-chest');
  });

  it('combined with a limit no exercise meets, it says both', () => {
    const result = empty({ ...LONG_HEAD, equipmentAvailable: [], maxSkillDemand: 'low' });
    expect(result.kind).toBe('equipment-and-tolerance');
    expect(result.bodyweightGap).toBe(true);
    expect(result.unlocks).toEqual([]);
    expect(result.reason).toMatch(/fits both your equipment and your skill preference/);
  });
});

describe('tolerance-blocked and other empty results', () => {
  it('with no equipment limit, names the limit to relax', () => {
    const result = empty({ ...LONG_HEAD, maxSkillDemand: 'low' });
    expect(result.kind).toBe('tolerance');
    expect(result.reason).toBe(
      'Blueprint has exercises for Triceps — Long-Head Emphasis, but none fit your limits. Relaxing your skill preference would allow one.'
    );
  });

  it('a functional goal is named as the subject', () => {
    // (Core anti-lateral-flexion under a low-fatigue limit used to be the
    // example here; the side plank answers it since Phase 7 Stage 5.6/5.7.)
    const result = empty({ bodyRegion: 'shoulders', functionalGoal: 'rotator-cuff', maxSkillDemand: 'low' });
    expect(result.kind).toBe('tolerance');
    expect(result.subject).toBe('Rotator Cuff');
    expect(result.blockingLimits).toEqual(['skill']);
  });

  it('a selection with no exercises at all says so', () => {
    const result = empty({ bodyRegion: 'chest' }, []);
    expect(result.kind).toBe('no-exercises');
    expect(result.reason).toBe('Blueprint has no exercises for Chest yet.');
  });
});

describe('successful recommendations and determinism', () => {
  it('a successful recommendation is unchanged and carries no explanation', () => {
    const result = makeRecommendation({ ...BASE, bodyRegion: 'chest', goal: 'limited-equipment' }, exercises);
    expect(result.status).toBe('ok');
    if (result.status === 'ok') expect(result.bestFit.id).toBe('push-up-chest');
    expect('explanation' in result).toBe(false);
  });

  it('the same input always produces the same message, whatever order the library is in', () => {
    const input: Partial<DecisionInput> = { bodyRegion: 'forearms', equipmentAvailable: ['sandbag'] };
    const first = makeRecommendation({ ...BASE, ...input }, exercises);
    const again = makeRecommendation({ ...BASE, ...input }, exercises);
    const reversed = makeRecommendation({ ...BASE, ...input }, [...exercises].reverse());
    expect(again).toEqual(first);
    expect(reversed).toEqual(first);
    const names = (r: DecisionResult) => (r.status === 'no-candidates' ? r.explanation!.unlocks.map((u) => u.exerciseName) : []);
    expect(names(first)).toEqual([...names(first)].sort());
  });

  it('current-exercise goals keep their own messages', () => {
    const result = makeRecommendation(
      { ...BASE, bodyRegion: 'back', goal: 'replace-exercise', currentExerciseId: 'farmers-carry' },
      exercises
    );
    expect(result.status).toBe('no-candidates');
    if (result.status === 'no-candidates') {
      expect(result.explanation).toBeUndefined();
      expect(result.reason).toMatch(/has no substitute/);
    }
  });
});
