import { describe, expect, it } from 'vitest';
import { rankStructuralComplements, resolveDeclaredComplements } from './complements';
import { exercises, getExerciseById } from '../data';

describe('resolveDeclaredComplements', () => {
  it('resolves the one bare-id complements entry incline-dumbbell-press has', () => {
    const target = getExerciseById('incline-dumbbell-press')!;
    const resolved = resolveDeclaredComplements(target, exercises);
    expect(resolved.map((e) => e.id)).toContain('cable-fly');
  });
});

describe('rankStructuralComplements — incline-dumbbell-press', () => {
  const target = getExerciseById('incline-dumbbell-press')!;

  it('never returns a candidate sharing the same movement pattern', () => {
    const ranked = rankStructuralComplements(target, exercises, null);
    for (const candidate of ranked) {
      expect(candidate.movement_patterns[0]).not.toBe(target.movement_patterns[0]);
    }
  });

  it('picks incline-dumbbell-fly as the top structural complement (verified against live data)', () => {
    const ranked = rankStructuralComplements(target, exercises, null);
    expect(ranked[0]?.id).toBe('incline-dumbbell-fly');
  });

  it('never returns the target itself', () => {
    const ranked = rankStructuralComplements(target, exercises, null);
    expect(ranked.some((e) => e.id === target.id)).toBe(false);
  });
});
