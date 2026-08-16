import { describe, expect, it } from 'vitest';
import { aestheticOutcomes, getAestheticOutcomeById, getAestheticOutcomesByRegion, physiqueTargets } from './index';

// Generic taxonomy-integrity checks, run over every defined outcome rather
// than one test per outcome — mirrors physique-targets.test.ts's approach,
// so this doesn't need editing every time 4I adds more outcomes.
describe('aesthetic-outcomes taxonomy', () => {
  it('every defined outcome resolves and has non-empty required fields', () => {
    for (const outcome of aestheticOutcomes) {
      expect(getAestheticOutcomeById(outcome.id)).toBeDefined();
      expect(outcome.display_name.length).toBeGreaterThan(0);
      expect(outcome.region.length).toBeGreaterThan(0);
      expect(outcome.viewpoint.length).toBeGreaterThan(0);
      expect(outcome.visual_description.length).toBeGreaterThan(0);
    }
  });

  it('every outcome maps to at least one physique target, and every mapped target resolves to a real target', () => {
    const targetIds = new Set(physiqueTargets.map((t) => t.id));
    for (const outcome of aestheticOutcomes) {
      expect(outcome.physique_targets.length).toBeGreaterThan(0);
      for (const id of outcome.physique_targets) {
        expect(targetIds.has(id)).toBe(true);
      }
    }
  });

  it('getAestheticOutcomesByRegion only returns outcomes for that region', () => {
    for (const region of new Set(aestheticOutcomes.map((o) => o.region))) {
      const results = getAestheticOutcomesByRegion(region);
      expect(results.length).toBeGreaterThan(0);
      for (const outcome of results) {
        expect(outcome.region).toBe(region);
      }
    }
  });

  it('the chest-side-projection golden-slice outcome maps to upper-pec and lower-pec', () => {
    const outcome = getAestheticOutcomeById('chest-side-projection')!;
    expect(outcome.physique_targets).toEqual(expect.arrayContaining(['upper-pec', 'lower-pec']));
  });

  it('the triceps-back-depth golden-slice outcome maps to triceps and triceps-long-head', () => {
    const outcome = getAestheticOutcomeById('triceps-back-depth')!;
    expect(outcome.physique_targets).toEqual(expect.arrayContaining(['triceps', 'triceps-long-head']));
  });
});
