# Phase 7 Stage 5.3 — Bodyweight Policy and Empty-Result Messaging

Implements the step approved after Stage 5.2. It is strictly UX and message level:

- **Data:** no change to exercises, target definitions or packages.
- **Engine:** no change to ranking or feasibility.
- **Not introduced:** any "cheapest unlock" ranking.

## 1. Policy documented

`docs/knowledge-manual/EQUIPMENT-COVERAGE-POLICY.md` records Policy B:

- Bodyweight is supported where it is meaningful.
- Some targets legitimately have no bodyweight recommendation.
- Coverage is never manufactured through indirect targeting or negligible-load exercises.
- Bodyweight additions need direct targeting and a genuine programming rationale.

The document also includes a checklist for judging proposed additions. It is linked from the README and from `DECISION-ENGINE-RULES.md` §1.

## 2. Empty-result messaging

### Where it applies

When the **selection itself** is empty (target / outcome / functional goal / region, with the chosen equipment and limits), `engine/emptyResult.ts` explains why. It uses only:

- the selection's existing candidate pool, before equipment and tolerance;
- `isEquipmentFeasible`;
- the existing tolerance check, now a shared `meetsToleranceLimits` function with identical logic;
- each record's own `formatEquipmentOptions`.

The result keeps its `reason` string and adds a structured `explanation`:

| Field | Meaning |
|---|---|
| `kind` | `equipment`, `tolerance`, `equipment-and-tolerance` or `no-exercises` |
| `subject` | The target, functional goal or region, by name |
| `bodyweightGap` | Bodyweight-only selection, and no bodyweight-only exercise exists for it |
| `blockingLimits` | Limits that, relaxed on their own, would admit an exercise the equipment already allows |
| `unlocks` | Exercises that fit the user's limits but need other equipment, sorted by name, with their own equipment options |

### Messages

| Case | Message |
|---|---|
| Equipment blocker | "None of the exercises for {subject} that fit your limits can be done with the equipment you selected. With different equipment, these would fit:" + list. If a limit could also be relaxed instead, that is added. |
| Legitimate bodyweight gap | "Blueprint has no bodyweight-only exercise that directly trains {subject}. Some targets can't be meaningfully trained without equipment, and Blueprint doesn't substitute exercises that only work them indirectly. With equipment, these would fit:" + list |
| Tolerance blocker | "You have the equipment for {subject} (or: Blueprint has exercises for {subject}), but no exercise fits your limits. Relaxing your {limit} would allow one." |
| Both | "No exercise for {subject} fits both your equipment and your {limits}: each one would need different equipment and a relaxed limit." The bodyweight-gap sentence comes first when it applies. |

This also fixes the old message saying "region" when a specific target was selected.

### UI

`DecisionResultView` shows the reason, then up to 5 unlocking exercises. Each links to its detail page and shows its equipment, followed by "and N more" if there are more. Checked at 390px width.

### What is not changed

- Current-exercise goals keep their own "has no substitute / no complement" messages whenever the selection itself has candidates.
- The missing-current-exercise message is unchanged.

## Tests

| File | Tests | Covers |
|---|---:|---|
| `engine/emptyResult.test.ts` | 14 | See below |
| `pages/DecisionMakerPage.test.tsx` | +2 | The gap message and links render; at most 5 unlocks, then a count |

`engine/emptyResult.test.ts` covers:

- **Equipment-blocked:** exact message and unlock list. Unlocks respect the limits, and each one really is unlocked by its own setup.
- **Legitimate bodyweight gap:** nothing selected and only "bodyweight" selected behave the same.
- **No gap is claimed** when other equipment is selected, or when a bodyweight exercise exists but a limit excludes it. That case gives both remedies.
- **Combined** equipment-and-tolerance; **tolerance-only**; a **functional-goal** subject; **no exercises** at all.
- **Success unchanged:** no `explanation` on a successful result.
- **Determinism:** same input, same output, even with the library order reversed.
- **Current-exercise goals** keep their own message.

## Coverage check (36,360 scenarios; two runs, byte-identical)

- **Answered:** 20,227. **Empty:** 16,133. Unchanged.
- **Successful results differing from Stage 5.1:** **0** (Best Fit, alternative, complements, why, watch-out).
- **Selection-level empties with an explanation:** 2,332 / 2,332.

| | Count |
|---|---:|
| `equipment` | 2,140 |
| `tolerance` | 116 |
| `equipment-and-tolerance` | 76 |
| …of which a bodyweight gap | 768 |
| Distinct messages | 104 |

**Current-exercise goals:** 8,883 empties get the explanation (their selection was already empty). The other 4,918 keep their goal-specific messages.

## Checks

| Check | Result |
|---|---|
| validate-data | PASS |
| Vitest | 298 / 298 |
| lint | clean |
| build | OK |
| Playwright | 3 / 3 |
| Fresh clone | all pass |
