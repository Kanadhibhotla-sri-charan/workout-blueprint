// Phase 5 §5-8: resolves a development package (data/programming/
// development-packages.yaml) into everything the UI needs to render it —
// joining package data with the real Exercise records it references and
// reusing the existing programming engine for intensity-technique
// eligibility, rather than re-deriving or hand-duplicating any of it (see
// PHASE-5-ALL-ROUND-DEVELOPMENT.md §21).

import type { Exercise } from '../types/exercise';
import type { DevelopmentPackage, MuscleGroupDefinition, PackageExerciseEntry } from '../types/packages';
import type { IntensityTechnique } from '../types/programming';
import { getExerciseById, programming } from '../data';
import { buildProgramming } from './programmingEngine';

export interface ResolvedPackageExercise {
  entry: PackageExerciseEntry;
  exercise: Exercise;
  intensityTechnique: IntensityTechnique | null;
  /** Contextual explanation of the technique decision (or its absence) — see programmingEngine.ts buildProgramming. */
  intensityTechniqueContext: string;
}

// Whether the package actually trains a given target in this muscle
// group (§4/§13: "the exact numbers must come from the package data") —
// derived directly from the resolved exercises' own physique_targets,
// never an invented coverage percentage.
export interface TargetCoverage {
  targetId: string;
  targetName: string;
  covered: boolean;
}

export interface ResolvedPackage {
  pkg: DevelopmentPackage;
  muscleGroup: MuscleGroupDefinition;
  exercises: ResolvedPackageExercise[];
  /** Sum of each exercise's own `sets` for one session (spec §7's "Session: 3+3+2=8 direct sets"). */
  sessionDirectSets: number;
  /** sessionDirectSets × frequency.sessions_per_week (spec §7's "Weekly: 16 direct sets") — never separately authored. */
  weeklyDirectSets: number;
  targetCoverage: TargetCoverage[];
  rirTypicalRange: [number, number];
  progressionExplanation: string;
  /**
   * Final spec §7: a package whose weekly volume exceeds the app's own
   * global "practical" range sits in the higher-recovery-dependent band
   * global-principles.yaml itself already defines — computed here, never
   * authored per package, so the label can't drift from the numbers it
   * describes.
   */
  isHighVolume: boolean;
  /** The global practical-volume range, exposed for the volume visualization's reference band (spec §27) — reuses global-principles.yaml, never a per-package invented range. */
  weeklyVolumeTargetRange: [number, number];
}

export function getMuscleGroups(): MuscleGroupDefinition[] {
  return programming.developmentPackages.muscle_groups;
}

export function getMuscleGroupById(muscleGroupId: string): MuscleGroupDefinition | null {
  return programming.developmentPackages.muscle_groups.find((g) => g.id === muscleGroupId) ?? null;
}

export function getPackagesForMuscleGroup(muscleGroupId: string): DevelopmentPackage[] {
  return programming.developmentPackages.packages.filter((p) => p.muscle_group === muscleGroupId);
}

// Resolves a package by id. Returns null for an unknown id — every real
// caller drives selection off getMuscleGroups()/getPackagesForMuscleGroup()
// so this only happens on a bad/stale route param, not a data-integrity
// gap (validate-data.js already guarantees every exercise_id referenced by
// a package resolves to a real Exercise, so that lookup below is never
// null in practice).
export function resolvePackage(packageId: string): ResolvedPackage | null {
  const pkg = programming.developmentPackages.packages.find((p) => p.id === packageId);
  if (!pkg) return null;
  const muscleGroup = getMuscleGroupById(pkg.muscle_group);
  if (!muscleGroup) return null;

  const sortedEntries = [...pkg.exercises].sort((a, b) => a.order - b.order);
  const exercises: ResolvedPackageExercise[] = sortedEntries.map((entry) => {
    const exercise = getExerciseById(entry.exercise_id) as Exercise;
    const built = buildProgramming(exercise, null);
    return {
      entry,
      exercise,
      intensityTechnique: built.intensityTechnique,
      intensityTechniqueContext: built.intensityTechniqueContext,
    };
  });

  const sessionDirectSets = sortedEntries.reduce((sum, entry) => sum + entry.sets, 0);
  const weeklyDirectSets = sessionDirectSets * pkg.frequency.sessions_per_week;

  const targetCoverage: TargetCoverage[] = muscleGroup.target_ids.map((targetId) => {
    const target = programming.physiqueTargets.find((t) => t.id === targetId);
    const covered = exercises.some((resolved) => (resolved.exercise.physique_targets || []).includes(targetId));
    return { targetId, targetName: target ? target.name : targetId, covered };
  });

  const weeklyVolumeTargetRange = programming.globalPrinciples.weekly_volume.practical_range_sets;

  return {
    pkg,
    muscleGroup,
    exercises,
    sessionDirectSets,
    weeklyDirectSets,
    targetCoverage,
    rirTypicalRange: programming.globalPrinciples.rir.typical_working_range,
    progressionExplanation: programming.globalPrinciples.progression.explanation,
    isHighVolume: weeklyDirectSets > weeklyVolumeTargetRange[1],
    weeklyVolumeTargetRange,
  };
}

export interface PackageComparison {
  /** Exercises present in the Complete package but not the Efficient one. */
  addedExercises: { id: string; name: string }[];
  /** Targets the added exercises cover that the Efficient package's own exercises don't already cover. */
  addedTargetNames: string[];
}

// Final spec §6/§16-17: "what do I gain by choosing Complete?" answered
// from the actual resolved package data — never a hand-written claim per
// muscle group. addedTargetNames only counts a target as newly covered
// when Efficient itself doesn't already cover it, so Complete never gets
// credit for coverage Efficient already provides.
export function comparePackageLevels(efficient: ResolvedPackage, complete: ResolvedPackage): PackageComparison {
  const efficientExerciseIds = new Set(efficient.exercises.map((e) => e.exercise.id));
  const addedExercises = complete.exercises
    .filter((e) => !efficientExerciseIds.has(e.exercise.id))
    .map((e) => ({ id: e.exercise.id, name: e.exercise.name }));

  const efficientCoveredTargetIds = new Set(
    efficient.targetCoverage.filter((t) => t.covered).map((t) => t.targetId)
  );
  const addedTargetNames = complete.targetCoverage
    .filter((t) => t.covered && !efficientCoveredTargetIds.has(t.targetId))
    .map((t) => t.targetName);

  return { addedExercises, addedTargetNames };
}

// Final spec §25: a per-exercise, gym-usable progression note — a
// parametrized restatement of the app's own existing double-progression
// model (global-principles.yaml progression.explanation) using this
// specific exercise's own resolved rep range, not a new progression
// philosophy.
export function buildExerciseProgressionNote(reps: string): string {
  const match = reps.match(/^(\d+)-(\d+)$/);
  if (!match) return programming.globalPrinciples.progression.explanation;
  const [, lowText, highText] = match;
  const low = Number(lowText);
  const high = Number(highText);
  return (
    `Stay within ${low}–${high} reps at your target RIR. When every set reaches ${high} reps with clean ` +
    `technique, increase the load slightly and expect the rep count to drop back toward ${low} — then repeat.`
  );
}
