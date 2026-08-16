import { describe, expect, it } from 'vitest';
import { isEquipmentFeasible } from './equipment';
import { getExerciseById } from '../data';

describe('isEquipmentFeasible', () => {
  const dumbbellPress = getExerciseById('incline-dumbbell-press')!;

  it('passes everything when no constraint is engaged (null)', () => {
    expect(isEquipmentFeasible(dumbbellPress, null)).toBe(true);
  });

  it('passes when every required item is available', () => {
    expect(isEquipmentFeasible(dumbbellPress, ['dumbbell', 'bench', 'rack'])).toBe(true);
  });

  it('fails when a required item is missing', () => {
    expect(isEquipmentFeasible(dumbbellPress, ['dumbbell'])).toBe(false);
  });

  it('fails everything requiring equipment when the user has none ([])', () => {
    expect(isEquipmentFeasible(dumbbellPress, [])).toBe(false);
  });

  it('does not fuzzy-match near-miss equipment strings', () => {
    // "dumbbells" (plural) is not a value that exists in the dataset, but
    // this proves the check is exact-string, not substring/synonym based.
    expect(isEquipmentFeasible(dumbbellPress, ['dumbbells', 'bench'])).toBe(false);
  });
});
