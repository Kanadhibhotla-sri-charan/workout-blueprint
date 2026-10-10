# Next Quality Gate — Assessment for Architect Approval

_Analysis only. Base: `main` at `5eda773`, 140 exercises._

**Unchanged:** no record, eligibility rule, ranking rule, target, goal or equipment vocabulary. Simulations used a temporary, reverted engine hook and harness files that were never committed.

**Measurement:** the 69-entry × 6-context × 4-tolerance × 7-goal space. Each run was repeated and produced byte-identical output (SHA-256 `05ae3c63…c6b2f8`; change list `5e68eff0…37e17`).

**Correction to `POST-EXPANSION-QUALITY-ASSESSMENT.md`:** that simulation matched `overlaps_with` entries as raw strings.
- It missed the 30 entries written as `"id (module) — note"`.
- This report parses entries with the app's own `parseRelationshipEntry`.
- Its figures supersede the earlier 777 / 2,797.

## 1. Content-review queue (final)

Exposure is the number of times a record is the Best Fit across the scenario space.

| Tier | Order | Records |
|---|---|---|
| **P1: new** (9) | By exposure | cable-pull-through (620), sissy-squat (476), hamstring-bridge (474), step-up (406), plank-shoulder-tap (340), seated-band-row (152), reverse-crunch (102), single-leg-hip-thrust (64), upright-row-wide-grip (24) |
| **P2: `reviewed` but edited** (18) | By exposure | See §1.1 |
| **P3: `needs-review`, edited** (11) | By exposure | push-up-chest (1,082), static-lunge (320), cable-curl (181), rear-delt-fly (151), dumbbell-curl (97), overhead-press (89), hack-squat (86), goblet-squat (32), preacher-curl (24), walking-lunge (16), barbell-bent-over-row-pronated (10) |
| **P4: untouched `needs-review`** (66) | By exposure | Appendix A |

**What each tier's review covers:**
- **P1:** full Review Promotion Gate. First the ranking inputs (demand ratings, `physique_targets`, `coverage_categories`, `selection_role`), then coaching accuracy, then a **watched** video check.
- **P2 and P3:** the edited fields first. P3 also needs coaching written.
- **P4:** coaching plus the full gate. 24 of the 66 carry evidence notes, and their citations need checking against the sources.

### 1.1 P2: the 18 records whose `reviewed` status should be revoked

| Record | Best Fits | Edited fields | Build package |
|---|---:|---|---|
| glute-bridge | 1,144 | equipment, equipment_setups, resistance_profile, programming_notes | no |
| single-leg-romanian-deadlift | 562 | equipment, equipment_setups, resistance_profile, programming_notes | no |
| barbell-dumbbell-shrug | 497 | equipment, equipment_setups, resistance_profile, programming_notes | yes |
| cable-fly | 450 | programming_notes | yes |
| straight-arm-pulldown | 366 | equipment, equipment_setups, resistance_profile, programming_notes | yes |
| reverse-curl | 252 | equipment, equipment_setups, resistance_profile, programming_notes | yes |
| chest-supported-row | 244 | programming_notes | yes |
| close-grip-bench-press | 236 | programming_notes | yes |
| bulgarian-split-squat-knee-dominant | 222 | equipment, equipment_setups, resistance_profile, programming_notes | yes |
| bulgarian-split-squat-hip-dominant | 216 | equipment, equipment_setups, resistance_profile, programming_notes | yes |
| reverse-wrist-curl | 192 | equipment, equipment_setups, resistance_profile, programming_notes | yes |
| hammer-curl | 191 | equipment, equipment_setups, resistance_profile, programming_notes | yes |
| romanian-deadlift | 172 | programming_notes | yes |
| seated-calf-raise | 140 | equipment, equipment_setups, resistance_profile, programming_notes | yes |
| wrist-curl | 128 | equipment, equipment_setups, resistance_profile, programming_notes | yes |
| cable-lateral-raise | 110 | programming_notes | yes |
| overhead-triceps-extension | 100 | equipment, equipment_setups, resistance_profile, programming_notes | yes |
| standing-calf-raise | 64 | programming_notes | yes |

These are 13 setup edits and 5 note-only edits.

**What revocation would affect:**
- **Decide:** nothing. The engine treats `needs-review` exactly like `reviewed` (§2).
- **Build packages:** a conflict. 16 of the 18 are Build-package exercises, and `app/src/data/coaching.test.ts` requires every package exercise to be `reviewed`. Revoking them fails 16 tests.

**Recommendation:**
- Revoke all 18; the status should not claim a review that hasn't covered the current content.
- In the same change, turn the package assertion into "`reviewed`, or listed in a pinned, shrinking pending-diff-review list". The coaching-count assertions stay; all 18 still pass them.
- Clear the 16 package records first. Their diffs are one or two fields each.

## 2. Review policy vs engine eligibility

### 2.1 Exact current behaviour

| Status | Decide (all 7 goals) | "Current exercise" picker | Explore / detail | Build packages | Validator |
|---|---|---|---|---|---|
| `draft` | **Excluded** from selection candidates, the complement region pool, and both structural rankers | Still listed and accepted (looked up in the full library) | Shown, with no status label | No engine check | No gate |
| `needs-review` | **Fully eligible**, identical to `reviewed` | Listed | Shown, with no status label | Blocked only by `coaching.test.ts` | No gate |
| `reviewed` | Eligible | Listed | Shown | Required (test) | Promotion Gate: automatable subset plus coaching counts |

- The UI never shows review status.
- There are currently 0 `draft` records.
- SCHEMA says "only `reviewed` records may be consumed by recommendation logic". The engine has excluded only `draft` since Phase 3, and Phase 7 relied on that when it moved 77 records to `needs-review` with no answer changes.

### 2.2 Impact of enforcing review eligibility (simulated by treating ineligible records as `draft`)

| Policy | Eligible | Answered (of 39,672) | Answers lost | Default-pick slots emptied | Best Fits changed (still answered) |
|---|---:|---:|---:|---:|---:|
| Current: not `draft` | 140 | 27,509 | — | — | — |
| `reviewed` only | 54 | 21,550 | 5,959 | 247 | 5,966 |
| `reviewed` only, after the P2 revocation | 36 | 16,423 | 11,086 | 498 | 6,359 |

**What reviewed-only would empty:**
- core anti-extension, neck, scapular stability and mid-chest selections in every context;
- all glute, forearm and upper-trap selections once P2 is revoked.

### 2.3 Recommended policy

1. **Keep eligibility as it is**: everything except `draft`. Do not enforce reviewed-only; it would remove 22–40 % of answers with no content shown to be wrong.
2. **Make the documentation match the behaviour.** Update SCHEMA: `review_status` is a content-assurance marker, and `draft` is the only recommendation gate. Use `draft` to withdraw a record found to be wrong.
3. **Optionally (UI, needs approval):** a small "content under review" note on `needs-review` Best Fits, mirroring the existing video note. It doesn't affect ranking.
4. Let the review queue (§1), not eligibility, reduce the share of `needs-review` Best Fits (currently 11,457 / 27,509).

## 3. `overlaps_with` audit

- **Inventory:** 258 entries on 128 records, forming 160 unordered pairs.
- **One-directional pairs:** 62.
- **Ranking-critical:** toggling a pair moves at least one replace / complement Best Fit under the proposed tie-break. That holds for 46 listed pairs and 53 candidate missing pairs.

| Category | Count | Pairs |
|---|---:|---|
| **Incorrect** (remove) | 4 | hip-abduction ~ hip-adduction (**ranking-critical**, 32 answers: opposite actions, different muscles); neck-extension ~ neck-flexion (antagonists); wrist-curl ~ reverse-wrist-curl (antagonists); cable-rear-delt-builder ~ seated-cable-row (rear-delt isolation vs compound row; different targets and type) |
| **Missing** (add) | 4 + 62 reverse entries | dumbbell-curl ~ zottman-curl (critical, 30); dumbbell-curl ~ incline-dumbbell-curl (critical, 9); single-arm-dumbbell-row ~ barbell-bent-over-row-pronated; single-arm-dumbbell-row ~ chest-supported-row. The single-arm dumbbell row currently has no overlaps at all. The 62 missing reverse entries change no ranking if the engine treats overlap as two-way, as proposed |
| **Ambiguous** (keep; reviewer decides) | 13 | shrug ~ farmer's carry; farmer's carry ~ suitcase carry; band external rotation ~ face pull; Copenhagen plank ~ side plank; hammer curl ~ pronation/supination; pronation/supination ~ reverse curl; reverse curl ~ reverse wrist curl; hanging knee raise ~ standing cable hip flexion; sumo deadlift ~ sumo squat; BSS hip-dominant ~ single-leg RDL; spinal-dominant back extension ~ RDL; leg-press calf raise ~ seated calf raise; flat dumbbell fly ~ hex press (**critical**, 24) |
| **Defensible** | 143 | Same-movement families: presses, rows, pulldowns, curls, squats, lunges, flies, lateral / rear-delt raises; plus bias splits of one movement (BSS, dips, pullovers, back extensions) |
| **Considered and rejected as missing** | — | They would make answers worse: feet-elevated push-up ~ the incline presses ("replace my incline machine press" → push-up); hex press ~ push-up / machine press; face pull ~ machine reverse fly; goblet squat ~ hack / Smith / sumo squat; dumbbell squat ~ back / front squat; incline curl ~ preacher curls; cross-position triceps pairs |

Remaining overlap entries outside the ranking-critical set were reviewed with the same criteria. Every incorrect or ambiguous pair is listed above; the rest are defensible.

## 4. Equipment continuity: specification

```
continuity(current, candidate, available) =
  max over S in usableSetups(candidate, available),
           C in equipmentSetups(current)
  of |{ item in S ∩ C : item ∉ NON_CONTINUITY }|
NON_CONTINUITY = { bodyweight, bench, incline bench }
Higher continuity ranks first.
```

**Edge cases:**

| Case | Rule |
|---|---|
| Unrestricted context (`available = null`) | Every candidate setup counts as usable (same as `usableSetups`) |
| Multi-setup candidate | Only setups usable here count; the best one decides. A cable record's band setup counts at home, its cable setup only where a cable is available |
| Multi-setup current exercise | All its setups count, usable or not. The user is often replacing it *because* it can't be done here; the intersection with a usable candidate setup only ever counts items that are available |
| Candidate with no usable setup | Cannot occur: it is already ineligible (`isEquipmentFeasible`). The implementation should assert this rather than score it |
| Nothing shared, or the current exercise is bodyweight-only | Continuity is 0 for every candidate; the key is neutral and the ID decides |
| `NON_CONTINUITY` | An engine constant, **not** a vocabulary change. These items are always available or are support furniture. Counting them produces 52 of the 64 flagged regressions in §5, e.g. "replace my incline barbell press" → feet-elevated push-up through the shared bench |

## 5. Re-run: shared tie-break with audited overlaps and usable-setup continuity

**Order** (after the existing target and coverage keys, in both rankers):
1. unmarked before `secondary`;
2. curated overlap: replace prefers it, complement / different stimulus avoids it; checked in both directions;
3. equipment continuity (§4);
4. ID.

| | Recommended | Alt: continuity counts all items | Alt: overlaps unaudited |
|---|---:|---:|---:|
| Material failures on `main` | 776 | 812 | 773 |
| **Best Fit changes** | **2,088** (replace 392; different 848; complement 848) | 2,402 | 2,025 |
| Alternatives changed | 3,562 | 3,994 | 3,501 |
| Complement lists changed on default-pick answers | 1,401 | 1,562 | 1,385 |
| Changes outside existing ID ties | **0** | 0 | 0 |
| Default-pick (selection) Best Fit changes | **0** | 0 | 0 |
| Answered ↔ empty changes | **0** | 0 | 0 |
| Remaining material failures | **0** | 0 | 0 |
| Material failures unchanged because a curated overlap outranks continuity | 1 (intended) | 1 | 25 (Zottman, from the missing overlap) |
| Flagged regressions | **12** (all intended, below) | 64 (52 are bench / bodyweight artefacts) | 12 |
| Ties still decided by ID | 5,994 | 5,524 | 6,067 |

Changes by context:

| Any | Gym | Home | Band + pull-up bar | Bodyweight | Nothing selected |
|---:|---:|---:|---:|---:|---:|
| 721 | 721 | 408 | 198 | 22 | 18 |

### The 12 flagged regressions, reviewed

All of them are "replace my cable drag curl" at home or with band + pull-up bar.
- The cable curl (a curated overlap) loses to the dumbbell, hammer or cross-body hammer curl because the cable-curl record is `secondary`.
- In those contexts the cable curl can only be done as the band curl, so this is the intended effect of putting role first.
- In a gym nothing changes.
- **Architect confirmation needed:** role before overlap.

### The one unchanged flagged case

- "Replace my cable curl" at home still gives the dumbbell curl, a curated overlap, rather than the hammer curl.
- The hammer curl shares the band setup, so the continuity check flags it.
- Correct: the curated relationship outranks equipment.

### Pinned representative cases

All 9 are alphabetical ties on `main`, and the different-stimulus result equals complement in each.

| # | Scenario key (entry \| goal \| context \| tolerance \| current) | `main` | Proposed |
|---|---|---|---|
| 1 | `target:back-thickness\|replace-exercise\|commercial-gym\|none\|chest-supported-row` | seated-band-row | **seated-cable-row** |
| 2 | `target:upper-pec\|replace-exercise\|commercial-gym\|skill\|incline-barbell-press` | feet-elevated-push-up | **incline-machine-press** |
| 3 | `target:quads\|replace-exercise\|home-dumbbells\|none\|back-squat` | dumbbell-squat-sides | **goblet-squat** |
| 4 | `target:biceps\|replace-exercise\|home-dumbbells\|none\|preacher-curl` | cable-curl (band) | **dumbbell-curl** |
| 5 | `target:rear-delt\|replace-exercise\|commercial-gym\|none\|machine-reverse-fly` | cable-rear-delt-builder | **rear-delt-fly** |
| 6 | `target:triceps\|replace-exercise\|commercial-gym\|none\|lying-triceps-extension-skull-crusher` | cable-overhead-extension-leaning-forward | **overhead-triceps-extension** |
| 7 | `target:biceps\|replace-exercise\|commercial-gym\|none\|incline-dumbbell-curl` | barbell-ez-bar-curl | **dumbbell-curl** |
| 8 | `target:rectus-abdominis\|complement-current\|home-dumbbells\|none\|ab-wheel-rollout` | plank | **reverse-crunch** |
| 9 | `target:gluteus-maximus\|complement-current\|minimal-kit\|none\|hip-thrust` | cable-pull-through | **single-leg-romanian-deadlift** |

### Largest transition groups (complement and different stimulus each)

- Ab-wheel rollout: plank → reverse crunch (36).
- Suitcase carry: Pallof press → Russian twist (32). Neutral reshuffle.
- BSS hip-dominant / hip adduction: pull-through → glute bridge (26 each).
- Back / front squat replace: dumbbell squat → goblet squat (26 each).
- RDL / BSS: cable kickback → glute bridge (24).
- Hip abduction: cable kickback → hip adduction (16). Enabled by removing the incorrect overlap.

**Neutral reshuffles remain:** carries and core, lat-pullover ↔ straight-arm pulldown. These are the cost of replacing an arbitrary rule with a reasoned one.

## 6. Regression tests required before implementation

1. **Continuity unit tests:**
   - unrestricted context;
   - multi-setup candidate (only usable setups count);
   - multi-setup current exercise (all setups count);
   - nothing shared → neutral;
   - bodyweight / bench / incline bench never count;
   - a candidate without a usable setup is unreachable (assertion).
2. **Overlap tests:**
   - parsed IDs (bare and `"id (module) — note"`);
   - two-way matching;
   - direction flips between replace and complement;
   - a snapshot of the audited pair set, so any `overlaps_with` edit must update it deliberately.
3. **Comparator order:**
   - role > overlap > continuity > ID;
   - shared targets and coverage are never crossed;
   - target tier and aesthetic sorts stay on top;
   - same result for any library order.
4. **The 9 pinned scenario keys above**, asserting the exact Best Fit.
5. **Full-space invariants** (run twice, byte-identical):
   - 0 default-pick Best Fit changes;
   - 0 answered ↔ empty changes;
   - every change is an ID tie on `main`;
   - 0 remaining material failures;
   - Best Fit change count exactly 2,088 (392 / 848 / 848) for the approved data.
6. **Review gate:** the `coaching.test.ts` change from §1.1, with an explicit pending list.
7. Existing 310 tests, lint, build, Playwright, fresh-clone validation, and a production smoke test on the 9 pins.

## 7. For architect approval

1. Revoke `reviewed` on the 18 P2 records, with a pinned pending-diff-review list for the 16 package exercises.
2. Keep eligibility at "not `draft`"; correct SCHEMA to match. Optional: a UI "content under review" note.
3. Apply the `overlaps_with` audit: remove 4, add 4, add the 62 reverse entries. The 13 ambiguous pairs go to the reviewer.
4. Approve the continuity rule (§4), including the `NON_CONTINUITY` constant.
5. Approve the tie-break order (role → overlap → continuity → ID), including role before overlap (§5).
6. Order: overlap audit and P2 status change first, then the ranking implementation against the pinned 2,088.

## Appendix A — P4 queue (66 records, by exposure)

plank (752), chin-up-supinated (608), dumbbell-pullover-lat-biased (449), dumbbell-squat-sides (437), cable-band-external-rotation (410), isometric-neck-hold (272), suitcase-carry (252), push-up-plus (240), back-extension-45-hip-dominant (222), triceps-kickback (198), flat-dumbbell-fly (195), leg-press-calf-raise (160), neck-flexion (144), seated-machine-shoulder-press (138), machine-chest-press (130), single-arm-dumbbell-row (124), cable-reverse-curl (118), ab-wheel-rollout (112), reverse-lunge (106), decline-dumbbell-fly (98), machine-crunch (96), back-extension-45-spinal-dominant (90), machine-reverse-fly (88), incline-machine-press (86), farmers-carry (82), cable-rear-delt-builder (76), dumbbell-pullover-chest-biased (73), hip-adduction (72), russian-twist (68), incline-dumbbell-press (62), pronation-supination-work (62), tibialis-raise (56), machine-fly-pec-deck (54), incline-cable-press (44), neck-extension (40), flat-dumbbell-press (38), reverse-grip-lat-pulldown (36), cable-chest-press (30), cable-hammer-curl-rope (30), hex-press (30), lying-triceps-extension-skull-crusher (30), preacher-curl-machine (30), machine-triceps-extension (24), reverse-grip-barbell-row (24), standing-cable-hip-flexion (24), drag-curl (18), pull-up-pronated (18), cable-shoulder-press (16), smith-machine-squat (16), sumo-deadlift (16), cable-drag-curl (12), lateral-neck-flexion (12), neutral-grip-lat-pulldown (12), rack-pull (12), sumo-squat (12), stiff-leg-deadlift (9), smith-machine-romanian-deadlift (8), conventional-deadlift (6), nordic-hamstring-curl (6), smith-machine-bench-press (6), smith-machine-incline-press (6), t-bar-row (6), zottman-curl (6), smith-machine-shoulder-press (4), front-squat (0), smith-machine-bulgarian-split-squat (0).
