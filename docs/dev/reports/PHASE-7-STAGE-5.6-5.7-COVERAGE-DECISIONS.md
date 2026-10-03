# Phase 7 Stage 5.6/5.7 — Remaining Bodyweight & Definition Decisions

_Parts A–C below are the original analysis. The approved items were then implemented (see [Implementation results](#implementation-results)), and the [focused heavy-compound analysis](#focused-analysis-heavy-compound-and-tie-behaviour) was added. **Final architecture decisions are in [Final decisions](#final-decisions-stage-closed).** Chin-up → biceps was **not adopted**._

## Method

- **Baseline:** the current engine and data (`47c5f28`), 128 exercises and 36,720 scenarios (6 equipment contexts × 4 tolerances × 69 entries × 7 goals, with current-exercise goals per eligible current). The baseline matches the Stage 5.5 real-record results exactly.
- **Variants:** each candidate, definition change and combination was simulated **in memory** by a temporary harness, which was deleted afterwards.
- **Determinism:** two passes, each run twice. **Both runs of each pass were byte-identical.**
- **New exercises as current exercises:** each new exercise is also added as a current exercise for its own region, target, outcome and functional-goal entries. Those scenarios are counted separately from the 36,720.

Assumed record fields follow the library's conventions for the nearest existing record. They are listed per candidate.

---

# PART A — Bodyweight exercises

## Summary

| Candidate | Physique target | Equipment | Opened | Lost | Selection cells | Best Fits changed | Recommendation |
|---|---|---|---:|---:|---:|---:|---|
| A1 Feet-elevated push-up | `upper-pec` | bodyweight + bench | 528 | 0 | 13 | 501 | **ADD** — without `heavy-compound` |
| A2 Close-grip (triceps-biased) push-up | `triceps` | bodyweight | 964 | 0 | 40 | 1,074 | **ADD** — without `heavy-compound` |
| A3 Side-lying hip abduction | `gluteus-medius-minimus` | bodyweight | 288 | 0 | 16 | 32 | **ADD** |
| A4 Sliding leg curl | `hamstrings` | bodyweight + sliders (new item) | 0 | 0 | 0 | 6 | **DO NOT ADD** |
| A5 Inverted row | `back-thickness` | bodyweight + rack + barbell, or Smith | 0 | 0 | 0 | 60 | **DO NOT ADD** |

A3–A5 come from the Stage 5.2 group (b) list and its notes.

## A1 Feet-elevated push-up — ADD (without `heavy-compound`)

**Assumed record:**

| Field | Value |
|---|---|
| Region | chest |
| `primary_targets` | "chest (commonly cited as upper/clavicular-biased)", the incline presses' wording |
| Pattern / type | `incline horizontal press`, compound |
| Equipment | `[bodyweight, bench]` |
| Coverage tags | `low-setup`, `equipment-limited-substitute` |
| Fatigue / setup / skill / stability | low / low / low / medium |
| `overlaps_with` | push-up |

**Target justification:**
- `upper-pec` is "the clavicular (upper) portion of the pectoralis major".
- With the feet elevated, the press runs at an incline relative to the torso, which is exactly the angle that earns every incline press its `upper-pec` tag.
- This is direct targeting.

**Equipment:** it needs something to elevate the feet, represented as `bench`. So it opens the bodyweight-with-fixtures and home contexts. **Nothing-selected stays empty for upper pec**, legitimately: there is nothing to put the feet on.

**Impact:**

| Metric | Result |
|---|---|
| Opened / lost | +528 / 0 |
| Selection cells | 13: upper-pec, `chest-upper-shelf`, `chest-side-projection` in bodyweight (all tolerances) and home-dumbbells (low setup) |
| Best Fits replaced | 501 (push-up 139, incline machine press 128, chest dip 60, incline cable press 38, …) — mostly complement goals (374) and replace (60) |
| Full-gym defaults changed | upper-pec / `chest-upper-shelf` **low-fatigue** and **limited-equipment** only (the Stage 5.1 cost rules) |
| Alternatives / complements changed | 996 / 1,975 |
| Still-empty messages changed | 26 |
| Bodyweight-gap empties | unchanged (it needs a bench) |

**Appearance:**
- `chest-upper-shelf`: primary tier, 170 scenarios.
- `chest-side-projection`: primary tier, 86.
- `chest-front-width`: **supporting** tier, 70. Upper pec is that outcome's declared supporting target, so this is correct by design.

**Primary/supporting matches outside its target:** none, apart from the declared supporting relationship.

**Overlap:** with the push-up (same press, different angle), and the incline presses. It is a separate record by the same convention as the flat vs incline presses.

### Why without `heavy-compound`

Tagged `heavy-compound` like the push-up, it **becomes the full-gym build-base pick for upper pec and `chest-upper-shelf`, over the incline barbell press**.

- Both sit in the build-base goal's top bucket, so the alphabetical fallback decides, and "feet-elevated" sorts before "incline".
- Without the tag (the evidence-honest reading: bodyweight-scaled, not heavily loadable), build-base and visual-area defaults are unchanged.

See Part B §6a for the general issue.

**Policy B:**
- Genuine direct-targeting gap (upper pec has no bodyweight option).
- Meaningful: the standard bodyweight upper-chest progression.
- Not a duplicate.

## A2 Close-grip push-up — ADD (without `heavy-compound`)

**Assumed record:**

| Field | Value |
|---|---|
| Region | arms (as the close-grip bench press) |
| `primary_targets` | triceps, chest |
| Pattern / type | `horizontal press`, compound |
| Equipment | `[bodyweight]` |
| Coverage tags | `low-setup`, `equipment-limited-substitute` |
| Ratings | low / low / low / medium |
| `overlaps_with` | push-up, close-grip bench press |

**Target justification:**
- `triceps` is "all three heads, trained through elbow-extension movements".
- The library already tags triceps-biased *presses* (close-grip bench press, triceps-biased dip) as `triceps`. A narrow hand position shifts the push-up's load toward elbow extension in the same way.
- **Not** `triceps-long-head`: the shoulder isn't flexed.

**Equipment:** bodyweight only, so it opens the strict-bodyweight and minimal-kit contexts too.

**Impact:**

| Metric | Result |
|---|---|
| Opened / lost | +964 / 0 |
| Selection cells | 40: triceps, `triceps-back-depth`, `arm-side-thickness` and the arms region, in bodyweight (2 each), nothing-selected (4) and minimal-kit (4) |
| Best Fits replaced | 1,074 (triceps dip 260, kickback 172, EZ-bar curl 160, skull crusher 136, cross-body hammer curl 120, pushdown 112, …) — **mostly complement goals (996)** |
| Full-gym defaults changed | arms / triceps / `triceps-back-depth` **limited-equipment** only (Stage 5.1: bodyweight costs 0) |
| Alternatives / complements changed | 1,393 / 2,030 |
| Still-empty messages changed | 420 |
| Bodyweight-gap empties | **3,312 → 2,780** |

**Appearance:**
- `triceps-back-depth`: primary tier, 368 scenarios.
- `arm-side-thickness`: **supporting** tier, 146. Triceps is its declared supporting target.
- `biceps-front-peak`: general tier, 144. This is only the complement goal "add a different stimulus to my current curl", a region-wide complement by design.

**Primary/supporting matches outside its target:** none, apart from the declared supporting relationship.

**Overlap:** with the push-up and the close-grip bench press. It is a separate record by the same convention as bench press vs close-grip bench press, and chest-biased vs triceps-biased dip.

**Tagging:** tagged `heavy-compound`, it would change 38 build-base picks; untagged, 12, with no full-gym build-base default changed either way. Untagged for consistency with A1.

**Policy B:** the largest genuine gap it closes is triceps for strict-bodyweight users. Direct targeting and meaningful. Not a duplicate.

## A3 Side-lying hip abduction — ADD

**Assumed record:**

| Field | Value |
|---|---|
| Region | hips |
| `primary_targets` | gluteus medius, gluteus minimus |
| Pattern / type / laterality | `hip abduction`, isolation, unilateral |
| Equipment | `[bodyweight]` |
| Coverage tags | `isolation`, `low-setup`, `low-fatigue`, `equipment-limited-substitute` |
| Ratings | all low |
| `overlaps_with` | `hip-abduction` |

**Target justification:**
- `gluteus-medius-minimus` is "trained through hip-abduction movements".
- This *is* a hip-abduction movement, where the glute med is the prime mover, not a stabilizer. That is unlike the side plank, which was correctly not tagged.

**Load (the Policy B question):**
- Only leg weight, but commonly cited EMG research (e.g. Distefano et al., 2009) reports side-lying abduction among the **highest** glute-medius activations of common exercises.
- It progresses with an ankle weight or a band.
- So this is not negligible load. Verify the citation before writing it into `evidence_notes`.

**Impact:**

| Metric | Result |
|---|---|
| Opened / lost | +288 / 0 |
| Selection cells | 16: glute med/min and `hip-width-side`, bodyweight and nothing-selected, every tolerance |
| Best Fits replaced | 32, all `hip-abduction` → side-lying, **limited-equipment** in any / gym / home / minimal-kit (bodyweight costs 0) |
| Alternatives / complements changed | 600 / 922 |
| Bodyweight-gap empties | 3,312 → 3,256 |

**Appearance:**
- `hip-width-side`: primary tier, 72 scenarios.
- `glute-roundness` and `glute-side-projection`: general tier, 30 each, in complement goals only.

**Primary/supporting matches outside its target:** none.

**Overlap:** with the machine/band hip abduction (same movement). It is the no-equipment form; declare `overlaps_with`.

**Policy B:** a genuine gap (glute med has no bodyweight option), direct targeting, meaningful activation.

## A4 Sliding leg curl — DO NOT ADD

**Assumed record:** hamstrings, `knee flexion`, `[bodyweight, sliders]`.

**Impact:**
- **Opens nothing** in any measured context. `sliders` is a new equipment item no context contains; a user would have to find and select it in the picker.
- It changes 6 full-gym replace picks (lying leg curl → sliding leg curl).

**Why not:**
- Hamstrings are already reachable for bodyweight users through the Nordic curl when "partner or anchor" is selected (see Part B §3).
- Adding a slider/towel item is an equipment-vocabulary decision with little measured payoff.

## A5 Inverted row — DO NOT ADD

**Assumed record:** back thickness, `horizontal pull`, setups `[bodyweight, rack, barbell]` / `[bodyweight, smith machine]`.

**Impact:**
- **Opens nothing for bodyweight users.** It needs a hip-height bar, which no bodyweight context has.
- It changes **60 gym** picks (replacing the seated cable row, chest-supported row, …) and 480 complement lists.

**Why not:** all churn, no bodyweight access. Revisit only if a suspension trainer or low bar is added to the equipment vocabulary.

---

# PART B — Definition and taxonomy questions

| # | Question | Recommendation |
|---|---|---|
| 1 | Chin-up → biceps | **CHANGE** (tag), with explicit sign-off on 2 gym defaults |
| 2 | Neck hold → neck thickness | **KEEP** |
| 3 | Nordic anchor representation | **KEEP** |
| 4 | Side plank in core-anti-lateral-flexion | **CHANGE** (widen the definition and tag) |
| 5 | Appearance outcome for front delt | **KEEP** |
| 6a | `heavy-compound` is undefined | **NEEDS PRODUCT DECISION** |
| 6b | Rectus abdominis definition vs the plank | **CHANGE** (wording only) |
| 6c | Triceps definition vs triceps-biased presses | **CHANGE** (wording only) |
| 6d | Triceps-long-head ratings | **KEEP** |

## 1. Chin-up → biceps — CHANGE

**Current state:**
- `biceps`: "trained through elbow-flexion movements with the forearm supinated or neutral".
- `chin-up-supinated` lists **elbow flexors as a primary target** but carries only `lat-width`.

**Inconsistency:**
- The library tags triceps-biased presses with `triceps` (close-grip bench press, triceps-biased dip), even though their pattern is a press.
- The symmetric case, a supinated pull whose record names elbow flexors as primary, is untagged.
- Stage 5.2's "pull-up → biceps is indirect" applies to the **pronated** pull-up (elbow flexors secondary), not the chin-up.

**Impact of tagging:**

| Metric | Result |
|---|---|
| Opened / lost | +104 / 0 |
| Selection cells | 8: biceps and `biceps-front-peak` in bodyweight and minimal kit (pull-up bar) |
| Best Fits changed | 14 |
| Still-empty messages changed | 392 (unlock lists now include the chin-up) |

**Changes existing recommendations? Yes, at two full-gym defaults:**
- **biceps build-base** and **`biceps-front-peak` build-base** move from the EZ-bar curl to the chin-up.
- The chin-up is a `heavy-compound`, which build-base ranks first. This mirrors how the close-grip bench press is already the triceps build-base pick.

**Recommendation:** CHANGE, for consistency with the triceps precedent. The biceps definition wording should then mention supinated-grip pulls (see 6c).

**Sign-off needed:** the 2 gym build-base defaults. If you'd rather curls stay the default biceps base, choose KEEP; the bodyweight biceps cells then stay empty, which Policy B accepts.

## 2. Neck hold → neck thickness — KEEP

**Current state:** `neck-thickness` is "trained through **loaded** neck-extension and neck-flexion **movements**". The isometric neck hold lists the neck flexors and extensors as primary, and its bodyweight setup is self-applied resistance.

**Gap:** a bodyweight neck option exists but isn't tagged.

**Impact of tagging:**

| Metric | Result |
|---|---|
| Opened / lost | +192 / 0 |
| Selection cells | 24, incl. full-gym low skill |
| Best Fits changed | 160 |

**Changes existing recommendations? Yes, badly.** It would replace the loaded neck extension / flexion as the **full-gym default** for neck thickness and `neck-size` in **all four selection goals**:
- build-base and visual-area through the alphabetical fallback;
- low-fatigue and limited-equipment through the cost rules.

That swaps loaded neck training for a self-resisted hold in a gym, for an Appearance outcome.

**Recommendation:** KEEP. It also contradicts "loaded … movements". The neck-thickness bodyweight gap is legitimate under Policy B.

## 3. Nordic anchor representation — KEEP

**Current state:** the Nordic curl needs `[bodyweight, partner or anchor]`.

**Gap:** no *measured* context includes "partner or anchor", but it is already a **selectable item in Decide's equipment picker**, because the picker derives its options from the data.

**Impact:** with "partner or anchor" selected, together with the bodyweight fixtures or alone, hamstrings and `hamstring-back-fullness` answer with the Nordic curl.

**Changes existing recommendations?** No change is needed; the representation works.

**Recommendation:** KEEP. If discoverability matters, a picker hint is a later UX item, not a data change.

## 4. Side plank in core-anti-lateral-flexion — CHANGE

**Current state:** "Trunk bracing that resists sideways bending, **trained through unilaterally-loaded carries**…". Its only exercise is the suitcase carry, rated high fatigue.

**Gap:** the method clause excludes the canonical lateral-flexion-resisting hold. As a result this goal is **empty under a low-fatigue limit even in a full gym**.

**Impact of widening the wording** (e.g. "…such as unilaterally-loaded carries or side-lying holds") **and tagging the side plank:**

| Metric | Result |
|---|---|
| Opened / lost | +114 / 0 |
| Selection cells | 15, incl. full-gym low fatigue |
| Best Fits changed | 36 |

**Changes existing recommendations? Yes.** Full-gym defaults for this goal (build-base, visual-area, low-fatigue, limited-equipment) move from the suitcase carry to the side plank:
- build-base and visual-area via the alphabetical fallback;
- low-fatigue and limited-equipment via the cost rules.

For a durability goal that is a reasonable default, and the carry remains its alternative.

**Recommendation:** CHANGE the definition and tag the side plank.

## 5. Appearance outcome referencing front delt — KEEP

**Current state:** no aesthetic outcome lists `front-delt`. It is reachable only through Direct/Advanced, the shoulders region, and complement goals.

**Option tested:** add `front-delt` as a *supporting* target of `shoulder-width-front`.

| Metric | Result |
|---|---|
| Opened | +90 (9 bodyweight cells) |
| How it opens them | **by making the pike push-up the supporting-tier answer to "shoulder width"** (94 scenarios) |

Front-delt work doesn't create shoulder width; the side delt does. That would be manufactured coverage, which **Policy B forbids**.

**Recommendation:** KEEP. A new front-delt outcome would need a genuine visual problem it answers. The overhead press's own mirror effect notes that front delts are rarely the missing piece. This is not recommended now.

## 6. Other issues found during Stage 5

### 6a. `heavy-compound` is undefined — NEEDS PRODUCT DECISION

**Current state:** `SCHEMA.md` lists the coverage category but never defines it. It is applied to barbell presses *and* to bodyweight presses (push-up, pike push-up).

**Inconsistency:**
- Build-base ranks `heavy-compound` first and then falls back to the alphabet.
- A bodyweight press tagged `heavy-compound` therefore ties with barbell presses.
- The existing push-up and pike push-up only stay behind the barbell presses because of their names ("flat-barbell…" sorts before "push-up", and "overhead-press" before "pike…").
- A1, if tagged, exposes this: it would become the gym upper-pec build-base pick.

**Option tested — retag the push-up and pike push-up without `heavy-compound`:**

| Metric | Result |
|---|---|
| Opened / lost | 0 / 0 |
| Best Fits changed | 65 |
| Full-gym defaults with no limit | none changed |

Several limited-tolerance build-base answers get *worse*, e.g. the shoulders build-base for a minimal kit becomes band external rotation instead of the pike push-up.

**Recommendation:**
- **Now:** author A1 and A2 without the tag, as above.
- **Decide separately:** define `heavy-compound` (e.g. "a compound that can be loaded heavily and progressively"), and either accept the existing push-up and pike tags as named exceptions, or add a general build-base tie rule.

### 6b. Rectus abdominis definition vs the plank — CHANGE (wording only)

**Current state:** `rectus-abdominis` is "trained through spinal- and hip-flexion movements", but the anti-extension plank is tagged `rectus-abdominis`.

**Untagging the plank instead would lose 240 answers** (abs for bodyweight and home users).

**Recommendation:** CHANGE the definition wording to include anti-extension bracing, as the obliques definition already covers anti-movement work.
- **Zero recommendation change.**

### 6c. Triceps (and biceps) definitions vs the existing tags — CHANGE (wording only)

**Current state:** `triceps` is "trained through elbow-extension movements", yet triceps-biased *presses* carry it.

**Recommendation:** add "including triceps-biased presses". If item 1 is approved, add "including supinated-grip pulls" to `biceps`.
- **Zero recommendation change** by itself.

### 6d. Triceps-long-head ratings — KEEP

**Question:** the overhead triceps extension and the cable overhead extension are rated medium skill and medium setup, which leaves long-head empty under low-skill and low-setup limits even in a gym.

**Option tested — re-rate both low:**

| Metric | Result |
|---|---|
| Selection cells opened | 6 (gym and home) |
| Best Fits churned | **344** |

**Recommendation:** KEEP. There is no evidence the ratings are wrong, and changing ratings to close coverage would be gaming.

### Noted, out of this report's scope

- **Replace-exercise strictness.** 36 exercises are never replaceable, the largest structural gap, flagged in Stage 5. It is a rule, not a definition.

---

# PART C — Combined recommendation

1. **Exercises to ADD**
   - Feet-elevated push-up (`upper-pec`, without `heavy-compound`).
   - Close-grip push-up (`triceps`, without `heavy-compound`).
   - Side-lying hip abduction (`gluteus-medius-minimus`).
2. **Exercises to REJECT**
   - Sliding leg curl (needs a new equipment item; hamstrings already covered via the anchor option).
   - Inverted row (no bodyweight access; gym churn).
   - Bodyweight triceps extension, already rejected in Stage 5.2.
3. **Definition changes to make**
   - Widen `core-anti-lateral-flexion` and tag the side plank.
   - Tag the chin-up `biceps`, with sign-off on the 2 gym build-base defaults.
   - Reword `rectus-abdominis` (anti-extension), `triceps` (triceps-biased presses) and `biceps` (supinated pulls), with zero recommendation impact.
4. **Definition changes to leave alone**
   - Neck hold → neck thickness.
   - Nordic representation.
   - A front-delt Appearance reference (supporting or new outcome).
   - Triceps-long-head ratings.
   - Retagging the existing push-up and pike push-up.
5. **Remaining analysis that is genuinely necessary**
   - **The `heavy-compound` definition and build-base tie question (6a)** — the only open product decision.
   - **Real-record re-runs** after implementation, as for Stages 5.4 and 5.5.
   - **Verify the side-lying abduction EMG citation** before writing evidence notes.
   - Replace-exercise strictness remains a separate, later design review.
6. **Expected final impact** — everything in 1 and 3 together, simulated as one variant:

| | Now | After all recommendations |
|---|---:|---:|
| Scenarios (incl. new exercises as current) | 36,720 | 37,656 |
| Answered | 21,064 | **23,653** |
| Answered, original 36,720 only | 21,064 | 23,134 (**+2,070**) |
| Answers lost | — | **0** |
| Selection cells opened | — | 92 |
| Best Fits changed | — | 1,657 (≈ 82% of them in complement goals) |
| Bodyweight-gap empties | 3,312 | **2,696** |
| Physique targets with a strict-bodyweight option | 7 / 25 | **9 / 25** (+ triceps, glute med/min) |
| Physique targets with a bodyweight + fixtures option | 11 / 25 | **14 / 25** (+ upper pec, biceps, glute med/min) |

**Full-gym default changes (no limits), 15 in total**, every one traced to an approved rule or a recommended tag:

| Cause | Selections affected | Count |
|---|---|---:|
| Limited-equipment (bodyweight costs 0) | arms; triceps / `triceps-back-depth`; upper-pec / `chest-upper-shelf`; glute med / `hip-width-side`; anti-lateral-flexion | 8 |
| Low-fatigue (cost tie-break) | upper-pec / `chest-upper-shelf` | 2 |
| Chin-up tag | biceps / `biceps-front-peak` build-base | 2 |
| Anti-lateral-flexion definition | build-base / visual-area / low-fatigue | 3 |

The anti-lateral-flexion limited-equipment change is counted in the first row.

## Checks

| Check | Result |
|---|---|
| validate-data | PASS (128 records) |
| Vitest | 298 / 298 |
| lint | clean |
| build | OK |
| Playwright | 3 / 3 |

Both simulation passes were run twice with byte-identical output. Temporary harnesses deleted; only this report was added.

---

# Implementation results

## What was implemented

**New records** (all `reviewed`, all pass the coaching gate):

| Record | File | Target | Equipment | Coverage tags | `overlaps_with` |
|---|---|---|---|---|---|
| `feet-elevated-push-up` | `chest.yaml` | `upper-pec` | `[bodyweight, bench]` | `low-setup`, `equipment-limited-substitute` | `push-up-chest` |
| `close-grip-push-up` | `arms.yaml` | `triceps` | `[bodyweight]` | `low-setup`, `equipment-limited-substitute` | `push-up-chest (chest module)`, `close-grip-bench-press` |
| `side-lying-hip-abduction` | `hips.yaml` | `gluteus-medius-minimus` | `[bodyweight]` | `isolation`, `low-setup`, `low-fatigue`, `equipment-limited-substitute` | `hip-abduction` |

- **No `heavy-compound`** on either push-up.
- **Side-lying hip abduction `evidence_notes`:** the EMG citation was checked against the primary abstract (PubMed, via NCBI E-utilities) **before** being written. Distefano et al., 2009, *JOSPT* 39(7):532–540, PMID 19574661: 21 subjects; glute medius activity was highest in side-lying hip abduction (81% ± 42% MVIC) of the 12 exercises tested. The note states that EMG shows activation, not hypertrophy.

**Retag:** `side-plank` now carries `functional_goals: [core-anti-lateral-flexion]`.

**Definitions (wording only):**
- **`core-anti-lateral-flexion`:** now "…carries…, or side-lying holds such as the side plank that resist bending toward the floor". `why_it_matters` now attributes grip endurance to carries only.
- **`rectus-abdominis`:** adds "and through anti-extension bracing that resists the lower back arching".
- **`triceps`:** adds "including triceps-biased presses such as close-grip pressing and triceps-biased dips".

**Videos:** sourced by search and checked with YouTube oEmbed (HTTP 200). The titles and channels match each record's name, equipment and laterality. All are recorded as `metadata`, `2026-10-03`, **footage not watched**. URLs are unique.

| Record | Video | Channel | ID |
|---|---|---|---|
| Feet-elevated push-up | "Feet Elevated Push-ups (Exercise Library)" | Horton Barbell | `4aUUcfwyfE0` |
| Close-grip push-up | "Close Grip Push-Up \| Proper Form Tutorial for Triceps Strength" | FIT.nl | `0LZF3OY87uU` |
| Side-lying hip abduction | "Exercise Tutorial: Side Lying Hip Abduction" | Travis Tarrant | `HePuOF1v9-0` |

The audit then reported 131 / 131 LIVE. `VIDEO-CURATION-QA.md` and `KNOWLEDGE-QA.md` were regenerated.

**Not changed, as instructed:** heavy-compound behaviour, neck-hold targeting, Nordic representation, front-delt Appearance coverage, triceps-long-head ratings, replace-exercise strictness. Sliding leg curl, inverted row and bodyweight triceps extension were not added.

## Held: chin-up → biceps (and the biceps wording)

Implementing the tag broke an **existing taxonomy invariant** that the Part B simulation didn't model (`app/src/data/physique-targets.test.ts`): an exercise's physique targets must share a `body_regions` value with each target's parent region. The chin-up is `back`; `biceps` belongs to `arms`.

The real data was measured all three ways (full analysis, two runs, byte-identical):

| Chin-up option | Full-gym default changes | vs approved simulation | Invariant |
|---|---:|---|---|
| Tag, `body_regions: [back]` | **15** (as approved) | 0 differences | **Violated** (test fails) |
| Tag + add `arms` (the Romanian-deadlift multi-region convention) | **16** | 3,370 differences | Satisfied |
| Not tagged | **13** | 0 differences | Satisfied |

The 16th change is the **arms region's full-gym build-base, which would move from the close-grip bench press to the chin-up**. It is decided only by the alphabetical fallback: "chin-up" sorts before "close-grip-bench-press".

- Neither tagged form was within the approved scope: one breaks a rule, the other adds an unapproved default change.
- So the tag **and** the biceps wording that names the chin-up are held for a decision.
- The other biceps wording points don't depend on this.

**Options:**
1. Accept the `[back, arms]` region with its extra arms-region default.
2. Relax the invariant (a taxonomy-rule change).
3. Leave the chin-up untagged.

## Test updates

| Test | Change | Reason |
|---|---|---|
| `data/index.test.ts` | Expects 131 records | Three new records |
| `engine/alternatives.test.ts` | "Replace incline dumbbell press with only Smith + bench" now ranks `[feet-elevated-push-up, smith-machine-incline-press]` | The new push-up is eligible (bodyweight always available) and ties with the Smith press on every structural criterion: same `primary_targets` wording, no coverage overlap. The alphabetical fallback picks it. |
| `engine/emptyResult.test.ts` | The "functional goal named as the subject" example now uses `rotator-cuff` under low skill | The old example (anti-lateral-flexion under low fatigue) is answered by the side plank now, which is the intended effect |

- The alternatives test pins the new behaviour, and a dated note was added under `DECISION-ENGINE-RULES.md` §2's worked example. This case is part of the tie analysis below.
- **No engine test needed changing.**

## Real-record coverage (two runs, byte-identical)

| | Before (`47c5f28`) | After |
|---|---:|---:|
| Scenarios | 36,720 | 37,512 (+792 with the new exercises as current) |
| Answered | 21,064 | **23,477** |
| Answered on the original 36,720 | 21,064 | 22,958 (**+1,894**) |
| **Answers lost** | — | **0** |
| Best Fits changed | — | 1,643 |
| Alternatives changed | — | 3,025 |
| Complement lists changed | — | 4,939 |
| Bodyweight-gap empties | 3,312 | **2,696** |
| Targets with a strict-bodyweight option | 7 / 25 | **9 / 25** |
| Targets with a bodyweight + fixtures option | 11 / 25 | **13 / 25** (14 with the held chin-up tag) |

### vs simulation

- **0 differences** across all 37,512 scenarios against the Part C simulation without the chin-up tag.
- This covers status, Best Fit, alternative, complements, match tier and functional goal.

### Full-gym default changes: 13

That is the expected 15 minus the 2 chin-up changes:

| Cause | Selections affected | Count |
|---|---|---:|
| Limited-equipment (bodyweight costs 0) | arms; triceps / `triceps-back-depth` (close-grip push-up); upper-pec / `chest-upper-shelf` (feet-elevated push-up); glute med / `hip-width-side` (side-lying hip abduction); anti-lateral-flexion (side plank) | 8 |
| Low-fatigue (cost tie-break) | upper-pec / `chest-upper-shelf` | 2 |
| Anti-lateral-flexion definition | build-base, visual-area, low-fatigue | 3 |

### Targeting leakage: none

Every primary- or supporting-tier pick of a new exercise is its own target, or a target its outcome declares as supporting:

| Exercise | Outcome / target | Tier | Scenarios | Why allowed |
|---|---|---|---:|---|
| Feet-elevated push-up | upper-pec target, `chest-upper-shelf`, `chest-side-projection` | primary | 170 / 170 / 86 | Own target |
| Feet-elevated push-up | `chest-front-width` | supporting | 70 | Declares `upper-pec` as supporting |
| Close-grip push-up | triceps target, `triceps-back-depth` | primary | 368 / 368 | Own target |
| Close-grip push-up | `arm-side-thickness` | supporting | 146 | Declares `triceps` as supporting |
| Side-lying hip abduction | glute-med target, `hip-width-side` | primary | 72 / 72 | Own target |

- **Functional goals:** the side plank is the selection pick for `core-anti-lateral-flexion` in 96 scenarios. No other functional goal resolves to a new exercise except through region-wide complement goals.

## Checks

| Check | Result |
|---|---|
| validate-data | PASS (131 records) |
| Vitest | 298 / 298 |
| lint | clean |
| build | OK |
| Playwright | 3 / 3 |
| Fresh clone (`npm ci`, then validate, test, lint, build and e2e) | all pass |

---

# Focused analysis: heavy-compound and tie behaviour

_Analysis only; nothing implemented._ It covers the build-base goal across all 69 entries × 6 contexts × 4 tolerances on the current data, with two runs, byte-identical.

## The behaviour

- **Build-base ranks** `heavy-compound` (key 0) before `stable-compound` (1) before everything else (2). Target tier, aesthetic role and suitability still apply first.
- **Within a key, the alphabetical id decides.**
- **`heavy-compound` has no written definition** (`SCHEMA.md` only lists it).
- **24 records carry it. 6 are bodyweight-loaded:** chin-up, pull-up, both dips, push-up, pike push-up.

So a bodyweight press tagged `heavy-compound` ties with the barbell presses, and **the alphabet picks between them**:

- **Already happening:** the chest region's full-gym build-base is the **chest dip** ("dip…" before "flat-barbell…"), the Stage 5 "material" tie case.
- **Avoided only by name:** the push-up stays behind the bench press ("flat-barbell…" before "push-up"), and the pike push-up stays behind the overhead press ("overhead…" before "pike…").
- **Would happen if tagged:** the new feet-elevated push-up would take the full-gym upper-pec / `chest-upper-shelf` build-base from the incline barbell press ("feet…" before "incline…"). That is why it was authored without the tag.
- **The same family of tie in alternatives:** the feet-elevated push-up outranks the Smith incline press for "replace incline dumbbell press with Smith + bench" (see Test updates).

## Options measured (build-base Best Fits vs current)

| Option | Build-base changes | Lost | Full-gym defaults changed | Notes |
|---|---:|---:|---|---|
| **R1** Engine: in any build-base tie, prefer setups without `bodyweight` | 84 | 0 | 7 — chest dip → **flat barbell bench**; chin-up → reverse-grip barbell row; Copenhagen → hip adduction / abduction; side plank → suitcase carry; neck hold → neck extension | **Too crude.** "No bodyweight item" isn't "externally loaded": a wall-based tibialis raise beats the single-leg calf raise for calves in bodyweight contexts, and a band abduction beats the glute bridge in the minimal kit |
| **R2** Data: untag bodyweight presses (push-up, pike) | 34 | 0 | none | Some limited-tolerance answers get worse (minimal-kit shoulders → band external rotation instead of the pike push-up) |
| **R3** Engine: a bodyweight-loaded `heavy-compound` ranks with `stable-compound` (key 1) in build-base | **18** | 0 | 2 — **chest: dip → flat barbell bench**; **lat width: chin-up → reverse-grip barbell row** | **No bodyweight-context changes.** It makes tagging bodyweight presses `heavy-compound` safe: with the new push-ups tagged *and* R3, upper-pec's gym build-base stays the incline barbell press |
| New push-ups tagged, current engine | 54 | 0 | 2 — upper-pec and `chest-upper-shelf` → feet-elevated push-up | The regression avoided by authoring them untagged |

## Assessment

- **The root cause is general:** build-base has no notion of external loadability, and ties between loaded and bodyweight compounds fall to the alphabet. That is a general rule, not a muscle-specific one.
- **R3 is the smallest general rule that fixes it.** 18 build-base changes, nothing lost, no bodyweight-context change.
  - It fixes the existing chest-dip default.
  - It changes lat width's gym build-base from the chin-up to the reverse-grip barbell row. That is debatable: a vertical pull is the more canonical lat-width base.
- **R1 and R2 are not recommended.**

## Recommendation (for decision, not implemented)

1. **Define `heavy-compound` in `SCHEMA.md`.** For example: "a multi-joint movement that can be loaded heavily and progressively (external load, or bodyweight plus added weight)". Documentation only.
2. **Keep the current authoring rule:** bodyweight variants of an existing loaded pattern are not tagged `heavy-compound` (as done for both new push-ups).
3. **If a build-base fix is wanted, R3 is the candidate.** It needs a product decision on whether the lat-width gym build-base should move from the chin-up to the reverse-grip barbell row. A ranking change like this would also deserve its own regression tests and coverage re-run.

---

# Final decisions (stage closed)

## Kept

| Item | Status |
|---|---|
| Feet-elevated push-up | Kept |
| Close-grip push-up | Kept |
| Side-lying hip abduction | Kept |
| Side plank → `core-anti-lateral-flexion` (with the widened definition) | Kept |
| Rectus abdominis wording clarification | Kept |
| Triceps wording clarification | Kept |

## Chin-up → biceps: not adopted

- The chin-up stays `physique_targets: [lat-width]`, `body_regions: [back]`, and is otherwise unchanged.
- It is not added to the arms region.
- The biceps wording change that existed only to support that tag is not made; the biceps definition is unchanged.

## Rejected and unchanged

- **Rejected:** sliding leg curl, inverted row, bodyweight triceps extension.
- **Unchanged:** neck hold, Nordic anchor representation, front-delt Appearance coverage, triceps-long-head ratings, replace-exercise strictness.

## heavy-compound

- **Documented in `SCHEMA.md` (meaning only, no behaviour change):** "A multi-joint movement that can be loaded heavily and progressively — external load, or bodyweight plus added weight."
- **Authoring convention kept:** bodyweight variants of a loaded pattern don't automatically receive the tag.
- **No ranking change.** R3 is not accepted as a package.

### Before any future heavy-compound ranking change

A dedicated Build-base analysis must look at Build-base intent and **every affected full-gym default**. It must explicitly resolve, separately:
- **chest:** dip vs flat barbell bench press;
- **lat width:** chin-up vs reverse-grip barbell row.

This is the next architecture discussion.

**No further exercise additions in this batch.**

## Final real-record validation

The data is unchanged since the implementation commit; only `SCHEMA.md` and this report changed. The full analysis was re-run twice, and both runs were byte-identical **and byte-identical to the implementation run**.

| Check | Result |
|---|---|
| Scenarios | 37,512 |
| Answered | 23,477 |
| Answers lost | **0** |
| Full-gym default changes | 13 |
| Targeting leakage | **none** |
| validate-data | PASS (131 records) |
| Vitest | 298 / 298 |
| lint | clean |
| build | OK |
| Playwright | 3 / 3 |
| Fresh clone | all pass |

