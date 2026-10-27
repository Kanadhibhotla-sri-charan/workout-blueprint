// Mirrors data/programming/*.yaml exactly — see
// docs/knowledge-manual/programming/README.md for what each file is and
// ADR 0003 for the taxonomy's schema rationale. The UI renders this data,
// it never hand-duplicates programming guidance (same rule §4 of the
// Phase 3 spec established for exercise knowledge).

import type { DevelopmentPackageCatalog } from './packages';

export interface PhysiqueTarget {
  id: string;
  name: string;
  parent_region: string;
  definition: string;
  physique_outcome: string;
  /** Volume parent (a volume group or another target) — change request 1.2. */
  parent?: string;
  volume_share?: number;
  min_share?: number;
}

/** A volume parent that is not itself a physique target (chest, calves). */
export interface VolumeGroup {
  id: string;
  name: string;
  parent_region: string;
  definition: string;
}

/** Weekly hard sets per target, in credited sets — change request 1.1. */
export interface VolumeTarget {
  /** A physique target or volume group id; absent on goal entries. */
  target_id?: string;
  /** A functional goal with its own volume entry (core-anti-extension) — change request 2.4. */
  goal_id?: string;
  weekly_sets?: { minimum: number; efficient: number; priority: number };
  per_session_max?: number;
  indirect_only?: boolean;
  rationale?: string;
  /** How many sessions to spread the weekly number over — change request 2.1. */
  sessions_per_week?: [number, number];
  /** Recovery before the same target is trained hard again. */
  min_hours_between?: number;
  /** Set on child targets instead of weekly_sets. */
  volume_from_parent?: string;
}

/** Change request 3.3: weekly minutes of drills for a mobility goal. */
export interface MobilityTarget {
  goal_id: string;
  weekly_minutes: number;
  sessions_per_week: [number, number];
}

/** Change request 3.1: separate records that are the same movement with different equipment. */
export interface ExerciseFamily {
  id: string;
  name: string;
  members: string[];
}

export interface GlobalPrinciples {
  rir: {
    full_range: [number, number];
    typical_working_range: [number, number];
    explanation: string;
    guidance: string;
  };
  weekly_volume: {
    starting_point_sets: [number, number];
    practical_range_sets: [number, number];
    higher_recovery_dependent_sets: [number, number];
    explanation: string;
  };
  frequency: {
    typical_starting_range_per_week: [number, number];
    explanation: string;
  };
  progression: {
    model: string;
    explanation: string;
    scope_note: string;
  };
  wording_rules: {
    prefer: string[];
    avoid: string[];
    note: string;
  };
}

export interface RepRangeOverride {
  exercise_id: string;
  primary_range: [number, number];
  acceptable_range: [number, number];
  reason: string;
}

export interface RepRanges {
  overrides: RepRangeOverride[];
}

// Programming Profile catalog (Phase 4B §10-11) — see
// data/programming/programming-profiles.yaml for the full rationale. A
// deterministic classification layer between "what exercise is this" and
// "what programming guidance applies," derived from existing exercise
// metadata rather than a hand-written prescription per exercise.
export interface ProgrammingProfile {
  id: string;
  name: string;
  summary: string;
  primary_range: [number, number];
  acceptable_range: [number, number];
  rep_range_reason: string;
  guidance_note: string;
  /**
   * Athletic-mode prescription (athletic expansion). Present only on the
   * training-mode profiles; hypertrophy profiles omit every field below
   * and keep their existing reps / RIR / weekly-sets guidance.
   */
  training_mode?: string;
  /** What primary_range / acceptable_range count: reps (default) or seconds. */
  unit?: 'reps' | 'seconds';
  sets?: [number, number];
  rest_seconds?: [number, number];
  effort?: string;
  frequency_per_week?: [number, number];
  /** When in the week or session this kind of work fits best (flexibility expansion). */
  best_timing?: string;
}

export interface ProgrammingProfileMatch {
  training_mode?: string;
  exercise_type?: string;
  coverage_categories_any?: string[];
  stability_demand_at_least?: 'low' | 'medium' | 'high';
}

export interface ProgrammingProfileClassificationRule {
  profile_id: string;
  match: ProgrammingProfileMatch;
}

export interface ProgrammingProfileCatalog {
  profiles: ProgrammingProfile[];
  classification: {
    defaults: ProgrammingProfileClassificationRule[];
  };
}

export interface IntensityTechnique {
  id: string;
  name: string;
  what: string;
  when_it_may_help: string;
  when_not_to_use: string;
  fatigue_time_implications: string;
  suitable_exercise_types: string[];
  suitable_when_fatigue_cost_at_most: 'low' | 'medium' | 'high';
  suitable_when_skill_demand_at_most: 'low' | 'medium' | 'high';
  suitable_when_stability_demand_at_most: 'low' | 'medium' | 'high';
}

/** Change request 2.3: the weekly-volume level a target gets when the outcome is a goal. */
export interface OutcomeVolumeLevel {
  target_id: string;
  level: 'priority' | 'efficient' | 'bias';
}

export interface AestheticOutcome {
  volume_levels?: OutcomeVolumeLevel[];
  id: string;
  display_name: string;
  region: string;
  viewpoint: string;
  visual_description: string;
  /** Drives exercise selection — the target(s) primarily responsible for this outcome. */
  primary_targets: string[];
  /**
   * Contributing targets that must not be silently discarded (Phase 4
   * Corrections §7-8): folded into the candidate pool and surfaced in the
   * UI, but never overriding the primary target's role in choosing the
   * actual recommendation. Absent/empty when an outcome has no additional
   * contributors.
   */
  supporting_targets?: string[];
  technical_explanation?: string;
  anatomical_targets?: string[];
  common_user_phrasings?: string[];
  /**
   * Exercise aesthetic_characteristics this outcome is especially well
   * served by (Phase 4C §3) — refines ranking within a target tier, never
   * overrides it. Absent/empty for most outcomes, whose physique_targets
   * already narrow the candidate pool enough on their own.
   */
  preferred_characteristics?: string[];
  /**
   * Aesthetic Exercise Role (Phase 4C Final Correction §4-6) — which
   * exercises are especially useful for THIS exact visual problem, keyed
   * by role, contextual to this outcome only (the same exercise can carry
   * a different role, or none, on a different outcome — never a global
   * exercise property). Absent for the great majority of outcomes by
   * design (§7/§24: only added where a real ranking distinction was
   * found); an exercise not listed under any role here is 'unspecified'
   * and falls back to the existing Phase 4C suitability/stimulus ranking.
   */
  exercise_roles?: {
    primary?: string[];
    direct?: string[];
    secondary?: string[];
    supporting?: string[];
  };
}

export interface FunctionalGoal {
  id: string;
  name: string;
  parent_region: string;
  definition: string;
  why_it_matters: string;
}

export interface ProgrammingData {
  /** Snapshot format version (data/id-registry.yaml) — release checks. */
  schemaVersion: number;
  physiqueTargets: PhysiqueTarget[];
  volumeGroups: VolumeGroup[];
  volumeTargets: VolumeTarget[];
  mobilityTargets: MobilityTarget[];
  exerciseFamilies: ExerciseFamily[];
  globalPrinciples: GlobalPrinciples;
  repRanges: RepRanges;
  programmingProfiles: ProgrammingProfileCatalog;
  intensityTechniques: IntensityTechnique[];
  aestheticOutcomes: AestheticOutcome[];
  functionalGoals: FunctionalGoal[];
  developmentPackages: DevelopmentPackageCatalog;
}
