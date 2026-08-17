# Physique Blueprint — Deployment & Production Readiness

**Status:** Approved  
**Purpose:** Final pre-deployment readiness pass and initial production deployment.

## 1. Objective

The Blueprint architecture is now considered complete for the current version.

Do not introduce another architecture phase as part of deployment.

Use this sequence:

```text
Completed Blueprint
    ↓
Production-readiness pass
    ↓
Build / validate
    ↓
Deploy
    ↓
Use on mobile in real workouts
    ↓
Collect concrete feedback
    ↓
Fix real defects only
```

## 2. Production Readiness

### Build and validation

Verify:

- production build succeeds;
- full automated test suite passes;
- TypeScript/type checking passes;
- lint passes;
- data validation passes;
- all required static assets are included;
- no development-only runtime dependency is required.

Do not weaken or delete tests to make deployment pass.

### Decision-engine smoke test

Verify these representative cases:

- chest side projection;
- shoulder width;
- back width;
- back thickness;
- arm side thickness;
- lower-calf fullness;
- calf width/shape;
- upper-trap fullness;
- above-knee quad separation.

For each:

```text
Aesthetic problem
    ↓
Correct target
    ↓
Correct aesthetic role
    ↓
Sensible exercise
    ↓
Sensible programming
```

Technical explanation and recommendation must remain consistent.

## 3. Required Regression Cases

Preserve and manually smoke-test:

```text
Arms thin from side
→ Brachialis
→ Hammer/Cable Hammer family
→ not triceps-only

Lower calf fullness
→ Soleus
→ Seated Calf Raise

Calf width/shape
→ Gastrocnemius
→ Standing Calf Raise preferred over Leg Press Calf Raise

Upper-trap fullness
→ Upper Traps
→ Shrug preferred over Rack Pull

Above-knee separation
→ Quads
→ Leg Extension preferred over Reverse Nordic

Shoulder width
→ Side Delt
→ Lateral Raise family

Back width
→ Lat / width target

Back thickness
→ Mid/upper-back target
```

Verify that back width and back thickness produce meaningfully different recommendations.

## 4. Programming Smoke Test

Check that recommendations provide sensible:

- sets;
- reps;
- RIR/intensity;
- frequency;
- volume;
- progression;
- intensity technique where appropriate.

Heavy compounds should not receive inappropriate intensity techniques.

Stable isolation work may use appropriate intensity techniques.

Do not redesign programming during deployment readiness.

## 5. Intensity-Technique Check

Verify:

- Drop Set is not universal;
- Rest-Pause can appear when appropriate;
- Myo-Reps can appear when appropriate;
- `None` remains valid;
- heavy/high-skill compounds are protected from inappropriate techniques.

## 6. Asset and Runtime Integrity

Check production for:

- knowledge/data files;
- exercise data;
- aesthetic outcomes;
- target data;
- programming rules;
- anatomy assets;
- images/icons;
- CSS;
- JavaScript bundles;
- fonts where applicable.

No production asset may depend on local filesystem paths such as:

```text
C:\...
/Users/...
/home/...
/mnt/data/...
```

Check for accidental:

```text
localhost
development URLs
mock data
temporary routes
debug UI
test-only buttons
```

## 7. Network / Static-App Check

If the application is intended to be client-side/static:

- core decision-making must not depend on a development server;
- no accidental localhost API calls;
- required knowledge/data must load correctly;
- do not introduce a backend merely for deployment.

## 8. Mobile Readiness

Primary target: mobile.

Test approximately:

```text
375px
390px
```

Verify:

- no horizontal scrolling;
- no clipped controls;
- cards fit the viewport;
- dropdowns work;
- results are readable;
- programming information is readable;
- technical explanations are readable;
- anatomy image/modal works;
- zoom/pan works;
- buttons are easy to tap;
- long names wrap correctly;
- scrolling is natural.

## 9. Desktop Smoke Test

Verify:

- application loads;
- decision flow works;
- dropdowns work;
- recommendation cards render;
- no obvious layout regression;
- no development-only UI is exposed.

## 10. Refresh / Navigation

Test:

```text
Open app
→ use decision flow
→ refresh
```

The app must not break.

If client-side routes exist, test legitimate direct navigation and configure static-host fallback if required.

## 11. Browser Runtime Check

During smoke testing, check the browser console.

There must be no blocking:

- uncaught JavaScript errors;
- failed required asset requests;
- missing data files;
- failed image loads;
- broken imports.

Non-critical third-party warnings may be documented.

## 12. Performance

Perform a basic mobile load check.

Verify:

- reasonable initial load;
- no unnecessarily huge assets;
- anatomy images do not unnecessarily block usability;
- decision UI becomes usable promptly;
- no obvious repeated data loading.

Do not perform a performance rewrite unless a real deployment issue appears.

## 13. Deployment

Preferred first deployment:

```text
GitHub repository
    ↓
Production build
    ↓
Static hosting
    ↓
HTTPS
    ↓
Phone browser
```

Do not add:

- database;
- backend;
- authentication;
- cloud functions;
- AI APIs;

unless an actual requirement emerges.

Prefer the repository's existing deployment configuration if one already exists.

## 14. Versioning

Before deployment:

1. Ensure the working tree is clean.
2. Ensure the final Phase 4C implementation is committed.
3. Ensure validation corresponds to that commit.
4. Tag or identify the first production version.

Recommended:

```text
v1.0.0
```

Use the repository's existing versioning convention if different.

The production deployment must be traceable to a specific Git commit.

## 15. README

Ensure the README documents:

```text
Project purpose
Local setup
Running tests
Production build
Deployment
Production URL
Knowledge-base location
Aesthetic-outcome location
Exercise-data location
Programming-rule location
Safe knowledge-update process
```

Keep architecture documentation separate from README.

## 16. Real-World Feedback

Create:

```text
docs/
└── real-world-feedback/
    ├── observations.md
    ├── bugs.md
    └── enhancement-ideas.md
```

### observations.md

Record:

```text
Date:
Scenario:
Input:
Recommendation:
Useful?
Notes:
```

### bugs.md

Record only actual defects:

```text
Date:
Input:
Expected:
Actual:
Category:
Knowledge / Ranking / Programming / UI / Other
Status:
```

### enhancement-ideas.md

Use for ideas that are not current defects.

This prevents every new idea from becoming an immediate engineering task.

## 17. Real-World Usage

After deployment, use Blueprint during actual training decisions:

```text
Notice a visual problem
    ↓
Open Blueprint
    ↓
Select/describe the problem
    ↓
Read recommendation
    ↓
Read technical explanation
    ↓
Review programming
    ↓
Decide whether it is actually useful
```

Real-world usage is now the most valuable validation source.

## 18. What Counts as a Defect?

### Defect

Example:

```text
Input:
Arms look thin from side

Expected:
Brachialis-focused recommendation

Actual:
Triceps-only recommendation
```

Fix the knowledge/ranking rule and add a regression test.

### Preference

Example:

```text
"I personally prefer another exercise."
```

Not automatically a defect.

### Enhancement

Example:

```text
"I wish I could save favorite exercises."
```

A product feature, not a recommendation-engine defect.

## 19. Post-Deployment Rule

Do not immediately start another architecture phase.

Use:

```text
Real-world use
    ↓
Observe
    ↓
Concrete issue
    ↓
Prioritize
    ↓
Fix
    ↓
Regression test
    ↓
Deploy
```

Freeze the architecture unless a real requirement cannot be represented cleanly by the existing model.

## 20. Final Checklist

- [ ] Production build passes.
- [ ] Full automated test suite passes.
- [ ] Type checking passes.
- [ ] Lint passes.
- [ ] Data validation passes.
- [ ] No development-only runtime dependency remains.
- [ ] No localhost/development URLs remain.
- [ ] No required asset uses a local filesystem path.
- [ ] Core aesthetic decision flow works.
- [ ] Brachialis regression passes.
- [ ] Soleus/lower-calf regression passes.
- [ ] Calf-width regression passes.
- [ ] Upper-trap regression passes.
- [ ] Above-knee separation regression passes.
- [ ] Shoulder-width regression passes.
- [ ] Back-width/thickness contrast passes.
- [ ] Programming output is sensible.
- [ ] Intensity-technique selection is sensible.
- [ ] 375px mobile test passes.
- [ ] 390px mobile test passes.
- [ ] Desktop smoke test passes.
- [ ] Anatomy reference/zoom works.
- [ ] Refresh/direct navigation works where applicable.
- [ ] Browser console has no blocking errors.
- [ ] Production URL works over HTTPS.
- [ ] Production commit/version is identified.
- [ ] README contains run/build/deploy instructions.
- [ ] Real-world feedback folder exists.

## 21. Definition of Done

The deployment/readiness pass is complete when:

```text
Tests green
    +
Production build green
    +
Data/assets valid
    +
Mobile UI verified
    +
Decision engine smoke-tested
    +
No blocking runtime errors
    +
Production deployment succeeds
    +
Production URL accessible
    +
First production version tied to a Git commit
```

Then:

# 🚀 DEPLOY IT.

Do not delay deployment for hypothetical improvements.

## 22. Final Architect Instruction

The Blueprint has reached the point where real-world use is more valuable than additional theoretical architecture.

From this point forward:

```text
Use
→ Observe
→ Identify concrete defect
→ Fix
→ Regression test
→ Deploy
```

The objective is not theoretical perfection.

The objective is a Blueprint that is **consistently useful to someone standing in the gym trying to decide what to do next.**
