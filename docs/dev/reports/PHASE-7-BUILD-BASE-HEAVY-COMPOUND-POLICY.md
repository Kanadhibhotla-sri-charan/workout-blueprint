# Build-base / heavy-compound Policy Analysis

_Analysis only. No code, exercise data, ranking or definitions were changed._

## Method

- **Data:** current engine and data (`b4bc290`, 131 exercises).
- **Space:** the Build-base goal over all 69 entries (11 regions, 25 targets, 26 outcomes, 7 functional goals) × 6 equipment contexts × 4 tolerances = **1,656 scenarios**.
- **"Full-gym default":** the result with equipment unrestricted (`any`) or `commercial-gym`, and no tolerance limit.
- **Ranking replication:** a temporary harness reproduced Build-base's ranking key (target tier → aesthetic role → aesthetic suitability → goal key → alphabetical id). It matched the engine's Best Fit in every audited default.
- **How policies were simulated:** in memory only.
  - Data-level policies by retagging in memory.
  - Tie-break policies by swapping the id comparator, which in Build-base is only called on goal-key ties.
- **Determinism:** every simulation pass ran twice with **byte-identical** output.
- The harnesses were deleted afterwards.

## 1. What Build-base is intended to optimise

| Source | What it says |
|---|---|
| PHASE-3-MVP §13 Step 2 | Goal "Build the main training base", derived from the knowledge base; "do not create unsupported recommendation categories". |
| PHASE-3 dev log | Mapped to structured fields as "`build-base` (ranks by `heavy-compound` > `stable-compound` > other)". |
| Engine explanation | "A heavy-compound movement — a solid main-training-base choice for this region." |
| PDD §4 | "Coverage categories describe an exercise's role; **they do not make it mandatory or superior.**" |
| PDD §2 | "Context beats 'best'." |
| SCHEMA.md (Stage 5.6/5.7) | `heavy-compound` = "a multi-joint movement that can be loaded heavily and progressively — external load, or bodyweight plus added weight." |
| Knowledge manuals (CHEST.md, BACK.md) | Describe dips, chin-ups and pull-ups as "Heavy compound". |

**Build-base's intent:** offer, for the selected area, a multi-joint movement that can carry heavy, progressive loading, the movement a routine is built around.

**What `heavy-compound` is: (c), both.**
- It was **introduced as a descriptive role tag (a)**; the PDD explicitly says such tags don't make an exercise "superior".
- Build-base **uses it as a ranking preference (b)** because it is the only structured field that expresses "main base".
- The documents don't resolve this tension. In Build-base the tag acts as a *bucket*: everything in the top bucket is treated as equally good, and the alphabet picks among them.

**Under the documented meaning, the six bodyweight-loaded `heavy-compound` records are tagged correctly.** The dips, chin-up and pull-up can be loaded with added weight; the push-up and pike push-up with a vest or progressions. So the tags themselves are not wrong. The question is only how ties inside the top bucket are resolved.

## 2. Audit of the full-gym Build-base defaults (69 entries)

| What decided the winner | Entries |
|---|---:|
| **Alphabetical tie** within the top key | **53** |
| Only one candidate | 7 |
| Goal key (`heavy`/`stable`/other) separated the winner from everything else | 4 |
| Aesthetic role | 3 |
| Aesthetic suitability | 2 |

- **Winner's goal-key class:** heavy-compound 29; stable-compound 4; other 36.
- `any` and `commercial-gym` agree on every entry except where the ab wheel is unavailable in the gym list (`ab-front-definition`, core region, rectus abdominis → cable crunch). Those cases are unrelated to `heavy-compound`.

### Defaults where heavy- or stable-compound status decides the result, or a heavy tie is resolved alphabetically

**Key:** "BW" = bodyweight-loaded (a setup contains `bodyweight`).
- **Intentional?** = does the result match Build-base intent?
- **heavy-compound semantics change?** = would P1 (bodyweight-loaded ranks with stable) or P4 (loaded first among heavy ties) change it?

| Entry | Current winner | Tied with (same full key) | Why they tie / what decides | Intentional? | heavy-compound semantics change? |
|---|---|---|---|---|---|
| **chest (region)** | **chest dip** (BW) | flat barbell bench, flat DB press, incline BB, incline DB, push-up (BW) | All `heavy-compound`, no target in play → **alphabet** ("dip" first) | **Questionable.** A lower-pec specialist (high skill, high stability) as the whole chest's base, over the flat press the mid-pec definition calls the default | P1/P4 → flat barbell bench, but **only by alphabet again** among the loaded presses |
| **lat width (target)** | **chin-up** (BW) | pull-up (BW), reverse-grip barbell row, T-bar row | All heavy, primary tier → **alphabet** | **Intentional.** The target's definition says "trained **primarily through vertical-pull** movements" | P1/P4 → **reverse-grip barbell row, a regression** against that definition |
| upper pec / `chest-upper-shelf` | incline barbell press | incline DB press | Both heavy → alphabet. The feet-elevated push-up is **untagged**, so not tied | Yes | No (with the push-up untagged) |
| shoulders (region) / front delt | overhead press | pike push-up (BW) | Both heavy → **alphabet** ("overhead" before "pike") | Yes, but **by name only** | P1/P4/P4′ make it structural; the result is unchanged |
| mid-pec / `chest-front-width` | flat barbell bench | flat DB press, push-up (BW) | Heavy tie → alphabet ("flat-barbell" first) | Yes, by name only | No |
| arms (region) / triceps / `triceps-back-depth` | close-grip bench | triceps dip (BW) | Heavy tie → alphabet ("close" first) | Yes, by name only | No |
| back (region) | barbell bent-over row | chin-up (BW), deadlift, pull-up (BW), rack pull, reverse-grip row, … | 7-way heavy tie → alphabet | Defensible | No |
| `back-width-v-taper` | chin-up (BW) | pull-up (BW) | Rows are excluded by the outcome's `vertical-pull` suitability; then alphabet | Yes | No |
| back thickness / `back-side-thickness` | barbell bent-over row | T-bar row | Heavy tie → alphabet | Yes (equivalent options) | No |
| glutes (hips region, target, 2 outcomes) | hip thrust | RDL | Heavy tie → alphabet | Yes | No |
| hamstrings (region, target, outcome) | RDL | stiff-leg deadlift | Heavy tie → alphabet | Yes (equivalent) | No |
| quads (region, target, outcome) | back squat | front squat, sumo deadlift, sumo squat | Heavy tie → alphabet | Yes | No |
| lower pec / `chest-lower-definition` | chest dip (BW) | — | The only heavy candidate; **goal key decides** | Yes (the dip is the lower-pec tool) | No (P1 would demote it to tie with the stable presses, but none is tagged lower-pec) |
| upper traps (target) | rack pull | — | Heavy beats the shrug (other); **goal key decides** | Debatable, but documented: the rack pull is tagged upper traps. The Appearance outcome picks the shrug via its role | No |
| gastrocnemius (target) | leg-press calf raise | — | Stable beats other; **stable-compound decides** | Debatable. The calf outcomes override it via role/suitability | No |
| calves (region) / soleus | leg-press calf raise | seated calf raise | Stable tie → alphabet | Defensible | No |

**Other full-gym alphabetical ties** are outside heavy-compound: biceps, rear/side delt, forearms, neck, core, obliques, adductors, glute med, long head. They tie on goal key "other" and were already identified in Stage 5 as needing curation, not a rule.

### Ties between bodyweight-loaded and externally loaded exercises in the top key

| Entry | BW winner? |
|---|---|
| chest (region) | **dip wins** |
| lat width | **chin-up wins** |
| shoulders / front delt | OHP wins (alphabet) |
| mid-pec / `chest-front-width` | bench wins (alphabet) |
| arms / triceps / `triceps-back-depth` | close-grip bench wins (alphabet) |
| back (region) | barbell row wins (alphabet) |

**A bodyweight-loaded exercise wins in only 2 of these 10 entries**, and they are the two cases this review must resolve.

## 3. The four named cases

1. **Chest: dip vs flat barbell bench.**
   - The dip wins purely because of its name; nothing in the data prefers it.
   - The underlying problem is **region-level selection without intent**. With no target selected, all six heavy chest presses tie, and the alphabet chooses.
   - Even if the dip were demoted, the flat barbell bench would beat the flat DB press and both incline presses **by alphabet again**.
   - So heavy-compound semantics can't fix this honestly; it is a region-curation gap.
2. **Lat width: chin-up vs reverse-grip barbell row.**
   - The current winner matches the target's own definition (vertical pulls first).
   - Every loadability-based policy (P1, P4, P2) replaces it with a horizontal barbell row. **That is a regression.**
3. **Upper pec: incline barbell vs feet-elevated push-up.**
   - No tie today: the push-up is untagged under the authoring convention.
   - Tagged, it would win by alphabet ("feet" before "incline") under the current engine, with 54 Build-base changes.
   - P4′ (below) would prevent that specific regression.
4. **Shoulders: pike push-up.**
   - It ties with the overhead press for the shoulders region and front delt in a full gym. The overhead press wins only by name.
   - In bodyweight contexts the pike push-up is the only option, which is intended.
   - No change under any policy below; P4/P4′ would make the overhead press's win structural.

## 4. Policies measured (Build-base, 1,656 scenarios)

| Policy | Build-base changes | Lost | Full-gym defaults changed | Outside full gym | Judgement |
|---|---:|---:|---|---|---|
| **P0 Current** | — | — | — | — | 1 questionable default (chest); everything else intentional or equivalent |
| **P1** Bodyweight-loaded heavy ranks with stable (R3) | 18 | 0 | **chest** dip → flat barbell bench ✔; **lat width** chin-up → reverse-grip barbell row ✘ | 14 changes under limits (e.g. push-up → machine chest press for chest build-base under low skill/setup; chin-up → back extension / chest-supported row) | One fix, one regression, plus limited-context churn |
| **P2** Prefer non-bodyweight in **any** Build-base tie | 84 | 0 | 7 — chest ✔; lat width ✘; side plank → suitcase carry; Copenhagen → hip adduction / abduction (3); neck hold → neck extension | 70 changes, incl. calves → tibialis raise and glute bridge → band abduction | Broad side effects; the "loaded" proxy fails (wall/band exercises count as loaded) |
| **P3** Remove heavy-compound from ranking (heavy = stable) | 22 | 0 | 4 — **RDL → 45° back extension** (hamstrings region, target, outcome) ✘; **barbell row → 45° back extension** (back region) ✘ | Push-up → machine press; chin-up → back extension | Regressions against Build-base intent |
| **P4** Targeted: among tied heavy compounds, externally loaded first | **4** | 0 | chest ✔; lat width ✘ | **none** | The smallest change, but still trades a fix for a regression |
| **P4′** Like P4, only between heavy compounds that share a movement pattern (the "bodyweight variant of a loaded pattern" case) | **0** | 0 | none | none | No effect today. It would only make the authoring convention structural for future tagged variants |

**Tag-safety check** (new push-ups tagged `heavy-compound`):

| Engine | Build-base changes | Full-gym defaults changed |
|---|---:|---|
| Current | 54 | 2 (upper pec / `chest-upper-shelf` → feet-elevated push-up) |
| With P4 | 51 | 2 (P4's own chest and lat-width changes) |
| With P4′ | 48 | **0** |

Even with P4′, tagging would still move 48 limited-context results, e.g. the triceps dip → close-grip push-up, which are different patterns. **The authoring convention remains the real safeguard.**

## 5. Assessment

- **There is no general heavy-compound ranking rule that fixes the one genuine inconsistency (chest) without introducing a regression** (lat width: P1, P2, P4) **or broader damage** (P2, P3).
  - The chest and lat-width cases have the *same structure*: a bodyweight-loaded heavy compound wins an alphabetical tie against loaded heavy compounds.
  - They need *opposite* answers because of what each selection means: a whole-region base vs a target defined by vertical pulls.
  - A loadability rule can't see that difference.
- **The chest case is not a heavy-compound problem.** It is region-level Build-base without intent. Even after removing the dip, the region's answer would still be chosen alphabetically among the loaded presses.
- **The tags are semantically correct** under the documented definition. Demoting bodyweight-loaded compounds contradicts that definition (dips and chin-ups are progressively loadable).
- **The existing authoring convention** (no automatic tag for bodyweight variants of a loaded pattern) already prevents the only regression the new exercises could cause.

## 6. Recommendation: **KEEP CURRENT BEHAVIOR**

- **No heavy-compound ranking change.** P1, P2, P3 and P4 are not recommended. P4′ has no effect today and need not be built unless tagged bodyweight variants are ever added.
- **Keep** the tags, the SCHEMA definition and the authoring convention as they are.
- **Separate product decision, not a heavy-compound change:** how the **chest region** Build-base default should be chosen, and more generally region-level Build-base intent.
  - The structured options would be curation, e.g. outcome-style `exercise_roles` or a per-region default target. Both are data or taxonomy additions needing their own analysis.
  - Until then, the chest region's dip default is a known alphabetical artefact, documented here.

**Smallest policy that fixes a genuine inconsistency without broad side effects:** none at the ranking level. The smallest change that addresses chest *honestly* is a curated region-level preference. That is outside the heavy-compound question and needs a product decision.

## Checks

| Check | Result |
|---|---|
| validate-data | PASS (131 records) |
| Vitest | 298 / 298 |
| lint | clean |
| build | OK |
| Playwright | 3 / 3 |

Both simulation passes were run twice with byte-identical output. The temporary harnesses were deleted, and only this report was added.
