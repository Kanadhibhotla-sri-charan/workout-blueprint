# Content Review Queue

> **Next batch:** see `CONTENT-REVIEW-BATCH-2-PLAN.md`. Batch 2a pre-review done (`CONTENT-REVIEW-BATCH-2A.md`); Tiers 1–2 await human sign-off and watched video. The position-tag audit is closed (`POSITION-TAG-AUDIT-CLOSURE.md`).

_Single maintained queue for the content-review phase. Procedure: `CONTENT-REVIEW-CHECKLIST.md`. Evidence: `EVIDENCE-LEDGER.md`. Open findings: `CONTENT-REVIEW-P3-FINDINGS.md`._

**Three separate requirements.** None substitutes for another:
1. **Human content review** of the exercise data. Only this can move a record to `reviewed`. AI diff verification alone does not qualify.
2. **Evidence verification:** each citation checked against its source (the ledger).
3. **Video review:** footage watched by a person. All 140 videos are currently metadata-checked only.

**Library:** 52 `reviewed`, 88 `needs-review`.

## P1: new records (9). Human review and watched videos required
cable-pull-through, sissy-squat, hamstring-bridge, step-up, plank-shoulder-tap, seated-band-row, reverse-crunch, single-leg-hip-thrust, upright-row-wide-grip.
- Pre-review questions are in the checklist.
- No promotion has started.

## P2: expansion-edited, not in a package (2). Diffs AI-verified; awaiting human review

| Record | Open items |
|---|---|
| glute-bridge | ~~Duplicate range limitation~~ **Resolved in Batch 2a:** limitation 1 now covers load only; the range point stays once in limitation 2 ("even with a barbell"). 1,382 watch-out text changes, 0 recommendation changes (`CONTENT-REVIEW-BATCH-2A.md`). |
| single-leg-romanian-deadlift | Coverage tag `lengthened-position-emphasis` fits the dumbbell version only (ranking input); technique cues are dumbbell-specific |

**Position-tag item (`reviewed` record, outside the P tiers):** cable-lateral-raise is contradicted by its own resistance text. Its tag is kept because changing it would alter the shoulders-efficient and shoulders-complete prescriptions (8–15 → 10–20); that needs a separate product decision. See the evidence ledger, consolidated position-tag status.

## P3: expansion-edited `needs-review` (11)
push-up-chest, static-lunge, cable-curl, rear-delt-fly, dumbbell-curl, overhead-press, hack-squat, goblet-squat, **preacher-curl**, walking-lunge, barbell-bent-over-row-pronated.
- These need diff verification plus coaching.
- **preacher-curl:** the evidence and text work from the P3 preacher review is done (see the P3 findings). It is still `needs-review` for human content review: coaching (no cues or mistakes yet). The coverage-tag question is closed: tag removed (O2, `0b9381a`).
- **Coverage tags:** O2 applied (preacher-curl tag removed). **Blocked:** the incline-dumbbell-curl tag removal fails validation, because the `biceps-complete` reps would have to change (8–15 → 10–20); decision returned. All legacy position tags are queued record by record in `POSITION-TAG-REVIEW-QUEUE.md`. preacher-curl-machine (P4) tag is unverified.

## P4: untouched `needs-review` (66), by exposure
plank, chin-up-supinated, dumbbell-pullover-lat-biased, dumbbell-squat-sides, cable-band-external-rotation, isometric-neck-hold, suitcase-carry, push-up-plus, back-extension-45-hip-dominant, triceps-kickback, flat-dumbbell-fly, leg-press-calf-raise, neck-flexion, seated-machine-shoulder-press, machine-chest-press, single-arm-dumbbell-row, cable-reverse-curl, ab-wheel-rollout, reverse-lunge, decline-dumbbell-fly, machine-crunch, back-extension-45-spinal-dominant, machine-reverse-fly, incline-machine-press, farmers-carry, cable-rear-delt-builder, dumbbell-pullover-chest-biased, hip-adduction, russian-twist, incline-dumbbell-press, pronation-supination-work, tibialis-raise, machine-fly-pec-deck, incline-cable-press, neck-extension, flat-dumbbell-press, reverse-grip-lat-pulldown, cable-chest-press, cable-hammer-curl-rope, hex-press, lying-triceps-extension-skull-crusher, preacher-curl-machine, machine-triceps-extension, reverse-grip-barbell-row, standing-cable-hip-flexion, drag-curl, pull-up-pronated, cable-shoulder-press, smith-machine-squat, sumo-deadlift, cable-drag-curl, lateral-neck-flexion, neutral-grip-lat-pulldown, rack-pull, sumo-squat, stiff-leg-deadlift, smith-machine-romanian-deadlift, conventional-deadlift, nordic-hamstring-curl, smith-machine-bench-press, smith-machine-incline-press, t-bar-row, zottman-curl, smith-machine-shoulder-press, front-squat, smith-machine-bulgarian-split-squat.

## Evidence and video
- **Unresolved citations (2):**
  - incline-dumbbell-curl: EMG work formerly cited as "Lehman, 2005-era";
  - hip-thrust: EMG work formerly cited as "Contreras et al.-era", and its 2-3x figure.
- **Not yet re-checked:** sources cited only by `needs-review` records.
- **Videos:** 140 metadata-checked, 0 watched.
