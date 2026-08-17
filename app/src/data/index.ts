import type { Exercise } from '../types/exercise';
import type { AestheticOutcome, FunctionalGoal, PhysiqueTarget, ProgrammingData } from '../types/programming';
import generated from './exercises.generated.json';
import generatedProgramming from './programming.generated.json';

// exercises.generated.json / programming.generated.json are produced by
// scripts/generate-data.mjs from the canonical YAML (see app/README.md
// "Data"). Neither exists until that script has run once — "npm run dev"/
// "npm run build" do this automatically via the predev/prebuild hooks.
export const exercises: Exercise[] = generated as Exercise[];
// JSON's array literals infer as e.g. number[] rather than the tuple types
// [number, number] the ranges in ProgrammingData use, so a direct cast
// isn't structurally valid — routing through `unknown` is the standard,
// deliberate way to assert "this generated JSON matches the hand-written
// type," same reasoning as any build-time-generated-data cast.
export const programming: ProgrammingData = generatedProgramming as unknown as ProgrammingData;

export function getExerciseById(id: string): Exercise | undefined {
  return exercises.find((exercise) => exercise.id === id);
}

export function getExercisesByBodyRegion(region: string): Exercise[] {
  return exercises.filter((exercise) => exercise.body_regions.includes(region));
}

export function getPhysiqueTargetById(id: string): PhysiqueTarget | undefined {
  return programming.physiqueTargets.find((target) => target.id === id);
}

export function getExercisesByPhysiqueTarget(targetId: string): Exercise[] {
  return exercises.filter((exercise) => exercise.physique_targets?.includes(targetId));
}

export const physiqueTargets: PhysiqueTarget[] = programming.physiqueTargets;

export const aestheticOutcomes: AestheticOutcome[] = programming.aestheticOutcomes;

export function getAestheticOutcomeById(id: string): AestheticOutcome | undefined {
  return aestheticOutcomes.find((outcome) => outcome.id === id);
}

export function getAestheticOutcomesByRegion(region: string): AestheticOutcome[] {
  return aestheticOutcomes.filter((outcome) => outcome.region === region);
}

export const functionalGoals: FunctionalGoal[] = programming.functionalGoals;

export function getFunctionalGoalById(id: string): FunctionalGoal | undefined {
  return functionalGoals.find((goal) => goal.id === id);
}

export function getFunctionalGoalsByRegion(region: string): FunctionalGoal[] {
  return functionalGoals.filter((goal) => goal.parent_region === region);
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
