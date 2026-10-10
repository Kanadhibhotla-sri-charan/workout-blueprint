# Content Review — Batch 1

_Base: `main` at `56d3ac1`, 140 exercises. **Unchanged:** no engine or ranking change, no exercise added. Procedure: `CONTENT-REVIEW-CHECKLIST.md`; evidence status: `EVIDENCE-LEDGER.md`._

**Reviewer and method:**
- Diff verification by Claude (AI), at the owner's request.
- Each changed field was compared with the pre-expansion record (`dc85022`) and checked for mechanical accuracy and internal consistency.
- No external sources were used for the diffs, and no video was watched.

## 1. Pending package exercises: changed-field verification

| Record | Changed fields | Result |
|---|---|---|
| barbell-dumbbell-shrug | band setup, resistance text, band note | **Verified**: a band stood on does get heavier as the shoulders rise |
| bulgarian-split-squat-hip-dominant | `[bodyweight, bench]` setup, resistance text, note | **Verified** |
| bulgarian-split-squat-knee-dominant | `[bodyweight, bench]` setup, resistance text, note | **Verified** |
| cable-fly | low-to-high note | **Verified**: describes common use, not an effect claim; the record's evidence note already marks pulley-height bias as unresolved |
| cable-lateral-raise | lean-away note | **Verified**: mechanical description |
| chest-supported-row | seal-row note; `overlaps_with` + single-arm-dumbbell-row (approved in the Quality Gate) | **Verified** |
| close-grip-bench-press | JM press note | **Verified** |
| hammer-curl | band setup, resistance text, note | **Verified** |
| reverse-curl | band setup, resistance text, note | **Verified** |
| reverse-wrist-curl | band setup, resistance text, note; `overlaps_with` − wrist-curl (approved) | **Verified** |
| romanian-deadlift | good-morning note | **Verified**: the longer lever / lower load description is correct |
| standing-calf-raise | donkey note | **Verified** |
| wrist-curl | band setup, resistance text, note; `overlaps_with` − reverse-wrist-curl (approved) | **Verified** |
| straight-arm-pulldown | band setup, resistance text, note | **Corrected; awaiting owner confirmation.** The text said a band anchored overhead "gets lighter as the hands approach the thighs… hardest near the start". The band stretches further as the hands move down and away from a high anchor, so it gets **heavier** toward the end of the pull |
| overhead-triceps-extension | band setup, resistance text, note | **Corrected; awaiting owner confirmation.** The note said "step further from the anchor", but the anchor is under the lifter's own back foot. Now "shorten the band or use a stronger band". The resistance text (heaviest at the top) was already correct |
| seated-calf-raise | `[dumbbell, bench]` setup, resistance text, note | **Owner decision needed** (§3.1) |

**Outcome:**
- The **13 verified** records are back to `reviewed` and removed from `PENDING_DIFF_REVIEW`.
- The pending list now holds 3 records, each annotated with its reason.
- Library status: 49 `reviewed`, 91 `needs-review`.
- **Caveat:** promotion here covers the expansion diff only. Their evidence notes and videos keep the status shown in the evidence ledger (videos metadata-only; citations re-checked only where the ledger says so).

## 2. Validation and measured effect

| Check | Result |
|---|---|
| Data generation + `validate-data` | PASS, 140 records |
| Vitest | 344 / 344 |
| oxlint | exit 0 |
| Production build | OK |
| Playwright | 3 / 3 |
| Best Fit / alternative / complements / answer status vs `main` (39,672 scenarios; two runs, byte-identical) | **0 changes** |
| Text changes | **550**: the "stimulus" line of answers whose Best Fit is the straight-arm pulldown, now showing the corrected resistance text. Nothing else changed |

## 3. Proposed data corrections (not applied, owner decision)

### 3.1 seated-calf-raise: dumbbell setup vs its note

- **The mismatch:** the setup is `[dumbbell, bench]`, but the note says to put the balls of the feet "on a plate or step". The standing calf raise models that elevation as `block or plate`.
- **Option A, reword:** the elevation is optional for range. "For a longer range, put the balls of the feet on a plate or step."
  - No recommendation change.
  - Honest: a seated raise works flat-footed with a shorter range.
- **Option B, add `block or plate` to the setup:** the home context (dumbbell, bench, …) no longer qualifies, so home soleus answers would empty again. That needs measuring first.
- **Pre-review lean:** A.

### 3.2 Evidence corrections (from the ledger)

| Record | Proposed replacement for the faulty part |
|---|---|
| incline-dumbbell-curl, preacher-curl | Replace "Kassiano et al. (2024, PMC11906226)… clearest direct hypertrophy evidence" with: "The closest direct hypertrophy comparison, Attarieh et al. (2025, European Journal of Sport Science, PMC11906226), trained a shoulder-flexed preacher cable curl against a shoulder-extended Bayesian cable curl and found similar growth at every measured biceps and brachialis site, with no regional difference. The long-head bias claim therefore rests on EMG and mechanics rather than hypertrophy data. Evidence quality: low to moderate." |
| incline-dumbbell-curl | "Lehman, 2005-era EMG shoulder-position studies": cite a specific study or remove |
| incline-dumbbell-curl, flat-dumbbell-fly, straight-arm-pulldown | Replace "Wolf et al. (2023, IJSC) found lengthened partial-ROM training matched or exceeded full-ROM training[, with both beating shortened-position training]" with: "Wolf et al. (2023, International Journal of Strength and Conditioning, meta-analysis) found full and partial ROM produced broadly similar hypertrophy, with a possible but inconclusive advantage for partials at long muscle lengths." |
| hip-thrust | "bioRxiv/Sports Medicine" → "Frontiers in Physiology, 2023 (bioRxiv preprint first)". "Contreras et al.-era EMG work": cite a specific study or remove the 2–3× figure |

**Claim-level consequence for the reviewer:**
- With PMC11906226 correctly read, the incline curl's long-head "bias" framing (and the preacher curl's mirror of it) has **no supporting hypertrophy trial**, and the one direct trial points the other way.
- The incline curl is `reviewed` and a Build-package exercise.
- **Decide** whether its claim text should be softened as well, and whether it should stay `reviewed` meanwhile. Demoting it would require adding it to the pending list, which the list's "only shrinks" rule doesn't allow without your approval.

## 4. The 13 ambiguous overlap pairs: decisions needed

Unchanged in the data. "Ranking effect" is the number of Best Fits that would change if the pair were removed, measured under the approved tie-break during the Quality Gate assessment. A pair with no ranking effect is a documentation question only.

| # | Pair | Question for the decision | Ranking effect of removing |
|---|---|---|---|
| 1 | barbell-dumbbell-shrug ~ farmers-carry | Does a loaded carry cover substantially the same ground as a shrug (isometric trap hold vs trap elevation)? | 0 |
| 2 | farmers-carry ~ suitcase-carry | Are two-handed and one-handed carries the same ground (grip / traps vs anti-lateral-flexion)? | 0 |
| 3 | cable-band-external-rotation ~ face-pull | Face pulls include external rotation; is that enough overlap with a dedicated rotator-cuff drill? | 0 |
| 4 | copenhagen-plank ~ side-plank | Same side-lying position, different targets (adductors vs obliques) | 0 |
| 5 | hammer-curl ~ pronation-supination-work | Shared brachioradialis, different action (elbow flexion vs forearm rotation) | 0 |
| 6 | pronation-supination-work ~ reverse-curl | Same question as #5 | 0 |
| 7 | reverse-curl ~ reverse-wrist-curl | Both tagged forearm extensors (brachioradialis-led curl vs wrist extension) | 0 |
| 8 | hanging-knee-leg-raise ~ standing-cable-hip-flexion | Is the knee raise mainly hip flexion (same ground) or abs (different)? | 0 |
| 9 | sumo-deadlift ~ sumo-squat | Wide-stance hinge vs wide-stance squat | 0 |
| 10 | bulgarian-split-squat-hip-dominant ~ single-leg-romanian-deadlift | Two unilateral glute / hip patterns, different movements | 0 |
| 11 | back-extension-45-spinal-dominant ~ romanian-deadlift | Erector-led trunk extension vs hamstring-led hinge | 0 |
| 12 | leg-press-calf-raise ~ seated-calf-raise | Straight-knee (gastrocnemius) vs bent-knee (soleus) calf work | 0 |
| 13 | flat-dumbbell-fly ~ hex-press | Is a squeeze press close enough to a fly to avoid pairing them? | **24**: removing it makes the flat dumbbell fly the hex press's complement / different-stimulus pick, replacing the cable fly (8 + 8) and the pec deck (4 + 4) |

**Reply with keep / remove for each.** Removals are applied as data changes, with the snapshot test updated and the change measured.

## 5. Remaining queue

| Tier | Remaining | Next step |
|---|---|---|
| P1: new records (9) | 9 | Human review against `CONTENT-REVIEW-CHECKLIST.md`; pre-review questions listed there. Videos need watching |
| P2: pending package diffs | 3 | Owner confirmation for straight-arm-pulldown and overhead-triceps-extension; decision §3.1 for seated-calf-raise |
| P2: non-package (2) | glute-bridge, single-leg-romanian-deadlift | Same diff verification as §1 (next batch) |
| P3: edited `needs-review` (11) | 11 | Diff verification plus coaching |
| P4: untouched `needs-review` (66) | 66 | Coaching and full review, by exposure |
| Evidence | Sources cited only by `needs-review` records | Continue the ledger |
| Overlaps | 13 ambiguous pairs | Decisions in §4 |
