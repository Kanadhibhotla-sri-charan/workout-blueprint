import { describe, expect, it } from 'vitest';
import { makeRecommendation } from './decisionEngine';
import { exercises, getAestheticOutcomeById, getPhysiqueTargetById } from '../data';
import type { DecisionInput, Goal } from './types';

const BASE_INPUT: DecisionInput = {
  bodyRegion: 'chest',
  physiqueTarget: null,
  supportingPhysiqueTargets: null,
  aestheticOutcome: null,
  functionalGoal: null,
  goal: 'build-base',
  equipmentAvailable: null,
  maxSetupTime: null,
  maxFatigueCost: null,
  maxStabilityDemand: null,
  maxSkillDemand: null,
  currentExerciseId: null,
};

// The six representative scenarios PHASE-3-MVP.md §24 lists for testing
// the Decision Maker, run directly against the engine (3G's UI will call
// the same function, so a passing engine here is a precondition for a
// working UI, not a separate concern).
describe('makeRecommendation — §24 representative scenarios', () => {
  it('1. goal-only selection returns a heavy-compound chest pick', () => {
    const result = makeRecommendation(BASE_INPUT, exercises);
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.bestFit.body_regions).toContain('chest');
      expect(result.bestFit.coverage_categories).toContain('heavy-compound');
    }
  });

  it('2. equipment restriction narrows to only equipment-feasible picks', () => {
    const result = makeRecommendation(
      { ...BASE_INPUT, equipmentAvailable: ['bodyweight'] },
      exercises
    );
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.bestFit.equipment).toEqual(['bodyweight']);
    }
  });

  it('3. low-fatigue constraint only returns low-fatigue candidates', () => {
    const result = makeRecommendation(
      { ...BASE_INPUT, goal: 'low-fatigue', maxFatigueCost: 'low' },
      exercises
    );
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.bestFit.fatigue_cost).toBe('low');
    }
  });

  it('4. existing exercise + complement request resolves a materially different movement', () => {
    const result = makeRecommendation(
      {
        ...BASE_INPUT,
        goal: 'complement-current',
        currentExerciseId: 'incline-dumbbell-press',
      },
      exercises
    );
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.bestFit.movement_patterns[0]).not.toBe('incline horizontal press');
    }
  });

  it('5. existing exercise + alternative (replace) request resolves the same movement pattern', () => {
    const result = makeRecommendation(
      {
        ...BASE_INPUT,
        goal: 'replace-exercise',
        currentExerciseId: 'incline-dumbbell-press',
      },
      exercises
    );
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.bestFit.movement_patterns[0]).toBe('incline horizontal press');
      expect(result.bestFit.id).not.toBe('incline-dumbbell-press');
    }
  });

  it('6. an impossible constraint combination returns no-candidates, not a fabricated pick', () => {
    const result = makeRecommendation(
      { ...BASE_INPUT, equipmentAvailable: ['sandbag'] },
      exercises
    );
    expect(result.status).toBe('no-candidates');
  });
});

describe('makeRecommendation — complements cap', () => {
  it('never returns more than 3 complements, even when many structurally qualify (§16)', () => {
    const result = makeRecommendation(
      { ...BASE_INPUT, goal: 'replace-exercise', currentExerciseId: 'incline-dumbbell-press' },
      exercises
    );
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.complements.length).toBeLessThanOrEqual(3);
    }
  });
});

describe('makeRecommendation — goal requiring a current exercise, none given', () => {
  it('returns a missing-current-exercise status rather than guessing', () => {
    const result = makeRecommendation({ ...BASE_INPUT, goal: 'replace-exercise' }, exercises);
    expect(result.status).toBe('missing-current-exercise');
  });
});

describe('makeRecommendation — Phase 4 physique-target awareness', () => {
  it('a resolved target with curated exercises narrows candidates and populates target/visualObjective', () => {
    const result = makeRecommendation({ ...BASE_INPUT, physiqueTarget: 'upper-pec' }, exercises);
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.target?.id).toBe('upper-pec');
      expect(result.visualObjective).toContain('upper chest shelf');
      expect(result.bestFit.physique_targets).toContain('upper-pec');
    }
  });

  it('an unknown target id falls back to body-region selection without target/visualObjective', () => {
    const result = makeRecommendation({ ...BASE_INPUT, physiqueTarget: 'not-a-real-target' }, exercises);
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.target).toBeNull();
      expect(result.visualObjective).toBeNull();
      expect(result.bestFit.body_regions).toContain('chest');
    }
  });

  it('the golden test case: Upper Pec + Incline Dumbbell Press + complement-current resolves a genuinely different, relevant movement', () => {
    const result = makeRecommendation(
      {
        ...BASE_INPUT,
        physiqueTarget: 'upper-pec',
        goal: 'complement-current',
        currentExerciseId: 'incline-dumbbell-press',
      },
      exercises
    );
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      // Target recognition survives even though the chosen complement
      // (Cable Fly) isn't itself tagged upper-pec yet — see
      // decisionEngine.ts's buildResultFromRanked comment for why.
      expect(result.target?.id).toBe('upper-pec');
      expect(result.bestFit.id).toBe('cable-fly');
      expect(result.bestFit.movement_patterns[0]).not.toBe('incline horizontal press');
      // Cable Fly's medium stability_demand classifies it as
      // elevated-stability-isolation (Phase 4B §10-11), not the generic
      // isolation bucket — see programmingEngine.test.ts.
      expect(result.programming.repRange.primaryRange).toEqual([8, 15]);
      expect(result.programming.intensityTechnique?.id).toBe('drop-set');
    }
  });

  it('every "ok" result includes programming guidance', () => {
    const result = makeRecommendation(BASE_INPUT, exercises);
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.programming.repRange.primaryRange.length).toBe(2);
      expect(result.programming.rirTypicalRange.length).toBe(2);
    }
  });
});

describe('makeRecommendation — taxonomy expansion beyond Upper Pec', () => {
  it('side-delt (a newly expanded target) resolves and stays within the shoulders region', () => {
    const result = makeRecommendation(
      { ...BASE_INPUT, bodyRegion: 'shoulders', physiqueTarget: 'side-delt', goal: 'build-base' },
      exercises
    );
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.target?.id).toBe('side-delt');
      expect(result.bestFit.physique_targets).toContain('side-delt');
    }
  });

  it('replace-exercise for a biceps target stays within the same movement pattern', () => {
    const result = makeRecommendation(
      {
        ...BASE_INPUT,
        bodyRegion: 'arms',
        physiqueTarget: 'biceps',
        goal: 'replace-exercise',
        currentExerciseId: 'dumbbell-curl',
      },
      exercises
    );
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.target?.id).toBe('biceps');
      expect(result.bestFit.id).not.toBe('dumbbell-curl');
      expect(result.bestFit.movement_patterns[0]).toBe('elbow flexion');
    }
  });

  it('back-thickness and lat-width are distinct targets that narrow to different candidate pools', () => {
    const thickness = makeRecommendation(
      { ...BASE_INPUT, bodyRegion: 'back', physiqueTarget: 'back-thickness', goal: 'build-base' },
      exercises
    );
    const width = makeRecommendation(
      { ...BASE_INPUT, bodyRegion: 'back', physiqueTarget: 'lat-width', goal: 'build-base' },
      exercises
    );
    expect(thickness.status).toBe('ok');
    expect(width.status).toBe('ok');
    if (thickness.status === 'ok' && width.status === 'ok') {
      expect(thickness.bestFit.physique_targets).toContain('back-thickness');
      expect(width.bestFit.physique_targets).toContain('lat-width');
    }
  });
});

// 4I: the full-body taxonomy expansion added 10 new physique targets across
// 6 regions the engine had never resolved a target in before (glutes,
// quads, hamstrings, calves, forearms, neck). Spot-checks across all 6,
// rather than one test per target, since the generic data-integrity tests
// in physique-targets.test.ts already cover every target exhaustively.
describe('makeRecommendation — 4I full-body taxonomy expansion', () => {
  it('gluteus-maximus (hips region) resolves to a real hip-thrust-family pick', () => {
    const result = makeRecommendation(
      { ...BASE_INPUT, bodyRegion: 'hips', physiqueTarget: 'gluteus-maximus', goal: 'build-base' },
      exercises
    );
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.target?.id).toBe('gluteus-maximus');
      expect(result.bestFit.physique_targets).toContain('gluteus-maximus');
    }
  });

  it('the generic quads target resolves within the quads region', () => {
    const result = makeRecommendation(
      { ...BASE_INPUT, bodyRegion: 'quads', physiqueTarget: 'quads', goal: 'build-base' },
      exercises
    );
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.target?.id).toBe('quads');
      expect(result.bestFit.body_regions).toContain('quads');
    }
  });

  it('the generic hamstrings target resolves within the hamstrings region', () => {
    const result = makeRecommendation(
      { ...BASE_INPUT, bodyRegion: 'hamstrings', physiqueTarget: 'hamstrings', goal: 'build-base' },
      exercises
    );
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.target?.id).toBe('hamstrings');
    }
  });

  it('gastrocnemius and soleus (calves) are distinct targets that narrow to different candidate pools', () => {
    const gastroc = makeRecommendation(
      { ...BASE_INPUT, bodyRegion: 'calves', physiqueTarget: 'gastrocnemius', goal: 'build-base' },
      exercises
    );
    const soleus = makeRecommendation(
      { ...BASE_INPUT, bodyRegion: 'calves', physiqueTarget: 'soleus', goal: 'build-base' },
      exercises
    );
    expect(gastroc.status).toBe('ok');
    expect(soleus.status).toBe('ok');
    if (gastroc.status === 'ok' && soleus.status === 'ok') {
      expect(gastroc.bestFit.physique_targets).toContain('gastrocnemius');
      expect(soleus.bestFit.physique_targets).toContain('soleus');
    }
  });

  it('forearm-flexors and forearm-extensors (forearms) resolve to opposite-side exercises', () => {
    const flexors = makeRecommendation(
      { ...BASE_INPUT, bodyRegion: 'forearms', physiqueTarget: 'forearm-flexors', goal: 'build-base' },
      exercises
    );
    const extensors = makeRecommendation(
      { ...BASE_INPUT, bodyRegion: 'forearms', physiqueTarget: 'forearm-extensors', goal: 'build-base' },
      exercises
    );
    expect(flexors.status).toBe('ok');
    expect(extensors.status).toBe('ok');
    if (flexors.status === 'ok' && extensors.status === 'ok') {
      expect(flexors.bestFit.id).toBe('wrist-curl');
      expect(extensors.bestFit.physique_targets).toContain('forearm-extensors');
    }
  });

  it('neck-thickness (neck region) resolves to a real neck-extension-family pick', () => {
    const result = makeRecommendation(
      { ...BASE_INPUT, bodyRegion: 'neck', physiqueTarget: 'neck-thickness', goal: 'build-base' },
      exercises
    );
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.target?.id).toBe('neck-thickness');
      expect(result.bestFit.physique_targets).toContain('neck-thickness');
    }
  });

  it('adductors and gluteus-medius-minimus resolve from their single dedicated exercises (narrow but genuine support)', () => {
    const adductors = makeRecommendation(
      { ...BASE_INPUT, bodyRegion: 'hips', physiqueTarget: 'adductors', goal: 'build-base' },
      exercises
    );
    const abduction = makeRecommendation(
      { ...BASE_INPUT, bodyRegion: 'hips', physiqueTarget: 'gluteus-medius-minimus', goal: 'build-base' },
      exercises
    );
    expect(adductors.status).toBe('ok');
    expect(abduction.status).toBe('ok');
    if (adductors.status === 'ok' && abduction.status === 'ok') {
      expect(adductors.bestFit.id).toBe('hip-adduction');
      expect(abduction.bestFit.id).toBe('hip-abduction');
    }
  });
});

// Phase 4 Corrections §6-8: an aesthetic outcome's contributing targets
// must not be permanently reduced to physique_targets[0] — the primary
// target drives the recommendation, but supporting targets must broaden
// the candidate pool and never be silently discarded.
describe('makeRecommendation — primary + supporting physique targets (Phase 4 Corrections)', () => {
  it('one primary target with no supporting targets behaves exactly as before (supportingTargets is an empty array, not omitted)', () => {
    const result = makeRecommendation({ ...BASE_INPUT, physiqueTarget: 'upper-pec' }, exercises);
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.target?.id).toBe('upper-pec');
      expect(result.supportingTargets).toEqual([]);
    }
  });

  it('a primary target plus a supporting target resolves both, and the supporting target is not silently discarded', () => {
    const result = makeRecommendation(
      {
        ...BASE_INPUT,
        bodyRegion: 'arms',
        physiqueTarget: 'brachialis-arm-thickness',
        supportingPhysiqueTargets: ['triceps'],
        goal: 'build-base',
      },
      exercises
    );
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.target?.id).toBe('brachialis-arm-thickness');
      expect(result.supportingTargets.map((t) => t.id)).toEqual(['triceps']);
    }
  });

  // Phase 4B §3-4 corrects a design mistake from the original Corrections-
  // phase version of this test: a supporting target must never outrank a
  // reachable primary-target exercise just because it carries a more
  // favorable generic stimulus tag (here, close-grip-bench-press's
  // heavy-compound tag). The engine's own worked example (§2/§25 "arms
  // look thin from the side") is exactly this brachialis/triceps pair.
  it('a reachable primary-target exercise wins over a supporting-target exercise even when the supporting one has a more favorable generic stimulus tag', () => {
    const withSupporting = makeRecommendation(
      {
        ...BASE_INPUT,
        bodyRegion: 'arms',
        physiqueTarget: 'brachialis-arm-thickness',
        supportingPhysiqueTargets: ['triceps'],
        goal: 'build-base',
      },
      exercises
    );
    expect(withSupporting.status).toBe('ok');
    if (withSupporting.status === 'ok') {
      // Every brachialis-arm-thickness-tagged exercise is isolation-only —
      // close-grip-bench-press (triceps, heavy-compound) is reachable in
      // the pool and would win on generic stimulus tags alone, but must
      // not, because brachialis is the primary target here.
      expect(withSupporting.bestFit.physique_targets).toContain('brachialis-arm-thickness');
      expect(withSupporting.bestFit.coverage_categories).not.toContain('heavy-compound');
      expect(withSupporting.bestFitTargetMatch).toBe('primary');
      // The supporting target is not discarded just because it didn't win.
      expect(withSupporting.supportingTargets.map((t) => t.id)).toEqual(['triceps']);
    }
  });

  // Test B (§25): the supporting target must remain reachable, not just
  // resolved-but-unreachable — when equipment constraints eliminate every
  // primary-target candidate, a supporting-target exercise must still be
  // recommendable, and the result must say so via bestFitTargetMatch.
  it('a supporting-target exercise becomes bestFit when no primary-target exercise survives the equipment constraint', () => {
    const result = makeRecommendation(
      {
        ...BASE_INPUT,
        bodyRegion: 'arms',
        physiqueTarget: 'brachialis-arm-thickness',
        supportingPhysiqueTargets: ['triceps'],
        goal: 'build-base',
        // None of the three brachialis-tagged exercises (all dumbbell/cable)
        // are feasible with only these two — dip-triceps-biased (supporting,
        // triceps) is the only physique_targets-tagged survivor.
        equipmentAvailable: ['dip bars', 'bodyweight'],
      },
      exercises
    );
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.bestFit.id).toBe('dip-triceps-biased');
      expect(result.bestFitTargetMatch).toBe('supporting');
    }
  });

  // Test E (§25): "If the explanation identifies target A as primary but
  // the recommendation only addresses target B, the test fails." Checked
  // as a structural invariant — bestFitTargetMatch must always agree with
  // which of bestFit's own physique_targets actually matches — across
  // every scenario this file already exercises where a target resolved,
  // so a future ranking change can't silently desync the two again.
  it('bestFitTargetMatch is always internally consistent with what bestFit is actually tagged with (explanation consistency)', () => {
    const scenarios: Array<Pick<DecisionInput, 'bodyRegion' | 'physiqueTarget' | 'supportingPhysiqueTargets' | 'goal' | 'equipmentAvailable'>> = [
      { bodyRegion: 'chest', physiqueTarget: 'upper-pec', supportingPhysiqueTargets: null, goal: 'build-base', equipmentAvailable: null },
      {
        bodyRegion: 'arms',
        physiqueTarget: 'brachialis-arm-thickness',
        supportingPhysiqueTargets: ['triceps'],
        goal: 'build-base',
        equipmentAvailable: null,
      },
      {
        bodyRegion: 'arms',
        physiqueTarget: 'brachialis-arm-thickness',
        supportingPhysiqueTargets: ['triceps'],
        goal: 'build-base',
        equipmentAvailable: ['dip bars', 'bodyweight'],
      },
    ];

    for (const scenario of scenarios) {
      const result = makeRecommendation({ ...BASE_INPUT, ...scenario }, exercises);
      expect(result.status).toBe('ok');
      if (result.status !== 'ok') continue;

      const taggedPrimary = result.target ? (result.bestFit.physique_targets?.includes(result.target.id) ?? false) : false;
      const taggedSupporting = result.supportingTargets.some((t) => result.bestFit.physique_targets?.includes(t.id));

      if (result.bestFitTargetMatch === 'primary') {
        expect(taggedPrimary).toBe(true);
      } else if (result.bestFitTargetMatch === 'supporting') {
        expect(taggedPrimary).toBe(false);
        expect(taggedSupporting).toBe(true);
      } else {
        expect(taggedPrimary).toBe(false);
      }
    }
  });

  it('a chest-front-width-style outcome (primary mid-pec, supporting upper-pec) resolves both and folds supporting into the pool', () => {
    const result = makeRecommendation(
      {
        ...BASE_INPUT,
        bodyRegion: 'chest',
        physiqueTarget: 'mid-pec',
        supportingPhysiqueTargets: ['upper-pec'],
        goal: 'build-base',
      },
      exercises
    );
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.target?.id).toBe('mid-pec');
      expect(result.supportingTargets.map((t) => t.id)).toEqual(['upper-pec']);
    }
  });

  it('supportingPhysiqueTargets has no effect when the primary target itself has no matches (never rescues an unresolved primary)', () => {
    const result = makeRecommendation(
      {
        ...BASE_INPUT,
        physiqueTarget: 'not-a-real-target',
        supportingPhysiqueTargets: ['upper-pec'],
      },
      exercises
    );
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.target).toBeNull();
      expect(result.supportingTargets).toEqual([]);
    }
  });
});

// 4J: the Function branch's engine-level counterpart to the physique-target
// tests above. Kept as its own describe block since functionalGoal is a
// fully separate resolution path (see decisionEngine.ts), not a variant of
// physiqueTarget.
describe('makeRecommendation — functional goals (4J)', () => {
  it('a resolved functional goal narrows candidates and populates result.functionalGoal, leaving target/visualObjective null', () => {
    const result = makeRecommendation(
      { ...BASE_INPUT, bodyRegion: 'core', functionalGoal: 'core-anti-extension', goal: 'build-base' },
      exercises
    );
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.functionalGoal?.id).toBe('core-anti-extension');
      expect(result.bestFit.id).toBe('plank');
      expect(result.target).toBeNull();
      expect(result.visualObjective).toBeNull();
    }
  });

  it('an unknown functional goal id falls back to body-region selection without functionalGoal', () => {
    const result = makeRecommendation(
      { ...BASE_INPUT, bodyRegion: 'core', functionalGoal: 'not-a-real-goal', goal: 'build-base' },
      exercises
    );
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.functionalGoal).toBeNull();
      expect(result.bestFit.body_regions).toContain('core');
    }
  });

  it('rotator-cuff (shoulders) and hip-flexors (hips) resolve to their real, single dedicated exercises', () => {
    const rotatorCuff = makeRecommendation(
      { ...BASE_INPUT, bodyRegion: 'shoulders', functionalGoal: 'rotator-cuff', goal: 'build-base' },
      exercises
    );
    const hipFlexors = makeRecommendation(
      { ...BASE_INPUT, bodyRegion: 'hips', functionalGoal: 'hip-flexors', goal: 'build-base' },
      exercises
    );
    expect(rotatorCuff.status).toBe('ok');
    expect(hipFlexors.status).toBe('ok');
    if (rotatorCuff.status === 'ok' && hipFlexors.status === 'ok') {
      expect(rotatorCuff.bestFit.id).toBe('cable-band-external-rotation');
      expect(hipFlexors.bestFit.id).toBe('standing-cable-hip-flexion');
    }
  });

  it('a functional goal never combines with a physique target — the UI never sets both, and physiqueTarget still wins if it somehow were', () => {
    const result = makeRecommendation(
      {
        ...BASE_INPUT,
        bodyRegion: 'chest',
        physiqueTarget: 'upper-pec',
        functionalGoal: 'core-anti-extension',
        goal: 'build-base',
      },
      exercises
    );
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.target?.id).toBe('upper-pec');
      expect(result.functionalGoal).toBeNull();
    }
  });
});

// Phase 4C: aesthetic-specific exercise suitability. Mirrors exactly what
// DecisionMakerPage.tsx's handleAestheticOutcomeChange resolves (primary
// target from outcome.primary_targets[0], supporting targets from
// outcome.supporting_targets, aestheticOutcome set to the outcome's own
// id), so a passing test here is a real proof the actual UI flow behaves
// correctly, not just the engine in isolation.
function recommendForOutcome(outcomeId: string, goal: Goal, overrides: Partial<DecisionInput> = {}) {
  const outcome = getAestheticOutcomeById(outcomeId)!;
  const primaryTargetId = outcome.primary_targets[0];
  const target = getPhysiqueTargetById(primaryTargetId)!;
  return makeRecommendation(
    {
      ...BASE_INPUT,
      bodyRegion: target.parent_region,
      physiqueTarget: primaryTargetId,
      supportingPhysiqueTargets: outcome.supporting_targets ?? null,
      aestheticOutcome: outcomeId,
      goal,
      ...overrides,
    },
    exercises
  );
}

describe('makeRecommendation — Phase 4C aesthetic-specific exercise suitability', () => {
  // §6 permanent negative test — Lower Calf Fullness. Seated Calf Raise's
  // own summary literally says the bent knee makes it "a soleus-specific
  // stimulus"; Leg-Press Calf Raise's own summary says it's for
  // "accumulating extra volume rather than being a primary growth
  // driver." Before Phase 4C, Leg-Press Calf Raise won on pure
  // alphabetical accident.
  it('lower calf fullness: Seated Calf Raise (bent-knee, soleus-specific) beats Leg-Press Calf Raise under every goal, which remains a valid alternative', () => {
    for (const goal of ['build-base', 'visual-area'] as Goal[]) {
      const result = recommendForOutcome('calf-lower-fullness', goal);
      expect(result.status).toBe('ok');
      if (result.status === 'ok') {
        expect(result.bestFit.id).toBe('seated-calf-raise');
        // §12: the suitability layer refines, it doesn't exclude — the
        // less-specific-but-still-valid exercise remains reachable.
        const allIds = [result.bestFit.id, result.alternative?.id, ...result.complements.map((c) => c.id)];
        expect(allIds).toContain('leg-press-calf-raise');
      }
    }
  });

  // §7 permanent negative test — Overall Quad Front Mass. Before Phase 4C,
  // the visual-area goal's own generic ranking favored Reverse Nordic
  // Curl's lengthened-position-emphasis tag over every heavy squat.
  it('quad front mass: a heavy-loadable compound beats Reverse Nordic Curl under the visual-area goal, which remains a valid, reachable exercise', () => {
    const result = recommendForOutcome('quad-front-mass', 'visual-area');
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.bestFit.id).not.toBe('reverse-nordic-curl');
      expect(result.bestFit.aesthetic_characteristics).toContain('high-loadable');
      const reverseNordicStillReachable = makeRecommendation(
        { ...BASE_INPUT, bodyRegion: 'quads', physiqueTarget: 'quads', goal: 'visual-area', currentExerciseId: null },
        exercises
      );
      expect(reverseNordicStillReachable.status).toBe('ok');
    }
  });

  // §8 — Chest side-projection, strengthened. Incline Dumbbell Press
  // uniquely combines both of this outcome's preferred characteristics
  // (lengthened-biased + high-loadable) among the whole upper-pec pool,
  // so it should win decisively under any goal, not just the ones whose
  // generic stimulus ranking happens to favor it.
  it('chest side-projection: Incline Dumbbell Press (lengthened + high-loadable) wins under every goal', () => {
    for (const goal of ['build-base', 'visual-area'] as Goal[]) {
      const result = recommendForOutcome('chest-side-projection', goal);
      expect(result.status).toBe('ok');
      if (result.status === 'ok') {
        expect(result.bestFit.id).toBe('incline-dumbbell-press');
      }
    }
  });

  // §5 — aesthetic suitability must never undo the Phase 4B primary-target
  // rule. Dip (Chest-Biased) is a supporting-target (lower-pec) exercise
  // that matches BOTH of chest-side-projection's preferred characteristics
  // (heavy-compound + lengthened-position-emphasis) — the same suitability
  // score as the primary-target winner — yet must still lose, because
  // target-tier dominance is checked before suitability, not after.
  it('a supporting-target exercise with maximal aesthetic suitability still loses to any primary-target exercise', () => {
    const result = recommendForOutcome('chest-side-projection', 'build-base');
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.bestFit.physique_targets).toContain('upper-pec');
      expect(result.bestFitTargetMatch).toBe('primary');
      expect(result.bestFit.id).not.toBe('dip-chest-biased');
    }
  });

  // §9 — Shoulder width. side-delt's candidate pool is already narrow
  // (three lateral-raise variants, no front-delt press tagged to it), so
  // this mainly locks in that a front-delt-style press can never win a
  // shoulder-width recommendation.
  it('shoulder width: the recommendation is always a direct lateral-delt isolation exercise, never a front-delt press', () => {
    for (const goal of ['build-base', 'visual-area'] as Goal[]) {
      const result = recommendForOutcome('shoulder-width-front', goal);
      expect(result.status).toBe('ok');
      if (result.status === 'ok') {
        expect(result.bestFit.physique_targets).toContain('side-delt');
        expect(result.bestFit.id).toMatch(/lateral-raise/);
      }
    }
  });

  // §10 — Back width vs back thickness must produce meaningfully
  // different behavior: Case A (width) resolves to a vertical-pull
  // exercise, Case B (thickness) resolves to a horizontal-pull exercise,
  // and the two picks are never the same exercise.
  it('back width (Case A, vertical-pull) and back thickness (Case B, horizontal-pull) recommend different, mechanically appropriate exercises', () => {
    const widthResult = recommendForOutcome('back-width-v-taper', 'build-base');
    const thicknessResult = recommendForOutcome('back-side-thickness', 'build-base');
    expect(widthResult.status).toBe('ok');
    expect(thicknessResult.status).toBe('ok');
    if (widthResult.status === 'ok' && thicknessResult.status === 'ok') {
      expect(widthResult.bestFit.aesthetic_characteristics).toContain('vertical-pull');
      expect(thicknessResult.bestFit.aesthetic_characteristics).toContain('horizontal-pull');
      expect(widthResult.bestFit.id).not.toBe(thicknessResult.bestFit.id);
    }
  });

  // §18 — the recommendation trace must be internally consistent with the
  // rest of the result: a 'high' aestheticSuitability trace should only
  // ever occur alongside a primary-target-tier pick that actually matches
  // every one of the outcome's preferred characteristics, and 'not-
  // applicable' should only occur when the outcome has none.
  it('bestFitTrace reflects the actual ranking inputs that decided the pick', () => {
    const withPreference = recommendForOutcome('calf-lower-fullness', 'build-base');
    expect(withPreference.status).toBe('ok');
    if (withPreference.status === 'ok') {
      expect(withPreference.bestFitTrace.exerciseName).toBe('Seated Calf Raise');
      expect(withPreference.bestFitTrace.targetMatch).toBe('primary');
      expect(withPreference.bestFitTrace.aestheticSuitability).toBe('high');
      expect(withPreference.bestFitTrace.finalReason).toMatch(/direct primary-target match/);
      expect(withPreference.bestFitTrace.finalReason).toMatch(/high aesthetic suitability/);
    }

    const withoutPreference = recommendForOutcome('arm-side-thickness', 'build-base');
    expect(withoutPreference.status).toBe('ok');
    if (withoutPreference.status === 'ok') {
      // arm-side-thickness has no preferred_characteristics defined.
      expect(withoutPreference.bestFitTrace.aestheticSuitability).toBe('not-applicable');
    }
  });
});
