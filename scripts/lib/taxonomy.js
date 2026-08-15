// Controlled vocabularies for the canonical exercise-record schema.
// Source of truth for what values are "closed enum" vs "open" is
// docs/knowledge-manual/SCHEMA.md — keep this file and that document in
// sync; if a genuinely new value is needed, add it here and note why in
// SCHEMA.md, per Task F/G of docs/architecture/PHASE-2-SCHEMA-AND-DATA-GOVERNANCE.md.

const BODY_REGIONS = new Set([
  'arms', 'back', 'calves', 'chest', 'core', 'forearms',
  'hamstrings', 'hips', 'neck', 'quads', 'shoulders',
]);

const EXERCISE_TYPES = new Set(['compound', 'isolation']);

const LATERALITY = new Set(['bilateral', 'unilateral', 'alternating']);

const DEMAND_LEVELS = new Set(['low', 'medium', 'high']);

const COVERAGE_CATEGORIES = new Set([
  'isolation', 'low-setup', 'low-fatigue', 'heavy-compound', 'stable-compound',
  'lengthened-position-emphasis', 'skill-coordination', 'unilateral',
  'equipment-limited-substitute', 'shortened-position-emphasis',
]);

const REVIEW_STATUSES = new Set(['draft', 'needs-review', 'reviewed']);

// The first item of movement_patterns must be one of these fundamental
// patterns (Phase 1 taxonomy normalization). Subsequent items are
// free-form modifiers and are not validated against a closed list —
// see docs/dev/reports/MOVEMENT-TAXONOMY-CLASSIFICATION.md for why.
const FUNDAMENTAL_MOVEMENT_PATTERNS = new Set([
  'ankle dorsiflexion', 'ankle plantarflexion', 'unilateral ankle plantarflexion',
  'anti-extension isometric', 'anti-extension through range', 'anti-lateral flexion under load',
  'anti-rotation isometric', 'elbow extension', 'elbow extension within a vertical-to-horizontal press',
  'elbow flexion', 'forearm pronation and supination', 'hip abduction', 'hip adduction', 'hip extension',
  'hip flexion', 'hip hinge', 'horizontal press', 'horizontal pull', 'horizontal-to-vertical press',
  'incline horizontal press', 'knee extension', 'knee flexion', 'knee- and hip-dominant press',
  'loaded carry', 'neck extension', 'neck flexion', 'neck isometric', 'neck lateral flexion',
  'scapular elevation', 'scapular protraction within a horizontal press', 'shoulder abduction',
  'shoulder extension', 'shoulder extension through an overhead arc', 'shoulder external rotation',
  'shoulder horizontal abduction', 'shoulder horizontal adduction', 'shoulder horizontal adduction on a decline',
  'shoulder horizontal adduction on an incline', 'squat / knee-dominant', 'trunk extension', 'trunk flexion',
  'trunk rotation', 'unilateral hip-dominant', 'unilateral knee- and hip-dominant', 'unilateral knee-dominant',
  'vertical press', 'vertical pull', 'wrist extension', 'wrist flexion',
]);

// Canonical field set, and which are required vs optional, per SCHEMA.md.
// list-of-string fields that are REQUIRED (must be non-empty, or null per
// ADR 0002 is not allowed since they're required).
const REQUIRED_LIST_FIELDS = [
  'body_regions', 'primary_targets', 'movement_patterns', 'equipment',
  'coverage_categories', 'best_used_when', 'limitations',
];

// list-of-string fields that are OPTIONAL (may be [] or null per ADR 0002).
const OPTIONAL_LIST_FIELDS = [
  'secondary_targets', 'less_suitable_when', 'advantages', 'technique_cues',
  'common_mistakes', 'programming_notes', 'alternatives', 'complements',
  'overlaps_with', 'evidence_notes',
];

const REQUIRED_SCALAR_STRING_FIELDS = [
  'id', 'name', 'summary', 'why_this_exists', 'resistance_profile', 'mirror_effect',
];

const ALL_FIELDS = new Set([
  'id', 'name', 'summary', 'why_this_exists', 'body_regions', 'primary_targets',
  'secondary_targets', 'movement_patterns', 'equipment', 'exercise_type', 'laterality',
  'coverage_categories', 'resistance_profile', 'stability_demand', 'skill_demand',
  'setup_time', 'fatigue_cost', 'best_used_when', 'less_suitable_when', 'mirror_effect',
  'advantages', 'limitations', 'technique_cues', 'common_mistakes', 'programming_notes',
  'alternatives', 'complements', 'overlaps_with', 'evidence_notes', 'review_status',
]);

module.exports = {
  BODY_REGIONS,
  EXERCISE_TYPES,
  LATERALITY,
  DEMAND_LEVELS,
  COVERAGE_CATEGORIES,
  REVIEW_STATUSES,
  FUNDAMENTAL_MOVEMENT_PATTERNS,
  REQUIRED_LIST_FIELDS,
  OPTIONAL_LIST_FIELDS,
  REQUIRED_SCALAR_STRING_FIELDS,
  ALL_FIELDS,
};
