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

export const bodyRegions: string[] = [...new Set(exercises.flatMap((e) => e.body_regions))].sort();
