# Physique Blueprint — Product Design Document

**Version:** 1.0.0  
**Status:** Draft — living specification  
**Last updated:** 2026-08-04

## 1. Product Definition

Physique Blueprint is an exercise decision-support system. It helps people answer:

> What exercise should I choose, and why?

It is not primarily a workout logger, calorie tracker, social platform, or generic exercise catalogue. A standard library answers how to perform a movement. Blueprint also explains why it exists, when it fits, what it complements, and how it differs from nearby alternatives.

The product’s durable asset is a structured, evidence-informed knowledge base. The interface is a way to explore that knowledge.

## 2. Product Principles

1. **Decision support over collection.** Every entry must help a user make a better choice.
2. **Context beats “best.”** Equipment, goals, tolerance, skill, time, fatigue, and the current routine determine exercise value.
3. **Plain language first.** State practical or mirror-visible outcomes before technical detail.
4. **Every variation earns its place.** A distinct variation must change a meaningful decision.
5. **Progressive disclosure.** Simple guidance first; deeper biomechanics, programming, and evidence on demand.
6. **No false precision.** Scores are decision aids, not medical diagnoses or guarantees.
7. **Knowledge before intelligence.** Automated recommendations may rely only on reviewed, structured data.

## 3. Users and Jobs

### Primary users

- Gym-goers who know some exercises but cannot distinguish useful variations.
- Lifters pursuing a visible or functional goal.
- Time-constrained trainees choosing a few high-value movements.
- Intermediate users who want better decisions without becoming anatomy specialists.

### Core jobs

| Need | Blueprint outcome |
|---|---|
| “I want to improve an area.” | Explain relevant exercise roles in clear language. |
| “Which version should I choose?” | Compare by context, rather than naming one universal winner. |
| “Is my routine redundant?” | Highlight likely overlap and missing roles. |
| “What fits my equipment?” | Show viable substitutions and their trade-offs. |
| “Why is this programmed?” | State the unique purpose in one sentence. |

## 4. Scope

### V1 includes

- Muscle, movement, exercise, and variation taxonomy.
- Standardized exercise records.
- Browse, search, equipment, and context filters.
- Alternatives, complements, and overlap relationships.
- Coverage categories that help reveal missing exercise roles.
- A mobile-first reference experience.

### V1 excludes

- Workout logging as the central product.
- Nutrition, calorie, or step tracking.
- Social feeds.
- Medical diagnosis, injury treatment, or rehabilitation prescriptions.
- Claims that a movement guarantees a local physique outcome.

## 5. Knowledge Architecture

~~~text
Body region
  → Muscle / functional group
    → Movement pattern
      → Exercise
        → Variation
~~~

Example:

~~~text
Upper body
  → Chest
    → Incline press
      → Dumbbell incline press
        → Neutral-grip dumbbell incline press
~~~

The hierarchy supports navigation. Structured relationships support the decision engine.

### Coverage categories

Coverage categories describe an exercise’s role; they do not make it mandatory or superior.

- Heavy compound
- Stable compound
- Isolation
- Lengthened-position emphasis
- Shortened-position emphasis
- Unilateral or bilateral
- Low setup
- Low fatigue
- Equipment-limited substitute
- Skill / coordination

### Separate-variation rule

Create a separate variation only when it materially changes at least one of:

- movement path, loading, stability, or resistance profile;
- equipment, setup, accessibility, or skill requirement;
- practical tolerance or progression path;
- programming role and the answer to “when would I choose this?”

Do not create entries for cosmetic or trivial differences.

## 6. Exercise Record Standard

Every exercise record must follow the same structure.

~~~yaml
id: stable-slug
name: user-facing name
summary: one-sentence purpose
why_this_exists: unique decision value
body_regions: []
primary_targets: []
secondary_targets: []
movement_patterns: []
equipment: []
exercise_type: compound | isolation
laterality: bilateral | unilateral | alternating
coverage_categories: []
resistance_profile: plain-language description
stability_demand: low | medium | high
skill_demand: low | medium | high
setup_time: low | medium | high
fatigue_cost: low | medium | high
best_used_when: []
less_suitable_when: []
mirror_effect: practical, non-guaranteed outcome framing
advantages: []
limitations: []
technique_cues: []
common_mistakes: []
programming_notes: []
alternatives: []
complements: []
overlaps_with: []
evidence_notes: []
review_status: draft | reviewed | needs-review
~~~

### Writing standard

- Start with the user’s decision, not jargon.
- Explain an advantage and its limitation.
- Avoid absolute “best,” “guaranteed,” or “isolates perfectly” claims.
- Use “may be useful when…” where individual response varies.
- Treat pain as a stop-and-assess signal, not an input for self-treatment.

## 7. Decision Engine

Blueprint’s recommendations must be transparent. It reasons from reviewed exercise records rather than opaque rankings.

### Inputs

- Goal or question
- Relevant body region or function
- Current selected exercises
- Equipment availability
- Experience, tolerance, and setup preferences
- Available time

### Outputs

- Recommended exercise roles before exact exercises
- Matching options with a clear “why this fits”
- Equipment alternatives
- Potential overlap and potential gaps
- Clear uncertainty where information is incomplete

### Flow

~~~text
Identify goal or question
  → identify relevant region and movement roles
  → inspect current selections for gaps and overlap
  → apply equipment, time, skill, and tolerance constraints
  → rank eligible options by fit
  → explain recommendation and trade-offs
~~~

The engine is educational guidance, not medical advice.

## 8. User Experience

- Mobile-first; reach a region or exercise within three interactions where practical.
- Collapse muscle groups to prevent long-page overload.
- Show an exercise’s one-sentence purpose and “why this exists” before detail.
- Support global search for muscle names, movement terms, equipment, and practical questions.
- Use colour as a navigational cue, never as a quality rating.
- Keep anatomy visuals optional and accompany them with text.

Exercise card order:

1. Name and purpose
2. Why this exists
3. Best-used-when
4. Practical or mirror-visible effect
5. Setup, fatigue, and stimulus context
6. Alternatives, complements, and overlap
7. Technique, programming, and evidence detail

## 9. Quality and Governance

- Structured records are the source of truth; interfaces render from them.
- Each record is **Draft**, **Reviewed**, or **Needs review**.
- Prefer systematic reviews, consensus guidance, and primary research for factual claims.
- Attach evidence notes to specific claims rather than using generic citations.
- Record uncertainty and disagreement honestly.
- Material architecture or schema decisions require an ADR.
- Release changes use semantic versioning: patch for clarification, minor for compatible expansion, major for breaking philosophy or schema changes.

## 10. Roadmap

### V1 — Knowledge Foundation

- Complete taxonomy, schema, writing, and evidence standards.
- Convert existing exercise reference content into normalized records.
- Build browse, search, filtering, and comparison.
- Add starter coverage categories and relationships.

### V2 — Knowledge Expansion

- Add supporting regions such as the core, hip complex, rotator cuff, forearms, neck, and lower leg where appropriate.
- Add meaningful variations under the separate-variation rule.
- Expand substitutions, comparison, and reviewed evidence notes.

### V3 — Decision Support

- Routine coverage audit.
- Overlap and gap explanations.
- Goal-, equipment-, time-, and fatigue-aware selection.

### V4 — Guided Planning

- Explainable guided selection.
- Preference and notes storage.
- Strict health and injury safety boundaries.

## 11. Success Criteria

Blueprint succeeds when a user can:

1. Explain why they chose an exercise in under one minute.
2. Identify the meaningful difference between close variations.
3. Find an appropriate option given their equipment and constraints.
4. See a likely routine gap or redundant cluster.
5. Read the relevant limitation before blindly following a recommendation.

Quality is measured by better decisions, not exercise count.

## 12. Open Decisions

- ~~YAML, JSON, or TypeScript as the canonical exercise-record format.~~ Resolved: YAML. See [ADR 0001](../adr/0001-canonical-record-format.md).
- The review threshold before a record can power a recommendation.
- Relationship-strength representation without fake numerical precision.
- Required evidence fields for introductory versus advanced content.
- Minimum reviewed starter set for the first public release.

---

*This document is a living specification. Amendments must preserve the reason for the change.*
