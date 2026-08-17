# Physique Blueprint — Phase 4B
## Recommendation & Programming Intelligence Refinement

**Status:** Approved for implementation  
**Prerequisite:** Latest Phase 4 build  
**Purpose:** Correct the recommendation/programming disconnects identified during real-world use testing.

---

# 1. Executive Decision

The latest Phase 4 build has the correct high-level architecture and a strong knowledge base.

Do **NOT** restart Phase 4.

Do **NOT** expand the exercise database merely to address these issues.

The problems identified are primarily in how the existing knowledge is being consumed by the recommendation and programming engines.

The required refinement is:

```text
Aesthetic Outcome
        ↓
Primary / Supporting Physique Targets
        ↓
Target-aware Exercise Ranking
        ↓
Stimulus / Exercise Characteristics
        ↓
Programming Profile
        ↓
Sets / Reps / RIR / Volume / Frequency
        ↓
Intensity Technique
        ↓
Progression
```

The system must preserve the user's original problem all the way through the recommendation.

---

# 2. Issue #1 — Target-Aware Exercise Ranking

## Problem

The current recommendation engine can correctly identify the primary and supporting physique targets, but exercise ranking can subsequently prioritize generic stimulus characteristics over target relevance.

This creates a semantic contradiction.

Example:

```text
User:
"Arms look very thin from the side."

Aesthetic interpretation:
Side-view arm thickness

Technical explanation:
Brachialis is a major contributor to the side-view profile.
Triceps also contribute to overall upper-arm thickness.

Primary target:
Brachialis / arm-thickness development

Supporting target:
Triceps
```

But the recommendation can still surface a triceps exercise above a direct brachialis exercise because the ranking gives too much priority to generic characteristics such as lengthened-position emphasis.

This is incorrect.

---

# 3. Required Ranking Hierarchy

Target relevance must dominate generic exercise characteristics.

Use this conceptual ranking:

```text
Aesthetic Outcome
        ↓
Primary Target
        ↓
Direct Primary-Target Exercises
        ↓
Supporting Targets
        ↓
Direct Supporting-Target Exercises
        ↓
Relevant Curated Complements
        ↓
General Regional Exercises
        ↓
Stimulus Characteristics
        ↓
Fatigue / Setup / Equipment
        ↓
Deterministic Tie-Breakers
```

Within each tier, existing exercise-quality signals may be used.

The critical rule is:

> **An exercise directly targeting the primary physique target must not routinely lose to an exercise that only matches a supporting target because the supporting exercise happens to have a more favorable generic stimulus tag.**

---

# 4. Preserve Target Provenance

When candidate exercises are generated, the engine must retain WHY each exercise entered the candidate pool.

Conceptually:

```yaml
candidate:
  exercise: hammer-curl
  target_match: primary

candidate:
  exercise: cross-body-hammer-curl
  target_match: primary

candidate:
  exercise: overhead-triceps-extension
  target_match: supporting
```

The exact implementation may differ.

The requirement is that the ranking layer can distinguish:

```text
PRIMARY TARGET MATCH
SUPPORTING TARGET MATCH
COMPLEMENT
GENERAL REGIONAL MATCH
```

Do not flatten all candidates into one indistinguishable pool before ranking.

---

# 5. Example — Biceps / Arm Side Thickness

The following must become a permanent regression / golden test.

## Input

```text
Appearance
→ Arms
→ Arms look very thin from the side
```

## Expected interpretation

```text
Aesthetic Outcome:
Side-view arm thickness

Primary:
Brachialis / arm-thickness development

Supporting:
Triceps
```

## Expected recommendation behavior

At least one of the top recommendations should be a direct brachialis-targeted exercise, such as an approved exercise already mapped to:

```text
brachialis-arm-thickness
```

Examples from the existing knowledge base include:

- Hammer Curl
- Cross-Body Hammer Curl
- Cable Hammer Curl

A triceps-only top recommendation should fail this test.

---

# 6. Recommendation Consistency Rule

The technical explanation and exercise recommendation must never contradict each other.

If the explanation says:

> "The brachialis is the primary lever for this visual characteristic."

then the recommendation layer must visibly prioritize exercises that directly address the brachialis target.

If a supporting-target exercise is recommended, the UI should explain that it addresses the supporting contribution.

For example:

```text
Primary reason:
Brachialis / arm thickness

Supporting contribution:
Triceps
```

Then:

> "This exercise directly addresses the primary target."

or:

> "This alternative addresses the supporting triceps contribution."

---

# 7. Do Not Overengineer Ranking

Do NOT introduce:

- machine learning;
- neural networks;
- opaque weighted scoring;
- AI exercise selection;
- probabilistic ranking.

The ranking must remain deterministic and explainable.

The engine should be able to answer:

> "Why did this exercise rank above that one?"

with a traceable reason.

---

# 8. Issue #2 — Programming Is Currently Too Generic

The current programming layer is a useful baseline, but it is largely driven by generic categories such as:

```text
Exercise Type
+
Coverage Category
        ↓
Rep Range
```

and global guidance for:

```text
RIR
Volume
Frequency
Progression
```

This means many variations can receive essentially identical programming.

That is acceptable as a starting point but is not sufficient for the intended intermediate/advanced Blueprint experience.

---

# 9. Do NOT Create 123 Individual Prescriptions

Do NOT solve this by creating a unique programming prescription for every exercise.

Avoid:

```text
Hammer Curl → 3 × 10–12
Cross-Body Hammer Curl → 3 × 8–12
Cable Hammer Curl → 2 × 15–20
...
```

for every exercise.

That would create unnecessary duplication and make the knowledge base difficult to maintain.

Instead introduce a reusable **Programming Profile** concept.

---

# 10. Programming Profile Architecture

Conceptually:

```text
Exercise
   ↓
Stimulus / Exercise Profile
   ↓
Programming Guidance
```

Possible profiles include concepts such as:

```text
Heavy mechanical-tension isolation
Moderate hypertrophy isolation
Constant-tension isolation
Lengthened-position isolation
Stable machine isolation
Stable compound
Free-weight compound
High-fatigue compound
```

These are candidate profile categories, not final prescriptions.

The engineering team must derive the final profiles from the existing exercise metadata and evidence-backed programming knowledge.

---

# 11. Programming Profiles Must Use Existing Knowledge

Use existing exercise attributes where available:

```text
exercise_type
coverage_categories
resistance_profile
stability
fatigue_cost
skill
lengthened-position emphasis
shortened-position emphasis
```

Do not invent arbitrary numerical scores.

The profile should be a deterministic interpretation of existing exercise knowledge.

---

# 12. Programming Should Become Target-Aware

The next layer beyond generic exercise programming is:

```text
Aesthetic Outcome
        ↓
Physique Target
        ↓
Target Programming Profile
        ↓
Exercise Programming Profile
        ↓
Final Recommendation
```

This allows Blueprint to distinguish:

> "What exercise is this?"

from:

> "What are we trying to accomplish with this exercise?"

For example:

```text
Aesthetic:
Shoulders don't look wide

Target:
Side-delt development

Programming context:
High-priority direct target
```

The resulting prescription should reflect the target's priority rather than simply returning the generic programming defaults for "isolation."

---

# 13. Target-Level Volume and Frequency

The programming layer should eventually be able to reason about:

```text
Target priority
Current direct volume
Current indirect volume
Weekly frequency
Exercise overlap
Recovery/fatigue
```

The system should be capable of saying:

> "You already have substantial indirect triceps work from pressing, so add only a modest amount of direct triceps volume."

rather than simply:

> "Triceps: 10–20 sets/week."

This does NOT require advanced recovery prediction.

It requires deterministic accounting of known training volume and overlap.

---

# 14. Keep Generic Guidance

Generic programming guidance remains useful and should not be removed.

The final model should be:

```text
Global Principles
        ↓
Programming Profile
        ↓
Target Context
        ↓
Current Training Context
        ↓
Final Programming Recommendation
```

This preserves the existing evidence-backed baseline while making the result more contextual.

---

# 15. Issue #3 — Intensity Techniques Are Too Primitive

The current knowledge base contains multiple intensity techniques, but the recommendation layer effectively defaults to Drop Set.

This creates the impression that Blueprint supports intensity techniques while functionally recommending one generic technique.

That needs to change.

---

# 16. Intensity Technique Selection

Introduce deterministic technique suitability.

Conceptually:

```text
Exercise
+
Stimulus Profile
+
Fatigue Cost
+
Target Goal
+
Time Constraint
        ↓
Eligible Techniques
        ↓
Rank
        ↓
Recommended Technique
```

Potential techniques already represented in the knowledge base include:

- Drop Set
- Rest-Pause
- Myo-Reps

Additional techniques may be used if they already exist in the validated knowledge base.

Do not expand the technique catalog unnecessarily before the selection system works.

---

# 17. Technique Eligibility

Each technique should have explicit suitability rules.

Conceptually:

```yaml
technique:
  id: myo-reps

  suitable_for:
    - stable_isolation
    - low_skill_exercises

  avoid_for:
    - high_fatigue_compounds
    - technically demanding free-weight movements

  benefits:
    - time efficiency
    - additional near-failure work

  costs:
    - local fatigue
    - reduced recovery margin
```

The exact schema is implementation-dependent.

The principle is:

> **A technique should be recommended because it is appropriate for the exercise and context, not because it is the only technique the engine knows how to display.**

---

# 18. Technique Recommendations Must Be Exercise-Specific

For example:

### Cable Hammer Curl

Potentially eligible:

```text
Drop Set
Rest-Pause
Myo-Reps
```

The engine can choose based on the current context.

### Heavy Barbell Curl

Potentially:

```text
Rest-Pause: possible
Drop Set: conditional
Myo-Reps: less suitable
```

### Heavy Deadlift

Potentially:

```text
Drop Set: not appropriate
Rest-Pause: not appropriate
Myo-Reps: not appropriate
```

These are examples of the intended reasoning pattern, not final hard-coded rules.

---

# 19. Technique Explanation

Every recommended intensity technique should explain:

```text
What it is
Why it is appropriate here
What benefit it provides
What fatigue cost it adds
When not to use it
```

Avoid generic copy such as:

> "Drop sets add more work in less time."

Instead explain the context.

Example:

> "A drop set is suitable here because this is a stable isolation movement where additional near-failure work can be accumulated without the technical demands and systemic fatigue of extending a heavy compound set."

---

# 20. Intensity Techniques Are Optional

Do not force an intensity technique onto every recommendation.

The correct output may be:

> **No intensity technique recommended.**

Reasons may include:

- sufficient stimulus already available;
- exercise is already highly fatiguing;
- technical complexity;
- recovery considerations;
- no meaningful time advantage;
- technique does not add useful value for the selected goal.

This is important.

"Advanced" does not mean "use an intensity technique every session."

---

# 21. Preserve Existing Hypertrophy Programming

Continue providing:

```text
Sets
Reps
RIR
Weekly Volume
Frequency
Progression
```

Use practical ranges rather than false precision.

The current baseline remains approved.

Phase 4B improves contextualization rather than replacing the evidence-backed baseline.

---

# 22. Fiber-Type Information

Fiber-type information may remain educational.

Do NOT convert it into simplistic rules such as:

```text
Fast fibers → low reps
Slow fibers → high reps
```

Programming should continue to prioritize:

- loading;
- effort;
- volume;
- exercise selection;
- recovery;
- progression.

---

# 23. UI — Make the Reasoning Visible

When multiple targets are involved, expose the relationship.

Example:

```text
Why this exercise?

PRIMARY TARGET
Brachialis / arm thickness
✓ Direct match

SUPPORTING TARGET
Triceps
✓ Secondary contribution
```

Then:

```text
Why this variation?

Directly addresses the primary target while fitting
your current exercise selection and fatigue constraints.
```

This makes the recommendation auditable.

---

# 24. Programming UI

The result should distinguish between:

### Baseline

> General hypertrophy guidance for this exercise/profile.

### Your target

> How that guidance is adjusted for the selected physique target.

### Your current routine

> How existing volume/overlap affects the recommendation.

Example:

```text
Programming

Baseline:
8–15 reps
1–3 RIR

For this target:
3 direct sets

Because:
You already receive indirect triceps work from pressing.
```

The exact numbers must come from the validated programming engine.

---

# 25. New Regression / Golden Tests

Add the following permanent tests.

## Test A — Primary target wins

Input:

```text
Arms
→ Appearance
→ Arms look very thin from the side
```

Expected:

```text
Primary:
Brachialis / arm thickness

Supporting:
Triceps
```

Top recommendation must include a direct primary-target exercise.

A triceps-only result fails.

---

## Test B — Supporting target remains available

The same input should still allow a supporting-target triceps recommendation where appropriate.

The UI must explain why it is secondary.

---

## Test C — Programming varies by profile

At least two exercises of different programming profiles should not blindly receive identical programming guidance when their exercise characteristics materially differ.

---

## Test D — Intensity technique selection

Verify that:

- different eligible exercises can receive different technique recommendations;
- no technique can be a valid recommendation;
- Drop Set is not universally returned.

---

## Test E — Explanation consistency

For every golden case:

```text
Technical explanation
        ↕
Target mapping
        ↕
Exercise recommendation
        ↕
Programming
```

must be internally consistent.

If the explanation identifies target A as primary but the recommendation only addresses target B, the test fails.

---

# 26. Acceptance Criteria

Phase 4B is complete when:

- [ ] Primary target relevance dominates generic stimulus ranking.
- [ ] Candidate exercises retain primary/supporting target provenance.
- [ ] Direct primary-target exercises are prioritized appropriately.
- [ ] Supporting-target exercises remain available.
- [ ] The engine no longer allows a generic stimulus tag to routinely override primary-target relevance.
- [ ] The "arms look thin from the side" case recommends at least one direct brachialis exercise.
- [ ] Technical explanations and recommendations are consistent.
- [ ] Programming is no longer solely based on broad exercise type.
- [ ] Reusable programming profiles exist.
- [ ] Existing exercise metadata contributes to programming-profile assignment.
- [ ] Target priority can influence programming.
- [ ] Current training context can influence programming where already supported.
- [ ] Intensity techniques have explicit eligibility/suitability logic.
- [ ] Drop Set is no longer the universal/default technique.
- [ ] The system can legitimately recommend no intensity technique.
- [ ] Intensity explanations are contextual.
- [ ] Existing Phase 2/3 functionality remains intact.
- [ ] Existing aesthetic taxonomy remains intact.
- [ ] Regression/golden tests pass.

---

# 27. Explicit Non-Goals

Do NOT implement:

- AI/LLM exercise selection;
- ML ranking;
- opaque recommendation scores;
- body-photo analysis;
- automatic physique assessment;
- advanced recovery prediction;
- complex periodization;
- personalized nutrition;
- medical advice;
- unique hand-written programming prescriptions for every exercise;
- intensity techniques on every exercise.

The goal is a better deterministic knowledge-driven engine, not a larger or more complicated system.

---

# 28. Implementation Order

Implement in this order:

```text
4B-1
Target-aware candidate ranking
        ↓
4B-2
Primary/supporting target provenance
        ↓
4B-3
Brachialis / arm-side-thickness regression test
        ↓
4B-4
Programming Profile model
        ↓
4B-5
Map existing exercises to programming profiles
        ↓
4B-6
Target-aware programming context
        ↓
4B-7
Intensity-technique eligibility model
        ↓
4B-8
Technique ranking / selection
        ↓
4B-9
Contextual technique explanations
        ↓
4B-10
Programming UI refinement
        ↓
4B-11
Full regression / golden test pass
```

Do not move to later steps if the earlier semantic ranking is still incorrect.

---

# 29. Final Architect Principle

The core problem this refinement solves is:

> **Blueprint currently knows WHY an exercise should be relevant, but the recommendation engine does not always preserve that reason when ranking the exercise.**

That must change.

The complete chain should remain intact:

```text
USER PROBLEM
"My arms look thin from the side."
        ↓
AESTHETIC OUTCOME
Side-view arm thickness
        ↓
PRIMARY TARGET
Brachialis / arm thickness
        ↓
SUPPORTING TARGET
Triceps
        ↓
EXERCISE CANDIDATES
Hammer Curl
Cross-Body Hammer Curl
Cable Hammer Curl
Triceps exercises
        ↓
TARGET-AWARE RANKING
Primary-target exercises first
        ↓
STIMULUS / EXERCISE PROFILE
        ↓
PROGRAMMING
Sets / Reps / RIR / Volume / Frequency
        ↓
INTENSITY TECHNIQUE
Only if appropriate
        ↓
PROGRESSION
```

The user should never receive an answer where:

> **the explanation says one thing needs development while the recommendation primarily trains something else.**

That consistency is now a hard architectural requirement.

---

# 30. Final Instruction to Engineering

The latest Phase 4 knowledge base is strong enough.

**Do not add more exercises just to solve these issues.**

Instead:

> **Make the decision engine better at using the knowledge it already has.**

Fix target-aware ranking first.

Then make programming more contextual.

Then make intensity-technique selection genuinely intelligent but deterministic.

Then validate with the real-world aesthetic cases.

The objective is not to make the system more complicated.

The objective is to make its recommendations **more faithful to the reasoning already encoded in the Blueprint.**
