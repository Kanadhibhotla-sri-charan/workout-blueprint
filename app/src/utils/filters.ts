import type { Exercise } from '../types/exercise';

// Demand-level fields are a fixed 3-value enum defined by the schema itself
// (scripts/lib/taxonomy.js DEMAND_LEVELS) — the low/medium/high *order* is
// structural, not exercise content, so it's fine to state here rather than
// derive from the dataset the way equipment/coverage-category options are.
export const DEMAND_LEVELS = ['low', 'medium', 'high'] as const;

export interface Filters {
  region: string | null;
  equipment: string | null;
  exerciseType: string | null;
  laterality: string | null;
  setupTime: string | null;
  fatigueCost: string | null;
  coverageCategory: string | null;
}

export const EMPTY_FILTERS: Filters = {
  region: null,
  equipment: null,
  exerciseType: null,
  laterality: null,
  setupTime: null,
  fatigueCost: null,
  coverageCategory: null,
};

// Composable, AND-combined filters per PHASE-3-MVP.md §12 — a filter belongs
// here only if it maps directly to an existing structured field. No fuzzy
// or ranked matching: each active filter is a strict predicate.
export function applyFilters(exercises: Exercise[], filters: Filters): Exercise[] {
  return exercises.filter((exercise) => {
    if (filters.region && !exercise.body_regions.includes(filters.region)) return false;
    if (filters.equipment && !exercise.equipment.includes(filters.equipment)) return false;
    if (filters.exerciseType && exercise.exercise_type !== filters.exerciseType) return false;
    if (filters.laterality && exercise.laterality !== filters.laterality) return false;
    if (filters.setupTime && exercise.setup_time !== filters.setupTime) return false;
    if (filters.fatigueCost && exercise.fatigue_cost !== filters.fatigueCost) return false;
    if (
      filters.coverageCategory &&
      !exercise.coverage_categories.includes(filters.coverageCategory)
    ) {
      return false;
    }
    return true;
  });
}

export function hasActiveFilters(filters: Filters): boolean {
  return Object.values(filters).some((value) => value !== null);
}
