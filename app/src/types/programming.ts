// Mirrors data/programming/*.yaml exactly — see
// docs/knowledge-manual/programming/README.md for what each file is and
// ADR 0003 for the taxonomy's schema rationale. The UI renders this data,
// it never hand-duplicates programming guidance (same rule §4 of the
// Phase 3 spec established for exercise knowledge).

export interface PhysiqueTarget {
  id: string;
  name: string;
  parent_region: string;
  definition: string;
  physique_outcome: string;
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

export interface RepRangeMatch {
  exercise_type?: string;
  coverage_categories_any?: string[];
}

export interface RepRangeRule {
  id: string;
  match: RepRangeMatch;
  primary_range: [number, number];
  acceptable_range: [number, number];
  reason: string;
}

export interface RepRangeOverride {
  exercise_id: string;
  primary_range: [number, number];
  acceptable_range: [number, number];
  reason: string;
}

export interface RepRanges {
  defaults: RepRangeRule[];
  overrides: RepRangeOverride[];
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
}

export interface AestheticOutcome {
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
}

export interface ProgrammingData {
  physiqueTargets: PhysiqueTarget[];
  globalPrinciples: GlobalPrinciples;
  repRanges: RepRanges;
  intensityTechniques: IntensityTechnique[];
  aestheticOutcomes: AestheticOutcome[];
}
