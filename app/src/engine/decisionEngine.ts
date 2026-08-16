import type { Exercise } from '../types/exercise';
import { GOAL_LABELS, GOALS_REQUIRING_CURRENT_EXERCISE, type DecisionInput, type DecisionResult, type Goal } from './types';
import { isEquipmentFeasible } from './equipment';
import { meetsMaxDemand } from './constraints';
import { rankStructuralAlternatives } from './alternatives';
import { resolveComplements } from './complements';
import { buildProgramming } from './programmingEngine';
import { getPhysiqueTargetById } from '../data';
import type { PhysiqueTarget } from '../types/programming';
import { DEMAND_LEVELS } from '../utils/filters';
import { humanize } from '../utils/format';

const MAX_COMPLEMENTS_SHOWN = 3;

// Rule-based candidate pipeline per PHASE-3-MVP.md §18 (filter by region ->
// goal/target -> equipment -> unsuitable -> current-exercise overlap/
// complement -> setup/fatigue -> rank -> explain). Deterministic
// throughout: every step is a strict filter or a fixed-priority sort, per
// §14 ("do not use opaque numerical scoring unless necessary") and the
// structural-matching rules defined in DECISION-ENGINE-RULES.md before
// this file was written.
export function makeRecommendation(input: DecisionInput, allExercises: Exercise[]): DecisionResult {
  // Step 1: filter by physique target when given and it has curated
  // exercises; otherwise (or when not given) fall back to body region —
  // this is what keeps Phase 3's body-region-only selection working
  // unchanged while the taxonomy is still being expanded target by target.
  const resolvedTarget = input.physiqueTarget ? (getPhysiqueTargetById(input.physiqueTarget) ?? null) : null;
  const targetMatches = resolvedTarget
    ? allExercises.filter((exercise) => exercise.physique_targets?.includes(resolvedTarget.id))
    : [];
  // Only treated as "genuinely used" when it actually has curated
  // exercises — a target with zero matches falls back to body-region
  // selection (below) and must not claim target-awareness it didn't have
  // (see buildResultFromRanked's target/visualObjective handling).
  const target = targetMatches.length > 0 ? resolvedTarget : null;
  let candidates =
    targetMatches.length > 0
      ? targetMatches
      : allExercises.filter((exercise) => exercise.body_regions.includes(input.bodyRegion));

  // Step 4: remove records not ready to recommend (see
  // DECISION-ENGINE-RULES.md §2 rule 5 — same "not draft" gate used by the
  // structural-alternative/complement rules, applied here up front so it
  // covers every goal, not just the ones that call into those rules).
  candidates = candidates.filter((exercise) => exercise.review_status !== 'draft');

  // Step 3: equipment constraint.
  candidates = candidates.filter((exercise) => isEquipmentFeasible(exercise, input.equipmentAvailable));

  // Step 6: setup/fatigue/stability/skill tolerance constraints ("at most"
  // the stated level — see constraints.ts).
  const meetsConstraints = (exercise: Exercise) =>
    meetsMaxDemand(exercise.setup_time, input.maxSetupTime) &&
    meetsMaxDemand(exercise.fatigue_cost, input.maxFatigueCost) &&
    meetsMaxDemand(exercise.stability_demand, input.maxStabilityDemand) &&
    meetsMaxDemand(exercise.skill_demand, input.maxSkillDemand);
  candidates = candidates.filter(meetsConstraints);

  // A separate, broader (region-only, never target-narrowed) constraint-
  // filtered pool, used only to validate a *declared* complement/
  // alternative a current exercise already points to. A curated
  // `complements` entry (e.g. incline-dumbbell-press -> cable-fly) can
  // legitimately sit outside a narrow physique-target tag — cable-fly
  // isn't (yet) tagged upper-pec even though it's a real, useful upper-
  // chest-relevant complement — so validating it against the narrow
  // target-matched `candidates` would wrongly discard a real curated
  // relationship just because the taxonomy hasn't caught up to it.
  const regionCandidates = allExercises
    .filter((exercise) => exercise.body_regions.includes(input.bodyRegion))
    .filter((exercise) => exercise.review_status !== 'draft')
    .filter((exercise) => isEquipmentFeasible(exercise, input.equipmentAvailable))
    .filter(meetsConstraints);

  const currentExercise = input.currentExerciseId
    ? (allExercises.find((exercise) => exercise.id === input.currentExerciseId) ?? null)
    : null;

  if (GOALS_REQUIRING_CURRENT_EXERCISE.includes(input.goal) && !currentExercise) {
    return {
      status: 'missing-current-exercise',
      reason: `The "${GOAL_LABELS[input.goal]}" goal needs you to specify the exercise you're already doing.`,
    };
  }

  if (candidates.length === 0) {
    return {
      status: 'no-candidates',
      reason: 'No exercise in this region meets every constraint you gave. Try relaxing one — equipment and fatigue tolerance are the most common blockers.',
    };
  }

  // Step 5: current-exercise overlap/complement logic, and Steps 7-8
  // (rank, explain), branched by goal.
  if (input.goal === 'replace-exercise') {
    return buildResultFromRanked(
      rankStructuralAlternatives(currentExercise!, candidates, input.equipmentAvailable),
      (exercise) =>
        `Fills approximately the same role as ${currentExercise!.name} — same ${exercise.movement_patterns[0]} movement, same ${humanize(exercise.exercise_type)} classification.`,
      () => `${currentExercise!.name} has no substitute meeting your constraints in this region.`,
      allExercises,
      input,
      target
    );
  }

  if (input.goal === 'different-stimulus' || input.goal === 'complement-current') {
    const resolved = resolveComplements(currentExercise!, allExercises, input.equipmentAvailable).filter(
      (exercise) => regionCandidates.some((candidate) => candidate.id === exercise.id)
    );
    return buildResultFromRanked(
      resolved,
      (exercise) =>
        `Adds a different stimulus alongside ${currentExercise!.name} — a ${exercise.movement_patterns[0]} movement rather than ${currentExercise!.name}'s ${currentExercise!.movement_patterns[0]}.`,
      () => `No exercise complementing ${currentExercise!.name} meets your constraints in this region.`,
      allExercises,
      input,
      target
    );
  }

  const ranked = rankByGoal(input.goal, candidates);
  return buildResultFromRanked(
    ranked,
    (exercise) => explainGoalPick(input.goal, exercise),
    () => 'No exercise in this region meets every constraint you gave.',
    allExercises,
    input,
    target
  );
}

function buildResultFromRanked(
  ranked: Exercise[],
  explainBest: (exercise: Exercise) => string,
  noCandidatesReason: () => string,
  allExercises: Exercise[],
  input: DecisionInput,
  target: PhysiqueTarget | null
): DecisionResult {
  const [bestFit, alt] = ranked;
  if (!bestFit) {
    return { status: 'no-candidates', reason: noCandidatesReason() };
  }
  // The Target/Visual-objective block reflects what the user asked to
  // improve (per spec §25: "what the user is actually trying to improve"),
  // not whether this specific pick already carries that exact taxonomy
  // tag — a genuinely relevant complement (e.g. Cable Fly, whose bias is
  // setup-dependent) can be the right recommendation for a target before
  // the taxonomy has caught up to tagging it. `target` is only non-null
  // here when it actually drove candidate selection (see Step 1).
  return {
    status: 'ok',
    target: target,
    visualObjective: target ? target.physique_outcome : null,
    bestFit,
    why: explainBest(bestFit),
    stimulus: bestFit.resistance_profile,
    programming: buildProgramming(bestFit, input.maxFatigueCost),
    alternative: alt ?? null,
    alternativeWhy: alt ? `A close second under the same constraints: ${explainBest(alt)}` : null,
    watchOut: buildWatchOut(bestFit),
    // Capped per §16 ("do not overwhelm the user with ten recommendations")
    // — the structural fallback in resolveComplements can return many
    // eligible matches; a curated `complements` field (when present) is
    // usually 1-2 entries already and is unaffected by this cap in practice.
    complements: resolveComplements(bestFit, allExercises, input.equipmentAvailable).slice(0, MAX_COMPLEMENTS_SHOWN),
  };
}

// Deterministic fixed-priority key per goal, ascending (lower = ranked
// first), with an alphabetical id tiebreak — never a blended score.
function goalKey(goal: Goal, exercise: Exercise): number {
  switch (goal) {
    case 'build-base':
      if (exercise.coverage_categories.includes('heavy-compound')) return 0;
      if (exercise.coverage_categories.includes('stable-compound')) return 1;
      return 2;
    case 'visual-area':
      if (
        exercise.coverage_categories.includes('lengthened-position-emphasis') ||
        exercise.coverage_categories.includes('shortened-position-emphasis')
      ) {
        return 0;
      }
      return 1;
    case 'low-fatigue':
      return DEMAND_LEVELS.indexOf(exercise.fatigue_cost as (typeof DEMAND_LEVELS)[number]);
    case 'limited-equipment':
      return exercise.equipment.length;
    default:
      return 0;
  }
}

function rankByGoal(goal: Goal, candidates: Exercise[]): Exercise[] {
  return [...candidates].sort((a, b) => {
    const keyDiff = goalKey(goal, a) - goalKey(goal, b);
    if (keyDiff !== 0) return keyDiff;
    return a.id.localeCompare(b.id);
  });
}

function explainGoalPick(goal: Goal, exercise: Exercise): string {
  switch (goal) {
    case 'build-base':
      return exercise.coverage_categories.includes('heavy-compound')
        ? 'A heavy-compound movement — a solid main-training-base choice for this region.'
        : `A ${humanize(exercise.exercise_type)} movement covering this region's core role.`;
    case 'visual-area':
      return exercise.mirror_effect;
    case 'low-fatigue':
      return `${humanize(exercise.fatigue_cost)} fatigue cost and ${humanize(exercise.setup_time)} setup — light on your session's fatigue budget.`;
    case 'limited-equipment':
      return exercise.equipment.length === 1 && exercise.equipment[0] === 'bodyweight'
        ? 'Needs no equipment at all.'
        : `Needs only: ${exercise.equipment.join(', ')}.`;
    default:
      return exercise.why_this_exists;
  }
}

// Per §16 "Watch Out": meaningful overlap, high fatigue, equipment
// requirements, or another relevant limitation — every note traces to an
// actual field value, nothing inferred, per §17's recommendation-safety
// rule.
function buildWatchOut(exercise: Exercise): string[] {
  const notes: string[] = [];
  if (exercise.fatigue_cost === 'high') {
    notes.push('High fatigue cost — budget recovery accordingly.');
  }
  if (!(exercise.equipment.length === 1 && exercise.equipment[0] === 'bodyweight')) {
    notes.push(`Requires: ${exercise.equipment.join(', ')}.`);
  }
  if (exercise.overlaps_with && exercise.overlaps_with.length > 0) {
    notes.push('Overlaps with other exercises already in the dataset — avoid stacking both in one routine.');
  }
  if (exercise.limitations.length > 0) {
    notes.push(exercise.limitations[0]);
  }
  return notes;
}
