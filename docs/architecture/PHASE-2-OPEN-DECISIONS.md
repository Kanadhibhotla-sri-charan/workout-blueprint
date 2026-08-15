# PHYSIQUE BLUEPRINT — PHASE 2 OPEN DECISIONS

Architect Direction to Engineering

**Status:** Approved
**Purpose:** Resolve the remaining open decisions from Phase 2. Do not start Phase 3 implementation from this file.

## 1. ADVANTAGES FIELD — DECISION

**Decision:**
Do NOT populate the `advantages` field across all 123 exercises merely to satisfy the review gate.

**Rationale:**
The current knowledge model already captures most of the useful information that an "advantages" field would duplicate, including:
- why_this_exists
- best_used_when
- limitations
- resistance_profile
- stability_demand
- skill_demand
- mirror_effect
- complements
- overlaps_with

The goal is decision support, not maximum field population.

**Required action:**
- Keep the field temporarily so the schema change is controlled.
- Mark `advantages` as a candidate for eventual retirement.
- Remove it only through a proper schema-removal ADR when we confirm nothing depends on it.
- Its emptiness must NOT block `reviewed` status.
- Do NOT create 123 artificial advantage descriptions.

## 2. ALTERNATIVES FIELD — DECISION

**Decision:**
KEEP the `alternatives` field, but do NOT bulk-populate it during Phase 2.

**Definitions:**
- `alternative` = another exercise that can fill approximately the same programming role if the user cannot or does not want to use the current exercise.
- `complement` = an exercise that adds a materially different stimulus or coverage alongside the current exercise.
- `overlaps_with` = another exercise that already covers substantially similar ground.

**Example:**
Incline Dumbbell Press
- Alternative: Incline Smith Press
- Complement: Cable Fly
- Overlap: another incline press with substantially similar role

**Required action:**
- Keep `alternatives` in the schema.
- Do not populate all 123 records just to make the field non-empty.
- Use alternatives selectively when a genuine substitution relationship exists.
- Revisit the field during a future relationship/decision-engine phase.
- If later analysis proves it redundant, retire it through an ADR rather than deleting it informally.

## 3. MULTIPLE MOVEMENT PATTERNS — FUTURE ONLY

Do NOT change the movement-pattern schema during Phase 2.

**Future consideration:**
Some exercises contain multiple genuine movement patterns, while others contain one movement plus a modifier.

**Example distinction:**
- Face Pull → multiple genuine movements.
- Elbow Flexion + Lengthened Shoulder Position → movement + modifier.

This may eventually justify a richer structure such as:
- primary movement
- secondary movement(s)
- modifiers

However, this is NOT a Phase 2 change.

**Required action:**
- Record this as a future architecture consideration.
- Do not modify existing records solely for this reason.
- Revisit only when application/decision-engine requirements demonstrate a concrete need.

## 4. EMPTY / NULL SEMANTICS

Keep the Phase 2 decision:

- `null` = not applicable
- `[]` = not yet established / currently has no established entries, where the field is an array and this interpretation is documented

Do not introduce arbitrary sentinel strings such as:
- N/A
- Unknown
- Not researched

If a future schema change is required to represent these states more explicitly, create an ADR first.

## 5. PHASE 2 CLOSURE

After recording these decisions:
- Update the Phase 2 development log.
- Update relevant PDD/ADR documentation only where necessary.
- Do not start additional Phase 2 content passes.
- Do not add exercises.
- Do not bulk-populate `advantages` or `alternatives`.
- Mark Phase 2 as architecturally closed.

**NEXT:**
Await the Phase 3 specification from the architect.
