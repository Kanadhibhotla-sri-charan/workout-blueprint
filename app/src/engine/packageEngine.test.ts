import { describe, expect, it } from 'vitest';
import { programming } from '../data';
import { getMuscleGroups, getPackagesForMuscleGroup, resolvePackage } from './packageEngine';

describe('packageEngine', () => {
  it('exposes all 11 supported muscle groups (Phase 5 §12)', () => {
    const groups = getMuscleGroups();
    expect(groups.map((g) => g.id).sort()).toEqual(
      ['back', 'biceps', 'calves', 'chest', 'core', 'forearms', 'glutes', 'hamstrings', 'quads', 'shoulders', 'triceps'].sort()
    );
  });

  it('every muscle group has both an efficient and a complete package (§3)', () => {
    for (const group of getMuscleGroups()) {
      const packages = getPackagesForMuscleGroup(group.id);
      const levels = packages.map((p) => p.level).sort();
      expect(levels, `muscle group "${group.id}"`).toEqual(['complete', 'efficient']);
    }
  });

  it('returns null for an unknown package id', () => {
    expect(resolvePackage('does-not-exist')).toBeNull();
  });

  it('matches the spec\'s own worked weekly-volume example for chest-efficient (§7)', () => {
    const resolved = resolvePackage('chest-efficient');
    expect(resolved).not.toBeNull();
    expect(resolved!.sessionDirectSets).toBe(8);
    expect(resolved!.weeklyDirectSets).toBe(16);
  });

  it('every package has at least 2 distinct exercises, ordered, sets summing correctly, and full target coverage', () => {
    for (const pkg of programming.developmentPackages.packages) {
      const resolved = resolvePackage(pkg.id);
      expect(resolved, `package "${pkg.id}"`).not.toBeNull();

      const ids = resolved!.exercises.map((e) => e.exercise.id);
      expect(new Set(ids).size, `package "${pkg.id}" exercise ids`).toBe(ids.length);
      expect(ids.length, `package "${pkg.id}" exercise count`).toBeGreaterThanOrEqual(2);

      const orders = resolved!.exercises.map((e) => e.entry.order);
      expect(orders, `package "${pkg.id}" order`).toEqual([...orders].sort((a, b) => a - b));

      const expectedSessionSets = pkg.exercises.reduce((sum, e) => sum + e.sets, 0);
      expect(resolved!.sessionDirectSets, `package "${pkg.id}" session sets`).toBe(expectedSessionSets);
      expect(resolved!.weeklyDirectSets, `package "${pkg.id}" weekly sets`).toBe(
        expectedSessionSets * pkg.frequency.sessions_per_week
      );

      // §23 "Major visual characteristics are meaningfully covered" +
      // "Important uncovered characteristics are explained" — every real
      // target belonging to this package's muscle group must be covered,
      // with one documented exception: front-delt is deliberately left
      // out of every shoulders package because the knowledge base itself
      // (physique-targets.yaml) notes it's already heavily loaded by
      // standard chest/shoulder pressing elsewhere — the package's own
      // `rationale` field says so explicitly, so this is an explained
      // gap, not an oversight.
      for (const coverage of resolved!.targetCoverage) {
        const isDocumentedException = pkg.muscle_group === 'shoulders' && coverage.targetId === 'front-delt';
        expect(coverage.covered || isDocumentedException, `package "${pkg.id}" target "${coverage.targetId}" coverage`).toBe(true);
      }

      // Every exercise resolves an intensity-technique decision (possibly
      // "none", but never silently absent — programmingEngine.ts always
      // returns a context string).
      for (const resolvedExercise of resolved!.exercises) {
        expect(resolvedExercise.intensityTechniqueContext.length, `package "${pkg.id}" :: ${resolvedExercise.exercise.id}`).toBeGreaterThan(0);
      }
    }
  });

  it('Complete packages are supersets in ambition, not just longer for its own sake — every Complete has strictly more exercises than its Efficient sibling', () => {
    for (const group of getMuscleGroups()) {
      const packages = getPackagesForMuscleGroup(group.id);
      const efficient = packages.find((p) => p.level === 'efficient')!;
      const complete = packages.find((p) => p.level === 'complete')!;
      expect(complete.exercises.length, `muscle group "${group.id}"`).toBeGreaterThan(efficient.exercises.length);
    }
  });
});
