import { describe, expect, it } from 'vitest';
import { buildProgramming, resolveProgrammingProfile, resolveRepRange } from './programmingEngine';
import { exercises, getExerciseById } from '../data';

describe('resolveProgrammingProfile — Phase 4B §10-11', () => {
  it('a heavy-compound exercise classifies as heavy-free-weight-compound regardless of exercise_type', () => {
    const exercise = getExerciseById('incline-dumbbell-press')!; // heavy-compound
    expect(resolveProgrammingProfile(exercise).id).toBe('heavy-free-weight-compound');
  });

  it('a stable-compound exercise classifies as stable-compound', () => {
    const exercise = getExerciseById('incline-machine-press')!; // stable-compound
    expect(resolveProgrammingProfile(exercise).id).toBe('stable-compound');
  });

  it('an isolation exercise with elevated stability demand classifies as elevated-stability-isolation, not the generic isolation bucket', () => {
    const exercise = getExerciseById('cable-fly')!; // isolation, stability_demand: medium
    expect(exercise.stability_demand).toBe('medium');
    expect(resolveProgrammingProfile(exercise).id).toBe('elevated-stability-isolation');
  });

  it('a lengthened-position-emphasis isolation exercise classifies distinctly from a plain isolation exercise', () => {
    const lengthened = getExerciseById('incline-dumbbell-curl')!; // isolation, lengthened-position-emphasis, stability: low
    const plain = getExerciseById('cable-hammer-curl-rope')!; // isolation, no distinguishing tag, stability: low
    expect(resolveProgrammingProfile(lengthened).id).toBe('lengthened-position-isolation');
    expect(resolveProgrammingProfile(plain).id).toBe('moderate-hypertrophy-isolation');
  });
});

describe('resolveRepRange', () => {
  it('heavy-compound exercises get the lower rep-range bucket', () => {
    const exercise = getExerciseById('incline-dumbbell-press')!; // heavy-compound
    const result = resolveRepRange(exercise, resolveProgrammingProfile(exercise));
    expect(result.primaryRange).toEqual([6, 12]);
  });

  it('a plain isolation exercise gets the wider rep-range bucket', () => {
    const exercise = getExerciseById('cable-hammer-curl-rope')!; // moderate-hypertrophy-isolation
    const result = resolveRepRange(exercise, resolveProgrammingProfile(exercise));
    expect(result.primaryRange).toEqual([10, 20]);
  });

  it('stable-compound exercises get the moderate rep-range bucket', () => {
    const exercise = getExerciseById('incline-machine-press')!; // stable-compound
    const result = resolveRepRange(exercise, resolveProgrammingProfile(exercise));
    expect(result.primaryRange).toEqual([8, 15]);
  });

  it('every result includes a non-empty reason', () => {
    for (const id of ['incline-dumbbell-press', 'cable-fly', 'incline-machine-press']) {
      const exercise = getExerciseById(id)!;
      const result = resolveRepRange(exercise, resolveProgrammingProfile(exercise));
      expect(result.reason.length).toBeGreaterThan(0);
    }
  });
});

// Phase 4B §25 Test C: exercises of materially different characteristics
// must not blindly receive identical programming guidance.
describe('buildProgramming — Programming Profile differentiation (Phase 4B §25 Test C)', () => {
  it('a heavy-compound and a plain isolation exercise get different rep ranges and different profile guidance notes', () => {
    const compound = buildProgramming(getExerciseById('incline-dumbbell-press')!, null);
    const isolation = buildProgramming(getExerciseById('cable-hammer-curl-rope')!, null);
    expect(compound.repRange.primaryRange).not.toEqual(isolation.repRange.primaryRange);
    expect(compound.profile.id).not.toBe(isolation.profile.id);
    expect(compound.profile.guidance_note).not.toBe(isolation.profile.guidance_note);
  });

  it('two isolation exercises with materially different characteristics (stability demand) get different profiles', () => {
    const stableIsolation = buildProgramming(getExerciseById('cable-hammer-curl-rope')!, null); // stability: low
    const elevatedStabilityIsolation = buildProgramming(getExerciseById('cable-fly')!, null); // stability: medium
    expect(stableIsolation.profile.id).not.toBe(elevatedStabilityIsolation.profile.id);
    expect(stableIsolation.repRange.primaryRange).not.toEqual(elevatedStabilityIsolation.repRange.primaryRange);
  });

  it('every exercise in the dataset resolves to a real, non-fallback profile', () => {
    // Guards against a future exercise record silently falling through to
    // the generic fallback profile because the classification ruleset
    // doesn't cover it — the current ruleset's compound/isolation
    // fallback rules should catch every record.
    for (const exercise of exercises) {
      expect(resolveProgrammingProfile(exercise).id).not.toBe('general-fallback');
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

// Phase 4B §16-20/§25 Test D: deterministic technique eligibility and
// ranking, replacing the old "always drop-set for isolation" rule.
describe('intensity-technique eligibility and ranking (Phase 4B §25 Test D)', () => {
  it('different eligible exercises receive different technique recommendations', () => {
    // low/low/low across fatigue, skill, and stability — the tightest
    // possible fit for myo-reps' own low/low/low thresholds, so it wins
    // over drop-set/rest-pause's looser (but also eligible) thresholds.
    const cableHammerCurl = getExerciseById('cable-hammer-curl-rope')!;
    expect([cableHammerCurl.fatigue_cost, cableHammerCurl.skill_demand, cableHammerCurl.stability_demand]).toEqual([
      'low',
      'low',
      'low',
    ]);
    expect(buildProgramming(cableHammerCurl, null).intensityTechnique?.id).toBe('myo-reps');

    // medium skill demand rules out myo-reps (its skill ceiling is low),
    // leaving drop-set/rest-pause tied on slack — catalog order picks
    // drop-set.
    const dragCurl = getExerciseById('drag-curl')!;
    expect(dragCurl.skill_demand).toBe('medium');
    expect(buildProgramming(dragCurl, null).intensityTechnique?.id).toBe('drop-set');
  });

  it('no technique can be a valid recommendation for a heavy, high-skill, high-stability compound movement', () => {
    const deadlift = getExerciseById('conventional-deadlift')!;
    expect([deadlift.fatigue_cost, deadlift.skill_demand, deadlift.stability_demand]).toEqual([
      'high',
      'high',
      'high',
    ]);
    const result = buildProgramming(deadlift, null);
    expect(result.intensityTechnique).toBeNull();
    expect(result.intensityTechniqueContext.length).toBeGreaterThan(0);
    expect(result.intensityTechniqueContext).not.toMatch(/keep fatigue low/i);
  });

  it('a moderate-fatigue, moderate-stability compound can still be eligible for rest-pause even though drop-set and myo-reps are not', () => {
    // Compound exercise_type rules out drop-set/myo-reps (isolation-only)
    // regardless of its demand levels; rest-pause allows compound, and
    // this exercise's medium fatigue/skill and low stability all sit
    // within rest-pause's medium/medium/medium thresholds.
    const smithRdl = getExerciseById('smith-machine-romanian-deadlift')!;
    expect(smithRdl.exercise_type).toBe('compound');
    const result = buildProgramming(smithRdl, null);
    expect(result.intensityTechnique?.id).toBe('rest-pause');
  });

  it('Drop Set is not the universal answer — myo-reps, rest-pause, and none are all reachable outcomes', () => {
    const outcomes = new Set(
      [
        getExerciseById('cable-hammer-curl-rope')!,
        getExerciseById('smith-machine-romanian-deadlift')!,
        getExerciseById('conventional-deadlift')!,
      ].map((exercise) => buildProgramming(exercise, null).intensityTechnique?.id ?? 'none')
    );
    expect(outcomes).toEqual(new Set(['myo-reps', 'rest-pause', 'none']));
  });

  it('the technique explanation is exercise-specific, not identical boilerplate across different exercises', () => {
    const a = buildProgramming(getExerciseById('cable-hammer-curl-rope')!, null).intensityTechniqueContext;
    const b = buildProgramming(getExerciseById('drag-curl')!, null).intensityTechniqueContext;
    expect(a).not.toBe(b);
    expect(a.length).toBeGreaterThan(0);
    expect(b.length).toBeGreaterThan(0);
  });
});
