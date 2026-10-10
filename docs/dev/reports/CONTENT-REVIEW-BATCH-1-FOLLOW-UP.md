# Content Review — Batch 1 Follow-up

_Applies the owner's decisions on `CONTENT-REVIEW-BATCH-1.md`. Base: `main` at `aac4dd0`. **Unchanged:** no ranking logic, no exercise added, no new record promoted._

## 1. Pending package exercises (owner decisions)

| Record | Decision | Data |
|---|---|---|
| straight-arm-pulldown | Keep the corrected band resistance description (heavier toward the thighs) | `reviewed` |
| overhead-triceps-extension | Keep the removal of "step further from the anchor" | `reviewed` |
| seated-calf-raise | Make the plate or step optional: "Putting the balls of the feet on a plate or step is optional and adds range at the bottom." The setup stays `[dumbbell, bench]` | `reviewed` |

- `PENDING_DIFF_REVIEW` is now empty. All 16 expansion diffs are verified; three of them after owner-approved corrections.
- The package test still enforces `reviewed` and the coaching counts for every package exercise.
- **Library:** 52 `reviewed`, 88 `needs-review`.

## 2. Evidence corrections (five areas)

| Area | Records | Correction |
|---|---|---|
| PMC11906226 misattribution | incline-dumbbell-curl, preacher-curl | Now Attarieh et al. (2025, Eur J Sport Sci), with the actual finding: similar growth at every measured site, no regional difference. Evidence quality "low" |
| Vague EMG citation | incline-dumbbell-curl | "Lehman, 2005-era" replaced by an explicit **citation unresolved** label; the EMG claim is now presented as a common claim, not a finding |
| Wolf 2023 overstated | incline-dumbbell-curl, flat-dumbbell-fly, straight-arm-pulldown | "Broadly similar hypertrophy, with a possible but inconclusive advantage for partials at long muscle lengths" |
| Plotkin journal | hip-thrust | Frontiers in Physiology, 2023 (bioRxiv preprint first) |
| Vague EMG citation and 2-3x figure | hip-thrust | Explicit **citation unresolved** label for both; presented as commonly cited, not verified |

## 3. Incline-curl long-head claim (softened)

| Field | Before | After |
|---|---|---|
| `primary_targets` | biceps (long-head-biased, EMG-supported) | biceps (long-head bias proposed, not confirmed by hypertrophy data) |
| `mirror_effect` | "Tends to contribute more to biceps peak height specifically — the long head … drives that peak" | Often credited with favouring the long head, but the one direct comparison found similar growth, so a peak-vs-width effect is unproven. Its clearer value is the long muscle length |

- **Ranking safety:** the `primary_targets` string was unique to this record before and after, so structural target-share counts are unchanged (confirmed by the measurement below).
- **Status:** `review_status` stays `reviewed`. Citation status is tracked separately in `EVIDENCE-LEDGER.md`.
- **Not changed:** the summary's "strongest available stretch-mediated" wording is outside the long-head claim and was left as approved. A reviewer may want to align it with the evidence note's "direction, not settled magnitude".

## 4. Overlap decisions

| Pairs | Decision |
|---|---|
| 1–4, 8, 10–12 | **Kept** (unchanged) |
| 5 hammer-curl ~ pronation-supination-work; 6 pronation-supination-work ~ reverse-curl; 7 reverse-curl ~ reverse-wrist-curl; 9 sumo-deadlift ~ sumo-squat; 13 flat-dumbbell-fly ~ hex-press | **Removed** on both sides (where a side listed it) |

- Symmetric matching is unchanged.
- The pinned snapshot `app/src/data/audited-overlaps.json` goes from 160 to 155 pairs.
- New test: all 9 approved removals (Quality Gate 4, this batch 5) stay non-overlapping in both directions.

## 5. Measured effect (full scenario space vs `main`; two runs, byte-identical)

Every changed answer was attributed by re-adding each removed pair on its own. The per-pair change sets add up exactly to the total, with no overlap between them.

| Cause | Best Fit | Alternative | Complement list | Total answers |
|---|---:|---:|---:|---:|
| Pair 13 (flat fly ~ hex press) | **24** | 8 | (with the 24) | 32 |
| Pair 6 (pronation/supination ~ reverse curl) | 0 | 42 | 276 | 318 |
| Pairs 5, 7, 9 | 0 | 0 | 0 | 0 |
| **Total answer changes** | **24** | **50** | **276** | **350** |

- No answer became empty or filled.
- No default-pick (selection-goal) Best Fit changed.

### The 24 Best Fit changes (pair 13): all "complement / different stimulus for my hex press"

| Entry | Context | Tolerance | Before → after | Count |
|---|---|---|---|---:|
| `target:mid-pec`, `outcome:chest-front-width` | Any equipment, gym | none, fatigue | cable fly → **flat dumbbell fly** | 16 |
| same | Any equipment, gym | setup limit | pec deck → **flat dumbbell fly** | 8 |

The count covers both goals (complement and different stimulus, which match) and both entries.

**Why:**
- Before, the flat dumbbell fly was a curated overlap of the hex press, so the complement ranker avoided it, and the tie went to the cable fly or pec deck.
- With the overlap removed, it ties with them on targets and coverage, then wins on equipment continuity: it shares dumbbells with the hex press; cable and machine share nothing.
- A dumbbell fly is a materially different movement (shoulder horizontal adduction vs a press) on the same kit, consistent with the owner's decision that the two don't cover the same ground.
- Under a setup limit the cable fly is filtered out, so the pec deck was the previous pick.

**The other 8 pair-13 changes:** "complement / different stimulus for my flat dumbbell fly", where the push-up is Best Fit. The alternative moves cable chest press → hex press (4 + 4) for the same reason.

### The 318 pair-6 changes: reverse-curl complements

- Pronation / supination work is no longer an overlap of the reverse curl, so the ranker no longer pushes it down as the reverse curl's complement.
- **Complement lists (276):** where the reverse curl is the Best Fit (forearm-extensor and forearm entries, all goals), pronation / supination work replaces the wrist curl in the list (176) or moves ahead of it (100, same items in a new order).
- **Alternatives (42):** "complement / different stimulus for my reverse curl" keeps the reverse wrist curl as Best Fit; the alternative changes wrist curl → pronation / supination work (21 + 21).

### Text-only changes

| Cause | Answers |
|---|---:|
| Watch-out "avoid stacking" note removed: reverse-wrist-curl and pronation-supination-work now have empty `overlaps_with` (192 + 50); flat dumbbell fly as the new Best Fit above (24, already counted in §5) | 266 |
| Incline curl `mirror_effect` (visual-area explanation): Best Fit 14, alternative 4 | 18 |

The resistance-profile and note corrections change no Decide text beyond the above. Notes and evidence are shown only on detail pages.

## 6. Validation

| Check | Result |
|---|---|
| Data generation + `validate-data` | PASS, 140 records |
| Vitest | 345 / 345 (1 new: approved removals) |
| oxlint | exit 0 |
| Production build | OK |
| Playwright | 3 / 3 |

## 7. Review queue after this batch

| Tier | Remaining | Note |
|---|---|---|
| P1: new records | 9 | **Not promoted.** They need substantive human review against `CONTENT-REVIEW-CHECKLIST.md`; videos stay "metadata checked" until watched |
| P2: pending package diffs | **0** | Done |
| P2: not in a package | 2 | glute-bridge, single-leg-romanian-deadlift: diff verification next |
| P3: edited `needs-review` | 11 | preacher-curl's `mirror_effect` now flagged (§2 consequence) |
| P4: untouched `needs-review` | 66 | Coaching and full review, by exposure |
| Evidence | Sources cited only by `needs-review` records; 2 unresolved citations | See `EVIDENCE-LEDGER.md` |
| Videos | 140 metadata-only, 0 watched | Unchanged |
| Overlaps | 0 ambiguous pairs outstanding | All 13 decided |
