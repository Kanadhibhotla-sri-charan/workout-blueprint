# Content Review — Batch 2 (prepared)

_Returns to content review after the position-tag audit closed (`POSITION-TAG-AUDIT-CLOSURE.md`). Base: `main` at `c66d097`. Library: **52 `reviewed`, 88 `needs-review`**. Exposure is the Best Fit count across the 39,672-scenario space._

## Three separate requirements per record

None substitutes for another:

| Requirement | Who / what | What counts | Status field |
|---|---|---|---|
| **1. Human content review** | A person, against `CONTENT-REVIEW-CHECKLIST.md` | All ten checklist areas confirmed | `review_status` → `reviewed` (only this moves it) |
| **2. Citation verification** | Source opened, claim compared | Recorded in `EVIDENCE-LEDGER.md` | Ledger only |
| **3. Watched video** | A person watches the footage | Shows this exercise and setup | `video_verification_method: visual` + date |

**A record is never promoted because its diff was checked by AI.** AI pre-review notes only speed up the human review.

## Tier 1: the nine new exercises (human review + watched video)

Ordered by exposure. All have coaching counts; none has evidence notes (no empirical claims); all videos are metadata-checked only.

| # | Record | Exposure | Focus for the reviewer (see `CONTENT-REVIEW-CHECKLIST.md` pre-review notes) |
|---|---|---:|---|
| 1 | sissy-squat | 476 | Ranking inputs: stability **high**, skill **high**, fatigue medium. Knee-safety wording in the limitations (the first is the watch-out). Tagged lengthened, "consistent as stated, unverified" |
| 2 | hamstring-bridge | 432 | `selection_role: secondary` (stand-in for loaded hamstring work); stability medium; heels-on-bench setup |
| 3 | step-up | 430 | Equipment `bench` only (dumbbells mentioned, not modelled); `primary_targets` quads + glutes vs `physique_targets` quads |
| 4 | cable-pull-through | 416 | `secondary` role; first limitation names the cable stack but band users see it too; video covers the cable version only |
| 5 | plank-shoulder-tap | 340 | Functional goal only (core anti-rotation), no physique target |
| 6 | reverse-crunch | 174 | Skill **medium**; overlap with the hanging knee raise |
| 7 | upright-row-wide-grip | 132 | Compound typing (never replaces a lateral raise); shoulder-tolerance limitations; 5 setups vs a barbell-only video |
| 8 | seated-band-row | 128 | Band resistance text (hardest at the end of the pull) |
| 9 | single-leg-hip-thrust | 64 | `shortened-position-emphasis` (consistent as stated, unverified); balance and loading limitations |

## Tier 2: non-package records awaiting human review (2)

| Record | Exposure | Open items |
|---|---:|---|
| glute-bridge | 1382 | AI diff verified; corrections applied. **Duplicate range limitation** (limitations 1 and 2); limitation 1 is the watch-out in 1382 answers |
| single-leg-romanian-deadlift | 632 | AI diff verified. Lengthened tag describes the dumbbell setup only (band loads the top, stated); technique cues are dumbbell-specific |

## Tier 3: the 11 edited `needs-review` records

All lack coaching content (0 cues, 0 mistakes) and need diff verification of their expansion edits plus coaching authoring. Ordered by exposure:

| # | Record | Exposure | Expansion / review edits to verify | Evidence notes |
|---|---|---:|---|---:|
| 1 | push-up-chest | 1070 | deficit note | 1 |
| 2 | static-lunge | 324 | bodyweight setup, resistance text, note | 0 |
| 3 | rear-delt-fly | 243 | band setup, resistance text, note | 1 |
| 4 | dumbbell-curl | 189 | concentration-curl note | 0 |
| 5 | hack-squat | 114 | pendulum note | 0 |
| 6 | goblet-squat | 84 | heel-elevated note | 0 |
| 7 | cable-curl | 83 | band setup, secondary role, resistance text, limitation, note | 0 |
| 8 | overhead-press | 65 | Arnold / landmine notes | 0 |
| 9 | preacher-curl | 18 | notes; Batch 1 and P3 evidence / text work; target string; tag removed (O2) | 2 |
| 10 | walking-lunge | 16 | bodyweight setup, resistance text, note | 0 |
| 11 | barbell-bent-over-row-pronated | 14 | Pendlay note | 0 |

## Tier 4: the 66 untouched `needs-review` records, by exposure

All lack coaching content. 24 carry evidence notes whose sources have not yet been re-checked (citation verification is a separate track).

plank (680), chin-up-supinated (480), dumbbell-pullover-lat-biased (381), dumbbell-squat-sides (365), cable-band-external-rotation (326), triceps-kickback (320), isometric-neck-hold (272), suitcase-carry (252), back-extension-45-hip-dominant (222), push-up-plus (216), flat-dumbbell-fly (203), seated-machine-shoulder-press (166), russian-twist (164), leg-press-calf-raise (160), reverse-lunge (158), lying-triceps-extension-skull-crusher (146), neck-flexion (144), machine-chest-press (138), incline-machine-press (134), single-arm-dumbbell-row (124), cable-reverse-curl (106), machine-fly-pec-deck (106), hip-adduction (104), ab-wheel-rollout (96), machine-crunch (96), dumbbell-pullover-chest-biased (89), decline-dumbbell-fly (82), farmers-carry (82), incline-dumbbell-press (68), machine-reverse-fly (58), tibialis-raise (56), incline-cable-press (52), pronation-supination-work (50), flat-dumbbell-press (40), neck-extension (40), cable-hammer-curl-rope (36), preacher-curl-machine (36), reverse-grip-lat-pulldown (36), cable-drag-curl (32), cable-chest-press (30), hex-press (30), cable-rear-delt-builder (28), back-extension-45-spinal-dominant (26), machine-triceps-extension (24), reverse-grip-barbell-row (24), standing-cable-hip-flexion (24), drag-curl (18), pull-up-pronated (18), cable-shoulder-press (16), smith-machine-squat (16), sumo-deadlift (16), lateral-neck-flexion (12), neutral-grip-lat-pulldown (12), rack-pull (12), sumo-squat (12), stiff-leg-deadlift (9), zottman-curl (9), smith-machine-bulgarian-split-squat (8), smith-machine-romanian-deadlift (8), conventional-deadlift (6), nordic-hamstring-curl (6), smith-machine-bench-press (6), smith-machine-incline-press (6), t-bar-row (6), smith-machine-shoulder-press (4), front-squat (0)

## Suggested batch size and order

1. **Batch 2a:** Tier 1 (9) + Tier 2 (2). Human review + watched video. Promotion is possible only after a person signs off each record.
2. **Batch 2b:** Tier 3 top 4 by exposure (push-up-chest, static-lunge, rear-delt-fly, dumbbell-curl). Diff verification + coaching authoring, then human review.
3. **Then:** the rest of Tier 3, and Tier 4 from the top (plank, chin-up, lat pullover, dumbbell squat, …).
4. **Citation track in parallel:** Tier 3 / 4 records with evidence notes, starting with the highest exposure.

**Release rules (each data change):**
- validate data and Build packages;
- all tests, lint, build and Playwright;
- measure twice (identical output);
- fresh clone;
- push only after every gate passes;
- verify the deploy and run production smoke tests.
