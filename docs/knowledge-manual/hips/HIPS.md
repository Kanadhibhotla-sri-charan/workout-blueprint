# Hips and Glutes — Draft Knowledge Module

**Status:** Draft  
**Purpose:** Define the first hip and glute records in the canonical Blueprint format. These records are a starting dataset and must pass the review gate in [FOUNDATION.md](../FOUNDATION.md) before the status is changed to Reviewed.

**A note on Best used when / Less suitable when:** these two fields describe training stimulus — growth demand, pump, intensity fit, and the practical result an exercise tends to produce — not equipment or time logistics. Setup and equipment details live in Coverage instead.

## Region map

The hip module is organized by direction of hip movement and by where in the range the load feels hardest. Several records overlap with the [quads](../quads/QUADS.md) and [hamstrings](../hamstrings/HAMSTRINGS.md) modules; that overlap is intentional and should be recorded rather than duplicated silently.

- **Hip extension, shortened context:** hardest near the top, with the hip already straight — a strong mechanical-tension role for the glutes specifically.
- **Hip extension, lengthened context:** hardest with the hip bent and the muscles long — a strong stretch-mediated growth role.
- **Unilateral hip work:** one leg at a time, which loads the side of the hip as well as the back of it, and exposes side-to-side gaps.
- **Abduction:** moving the leg away from the midline, and keeping the pelvis steady — an isolation, pump-oriented role for the glute medius and minimus.
- **Adduction:** bringing the leg toward the midline — an isolation, pump-oriented role for the adductors.
- **Hip flexion:** raising the thigh, which can be trained rather than only stretched.

## Draft records

### Hip Thrust

- **Why this exists:** Loads hip extension where the hip is already straight, a position squats and hinges load least.
- **Primary targets:** Gluteus maximus; hamstrings and quads contribute.
- **Movement:** Hip extension in a shortened context.
- **Coverage:** Heavy compound, shortened-position emphasis, higher setup cost.
- **Best used when:** A user wants the strongest available shortened-position stimulus specifically for the glutes — by EMG, not necessarily by measured growth — without the spinal loading a hinge adds. A barbell across the hips is the default loadable version; a dedicated hip-thrust machine or a Smith machine both offer a fixed path, which some find more comfortable than balancing a free barbell. Worth a real caveat: EMG shows the hip thrust produces roughly 2-3x the glute activation of a back squat at comparable loads, but a 2023 MRI hypertrophy trial found hip thrust and back squat training produced similar glute growth despite that EMG gap — a case of EMG and measured growth not correlating. See the canonical YAML record's evidence_notes for the full citation.
- **Less suitable when:** A user's priority is a stretch-mediated stimulus instead — a hinge pattern loads the lengthened position this movement mostly skips.
- **Complements:** A hinge pattern such as the Romanian deadlift.
- **Overlaps:** Glute bridges and machine hip-thrust variations.
- **Status:** Draft.

### Romanian Deadlift

- **Why this exists:** Loads hip extension with the hip bent, so the glutes and hamstrings work in a lengthened position.
- **Primary targets:** Glutes and hamstrings; spinal erectors contribute. Unlike the back extension or Bulgarian split squat, an RDL doesn't have a clean discrete technique switch that biases one over the other — the moderate knee bend trains both together by design throughout the whole movement. If a more glute-isolated, shortened-position stimulus is the goal, the hip thrust is the more direct option; for a more hamstring-isolated stimulus, see the stiff-leg deadlift recorded in the hamstrings module.
- **Movement:** Hip hinge, moderate knee bend.
- **Coverage:** Heavy compound, lengthened-position emphasis, moderate skill demand, high fatigue cost.
- **Best used when:** A user wants a strong stretch-mediated growth stimulus for the glutes and hamstrings together, in a lengthened position a hip thrust doesn't reach. A barbell allows the heaviest fixed-path load; dumbbells allow independent arms and are often the easier entry point for learning the hinge. No study specific to the RDL was found; the claim draws on the general stretch-mediated hypertrophy literature — see the canonical YAML record (`data/exercises/hamstrings.yaml`, id: romanian-deadlift) for citations.
- **Less suitable when:** Lower-back fatigue is already high, which caps how much of the lengthened-position load can safely be used.
- **Complements:** A shortened-position movement such as the hip thrust.
- **Overlaps:** Good mornings, 45° back extensions, the Smith machine version below, and other hinge patterns; also recorded in the hamstrings module, which also has the stiff-leg deadlift. The conventional deadlift, recorded in the back module, is a related but distinct hinge that starts from the floor.
- **Status:** Draft.

### Smith Machine Romanian Deadlift

- **Why this exists:** Fixing the bar to a vertical rail keeps it automatically close to the body through the hinge, which is the technical cue beginners most often struggle to hold with a free bar; this makes the pattern easier to groove before adding a free bar. Unlike a row, an RDL's correct bar path is already close to vertical, so the fixed rail helps rather than fights it.
- **Primary targets:** Glutes and hamstrings; spinal erectors contribute.
- **Movement:** Hip hinge.
- **Coverage:** Stable compound, lengthened-position emphasis, low-to-moderate skill demand, moderate setup.
- **Best used when:** A user wants the RDL's stretch-mediated stimulus while still learning to control the hinge, since the fixed rail removes the bar-path variable that most often breaks technique down under load. Same evidence as the free-bar Romanian Deadlift above.
- **Less suitable when:** A user's hip-to-torso proportions need more depth than the fixed rail allows, or wants the bar to accommodate individual leverages the way a free bar can.
- **Complements:** A shortened-position movement such as the hip thrust.
- **Overlaps:** The free-weight Romanian deadlift; distinguish by how much the setup controls the bar path.
- **Status:** Draft.

### Bulgarian Split Squat (Long-Stance, Hip-Dominant Execution)

- **Why this exists:** A unilateral pattern that loads the hip through a long range with much less absolute load than a bilateral squat. Setting the front foot further out in front, keeping the torso upright, and letting the hips sink straight down and back — rather than letting the front knee travel forward — is what shifts this movement's emphasis onto the glutes and hamstrings specifically. This is the stance and execution this record describes; the quads module has the same exercise with a shorter stance for a different emphasis.
- **Primary targets:** Glutes; hamstrings, quads, and adductors contribute, but the quads contribute less than with the shorter-stance, knee-dominant execution described in the quads module.
- **Movement:** Unilateral hip-dominant, long-stance execution.
- **Coverage:** Unilateral compound, high stability demand, moderate setup, high perceived effort.
- **Best used when:** A user specifically wants a strong per-side, stretch-mediated stimulus for the glutes and hamstrings, or wants to close a side-to-side strength gap through focused per-leg volume. No study specific to this exercise was found; the claim draws on the general stretch-mediated hypertrophy literature — see the canonical YAML record's evidence_notes for citations.
- **Less suitable when:** A user wants to bias the quads instead — a shorter stance with the knee traveling forward, described in the quads module's copy of this exercise, does that instead. Balance limiting the set before the target muscles are fatigued is also a sign to check load or stance before adding more.
- **Complements:** A bilateral squat or hinge.
- **Overlaps:** Lunges, step-ups, and split squats; also recorded in the quads module, which uses a shorter stance and knee-dominant execution for a quad-biased emphasis, and which also has the Smith machine version — fixing the bar removes most of the balance demand that is the main limiter here.
- **Status:** Draft.

### Cable Kickback

- **Why this exists:** A single-joint hip-extension option that adds glute work without further loading the knees, spine, or trunk.
- **Primary targets:** Gluteus maximus.
- **Movement:** Hip extension.
- **Coverage:** Isolation, low fatigue cost, low skill demand, unilateral.
- **Best used when:** A user wants a low-fatigue, pump-oriented glute finisher late in a session, when heavier compound work has already used up most of the available recovery budget.
- **Less suitable when:** The lower back extends instead of the hip, which shifts the stimulus away from the glute and onto the spine.
- **Complements:** A heavy hip-extension movement.
- **Overlaps:** Glute-extension machines and banded kickbacks.
- **Status:** Draft.

### Hip Abduction

- **Why this exists:** Directly loads the gluteus medius and minimus, which most squats and hinges train only as stabilizers.
- **Primary targets:** Gluteus medius and minimus; tensor fasciae latae contributes.
- **Movement:** Hip abduction.
- **Coverage:** Isolation, low fatigue cost, low setup on a machine or with a band.
- **Best used when:** A user wants a direct mechanical-tension and pump stimulus for hip width and pelvic stability, which bilateral front-to-back work only trains indirectly.
- **Less suitable when:** The trunk leans to create the movement instead of the hip, which shifts the stimulus away from the target muscle.
- **Complements:** Unilateral squatting patterns and adductor work.
- **Overlaps:** Banded and machine abduction variations.
- **Status:** Draft.

### Hip Adduction

- **Why this exists:** Loads the adductors directly, a group that contributes to squatting and to leg size but is rarely trained on its own.
- **Primary targets:** Adductors.
- **Movement:** Hip adduction.
- **Coverage:** Isolation, low fatigue cost, low skill demand on a machine.
- **Best used when:** A user wants a direct growth stimulus for the adductors that squatting patterns only provide as a side effect, or wants to balance a routine heavy in abduction work.
- **Less suitable when:** No machine or cable is available, and free-weight adductor options exceed a user's current tolerance.
- **Complements:** Abduction work and squatting patterns.
- **Overlaps:** Copenhagen-style and cable adduction variations.
- **Status:** Draft.

### Standing Cable Hip Flexion

- **Why this exists:** Trains hip flexion under load, which most lower-body routines leave entirely to stretching.
- **Primary targets:** Hip flexors; rectus abdominis contributes.
- **Movement:** Hip flexion.
- **Coverage:** Isolation, low fatigue cost, unilateral, moderate setup.
- **Best used when:** A user wants hip-flexor strength and size for running, kicking, or knee-raise work — a specific, secondary role rather than a routine staple.
- **Less suitable when:** Session priorities haven't yet covered the larger movements that deliver most of a lower-body routine's growth stimulus.
- **Complements:** Hip-extension work and trunk anti-extension work.
- **Overlaps:** Hanging knee raises, recorded in the core module.
- **Status:** Draft.

## Review checklist

Before changing a record to Reviewed:

- Confirm the record answers "when would I choose this over an alternative?"
- Add equipment, setup, fatigue, and relationship fields in the final data format.
- Check terminology against the writing standard.
- Add evidence notes for claims that require them.
- The stretch-mediated growth claims (RDL, Smith machine RDL, Bulgarian split squat) now carry evidence notes citing the general stretch-mediated hypertrophy literature — see `data/exercises/hamstrings.yaml` and `data/exercises/hips.yaml` for full citations.
- Reconcile shared records with the quads and hamstrings modules so a movement is described consistently wherever it appears.
