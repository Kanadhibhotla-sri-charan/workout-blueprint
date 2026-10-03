import { describe, expect, it } from 'vitest';
import { aestheticOutcomes, bodyRegions, exercises, functionalGoals, physiqueTargets } from '../data';
import { makeRecommendation } from '../engine/decisionEngine';
import { GOALS } from '../engine/types';
import type { DecisionInput } from '../engine/types';
import { decodeDecisionParams, EMPTY_DECISION_FORM, encodeDecisionInput } from './decisionUrl';

const BASE: DecisionInput = {
  bodyRegion: 'chest', physiqueTarget: null, supportingPhysiqueTargets: null, aestheticOutcome: null,
  functionalGoal: null, goal: 'build-base', equipmentAvailable: null, maxSetupTime: null,
  maxFatigueCost: null, maxStabilityDemand: null, maxSkillDemand: null, currentExerciseId: null,
};

const roundTrip = (input: DecisionInput) => decodeDecisionParams(encodeDecisionInput(input)).input;

// Every selection the form can produce, built the way the form builds it.
function formSelections(): DecisionInput[] {
  const selections: DecisionInput[] = bodyRegions.map((bodyRegion) => ({ ...BASE, bodyRegion }));
  for (const target of physiqueTargets) {
    selections.push({ ...BASE, bodyRegion: target.parent_region, physiqueTarget: target.id });
  }
  for (const outcome of aestheticOutcomes) {
    const target = physiqueTargets.find((t) => t.id === outcome.primary_targets[0])!;
    selections.push({
      ...BASE,
      bodyRegion: target.parent_region,
      physiqueTarget: target.id,
      supportingPhysiqueTargets: outcome.supporting_targets?.length ? outcome.supporting_targets : null,
      aestheticOutcome: outcome.id,
    });
  }
  for (const goal of functionalGoals) {
    selections.push({ ...BASE, bodyRegion: goal.parent_region, functionalGoal: goal.id });
  }
  return selections;
}

describe('Decide URL state', () => {
  it('round-trips every selection the form can make, in every goal', () => {
    for (const selection of formSelections()) {
      for (const goal of GOALS) {
        const input = { ...selection, goal };
        expect(roundTrip(input)).toEqual(input);
      }
    }
  });

  it('round-trips equipment, tolerances and the current exercise', () => {
    const input: DecisionInput = {
      ...BASE,
      goal: 'replace-exercise',
      equipmentAvailable: ['bench', 'dumbbell', 'pull-up bar'],
      maxSetupTime: 'low',
      maxFatigueCost: 'medium',
      maxStabilityDemand: 'high',
      maxSkillDemand: 'low',
      currentExerciseId: 'push-up-chest',
    };
    expect(roundTrip(input)).toEqual(input);
  });

  it('keeps "nothing selected" (bodyweight only) distinct from "no equipment limit"', () => {
    const bodyweight = encodeDecisionInput({ ...BASE, equipmentAvailable: [] });
    expect(bodyweight.toString()).toBe('region=chest&goal=build-base&equipment=');
    expect(decodeDecisionParams(bodyweight).input?.equipmentAvailable).toEqual([]);
    expect(roundTrip(BASE)?.equipmentAvailable).toBeNull();
  });

  it('is deterministic: fixed parameter order, sorted and de-duplicated equipment', () => {
    const a = encodeDecisionInput({ ...BASE, equipmentAvailable: ['dumbbell', 'bench', 'dumbbell'], maxFatigueCost: 'low' });
    const b = encodeDecisionInput({ ...BASE, maxFatigueCost: 'low', equipmentAvailable: ['bench', 'dumbbell'] });
    expect(a.toString()).toBe(b.toString());
    expect(a.toString()).toBe('region=chest&goal=build-base&equipment=bench&equipment=dumbbell&fatigue=low');
  });

  it('stores canonical ids, not display labels', () => {
    const params = encodeDecisionInput({ ...BASE, aestheticOutcome: 'chest-side-projection', physiqueTarget: 'x' });
    expect([...params.keys()]).toEqual(['outcome', 'goal']);
    expect(params.get('outcome')).toBe('chest-side-projection');
  });

  it('reproduces the same recommendation from the URL', () => {
    const contexts: (string[] | null)[] = [null, [], ['dumbbell', 'bench', 'pull-up bar']];
    for (const selection of formSelections()) {
      for (const goal of ['build-base', 'limited-equipment', 'low-fatigue'] as const) {
        for (const equipmentAvailable of contexts) {
          const input = { ...selection, goal, equipmentAvailable };
          expect(makeRecommendation(roundTrip(input)!, exercises)).toEqual(makeRecommendation(input, exercises));
        }
      }
    }
  });
});

describe('Decide URL state — malformed input fails safe', () => {
  const decode = (search: string) => decodeDecisionParams(new URLSearchParams(search));

  it('no parameters: the normal empty form and no result', () => {
    expect(decode('')).toEqual({ form: EMPTY_DECISION_FORM, input: null });
  });

  it('unknown ids and values are dropped, never thrown on', () => {
    const decoded = decode(
      'outcome=nope&function=nope&target=nope&region=nope&goal=nope&equipment=laser&setup=extreme&current=nope&junk=1'
    );
    expect(decoded.input).toBeNull();
    expect(decoded.form).toEqual({ ...EMPTY_DECISION_FORM, restrictEquipment: true });
  });

  it('a decision needs both a selection and a goal', () => {
    expect(decode('region=chest').input).toBeNull();
    expect(decode('goal=build-base').input).toBeNull();
    expect(decode('region=chest&goal=build-base').input).toEqual(BASE);
  });

  it('valid parts survive next to invalid ones', () => {
    const decoded = decode('outcome=nope&region=back&goal=low-fatigue&fatigue=bogus&skill=low&equipment=dumbbell&equipment=laser');
    expect(decoded.input).toEqual({
      ...BASE, bodyRegion: 'back', goal: 'low-fatigue', maxSkillDemand: 'low', equipmentAvailable: ['dumbbell'],
    });
  });

  it('percent-encoding garbage does not crash', () => {
    expect(() => decode('region=%E0%A4%A&goal=%')).not.toThrow();
  });
});
