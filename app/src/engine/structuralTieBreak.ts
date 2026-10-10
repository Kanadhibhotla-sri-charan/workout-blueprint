import type { Exercise } from '../types/exercise';
import { exercisesOverlap } from '../utils/relationships';
import { ALWAYS_AVAILABLE, equipmentSetups, usableSetups } from './equipment';
import { selectionRoleRank } from './selectionRole';

// Shared tie-break for the structural rankers (replace / different stimulus /
// complement), applied only after their own target and coverage keys tie.
// Approved in docs/dev/reports/NEXT-QUALITY-GATE-ASSESSMENT.md §4-5 and
// recorded in DECISION-ENGINE-RULES.md §2-3. Order:
//   1. unclassified before `selection_role: secondary`;
//   2. curated overlap (`overlaps_with`, symmetric): preferred for a
//      substitute, avoided for a complement;
//   3. equipment continuity with the current exercise (higher first);
//   4. alphabetical id.

// Items that never count as continuity: bodyweight is always available, and
// benches are support furniture shared by unrelated exercises. An engine
// constant, not an equipment-vocabulary change.
export const NON_CONTINUITY_ITEMS: ReadonlySet<string> = new Set([ALWAYS_AVAILABLE, 'bench', 'incline bench']);

// The most items (outside NON_CONTINUITY_ITEMS) shared between a candidate
// setup the user can complete here and any setup of the current exercise.
// The current exercise's setups all count, usable or not: users often
// replace an exercise precisely because they can't do it here, and the
// intersection with a usable candidate setup only ever counts available
// items. Unrestricted equipment (null) makes every candidate setup usable.
export function equipmentContinuity(
  current: Exercise,
  candidate: Exercise,
  equipmentAvailable: string[] | null
): number {
  const candidateSetups = usableSetups(candidate, equipmentAvailable);
  // Both structural rankers drop infeasible candidates before ranking, so
  // this is unreachable; scoring it would hide a broken filter.
  if (candidateSetups.length === 0) {
    throw new Error(`equipmentContinuity: ${candidate.id} has no usable setup and should have been filtered out`);
  }
  let best = 0;
  for (const setup of candidateSetups) {
    for (const currentSetup of equipmentSetups(current)) {
      const shared = setup.filter((item) => currentSetup.includes(item) && !NON_CONTINUITY_ITEMS.has(item)).length;
      if (shared > best) best = shared;
    }
  }
  return best;
}

export type StructuralMode = 'substitute' | 'complement';

export function compareStructuralTie(
  current: Exercise,
  a: Exercise,
  b: Exercise,
  mode: StructuralMode,
  equipmentAvailable: string[] | null
): number {
  const roleDiff = selectionRoleRank(a) - selectionRoleRank(b);
  if (roleDiff !== 0) return roleDiff;

  const aOverlaps = exercisesOverlap(current, a) ? 1 : 0;
  const bOverlaps = exercisesOverlap(current, b) ? 1 : 0;
  const overlapDiff = mode === 'substitute' ? bOverlaps - aOverlaps : aOverlaps - bOverlaps;
  if (overlapDiff !== 0) return overlapDiff;

  const continuityDiff =
    equipmentContinuity(current, b, equipmentAvailable) - equipmentContinuity(current, a, equipmentAvailable);
  if (continuityDiff !== 0) return continuityDiff;

  return a.id.localeCompare(b.id);
}
