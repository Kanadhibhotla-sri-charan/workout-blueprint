import type { Exercise } from '../types/exercise';
import generated from './exercises.generated.json';

// exercises.generated.json is produced by scripts/generate-data.mjs from
// the canonical YAML (see app/README.md "Data"). It does not exist until
// that script has run once — "npm run dev"/"npm run build" do this
// automatically via the predev/prebuild hooks.
export const exercises: Exercise[] = generated as Exercise[];

export function getExerciseById(id: string): Exercise | undefined {
  return exercises.find((exercise) => exercise.id === id);
}

export function getExercisesByBodyRegion(region: string): Exercise[] {
  return exercises.filter((exercise) => exercise.body_regions.includes(region));
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort();
}

export const bodyRegions: string[] = uniqueSorted(exercises.flatMap((e) => e.body_regions));

// Filter/search option lists, derived from the live dataset rather than a
// separately hand-maintained vocabulary — if the data changes, the filters
// available in the UI change with it automatically.
export const equipmentOptions: string[] = uniqueSorted(exercises.flatMap((e) => e.equipment));
export const coverageCategoryOptions: string[] = uniqueSorted(
  exercises.flatMap((e) => e.coverage_categories)
);
export const exerciseTypeOptions: string[] = uniqueSorted(exercises.map((e) => e.exercise_type));
export const lateralityOptions: string[] = uniqueSorted(exercises.map((e) => e.laterality));
