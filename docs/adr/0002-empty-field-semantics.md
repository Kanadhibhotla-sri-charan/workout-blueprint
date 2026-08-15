# ADR 0002: Empty-field semantics — "not applicable" vs. "not yet established"

**Status:** Accepted
**Date:** 2026-08-15
**Resolves:** [Phase 2 architecture spec](../architecture/PHASE-2-SCHEMA-AND-DATA-GOVERNANCE.md), Task D — "Resolve `empty` vs `not applicable` semantics." Also closes the pending decision carried since [Phase 0](../dev/PHASE-0-plan-adoption.md#decisions-resolved-2026-08-15-same-day) and flagged again in [Phase 1](../dev/PHASE-1-reconciliation-and-taxonomy.md).

## Context

Several canonical-record fields are optional and currently empty on some or all records: `advantages`, `technique_cues`, `common_mistakes`, `programming_notes`, `alternatives`, `less_suitable_when` (occasionally), `secondary_targets` (occasionally), and, for scalar strings, none currently — but the same question applies to any future optional scalar. An empty list (`[]`) or empty string (`""`) is used identically today whether the underlying reason is:

1. **Not applicable** — this specific exercise genuinely has nothing meaningful to say for this field (e.g. a bodyweight isometric hold with no realistic "common mistake" beyond the obvious), or
2. **Not yet established** — nobody has researched or written this field yet, and it may well have real content once someone does.

These two states currently look identical in the data. That's a real governance gap: a `reviewed` record with `[]` in a field can't be distinguished from "deliberately empty" vs. "never gotten to," which matters for anyone deciding what to work on next, and matters even more for the architect auditing whether `reviewed` status is trustworthy.

An audit of the live dataset (123 records) for this ADR found:

- `advantages`, `technique_cues`, `common_mistakes`, `alternatives` are **empty on all 123 records, with no exceptions** — this is uniform, dataset-wide non-population, not a per-record N/A judgment call. There is no case today where distinguishing "N/A for this one" from "N/A for all of them" would change anything, because right now it's genuinely all of them.
- `programming_notes` is non-empty on 4 records and empty on the other 119 — this is the one field where the ambiguity is real today: is it empty because a programming note genuinely doesn't apply to those 119, or because nobody's added one? Almost certainly the latter, on inspection, but the data doesn't say so.
- `less_suitable_when` and `secondary_targets` are non-empty on the large majority of records, empty on a handful — same ambiguity, smaller scale.

The plan's own Task D text cautions: *"Before introducing sentinel strings such as `N/A`, `Unknown`, or `Not researched`, evaluate whether the schema should represent the distinction. If a schema change is necessary, create an ADR first."* This reads as a preference for a type-level distinction over an invented string convention, and this ADR follows that preference rather than the sentinel-string approach floated (and appropriately flagged as tentative) during Phase 0.

## Decision

Use YAML's native `null` to mean **"not applicable,"** and reserve true emptiness (`[]` for list fields, `""` for scalar string fields) to mean **"not yet established."**

```yaml
# Not applicable — deliberately, after consideration, this field doesn't apply here.
technique_cues: null

# Not yet established — nobody has written this yet; it may get real content later.
technique_cues: []
```

This is a type-level distinction, not a string convention living inside the data: `null` is a different YAML/JSON type from an empty list or empty string, so it can't be produced by accident the way typing `"N/A"` into the wrong field could, and a validator can check for it structurally rather than string-matching against a magic value.

**Fields this applies to:** every field documented in [`SCHEMA.md`](../knowledge-manual/SCHEMA.md) as `Required: no` or `Required: conditional`. Fields marked `Required: yes` should never be `null` — an unpopulated required field is a validation failure, not a "not applicable" case, since by definition every record needs it.

**No retroactive data migration.** Because the audit above found the current empty fields are uniformly empty (not a mix of "some records marked N/A, some left blank"), there is nothing to convert today — every currently-empty optional field keeps meaning "not yet established" under this ADR without any record needing to change. This decision is forward-looking: the next time someone populates `advantages` or `technique_cues` for even one record, the convention is now in place to say "genuinely N/A" vs. "not gotten to yet" for the rest, rather than repeating the all-or-nothing pattern that produced today's ambiguity.

**`validate-data` enforcement:** the schema validator (Task E) treats `null` and empty (`[]`/`""`) as both valid for optional fields, and does not require a record to distinguish them retroactively — but does reject `null` on any field marked `Required: yes` in `SCHEMA.md`.

## Consequences

- No YAML files change as a direct result of this ADR.
- `SCHEMA.md` documents this convention per-field (see its "Open items" section for the specific fields currently in the uniformly-empty state).
- Future content passes on `advantages`, `technique_cues`, `common_mistakes`, or `alternatives` should use `null` for records where the field genuinely doesn't apply, rather than leaving `[]` and letting the ambiguity persist.
- If a future need arises for a *reason* attached to a `null` (e.g. "why doesn't this apply"), that's a new, separate schema question — not something this ADR tries to solve preemptively.
