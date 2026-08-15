# Phase 1 — Reconciliation (Task B) and Movement Taxonomy (Task F)

**Date:** 2026-08-15
**Trigger:** User directed Phase 1 to cover Task B then Task F, per the Phase 0 pending decisions.

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

## Decisions made

- Both Task B and Task F fixes were applied directly rather than just reported, since none of them were ambiguous judgment calls — every fix restores an already-established convention (dedup pattern, naming consistency, cross-reference quoting, list-item structure) rather than introducing a new one.
- Task F's "no new schema field" call is a real interpretive decision, not a mechanical one — logged with its reasoning in the classification report rather than asserted without justification, since a future reader (including the architect) should be able to see *why* this didn't need an ADR rather than just that it didn't get one.

## Validation

All 123 YAML records re-validated after every edit in this phase: 30-field schema intact, zero duplicate IDs, zero unresolvable relationship references, zero remaining mixed `movement_patterns` values.

## Pending decisions

None new from this phase. Task E's ADR (empty-field convention) remains open from Phase 0, deferred to whenever Task E is scheduled.

## Next

`mirror_effect` content pass resumes (paused at end of Phase 0), per the user's decision logged in [Phase 0](PHASE-0-plan-adoption.md#decisions-resolved-2026-08-15-same-day).

### What `mirror_effect` is and why it's being populated now

`mirror_effect` is not a new field — it has been part of the canonical schema since `FOUNDATION.md` was written (defined there as *"practical, non-guaranteed outcome framing"*), but it has sat empty (`""`) on all 123 records through every prior pass, including the `limitations` pass and the review-status promotion in the previous session. This work fills it in for the first time.

**What problem it addresses.** Every other populated field in this dataset answers a mechanism-level question — which muscle, which head, which position, which resistance curve. Nobody training actually queries at that level. The user's own framing: a real query looks like *"my arms look thin from the front"* or *"my lats are narrow despite volume,"* not *"give me a stretch-mediated hamstring exercise."* `mirror_effect` is the field that answers the visible-outcome question directly on each record, so that a future symptom-driven lookup (aesthetic complaint → likely cause → exercise) has something concrete to match against, instead of requiring that translation to happen ad hoc every time.

**How it's derived, and the evidence-honesty line being drawn.** Each record's `mirror_effect` is written from what the record *already* documents — its `resistance_profile` (where in the range it's hardest), `primary_targets` (which region/head is emphasized), and `movement_patterns` (now cleanly split per Task F, which makes this derivation easier than it would have been before this phase). This is a translation of existing, already-cited mechanics into plain "what you'd see in the mirror" language — not new research. Two evidence tiers apply, matching how `limitations` was already handled:

- Where the underlying region/head bias already carries a real citation in `evidence_notes` (e.g. the chest upper/mid/lower split, the biceps long/short-head split), the `mirror_effect` description can lean on that citation's confidence level.
- Where no such citation exists — which is most exercises — `mirror_effect` is written as reasoned, mechanics-grounded description, explicitly not dressed up as evidence-backed. This is exactly what "non-guaranteed outcome framing" in the original schema definition already asks for; this pass is honoring that phrase, not overriding it.

**Scope guardrail.** This is additional detail on the 123 existing records, not new exercises, so it stays inside Task J's "no expansion" boundary. It is being done in parallel with remediation rather than strictly after it (per the sequencing decision in Phase 0), because it touches no schema and adds no records — the two conditions the user and Claude agreed made it safe to interleave.
