# Physique Blueprint — Final Shortcomings Closure + Universal Intensity Visibility
## Deterministic Implementation Specification for Gemini

**Developer:** Gemini  
**Architect:** ChatGPT  
**Product Owner:** User  
**Status:** Final correction pass  
**Scope:** Close the remaining shortcomings in the latest snapshot and finish the approved universal intensity-technique visibility feature.

---

# 0. SOURCE OF TRUTH

Implement against the latest repository snapshot:

`workout-blueprint-feature-video-references-and-guides(3)`

The latest review established that the application is already functionally strong.

The implementation below is **not permission to redesign the application**.

Do not change the established:

- aesthetic-first hierarchy;
- decision engine;
- aesthetic taxonomy;
- technical explanations;
- exercise mappings;
- programming engine;
- all-round development packages;
- existing intensity recommendation logic;
- simple external YouTube-link UX.

The goal is to close specific gaps and make the existing behavior consistent and release-ready.

---

# 1. EXECUTIVE DECISION

There are four categories of work.

## A. Documentation cleanup

Fix stale references to the removed embedded-video implementation.

## B. Video QA closure

The application already has the correct video architecture and validator.

The Developer must perform the final truthful curation/validation pass and report actual results.

## C. Universal intensity visibility

Every exercise variation must expose its applicable intensity techniques from the exercise detail experience regardless of entry path.

## D. Final regression/acceptance pass

Run the full validation suite and adversarial tests.

**After this correction, do not create another development phase for these items.**

---

# 2. NON-NEGOTIABLE VIDEO UX

The final product behavior is:

```text
Exercise variation
        ↓
🎥 Click here for video
        ↓
External YouTube page
```

The application must NOT:

- embed YouTube;
- render a thumbnail;
- render a video player;
- use an iframe;
- autoplay;
- open a video modal;
- lazy-load a player;
- fetch video content;
- build a video subsystem.

The video URL is reference information only.

Do not modify this architecture.

---

# 3. VIDEO DATA — FINAL STATE

The repository currently contains 123 exercise variations.

Expected production state:

```text
Exercise records: 123
Video links: 123
Manually inspected: 123
Verified: 123
Needs review: 0
Missing: 0
Unique URLs: 123
Duplicate URLs: 0
```

These are **targets, not numbers to fabricate**.

Report actual results.

If any value differs, fix the underlying data where possible.

---

# 4. VIDEO MANUAL VERIFICATION RESPONSIBILITY

The Developer owns manual verification.

The User does NOT need to watch 123 videos.

Manual verification means:

```text
Candidate URL
    ↓
Open actual video
    ↓
Confirm it resolves
    ↓
Confirm exact exercise variation
    ↓
Confirm execution is understandable
    ↓
Confirm credible source
    ↓
Confirm metadata, if stored
    ↓
Mark verified
```

Do not mark a URL `verified` merely because:

- it matches YouTube syntax;
- a search result exists;
- the URL was generated;
- the exercise name appears in metadata.

---

# 5. VIDEO VALIDATOR — DO NOT REGRESS

The current validator already enforces the important production rules.

Keep/enforce all of these:

```text
video_link exists
AND
video_link is a valid YouTube URL
AND
video_status == "verified"
```

Also enforce:

```text
no duplicate video_link assignments
```

Do not weaken these checks.

Do not make validation optional.

Do not make validation pass by changing the rules.

---

# 6. VIDEO METADATA

If these fields exist:

```yaml
video_title:
video_creator:
```

they must be truthful.

Rules:

- do not invent a title;
- do not invent a creator;
- do not infer a creator from an unreliable source;
- if metadata cannot be confidently verified, remove it rather than fabricate it.

The URL itself is the required reference.

---

# 7. VIDEO DATA AUDIT

Run a complete audit over all exercise YAML records.

Produce:

```text
Total records
Records with video_link
Records with verified status
Records needing review
Records missing links
Unique URLs
Duplicate URLs
```

The Developer must inspect all records.

If an incorrect/unverifiable URL is found:

1. find a better reference;
2. manually inspect the replacement;
3. update the exercise;
4. mark it verified only after inspection;
5. rerun validation.

If no defensible reference exists, escalate to Architect rather than inventing one.

---

# 8. REMOVE DEAD VIDEO INFRASTRUCTURE

Search the entire repository for references to:

```text
VideoPlayer
video.ts
video.test.ts
iframe
thumbnail
lazy video
embedded YouTube
```

No obsolete implementation should remain as executable application infrastructure.

The current application should not contain a dead video utility that is no longer consumed.

Do not delete unrelated utilities merely because their names happen to contain "video".

Confirm usages before removal.

---

# 9. DOCUMENTATION CLEANUP

The current `docs/dev/README.md` still describes Phase 6 using the old:

```text
lazy-loading VideoPlayer.tsx
```

architecture.

Replace that description.

The final documentation should describe Phase 6 as:

```text
Video References + Execution Guides

123 exercise-specific YouTube execution references,
schema/validator integration, manual curation/QA,
and simple external-link integration across
Explore, Decide, Build, and Exercise Detail.
```

Do not mention a `VideoPlayer.tsx` implementation that no longer exists.

---

# 10. EXERCISE TYPE COMMENT CLEANUP

`app/src/types/exercise.ts` currently contains a stale comment referring to:

```text
canonical 30-field exercise-record schema exactly
```

The current TypeScript model includes generated/runtime additions.

Update the comment so it does not falsely claim exact one-to-one correspondence.

Use wording equivalent to:

```text
Mirrors the canonical exercise-record schema plus
generator/runtime fields used by the application.
```

Preserve the existing source-of-truth references.

This is documentation only; do not alter the actual schema merely to satisfy the comment.

---

# 11. NEW FEATURE — UNIVERSAL INTENSITY TECHNIQUES

## Requirement

When a user opens **any exercise variation**, the page must expose the intensity techniques that are applicable to that variation.

This must work regardless of entry path.

Required paths:

```text
Homepage
Search
Explore
Decide
Build
Direct Exercise Detail
```

The user should not have to go through Decide merely to learn what intensity techniques apply to an exercise.

---

# 12. CANONICAL SOURCE — CRITICAL

Use the existing canonical intensity-technique system.

The latest implementation already has:

```text
programmingEngine.ts
getEligibleIntensityTechniques(exercise)
```

Continue using that canonical function/data flow.

Do NOT create:

- `exerciseIntensity.ts`;
- page-specific technique maps;
- hard-coded technique arrays inside React pages;
- a second intensity engine;
- duplicate YAML data.

The desired architecture is:

```text
Canonical exercise
        +
Canonical intensity catalog
        ↓
getEligibleIntensityTechniques(exercise)
        ↓
Exercise Detail UI
```

---

# 13. EXISTING INTENSITY CATALOG

The current canonical catalog contains:

```text
Drop Set
Rest-Pause
Myo-Reps
```

Do not automatically expand the catalog as part of this correction.

The catalog is intentionally constrained by the current programming design.

Do not add:

- mechanical drop sets;
- lengthened partials;
- supersets;
- other techniques;

unless separately approved by Architect.

---

# 14. IMPORTANT INTERPRETATION OF "EVERY VARIATION"

"Every variation has intensity information" does NOT mean:

> Every variation must be assigned an intensity technique.

That would create bad programming.

The correct requirement is:

> Every variation must have an explicit intensity-technique state.

There are three valid states.

### State A — One applicable technique

Show that technique.

### State B — Multiple applicable techniques

Show all applicable techniques.

### State C — No applicable technique

Show an explicit explanation that no specific technique is recommended.

Never fabricate a technique just to avoid an empty section.

---

# 15. CURRENT ZERO-TECHNIQUE EXERCISES

The latest review found:

```text
123 total exercises
26 with zero eligible techniques
34 with one
25 with two
38 with three
```

The 26 zero-technique exercises are NOT automatically bugs.

Many high-skill, high-stability, heavy compound movements should not receive fatigue-heavy intensity techniques.

Therefore:

**Do not change eligibility merely to make the number of zero-technique exercises equal zero.**

---

# 16. NO-TECHNIQUE EXPLANATION

For an exercise with zero eligible techniques, the page should say something equivalent to:

```text
Intensity Techniques

No specific intensity technique is recommended for this
variation. Standard progressive overload is the primary
progression method.
```

This message must not falsely imply that the exercise has incomplete data.

If the existing `explainNoIntensityTechnique()` logic provides a more exercise-specific reason, use that canonical explanation where appropriate.

Prefer the existing canonical explanation over duplicated UI copy.

---

# 17. EXERCISE DETAIL REQUIREMENT

The Exercise Detail page must contain an explicit section:

```text
Intensity Techniques
```

The section must be visible without entering the Decide workflow.

For applicable techniques, show the canonical fields already available, such as:

```text
Technique name
What it is
When it may help
When not to use
Fatigue/time implications
```

Do not rewrite the knowledge into a new format unless necessary for readability.

---

# 18. MULTIPLE TECHNIQUES

If:

```text
getEligibleIntensityTechniques(exercise)
```

returns:

```text
Technique A
Technique B
Technique C
```

display all three.

Do not only display the first one.

The first technique is relevant to recommendation/programming selection, but Exercise Detail is intended to answer:

> What intensity techniques are applicable to this variation?

Therefore all eligible techniques should be discoverable.

---

# 19. RECOMMENDED TECHNIQUE VS AVAILABLE TECHNIQUES

Maintain this distinction:

```text
Exercise Detail
    ↓
"What intensity techniques could apply?"
    ↓
ALL eligible techniques
```

versus:

```text
Decide / Build
    ↓
"What technique are we actually prescribing here?"
    ↓
The existing ranked recommendation
```

Do not replace the ranked recommendation with the complete list.

Do not replace the complete list with only the ranked recommendation.

Both behaviors are intentional.

---

# 20. DO NOT CHANGE PROGRAMMING ENGINE BEHAVIOR UNNECESSARILY

The existing:

```text
buildProgramming()
```

behavior should remain intact.

It may select:

```text
eligible[0]
```

as the deterministic recommendation.

That is separate from:

```text
getEligibleIntensityTechniques()
```

used by Exercise Detail.

Do not change ranking or eligibility merely to satisfy the new UI requirement.

---

# 21. ENTRY-PATH CONSISTENCY

The same exercise must resolve to the same intensity-technique set regardless of entry path.

For example:

```text
Search → Smith Machine RDL → Detail
```

and:

```text
Explore → Smith Machine RDL → Detail
```

must produce the same canonical technique set.

Likewise:

```text
Decide → recommended Smith Machine RDL
```

must use the same canonical underlying exercise technique data.

---

# 22. HOMEPAGE

If the homepage exposes an exercise card/link:

```text
Homepage
    ↓
Exercise
    ↓
Exercise Detail
    ↓
Intensity Techniques
```

Do not create a homepage-specific intensity data source.

The homepage only needs to route the user correctly.

---

# 23. SEARCH

Search results must open the canonical Exercise Detail page.

No search-result-specific intensity mapping.

The detail page is responsible for rendering the canonical intensity data.

---

# 24. EXPLORE

Explore must preserve the current aesthetic-first experience.

Do not clutter the main Explore cards with full intensity explanations.

The requirement is satisfied when:

```text
Explore
    ↓
Exercise Detail
    ↓
Intensity Techniques
```

works consistently.

A small indicator such as:

```text
Intensity techniques available
```

is optional only if it fits the existing UI naturally.

Do not add one merely for the sake of this requirement.

---

# 25. DECIDE

Preserve the existing Decide experience.

The current Decide recommendation may show:

```text
Intensity technique
```

in its programming context.

Do not remove it.

The new feature simply ensures that opening the exercise also exposes the complete eligible technique set.

---

# 26. BUILD

Preserve the existing Build prescription.

For example:

```text
Programming:
3 × 8–12
RIR 1–2

Intensity:
Drop Set — final set
```

Then opening the exercise can show:

```text
Intensity Techniques:
Drop Set
Rest-Pause
```

if both are canonically eligible.

This is not a contradiction.

One is:

> what Blueprint selected for this package.

The other is:

> what this exercise can reasonably use.

---

# 27. UI HIERARCHY

The Exercise Detail page should retain the existing hierarchy.

The intensity section should be prominent but not dominate the page.

Recommended conceptual order:

```text
Exercise name
↓
Summary / aesthetic purpose
↓
Technical explanation
↓
Execution guide
↓
Programming
↓
Intensity Techniques
↓
Related exercises
↓
Technical details
↓
Video reference
```

Follow the existing page's visual design where it already provides a coherent hierarchy.

Do not redesign the page from scratch.

---

# 28. INTENSITY TECHNIQUE CARD CONTENT

For each eligible technique, use the canonical data.

Conceptual layout:

```text
┌─────────────────────────────────────┐
│ DROP SET                            │
│                                     │
│ What it is                         │
│ ...                                 │
│                                     │
│ When it may help                   │
│ ...                                 │
│                                     │
│ When not to use                    │
│ ...                                 │
│                                     │
│ Fatigue & time implications        │
│ ...                                 │
└─────────────────────────────────────┘
```

Do not invent additional scientific claims.

Do not create new technique descriptions inside JSX.

---

# 29. AESTHETIC-FIRST PRINCIPLE REMAINS

The new intensity section must NOT change the fundamental Blueprint hierarchy:

```text
Aesthetic problem
      ↓
Aesthetic outcome
      ↓
Technical reason
      ↓
Exercise selection
      ↓
Programming
      ↓
Intensity / stimulus management
```

Intensity techniques are a supporting programming tool.

They are not the primary problem statement.

---

# 30. ADVERSARIAL TEST — DIRECT OPEN

Open an exercise directly.

Expected:

```text
Intensity Techniques section exists.
```

If none are applicable:

```text
Explicit no-technique explanation exists.
```

Failure:

```text
Blank section
Missing section
Undefined data
Runtime error
```

---

# 31. ADVERSARIAL TEST — SEARCH

Search for an exercise.

Open it.

Expected:

```text
Same intensity data as direct opening.
```

---

# 32. ADVERSARIAL TEST — HOMEPAGE

Open an exercise from homepage.

Expected:

```text
Same intensity data.
```

---

# 33. ADVERSARIAL TEST — EXPLORE

Open an exercise from Explore.

Expected:

```text
Same intensity data.
```

---

# 34. ADVERSARIAL TEST — DECIDE

Get an exercise through Decide.

Expected:

```text
Existing recommendation-specific intensity prescription remains.
+
Opening the exercise exposes all eligible techniques.
```

---

# 35. ADVERSARIAL TEST — BUILD

Open an exercise used in Build.

Expected:

```text
Build prescription remains unchanged.
+
Exercise Detail exposes canonical eligible techniques.
```

---

# 36. ADVERSARIAL TEST — MULTIPLE TECHNIQUES

Select an exercise known to have multiple eligible techniques.

Expected:

```text
Every eligible technique appears.
```

Do not only show the first.

---

# 37. ADVERSARIAL TEST — ZERO TECHNIQUES

Select an exercise known to have zero eligible techniques.

Expected:

```text
Intensity Techniques
↓
explicit no-technique explanation
```

Expected NOT to happen:

```text
Drop Set
```

being added merely to fill the section.

---

# 38. ADVERSARIAL TEST — DATA CONSISTENCY

For one exercise:

```text
Explore result
Decide result
Build result
Exercise Detail
```

compare the underlying exercise ID.

Expected:

```text
same canonical exercise ID
same canonical intensity eligibility
```

No page-specific copies.

---

# 39. ADVERSARIAL TEST — PROGRAMMING REGRESSION

For representative exercises:

- compare current programming output before/after implementation;
- ensure rep ranges are unchanged;
- ensure RIR is unchanged;
- ensure volume/frequency are unchanged;
- ensure selected intensity prescription is unchanged.

The new feature must not silently alter programming.

---

# 40. ADVERSARIAL TEST — VIDEO REGRESSION

For representative exercises:

- video link still exists;
- link is external;
- no iframe;
- no thumbnail;
- no player;
- no modal.

The intensity implementation must not interact with video rendering.

---

# 41. AUTOMATED TESTS

Add/update tests for:

### Intensity data

- zero eligible techniques;
- one eligible technique;
- multiple eligible techniques;
- deterministic eligibility;
- canonical data usage.

### Exercise Detail

- intensity section renders;
- all eligible techniques render;
- no-technique state renders;
- malformed/missing intensity data fails safely.

### Cross-mode

- Explore → Detail;
- Search → Detail;
- Homepage → Detail;
- Decide → Detail;
- Build → Detail.

### Regression

- decision engine;
- package engine;
- programming engine.

---

# 42. VIDEO AUTOMATED TESTS

Ensure validation covers:

```text
video_link required
valid YouTube URL
video_status == verified
duplicate URLs
```

The final validation output must make failures obvious.

---

# 43. REQUIRED COMMANDS

Run:

```bash
npm run validate-data
npm test
npm run build
npm run lint
```

Also run the repository's typecheck command if one exists.

Record the exact result.

Do not say "passed" unless the command actually completed successfully.

---

# 44. IF A COMMAND FAILS

Do not hide the failure.

Report:

```text
Command:
Failure:
Root cause:
Fix:
Rerun result:
```

If the failure is environmental and not code-related, explicitly state that.

Do not weaken tests to force a pass.

---

# 45. DOCUMENTATION CONSISTENCY CHECK

After implementation, search the repository for:

```text
VideoPlayer
lazy-loading
iframe
embedded video
thumbnail
30-field exercise-record schema exactly
```

Any remaining match must be classified as:

```text
legitimate historical reference
OR
stale documentation
OR
dead code
```

Remove stale references.

Do not remove legitimate historical records solely because the terms appear there.

---

# 46. NO UNRELATED CHANGES

Do NOT:

- redesign the entire application;
- change the aesthetic taxonomy;
- change exercise mappings;
- change the decision engine;
- change package logic;
- change volume logic;
- change frequency logic;
- add AI;
- add ML;
- add backend services;
- add APIs;
- add another intensity engine;
- expand the intensity-technique catalog;
- add embedded video;
- add thumbnails;
- add video analytics.

---

# 47. IMPLEMENTATION ORDER

Execute in this exact order.

## Step 1

Audit current repository usage of old video infrastructure.

## Step 2

Remove only genuinely dead video infrastructure.

## Step 3

Update stale documentation/comments.

## Step 4

Audit all 123 video references manually.

## Step 5

Fix any incorrect/unverifiable references.

## Step 6

Run video/data validation.

## Step 7

Verify `getEligibleIntensityTechniques()` is the canonical source.

## Step 8

Verify Exercise Detail renders all eligible techniques.

## Step 9

Verify the no-technique state.

## Step 10

Verify all entry paths reach the same canonical detail experience.

## Step 11

Run adversarial tests.

## Step 12

Run the complete engineering validation suite.

## Step 13

Produce the final Developer Completion Report.

---

# 48. DEVELOPER COMPLETION REPORT

Return a structured report.

## Video

```text
Total exercises:
Links populated:
Manually inspected:
Verified:
Needs review:
Missing:
Unique URLs:
Duplicate URLs:
```

## Intensity

```text
Total exercises:
Exercises with 0 eligible techniques:
Exercises with 1:
Exercises with 2:
Exercises with 3:
Detail coverage:
Explore coverage:
Search coverage:
Homepage coverage:
Decide coverage:
Build coverage:
```

Do not force the counts to any target.

## Engineering

```text
validate-data:
test:
build:
lint:
typecheck:
```

## Cleanup

```text
VideoPlayer references removed:
Dead video utilities removed:
Stale documentation updated:
Stale schema comment updated:
```

## Deviations

List every unresolved item.

---

# 49. DEFINITION OF DONE — VIDEO

The video portion is complete only when:

- [ ] 123 exercise variations remain.
- [ ] 123 valid video links exist.
- [ ] Developer manually inspected the references.
- [ ] Verification status is truthful.
- [ ] 0 missing links.
- [ ] 0 duplicate assignments.
- [ ] Validator enforces required verified status.
- [ ] Metadata is truthful or omitted.
- [ ] No embedded player exists.
- [ ] No thumbnail exists.
- [ ] No iframe exists.
- [ ] No obsolete video utility remains.
- [ ] Documentation matches the actual architecture.

---

# 50. DEFINITION OF DONE — INTENSITY

The intensity feature is complete only when:

- [ ] Every exercise detail page has an explicit intensity-technique state.
- [ ] Eligible techniques are displayed.
- [ ] Multiple eligible techniques are all displayed.
- [ ] Zero-eligible exercises receive a truthful no-technique explanation.
- [ ] No technique is fabricated.
- [ ] Canonical programming data is reused.
- [ ] No second intensity engine exists.
- [ ] Exercise-level applicability remains separate from package-specific prescription.
- [ ] Homepage path works.
- [ ] Search path works.
- [ ] Explore path works.
- [ ] Decide path works.
- [ ] Build path works.
- [ ] Direct detail path works.
- [ ] Existing programming behavior remains unchanged.

---

# 51. DEFINITION OF DONE — ENGINEERING

- [ ] Data validation passes.
- [ ] Tests pass.
- [ ] Build passes.
- [ ] Lint passes.
- [ ] Typecheck passes if available.
- [ ] No unrelated regressions.
- [ ] No unnecessary dependencies.
- [ ] No dead video infrastructure.
- [ ] No stale documentation describing removed architecture.

---

# 52. FINAL ARCHITECTURAL RULE

The final architecture should remain:

```text
                 CANONICAL KNOWLEDGE BASE
                          │
            ┌─────────────┴─────────────┐
            │                           │
       Exercise data              Programming data
            │                           │
            │                 Intensity technique catalog
            │                           │
            └─────────────┬─────────────┘
                          │
                  Canonical engines
                          │
        ┌─────────┬───────┼────────┬─────────┐
        │         │       │        │         │
     Homepage   Search  Explore  Decide    Build
        │         │       │        │         │
        └─────────┴───────┴────────┴─────────┘
                          │
                   Exercise Detail
                          │
          ┌───────────────┼────────────────┐
          │               │                │
      Aesthetic       Programming     Intensity
      purpose         prescription    techniques
                                          │
                                   External video link
```

There is **one canonical knowledge base**, not page-specific copies.

---

# 53. FINAL INSTRUCTION TO GEMINI

Implement this specification exactly.

When a requirement is already correctly implemented, **do not rewrite it** merely because it appears in this document.

When a requirement is incomplete, make the smallest deterministic correction necessary.

When there is a choice between:

```text
inventing new behavior
```

and:

```text
reusing existing canonical behavior
```

always reuse the canonical behavior.

When there is a choice between:

```text
forcing data to look complete
```

and:

```text
truthfully representing that no recommendation exists
```

choose the truthful representation.

When there is a choice between:

```text
adding another abstraction
```

and:

```text
using the existing engine/data
```

use the existing engine/data.

When implementation is complete:

1. run the full validation suite;
2. report actual results;
3. produce the final snapshot;
4. do not begin another feature phase.

**The objective is to close these final gaps and ship Physique Blueprint — not to create more architecture.**
