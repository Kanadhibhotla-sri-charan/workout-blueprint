# Physique Blueprint — Phase 4 Corrections
## Latest Build — Architect Correction Instructions

**Status:** Approved for implementation  
**Purpose:** Apply the two architectural corrections identified in the latest build review, then proceed with the already-audited aesthetic taxonomy expansion.

---

# 1. Executive Decision

The current Phase 4 implementation is fundamentally correct.

**Do NOT restart Phase 4.**

The following are already considered successful and should be preserved:

- First-class `aesthetic-outcomes.yaml`
- Aesthetic Outcome data model and validation
- Existing Phase 3 deterministic exercise-selection engine
- Technical explanation / progressive disclosure
- Hypertrophy programming layer
- Rep / RIR / volume / frequency / progression guidance
- Intensity-technique framework
- Full-body aesthetic taxonomy audit
- Chest-side-projection golden slice
- Triceps-back-of-arm-depth golden slice
- No AI/ML dependency
- Existing Phase 2 and Phase 3 functionality

Two architectural corrections are required before completing the full taxonomy expansion:

1. **Make Aesthetic Outcome the genuine primary physique-goal entry point.**
2. **Remove the permanent first-target-only assumption from aesthetic-to-physique-target mapping.**

After those corrections, proceed with the already-completed full-body taxonomy audit and implementation.

---

# 2. Correction #1 — Aesthetic Outcome Must Be the Primary Entry Point

## Current Problem

The latest implementation still treats the aesthetic flow as an optional shortcut while the direct muscle/physique-target workflow remains the dominant decision path.

The intended Phase 4 architecture is:

```text
What do you want to improve?
        ↓
👀 Appearance
        ↓
What do you want it to look like?
        ↓
Aesthetic Outcome
        ↓
Physique Target
        ↓
Anatomy
        ↓
Stimulus
        ↓
Exercise
        ↓
Programming
```

The aesthetic layer is not merely an alternative way to reach the existing target selector.

It is the **problem-definition layer for physique goals**.

---

# 3. Required UX Change

The primary Decision Maker entry should become:

```text
What do you want to improve?

👀 Appearance
🦴 Function
```

For `Appearance`, the next level should be body/physique region:

```text
Chest
Shoulders
Back
Arms
Core
Glutes
Quads
Hamstrings
Calves
Forearms
Neck
...
```

Then the user selects the visual characteristic:

```text
How do you want it to look?
```

Examples:

```text
Chest
  → Looks flat from the side
  → Doesn't look wide enough from the front
  → Upper chest doesn't stand out
  → Chest/shoulder separation isn't clear
  → Chest/abdominal boundary isn't clear
```

The exact options must come from the canonical approved aesthetic taxonomy.

---

# 4. Preserve Direct Target Selection

Do NOT remove the existing direct muscle/physique-target selection.

It remains useful for experienced users who already know exactly what they want to train.

However, it should become an **advanced/direct path**, rather than the default physique-problem workflow.

Conceptually:

```text
                    DECISION MAKER
                          │
             ┌────────────┴────────────┐
             ↓                         ↓
       👀 APPEARANCE              🦴 FUNCTION
             │
             ↓
       Aesthetic Outcome
             │
             ↓
       Physique Target
             │
             ↓
       Technical Engine


Advanced / Direct Path
             │
             ↓
       Physique Target
             │
             ↓
       Technical Engine
```

The existing engine should be reused.

Do not create a second recommendation engine.

---

# 5. Acceptance Criteria — UX

The correction is complete when:

- [ ] Appearance is a first-class primary entry point.
- [ ] A user can reach a recommendation without knowing a muscle's anatomical name.
- [ ] The first physique-oriented problem presented to the user is an aesthetic/visual problem.
- [ ] Direct physique-target selection remains available for experienced users.
- [ ] Appearance and Function remain clearly separated.
- [ ] The aesthetic flow does not require AI.
- [ ] Existing Phase 3 functionality remains available.
- [ ] Technical explanations remain accessible after an aesthetic selection.

---

# 6. Correction #2 — Remove Permanent First-Target-Only Mapping

## Current Problem

The current implementation uses the first physique target associated with an aesthetic outcome as the exercise-selection driver.

Conceptually:

```text
Aesthetic Outcome
      ↓
[primary target, secondary target]
      ↓
use array[0]
```

This is acceptable as a temporary implementation for a narrow golden test.

It is NOT acceptable as the permanent semantic model.

An aesthetic outcome can legitimately depend on multiple underlying physique targets.

For example:

```text
Aesthetic:
Chest looks flat from the side

Potential underlying targets:
- Upper pec
- Lower/mid chest
- Overall chest development
```

The system must preserve this relationship rather than silently discarding all but the first target.

---

# 7. Required Multi-Target Model

Implement an explicit deterministic representation of target importance.

Preferred conceptual model:

```yaml
aesthetic_outcome:
  id: chest-side-projection
  display_name: "Chest looks deeper from the side"

  primary_targets:
    - upper-pec

  supporting_targets:
    - mid-chest
    - lower-pec
```

The exact schema may differ if the repository has a cleaner equivalent.

The architectural requirement is what matters:

> The knowledge model must distinguish the primary physique target from supporting targets where multiple targets contribute to the aesthetic outcome.

Do not hard-code `physique_targets[0]` as the permanent meaning.

---

# 8. Multi-Target Engine Behavior

The engine does NOT need a complex scoring model.

Keep it deterministic and explainable.

At minimum:

```text
Aesthetic Outcome
        ↓
Primary target
        +
Supporting targets
        ↓
Candidate exercise pool
        ↓
Existing overlap / complement / fatigue logic
        ↓
Recommendation
```

The primary target should drive the main recommendation.

Supporting targets should be available to:

- broaden the candidate pool where appropriate;
- identify complementary exercises;
- explain the aesthetic outcome;
- prevent a recommendation from ignoring an important contributor.

Do not automatically give equal weight to all targets.

---

# 9. Example — Chest

User:

> "My chest looks flat from the side."

Blueprint should understand:

```text
Aesthetic outcome:
Chest side-view projection / depth
```

Then:

```text
Primary:
Relevant chest development / primary chest region

Supporting:
Other relevant chest-region development
```

Then the exercise engine determines the best fit based on:

- existing exercises;
- overlap;
- stimulus;
- equipment;
- fatigue;
- target priority.

The final answer should explain why the chosen exercise addresses the visual problem.

---

# 10. Example — Arm Thickness

User:

> "My arms look thin from the side."

The aesthetic outcome may involve multiple targets:

```text
Primary:
Overall upper-arm development

Supporting:
Biceps
Brachialis
Triceps
```

The engine should not pretend that only the first listed muscle is responsible for the visual outcome.

---

# 11. Example — Back Appearance

User:

> "My back looks wide but not thick."

This should map to a distinct aesthetic outcome:

```text
Aesthetic:
Back lacks thickness from the rear / side
```

Then:

```text
Primary:
Back-thickness development

Supporting:
Relevant upper/mid-back development
```

The recommendation should differ from the:

> "My back doesn't look wider than my waist."

aesthetic outcome.

This demonstrates why aesthetic outcomes must exist independently from muscle names.

---

# 12. Do Not Overengineer Multi-Target Mapping

Do NOT implement:

- machine-learning scoring;
- neural networks;
- probabilistic target inference;
- opaque weights;
- AI-generated exercise selection;
- complicated optimization algorithms.

A simple deterministic model is sufficient.

The system should remain inspectable:

```text
Aesthetic Outcome
→ Primary Target
→ Supporting Targets
→ Exercise Rules
→ Recommendation
```

---

# 13. Full-Body Aesthetic Taxonomy Expansion

The complete taxonomy audit has already been performed against the existing exercise knowledge base.

Proceed with implementation of the approved/audited taxonomy.

Expected body areas include:

```text
Chest
Shoulders
Back
Arms
Core
Glutes
Quads
Hamstrings
Calves
Forearms
Neck
```

Use the actual audited taxonomy from the development work rather than inventing a new list from this document.

---

# 14. Preserve Taxonomy Discipline

Do not add aesthetic outcomes simply to increase the number of options.

Every aesthetic outcome must satisfy:

1. A normal user can recognize it as a meaningful visual characteristic.
2. It describes an actual physique appearance/problem.
3. The existing knowledge base supports a meaningful technical interpretation.
4. There are actionable exercise/programming implications.
5. It is not merely a synonym for an anatomical muscle.
6. It does not introduce fake anatomical precision.

Avoid unsupported concepts such as:

```text
Inner chest
Outer chest
Upper-inner chest
Lower-outer chest
Inner biceps
Outer biceps
```

unless future evidence demonstrates that they are useful independent training targets.

---

# 15. Lower Abs

Continue to exclude `lower-abs` as a canonical Phase 4 v1 target.

Do not create it merely because some exercises involve hip flexion or appear to emphasize the lower portion of the rectus abdominis.

Use supported abdominal/rectus-abdominis concepts instead.

---

# 16. Technical Layer Must Remain

Do NOT interpret the aesthetic-first architecture as a reason to remove technical information.

The intended experience is:

```text
👀 What you're trying to change
        ↓
🧩 What contributes to it
        ↓
🧬 Anatomy
        ↓
⚙️ Why these exercises
        ↓
📊 How to train it
```

The user should be able to understand:

> "My triceps lack depth from behind."

and then optionally expand:

> Which triceps structures contribute?

> Why does shoulder position matter?

> Why is this exercise being recommended?

> How does it differ from what I am already doing?

The app should therefore function as both:

- a decision-maker;
- a learning system.

---

# 17. Programming Layer Remains Approved

Do not redesign the existing Phase 4 programming architecture.

Continue providing:

```text
Sets
Reps
RIR
Weekly volume
Frequency
Progression
Optional intensity technique
```

Use practical ranges rather than false precision.

Examples:

```text
~1–3 RIR
~2–3 exposures/week
~10–20 hard sets/week
```

Do not present these as universal optimal constants.

---

# 18. Preserve Existing Phase 3 Engine

The following behavior must remain intact:

- best fit;
- alternatives;
- watch-outs;
- complements;
- equipment constraints;
- fatigue constraints;
- overlap avoidance;
- current-exercise context.

Phase 4 should enrich the input to the engine.

It should NOT replace the engine with a new architecture.

---

# 19. Validation Requirements

After implementing the two corrections, rerun the existing test suite.

Minimum validation:

### Existing tests

- [ ] All Phase 2 tests pass.
- [ ] All Phase 3 tests pass.
- [ ] Existing Phase 4 tests pass.

### New aesthetic-entry tests

- [ ] Appearance is the primary physique entry.
- [ ] Function remains separate.
- [ ] Direct target path still works.

### New multi-target tests

At least test:

```text
Aesthetic outcome
→ one primary target
```

and:

```text
Aesthetic outcome
→ primary + supporting targets
```

Verify that supporting targets are not silently discarded.

### Golden slices

Re-run:

1. Chest side-projection.
2. Triceps back-of-arm depth.

Then add at least one multi-target golden case.

Suggested:

```text
"My arms look thin from the side."
```

This should demonstrate that the engine can handle an aesthetic outcome involving multiple contributing targets.

---

# 20. Do Not Expand Scope

Do NOT use these corrections as a reason to introduce:

- AI coaching;
- natural-language AI interpretation;
- body-photo analysis;
- computer vision;
- machine learning;
- advanced periodization;
- recovery prediction;
- nutrition;
- injury diagnosis;
- a new backend;
- a new recommendation engine.

The objective is to finish the current Blueprint architecture and make it usable.

---

# 21. Implementation Order

Execute in this order:

```text
1. Correct primary Appearance UX
        ↓
2. Preserve direct/advanced target path
        ↓
3. Implement explicit primary/supporting target semantics
        ↓
4. Update deterministic engine to consume multi-target mappings
        ↓
5. Run regression tests
        ↓
6. Implement the already-audited full-body aesthetic taxonomy
        ↓
7. Run taxonomy validation
        ↓
8. Re-run chest golden slice
        ↓
9. Re-run triceps golden slice
        ↓
10. Add multi-target arm-thickness golden slice
        ↓
11. Mobile/usability pass
        ↓
12. Final Phase 4 validation
```

Do not redo the knowledge audit unless implementation reveals a specific inconsistency in the existing audit.

---

# 22. Definition of Done

Phase 4 correction work is complete when:

- [ ] Aesthetic Outcome is the primary physique-goal entry point.
- [ ] Appearance and Function are clearly separated.
- [ ] Direct physique-target selection remains available as an advanced/direct route.
- [ ] Aesthetic outcomes are canonical entities.
- [ ] Aesthetic outcomes can map to multiple physique targets.
- [ ] Primary and supporting target semantics are explicit.
- [ ] The engine no longer relies permanently on `array[0]`.
- [ ] Supporting targets are not silently discarded.
- [ ] The existing deterministic engine remains intact.
- [ ] The audited full-body aesthetic taxonomy is implemented.
- [ ] Chest, shoulders, back, arms, core, glutes, quads, hamstrings, calves, forearms and neck are covered where supported by the audit.
- [ ] Unsupported/fake aesthetic precision is excluded.
- [ ] Lower Abs remains excluded as a canonical target.
- [ ] Technical explanations remain available.
- [ ] Programming remains available.
- [ ] Phase 2 regression tests pass.
- [ ] Phase 3 regression tests pass.
- [ ] Phase 4 tests pass.
- [ ] Chest golden slice passes.
- [ ] Triceps golden slice passes.
- [ ] At least one multi-target aesthetic golden slice passes.
- [ ] Mobile UX remains usable.
- [ ] No AI/ML dependency has been introduced.

---

# 23. Final Architect Instruction

The current Phase 4 implementation is **not being rejected**.

The architecture is sound and the knowledge-base work is strong.

Make the two corrections:

> **1. Aesthetic Outcome must become the real starting point for physique problems.**

> **2. An aesthetic outcome must be able to represent multiple underlying physique targets without permanently reducing the relationship to the first array element.**

Then proceed with the already-audited full-body taxonomy.

Do not restart the project.

Do not rewrite the existing decision engine.

Do not introduce AI.

Do not add unnecessary complexity.

The intended final chain is:

```text
WHAT DO I SEE?
      ↓
👀 AESTHETIC OUTCOME
      ↓
WHAT CONTRIBUTES TO IT?
      ↓
🧩 PHYSIQUE TARGET(S)
      ↓
WHY?
      ↓
🧬 ANATOMY
      ↓
HOW DOES TRAINING CHANGE IT?
      ↓
⚙️ STIMULUS
      ↓
WHAT SHOULD I DO?
      ↓
🏋️ EXERCISE
      ↓
HOW MUCH / HOW HARD / HOW OFTEN?
      ↓
📊 PROGRAMMING
      ↓
HOW DO I GET BETTER?
      ↓
📈 PROGRESSION
```

That is the Phase 4 architecture we are implementing.
