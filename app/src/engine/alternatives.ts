import type { Exercise } from '../types/exercise';
import { isEquipmentFeasible } from './equipment';

function countShared(a: string[], b: string[]): number {
  const bSet = new Set(b);
  return a.filter((value) => bSet.has(value)).length;
}

// Rule defined in docs/dev/reports/DECISION-ENGINE-RULES.md §2 before this
// file was written. Deterministic two-stage match: a strict eligibility
// filter (Stage 1), then a fixed-priority tiebreak among eligible
// candidates (Stage 2) — never a blended similarity score. Used when a
// record's own `alternatives` field is empty, which per the architect's
// Phase 2 Open Decisions memo is every record in the current dataset by
// design (see PHASE-2-OPEN-DECISIONS.md §1) — the field is a retirement
// candidate, not a content gap the engine should wait on.
//
// Returns every eligible candidate in ranked order (best match first), not
// just the winner, so callers that need a second pick (e.g. the "Watch
// Out"/alternative slot) don't have to re-run Stage 1.
export function rankStructuralAlternatives(
  target: Exercise,
  candidates: Exercise[],
  equipmentAvailable: string[] | null = null
): Exercise[] {
  const eligible = candidates.filter((candidate) => {
    if (candidate.id === target.id) return false;
    if (candidate.movement_patterns[0] !== target.movement_patterns[0]) return false;
    if (candidate.exercise_type !== target.exercise_type) return false;
    if (!candidate.body_regions.some((region) => target.body_regions.includes(region))) {
      return false;
    }
    if (candidate.review_status === 'draft') return false;
    if (!isEquipmentFeasible(candidate, equipmentAvailable)) return false;
    return true;
  });

  return [...eligible].sort((a, b) => {
    const targetShare =
      countShared(b.primary_targets, target.primary_targets) -
      countShared(a.primary_targets, target.primary_targets);
    if (targetShare !== 0) return targetShare;

    const coverageShare =
      countShared(b.coverage_categories, target.coverage_categories) -
      countShared(a.coverage_categories, target.coverage_categories);
    if (coverageShare !== 0) return coverageShare;

    return a.id.localeCompare(b.id);
  });
}

export function findStructuralAlternative(
  target: Exercise,
  candidates: Exercise[],
  equipmentAvailable: string[] | null = null
): Exercise | null {
  return rankStructuralAlternatives(target, candidates, equipmentAvailable)[0] ?? null;
}

// Prefers the record's own `alternatives` field when populated (a future
// content pass may add real entries) and falls back to the structural
// match otherwise — same explicit-data-first, structural-fallback
// precedence this project already uses for other optional fields.
export function resolveAlternative(
  target: Exercise,
  allExercises: Exercise[],
  equipmentAvailable: string[] | null = null
): Exercise | null {
  if (target.alternatives && target.alternatives.length > 0) {
    const declaredId = target.alternatives[0];
    const declared = allExercises.find((exercise) => exercise.id === declaredId);
    if (declared) return declared;
  }
  return findStructuralAlternative(target, allExercises, equipmentAvailable);
}
