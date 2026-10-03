# Phase 7 Stage 5.2 — Bodyweight Product-Scope Analysis

_Analysis only. Nothing changed in engine code, exercise data, target definitions, packages or programming logic._

All numbers come from the Stage 5.1 engine (`a633b99`) and the current 126 exercises. A temporary harness ran the engine unmodified and was deleted afterwards.

Two bodyweight contexts are measured:

- **Strict bodyweight:** nothing selected (`[]`). This is literally what the picker calls "bodyweight-only".
- **Bodyweight + fixtures:** `bodyweight`, `pull-up bar`, `dip bars`, `wall`, `bench`, i.e. common home or park fixtures.

For current-exercise goals, the "current exercise" is limited to exercises the user can actually do in that context.

## 1. Current product promise

### Is bodyweight-only presented as a supported context?

Only minimally. It appears in exactly one place in the product: the hint under Decide's equipment picker, "Select everything you have access to. Selecting nothing means bodyweight-only."

- `bodyweight` is also one of the picker's equipment options, because it is a value in the data.
- There is no bodyweight mode, preset, home-gym option or bodyweight label anywhere else in the app.
- **Explore** can filter by `bodyweight` like any other item.
- **Build** packages don't read equipment at all. They are gym packages.

### Does the UI imply every target has a bodyweight option?

No. Nothing in the UI or documentation says or implies per-target bodyweight coverage.

### Does the product distinguish "bodyweight supported" from "full gym supported"?

No. Equipment is a neutral filter. The product documents frame the product around the gym:

- **PDD §3:** primary users are "gym-goers who know some exercises…".
- **PDD §3, core jobs:** "What fits my equipment?" → "Show viable substitutions and their trade-offs". This promises substitutions within what's available, not completeness.
- **PHASE-3-MVP §0:** "something the project owner can actually use in the gym".
- **PHASE-3-MVP §27:** the success criterion is use "during an actual gym session".
- **DEPLOYMENT-AND-PRODUCTION-READINESS:** "consistently useful to someone standing in the gym".

### Are empty results presented as an error, a limitation, or normal?

As a normal limitation. The result block is rendered in muted text, not an error style, and reads:

> "No exercise in this region meets every constraint you gave. Try relaxing one — equipment and fatigue tolerance are the most common blockers."

- It doesn't say what was missing or which equipment would unlock an answer.
- It says "region" even when a specific target was selected.

### Is there documentation defining equipment coverage expectations?

No. `DECISION-ENGINE-RULES.md` §1 defines how feasibility works. Stage 3.5 made bodyweight always available. Neither defines coverage expectations.

### Conclusion

Today's promise is **gym-first with honest filtering**. Bodyweight is a valid equipment answer, not a supported programming context. The equipment selector's existence was deliberately not treated as a promise.

## 2. Bodyweight coverage

### Per target (selection goals: build-base, visual-area, low-fatigue, limited-equipment, which all have the same coverage)

✓ marks a target with at least one answer. The exercise named is the build-base Best Fit with no tolerance limit.

| Target | Strict bodyweight | Bodyweight + fixtures |
|---|---|---|
| mid-pec | ✓ push-up | ✓ push-up |
| rectus-abdominis | ✓ plank | ✓ hanging knee raise, plank |
| gastrocnemius | ✓ single-leg calf raise | ✓ |
| gluteus-maximus | ✓ glute bridge | ✓ |
| quads | ✓ reverse Nordic | ✓ |
| lower-pec | — | ✓ dip (chest) |
| lat-width | — | ✓ chin-up, pull-up |
| triceps | — | ✓ dip (triceps) |
| adductors | — | ✓ Copenhagen plank |
| upper-pec, front-delt, side-delt, rear-delt, back-thickness, upper-traps, biceps, brachialis, triceps-long-head, obliques, soleus, gluteus-medius-minimus, hamstrings, forearm-flexors, forearm-extensors, neck-thickness | — | — |
| **Targets with an option** | **5 / 25** | **9 / 25** |
| **Targets with no option** | **20** | **16** |

### By tolerance (targets with an option, of 25)

| Tolerance | Strict | Fixtures |
|---|---:|---:|
| None | 5 | 9 |
| Low fatigue | 4 | 5 |
| Low skill | 4 | 4 |
| Low setup | 5 | 9 |
| Low stability | **1** (glute bridge) | **1** |

Most bodyweight exercises are rated medium or high stability, so a low-stability limit leaves almost nothing.

### By goal (targets with at least one answer, no tolerance limit)

| Goal | Strict | Fixtures |
|---|---:|---:|
| build-base, visual-area, low-fatigue, limited-equipment | 5 | 9 |
| replace-exercise | **0** | 1 |
| different-stimulus / complement-current | **0** | 6 |

The current-exercise goals effectively don't work for bodyweight users:

- **In strict bodyweight**, 20 targets have no exercise the user could be doing in the first place.
- **The other 5 targets** have no bodyweight replacement or complement either. Each has one bodyweight exercise per region, and replacement needs an identical movement pattern.

## 3. Genuine gaps vs legitimate empty results

The 20 strict-bodyweight empty targets fall into three groups. Exercise names in **(a)** and **(b)** are examples of the kind of movement, not proposals.

### (a) Not meaningfully trainable with bodyweight alone: legitimate empty results

| Target | Why |
|---|---|
| Upper traps | Nothing loads shoulder elevation |
| Forearm flexors / extensors | Wrist flexion and extension need a load |
| Biceps, brachialis | Elbow flexion needs a bar or a load. With fixtures, chin-ups exist; see (c) |
| Side delt | No bodyweight shoulder abduction under meaningful load |
| Rear delt | Prone reverse flies with bodyweight are negligible load |
| Triceps long head | Needs elbow extension with the shoulder overhead under load; no bodyweight form exists |
| Soleus | The definition specifies seated/bent-knee plantarflexion, which needs load over the knees |
| Lat width, back thickness | Need a bar or anchor point. Lat width is covered with fixtures (chin-up / pull-up). Back thickness needs a hip-height bar (inverted row), which is not in any measured context |

### (b) Could reasonably have a bodyweight exercise: genuine content gaps

| Target | Example movement | Equipment needed |
|---|---|---|
| Front delt | Pike push-up | Floor only. **No bodyweight vertical press exists in the library** |
| Upper pec | Feet-elevated (decline) push-up | A bench or step (fixtures context) |
| Obliques | Side plank (lateral-flexion-resisting, which fits the definition) | Floor only |
| Gluteus medius/minimus | Side-lying hip abduction | Floor only. Low load; borderline |
| Triceps | Close-grip/diamond push-up (triceps-biased) | Floor only. The library's push-up is chest-biased |
| Hamstrings | The Nordic curl exists but needs `partner or anchor`; a sliding leg curl needs sliders/towel | An equipment-vocabulary question as much as a content one |

Lower pec (dips) and adductors (Copenhagen) are already covered with fixtures.

### (c) Indirect work that must NOT count as direct coverage

| Indirect source | Should not count as | Basis |
|---|---|---|
| Grip, dead hang, carries | Forearm flexors / extensors | The target definitions say grip loads them only indirectly |
| Carries, scapular pull-ups | Upper traps | Isometric or depression, not elevation |
| Push-up | Triceps or front delt | Secondary movers only |
| Dips | Triceps long head | The shoulder is extended, not flexed |
| Pull-ups | Biceps | Pronated pull-ups list elbow flexors only as secondary |

### Reported separately, not changed

These are definition or tagging questions:

- **Chin-up → biceps.** `chin-up-supinated` lists `elbow flexors` among its *primary* targets but carries only `lat-width`. Whether that's a direct biceps target is a tagging decision (Stage 5's option O2). It is not indirect work in the sense above.
- **Neck.** `isometric-neck-hold` lists neck extensors and flexors as primary targets and has a bodyweight setup, but it isn't tagged `neck-thickness`. The definition says "trained through loaded neck-extension and neck-flexion movements". Whether a bodyweight isometric hold counts as "loaded" is a definition question.
- **Nordic curl.** Its `partner or anchor` requirement means no measured context can use it, though a couch or door anchor is common at home. This is an equipment-vocabulary question.

## 4. Bodyweight triceps extension (bar or bench, `bodyweight + bench`)

- **Cells it would open:** none in strict bodyweight, because it needs a bench. With fixtures:
  - **if tagged long-head:** 3 triceps-long-head cells (no limit, low fatigue, low setup) plus 4 low-fatigue triceps-family cells;
  - **if tagged triceps only:** just those 4.
  - Either way it **replaces the dip as Best Fit in 24 existing fixtures scenarios**.
- **Genuinely missing movement or coverage?** Only partly. Elbow extension already exists (skull crusher, overhead extension). What's missing is a no-implement option.
- **Fits the long-head definition?** **No.** The shoulder sits at about 90°, the skull-crusher position. The library deliberately tags the skull crusher as `triceps` only ("partial long-head stretch, less than overhead"), so tagging this as long-head would contradict existing reasoning.
- **Overlap:** high with the skull crusher: same pattern, similar shoulder angle. It would need an `overlaps_with` entry.
- **Direct triceps-long-head target?** **No.**
- **Verdict:** **Do not add as a long-head fix.** As a triceps-only record, its value is small (4 cells, mostly displacing dips). A floor-only triceps-biased push-up would serve bodyweight triceps users better, but that is a separate content decision, not proposed here.

## 5. Pike push-up (`bodyweight`)

- **Cells it would open:**
  - 6 front-delt target cells in each bodyweight context (no limit, low fatigue, low setup), all as a **primary-target** match;
  - 12 current-exercise-goal cells.
  - It also replaces **Push-up Plus (a serratus exercise) as the shoulders-region Best Fit** in 24 bodyweight scenarios, an improvement for a region pick.
- **Fills a genuine gap?** **Yes.** The library has no bodyweight *overhead* press. Its four shoulder presses all need equipment: barbell/dumbbell, cable, machine or Smith. The only bodyweight record classed as a vertical press is the chest dip, which is a downward press.
- **Targets it could legitimately serve:**
  - **`front-delt` directly:** it matches the definition, "the primary driver of overhead and forward-pressing movements".
  - **Not** `side-delt`: pressing doesn't train abduction meaningfully, and the side-delt outcome would wrongly start recommending it.
  - **Not** `triceps` or `upper-pec`: secondary movers only.
- **Can Decide select those targets?** Partly.
  - Front delt is reachable through the **Direct/Advanced** picker and the **shoulders region**.
  - **No Appearance outcome uses front delt** as a primary or supporting target, so the default Appearance path never reaches it. That limits its real-world reach.
- **Unwanted secondary-target recommendations?** **None** when tagged front-delt only, since no outcome lists front delt as supporting. Tagging it side-delt or triceps would create them; that should not be done.
- **Verdict:** **A legitimate addition under policy B**, tagged `front-delt` only. Its reach depends on the Direct/Advanced path until an outcome references front delt; that is a separate product question.

## 6. Recommended product policy: **B**

**Bodyweight is supported where it is physiologically and programmatically meaningful. Some targets legitimately have no bodyweight recommendation.**

Why not the others:

- **Not A (every target answered):**
  - Group (a) targets have no meaningful bodyweight exercise. Forcing coverage means tagging indirect work (forbidden by §4 of the brief) or adding exercises with negligible load.
  - Nothing in the product promises A either.
- **Not C (a convenience mode only):**
  - Stage 3.5 made bodyweight an explicit, always-available equipment answer.
  - The picker already tells users "nothing selected means bodyweight-only".
  - 5 to 9 targets are genuinely well served.
  - Demoting it would discard working behaviour.

B matches the gym-first product with honest filtering, and the actual decision space.

### Practical consequence

1. **Add exercises only for group (b),** and only where a bodyweight movement directly trains the target as defined. Never add to group (a), and never tag group (c).
2. **A legitimate empty result must say so.**
   - Today's message is generic: "relax a constraint", with "region" even for a target.
   - Under B, the message should state that no bodyweight option exists for this target and name what would unlock one, e.g. "needs a dumbbell, cable or barbell", derived from the candidates' setups.
3. **Write the coverage expectation down.** Add a short "equipment coverage policy" note (for example in `DECISION-ENGINE-RULES.md` or the PDD) so future additions are judged against B, not against answer counts.

## 7. Recommended next implementation step

**Make legitimate empty results explicit:** an equipment-aware `no-candidates` message.

- When equipment is the only blocker, say which target or region has no option with this equipment, and list the cheapest setups among the target's candidates that would unlock it.
- **Scope:** engine message plus UI. No data, ranking or feasibility change.
- **Why first:** under policy B, empty results are permanent for group (a), so they must read as an informed answer, not a dead end. It also benefits every equipment context, not just bodyweight.

### Then, as separate approvals

1. **Pike push-up**, tagged `front-delt` only.
2. **Group (b) content decisions, one at a time:** side plank (obliques), feet-elevated push-up (upper pec), triceps-biased push-up (triceps).
3. **The flagged definition and tagging questions:** chin-up → biceps, isometric neck hold → neck thickness, the Nordic curl's anchor requirement.
4. **Whether an Appearance outcome should reference front delt.**

The bodyweight triceps extension should **not** be added as a triceps-long-head fix.

## Checks

| Check | Result |
|---|---|
| validate-data | PASS |
| Vitest | 282 / 282 |
| lint | clean |
| build | OK |
| Playwright | 3 / 3 |

No engine, data, definition, package or programming change. The temporary harness was deleted. Only this report was added.
