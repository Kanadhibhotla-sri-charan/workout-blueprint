# Content Review — Batch 2a (Tiers 1 and 2)

_Plan: `CONTENT-REVIEW-BATCH-2-PLAN.md`. Base: `main` at `043287f`. Records: the nine new exercises in exposure order, then glute-bridge and single-leg-romanian-deadlift._

## Status of the three separate requirements

| Requirement | Result in this batch |
|---|---|
| **1. Human content review** | **Not completed.** This pass is a structured AI pre-review against `CONTENT-REVIEW-CHECKLIST.md`. Every field listed in the plan was checked against the record's own text and the rest of the library. A person still has to sign off each record. **No `review_status` was changed**; all 11 stay `needs-review` |
| **2. Citation verification** | **Nothing to verify.** None of the 11 records has `evidence_notes`. Their resistance descriptions and mirror effects are unsourced coaching statements (see gaps) |
| **3. Watched video** | **Not done.** The footage was not watched in this pass: the reviewing agent cannot view video. All 11 stay `video_verification_method: metadata`. Each needs a person to watch it (what to check is listed below) |

## Corrections applied (text only)

| Record | Field | Change | Reason |
|---|---|---|---|
| glute-bridge | `limitations` 1–2 | Limitation 1 now covers load only. The range point is kept once, in limitation 2, which now says it holds "even with a barbell" | Resolves the duplicated range limitation (queue item). Limitation 1 is the watch-out |
| cable-pull-through | `limitations` 1 (watch-out) | "limited by the cable stack" → "limited by the cable stack or band" | The record has a band setup; band users saw a cable-only watch-out |
| sissy-squat | `why_this_exists` | "Bodyweight quad options are scarce once lunges and split squats need weights" → "Most bodyweight quad options in the library are lunges and split squats" | Stale claim: static lunge, walking lunge and the knee-dominant Bulgarian split squat all have bodyweight setups |
| step-up | `why_this_exists` | "Single-leg quad work in the library needed weights or a long lunge walk" → "Most single-leg quad work in the library is a lunge or split squat" | Same stale claim |

**Measured** (full 39,672-scenario space vs `043287f`, two byte-identical runs):
- 0 Best Fit, 0 alternative, 0 complement-list, 0 empty / filled changes;
- 1,798 watch-out text changes: 1,382 glute-bridge Best Fit answers + 416 cable-pull-through Best Fit answers;
- 0 changes from the two `why_this_exists` edits (not shown in Decide answers).

## Per-record findings

All checklist areas below were found consistent unless noted. **"For the human reviewer"** items are open questions; they were not changed, because they would alter ranking inputs or need a product decision.

| # | Record | Exposure | Checked: ranking inputs, targets, role, setups, coaching, watch-out, resistance, overlaps | For the human reviewer | Video: what to confirm on watching |
|---|---|---:|---|---|---|
| 1 | sissy-squat | 476 | Isolation; stability high, skill high, fatigue medium; quads; bodyweight. Watch-out = knee-load limitation. Resistance "hardest at the bottom" agrees with the lengthened tag (unverified). Overlaps reverse Nordic and leg extension. **Corrected `why_this_exists`** | Confirm skill / stability **high** is right for a supported version | Supported sissy squat, heels up, straight knee-to-shoulder line |
| 2 | hamstring-bridge | 432 | Compound, `secondary`; stability medium; bodyweight + bench; hamstrings, glutes secondary. Watch-out = modest bodyweight loading. "Every hamstring exercise needs…" claim checked: true | Overlap is listed only on this record, not on glute-bridge | Heels on a bench, knees nearly straight (not a feet-flat glute bridge) |
| 3 | step-up | 430 | Compound; bench only; primary quads + glutes, physique quads (same convention as squats and leg press). **Corrected `why_this_exists`** | Dumbbells are described but not modelled as a setup. Adding them would change rankings, so it is a product decision | Bench step-up driving from the front leg |
| 4 | cable-pull-through | 416 | Compound, `secondary`; setups cable + rope, band; glutes. **Corrected watch-out** for the band setup. Resistance describes both setups | — | Video covers the cable version only; confirm it shows a hinge, not a squat |
| 5 | plank-shoulder-tap | 340 | Isolation; functional goal core-anti-rotation; stability high; bodyweight. "Only anti-rotation exercise is the Pallof press" checked: true | `physique_targets: []`, while pallof-press lists obliques. Adding one would change rankings | High plank, alternating taps, hips still |
| 6 | reverse-crunch | 174 | Isolation; skill medium; rectus abdominis; bodyweight. Watch-out = hip-flexor takeover. Cues and mistakes agree | — | Pelvis curls off the floor (not just knee tuck) |
| 7 | upright-row-wide-grip | 132 | Compound (so it never replaces a lateral raise); 5 single-item setups; side delts + upper traps. Watch-out = shoulder tolerance. Resistance is top-loaded and agrees with the band note | — | Video is barbell only; confirm a clearly wide grip and stopping around upper-arm parallel |
| 8 | seated-band-row | 128 | Compound; band; back thickness. Watch-out = slack at the start. Resistance "hardest at the end of the pull" agrees with the limitation | — | Seated, band around the feet, elbows driven back |
| 9 | single-leg-hip-thrust | 64 | Compound; stability medium; bodyweight + bench; shortened tag agrees with "hardest at the top" (unverified). Watch-out = awkward loading | — | Shoulders on a bench, one leg, level pelvis |
| 10 | glute-bridge | 1,382 | **Duplicate resolved** (above). Remaining limitations: load, range (incl. barbell), hamstring takeover. Programming note 2 still explains the barbell range and is consistent | Reviewer to confirm the two-limitation wording | Floor bridge, shoulders down |
| 11 | single-leg-romanian-deadlift | 632 | Compound; setups dumbbell, band; lengthened tag describes the dumbbell setup, band loads the top (stated) | Summary and technique cues are dumbbell-specific; band only in notes | Single-dumbbell version, hips square |

## Evidence gaps

- No source for any of the 11 resistance descriptions (where each movement is hardest). They read as plausible mechanics, but they are not verified.
- Mirror-effect statements are hedged ("tends to show up… supporting stimulus") and unsourced.
- The two unresolved citations elsewhere in the library (incline-curl EMG; hip-thrust EMG) are unchanged.

## Remaining queue

- **Tiers 1–2 (11):** awaiting a person's sign-off and watched video. Everything else in this pass is done.
- **Tier 3 (11)** and **Tier 4 (66):** unchanged, as listed in `CONTENT-REVIEW-BATCH-2-PLAN.md`.
- Library: 52 `reviewed`, 88 `needs-review` (unchanged).
