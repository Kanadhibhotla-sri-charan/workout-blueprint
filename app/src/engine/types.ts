import type { Exercise } from '../types/exercise';
import type { PhysiqueTarget } from '../types/programming';
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
