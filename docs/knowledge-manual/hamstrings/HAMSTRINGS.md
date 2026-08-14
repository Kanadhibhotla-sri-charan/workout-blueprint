# Hamstrings — Draft Knowledge Module

**Status:** Draft  
**Purpose:** Define the first hamstring records in the canonical Blueprint format. These records are a starting dataset and must pass the review gate in [FOUNDATION.md](../FOUNDATION.md) before the status is changed to Reviewed.

**A note on Best used when / Less suitable when:** these two fields describe training stimulus — growth demand, pump, intensity fit, and the practical result an exercise tends to produce — not equipment or time logistics. Setup and equipment details live in Coverage instead.

## Region map

The hamstrings both extend the hip and bend the knee, and a routine can cover one job while missing the other. The module is organized around that split.

- **Hip-dominant work:** hinge patterns where the hamstrings work by extending the hip — a strong stretch-mediated growth role.
- **Knee-dominant work:** curl patterns where the hamstrings work by bending the knee — an isolation, mechanical-tension role machines deliver reliably.
- **Hip position within curls:** whether the hip is bent or straight changes how long the hamstrings are during the curl, and therefore where the stretch stimulus lands.
- **High-tension eccentric work:** patterns where the lowering phase is the point of the movement — a demanding but potent growth stimulus.

## Draft records

### Romanian Deadlift

- **Why this exists:** The main loadable hinge, and the most direct way to train the hamstrings in a lengthened position under heavy load.
- **Primary targets:** Hamstrings and glutes; spinal erectors contribute. Unlike the back extension or Bulgarian split squat, an RDL doesn't have a clean discrete technique switch that biases one over the other — the moderate knee bend trains both together by design throughout the whole movement. If a genuinely more hamstring-isolated stimulus is the goal, the stiff-leg deadlift below is the more direct option; for a more glute-isolated stimulus, see the hip thrust.
- **Movement:** Hip hinge, moderate knee bend.
- **Coverage:** Heavy compound, lengthened-position emphasis, moderate skill demand, high fatigue cost.
- **Best used when:** A user wants the strongest available stretch-mediated growth stimulus for the hamstrings and glutes together, in a lengthened position no curl variation reaches. A barbell allows the heaviest fixed-path load; dumbbells allow independent arms and are often the easier entry point for learning the hinge. No study specific to the RDL was found; the claim draws on the general stretch-mediated hypertrophy literature (Schoenfeld & Grgic, 2020; Wolf et al., 2023, 2025) — see the canonical YAML record's evidence_notes for citations, and Seated Leg Curl below for the closest direct hamstring-length hypertrophy trial found.
- **Less suitable when:** Lower-back fatigue is already high, which caps how much of the lengthened-position load can safely be used.
- **Complements:** A leg-curl pattern, since a hinge alone leaves knee flexion untrained.
- **Overlaps:** Good mornings, the stiff-leg deadlift below, and 45° back extensions; also recorded in the hips module, which also has the Smith machine version — the fixed rail keeps the bar close to the body automatically, which helps here since that is already the correct free-weight bar path. The conventional deadlift, recorded in the back module, is a related but distinct hinge that starts from the floor.
- **Status:** Draft.

### Stiff-Leg Deadlift

- **Why this exists:** Keeping the knees much straighter than an RDL removes most of the knee's contribution to the hinge, which pushes nearly all of the stretch and tension onto the hamstrings specifically, at the cost of the load capacity and lower-back sparing the RDL's knee bend provides.
- **Primary targets:** Hamstrings; glutes contribute less than in an RDL, since less knee bend means less hip-extension drive from the glutes at lockout.
- **Movement:** Hip hinge, straight-leg execution.
- **Coverage:** Heavy compound, lengthened-position emphasis, high skill demand, high lower-back demand.
- **Best used when:** A user specifically wants the most hamstring-isolated stretch-mediated stimulus this movement family offers, and can tolerate the added lower-back demand the straighter legs bring. Same general evidence as the Romanian Deadlift above — no study specific to this exercise was found.
- **Less suitable when:** Lower-back fatigue or hamstring flexibility limits how straight the legs can safely stay, or a user wants the RDL's higher load capacity and more balanced glute-hamstring stimulus instead.
- **Complements:** A knee-flexion-dominant leg curl or a shortened-position movement such as the hip thrust.
- **Overlaps:** Romanian deadlift; distinguish by knee bend and hamstring-versus-glute emphasis.
- **Status:** Draft.

### Seated Leg Curl

- **Why this exists:** Trains knee flexion with the hip bent, so the hamstrings are longer during the curl than in a lying version.
- **Primary targets:** Hamstrings.
- **Movement:** Knee flexion with the hip flexed.
- **Coverage:** Isolation, lengthened-position emphasis, stable, low skill demand.
- **Best used when:** A user wants a stretch-biased, mechanical-tension knee-flexion stimulus that a hinge alone doesn't provide, pushed safely close to failure on a fixed path. This hip-flexed position has real direct support: a 2024 trial (PMC11419281, Medicine & Science in Sports & Exercise) found training the hamstrings at long muscle length in a hip-flexed position produced substantially more growth (+18% total, +19% biceps femoris long head) than the Nordic hamstring curl over the same period — see Nordic Hamstring Curl below for the comparison, and the canonical YAML record's evidence_notes for the full citation.
- **Less suitable when:** The hips lift off the pad during the set, which shortens the hamstrings and trades away the stretch position that gives this movement its distinct value.
- **Complements:** A hinge pattern.
- **Overlaps:** Lying and standing leg curls; distinguish by hip position.
- **Status:** Draft.

### Lying Leg Curl

- **Why this exists:** Trains knee flexion with the hip closer to straight, a different hip position from the seated version.
- **Primary targets:** Hamstrings; calves contribute.
- **Movement:** Knee flexion with the hip extended.
- **Coverage:** Isolation, stable, low skill demand, low fatigue cost.
- **Best used when:** A user wants a knee-flexion, mechanical-tension stimulus in a shorter-hamstring position than the seated curl provides, for a genuinely different growth emphasis.
- **Less suitable when:** The hips rise during the set, which signals the load has outrun what the hamstrings alone can control.
- **Complements:** A hinge pattern.
- **Overlaps:** Seated and standing leg curls.
- **Status:** Draft.

### Nordic Hamstring Curl

- **Why this exists:** Produces high hamstring tension during the lowering phase with no machine, and scales through partner support, bands, or range.
- **Primary targets:** Hamstrings.
- **Movement:** Knee flexion, eccentric emphasis.
- **Coverage:** Low equipment, high skill demand, high perceived effort.
- **Best used when:** A user wants one of the most demanding eccentric-tension stimuli available for the hamstrings, commonly cited for both growth and injury-resilience benefits. Worth a correction, not just a citation: the 2024 trial cited on Seated Leg Curl above found a hip-flexed, lengthened-position exercise produced substantially more hamstrings growth than the Nordic curl (+18% vs. +11% total, +19% vs. +5% biceps femoris long head). The Nordic curl was still an effective hypertrophy stimulus in absolute terms, and its distinct value — eccentric strength and the fascicle adaptations tied to injury resilience — isn't something a leg curl replicates, but "commonly cited for growth" oversells it as the top hypertrophy option specifically.
- **Less suitable when:** The descent can't yet be controlled at all, or a user is very sore from prior hamstring work — start with a short range and build up rather than loading the full eccentric immediately.
- **Complements:** A hinge pattern.
- **Overlaps:** Machine leg curls.
- **Status:** Draft.

### 45° Back Extension (Hip-Hinge-Dominant Execution)

- **Why this exists:** Trains hip extension with far less setup and systemic cost than a heavy hinge. Bending the knees slightly and driving the movement from the hips — keeping the lower back neutral rather than actively extending it — is what shifts this movement's emphasis onto the hamstrings and glutes specifically. This is the execution this record describes; the back module has the same equipment used with a different execution for a different emphasis.
- **Primary targets:** Hamstrings and glutes; spinal erectors contribute, but less than with the spinal-extension-dominant execution described in the back module.
- **Movement:** Hip extension, hip-hinge-dominant execution.
- **Coverage:** Stable compound, low-to-moderate fatigue cost, low load requirement.
- **Best used when:** A user wants a moderate mechanical-tension hip-extension stimulus specifically for the hamstrings and glutes, easier to recover from than a heavy hinge, or whose Romanian deadlifts are grip-limited before the hamstrings are.
- **Less suitable when:** A user wants to bias the spinal erectors instead — keeping the legs straighter and allowing controlled lumbar extension, described in the back module's copy of this exercise, does that instead. Back symptoms are a stop-and-assess signal either way, not something to train through.
- **Complements:** A leg-curl pattern.
- **Overlaps:** Romanian deadlifts and good mornings. The back module's copy of this exercise uses a spinal-extension-dominant execution instead — same equipment, different technique, different emphasis.
- **Status:** Draft.

## Review checklist

Before changing a record to Reviewed:

- Confirm the record answers "when would I choose this over an alternative?"
- Add equipment, setup, fatigue, and relationship fields in the final data format.
- Check terminology against the writing standard.
- Add evidence notes for claims that require them.
- Reconcile shared records with the hips, quads, and back modules so a movement is described consistently wherever it appears.
- The stretch-mediated growth claims now carry evidence notes, including a direct 2024 hypertrophy trial (see Seated Leg Curl and Nordic Hamstring Curl) that corrects the popular "Nordic curl for growth" framing rather than just sourcing it — see `data/exercises/hamstrings.yaml` for full citations.
