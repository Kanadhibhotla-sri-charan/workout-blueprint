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
