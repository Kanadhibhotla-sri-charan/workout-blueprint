# Phase 2 — Schema & Data Governance

**Date:** 2026-08-15
**Trigger:** Architect-supplied [Phase 2 spec](../architecture/PHASE-2-SCHEMA-AND-DATA-GOVERNANCE.md), user directed "yes go ahead" on the full task list.

## What changed

### Task A + B — Schema frozen, `SCHEMA.md` written

[`docs/knowledge-manual/SCHEMA.md`](../knowledge-manual/SCHEMA.md) documents every one of the 30 canonical fields — type, required/optional, controlled vocabulary where applicable, decision-making impact, and whether it's required for `reviewed` — audited against the live 123-record dataset, not written from memory. Concrete findings from that audit, not assumptions:

- **A real schema violation, fixed:** `programming_notes` was a scalar string instead of the declared list type on 4 records (`preacher-curl`, `standing-calf-raise`, `romanian-deadlift`, `seated-leg-curl`). Converted to single-item lists to match the schema — exactly the kind of drift `validate-data` now catches automatically going forward.
- **`overlaps_with` is the real ID-reference field** (233/233 non-empty entries are ID-shaped); **`complements` is prose by design**, not IDs (only 3/236 entries happen to be ID-shaped, and all three still resolve); **`alternatives` is completely unused — `[]` on all 123 records, no exceptions.** All three findings are documented in `SCHEMA.md` rather than assumed or glossed over.

### Task C — Review Promotion Gate built and run

[`docs/dev/reports/REVIEW-PROMOTION-GATE.md`](reports/REVIEW-PROMOTION-GATE.md) is the reproducible checklist owed since Phase 0 (when `review_status: reviewed` was kept via a one-time self-audit, not a re-runnable gate). Ran it against all 123 records:

- **21 of 22 applicable checks: 123/123 pass, zero exceptions.**
- **"Advantages are meaningful": 123/123 fail.** `advantages` has never been populated in any pass this project has run. This was a real, honestly-labeled gap at the time this phase's audit ran — not resolved in this phase, three options laid out for the architect/user's call. **Resolved after this phase closed**, by the architect's [Phase 2 Open Decisions](../architecture/PHASE-2-OPEN-DECISIONS.md) memo: do not bulk-populate, keep the field as a retirement candidate, its emptiness never blocks `reviewed`. See `REVIEW-PROMOTION-GATE.md` for the updated gate text.
- **"Evidence notes exist where material claims require support": 4 records flagged, all verified false positives** on manual check (mechanical/equipment-geometry claims like "hack squat is quad-biased," not contested empirical claims needing citation).

### Task D — ADR 0002: empty-field semantics

[`docs/adr/0002-empty-field-semantics.md`](../adr/0002-empty-field-semantics.md) adopts YAML `null` = "not applicable," true empty (`[]`/`""`) = "not yet established" — a type-level distinction rather than the sentinel-string approach floated (and flagged as tentative) in Phase 0, following the spec's own preference for "a schema-level solution over ad-hoc sentinel strings." No data migration needed: the audit found every currently-empty optional field is uniformly empty dataset-wide, so there's no existing per-record ambiguity to resolve retroactively — this is a forward-looking convention.

### Task E + F + G — `validate-data` tooling built

New `package.json` (first executable code in this repo — previously pure docs/YAML), `scripts/validate-data.js` (CLI, exits non-zero on failure), and shared logic in `scripts/lib/` (`taxonomy.js` for controlled vocabularies, `load-records.js`, `validate.js`). Checks: schema (required/optional fields, types, enums, unexpected fields, ID format/uniqueness), taxonomy (`body_regions`, `coverage_categories`, `movement_patterns[0]` against controlled vocabularies derived from actual dataset usage), relationships (`overlaps_with` resolvability, same-file-vs-cross-file convention, self-reference detection), and the automatable subset of the Review Promotion Gate.

**Verified the validator actually catches problems**, not just that it passes on already-clean data: ran it against a deliberately corrupted copy of `calves.yaml` (duplicate ID, invalid enum, invalid movement pattern, unexpected field, broken relationship reference) and confirmed all 5 injected errors were caught with exit code 1, before restoring the clean file.

`npm run validate-data` currently passes clean: **0 issues across 123 records.**

### Task H + K — `data-report` tooling and `KNOWLEDGE-QA.md`

`scripts/data-report.js` (`npm run data-report`) regenerates [`docs/dev/KNOWLEDGE-QA.md`](KNOWLEDGE-QA.md) from repository state — totals, validation summary, cross-module exercises, per-field content-completeness counts (the honest backlog per ADR 0002), evidence/mirror-effect coverage, and the known logged exceptions. Kept conceptually separate from `validate-data` per the spec ("is it valid?" vs. "what does it look like?").

### Task I — Coverage-category restructure evaluated, not implemented

[`docs/dev/reports/COVERAGE-CATEGORY-EVALUATION.md`](reports/COVERAGE-CATEGORY-EVALUATION.md): checked the proposed 5-dimension restructure against the live schema. Four of five proposed dimensions (`ROLE`, `EXECUTION`, `RESOURCE COST`, most of `STIMULUS POSITION`) already duplicate an existing, often more expressive field or `coverage_categories` value. Implementing it would mean either double-representing the same facts (drift risk) or deleting existing 3-level enums for a coarser replacement. Per the spec's own test ("what actual decision can we not make using existing data?") — no concrete blocker found. **Decision: leave `coverage_categories` as-is.**

### Task L — CI integration

`.github/workflows/validate-data.yml` runs `npm run validate-data` on every push to `main` and every PR touching `data/exercises/`, `scripts/`, or the package files. Blocks merge on failure.

### Task J — Documentation updated

`FOUNDATION.md` now points to `SCHEMA.md` as the authoritative field reference and to the Review Promotion Gate for the full promotion checklist. `PDD.md` §9 references the new tooling and governance documents; §12 marks the "review threshold" open decision resolved in mechanism (with the `advantages` sub-item still open), and adds a new open item for the `alternatives`-vs-`complements` question surfaced by this phase's audit.

## Decisions made

- Kept `review_status: reviewed` on all 123 records rather than mass-downgrading over the `advantages` gap — consistent with the Phase 0 precedent of a logged, deliberate call rather than a silent one. Not decided unilaterally; three options laid out for the architect/user.
- Chose `null` over a sentinel string for ADR 0002, specifically because the spec's own Task D text reads as a preference against ad hoc sentinel strings — this is a case of following the spec's actual wording over the earlier (correctly flagged-as-tentative) Phase 0 proposal.
- Built the validator in Node.js/JavaScript per the spec's explicit `npm run validate-data` / `npm run data-report` command examples, rather than Python (which every prior ad hoc check this project ran used) — the spec names the Node interface twice, and deviating from an explicitly named interface without a strong reason would create exactly the kind of "why is this different from what was asked" friction the whole remediation effort exists to avoid. The data itself stays YAML; only the validator tooling is JavaScript.
- Did not implement the coverage-category restructure — a real "don't build it just because it's specified" call, backed by the dimension-by-dimension comparison in the Task I report, not a shortcut.

## Validation

`npm run validate-data`: **PASS, 0 issues, 123/123 records.** `npm run data-report`: regenerates cleanly.

## Pending decisions — resolved, see closure below

At the time this phase's task list was executed, two decisions were left open for the architect's call:

1. **`advantages` scoping** (Task C) — keep as a logged exception, schedule a content pass, or formally mark `null` dataset-wide. See `REVIEW-PROMOTION-GATE.md`.
2. **`alternatives` vs. `complements`** (Task A/B audit finding) — `alternatives` has never been used; either retire it (ADR required) or start using it distinctly. See `SCHEMA.md`'s "Open items."

Both are now resolved — see "Phase 2 closure" below.

## Phase 2 closure

**Date:** 2026-08-15
**Trigger:** Architect-supplied [Phase 2 Open Decisions](../architecture/PHASE-2-OPEN-DECISIONS.md) memo, resolving the two pending decisions above.

- **`advantages`** — do not bulk-populate; the field's information is already distributed across `why_this_exists`, `best_used_when`, `limitations`, `resistance_profile`, `stability_demand`, `skill_demand`, `mirror_effect`, `complements`, and `overlaps_with`; kept in the schema as a candidate for eventual retirement via a future schema-removal ADR; its emptiness must never block `reviewed`.
- **`alternatives`** — kept, not retired; precisely defined against `complements` and `overlaps_with` (alternative = same-role substitute, complement = materially different stimulus paired alongside, overlap = substantially similar ground already covered); populated selectively when a genuine substitution exists, not bulk-filled; revisit in a future relationship/decision-engine phase.
- **Movement patterns** — the memo also flagged a future-only consideration (distinguishing multi-pattern exercises like face pull from pattern-plus-modifier exercises like incline curl). No Phase 2 schema change; recorded in `SCHEMA.md` and `PDD.md` as a deferred future consideration.
- **Empty/null semantics** — ADR 0002's `null` = not applicable, `[]` = not yet established convention is confirmed as-is; no sentinel strings.

Docs updated to record these resolutions: `SCHEMA.md` (advantages section rewritten as decided/retirement-candidate; alternatives/complements/overlaps_with replaced with the architect's precise three-field definitions; movement_patterns future-consideration note added; "Open items" restructured into "Resolved items" + "Open items still outstanding"), `REVIEW-PROMOTION-GATE.md` (advantages section and Conclusion rewritten to reflect resolution), `PDD.md` §12 (review-threshold and alternatives items marked resolved; new open item added for movement_patterns' future structure), `scripts/lib/validate.js` (comment updated to cite the memo as the reason `advantages` emptiness is never enforced — no logic change, the validator already behaved this way).

Per the memo's explicit closure checklist: no additional Phase 2 content passes were started, no exercises were added, `advantages`/`alternatives` were not bulk-populated, and no data files were touched — this closure is documentation-only.

**Phase 2 is architecturally closed.** Per the memo: "Await the Phase 3 specification from the architect." No Phase 3 work has started.

---

## PHASE 2 COMPLETION REPORT

```
Schema:
PASS

Taxonomy:
PASS

Relationships:
PASS

Review governance:
PASS (21/22 checklist items; "Advantages are meaningful" is a
      permanent, architect-approved non-enforcement — see
      REVIEW-PROMOTION-GATE.md and PHASE-2-OPEN-DECISIONS.md)

Automated validation:
PASS (npm run validate-data — 0 issues, 123/123 records; verified
      against a deliberately corrupted test copy before trusting a
      clean run)

QA report:
PASS (npm run data-report — regenerates docs/dev/KNOWLEDGE-QA.md)

CI:
PASS (.github/workflows/validate-data.yml, runs on push to main and
      on PRs touching data/exercises, scripts, or package files)

Outstanding issues:
- advantages field: 0/123 populated, by design — see
  PHASE-2-OPEN-DECISIONS.md (retirement candidate, not a content gap)
- alternatives field: 0/123 populated — by design, use selectively
  going forward rather than bulk-filled; see
  PHASE-2-OPEN-DECISIONS.md

Architect decisions requiring review: none outstanding — both items
above and the ADR 0002 null-vs-empty convention were confirmed by
the architect's Phase 2 Open Decisions memo
(docs/architecture/PHASE-2-OPEN-DECISIONS.md). Phase 2 is
architecturally closed.

Files changed:
- data/exercises/arms.yaml, calves.yaml, hamstrings.yaml (programming_notes type fix)
- docs/knowledge-manual/SCHEMA.md (new)
- docs/knowledge-manual/FOUNDATION.md (updated)
- docs/adr/0002-empty-field-semantics.md (new)
- docs/PDD/PDD.md (updated)
- docs/dev/reports/REVIEW-PROMOTION-GATE.md (new)
- docs/dev/reports/COVERAGE-CATEGORY-EVALUATION.md (new)
- docs/dev/KNOWLEDGE-QA.md (new, generated)
- package.json, package-lock.json (new)
- .gitignore (new)
- scripts/validate-data.js, scripts/data-report.js, scripts/lib/*.js (new)
- .github/workflows/validate-data.yml (new)

Closure pass (see "Phase 2 closure" above):
- docs/architecture/PHASE-2-OPEN-DECISIONS.md (new)
- docs/knowledge-manual/SCHEMA.md (updated)
- docs/dev/reports/REVIEW-PROMOTION-GATE.md (updated)
- docs/PDD/PDD.md (updated)
- scripts/lib/validate.js (comment only)
```
