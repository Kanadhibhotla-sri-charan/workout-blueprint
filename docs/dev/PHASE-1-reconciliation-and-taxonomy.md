# Phase 1 — Reconciliation (Task B), Movement Taxonomy (Task F), and `mirror_effect` Content Pass

**Date:** 2026-08-15
**Trigger:** Single user instruction covering all three pieces of work together: start with Task B, then Task F, then resume the `mirror_effect` pass — see the resolved pending decisions at the end of [Phase 0](PHASE-0-plan-adoption.md#decisions-resolved-2026-08-15-same-day).

## What changed

### Task B — Knowledge Manual ↔ YAML reconciliation

Ran a full audit (not a sample) matching every prose `### Name` heading against every YAML record's `name`, module by module, plus a complete resolvability check on every `overlaps_with` / `complements` / `alternatives` reference in the dataset. Full writeup: [`reports/RECONCILIATION-REPORT.md`](reports/RECONCILIATION-REPORT.md).

Three discrepancies found, all resolved:

1. **Romanian Deadlift (hips module)** — prose has it, YAML doesn't. Confirmed intentional: this is ADR 0001's dedup, the canonical record lives in `hamstrings.yaml` with `body_regions: [hips, hamstrings]`. No action needed; this is the entire 123-vs-124 count gap and it's explained.
2. **Dumbbell Pullover naming mismatch (back module)** — `BACK.md`'s heading read `### Dumbbell Pullover`, missing the `(Lat-Biased)` qualifier the YAML record and the entry's own body text both use. Fixed the heading and one internal cross-reference.
3. **Four bare cross-module relationship references** — `forearms.yaml` (`reverse-curl` ×2, `pronation-supination-work` ×1) and `shoulders.yaml` (`cable-rear-delt-builder` ×1) had bare-ID references pointing at records in a *different* file, breaking the established convention that cross-file references are quoted with a module note. Fixed all four to `"id (module) module"` form.

### Task F — Movement-pattern taxonomy normalization

Classified all 144 `movement_patterns` values across the dataset; 25 (in 23 records, 9 of 11 modules) combined a fundamental movement with a modifier — the plan's own named example (`elbow flexion in a lengthened shoulder position`). Full classification and reasoning: [`reports/MOVEMENT-TAXONOMY-CLASSIFICATION.md`](reports/MOVEMENT-TAXONOMY-CLASSIFICATION.md).

Findings, briefly: secondary joint position (shoulder position for arm work, hip/knee position for leg work) was the dominant modifier type (14 of 25) — not incidental, since it's the same variable several evidence_notes already hinge on for the biceps/triceps head-bias claims. Grip was second (6). Five records didn't fit the "pattern + modifier" frame at all — they're two independent joint actions happening at once (e.g. `face-pull` = abduction + rotation) — flagged as a structurally different case rather than forced into the modifier bucket.

**Decision: no new schema field, no ADR.** `movement_patterns` is already a list field; one record already had a modifier as a separate list item. Generalized that pattern instead of adding structure. All 25 values were split into a bare fundamental-pattern item plus one item per modifier.

### `mirror_effect` content pass

Populated the `mirror_effect` field — present in the schema since `FOUNDATION.md` was written (defined there as *"practical, non-guaranteed outcome framing"*), empty on all 123 records until now, including through the `limitations` pass and review-status promotion in the previous session — across every module. Each entry describes the practical, visible outcome of consistent training on that exercise, derived from the record's own `resistance_profile`, `primary_targets`, and `movement_patterns` (the last of these made easier to read off cleanly after this same phase's Task F normalization, done just beforehand).

**What problem it addresses.** Every other populated field in this dataset answers a mechanism-level question — which muscle, which head, which position, which resistance curve. Nobody training actually queries at that level. The user's own framing: a real query looks like *"my arms look thin from the front"* or *"my lats are narrow despite volume,"* not *"give me a stretch-mediated hamstring exercise."* `mirror_effect` is the field that answers the visible-outcome question directly on each record, so that a future symptom-driven lookup (aesthetic complaint → likely cause → exercise) has something concrete to match against, instead of requiring that translation to happen ad hoc every time.

A few examples of the distinctions this pass surfaced, directly relevant to the questions that motivated it:

- **"Arms thin from the front"** — the dataset now distinguishes biceps peak height (`incline-dumbbell-curl`, long-head-biased) from biceps base width (`preacher-curl`, short-head-biased) from the brachialis's specific contribution to front-view arm width (`hammer-curl`, called out directly as often the more relevant fix for this exact complaint, since the brachialis sits under and beside the biceps and pushes it outward independent of biceps size). Triceps work is framed as contributing more to overall arm mass and the back/side "horseshoe" view than to front-view width specifically.
- **"Lats narrow despite volume"** — the dataset now distinguishes vertical pulling (`pull-up-pronated`, `lat-pulldown-wide-pronated`, etc. — framed as the primary width/V-taper driver, the under-arm flare viewed from behind) from horizontal pulling (`chest-supported-row`, `barbell-bent-over-row-pronated`, etc. — framed as a back-thickness driver, not a width driver). If someone has been training rows and calling it "back volume," this distinction is precisely the answer to why width hasn't followed.
- A smaller but genuine physique-coaching nuance surfaced in `core.yaml`: heavy oblique/rotational work (`cable-woodchop`, `russian-twist`, `suitcase-carry`) carries an honest caveat that training it hard can visibly thicken the waist, which cuts against a tapered-look goal for some lifters — the load/frequency choice should match which outcome is actually wanted, not just "more core work is better."

**How it's derived, and the evidence-honesty line being drawn.** This is a translation of existing, already-cited mechanics into plain "what you'd see in the mirror" language — not new research. Two evidence tiers apply, matching how `limitations` was already handled:

- Where the underlying region/head bias already carries a real citation in `evidence_notes` (e.g. the chest upper/mid/lower split, the biceps long/short-head split, the triceps long head), the `mirror_effect` description leans on that citation's confidence level.
- Where no such citation exists — which is most exercises — `mirror_effect` is written as reasoned, mechanics-grounded description, explicitly not dressed up as evidence-backed. Language throughout uses "tends to," "contributes to," rather than "will" or "guarantees" — honoring the schema's original "non-guaranteed outcome framing" phrase rather than overriding it.
- Two records (`drag-curl`, `cable-drag-curl`) explicitly decline to make a shape-specific claim, since their underlying head-bias evidence is genuinely unresolved (see `arms.yaml`'s existing evidence_notes) — `mirror_effect` doesn't invent confidence the evidence_notes already flagged as absent.

**Scope guardrail.** This is additional detail on the 123 existing records, not new exercises, so it stays inside Task J's "no expansion" boundary. It was done alongside Task B and Task F rather than deferred, since it touches no schema and adds no records — the two conditions that made it safe to interleave with remediation, per the Phase 0 sequencing decision.

## Decisions made

- Task B and Task F fixes were applied directly rather than just reported, since none of them were ambiguous judgment calls — every fix restores an already-established convention (dedup pattern, naming consistency, cross-reference quoting, list-item structure) rather than introducing a new one.
- Task F's "no new schema field" call is a real interpretive decision, not a mechanical one — logged with its reasoning in the classification report rather than asserted without justification, since a future reader (including the architect) should be able to see *why* this didn't need an ADR rather than just that it didn't get one.
- `mirror_effect` was treated as part of this same phase rather than a separate one, since it was requested as a continuation of the same instruction and shares this phase's validation pass — an earlier version of this log briefly split it into a "Phase 2," which was a bookkeeping mistake corrected the same day, not a reflection of the work itself changing.

## Validation

All 123 YAML records re-validated after every edit in this phase: 30-field schema intact, zero duplicate IDs, zero unresolvable relationship references, zero remaining mixed `movement_patterns` values, zero empty `mirror_effect` values.

## Pending decisions

None new from this phase. Task E's ADR (empty-field convention) remains open from Phase 0, deferred to whenever Task E is scheduled.

## Next

No further phase is scheduled yet — awaiting direction on what comes after this one.
