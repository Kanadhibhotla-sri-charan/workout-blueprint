# Physique Blueprint — Phase 4C Final Correction
## Aesthetic Exercise Role Architecture

**Status:** Approved for implementation  
**Purpose:** Finalize the deterministic exercise-selection layer identified during adversarial testing.

---

# 1. Executive Decision

The current Phase 4 / Phase 4B / Phase 4C architecture is fundamentally sound.

The following are already approved and must be preserved:

- Aesthetic Outcome as the primary physique-problem entry point
- Appearance / Function separation
- Direct / Advanced target path
- Primary vs supporting physique-target semantics
- Target-aware exercise ranking
- Aesthetic-specific suitability layer
- Programming profiles
- Contextual intensity-technique selection
- Technical explanations
- Full-body aesthetic taxonomy
- Existing Phase 2 / Phase 3 functionality
- Brachialis / side-arm-thickness correction
- Lower-calf / soleus correction
- Overall-quad-mass correction
- Programming-profile classification correction

Do **not** restart Phase 4.

Do **not** introduce another generic scoring system.

Do **not** introduce AI, ML, probabilistic ranking, or opaque weights.

This document defines the final missing layer:

> **Aesthetic Exercise Role**

The purpose is to let the engine distinguish between exercises that all train the correct target but have different usefulness for the **specific visual problem** the user selected.

---

# 2. The Problem This Solves

The current engine has already learned:

> **Which physique target contributes to the visual problem?**

But some exercises can still compete incorrectly because several exercises share the same target.

For example:

```text
Aesthetic:
Calves don't look wide / don't have shape

Primary target:
Gastrocnemius

Candidate exercises:
Standing Calf Raise
Leg Press Calf Raise
Seated Calf Raise
```

All may have a valid relationship with the target.

But they do not have the same role for the aesthetic objective.

The knowledge base already supports the distinction:

```text
Standing Calf Raise
→ strong direct calf-width / shape role

Leg Press Calf Raise
→ useful secondary volume

Seated Calf Raise
→ primarily useful for soleus / lower-calf development
```

The engine needs a deterministic way to preserve that knowledge.

---

# 3. Final Architecture

The final recommendation chain becomes:

```text
AESTHETIC OUTCOME
        ↓
PRIMARY / SUPPORTING TARGET
        ↓
AESTHETIC EXERCISE ROLE
        ↓
EXERCISE
        ↓
STIMULUS / PROGRAMMING PROFILE
        ↓
FATIGUE / SETUP / EQUIPMENT
        ↓
FINAL RECOMMENDATION
```

Each layer answers a different question:

```text
Aesthetic Outcome
→ What does the user want to change visually?

Physique Target
→ What development contributes to that appearance?

Aesthetic Exercise Role
→ Which exercises are especially useful for this exact visual problem?

Exercise
→ Which concrete movement should the user perform?

Programming Profile
→ How should that movement generally be trained?

Programming
→ How much, how hard, and how often?

Intensity Technique
→ Is an advanced technique useful here?

Progression
→ How does the user improve over time?
```

---

# 4. Introduce `Aesthetic Exercise Role`

Add an explicit deterministic role concept.

The initial role vocabulary should be:

```text
PRIMARY
DIRECT
SECONDARY
SUPPORTING
UNSPECIFIED
```

Do not add more role types unless real-world use demonstrates a genuine need.

---

# 5. Meaning of Each Role

## PRIMARY

The exercise is one of the strongest general tools for building the development responsible for the selected visual characteristic.

Examples:

```text
Overall quad mass
→ Squat / Leg Press

Overall chest development
→ Pressing

Back thickness
→ Rowing
```

---

## DIRECT

The exercise is particularly suited to the **specific visible shape, line, separation, contour, or regional characteristic** represented by the aesthetic outcome.

Examples:

```text
Quad separation above knee
→ Leg Extension

Upper-trap fullness
→ Shrug

Shoulder width
→ Lateral Raise
```

`DIRECT` is intentionally distinct from `PRIMARY`.

A movement can be an especially direct tool for a visual characteristic without being the primary broad mass-builder for the whole region.

---

## SECONDARY

The exercise contributes meaningfully to the aesthetic outcome but is not the preferred first-choice tool.

Example:

```text
Calf width / shape

Standing Calf Raise
→ PRIMARY

Leg Press Calf Raise
→ SECONDARY
```

---

## SUPPORTING

The exercise contributes to the overall appearance but should not displace the primary/direct development.

Example:

```text
Arm side thickness

Brachialis
→ PRIMARY

Triceps
→ SUPPORTING
```

---

## UNSPECIFIED

No explicit aesthetic role has been established for that exercise for that particular aesthetic outcome.

This does **not** mean the exercise is bad.

It means:

> The knowledge base has not established a specific aesthetic role for this exercise in this context.

Unspecified exercises fall back to the existing Phase 4C ranking logic.

---

# 6. Critical Design Rule — Roles Belong to the Aesthetic Outcome

Do **not** define:

```text
Standing Calf Raise = PRIMARY
```

globally.

An exercise can have different roles for different aesthetic outcomes.

Instead define roles in the context of the aesthetic outcome.

Conceptual model:

```yaml
aesthetic_outcome:
  id: calf-width-shape

  primary_targets:
    - gastrocnemius

  exercise_roles:
    primary:
      - standing-calf-raise

    secondary:
      - leg-press-calf-raise

    supporting:
      - seated-calf-raise
```

Another outcome can legitimately use different roles:

```yaml
aesthetic_outcome:
  id: lower-calf-fullness

  primary_targets:
    - soleus

  exercise_roles:
    primary:
      - seated-calf-raise

    secondary:
      - leg-press-calf-raise
```

The exact YAML schema may differ.

The semantic requirement must remain.

---

# 7. Do NOT Create an Exhaustive Exercise Matrix

Do not create:

```text
26 aesthetic outcomes × 123 exercises
```

or any similarly exhaustive matrix.

Only encode explicit roles where the validated knowledge base establishes a meaningful distinction.

For an aesthetic outcome with no explicit exercise roles:

```text
Aesthetic Outcome
    ↓
Primary Target
    ↓
Existing Phase 4C ranking
```

This makes the system incrementally extensible without creating a maintenance nightmare.

---

# 8. Final Ranking Hierarchy

The recommendation engine should use the following deterministic hierarchy:

```text
1. Target tier
2. Aesthetic Exercise Role
3. Existing Stimulus / Programming ranking
4. Fatigue
5. Setup
6. Equipment constraints
7. Deterministic tie-breaker
```

Where target tier is:

```text
PRIMARY TARGET
    >
SUPPORTING TARGET
    >
GENERAL / REGIONAL
```

And within a target tier:

```text
PRIMARY
    >
DIRECT
    >
SECONDARY
    >
SUPPORTING
    >
UNSPECIFIED
```

This is a **lexicographic hierarchy**, not a weighted score.

Do not create arbitrary numerical values such as:

```text
PRIMARY = 10
DIRECT = 8
SECONDARY = 5
...
```

unless those numbers are purely internal implementation constants representing the exact hierarchy.

The system should remain conceptually ordinal and explainable.

---

# 9. Critical Rule — Primary Target Beats Supporting Target

This rule preserves the Phase 4B fix.

Example:

```text
Primary target:
Brachialis

Supporting target:
Triceps
```

A triceps exercise must not outrank a direct brachialis exercise simply because the triceps exercise has a more favorable aesthetic role or generic stimulus property.

The ranking must first establish:

```text
PRIMARY TARGET
```

versus:

```text
SUPPORTING TARGET
```

Only then should aesthetic role refine candidates within that tier.

This prevents the original biceps/side-thickness bug from returning.

---

# 10. Critical Rule — Explicit Aesthetic Role Beats Generic Stimulus

Within the same target tier:

```text
Explicit aesthetic role
```

must take precedence over generic stimulus characteristics.

Example:

```text
Exercise A
→ primary target
→ DIRECT aesthetic role

Exercise B
→ primary target
→ no aesthetic role
→ strong lengthened-position tag
```

Exercise A should win.

The generic stimulus system must not override explicit knowledge about the visual problem.

---

# 11. Critical Rule — Unspecified Falls Back

If no aesthetic role exists:

```text
UNSPECIFIED
```

must not automatically mean:

```text
BAD
```

Instead:

```text
UNSPECIFIED
    ↓
Existing Phase 4C ranking
    ↓
Stimulus / programming profile
    ↓
Fatigue / setup / equipment
```

This is essential for backward compatibility and incremental knowledge expansion.

---

# 12. Fix #1 — Calf Width / Shape

Permanent regression test.

### Input

```text
Appearance
→ Calves
→ Calves look thin / lack width or shape
```

### Expected interpretation

```text
Aesthetic:
Calf width / shape

Primary:
Gastrocnemius
```

### Required roles

Conceptually:

```text
Standing Calf Raise
→ PRIMARY or DIRECT

Leg Press Calf Raise
→ SECONDARY

Seated Calf Raise
→ SUPPORTING / UNSPECIFIED
```

### Required behavior

Standing Calf Raise should outrank Leg Press Calf Raise for this specific aesthetic outcome.

The engine must not allow:

```text
stable-compound
```

or another generic stimulus/profile property to override the explicit aesthetic role.

---

# 13. Fix #2 — Upper-Trap Fullness

Permanent regression test.

### Input

```text
Appearance
→ Neck / Traps
→ Neck-to-shoulder area doesn't look full
```

### Expected interpretation

```text
Primary:
Upper traps
```

### Required roles

Conceptually:

```text
Shrug
→ DIRECT / PRIMARY

Rack Pull
→ SECONDARY / SUPPORTING
```

### Required behavior

Shrug should outrank Rack Pull for this aesthetic-size problem.

Rack Pull remains a valid exercise for other goals such as:

- strength;
- top-of-pull overload;
- broader upper-back development.

The system must distinguish:

> **"Build upper-trap visual fullness."**

from:

> **"Train a heavy top-of-pull compound."**

---

# 14. Fix #3 — Above-the-Knee Quad Separation

Permanent regression test.

### Input

```text
Appearance
→ Quads
→ No visible separation above the knee
```

### Expected interpretation

```text
Primary:
Quads
```

### Required roles

Conceptually:

```text
Leg Extension
→ DIRECT

Reverse Nordic
→ SECONDARY / SUPPORTING
```

### Required behavior

Leg Extension should outrank Reverse Nordic for this specific aesthetic outcome.

Reverse Nordic remains a valid quad-development exercise.

The difference is:

```text
Leg Extension
→ specific shaping / separation role

Reverse Nordic
→ broader quad development
```

---

# 15. Fix #4 — Brachialis Side Thickness

Permanent regression from Phase 4B.

### Input

```text
Appearance
→ Arms
→ Arms look very thin from the side
```

### Expected interpretation

```text
Primary:
Brachialis / arm thickness

Supporting:
Triceps
```

### Required behavior

Direct brachialis exercises must remain ahead of triceps exercises.

Examples:

```text
Hammer Curl
Cross-Body Hammer Curl
Cable Hammer Curl
```

A triceps-only top recommendation fails the test.

---

# 16. Fix #5 — Lower-Calf Fullness

Permanent regression from Phase 4C.

### Input

```text
Appearance
→ Calves
→ Lower calf / near-ankle area looks thin
```

### Expected interpretation

```text
Primary:
Soleus
```

### Required roles

Conceptually:

```text
Seated Calf Raise
→ PRIMARY / DIRECT

Leg Press Calf Raise
→ SECONDARY
```

### Required behavior

Seated Calf Raise should outrank generic calf exercises when the user's problem specifically concerns lower-calf / soleus fullness.

---

# 17. Fix #6 — Shoulder Width

Permanent regression.

### Input

```text
Appearance
→ Shoulders
→ Shoulders don't look wide enough
```

### Expected interpretation

```text
Primary:
Side delt
```

### Required roles

Conceptually:

```text
Lateral Raise
→ PRIMARY / DIRECT

Machine Lateral Raise
→ PRIMARY / DIRECT

Wide-Grip Upright Row
→ SECONDARY

Overhead Press
→ SUPPORTING
```

### Required behavior

A front-delt pressing exercise must not become the primary recommendation for a shoulder-width aesthetic problem.

---

# 18. Fix #7 — Back Width vs Back Thickness

Permanent contrast test.

### Case A — Width

```text
"My back doesn't look wider than my waist."
```

Expected:

```text
Aesthetic:
Back width / V-taper

Primary:
Lat / width target
```

Exercise roles should favor width-oriented movements.

### Case B — Thickness

```text
"My back looks wide but still looks thin from behind."
```

Expected:

```text
Aesthetic:
Back thickness

Primary:
Mid/upper-back thickness target
```

Exercise roles should favor thickness-oriented movements.

The two cases must not collapse into the same ranking.

---

# 19. Explanation Layer

The new role should improve the explanation shown to the user.

Example:

### Leg Extension

```text
Why this exercise?

Primary target:
Quads

Aesthetic role:
Direct

Why:
This is a particularly targeted option for the specific
above-the-knee separation you're trying to improve.
```

### Reverse Nordic

```text
Why this alternative?

Primary target:
Quads

Aesthetic role:
Secondary

Why:
It still develops the quads, but it is a broader development
option rather than the most specific tool for this visual goal.
```

The UI does not need to expose the literal role name if that feels too technical.

The important thing is that the explanation communicates the distinction.

---

# 20. Recommendation Trace

Keep enough internal information available in development/debug mode to explain why an exercise won.

Conceptual trace:

```text
Exercise:
Seated Calf Raise

Target:
Soleus

Target Tier:
PRIMARY

Aesthetic Role:
DIRECT

Stimulus Profile:
Stable Isolation

Fatigue:
Low

Final Reason:
Primary-target match + direct aesthetic role
```

Another example:

```text
Exercise:
Rack Pull

Target:
Upper Traps

Target Tier:
PRIMARY

Aesthetic Role:
SECONDARY

Stimulus Profile:
Heavy Compound

Final Reason:
Valid primary-target exercise but less specific to this
aesthetic outcome than a direct shrug.
```

This trace is important for future debugging.

---

# 21. Programming Profile Rule

Preserve the Phase 4C programming-profile correction.

Canonical exercise type must determine the base programming family before coverage metadata refines it.

Use:

```text
exercise_type
    ↓
base programming profile
    ↓
coverage categories / stimulus metadata
    ↓
refinements
```

Do not allow a coverage category such as:

```text
stable-compound
```

to incorrectly turn:

```text
exercise_type = isolation
```

into a compound programming profile.

---

# 22. Intensity Techniques

Do not redesign the Phase 4B/4C intensity-technique layer as part of this change.

Continue verifying:

- Drop Set is not universal.
- Rest-Pause can be selected when appropriate.
- Myo-Reps can be selected when appropriate.
- No intensity technique is a valid output.
- Heavy/high-skill compounds do not receive inappropriate techniques.
- Technique explanations are contextual.

Only modify this area if regression testing identifies a concrete defect.

---

# 23. No New Scoring System

This is a hard constraint.

Do NOT implement:

```text
Aesthetic suitability = 0.37
Target relevance = 0.29
Stimulus = 0.18
Fatigue = 0.11
...
```

Do not introduce:

- machine learning;
- LLM-based ranking;
- probabilistic ranking;
- hidden recommendation weights;
- arbitrary confidence values.

The hierarchy must remain deterministic and inspectable.

---

# 24. No Exhaustive Mapping

Do NOT manually map every exercise to every aesthetic outcome.

Only add explicit roles where the knowledge base has a meaningful, defensible distinction.

Example:

```text
Calf width:
Standing Calf Raise → PRIMARY
Leg Press Calf Raise → SECONDARY
```

is useful.

Creating roles for every calf exercise simply to fill a table is not.

---

# 25. Validation Requirements

Run the existing test suite first.

Then add/verify:

### Target hierarchy

- [ ] Primary target beats supporting target.
- [ ] Supporting target remains available as an alternative.
- [ ] Original brachialis/side-thickness regression passes.

### Aesthetic roles

- [ ] Explicit PRIMARY role ranks correctly.
- [ ] DIRECT role ranks correctly.
- [ ] SECONDARY role ranks below PRIMARY/DIRECT where appropriate.
- [ ] SUPPORTING role does not displace primary-target work.
- [ ] UNSPECIFIED falls back to the existing engine.

### Specific negative cases

- [ ] Calf width → Standing Calf Raise over Leg Press Calf Raise.
- [ ] Upper-trap fullness → Shrug over Rack Pull.
- [ ] Above-knee separation → Leg Extension over Reverse Nordic.
- [ ] Lower-calf fullness → Seated Calf Raise.
- [ ] Shoulder width → Lateral Raise family.
- [ ] Back width and thickness produce meaningfully different results.
- [ ] Brachialis side thickness remains correct.

### Programming

- [ ] Exercise type remains the canonical base classifier.
- [ ] No isolation exercise is accidentally classified as a compound profile.
- [ ] No compound exercise is accidentally classified as an isolation profile.
- [ ] Existing intensity-technique tests pass.

### Consistency

For every golden case:

```text
Aesthetic Outcome
    ↕
Technical Explanation
    ↕
Primary / Supporting Target
    ↕
Aesthetic Exercise Role
    ↕
Exercise Recommendation
    ↕
Programming
```

must remain internally consistent.

---

# 26. Acceptance Criteria

This correction is complete when:

- [ ] `Aesthetic Exercise Role` exists as a deterministic concept.
- [ ] Roles are contextual to an aesthetic outcome.
- [ ] Roles are not global properties of an exercise.
- [ ] PRIMARY / DIRECT / SECONDARY / SUPPORTING / UNSPECIFIED are supported.
- [ ] Primary-target hierarchy remains stronger than supporting-target roles.
- [ ] Explicit aesthetic role overrides generic stimulus ranking within the same target tier.
- [ ] Unspecified exercises fall back safely to the existing engine.
- [ ] No exhaustive exercise × aesthetic-outcome matrix has been introduced.
- [ ] Calf width regression passes.
- [ ] Upper-trap fullness regression passes.
- [ ] Above-knee quad-separation regression passes.
- [ ] Brachialis side-thickness regression passes.
- [ ] Lower-calf regression passes.
- [ ] Shoulder-width regression passes.
- [ ] Back width/thickness contrast passes.
- [ ] Programming-profile classification remains correct.
- [ ] Intensity-technique behavior remains correct.
- [ ] Existing Phase 2 / 3 / 4B / 4C tests continue to pass.
- [ ] Mobile UX remains functional.
- [ ] No AI/ML/opaque scoring has been introduced.

---

# 27. Implementation Order

Implement exactly in this order:

```text
4C-F1
Define Aesthetic Exercise Role model
        ↓
4C-F2
Implement contextual role mapping on aesthetic outcomes
        ↓
4C-F3
Implement deterministic ranking hierarchy
        ↓
4C-F4
Preserve primary-target-over-supporting-target rule
        ↓
4C-F5
Add explicit role precedence over generic stimulus
        ↓
4C-F6
Implement UNSPECIFIED fallback
        ↓
4C-F7
Add calf-width regression
        ↓
4C-F8
Add upper-trap regression
        ↓
4C-F9
Add above-knee separation regression
        ↓
4C-F10
Verify all previous Phase 4B/4C regressions
        ↓
4C-F11
Run complete test / build / lint / data validation
        ↓
4C-F12
Run final real-world adversarial use cases
```

Do not add additional architecture unless a test exposes a concrete requirement that cannot be represented by this model.

---

# 28. Final Architect Principle

Phase 4B taught the system:

> **Choose the correct target.**

Phase 4C taught the system:

> **Choose an exercise that fits the visual problem.**

The final correction makes that relationship explicit:

> **Among exercises that train the correct target, know what role each exercise plays in solving this exact aesthetic problem.**

The final system should therefore reason:

```text
WHAT DO I SEE?
        ↓
Aesthetic Outcome
        ↓
WHAT CONTRIBUTES TO IT?
        ↓
Primary / Supporting Targets
        ↓
WHAT ROLE DOES EACH EXERCISE PLAY?
        ↓
Aesthetic Exercise Role
        ↓
WHICH EXERCISE FITS BEST?
        ↓
Exercise
        ↓
HOW DOES IT TRAIN?
        ↓
Stimulus / Programming Profile
        ↓
HOW SHOULD I TRAIN IT?
        ↓
Sets / Reps / RIR / Volume / Frequency
        ↓
SHOULD I USE AN INTENSITY TECHNIQUE?
        ↓
Technique Suitability
        ↓
HOW DO I PROGRESS?
        ↓
Progression
```

The Blueprint should no longer stop at:

> **"This exercise trains the muscle."**

It should be capable of saying:

> **"This exercise trains the relevant muscle and has the appropriate role for the exact visual characteristic you're trying to change."**

---

# 29. Project Boundary After This Correction

This should be treated as the **final planned architecture correction for the current Blueprint version**.

Once this implementation passes the adversarial tests:

**STOP adding architecture.**

Move to actual use.

Future changes should normally be:

```text
Real-world user discovers knowledge defect
        ↓
Identify incorrect / missing knowledge
        ↓
Fix the relevant data entry or rule
        ↓
Add regression test
        ↓
Ship
```

Do not create another architectural phase simply because a new exercise or aesthetic outcome needs a knowledge entry.

The objective now is to finish the system and use it.
