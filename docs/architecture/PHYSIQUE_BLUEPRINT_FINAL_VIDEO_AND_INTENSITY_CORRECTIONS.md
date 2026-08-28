# Physique Blueprint — Final Corrections + Universal Intensity Techniques
## Authoritative Implementation Specification for Gemini

**Developer:** Gemini  
**Architect:** ChatGPT  
**Product Owner:** User  
**Status:** Final corrective implementation + one approved feature addition  
**Priority:** High  
**Objective:** Resolve the remaining release-readiness gaps and add intensity-technique visibility to every exercise variation without creating a second programming/intensity engine.

---

# 1. Executive Summary

The current implementation is very close to release.

The existing simplified video-reference feature is correct:

> One exercise variation → one YouTube URL → simple external text link → YouTube opens externally.

Do NOT reintroduce:

- embedded YouTube playback;
- thumbnails;
- iframes;
- video modals;
- lazy-loaded video players;
- video-specific backend infrastructure.

This specification has two purposes:

### A. Final corrections

1. Strengthen video data validation.
2. Perform an honest final audit of all 123 video references.
3. Ensure `verified` means genuinely manually inspected.
4. Resolve any incorrect/unverifiable references.
5. Audit duplicate URLs.
6. Ensure metadata is truthful.
7. Remove stale VideoPlayer/lazy-loading documentation.
8. Run and truthfully report all validation/test/build/lint/typecheck checks.
9. Preserve all existing Blueprint logic.

### B. New approved feature

> **Every exercise variation must expose its applicable intensity techniques when the user views that variation directly.**

Currently intensity techniques are visible in the Decide / "best variation" recommendation context, but not consistently when the user:

- searches for an exercise;
- opens an exercise from the homepage;
- opens an exercise from Explore;
- opens an exercise directly from an exercise card/detail route.

That must be corrected.

---

# 2. Product Principle

The user should never have to enter the Decide workflow merely to learn how an exercise can be intensified.

If the user opens:

```text
Incline Dumbbell Press
```

the exercise detail should provide:

```text
Why this exercise
Technical explanation
Execution / video link
Programming
Intensity techniques
```

The intensity information belongs to the exercise knowledge itself.

---

# 3. Existing Architecture Must Be Preserved

The existing canonical architecture is:

```text
Exercise Knowledge
│
├── exercise definition
├── aesthetic role
├── technical targets
├── programming
├── intensity technique data
└── video_link
        │
        ├── Explore
        ├── Decide
        ├── Build
        └── Exercise Detail
```

Do not create a second intensity-technique engine.

Do not create page-specific intensity data.

Do not hard-code different intensity techniques into Explore, Decide, Build, and Detail.

---

# 4. Roles and Decision Model

## User

Owns:

- product requirements;
- real-world usability;
- final product preferences;
- acceptance/rejection.

The User is NOT responsible for manually verifying 123 video references.

## Architect — ChatGPT

Owns:

- product/system architecture;
- knowledge-model decisions;
- interpretation of product requirements;
- implementation specifications;
- adversarial review;
- release recommendation.

## Developer — Gemini

Owns:

- implementation;
- data curation;
- manual video verification;
- automated validation;
- tests;
- build/lint/typecheck;
- implementation logs;
- reporting actual results.

### Escalate to Architect if:

- exercise knowledge itself appears wrong;
- intensity-technique logic needs to change;
- programming needs to change;
- a new backend/service is proposed;
- a second recommendation/intensity engine is proposed;
- a video cannot be defensibly selected;
- a material UX workflow change is required.

Normal implementation details may be decided by Gemini without escalation.

---

# 5. VIDEO REQUIREMENT — SIMPLE EXTERNAL LINK ONLY

The final UX is:

```text
🎥 Click here for video
```

or equivalent wording.

Clicking it opens the YouTube video externally.

There must be:

- no embedded playback;
- no thumbnail;
- no iframe;
- no player;
- no modal;
- no lazy loading;
- no autoplay;
- no YouTube preview.

The link is informational only.

---

# 6. REMOVE DEAD VIDEO INFRASTRUCTURE

Check the repository for any remaining video-player infrastructure.

Remove anything that exists solely for the old embedded implementation, including:

- `VideoPlayer`;
- video-ID extraction utilities;
- video-player tests;
- thumbnail helpers;
- iframe helpers;
- unused YouTube-specific dependencies.

Do not delete something that has a legitimate current consumer.

Before deleting a file, search the repository for its imports/usages.

If no current consumer exists, remove it.

After cleanup:

```text
No embedded-video infrastructure should remain.
```

---

# 7. VIDEO DATA MODEL

Every exercise variation should have one canonical reference:

```yaml
video_link: "https://www.youtube.com/watch?v=..."
```

Optional metadata:

```yaml
video_title: "..."
video_creator: "..."
video_status: "verified"
```

The exercise record is the source of truth.

Do not duplicate URLs in:

- Explore;
- Decide;
- Build;
- Exercise Detail.

---

# 8. VIDEO VALIDATION — STRENGTHEN IT

The current validator checks URL syntax, but production validation must also enforce the required state.

For every production exercise:

```text
video_link exists
AND
video_link is a valid YouTube URL
AND
video_status == verified
```

If any condition fails:

```text
FAIL validation
```

Do not silently allow incomplete production video data.

---

# 9. DUPLICATE VIDEO VALIDATION

The validation layer should detect duplicate YouTube URLs across exercise records.

Expected production result:

```text
123 exercise records
123 populated links
123 unique URLs
0 duplicates
```

If duplicate URLs are found:

```text
FAIL validation
```

Do not automatically reject a duplicate merely because it is technically possible for one video to demonstrate multiple exercises; however, for this project the production target is zero duplicate assignments.

If a duplicate is discovered during curation, manually inspect both records and replace the weaker/incorrect reference.

---

# 10. VIDEO CURATION — DEVELOPER RESPONSIBILITY

Gemini is responsible for manually curating and verifying the references.

The User is NOT expected to watch all 123 videos.

Manual verification means:

```text
Find candidate
↓
Open actual video
↓
Inspect demonstration
↓
Confirm exact exercise variation
↓
Confirm reasonably clear technique
↓
Confirm credible source
↓
Record URL
↓
Mark verified
```

A valid-looking URL does not qualify as verified.

A YouTube search result does not qualify as verified.

Invented metadata does not qualify as verified.

---

# 11. CURATION SELECTION PRIORITY

Use:

```text
1. Exact variation match
2. Technique quality
3. Setup clarity
4. Execution clarity
5. Credibility
6. Reasonable length
7. Stability
8. Creator preference
```

Do not force a fixed creator list.

The goal is:

> The best practical reference for the exact exercise variation.

---

# 12. VIDEO METADATA INTEGRITY

If `video_title` and `video_creator` are present:

- confirm they match the actual video;
- do not fabricate them;
- do not derive a fake title from the exercise name.

If metadata cannot be confidently established:

> remove the metadata rather than inventing it.

The URL is the essential field.

---

# 13. FINAL VIDEO AUDIT

Perform a complete audit of all 123 exercise records.

Produce actual counts:

```text
Total exercises: 123
References populated: <actual>
References manually inspected: <actual>
Verified: <actual>
Needs review: <actual>
Missing: <actual>
Unique URLs: <actual>
Duplicate assignments: <actual>
```

Desired final state:

```text
Total exercises: 123
References populated: 123
References manually inspected: 123
Verified: 123
Needs review: 0
Missing: 0
Unique URLs: 123
Duplicate assignments: 0
```

Do not report desired numbers unless they are actually true.

---

# 14. QUESTIONABLE OR UNVERIFIABLE VIDEOS

If a reference:

- does not resolve;
- does not demonstrate the exercise;
- demonstrates a materially different variation;
- has incorrect metadata;
- is technically poor;
- cannot be reasonably verified;

then:

```yaml
video_status: needs_review
```

Do not mark it verified just to satisfy the 123/123 requirement.

Find a replacement and verify it.

If no defensible replacement exists, escalate to the Architect.

---

# 15. NEW FEATURE — UNIVERSAL INTENSITY TECHNIQUES

## Requirement

Every exercise variation must expose the intensity techniques that are applicable to that exercise.

This must work regardless of how the user reached the exercise.

Examples:

```text
Homepage
  ↓
Exercise
  ↓
Intensity Techniques
```

```text
Search
  ↓
Exercise
  ↓
Intensity Techniques
```

```text
Explore
  ↓
Exercise
  ↓
Intensity Techniques
```

```text
Decide
  ↓
Exercise
  ↓
Intensity Techniques
```

```text
Build
  ↓
Exercise
  ↓
Intensity Techniques
```

---

# 16. IMPORTANT DISTINCTION

There are two different concepts:

### Exercise-level intensity techniques

These answer:

> "How can this particular exercise be intensified or used with a different stimulus?"

They belong to the exercise variation.

### Recommendation-specific intensity prescription

This answers:

> "How should Blueprint program this technique for this particular recommendation/package?"

That remains contextual.

Do NOT collapse these into one concept.

---

# 17. DATA MODEL FOR INTENSITY TECHNIQUES

First inspect the existing canonical intensity-technique data.

If the current exercise records already contain sufficient information, reuse it.

Do NOT create duplicate fields.

If the current system has a canonical structure such as:

```text
intensityTechnique
intensityTechniqueContext
```

continue using it.

If multiple techniques are already supported by the existing knowledge model, expose the existing canonical collection.

Only modify the schema if the current data model genuinely cannot represent the requirement.

If schema modification is necessary, escalate the proposed structure before inventing a new parallel system.

---

# 18. DO NOT INVENT TECHNIQUES

This feature is about **surfacing existing canonical knowledge**, not generating new exercise science.

Do not invent an intensity technique merely because an exercise page currently looks empty.

Use the existing project's established intensity-technique knowledge.

If an exercise genuinely has no suitable intensity technique, the UI should say so clearly rather than fabricate one.

---

# 19. MULTIPLE TECHNIQUES

An exercise may have more than one applicable technique.

If the canonical data contains multiple applicable techniques, display all relevant techniques.

Example:

```text
INTENSITY TECHNIQUES

Drop Set
Reduce load after reaching technical failure/target effort,
then continue with controlled repetitions.

Rest-Pause
Take a short intra-set rest, then perform additional
quality repetitions.

Mechanical Drop Set
Move to a mechanically easier variation while maintaining
the target muscle under fatigue.
```

Use the actual canonical definitions from the project.

Do not invent descriptions.

---

# 20. SINGLE TECHNIQUE

If only one technique applies:

```text
INTENSITY TECHNIQUE

Drop Set

[canonical explanation]

How Blueprint uses it
[contextual programming explanation, if available]
```

---

# 21. NO APPLICABLE TECHNIQUE

If the canonical data indicates no intensity technique is appropriate:

Do NOT hide the section in a way that makes the user wonder whether data is missing.

Use a concise state such as:

```text
INTENSITY TECHNIQUES

No specific intensity technique is recommended
for this variation. Standard progressive overload
is the primary progression method.
```

Only use the progressive-overload statement if it is consistent with existing Blueprint terminology.

Do not fabricate a technique merely to populate the card.

---

# 22. EXERCISE DETAIL PAGE

The exercise detail page should include:

```text
EXERCISE NAME

Visual role / aesthetic contribution

Technical explanation

🎥 Click here for video

PROGRAMMING

Sets × reps
RIR
Frequency / volume where applicable

INTENSITY TECHNIQUES

[applicable canonical techniques]

WHY THIS EXERCISE

[canonical explanation]
```

Exact visual ordering may follow the existing design system, but intensity information must be easy to find.

---

# 23. HOMEPAGE / DIRECT EXERCISE OPEN

If the homepage currently exposes exercise variations or exercise cards, opening an exercise must lead to the same canonical exercise detail experience.

The user must not receive a "lite" detail page that omits intensity information.

---

# 24. EXPLORE

When an exercise is opened from Explore:

```text
Exercise
↓
Detail
↓
Intensity Techniques
```

The intensity data must come from the exercise record.

No Explore-specific intensity data.

---

# 25. DECIDE

The current Decide workflow already shows intensity information in recommendation context.

Preserve that behavior.

The new requirement is additive:

```text
Decide recommendation
        ↓
exercise
        ↓
same canonical intensity data
```

Do not create a second intensity-technique definition for Decide.

Contextual programming may continue to specify:

```text
Drop Set
3 × 8–12
final set
RIR 0–1
```

while the exercise detail explains the technique itself.

---

# 26. BUILD

Build should continue showing the programming-specific intensity prescription.

The exercise detail should expose the broader exercise-level intensity options.

For example:

```text
BUILD

3 × 8–12
RIR 1–2

Intensity:
Drop Set — final set

Why this exercise?
...
```

Opening the exercise:

```text
Exercise Detail

Intensity Techniques
Drop Set
Rest-Pause
...
```

provided those techniques are actually canonical/applicable.

---

# 27. AVOID DUPLICATION

Do not make the page repeat the same paragraph three times.

Use hierarchy:

```text
INTENSITY TECHNIQUES
What techniques are applicable?

PROGRAMMING
How Blueprint is using one of them here.

WHY THIS EXERCISE
Why the movement itself is selected.
```

These are different questions.

---

# 28. UI PRESENTATION

Intensity techniques should be visually prominent enough to be discoverable but not overpower:

1. Exercise identity.
2. Aesthetic purpose.
3. Technical explanation.
4. Programming.
5. Intensity techniques.
6. Video link / supporting reference.

The exact order may follow the existing page hierarchy.

Do not create an enormous dashboard widget for a small amount of information.

---

# 29. INTENSITY TECHNIQUE UI STYLE

Use the existing Blueprint visual language.

Example:

```text
┌──────────────────────────────────────────┐
│ INTENSITY TECHNIQUES                     │
│                                          │
│ DROP SET                                 │
│ Extend the set by reducing load after    │
│ the primary working effort.              │
│                                          │
│ REST-PAUSE                               │
│ Short intra-set rest followed by more    │
│ quality repetitions.                     │
└──────────────────────────────────────────┘
```

This is illustrative only.

Use the actual canonical definitions.

---

# 30. SEARCH RESULT / CARD BEHAVIOR

Do not necessarily put the full intensity explanation directly on every compact exercise card.

The requirement is:

> When the user opens the variation, intensity techniques must be available.

A compact card may provide:

```text
Intensity techniques available →
```

or simply rely on the detail page.

Avoid cluttering Explore with large text blocks.

---

# 31. DATA FLOW

The desired data flow is:

```text
Canonical Exercise Record
        │
        ├── aesthetic role
        ├── technical explanation
        ├── programming
        ├── intensity techniques
        └── video_link
                │
                ├── Explore
                ├── Decide
                ├── Build
                └── Exercise Detail
```

There must be no page-level hard-coded technique mapping.

---

# 32. ADVERSARIAL INTENSITY TESTS

Test at least these scenarios:

### A. Exercise opened directly

Expected:

```text
Intensity techniques visible.
```

### B. Exercise opened from search

Expected:

```text
Same canonical techniques.
```

### C. Exercise opened from homepage

Expected:

```text
Same canonical techniques.
```

### D. Exercise opened from Explore

Expected:

```text
Same canonical techniques.
```

### E. Exercise recommended by Decide

Expected:

```text
Same canonical techniques
+
recommendation-specific programming context where applicable.
```

### F. Exercise used in Build

Expected:

```text
Same canonical techniques
+
Build-specific prescription.
```

### G. Exercise with multiple applicable techniques

Expected:

```text
All canonical applicable techniques displayed.
```

### H. Exercise with no applicable technique

Expected:

```text
Clear empty state.
No invented technique.
```

### I. Existing exercise with a technique currently shown by Decide

Expected:

```text
Technique also available from direct exercise detail.
```

---

# 33. VIDEO + INTENSITY COMBINATION TEST

For a representative exercise, verify the complete detail experience:

```text
Exercise
↓
Aesthetic role
↓
Technical explanation
↓
Programming
↓
Intensity techniques
↓
🎥 Click here for video
```

The video link must remain an external hyperlink.

The intensity technique must remain canonical data.

Neither should interfere with the other.

---

# 34. REGRESSION PROTECTION

Do not change:

- exercise selection scoring;
- aesthetic mapping;
- decision engine;
- package generation;
- exercise ranking;
- volume logic;
- frequency logic;
- programming logic;
- existing intensity prescriptions.

The new feature is primarily a **visibility/data-consumption enhancement**.

---

# 35. AUTOMATED TESTS

Add or update tests for:

### Data

- every production exercise has a verified video;
- YouTube URL syntax;
- duplicate detection;
- truthful status;
- intensity-technique structure.

### UI

- direct exercise detail renders intensity section;
- exercise with technique renders correct technique;
- multiple techniques render correctly;
- no-technique state renders correctly;
- missing/invalid video does not crash the page;
- external video link has correct behavior.

### Cross-mode

Verify that the same exercise data produces consistent intensity information in:

- Explore;
- Decide;
- Build;
- Exercise Detail.

---

# 36. VALIDATION COMMANDS

Run the repository's official commands:

```text
npm run validate-data
npm test
npm run build
npm run lint
```

Run the official typecheck command if one exists.

Do not claim success without actually executing the command.

---

# 37. DOCUMENTATION CLEANUP

Update stale documentation that still refers to:

```text
VideoPlayer
lazy-loaded YouTube player
embedded video
thumbnail loading
```

The final documented architecture should say:

```text
Exercise
  ↓
video_link
  ↓
simple external YouTube hyperlink
```

Remove references to deleted files.

---

# 38. IMPLEMENTATION LOG

Update the development log with:

### Video

- links audited;
- links replaced;
- final counts;
- duplicate count;
- verification count.

### Intensity

- source of canonical intensity data;
- UI locations updated;
- number of exercises exposed;
- handling of exercises with no applicable technique.

### Validation

- validate-data result;
- test result;
- build result;
- lint result;
- typecheck result.

### Deviations

List anything that could not be completed.

---

# 39. NO NEW BACKEND / AI / ML

This requirement does NOT justify:

- AI;
- ML;
- LLM calls;
- new APIs;
- backend services;
- databases;
- external fitness services.

Everything should be driven by the existing local knowledge base and application logic.

---

# 40. DEFINITION OF DONE — VIDEO

- [ ] 123 exercise variations remain.
- [ ] 123 video links exist.
- [ ] 123 links manually inspected by Developer.
- [ ] 123 links verified.
- [ ] 0 missing links.
- [ ] 0 duplicate assignments.
- [ ] Metadata is accurate or omitted.
- [ ] Production validator enforces verified status.
- [ ] Simple external-link UX only.
- [ ] No embedded video infrastructure.
- [ ] Stale documentation removed.

---

# 41. DEFINITION OF DONE — INTENSITY

- [ ] Every exercise detail exposes applicable intensity techniques.
- [ ] Direct exercise opening works.
- [ ] Homepage opening works.
- [ ] Search opening works.
- [ ] Explore opening works.
- [ ] Decide remains correct.
- [ ] Build remains correct.
- [ ] All views consume canonical intensity data.
- [ ] Multiple techniques are handled.
- [ ] No-technique state is handled.
- [ ] No techniques are invented.
- [ ] Programming-specific intensity remains separate.
- [ ] Existing decision logic is unchanged.

---

# 42. DEFINITION OF DONE — ENGINEERING

- [ ] Data validation passes.
- [ ] Tests pass.
- [ ] Build passes.
- [ ] Lint passes.
- [ ] Typecheck passes if available.
- [ ] No dead video infrastructure remains.
- [ ] No unnecessary dependencies were introduced.
- [ ] No architecture drift occurred.
- [ ] No unrelated features were added.

---

# 43. FINAL DEVELOPER REPORT

When complete, Gemini must report:

## Video

```text
Exercises: 123
Links populated: X
Manually inspected: X
Verified: X
Needs review: X
Missing: X
Unique URLs: X
Duplicates: X
```

## Intensity

```text
Exercises with applicable techniques: X
Exercises with no applicable technique: X
Direct detail coverage: PASS/FAIL
Explore coverage: PASS/FAIL
Decide coverage: PASS/FAIL
Build coverage: PASS/FAIL
```

## Validation

```text
validate-data: PASS/FAIL
test: PASS/FAIL
build: PASS/FAIL
lint: PASS/FAIL
typecheck: PASS/FAIL/N/A
```

## Deviations

List all unresolved issues.

Never report a target number as an actual result unless it was verified.

---

# 44. FINAL ARCHITECT REVIEW

After Gemini completes this specification, provide the new repository snapshot to the Architect.

The Architect will perform the final review.

The Architect will specifically check:

```text
Video:
✓ simple external links
✓ no player
✓ no thumbnails
✓ 123 references
✓ duplicate audit
✓ verification integrity

Intensity:
✓ direct exercise detail
✓ search
✓ homepage
✓ Explore
✓ Decide
✓ Build
✓ canonical source
✓ no invented techniques
✓ no programming regression

Engineering:
✓ validation
✓ tests
✓ build
✓ lint
✓ documentation
```

---

# 45. IMPORTANT — THIS IS NOT A NEW DEVELOPMENT PHASE

This is a **final correction pass plus one narrowly defined feature**.

Do not use this specification as justification to:

- redesign the entire UI again;
- change the decision engine;
- change exercise taxonomy;
- rewrite programming;
- introduce AI;
- introduce backend services;
- add video playback;
- add another recommendation system.

The goal is to finish the product.

---

# 46. FINAL OPERATING PRINCIPLE

```text
USER
Product requirement
        ↓
ARCHITECT
Deterministic product/system decision
        ↓
DEVELOPER
Implementation + curation + testing
        ↓
ARCHITECT
Review + adversarial QA
        ↓
USER
Real-world acceptance
        ↓
SHIP
```

The Developer owns implementation and manual video curation.

The Architect owns system/product decisions and review.

The User owns the product requirement and final real-world acceptance.

---

# 47. FINAL INSTRUCTION TO GEMINI

Implement only the corrections and feature described in this document.

### Video:

Keep the UX as a simple external YouTube text link.

Audit all 123 references honestly.

The Developer, not the User, performs the manual verification.

Strengthen automated validation so the production dataset cannot silently contain unverified/missing/duplicate references.

Remove stale/dead video infrastructure and documentation.

### Intensity:

Expose every exercise variation's applicable canonical intensity techniques from the exercise detail experience, regardless of how the user reached that exercise.

Reuse the existing canonical intensity knowledge.

Do not create a second intensity engine.

Keep exercise-level technique information separate from recommendation/package-specific programming prescriptions.

### Final rule:

**Do not expand the scope. Do not create another phase. Finish the corrections, implement the intensity visibility feature, validate everything, and return the snapshot for final Architect review.**
