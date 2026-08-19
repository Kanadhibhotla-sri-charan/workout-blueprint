# Physique Blueprint — Final UI Overhaul + Phase 5 Production Refinement
## Implementation Specification for Claude Code

**Status:** Final implementation instruction  
**Source snapshot:** `workout-blueprint-main(5).zip`  
**Scope:** Final Phase 5 refinement + complete application-wide visual redesign  
**Primary objective:** Make the application feel like one deliberate, premium product — not a new Build page sitting beside two older pages.

---

# 0. IMPORTANT — THIS IS A DESIGN SPEC, NOT A SUGGESTION LIST

The previous UI instructions were too open to interpretation.

This document is intentionally more prescriptive.

Do **not** interpret this as:

> "Make the UI prettier."

Interpret it as:

> **"Implement the visual product direction defined below against the existing architecture and data."**

The developer is expected to make substantial visual changes.

Do not preserve the current conservative visual treatment simply because it already works.

At the same time:

**Do not change the underlying decision logic, knowledge architecture, or package architecture merely to achieve the visual result.**

---

# 1. Current Snapshot Assessment

The current snapshot already has:

- Build Muscle route;
- Efficient / Complete packages;
- package engine;
- coverage visualization;
- volume/frequency information;
- exercise cards;
- package rationale;
- semantic design-token aliases;
- responsive CSS;
- Explore;
- Decide;
- shared Layout.

The problem is now primarily **product coherence and visual ambition**.

The current application still feels approximately like:

```text
Old application
├── Explore
├── Decide
└── Home

Newer application
└── Build
```

That is not acceptable for the final product.

The entire application must now feel like:

```text
                 PHYSIQUE BLUEPRINT
                        │
        ┌───────────────┼───────────────┐
        ↓               ↓               ↓
     EXPLORE          DECIDE           BUILD
   Understand        Diagnose        Develop
   the library      the problem      the muscle
        │               │               │
        └───────────────┴───────────────┘
                        ↓
              One unified visual system
```

---

# 2. Product Identity

Physique Blueprint is not supposed to look like:

- a generic CRUD application;
- a documentation website;
- a basic workout tracker;
- a neon bodybuilding/gaming app;
- a plain React demo.

It should feel like a:

> **premium physique-analysis and training intelligence product.**

Desired characteristics:

```text
Dark-first
Premium
Technical
Confident
Clean
Visual
Information-dense
Calm
Purposeful
```

The interface should communicate:

> "There is a serious knowledge system underneath this."

---

# 3. Major Design Decision — DARK-FIRST

The current snapshot uses a light/default appearance with system dark-mode switching.

For the final application:

## Make dark mode the primary visual identity.

The default experience should be dark.

Do not simply invert the existing colors.

Design the dark theme intentionally.

Conceptual palette:

```text
Page background:
very dark charcoal / near-black

Primary surface:
slightly lighter charcoal

Elevated surface:
another subtle step lighter

Borders:
low-contrast charcoal

Primary text:
near-white

Secondary text:
muted gray

Accent:
refined green / teal

Accent glow:
very restrained
```

The existing green/teal accent can be retained, but use it with more sophistication.

Do not flood the screen with accent color.

---

# 4. Design Tokens

Create a coherent design-token system.

Conceptually:

```css
--bg-page
--bg-surface
--bg-surface-raised
--bg-surface-hover
--border-subtle
--border-strong

--text-primary
--text-secondary
--text-muted
--text-disabled

--accent
--accent-soft
--accent-strong

--success
--warning
--danger

--radius-sm
--radius-md
--radius-lg
--radius-xl

--shadow-card
--shadow-elevated

--space-1
--space-2
--space-3
--space-4
--space-5
--space-6
--space-7
--space-8
```

Do not scatter arbitrary values throughout components.

---

# 5. Typography

The application needs stronger typography hierarchy.

Use:

```text
Display / Hero
Large page title
Section heading
Card heading
Metric
Label
Body
Caption
```

Example hierarchy:

```text
CHEST
All-Round Development

16
SETS / WEEK

VISUAL COVERAGE

Upper chest
██████████
```

The user should understand the hierarchy even before reading every word.

Avoid making every element bold.

---

# 6. Global App Shell

The current header:

```text
Physique Blueprint | Explore | Decide | Build
```

is too basic.

Replace it with a more deliberate app shell.

Desktop:

```text
┌────────────────────────────────────────────────────────────┐
│ ◈ PHYSIQUE BLUEPRINT     Explore   Decide   Build   ●     │
└────────────────────────────────────────────────────────────┘
```

Where:

- brand is visually strong;
- active navigation is obvious;
- navigation has generous spacing;
- active state is a subtle accent pill/underline;
- there is no unnecessary visual noise.

On desktop the header can be slightly more spacious.

On mobile:

```text
┌─────────────────────────────────┐
│ ◈ PHYSIQUE BLUEPRINT       ☰    │
└─────────────────────────────────┘
```

Use a compact navigation pattern if necessary.

Do not squeeze all three navigation links into an overcrowded mobile header.

---

# 7. Global Content Width

The current application uses a narrow `720px` maximum width.

That is too restrictive for the redesigned product.

Use responsive maximum widths appropriate to page type.

Conceptually:

```text
Reading / detail:
~760–840px

Decision interface:
~900–1000px

Build dashboard:
~1100–1200px

Explore:
~1100–1200px
```

Do not make every page full-width.

Use width according to information density.

---

# 8. Background Treatment

The page background should not be a completely flat block.

Use subtle depth:

```text
Page background
    ↓
very subtle radial/gradient atmosphere
    ↓
surface cards
    ↓
elevated cards
```

The effect should be barely noticeable.

Example conceptual direction:

```text
Top/hero area:
slightly lighter atmospheric glow

Main page:
deep neutral background

Cards:
subtle elevated surfaces
```

Do not create dramatic neon gradients.

---

# 9. Card System

Cards should have:

- consistent radius;
- consistent border;
- subtle surface contrast;
- deliberate internal spacing;
- hover/focus state where interactive.

Avoid the current feeling of:

```text
card inside card inside card inside card
```

Use nesting sparingly.

Prefer:

```text
Page section
  → one strong surface
      → content hierarchy
```

rather than multiple decorative containers.

---

# 10. Interaction Style

Interactive elements should visibly feel interactive.

### Hover

Subtle:

```text
border becomes slightly brighter
surface shifts slightly
```

### Active

Use accent:

```text
accent border
accent background tint
```

### Focus

Strong accessible outline.

### Press

Small visual compression is acceptable.

Avoid excessive animation.

---

# 11. Motion

Use motion to establish hierarchy, not entertainment.

Good:

- 150–250ms card transitions;
- smooth accordion expansion;
- subtle page-section reveal;
- progress bar animation.

Avoid:

- bouncing;
- spinning;
- constant floating;
- long transitions;
- distracting entrance animations.

Respect:

```text
prefers-reduced-motion
```

---

# 12. HOME PAGE — REDESIGN COMPLETELY

The Home page should become the product's entry point.

Current structure is too text/list oriented.

Replace with a strong hero.

Conceptual layout:

```text
┌──────────────────────────────────────────────────────┐
│                                                      │
│              PHYSIQUE BLUEPRINT                      │
│                                                      │
│      Turn physique goals into explainable            │
│      training decisions.                             │
│                                                      │
│      ┌────────────────────┐ ┌────────────────────┐   │
│      │  ◉ FIX A PROBLEM   │ │  ◈ BUILD MUSCLE   │   │
│      │                     │ │                    │   │
│      │  Diagnose a visual  │ │  Build complete   │   │
│      │  limitation.        │ │  development.     │   │
│      │                     │ │                    │   │
│      │  → Start            │ │  → Start           │   │
│      └────────────────────┘ └────────────────────┘   │
│                                                      │
│      ┌────────────────────────────────────────────┐  │
│      │  EXPLORE THE EXERCISE LIBRARY          →  │  │
│      │  Search, compare and understand exercises │  │
│      └────────────────────────────────────────────┘  │
│                                                      │
└──────────────────────────────────────────────────────┘
```

The three product modes must be immediately understandable:

```text
Explore = Learn
Decide  = Diagnose
Build   = Develop
```

---

# 13. HOME — Visual Hierarchy

Priority:

1. Brand/product statement.
2. Decide / Build paths.
3. Explore.
4. Search.
5. Browse by body region.

Do not put a long body-region grid immediately after the hero.

Move secondary browsing lower on the page.

---

# 14. EXPLORE — COMPLETE VISUAL REDESIGN

This is important.

The new Build UI must **not** look premium while Explore still looks like a utility list.

Explore must become the knowledge-library side of the same product.

Conceptual desktop:

```text
┌──────────────────────────────────────────────────────────────┐
│ EXPLORE                                                      │
│ The exercise library                                        │
│ Find movements, understand what they do, and compare roles. │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ 🔎 Search exercises...                                  │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
│ [ All ] [ Chest ] [ Back ] [ Shoulders ] [ Arms ] ...       │
│                                                              │
│ ┌────────────────────────┐ ┌────────────────────────┐       │
│ │ INCLINE BARBELL PRESS  │ │ CABLE FLY              │       │
│ │                        │ │                        │       │
│ │ CHEST                  │ │ CHEST                  │       │
│ │ Primary builder        │ │ Direct / detail        │       │
│ │                        │ │                        │       │
│ │ Upper chest            │ │ Chest contour          │       │
│ │ ██████████             │ │ ████████░░             │       │
│ │                        │ │                        │       │
│ │ View exercise →        │ │ View exercise →        │       │
│ └────────────────────────┘ └────────────────────────┘       │
└──────────────────────────────────────────────────────────────┘
```

---

# 15. Explore — Exercise Cards

Exercise cards should show:

```text
Exercise name
Body region
Primary role
Primary target
Small visual indicator
```

Do not dump all technical metadata into the card.

The card is a gateway to understanding.

---

# 16. Explore — Exercise Detail

The exercise detail page should use the same visual language as Build.

Conceptual structure:

```text
← EXPLORE

INCLINE BARBELL PRESS
Primary chest builder

PRIMARY FUNCTION
Upper chest mass / projection

VISUAL EFFECT
[plain-language mirror description]

TECHNICAL TARGET
[technical explanation]

PROGRAMMING
Sets / reps / RIR / rest / intensity

ALTERNATIVES
...

COMPLEMENTS
...
```

The user should feel that Explore, Decide, and Build are three modes of the same knowledge system.

---

# 17. DECIDE — COMPLETE VISUAL REDESIGN

This is the most important non-Build change.

The Decision Maker already contains the core intelligence.

Do not rewrite the engine.

Redesign the interface around the existing decision flow.

The user should feel:

> "I am being guided through a diagnosis."

not:

> "I am filling out a form."

---

# 18. Decide — Desired Mental Model

```text
WHAT ARE YOU TRYING TO IMPROVE?
        ↓
WHERE DO YOU SEE IT?
        ↓
WHAT DOES IT LOOK LIKE?
        ↓
WHAT IS THE SYSTEM'S DIAGNOSIS?
        ↓
WHAT SHOULD YOU TRAIN?
        ↓
HOW SHOULD YOU TRAIN IT?
```

The interface should visually communicate this progression.

---

# 19. Decide — Hero

```text
DECIDE

Turn a visual problem into a
training decision.

Tell Blueprint what you see.
It will explain what may be limiting it
and what to focus on.
```

Then begin the diagnostic flow.

---

# 20. Decide — Step Container

Instead of presenting every input as one long page, use strong sections.

Example:

```text
STEP 01
WHAT ARE YOU TRYING TO IMPROVE?

[ Chest ]
[ Shoulders ]
[ Back ]
[ Arms ]
...
```

Then:

```text
STEP 02
WHAT DOES IT LOOK LIKE?

[ Looks flat from front ]
[ Looks narrow ]
[ Lacks separation ]
[ Looks thin from side ]
...
```

The exact existing options/logic must be preserved.

Only presentation changes.

---

# 21. Decide — Progress Indicator

Show:

```text
01 ───── 02 ───── 03 ───── RESULT
●          ○          ○          ○
```

or an equivalent visual.

The user should always know where they are.

Do not make it look like a generic checkout flow.

---

# 22. Decide — Result Page

The result is the payoff.

Make it visually strong.

Conceptual:

```text
┌─────────────────────────────────────────────────────┐
│ YOUR PHYSIQUE DIAGNOSIS                             │
│                                                     │
│ SIDE-VIEW ARM THICKNESS                             │
│                                                     │
│ PRIMARY DRIVER                                      │
│ BRACHIALIS                                          │
│                                                     │
│ Why?                                                │
│ The brachialis sits beneath the biceps and          │
│ contributes strongly to front-to-back arm depth.   │
│                                                     │
│ FOCUS                                               │
│ ┌─────────────────────────────────────────────────┐ │
│ │ CROSS-BODY HAMMER CURL                          │ │
│ │ Brachialis emphasis                             │ │
│ │ 3 × 8–12 · RIR 1–2                             │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ SUPPORTING                                         │
│ TRICEPS                                             │
│ ...                                                 │
│                                                     │
│ PROGRAMMING                                         │
│ ...                                                 │
└─────────────────────────────────────────────────────┘
```

The exact diagnosis and recommendation must continue coming from the existing engine.

---

# 23. Decide — Technical Explanation

The technical explanation should be visually secondary to the aesthetic problem.

Hierarchy:

```text
AESTHETIC PROBLEM
        ↓
DIAGNOSIS
        ↓
RECOMMENDATION
        ↓
TECHNICAL EXPLANATION
        ↓
PROGRAMMING
```

This preserves the project's central philosophy:

> aesthetics creates the problem statement; technical knowledge explains it.

---

# 24. BUILD — FINAL VISUAL DIRECTION

Build should be the flagship feature.

Use the richer visual language described below.

---

# 25. Build Landing Page

Conceptual:

```text
┌──────────────────────────────────────────────────────────┐
│ BUILD THE MUSCLE                                         │
│                                                          │
│ Complete visual-development packages                     │
│ built from Blueprint's exercise and programming model.  │
│                                                          │
│ ┌────────────────────┐ ┌────────────────────┐           │
│ │ CHEST              │ │ SHOULDERS          │           │
│ │                    │ │                    │           │
│ │ Upper / mid /      │ │ Width / roundness  │           │
│ │ lower development  │ │ / rear balance     │           │
│ │                    │ │                    │           │
│ │ Explore →          │ │ Explore →          │           │
│ └────────────────────┘ └────────────────────┘           │
│                                                          │
│ ...                                                      │
└──────────────────────────────────────────────────────────┘
```

Muscle cards should feel like **product modules**, not simple text links.

---

# 26. Build — Muscle Hero

Required information:

```text
CHEST
All-Round Development

Balanced visual chest development

16
SETS / WEEK

2×
FREQUENCY

100%
COVERAGE
```

Use large numbers.

Metrics should be visually dominant.

---

# 27. Build — Coverage Graphic

Use a deliberate visual.

Example:

```text
VISUAL COVERAGE

UPPER PEC        ●●●●●
OVERALL MASS     ●●●●●
PROJECTION       ●●●●○
CONTOUR          ●●●●●
```

Do not invent metrics.

Only display data actually supported by the package.

---

# 28. Build — Efficient vs Complete

Use a strong toggle/segmented control:

```text
┌───────────────────────────────────┐
│   EFFICIENT    │    COMPLETE     │
│      ●         │                 │
└───────────────────────────────────┘
```

Below it:

```text
COMPLETE
Comprehensive visual development

5 exercises
11 sets / session
22 direct sets / week
2× / week
```

Then:

```text
WHAT COMPLETE ADDS

✓ Additional regional coverage
✓ Additional visual/detail work
✓ Higher justified volume
```

These bullets must be derived from actual package differences where practical.

---

# 29. Build — Exercise Timeline

Do not present the workout as an undifferentiated list.

Use sequence:

```text
01
│
├── INCLINE PRESS
│   PRIMARY BUILDER
│   3 × 6–10 · RIR 1–2
│
│
02
│
├── FLAT PRESS
│   PRIMARY BUILDER
│   3 × 6–10 · RIR 1–2
│
│
03
│
└── CABLE FLY
    DIRECT DETAIL
    2 × 10–15 · RIR 1–2
```

A vertical timeline is preferred on desktop if it remains readable.

On mobile, convert it into stacked cards with a visible sequence number.

---

# 30. Build — Exercise Card

Default:

```text
01  INCLINE PRESS
PRIMARY BUILDER

3 × 6–10          RIR 1–2

Upper chest • projection

Why this exercise?  ˅
```

Expanded:

```text
WHY THIS EXERCISE?

Upper-chest mass and projection.

INTENSITY TECHNIQUE

None

PROGRAMMING

Sets: 3
Reps: 6–10
RIR: 1–2

PROGRESSION

Add reps while maintaining target RIR.
Increase load after reaching the top of the range.
```

---

# 31. Build — Weekly Plan

Show how the package becomes a week.

```text
WEEKLY DISTRIBUTION

SESSION A
● Incline Press
● Flat Press
● Cable Fly

SESSION B
● Incline Press
● Flat Press
● Cable Fly

16 DIRECT SETS / WEEK
```

If sessions differ, show the actual differences.

---

# 32. Build — Volume Visualization

Use a compact but meaningful visualization.

Example:

```text
WEEKLY DIRECT VOLUME

12        16        20
│─────────●─────────│
          16

16 direct sets / week
```

Avoid pretending that the display is an exact physiological optimum.

It is a programming target.

---

# 33. Build — High-Volume Warning

If the package is intentionally high-volume:

```text
HIGH-VOLUME OPTION

Higher recovery demand.
Best suited to a high-priority muscle with adequate
recovery capacity.
```

This should be calm and informative, not a warning alarm.

---

# 34. Build — Package Rationale

Use a distinct section:

```text
WHY THIS PACKAGE

This combination is designed to cover the major visual
characteristics without relying on multiple versions
of the same movement.

Incline Press
→ upper-region mass / projection

Flat Press
→ broad overall development

Cable Fly
→ direct complementary detail work
```

This is one of the most important educational sections.

---

# 35. Explore / Decide / Build — Shared Visual Identity

All three must share:

```text
same header
same background
same typography
same card language
same buttons
same accent
same focus states
same spacing system
same motion system
same responsive rules
```

But each mode should have a distinct purpose.

### Explore

Color/visual emphasis:

```text
Knowledge
Discovery
Library
```

### Decide

Color/visual emphasis:

```text
Diagnosis
Guidance
Decision
```

### Build

Color/visual emphasis:

```text
Development
Programming
Progression
```

Do not create three unrelated themes.

---

# 36. Navigation Labels

Use:

```text
EXPLORE
DECIDE
BUILD
```

These are intentionally simple.

The home page can explain them as:

```text
Explore → Understand
Decide  → Diagnose
Build   → Develop
```

---

# 37. Mobile Navigation

At widths around 375–390px:

Use either:

```text
brand + menu
```

or:

```text
compact bottom navigation
```

Choose whichever produces the better UX with the existing routing.

If using bottom navigation:

```text
┌─────────────────────────────────┐
│  Explore   Decide   Build       │
└─────────────────────────────────┘
```

Keep Home accessible through the brand.

Do not force a hamburger menu if it makes the primary modes harder to reach.

---

# 38. Mobile Design Principle

Mobile is not:

> desktop but smaller.

Mobile is a deliberate layout.

At 375/390px:

- one main column;
- cards stack;
- metrics stack or use compact grids;
- long explanations collapse;
- navigation remains obvious;
- no horizontal scrolling;
- no tiny typography;
- no cramped comparison cards.

---

# 39. Desktop Design Principle

At desktop:

- use width intelligently;
- introduce two-column layouts where information benefits from comparison;
- use stronger visual grouping;
- preserve whitespace;
- avoid stretching text to extreme widths.

The application should feel like a desktop product rather than a mobile page floating in a large browser.

---

# 40. Visual Depth

Use three levels:

```text
LEVEL 0
Page background

LEVEL 1
Primary surfaces / cards

LEVEL 2
Elevated/active surfaces
```

Do not create six levels of shadows.

Prefer subtle borders and surface contrast over giant shadows.

---

# 41. Icons / Symbols

Use a consistent icon strategy.

Acceptable:

- lightweight SVG icons;
- existing icon library if already installed;
- simple CSS/icon glyphs.

Do not introduce a large icon dependency just for decorative icons.

Icons should support recognition.

They should not replace important text.

---

# 42. Decorative Graphics

This project can use graphics.

But graphics must reinforce the product's information model.

Good:

```text
coverage map
volume gauge
frequency indicator
exercise sequence line
metric visualization
```

Bad:

```text
random muscle silhouettes
huge decorative dumbbells
animated flames
generic bodybuilding stock graphics
```

The UI should look sophisticated because of information design, not because of decoration.

---

# 43. Current UI — What Must Change

Do not merely append CSS to make the current implementation slightly nicer.

The following must visibly change:

- Home hero;
- global header/navigation;
- page width/layout;
- Explore cards/list;
- Explore detail;
- Decide step layout;
- Decide result layout;
- Build landing page;
- Build package page;
- exercise cards;
- package comparison;
- coverage section;
- metrics;
- spacing;
- typography;
- surfaces;
- responsive behavior.

A user opening the final app should immediately recognize:

> "This is one redesigned product."

---

# 44. Current UI — What Must NOT Change

Do not alter:

- decision-engine logic;
- diagnostic outcomes;
- target mappings;
- exercise knowledge;
- package engine architecture;
- exercise IDs;
- programming engine semantics;
- routing semantics unless required for the UI;
- data validation rules.

The redesign is visual/product presentation, not a knowledge rewrite.

---

# 45. Functional Refinement — Why This Exercise

Ensure:

```text
Why this exercise?
→ contribution

Intensity technique
→ technique + context
```

These are separate expandable sections.

Add a regression test.

---

# 46. Functional Refinement — Intensity

Ensure package exercises receive contextual intensity recommendations from the existing programming system.

Examples:

```text
Heavy compound
→ None

Stable isolation
→ possible Drop Set / Myo-Reps / Rest-Pause
```

Do not force techniques universally.

---

# 47. Functional Refinement — Programming

Perform a final package-by-package review.

Check:

- compound vs isolation;
- loading potential;
- fatigue;
- technical demand;
- exercise order;
- RIR;
- rep range;
- intensity technique.

Do not introduce arbitrary variation just to look advanced.

---

# 48. Functional Refinement — Volume

Review every package.

Calculate:

```text
sets/session × frequency = direct sets/week
```

Then ask:

> Does each set earn its place?

Pay particular attention to packages around:

```text
~24–26 direct sets/week
```

These are not automatically wrong.

They must be defensible.

If they are intentionally high-volume, communicate that in the UI.

---

# 49. Functional Refinement — Efficient vs Complete

Complete should answer:

> What do I gain?

not simply:

> How many more exercises are there?

Show:

```text
WHAT COMPLETE ADDS

✓ New visual target coverage
✓ Additional detail work
✓ Additional justified volume
```

Only claim what the actual data supports.

---

# 50. Testing

Run:

```text
npm test
npm run build
npm run lint
typecheck
data validation
```

Use the repository's actual scripts rather than inventing new commands.

---

# 51. Existing Regression Tests

Protect:

```text
Brachialis side thickness
Lower-calf fullness
Calf width/shape
Upper-trap fullness
Above-knee separation
Shoulder width
Back width vs thickness
Primary vs supporting target
UNSPECIFIED fallback
Programming profile classification
Intensity-technique selection
```

---

# 52. Manual UI QA

Test at:

```text
375px
390px
768px
1024px
1280px+
```

Test:

```text
Home
Explore
Exercise Detail
Decide
Decision Result
Build
Muscle Package
Efficient
Complete
Expanded exercise cards
```

Verify:

- no horizontal overflow;
- no clipped controls;
- no broken sticky elements;
- no text overlap;
- no inaccessible accordions;
- no inconsistent spacing;
- no visual theme mismatch between pages.

---

# 53. Cross-Mode Consistency Test

Open:

```text
Explore → one exercise
Decide → one recommendation
Build → same exercise
```

The exercise should feel visually like the same entity in all three places.

Likewise:

```text
Explore
Decide
Build
```

must visibly share the same product shell.

---

# 54. "Do Not Be Conservative" Requirement

This section is explicit.

The developer must NOT respond to this document by:

- changing a few colors;
- increasing border radius;
- adding one gradient;
- adding a shadow;
- calling the redesign complete.

The redesign is complete only when the following are visibly true:

### Home

A strong product hero and three clear product modes.

### Explore

A proper visual knowledge library, not a plain list.

### Decide

A guided diagnostic experience, not a generic form.

### Build

A flagship development dashboard.

### Shared shell

All three look like the same application.

### Visual hierarchy

Important information is visibly more important than supporting information.

### Responsive design

Mobile and desktop each feel intentionally designed.

---

# 55. Do Not Overdo It

"Advanced" does NOT mean:

- neon;
- flashy;
- animated everywhere;
- huge charts;
- 3D;
- WebGL;
- complex dashboards;
- dozens of visual effects.

The desired result is:

> **premium information design.**

The user should think:

> "This looks seriously well designed."

not:

> "This is trying very hard to look futuristic."

---

# 56. Implementation Strategy

Implement in this order:

```text
UI-1
Create/finalize global design tokens
        ↓
UI-2
Redesign global app shell/header/navigation
        ↓
UI-3
Redesign Home
        ↓
UI-4
Redesign Explore list
        ↓
UI-5
Redesign Explore detail
        ↓
UI-6
Redesign Decide flow
        ↓
UI-7
Redesign Decide result
        ↓
UI-8
Redesign Build landing
        ↓
UI-9
Redesign Build package hero
        ↓
UI-10
Redesign package selector/comparison
        ↓
UI-11
Redesign exercise cards
        ↓
UI-12
Implement coverage/volume/frequency visuals
        ↓
UI-13
Implement weekly programming/rationale sections
        ↓
UI-14
Mobile redesign
        ↓
UI-15
Desktop polish
        ↓
UI-16
Accessibility
        ↓
UI-17
Functional refinements
        ↓
UI-18
Regression tests
        ↓
UI-19
Build/lint/type/data validation
        ↓
UI-20
Final visual QA
```

---

# 57. Functional + UI Definition of Done

## Functional

- [ ] Why-this-exercise shows contribution.
- [ ] Intensity technique is separate.
- [ ] Intensity techniques are contextual.
- [ ] Programming is appropriately exercise-specific.
- [ ] Efficient vs Complete communicates actual value.
- [ ] All packages pass volume/redundancy review.

## UI

- [ ] Home redesigned.
- [ ] Explore redesigned.
- [ ] Exercise detail redesigned.
- [ ] Decide redesigned.
- [ ] Decision result redesigned.
- [ ] Build redesigned.
- [ ] Global shell redesigned.
- [ ] One coherent design system across all pages.
- [ ] Dark-first identity implemented.
- [ ] Premium visual hierarchy implemented.
- [ ] Coverage/volume/frequency visuals implemented.
- [ ] Exercise cards redesigned.
- [ ] 375px verified.
- [ ] 390px verified.
- [ ] Desktop verified.
- [ ] No horizontal overflow.
- [ ] Accessibility verified.
- [ ] Reduced-motion behavior verified.

## Engineering

- [ ] Existing architecture preserved.
- [ ] Existing decision logic unchanged.
- [ ] Existing package engine reused.
- [ ] No duplicate knowledge database.
- [ ] No AI/ML/backend added.
- [ ] Tests pass.
- [ ] Build passes.
- [ ] Lint passes.
- [ ] Typecheck passes.
- [ ] Data validation passes.

---

# 58. Final Product Test

Before sign-off, open the application as a first-time user.

Ask:

### Home

> Do I immediately understand what this product does?

### Explore

> Does this feel like a serious exercise knowledge library?

### Decide

> Does this feel like the app is diagnosing my problem rather than asking me to fill out a form?

### Build

> Does this feel like a complete development plan rather than an exercise list?

### Overall

> Do Explore, Decide, and Build feel like three modes of ONE product?

If the answer to any is no, the UI pass is not complete.

---

# 59. Final Boundary

After this implementation:

# FREEZE THE ARCHITECTURE.

No Phase 6.

No second package engine.

No AI.

No backend.

No endless visual redesign.

The next development cycle should be driven by actual use:

```text
Real workout use
      ↓
Concrete problem
      ↓
Knowledge / Programming / UI / Feature
      ↓
Smallest appropriate fix
      ↓
Regression test
      ↓
Deploy
```

The project has reached the point where the objective is no longer:

> "How much more can we build?"

It is:

> **"Can a real person use this confidently in the gym?"**

That is the production bar.
