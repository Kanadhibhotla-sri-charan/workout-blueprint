# Physique Blueprint — Video References + Final Refinement
## Gemini Developer Implementation Specification

**Status:** Authoritative implementation instruction  
**Developer:** Gemini  
**Architect:** ChatGPT  
**Product owner / final decision maker:** User

---

# 1. Project Operating Model

This project uses a deliberate three-role model.

## Architect — ChatGPT

Owns:
- product architecture and system design;
- knowledge-model decisions;
- UX/product direction;
- interpretation of user goals;
- identifying contradictions and edge cases;
- implementation specifications;
- review of developer output;
- adversarial testing strategy;
- production-readiness decisions.

The Architect does not directly implement the application.

## Developer — Gemini

Owns:
- repository inspection;
- implementation;
- code changes;
- tests;
- validation/build/lint/type checks;
- implementation logs;
- reporting deviations and unresolved issues;
- producing snapshots for review.

Gemini must not silently reinterpret product requirements.

If a decision materially affects architecture, knowledge, exercise programming, UX, data model, or curation policy, escalate rather than inventing a decision.

## User — Product Owner

Owns:
- actual product need;
- real-world usability;
- product preferences;
- acceptance/rejection;
- prioritization when tradeoffs exist;
- final approval of significant product decisions.

The User should describe what the product must do; the Architect translates that into a deterministic implementation specification.

---

# 2. Decision-Making Hierarchy

Use:

User requirement
→ Architect product/system decision
→ Developer implementation
→ Developer testing
→ Architect review
→ User real-world acceptance
→ Sign-off

### Product requirement disagreement
User decides.

### Architecture disagreement
Architect decides.

### Implementation-detail disagreement
Developer may choose the simplest sound implementation if product behavior and architecture are unchanged.

### Knowledge disagreement
Escalate to Architect.

### Exercise programming disagreement
Escalate to Architect.

### Video-selection disagreement
Use the curation rules below; if two candidates remain genuinely comparable, escalate.

---

# 3. Development Lifecycle

Every substantial change follows:

1. User identifies need.
2. Architect analyzes it.
3. Architect writes the specification.
4. Developer implements.
5. Developer tests.
6. Architect reviews the snapshot.
7. Architect performs adversarial review where appropriate.
8. User tests real UX.
9. Required corrections are implemented.
10. Sign-off.

Do not skip review for significant changes.

---

# 4. Current Requirement

The existing Blueprint contains a validated exercise knowledge base with 123 exercise variations.

The new requirement is:

> Add one canonical, trustworthy YouTube execution reference for every one of the 123 exercise variations and integrate it consistently across Explore, Decide, Build, and exercise detail.

This is an extension of the existing exercise knowledge base.

It is NOT a new recommendation engine.

---

# 5. Video Curation — MANUAL FINAL SELECTION

## Manual curation is REQUIRED.

Do not populate the 123 links by automatically taking the first YouTube search result.

Automation may assist with:
- finding candidates;
- extracting metadata;
- checking URL syntax;
- detecting duplicates;
- preparing a review list.

But the final video for every exercise must be manually inspected and verified.

The final selection must be based on exercise-specific quality, not creator loyalty.

---

# 6. Video Selection Priority

Evaluate candidates in this order:

1. Exact variation match.
2. Technique quality.
3. Setup clarity.
4. Execution clarity.
5. Credibility.
6. Conciseness.
7. Stability / established source.
8. Creator preference.

Creator preference is deliberately last.

Athlean-X, Jeff Nippard, Renaissance Periodization, or another credible source may all be used.

Do not force all 123 videos to come from a fixed set of creators.

The goal is:

> the best practical execution reference for each specific exercise variation.

---

# 7. Candidate Video Requirements

A selected video should preferably:

- demonstrate the exact variation;
- clearly show setup;
- clearly show execution;
- be reasonably concise, preferably around 1–5 minutes;
- come from a technically credible source;
- avoid unsafe or misleading instruction;
- be useful to a real gym user;
- not contradict the execution intent of Blueprint.

Popularity and view count are secondary.

Avoid hype-first content such as “secret exercise”, “destroy your chest”, etc.

---

# 8. Rare or Difficult Variations

If an exact dedicated video cannot be found:

1. Search further.
2. Consider a credible source demonstrating the exact movement in another format.
3. Only use a closely related movement if the technical difference is genuinely negligible for execution.
4. Document the exception.

If uncertain:

`video_status: needs_review`

Do not silently substitute a materially different exercise.

Prefer standard videos over Shorts unless a Short is genuinely the best available reference.

---

# 9. Video Metadata

At minimum:

```yaml
video_link: "https://www.youtube.com/watch?v=..."
```

Recommended:

```yaml
video_link: "https://www.youtube.com/watch?v=..."
video_title: "..."
video_creator: "..."
video_status: "verified"
```

Follow the repository's existing naming/data conventions rather than creating a conflicting style.

One canonical video belongs to the exercise variation itself.

Do not duplicate URLs separately in Explore, Decide, or Build data.

---

# 10. Schema and Validation

Add an optional exercise field:

```text
video_link: string | null
```

The validator should accept:
- null;
- valid YouTube watch URLs;
- valid youtu.be URLs;
- other standard YouTube URL forms already supported by the project.

Syntax validation is not curation validation.

Once all 123 references are verified, production validation should require every production exercise to have a verified reference.

---

# 11. Curation QA Record

Maintain a curation record containing:

```text
Exercise ID
Exercise Name
Video URL
Creator
Exact Variation? YES/NO
Setup Clear? YES/NO
Execution Clear? YES/NO
Credible? YES/NO
Reasonably Concise? YES/NO
Verified? YES/NO
Notes
```

Only mark a video `verified` after manual inspection.

Target final state:

```text
123 total exercises
123 video references
123 manually verified references
0 missing production references
```

---

# 12. Curation Workflow

For every exercise:

```text
Exercise
  ↓
Search YouTube
  ↓
Collect 2–3 candidates where possible
  ↓
Compare
  ↓
Select best candidate
  ↓
Inspect enough of the video to verify it
  ↓
Record metadata
  ↓
Mark verified
```

Do not batch-approve first search results.

---

# 13. Video Integration Architecture

Use one source of truth:

```text
Exercise knowledge
      ↓
video_link
      ↓
shared exercise view model
      ↓
┌──────────────┬──────────────┬──────────────┐
↓              ↓              ↓
EXPLORE       DECIDE         BUILD
↓              ↓              ↓
Video         Video          Video
```

Do not store separate URLs in package data or page-specific components.

---

# 14. VideoPlayer Component

Create a reusable component such as:

`VideoPlayer.tsx`

Responsibilities:
- responsive preview;
- clear play affordance;
- lazy-load YouTube iframe;
- load iframe only after user interaction;
- handle missing/malformed URLs gracefully;
- keyboard accessibility;
- responsive aspect ratio;
- close/return behavior if modal playback is used.

Do not render 123 YouTube iframes at page load.

---

# 15. Video UI

The video should look like part of Blueprint, not a pasted external link.

Preferred:

```text
┌─────────────────────────────────────┐
│                                     │
│                ▶                    │
│          VIDEO PREVIEW              │
│                                     │
└─────────────────────────────────────┘

EXECUTION GUIDE

Watch technique on YouTube →
```

Do not autoplay.

Do not load an iframe before interaction.

Use the existing Blueprint design tokens.

---

# 16. Exercise Detail

Add:

`EXECUTION GUIDE`

Recommended hierarchy:

```text
Exercise identity
↓
Visual effect
↓
Technical explanation
↓
Execution Guide
↓
Programming
```

The video answers:

> How do I perform this?

Blueprint's knowledge answers:

> Why is this useful?

---

# 17. Explore Integration

Exercise cards should subtly indicate video availability.

Preferred:

```text
INCLINE BARBELL PRESS
Primary Builder

Upper chest • projection

▶ Watch technique
```

Do not add a large generic YouTube badge to every card.

The video action should be part of the exercise's primary hierarchy.

---

# 18. Decide Integration

When Decide recommends an exercise, show the video action immediately:

```text
YOUR FOCUS

CROSS-BODY HAMMER CURL

Brachialis emphasis

3 × 8–12 · RIR 1–2

▶ Watch technique
```

This is particularly important when the recommendation is an exercise the user may not already know.

---

# 19. Build Integration

Exercise cards should support:

```text
01  CROSS-BODY HAMMER CURL
PRIMARY BUILDER

3 × 8–12 · RIR 1–2

Brachialis emphasis

▶ Watch technique

Why this exercise? ˅
Programming ˅
Intensity technique ˅
Progression ˅
```

The video action should be visible without opening multiple accordions.

---

# 20. UI Direction

Use the existing final UI overhaul specification as the visual authority.

The application should remain:

- dark-first;
- premium;
- technical;
- calm;
- information-dense;
- purposeful.

Explore, Decide, and Build must feel like one product.

Do not create a separate visual theme for the video feature.

---

# 21. Application-Wide UI Requirement

The previous implementation improved Build substantially, but Explore and Decide also need to belong to the same visual system.

The final product should communicate:

```text
EXPLORE → Understand
DECIDE  → Diagnose
BUILD   → Develop
```

### Explore
A premium knowledge library, not a plain list.

### Decide
A guided diagnostic experience, not a generic form.

### Build
The flagship development/programming experience.

All three must share:
- app shell;
- typography;
- spacing;
- surfaces;
- borders;
- buttons;
- accent;
- motion;
- responsive behavior.

---

# 22. Do Not Be Conservative With UI

The final UI is not complete if the only changes are:

- new colors;
- slightly larger cards;
- shadows;
- rounded corners;
- one gradient.

It must visibly demonstrate:
- stronger hierarchy;
- stronger typography;
- deliberate surfaces;
- polished navigation;
- meaningful visualizations;
- premium exercise cards;
- coherent Explore/Decide/Build layouts;
- responsive design;
- integrated execution references.

Advanced does NOT mean neon, excessive animation, 3D, WebGL, or a heavy dashboard framework.

The desired result is:

> premium information design.

---

# 23. Existing Functional Refinements

Preserve and verify the previously approved Phase 5 refinements.

## Why This Exercise

Must show:

```text
Why this exercise?
→ package contribution

Intensity Technique
→ technique + context
```

These remain separate.

## Intensity

Continue using the existing deterministic programming/intensity system.

Do not create a separate video-specific programming system.

## Programming

Review package programming for:
- compound vs isolation;
- loading potential;
- fatigue;
- technical demand;
- rep range;
- RIR;
- exercise order;
- intensity technique.

Do not introduce arbitrary differences.

## Volume

Review packages approaching approximately 24–26 direct sets/week.

Ask:

> Is each set justified by unique visual coverage or useful development?

If yes, keep it. If not, reduce redundancy.

## Efficient vs Complete

The UI should explain:

> What does Complete add?

Use actual package differences rather than generic claims.

---

# 24. Testing

Run the repository's existing commands.

At minimum, where available:

```text
npm run validate-data
npm test
npm run build
npm run lint
```

Also run the repository's existing typecheck command if present.

Do not invent replacement commands when official project scripts exist.

---

# 25. Video-Specific Testing

Verify:

- all 123 references exist;
- all URLs pass syntax validation;
- all 123 have been manually verified;
- no duplicate reference was accidentally assigned where the variation requires a different demonstration;
- video metadata is consistent;
- missing/broken URLs do not crash the application.

---

# 26. Cross-Mode Testing

For a representative sample, verify:

```text
Explore → video
Decide → same video
Build → same video
```

The video must originate from the same exercise record.

Do not permit mode-specific copies to drift.

---

# 27. Mobile QA

Test at:

```text
375px
390px
```

Verify:
- video preview fits;
- play target is comfortable;
- exercise cards remain readable;
- no horizontal overflow;
- modal/player fits if used;
- navigation remains usable;
- no important information is hidden.

---

# 28. Desktop QA

Test at:

```text
1024px
1280px+
```

Verify:
- player has an appropriate maximum width;
- page does not become excessively stretched;
- exercise information remains readable;
- Explore/Decide/Build maintain coherent proportions.

---

# 29. Accessibility

Video controls must have:
- accessible labels;
- keyboard support;
- visible focus state;
- sufficient contrast;
- no color-only communication.

Example:

`Watch technique video for Incline Barbell Press`

---

# 30. Maintenance

YouTube videos can disappear.

Make replacement easy.

If necessary:

```yaml
video_status: broken
```

Then manually replace and re-verify.

Maintain a curation log:

```text
Exercise ID
Selected video
Creator
Date verified
Status
Notes
```

---

# 31. What Gemini May Decide

Gemini may independently choose:
- component names;
- CSS implementation;
- exact spacing values;
- thumbnail implementation;
- modal vs inline player if both meet the UX;
- test organization;
- internal helper functions.

Provided product behavior and architecture remain unchanged.

---

# 32. What Gemini MUST Escalate

Stop and ask the Architect if:
- no defensible video can be found;
- two candidates are genuinely tied;
- a candidate contradicts Blueprint's execution intent;
- the exercise variation itself appears incorrect;
- programming needs to change;
- knowledge taxonomy needs to change;
- routing/product workflow needs to change;
- a new backend/service is proposed;
- a new recommendation engine is proposed.

---

# 33. User Review Protocol

After implementation, report:

1. What changed.
2. Number of video references added.
3. Number manually verified.
4. Any unresolved exercises.
5. Test/build results.
6. UI areas changed.
7. Any decisions still requiring approval.

Do not report simply:

> Done.

---

# 34. Architect Review Protocol

The Architect will review:

### Data
- 123 exercises;
- correct mapping;
- no missing references;
- metadata integrity.

### Curation
- exact variation match;
- technique quality;
- credibility;
- consistency with Blueprint.

### Engineering
- lazy loading;
- shared source of truth;
- validation;
- no architecture drift.

### UI
- Explore;
- Decide;
- Build;
- exercise detail;
- mobile;
- desktop;
- visual consistency.

### Adversarial cases
- missing URL;
- malformed URL;
- broken video;
- exercise recommended by Decide;
- exercise used by Build;
- exercise accessed through Explore;
- unusual/rare variation.

---

# 35. Final Sign-Off Conditions

## Video
- [ ] All 123 variations have canonical references.
- [ ] All 123 references manually verified.
- [ ] Exact variation matching checked.
- [ ] Metadata recorded.
- [ ] URL validation passes.
- [ ] Lazy loading works.
- [ ] Explore integration works.
- [ ] Decide integration works.
- [ ] Build integration works.
- [ ] Exercise detail integration works.

## UI
- [ ] Explore, Decide, Build feel like one product.
- [ ] Dark-first premium direction implemented.
- [ ] Video component belongs visually to Blueprint.
- [ ] 375px and 390px pass.
- [ ] Desktop passes.
- [ ] Accessibility passes.

## Existing Blueprint
- [ ] Decision engine unchanged.
- [ ] Knowledge hierarchy unchanged.
- [ ] Programming logic unchanged unless explicitly approved.
- [ ] Package engine unchanged.
- [ ] Existing regressions pass.

## Engineering
- [ ] Tests pass.
- [ ] Validation passes.
- [ ] Build passes.
- [ ] Lint passes.
- [ ] No unnecessary dependencies.
- [ ] No backend added.
- [ ] No AI/ML added.

---

# 36. Project Boundary

Do NOT turn this into:
- AI video recommendation;
- video analytics;
- workout video tracking;
- creator ranking;
- personalized video feeds;
- video hosting;
- social features.

The requirement is simply:

> When Blueprint tells a user to perform an exercise, the user can immediately access a trustworthy demonstration of that exact movement.

---

# 37. Final Operating Principle

The project operates as:

```text
USER
"Here's what I want."
        ↓
ARCHITECT
"Here's the correct product/system design."
        ↓
DEVELOPER
"Here's the implementation."
        ↓
ARCHITECT
"Here's what is correct / incorrect."
        ↓
USER
"Here's what works / doesn't work in reality."
        ↓
ARCHITECT
"Here's the smallest required correction."
        ↓
DEVELOPER
"Implemented."
        ↓
SHIP
```

Do not skip directly from User → Developer for substantial product changes.

The Architect exists to prevent implementation drift.

---

# 38. Final Instruction to Gemini

Implement this specification faithfully.

Do not treat the video feature as an excuse to redesign the architecture.

Do not automatically select 123 videos.

Manually curate and verify every final reference.

Keep one canonical video per exercise variation.

Use the same exercise record everywhere.

Preserve the existing Physique Blueprint intelligence.

Make the final application feel like one coherent premium product across:

```text
EXPLORE
DECIDE
BUILD
```

Then validate thoroughly and provide the implementation snapshot for Architect review.

# The objective is to finish this feature and ship it.
