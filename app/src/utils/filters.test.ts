import { describe, expect, it } from 'vitest';
import { applyFilters, EMPTY_FILTERS, hasActiveFilters } from './filters';
import { exercises } from '../data';

// Per PHASE-3-MVP.md §24 "Filtering": individual filters, combined filters,
// no-result state.
describe('applyFilters', () => {
  it('an individual filter narrows correctly', () => {
    const results = applyFilters(exercises, { ...EMPTY_FILTERS, region: 'chest' });
    expect(results.length).toBeGreaterThan(0);
    for (const result of results) {
      expect(result.body_regions).toContain('chest');
    }
  });

  it('combined filters reproduce the spec §12 worked example (Chest + Cable + Isolation + Low fatigue)', () => {
    const results = applyFilters(exercises, {
      ...EMPTY_FILTERS,
      region: 'chest',
      equipment: 'cable',
      exerciseType: 'isolation',
      fatigueCost: 'low',
    });
    expect(results.map((e) => e.id)).toEqual(['cable-fly']);
  });

  it('an impossible combination returns an empty result, not an error', () => {
    const results = applyFilters(exercises, {
      ...EMPTY_FILTERS,
      region: 'chest',
      equipment: 'sandbag',
    });
    expect(results).toHaveLength(0);
  });

  it('no filters active returns everything unfiltered', () => {
    expect(applyFilters(exercises, EMPTY_FILTERS)).toHaveLength(exercises.length);
  });
});

describe('hasActiveFilters', () => {
  it('is false for the empty filter set', () => {
    expect(hasActiveFilters(EMPTY_FILTERS)).toBe(false);
  });

  it('is true once any single filter is set', () => {
    expect(hasActiveFilters({ ...EMPTY_FILTERS, region: 'chest' })).toBe(true);
  });
});
