import type { Exercise } from '../types/exercise';
import type { IntensityTechnique, RepRangeMatch } from '../types/programming';
import { programming } from '../data';
import { DEMAND_LEVELS } from '../utils/filters';
import type { DemandLevel } from './types';

export interface RepRangeGuidance {
  primaryRange: [number, number];
  acceptableRange: [number, number];
  reason: string;
}

export interface Programming {
  repRange: RepRangeGuidance;
  rirTypicalRange: [number, number];
  rirExplanation: string;
  rirGuidance: string;
  weeklyVolumeSets: [number, number];
  frequencyPerWeek: [number, number];
  progressionExplanation: string;
  intensityTechnique: IntensityTechnique | null;
}

function matchesRule(exercise: Exercise, match: RepRangeMatch): boolean {
  if (match.exercise_type && exercise.exercise_type !== match.exercise_type) return false;
  if (
    match.coverage_categories_any &&
    !match.coverage_categories_any.some((category) => exercise.coverage_categories.includes(category))
  ) {
    return false;
  }
  return true;
}

// Default-plus-override rep-range lookup per
// docs/knowledge-manual/programming/README.md — an exercise-specific
// override (keyed by exercise_id in rep-ranges.yaml) wins when present;
// otherwise the first matching default rule (in file order) applies.
// architect approval memo item 3: this is the DEFAULT mechanism, not an
// absolute rule — the override list exists for exactly this reason and
// stays empty until a real distinction requires populating it.
export function resolveRepRange(exercise: Exercise): RepRangeGuidance {
  const override = programming.repRanges.overrides.find((o) => o.exercise_id === exercise.id);
  if (override) {
    return {
      primaryRange: override.primary_range,
      acceptableRange: override.acceptable_range,
      reason: override.reason,
    };
  }

  const rule = programming.repRanges.defaults.find((r) => matchesRule(exercise, r.match));
  if (rule) {
    return {
      primaryRange: rule.primary_range,
      acceptableRange: rule.acceptable_range,
      reason: rule.reason,
    };
  }

  // Defensive fallback — every one of the 123 current records matches a
  // default rule (compound or isolation always matches at least the
  // compound-fallback/isolation rule), but a future record with neither
  // shouldn't crash the engine.
  return {
    primaryRange: [8, 15],
    acceptableRange: [6, 20],
    reason: 'General practical range — no more specific guidance is defined yet for this exercise\'s characteristics.',
  };
}

// Fatigue-constraint interaction per architect approval memo item 5:
// existing fatigue constraints move volume/frequency toward the lower end
// of the guidance rather than triggering a new recovery model.
function resolveWeeklyVolume(maxFatigueCost: DemandLevel | null): [number, number] {
  const { starting_point_sets, practical_range_sets } = programming.globalPrinciples.weekly_volume;
  return maxFatigueCost === 'low' ? starting_point_sets : practical_range_sets;
}

function resolveFrequency(maxFatigueCost: DemandLevel | null): [number, number] {
  const [low, high] = programming.globalPrinciples.frequency.typical_starting_range_per_week;
  return maxFatigueCost === 'low' ? [low, low] : [low, high];
}

// Deterministic v1 suggestion rule documented in
// data/programming/intensity-techniques.yaml: suggest drop-set, and only
// drop-set, when the exercise is isolation, its fatigue_cost is at most
// what the technique allows, and the user hasn't asked to keep fatigue
// low (which the technique would work against).
function selectIntensityTechnique(
  exercise: Exercise,
  maxFatigueCost: DemandLevel | null
): IntensityTechnique | null {
  if (maxFatigueCost === 'low') return null;

  const dropSet = programming.intensityTechniques.find((t) => t.id === 'drop-set');
  if (!dropSet) return null;
  if (!dropSet.suitable_exercise_types.includes(exercise.exercise_type)) return null;

  const exerciseFatigueIndex = DEMAND_LEVELS.indexOf(exercise.fatigue_cost as (typeof DEMAND_LEVELS)[number]);
  const maxAllowedIndex = DEMAND_LEVELS.indexOf(dropSet.suitable_when_fatigue_cost_at_most);
  if (exerciseFatigueIndex > maxAllowedIndex) return null;

  return dropSet;
}

export function buildProgramming(exercise: Exercise, maxFatigueCost: DemandLevel | null): Programming {
  const { rir, progression } = programming.globalPrinciples;
  return {
    repRange: resolveRepRange(exercise),
    rirTypicalRange: rir.typical_working_range,
    rirExplanation: rir.explanation,
    rirGuidance: rir.guidance,
    weeklyVolumeSets: resolveWeeklyVolume(maxFatigueCost),
    frequencyPerWeek: resolveFrequency(maxFatigueCost),
    progressionExplanation: progression.explanation,
    intensityTechnique: selectIntensityTechnique(exercise, maxFatigueCost),
  };
}
