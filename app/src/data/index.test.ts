import { describe, expect, it } from 'vitest';
import { bodyRegions, exercises, getExerciseById, getExercisesByBodyRegion } from './index';

// "Data integration" tests per PHASE-3-MVP.md §24: all canonical exercises
// load, no duplicate IDs, expected body regions appear. Mirrors what
// `npm run validate-data` already checks at the repo root, but asserted
// here too since this is what proves the app's own data pipeline
// (scripts/generate-data.mjs -> exercises.generated.json -> this loader)
// actually wires up correctly, not just that the source YAML is valid.
describe('data loader', () => {
  it('loads all 123 canonical exercises', () => {
    expect(exercises.length).toBe(123);
  });

  it('has no duplicate ids', () => {
    const ids = exercises.map((exercise) => exercise.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('exposes all 11 expected body regions', () => {
    expect(bodyRegions).toEqual(
      ['arms', 'back', 'calves', 'chest', 'core', 'forearms', 'hamstrings', 'hips', 'neck', 'quads', 'shoulders']
    );
  });

  it('getExerciseById resolves a known id and returns undefined for an unknown one', () => {
    expect(getExerciseById('incline-dumbbell-press')?.name).toBe('Incline Dumbbell Press');
    expect(getExerciseById('not-a-real-id')).toBeUndefined();
  });

  it('getExercisesByBodyRegion returns only exercises tagged with that region', () => {
    const chestExercises = getExercisesByBodyRegion('chest');
    expect(chestExercises.length).toBeGreaterThan(0);
    for (const exercise of chestExercises) {
      expect(exercise.body_regions).toContain('chest');
    }
  });
});
