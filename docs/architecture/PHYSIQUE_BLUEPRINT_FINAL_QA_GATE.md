# Physique Blueprint — Final QA Gate
## Deterministic Final Corrections Before Deployment

**Developer:** Gemini  
**Architect:** ChatGPT  
**Product Owner:** User  
**Status:** Final QA gate — no new development phase

---

# 1. PURPOSE

The latest Architect review found the implementation to be approximately **9/10 and very close to release-ready**.

The major requested functionality is already implemented correctly.

This document is therefore **NOT a new feature phase**.

Do not redesign the application, change established product logic, or expand scope.

The purpose of this pass is only to:

1. prove the current implementation works in a clean environment;
2. close the small remaining testing gaps;
3. verify cross-entry-path consistency;
4. report actual results truthfully;
5. leave the repository in a deployable state.

---

# 2. CURRENT ARCHITECTURAL STATE — DO NOT CHANGE

The following are already considered correct.

Do NOT rewrite them unless a real regression is discovered.

## Video architecture

The final UX is:

    Exercise
        ↓
    "Click here for video"
        ↓
    External YouTube page

There must be:

- no embedded player;
- no iframe;
- no thumbnail;
- no video modal;
- no autoplay;
- no lazy-loaded player;
- no video playback inside the application.

The application only stores and exposes the external reference link.

---

# 3. VIDEO DATA — EXPECTED FINAL STATE

The latest snapshot contains 123 exercise variations.

Expected production data:

| Metric | Expected |
|---|---:|
| Exercise variations | 123 |
| Video links | 123 |
| Verified links | 123 |
| Missing links | 0 |
| Unique URLs | 123 |
| Duplicate assignments | 0 |

These are **verification targets, not numbers to fabricate**.

If any value differs:

1. identify the actual discrepancy;
2. fix it if possible;
3. rerun validation;
4. report the actual final number.

Never mark a video as verified merely because the URL is syntactically valid.

---

# 4. MANUAL VIDEO VERIFICATION

The Developer owns manual verification.

The User does NOT need to manually watch all 123 videos.

For every exercise reference, verify:

1. the URL resolves;
2. it points to an actual video;
3. the demonstrated movement matches the exact exercise variation;
4. the video provides useful execution guidance;
5. the source is credible enough for an execution reference.

Only then may the record be marked:

    video_status: verified

If a link is incorrect:

1. replace it;
2. manually inspect the replacement;
3. then mark it verified.

If no defensible reference can be found, do not invent one. Escalate the specific record to the Architect.

---

# 5. VIDEO VALIDATOR

The existing validator must continue enforcing:

    video_link exists
    AND
    video_link is a valid YouTube URL
    AND
    video_status == "verified"

Also enforce:

    no duplicate video_link assignments

Do not weaken validation rules to obtain a passing result.

---

# 6. REMOVE ONLY DEAD VIDEO INFRASTRUCTURE

The active application must not contain obsolete executable video infrastructure such as:

- VideoPlayer;
- iframe-based playback;
- thumbnail rendering;
- embedded YouTube utilities;
- obsolete video playback tests.

Before deleting anything, check whether it is active code or historical documentation.

Do NOT blindly delete historical architecture/ADR records that document earlier decisions.

---

# 7. DOCUMENTATION

The current operational developer documentation has already been corrected.

It should describe the final Phase 6 architecture as:

> Video References + Execution Guides — 123 exercise-specific YouTube execution references, schema/validator integration, manual curation/QA, simple external-link integration across Explore, Decide, Build, and Exercise Detail.

Do not reintroduce references to an active VideoPlayer/lazy-loading architecture.

The exercise TypeScript model comment should accurately describe that it mirrors the canonical exercise-record schema plus generator/runtime fields.

---

# 8. UNIVERSAL INTENSITY VISIBILITY — CURRENT DESIGN

The application now exposes an:

    Intensity Techniques

section on Exercise Detail.

This is correct.

The section must use the existing canonical:

    getEligibleIntensityTechniques(exercise)

function/data flow.

Do NOT create:

- another intensity engine;
- page-specific technique maps;
- hard-coded technique lists in React components;
- duplicate intensity YAML;
- another source of truth.

---

# 9. IMPORTANT: "EVERY VARIATION" DOES NOT MEAN "FORCE A TECHNIQUE"

Every variation must have an explicit intensity state.

That state can be:

### A. One eligible technique

Show it.

### B. Multiple eligible techniques

Show all of them.

### C. Zero eligible techniques

Show an explicit no-technique explanation.

Do NOT force Drop Sets, Rest-Pause, Myo-Reps, or any other technique onto an exercise simply to make the UI appear complete.

A zero-technique result is valid when the movement's characteristics make the available techniques inappropriate.

---

# 10. CURRENT INTENSITY CATALOG

The existing catalog contains:

- Drop Set
- Rest-Pause
- Myo-Reps

Do NOT expand the catalog in this QA pass.

Do not add new techniques unless separately approved by the Architect.

---

# 11. EXERCISE DETAIL REQUIREMENT

For every exercise detail page:

    Intensity Techniques

must have an explicit state.

If techniques apply:

    display every eligible technique.

If none apply:

    display a useful no-technique explanation.

The user must never see:

- a blank section;
- undefined data;
- a runtime error;
- a misleading statement that data is missing.

---

# 12. MULTIPLE-TECHNIQUE REGRESSION TEST — REQUIRED

This is the one explicit automated-test gap identified in the latest review.

Add a regression test for an exercise known to have **more than one eligible intensity technique**.

The test must prove:

    getEligibleIntensityTechniques(exercise)
        ↓
    returns N > 1
        ↓
    Exercise Detail renders ALL N techniques

Do NOT only test the first technique.

This test must fail if the UI silently renders only the first eligible technique.

---

# 13. ZERO-TECHNIQUE REGRESSION TEST

Keep a regression test for an exercise known to have zero eligible techniques.

Expected:

    Intensity Techniques
        ↓
    explicit no-technique explanation

NOT:

    Drop Set

being added simply to fill the UI.

---

# 14. SINGLE-TECHNIQUE REGRESSION TEST

Keep a regression test for an exercise known to have exactly one eligible technique.

Expected:

    exactly that technique is displayed.

---

# 15. CANONICAL DATA CONSISTENCY

For the same exercise, these must ultimately resolve to the same canonical exercise record:

    Homepage
    Search
    Explore
    Decide
    Build
    Direct Exercise Detail

The intensity-technique eligibility must be derived from the same canonical exercise data.

Do not create route-specific copies.

---

# 16. CROSS-ENTRY-PATH QA

Perform an explicit integration/functional verification for all six paths.

## Path 1 — Homepage

    Homepage
      ↓
    Exercise
      ↓
    Exercise Detail

Verify the intensity section.

## Path 2 — Search

    Search
      ↓
    Exercise
      ↓
    Exercise Detail

Verify the intensity section.

## Path 3 — Explore

    Explore
      ↓
    Exercise
      ↓
    Exercise Detail

Verify the intensity section.

## Path 4 — Decide

    Decide
      ↓
    Recommendation
      ↓
    Exercise Detail

Verify:

- existing recommendation-specific programming remains;
- exercise detail exposes all eligible techniques.

## Path 5 — Build

    Build
      ↓
    Programmed Exercise
      ↓
    Exercise Detail

Verify:

- existing Build prescription remains;
- exercise detail exposes canonical intensity eligibility.

## Path 6 — Direct Detail

Open an exercise detail route directly.

Verify the same canonical intensity state.

---

# 17. RECOMMENDATION VS ELIGIBILITY — DO NOT MERGE

These are intentionally different concepts.

## Exercise Detail

Answers:

> What intensity techniques could reasonably be used with this variation?

Therefore:

    ALL eligible techniques

should be displayed.

## Decide / Build

Answers:

> Which technique does Blueprint actually recommend for this specific programming context?

Therefore:

    existing deterministic ranked recommendation

must remain.

Do not replace one with the other.

---

# 18. PROGRAMMING REGRESSION CHECK

The new intensity-detail UI must NOT change:

- exercise selection;
- aesthetic mapping;
- technical explanations;
- sets;
- reps;
- RIR;
- volume;
- frequency;
- progression logic;
- package construction;
- recommendation ranking.

Compare representative cases before/after implementation.

If the output changes unexpectedly, investigate the cause.

Do not accept an unrelated programming change merely because tests still pass.

---

# 19. AESTHETIC-FIRST PRINCIPLE

Do not alter the established hierarchy:

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

Intensity techniques are supporting programming tools.

They must not become the primary problem-selection mechanism.

---

# 20. VIDEO REGRESSION CHECK

After the intensity changes, verify representative exercises still expose:

    Click here for video

and nothing more.

Confirm:

- external navigation works;
- no embedded player;
- no thumbnail;
- no iframe;
- no modal;
- no autoplay.

---

# 21. REQUIRED COMMANDS

Run these in a clean dependency environment:

    npm install

Then run:

    npm run validate-data
    npm test
    npm run build
    npm run lint

Also run the repository's typecheck command if one exists.

If the project uses a different working directory for app tests/build/lint, use the repository's documented command/path.

---

# 22. IMPORTANT: THE PREVIOUS VALIDATION FAILURE

The previous Architect review attempted:

    npm run validate-data

and the snapshot environment reported:

    Error: Cannot find module 'js-yaml'

This may simply have been because dependencies were not installed in the review environment.

Therefore:

1. install dependencies cleanly;
2. rerun validation;
3. report the actual result.

Do NOT claim that validation passed merely because the command is expected to pass.

---

# 23. COMMAND FAILURE REPORTING

If any command fails, report exactly:

    Command:
    Failure:
    Root cause:
    Fix:
    Rerun result:

Do not hide failures.

Do not weaken tests.

Do not remove validation rules to make the build pass.

---

# 24. DATA VALIDATION REPORT

The final Developer report must contain:

    Total exercise records:
    Video links populated:
    Manually inspected:
    Verified:
    Needs review:
    Missing:
    Unique URLs:
    Duplicate URLs:

Use actual values.

---

# 25. INTENSITY REPORT

Report:

    Total exercise records:
    Zero eligible techniques:
    One eligible technique:
    Two eligible techniques:
    Three eligible techniques:

Do not manipulate eligibility rules to achieve a preferred distribution.

The current architecture permits legitimate zero-technique exercises.

---

# 26. TEST REPORT

Report:

    validate-data:
    tests:
    build:
    lint:
    typecheck:

Use:

    PASS

only if the command actually passed.

Otherwise use:

    FAIL

or:

    NOT AVAILABLE

with an explanation.

---

# 27. CLEANUP REPORT

Report:

    Active VideoPlayer references:
    Active iframe/video-player references:
    Active thumbnail rendering:
    Dead video utilities removed:
    Operational documentation corrected:
    Exercise schema comment corrected:

Again, report actual results.

---

# 28. DO NOT START ANOTHER PHASE

This is a **final QA gate**.

Do not propose:

- Phase 7;
- another architecture redesign;
- AI/ML integration;
- backend expansion;
- new video features;
- new intensity techniques;
- another UI redesign;
- unrelated feature work.

If all requirements in this document pass, the correct next step is:

    DEPLOYMENT / REAL-WORLD USE

not another development cycle.

---

# 29. DEFINITION OF DONE — INTENSITY

The feature is complete only when all are true:

- [ ] Exercise Detail contains an explicit Intensity Techniques state.
- [ ] One eligible technique renders correctly.
- [ ] Multiple eligible techniques ALL render.
- [ ] Zero eligible techniques show a truthful explanation.
- [ ] No technique is fabricated.
- [ ] Canonical `getEligibleIntensityTechniques()` is used.
- [ ] No duplicate intensity engine exists.
- [ ] Exercise-level eligibility remains separate from recommendation-specific programming.
- [ ] Homepage path verified.
- [ ] Search path verified.
- [ ] Explore path verified.
- [ ] Decide path verified.
- [ ] Build path verified.
- [ ] Direct Detail path verified.
- [ ] Existing programming behavior is unchanged.
- [ ] Multiple-technique regression test exists and passes.

---

# 30. DEFINITION OF DONE — VIDEO

- [ ] 123 exercise variations accounted for.
- [ ] 123 video links populated.
- [ ] 123 references manually inspected.
- [ ] Verified statuses are truthful.
- [ ] 0 missing links.
- [ ] 0 duplicate URL assignments.
- [ ] Validator enforces verified status.
- [ ] No embedded video.
- [ ] No iframe.
- [ ] No thumbnail.
- [ ] No video modal/player.
- [ ] No obsolete active video infrastructure.
- [ ] Current documentation matches the external-link architecture.

---

# 31. DEFINITION OF DONE — ENGINEERING

- [ ] Dependencies install successfully.
- [ ] Data validation passes.
- [ ] Automated tests pass.
- [ ] Production build passes.
- [ ] Lint passes.
- [ ] Typecheck passes if available.
- [ ] No unrelated regressions.
- [ ] Actual command results are documented.
- [ ] Final snapshot is produced.

---

# 32. FINAL DEVELOPER INSTRUCTION

Implement ONLY the corrections and verification described in this document.

If something is already correct, leave it alone.

If a requirement is ambiguous, prefer the existing canonical implementation rather than inventing new behavior.

If there is a choice between:

    forcing completeness

and:

    representing the real state truthfully

choose the truthful state.

If there is a choice between:

    creating a new abstraction

and:

    reusing the existing canonical engine

reuse the existing engine.

If all checks pass:

    STOP DEVELOPMENT.

Provide the final Developer Completion Report with actual command outputs/results and hand the repository back to the Architect for final sign-off.

The objective is to **finish and ship Physique Blueprint**, not to create another round of development.
