# Physique Blueprint — Phase 5 Final Implementation Specification
## All-Round Development + Final Premium UI + Production Refinement

**Status:** Final implementation pass  
**Audience:** Claude Code / development team  
**Principle:** Implement this specification against the existing Phase 5 architecture. Do not reinterpret the product structure or create another architecture phase.

---

# 1. Executive Decision

The current Phase 5 implementation is fundamentally sound.

This document is the **final refinement pass** before production sign-off.

It has two categories of work:

### A. Functional refinements

1. Fix the `Why this exercise?` content bug.
2. Make intensity-technique output meaningful and visible at package level.
3. Make programming appropriately exercise-specific.
4. Improve Efficient vs Complete package explanation.
5. Perform a complete package volume/redundancy sanity check.

### B. Product/UI refinement

6. Implement the premium UI direction specified in this document.

After these changes:

> **Stop adding architecture. Build it, validate it, deploy it, and use it.**

---

# 2. Existing Architecture — PRESERVE

Do not redesign or replace:

```text
Phase 4C Decision Engine
        ↓
Aesthetic Outcome
        ↓
Target
        ↓
Aesthetic Exercise Role
        ↓
Exercise
        ↓
Programming
```

Phase 5 remains an extension:

```text
                    PHYSIQUE BLUEPRINT
                           │
             ┌─────────────┴─────────────┐
             ↓                           ↓
      FIX A VISUAL PROBLEM        BUILD THE MUSCLE
             │                           │
       Existing Engine             Package Engine
                                         │
                                Exercise Combination
                                         │
                                Volume / Frequency
                                         │
                                Programming
```

The package system must continue using:

- existing exercise IDs;
- existing target knowledge;
- existing aesthetic roles;
- existing programming engine;
- existing intensity-technique engine;
- existing data conventions.

Do not duplicate knowledge.

---

# 3. Functional Fix #1 — "Why This Exercise?"

## Current problem

The exercise card's:

```text
Why this exercise?
```

section is currently showing the intensity-technique context rather than the package exercise's contribution.

The package data already contains the correct `contribution`.

## Required final structure

```text
┌─────────────────────────────────────────────┐
│ 01  INCLINE PRESS                           │
│                                             │
│ 3 × 6–10          RIR 1–2                   │
│ PRIMARY BUILDER                             │
│ Upper chest • projection                    │
│                                             │
│ WHY THIS EXERCISE?                    ˅     │
│ Upper-chest mass and projection.             │
│ Complements the other chest movements by    │
│ emphasizing this region.                    │
│                                             │
│ INTENSITY TECHNIQUE                    ˅    │
│ None — heavy compound; no advanced          │
│ technique needed.                           │
└─────────────────────────────────────────────┘
```

### Rules

- `contribution` → displayed under **Why this exercise?**
- `intensityTechniqueContext` → displayed only under **Intensity Technique**
- Never mix these concepts.
- Both sections should be independently expandable.

### Acceptance

- [ ] Contribution is visible under the correct heading.
- [ ] Intensity context is visible only under the intensity section.
- [ ] Existing package data is reused.
- [ ] Regression test added where practical.

---

# 4. Functional Fix #2 — Intensity Techniques

## Goal

The package must feel intentionally programmed rather than:

```text
Every exercise:
RIR 1–3
Intensity: None
```

Use the existing deterministic intensity-technique engine.

Possible results:

```text
None
Drop Set
Rest-Pause
Myo-Reps
```

Do not force a technique onto every exercise.

## Example

```text
CABLE FLY

2 × 10–15
RIR 1–2

Intensity Technique
DROP SET — FINAL SET

Why:
Stable isolation movement with relatively low technical
risk, making it suitable for extending the final set.
```

Versus:

```text
INCLINE PRESS

3 × 6–10
RIR 1–2

Intensity Technique
NONE

Why:
Heavy compound movement; advanced fatigue techniques
are unnecessary here.
```

### Architecture rule

Do not replace the existing intensity engine with arbitrary package hard-coding.

Use:

```text
Exercise
 ↓
Programming profile
 ↓
Eligibility
 ↓
Contextual technique
```

Package data may provide a deliberate preference where the knowledge base establishes one, but safety/skill/exercise-type constraints remain authoritative.

### Acceptance

- [ ] Every package exercise has a resolved intensity result.
- [ ] None remains valid.
- [ ] Drop Set is not universal.
- [ ] Rest-Pause can appear.
- [ ] Myo-Reps can appear.
- [ ] Heavy/high-skill compounds remain protected.
- [ ] Reason is understandable to the user.

---

# 5. Functional Fix #3 — Exercise-Specific Programming

## Goal

Avoid making the package feel like an exercise list with one generic prescription copied across everything.

Programming should vary only where justified by:

- compound vs isolation;
- loading potential;
- stability;
- technical demand;
- fatigue;
- target role;
- muscle-length emphasis;
- exercise order;
- intended visual contribution.

## Example direction

```text
INCLINE PRESS
3 × 6–10
RIR 1–2

CABLE FLY
2 × 10–15
RIR 1–2
Final set → contextual intensity technique

ISOLATION MOVEMENT
2 × 12–20
RIR 1–2
```

Do not create arbitrary differences just to make the UI look sophisticated.

### Acceptance

- [ ] Compounds and isolations are not automatically given identical prescriptions.
- [ ] Programming reflects exercise characteristics where meaningful.
- [ ] Exercise order has a reason.
- [ ] RIR remains consistent with the existing programming philosophy.
- [ ] Intensity techniques complement rather than duplicate the base prescription.

---

# 6. Functional Fix #4 — Efficient vs Complete

The user must immediately understand:

> What do I gain by choosing Complete?

## Required comparison

```text
EFFICIENT
────────────────────────
Best when:
Time or recovery is limited.

Provides:
✓ Essential mass-building work
✓ Broad visual coverage
✓ Minimum practical exercise count


COMPLETE
────────────────────────
Adds:
✓ Additional regional coverage
✓ Additional visual/detail work
✓ Higher justified weekly volume

Best when:
This muscle is a high priority and additional
recovery capacity is available.
```

Do not universally describe Complete as "better."

## Data-driven requirement

Where possible, derive the comparison from actual package data.

If Complete adds an exercise because it covers a specific target, expose that target.

---

# 7. Functional Fix #5 — Package Volume Sanity Check

Review every package.

Calculate:

```text
sets/session × sessions/week = direct sets/week
```

Then evaluate:

- muscle size;
- overlap;
- exercise fatigue;
- indirect contribution;
- recovery;
- package level;
- unique visual coverage.

## Important rule

Do not lower volume just because a number looks high.

Ask:

> Does every set provide enough unique development to justify its fatigue/recovery cost?

If not:

- remove redundant work;
- reduce sets;
- or move the exercise to Complete only if it genuinely adds useful coverage.

High-volume packages should be explicitly labelled as such.

Example:

```text
COMPLETE
HIGH-VOLUME OPTION

Best suited to:
High-priority muscle + adequate recovery capacity
```

---

# 8. UI DESIGN — FINAL VISUAL DIRECTION

This section is **prescriptive**.

Do not simply "make the UI prettier."

Implement the following visual information architecture.

---

# 9. Design Language

The finished UI should feel:

```text
Premium
Dark
Technical
Modern
Calm
Information-dense
Purposeful
```

Think:

> premium physique-analysis / performance application

not:

> gaming dashboard

Avoid:

- neon overload;
- excessive gradients;
- excessive glow;
- giant decorative illustrations;
- unnecessary animation;
- tiny text;
- excessive rounded-card nesting.

Use restrained accent color, strong typography, spacing, and information hierarchy.

---

# 10. Global Design Tokens

Use a consistent design-token layer rather than scattering values throughout components.

Conceptually:

```css
--bg-page
--bg-surface
--bg-surface-elevated
--border-subtle
--text-primary
--text-secondary
--text-muted

--accent-primary
--accent-secondary

--success
--warning
--danger

--radius-sm
--radius-md
--radius-lg

--space-1
--space-2
--space-3
--space-4
--space-5
--space-6
```

Exact values may be chosen during implementation, but the system must be coherent.

---

# 11. Typography Hierarchy

Use a clear hierarchy:

```text
Page title
    ↓
Section title
    ↓
Exercise/package title
    ↓
Metric
    ↓
Supporting label
    ↓
Explanation
```

The most important information should have the strongest visual weight.

Avoid making every label bold.

---

# 12. Build Muscle Landing Page

The entry page should look approximately like:

```text
┌──────────────────────────────────────────────┐
│ PHYSIQUE BLUEPRINT                           │
│                                              │
│ BUILD THE MUSCLE                             │
│ Complete visual development plans            │
│                                              │
│ Choose a muscle group                        │
│                                              │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ │
│ │ CHEST      │ │ SHOULDERS  │ │ BACK       │ │
│ │             │ │             │ │             │ │
│ │ All-round  │ │ All-round  │ │ All-round  │ │
│ └────────────┘ └────────────┘ └────────────┘ │
│                                              │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ │
│ │ BICEPS     │ │ TRICEPS    │ │ FOREARMS   │ │
│ └────────────┘ └────────────┘ └────────────┘ │
│                                              │
│ ...                                          │
└──────────────────────────────────────────────┘
```

### Behavior

- Muscle cards are tappable.
- Card hover/focus state is subtle.
- No unnecessary animation.
- Cards should communicate that these are development packages.

---

# 13. Muscle Overview / Package Page

The page should have this hierarchy:

```text
Back navigation
        ↓
Muscle identity
        ↓
Visual objective
        ↓
Key metrics
        ↓
Coverage visualization
        ↓
Efficient / Complete selector
        ↓
Package summary
        ↓
Exercise sequence
        ↓
Weekly programming
        ↓
Package rationale
```

---

# 14. Muscle Hero

Desktop conceptual layout:

```text
┌─────────────────────────────────────────────────────┐
│ ← BUILD THE MUSCLE                                  │
│                                                     │
│ CHEST                                               │
│ All-Round Development                               │
│                                                     │
│ Balanced visual chest development                   │
│                                                     │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐             │
│ │ 16       │ │ 2×       │ │ 100%     │             │
│ │ SETS/WK  │ │ / WEEK   │ │ COVERAGE │             │
│ └──────────┘ └──────────┘ └──────────┘             │
└─────────────────────────────────────────────────────┘
```

### Mobile

Stack metrics:

```text
CHEST
All-Round Development

Balanced visual chest development

┌───────────────┐
│ 16 SETS / WK  │
└───────────────┘
┌───────────────┐
│ 2× / WEEK     │
└───────────────┘
┌───────────────┐
│ 100% COVERAGE │
└───────────────┘
```

---

# 15. Coverage Visualization

Coverage should be visual, but not decorative.

Use relevant visual characteristics.

Example:

```text
VISUAL COVERAGE

Upper chest       ●●●●●
Overall mass      ●●●●●
Projection        ●●●●○
Contour           ●●●●●
```

Alternative implementation:

```text
Upper chest     ██████████
Overall mass    ██████████
Projection      ████████░░
Contour         ██████████
```

Prefer a visual style that fits the final design system.

### Rule

Only display characteristics actually represented in package data.

Do not invent coverage values.

---

# 16. Package Selector

Efficient and Complete should be presented as a deliberate choice.

Desktop:

```text
┌──────────────────────────┐ ┌──────────────────────────┐
│ EFFICIENT                │ │ COMPLETE                 │
│                          │ │                          │
│ Essential coverage       │ │ Comprehensive coverage   │
│                          │ │                          │
│ 3 exercises              │ │ 5 exercises              │
│ 14 weekly sets           │ │ 22 weekly sets            │
│                          │ │                          │
│ [ SELECT ]               │ │ [ SELECT ]               │
└──────────────────────────┘ └──────────────────────────┘
```

Mobile:

```text
[ EFFICIENT ] [ COMPLETE ]
```

with the selected package expanded below.

Do not require side-by-side cards on small screens.

---

# 17. Package Summary

Immediately below the selector:

```text
COMPLETE

Comprehensive visual development
─────────────────────────────────

Weekly volume     22 direct sets
Frequency          2× / week
Exercises          5
Session volume     11 sets
Time demand        Higher
```

Then:

```text
WHAT COMPLETE ADDS

✓ Additional upper-region coverage
✓ Direct visual/detail work
✓ Higher justified volume
```

The exact bullets must come from the package.

---

# 18. Exercise Sequence

Represent the workout as a deliberate sequence.

```text
01
INCLINE PRESS
PRIMARY BUILDER
3 × 6–10 · RIR 1–2
────────────────────

02
FLAT PRESS
PRIMARY BUILDER
3 × 6–10 · RIR 1–2
────────────────────

03
CABLE FLY
DIRECT DETAIL
2 × 10–15 · RIR 1–2
```

The sequence number should make the order obvious.

---

# 19. Exercise Card — Default State

Default state must be compact enough for fast gym use.

```text
┌───────────────────────────────────────────┐
│ 01  INCLINE PRESS                         │
│     PRIMARY BUILDER                       │
│                                           │
│     3 × 6–10              RIR 1–2         │
│     Upper chest • projection              │
│                                           │
│     Why this exercise?              ˅     │
└───────────────────────────────────────────┘
```

Do not show a wall of text by default.

---

# 20. Exercise Card — Expanded State

Expanded state:

```text
┌───────────────────────────────────────────┐
│ 01  INCLINE PRESS                         │
│     PRIMARY BUILDER                       │
│                                           │
│     3 × 6–10              RIR 1–2         │
│                                           │
│ WHY THIS EXERCISE?                  ˄     │
│ Upper-chest mass and projection.          │
│ Complements the other chest movements.    │
│                                           │
│ INTENSITY TECHNIQUE                  ˅    │
│ None                                      │
│                                           │
│ PROGRESSION                         ˅    │
│ Add reps within the range while          │
│ maintaining target RIR.                  │
└───────────────────────────────────────────┘
```

Each section should expand independently.

---

# 21. Exercise Role Badge

Use clear labels:

```text
PRIMARY BUILDER
DIRECT
SECONDARY
SUPPORTING
```

Do not expose `UNSPECIFIED` as a user-facing badge unless there is a strong reason.

Role should be visually distinct but not dominate the exercise name.

---

# 22. Exercise Contribution

Contribution is the most important explanation.

It answers:

> Why is this exercise here?

Keep it concise.

Example:

```text
Upper-chest mass and projection.
```

Longer explanation can be expandable if necessary.

---

# 23. Intensity Technique Section

Separate from contribution.

Example:

```text
INTENSITY TECHNIQUE

DROP SET — FINAL SET

Stable isolation movement with relatively low
technical risk, making it suitable for extending
the final set.
```

If none:

```text
INTENSITY TECHNIQUE

NONE

Heavy compound movement; no advanced fatigue
technique is needed.
```

---

# 24. Programming Section

Allow the user to expand programming details:

```text
PROGRAMMING

Sets        3
Reps        6–10
RIR         1–2
Rest        2–3 min
Frequency   2× / week
```

Do not force all details into the default card state.

---

# 25. Progression Section

Example:

```text
PROGRESSION

Stay within 6–10 reps.

When all sets reach 10 reps at target RIR
with clean technique:

→ increase load
→ return toward 6 reps
→ repeat
```

Keep this practical and gym-usable.

---

# 26. Weekly Programming Panel

After the exercise list:

```text
WEEKLY PLAN

SESSION A
Incline Press       3
Flat Press          3
Cable Fly           2

SESSION B
Incline Press       3
Flat Press          3
Cable Fly           2

TOTAL
16 direct sets/week
```

If the package uses identical sessions, state that rather than duplicating unnecessary content.

If sessions differ, show the actual difference.

---

# 27. Volume Visualization

Show:

```text
WEEKLY DIRECT VOLUME

16 sets
████████████████░░
```

Optionally compare against the package's intended range:

```text
Target range
12 ─────────────── 18
                 ▲
                16
```

Do not display fake precision.

---

# 28. Frequency Visualization

Keep this simple:

```text
FREQUENCY

MON ─────────●
TUE
WED ─────────●
THU
FRI
SAT
SUN
```

Or a compact:

```text
2× / WEEK
●               ●
```

The exact visual may vary.

---

# 29. Package Rationale

At the bottom:

```text
WHY THIS PACKAGE WORKS

This combination is designed to cover the major visual
characteristics of the chest without relying on multiple
versions of the same movement.

Incline Press:
Upper-region mass and projection.

Flat Press:
Broad overall development.

Cable Fly:
Complementary direct/detail work.

The Complete package adds additional coverage and volume
rather than simply repeating the same stimulus.
```

The content must be data-driven.

---

# 30. Desktop Layout

At desktop widths, use a two-column structure where appropriate:

```text
┌──────────────────────────────────────────────────────────┐
│                    MUSCLE HERO                           │
└──────────────────────────────────────────────────────────┘

┌───────────────────────────────┐ ┌────────────────────────┐
│ PACKAGE                       │ │ VISUAL COVERAGE        │
│ Efficient / Complete          │ │                        │
│ Summary                       │ │ Upper    ██████████    │
│ Volume                        │ │ Overall  ██████████    │
│ Frequency                     │ │ Projection ████████    │
└───────────────────────────────┘ └────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ EXERCISE SEQUENCE                                        │
│                                                          │
│ 01 Exercise                                              │
│ 02 Exercise                                              │
│ 03 Exercise                                              │
└──────────────────────────────────────────────────────────┘
```

Do not create a permanently split dashboard if it reduces readability.

---

# 31. Mobile Layout

At 375–390px:

```text
← BUILD THE MUSCLE

CHEST
All-Round Development

[ 16 SETS / WK ]
[ 2× / WEEK ]
[ 100% COVERAGE ]

VISUAL COVERAGE
Upper       ██████████
Overall     ██████████
Projection  ████████░░

[ EFFICIENT ] [ COMPLETE ]

PACKAGE SUMMARY

01 INCLINE PRESS
...

02 FLAT PRESS
...

03 CABLE FLY
...

WEEKLY PLAN
...

WHY THIS PACKAGE WORKS
...
```

Everything should remain single-column.

---

# 32. Interaction Rules

Use subtle, purposeful interaction.

### Required

- package selector;
- collapsible exercise sections;
- collapsible contribution/rationale;
- collapsible programming;
- back navigation;
- muscle selection.

### Optional

- subtle card hover;
- subtle progress animation;
- smooth expand/collapse.

Do not animate essential information in a way that delays access during a workout.

---

# 33. Accessibility

Maintain:

- sufficient contrast;
- readable text;
- visible focus states;
- comfortable tap targets;
- keyboard navigation;
- reduced-motion compatibility;
- no information conveyed only by color.

Role badges should include text.

---

# 34. Responsive QA

Must test:

```text
375px
390px
768px
1024px+
```

At minimum.

Check:

- no horizontal overflow;
- no clipped controls;
- no overlapping cards;
- no unreadable metrics;
- no collapsed content accidentally inaccessible;
- comparison UI behaves correctly.

---

# 35. Performance Constraint

Use lightweight graphics.

Preferred:

```text
CSS
SVG
Existing image assets
```

Avoid adding a heavy graphics/charting library solely for decorative visuals.

Do not introduce a performance problem to make the UI look advanced.

---

# 36. Data / UI Separation

Package information must remain data-driven.

Do not write:

```tsx
if (muscle === "chest") ...
```

throughout the UI.

Prefer:

```text
package data
    ↓
package engine
    ↓
view model
    ↓
shared components
```

This keeps the visual layer reusable across all 11 muscle groups.

---

# 37. Regression Requirements

All existing Phase 4 tests and behavior must remain unchanged.

Verify:

```text
Brachialis side thickness
Lower-calf fullness
Calf width/shape
Upper-trap fullness
Above-knee separation
Shoulder width
Back width vs thickness
Primary vs supporting target
UNSPECIFIED fallback
Programming profile classification
Intensity-technique selection
```

Then Phase 5-specific tests:

- [ ] Every muscle has Efficient package.
- [ ] Every muscle has Complete package.
- [ ] Every package has ≥2 exercises.
- [ ] Weekly volume calculation is correct.
- [ ] Coverage calculation is correct.
- [ ] Complete adds meaningful coverage.
- [ ] Exercise contribution renders correctly.
- [ ] Intensity technique renders separately.
- [ ] Programming renders correctly.
- [ ] Package rationale renders correctly.

---

# 38. Manual Adversarial Package Checks

Perform at least these:

### Chest

Verify Complete does not simply add redundant chest exercises.

### Calves

Verify straight-knee and bent-knee work are both represented appropriately.

### Back

Verify width and thickness coverage are both represented.

### Shoulders

Verify side/rear/front development is not accidentally dominated by pressing.

### Arms

Verify biceps and triceps packages reflect the major visual characteristics already established by the knowledge base.

### Core

Verify the package does not treat all abdominal/oblique work as interchangeable.

---

# 39. Implementation Order

Implement exactly in this order:

```text
P5-F1
Fix Why-this-exercise contribution display
        ↓
P5-F2
Separate intensity-technique display
        ↓
P5-F3
Verify contextual intensity-technique output
        ↓
P5-F4
Refine exercise-specific programming
        ↓
P5-F5
Improve Efficient vs Complete comparison
        ↓
P5-F6
Run package-wide volume/redundancy review
        ↓
P5-F7
Implement final UI design tokens
        ↓
P5-F8
Implement Build Muscle landing-page design
        ↓
P5-F9
Implement muscle hero / overview
        ↓
P5-F10
Implement package selector and summary
        ↓
P5-F11
Implement exercise-card states
        ↓
P5-F12
Implement coverage / volume / frequency visuals
        ↓
P5-F13
Implement package rationale
        ↓
P5-F14
Responsive/mobile polish
        ↓
P5-F15
Accessibility pass
        ↓
P5-F16
Full automated validation
        ↓
P5-F17
Manual adversarial package testing
        ↓
P5-F18
Production build verification
```

---

# 40. Explicit Non-Goals

Do NOT:

- create another architecture phase;
- replace the existing Decision Maker;
- replace the existing aesthetic-role system;
- introduce AI;
- introduce ML;
- introduce LLM APIs;
- introduce a backend;
- add accounts;
- add workout history;
- create an adaptive recovery engine;
- create an infinite workout generator;
- create arbitrary weighted optimization;
- create new muscle taxonomy solely for this feature;
- add more exercises merely to increase package size;
- introduce a heavyweight graphics engine;
- sacrifice usability for visual effects.

---

# 41. Definition of Done

Phase 5 final refinement is complete when:

### Functional

- [ ] `Why this exercise?` displays package contribution.
- [ ] Intensity-technique context is displayed separately.
- [ ] Intensity techniques are contextual and understandable.
- [ ] Programming has meaningful exercise-specific differentiation where justified.
- [ ] Efficient vs Complete communicates actual additional value.
- [ ] Every package passes volume/redundancy review.

### UI

- [ ] Build Muscle landing page matches the specified hierarchy.
- [ ] Muscle hero is implemented.
- [ ] Package selector is implemented.
- [ ] Coverage visualization is implemented.
- [ ] Volume/frequency visualization is implemented.
- [ ] Exercise cards match the specified information hierarchy.
- [ ] Contribution/programming/intensity sections are separate.
- [ ] Package rationale is visible.
- [ ] Desktop layout is polished.
- [ ] 375px mobile layout is polished.
- [ ] 390px mobile layout is polished.
- [ ] No horizontal overflow.
- [ ] Accessibility requirements pass.

### Validation

- [ ] Existing regression suite passes.
- [ ] Phase 5 package tests pass.
- [ ] Manual adversarial checks pass.
- [ ] Type checking passes.
- [ ] Lint passes.
- [ ] Production build passes.

---

# 42. Final Architect Instruction

Do not treat the UI section as:

> "Some suggestions for making it prettier."

Treat it as the **visual implementation specification**.

The intended workflow is:

```text
This document
    ↓
Existing Phase 5 architecture/data
    ↓
Claude implements the specified UI
    ↓
Visual QA against this specification
    ↓
Functional regression
    ↓
Production build
```

Where the specification shows a layout, hierarchy, behavior, or interaction, implement that intent directly rather than inventing a different UX.

At the same time, do not hard-code the example chest values or text into the UI. The examples illustrate the visual structure; actual content must come from package data.

---

# 43. Final Boundary

Once this refinement passes:

# SHIP IT.

No Phase 6.

No new recommendation architecture.

No AI.

No endless UI redesign.

From that point forward:

```text
Real-world use
    ↓
Concrete issue
    ↓
Classify:
Knowledge
Programming
Ranking
UI
Feature
    ↓
Fix the smallest appropriate layer
    ↓
Regression test
    ↓
Deploy
```

The goal is now a finished product that is genuinely useful during real training — not an indefinitely expanding engineering project.
