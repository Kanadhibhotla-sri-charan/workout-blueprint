# Real-World Bugs

Record only actual defects surfaced by real use — not preferences, not enhancement ideas. See [`docs/architecture/DEPLOYMENT-AND-PRODUCTION-READINESS.md`](../architecture/DEPLOYMENT-AND-PRODUCTION-READINESS.md) §18 for what counts as a defect vs. a preference vs. an enhancement.

A defect example from the spec:

```text
Input:      Arms look thin from side
Expected:   Brachialis-focused recommendation
Actual:     Triceps-only recommendation
```

That kind of gap gets fixed at the knowledge/ranking rule level, with a regression test added — not by patching the UI or hand-tweaking one recommendation.

Use the post-deployment loop for every entry here:

```text
Real-world use → Observe → Concrete issue → Prioritize → Fix → Regression test → Deploy
```

---

### Template

```text
Date:
Input:
Expected:
Actual:
Category:   Knowledge / Ranking / Programming / UI / Other
Status:
```

---

<!-- Add entries below this line, most recent first. -->

```text
Date:       2026-08-19
Input:      User compared the new Build tab against the existing Explore/Decide tabs.
Expected:   A consistent visual language across all three tabs — Phase 5's card-based
            design was intended to describe how the app should generally read, not a
            one-tab-only skin.
Actual:     Only Build got the richer treatment. Explore/Decide's cards (exercise-card,
            decision-result-block) and region-tile actually already shared the same
            border/radius/padding/background formula as Build's cards, but had no
            hover/focus-visible feedback, buttons had no hover state at all, and
            collapsible <details> summaries were styled inconsistently across pages
            (technical-detail: plain text; decision-result-trace: muted, by design;
            package-exercise-details: accent-colored — three different treatments for
            the same "expand for more" affordance).
Category:   UI
Status:     Fixed — added hover/focus-visible transitions to .exercise-card/.region-tile/
            .button, and unified accent-colored summary styling for expandable details
            across Exercise Detail and the Build package cards, CSS-only (no markup or
            behavior changes, no test changes required).
```

