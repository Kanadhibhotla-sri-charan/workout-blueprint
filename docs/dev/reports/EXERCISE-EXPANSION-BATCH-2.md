# Exercise Expansion — Batch 2

_Batched workflow: routine additions with a focused coverage check per change and the full validation suite for the batch. Nothing here needs a ranking, target-taxonomy, goal-model, engine or equipment-vocabulary change._

- **Base:** `main` at `be2feef`, 135 exercises, after PRs #3 and #4 were released.
- **This batch:** 136 exercises.

## Changes

### Equipment setups added to existing records (reuse first)

| Record | Setup added | Why it is honest |
|---|---|---|
| `barbell-dumbbell-shrug` | `[band]` | Standing on a band and shrugging loads shoulder elevation, heaviest at the top |
| `wrist-curl` | `[band]` | Band anchored under the foot, forearm on the thigh |
| `reverse-wrist-curl` | `[band]` | Same, palm down |
| `reverse-curl` | `[band]` | Standing on the band, overhand curl |
| `static-lunge` | `[bodyweight]` | The bodyweight split squat is the standard entry version |
| `walking-lunge` | `[bodyweight]` | Bodyweight walking lunges are the standard entry version |

Each record also has its `resistance_profile` extended to describe the new setup, and one `programming_notes` item on how to set it up or progress it. Targets, demand ratings and coverage tags are unchanged.

### New record

| Record | Target / region | Equipment | Status |
|---|---|---|---|
| `step-up` | `quads` / quads (glutes as free-text primary) | `bench` (a box or sturdy step); dumbbells as optional loading | `needs-review` |

- Coaching content follows the coaching standard.
- No evidence notes (no empirical claim).
- Video: FITBODY with Julie Lohre, "How to Do Bench Step Ups for Quads & Glutes". Verified 2026-10-09 by **title/channel metadata via oEmbed; footage not watched**.
- The step-up was turned down in the Phase 7 pilot as a near-duplicate of the lunges. That reason no longer holds: no lunge or split squat could be done without weights, and the measured gain below is large and free of alphabetical takeovers.

## Coverage impact

Unmodified engine; same 69-entry × 6-context × 4-tolerance × 7-goal space as earlier reports. Each change was measured on its own, then the batch together. Each changed or new record was also re-run with an ID that sorts last, to separate merit from alphabetical wins. The combined run was repeated, byte-identical (SHA-256 `9d9f0b68…2ee640`).

| | `main` | Batch 2 |
|---|---:|---:|
| Exercises | 135 | 136 |
| Scenarios | 38,520 | 38,808 (+288, all with the step-up as current) |
| Answered | 24,397 | **25,397** |
| Empty | 14,123 | 13,411 |

| Change | Opened | New selection cells | Selection-goal Best Fit changes | Alphabetical-only |
|---|---:|---:|---:|---:|
| Shrug + band | 188 | 10 (upper traps, `upper-back-fullness`, back region; minimal kit) | 6 (back region, minimal kit: chin-up → shrug) | **2** |
| Wrist curl + band | 56 | 8 (forearm flexors, `forearm-fullness-inner`; minimal kit) | 0 | 0 |
| Reverse wrist curl + band | 88 | 8 (forearm extensors, `forearm-fullness-outer`; minimal kit) | 0 | 0 |
| Reverse curl + band | 100 | same 8 cells as the reverse wrist curl | 0 | 0 |
| Static lunge + bodyweight | 216 | 0 | 50 (quads limited-equipment / low-fatigue: reverse Nordic → static lunge) | 0 |
| Walking lunge + bodyweight | 216 | 0 | 0 | 0 |
| Step-up (new) | 320 | 4 (quads under a low-skill limit, bodyweight) | 6 (quads low-fatigue: reverse Nordic → step-up) | 0 |
| **Batch combined** | **816** | **30** | **56** | **2** |

- **Lost answers:** 0 in every individual run and in the combined run.
- **Merit-based default changes:**
  - The static lunge and step-up replace the reverse Nordic curl as the bodyweight quad pick for low-fatigue and limited-equipment.
  - The existing cost tie-break decides these: the lunge and step-up are lower skill than the reverse Nordic.
  - The shrug wins "back region, minimal kit" for low-fatigue and limited-equipment on the same rule (low fatigue vs the chin-up's medium).
- **Current-exercise answers:** 280 Best Fit changes in "different stimulus / complement / replace", all on merit. For example, the sissy squat → static lunge or step-up, and pronation/supination work → reverse curl or reverse wrist curl.
- **Empty-result messages:** 610 still-empty answers list different "with equipment, these would fit" options.

## Uncertain content and flags

- **`step-up` is `needs-review`.** The six edited records keep their existing review status. Their only changes are a new setup and setup text.
- **Shrug, back region, minimal kit: 2 alphabetical takeovers.**
  - "Back region / improve a visual area" with a band and pull-up bar now answers with the shrug instead of the chin-up.
  - The cause is that `barbell-dumbbell-shrug` sorts before `chin-up-supinated`.
  - The shrug was always a back-region record; the band setup only made it feasible there. This is the same tie-break limitation already recorded, not a new rule.
  - Included because the batch's main gain (traps coverage in minimal kit) doesn't depend on it. Flagged for the tie-break decision.

## Deferred

| Candidate | Why | Measured |
|---|---|---|
| Reverse lunge + bodyweight setup | Would take the bodyweight quads build-base pick from the reverse Nordic **alphabetically** (`reverse-l…` sorts before `reverse-n…`) | 18 alphabetical selection changes |
| Bulgarian split squats + bench-only setup | Take build-base quads / glute picks alphabetically | 3 (knee-dominant) and 4 (hip-dominant) alphabetical selection changes |
| Bayesian cable curl (new) | Opens nothing; takes biceps visual-area picks alphabetically | 0 opened, 18 alphabetical selection changes |
| Cable pull-through, belt squat, dead bug | Depend on the tie-break / role decision (Batch 1 and follow-up reports) | — |
| Low-to-high cable fly | Re-targets an existing record | — |
| Kettlebell swing | No power/conditioning goal | — |
| Wrist roller | Equipment-vocabulary change, rejected earlier | — |
| Cable Y-raise, dead hang | Need a lower-traps/posture target or a grip goal (not introduced) | — |
| Inverted row | Needs a suspension/low-bar equipment item | — |

Every deferred item except the last four is blocked by the same thing: ties between equally ranked exercises fall to the alphabetical ID. A decision on how build-base, visual-area and low-fatigue should break those ties would unblock them together.

## Tests updated for intended behaviour

- `emptyResult.test.ts`: "upper traps with only a band" was the example of an empty result that is not a bodyweight gap. The band shrug now answers it, so the example is triceps long head with a band (still empty, still not a bodyweight gap), and the test asserts both halves.
- `DecisionMakerPage.test.tsx`: the shrug's listed equipment now reads "barbell, dumbbell, cable, or band".
- `data/index.test.ts`: count 135 → 136.

## Validation

| Check | Result |
|---|---|
| Data generation + `validate-data` | PASS, 136 records |
| Vitest | 298 / 298 |
| oxlint | exit 0 |
| Production build | OK |
| Playwright | 3 / 3 |
| Video audit (oEmbed) | 136 / 136 LIVE |
| Fresh clone of `975b419` | validate PASS; `npm test` 298/298; lint 0; build OK; Playwright 3/3 |

## Release review (before merging PR #5)

**The two alphabetical Best Fit changes:** back region, visual area, band + pull-up bar, with no limit or a low-setup limit. The pick moves from the chin-up to the shrug.

- **Why they tie:** visual area ranks only the lengthened- or shortened-position-emphasis tags first. The chin-up, pull-up and shrug carry neither, so the ID decides.
- **The previous answer was alphabetical too:** the chin-up only beat the pull-up by ID. There was never a merit-based winner for this cell.
- **What the user sees:**
  - the shrug as Best Fit, the chin-up as alternative, and the chin-up and pull-up as complements;
  - an explanation that says the shrug "changes the line from neck to shoulder more than it changes back width or thickness".
- **More specific requests are unaffected:** lat width and the V-taper outcome still return the chin-up (verified).
- **Same pattern already in production:** before this batch, the shrug was already the back-region visual-area pick under a low-skill limit (any, gym and home contexts). It was also the back-region low-fatigue and limited-equipment pick in those contexts. Batch 2 extends existing behaviour to minimal kit.

**Decision: acceptable, not ideal.** For an unqualified "back" request, a vertical pull is the more representative answer. But:
- the only in-scope correction is removing the shrug's band setup. That would give up the batch's main gain (8 upper-traps cells and about 180 answers) to change 2 cells whose previous answer was also arbitrary;
- the real fix is a visual-area tie-break for region-level requests, a global ranking change outside this batch.

No data change was made.

**The other back-region changes are merit-based:**
- Minimal-kit low-fatigue (chin-up is high fatigue) and limited-equipment (equal item count, shrug lower fatigue) follow the goal's own key and the existing cost rule.
- The cells opened under fatigue or skill limits had no answer before.

## Release

| | Result |
|---|---|
| Merge commit | `f822673f8d9c839fda255f4c5da3e27b1a7543ed` (PR #5) |
| GitHub Pages deploy | Success |
| CI on `main` | Success |
| Production smoke test | 10 / 10 |

Production smoke test details:
- Explore shows 136 exercises.
- Explore → detail → Decide → Build works; Decide URL reload and back/forward restore the same answers.
- The step-up detail page loads, as do the six edited records' pages.
- Decide answers as intended:
  - upper traps with band + bar → shrug;
  - forearm flexors with a band → wrist curl;
  - forearm extensors with a band → a band reverse curl or reverse wrist curl;
  - quads with a bench under a low-skill limit → step-up;
  - quads, limited equipment, nothing selected → static lunge;
  - "replace my sissy squat" with no equipment → a lunge;
  - lat width, visual area, band + bar → still the chin-up.
