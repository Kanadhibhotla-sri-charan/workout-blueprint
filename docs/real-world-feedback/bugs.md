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
