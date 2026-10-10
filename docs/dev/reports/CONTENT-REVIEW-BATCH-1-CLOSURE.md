# Content Review — Batch 1 Closure

_Aligns the incline-curl summary and the related preacher / drag-curl text with the revised evidence (Attarieh et al. 2025: no regional difference between shoulder positions; Wolf et al. 2023 / 2025: long-muscle-length training is a direction, not a proven advantage). Base: `main` at `8737795`._

**Unchanged:** no target, ranking input, equipment setup or default recommendation. The preacher records' `primary_targets` strings are left as they are (see §3).

## 1. Exact text changes (`data/exercises/arms.yaml`)

| Record | Field | Before | After |
|---|---|---|---|
| incline-dumbbell-curl | `summary` | Places the upper arm behind the body for the strongest available stretch-mediated biceps growth stimulus. | Places the upper arm behind the body to load the biceps at a long muscle length, a stretch position the standing curl's resistance curve barely loads. |
| incline-dumbbell-curl | `best_used_when` | A strong stretch-mediated growth stimulus is wanted, which the extended shoulder position delivers in a way a standing curl cannot replicate. | Biceps work at a long muscle length is wanted. The extended shoulder position provides it; a standing curl carries little load at the bottom of the range. |
| incline-dumbbell-curl | `evidence_notes[1]` | …this record's "strongest stretch-mediated stimulus" framing also draws on… / …so "strongest" should be read as a well-supported direction, not a settled magnitude. | …this record's stretch-position framing draws on… / …so training at a long muscle length is a well-supported direction, not a proven advantage in size or a claim that this exercise beats other curls. |
| incline-dumbbell-curl | `mirror_effect` | (already aligned in the follow-up) | no change |
| preacher-curl | `mirror_effect` | Tends to contribute more to fullness and width at the base of the biceps near the elbow than to peak height, since the short head sits more toward the inner arm — a different part of the biceps shape than an incline curl emphasizes. | Often credited with favouring the short head and fullness near the base of the biceps, but the one direct hypertrophy comparison of shoulder positions found similar growth across the biceps, so treat any width-versus-peak shape effect as unproven. Its clearer value is a strict curl with the upper arm fixed and swing removed. |
| preacher-curl | `programming_notes[0]` | …compared to the sustained activation of an incline curl through the whole range — consistent with, though not conclusive proof of, a short-head bias. | …compared to the sustained activation of an incline curl through the whole range — citation unresolved: the EMG source for this has not been identified. EMG shows activation, not growth, and the one direct hypertrophy comparison found no short-head advantage (see evidence_notes). |
| preacher-curl-machine | `mirror_effect` | Same visible direction as the free-weight preacher curl — fullness and width near the base of the biceps. | Same as the free-weight preacher curl — often credited with fullness near the base of the biceps, but that shape effect is unproven (see preacher-curl's evidence_notes). |
| preacher-curl-machine | `evidence_notes[0]` | Same shoulder-position evidence as the free-weight preacher curl (this is the same shortened shoulder position on a fixed path). See preacher-curl's evidence_notes. Evidence quality: moderate. | Same shoulder-position question as the free-weight preacher curl (the same flexed shoulder position on a fixed path). See preacher-curl's evidence_notes: the one direct hypertrophy comparison found no regional difference. Evidence quality: low. |
| drag-curl | `evidence_notes[0]` | …that contradicts the biomechanical principle the incline-curl evidence supports: … the same direction incline curls use, which the EMG evidence ties to a long-head bias, not short. | …that runs against the mechanical argument usually made for incline curls: … the same direction incline curls use, which is argued to favour the long head, not the short. Neither side is confirmed: the one direct hypertrophy comparison of shoulder positions (Attarieh et al. 2025, see incline-dumbbell-curl) found no regional difference. |

**Checked and left unchanged (already consistent):**
- the incline curl's Build-package contribution text ("Stretch-position biceps work the standing curl's resistance curve under-loads");
- the cable curl's Bayesian note (a mechanical description);
- the cable drag curl (defers to drag-curl).

## 2. Measured effect (full scenario space vs `main`; two runs, byte-identical)

| Check | Result |
|---|---|
| Best Fit / alternative / complements / answer status | **0 changes** |
| Watch-out text | 0 changes |
| Explanation text | **20 visual-area answers**: the new preacher / preacher-machine `mirror_effect` text, as Best Fit or alternative. Incline curl / preacher (8), preacher / preacher machine (6), preacher machine / barbell curl (6) |
| Summary, `best_used_when`, notes, evidence | Shown on detail pages only; no Decide text |

| Gate | Result |
|---|---|
| `validate-data` | PASS, 140 |
| Vitest | 345 / 345 |
| oxlint | exit 0 |
| Build | OK |
| Playwright | 3 / 3 |

## 3. Left for the owner or the P3 review (not changed, by instruction)

- **Target strings:** `preacher-curl` and `preacher-curl-machine` still carry `primary_targets: biceps (short-head-biased, EMG-supported)`. It is a target / ranking input: the two records share the exact string, which counts in structural target matching, so it is outside this task. Proposed wording for a later, measured change: "biceps (short-head bias proposed, not confirmed by hypertrophy data)" on both, which keeps them sharing the string.
- **Internal inconsistency (preacher-curl):** `why_this_exists` says the pad "keeps tension nearer the top of the range", while the EMG note describes a bottom-loaded activation window and the spider-curl note says tension is "highest near the top instead of at the bottom". Queued for its P3 review.
- **Unresolved citation (new label):** the preacher-curl EMG activation-window claim (now marked in the note).
