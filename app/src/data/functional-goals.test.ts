import { describe, expect, it } from 'vitest';
import { exercises, functionalGoals, getFunctionalGoalById, getFunctionalGoalsByRegion } from './index';

// Generic taxonomy-integrity checks, mirroring physique-targets.test.ts and
// aesthetic-outcomes.test.ts's approach for the Function branch (4J).
describe('functional-goals taxonomy', () => {
  it('every defined goal resolves and has non-empty required fields', () => {
    for (const goal of functionalGoals) {
      expect(getFunctionalGoalById(goal.id)).toBeDefined();
      expect(goal.name.length).toBeGreaterThan(0);
      expect(goal.parent_region.length).toBeGreaterThan(0);
      expect(goal.definition.length).toBeGreaterThan(0);
      expect(goal.why_it_matters.length).toBeGreaterThan(0);
    }
  });

  it('every non-null functional_goals entry on every exercise resolves to a real goal', () => {
    const goalIds = new Set(functionalGoals.map((g) => g.id));
    for (const exercise of exercises) {
      for (const id of exercise.functional_goals ?? []) {
        expect(goalIds.has(id)).toBe(true);
      }
    }
  });

  it('every tagged exercise shares at least one body_regions value with its goal\'s parent_region', () => {
    for (const exercise of exercises) {
      for (const id of exercise.functional_goals ?? []) {
        const goal = getFunctionalGoalById(id)!;
        expect(exercise.body_regions).toContain(goal.parent_region);
      }
    }
  });

  it('every defined goal has at least one exercise', () => {
    for (const goal of functionalGoals) {
      const matches = exercises.filter((e) => e.functional_goals?.includes(goal.id));
      expect(matches.length).toBeGreaterThan(0);
    }
  });

  it('getFunctionalGoalsByRegion only returns goals for that region', () => {
    for (const region of new Set(functionalGoals.map((g) => g.parent_region))) {
      const results = getFunctionalGoalsByRegion(region);
      expect(results.length).toBeGreaterThan(0);
      for (const goal of results) {
        expect(goal.parent_region).toBe(region);
      }
    }
  });

  it('hip-abduction and hip-adduction are dual-purpose — tagged both aesthetically and functionally', () => {
    const abduction = exercises.find((e) => e.id === 'hip-abduction')!;
    const adduction = exercises.find((e) => e.id === 'hip-adduction')!;
    expect(abduction.physique_targets).toContain('gluteus-medius-minimus');
    expect(abduction.functional_goals).toContain('hip-stability');
    expect(adduction.physique_targets).toContain('adductors');
    expect(adduction.functional_goals).toContain('hip-stability');
  });
});
