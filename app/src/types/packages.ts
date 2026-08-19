// Mirrors data/programming/development-packages.yaml (Phase 5 §5) — see
// docs/knowledge-manual/programming/README.md. A development package is a
// curated combination of existing exercises (referenced by id, never
// hand-duplicated) that together answer "if I want this whole muscle
// group developed well, what should I actually do?" — the complement to
// the Decision Maker's single-problem diagnosis.

export type PackageLevel = 'efficient' | 'complete';

// Same four-value vocabulary as AestheticOutcome.exercise_roles (Phase 4C
// Final Correction) — reused deliberately per §21's "reuse existing
// knowledge" rule, but scoped to this package rather than a diagnostic
// outcome: it describes what this exercise contributes to THIS package,
// not a global exercise property.
export type PackageRole = 'primary' | 'direct' | 'secondary' | 'supporting';

// A package-level grouping over the existing, real physique-target
// taxonomy (data/programming/physique-targets.yaml) — not a new anatomy
// taxonomy. Most map 1:1 to an existing body_region; biceps/triceps/
// glutes split out of the coarser body_regions("arms"/"hips") because the
// underlying physique_targets already distinguish them.
export interface MuscleGroupDefinition {
  id: string;
  name: string;
  target_ids: string[];
}

export interface PackageExerciseEntry {
  exercise_id: string;
  order: number;
  sets: number;
  /** Rep range as authored text (e.g. "6-12") — drawn from the exercise's own resolved Programming Profile, see PHASE-5 dev log. */
  reps: string;
  rir: string;
  role: PackageRole;
  /** Short explanation of what this exercise visually contributes — part of the product, not incidental copy (spec §6/§10). */
  contribution: string;
}

export interface DevelopmentPackage {
  id: string;
  muscle_group: string;
  level: PackageLevel;
  display_name: string;
  objective: string;
  exercises: PackageExerciseEntry[];
  frequency: {
    sessions_per_week: number;
  };
  /** Explains why the exercises coexist rather than duplicate each other (spec §10) — required, part of the product. */
  rationale: string;
}

export interface DevelopmentPackageCatalog {
  muscle_groups: MuscleGroupDefinition[];
  packages: DevelopmentPackage[];
}
