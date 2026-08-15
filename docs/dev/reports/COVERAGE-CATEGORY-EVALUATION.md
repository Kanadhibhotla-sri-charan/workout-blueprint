# Coverage-Category Structure Evaluation

**Produced for:** Phase 2, Task I ([`docs/architecture/PHASE-2-SCHEMA-AND-DATA-GOVERNANCE.md`](../../architecture/PHASE-2-SCHEMA-AND-DATA-GOVERNANCE.md)) — "Keep the current `coverage_categories` system unless implementation demonstrates a concrete problem... First answer: what actual decision can we not make using the existing data?"

## The proposed restructure

The spec offers a possible future dimensional grouping:

```text
ROLE               compound / isolation
STIMULUS POSITION  lengthened / mid-range / shortened
EXECUTION          bilateral / unilateral / alternating
RESOURCE COST      low setup / low fatigue / high fatigue
FUNCTION           hypertrophy / strength / stability / skill-coordination / equipment substitution
```

## What actually happens when each dimension is checked against the live schema

| Proposed dimension | Already answerable with existing data? |
|---|---|
| **ROLE** (compound/isolation) | **Yes — already a dedicated field.** `exercise_type` is exactly this, on every record. Re-adding it inside `coverage_categories` would be a second representation of the same fact. |
| **EXECUTION** (bilateral/unilateral/alternating) | **Yes — already a dedicated field.** `laterality` is exactly this, on every record. Same duplication problem. |
| **RESOURCE COST** (low setup/low fatigue/high fatigue) | **Yes — already two dedicated fields, and more expressive ones.** `setup_time` and `fatigue_cost` are each a real `low`/`medium`/`high` enum already. The proposed dimension collapses that into a coarser, binary-leaning grouping — implementing it would be a net *loss* of precision, not a gain. |
| **STIMULUS POSITION** (lengthened/mid-range/shortened) | **Mostly yes.** `lengthened-position-emphasis` and `shortened-position-emphasis` already exist as `coverage_categories` values (19 and 3 records respectively). "Mid-range" isn't a positive tag today — a record with neither tag is implicitly mid-range/mixed. That's answerable today via "has neither tag," just not with a single positive filter value. |
| **FUNCTION** (hypertrophy/strength/stability/skill-coordination/equipment substitution) | **Partially.** `skill-coordination` and `equipment-limited-substitute` already exist as `coverage_categories` values. An explicit `hypertrophy` vs. `strength` split doesn't exist as a dedicated tag — this is the one genuinely new piece of information the proposed structure would add. |

## Conclusion: no restructure, per the spec's own test

Four of five proposed dimensions either duplicate a field that already exists (`exercise_type`, `laterality`, `setup_time`, `fatigue_cost` — each already more expressive than the proposed replacement) or duplicate a `coverage_categories` value that already exists (`lengthened-position-emphasis`, `shortened-position-emphasis`, `skill-coordination`, `equipment-limited-substitute`). Implementing the restructure as specified would mean either running two representations of the same facts side by side (an invitation for exactly the kind of drift Phase 1 spent its whole effort cleaning up) or deleting the existing dedicated fields in favor of a coarser flat-tag version — a real schema regression, not an improvement, and one with no concrete decision behind it.

The only genuinely new dimension — an explicit hypertrophy-vs-strength `FUNCTION` tag — has no demonstrated blocker behind it either: no application or decision-engine work exists yet that has actually hit a wall because this tag is missing. Per the spec's own instruction ("if there is no concrete limitation, leave the current schema alone"), that's not a justification to add it now.

**Decision: leave `coverage_categories` as the current flat, 10-value controlled list.** If a future phase's application work hits a real, specific case where it needs an explicit hypertrophy/strength function tag and the existing fields genuinely can't answer the question, that's the moment to open an ADR for it — not now, speculatively.
