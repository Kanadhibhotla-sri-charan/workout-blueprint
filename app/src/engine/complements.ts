import type { Exercise } from '../types/exercise';
import { parseRelationshipEntry } from '../utils/relationships';
import { isEquipmentFeasible } from './equipment';

// Resolves a record's own `complements` entries to real Exercise objects,
// reusing the same id-shape parser the Exercise Detail page uses (3D).
// Only ~2/124 complements entries dataset-wide are bare-id-shaped — the
// field is prose by design (see SCHEMA.md) — so this alone is not enough
// to power the Decision Maker for most records; see
// rankStructuralComplements below for the fallback, and
// docs/dev/reports/DECISION-ENGINE-RULES.md §3 for why it exists.
export function resolveDeclaredComplements(target: Exercise, allExercises: Exercise[]): Exercise[] {
  const entries = target.complements ?? [];
  const resolved: Exercise[] = [];
  for (const entry of entries) {
    const ref = parseRelationshipEntry(entry);
    if (!ref) continue;
    const match = allExercises.find((exercise) => exercise.id === ref.id);
    if (match) resolved.push(match);
  }
  return resolved;
}

function countShared(a: string[], b: string[]): number {
  const bSet = new Set(b);
  return a.filter((value) => bSet.has(value)).length;
}

// Rule defined in docs/dev/reports/DECISION-ENGINE-RULES.md §3 before this
// function was written. Deterministic two-stage match, same discipline as
// rankStructuralAlternatives in alternatives.ts: a strict eligibility
// filter, then a fixed-priority tiebreak — never a blended score.
export function rankStructuralComplements(
  target: Exercise,
  candidates: Exercise[],
  equipmentAvailable: string[] | null = null
): Exercise[] {
  const eligible = candidates.filter((candidate) => {
    if (candidate.id === target.id) return false;
    if (!candidate.body_regions.some((region) => target.body_regions.includes(region))) {
      return false;
    }
    // The defining difference from an "alternative": a complement must be a
    // materially different movement, not a same-pattern substitute.
    if (candidate.movement_patterns[0] === target.movement_patterns[0]) return false;
    if (candidate.review_status === 'draft') return false;
    if (!isEquipmentFeasible(candidate, equipmentAvailable)) return false;
    return true;
  });

  return [...eligible].sort((a, b) => {
    const targetShare =
      countShared(b.primary_targets, target.primary_targets) -
      countShared(a.primary_targets, target.primary_targets);
    if (targetShare !== 0) return targetShare;

    // Ascending, not descending: fewer shared coverage_categories means a
    // more different stimulus, which is the point of a complement (the
    // opposite of the alternatives ranking, which prefers similarity).
    const coverageShare =
      countShared(a.coverage_categories, target.coverage_categories) -
      countShared(b.coverage_categories, target.coverage_categories);
    if (coverageShare !== 0) return coverageShare;

    return a.id.localeCompare(b.id);
  });
}

// Prefers the record's own resolvable `complements` entries; falls back to
// the structural match when there are none (the common case). Same
// explicit-data-first precedence as resolveAlternative in alternatives.ts.
export function resolveComplements(
  target: Exercise,
  allExercises: Exercise[],
  equipmentAvailable: string[] | null = null
): Exercise[] {
  const declared = resolveDeclaredComplements(target, allExercises).filter((exercise) =>
    isEquipmentFeasible(exercise, equipmentAvailable)
  );
  if (declared.length > 0) return declared;
  return rankStructuralComplements(target, allExercises, equipmentAvailable);
}
