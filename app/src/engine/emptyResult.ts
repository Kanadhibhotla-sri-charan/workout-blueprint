import type { Exercise } from '../types/exercise';
import { ALWAYS_AVAILABLE, formatEquipmentOptions, isEquipmentFeasible } from './equipment';
import type { DecisionInput, EmptyResultExplanation, EquipmentUnlock, ToleranceLimit } from './types';

// Explains an empty Decide selection (Phase 7 Stage 5.3) from what the
// engine already knows — the selection's candidate pool, equipment
// feasibility and the tolerance filters — so the user sees *why* nothing
// fits and what, if anything, would change that. Message-level only: it
// never changes which exercises are eligible or how they rank, and it
// never suggests an exercise the pool doesn't already contain.
// Bodyweight coverage policy: docs/knowledge-manual/EQUIPMENT-COVERAGE-POLICY.md.

const LIMITS: { key: ToleranceLimit; field: keyof DecisionInput; label: string }[] = [
  { key: 'setup', field: 'maxSetupTime', label: 'time / setup tolerance' },
  { key: 'fatigue', field: 'maxFatigueCost', label: 'fatigue tolerance' },
  { key: 'stability', field: 'maxStabilityDemand', label: 'stability preference' },
  { key: 'skill', field: 'maxSkillDemand', label: 'skill preference' },
];

// "Bodyweight only": the user engaged the equipment constraint and has
// nothing beyond bodyweight.
function isBodyweightOnly(equipmentAvailable: string[] | null): boolean {
  return equipmentAvailable !== null && equipmentAvailable.every((item) => item === ALWAYS_AVAILABLE);
}

function byName(a: Exercise, b: Exercise): number {
  if (a.name !== b.name) return a.name < b.name ? -1 : 1;
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

function joinOr(items: string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} or ${items[items.length - 1]}`;
}

export function explainEmptySelection(
  pool: Exercise[],
  input: DecisionInput,
  subject: string,
  meetsLimits: (exercise: Exercise, input: DecisionInput) => boolean
): { reason: string; explanation: EmptyResultExplanation } {
  const meetsLimitsNow = (exercise: Exercise) => meetsLimits(exercise, input);
  const equipmentOk = pool.filter((exercise) => isEquipmentFeasible(exercise, input.equipmentAvailable));
  const limitsOk = pool.filter(meetsLimitsNow);
  const bodyweightGap =
    isBodyweightOnly(input.equipmentAvailable) && !pool.some((exercise) => isEquipmentFeasible(exercise, []));

  const activeLimits = LIMITS.filter((limit) => input[limit.field] !== null);
  // Limits that, relaxed on their own, would admit an exercise the user's
  // equipment already allows.
  const blockingLimits = activeLimits
    .filter((limit) => equipmentOk.some((exercise) => meetsLimits(exercise, { ...input, [limit.field]: null })))
    .map((limit) => limit.key);

  const unlocks: EquipmentUnlock[] = [...limitsOk].sort(byName).map((exercise) => ({
    exerciseId: exercise.id,
    exerciseName: exercise.name,
    equipment: formatEquipmentOptions(exercise),
  }));

  const gapSentence = `Blueprint has no bodyweight-only exercise that directly trains ${subject}. Some targets can't be meaningfully trained without equipment, and Blueprint doesn't substitute exercises that only work them indirectly.`;

  const blockingLabels = LIMITS.filter((limit) => blockingLimits.includes(limit.key)).map((limit) => limit.label);

  let kind: EmptyResultExplanation['kind'];
  let reason: string;
  if (pool.length === 0) {
    kind = 'no-exercises';
    reason = `Blueprint has no exercises for ${subject} yet.`;
  } else if (limitsOk.length > 0) {
    // Equipment is the blocker: a different setup would unlock these.
    kind = 'equipment';
    // When relaxing a limit would also work with the equipment the user
    // already has, say so — both are true, and that one needs no new kit.
    const alsoRelax =
      blockingLabels.length > 0
        ? ` Relaxing your ${joinOr(blockingLabels)} would also allow one with your current equipment.`
        : '';
    reason = bodyweightGap
      ? `${gapSentence} With equipment, these would fit:`
      : `None of the exercises for ${subject} that fit your limits can be done with the equipment you selected.${alsoRelax} With different equipment, these would fit:`;
  } else if (equipmentOk.length > 0) {
    kind = 'tolerance';
    const labels = blockingLabels;
    const opening =
      input.equipmentAvailable === null
        ? `Blueprint has exercises for ${subject}, but none fit your limits.`
        : `You have the equipment for ${subject}, but no exercise fits your limits.`;
    reason =
      labels.length > 0
        ? `${opening} Relaxing your ${joinOr(labels)} would allow one.`
        : `${opening} More than one limit would need relaxing.`;
  } else {
    kind = 'equipment-and-tolerance';
    const labels = activeLimits.map((limit) => limit.label);
    reason = `${bodyweightGap ? `${gapSentence} ` : ''}No exercise for ${subject} fits both your equipment and your ${joinOr(labels)}: each one would need different equipment and a relaxed limit.`;
  }

  return { reason, explanation: { kind, subject, bodyweightGap, blockingLimits, unlocks } };
}
