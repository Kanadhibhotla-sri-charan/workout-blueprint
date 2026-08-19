# Physique Blueprint — Phase 5
## All-Round Development Packages + Advanced Visual UI

**Status:** Approved for implementation  
**Prerequisite:** Phase 4C final correction complete

## 1. Objective

Phase 5 is a feature extension, not an architecture rewrite.

The existing Decision Maker answers:

> What is wrong visually, and what should I focus on?

Phase 5 adds:

> If I want this entire muscle group developed as completely and aesthetically as possible, what combination should I train?

The product therefore has two complementary paths:

```text
PHYSIQUE BLUEPRINT
        │
 ┌──────┴────────┐
 ↓               ↓
FIX A PROBLEM    BUILD THE MUSCLE
 ↓               ↓
Aesthetic        All-Round
Diagnosis        Development
 ↓               ↓
Target →         Exercise
Exercise         Combination
 ↓               ↓
Programming      Volume / Frequency
                 ↓
                 Intensity / Progression
```

Do not redesign the existing Decision Maker.

---

## 2. All-Round Development Packages

For every supported major muscle group, provide an all-round development package that contains:

- at least **two distinct exercise variations**;
- concrete sets and reps;
- RIR/intensity guidance;
- weekly direct-volume target;
- recommended weekly frequency;
- contextual intensity techniques;
- progression guidance;
- the visual contribution of each exercise;
- an explanation of why the exercises complement rather than duplicate one another.

### Important interpretation

“At least 2 sets” means the package must contain at least **two distinct exercises**. It does **not** mean every exercise must have exactly two sets.

Example:

```text
Incline Press     3 × 6–10
Flat Press        3 × 6–10
Cable Fly         2 × 10–15
```

is valid.

Exercise count and sets must be driven by coverage and programming logic, not by an arbitrary identical template.

---

## 3. Package Levels

Where the knowledge base supports it, provide two package levels.

### Efficient / Core

The smallest practical combination that provides broad visual development with minimal redundancy.

Characteristics:

- ≥2 exercises;
- important visual characteristics covered;
- moderate session volume;
- efficient for time-constrained users.

### Complete / Comprehensive

A broader combination for a high-priority muscle.

Characteristics:

- additional meaningful visual coverage;
- more direct/detail work where justified;
- higher but justified weekly volume;
- no redundant exercises merely to make the package larger.

Do not imply that Complete is automatically better for every user.

---

## 4. Coverage-Driven Exercise Selection

Do not force every muscle group into the same exercise count.

The package should be derived from:

```text
Muscle Group
    ↓
Aesthetic Outcomes
    ↓
Primary / Supporting Targets
    ↓
Aesthetic Exercise Roles
    ↓
Exercise Candidates
    ↓
Coverage
    ↓
Programming
```

An exercise is justified when it adds a meaningful difference such as:

- different aesthetic target;
- different target region;
- different muscle function;
- different resistance profile;
- different muscle-length emphasis;
- different visual characteristic;
- meaningful programming advantage.

Avoid two exercises that provide essentially the same contribution unless there is a strong programming reason.

---

## 5. Package Data Model

Use a package-level data structure rather than hard-coding packages into UI components.

Conceptual model:

```yaml
development_package:
  id: chest-all-round-efficient
  muscle_group: chest
  level: efficient

  objective:
    "Broad, balanced visual chest development"

  exercises:
    - exercise_id: incline-press
      sets: 3
      reps: "6-10"
      rir: "1-2"
      role: primary

    - exercise_id: flat-press
      sets: 3
      reps: "6-10"
      rir: "1-2"
      role: primary

    - exercise_id: cable-fly
      sets: 2
      reps: "10-15"
      rir: "1-2"
      role: direct

  frequency:
    sessions_per_week: 2

  weekly_volume:
    direct_sets: 16

  progression:
    ...
```

This is conceptual. Adapt it to the repository's existing conventions.

Reference existing exercise IDs. Do not duplicate exercise metadata.

---

## 6. Per-Exercise Prescription

Every package exercise must specify:

- exercise;
- order;
- sets;
- rep range;
- RIR/intensity;
- rest guidance where relevant;
- intensity technique if appropriate;
- role in the package;
- visual contribution.

Example:

```text
01 — Incline Press
3 × 6–10
RIR 1–2
Intensity technique: none

Contribution:
Upper-chest mass and projection
```

---

## 7. Weekly Volume and Frequency

Clearly distinguish:

```text
Sets per session
```

from:

```text
Direct sets per week
```

Example:

```text
Session:
3 + 3 + 2 = 8 direct sets

Frequency:
2× / week

Weekly:
16 direct sets
```

Every package should provide a sensible weekly direct-volume target and frequency based on the existing validated programming knowledge.

Do not use one universal volume or frequency number for every muscle.

Where indirect work exists, explain it rather than silently treating it as equivalent to direct sets.

---

## 8. Intensity Techniques

Intensity techniques remain contextual.

Possible outputs:

```text
None
Drop Set
Rest-Pause
Myo-Reps
```

Do not force a technique onto every exercise.

Heavy/high-skill compounds must remain protected from inappropriate techniques.

For an intensity technique, explain why it is being used.

---

## 9. Progression

Include a simple progression model using existing Blueprint principles.

Example:

```text
Rep range: 6–10
Start at the lower end with target RIR.
Add repetitions while maintaining target RIR.
When all prescribed sets reach the top of the range
with acceptable technique and RIR:
increase load and repeat.
```

Do not build a complex adaptive progression engine in Phase 5.

---

## 10. Package-Level Rationale

The package must explain why the exercises coexist.

Example:

```text
Exercise 1:
Builds the broad base.

Exercise 2:
Adds complementary development not fully covered by Exercise 1.

Exercise 3:
Addresses a visual/detail characteristic not covered as directly
by the primary movements.

Together:
Provides broad visual coverage without unnecessary redundancy.
```

This explanation is part of the product.

---

# 11. UI — Build the Muscle

Add a dedicated entry point, for example:

```text
BUILD THE MUSCLE
```

or:

```text
ALL-ROUND DEVELOPMENT
```

It must be clearly distinct from the diagnostic path.

Conceptual home screen:

```text
PHYSIQUE BLUEPRINT

┌─────────────────────────────┐
│ FIX A VISUAL PROBLEM        │
│ Find what may be limiting   │
│ a specific aesthetic        │
└─────────────────────────────┘

┌─────────────────────────────┐
│ BUILD THE MUSCLE             │
│ Complete all-round           │
│ development packages         │
└─────────────────────────────┘
```

---

## 12. Muscle Group Selection

Use the existing major muscle groups represented in the knowledge base, such as:

```text
Chest
Shoulders
Back
Biceps
Triceps
Forearms
Quads
Hamstrings
Glutes
Calves
Core
```

Do not invent new taxonomy solely for UI completeness.

---

## 13. Muscle Overview UI

A selected muscle should show a visual overview before the exercise list.

Example:

```text
CHEST
ALL-ROUND DEVELOPMENT

[ Efficient ] [ Complete ]

Visual Coverage
Upper       ██████████
Overall     ██████████
Projection █████████░
Contour     ██████████

Weekly volume:
14–16 direct sets

Frequency:
2× / week
```

The exact numbers must come from the package data.

---

# 14. Advanced Visual Design

The existing app contains enough information to justify a richer information-design layer.

The UI should be:

- dark/premium;
- tasteful rather than flashy;
- typography-driven;
- strongly hierarchical;
- card-based;
- visually scannable;
- mobile-first;
- responsive;
- information-dense without feeling cluttered.

Use subtle motion only where it improves interaction.

---

## 15. Graphics

Lightweight web-native graphics are encouraged:

- SVG;
- CSS progress bars;
- radial indicators;
- coverage diagrams;
- simple muscle-region illustrations where existing assets support them;
- volume/frequency indicators.

Do not introduce a heavyweight graphics engine.

Every visual should answer a useful question.

Examples:

```text
Coverage graphic
→ What parts of the muscle are being trained?

Volume graphic
→ How much direct work is prescribed?

Frequency graphic
→ How is weekly work distributed?

Contribution indicator
→ Why is this exercise included?
```

Do not add graphics purely for decoration.

---

## 16. Exercise Card

Exercise cards should show the important information immediately.

Conceptual design:

```text
┌─────────────────────────────────────┐
│ 01  INCLINE PRESS                   │
│                                     │
│ 3 × 6–10     RIR 1–2                │
│                                     │
│ PRIMARY BUILDER                     │
│ Upper chest • projection            │
│                                     │
│ Volume   ████████                   │
│ Fatigue  ██████                     │
│                                     │
│ Why this exercise?      ▼           │
└─────────────────────────────────────┘
```

Detailed rationale should be collapsible.

The user should understand the prescription without opening every section.

---

## 17. Package Comparison

If Efficient and Complete are both available, show a clear comparison.

Example:

```text
              EFFICIENT        COMPLETE

Exercises         3                 4
Weekly sets       12                16
Coverage          ████████          ██████████
Time              Lower             Higher
Detail            Good              Maximum
```

Explain the difference rather than calling Complete universally superior.

---

## 18. Mobile-First Requirements

Primary target widths:

```text
375px
390px
```

Verify:

- no horizontal scrolling;
- exercise cards stack cleanly;
- package selector remains accessible;
- metrics wrap properly;
- graphics remain legible;
- explanations collapse;
- text is not tiny;
- tap targets are comfortable;
- desktop enhancements do not compromise mobile usability.

Desktop may use wider layouts and richer grouping.

---

## 19. Accessibility

Maintain:

- adequate contrast;
- readable font sizes;
- clear hierarchy;
- visible focus states;
- controls understandable without color alone;
- reduced-motion compatibility.

Do not use color as the sole representation of good/bad or high/low.

---

## 20. Data-Driven UI

Do not hard-code package content inside React components.

Preferred:

```text
Package data
    ↓
Package/programming engine
    ↓
UI components
```

This allows knowledge corrections without rewriting UI.

---

## 21. Reuse Existing Knowledge

Do not create a second copy of:

- exercise descriptions;
- target mappings;
- aesthetic outcomes;
- programming profiles;
- intensity-technique definitions.

Reference existing IDs.

New package data should primarily contain:

```text
package membership
exercise order
package role
sets
reps
RIR
frequency
volume
progression
package rationale
```

---

## 22. No AI Requirement

Phase 5 does not require:

- AI;
- ML;
- LLMs;
- external inference APIs;
- backend services.

The packages should remain deterministic and knowledge-driven.

---

# 23. Validation Requirements

### Coverage

- [ ] Every supported muscle group has an all-round package.
- [ ] Every package contains ≥2 distinct exercises.
- [ ] Major visual characteristics are meaningfully covered.
- [ ] Important uncovered characteristics are explained.

### Redundancy

- [ ] Every exercise adds meaningful coverage or programming value.
- [ ] No unnecessary duplicate movements.

### Programming

- [ ] Sets are explicit.
- [ ] Reps are explicit.
- [ ] RIR/intensity is explicit.
- [ ] Frequency is explicit.
- [ ] Weekly direct volume is explicit.
- [ ] Intensity technique is contextual.
- [ ] Progression is defined.

### Consistency

- [ ] Package exercise roles agree with existing aesthetic roles.
- [ ] Recommendations do not contradict technical explanations.
- [ ] Programming matches exercise type/profile.
- [ ] Existing Decision Maker behavior remains unchanged.

---

# 24. Regression Protection

All existing tests must continue to pass.

Protect at minimum:

```text
Aesthetic diagnosis
Primary target hierarchy
Aesthetic exercise roles
Brachialis side thickness
Lower-calf fullness
Calf width
Upper-trap fullness
Above-knee separation
Shoulder width
Back width vs thickness
Programming profile classification
Intensity-technique selection
UNSPECIFIED fallback
```

Phase 5 must not alter existing Decision Maker behavior.

---

# 25. Acceptance Criteria

Phase 5 is complete when:

- [ ] Dedicated Build the Muscle / All-Round Development entry point exists.
- [ ] Every supported major muscle group has at least one package.
- [ ] Each package has ≥2 distinct exercise variations.
- [ ] Efficient and Complete levels are supported where justified.
- [ ] Packages are coverage-driven rather than exercise-count-driven.
- [ ] Redundancy is controlled.
- [ ] Every exercise has sets and reps.
- [ ] RIR/intensity is specified.
- [ ] Weekly direct volume is specified.
- [ ] Frequency is specified.
- [ ] Intensity techniques are contextual.
- [ ] Progression guidance is included.
- [ ] Every exercise has a clear visual contribution.
- [ ] Package rationale explains why exercises coexist.
- [ ] Coverage is represented visually.
- [ ] Volume/frequency are represented visually.
- [ ] Exercise cards are polished and expandable.
- [ ] 375px and 390px mobile layouts pass.
- [ ] Desktop layout passes.
- [ ] No horizontal overflow exists.
- [ ] No AI/ML/backend is required.
- [ ] Existing Decision Maker behavior remains unchanged.
- [ ] Existing regression suite remains green.
- [ ] Package data is separate from UI code.
- [ ] Existing exercise/target knowledge is referenced rather than duplicated.

---

# 26. Implementation Order

```text
5-1  Define package data model
 ↓
5-2  Define package coverage requirements
 ↓
5-3  Define Efficient vs Complete semantics
 ↓
5-4  Create package knowledge for supported muscle groups
 ↓
5-5  Implement coverage / redundancy validation
 ↓
5-6  Implement package programming resolution
 ↓
5-7  Implement weekly volume / frequency calculation
 ↓
5-8  Implement progression information
 ↓
5-9  Implement Build the Muscle navigation
 ↓
5-10 Implement package overview UI
 ↓
5-11 Implement exercise cards
 ↓
5-12 Implement coverage / volume / frequency graphics
 ↓
5-13 Polish mobile and desktop layouts
 ↓
5-14 Run regression suite
 ↓
5-15 Run package-specific validation
 ↓
5-16 Real-world UX test
```

---

# 27. Explicit Non-Goals

Do NOT:

- rebuild the Decision Maker;
- replace aesthetic exercise roles;
- introduce AI/ML/LLM dependencies;
- create a backend or authentication system;
- create workout-history tracking;
- build automatic adaptive recovery;
- build an infinite workout generator;
- introduce arbitrary weighted optimization;
- force every muscle into an identical package structure;
- force every package to contain the same number of exercises;
- add exercises merely to increase package size;
- sacrifice mobile usability for visual effects.

---

# 28. Scope

This is a meaningful feature extension, not a rewrite.

Approximate complexity:

```text
Package knowledge/data       MEDIUM
Exercise combination logic   HIGH
Programming integration     MEDIUM
Volume/frequency             MEDIUM
Intensity integration        MEDIUM
UI                           MEDIUM
Visual graphics              LOW–MEDIUM
Responsive polish            MEDIUM
```

Overall:

> **Medium-to-large feature extension, approximately 6–7/10.**

Reuse the existing architecture wherever possible.

---

# 29. Final Architect Principle

The existing Blueprint answers:

> **“What should I focus on?”**

Phase 5 adds:

> **“If I want the whole muscle group developed well, what should I actually do?”**

The result should feel like a knowledgeable coach explaining:

```text
Here is the minimum combination I would use.

Here is the more complete combination if this muscle
is a high priority.

Here is what each exercise contributes.

Here is why they are not redundant.

Here is how many sets and reps to perform.

Here is how often to train them.

Here is where intensity techniques make sense.

Here is how much direct work you accumulate each week.

Here is how to progress.

And here is what visual development that combination
is intended to produce.
```

---

# 30. Boundary After Phase 5

Once Phase 5 is implemented, validated, and deployed:

**Stop adding major architecture.**

Future development should normally follow:

```text
Real-world use
    ↓
Concrete problem discovered
    ↓
Classify:
knowledge defect
programming defect
UI defect
genuine new feature
    ↓
Fix the smallest appropriate layer
    ↓
Add regression test
    ↓
Deploy
```

Do not create another architecture phase simply because a new exercise, package, visual preference, or knowledge entry is discovered.

The objective is now a **finished, useful product**, not an endlessly expanding engineering project.
