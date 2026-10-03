# Phase 7 Stage 5.6/5.7 — Remaining Bodyweight & Definition Decisions

_Analysis only. Nothing in the repository was changed except this report: no exercise data, target definitions, ranking, engine or videos._

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
