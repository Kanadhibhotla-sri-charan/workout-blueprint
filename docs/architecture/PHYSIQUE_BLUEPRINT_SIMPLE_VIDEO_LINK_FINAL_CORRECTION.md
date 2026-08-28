# Physique Blueprint — Simplified Exercise Video References
## Final Implementation Correction for Gemini

**Status:** Authoritative correction to the previous video-reference implementation  
**Developer:** Gemini  
**Architect:** ChatGPT  
**Product Owner:** User

---

# 1. IMPORTANT — SIMPLIFY THE VIDEO FEATURE

The current video implementation is more elaborate than required.

The final requirement is intentionally simple:

> **Each exercise variation should have one useful YouTube reference, represented only as a clickable text link.**

The application must NOT play YouTube content inside Blueprint.

Remove the embedded-video experience.

---

# 2. REMOVE THE FOLLOWING

Remove or stop using:

- YouTube iframe/player;
- `VideoPlayer` component if it exists solely for this feature;
- embedded video playback;
- video modal/player;
- YouTube thumbnail loading;
- YouTube preview images;
- lazy-loaded iframe logic;
- autoplay;
- external thumbnail requests;
- any video-specific UI that attempts to preview/play the content.

Do not retain this infrastructure merely because it was already implemented.

The feature does not need it.

---

# 3. FINAL USER EXPERIENCE

The user should simply see a text link associated with the exercise.

Preferred presentation:

```text
INCLINE BARBELL PRESS
PRIMARY BUILDER

3 × 6–10 · RIR 1–2

Upper chest • projection

🎥 Click here for video
```

or:

```text
Watch technique video →
```

Either is acceptable.

The important requirement is:

> **It is a normal external hyperlink to YouTube.**

Clicking it should take the user to YouTube.

Nothing is played inside Blueprint.

---

# 4. WHY WE ARE DOING THIS

The product requirement is not to become a video player.

The requirement is simply:

> When Blueprint recommends an exercise, give the user an immediate reference for how to perform it.

A simple link accomplishes that.

Do not introduce additional infrastructure for functionality the user did not request.

---

# 5. DATA MODEL

Keep one canonical video URL attached to the exercise variation.

The exercise record should contain something equivalent to:

```yaml
video_link: "https://www.youtube.com/watch?v=..."
```

Existing metadata may remain if it is useful:

```yaml
video_link: "https://www.youtube.com/watch?v=..."
video_title: "..."
video_creator: "..."
video_status: "verified"
```

Do not create separate video URLs for:

- Explore;
- Decide;
- Build;
- Exercise Detail.

All views must consume the same exercise record.

---

# 6. SCHEMA

`video_link` may remain nullable during development:

```text
video_link: string | null
```

The final production data should have a verified link for every exercise variation.

Do not create a new video database.

Do not create a backend.

Do not create a video service.

Do not create an AI video recommendation system.

---

# 7. VIDEO LINK VALIDATION

The data validator should verify that:

- the field is null or a valid YouTube URL;
- malformed values are rejected.

Supported normal YouTube formats may include:

```text
https://www.youtube.com/watch?v=...
https://youtu.be/...
https://www.youtube.com/shorts/...
```

Follow the existing repository validation conventions.

Remember:

> URL syntax validation is not the same as content verification.

---

# 8. MANUAL VIDEO VERIFICATION — CLARIFICATION

This point is important.

The **User is NOT expected to manually verify all 123 videos.**

The **Developer (Gemini) is responsible for manual curation and verification during implementation.**

"Manual verification" means:

For each exercise:

1. Find a candidate YouTube video.
2. Open the actual video.
3. Confirm it demonstrates the intended exercise variation.
4. Confirm the demonstration is reasonably clear.
5. Confirm the source is reasonably credible.
6. Record the URL.
7. Mark the reference as verified.

It does NOT mean:

> The User must watch and approve 123 videos.

The Developer owns this work.

---

# 9. VIDEO CURATION RULE

The final reference should be selected according to:

```text
Exact variation match
        ↓
Technique quality
        ↓
Setup / execution clarity
        ↓
Credibility
        ↓
Reasonable length
        ↓
Source stability
        ↓
Creator preference
```

Do NOT choose videos merely because:

- they have many views;
- they rank first in search;
- they are from a favorite creator.

Creator preference is secondary.

The goal is:

> **The best practical reference for the exact exercise variation.**

---

# 10. CREATOR POLICY

Do not enforce a fixed creator whitelist.

Athlean-X, Jeff Nippard, Renaissance Periodization, another credible coach, a specialist, or another appropriate source may be used.

Selection is exercise-specific.

The application is building an **exercise reference library**, not a creator library.

---

# 11. EXACT VARIATION REQUIREMENT

Be careful with similar exercises.

Examples:

```text
Incline Barbell Press
≠
Incline Dumbbell Press

Hammer Curl
≠
Cross-Body Hammer Curl

Standing Calf Raise
≠
Seated Calf Raise
```

If an exact variation video exists and is good, prefer it.

Do not substitute a materially different exercise merely because the names are similar.

---

# 12. DUPLICATE VIDEO AUDIT

The previous implementation showed duplicate YouTube URLs across multiple exercise records.

Do a full audit of all 123 exercise records.

For each duplicate:

```text
Exercise A → Video X
Exercise B → Video X
```

determine whether the same video genuinely demonstrates both variations.

If not:

> replace the incorrect reference.

Do not treat duplicate URLs as automatically wrong, but every duplicate must be defensible.

---

# 13. METADATA INTEGRITY

If storing:

```yaml
video_title:
video_creator:
```

those values must correspond to the actual linked video.

Do not generate titles based on the exercise name unless that is genuinely the video's title.

Do not invent metadata.

If metadata cannot be confidently established, omit it rather than fabricating it.

---

# 14. VERIFICATION STATUS

Only use:

```yaml
video_status: verified
```

when the Developer has actually inspected the linked video.

A syntactically valid URL is NOT sufficient.

A populated URL is NOT sufficient.

A YouTube search result is NOT sufficient.

Verified means:

> The Developer opened the actual reference and confirmed that it is an appropriate execution reference for the exercise.

---

# 15. USER ROLE IN VIDEO CURATION

The User does NOT need to:

- search for 123 videos;
- open 123 videos;
- approve 123 videos;
- maintain a spreadsheet of 123 links.

The User's role is normal product use.

If the User later encounters:

> "This video isn't actually the exercise."

the User reports it.

Then:

```text
User
 ↓
Architect
 ↓
Determine whether issue is curation/data/knowledge
 ↓
Developer
 ↓
Replace/fix
 ↓
Regression
```

---

# 16. WHERE THE LINK SHOULD APPEAR

The same canonical link should be available wherever an exercise is presented.

### Explore

```text
INCLINE BARBELL PRESS

Primary Builder
Upper chest • projection

🎥 Click here for video
```

### Decide

```text
YOUR FOCUS

INCLINE BARBELL PRESS

3 × 6–10 · RIR 1–2

🎥 Click here for video
```

### Build

```text
01  INCLINE BARBELL PRESS

PRIMARY BUILDER

3 × 6–10 · RIR 1–2

🎥 Click here for video

Why this exercise? ˅
Programming ˅
Intensity technique ˅
Progression ˅
```

### Exercise Detail

```text
EXECUTION GUIDE

🎥 Click here for video
```

---

# 17. LINK BEHAVIOR

Use a standard external hyperlink.

Preferred:

```html
<a href="..." target="_blank" rel="noopener noreferrer">
  Click here for video
</a>
```

Follow the project's existing link conventions if they differ.

The link should clearly communicate that it opens YouTube.

Do not load anything from YouTube until the user chooses to follow the link.

---

# 18. UI REQUIREMENT

Keep the presentation simple.

Do not add:

- thumbnails;
- preview cards;
- play overlays;
- iframe containers;
- video modals;
- video progress;
- embedded playback controls.

The video reference should be a **small, tasteful secondary action**.

It should not compete with:

- exercise name;
- aesthetic role;
- programming;
- recommendation;
- contribution.

---

# 19. EXISTING UI — PRESERVE THE FINAL DIRECTION

This correction does NOT cancel the previous application-wide UI work.

The application should continue to feel like one coherent premium product:

```text
EXPLORE
DECIDE
BUILD
```

with:

- dark-first visual identity;
- strong typography;
- coherent surfaces;
- deliberate spacing;
- premium information hierarchy;
- responsive behavior.

The video link is simply one element within that system.

Do not create a separate visual style for it.

---

# 20. EXISTING FUNCTIONAL REFINEMENTS — PRESERVE

Do not regress:

### Why this exercise

```text
Why this exercise?
→ contribution
```

### Intensity

```text
Intensity technique
→ technique + context
```

These must remain separate.

---

# 21. EXISTING PROGRAMMING

Continue using the existing deterministic programming/intensity system.

Do not introduce:

- video-specific programming;
- AI-generated programming;
- a second recommendation engine.

The video exists only to provide execution guidance.

---

# 22. EXISTING PACKAGE LOGIC

Preserve:

- Efficient package;
- Complete package;
- package comparison;
- visual coverage;
- weekly volume;
- frequency;
- programming;
- progression.

Do not modify package logic merely to add videos.

---

# 23. TESTING

Run the repository's official validation commands.

At minimum, where available:

```text
npm run validate-data
npm test
npm run build
npm run lint
```

Run type checking if an official script exists.

---

# 24. VIDEO DATA TESTS

Verify:

```text
123 exercise records
123 video references
0 missing production references
0 malformed production URLs
```

Then audit duplicate URLs.

For every duplicate:

```text
same video genuinely appropriate for both?
YES → retain
NO  → replace
```

---

# 25. VIDEO CURATION QA

The Developer should produce a concise report containing:

```text
Total exercises: 123
References populated: 123
References manually inspected: 123
Verified: 123
Needs review: 0
Missing: 0
Unresolved duplicates: 0
```

If any number is not 123/0 as appropriate, report the actual number.

Do not claim completion prematurely.

---

# 26. Adversarial Checks

Before handing the snapshot to the Architect, test:

### Missing link

Exercise has no URL.

Expected:

- page still works;
- video action is hidden or gracefully unavailable.

### Invalid link

Expected:

- validation catches it.

### Duplicate link

Expected:

- flagged for curation review.

### Wrong exercise title metadata

Expected:

- curation review catches it.

### Same exercise across modes

Expected:

```text
Explore → same URL
Decide → same URL
Build → same URL
Exercise Detail → same URL
```

---

# 27. IMPORTANT — NO VIDEO PLAYER

The final implementation must contain **no embedded YouTube playback**.

If an existing `VideoPlayer` component was created during the previous implementation:

- remove it if no longer needed;
- remove its tests if they only test embedded playback;
- remove unnecessary YouTube thumbnail/iframe dependencies;
- keep only the simple link functionality.

Do not retain dead infrastructure.

---

# 28. Architecture After This Change

The final architecture should simply be:

```text
Exercise Knowledge
│
├── exercise definition
├── aesthetic role
├── technical targets
├── programming
├── intensity
└── video_link
        │
        ↓
   shared exercise data
        │
   ┌────┼────┐
   ↓    ↓    ↓
Explore Decide Build
        │
        ↓
   External YouTube
```

Simple.

No video subsystem is required.

---

# 29. Project Operating Model

Continue following:

```text
USER
Product need / real-world feedback
        ↓
ARCHITECT — ChatGPT
Product + architecture + implementation decision
        ↓
DEVELOPER — Gemini
Code + tests + implementation
        ↓
ARCHITECT
Review + adversarial testing
        ↓
USER
Real-world acceptance
        ↓
SHIP
```

---

# 30. Responsibility Boundaries

### User

Provides:

- product requirements;
- real-world feedback;
- preferences;
- final acceptance.

### Architect

Provides:

- system/product decisions;
- implementation specifications;
- conflict resolution;
- codebase review;
- adversarial review;
- production recommendation.

### Developer

Provides:

- implementation;
- curation;
- testing;
- validation;
- implementation logs;
- snapshot for review.

---

# 31. Escalation Rules

Gemini must escalate if:

- no good video exists for a variation;
- two candidates are genuinely comparable;
- the available video contradicts Blueprint's intended exercise role;
- the exercise definition itself appears questionable;
- programming needs to change;
- knowledge taxonomy needs to change;
- a new backend/service is proposed;
- a product workflow needs to change.

Gemini may make normal implementation decisions without escalation.

---

# 32. Final Definition of Done

### Data

- [ ] 123 exercise variations have video links.
- [ ] Each link has been manually inspected by the Developer.
- [ ] Exact variation match checked.
- [ ] Duplicate links audited.
- [ ] Metadata is accurate or omitted.
- [ ] Verified status is truthful.

### UI

- [ ] Simple text link only.
- [ ] No thumbnail.
- [ ] No iframe.
- [ ] No embedded player.
- [ ] No modal video.
- [ ] Explore has link.
- [ ] Decide has link.
- [ ] Build has link.
- [ ] Exercise Detail has link.

### Architecture

- [ ] One canonical source of truth.
- [ ] No duplicate video data.
- [ ] No video subsystem.
- [ ] No backend.
- [ ] No AI/ML.
- [ ] No unnecessary dependencies.

### Existing Blueprint

- [ ] Decision engine unchanged.
- [ ] Knowledge hierarchy unchanged.
- [ ] Package engine unchanged.
- [ ] Programming logic unchanged unless separately approved.
- [ ] Existing regressions pass.

### Validation

- [ ] Data validation passes.
- [ ] Tests pass.
- [ ] Build passes.
- [ ] Lint passes.
- [ ] Typecheck passes if available.

---

# 33. Final Instruction to Gemini

Implement this correction as a **simplification**, not an expansion.

Remove the embedded video implementation.

Keep the canonical YouTube URL on each exercise.

Render only a simple clickable text link.

Manually inspect and verify every selected reference yourself as the Developer.

The User is **not** responsible for manually approving all 123 videos.

Do not create additional infrastructure.

Do not redesign the recommendation engine.

Do not create another project phase.

After implementation and curation:

1. run all validation;
2. produce the curation QA report;
3. produce the implementation snapshot;
4. hand it back to the Architect for review.

# The requirement is intentionally simple:

## One exercise → one trustworthy video link → click → YouTube.

Nothing more.
