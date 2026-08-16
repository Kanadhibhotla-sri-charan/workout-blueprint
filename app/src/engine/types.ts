import type { Exercise } from '../types/exercise';
import type { DEMAND_LEVELS } from '../utils/filters';

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

export interface DecisionInput {
  bodyRegion: string;
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
      bestFit: Exercise;
      why: string;
      alternative: Exercise | null;
      alternativeWhy: string | null;
      watchOut: string[];
      complements: Exercise[];
    }
  | { status: 'missing-current-exercise'; reason: string }
  | { status: 'no-candidates'; reason: string };
