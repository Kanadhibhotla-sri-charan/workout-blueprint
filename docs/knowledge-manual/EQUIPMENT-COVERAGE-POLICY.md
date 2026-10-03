# Equipment Coverage Policy

What Physique Blueprint promises for equipment-limited users, especially bodyweight-only users. It was adopted in Phase 7 Stage 5.2 as **Policy B**; the evidence is in [`docs/dev/reports/PHASE-7-STAGE-5.2-BODYWEIGHT-SCOPE.md`](../dev/reports/PHASE-7-STAGE-5.2-BODYWEIGHT-SCOPE.md).

How equipment is matched (setups, feasibility, bodyweight always available) is defined in [`DECISION-ENGINE-RULES.md`](../dev/reports/DECISION-ENGINE-RULES.md) §1. This document covers what coverage the library should aim for.

## Policy B

1. **Bodyweight is supported where it is physiologically and programmatically meaningful.**
   - Selecting no equipment means bodyweight-only.
   - Decide recommends a bodyweight exercise whenever one directly trains what was asked.
2. **Some targets may legitimately have no bodyweight recommendation.**
   - Upper traps, forearm flexors and extensors, side and rear delts, biceps, brachialis, triceps long head, and soleus cannot be meaningfully loaded with bodyweight alone.
   - For these, an empty result is the correct answer, not a gap to close.
3. **Never manufacture coverage.**
   - Do not tag an exercise with a target it only works indirectly. For example:
     - grip work is not direct forearm-flexor or forearm-extensor training;
     - carries are not upper-trap training;
     - push-ups are not triceps or front-delt training;
     - dips are not triceps-long-head training.
   - Do not add negligible-load exercises just so a cell stops being empty.
4. **Future bodyweight additions need both:**
   - **Direct targeting.** The movement trains the target as its own definition in `data/programming/physique-targets.yaml` describes it.
   - **A genuine programming rationale.** It offers something the library lacks (bodyweight access to a movement pattern, a distinct emphasis), not just a higher answer count.

## What an empty result must do

Under Policy B some empty results are permanent, so they must read as an informed answer. Decide's empty result (`engine/emptyResult.ts`) says which case applies, using only the selection's existing exercises and their own equipment data:

- **Equipment is the blocker.**
  - It names the selection and lists the exercises that fit the user's limits but need different equipment, each with its own equipment options.
  - If relaxing a limit would also allow an exercise with the current equipment, it says so too.
- **Legitimate bodyweight gap.**
  - With bodyweight only and no bodyweight-only exercise in the selection, it says so explicitly.
  - It explains that Blueprint does not substitute indirect work, then lists what equipment would allow.
- **Tolerance is the blocker.**
  - The equipment is fine; it names the limit (or limits) whose relaxation would allow an exercise.
- **Both.**
  - No exercise fits either constraint on its own.

The message never suggests an exercise the selection doesn't already contain, and never ranks "cheapest unlock" options. Exercises are listed by name.

## Judging a proposed addition

Before adding an exercise to close an equipment gap, check that:

- [ ] it trains the target directly, per the target's definition, and not as a secondary mover;
- [ ] its load is meaningful for hypertrophy or for the stated functional goal;
- [ ] it provides something the library can't: bodyweight access, a missing movement pattern, a meaningful equipment option, or a distinct emphasis Decide can target;
- [ ] it doesn't substantially overlap an existing record; if it partly does, declare `overlaps_with`;
- [ ] the target is actually reachable in Decide (an aesthetic outcome, the Direct/Advanced picker, a region or a functional goal);
- [ ] its effect has been measured with the decision-coverage analysis, not assumed.
