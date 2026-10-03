# Coaching Content Standard

Quality bar for the four coaching fields on an exercise record: `technique_cues`, `common_mistakes`, `programming_notes`, `evidence_notes`. Introduced in Phase 7 (Coaching Depth). Field types and validation live in [SCHEMA.md](SCHEMA.md); this document covers what makes the content good enough to ship.

**The test for every item:** *would it still be true, and still useful, if it were pasted onto a different exercise?* If yes, it's too generic. Rewrite it or drop it.

## `technique_cues` — required for `reviewed`

How to set up and perform **this** exercise, in the order a lifter needs it.

- **3–5 items.** Setup first, then the movement, then the finish/return.
- **Actionable and observable.** Something the lifter can do or check: "Keep the chest on the pad for the whole set", not "Engage your back".
- **Specific to this record's variation.** If the record is a variation (long- vs short-stance split squat, chest- vs triceps-biased dip, leaning cable extension), at least one cue states the detail that *makes* it that variation.
- **Consistent with the record.** Must not contradict `summary`, `resistance_profile`, `equipment`, `laterality` or `limitations`. If the record says the elbows stay down, no cue may say to flare them.
- **No prescriptions.** No sets, reps, RIR, rest or load numbers. Those come from the programming profiles and packages. Joint angles and bench angles are fine where they define the setup.
- **No unsupported claims.** A cue says what to do, not which muscle fibre it "activates". Mechanism claims belong in `evidence_notes` with a source.

## `common_mistakes` — required for `reviewed`

Execution errors lifters actually make on **this** exercise, and why each matters.

- **2–4 items.** Each one names the error **and** its consequence (what it shifts the work to, what it risks, or what stimulus it loses), usually as `error: consequence`.
- **Errors, not trade-offs.** Inherent downsides of the exercise belong in `limitations`. A mistake is something the lifter can stop doing.
- **Not just a negated cue.** "Not keeping the chest on the pad" adds nothing. Say what goes wrong: "Lifting the chest off the pad to finish reps: brings back the lower-back strain and momentum the pad exists to remove."
- **Safety where real.** Include the injury-relevant error when one exists (e.g. depth beyond shoulder tolerance on dips), stated plainly and without alarm.

## `programming_notes` — optional

Programming guidance that's specific to this exercise and **not already supplied** by its programming profile, its packages, or the intensity-technique rules.

- **Use it for:** how this exercise progresses when "add weight" doesn't apply (range, leverage, assistance, bodyweight); ordering for unilateral work; equipment-driven caveats; comparisons to closely related records.
- **Never** restate or override the profile's rep range, RIR, weekly sets or frequency. Never prescribe numbers that could contradict them.
- **Empty is correct** when there's nothing exercise-specific to add.

## `evidence_notes` — conditional

Required only when the record makes a **material empirical claim** (head or region bias, "strongest stretch stimulus", an EMG-based framing). The existing rules from Phase 2 and ADR 0001 still apply:

- **Real, checkable sources only.** Author, year and venue, or an identifier. Never invent or approximate a citation.
- **Grade the evidence honestly:** EMG vs hypertrophy trial, direct vs inferred from related work, settled vs contested.
- **Say what the source actually tested.** If it used a different exercise or a different population, say so.
- **Empty is correct** when the record makes no such claim. Don't add a citation just to fill the field.

## Review gate

An exercise is `reviewed` only when, in addition to the existing Review Promotion Gate, it has:

- at least **3** `technique_cues` and **2** `common_mistakes` that meet this standard;
- `evidence_notes` for any material empirical claim it makes.

The validator enforces the parts that can be checked mechanically: minimum counts, no duplicates, no near-empty items, and no stock filler phrases ("good form", "proper form", "listen to your body", …). Exercise-specificity and accuracy can't be checked mechanically. They're a human review responsibility, which is why `reviewed` is a status a person grants, not one a script infers.

Exercises without coaching content yet are `needs-review`. The Decide engine excludes only `draft` exercises, so `needs-review` exercises are still recommended. The status is honest bookkeeping, not a penalty.
