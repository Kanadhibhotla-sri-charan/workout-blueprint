# Exercise Expansion — Final Pass

_Closes the candidate backlog. Base: `main` at `72c4139`, 140 exercises. After this pass: still **140 exercises** (one existing record gains a setup)._

No ranking rule, structural ranker, target, goal or equipment-vocabulary change. No ID changes.

## 1. Classification of the remaining candidates

**Key:** A = implementable now; B = needs an equipment-model change; C = needs a target or goal change; D = needs ranking / role-model work; E = not worthwhile or redundant.

| Candidate | Class | Reason |
|---|---|---|
| **Band curl** | **A, implemented** | As a band setup on the existing `cable-curl`, marked `secondary` (§2). A separate band-curl record stays D: in a gym it would take 160 "replace my barbell / dumbbell curl" answers through the replace ranker's alphabetical fallback. The cable curl is already available in every gym, so the band setup changes no gym answer |
| Dead bug | E (D for a full role) | With `secondary` it opens **0** empty Decide cells; its only gain is "replace my plank". It would still change 528 complement / different-stimulus answers (plank → dead bug), and ranking it below the plank is a judgement call between two low-load anti-extension drills |
| Belt squat | B | The generic `machine` item would count a belt-squat machine, which most gyms lack, as present in every gym. Opens 0 cells |
| Inverted row | B | Needs a low bar, rings or suspension-trainer item. Modelled with rack / Smith equipment it is honest only in a gym, where it adds nothing |
| Low-to-high cable fly | E (done) | Already a variation note on `cable-fly` (Batch 4). A band setup on `cable-fly` was measured (§3): **D** |
| Kettlebell swing | C | A power / conditioning movement; no goal represents it. As a glute record it would misstate its stimulus |
| Y-raise | C | Its value is lower traps and shoulder-blade control; there is no such target. For side delts it adds nothing over lateral raises |
| Dead hang | C | Needs a grip goal. Untagged, it would sit in forearm pools, which Policy B rules out |
| Wrist roller | B, low value | Needs a new equipment item; the forearm flexors and extensors are already answered wherever equipment exists |
| Band lateral raise (setup on `cable-lateral-raise`) | E | Fills 2 cells. Unmarked it takes 12 defaults alphabetically; marked it moves 12 gym "build base" picks (cable → dumbbell lateral raise) |

**The rest of the original ~30-exercise list is resolved:**
- **Added as records:**
  - upright row (wide grip), single-leg hip thrust, reverse crunch, sissy squat, step-up;
  - plank shoulder tap, seated band row, hamstring bridge.
- **Added as setups:**
  - band on the cable pull-through (Batch 7);
  - band on the cable curl (this pass).
- **Folded in as notes:**
  - Arnold and landmine press (overhead press);
  - good morning (Romanian deadlift);
  - pendulum squat (hack squat);
  - seal / Pendlay row;
  - spider, concentration and Bayesian curls;
  - JM press;
  - lean-away lateral raise, heel-elevated goblet squat, donkey calf raise, deficit push-up;
  - barbell glute bridge (a setup).
- **Previously covered:** Smith calf raise, seated dumbbell press, machine row, overhead rope extension.

## 2. Added: band setup on `cable-curl` (`data/exercises/arms.yaml`)

| Change | Detail |
|---|---|
| Equipment | `equipment_setups: [[cable], [band]]`. The cable setup and all targeting are unchanged |
| **`selection_role`** | **`secondary`**: the band version is a home stand-in for a loaded curl. The role is per record, so it covers the cable version too; **alone it changes 0 Best Fits** (16 alternatives only, measured) |
| Text | `resistance_profile` describes the band. A band programming note (stand on it or anchor it low; use dumbbells or a cable when available). The second limitation now distinguishes the cable and band versions; only the first limitation is shown in Decide answers, and it is unchanged |
| Status | Stays `needs-review` |
| Convention | `[band]` follows the existing band-setup convention (pull-through, face pull, straight-arm pulldown) |

## 3. Coverage (measured against `main`)

Unmodified engine; same 69-entry × 6-context × 4-tolerance × 7-goal space as earlier reports. Run twice, byte-identical (SHA-256 `49eaf920…15ccd66`).

| | `main` | Final pass |
|---|---:|---:|
| Scenarios | 39,672 | 39,672 |
| Answered | 27,324 | **27,509** |

| Check | Result |
|---|---|
| Empty selection cells filled | **6**: biceps target and `biceps-front-peak` with band + pull-up bar (no limit, fatigue limit, skill limit). This was the last empty biceps context apart from bodyweight / nothing selected |
| Answers opened | 185 (183 band + pull-up bar, 2 home) |
| Existing answers lost | **0** |
| Selection-goal Best Fit changes | **0** (16 alphabetical takeovers at home if unmarked) |
| Gym / "any equipment" Best Fit changes | **0** |
| Replace / complement / different-stimulus Best Fit changes | 92, of which 86 decided by ID (see below) |

**Current-exercise changes, reviewed:**

| Change | Count | Review |
|---|---:|---|
| Band + pull-up bar: replace a curl → band curl (was hammer curl) | 15 | Improvement: a biceps curl now replaces a biceps curl |
| Band + pull-up bar: complement / different stimulus for other arm exercises (mainly triceps) → band curl | 26 | Reasonable: a biceps curl pairs with arm and triceps work |
| Home: "replace my incline / preacher / drag curl" → band curl (was dumbbell curl) | 35 | **Accepted cost.** The alphabetical fallback in the replace ranker prefers `cable-curl` to `dumbbell-curl`. A curl still replaces a curl, but with dumbbells present the dumbbell curl is the more natural pick |
| Home: replace → band curl (was cross-body hammer curl) | 10 | Improvement: a biceps curl rather than a brachialis curl |
| Home: complement for the close-grip push-up → band curl | 6 | Neutral |

## 4. Measured and deferred in this pass

| Option | Gain | Cost | Decision |
|---|---|---|---|
| Band setup on `cable-fly` | 17 cells (upper / lower chest with band + pull-up bar) | Unmarked: 20 defaults taken alphabetically (e.g. push-up → band fly). Marked secondary: **16 existing gym defaults move** (cable fly → feet-elevated push-up / decline fly / machine press), because the cable fly is a genuine first-choice gym exercise | **D:** needs a per-setup role, or acceptance of the gym changes |
| Band setup on `cable-lateral-raise` | 2 cells | 12 alphabetical (unmarked) or 12 gym changes (marked) | **E** |

## 5. Remaining genuine product-model gaps

1. **Structural rankers fall back to ID.** Replace, complement and different-stimulus answers break ties alphabetically:
   - 86 such answers in this pass;
   - 182 in Batch 7;
   - this blocks a stand-alone band-curl record and the dead bug's complement behaviour.
2. **Role is per record, not per setup.** A band setup on a first-choice cable exercise (fly, lateral raise) cannot be secondary without demoting the cable version in the gym.
3. **Equipment vocabulary:**
   - no low bar / rings / suspension trainer (inverted row; bodyweight back thickness stays empty);
   - generic `machine` (belt squat);
   - no wrist roller;
   - no anchor / slider (hamstrings with nothing selected).
4. **Taxonomy:** no lower-traps / posture target (Y-raise), no grip goal (dead hang, carries, wrist roller), no power / conditioning goal (kettlebell swing).
5. **Legitimately empty under Policy B.** Bodyweight or nothing-selected users have no answer for:
   - biceps, brachialis, upper traps, soleus and forearms;
   - side / rear delts and back thickness.

   Each needs equipment that the context doesn't include.

## 6. Tests

| Change | Reason |
|---|---|
| `selectionRole.test.ts` | The review gate now lists `cable-curl` alongside `cable-pull-through` and `hamstring-bridge` |

## 7. Validation

| Check | Result |
|---|---|
| Data generation + `validate-data` | PASS, 140 records |
| Vitest | 310 / 310 |
| oxlint | exit 0 |
| Production build | OK |
| Playwright | 3 / 3 |
| Video audit | Not re-run: no video fields changed |
| Measurement (two runs) | Byte-identical |

## 8. Recommended stopping point

**Stop exercise expansion here.**
- Every candidate on the original list is now added, folded in, or blocked by a product-model decision.
- Further records would only add near-duplicates or move existing defaults alphabetically.

**Backlog, in priority order:**
1. **Content review:** 86 of 140 records are `needs-review`, including every record added in the expansion batches. This is the highest-value remaining work.
2. **Structural-ranker tie-break (analysis first).** Decide whether `selection_role` (or another key) should apply to replace / complement / different-stimulus. It would remove the ID-decided answers already shipping and unblock a stand-alone band curl.
3. **Suspension / low-bar equipment item.** Unlocks the inverted row, the main remaining real gap (back thickness for bodyweight users).
4. **Per-setup role or belt-squat equipment item.** Only if band chest flies or the belt squat become priorities.
5. **Optional taxonomy additions:** grip goal, lower-traps target, conditioning goal. Low priority; each is a scope decision, not a data fix.

## 9. Release

| | Result |
|---|---|
| Fresh clone of the commit (before pushing) | validate PASS; `npm test` 310/310; lint 0; build OK; Playwright 3/3 |
| Commit pushed to `main` | `871fafd` |
| CI on `main` | Success |
| GitHub Pages deploy | Success |
| Production smoke test | 4 / 4 |

**Production smoke test details:**
- Explore shows 140 exercises.
- Explore → detail → Decide → Build works; Decide URL reload and back/forward work.
- The cable curl detail page loads.

**Decide on the live site (Best Fit):**

| Request | Answer |
|---|---|
| Biceps, build base, band + pull-up bar | Cable Curl, band setup (new coverage) |
| Biceps, low fatigue, band + pull-up bar | Cable Curl, band setup (new coverage) |
| "Replace my drag curl", band + pull-up bar | Cable Curl, band setup (was the hammer curl) |
| Biceps, build base, full equipment | Still the barbell or EZ-bar curl |
| Biceps, build base, home with dumbbells + band | Still the dumbbell curl (the secondary role holds) |
| Brachialis, build base, band + pull-up bar | Still the hammer curl |
