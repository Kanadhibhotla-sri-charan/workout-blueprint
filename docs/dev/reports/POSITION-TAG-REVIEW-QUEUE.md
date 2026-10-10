# Position-Tag Review Queue (record by record)

_Under the SCHEMA definition adopted in `POSITION-TAG-SEMANTICS-CORRECTION.md`, `lengthened-` / `shortened-position-emphasis` mean **where external resistance peaks in the movement's own range**. Tags authored earlier may use the older shoulder / hip-position reading._

**Rules:**
- No tag is bulk-removed or reinterpreted.
- Each proposed change is measured on its own: Decide answers (full scenario space, twice) **and** Build packages (see the cascade rule).
- Each change is then approved separately.

## Cascade rule found in this step

For an **isolation** record, the tag selects the programming profile (`programming-profiles.yaml`). `validate-data` requires every Build-package entry's `reps` to equal that profile's primary range.
- **Consequence:** removing or changing the tag on a package-linked isolation record also requires a Build-package prescription change, or the dataset fails validation.
- **Compound records:** their profile comes from `heavy-compound` / `stable-compound`, so they don't cascade.

## Blocked: incline-dumbbell-curl (decision returned)

The approved removal of `lengthened-position-emphasis` **was not applied**:
- it fails validation;
- `biceps-complete` prescribes the incline curl at **8–15** reps, and the profile would become `moderate-hypertrophy-isolation` (primary range **10–20**);
- the earlier in-memory measurement covered Decide only and did not include this package dependency.

The data was reverted to `main`.

| Option | What changes |
|---|---|
| A. Remove the tag **and** change `biceps-complete` incline-curl reps 8–15 → 10–20 | Decide: 14 Best Fit / 42 alternative / 10 complement-list changes, 0 answer status, no pinned cases (measured earlier). Build: one prescription change in `biceps-complete`. Its contribution text ("Stretch-position biceps work the standing curl's resistance curve under-loads") would also need review |
| B. Retain the tag for now | No change; the record stays inconsistent with the SCHEMA definition until evidence is found |

Changing a validation rule to allow a mismatch is not proposed.

## Queue

**Columns:**
- **Basis:** what the record itself says about where resistance peaks. (a) = states a resistance peak; (b) = states a shoulder / hip position; none = no statement.
- **Package reps:** the Build entries whose reps depend on the tag (isolation only).
- **Exposure:** Best Fit count across the 39,672-scenario space.

**Order:** package-linked sense-(b) records first, then contradictions, then by exposure.

| # | Record | Tag | Type | Basis in the record | Package reps tied to tag | Exposure | Status | Note |
|---|---|---|---|---|---|---:|---|---|
| 1 | incline-dumbbell-curl | lengthened | isolation | (b) "lengthened shoulder position"; "hardest with the arm long" | biceps-complete 8–15 | 18 | reviewed | **Blocked above.** Oliveira 2009 EMG rose toward the top (activation, not resistance) |
| 2 | overhead-triceps-extension | lengthened | isolation | (b) "shoulder flexed (overhead)"; no resistance peak stated | triceps-efficient, triceps-complete 8–15 | 128 | reviewed | Maeo 2023 supports long-head growth from the overhead *position*, which is sense (b), not a resistance peak |
| 3 | cable-overhead-extension-leaning-forward | lengthened | isolation | (b) shoulder flexed; "constant tension" | triceps-complete 8–15 | 64 | reviewed | A constant-tension claim conflicts with any single peak |
| 4 | seated-leg-curl | lengthened | isolation | (b) "hip flexed"; "fixed-path machine" | hamstrings-efficient, hamstrings-complete 8–15 | 108 | reviewed | Maeo 2024 supports the hip-flexed *position* (sense b) |
| 5 | incline-dumbbell-press | lengthened | compound | (a) **"hardest through the middle of the range"** | — | 74 | needs-review | **Contradiction**: the record's own resistance text says mid-range |
| 6 | cable-lateral-raise | lengthened | isolation | "constant tension… meaningful even in the stretched bottom" | shoulders-efficient, shoulders-complete 8–15 | 94 | reviewed | A constant tension, not a peak |
| 7 | incline-cable-press | lengthened | compound | "constant tension" | — | 62 | needs-review | Same |
| 8 | preacher-curl-machine | shortened | isolation | (b) "shortened shoulder position"; "cam-adjusted" | — | 36 | needs-review | **Unverified** (ledger); kept as instructed |
| 9 | reverse-nordic-curl | lengthened | isolation | none ("scales by range controlled") | quads-complete 8–15 | 363 | reviewed | Bodyweight lean-back; peak not stated |
| 10 | lying-triceps-extension-skull-crusher | lengthened | isolation | none | — | 138 | needs-review | |
| 11 | flat-dumbbell-press | lengthened | compound | none ("deeper bottom-range stretch") | — | 40 | needs-review | Range, not peak |
| 12 | romanian-deadlift | lengthened | compound | none | — | 172 | reviewed | |
| 13 | stiff-leg-deadlift | lengthened | compound | none | — | 9 | needs-review | |
| 14 | smith-machine-romanian-deadlift | lengthened | compound | "free-weight-like load curve" | — | 8 | needs-review | |
| 15 | hip-thrust | shortened | compound | Movement pattern "shortened range (hip fully extended)"; no curve in `resistance_profile` | — | 40 | reviewed | |
| 16 | dumbbell-pullover-lat-biased | lengthened | isolation | (a) "hardest overhead" | — | 381 | needs-review | Consistent as stated; not source-verified |
| 17 | dumbbell-pullover-chest-biased | lengthened | isolation | (a) "hardest overhead" | — | 89 | needs-review | Same |
| 18 | single-leg-romanian-deadlift | lengthened | compound | (a) "hardest at the bottom stretch" (dumbbell); band loads the top | — | 632 | needs-review | Multi-setup: tag describes the primary (dumbbell) setup |
| 19 | sissy-squat | lengthened | isolation | (a) "hardest at the bottom" | — | 476 | needs-review | |
| 20 | incline-dumbbell-fly | lengthened | isolation | (a) "hardest at the bottom stretch" | chest-complete 8–15 | 428 | reviewed | |
| 21 | flat-dumbbell-fly | lengthened | isolation | (a) "hardest at the bottom stretch" | — | 203 | needs-review | |
| 22 | decline-dumbbell-fly | lengthened | isolation | (a) "hardest at the bottom stretch" | — | 82 | needs-review | |
| 23 | dip-chest-biased | lengthened | compound | (a) "hardest at the bottom stretch" | — | 262 | reviewed | |
| 24 | glute-bridge | shortened | compound | (a) "hardest at the top" | — | 1,382 | needs-review | |
| 25 | single-leg-hip-thrust | shortened | compound | (a) "hardest at the top" | — | 64 | needs-review | |

**Notes on the table:**
- "Consistent as stated" means the record's own text matches the definition. It is **not** a source-verified resistance curve. Those rows still need an evidence check before a reviewer confirms them.
- Already handled: preacher-curl (tag removed, O2).
