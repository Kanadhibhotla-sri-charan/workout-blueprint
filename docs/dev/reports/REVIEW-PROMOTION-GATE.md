# Review Promotion Gate

**Produced for:** Phase 2, Task C ([`docs/architecture/PHASE-2-SCHEMA-AND-DATA-GOVERNANCE.md`](../../architecture/PHASE-2-SCHEMA-AND-DATA-GOVERNANCE.md)) — the reproducible promotion checklist that was flagged as owed back in [Phase 0](../PHASE-0-plan-adoption.md#decisions-resolved-2026-08-15-same-day) when `review_status: reviewed` was kept on all 123 records via a one-time self-audit rather than a re-runnable checklist.

## The gate

A record may carry `review_status: reviewed` only when every applicable item below passes. This is the same checklist as the Phase 2 spec's Section 7, reproduced here as the version this project actually runs against the data (see `scripts/validate-data.js`, Task E, for the automatable subset).

- [ ] Stable ID exists.
- [ ] User-facing name exists.
- [ ] Purpose is clearly stated (`summary` and `why_this_exists` both non-empty).
- [ ] Body-region classification is valid (non-empty, every value in the controlled 11-region set).
- [ ] Primary targets are valid (non-empty).
- [ ] Movement patterns are valid (non-empty, first item is a recognized fundamental pattern).
- [ ] Equipment is correctly classified (non-empty).
- [ ] Exercise type is valid (`compound` or `isolation`).
- [ ] Laterality is valid (`bilateral`, `unilateral`, or `alternating`).
- [ ] Coverage classification is valid (non-empty, every value in the controlled 10-category set).
- [ ] Resistance profile is meaningful (non-empty).
- [ ] Stability, skill, setup, and fatigue demand are all classified (`low`/`medium`/`high`).
- [ ] `best_used_when` is meaningful (non-empty).
- [ ] `less_suitable_when` is meaningful where applicable.
- [ ] `mirror_effect` is present and appropriately qualified (non-empty, hedged language).
- [ ] Advantages are meaningful.
- [ ] Limitations are realistic (non-empty).
- [ ] Relationships are valid (`overlaps_with` entries all resolve to a real ID).
- [ ] Evidence notes exist where material claims require support.
- [ ] No unresolved taxonomy issue exists.
- [ ] No unresolved identity issue exists.

Per the spec: **do not invent information merely to satisfy this checklist.** A record that can't honestly pass stays at `needs-review`, it doesn't get content fabricated to clear the gate.

## What running it against the current dataset found

Every automatable item was actually run against all 123 records, not asserted from memory. Full method: `docs/dev/reports/REVIEW-PROMOTION-GATE.md` (this document) plus the audit script's logic, summarized below.

**19 of 21 applicable items: 123/123 pass.** Identity, purpose, taxonomy, all four demand ratings, `best_used_when`, `mirror_effect`, `limitations`, and relationship resolvability are all clean across the entire dataset — no exceptions found.

**Two items did not pass universally:**

### 1. "Advantages are meaningful" — 123/123 fail

`advantages` is `[]` on every single record. This isn't a partial gap, it's total: the field has never been populated in any content pass this project has run (the `limitations`, `evidence_notes`, and `mirror_effect` passes each got dedicated sessions; `advantages` never did). Per [ADR 0002](../../adr/0002-empty-field-semantics.md), an empty (not `null`) optional field means "not yet established," not "not applicable" — so this can't be waved through as 123 deliberate N/A calls. It's a real, honestly-labeled content gap.

**This is not resolved in this phase.** Options, for the architect's or user's call:

- **(a)** Treat this as a known, logged exception — keep `review_status: reviewed` on records that pass every other item, with this specific gap tracked openly (in the QA report, Task H, going forward) rather than blocking on it.
- **(b)** Schedule a dedicated `advantages` content pass (the same shape of work as the `limitations` pass) before treating any record as fully gate-compliant.
- **(c)** Formally mark `advantages: null` across the board as "not applicable to how this project currently scopes exercise records" — this would be a real, if slightly convenient, position: several exercises' genuine advantages already show up implicitly elsewhere (a machine variant's stability benefit is already in its `resistance_profile`/`limitations` framing, for instance), so a dedicated `advantages` field may be redundant with content that already exists elsewhere in each record. Worth deciding deliberately rather than defaulting into it.

No option was chosen unilaterally here, consistent with how the equivalent question was handled in Phase 0 — this needs the same kind of explicit sign-off, not a silent pick.

### 2. "Evidence notes exist where material claims require support" — 4/123 flagged, all verified false positives

The automated heuristic (matching claim-language like "biased") flagged `back-extension-45-spinal-dominant`, `back-extension-45-hip-dominant`, `hack-squat`, and `bulgarian-split-squat-knee-dominant`. Manually checked each: all four use "-biased" language to describe a **technique-fork mechanical fact already explained in `why_this_exists`** (e.g. hack squat's fixed path mechanically shifts load toward the quads — that's equipment geometry, not a contested empirical claim the way the arms/chest/calves region-bias claims were). These are correctly evidence-note-free; the heuristic overcaught. No action needed, logged here so the false-positive rate on this specific check is documented rather than silently dismissed.

## Conclusion

21 of 22 records-wide checks pass cleanly with zero exceptions. One check (`advantages`) fails universally and needs a scoping decision before it can be called resolved either way. Until that decision is made, this project's honest position is: **`review_status: reviewed` remains in place** (per the Phase 0 precedent — a logged, deliberate call, not an oversight), **with the `advantages` gap tracked openly** rather than either fabricated shut or used to force a mass downgrade nobody asked for.
