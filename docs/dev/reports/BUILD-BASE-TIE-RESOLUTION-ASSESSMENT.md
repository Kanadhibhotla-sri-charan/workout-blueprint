# Build-Base Tie-Resolution Assessment

_Analysis only. No production code, exercise data, ranking rule or UI behaviour was changed. The temporary simulation harness was deleted after use and not committed._

## Decision

**Recommend one change: a narrowly scoped, optional per-exercise field that marks a record as a secondary (stand-in / accessory) choice.**
- It is applied as the **last tie-break before the ID** in the shared selection ranking (`rankByGoal`). That makes it cover all four selection goals, not Build-base alone.
- It is set only on records explicitly reviewed as secondary.
- With no existing record marked, it changes **0** production recommendations.
- **Build-base-only scoping is not sufficient.** It fully unblocks only the hamstring bridge; the band curl, dead bug and band pull-through would still take visual-area or low-fatigue picks by ID.
- **Reusing `equipment-limited-substitute` is not safe.** It changes 96 current picks, including regressions.

## 1. How Build-base ranks today

Selection Best Fit = first item of:

```
sortByTargetTier( sortByAestheticRole( sortByAestheticSuitability( rankByGoal(...) ) ) )
```

The three outer sorts are stable and only refine order within target / role / suitability tiers.

`rankByGoal` orders by:
1. the goal key (Build-base: `heavy-compound` 0, `stable-compound` 1, everything else 2);
2. a cost tie-break, for low-fatigue and limited-equipment only;
3. **`a.id.localeCompare(b.id)`**.

That ID comparison is the only place an ID decides a Best Fit. It runs whenever two candidates share every earlier key.

## 2. The five candidates

| Candidate | Ties on (Build-base) | Exercise it would displace by ID | Existing field that could distinguish the role | Supported by current data? |
|---|---|---|---|---|
| Hamstring bridge | goal key 2 (not heavy / stable); same target tier | Lying leg curl (gym, skill limit); single-leg RDL (home) | `equipment-limited-substitute` (honest for it); none on the displaced side | Partly: the tag exists, but its meaning is "equipment stand-in", not "not a base exercise" |
| Band curl | goal key 2; target tier | Barbell / EZ-bar curl (gym), dumbbell curl (home) | `equipment-limited-substitute` | Partly, as above |
| Dead bug | goal key 2; target tier | Plank, hanging knee raise | None: the plank carries the same substitute tag, type, equipment and ratings | **No** |
| Cable pull-through (band setup) | goal key 2; target tier | Glute bridge (home, minimal kit) | None: the glute bridge is the tagged substitute, the pull-through is not | **No** (the tag points the wrong way) |
| Belt squat | goal key 1 (`stable-compound`), `high-loadable` | Hack squat (any, gym) | None: both are stable, loadable machine squats | **No, and none is needed.** Both are legitimate base exercises; an ID choice between equals is harmless. Its blocker is purely the generic `machine` equipment item |

Fields rejected outright:
- **`exercise_type`:** points the wrong way. The compound hamstring bridge would beat the isolation leg curl.
- **Equipment-based loadability:** rejected in the earlier Build-base / heavy-compound analysis as too crude. For example, the wall tibialis raise beats calf raises.
- **Fatigue / skill / setup / stability or the `heavy-compound` tag:** not altered, as instructed.

## 3. Simulation

**Scope:**
- Build-base Best Fit over 69 entries × 6 equipment contexts × 4 tolerances = **1,656 cells** of current production data (139 exercises).
- Then the same cells, and the three other selection goals, with each candidate added, tagged as honestly as its role allows.

**Method:**
- The proposed key was injected at exactly the ID comparison inside `rankByGoal`, without editing production code. The harness intercepted the single `localeCompare` call made from `rankByGoal`.
- Each run was repeated, byte-identical (SHA-256 `b72936c3…8b85f`, `297130f8…d87ce7`).

### 3a. Effect on today's production picks (no candidates added)

| Rule (inserted before the ID) | Build-base Best Fit changes |
|---|---:|
| Reuse `equipment-limited-substitute`: non-substitutes first | **96** |
| Reuse `high-loadable`: loadable first | 0 |
| New narrow field, no existing record marked | **0** (by construction; verified) |

**The 96 substitute-rule changes are mixed:**

| Change | Cells | Assessment |
|---|---:|---|
| Glute max (target and outcomes): glute bridge → single-leg RDL (home) | 9 | Desirable |
| Adductors / inner-thigh fullness: Copenhagen plank → hip-adduction machine | 12 | Desirable |
| Triceps / triceps back depth: close-grip push-up → skull crusher, overhead extension, kickback (home) | 12 | Neutral to desirable |
| Arms region: close-grip push-up → curls | 8 | Neutral |
| Neck region: isometric hold → lateral neck flexion | 18 | Neutral |
| Hip stability: Copenhagen plank → hip abduction | 9 | Neutral |
| **Calves region: single-leg calf raise → tibialis raise** | 8 | **Regression:** the tibialis raise trains the shin |
| **Core anti-lateral-flexion: side plank → suitcase carry** | 9 | **Regression:** reverts the approved Stage 5.6/5.7 default |
| **Hips region: glute bridge / Copenhagen plank → hip abduction** | 7 | **Regression:** a glute-medius isolation becomes the hips base |
| **Upper pec / chest upper shelf: feet-elevated push-up → incline fly** | 4 | **Regression:** an isolation fly replaces a press as the base |

Conclusion: the tag's existing meaning ("an equipment stand-in") is not the same as "not a base choice". Reusing it changes many unrelated defaults, and still doesn't separate the dead bug from the plank or the pull-through from the glute bridge.

### 3b. Candidates: takeovers decided only by ID

Counts are selection-goal Best Fits taken from an existing pick. "Opened" (newly answered empty cells) is unchanged in every row: 18 for the bridge, 8 for the band curl, 0 for the others.

| Candidate | No change (ID fallback) | Substitute-tag rule (Build-base) | Narrow field, Build-base only | **Narrow field, all selection goals** |
|---|---|---|---|---|
| Hamstring bridge | BB 9 · LF 6 · LE 6 | BB **0** | BB **0** · LF 6 · LE 6 | BB **0** · LF 6 · LE 6 |
| Band curl | BB 36 · VA 8 · LF 40 · LE 24 | BB **0** | BB 0 · VA 8 · LF 40 · LE 24 | **all 0** |
| Dead bug | BB 72 · VA 72 · LF 96 · LE 96 | BB **50** (plank still loses) | BB 0 · VA 72 · LF 96 · LE 96 | BB 0 · VA 0 · LF 68 · LE 96 |
| Band pull-through | BB 28 · LF 32 | BB **28** (spreads further) | BB 0 · LF 32 | **all 0** |
| Belt squat | BB 6 · VA 6 | BB 6 | (marking it is not honest; see §2) | — |

BB = build-base, VA = visual-area, LF = low-fatigue, LE = limited-equipment.

**What remains under the recommended field:**
- **Hamstring bridge (LF 6, LE 6):** decided by the **existing cost tie-break**, not the ID. The bridge has lower fatigue than the single-leg RDL and lower skill; the Batch 5 report already measured these as merit wins.
- **Dead bug (LF 68, LE 96):** also cost-decided. It has lower stability demand than the plank, the same mechanism previously accepted as legitimate (follow-up report). If those are unwanted, that is a question about the cost rule, not the ID.

No candidate takes any pick by ID once marked.

## 4. Approaches compared

| | A. Reuse existing fields | B. Narrow optional field | C. Keep the ID fallback |
|---|---|---|---|
| Production picks changed | 96 (`equipment-limited-substitute`), several regressions; or 0 with no effect (`high-loadable`) | **0** until a record is marked | 0 |
| Candidates fully unblocked | Hamstring bridge, band curl (Build-base only) | **Hamstring bridge, band curl, band pull-through, dead bug** (its remaining wins are cost-rule merits) | None |
| Changes a field's meaning | Yes: "equipment stand-in" would come to mean "not a default" | No; new field, single meaning | No |
| Engine change | One comparator line | One comparator line + schema / validator entry | None |
| Risk | Unrelated defaults move | Misuse to steer picks. Mitigated by a narrow definition, review, and marking only records whose role is secondary | New stand-ins keep taking defaults by ID; four candidates stay blocked |

## 5. Recommendation

**Adopt B: one optional field, scoped to selection-goal ties.**

- **Field:** a single optional value per exercise, e.g. `selection_role: secondary`. Absent means today's behaviour.
- **Meaning, one sentence:** "A stand-in or accessory variant that should not be the default pick when an equally ranked, non-secondary exercise is available."
- **Engine:** in `rankByGoal`, compare `selection_role` immediately before `a.id.localeCompare(b.id)`, and after the goal key and cost tie-break. It is the last real key, so it can never override a target tier, aesthetic role, goal key or cost difference. It applies to all four selection goals through the one shared comparator. The ID remains the final fallback.
- **Initial marking:** only the deferred candidates whose role is genuinely secondary, as each is added:
  - hamstring bridge;
  - band curl;
  - dead bug;
  - cable pull-through (to allow its band setup).
- **Not marked:** the belt squat. It is a primary-role exercise waiting on an equipment item, and its ID tie with the hack squat is between equals.
- **Existing records:** not marked in the change that introduces the field. §3a shows bulk marking of current stand-ins moves 96 defaults with regressions, so any later marking of an existing record is its own reviewed change with a focused coverage check.
- **Guardrails:**
  - validator: closed vocabulary, one value;
  - SCHEMA definition, with the explicit rule that the field must reflect the exercise's role and must not be used to choose a winner;
  - a focused coverage check on every record that sets it.

**Not recommended:**
- **A:** regressions, and it changes a field's meaning.
- **Build-base-only scoping:** leaves 3 of 4 candidates blocked.
- **C:** acceptable only if expansion stops here, since four useful candidates stay blocked.

## 6. Confirmation

| Item | Changed? |
|---|---|
| Production code (`app/src/engine`, UI) | No |
| Canonical exercise records (`data/exercises`) | No |
| Ranking rules / target / goal definitions | No |
| Temporary harness (`app/src/__tie.test.ts`) | Deleted, never committed |
| Only file added | This report |
