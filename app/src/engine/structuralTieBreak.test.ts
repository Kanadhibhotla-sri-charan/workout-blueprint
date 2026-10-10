import { describe, expect, it } from 'vitest';
import { exercises, getPhysiqueTargetById } from '../data';
import type { Exercise } from '../types/exercise';
import { rankStructuralAlternatives } from './alternatives';
import { rankStructuralComplements } from './complements';
import { makeRecommendation } from './decisionEngine';
import { compareStructuralTie, equipmentContinuity } from './structuralTieBreak';
import type { DecisionInput, Goal } from './types';

// Quality Gate stage 2: the shared structural tie-break (role → curated
// overlap → equipment continuity → id), applied only after the structural
// rankers' own target and coverage keys tie.

const TEMPLATE = exercises.find((e) => e.id === 'dumbbell-curl')!;

function fixture(id: string, overrides: Partial<Exercise> = {}): Exercise {
  return {
    ...TEMPLATE,
    id,
    name: id,
    body_regions: ['arms'],
    primary_targets: ['biceps'],
    physique_targets: ['biceps'],
    movement_patterns: ['elbow flexion'],
    exercise_type: 'isolation',
    coverage_categories: ['isolation'],
    equipment: ['dumbbell'],
    equipment_setups: null,
    overlaps_with: [],
    alternatives: [],
    complements: [],
    selection_role: null,
    review_status: 'needs-review',
    ...overrides,
  };
}

const setups = (...list: string[][]): Partial<Exercise> => ({ equipment: [...new Set(list.flat())], equipment_setups: list.length > 1 ? list : null });

describe('equipmentContinuity (usable-setup rule)', () => {
  const current = fixture('current', setups(['dumbbell']));

  it('counts every candidate setup when equipment is unrestricted', () => {
    expect(equipmentContinuity(current, fixture('c', setups(['cable'], ['dumbbell'])), null)).toBe(1);
  });

  it('counts only the candidate setups usable in this context', () => {
    const candidate = fixture('c', setups(['cable'], ['dumbbell']));
    expect(equipmentContinuity(current, candidate, ['cable'])).toBe(0);
    expect(equipmentContinuity(current, candidate, ['dumbbell'])).toBe(1);
  });

  it("counts all of the current exercise's setups, usable or not", () => {
    const barbellOnly = fixture('current', setups(['barbell', 'ez-bar']));
    expect(equipmentContinuity(barbellOnly, fixture('c', setups(['barbell'], ['band'])), ['barbell'])).toBe(1);
    const twoSetups = fixture('current', setups(['barbell'], ['dumbbell']));
    expect(equipmentContinuity(twoSetups, fixture('c', setups(['dumbbell'])), ['dumbbell'])).toBe(1);
  });

  it('takes the best-matching pair of setups', () => {
    const multi = fixture('current', setups(['cable', 'rope attachment'], ['band']));
    expect(equipmentContinuity(multi, fixture('c', setups(['cable', 'rope attachment'], ['dumbbell'])), null)).toBe(2);
  });

  it('is 0 when nothing is shared', () => {
    expect(equipmentContinuity(current, fixture('c', setups(['cable'])), null)).toBe(0);
  });

  it('never counts bodyweight, bench or incline bench', () => {
    const supported = fixture('current', setups(['bodyweight', 'bench', 'incline bench']));
    expect(equipmentContinuity(supported, fixture('c', setups(['bodyweight', 'bench', 'incline bench'])), null)).toBe(0);
  });

  it('refuses a candidate with no usable setup (the rankers filter those out first)', () => {
    expect(() => equipmentContinuity(current, fixture('c', setups(['cable'])), ['dumbbell'])).toThrow(/no usable setup/);
  });
});

describe('compareStructuralTie order', () => {
  const current = fixture('current', { ...setups(['dumbbell']), overlaps_with: ['b-overlap'] });
  const rank = (mode: 'substitute' | 'complement', ...pool: Exercise[]) =>
    [...pool].sort((a, b) => compareStructuralTie(current, a, b, mode, null)).map((e) => e.id);

  it('secondary role comes first: an unclassified record beats a secondary overlap', () => {
    const secondaryOverlap = fixture('b-overlap', { selection_role: 'secondary' });
    expect(rank('substitute', secondaryOverlap, fixture('z-plain'))).toEqual(['z-plain', 'b-overlap']);
  });

  it('overlap beats equipment continuity, preferred for a substitute', () => {
    const overlap = fixture('b-overlap', setups(['cable']));
    expect(rank('substitute', fixture('a-same-kit', setups(['dumbbell'])), overlap)).toEqual(['b-overlap', 'a-same-kit']);
  });

  it('overlap is avoided for a complement', () => {
    const overlap = fixture('b-overlap', setups(['dumbbell']));
    expect(rank('complement', overlap, fixture('z-other', setups(['cable'])))).toEqual(['z-other', 'b-overlap']);
  });

  it('the overlap is symmetric: a candidate listing the current exercise counts', () => {
    const listsCurrent = fixture('z-lists-current', { overlaps_with: ['current (arms module)'] });
    expect(rank('substitute', fixture('a-plain'), listsCurrent)).toEqual(['z-lists-current', 'a-plain']);
  });

  it('equipment continuity beats the id', () => {
    expect(rank('substitute', fixture('a-cable', setups(['cable'])), fixture('z-dumbbell', setups(['dumbbell'])))).toEqual(['z-dumbbell', 'a-cable']);
  });

  it('the id decides last', () => {
    expect(rank('substitute', fixture('z-curl'), fixture('a-curl'))).toEqual(['a-curl', 'z-curl']);
  });
});

describe('structural rankers keep their own keys first', () => {
  const current = fixture('current', { primary_targets: ['biceps', 'brachialis'], coverage_categories: ['isolation', 'lengthened-position-emphasis'], overlaps_with: ['z-overlap'] });

  it('replace: more shared targets, then more shared coverage, beat every tie-break key', () => {
    const tieBreakFavourite = fixture('z-overlap', { primary_targets: ['biceps'] });
    const moreTargets = fixture('y-targets', { primary_targets: ['biceps', 'brachialis'], selection_role: 'secondary', ...setups(['cable']) });
    expect(rankStructuralAlternatives(current, [tieBreakFavourite, moreTargets]).map((e) => e.id)).toEqual(['y-targets', 'z-overlap']);
    const moreCoverage = fixture('y-coverage', { primary_targets: ['biceps'], coverage_categories: ['isolation', 'lengthened-position-emphasis'], ...setups(['cable']) });
    expect(rankStructuralAlternatives(current, [tieBreakFavourite, moreCoverage]).map((e) => e.id)).toEqual(['y-coverage', 'z-overlap']);
  });

  it('complement: fewer shared coverage categories beat every tie-break key', () => {
    const pattern = { movement_patterns: ['elbow extension'] };
    const tieBreakFavourite = fixture('a-plain', { ...pattern, coverage_categories: ['isolation', 'lengthened-position-emphasis'] });
    const lessCoverage = fixture('z-overlap', { ...pattern, coverage_categories: ['isolation'], selection_role: 'secondary' });
    expect(rankStructuralComplements(current, [tieBreakFavourite, lessCoverage]).map((e) => e.id)).toEqual(['z-overlap', 'a-plain']);
  });
});

describe('library-order determinism', () => {
  const current = exercises.find((e) => e.id === 'incline-dumbbell-curl')!;
  const rotations = <T,>(list: T[]) => list.map((_, i) => [...list.slice(i), ...list.slice(0, i)]);

  it('replace and complement rankings are identical for any library order', () => {
    for (const equipment of [null, ['dumbbell', 'band'], ['band', 'pull-up bar']]) {
      const expectedAlt = rankStructuralAlternatives(current, exercises, equipment).map((e) => e.id);
      const expectedComp = rankStructuralComplements(current, exercises, equipment).map((e) => e.id);
      for (const pool of [...rotations(exercises), [...exercises].reverse()]) {
        expect(rankStructuralAlternatives(current, pool, equipment).map((e) => e.id)).toEqual(expectedAlt);
        expect(rankStructuralComplements(current, pool, equipment).map((e) => e.id)).toEqual(expectedComp);
      }
    }
  });
});

describe('pinned representative cases (NEXT-QUALITY-GATE-ASSESSMENT.md §5)', () => {
  const GYM = ['45-degree hyperextension bench', 'ab wheel', 'band', 'barbell', 'bench', 'block or plate', 'bodyweight', 'cable', 'dip bars', 'dumbbell', 'ez-bar', "farmer's handles", 'harness', 'hip-thrust machine', 'incline bench', 'kettlebell', 'landmine', 'leg press machine', 'machine', 'medicine ball', 'offset-loaded handle', 'plate', 'power rack', 'preacher bench', 'pull-up bar', 'rack', 'rope attachment', 'smith machine', 't-bar', 'wall'];
  const HOME = ['dumbbell', 'bench', 'incline bench', 'pull-up bar', 'band'];
  const BAND_KIT = ['band', 'pull-up bar'];
  // [current exercise, goal, expected Best Fit, physique target, equipment, tolerance limit]
  const cases: [string, Goal, string, string, string[], 'skill' | null][] = [
    ['chest-supported-row', 'replace-exercise', 'seated-cable-row', 'back-thickness', GYM, null],
    ['incline-barbell-press', 'replace-exercise', 'incline-machine-press', 'upper-pec', GYM, 'skill'],
    ['back-squat', 'replace-exercise', 'goblet-squat', 'quads', HOME, null],
    ['preacher-curl', 'replace-exercise', 'dumbbell-curl', 'biceps', HOME, null],
    ['machine-reverse-fly', 'replace-exercise', 'rear-delt-fly', 'rear-delt', GYM, null],
    ['lying-triceps-extension-skull-crusher', 'replace-exercise', 'overhead-triceps-extension', 'triceps', GYM, null],
    ['incline-dumbbell-curl', 'replace-exercise', 'dumbbell-curl', 'biceps', GYM, null],
    ['ab-wheel-rollout', 'complement-current', 'reverse-crunch', 'rectus-abdominis', HOME, null],
    ['hip-thrust', 'complement-current', 'single-leg-romanian-deadlift', 'gluteus-maximus', BAND_KIT, null],
  ];

  it.each(cases)('%s (%s) → %s', (current, goal, expected, targetId, equipment, limit) => {
    const target = getPhysiqueTargetById(targetId)!;
    const input: DecisionInput = {
      bodyRegion: target.parent_region, physiqueTarget: targetId, supportingPhysiqueTargets: null, aestheticOutcome: null,
      functionalGoal: null, goal, equipmentAvailable: equipment, maxSetupTime: null, maxFatigueCost: null,
      maxStabilityDemand: null, maxSkillDemand: limit === 'skill' ? 'low' : null, currentExerciseId: current,
    };
    const result = makeRecommendation(input, exercises);
    if (result.status !== 'ok') throw new Error(`expected a recommendation, got ${result.status}`);
    expect(result.bestFit.id).toBe(expected);
    if (goal === 'complement-current') {
      const different = makeRecommendation({ ...input, goal: 'different-stimulus' }, exercises);
      expect(different.status === 'ok' && different.bestFit.id).toBe(expected);
    }
  });
});
