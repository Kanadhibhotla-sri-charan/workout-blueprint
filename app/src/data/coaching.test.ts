import { describe, expect, it } from 'vitest';
import { exercises, programming } from './index';

// Build-package exercises whose `reviewed` status was revoked because fields
// edited during the exercise expansion have not been reviewed yet (Next
// Quality Gate, docs/dev/reports/NEXT-QUALITY-GATE-ASSESSMENT.md §1.1).
// This list may only shrink: once an entry's edited fields are reviewed and
// the record is promoted back to `reviewed`, the assertion below fails until
// the entry is removed here. Emptied in Content Review batch 1 follow-up: all
// 16 diffs verified, three of them after owner-approved corrections.
const PENDING_DIFF_REVIEW: string[] = [];

// Phase 7 Stage 2: Build packages tell a lifter exactly which exercises to
// do, so every exercise a package uses must ship with real coaching — not
// just pass the validator's per-record `reviewed` gate, which a package
// could otherwise sidestep by referencing a needs-review exercise.
describe('coaching coverage for Build-package exercises', () => {
  const packageExerciseIds = [
    ...new Set(programming.developmentPackages.packages.flatMap((p) => p.exercises.map((e) => e.exercise_id))),
  ];
  const byId = new Map(exercises.map((e) => [e.id, e]));

  it.each(packageExerciseIds)('%s has technique cues and common mistakes', (id) => {
    const exercise = byId.get(id)!;
    expect(exercise.review_status).toBe(PENDING_DIFF_REVIEW.includes(id) ? 'needs-review' : 'reviewed');
    expect(exercise.technique_cues?.length ?? 0).toBeGreaterThanOrEqual(3);
    expect(exercise.common_mistakes?.length ?? 0).toBeGreaterThanOrEqual(2);
  });

  it('every pending-diff-review entry is a Build-package exercise', () => {
    expect(PENDING_DIFF_REVIEW.filter((id) => !packageExerciseIds.includes(id))).toEqual([]);
  });
});
