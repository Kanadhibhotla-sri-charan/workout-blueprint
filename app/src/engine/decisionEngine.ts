import type { Exercise } from '../types/exercise';
import { GOAL_LABELS, GOALS_REQUIRING_CURRENT_EXERCISE, type DecisionInput, type DecisionResult, type Goal, type TargetMatch } from './types';
import { isEquipmentFeasible } from './equipment';
import { meetsMaxDemand } from './constraints';
import { rankStructuralAlternatives } from './alternatives';
import { resolveComplements } from './complements';
import { buildProgramming } from './programmingEngine';
import { getFunctionalGoalById, getPhysiqueTargetById } from '../data';
import type { FunctionalGoal, PhysiqueTarget } from '../types/programming';
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
  const primaryMatches = resolvedTarget
    ? allExercises.filter((exercise) => exercise.physique_targets?.includes(resolvedTarget.id))
    : [];
  // Only treated as "genuinely used" when the primary target actually has
  // curated exercises — a target with zero matches falls back to
  // body-region selection (below) and must not claim target-awareness it
  // didn't have (see buildResultFromRanked's target/visualObjective
  // handling). Supporting targets never rescue a primary target that has
  // no matches of its own — they broaden an already-real target, they
  // don't substitute for one (Phase 4 Corrections §8: "the primary target
  // should drive the main recommendation").
  const target = primaryMatches.length > 0 ? resolvedTarget : null;
  // Supporting targets (Phase 4 Corrections §7-8) are folded into the
  // candidate pool alongside the primary target's own matches, so an
  // outcome's contributing targets are never silently unreachable just
  // because they didn't happen to be first in the list — but only once a
  // primary target has genuinely resolved; a bare supportingPhysiqueTargets
  // list with no primary target does not narrow anything on its own.
  const supportingTargetIds = target ? (input.supportingPhysiqueTargets ?? []) : [];
  const supportingMatches = supportingTargetIds.length
    ? allExercises.filter((exercise) =>
        supportingTargetIds.some((id) => exercise.physique_targets?.includes(id))
      )
    : [];
  const targetMatches =
    primaryMatches.length > 0
      ? [...new Map([...primaryMatches, ...supportingMatches].map((exercise) => [exercise.id, exercise])).values()]
      : [];
  const supportingTargets = target
    ? supportingTargetIds
        .map((id) => getPhysiqueTargetById(id))
        .filter((resolved): resolved is PhysiqueTarget => resolved != null)
    : [];
  // Function branch's counterpart to the physique-target resolution above
  // (revised Phase 4 spec §12/§39): only ever consulted when no physique
  // target resolved, since the UI never sets both — Appearance/Advanced
  // and Function are mutually exclusive entry modes. Kept as a fully
  // separate resolution (not reusing physiqueTarget's id-space) so
  // functional and aesthetic navigation stay distinct all the way through
  // the result, not just in the selector (§12's "do not mix functional
  // terminology into the aesthetic outcome selector").
  const resolvedFunctionalGoal =
    targetMatches.length === 0 && input.functionalGoal
      ? (getFunctionalGoalById(input.functionalGoal) ?? null)
      : null;
  const functionalMatches = resolvedFunctionalGoal
    ? allExercises.filter((exercise) => exercise.functional_goals?.includes(resolvedFunctionalGoal.id))
    : [];
  const functionalGoal = functionalMatches.length > 0 ? resolvedFunctionalGoal : null;

  let candidates =
    targetMatches.length > 0
      ? targetMatches
      : functionalMatches.length > 0
        ? functionalMatches
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

  // Target-match tier (Phase 4B §3-4): a direct primary-target match must
  // outrank a direct supporting-target match, which must outrank everything
  // else, regardless of how favorable a lower-tier candidate's generic
  // stimulus tags happen to be. A no-op (returns the list unchanged) when no
  // physique target is in play, so plain body-region/functional-goal
  // selection is unaffected. Applied as a stable pre-sort in front of each
  // goal branch's own existing ranking, so within a tier the established
  // stimulus/structural tiebreak rules — already validated by their own
  // tests — are unchanged.
  const primaryTargetId = target?.id ?? null;
  const supportingTargetIdList = supportingTargets.map((t) => t.id);
  const sortByTargetTier = (list: Exercise[]): Exercise[] => {
    if (!primaryTargetId && supportingTargetIdList.length === 0) return list;
    return [...list].sort(
      (a, b) =>
        targetMatchTier(a, primaryTargetId, supportingTargetIdList) -
        targetMatchTier(b, primaryTargetId, supportingTargetIdList)
    );
  };

  // Step 5: current-exercise overlap/complement logic, and Steps 7-8
  // (rank, explain), branched by goal.
  if (input.goal === 'replace-exercise') {
    return buildResultFromRanked(
      sortByTargetTier(rankStructuralAlternatives(currentExercise!, candidates, input.equipmentAvailable)),
      (exercise) =>
        `Fills approximately the same role as ${currentExercise!.name} — same ${exercise.movement_patterns[0]} movement, same ${humanize(exercise.exercise_type)} classification.`,
      () => `${currentExercise!.name} has no substitute meeting your constraints in this region.`,
      allExercises,
      input,
      target,
      supportingTargets,
      functionalGoal,
      primaryTargetId,
      supportingTargetIdList
    );
  }

  if (input.goal === 'different-stimulus' || input.goal === 'complement-current') {
    const resolved = resolveComplements(currentExercise!, allExercises, input.equipmentAvailable).filter(
      (exercise) => regionCandidates.some((candidate) => candidate.id === exercise.id)
    );
    return buildResultFromRanked(
      sortByTargetTier(resolved),
      (exercise) =>
        `Adds a different stimulus alongside ${currentExercise!.name} — a ${exercise.movement_patterns[0]} movement rather than ${currentExercise!.name}'s ${currentExercise!.movement_patterns[0]}.`,
      () => `No exercise complementing ${currentExercise!.name} meets your constraints in this region.`,
      allExercises,
      input,
      target,
      supportingTargets,
      functionalGoal,
      primaryTargetId,
      supportingTargetIdList
    );
  }

  const ranked = sortByTargetTier(rankByGoal(input.goal, candidates));
  return buildResultFromRanked(
    ranked,
    (exercise) => explainGoalPick(input.goal, exercise),
    () => 'No exercise in this region meets every constraint you gave.',
    allExercises,
    input,
    target,
    supportingTargets,
    functionalGoal,
    primaryTargetId,
    supportingTargetIdList
  );
}

// Phase 4B §3-4: 0 = direct primary-target match, 1 = direct
// supporting-target match, 2 = everything else (general regional match,
// curated complement not yet target-tagged, or no target was in play).
function targetMatchTier(exercise: Exercise, primaryTargetId: string | null, supportingTargetIds: string[]): 0 | 1 | 2 {
  if (primaryTargetId && exercise.physique_targets?.includes(primaryTargetId)) return 0;
  if (supportingTargetIds.some((id) => exercise.physique_targets?.includes(id))) return 1;
  return 2;
}

// Phase 4B §12: a short note on how bestFit's role relative to `target`
// should shape how it's programmed. Deterministic text keyed off
// bestFitTargetMatch — no volume/overlap accounting (that's the "current
// training context" layer the spec frames as a later step, §13), just the
// priority relationship this recommendation already knows.
function buildTargetProgrammingContext(
  target: PhysiqueTarget | null,
  supportingTargets: PhysiqueTarget[],
  bestFitTargetMatch: TargetMatch,
  bestFit: Exercise
): string | null {
  if (!target) return null;
  if (bestFitTargetMatch === 'primary') {
    return `${target.name} is the primary target driving this recommendation — prioritize its direct volume over supporting-target work when the two compete for training time or recovery budget.`;
  }
  if (bestFitTargetMatch === 'supporting') {
    const matchedSupporting = supportingTargets.find((t) => bestFit.physique_targets?.includes(t.id));
    const supportingName = matchedSupporting?.name ?? 'a supporting target';
    return `This trains ${supportingName}, a supporting target for ${target.name} rather than the primary target directly — treat its volume as secondary alongside direct ${target.name} work, not a replacement for it.`;
  }
  return `${target.name} is the target driving this recommendation, though this specific pick isn't tagged to it directly yet in the taxonomy — treat the guidance below as a general starting point.`;
}

function buildResultFromRanked(
  ranked: Exercise[],
  explainBest: (exercise: Exercise) => string,
  noCandidatesReason: () => string,
  allExercises: Exercise[],
  input: DecisionInput,
  target: PhysiqueTarget | null,
  supportingTargets: PhysiqueTarget[],
  functionalGoal: FunctionalGoal | null,
  primaryTargetId: string | null,
  supportingTargetIds: string[]
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
  const bestFitTargetMatchTier = targetMatchTier(bestFit, primaryTargetId, supportingTargetIds);
  const bestFitTargetMatch: TargetMatch =
    bestFitTargetMatchTier === 0 ? 'primary' : bestFitTargetMatchTier === 1 ? 'supporting' : 'general';
  return {
    status: 'ok',
    target: target,
    visualObjective: target ? target.physique_outcome : null,
    // Never silently discarded (Phase 4 Corrections §7-8) — always an
    // array, empty when there are none, rather than omitted.
    supportingTargets,
    functionalGoal,
    bestFitTargetMatch,
    targetProgrammingContext: buildTargetProgrammingContext(target, supportingTargets, bestFitTargetMatch, bestFit),
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
