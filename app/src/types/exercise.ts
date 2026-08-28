// Mirrors the canonical exercise-record schema plus generator/runtime fields
// used by the application. Source of truth: ../../../docs/knowledge-manual/SCHEMA.md
// and ../../../scripts/lib/taxonomy.js.

export type ExerciseType = 'compound' | 'isolation';
export type Laterality = 'bilateral' | 'unilateral' | 'alternating';
export type DemandLevel = 'low' | 'medium' | 'high';
export type ReviewStatus = 'draft' | 'needs-review' | 'reviewed';
export type VideoStatus = 'verified' | 'needs-review' | 'broken';

export interface Exercise {
  id: string;
  name: string;
  summary: string;
  why_this_exists: string;
  body_regions: string[];
  primary_targets: string[];
  secondary_targets: string[] | null;
  /** Canonical target ids resolving against data/programming/physique-targets.yaml — see ADR 0003. */
  physique_targets: string[] | null;
  /** Canonical goal ids resolving against data/programming/functional-goals.yaml — the Function branch's counterpart to physique_targets. */
  functional_goals: string[] | null;
  /**
   * Small, closed vocabulary of movement-mechanics traits (Phase 4C §2) —
   * distinguishes "trains the target" (physique_targets) from "especially
   * suited to a specific aesthetic outcome." See SCHEMA.md.
   */
  aesthetic_characteristics: string[] | null;
  movement_patterns: string[];
  equipment: string[];
  exercise_type: ExerciseType;
  laterality: Laterality;
  coverage_categories: string[];
  resistance_profile: string;
  stability_demand: DemandLevel;
  skill_demand: DemandLevel;
  setup_time: DemandLevel;
  fatigue_cost: DemandLevel;
  best_used_when: string[];
  less_suitable_when: string[] | null;
  mirror_effect: string;
  advantages: string[] | null;
  limitations: string[];
  technique_cues: string[] | null;
  common_mistakes: string[] | null;
  programming_notes: string[] | null;
  alternatives: string[] | null;
  complements: string[] | null;
  overlaps_with: string[] | null;
  evidence_notes: string[] | null;
  review_status: ReviewStatus;
  /** Canonical YouTube execution tutorial reference. */
  video_link?: string | null;
  video_creator?: string | null;
  video_title?: string | null;
  video_status?: VideoStatus | null;
  /** Source file basename, e.g. "chest.yaml" — added by the generator, not part of the canonical schema. */
  _file: string;
}
