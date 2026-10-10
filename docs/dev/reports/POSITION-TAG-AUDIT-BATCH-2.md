# Position-Tag Audit — Batch 2 (findings for approval)

_Analysis only. Approved baseline: `main` at `8665b25`. **The live library, engine, packages and pinned expectations are unchanged.**_

**Method:**
- Every remaining position-tagged record was scanned for statements about where resistance peaks, across all text fields: summary, `why_this_exists`, `resistance_profile`, `best_used_when`, `less_suitable_when`, limitations, notes and cues.
- Clear contradictions with the tag are taken first.
- Each candidate change was measured in memory over the full 39,672-scenario space against the baseline, twice (byte-identical, SHA-256 `eda9c42c…`).
- Profiles and Build-package validity were checked with the app's own resolver and the `validate-data` reps rule.

**Definition (SCHEMA):** a position tag means where the **external resistance peaks** in the movement's own range.

## 1. Clear contradictions found

### A. incline-cable-press: `lengthened-position-emphasis` (compound, `needs-review`)

| Item | Finding |
|---|---|
| Record text | `resistance_profile`: "Constant tension through the whole range." `why_this_exists`: constant tension "unlike a free-weight incline press where the load is easiest at lockout". `best_used_when`: constant tension "keeps the muscle working hardest exactly where a free-weight press goes slack, near the top" |
| Contradiction | The record describes constant tension and emphasises the top. Neither is a peak at the stretched end |
| Evidence status | No source on the incline cable press's resistance curve. The tag contradicts the record's own description; nothing supports it |
| Intended meaning | Probably "keeps tension where a free-weight press loses it", a comparison with free weights, not a stretched-end peak |
| Decide effects | **Best Fit: 28.** Visual-area 10 (upper chest / chest-upper-shelf, any / gym → incline dumbbell fly). Replace 6 ("replace my incline cable press", any / gym → incline barbell press instead of incline dumbbell press). Complement / different stimulus 12 (bodyweight → dip (chest) instead of push-up). Also 52 alternatives, 90 complement lists, 0 empty / filled |
| Programming profile | None: compound, `compound-general` (6–15) before and after |
| Build packages | Not used by any package |
| Pinned cases | None affected |
| **Proposal** | **Remove the tag.** Supported by the record's own text, like the approved cable-overhead-extension change. Do **not** add `shortened-position-emphasis`: "constant tension" isn't a top peak either, and there's no source |

### B. cable-lateral-raise: `lengthened-position-emphasis` (isolation, `reviewed`, package-linked)

| Item | Finding |
|---|---|
| Record text | `resistance_profile`: "Constant tension through the whole range, meaningful even in the stretched bottom position." Other fields stress that the cable keeps tension at the bottom **where a dumbbell raise is easiest**. `why_this_exists`: it "changes where the movement feels hardest" |
| Contradiction | The same pattern as the cable overhead extension: constant tension is not a peak, and the stretched-end emphasis is *relative to the dumbbell* |
| Evidence status | No source on the cable lateral raise's curve. The tag is contradicted by its own resistance text, but the comparative claim is a different, defensible statement |
| Decide effects if removed | Best Fit 4 (arms region visual-area, any / gym → cable / band external rotation); 4 alternatives; 4 complement lists; 0 empty / filled; **90 programming-text** changes |
| Programming profile | `lengthened-position-isolation` (8–15) → `moderate-hypertrophy-isolation` (10–20) |
| Build packages | **Incompatible.** shoulders-efficient and shoulders-complete prescribe 8–15 and would fail validation. Their contribution text ("Stretch-position lateral work… through the bottom of the range where a dumbbell loses it") describes the relative claim, which stays true |
| Pinned cases | None affected |
| **Options** | **B1 (no change):** keep the tag; record it in the ledger as "contradicted by its own resistance text; change blocked by package prescription". **B2:** remove the tag **and** explicitly change both shoulder packages' reps 8–15 → 10–20, a deliberate prescription change requiring your approval. Not done implicitly |

### C. flat-dumbbell-fly: internal text contradiction (tag consistent with most of the record)

| Item | Finding |
|---|---|
| Record text | `resistance_profile`: "hardest at the bottom stretch, easing off as the arms come together at the top". `best_used_when`: "hardest exactly where the muscle is most lengthened". **`why_this_exists`: "the load is hardest around the mid-range and eases at the top"** |
| Contradiction | `why_this_exists` disagrees with the other two statements and with the tag |
| Evidence status | None of the three statements is sourced. The tag stays "consistent as stated, unverified" |
| **Proposal** | **Text only:** remove the unsourced, conflicting mid-range claim from `why_this_exists` ("A free-weight chest adduction option performed flat, the opposite feel from a cable fly."). Same approach as the approved incline-press wording fix. Measured: **0** Best Fit, alternative, complement, status, text or watch-out changes (`why_this_exists` doesn't appear in the measured Decide answers). Tag, profile (lengthened-position-isolation 8–15) and pins unchanged; not in a package |

## 2. Records reviewed with no contradiction (tag preserved, uncertainty recorded)

Per the instruction, no tag is changed just because it is unverified.

| Record | Text vs tag | Evidence status |
|---|---|---|
| decline-dumbbell-fly | "hardest at the bottom stretch": consistent | Consistent as stated, unverified |
| dip-chest-biased | "hardest at the bottom stretch": consistent | Consistent as stated, unverified |
| dumbbell-pullover-chest-biased / -lat-biased | "hardest overhead" (the stretched end): consistent | Consistent as stated, unverified |
| sissy-squat | "hardest at the bottom with the knees fully bent": consistent | Consistent as stated, unverified |
| single-leg-romanian-deadlift | Dumbbell (primary setup) "hardest at the bottom stretch"; band loads the top, stated in its text (SCHEMA multi-setup rule) | Consistent as stated, unverified |
| glute-bridge / single-leg-hip-thrust | "hardest at the top": consistent with shortened | Consistent as stated, unverified |
| hip-thrust | Limitation: "resistance is lightest at the bottom": consistent with shortened | Consistent as stated, unverified |
| flat-dumbbell-press, incline-dumbbell-press | Describe a deeper *range*, not where resistance peaks | Unverified; no contradiction |
| lying-triceps-extension-skull-crusher, reverse-nordic-curl, seated-leg-curl, overhead-triceps-extension, incline-dumbbell-curl | Describe a lengthened *position* (shoulder / hip / long-muscle framing), not a peak | Unverified (old sense); package and pin constraints in earlier reports |
| romanian-deadlift, stiff-leg-deadlift, smith-machine-romanian-deadlift | "stretch" framing; no peak stated | Unverified; no contradiction |
| preacher-curl-machine | "cam-adjusted", no curve | Unverified (already in the ledger) |

## 3. For approval

1. **A, incline-cable-press:** remove `lengthened-position-emphasis`. Measured 28 / 52 / 90 / 0; no profile, package or pin effect.
2. **B, cable-lateral-raise:** B1 (record the contradiction, no change) or B2 (remove the tag **and** explicitly change shoulders-efficient and shoulders-complete reps 8–15 → 10–20). Measured 4 / 4 / 4 / 0 + 90 programming-text.
3. **C, flat-dumbbell-fly:** text-only removal of the conflicting "hardest around the mid-range" claim (0 changes measured).
4. **Ledger:** record the §2 statuses as listed.

Nothing has been implemented. Each approved item will be re-measured twice on the live baseline before release.
