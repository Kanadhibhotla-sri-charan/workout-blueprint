import { describe, expect, it } from 'vitest';
import { exercises, equipmentOptions } from '../data';
import { applyFilters, EMPTY_FILTERS } from '../utils/filters';
import { makeRecommendation } from './decisionEngine';
import type { DecisionInput } from './types';
import type { Exercise } from '../types/exercise';
import { equipmentSetups, formatEquipmentOptions, isEquipmentFeasible, usableSetups } from './equipment';

// Phase 7 Stage 3.5 — equipment setups. See
// docs/dev/reports/EQUIPMENT-MODEL-INVESTIGATION.md for the model.

const byId = (id: string): Exercise => {
  const exercise = exercises.find((e) => e.id === id);
  if (!exercise) throw new Error(`missing exercise ${id}`);
  return exercise;
};

const BASE: DecisionInput = {
  bodyRegion: 'chest', physiqueTarget: null, supportingPhysiqueTargets: null, aestheticOutcome: null,
  functionalGoal: null, goal: 'build-base', equipmentAvailable: null, maxSetupTime: null,
  maxFatigueCost: null, maxStabilityDemand: null, maxSkillDemand: null, currentExerciseId: null,
};

const HOME_DUMBBELLS = ['dumbbell', 'bench', 'incline bench', 'bodyweight', 'pull-up bar', 'band'];

const recommendedIds = (result: ReturnType<typeof makeRecommendation>) =>
  result.status === 'ok'
    ? [result.bestFit.id, result.alternative?.id, ...result.complements.map((c) => c.id)].filter(Boolean)
    : [];

describe('1. alternative equipment — barbell OR EZ-bar OR dumbbell', () => {
  const ote = byId('overhead-triceps-extension');

  it('is feasible with any one of the three alone', () => {
    expect(isEquipmentFeasible(ote, ['barbell'])).toBe(true);
    expect(isEquipmentFeasible(ote, ['ez-bar'])).toBe(true);
    expect(isEquipmentFeasible(ote, ['dumbbell'])).toBe(true);
    expect(isEquipmentFeasible(ote, ['cable'])).toBe(false);
  });

  it('reaches a dumbbell-only user in Decide (triceps long head previously had no home option)', () => {
    const result = makeRecommendation(
      { ...BASE, bodyRegion: 'arms', physiqueTarget: 'triceps-long-head', equipmentAvailable: HOME_DUMBBELLS },
      exercises
    );
    expect(result.status).toBe('ok');
    if (result.status === 'ok') expect(result.bestFit.id).toBe('overhead-triceps-extension');
  });

  it('ranks "limited equipment" by the one-item setup the user can use, and explains that setup', () => {
    const result = makeRecommendation(
      { ...BASE, bodyRegion: 'arms', physiqueTarget: 'triceps-long-head', goal: 'limited-equipment', equipmentAvailable: ['dumbbell'] },
      exercises
    );
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.bestFit.id).toBe('overhead-triceps-extension');
      expect(result.why).toBe('Needs only: dumbbell.');
      expect(result.watchOut).toContain('Requires: dumbbell.');
    }
  });

  it('lists the alternatives when equipment is unrestricted', () => {
    const result = makeRecommendation(
      { ...BASE, bodyRegion: 'arms', physiqueTarget: 'triceps-long-head', goal: 'limited-equipment' },
      exercises
    );
    expect(result.status).toBe('ok');
    if (result.status === 'ok' && result.bestFit.id === 'overhead-triceps-extension') {
      expect(result.why).toBe('Needs only one of: barbell, ez-bar, dumbbell, or band.');
    }
    expect(formatEquipmentOptions(ote)).toBe('barbell, ez-bar, dumbbell, or band');
  });
});

describe('2. combined equipment stays jointly required', () => {
  it('Smith + bench needs both', () => {
    const smithBench = byId('smith-machine-bench-press');
    expect(smithBench.equipment_setups ?? null).toBeNull();
    expect(isEquipmentFeasible(smithBench, ['smith machine'])).toBe(false);
    expect(isEquipmentFeasible(smithBench, ['bench'])).toBe(false);
    expect(isEquipmentFeasible(smithBench, ['smith machine', 'bench'])).toBe(true);
  });

  it('a mixed record (hip thrust) needs one complete setup, not one item from each', () => {
    const hipThrust = byId('hip-thrust');
    expect(isEquipmentFeasible(hipThrust, ['barbell'])).toBe(false);
    expect(isEquipmentFeasible(hipThrust, ['barbell', 'bench'])).toBe(true);
    expect(isEquipmentFeasible(hipThrust, ['hip-thrust machine'])).toBe(true);
    expect(isEquipmentFeasible(hipThrust, ['smith machine'])).toBe(false);
  });
});

describe('3. bodyweight-only — an empty selection means bodyweight', () => {
  it('push-ups are feasible with nothing selected', () => {
    expect(isEquipmentFeasible(byId('push-up-chest'), [])).toBe(true);
  });

  it('Decide answers a chest request with nothing selected, using only bodyweight', () => {
    const result = makeRecommendation({ ...BASE, equipmentAvailable: [] }, exercises);
    expect(result.status).toBe('ok');
    for (const id of recommendedIds(result)) {
      expect(usableSetups(byId(id!), []).length).toBeGreaterThan(0);
      expect(equipmentSetups(byId(id!)).some((setup) => setup.every((item) => item === 'bodyweight'))).toBe(true);
    }
  });
});

describe('4. mixed bodyweight + equipment', () => {
  it('bodyweight never blocks an otherwise complete setup', () => {
    expect(isEquipmentFeasible(byId('pull-up-pronated'), ['pull-up bar'])).toBe(true);
    expect(isEquipmentFeasible(byId('copenhagen-plank'), ['bench'])).toBe(true);
    expect(isEquipmentFeasible(byId('dip-chest-biased'), ['dip bars'])).toBe(true);
  });

  it('but the non-bodyweight items are still required', () => {
    expect(isEquipmentFeasible(byId('pull-up-pronated'), [])).toBe(false);
    expect(isEquipmentFeasible(byId('copenhagen-plank'), [])).toBe(false);
  });
});

describe('5. missing required equipment — close-grip bench press needs a bench', () => {
  const cgbp = byId('close-grip-bench-press');

  it('is not feasible without a bench', () => {
    expect(isEquipmentFeasible(cgbp, ['barbell'])).toBe(false);
    expect(isEquipmentFeasible(cgbp, ['barbell', 'rack'])).toBe(false);
    expect(isEquipmentFeasible(cgbp, ['smith machine'])).toBe(false);
  });

  it('is feasible with either complete setup', () => {
    expect(isEquipmentFeasible(cgbp, ['barbell', 'bench', 'rack'])).toBe(true);
    expect(isEquipmentFeasible(cgbp, ['smith machine', 'bench'])).toBe(true);
  });

  it('is never offered by Decide to a lifter with a barbell but no bench', () => {
    for (const goal of ['build-base', 'visual-area', 'low-fatigue', 'limited-equipment'] as const) {
      const result = makeRecommendation(
        { ...BASE, bodyRegion: 'arms', physiqueTarget: 'triceps', goal, equipmentAvailable: ['barbell', 'rack', 'ez-bar'] },
        exercises
      );
      expect(recommendedIds(result)).not.toContain('close-grip-bench-press');
    }
  });
});

describe('6. complement ordering respects tolerance before preferring declared complements', () => {
  // Reproduces the 16 results the investigation found would be lost:
  // hip-thrust declares romanian-deadlift as its complement. Once the RDL is
  // correctly feasible for a dumbbell user, it used to win over the
  // structural fallback and then be removed by the tolerance limit, leaving
  // nothing.
  const scenarios: [DecisionInput['goal'], Partial<DecisionInput>][] = [
    ['different-stimulus', { maxFatigueCost: 'low' }],
    ['complement-current', { maxFatigueCost: 'low' }],
    ['different-stimulus', { maxSetupTime: 'low' }],
    ['complement-current', { maxSetupTime: 'low' }],
  ];
  for (const entry of [{ bodyRegion: 'hips' }, { bodyRegion: 'hips', physiqueTarget: 'gluteus-maximus' }]) {
    for (const [goal, tolerance] of scenarios) {
      it(`${goal} with ${Object.keys(tolerance)[0]}=low, current hip-thrust, ${entry.physiqueTarget ?? 'hips region'}`, () => {
        const result = makeRecommendation(
          { ...BASE, ...entry, ...tolerance, goal, currentExerciseId: 'hip-thrust', equipmentAvailable: HOME_DUMBBELLS },
          exercises
        );
        expect(result.status).toBe('ok');
        if (result.status === 'ok') {
          expect(result.bestFit.id).not.toBe('romanian-deadlift');
          if (tolerance.maxFatigueCost) expect(result.bestFit.fatigue_cost).toBe('low');
          if (tolerance.maxSetupTime) expect(result.bestFit.setup_time).toBe('low');
        }
      });
    }
  }

  it('still prefers a declared complement when it passes the limits', () => {
    const result = makeRecommendation(
      { ...BASE, bodyRegion: 'hips', goal: 'complement-current', currentExerciseId: 'hip-thrust', equipmentAvailable: HOME_DUMBBELLS },
      exercises
    );
    expect(result.status).toBe('ok');
    if (result.status === 'ok') expect(result.bestFit.id).toBe('romanian-deadlift');
  });
});

describe('7. Explore and Decide agree on the same equipment data', () => {
  it('every complete setup is feasible in Decide and lists the exercise under each of its items in Explore', () => {
    for (const exercise of exercises) {
      for (const setup of equipmentSetups(exercise)) {
        expect(isEquipmentFeasible(exercise, setup)).toBe(true);
        for (const item of setup) {
          const listed = applyFilters(exercises, { ...EMPTY_FILTERS, equipment: item }).some((e) => e.id === exercise.id);
          expect(listed, `${exercise.id} under ${item}`).toBe(true);
        }
      }
    }
  });

  it('Explore never lists an exercise under an item that no complete setup uses', () => {
    for (const item of equipmentOptions) {
      for (const exercise of applyFilters(exercises, { ...EMPTY_FILTERS, equipment: item })) {
        const setupsWithItem = equipmentSetups(exercise).filter((setup) => setup.includes(item));
        expect(setupsWithItem.length, `${exercise.id} under ${item}`).toBeGreaterThan(0);
        expect(setupsWithItem.some((setup) => isEquipmentFeasible(exercise, setup))).toBe(true);
      }
    }
  });

  it('with a single item available, Decide-feasible exercises appear under that item in Explore (or need only bodyweight)', () => {
    for (const item of equipmentOptions) {
      const explore = new Set(applyFilters(exercises, { ...EMPTY_FILTERS, equipment: item }).map((e) => e.id));
      for (const exercise of exercises) {
        if (!isEquipmentFeasible(exercise, [item])) continue;
        const bodyweightOnly = equipmentSetups(exercise).some((setup) => setup.every((i) => i === 'bodyweight'));
        expect(explore.has(exercise.id) || bodyweightOnly, `${exercise.id} with only ${item}`).toBe(true);
      }
    }
  });
});

describe('records without equipment_setups keep all-items-required semantics', () => {
  it('a single-setup record needs every listed item', () => {
    const backSquat = byId('back-squat');
    expect(equipmentSetups(backSquat)).toEqual([backSquat.equipment]);
    expect(isEquipmentFeasible(backSquat, ['barbell'])).toBe(false);
    expect(isEquipmentFeasible(backSquat, ['barbell', 'rack'])).toBe(true);
  });

  it('unrestricted equipment (null) still admits everything', () => {
    expect(exercises.every((e) => isEquipmentFeasible(e, null))).toBe(true);
  });
});
