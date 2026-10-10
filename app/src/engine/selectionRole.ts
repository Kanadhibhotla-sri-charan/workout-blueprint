import type { Exercise } from '../types/exercise';

// Build-base tie resolution (docs/dev/reports/BUILD-BASE-TIE-RESOLUTION-
// ASSESSMENT.md): when every earlier key ties, an exercise classified as a
// secondary stand-in or accessory yields to an unclassified one before the
// alphabetical id decides. Used by the four selection goals (rankByGoal) and,
// since the Quality Gate, by the structural tie-break (structuralTieBreak.ts).
// It never overrides an earlier ranking key.
export function selectionRoleRank(exercise: Exercise): number {
  return exercise.selection_role === 'secondary' ? 1 : 0;
}
