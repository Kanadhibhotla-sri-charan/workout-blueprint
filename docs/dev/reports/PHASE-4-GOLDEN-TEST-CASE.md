# Phase 4 Golden Test Case — Upper Pec Vertical Slice

**Required by:** the architect's Phase 4 approval memo, item 5: *"Before expanding beyond Upper Pec, the team must demonstrate the complete Phase 4 vertical slice using this scenario... This is the primary acceptance test for the Phase 4 concept."*

**Scenario:**
- Target: Upper pec
- Already doing: Incline Dumbbell Press
- Goal: More growth / low redundancy (mapped to the `complement-current` goal — "add something that complements my current exercise" — since the required behaviors are current-exercise context, overlap avoidance, and complementary selection, not a same-role swap, which is what `replace-exercise` does instead)

**Verified two ways, not one:** at the engine level directly (`app/src/engine/decisionEngine.test.ts`, "Phase 4 physique-target awareness" describe block) and at the UI level driving the actual rendered form (`app/src/pages/DecisionMakerPage.test.tsx`, "golden test case" test) — a wiring mistake between the form and the engine would be caught even if the engine itself were correct, same discipline used for the Phase 3 Decision Maker.

## Actual engine output for this exact scenario

Captured directly from a passing test run (`makeRecommendation` called with `physiqueTarget: 'upper-pec'`, `goal: 'complement-current'`, `currentExerciseId: 'incline-dumbbell-press'`), not hand-written or illustrative:

```json
{
  "target": "Upper Pec",
  "visualObjective": "Visually, this reads as the \"upper chest shelf\" filling in: fullness just below the collarbone that closes the gap between shoulder and chest, producing a squared-off upper-chest line in a t-shirt or from the front, rather than the chest appearing to start lower down.",
  "bestFit": "cable-fly",
  "bestFitMovementPattern": "shoulder horizontal adduction",
  "why": "Adds a different stimulus alongside Incline Dumbbell Press — a shoulder horizontal adduction movement rather than Incline Dumbbell Press's incline horizontal press.",
  "stimulus": "Constant tension through the whole range.",
  "programming": {
    "repRangePrimary": [10, 20],
    "repRangeReason": "Isolation movements commonly tolerate a wide rep range without losing effectiveness, since they typically carry a lower technical-breakdown and joint-loading concern at higher reps than a heavy compound movement does.",
    "rirTypicalRange": [1, 3],
    "rirGuidance": "Most working sets in a typical practical range sit around 1-3 RIR. Training hard is not the same as training to mandatory momentary failure — occasional harder sets closer to failure can have a place, but failure is not required for growth, and treating it as mandatory tends to add fatigue and injury risk without a clear return.",
    "weeklyVolumeSets": [10, 20],
    "frequencyPerWeek": [2, 3],
    "progressionExplanation": "A simple, practical progression model. Pick a target rep range (for example 8-12). Start with a load that allows completing the low end of that range at the target RIR. Over subsequent sessions, add reps at the same load until the top of the range is reached at the target RIR. Once that happens, increase the load slightly, and the rep count typically drops back toward the bottom of the range — then repeat.",
    "intensityTechnique": "Drop Set",
    "intensityTechniqueWhen": "Useful for increasing work density on an isolation movement without adding a full additional working set — for example, when time efficiency matters, or a muscle needs more stimulus but there isn't room in the session for another complete set."
  },
  "alternative": null,
  "watchOut": [
    "Requires: cable.",
    "Overlaps with other exercises already in the dataset — avoid stacking both in one routine.",
    "Requires a cable station with adjustable pulley height and, ideally, two stations facing each other, which not every gym has set up conveniently."
  ],
  "complements": ["dip-chest-biased", "flat-barbell-bench-press", "flat-dumbbell-press"]
}
```

## Checklist against the architect's 8 required behaviors

- [x] **Specific physique target recognition.** `target: "Upper Pec"` — resolved from the taxonomy, not the broad `chest` region.
- [x] **Current-exercise context.** The recommendation is computed relative to Incline Dumbbell Press specifically (`why` names it directly), not a generic "best chest exercise" answer.
- [x] **Overlap avoidance.** The recommended exercise (Cable Fly, `shoulder horizontal adduction`) is a genuinely different movement pattern from the current exercise's `incline horizontal press` — not the same movement via different equipment (that's what `replace-exercise` would have returned instead: Incline Barbell Press, per the existing Phase 3 test coverage). This is the structural-complement rule from `DECISION-ENGINE-RULES.md` §3 operating correctly against a real current-exercise/target combination, not just its own isolated unit test.
- [x] **Complementary exercise selection.** Resolved from Incline Dumbbell Press's own curated `complements` field (`cable-fly`), which — per the fix made while building this slice — is validated against the broader region-level constraint pool rather than the narrow target-tagged pool, since a valid curated complement can legitimately sit outside a target tag the taxonomy hasn't caught up to yet (Cable Fly isn't tagged `upper-pec` today, even though its own data explicitly notes its bias is adjustable toward upper-chest by pulley height).
- [x] **Stimulus explanation.** `stimulus: "Constant tension through the whole range."` — the exercise's own `resistance_profile`, distinct from `why`.
- [x] **Sets/reps/RIR/frequency/progression.** All five present and populated from `data/programming/`, none hardcoded per-exercise.
- [x] **Optional intensity technique where appropriate.** Drop Set suggested — Cable Fly is isolation, low fatigue cost, and no fatigue constraint was active in this scenario to suppress it (see `programmingEngine.test.ts` for the suppression case verified separately).
- [x] **Clear explanation of why.** `why` names the current exercise and the specific movement-pattern distinction driving the recommendation; `programming.repRangeReason`, `rirGuidance`, and `progressionExplanation` each explain their own number, not just state it.

## Language check (architect approval memo item 4)

Every programming value above is phrased as a range with explanatory reasoning ("commonly tolerate," "typical practical range," "a simple, practical progression model") — no instance of "optimal," "required," "maximum," or an unhedged exact number appears in the output.

## A real bug this test caught before it shipped

Building this exact scenario (not a simplified stand-in) surfaced a genuine design bug: the initial implementation validated a current exercise's declared `complements` against the narrow, physique-target-tagged candidate pool, which incorrectly discarded Cable Fly (a real, curated, useful complement) simply because the taxonomy hasn't tagged it `upper-pec` yet. Fixed in `decisionEngine.ts` by validating declared complements against a broader region-level constraint pool instead — documented in the 4D/4E/4F dev-log entry. This is exactly why the architect required a concrete end-to-end scenario rather than accepting isolated unit coverage as sufficient proof.

## Verdict

**Passes.** All 8 required behaviors demonstrated with real engine output, not illustrative text. Per the architect's directive, taxonomy expansion beyond Upper Pec may proceed.
