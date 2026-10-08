# Exercise Candidates — Strong and Fold-In Analysis

_Analysis only. No exercise data, engine, UI or production code was changed. The temporary harness was deleted after use and not committed._

Follows `EXERCISE-CANDIDATES-REMAINING.md`. That document graded four exercises **Strong** and five changes **Fold into existing** by judgement. This report measures them.

## Headline

**None of the nine opens a single new selection cell.** The judgement-based "Strong" grades did not survive measurement.

- **Glutes, abs and core anti-extension have no empty selection cells today.** The glute bridge and plank already answer every equipment context and tolerance, so the single-leg hip thrust and dead bug have no gap to fill there.
- **Side delts, upper traps and forearms are empty only where there is no load** (bodyweight, nothing selected, minimal kit). These are the legitimate Policy B gaps. A loaded upright row or a wrist roller can't reach them. An upright row with a **band** option is the one variant that does (13 cells).
- **The dead bug's large effect is mostly replacement.** It takes over 844 existing Best Fits, and 680 of them only because `dead-bug` sorts before `plank` alphabetically.
- **The fold-ins have no Decide effect.** The three coaching notes are text the engine never reads. The barbell glute bridge option changes nothing, because bodyweight is always available. The standing calf raise **already has** a Smith machine option.
- **The real gains are in "replace my exercise" answers.** The single-leg hip thrust gives the glute bridge its first substitute where the hip thrust can't be done (56 answers). The dead bug gives the plank its first substitute (96 answers).

## Method

- **Baseline:** production data and engine at `68b6ba4` (main):
  - 131 exercises;
  - **37,512 scenarios, 23,477 answered, 14,035 empty**, reproduced exactly.
- **Scenario space** (the same one used in Phase 7):
  - 69 entries: 11 regions, 25 targets, 26 aesthetic outcomes, 7 functional goals.
  - × 6 equipment contexts: any, commercial gym, home dumbbells, bodyweight, nothing selected, minimal kit.
  - × 4 tolerances: none, low fatigue, low skill, low setup.
  - × 7 goals.
  - The current-exercise goals (replace, different stimulus, complement) run once per exercise in the entry's own pool: the region, the target, the outcome's primary target or the functional goal.
- **Engine:** the unmodified production `makeRecommendation`, given a modified exercise pool for each variant.
- **New exercises:** simulated as full candidate records with proposed targeting, equipment, movement pattern and demand ratings (listed per candidate). They have no aesthetic-outcome role, as a real addition would have unless an outcome were edited.
- **Fold-ins:** the actual data change was applied. Coaching notes were added to `technique_cues`, which tests whether text affects Decide.
- **Determinism:** the complete analysis ran twice with byte-identical output (SHA-256 `94c55766…ba12b`).
- **Alphabet check:** each new exercise was re-run with an ID that sorts last (`zz-…`). Best Fits that disappear were decided only by the alphabetical tie-break, not on merit.

### How to read the measures

| Measure | Meaning |
|---|---|
| Opened | Baseline scenarios that were empty and now have an answer |
| Lost | Baseline scenarios that had an answer and now are empty |
| Selection cells opened | Target/region/outcome/function × equipment × tolerance cells that were empty for the selection goals (build-base, visual-area, low-fatigue, limited-equipment) and now answer. This is the clearest "new coverage" measure |
| Best Fit / alternative / complement changes | Among scenarios answered both before and after, how many changed their pick |
| New scenarios | Extra scenarios that exist only because the new exercise can itself be picked as "my current exercise" (reported separately, not counted as opened) |
| Empty-message changes | Still-empty results whose explanation changed, usually because the new exercise now appears in "with equipment, these would fit" |

### Where the targeted muscles are empty today (selection cells, of 20 non-gym cells)

| Target | Empty cells | Where |
|---|---:|---|
| Side delt | 12 | bodyweight, nothing selected, minimal kit (every tolerance) |
| Upper traps | 12 | same |
| Forearm flexors | 12 | same |
| Forearm extensors | 12 | same |
| Glute max | 0 | — |
| Abs (rectus) | 0 | — |
| Core anti-extension | 0 | — |

---

## 1. Upright row, wide grip — NEEDS-FURTHER-REVIEW

**Simulated record:**

| Field | Value |
|---|---|
| Targets | `side-delt`, `upper-traps` |
| Body regions | shoulders **and back** (required, because upper traps belong to the back region) |
| Movement pattern | shoulder abduction, then scapular elevation |
| Type | compound |
| Equipment | cable / EZ-bar / barbell / dumbbell |
| Demand ratings | stability low, skill **medium** (grip width and pull height matter), setup low, fatigue low |
| Coverage categories | `low-setup` |

| Measure | As specified | Skill low (sensitivity) | **+ band option** (sensitivity) |
|---|---:|---:|---:|
| Opened | 0 | 0 | **206** (all minimal kit) |
| Lost | 0 | 0 | 0 |
| Selection cells opened | 0 | 0 | **13** |
| Best Fit changes | 50 | 104 | 70 |
| …of which selection goals | 0 | 0 | 4 |
| Alternative changes | 225 | 448 | 257 |
| Complement changes | 423 | 477 | 888 |
| New scenarios (as current) | 432 (170 answered) | 432 | 432 (190) |
| Empty-message changes | 689 | 1,139 | 543 |
| Equipment contexts unlocked | none | none | minimal kit |

- **Genuine gap?**
  - **As specified, no.** Side delts and upper traps already have a dumbbell option in every context where an upright row can be done.
  - With a band option it opens 13 minimal-kit cells: side delt, upper traps, `shoulder-width-front` and `upper-back-fullness` (none, fatigue and setup tolerances each), plus back region under low fatigue. The low-skill cells stay empty, because the record is medium skill.
- **Mainly replacement?**
  - As specified, all 50 Best Fit changes are in "different stimulus" and "complement" answers for **back** exercises (45° back extension 28, chest-supported row 18, rack pull 4). These are spillover from the back-region tag, not shoulder improvements.
  - With the band option, it also becomes the minimal-kit "back" pick over the chin-up in 4 low-fatigue/limited-equipment answers, because it costs less. An upright row is a poor answer to "train my back".
  - The alphabet check changes nothing, so none of these wins are alphabetical.
- **Targeting and taxonomy concerns:**
  - Tagging upper traps forces the `back` region, which puts a shoulder exercise into back-region pools. Tagging only `side-delt` would avoid that but drop the traps benefit.
- **Equipment-model change:** none as specified. The band option would add a band setup, an honest home variant but with little tension at the bottom.
- **Why NEEDS-FURTHER-REVIEW:** its only real coverage depends on two decisions:
  1. include a band option;
  2. accept, or avoid, the back-region spillover.

## 2. Dead bug — NEEDS-FURTHER-REVIEW

**Simulated record:**

| Field | Value |
|---|---|
| Target and goal | `rectus-abdominis` + functional goal `core-anti-extension` (same as the plank) |
| Movement pattern | anti-extension isometric |
| Type | isolation |
| Equipment | bodyweight |
| Demand ratings | stability **low**, skill low, setup low, fatigue low |
| Coverage categories | `low-setup`, `low-fatigue`, `equipment-limited-substitute` |

| Measure | As specified | ID sorted last (alphabet check) | Functional goal only (no abs tag) |
|---|---:|---:|---:|
| Opened | 96 | 96 | 48 |
| Lost | 0 | 0 | 0 |
| Selection cells opened | 0 | 0 | 0 |
| Best Fit changes | **844** | **164** | 420 |
| Alternative changes | 1,148 | 744 | 860 |
| Complement changes | 1,150 | 496 | 1,150 |
| New scenarios (as current) | 288 (all answered) | 288 | 144 |
| Equipment contexts unlocked | none (all 96 are "replace the plank", across every context) | — | — |

- **Genuine gap?**
  - **Only one: the plank had no substitute.** All 96 opened answers are "replace my plank". There are no empty selection cells for abs or anti-extension.
- **Mainly replacement? Yes.**
  - It takes over 844 existing Best Fits: plank 732, hanging knee raise 72, machine crunch 24, Pallof press 12, Russian twist 4.
  - Selection goals: it becomes the core/abs pick for:
    - build-base (72);
    - visual-area (72);
    - low-fatigue (96);
    - limited-equipment (96).
  - **680 of the 844 are alphabetical:** with an ID that sorts last, only 164 remain.
  - The 164 that remain on merit are the low-fatigue and limited-equipment picks. There, the cost tie-break legitimately prefers the dead bug's lower stability demand (low vs the plank's medium).
  - Making a low-load stability drill the default "build the base" and "visual area" abs pick only because of its name is not an improvement.
- **Targeting concerns:**
  - Tagging it `rectus-abdominis` claims a size stimulus it doesn't really provide. The plank's own record calls the plank "a stability tool first".
  - Tagging only the functional goal halves the effect but still replaces the plank in 420 answers, because both are in the core region pool.
- **Equipment-model change:** none.
- **Why NEEDS-FURTHER-REVIEW:**
  - The plank-substitute value is real.
  - But adding it today mostly reshuffles existing answers through the known alphabetical tie-break, the same documented limitation as the chest-dip result.
  - Two decisions:
    1. targeting (functional goal only, or also abs);
    2. whether to accept the alphabetical takeover of build-base and visual-area.

## 3. Wrist roller — REJECT (as a standalone addition)

**Simulated record:**

| Field | Value |
|---|---|
| Targets | `forearm-flexors` and `forearm-extensors` |
| Movement pattern | wrist flexion, then wrist extension |
| Type | isolation |
| Equipment | **wrist roller (new item)** + plate |
| Demand ratings | all low |

| Measure | Gym list unchanged | Gym includes a wrist roller |
|---|---:|---:|
| Opened | 12 | 24 |
| Lost | 0 | 0 |
| Selection cells opened | 0 | 0 |
| Best Fit changes | 0 | 0 |
| Alternative changes | 86 | 172 |
| Complement changes | 145 | 290 |
| New scenarios (as current) | 360 (164 answered) | 360 |
| Empty-message changes | 656 | 656 |
| Equipment contexts unlocked | none (opened only "replace my wrist curl" with no equipment limit) | commercial gym (same replace answers) |

- **Genuine gap? No.**
  - The forearm gap is the no-load contexts, and a wrist roller is a device. Every context that could have one already answers with the wrist curl.
  - The only gain is a substitute for the wrist curl (12–24 answers).
  - The 656 empty-message changes only add "Wrist Roller — wrist roller, plate" to the list of what equipment would unlock.
- **Mainly replacement?** No; it changes no Best Fit.
- **Equipment-model change:** a new `wrist roller` item. No measured context includes it.
- **Recommendation:** REJECT as a coverage addition. Revisit only together with the open "Grip strength" goal idea (dead hang, farmer's carry), where it would answer a goal rather than a muscle the wrist curl already covers.

## 4. Single-leg hip thrust — ADD

**Simulated record:**

| Field | Value |
|---|---|
| Target | `gluteus-maximus` |
| Movement pattern | hip extension |
| Type | compound, unilateral |
| Equipment | bodyweight + bench |
| Demand ratings | stability medium, skill low, setup low, fatigue low |
| Coverage categories | as the glute bridge's (shortened-position, low-setup, low-fatigue, equipment-limited substitute) |

| Measure | As specified | ID sorted last |
|---|---:|---:|
| Opened | **56** | 56 |
| Lost | 0 | 0 |
| Selection cells opened | 0 | 0 |
| Best Fit changes | **8** | 8 |
| Alternative changes | 517 | 502 |
| Complement changes | 397 | 397 |
| New scenarios (as current) | 288 (all answered) | 288 |
| Equipment contexts unlocked | bodyweight 16, home dumbbells 16, any 12, gym 12 (all "replace my glute bridge") |

- **Genuine gap? Yes, a narrow one.**
  - "Replace my glute bridge" is empty today wherever the hip thrust can't be done: bodyweight, home, or under a low-setup limit. The hip thrust is high setup.
  - The single-leg hip thrust is the natural progression when the bridge gets too easy, and it answers all 56.
  - There are no empty selection cells for glutes, so it adds no new "what should I do for glutes" coverage.
- **Mainly replacement? No.**
  - Only 8 Best Fits change, all "replace my glute bridge" with full equipment. The pick moves from the hip thrust to the single-leg hip thrust, because it shares more of the bridge's characteristics.
  - None of the 8 is alphabetical, and no selection-goal Best Fit changes.
  - The 517 alternative changes are mostly it becoming the second option shown next to the glute bridge, which is appropriate.
- **Targeting concerns:** none. Same target and pattern as the hip thrust and bridge.
- **Equipment-model change:** none (bodyweight + bench).
- **Recommendation:** ADD. Real, if modest, value with almost no disturbance to existing answers.

---

## 5. Fold-ins

| # | Change | Opened | Lost | Cells | Best Fit | Alt | Comp | Recommendation |
|---|---|---:|---:|---:|---:|---:|---:|---|
| F1 | Barbell option on `glute-bridge` (equipment only) | 0 | 0 | 0 | 0 | 0 | 0 | **FOLD-IN** (display only) |
| F1b | …plus `heavy-compound` and `high-loadable` tags (sensitivity) | 0 | 0 | 0 | **61** | 75 | 257 | Do not retag |
| F2 | Lean-away note on `cable-lateral-raise` | 0 | 0 | 0 | 0 | 0 | 0 | **FOLD-IN** (coaching text) |
| F3 | Heel-elevated note on `goblet-squat` | 0 | 0 | 0 | 0 | 0 | 0 | **FOLD-IN** (coaching text) |
| F4 | Smith option on `standing-calf-raise` + donkey note | 0 | 0 | 0 | 0 | 0 | 0 | **FOLD-IN** (note only; Smith already present) |
| F5 | Deficit note on `push-up-chest` | 0 | 0 | 0 | 0 | 0 | 0 | **FOLD-IN** (coaching text) |

- **F1 Barbell glute bridge:**
  - Adding a barbell option changes nothing in Decide. Bodyweight is always available, so the bodyweight setup always wins feasibility and cost.
  - The only visible effect is the equipment text ("Requires one of: bodyweight / barbell").
  - If the loaded version were also tagged `heavy-compound`/`high-loadable` (F1b), it would take the glute build-base pick from the cable kickback (24), hip thrust (8), Copenhagen plank (5) and RDL (4). That is pure replacement, and the bodyweight bridge is not a heavy compound. Keep the existing tags.
- **F2, F3, F5:** coaching text is not read by the ranking. Zero effect, as expected. They are content improvements for the exercise pages only.
- **F4:**
  - The standing calf raise **already lists** a Smith machine option (`[machine]`, `[smith machine]`, `[dumbbell, block or plate]`). `EXERCISE-CANDIDATES-REMAINING.md` was wrong to propose adding it.
  - A donkey calf raise would be a note only, zero effect.
- No fold-in needs an equipment-model change.

## 6. All nine together

Four new exercises plus F1:

| | Baseline | All applied |
|---|---:|---:|
| Scenarios (baseline keys) | 37,512 | 37,512 (+1,368 with the new exercises as current) |
| Answered (all keys) | 23,477 | 24,551 |
| Opened | — | 164 (all "replace my exercise": plank 96, glute bridge 56, wrist curl 12) |
| Lost | — | 0 |
| Selection cells opened | — | **0** |
| Best Fit changes | — | 902 (dead bug 844 of them) |
| Alternative / complement changes | — | 1,976 / 2,115 |

## 7. Where the apparent benefit is mainly replacement

| Candidate | Replacement evidence |
|---|---|
| **Dead bug** | 844 Best Fits taken over vs 96 opened. 680 of the 844 are alphabetical only. It becomes the default abs/core pick for build-base and visual-area without being a better answer |
| **Upright row** (as specified) | 0 opened. Its 50 Best Fits are all back-exercise "different stimulus"/"complement" answers caused by the back-region tag, not shoulder improvements |
| **Upright row + band** | Opens real minimal-kit coverage, but also replaces the chin-up as the minimal-kit low-fatigue "back" pick (4) |
| **Barbell glute bridge with retagging (F1b)** | 61 Best Fits replaced, 0 opened |

Not replacement-driven: single-leg hip thrust (8 Best Fit changes vs 56 opened) and wrist roller (0 Best Fit changes).

## Recommendation table

| Candidate | Measured value | Coverage impact | Recommendation | Reason |
|---|---|---|---|---|
| Upright row, wide grip | 0 opened, 0 cells, 50 Best Fit changes (back spillover). With band: 206 opened, 13 cells | None as specified. Minimal-kit side delts/traps only with a band option | **NEEDS-FURTHER-REVIEW** | Value depends on adding a band option and on the back-region spillover the traps tag forces |
| Dead bug | 96 opened (replace plank), 0 cells, 844 Best Fit changes (680 alphabetical) | Gives the plank a substitute. No new selection coverage | **NEEDS-FURTHER-REVIEW** | Mostly replaces the plank through the alphabet tie-break. Needs a targeting decision, and acceptance of the takeover or a later tie-break fix |
| Wrist roller | 12–24 opened (replace wrist curl), 0 cells, 0 Best Fit changes | None. Can't reach the no-load forearm gap | **REJECT** | Needs a new equipment item for almost no gain. Revisit only with a "Grip strength" goal |
| Single-leg hip thrust | 56 opened (replace glute bridge), 0 cells, 8 Best Fit changes, 0 alphabetical | Glute bridge gets a substitute at home and under low-setup limits | **ADD** | Genuine, low-disturbance gain; natural bodyweight progression |
| Barbell glute bridge | 0 everywhere | None | **FOLD-IN** | Equipment option is display-only. Do not retag (retagging only replaces existing picks) |
| Lean-away cable lateral raise | 0 everywhere | None | **FOLD-IN** | Coaching text on the existing record |
| Heel-elevated goblet squat | 0 everywhere | None | **FOLD-IN** | Coaching text on the existing record |
| Smith / donkey calf raise | 0 everywhere | None | **FOLD-IN** | Smith option already exists; donkey as a note |
| Deficit push-up | 0 everywhere | None | **FOLD-IN** | Coaching text on the existing record |

## Decisions needed before implementation

1. **Single-leg hip thrust:** approve ADD (full record with cues, mistakes and a verified video).
2. **Fold-ins:** approve the four coaching notes and the display-only barbell option on the glute bridge.
3. **Upright row:**
   - add a band option or not;
   - accept the back-region spillover, or tag side delts only.
4. **Dead bug:**
   - targeting: functional goal only, or also abs;
   - whether the alphabetical takeover of the plank is acceptable. The alternative is the region-curation / tie-break work already recorded as a known limitation.
5. **Wrist roller:** confirm REJECT, or tie it to a "Grip strength" goal decision.

## Checks

| Check | Result |
|---|---|
| Baseline reproduced | 131 exercises, 37,512 scenarios, 23,477 answered, 14,035 empty |
| Two complete runs | Byte-identical (SHA-256 `94c55766687fa3b7404a857cd03a8f26f465cd958d23a4604fbb24b3050ba12b`) |
| Exercise data, engine, UI | Unchanged |
| Temporary harness | Deleted, not committed |
