import type { Exercise } from '../types/exercise';

// Equipment semantics (Phase 7 Stage 3.5 — docs/dev/reports/
// EQUIPMENT-MODEL-INVESTIGATION.md). An exercise is done with one of its
// *setups*: every item inside a setup is required, and the setups are
// alternatives. A record without `equipment_setups` has exactly one setup,
// its `equipment` list — the original all-items-required meaning, unchanged.
//
// Every place that interprets equipment (Decide's feasibility filter, the
// "limited equipment" ranking, explanation/watch-out text, Explore's filter,
// the detail page) goes through this module, so they can't disagree again.

// Bodyweight is never something a user lacks: an empty equipment selection
// means "bodyweight only", as Decide's picker tells the user.
export const ALWAYS_AVAILABLE = 'bodyweight';

export function equipmentSetups(exercise: Exercise): string[][] {
  return exercise.equipment_setups && exercise.equipment_setups.length > 0
    ? exercise.equipment_setups
    : [exercise.equipment];
}

function setupAvailable(setup: string[], equipmentAvailable: string[]): boolean {
  return setup.every((item) => item === ALWAYS_AVAILABLE || equipmentAvailable.includes(item));
}

// Setups the user can actually complete, in their listed order. `null`
// means the equipment constraint was never engaged: every setup counts.
export function usableSetups(exercise: Exercise, equipmentAvailable: string[] | null): string[][] {
  const setups = equipmentSetups(exercise);
  return equipmentAvailable === null ? setups : setups.filter((setup) => setupAvailable(setup, equipmentAvailable));
}

// Rule defined in docs/dev/reports/DECISION-ENGINE-RULES.md §1, revised in
// Phase 7 Stage 3.5: feasible when at least one complete setup is available.
// Exact item matches only — no normalization or synonym matching.
export function isEquipmentFeasible(exercise: Exercise, equipmentAvailable: string[] | null): boolean {
  return usableSetups(exercise, equipmentAvailable).length > 0;
}

// The fewest-item setup the user can complete (or, unrestricted, the
// fewest-item setup overall). Ties keep the record's listed order, so the
// choice is deterministic. Null when no setup is usable.
export function smallestUsableSetup(exercise: Exercise, equipmentAvailable: string[] | null): string[] | null {
  let best: string[] | null = null;
  for (const setup of usableSetups(exercise, equipmentAvailable)) {
    if (best === null || setup.length < best.length) best = setup;
  }
  return best;
}

// Explore's equipment filter: does any complete setup use this item? For a
// single-setup record that's the same as `equipment.includes(item)`, so
// Explore's results only change where the data itself changed.
export function usesEquipment(exercise: Exercise, item: string): boolean {
  return equipmentSetups(exercise).some((setup) => setup.includes(item));
}

function isBodyweightOnly(setup: string[]): boolean {
  return setup.length === 1 && setup[0] === ALWAYS_AVAILABLE;
}

function joinAlternatives(options: string[]): string {
  if (options.length <= 1) return options.join('');
  if (options.length === 2) return `${options[0]} or ${options[1]}`;
  return `${options.slice(0, -1).join(', ')}, or ${options[options.length - 1]}`;
}

// Human-readable equipment for display: a single setup reads exactly as it
// always has ("barbell, bench, rack"); alternatives read as such
// ("barbell, ez-bar, or dumbbell"; "barbell + bench or hip-thrust machine").
export function formatEquipmentOptions(exercise: Exercise): string {
  const setups = equipmentSetups(exercise);
  if (setups.length === 1) return setups[0].join(', ');
  return joinAlternatives(setups.map((setup) => setup.join(' + ')));
}

// What an exercise needs *for this user*. With equipment restricted, the
// setup that fits them; unrestricted, the alternatives. `none` when a
// bodyweight-only way to do it applies.
export type EquipmentNeed =
  | { kind: 'none' }
  | { kind: 'setup'; setup: string[] }
  | { kind: 'one-of'; text: string };

export function equipmentNeed(exercise: Exercise, equipmentAvailable: string[] | null): EquipmentNeed {
  const setups = equipmentSetups(exercise);
  if (setups.length === 1 || equipmentAvailable !== null) {
    const setup = smallestUsableSetup(exercise, equipmentAvailable) ?? setups[0];
    return isBodyweightOnly(setup) ? { kind: 'none' } : { kind: 'setup', setup };
  }
  if (setups.some(isBodyweightOnly)) return { kind: 'none' };
  return { kind: 'one-of', text: formatEquipmentOptions(exercise) };
}
