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

  it('every outcome has at least one primary target, and every primary_targets/supporting_targets entry resolves to a real target', () => {
    const targetIds = new Set(physiqueTargets.map((t) => t.id));
    for (const outcome of aestheticOutcomes) {
      expect(outcome.primary_targets.length).toBeGreaterThan(0);
      for (const id of outcome.primary_targets) {
        expect(targetIds.has(id)).toBe(true);
      }
      for (const id of outcome.supporting_targets ?? []) {
        expect(targetIds.has(id)).toBe(true);
      }
    }
  });

  it('supporting_targets never repeats a primary target on the same outcome (Phase 4 Corrections §7)', () => {
    for (const outcome of aestheticOutcomes) {
      for (const id of outcome.supporting_targets ?? []) {
        expect(outcome.primary_targets).not.toContain(id);
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

  it('the chest-side-projection golden-slice outcome has upper-pec as primary and lower-pec as supporting', () => {
    const outcome = getAestheticOutcomeById('chest-side-projection')!;
    expect(outcome.primary_targets).toEqual(['upper-pec']);
    expect(outcome.supporting_targets).toEqual(['lower-pec']);
  });

  it('the triceps-back-depth golden-slice outcome has triceps as primary and triceps-long-head as supporting', () => {
    const outcome = getAestheticOutcomeById('triceps-back-depth')!;
    expect(outcome.primary_targets).toEqual(['triceps']);
    expect(outcome.supporting_targets).toEqual(['triceps-long-head']);
  });

  it('the arm-side-thickness multi-target golden-slice outcome has brachialis-arm-thickness as primary and triceps as supporting', () => {
    const outcome = getAestheticOutcomeById('arm-side-thickness')!;
    expect(outcome.primary_targets).toEqual(['brachialis-arm-thickness']);
    expect(outcome.supporting_targets).toEqual(['triceps']);
  });
});
