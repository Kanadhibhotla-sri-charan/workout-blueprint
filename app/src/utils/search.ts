import type { Exercise } from '../types/exercise';

// Search surface per PHASE-3-MVP.md §11: name, summary, why this exists,
// body regions, primary/secondary targets, movement patterns, mirror
// effect, best-used-when, equipment. No semantic/fuzzy matching — plain
// substring matching over the structured metadata already available, as
// the spec explicitly asks for ("Search does not need semantic AI").
function searchableText(exercise: Exercise): string {
  return [
    exercise.name,
    exercise.summary,
    exercise.why_this_exists,
    exercise.mirror_effect,
    ...exercise.body_regions,
    ...exercise.primary_targets,
    ...(exercise.secondary_targets ?? []),
    ...exercise.movement_patterns,
    ...exercise.best_used_when,
    ...exercise.equipment,
  ]
    .join(' ')
    .toLowerCase();
}

// Every whitespace-separated term in the query must appear somewhere in an
// exercise's searchable text (not necessarily adjacent) — handles multi-word
// queries like "upper chest" or "rear delt" even when the source text uses a
// hyphen ("upper-chest-biased") rather than a space between the words.
export function searchExercises(exercises: Exercise[], query: string): Exercise[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return exercises;

  return exercises.filter((exercise) => {
    const text = searchableText(exercise);
    return terms.every((term) => text.includes(term));
  });
}
