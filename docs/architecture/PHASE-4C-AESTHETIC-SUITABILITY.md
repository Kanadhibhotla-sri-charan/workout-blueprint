# Physique Blueprint — Phase 4C
## Aesthetic-Specific Exercise Suitability & Programming Refinement

**Status:** Approved for implementation  
**Prerequisite:** Phase 4B complete

---

## 1. Executive Decision

Phase 4/4B is fundamentally sound. Do **not** restart it.

Preserve:

- Aesthetic Outcome as the primary physique entry point
- Appearance / Function separation
- Direct / Advanced target path
- Primary vs supporting target semantics
- Target-aware ranking
- Brachialis / side-arm-thickness regression fix
- Programming profiles
- Intensity-technique selection
- Technical explanations
- Full-body aesthetic taxonomy
- Existing Phase 2 / Phase 3 behavior

The remaining problem is second-order recommendation specificity:

> Once several exercises correctly match the same primary target, generic stimulus characteristics can still select an exercise that is less appropriate for the exact aesthetic problem.

The refined chain is:

```text
Aesthetic Outcome
    ↓
Primary / Supporting Targets
    ↓
Candidate Exercises
    ↓
Aesthetic-Specific Suitability
    ↓
Exercise / Stimulus Profile
    ↓
Fatigue / Setup / Equipment
    ↓
Final Recommendation
```

---

## 2. New Concept — Aesthetic Exercise Suitability

The engine must distinguish:

> "This exercise trains the target."

from:

> "This exercise is especially appropriate for this exact aesthetic outcome."

`physique_targets` already answer the first question.

Add a lightweight, deterministic suitability layer for the second.

Do **not** create a giant outcome × exercise matrix.

Instead, use a small vocabulary of defensible exercise characteristics, where useful, such as:

```text
bent-knee
straight-arm
knee-dominant
hip-dominant
horizontal-press
incline-press
vertical-pull
horizontal-pull
direct-isolation
high-loadable
stable
lengthened-biased
shortened-biased
constant-tension
```

Only retain characteristics that materially help distinguish suitability.

---

## 3. Aesthetic Outcome Preference Profiles

An aesthetic outcome may define preferred exercise characteristics.

Conceptual example:

```yaml
aesthetic_outcome:
  id: calf-lower-fullness
  primary_targets:
    - soleus
  preferred_characteristics:
    - bent-knee
    - direct-soleus-emphasis
```

Exercise records may expose corresponding characteristics:

```yaml
exercise:
  id: seated-calf-raise
  physique_targets:
    - soleus
  aesthetic_characteristics:
    - bent-knee
    - direct-soleus-emphasis
```

The exact schema is implementation-dependent.

The architectural requirement is:

> The engine must know whether an exercise is merely relevant to the target or particularly suited to the selected aesthetic outcome.

---

## 4. Revised Ranking Hierarchy

Use this conceptual ordering:

```text
1. Primary-target match
2. Aesthetic-specific suitability
3. Supporting-target match
4. Relevant curated complement
5. General regional relevance
6. Stimulus / exercise profile
7. Fatigue
8. Setup
9. Equipment constraints
10. Deterministic tie-breaker
```

The key rule:

> Aesthetic suitability must be considered before generic stimulus characteristics when the selected aesthetic outcome provides meaningful exercise preferences.

Do not allow a generic "lengthened-position" or similar tag to routinely override a clearly more specific exercise for the selected visual problem.

---

## 5. Preserve the Phase 4B Primary-Target Rule

Aesthetic suitability must **not** undo the previous correction.

If:

```text
Primary = Brachialis
Supporting = Triceps
```

a supporting-target triceps exercise must not beat a direct brachialis exercise simply because the triceps exercise has a favorable generic stimulus tag.

Aesthetic suitability refines ranking **within the appropriate target tier**.

---

## 6. Permanent Negative Test — Lower Calf Fullness

Input:

```text
Appearance
→ Calves
→ Lower calf / near-ankle area looks thin
```

Expected:

```text
Aesthetic:
Lower calf fullness

Primary:
Soleus
```

Expected behavior:

- Seated Calf Raise should be recognized as highly specific.
- Leg-Press Calf Raise remains a valid soleus option.
- Standing Calf Raise remains valid but is less specifically aligned with a soleus-focused aesthetic problem.

A generic calf exercise must not outrank a clearly more specific soleus exercise merely because of a generic stimulus tag.

---

## 7. Permanent Negative Test — Overall Quad Front Mass

Input:

```text
Appearance
→ Quads
→ Quads don't look big enough from the front
```

Expected:

```text
Aesthetic:
Overall front-quad mass

Primary:
Quads
```

The engine must not automatically favor a niche rectus-femoris / lengthened-position exercise over a more appropriate overall quad-development movement merely because the niche exercise has a favorable generic stimulus characteristic.

Reverse Nordic remains a valid exercise; it should not automatically become the best answer to every overall-quad-mass problem.

---

## 8. Chest Side-Projection Regression

Retain and strengthen the existing golden test:

```text
Aesthetic:
Chest looks flat from the side
```

Verify that the selected exercise is not merely a generic chest/upper-pec match, but is appropriately suited to the specific projection/depth objective.

---

## 9. Shoulder-Width Regression

Add:

```text
Appearance
→ Shoulders
→ Shoulders don't look wide enough
```

Expected:

```text
Primary:
Side-delt development
```

Direct lateral-delt work should dominate front-delt pressing when the user's explicit problem is shoulder width.

This verifies that the aesthetic outcome meaningfully changes exercise selection within the same broad body region.

---

## 10. Back Width vs Back Thickness Regression

Add two contrasting tests.

### Case A

```text
"My back doesn't look wider than my waist."
```

Expected:

```text
V-taper / width outcome
→ Lat / width targets
→ Width-appropriate exercises
```

### Case B

```text
"My back looks wide but still looks thin from behind."
```

Expected:

```text
Back-thickness outcome
→ Mid/upper-back thickness targets
→ Thickness-appropriate exercises
```

The two cases must produce meaningfully different recommendation behavior.

---

## 11. Recommendation Consistency Rule

The technical explanation and recommendation must never contradict each other.

If the explanation says:

> "The brachialis is the primary lever."

the recommendation must visibly prioritize direct brachialis work.

If it says:

> "Soleus is the main contributor."

the recommendation should prioritize appropriately specific soleus work.

If a supporting-target exercise is shown, explain that it addresses the supporting contribution.

---

## 12. Do Not Over-Penalize Valid Exercises

The suitability layer is a refinement, not an exclusion mechanism.

For example:

```text
Primary:
Soleus
```

A leg-press calf raise remains a valid alternative if it trains the soleus.

The engine should distinguish:

```text
Seated Calf Raise:
More specific to this aesthetic goal

Leg-Press Calf Raise:
Valid alternative / broader option
```

Do not force one exercise for every visual problem.

---

## 13. Programming Profile Classification Issue

Audit the programming-profile resolver for contradictions between:

```text
exercise_type
```

and:

```text
coverage_categories
```

For example, an isolation calf exercise may contain a `stable-compound` coverage tag but should not automatically become a compound programming profile.

Canonical rule:

```text
exercise_type
    ↓
primary programming profile
    ↓
coverage categories as refinements
```

not:

```text
first matching coverage category
    ↓
override exercise type
```

---

## 14. Programming Profile Audit

Run an automated audit across the complete exercise database.

Flag:

- `exercise_type = isolation` with a compound programming profile
- `exercise_type = compound` with an isolation programming profile
- high-fatigue exercises receiving low-fatigue profiles
- high-skill compounds receiving isolation-style programming
- profile assignments caused solely by metadata ordering

Do not inspect only calf exercises; audit the entire database.

---

## 15. Keep Programming Generic Where Appropriate

Do not create a unique programming prescription for every exercise.

The architecture remains:

```text
Global Principles
    ↓
Programming Profile
    ↓
Target Context
    ↓
Current Training Context
    ↓
Final Recommendation
```

Generic ranges remain valid where no meaningful distinction exists.

The goal is to remove **incorrect genericity**, not generic guidance itself.

---

## 16. Target-Level Programming — Preserve for Future Expansion

The current target-aware programming layer is acceptable.

Preserve the ability to eventually account for:

```text
Direct target volume
+
Indirect target volume
+
Target priority
+
Exercise overlap
+
Frequency
```

Do not build a full adaptive volume optimizer as part of this correction unless the existing architecture makes it trivial.

The immediate goal is recommendation specificity and programming-profile correctness.

---

## 17. Intensity Technique Regression

Retain the Phase 4B behavior.

Verify:

- Drop Set is not universal.
- Rest-Pause can be selected where appropriate.
- Myo-Reps can be selected where appropriate.
- No intensity technique is a valid output.
- Heavy/high-skill compounds do not receive inappropriate techniques.
- Explanations are exercise/context-specific.

Do not redesign this layer unless regression testing reveals a concrete failure.

---

## 18. Recommendation Trace

For development/debugging, expose enough internal information to explain ranking.

Conceptual example:

```text
Exercise:
Seated Calf Raise

Target:
Soleus

Target Match:
PRIMARY

Aesthetic Suitability:
HIGH

Stimulus Profile:
Stable Isolation

Fatigue:
Low

Final Reason:
Direct primary-target match + high aesthetic suitability
```

This does not have to be shown fully to normal users.

It should be available in development/debug mode so future adversarial testing can identify ranking problems quickly.

---

## 19. Required Test Matrix

Run at least:

| Aesthetic problem | Primary target | Required behavior |
|---|---|---|
| Chest looks flat from side | Relevant chest target | Projection-appropriate exercise |
| Chest doesn't look wide from front | Relevant chest target | Broad chest development |
| Shoulders don't look wide | Side delt | Direct lateral-delt work |
| Back doesn't look wider than waist | Lat / width target | Lat width / V-taper work |
| Back looks wide but thin | Thickness target | Mid/upper-back mass |
| Arms look thin from side | Brachialis / arm thickness | Direct brachialis work |
| Triceps lack back-of-arm depth | Triceps | Direct triceps development |
| Lower calf looks thin | Soleus | Bent-knee / direct soleus |
| Quads lack overall front mass | Quads | Broad loadable quad work |
| Hamstrings look thin from side | Hamstrings | Appropriate hamstring development |
| Glutes lack projection | Glute target | Appropriate projection work |

Validate **ranking behavior and semantic consistency**, not merely whether the final exercise happens to be acceptable.

---

## 20. Explicit Non-Goals

Do NOT:

- restart Phase 4;
- redesign the recommendation engine;
- add hundreds of exercises;
- create a manual mapping for every aesthetic outcome × exercise combination;
- introduce AI;
- introduce ML;
- introduce opaque scoring;
- implement body-photo analysis;
- build an adaptive recovery engine;
- build automatic full workout generation;
- replace programming profiles;
- force intensity techniques;
- remove valid alternatives simply because another variation is more specific.

---

## 21. Acceptance Criteria

Phase 4C is complete when:

- [ ] Primary-target ranking remains intact.
- [ ] Aesthetic-specific suitability is represented deterministically.
- [ ] Exercises can be distinguished by relevance to a specific aesthetic outcome.
- [ ] Generic stimulus characteristics cannot routinely override aesthetic suitability.
- [ ] Lower-calf / soleus regression passes.
- [ ] Overall-quad-mass regression passes.
- [ ] Chest side-projection regression passes.
- [ ] Shoulder-width regression passes.
- [ ] Back-width vs back-thickness tests produce meaningfully different behavior.
- [ ] Brachialis / side-arm-thickness regression continues to pass.
- [ ] Technical explanation and recommendation remain consistent.
- [ ] Programming profile classification is consistent with canonical exercise type.
- [ ] Full exercise-database programming-profile audit passes.
- [ ] Existing intensity-technique behavior continues to pass.
- [ ] No AI/ML or opaque scoring has been introduced.
- [ ] Existing Phase 2 / Phase 3 / Phase 4B tests continue to pass.
- [ ] Mobile UX remains functional.

---

## 22. Implementation Order

```text
4C-1
Audit current exercise-ranking behavior
        ↓
4C-2
Introduce aesthetic-specific exercise characteristics
        ↓
4C-3
Map aesthetic outcomes to preferred characteristics
        ↓
4C-4
Integrate suitability into candidate ranking
        ↓
4C-5
Add lower-calf / soleus regression
        ↓
4C-6
Add quad front-mass regression
        ↓
4C-7
Add chest / shoulder / back contrast regressions
        ↓
4C-8
Audit programming-profile classification
        ↓
4C-9
Fix exercise_type vs coverage precedence
        ↓
4C-10
Run full regression suite
        ↓
4C-11
Run recommendation-trace audit
        ↓
4C-12
Final real-world use test
```

---

## 23. Final Architect Principle

Phase 4B taught the engine:

> **Choose the correct target first.**

Phase 4C teaches it:

> **Among exercises that train the correct target, choose the one that best fits the exact visual problem.**

The final reasoning chain is:

```text
WHAT DOES THE USER SEE?
        ↓
Aesthetic Outcome
        ↓
WHAT DEVELOPMENT CONTRIBUTES?
        ↓
Primary / Supporting Targets
        ↓
WHAT EXERCISES TRAIN IT?
        ↓
Target-Matched Candidate Pool
        ↓
WHICH EXERCISE BEST FITS THIS VISUAL PROBLEM?
        ↓
Aesthetic-Specific Suitability
        ↓
HOW DOES IT TRAIN?
        ↓
Stimulus / Exercise Profile
        ↓
HOW SHOULD IT BE PROGRAMMED?
        ↓
Sets / Reps / RIR / Volume / Frequency
        ↓
SHOULD AN INTENSITY TECHNIQUE BE USED?
        ↓
Technique Suitability
        ↓
HOW DO WE PROGRESS?
        ↓
Progression
```

The Blueprint should never settle for:

> **"This exercise trains the muscle."**

when it can answer:

> **"This exercise trains the relevant muscle in a way that makes sense for the exact visual characteristic you are trying to change."**

That is the standard for Phase 4C.
