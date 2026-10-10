# Preacher-Curl Coverage Semantics — Findings for Approval

_Analysis only. Base: `main` at `1f7dc9e`. **Unchanged:** no ranking input, summary or status. Both preacher records stay `needs-review`. Measurements are in-memory variants over the full 39,672-scenario space (two runs, byte-identical, SHA-256 `93a658b0…`)._

## 1. What `shortened-position-emphasis` means and does

| Source | Content |
|---|---|
| SCHEMA (`coverage_categories`) | Lists the tag in the closed vocabulary; **no semantic definition**, only "Decision-making impact: yes" |
| `COVERAGE-CATEGORY-EVALUATION.md` | Treats the lengthened / shortened tags as the "stimulus position" dimension |
| **`programming-profiles.yaml` (operational definition)** | `shortened-position-isolation`: "An isolation movement whose **hardest point sits at, or near, the shortened/contracted end of the range**". Guidance: "Peak tension is concentrated at the top/contracted position… a deliberate pause or squeeze there is more relevant". Rep range 10–20 (8–30). The lengthened counterpart: "hardest point sits at, or near, the stretched end of the range", 8–15 (6–20) |

**Engine effects of the tag:**
1. **Visual-area goal key.** Either position tag ranks first (`decisionEngine.ts`, `goalKey`).
2. **Structural coverage share.** It counts in replace (more shared preferred) and complement (fewer shared preferred) ranking.
3. **Programming profile.** For **isolation** records it selects `shortened-position-isolation` (rep range and squeeze-at-top guidance). Compound records skip these profile rules.

**Two senses in use.** The library uses the position tags in two senses:
- **(a) Where the load peaks within the movement's range.** This is the operational definition above.
- **(b) The working muscle's length set by another joint's position:** shoulder for the biceps and the triceps long head, hip for the hamstrings.

The incline curl (`lengthened shoulder position`) and the preacher curl (`shortened shoulder position`) were authored as mirror images in sense (b).

## 2. Records carrying the tag

| Record | Type | Sense | Stated hardest point | Consistent with the operational definition? |
|---|---|---|---|---|
| glute-bridge | compound | (a) | "hardest at the top with the hips fully extended" | **Yes** (profile rules don't apply to compounds) |
| hip-thrust | compound | (a) | Movement pattern "shortened range (hip fully extended)" | **Yes** (same) |
| single-leg-hip-thrust | compound | (a) | "hardest at the top with the hip fully extended" | **Yes** (same) |
| **preacher-curl** | isolation | (b) | Now "hardest with the elbows near straight" (P3 review) | **No** (see §3) |
| **preacher-curl-machine** | isolation | (b) | "often cam-adjusted through the range" | **Unverified** (see §3) |

**Shoulder position vs muscle length at the elbow (preacher curl):**
- **Shoulder:** flexed, which shortens the biceps long head at the shoulder. This is sense (b); the movement pattern "shortened shoulder position" states it accurately.
- **Elbow:** for the free-weight versions, the load peaks near full extension, the stretched end of the elbow range. This is sense (a), and it points the other way.

## 3. Is the tag correct for each preacher record?

**Evidence used:** two verified sources (`EVIDENCE-LEDGER.md`).
- **Oliveira et al. 2009 (PMC3737788).** Dumbbell preacher curl EMG was highest near full extension and fell toward the top. Limitations: pad angle not reported; posture labelling unclear; EMG measures activation, not load or growth.
- **Nunes et al. 2020 (PMC7460162).** Describes the barbell preacher curl as applying greater torque with the elbows extended, and the cable version with the elbows flexed. Limitations: a qualitative statement, not a measured curve; pad angle not reported. Hypertrophy was similar between versions.

| Record | Verdict |
|---|---|
| **preacher-curl** (barbell / EZ-bar / dumbbell on a pad) | **Not correct under the engine's definition.** Both sources place the hardest point near full extension, the opposite end from where the tag says. The profile it selects tells users to pause and squeeze at the top, which the sources contradict. Evidence for a positive `lengthened` label is weaker: EMG and a qualitative statement, pad angle unknown, and long-head length shortened at the shoulder. So the evidence supports removing the claim, not asserting the opposite |
| **preacher-curl-machine** | **Unverified, not refuted.** Neither source tested a machine; the record itself says the curve depends on the cam. Nunes' cable version (fixed pulley) loads the flexed end, so a machine could go either way |

## 4. Options measured (in memory, nothing applied)

| Option | Best Fit | Alternative | Complement lists | Answer status | Text-only | Profile change |
|---|---:|---:|---:|---:|---:|---|
| **O1:** preacher-curl shortened → lengthened | 24 (all replace) | 60 | 24 | 0 | 24 | preacher-curl → lengthened-position-isolation |
| **O2:** preacher-curl remove shortened (**proposed**) | **6** (all visual-area) | 14 | 0 | 0 | 18 | preacher-curl → moderate-hypertrophy-isolation |
| **O3:** both preacher records remove shortened | 12 (all visual-area) | 20 | 12 | 0 | 42 | both → moderate-hypertrophy-isolation |

**O1 Best Fit changes (24).** These come from coverage share: incline curl and preacher curl would share `lengthened-position-emphasis`.
- "Replace my incline dumbbell curl", any equipment / gym, entries biceps / arms / biceps-front-peak, no limit / fatigue / skill: dumbbell curl → **preacher curl** (18).
- "Replace my preacher curl", home: dumbbell curl or cross-body hammer curl → **incline curl** (6).

**O1 breaks two approved pinned cases:**
- #7 (`target:biceps|replace-exercise|commercial-gym|none|incline-dumbbell-curl` → dumbbell-curl);
- #4 (`target:biceps|replace-exercise|home-dumbbells|none|preacher-curl` → dumbbell-curl).

It also asserts a claim the evidence only partly supports. **Not recommended.**

**O2 Best Fit changes (6).** All are biceps visual-area, low-skill limit, any equipment / gym (entries `target:biceps`, `region:arms`, `outcome:biceps-front-peak`): preacher curl → **preacher curl machine**. The machine keeps its (unverified) shortened tag, so it inherits the position-emphasis rank.
- **Other O2 changes:** 14 alternatives (visual-area) and 18 text-only.
- **Text-only:** the preacher curl's programming guidance changes from "shortened-position isolation, 10–20 reps, squeeze at the top" to the generic moderate-hypertrophy profile.
- **Pinned cases:** none affected.

**O3 Best Fit changes (12).** All are biceps visual-area, any / gym, under a skill or setup limit: preacher curl or preacher machine → **barbell or EZ-bar curl**. This removes a claim that is only unverified, not refuted, for the machine.

## 5. Proposal (awaiting approval)

**Smallest correction: O2.**
- Remove `shortened-position-emphasis` from `preacher-curl` only. Keep `preacher-curl-machine` unchanged, recorded as unverified.
- The measured effect is listed in §4.

**Summary wording (preacher-curl):**
- Current: "Fixes the upper arm forward on a pad, removing swing for a strict, shortened-position biceps stimulus."
- Proposed: "Fixes the upper arm forward on a pad, removing swing for a strict biceps curl that is hardest with the elbows near straight."
- The summary is not a Decide input (detail page and Explore only), so it changes no answer.

**Decisions needed:**
1. Approve O2 as measured (6 / 14 / 0 / 0 / 18), or choose O3 or no change.
2. Approve the summary wording.
3. Should SCHEMA define the position tags explicitly as sense (a), matching the engine's profiles?

## 6. Related finding (not changed)

**incline-dumbbell-curl (`lengthened-position-emphasis`).**
- In the same Oliveira et al. 2009 data, incline and standing curls showed activation **rising through the concentric phase**, highest in the final third (the shortened end).
- That conflicts with the incline curl's `resistance_profile` "hardest with the arm long", read in sense (a).
- Its lengthened tag rests on sense (b): shoulder extension lengthens the long head.
- **The same sense question applies to it** and should be decided with item 3. EMG is activation, not load, so this is a flag, not a conclusion.

## Gate

No data or code changed, so there are no recommendation changes to report. The report is documentation only.
