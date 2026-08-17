import type { Exercise } from '../types/exercise';
import type { FunctionalGoal, PhysiqueTarget } from '../types/programming';
import type { DEMAND_LEVELS } from '../utils/filters';
import type { Programming } from './programmingEngine';

export type DemandLevel = (typeof DEMAND_LEVELS)[number];

// One goal per PHASE-3-MVP.md §13 Step 2's example list, mapped to the
// structured fields that actually support it (see decisionEngine.ts) —
// no goal exists here that the schema can't back, per §13's "do not
// create unsupported recommendation categories."
export type Goal =
  | 'build-base'
  | 'different-stimulus'
  | 'visual-area'
  | 'low-fatigue'
  | 'limited-equipment'
  | 'replace-exercise'
  | 'complement-current';

// Single source of truth for goal display labels — used by the engine's
// own explanatory text (decisionEngine.ts) and by the Decision Maker UI's
// goal picker (3G), so the two can't drift apart.
export const GOAL_LABELS: Record<Goal, string> = {
  'build-base': 'Build the main training base',
  'different-stimulus': 'Add a different stimulus',
  'visual-area': 'Improve a specific visual area',
  'low-fatigue': 'Train with low fatigue',
  'limited-equipment': 'Train with limited equipment',
  'replace-exercise': 'Replace an exercise',
  'complement-current': 'Add something that complements my current exercise',
};

export const GOALS: Goal[] = [
  'build-base',
  'different-stimulus',
  'visual-area',
  'low-fatigue',
  'limited-equipment',
  'replace-exercise',
  'complement-current',
];

export const GOALS_REQUIRING_CURRENT_EXERCISE: Goal[] = [
  'different-stimulus',
  'complement-current',
  'replace-exercise',
];

// Target provenance (Phase 4B §4/§6): why a recommended exercise entered
// the candidate pool, preserved through ranking so the UI/explanation can
// stay consistent with it — "primary" for a direct primary-physique-target
// match, "supporting" for a direct supporting-target match, "general" for
// everything else (plain body-region/functional-goal matches, or no target
// was in play at all).
export type TargetMatch = 'primary' | 'supporting' | 'general';

export interface DecisionInput {
  bodyRegion: string;
  /**
   * Optional specific physique target (Phase 4), e.g. "upper-pec". When set
   * and at least one exercise maps to it, candidate selection uses this
   * instead of bodyRegion; falls back to bodyRegion when the target has no
   * curated exercise mapping yet (taxonomy still expanding). `bodyRegion`
   * remains required so Phase 3-style body-region-only selection keeps
   * working unchanged when this is null.
   */
  physiqueTarget: string | null;
  /**
   * Optional contributing targets (Phase 4 Corrections §7-8) alongside
   * `physiqueTarget`, which remains "the" primary target driving the main
   * recommendation and the Target/Visual-objective display. Only has any
   * effect when `physiqueTarget` is set and itself resolves. Folded into
   * the candidate pool so a supporting target's exercises are never
   * silently unreachable, without giving them equal weight to the primary
   * target — see decisionEngine.ts Step 1.
   */
  supportingPhysiqueTargets: string[] | null;
  /**
   * Optional functional goal (revised Phase 4 spec §12/§39), e.g.
   * "rotator-cuff" — the Function branch's counterpart to physiqueTarget,
   * resolved against data/programming/functional-goals.yaml and matched
   * against exercises' functional_goals field instead of physique_targets.
   * Mutually exclusive with physiqueTarget in practice (the UI only ever
   * sets one), kept as a separate field rather than reusing physiqueTarget
   * so functional and aesthetic navigation stay conceptually distinct in
   * the result, not just in the selector.
   */
  functionalGoal: string | null;
  goal: Goal;
  equipmentAvailable: string[] | null;
  maxSetupTime: DemandLevel | null;
  maxFatigueCost: DemandLevel | null;
  maxStabilityDemand: DemandLevel | null;
  maxSkillDemand: DemandLevel | null;
  currentExerciseId: string | null;
}

export type DecisionResult =
  | {
      status: 'ok';
      /** The resolved physique target, when physiqueTarget was set and matched real exercises. */
      target: PhysiqueTarget | null;
      /** Target's physique_outcome — "what you should expect to see" — when a target resolved. */
      visualObjective: string | null;
      /**
       * Resolved supportingPhysiqueTargets that contributed to candidate
       * selection alongside `target` (Phase 4 Corrections §7-8). Always an
       * array — empty, not omitted, when there are none — so the UI can
       * render "also contributes" without discarding anything silently.
       * Only populated when `target` itself resolved.
       */
      supportingTargets: PhysiqueTarget[];
      /**
       * The resolved functional goal, when functionalGoal was set and
       * matched real exercises. Kept separate from `target` (which is
       * always physique-specific) rather than reusing it, so a functional
       * recommendation never gets displayed as if it were an aesthetic one.
       */
      functionalGoal: FunctionalGoal | null;
      /**
       * Why bestFit entered the candidate pool (Phase 4B §4/§6) — 'general'
       * when no physique target was in play, not when a target existed but
       * bestFit didn't match it (that case doesn't reach here — see the
       * ranking hierarchy in decisionEngine.ts).
       */
      bestFitTargetMatch: TargetMatch;
      bestFit: Exercise;
      why: string;
      /** Why the movement itself is mechanically relevant — the exercise's own resistance_profile. */
      stimulus: string;
      programming: Programming;
      alternative: Exercise | null;
      alternativeWhy: string | null;
      watchOut: string[];
      complements: Exercise[];
    }
  | { status: 'missing-current-exercise'; reason: string }
  | { status: 'no-candidates'; reason: string };
