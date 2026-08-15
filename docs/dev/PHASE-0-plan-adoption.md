# Phase 0 — Remediation Plan Adoption

**Date:** 2026-08-15
**Trigger:** User supplied an architect-authored remediation plan and asked for it to be checked in and tracked phase by phase going forward.

## What changed

- Saved the supplied plan verbatim to [`docs/architecture/KNOWLEDGE-INTEGRITY-REMEDIATION.md`](../architecture/KNOWLEDGE-INTEGRITY-REMEDIATION.md).
- Created `docs/dev/` and this log.
- Ran a grounded audit of the current dataset against each of the plan's Tasks A–J (below) rather than taking the plan's problem list on faith — the numbers cited are from the actual repo state as of this phase, not estimates.

No exercise data, schema, or prose was changed in this phase. This phase is documentation and assessment only.

## Current-state audit against the plan

| Task | Status | Finding |
|---|---|---|
| A — Canonical exercise identity | **Already satisfied** | Confirmed: 123 unique YAML IDs, zero duplicates, across all 11 modules. The Romanian deadlift is the one cross-region case and already lives as a single record (`hamstrings.yaml`, `body_regions: [hips, hamstrings]`) per ADR 0001, matching the plan's prescribed pattern exactly. |
| B — Knowledge Manual ↔ YAML reconciliation | **Partially satisfied, no formal artifact** | Confirmed the exact discrepancy the plan names: 123 YAML records vs. 124 prose `###` entries. The gap is the RDL, which has one prose entry each in `HIPS.md` and `HAMSTRINGS.md` but one canonical YAML record. This is explained in ADR 0001, but no standalone reconciliation report exists yet — Task B's acceptance criteria call for one explicitly. **Gap.** |
| C — Schema enforcement | **Informally satisfied, not automated** | Every YAML edit this project has made was spot-validated with an ad hoc `yaml.safe_load` + field-count check run by hand. That's real but not repeatable — there's no committed script, so nothing stops a future edit from silently breaking the schema. **Gap**, addressed by Task H. |
| D — Review status governance | **Needs audit — flagged below as the most urgent item** | All 123 records currently read `review_status: reviewed`, set in the previous session against `FOUNDATION.md`'s review gate (complete schema, clear purpose, realistic limitations, a meaningful alternative or complement, evidence notes for material claims). The plan's Task D describes a stricter process: an audited, reproducible promotion checklist, explicit downgrade of anything that doesn't meet it, and a warning that "conversion to YAML does not equal substantive review." My pass wasn't a bare conversion — evidence notes and limitations were genuinely researched and written per record — but it was a single self-audit against one gate definition, not the reproducible, re-runnable promotion process this plan calls for. See **Pending decisions** below. |
| E — "Complete" vs. "not applicable" vs. "not yet researched" | **Not satisfied** | Every empty field (`advantages`, `technique_cues`, `common_mistakes`, `alternatives`, `programming_notes`, `mirror_effect`, etc.) is currently represented identically — an empty list or empty string — with no way to tell "genuinely not applicable to this exercise" apart from "not yet researched." **Gap**, and the plan explicitly asks for an ADR before any schema-level fix. |
| F — Movement-pattern taxonomy | **Not satisfied — confirmed present** | Checked directly: 25 of 144 `movement_patterns` values across the dataset mix a fundamental pattern with a modifier (grip, shoulder position, path), e.g. `elbow flexion in a lengthened shoulder position` (`incline-dumbbell-curl`) and `elbow flexion with the elbows drawn behind the torso` (`drag-curl`, `cable-drag-curl`) — the exact pattern the plan calls out by name. **Gap**, ~17% of values affected. |
| G — Coverage-category dimensions | **Not satisfied** | `coverage_categories` is still a flat, ungrouped list per record (e.g. `[isolation, lengthened-position-emphasis]`). The plan's ROLE / STIMULUS POSITION / EXECUTION / RESOURCE COST / FUNCTION grouping hasn't been applied. Plan explicitly marks this as a later decision, not an immediate mandate. |
| H — Automated validation | **Not satisfied** | No `package.json`, no validation script of any kind checked into the repo. Every check so far has been a manual one-off. **Gap.** |
| I — Knowledge QA report | **Not satisfied** | No generated or reproducible report exists. **Gap**, blocked on H. |
| J — No exercise-count expansion during remediation | **Currently satisfied** | No new exercises have been added since the full 123-record set was reached; recent work (evidence notes, limitations, review-status) was entirely additive detail on existing records, not new records. Worth actively guarding going forward, since the in-progress `mirror_effect` pass (see below) is more content, not more exercises, and stays inside this rule. |

## Decisions made

- **Adopt the plan as-is.** No changes proposed to its scope or sequencing in this phase.
- **Treat this as a real audit, not a rubber stamp.** Rather than logging "plan received," each task above was checked against the actual repo state so this log starts from facts, not assumptions.
- **Pause the in-progress `mirror_effect` pass.** That work (populating the empty `mirror_effect` field with plain-language "what you'd see in the mirror" descriptions) was underway when the remediation plan arrived. It's compatible with Task J (no new exercises) but the plan's required sequence puts schema/taxonomy/review-status work *before* adding more substantive content to existing records, so it's paused pending the user's call on sequencing (see below).

## Pending decisions (need your call)

1. **Review-status rollback.** Given Task D's stricter standard, should the 123 `reviewed` records be downgraded back to `needs-review` until a reproducible promotion checklist exists and each record is re-audited against it? Or is the existing self-audit (evidence notes + limitations genuinely researched, checked against `FOUNDATION.md`'s gate) good enough to leave `reviewed` in place while the checklist is built in parallel? This is the one item where "leave it as-is" and "the plan's literal instructions" disagree, so it shouldn't be decided unilaterally.
2. **Sequencing vs. the paused `mirror_effect` work.** The plan's required order puts A → B → C → D → reconciliation before new content work. Do you want that order followed strictly (finish the remediation tasks first, resume `mirror_effect` after), or is `mirror_effect` low-risk enough (no new exercises, no schema change) to interleave alongside remediation?
3. **Where to start.** The plan's sequence starts at Task A, which is already satisfied — so the real starting point is Task B (write the reconciliation report) or Task F (movement-taxonomy normalization, since it's now confirmed and quantified). Which should Phase 1 tackle, or should it cover both since they don't conflict?
4. **Task E's schema convention.** The plan asks for one consistent convention distinguishing "not applicable" from "not yet researched," proposed through an ADR before implementation. No proposal has been drafted yet — flagging that this ADR is a prerequisite for a clean Task E fix, not something to improvise field-by-field.
