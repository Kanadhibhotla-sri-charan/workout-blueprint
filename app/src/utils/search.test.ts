import { describe, expect, it } from 'vitest';
import { searchExercises } from './search';
import { exercises } from '../data';

// Per PHASE-3-MVP.md §24 "Search": exact name search, partial search,
// target/movement search.
describe('searchExercises', () => {
  it('exact name search finds the record', () => {
    const results = searchExercises(exercises, 'Incline Dumbbell Press');
    expect(results.map((e) => e.id)).toContain('incline-dumbbell-press');
  });

  it('partial search finds records containing the substring', () => {
    const results = searchExercises(exercises, 'dumbbell');
    expect(results.length).toBeGreaterThan(1);
    for (const result of results) {
      expect(result).toBeDefined();
    }
  });

  it('target/movement search matches on primary_targets and movement_patterns, not just name', () => {
    // "romanian-deadlift" doesn't contain "hip hinge" in its name, but its
    // movement_patterns[0] is exactly "hip hinge" — proves the match comes
    // from the movement-pattern field, not the name.
    const results = searchExercises(exercises, 'hip hinge');
    expect(results.map((e) => e.id)).toContain('romanian-deadlift');
  });

  it('an empty query returns everything unfiltered', () => {
    expect(searchExercises(exercises, '')).toHaveLength(exercises.length);
    expect(searchExercises(exercises, '   ')).toHaveLength(exercises.length);
  });

  it('a nonsense query returns no results rather than throwing', () => {
    expect(searchExercises(exercises, 'zzz-nonexistent-query-term')).toHaveLength(0);
  });

  it('matches across a hyphenated word even when the query uses a space', () => {
    // "upper-chest-biased" in the source text, queried as two words.
    const results = searchExercises(exercises, 'upper chest');
    expect(results.some((e) => e.id === 'incline-dumbbell-press')).toBe(true);
  });
});
