# Physique Blueprint — Phase 4
## Physique Target + Hypertrophy Programming Layer

**Document Type:** Architect-to-Engineering Implementation Specification  
**Phase:** 4  
**Status:** Approved for implementation  
**Owner:** Solution Architecture  
**Implementation Team:** Claude Code / Engineering  
**Prerequisite:** Phase 3 — Blueprint MVP — Complete

---

# 0. Executive Decision

Phase 3 proved that the existing knowledge base can power a useful exercise-selection application.

The next requirement has now been identified through actual use:

> The current application is very effective at helping a beginner choose an exercise, but it is not yet precise enough for an intermediate user who already understands basic muscle groups and exercise roles.

Phase 4 therefore adds a layer **above exercise selection**.

The application must move from:

```text
Muscle Group
    ↓
Exercise
```

to:

```text
Physique Goal
    ↓
Specific Physique Target
    ↓
Anatomical / Functional Target
    ↓
Exercise Selection
    ↓
Hypertrophy Programming
    ↓
Progression
```

The goal is **not** to replace the Phase 3 decision engine.

The goal is to give it more precise inputs and add a practical growth-oriented programming layer.

---

# 1. Phase 4 Product Goal

Phase 4 should allow a user to ask questions such as:

> "I want my upper chest to grow more."

> "My side delts are lagging and I want wider-looking shoulders."

> "I already do incline DB press. What should I add for upper-pec development without unnecessary redundancy?"

> "I want more back thickness, not more lat width."

> "How should I train this target for hypertrophy?"

The application should then produce an answer containing:

```text
Target
+
Exercise recommendation
+
Why
+
Stimulus
+
Sets
+
Reps
+
RIR
+
Frequency
+
Progression
+
Optional intensity technique
```

This is the transition from:

> **Exercise Decision Maker**

to:

> **Physique Programming Assistant**

---

# 2. Phase 4 Scope

Phase 4 contains two primary capability groups.

## A. Target Precision

Replace broad body-region selection with more useful physique targets.

Examples:

```text
Chest
├── Upper pec
├── Mid chest
└── Lower pec

Shoulders
├── Front delt
├── Side delt
└── Rear delt

Back
├── Lat width
├── Mid-back thickness
└── Upper traps

Arms
├── Biceps
├── Brachialis / arm thickness
└── Triceps
    └── Long-head emphasis

Core
├── Upper abs
├── Lower abs
└── Obliques
```

The exact taxonomy must be derived from the validated knowledge base and Phase 1/2 terminology.

Do not invent arbitrary anatomical claims.

---

## B. Growth-Oriented Programming

Add a practical programming layer covering:

- hypertrophy rep guidance;
- effort / RIR;
- weekly volume;
- session volume;
- frequency;
- progression;
- stimulus characteristics;
- optional intensity techniques.

These should be expressed as **practical ranges and decision guidance**, not rigid physiological laws.

---

# 3. Important Architectural Principle

Phase 4 must NOT turn the application into a black-box AI coach.

The core recommendation system remains deterministic.

Architecture:

```text
User
 ↓
Structured target / constraints
 ↓
Deterministic Blueprint engine
 ↓
Exercise selection
 ↓
Programming layer
 ↓
Explainable recommendation
```

Natural-language AI is **not required for Phase 4 MVP**.

If natural-language input is introduced later, its role should be:

```text
Natural language
       ↓
Intent interpretation
       ↓
Structured Blueprint intent
       ↓
Existing deterministic engine
```

AI must not become the source of exercise or programming knowledge.

---

# 4. Target Precision Model

The current Phase 3 body-region choices are too broad for the intended intermediate use case.

Instead of:

```text
Chest
Back
Shoulders
```

the user should be able to select a specific target such as:

```text
Upper pec
Side delt
Lat width
Back thickness
Lower abs
Brachialis / arm thickness
```

---

# 5. Physique Targets vs Anatomical Targets

Do not force every visual goal to equal a literal muscle.

Some useful targets are **physique outcomes**.

Examples:

```text
Shoulder width
    ↓
Primarily side delts

Back width / V-taper
    ↓
Primarily lats

Back thickness
    ↓
Mid-back musculature + relevant upper-back structures

Arm thickness
    ↓
Biceps + brachialis + triceps
```

The schema should preserve the distinction:

```text
Physique outcome
≠
Individual muscle
```

This is important because the user is ultimately interested in what changes visually in the mirror.

---

# 6. Target Selection UX

The Decision Maker should evolve from:

```text
What are you training?
```

to:

```text
What do you want to improve?
```

Example:

```text
Upper chest
Side delts
Lat width
Back thickness
Arm size
Lower abs
Glute development
...
```

The user may optionally choose a broader region first, then drill down:

```text
Chest
  → Upper pec
  → Mid chest
  → Lower pec
```

This should remain fast on mobile.

---

# 7. Target Goals

After selecting a target, ask what the user wants to accomplish.

Initial goal types should be limited to use cases supported by the knowledge base:

```text
Build / grow
Bring up a lagging area
Improve visual proportions
Maintain
Replace an exercise
Add a complementary stimulus
```

Do not create dozens of goal categories.

---

# 8. Current Exercise Context

Preserve the Phase 3 ability to specify what the user is already doing.

Example:

```text
Target:
Upper pec

Already doing:
Incline Dumbbell Press
```

The engine should then use:

```text
overlaps_with
complements
exercise role
coverage
stimulus characteristics
```

to avoid blindly recommending another redundant movement.

---

# 9. Stimulus Layer

Phase 4 should introduce a structured description of **why an exercise is useful for the target**.

Relevant dimensions may include:

```text
Primary target
Movement role
Lengthened-position loading
Mid-range loading
Shortened-position loading
Stability
Local fatigue
Systemic fatigue
Resistance profile
Progression potential
```

Only include dimensions that can be supported reliably by the current knowledge base or are explicitly researched and approved during Phase 4.

Do not invent values merely to populate the schema.

---

# 10. Hypertrophy Rep Guidance

The programming layer should provide practical rep guidance.

Use ranges, not magical numbers.

Example conceptual structure:

```text
Primary hypertrophy range
Acceptable broader range
Practical reason
```

Illustrative output:

```text
Cable isolation:
Primary: ~10–20 reps
```

```text
Stable compound:
Primary: ~6–15 reps
```

These are examples of presentation structure, not hardcoded universal values.

The final values must be established through the project's evidence/research process.

---

# 11. Effort / RIR

Introduce **RIR — Reps In Reserve** as a core programming variable.

Example output:

```text
Most working sets:
~1–3 RIR
```

The system should explain RIR in beginner-friendly language:

> "Finish the set when you feel you could still perform roughly 1–3 good reps."

Do not equate:

```text
failure = maximum growth
```

The application should distinguish:

```text
hard training
```

from:

```text
mandatory momentary failure
```

RIR should be presented as practical effort guidance, not a laboratory-precise measurement.

---

# 12. Weekly Volume

The programming layer should eventually provide:

```text
Starting volume
Productive range
High-volume / recovery-dependent range
```

Avoid rigid claims such as:

> "Every muscle requires exactly X sets."

Volume should be treated as a variable that can be adjusted based on:

- training experience;
- recovery;
- current workload;
- performance;
- lagging status;
- frequency.

The UI should communicate practical ranges rather than false precision.

---

# 13. Frequency

Provide practical frequency guidance.

The application should distinguish:

> **How often a muscle can be trained**

from:

> **How often it is useful to distribute its weekly workload.**

A practical default may be expressed as a range rather than a single mandatory frequency.

Example:

```text
Typical starting point:
2–3 exposures/week
```

The final guidance must be evidence-reviewed before becoming canonical knowledge.

Do not hardcode "3× per week" as a universal rule.

---

# 14. Session Volume

The programming layer should translate weekly volume into practical sessions.

Example conceptual output:

```text
Weekly:
~10–16 hard sets

If training 2×/week:
~5–8 sets/session
```

Again, these are examples of the model, not approved universal numbers.

The engine should avoid recommending an unrealistic amount of work in one session simply because a weekly number exists.

---

# 15. Progression

Phase 4 must introduce a simple progression model.

Preferred initial approach:

### Double progression

Example:

```text
Target:
8–12 reps

Start with a load that allows:
8–10 reps at target RIR

Over subsequent sessions:
10 → 11 → 12 reps

Once the target is reached with appropriate RIR:
increase load slightly

Then repeat.
```

The UI should explain this simply.

Do not build a complex periodization system during Phase 4.

---

# 16. Intensity Techniques

Phase 4 may introduce optional techniques such as:

```text
Drop sets
Rest-pause
Myo-reps
Lengthened partials
Mechanical drop sets
Supersets
```

But these must be treated as **tools**, not mandatory hypertrophy multipliers.

Each technique should have:

```text
What it is
When it may help
When not to use it
Fatigue/time implications
Suitable exercise types
```

The recommendation engine should only suggest an intensity technique when it has a clear reason.

Example:

> "A drop set may be useful here if you want to increase work density on an isolation movement without adding another full working set."

Do not claim that an intensity technique is automatically superior for growth.

---

# 17. Fiber-Type Information

Fiber-type information may be included as educational context, but it must NOT become simplistic programming rules.

Avoid logic such as:

```text
Fast fibers → 5–8 reps
Slow fibers → 15–20 reps
```

Do not use fiber-type labels to produce rigid exercise prescriptions.

If fiber information is included, it should explain that practical hypertrophy programming depends on broader factors such as:

- loading;
- effort;
- exercise selection;
- volume;
- recovery;
- progression.

The system should prioritize actionable programming variables over fiber-type trivia.

---

# 18. Target → Exercise → Programming Pipeline

The completed Phase 4 decision flow should look like:

```text
User
 ↓
What do you want to improve?
 ↓
Specific physique target
 ↓
What are you already doing?
 ↓
Constraints
 ↓
Blueprint Exercise Engine
 ↓
Best exercise / alternative / complement
 ↓
Hypertrophy Programming Layer
 ↓
Sets
Reps
RIR
Frequency
Progression
Optional technique
 ↓
Explanation
```

---

# 19. Example Final Recommendation

A future result might look conceptually like:

## 🎯 Target
**Side delts**

### 👀 Goal
Increase apparent shoulder width.

### 🥇 Best fit
**Cable Lateral Raise**

### Why
You are targeting the side delt directly and the cable setup can provide useful resistance through the movement without requiring another heavy pressing movement.

### 📊 Programming
**3 sets × 10–20 reps**

**~1–3 RIR**

**2–4 exposures/week**, adjusted to total weekly workload and recovery.

### 📈 Progression
When you can reach the top of the rep range while maintaining the target RIR, increase resistance slightly and rebuild reps.

### ⚡ Optional
A final-set intensity technique may be used when time efficiency is important.

### ⚠️ Watch out
Avoid turning every session into high-fatigue failure work.

**Important:** The exact values shown above are illustrative. They must not become canonical defaults until they have been evidence-reviewed and approved.

---

# 20. Evidence & Research Requirement

This is the first phase where the project needs a dedicated **training-programming evidence layer**.

Before programming values become canonical, research should establish defensible guidance for:

- hypertrophy loading ranges;
- proximity to failure / RIR;
- weekly volume;
- frequency;
- progression;
- exercise-specific programming;
- intensity techniques;
- lengthened vs shortened-position training;
- practical stimulus/fatigue considerations.

The evidence should be documented rather than hidden inside application code.

Suggested location:

```text
docs/knowledge-manual/programming/
```

or another repository location chosen by engineering.

The canonical programming data should remain separate from the UI.

---

# 21. Programming Knowledge Schema

Do not immediately attach every programming variable directly to every exercise.

First determine which information is:

### Global programming guidance

Applies broadly.

Examples:

```text
RIR guidance
weekly volume principles
frequency principles
progression principles
```

### Target-specific guidance

Applies to a target.

Examples:

```text
side delt
upper pec
lat width
```

### Exercise-specific guidance

Applies because of the exercise's characteristics.

Examples:

```text
appropriate rep range
fatigue characteristics
stability
intensity technique suitability
```

Keep these layers separate.

This prevents the YAML from becoming a giant repeated block of nearly identical programming text.

---

# 22. Data Architecture

The preferred architecture becomes:

```text
                  KNOWLEDGE
                     │
        ┌────────────┴────────────┐
        ↓                         ↓
Exercise Knowledge         Programming Knowledge
        │                         │
        └────────────┬────────────┘
                     ↓
              Decision Engine
                     ↓
              Recommendation
```

The existing exercise YAML remains canonical for exercise knowledge.

Programming knowledge should have its own canonical structure if it grows beyond a small number of fields.

Do not duplicate programming guidance inside multiple exercise records without a clear reason.

---

# 23. Natural-Language Input — Deferred

A future interface may allow:

> "My shoulders look narrow and I want more width."

But this is NOT required for Phase 4 MVP.

First build the structured target-selection flow.

If later implemented:

```text
Natural language
 ↓
Intent extraction
 ↓
Structured target
 ↓
Existing engine
```

The AI layer must not directly invent:

- exercises;
- sets;
- reps;
- frequency;
- physiological claims.

---

# 24. UI Changes

The Phase 3 Decision Maker should evolve rather than be replaced.

Current:

```text
Body Region
 ↓
Goal
 ↓
Constraints
```

Phase 4:

```text
What do you want to improve?
 ↓
Specific physique target
 ↓
Goal
 ↓
Current exercise (optional)
 ↓
Constraints
 ↓
Recommendation
 ↓
Programming prescription
```

The existing Exercise Explorer and Exercise Detail pages should continue working.

---

# 25. Recommendation Output

The Phase 4 result should contain:

### 🎯 Target

What the user is actually trying to improve.

### 👀 Visual objective

What change the user should expect to see over time, where supported.

### 🥇 Exercise

Best fit.

### Why

Short explanation.

### 🧬 Stimulus

Why the movement is relevant to the target.

### 📊 Programming

- sets;
- reps;
- RIR;
- frequency;
- progression.

### ⚡ Optional technique

Only when useful.

### 🔄 Alternative

Where available.

### ⚠️ Watch out

Relevant redundancy, fatigue, setup, or limitation.

---

# 26. No False Precision

The app must avoid presenting uncertain programming advice as exact science.

Prefer:

```text
~1–3 RIR
~2–3 exposures/week
~10–16 hard sets/week
```

over:

```text
Exactly 2 RIR
Exactly 3 sessions
Exactly 14 sets
```

Use language such as:

```text
starting point
typical range
practical range
adjust based on recovery and performance
```

where appropriate.

---

# 27. Phase 4 Testing

Test at least these scenarios:

### Target precision

- Upper pec
- Side delt
- Lat width
- Back thickness
- Lower abs
- Arm thickness

### Current-exercise context

```text
Upper pec + Incline DB Press
Back thickness + Lat Pulldown
Hamstrings + RDL
```

### Programming

Verify the application can produce:

- rep guidance;
- RIR guidance;
- weekly volume;
- frequency;
- progression;
- optional intensity technique.

### Constraint interaction

Verify that programming does not recommend an unreasonable workload when the user has:

- high existing volume;
- high fatigue;
- limited training days;
- limited equipment.

### UX

Verify the target-selection flow remains fast on mobile.

---

# 28. Definition of Done

Phase 4 MVP is complete when:

- [ ] User can select a specific physique target rather than only a broad muscle group.
- [ ] Physique targets are mapped to validated anatomical/functional targets.
- [ ] Existing Phase 3 exercise selection still works.
- [ ] Current-exercise context still works.
- [ ] The engine can recommend exercises for a specific target.
- [ ] Recommendations include a clear visual/physique rationale where supported.
- [ ] Hypertrophy rep guidance exists.
- [ ] RIR guidance exists.
- [ ] Volume guidance exists.
- [ ] Frequency guidance exists.
- [ ] Progression guidance exists.
- [ ] Optional intensity techniques can be recommended where appropriate.
- [ ] Programming guidance is evidence-reviewed.
- [ ] No unsupported physiological claims are introduced.
- [ ] Programming knowledge is separated appropriately from exercise knowledge.
- [ ] The existing Phase 2 data validator remains passing.
- [ ] Existing Phase 3 functionality remains passing.
- [ ] Mobile UX remains usable.
- [ ] No AI/ML dependency is required for the Phase 4 MVP.

---

# 29. Explicitly Out of Scope

Do NOT implement during Phase 4:

- LLM-powered coaching;
- free-form AI conversation;
- machine-learning recommendations;
- computer vision;
- body-photo analysis;
- automated physique assessment;
- personalized calorie/nutrition planning;
- injury diagnosis;
- medical recommendations;
- advanced periodization;
- deload prediction;
- recovery prediction;
- wearable integration;
- long-term user profiling.

These may be considered only after the deterministic programming layer has been validated through real use.

---

# 30. Implementation Order

Keep Phase 4 fast.

Recommended sequence:

```text
4A — Define physique-target taxonomy
        ↓
4B — Define programming knowledge model
        ↓
4C — Evidence/research pass
        ↓
4D — Add target-selection UX
        ↓
4E — Connect targets to exercise engine
        ↓
4F — Add programming recommendation layer
        ↓
4G — Add progression guidance
        ↓
4H — Add optional intensity techniques
        ↓
4I — Mobile/usability pass
        ↓
4J — Real-world validation
```

Do not spend weeks building an abstract programming framework before testing one complete target.

The preferred strategy is:

> **Build one complete vertical slice first.**

For example:

```text
Upper Pec
 ↓
Target definition
 ↓
Exercise selection
 ↓
Stimulus
 ↓
Sets / reps / RIR
 ↓
Frequency
 ↓
Progression
 ↓
Explanation
```

Once that works well, expand the model.

---

# 31. Architect's Guardrails

### Guardrail 1
Do not add hundreds of new exercises.

The current exercise knowledge base is sufficient for this phase.

### Guardrail 2
Do not turn every physiological concept into a database field.

Only capture information that changes a practical decision.

### Guardrail 3
Do not create rigid "optimal" numbers without evidence.

### Guardrail 4
Do not use fiber types as simplistic rep-range rules.

### Guardrail 5
Do not make failure training mandatory.

### Guardrail 6
Do not treat advanced intensity techniques as magic growth multipliers.

### Guardrail 7
Do not introduce AI just because natural-language input sounds attractive.

### Guardrail 8
Do not duplicate programming knowledge across every exercise record when a shared rule would suffice.

### Guardrail 9
Keep explanations understandable to an intermediate trainee.

### Guardrail 10
If the application cannot confidently answer something from validated knowledge, it should say so rather than inventing an answer.

---

# 32. Final Product Vision

After Phase 4, a user should be able to open Blueprint and ask, in structured form:

```text
WHAT DO I WANT TO IMPROVE?
        ↓
Upper pec
        ↓
WHAT AM I ALREADY DOING?
        ↓
Incline DB Press
        ↓
WHAT MATTERS?
        ↓
More growth + low redundancy
        ↓
BLUEPRINT
        ↓
Exercise
+
Stimulus
+
Sets
+
Reps
+
RIR
+
Frequency
+
Progression
+
Optional intensity technique
+
Why
```

That is the intended transition:

```text
Phase 3
"Which exercise should I choose?"

             ↓

Phase 4
"Which exercise should I choose,
and how should I train it for growth?"

             ↓

Future
"How should my entire physique be developed,
balanced, progressed, and adjusted over time?"
```

---

# 33. Final Principle

The project is no longer trying to become:

> **the biggest exercise database.**

It is becoming:

> **a transparent decision system for building a better physique.**

The knowledge base exists to support decisions.

The application exists to make those decisions understandable.

The programming layer exists to turn those decisions into actionable training.

And the user should always be able to understand:

> **What should I do?**
>
> **Why should I do it?**
>
> **How should I perform/program it?**
>
> **How do I know when to progress?**

That is the definition of a successful Phase 4.
