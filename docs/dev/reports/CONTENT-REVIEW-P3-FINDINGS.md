# Content Review — P3 Findings

_Running list of issues found ahead of the P3 human review (edited `needs-review` records) and in related records. Items here are **not** fixed. Each needs a reviewer decision. Target strings are out of scope until a measured, approved change._

| # | Record | Status | Finding | Source of finding | Proposed handling |
|---|---|---|---|---|---|
| 1 | preacher-curl | needs-review (P3) | **Internal tension inconsistency.** `why_this_exists` says the pad "keeps tension nearer the top of the range". The first programming note describes a bottom-loaded activation window (high early in the concentric, dropping as the elbow flexes). The spider-curl note says the spider variation's tension is "highest near the top instead of at the bottom", implying the preacher is bottom-loaded. The record can't be right both ways | Batch 1 closure | Reviewer to decide which loading description is correct for a pad set at the usual angle, then align `why_this_exists`, `resistance_profile` and the notes. `why_this_exists` appears in Decide explanations, so measure the text change |
| 2 | preacher-curl, preacher-curl-machine | needs-review | `primary_targets` still "biceps (short-head-biased, EMG-supported)", although the evidence notes now say a short-head bias is not confirmed | Batch 1 closure | Target string; owner decision. Proposed wording for both records, kept identical so their structural target match is preserved: "biceps (short-head bias proposed, not confirmed by hypertrophy data)". Measure before release |
| 3 | preacher-curl | needs-review | EMG activation-window claim in the first programming note has no identified source (labelled "citation unresolved") | Batch 1 closure | Locate a source or remove the claim |

## Noted during the P2 non-package work (not P3, kept here for the human reviewer)

| Record | Status | Finding |
|---|---|---|
| glute-bridge | needs-review (P2) | After the approved first-limitation correction, limitations 1 and 2 both state that the range is shorter than a hip thrust's. Limitation 1 is the Decide watch-out; consider trimming limitation 2 during the human review |
| single-leg-romanian-deadlift | needs-review (P2) | The `lengthened-position-emphasis` coverage tag fits the dumbbell version only (the band version loads the top); the technique cues are dumbbell-specific. Ranking input, so out of scope for text-only work |

## P3 preacher-curl review: outcomes

| # | Item | Outcome |
|---|---|---|
| 1 | Tension inconsistency | **Resolved by evidence, not inference.** Two sources checked against the source text address the record's actual setups (barbell, EZ-bar, dumbbell on a preacher bench). Oliveira et al. 2009 (PMC3737788): dumbbell preacher curl EMG highest near full extension, falling toward the top. Nunes et al. 2020 (PMC7460162): barbell preacher curl described as applying greater torque with the elbows extended (qualitative, not a measured curve). Neither reports a pad angle. **Applied:** `why_this_exists` now says the free-weight curl is hardest with the elbows near straight and gets easier toward the top, and that the exact curve depends on the pad angle. A new evidence note cites both sources with their caveats. The spider-curl note was already consistent |
| 2 | Target strings | **Measured, then applied.** Both records changed to "biceps (short-head bias proposed, not confirmed by hypertrophy data)". In-memory measurement before applying (two runs, byte-identical): 0 Best Fit, 0 alternative, 0 complement, 0 answer-status, 0 explanation and 0 watch-out changes across 39,672 scenarios. Expected, because the two records keep sharing one identical string and no other record uses the old or new string, so every structural target-share count is unchanged in any context |
| 3 | EMG citation | **Resolved.** Identified as Oliveira et al. 2009 and checked against the PMC full text (the record and pattern match; caveats: pad angle not reported, the methods' posture labelling unclear). The programming note now cites it in place of the "citation unresolved" label |

**New findings (open, for architect / human review):**

| Record | Finding | Why not changed |
|---|---|---|
| preacher-curl | `coverage_categories` includes `shortened-position-emphasis`, and the summary says "strict, shortened-position biceps stimulus". For the free-weight setups the evidence above points to the curl being hardest near full extension (the longer elbow-flexor length). "Shortened" may refer to the shoulder position (the long head is shortened at the shoulder), but as written it is ambiguous | `coverage_categories` is a ranking input (visual-area goal key; replace / complement coverage share). Changing it needs a measured, architect-approved change. The summary wording should be decided together with the tag |
| preacher-curl-machine | Same tag. The machine is "often cam-adjusted through the range", so its curve depends on the machine | Same |
| glute-bridge | Duplicate range limitation, now in `CONTENT-REVIEW-QUEUE.md` (P2) | Human review |
