# Content Review Tier 4 — Remainder (blanket owner approval)

_Base: `ecba75e`. Covers the last **49** Tier 4 records after `lying-triceps-extension-skull-crusher` and `neck-flexion`, plus those two records' application._

## Basis for sign-off — read this first

Partway through Batch 6, the owner said: "Consider this as my approval for all the pending proposals and let's get on with it."

The remaining records were then handled under these rules:
- **Applied:** missing coaching (4 cues + 3 mistakes, to the coaching standard), clear-cut typos, and self-contradictions. Only changes measured to cause **0 recommendation changes** were applied.
- **Logged, not changed:** debatable or unsourced claims, and anything that would shift recommendations.
- **`review_status: reviewed`** was set on the owner's blanket approval. **These 49 records were not individually presented to the owner**, unlike every earlier batch. Their content review is therefore an AI review accepted wholesale by the owner. If per-record human review is required, re-review these records; the list is below.
- **Video verification:** unchanged; all records stay `metadata`. No footage was watched.
- **Citation verification:** no new citations were verified (see the open items).

**Records (exposure):** machine-chest-press (138), incline-machine-press (134), single-arm-dumbbell-row (124), machine-fly-pec-deck (106), cable-reverse-curl (106), hip-adduction (104), machine-crunch (96), ab-wheel-rollout (96), dumbbell-pullover-chest-biased (89), farmers-carry (82), decline-dumbbell-fly (82), incline-dumbbell-press (68), machine-reverse-fly (58), tibialis-raise (56), incline-cable-press (52), pronation-supination-work (50), neck-extension (40), flat-dumbbell-press (40), reverse-grip-lat-pulldown (36), preacher-curl-machine (36), cable-hammer-curl-rope (36), cable-drag-curl (32), hex-press (30), cable-chest-press (30), cable-rear-delt-builder (28), back-extension-45-spinal-dominant (26), standing-cable-hip-flexion (24), reverse-grip-barbell-row (24), machine-triceps-extension (24), pull-up-pronated (18), drag-curl (18), sumo-deadlift (16), smith-machine-squat (16), cable-shoulder-press (16), sumo-squat (12), rack-pull (12), neutral-grip-lat-pulldown (12), lateral-neck-flexion (12), zottman-curl (9), stiff-leg-deadlift (9), smith-machine-romanian-deadlift (8), smith-machine-bulgarian-split-squat (8), t-bar-row (6), smith-machine-incline-press (6), smith-machine-bench-press (6), nordic-hamstring-curl (6), conventional-deadlift (6), smith-machine-shoulder-press (4), front-squat (0).

## Corrections applied

| Kind | Records |
|---|---|
| Coaching added (4 cues + 3 mistakes) | All 49, plus skull crusher and neck flexion |
| Typo (stray space after a hyphen) | single-arm-dumbbell-row, dumbbell-pullover-chest-biased, incline-dumbbell-press (×2), standing-cable-hip-flexion, smith-machine-squat, cable-shoulder-press, nordic-hamstring-curl, front-squat (×2), neck-flexion |
| `complements` suggested an exercise the record lists as an overlap, contradicting the "avoid stacking both" watch-out | cable-rear-delt-builder (face pull / rear-delt fly → "Side-delt and pressing work."); rack-pull (full deadlift → Romanian deadlift); sumo-squat (narrower squat → hip hinge) |

## Measured

All 39,672 scenarios vs `ecba75e`; two byte-identical runs.
- **0** Best Fit, alternative, complement-list or empty / filled changes.
- **60 text-only changes**, all from the typo fixes in displayed fields:
  - standing-cable-hip-flexion watch-out: 24;
  - neck-flexion `mirror_effect`: 16 + 8 (as an alternative under neck-extension);
  - single-arm row: 2 + 4 (as an alternative under seated-cable-row);
  - cable-shoulder-press: 4;
  - smith / front squat as an alternative under back-squat: 2.
- Pinned case #6 (skull crusher as current) is unchanged.

## Logged, not changed

- **"Constant tension"** on cable-only records: cable-reverse-curl, incline-cable-press, cable-hammer-curl-rope, cable-drag-curl, cable-chest-press, cable-shoulder-press, cable-rear-delt-builder. The cable's force is constant, but the effective load still varies with joint angle. The owner approved rewording this on cable-curl. Not applied here: it is loose rather than wrong, and it would change resistance text in many answers.
- **conventional-deadlift:** "the single heaviest mechanical-tension stimulus available" is an unsourced superlative. The barbell row's equivalent was softened with owner approval.
- **zottman-curl:** `complements` names the reverse curl it overlaps with, but explicitly "programmed on their own", so it is intentional.
- **Machine / Smith presses:** complements name free-weight presses they overlap with, qualified "with a distinct role".
- **hip-adduction:** `less_suitable_when` mentions a cable, but the record models no cable setup.
- **cable-rear-delt-builder:** the video title is "Cable Rear Delt Fly", while the record describes an elbows-below-wrists cable row. It may show a different movement. Needs watching.

## Open citation item

- **decline-dumbbell-fly:** cites **Barnett et al. (1995, JSCR)**, which is **not yet in the evidence ledger**, so the citation is unverified. The other citations in these records (Chaves 2020, Rodríguez-Ridao 2020, Maeo 2023, Schoenfeld & Grgic 2020, Wolf 2023 / 2025, Attarieh 2025) are already ledger-verified.

## Library status

**140 `reviewed` / 0 `needs-review`. 140 videos `metadata` (none watched).**
