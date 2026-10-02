import {
  bodyRegions,
  equipmentOptions,
  getAestheticOutcomeById,
  getExerciseById,
  getFunctionalGoalById,
  physiqueTargets,
} from '../data';
import { GOALS } from '../engine/types';
import type { DecisionInput, DemandLevel, Goal } from '../engine/types';
import { DEMAND_LEVELS } from './filters';

// Decide's URL state (Phase 7 Stage 4). The URL holds the *submitted*
// decision — exactly what's needed to rebuild the DecisionInput and the
// form that produced it — so refreshing, sharing, and back/forward all
// reproduce the same recommendation. Unsubmitted edits stay local.
//
// Parameters, always written in this order with canonical ids only:
//   outcome | function | target | region   (one selection; see below)
//   goal, equipment (repeated; present-but-empty = bodyweight only),
//   setup, fatigue, stability, skill, current
//
// The selection is stored as the single id the form resolved it from:
// an aesthetic outcome (Appearance), a functional goal (Function), or a
// physique target / body region (Direct / Advanced). Region, primary and
// supporting targets are re-derived from that id exactly as the form's own
// handlers derive them. Invalid or unknown values are dropped one by one,
// never thrown on; with no valid selection or goal there's no result and
// the form simply starts from its defaults for the missing parts.

export type EntryMode = 'appearance' | 'function' | 'advanced';
export type DemandChoice = DemandLevel | '';

export interface DecisionFormState {
  entryMode: EntryMode;
  appearanceRegion: string;
  aestheticOutcomeId: string;
  functionalRegion: string;
  functionalGoalId: string;
  bodyRegion: string;
  physiqueTarget: string;
  supportingPhysiqueTargets: string[];
  goal: Goal | '';
  restrictEquipment: boolean;
  equipmentAvailable: string[];
  maxSetupTime: DemandChoice;
  maxFatigueCost: DemandChoice;
  maxStabilityDemand: DemandChoice;
  maxSkillDemand: DemandChoice;
  currentExerciseId: string;
}

export const EMPTY_DECISION_FORM: DecisionFormState = {
  entryMode: 'appearance',
  appearanceRegion: '',
  aestheticOutcomeId: '',
  functionalRegion: '',
  functionalGoalId: '',
  bodyRegion: '',
  physiqueTarget: '',
  supportingPhysiqueTargets: [],
  goal: '',
  restrictEquipment: false,
  equipmentAvailable: [],
  maxSetupTime: '',
  maxFatigueCost: '',
  maxStabilityDemand: '',
  maxSkillDemand: '',
  currentExerciseId: '',
};

const DEMAND_PARAMS = [
  ['setup', 'maxSetupTime'],
  ['fatigue', 'maxFatigueCost'],
  ['stability', 'maxStabilityDemand'],
  ['skill', 'maxSkillDemand'],
] as const;

export function encodeDecisionInput(input: DecisionInput): URLSearchParams {
  const params = new URLSearchParams();
  if (input.aestheticOutcome) params.set('outcome', input.aestheticOutcome);
  else if (input.functionalGoal) params.set('function', input.functionalGoal);
  else if (input.physiqueTarget) params.set('target', input.physiqueTarget);
  else params.set('region', input.bodyRegion);
  params.set('goal', input.goal);
  if (input.equipmentAvailable !== null) {
    const items = [...new Set(input.equipmentAvailable)].sort();
    if (items.length === 0) params.append('equipment', '');
    for (const item of items) params.append('equipment', item);
  }
  for (const [param, field] of DEMAND_PARAMS) {
    const level = input[field];
    if (level) params.set(param, level);
  }
  if (input.currentExerciseId) params.set('current', input.currentExerciseId);
  return params;
}

function isDemandLevel(value: string | null): value is DemandLevel {
  return value !== null && (DEMAND_LEVELS as readonly string[]).includes(value);
}

function readSelection(params: URLSearchParams, form: DecisionFormState): void {
  const outcome = getAestheticOutcomeById(params.get('outcome') ?? '');
  const outcomeTarget = outcome && physiqueTargets.find((t) => t.id === outcome.primary_targets[0]);
  if (outcome && outcomeTarget) {
    form.entryMode = 'appearance';
    form.appearanceRegion = outcome.region;
    form.aestheticOutcomeId = outcome.id;
    form.physiqueTarget = outcomeTarget.id;
    form.supportingPhysiqueTargets = outcome.supporting_targets ?? [];
    form.bodyRegion = outcomeTarget.parent_region;
    return;
  }
  const functionalGoal = getFunctionalGoalById(params.get('function') ?? '');
  if (functionalGoal) {
    form.entryMode = 'function';
    form.functionalRegion = functionalGoal.parent_region;
    form.functionalGoalId = functionalGoal.id;
    form.bodyRegion = functionalGoal.parent_region;
    return;
  }
  const target = physiqueTargets.find((t) => t.id === params.get('target'));
  if (target) {
    form.entryMode = 'advanced';
    form.physiqueTarget = target.id;
    form.bodyRegion = target.parent_region;
    return;
  }
  const region = params.get('region');
  if (region && bodyRegions.includes(region)) {
    form.entryMode = 'advanced';
    form.bodyRegion = region;
  }
}

export interface DecodedDecision {
  form: DecisionFormState;
  // Null when the URL doesn't describe a complete, submittable decision.
  input: DecisionInput | null;
}

export function decodeDecisionParams(params: URLSearchParams): DecodedDecision {
  const form: DecisionFormState = { ...EMPTY_DECISION_FORM, supportingPhysiqueTargets: [], equipmentAvailable: [] };
  readSelection(params, form);

  const goal = params.get('goal');
  if (goal && (GOALS as string[]).includes(goal)) form.goal = goal as Goal;

  if (params.has('equipment')) {
    form.restrictEquipment = true;
    form.equipmentAvailable = [...new Set(params.getAll('equipment'))]
      .filter((item) => equipmentOptions.includes(item))
      .sort();
  }

  for (const [param, field] of DEMAND_PARAMS) {
    const level = params.get(param);
    if (isDemandLevel(level)) form[field] = level;
  }

  const current = params.get('current');
  if (current && getExerciseById(current)) form.currentExerciseId = current;

  return { form, input: form.bodyRegion && form.goal ? toDecisionInput(form) : null };
}

// The one place a form state becomes engine input — used both on submit
// and when rebuilding a decision from the URL, so the two can't drift.
export function toDecisionInput(form: DecisionFormState): DecisionInput {
  return {
    bodyRegion: form.bodyRegion,
    physiqueTarget: form.physiqueTarget || null,
    supportingPhysiqueTargets: form.supportingPhysiqueTargets.length > 0 ? form.supportingPhysiqueTargets : null,
    aestheticOutcome: form.aestheticOutcomeId || null,
    functionalGoal: form.functionalGoalId || null,
    goal: form.goal as Goal,
    equipmentAvailable: form.restrictEquipment ? form.equipmentAvailable : null,
    maxSetupTime: form.maxSetupTime || null,
    maxFatigueCost: form.maxFatigueCost || null,
    maxStabilityDemand: form.maxStabilityDemand || null,
    maxSkillDemand: form.maxSkillDemand || null,
    currentExerciseId: form.currentExerciseId || null,
  };
}
