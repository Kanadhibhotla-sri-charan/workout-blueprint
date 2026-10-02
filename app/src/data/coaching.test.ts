import { describe, expect, it } from 'vitest';
import { exercises, programming } from './index';

// Phase 7 Stage 2: Build packages tell a lifter exactly which exercises to
// do, so every exercise a package uses must ship with real coaching — not
// just pass the validator's per-record `reviewed` gate, which a package
// could otherwise sidestep by referencing a needs-review exercise.
describe('coaching coverage for Build-package exercises', () => {
  const packageExerciseIds = [
    ...new Set(programming.developmentPackages.packages.flatMap((p) => p.exercises.map((e) => e.exercise_id))),
  ];
  const byId = new Map(exercises.map((e) => [e.id, e]));

  it.each(packageExerciseIds)('%s has technique cues and common mistakes', (id) => {
    const exercise = byId.get(id)!;
    expect(exercise.review_status).toBe('reviewed');
    expect(exercise.technique_cues?.length ?? 0).toBeGreaterThanOrEqual(3);
    expect(exercise.common_mistakes?.length ?? 0).toBeGreaterThanOrEqual(2);
  });
});
