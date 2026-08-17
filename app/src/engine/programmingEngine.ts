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
  /**
   * Contextual explanation of the intensityTechnique decision (Phase 4B
   * §19-20) — why this technique fits this specific exercise's fatigue/
   * skill/stability profile, or, when intensityTechnique is null, why
   * none of the catalog's techniques were eligible. Never empty: "no
   * technique" is always explained, not just silently absent.
   */
  intensityTechniqueContext: string;
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

function demandIndex(level: DemandLevel | string): number {
  return DEMAND_LEVELS.indexOf(level as (typeof DEMAND_LEVELS)[number]);
}

// Eligibility (Phase 4B §16-17): a technique is eligible only when the
// exercise's own exercise_type/fatigue_cost/skill_demand/stability_demand
// all fall within what that specific technique's catalog entry tolerates
// — checked against all three thresholds, not just fatigue, so (for
// example) a heavy, high-skill, high-stability compound like a
// conventional deadlift is correctly ineligible for every technique even
// though "compound" alone would pass rest-pause's exercise_type check.
function isTechniqueEligible(technique: IntensityTechnique, exercise: Exercise): boolean {
  if (!technique.suitable_exercise_types.includes(exercise.exercise_type)) return false;
  if (demandIndex(exercise.fatigue_cost) > demandIndex(technique.suitable_when_fatigue_cost_at_most)) return false;
  if (demandIndex(exercise.skill_demand) > demandIndex(technique.suitable_when_skill_demand_at_most)) return false;
  if (demandIndex(exercise.stability_demand) > demandIndex(technique.suitable_when_stability_demand_at_most)) {
    return false;
  }
  return true;
}

// How much headroom the exercise has below a technique's thresholds,
// summed across all three demand dimensions — 0 means the exercise sits
// exactly at every one of the technique's limits (the tightest, most
// specifically-suited fit); a larger number means the technique's
// tolerance is looser than this exercise actually needs.
function eligibilitySlack(technique: IntensityTechnique, exercise: Exercise): number {
  return (
    (demandIndex(technique.suitable_when_fatigue_cost_at_most) - demandIndex(exercise.fatigue_cost)) +
    (demandIndex(technique.suitable_when_skill_demand_at_most) - demandIndex(exercise.skill_demand)) +
    (demandIndex(technique.suitable_when_stability_demand_at_most) - demandIndex(exercise.stability_demand))
  );
}

// Ranking (Phase 4B §16/§18): among eligible techniques, the one whose
// thresholds fit this exercise most tightly (lowest slack) wins — the
// technique this exercise is most specifically suited to, rather than
// always the same catalog-order default. Ties broken by catalog order
// (drop-set, rest-pause, myo-reps), a fixed and explainable tiebreak, not
// a blended score.
function eligibleTechniquesRanked(exercise: Exercise): IntensityTechnique[] {
  return programming.intensityTechniques
    .filter((technique) => isTechniqueEligible(technique, exercise))
    .map((technique, catalogIndex) => ({ technique, catalogIndex, slack: eligibilitySlack(technique, exercise) }))
    .sort((a, b) => a.slack - b.slack || a.catalogIndex - b.catalogIndex)
    .map((entry) => entry.technique);
}

// Contextual explanation (Phase 4B §19) — built from this exercise's own
// resolved profile and demand levels, not generic canned copy, so it
// changes with the exercise rather than repeating the same sentence for
// every recommendation.
function explainIntensityTechnique(technique: IntensityTechnique, exercise: Exercise, profile: ProgrammingProfile): string {
  return (
    `${technique.name} fits this exercise: it's a ${profile.name.toLowerCase()} movement with ${exercise.fatigue_cost} ` +
    `fatigue cost, ${exercise.skill_demand} skill demand, and ${exercise.stability_demand} stability demand — all ` +
    `within what ${technique.name} tolerates. ${technique.when_it_may_help}`
  );
}

function explainNoIntensityTechnique(exercise: Exercise, maxFatigueCost: DemandLevel | null): string {
  if (maxFatigueCost === 'low') {
    return (
      'No intensity technique is recommended here — you asked to keep fatigue low, and every technique in the ' +
      'catalog adds meaningful local fatigue on top of the working sets themselves.'
    );
  }
  return (
    `No intensity technique is recommended here — this exercise's ${exercise.fatigue_cost} fatigue cost, ` +
    `${exercise.skill_demand} skill demand, and ${exercise.stability_demand} stability demand exceed what every ` +
    "technique in the catalog tolerates. Sufficient stimulus is already available from the working sets " +
    'themselves; adding a technique here would mainly add fatigue and technical risk without a clear benefit.'
  );
}

export function buildProgramming(exercise: Exercise, maxFatigueCost: DemandLevel | null): Programming {
  const { rir, progression } = programming.globalPrinciples;
  const profile = resolveProgrammingProfile(exercise);
  const eligible = maxFatigueCost === 'low' ? [] : eligibleTechniquesRanked(exercise);
  const intensityTechnique = eligible[0] ?? null;
  return {
    repRange: resolveRepRange(exercise, profile),
    profile,
    rirTypicalRange: rir.typical_working_range,
    rirExplanation: rir.explanation,
    rirGuidance: rir.guidance,
    weeklyVolumeSets: resolveWeeklyVolume(maxFatigueCost),
    frequencyPerWeek: resolveFrequency(maxFatigueCost),
    progressionExplanation: progression.explanation,
    intensityTechnique,
    intensityTechniqueContext: intensityTechnique
      ? explainIntensityTechnique(intensityTechnique, exercise, profile)
      : explainNoIntensityTechnique(exercise, maxFatigueCost),
  };
}
