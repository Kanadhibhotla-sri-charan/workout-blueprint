# Physique Blueprint --- Phase 3

## Blueprint MVP --- Knowledge Explorer + Decision Maker

**Document Type:** Architect-to-Engineering Implementation
Specification\
**Phase:** 3\
**Status:** Approved for implementation\
**Owner:** Solution Architecture\
**Implementation Team:** Claude Code / Engineering\
**Prerequisite:** Phase 2 --- Schema & Data Governance --- Complete

------------------------------------------------------------------------

# 0. Executive Decision

The knowledge foundation is now sufficiently mature for practical use.

Phase 3 therefore changes the project's priority from **knowledge
construction** to **productization**.

> **Build the first usable Blueprint application on top of the validated
> 123-exercise knowledge base.**

Do **not** expand the exercise database during this phase.

Do **not** build an AI recommendation system.

Do **not** build workout tracking or personalization.

The goal is a small, mobile-first application that allows a user to:

1.  explore the knowledge base;
2.  understand individual exercises;
3.  search and filter exercises;
4.  ask a practical exercise-selection question;
5.  receive an explainable recommendation based on the existing
    structured knowledge.

The result should be something the project owner can actually use in the
gym.

------------------------------------------------------------------------

# 1. Product Goal

The MVP must demonstrate the original Blueprint vision:

> **Turn structured exercise knowledge into practical exercise
> decisions.**

The user should not need to understand the underlying YAML, taxonomy, or
biomechanics.

The application should translate structured knowledge into simple
decisions.

------------------------------------------------------------------------

# 2. MVP Scope

Phase 3 contains five major capabilities:

  Capability                            Priority
  ------------------------------- --------------
  Application foundation                      P0
  Knowledge Explorer                          P0
  Exercise Detail                             P0
  Search / filtering                          P0
  Decision Maker v0.1                         P0
  Responsive/mobile UX                        P0
  Basic usability/accessibility               P1
  Advanced analytics                Out of scope
  AI recommendations                Out of scope
  User accounts                     Out of scope
  Workout logging                   Out of scope

------------------------------------------------------------------------

# 3. Core Architecture

The application must follow:

``` text
Canonical YAML
      ↓
Data Loading / Parsing
      ↓
Normalized Exercise Objects
      ↓
Application State
      ↓
UI
      ↓
Decision Engine
```

The YAML knowledge base remains the **single source of truth**.

The application must not maintain a second manually authored copy of
exercise knowledge.

------------------------------------------------------------------------

# 4. Critical Architectural Rule

## The UI is a renderer of knowledge, not a second knowledge base.

Do NOT do this:

``` text
YAML
  why_this_exists: "..."

React component
  whyThisExists: "..."
```

Do this:

``` text
YAML
  ↓
exercise object
  ↓
component
```

The same rule applies to:

-   mirror effect;
-   best-used-when;
-   limitations;
-   equipment;
-   fatigue;
-   setup;
-   alternatives;
-   complements;
-   overlaps;
-   movement patterns;
-   target muscles;
-   coverage categories.

If knowledge changes, the application should update automatically from
the canonical data.

------------------------------------------------------------------------

# 5. Application Technology

Engineering may choose the implementation details, but the application
should use a lightweight modern frontend architecture.

Preferred direction:

``` text
React
TypeScript
Vite
```

The exact stack may differ if the existing repository or engineering
environment provides a compelling reason.

Do not introduce a backend or database unless a concrete MVP requirement
requires one.

The MVP should work primarily from the repository's structured knowledge
files.

------------------------------------------------------------------------

# 6. Suggested Application Structure

A reasonable starting structure is:

``` text
app/
├── src/
│   ├── components/
│   ├── pages/
│   ├── data/
│   ├── engine/
│   ├── utils/
│   └── types/
├── public/
└── ...
```

This is a recommendation, not a rigid requirement.

The important architectural boundaries are:

``` text
Data
Knowledge interpretation
Decision logic
Presentation
```

These concerns must remain separable.

------------------------------------------------------------------------

# 7. MVP User Flow

The primary flow should be:

``` text
Open Blueprint
      ↓
Explore or Ask
      ↓
Select body region / goal
      ↓
Browse or search
      ↓
Inspect exercise
      ↓
Compare / decide
```

The Decision Maker should also be directly accessible without requiring
the user to browse the entire database first.

------------------------------------------------------------------------

# 8. Screen 1 --- Home / Knowledge Explorer

The home screen should immediately expose the major body regions
represented in the dataset.

Example:

``` text
CHEST
BACK
SHOULDERS
ARMS
CORE
HIPS
QUADS
HAMSTRINGS
CALVES
FOREARMS
NECK
```

Selecting a region displays relevant canonical exercises.

The interface should make the purpose of the product obvious.

Recommended primary actions:

``` text
Explore Exercises
Make a Decision
Search
```

Do not overcrowd the home screen with analytics or secondary features.

------------------------------------------------------------------------

# 9. Screen 2 --- Exercise List

The exercise list should support:

-   body-region browsing;
-   search;
-   basic filtering;
-   sorting only where a meaningful use case exists.

Each exercise card should expose enough information to help decide
whether to open it.

Recommended high-level information:

``` text
Exercise Name
Primary Target
Exercise Type
Key Role / Coverage
Mirror Effect preview
```

Do not display every metadata field on the card.

Use progressive disclosure.

------------------------------------------------------------------------

# 10. Screen 3 --- Exercise Detail

Exercise detail is one of the most important MVP screens.

The hierarchy should follow:

``` text
1. What is this?
2. Why does it exist?
3. What will I see / what does it help develop?
4. When should I use it?
5. What does it demand?
6. What does it overlap with?
7. What complements it?
8. What alternatives exist?
9. Technical details
```

The page should prioritize decision-making over encyclopedic
presentation.

------------------------------------------------------------------------

## 10.1 Primary Section

Display:

-   Exercise name
-   Short summary
-   Why this exists
-   Primary targets

------------------------------------------------------------------------

## 10.2 Mirror Effect

Display the `mirror_effect` prominently.

The language should remain user-facing and visual.

Avoid unnecessary jargon.

------------------------------------------------------------------------

## 10.3 Decision Context

Display:

-   `best_used_when`
-   `less_suitable_when`
-   exercise type;
-   movement pattern;
-   setup time;
-   fatigue cost;
-   stability demand;
-   skill demand.

------------------------------------------------------------------------

## 10.4 Relationships

Display:

### Alternatives

Exercises that can fill approximately the same role.

### Complements

Exercises that add materially different coverage.

### Overlap

Exercises that cover substantially similar ground.

The UI must preserve these distinctions.

------------------------------------------------------------------------

## 10.5 Technical Detail

Technical information such as:

-   resistance profile;
-   technique cues;
-   common mistakes;
-   programming notes;
-   evidence notes

should be available through progressive disclosure.

Do not force a beginner to read technical material before understanding
the exercise's purpose.

------------------------------------------------------------------------

# 11. Search

Search is a core MVP capability.

At minimum it should search across:

-   exercise name;
-   summary;
-   why this exists;
-   body regions;
-   primary targets;
-   secondary targets;
-   movement patterns;
-   mirror effect;
-   best-used-when;
-   equipment.

Example searches:

``` text
upper chest
side delt
lat width
hamstring
rear delt
cable chest
```

Search does not need semantic AI in Phase 3.

Use the structured metadata already available.

------------------------------------------------------------------------

# 12. Filtering

Minimum useful filters:

### Body region

### Equipment

### Exercise type

### Laterality

### Setup time

### Fatigue cost

### Coverage category

Filters should be composable.

Example:

``` text
Chest
+
Cable
+
Isolation
+
Low fatigue
```

The result should update immediately.

Do not add filters simply because corresponding metadata exists. A
filter belongs in the UI only if it helps a real exercise-selection
decision.

------------------------------------------------------------------------

# 13. Decision Maker v0.1

This is the core feature of Phase 3.

The user should be able to answer a small number of practical questions.

Do not create a giant questionnaire.

------------------------------------------------------------------------

## Step 1 --- What are you training?

Example:

``` text
Chest
Back
Shoulders
Arms
Core
Hips
Quads
Hamstrings
Calves
...
```

------------------------------------------------------------------------

## Step 2 --- What are you trying to accomplish?

The initial goals should be derived from the existing knowledge base
rather than invented independently.

Possible examples:

``` text
Build the main training base
Add a different stimulus
Improve a specific visual area
Train with low fatigue
Train with limited equipment
Replace an exercise
Add something that complements my current exercise
```

The engineering team should map each goal to available structured
fields.

Do not create unsupported recommendation categories.

------------------------------------------------------------------------

## Step 3 --- What constraints matter?

Keep this small.

Possible constraints:

``` text
Equipment available
Time/setup
Fatigue tolerance
Stability preference
Skill preference
```

Only expose constraints that can be supported reliably by the current
dataset.

------------------------------------------------------------------------

## Step 4 --- Current Exercise (optional)

Allow the user to specify an exercise they are already performing.

This unlocks:

``` text
overlaps_with
complements
alternatives
```

and makes Blueprint meaningfully different from a generic exercise
search.

Example:

> "I'm already doing Incline Dumbbell Press. What should I add?"

The engine should be able to prioritize complementary exercises and
avoid unnecessary overlap.

------------------------------------------------------------------------

# 14. Decision Engine v0.1

The first decision engine must be **deterministic and explainable**.

Do not use an LLM.

Do not use machine learning.

Do not use opaque numerical scoring unless necessary.

Conceptual flow:

``` text
User Goal
   ↓
Body Region
   ↓
Candidate Exercises
   ↓
Equipment Constraints
   ↓
Other Constraints
   ↓
Current Exercise / Overlap
   ↓
Coverage / Role
   ↓
Rank Candidates
   ↓
Generate Explanation
```

------------------------------------------------------------------------

# 15. Recommendation Philosophy

The engine should not say:

> "This is objectively the best exercise."

Instead:

> **"This is the best fit for the constraints you gave me."**

Example:

``` text
Recommended:
Cable Fly

Why:
You already have a pressing movement.
This adds a different chest stimulus with low setup and relatively low systemic fatigue.

Alternative:
Machine Fly

Why:
Similar role with greater stability.
```

The explanation is as important as the recommendation.

------------------------------------------------------------------------

# 16. Recommendation Output

A decision result should contain:

### 🥇 Best Fit

One primary recommendation.

### Why

A short explanation tied directly to user inputs and structured data.

### 🥈 Alternative

A reasonable substitute where available.

### ⚠️ Watch Out

Mention meaningful overlap, high fatigue, equipment requirements, or
another relevant limitation.

### 🔄 Complements

Optional exercises that add something different.

Do not overwhelm the user with ten recommendations.

------------------------------------------------------------------------

# 17. Recommendation Safety Rule

The engine may only recommend an exercise based on fields that actually
exist in the canonical data.

It must never infer unsupported facts such as:

-   guaranteed muscle growth;
-   guaranteed visual changes;
-   injury treatment;
-   medical suitability;
-   exact superiority;
-   exact hypertrophy percentages.

If the dataset cannot support a recommendation confidently, the engine
should say so.

------------------------------------------------------------------------

# 18. Decision Engine Implementation Strategy

Start with **rule-based filtering and ranking**.

A simple candidate pipeline is sufficient:

``` text
1. Filter by body region
2. Filter by target/goal where supported
3. Remove equipment-incompatible exercises
4. Remove explicitly unsuitable exercises
5. Apply current-exercise overlap/complement logic
6. Apply setup/fatigue constraints
7. Rank remaining candidates
8. Explain the top result
```

Do not prematurely build a sophisticated scoring framework.

The first goal is to prove that the knowledge base can produce useful
decisions.

------------------------------------------------------------------------

# 19. Mobile-First UX

The application must prioritize phone usage.

Requirements:

-   responsive layout;
-   large touch targets;
-   minimal typing where possible;
-   collapsible technical detail;
-   no desktop-only navigation assumptions;
-   fast interaction;
-   readable typography;
-   decision results visible without excessive scrolling.

The existing anatomy-reference interaction can be reused/adapted if it
exists in the application implementation, but it is not a Phase 3
blocker.

------------------------------------------------------------------------

# 20. Accessibility & Usability

Minimum requirements:

-   semantic buttons/links;
-   keyboard accessibility;
-   visible focus states;
-   sufficient text contrast;
-   no interaction dependent solely on hover;
-   accessible labels for icons;
-   clear empty/error states.

Do not sacrifice usability for visual effects.

------------------------------------------------------------------------

# 21. Performance

The MVP should load the exercise dataset efficiently.

Because the dataset is currently only \~123 canonical exercises:

> **Do not introduce a database or complex backend for performance
> reasons.**

The dataset is small enough for a client-side MVP unless implementation
proves otherwise.

------------------------------------------------------------------------

# 22. Data Integrity Boundary

The application must not modify canonical YAML.

The application consumes knowledge.

Knowledge changes happen in:

``` text
data/
```

through the established engineering workflow and validation.

The application should treat exercise data as read-only.

------------------------------------------------------------------------

# 23. Error Handling

The application must handle:

### Missing exercise

Show a useful not-found state.

### Invalid relationship

Do not crash.

### Missing optional metadata

Hide the empty section gracefully.

### Validation failure

Development/build process should expose the issue rather than silently
shipping corrupted data.

------------------------------------------------------------------------

# 24. Testing Requirements

At minimum test:

### Data integration

-   all canonical exercises load;
-   no duplicate IDs;
-   expected body regions appear.

### Search

-   exact name search;
-   partial search;
-   target/movement search.

### Filtering

-   individual filters;
-   combined filters;
-   no-result state.

### Exercise detail

-   valid relationships render;
-   missing optional data does not break layout.

### Decision Maker

Test representative scenarios:

1.  Goal-only selection.
2.  Equipment restriction.
3.  Low-fatigue constraint.
4.  Existing exercise + complement request.
5.  Existing exercise + alternative request.
6.  No suitable result.

### Mobile

Test the primary flows at phone width.

------------------------------------------------------------------------

# 25. Definition of Done

Phase 3 MVP is complete when:

-   [ ] Application runs locally with a documented command.
-   [ ] Canonical YAML loads into the application.
-   [ ] No exercise knowledge is duplicated in UI code.
-   [ ] Body-region browsing works.
-   [ ] Exercise list works.
-   [ ] Search works.
-   [ ] Core filters work.
-   [ ] Exercise detail works.
-   [ ] Mirror effect is visible.
-   [ ] Relationships are understandable.
-   [ ] Decision Maker flow works.
-   [ ] Decision Maker produces deterministic recommendations.
-   [ ] Recommendations include explanations.
-   [ ] Recommendations respect equipment constraints.
-   [ ] Recommendations respect relevant current-exercise
    overlap/complement information.
-   [ ] Missing optional metadata does not break the UI.
-   [ ] Mobile layout is usable.
-   [ ] Core tests pass.
-   [ ] Existing `npm run validate-data` remains passing.
-   [ ] Documentation explains how to run the application.

------------------------------------------------------------------------

# 26. Explicitly Out of Scope for MVP

Do NOT implement:

-   user authentication;
-   accounts;
-   cloud database;
-   workout history;
-   sets/reps logging;
-   progression tracking;
-   nutrition;
-   calorie tracking;
-   social features;
-   AI chatbot;
-   LLM API integration;
-   machine-learning recommendations;
-   wearable integration;
-   advanced analytics;
-   personalization based on long-term user history.

These may be considered after the MVP has been used in practice.

------------------------------------------------------------------------

# 27. Success Criterion

The MVP succeeds if the project owner can use it during an actual gym
session and answer questions such as:

> "What should I add after this exercise?"

> "What is the purpose of this variation?"

> "What can I use instead?"

> "Am I choosing something that overlaps with what I already did?"

> "What exercise gives me a different stimulus without adding a lot of
> fatigue?"

If the application can answer these questions quickly and explainably,
**Phase 3 has succeeded.**

------------------------------------------------------------------------

# 28. Architect's Implementation Direction

This phase should be implemented **quickly and incrementally**.

Recommended order:

``` text
3A — Application skeleton
        ↓
3B — Load canonical data
        ↓
3C — Knowledge Explorer
        ↓
3D — Exercise Detail
        ↓
3E — Search + Filters
        ↓
3F — Decision Engine v0.1
        ↓
3G — Decision Maker UI
        ↓
3H — Mobile / usability pass
        ↓
3I — MVP validation
```

Do not spend weeks polishing architecture before a usable vertical slice
exists.

The preferred development strategy is:

> **Build one complete path from YAML → UI → decision → explanation as
> early as possible.**

Then expand.

------------------------------------------------------------------------

# 29. Final Architectural Principle

Until Phase 2, the project's main question was:

> **"Can we trust the knowledge?"**

Phase 3 changes the question to:

> **"Can a real person use the knowledge to make a better decision?"**

The answer must come from the application, not another documentation
phase.

> **Build the smallest useful Blueprint. Put it in the user's hands.
> Learn from actual use. Then improve it.**
