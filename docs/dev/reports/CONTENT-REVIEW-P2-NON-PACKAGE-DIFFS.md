# Content Review — P2 Non-Package Diffs (glute bridge, single-leg RDL)

_Base: `main` at `3200319`._

**Method:**
- AI diff verification (Claude): each field changed since the pre-expansion record (`dc85022`) was checked for mechanical accuracy and for consistency with the rest of the record.
- No external sources were used and no video was watched.

**Status:** both records **stay `needs-review`**, as instructed, until a substantive human review is complete. No data was changed in this step.

## glute-bridge (Best Fit in 1,382 scenarios)

| Changed field | Content | Verdict |
|---|---|---|
| `equipment` / `equipment_setups` | `[[bodyweight], [barbell]]` | Accurate: the barbell glute bridge needs only the bar (plates implied, as elsewhere in the vocabulary) |
| `resistance_profile` | Adds "or a barbell across the hips" | Accurate |
| `programming_notes` + barbell | "Same movement with a padded bar… far more load than a dumbbell… range still shorter than a barbell hip thrust's" | Accurate |
| `programming_notes` + hamstring bias | Heels on a bench, knees nearly straight | Accurate. **Now duplicates the separate `hamstring-bridge` record** (added in Batch 7) |

**Consistency findings outside the diff:**
1. **First limitation (shown as the Decide watch-out).** It says loading from the floor "(a dumbbell or plate on the hips) caps out well below what a barbell hip thrust allows". With the barbell setup, the loading ceiling is no longer the limit; the shorter range is.
   - This sentence was restored verbatim in `a8e8348` at the owner's request.
   - **Proposed** (owner decision; it would change the watch-out text in up to 1,382 answers): "Bodyweight alone stops being challenging quickly for trained lifters, and a dumbbell or plate on the hips adds only modest load; even with a barbell, the range is shorter than a barbell hip thrust's because the shoulders stay on the floor."
2. **Hamstring-bias note.** **Proposed:** point to the dedicated record instead of repeating it ("For a hamstring-biased version, see the hamstring bridge"). This is a detail-page change only.
3. `best_used_when` ("No bench, barbell or machine is available…") is still true for the bodyweight version and needs no change.

## single-leg-romanian-deadlift (Best Fit in 632 scenarios)

| Changed field | Content | Verdict |
|---|---|---|
| `equipment` / `equipment_setups` | `[[dumbbell], [band]]` | Accurate |
| `resistance_profile` | "A band stood on under the standing foot gets heavier as the hips straighten, so it loads the top of the hinge more than the stretched bottom" | Accurate: the band lengthens as the torso rises |
| `programming_notes` + band | Stand on the band with the working foot, hold both ends, hinge; shorter grip adds resistance | Accurate |

**Consistency findings outside the diff (for the human reviewer, no change proposed):**
- **`coverage_categories` includes `lengthened-position-emphasis`.** That describes the dumbbell version; the band version loads the top instead, as its own resistance text says. It is a ranking input and per-record, so it is out of scope here; noted for awareness.
- **Technique cues are dumbbell-specific** ("hold the dumbbell in the opposite hand", "keep the dumbbell close"). The band note covers the band setup separately.

## Queue after this step

| Tier | Remaining |
|---|---|
| P1: new records | 9. Need human review and watched videos; **no promotion started** |
| P2: not in a package | 2. Diffs verified by AI; awaiting substantive human review and the owner decisions above |
| P3: edited `needs-review` | 11, including the preacher-curl items from the Batch 1 closure |
| P4: untouched `needs-review` | 66 |
| Evidence | 3 unresolved citations (incline-curl EMG, hip-thrust EMG and 2-3x figure, preacher-curl EMG note); sources cited only by `needs-review` records not yet re-checked |
| Videos | 140 metadata-checked, 0 watched |

## Corrections applied (owner-approved, P2 content corrections)

| Record | Field | Before | After |
|---|---|---|---|
| glute-bridge | `limitations[0]` (Decide watch-out) | Bodyweight alone stops being challenging quickly for trained lifters, and loading it from the floor (a dumbbell or plate on the hips) caps out well below what a barbell hip thrust allows. | Bodyweight alone stops being challenging quickly for trained lifters, and a dumbbell or plate on the hips adds only modest load; even with a barbell, the range is shorter than a barbell hip thrust's because the shoulders stay on the floor. |
| glute-bridge | `programming_notes[2]` | Hamstring-bias variation: rest the heels on a bench with the knees nearly straight and drive the hips up; the hamstrings take over much of the work from the glutes. One leg at a time makes it harder. | For a hamstring-biased version, see the hamstring bridge. |
| romanian-deadlift | `best_used_when[0]` | The strongest available stretch-mediated growth stimulus for the hamstrings and glutes together is wanted, in a lengthened position no curl variation reaches. | Heavy hinge work is wanted that trains the hamstrings and glutes together at a long muscle length. |

**The RDL wording:**
- It drops both unsupported claims: "strongest available", and "no curl variation reaches". The seated leg curl's cited trial trains the hamstrings lengthened in a hip-flexed curl.
- It asserts no alternative ranking.
- It stays consistent with the record's evidence note: no RDL-specific study; the stretch-length literature is a direction, not a settled magnitude.

**Status:**
- glute-bridge and single-leg-romanian-deadlift stay `needs-review`; AI diff verification alone does not qualify them.
- romanian-deadlift stays `reviewed` (exercise data); its citation status is in `EVIDENCE-LEDGER.md`.

**New P3 findings file:** the preacher-curl tension inconsistency is recorded in `CONTENT-REVIEW-P3-FINDINGS.md`, together with the open target-string and citation items. Target strings are unchanged.

### Measured effect (full scenario space vs `main` `c0da804`; two runs, byte-identical)

| Check | Result |
|---|---|
| Best Fit / alternative / complements / answer status | **0 changes** |
| Explanation and other non-watch-out text | **0 changes** |
| Watch-out text | **1,382 changes**: every answer whose Best Fit is the glute bridge (its first limitation), and no others |
| By goal | different stimulus 441, complement 441, replace 192, visual-area 96, limited-equipment 96, low-fatigue 64, build-base 52 |
| RDL `best_used_when`, glute-bridge note | Detail pages only |

| Gate | Result |
|---|---|
| `validate-data` | PASS, 140 |
| Vitest | 345 / 345 |
| oxlint | exit 0 |
| Build | OK |
| Playwright | 3 / 3 |
