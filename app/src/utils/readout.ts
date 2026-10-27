import type { Exercise } from '../types/exercise';

export const SAMPLE_SETS = 3;

/** Minutes for SAMPLE_SETS sets: setup + work (both sides if per side) + rests between sets. */
export function sampleMinutes(time: NonNullable<Exercise['time']>): [number, number] {
  const sides = time.per_side ? 2 : 1;
  const work = SAMPLE_SETS * time.seconds_per_set * sides;
  const rests = SAMPLE_SETS - 1;
  const low = time.setup_minutes + (work + rests * time.rest_seconds[0]) / 60;
  const high = time.setup_minutes + (work + rests * time.rest_seconds[1]) / 60;
  return [Math.max(1, Math.round(low)), Math.max(1, Math.round(high))];
}
