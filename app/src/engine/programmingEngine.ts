import type { Exercise } from '../types/exercise';
import type { IntensityTechnique, ProgrammingProfile, ProgrammingProfileMatch } from '../types/programming';
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
  /** The classified Programming Profile driving this exercise's guidance (Phase 4B §10-11). */
  profile: ProgrammingProfile;
}

const FALLBACK_PROFILE: ProgrammingProfile = {
  id: 'general-fallback',
  name: 'General',
  summary: 'No more specific profile classification applies to this exercise yet.',
  primary_range: [8, 15],
  acceptable_range: [6, 20],
  rep_range_reason:
    "General practical range — no more specific guidance is defined yet for this exercise's characteristics.",
  guidance_note: 'No profile-specific guidance is defined yet for this exercise\'s characteristics.',
};

function matchesProfileRule(exercise: Exercise, match: ProgrammingProfileMatch): boolean {
  if (match.exercise_type && exercise.exercise_type !== match.exercise_type) return false;
  if (
    match.coverage_categories_any &&
    !match.coverage_categories_any.some((category) => exercise.coverage_categories.includes(category))
  ) {
    return false;
  }
  if (match.stability_demand_at_least) {
    const exerciseIndex = DEMAND_LEVELS.indexOf(exercise.stability_demand as (typeof DEMAND_LEVELS)[number]);
    const minIndex = DEMAND_LEVELS.indexOf(match.stability_demand_at_least);
    if (exerciseIndex < minIndex) return false;
  }
  return true;
}

// Programming Profile classification (Phase 4B §10-11): first matching
// rule wins, in file order, reusing exercise_type/coverage_categories/
// stability_demand — fields every exercise record already has — rather
// than an invented numerical score. Falls back to a generic profile for
// the (currently impossible, given the ruleset's compound/isolation
// fallback rules) case of an exercise matching nothing.
export function resolveProgrammingProfile(exercise: Exercise): ProgrammingProfile {
  const rule = programming.programmingProfiles.classification.defaults.find((r) =>
    matchesProfileRule(exercise, r.match)
  );
  if (!rule) return FALLBACK_PROFILE;
  const profile = programming.programmingProfiles.profiles.find((p) => p.id === rule.profile_id);
  return profile ?? FALLBACK_PROFILE;
}

// Profile-plus-override rep-range lookup: an exercise-specific override
// (keyed by exercise_id in rep-ranges.yaml) wins when present; otherwise
// the resolved Programming Profile's own rep range applies. The override
// list exists for a genuine per-exercise distinction and stays empty
// until one is needed (architect Guardrail: don't create exercise-
// specific programming records for every exercise now).
export function resolveRepRange(exercise: Exercise, profile: ProgrammingProfile): RepRangeGuidance {
  const override = programming.repRanges.overrides.find((o) => o.exercise_id === exercise.id);
  if (override) {
    return {
      primaryRange: override.primary_range,
      acceptableRange: override.acceptable_range,
      reason: override.reason,
    };
  }

  return {
    primaryRange: profile.primary_range,
    acceptableRange: profile.acceptable_range,
    reason: profile.rep_range_reason,
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
  const profile = resolveProgrammingProfile(exercise);
  return {
    repRange: resolveRepRange(exercise, profile),
    profile,
    rirTypicalRange: rir.typical_working_range,
    rirExplanation: rir.explanation,
    rirGuidance: rir.guidance,
    weeklyVolumeSets: resolveWeeklyVolume(maxFatigueCost),
    frequencyPerWeek: resolveFrequency(maxFatigueCost),
    progressionExplanation: progression.explanation,
    intensityTechnique: selectIntensityTechnique(exercise, maxFatigueCost),
  };
}
