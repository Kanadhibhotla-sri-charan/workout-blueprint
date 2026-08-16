import type { Exercise } from '../types/exercise';

// Rule defined in docs/dev/reports/DECISION-ENGINE-RULES.md §1 before this
// file was written. `null` = the equipment constraint was never engaged (no
// filtering); a list (including []) = the user stated exactly what they
// have, and every item the exercise requires must be an exact match within
// it. No normalization, no synonym/partial matching.
export function isEquipmentFeasible(
  exercise: Exercise,
  equipmentAvailable: string[] | null
): boolean {
  if (equipmentAvailable === null) return true;
  return exercise.equipment.every((item) => equipmentAvailable.includes(item));
}
