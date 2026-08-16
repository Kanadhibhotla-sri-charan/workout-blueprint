import { describe, expect, it } from 'vitest';
import { resolveRepRange } from './programmingEngine';
import { buildProgramming } from './programmingEngine';
import { getExerciseById } from '../data';

describe('resolveRepRange', () => {
  it('heavy-compound exercises get the lower rep-range bucket', () => {
    const exercise = getExerciseById('incline-dumbbell-press')!; // heavy-compound
    const result = resolveRepRange(exercise);
    expect(result.primaryRange).toEqual([6, 12]);
  });

  it('isolation exercises get the wider rep-range bucket', () => {
    const exercise = getExerciseById('cable-fly')!; // isolation
    const result = resolveRepRange(exercise);
    expect(result.primaryRange).toEqual([10, 20]);
  });

  it('stable-compound exercises get the moderate rep-range bucket', () => {
    const exercise = getExerciseById('incline-machine-press')!; // stable-compound
    const result = resolveRepRange(exercise);
    expect(result.primaryRange).toEqual([8, 15]);
  });

  it('every result includes a non-empty reason', () => {
    for (const id of ['incline-dumbbell-press', 'cable-fly', 'incline-machine-press']) {
      const result = resolveRepRange(getExerciseById(id)!);
      expect(result.reason.length).toBeGreaterThan(0);
    }
  });
});

describe('buildProgramming — fatigue-constraint interaction', () => {
  const exercise = getExerciseById('incline-dumbbell-press')!;

  it('unconstrained: uses the full practical volume/frequency range', () => {
    const programming = buildProgramming(exercise, null);
    expect(programming.weeklyVolumeSets).toEqual([10, 20]);
    expect(programming.frequencyPerWeek[0]).toBeLessThan(programming.frequencyPerWeek[1]);
  });

  it('low fatigue tolerance: moves volume/frequency to the lower end, per architect approval memo item 5', () => {
    const programming = buildProgramming(exercise, 'low');
    expect(programming.weeklyVolumeSets).toEqual([8, 12]);
    expect(programming.frequencyPerWeek[0]).toBe(programming.frequencyPerWeek[1]);
  });

  it('low fatigue tolerance suppresses the intensity-technique suggestion', () => {
    const isolationExercise = getExerciseById('cable-fly')!;
    const unconstrained = buildProgramming(isolationExercise, null);
    const constrained = buildProgramming(isolationExercise, 'low');
    expect(unconstrained.intensityTechnique).not.toBeNull();
    expect(constrained.intensityTechnique).toBeNull();
  });

  it('never suggests an intensity technique for a heavy-compound exercise', () => {
    const programming = buildProgramming(exercise, null); // heavy-compound, exercise_type compound
    expect(programming.intensityTechnique).toBeNull();
  });

  it('suggests drop-set for a low/medium-fatigue isolation exercise', () => {
    const isolationExercise = getExerciseById('cable-fly')!;
    expect(isolationExercise.fatigue_cost === 'low' || isolationExercise.fatigue_cost === 'medium').toBe(true);
    const programming = buildProgramming(isolationExercise, null);
    expect(programming.intensityTechnique?.id).toBe('drop-set');
  });
});
