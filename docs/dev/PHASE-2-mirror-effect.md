# Phase 2 — `mirror_effect` Content Pass

**Date:** 2026-08-15
**Trigger:** User directed the `mirror_effect` pass to resume, per the sequencing decision logged at the end of [Phase 0](PHASE-0-plan-adoption.md#decisions-resolved-2026-08-15-same-day) and detailed in [Phase 1](PHASE-1-reconciliation-and-taxonomy.md#what-mirror_effect-is-and-why-its-being-populated-now).

## What changed

Populated the `mirror_effect` field — present in the schema since `FOUNDATION.md` was written, empty on all 123 records until now — across every module. Each entry describes the practical, visible outcome of consistent training on that exercise, derived from the record's own `resistance_profile`, `primary_targets`, and `movement_patterns` (the last of these made easier to read off cleanly after Phase 1's taxonomy normalization).

No other field was touched in this phase. No new exercises were added (Task J stays satisfied).

## What this pass is actually for

The underlying motivation, from the user directly: real training questions aren't phrased at the mechanism level ("give me a stretch-mediated hamstring exercise"). They're phrased as visible complaints — *"my arms look thin from the front,"* *"my lats are narrow despite putting in volume."* Every other field in this dataset answers the mechanism question. `mirror_effect` is the first field that answers the visible-outcome question directly, so a future symptom-driven lookup has something to match against.

A few examples of the distinctions this pass surfaced, directly relevant to the questions the user posed when this work was proposed:

- **"Arms thin from the front"** — the dataset now distinguishes biceps peak height (`incline-dumbbell-curl`, long-head-biased) from biceps base width (`preacher-curl`, short-head-biased) from the brachialis's specific contribution to front-view arm width (`hammer-curl`, called out directly as often the more relevant fix for this exact complaint, since the brachialis sits under and beside the biceps and pushes it outward independent of biceps size). Triceps work is framed as contributing more to overall arm mass and the back/side "horseshoe" view than to front-view width specifically.
- **"Lats narrow despite volume"** — the dataset now distinguishes vertical pulling (`pull-up-pronated`, `lat-pulldown-wide-pronated`, etc. — framed as the primary width/V-taper driver, the under-arm flare viewed from behind) from horizontal pulling (`chest-supported-row`, `barbell-bent-over-row-pronated`, etc. — framed as a back-thickness driver, not a width driver). If someone has been training rows and calling it "back volume," this distinction is precisely the answer to why width hasn't followed.
- A smaller but genuine physique-coaching nuance surfaced in `core.yaml`: heavy oblique/rotational work (`cable-woodchop`, `russian-twist`, `suitcase-carry`) carries an honest caveat that training it hard can visibly thicken the waist, which cuts against a tapered-look goal for some lifters — the load/frequency choice should match which outcome is actually wanted, not just "more core work is better."

## Evidence-honesty framing followed

Consistent with the field's original schema definition ("practical, non-guaranteed outcome framing") and with how `limitations` was handled in the previous session:

- Where a record's region/head-bias claim already carries a real citation in `evidence_notes` (chest upper/mid/lower, biceps long/short head, triceps long head), the `mirror_effect` text leans on that citation's confidence.
- Everywhere else — the large majority of records — `mirror_effect` is written as reasoned, mechanics-grounded description, not dressed up as evidence-backed. Language throughout uses "tends to," "contributes to," rather than "will" or "guarantees."
- Two records (`drag-curl`, `cable-drag-curl`) explicitly decline to make a shape-specific claim, since their underlying head-bias evidence is genuinely unresolved (see `arms.yaml`'s existing evidence_notes) — `mirror_effect` doesn't invent confidence the evidence_notes already flagged as absent.

## Validation

All 123 records re-validated after this phase: 30-field schema intact, zero duplicate IDs, zero empty `mirror_effect` values, `limitations` and `review_status` from prior phases unaffected.

## Pending decisions

None new from this phase.

## Next

No further phase is scheduled yet — awaiting direction on what comes after `mirror_effect`.
