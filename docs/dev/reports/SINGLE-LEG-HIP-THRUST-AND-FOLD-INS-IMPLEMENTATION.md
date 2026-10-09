# Single-Leg Hip Thrust and Fold-Ins — Implementation

_Implements the decisions approved in `EXERCISE-CANDIDATES-FOLLOW-UP.md`: the single-leg hip thrust and the confirmed fold-ins. Not implemented, as instructed: upright row, dead bug, wrist roller._

No engine, ranking, UI, target taxonomy or equipment-vocabulary change. Not merged or deployed.

## What changed

| File | Change |
|---|---|
| `data/exercises/hips.yaml` | **New record `single-leg-hip-thrust`**. Glute bridge: barbell added as an alternative setup, with matching text |
| `data/exercises/shoulders.yaml` | `cable-lateral-raise`: lean-away variation note |
| `data/exercises/quads.yaml` | `goblet-squat`: heel-elevated variation note |
| `data/exercises/calves.yaml` | `standing-calf-raise`: donkey variation note (no new setup) |
| `data/exercises/chest.yaml` | `push-up-chest`: deficit variation note |
| `app/src/data/index.test.ts` | Expected exercise count 131 → 132 |
| `docs/dev/KNOWLEDGE-QA.md`, `docs/dev/reports/VIDEO-CURATION-QA.md`, `docs/dev/reports/video-audit.json` | Regenerated |

Record-level diff of the generated data, before (`50ab237`) vs after:
- **Added:** `single-leg-hip-thrust` only. **Removed:** none. **Duplicate IDs:** none.
- **Changed:**

  | Record | Fields |
  |---|---|
  | `glute-bridge` | `equipment`, `equipment_setups`, `resistance_profile`, `programming_notes` |
  | `cable-lateral-raise`, `goblet-squat`, `standing-calf-raise`, `push-up-chest` | `programming_notes` only |

- No other record changed.

## Single-leg hip thrust — exact record

```yaml
- id: single-leg-hip-thrust
  name: Single-Leg Hip Thrust
  summary: A hip thrust on one leg with the upper back on a bench, the bodyweight progression that keeps the glute bridge's shortened-position stimulus challenging once two legs become easy.
  why_this_exists: The glute bridge stops being challenging quickly, and the loaded hip thrust needs a barbell and a padded setup. Working one leg at a time puts roughly twice the load on each glute with nothing but a bench, so home and low-setup lifters can keep progressing direct glute work.
  body_regions:
    - hips
  primary_targets:
    - gluteus maximus
  secondary_targets:
    - hamstrings
    - gluteus medius
  physique_targets:
    - gluteus-maximus
  movement_patterns:
    - hip extension
    - shortened range (hip fully extended)
    - single leg, upper back on a bench
  equipment:
    - bodyweight
    - bench
  exercise_type: compound
  laterality: unilateral
  coverage_categories:
    - shortened-position-emphasis
    - low-setup
    - low-fatigue
    - equipment-limited-substitute
  resistance_profile: Bodyweight on one leg, hardest at the top with the hip fully extended. The range is longer than the floor bridge's because the upper back is raised on a bench, so the hip starts from more bend.
  stability_demand: medium
  skill_demand: low
  setup_time: low
  fatigue_cost: low
  best_used_when:
    - The two-leg glute bridge has become easy and no barbell or hip-thrust setup is available.
    - A low-fatigue glute finisher is wanted that also shows up left-right differences.
  less_suitable_when:
    - A heavy, progressively loaded glute stimulus is the goal and a barbell hip thrust is available.
  mirror_effect: Tends to show up, over time and alongside other glute work, as fuller glutes from the side — the same shortened-position stimulus as the hip thrust, at bodyweight loads.
  advantages: []
  limitations:
    - Loading beyond bodyweight is awkward on one leg; once bodyweight reps are easy, a loaded two-leg hip thrust is the next step.
    - Balance and keeping the pelvis level limit the set before the glute does for some lifters, especially early on.
    - Each side is trained separately, which doubles the time per set.
  technique_cues:
    - Sit with the lower edge of your shoulder blades on the bench, the working foot flat and roughly under the knee, and the other leg lifted.
    - Keep the ribs down and the chin tucked so the hip moves rather than the lower back.
    - Drive through the heel of the working leg until hip, knee and shoulder line up, and hold the top for a second.
    - Keep the pelvis level from side to side throughout the rep, then lower under control until the hip is just above the floor.
  common_mistakes:
    - "Arching the lower back at the top: the spine extends instead of the hip, and the glute does less of the work."
    - "Letting the free-leg side of the pelvis drop: the rep turns into a twist and the working glute unloads."
    - "Working foot too far forward: the hamstrings take over, often cramping before the glute has done much."
  programming_notes:
    - "Progress from the two-leg glute bridge: add a pause at the top, then move to this, then add a load on the working hip or switch to a barbell hip thrust when one is available. Start each set with the weaker side and match its reps on the stronger side."
  alternatives: []
  complements:
    - Glute work in the lengthened, hip-bent position, such as Romanian deadlifts or single-leg Romanian deadlifts.
  overlaps_with:
    - glute-bridge
    - hip-thrust
  evidence_notes: []
  review_status: needs-review
  video_link: https://www.youtube.com/watch?v=GoqoWSAiOsA
  video_creator: ashleybordenfitness
  video_title: "Single leg hip thrust: shoulders on bench"
  video_status: verified
  video_verified_on: "2026-10-08"
  video_verification_method: metadata
```

| Requirement | Result |
|---|---|
| Target | `gluteus-maximus` only. No glute medius/minimus physique target |
| Body region | `hips` only. No cross-region tag |
| Equipment | `[bodyweight, bench]`: one setup, so no `equipment_setups` field is needed (absent = the single `equipment` setup, per SCHEMA.md) |
| Overlap | `overlaps_with: [glute-bridge, hip-thrust]`, both canonical IDs (validator resolves them) |
| Coaching | 4 technique cues, 3 common mistakes, 3 limitations, progression note. Meets the coaching gate minimums (3 / 2) and the mechanical checks |
| Evidence | `evidence_notes: []`. The record makes no material empirical claim (no head-bias, EMG or "best stimulus" claim), so the standard says empty is correct. Nothing was invented |
| Video | `https://www.youtube.com/watch?v=GoqoWSAiOsA`, "Single leg hip thrust: shoulders on bench" (ashleybordenfitness). Verified 2026-10-08 by **title/channel metadata via YouTube oEmbed; footage not watched**, the same Phase 7 standard as every other record. It matches this record's exact variant: shoulders on a bench, single leg, bodyweight |
| Review status | `needs-review`, as in the approved record. It passes the `reviewed` coaching gate. Per COACHING-CONTENT-STANDARD.md, promotion to `reviewed` is a person's decision. Decide treats needs-review and reviewed the same (only `draft` is excluded) |

`secondary_targets` lists "gluteus medius" as descriptive free text, as approved. It is not a physique target, and Decide does not read `secondary_targets`.

## Fold-ins

| Fold-in | Implemented as | Decide-relevant change |
|---|---|---|
| Barbell glute bridge | `equipment: [bodyweight, barbell]`, `equipment_setups: [[bodyweight], [barbell]]`. `resistance_profile` and a new `programming_notes` item describe the barbell version. **No retagging** (no `heavy-compound`, no `high-loadable`), targeting unchanged, no new record | None: ranking, feasibility and Decide text are all unchanged (bodyweight is always available). The glute bridge now also appears under "barbell" in Explore's equipment filter |
| Lean-away cable lateral raise | `programming_notes` item on `cable-lateral-raise`. The record already had a mild-lean cue ("Lean slightly away from the stack"); the note describes the full lean-away variation | None |
| Heel-elevated goblet squat | `programming_notes` item on `goblet-squat` | None |
| Smith / donkey calf raise | **No new setup.** `standing-calf-raise` already has `[machine]`, `[smith machine]`, `[dumbbell, block or plate]`. Donkey variation added as a `programming_notes` item only | None |
| Deficit push-up | `programming_notes` item on `push-up-chest` | None |

Variation notes go in `programming_notes`, the field the coaching standard reserves for "comparisons to closely related records" and leverage/range progressions. The glute bridge already uses it that way. `technique_cues` was left for how to perform each record's own variation.

## Validation

| Check | Result |
|---|---|
| `npm run validate-data` | PASS, 132 records, no violations |
| Vitest | 298 / 298 (count test updated 131 → 132; no other test needed changing) |
| oxlint | exit 0 |
| Build | OK, generated from 132 validated records |
| Playwright | 3 / 3 |
| Video audit (oEmbed) | 132 / 132 LIVE, 0 dead, 0 malformed |
| **Fresh clone** of the pushed branch (`ecfdaa0`) | validate PASS; `npm test` 298/298 (generated data deleted first, so `pretest` regenerates it as in CI); lint exit 0; build OK; Playwright 3/3 |

Note: the first fresh-clone attempt ran `npx vitest run` directly, which skips the `pretest` data-generation hook, and 21 files failed because the generated JSON did not exist yet. Re-run the way CI runs it (`npm test`), it passes. This was a harness-invocation error, not a project fault.

## Decide before / after (real data, unmodified engine)

Same scenario space as the analysis reports. Run twice, byte-identical (SHA-256 `6cb7bd51…c2cd`).

| | Before (`50ab237`) | After |
|---|---:|---:|
| Exercises | 131 | 132 |
| Scenarios | 37,512 | 37,800 |
| Answered | 23,477 | 23,821 |
| Empty | 14,035 | 13,979 |

| Measure | Approved analysis | Implemented | Match |
|---|---:|---:|---|
| New scenarios | 288 (all with the new exercise as current) | 288, all with `current=single-leg-hip-thrust`, all answered; 0 baseline scenarios removed | Yes |
| Opened | 56 | 56: all "replace my glute bridge", all answered by the single-leg hip thrust (bodyweight 16, home 16, any 12, gym 12) | Yes |
| Lost | 0 | 0 | Yes |
| Best Fit changes | 8 | 8: "replace my glute bridge", any + gym, no limit, 4 glute entries; hip thrust → single-leg hip thrust | Yes |
| Alternative changes | 517 (509 to it) | 517 (509 to it) | Yes |
| Complement changes | 397 (389 incl. it) | 397 (389 incl. it) | Yes |
| Empty-message changes | 0 | 0 | Yes |
| `why` text changes with unchanged pick | — | 0 | — |
| Watch-out text changes | 8 (the new Best Fits) | 8 (the new Best Fits) | Yes |

**Targeting:**
- The single-leg hip thrust is a Best Fit **only** under the four glute-max entries: hips region, glute-max target, glute-roundness and glute-side-projection outcomes.
- It appears as an alternative or complement in 275 other answers:
  - 227 under other **hips** entries (glute med/min, adductors, hip-width-side, inner-thigh-fullness, hip stability, hip flexors);
  - 48 under **hamstrings** entries, as a complement.
- The hamstrings ones are existing engine behaviour, not new leakage. The complement list is drawn from the Best Fit's own regions, and the Romanian deadlift and single-leg RDL are tagged hips + hamstrings. The glute bridge already appeared in the same lists before this change.
- It never appears outside the hips and hamstrings regions.

**The 8 Best Fit changes are legitimate:**
- "Replace" ranks substitutes by shared primary targets (tied), then by shared coverage categories with the exercise being replaced.
- The single-leg hip thrust shares all four of the glute bridge's categories; the hip thrust shares one.
- No alphabetical tie-break is involved (confirmed in the follow-up's sorted-last check).

**No ranking-rule change:** no engine file was modified. `git diff 50ab237 -- app/src/engine` is empty.

## Differences from the approved analysis

1. **Glute-bridge limitation wording (resolved).**
   - The first implementation commit reworded the glute bridge's first `limitations` item. Decide shows that item as a watch-out, so 1,179 answers' watch-out text changed: beyond the approved "display only" scope of this fold-in.
   - Resolution: the original sentence is restored verbatim. It remains accurate, because its "caps out" claim is explicitly about dumbbell or plate loading.
   - The barbell version is described in `resistance_profile` and the new `programming_notes` item, which Decide doesn't display.
   - With that, watch-out changes are exactly the 8 new single-leg hip thrust Best Fits, as approved.
2. **Lean-away was already partly present.** `cable-lateral-raise` already cued a slight lean away from the stack. The fold-in adds the full lean-away variation as a programming note rather than a duplicate cue.
3. **Video and review status.** The approved record left the video to be sourced at implementation; it is now verified by metadata (see above). Review status stays `needs-review` as approved, though the record meets the `reviewed` gate.

Everything else matches the approved analysis exactly.

## Not done (as instructed)

- Upright row, dead bug and wrist roller are not implemented. No Grip Strength goal.
- No merge, PR or deployment.
