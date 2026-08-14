# Arms — Draft Knowledge Module

**Status:** Draft  
**Purpose:** Define the first arm records in the canonical Blueprint format. These records are a starting dataset and must pass the review gate in [FOUNDATION.md](../FOUNDATION.md) before the status is changed to Reviewed.

**A note on Best used when / Less suitable when:** these two fields describe training stimulus — growth demand, pump, intensity fit, and the practical result an exercise tends to produce — not equipment or time logistics. Setup and equipment details live in Coverage instead.

## Region map

The arm module is organized by elbow function and by where in the range a movement tends to feel hardest. Grip and wrist work sit in the [forearms module](../forearms/FOREARMS.md). Records are grouped below by biceps- and triceps-dominant role so the function-first organization doesn't obscure which muscle a record is actually for.

**Biceps and elbow-flexor roles**

- **Elbow flexion, general:** loadable curling for overall biceps mechanical tension.
- **Elbow flexion, lengthened context:** curls with the upper arm behind the body, where the stretch is deepest and the growth stimulus is strongest with the arm long.
- **Elbow flexion, shortened context:** curls with the upper arm forward, where tension stays on the muscle nearer the top instead of dropping off.
- **Neutral and pronated flexion:** grip positions that shift work toward the brachialis and brachioradialis for arm thickness rather than biceps peak.
- **Constant-tension flexion:** cable curling, where the resistance does not fall off anywhere in the range the way a free weight does — a pump-oriented profile.
- **Behind-the-body bar path:** a bar dragged up along the torso with the elbows travelling behind the body, which removes shoulder swing from the movement for a stricter, more isolated stimulus.
- **Combined grip rotation:** a curl that switches grip partway through the rep, training the biceps in one direction and the forearm in the other. Wrist and dedicated forearm work sit in the [forearms module](../forearms/FOREARMS.md); this record is here because its primary purpose is still the biceps curl.

**Triceps and elbow-extensor roles**

- **Elbow extension, compound:** pressing patterns that load the triceps under the heaviest loads, for a strength-and-mass mechanical-tension stimulus.
- **Elbow extension, overhead and lengthened:** positions that load the triceps with the shoulder flexed, commonly cited as the strongest stretch-mediated stimulus for the long head.
- **Elbow extension, lying and lengthened:** a free-weight lengthened position with the shoulder at roughly 90 degrees, a partial stretch stimulus distinct from the overhead position.
- **Elbow extension, bodyweight compound:** a dip performed with an upright torso, which biases the triceps rather than the lower chest.
- **Elbow extension, low fatigue:** cable work that adds triceps pump volume cheaply, well suited to finishers and drop sets.
- **Elbow extension, shoulder fixed:** kickback-style work where the upper arm stays still and only the forearm moves — a light, low-fatigue isolation stimulus.

## Draft records

**Biceps**

### Barbell or EZ-Bar Curl

- **Why this exists:** The most straightforward loadable curl, with small load steps and an easy progression path.
- **Primary targets:** Biceps (both heads contribute roughly evenly at a neutral shoulder position); brachialis and forearms contribute.
- **Movement:** Elbow flexion.
- **Coverage:** Heavy-for-the-region isolation, low setup, low skill demand.
- **Best used when:** A user wants the primary mechanical-tension, strength-building curl to progress load on over time.
- **Less suitable when:** A straight bar irritates the wrists — an EZ bar or dumbbells deliver the same stimulus without that cost.
- **Complements:** A curl with a different arm position, or a neutral-grip curl.
- **Overlaps:** Dumbbell curl and cable curl.
- **Status:** Draft.

### Dumbbell Curl

- **Why this exists:** The same standing curl as the barbell version, but independent arms let each side move and rotate on its own path, which some find kinder on the wrists and elbows.
- **Primary targets:** Biceps (both heads contribute roughly evenly at a neutral shoulder position); brachialis and forearms contribute.
- **Movement:** Elbow flexion.
- **Coverage:** Isolation, low setup, low skill demand.
- **Best used when:** A user wants a full supination path through the rep for a bit more range and stretch than a fixed bar allows, or an easy way to spot side-to-side differences.
- **Less suitable when:** A user specifically wants the heavier loading and fixed path a barbell allows for a stronger mechanical-tension stimulus.
- **Complements:** A curl with a different arm position, or a neutral-grip curl.
- **Overlaps:** Barbell or EZ-bar curl and cable curl; distinguish by equipment.
- **Status:** Draft.

### Incline Dumbbell Curl

- **Why this exists:** Places the upper arm behind the body, so the load stays meaningful with the elbow near full extension.
- **Primary targets:** Biceps, long-head-biased — EMG and a 2024 hypertrophy trial (Kassiano et al., PMC11906226) support this: the extended shoulder position stretches the long head further than a standing curl does. Evidence quality: moderate — real data, but one hypertrophy trial, not a large body of literature. See the canonical YAML record's evidence_notes for the full citation.
- **Movement:** Elbow flexion in a lengthened shoulder position.
- **Coverage:** Isolation, lengthened-position emphasis, moderate setup.
- **Best used when:** A user wants a strong stretch-mediated growth stimulus, which the extended shoulder position delivers in a way a standing curl cannot replicate.
- **Less suitable when:** The shoulder position is uncomfortable, which caps how much of that stretch can actually be used under load.
- **Complements:** A shortened-position curl such as a preacher curl.
- **Overlaps:** Other supinated curls; distinguish by arm position, not by equipment alone.
- **Status:** Draft.

### Preacher Curl

- **Why this exists:** Fixes the upper arm forward on a pad, which removes swing and keeps tension nearer the top of the range.
- **Primary targets:** Biceps, short-head-biased — the same evidence that supports the incline curl's long-head bias (Kassiano et al., 2024) supports this by the same logic in reverse: the flexed shoulder position shortens the long head, leaving relatively more of the work to the short head; brachialis contributes. Evidence quality: moderate, same tier as the incline curl claim.
- **Movement:** Elbow flexion in a shortened shoulder position.
- **Coverage:** Isolation, shortened-position emphasis, stable, low skill demand.
- **Best used when:** A user wants a strict, swing-free mechanical-tension stimulus late in a session, when standing curls would start to rely on momentum. A barbell, EZ-bar, or dumbbells all work on the same preacher bench; the choice is a grip and independent-arm preference rather than a different movement.
- **Less suitable when:** The bottom of the range feels uncomfortable under load, which can limit how much of the strict range actually gets used.
- **Complements:** A lengthened-position curl such as an incline curl.
- **Overlaps:** Preacher curl machine; distinguish by resistance profile.
- **Status:** Draft.

### Preacher Curl Machine

- **Why this exists:** A fixed-path preacher curl that removes the need for a separate bench and free weight, and often adds a cam that adjusts resistance through the range.
- **Primary targets:** Biceps, short-head-biased — the same evidence that supports the incline curl's long-head bias (Kassiano et al., 2024) supports this by the same logic in reverse: the flexed shoulder position shortens the long head, leaving relatively more of the work to the short head; brachialis contributes. Evidence quality: moderate, same tier as the incline curl claim.
- **Movement:** Elbow flexion in a shortened shoulder position.
- **Coverage:** Isolation, shortened-position emphasis, low skill demand, low setup where the machine is free.
- **Best used when:** A user wants the preacher curl's strict, swing-free stimulus pushed safely to true failure or a drop set, since the fixed path removes any chance of the bar drifting to help.
- **Less suitable when:** The machine's pad or handle position doesn't suit the individual, which can blunt the tension felt regardless of how heavy the stack is loaded.
- **Complements:** A lengthened-position curl such as an incline curl.
- **Overlaps:** Preacher curl; distinguish by resistance profile.
- **Status:** Draft.

### Hammer Curl

- **Why this exists:** A neutral grip shifts work toward the brachialis and brachioradialis, which contribute to arm and forearm thickness.
- **Primary targets:** Brachialis and brachioradialis; biceps contribute.
- **Movement:** Elbow flexion with a neutral grip.
- **Coverage:** Isolation, low setup, low skill demand.
- **Best used when:** A user wants an arm-thickness stimulus that a supinated curl mostly misses, since the neutral grip shifts real tension onto the brachialis and brachioradialis instead of the biceps peak.
- **Less suitable when:** The routine already contains enough elbow-flexion volume, in which case this adds fatigue without a distinct growth role.
- **Complements:** A supinated curl.
- **Overlaps:** Reverse curls and cable hammer curl.
- **Status:** Draft.

### Cable Hammer Curl (Rope)

- **Why this exists:** A rope attachment held in a neutral grip keeps tension on the brachialis and brachioradialis through the whole range, including the top, where a dumbbell hammer curl loses load.
- **Primary targets:** Brachialis and brachioradialis; biceps contribute.
- **Movement:** Elbow flexion with a neutral grip.
- **Coverage:** Isolation, constant-tension resistance profile, low-to-moderate setup.
- **Best used when:** A user wants a pump-oriented arm-thickness finisher that stays hard at the top of the range, where a dumbbell hammer curl goes slack.
- **Less suitable when:** A user specifically wants the heavier loading dumbbells allow for a stronger mechanical-tension stimulus.
- **Complements:** A supinated curl.
- **Overlaps:** Dumbbell hammer curl and cross-body hammer curl; distinguish by resistance profile.
- **Status:** Draft.

### Cross-Body Hammer Curl

- **Why this exists:** Curling the dumbbell diagonally toward the opposite shoulder changes the line of pull from a straight hammer curl, which shifts the demand and gives a substitute when a neutral grip alone stops feeling challenging.
- **Primary targets:** Brachialis and brachioradialis; biceps contribute.
- **Movement:** Elbow flexion with a neutral grip and a diagonal path.
- **Coverage:** Isolation, low setup, low skill demand.
- **Best used when:** A user already does straight hammer curls and wants a variation with a different line of pull to keep progressing the same arm-thickness stimulus.
- **Less suitable when:** The diagonal path turns into swinging, which trades the growth stimulus for momentum.
- **Complements:** A straight hammer curl or a supinated curl.
- **Overlaps:** Hammer curl; distinguish by the diagonal path.
- **Status:** Draft.

### Cable Curl

- **Why this exists:** A cable keeps tension on the biceps through the whole range, including the top, where a dumbbell or barbell curl loses load.
- **Primary targets:** Biceps (both heads); brachialis contributes.
- **Movement:** Elbow flexion.
- **Coverage:** Isolation, constant-tension resistance profile, low-to-moderate setup.
- **Best used when:** A user wants a pump-oriented curl that stays hard at the top of the range, a metabolic-stress stimulus a free weight can't deliver in that position.
- **Less suitable when:** A user specifically wants the heavier loading a barbell allows for a stronger mechanical-tension stimulus.
- **Complements:** A free-weight curl with a different resistance profile.
- **Overlaps:** Barbell and dumbbell curls.
- **Status:** Draft.

### Drag Curl

- **Why this exists:** Dragging the bar up along the torso lets the elbows travel behind the body instead of staying pinned forward, which removes front-delt involvement and changes the biceps' loading path.
- **Primary targets:** Biceps — head bias is contested, not settled, and the common "short-head-biased" claim likely has it backwards. The elbows-behind-body position extends the shoulder, the same direction incline curls use for their evidence-supported long-head bias (see Incline Dumbbell Curl above), so the usual "short head" cue for drag curls actually contradicts the biomechanical logic that evidence supports. No direct research on drag curls was found to resolve it either way — the movement's real value is the strict, swing-free path, not a head-bias claim.
- **Movement:** Elbow flexion with the elbows drawn behind the torso.
- **Coverage:** Isolation, moderate skill demand, low setup.
- **Best used when:** A user wants a stricter, more isolated biceps stimulus that removes the shoulder swing a standard curl can lean on.
- **Less suitable when:** Shoulder mobility doesn't allow the elbows to travel back comfortably, which limits how strict the path can actually be kept.
- **Complements:** A standard barbell or dumbbell curl.
- **Overlaps:** Barbell and EZ-bar curl; distinguish by the elbow-behind-body path. The cable drag curl below is the same path with a different resistance profile.
- **Status:** Draft.

### Cable Drag Curl

- **Why this exists:** Combines the drag curl's elbows-behind-the-body path with a cable's constant tension, so the set stays hard even at the top of the range instead of losing load the way a barbell drag curl does.
- **Primary targets:** Biceps — same contested head-bias as the barbell drag curl above; the cable's constant tension changes the loading curve, not the shoulder position the bias question is actually about, so it doesn't resolve the question either way.
- **Movement:** Elbow flexion with the elbows drawn behind the torso.
- **Coverage:** Isolation, constant-tension resistance profile, moderate skill demand.
- **Best used when:** A user wants the drag curl's strict path with a pump-oriented, constant-tension stimulus instead of a free weight's fading top-range load.
- **Less suitable when:** A user wants the heavier loading a barbell allows for a stronger mechanical-tension stimulus.
- **Complements:** A standard cable or free-weight curl.
- **Overlaps:** Drag curl (same path, free-weight loading) and cable curl (same equipment, standard path).
- **Status:** Draft.

### Zottman Curl

- **Why this exists:** Curls up with a supinated grip like a standard curl, then rotates to a pronated grip at the top and lowers like a reverse curl, so one movement trains the biceps on the way up and the forearm extensors and brachioradialis on the way down.
- **Primary targets:** Biceps on the concentric half; brachioradialis and wrist extensors on the eccentric half.
- **Movement:** Elbow flexion with a grip rotation between supinated and pronated.
- **Coverage:** Isolation, moderate skill demand, low setup with a pair of dumbbells.
- **Best used when:** A user wants a combined biceps-and-forearm growth stimulus in one movement, with the slow eccentric half adding real tension the concentric-only lift of a standard curl skips.
- **Less suitable when:** The rotation at the top breaks down under heavier load, which caps how much weight can be used for either half of the stimulus.
- **Complements:** A standard curl or a reverse curl programmed on their own for more focused volume.
- **Overlaps:** Barbell or EZ-bar curl on the concentric half, and reverse curl, recorded in the forearms module, on the eccentric half.
- **Status:** Draft.

**Triceps**

### Close-Grip Bench Press

- **Why this exists:** Lets the triceps be trained under loads that single-joint extensions cannot reach.
- **Primary targets:** Triceps, all three heads — no evidence supports a differential lateral/medial-head bias for this movement (see Overhead Triceps Extension below for why that framing doesn't extend to these two heads); chest and anterior deltoids contribute.
- **Movement:** Horizontal press.
- **Coverage:** Heavy compound, moderate skill demand, moderate setup.
- **Best used when:** A user wants the heaviest, most mechanical-tension-driven triceps stimulus available, with chest and shoulder work coming along as a secondary benefit. A Smith machine removes the need for a spotter, the same trade-off it offers a regular-grip bench press.
- **Less suitable when:** The elbows or wrists dislike the narrow grip, or the routine already has substantial pressing volume competing for the same recovery.
- **Complements:** An overhead triceps extension, which loads a position pressing does not.
- **Overlaps:** Dips and other horizontal presses.
- **Status:** Draft.

### Overhead Triceps Extension

- **Why this exists:** Trains elbow extension with the shoulder flexed, a position that pressing movements do not load.
- **Primary targets:** Triceps, long-head-biased — strongly supported by direct hypertrophy evidence. Maeo et al. (2023, European Journal of Sport Science) used MRI to show roughly 28.5% long-head growth from overhead extension training vs. roughly 19.6% from a non-overhead extension at matched volume, with the gap largest near the shoulder end of the muscle. This is direct MRI hypertrophy data, not just EMG — stronger evidence than the biceps head-bias claims above. It only establishes the long head's bias; it does not extend to the lateral or medial heads (see Close-Grip Bench Press above).
- **Movement:** Elbow extension with the shoulder flexed.
- **Coverage:** Isolation, lengthened-position emphasis, moderate setup.
- **Best used when:** A user's triceps work is all pressing and pushdowns, and what's missing is the long head's strongest stretch-mediated growth stimulus. A barbell or EZ-bar allows the heaviest load on a fixed path; a dumbbell in each hand allows independent arms and a path that can suit individual shoulder mobility better.
- **Less suitable when:** The overhead position is uncomfortable, which caps how much of that stretch can actually be loaded.
- **Complements:** A pressing movement or a pushdown.
- **Overlaps:** Cable overhead extension, which trades free-weight loading for constant tension.
- **Status:** Draft.

### Lying Triceps Extension (Skull Crusher)

- **Why this exists:** Loads the triceps in a lengthened position with the shoulder at roughly 90 degrees, a different joint angle from the overhead extension.
- **Primary targets:** Triceps, with a partial long-head stretch from the roughly 90-degree shoulder position — less than a fully overhead extension, more than a pushdown. This is inferred, not directly tested: Maeo et al. (2023, see Overhead Triceps Extension above) compared only fully overhead vs. arm-at-side, not this exercise's intermediate angle.
- **Movement:** Elbow extension.
- **Coverage:** Isolation, lengthened-position emphasis, moderate skill demand.
- **Best used when:** A user wants a free-weight stretch-mediated stimulus without the overhead shoulder position's mobility demand. A barbell or EZ-bar allows heavier loading on a fixed path; dumbbells allow independent arms and a neutral-grip option that may sit better on the elbows.
- **Less suitable when:** Elbow tolerance is limiting, or bar path control near the head becomes the limiting factor before the triceps are meaningfully fatigued.
- **Complements:** A pressing movement or a pushdown.
- **Overlaps:** Overhead triceps extension; distinguish by shoulder position.
- **Status:** Draft.

### Dip (Triceps-Biased, Upright Torso)

- **Why this exists:** With the torso kept upright, a dip shifts emphasis toward the triceps rather than the lower chest, letting one piece of equipment serve two different roles depending on execution.
- **Primary targets:** Triceps, all three heads — same correction as Close-Grip Bench Press above: no evidence supports a differential lateral/medial-head bias; anterior deltoids contribute.
- **Movement:** Elbow extension within a vertical-to-horizontal press.
- **Coverage:** Heavy-for-bodyweight compound, high stability demand.
- **Best used when:** A user wants a heavy, mechanical-tension-driven triceps stimulus under a real compound movement rather than an isolation exercise.
- **Less suitable when:** Shoulder tolerance limits a deep dip, or bodyweight alone is too heavy a starting load to complete a useful number of reps.
- **Complements:** A pressing movement or a pushdown.
- **Overlaps:** The chest-biased dip recorded in the chest module; torso angle is what separates the two.
- **Status:** Draft.

### Cable Pushdown

- **Why this exists:** A low-cost way to add triceps volume without another press, with easy load adjustment and a fast setup.
- **Primary targets:** Triceps, all three heads — same correction as Close-Grip Bench Press above: no evidence supports a lateral-head-specific bias. The elbow stays roughly at the torso through the movement, so if anything the long head sits in a relatively neutral, unstretched position rather than a specific head being favored.
- **Movement:** Elbow extension.
- **Coverage:** Isolation, low fatigue cost, low skill demand.
- **Best used when:** A user wants a pump-oriented triceps finisher late in a session, or after pressing has already accumulated fatigue and a lower-fatigue-cost stimulus is what's left to give. A straight bar, V-bar, or rope all work; the choice is a grip preference (pronated, neutral, or semi-free at the bottom) rather than a different movement, so it does not need its own record.
- **Less suitable when:** A user's priority is a lengthened-position, stretch-mediated stimulus instead — an overhead extension delivers that where a pushdown does not.
- **Complements:** An overhead extension, which loads a different position.
- **Overlaps:** Triceps kickback, the cable overhead extension, and the machine triceps extension.
- **Status:** Draft.

### Machine Triceps Extension

- **Why this exists:** A fixed-path elbow extension that removes the cable-height and attachment setup of a pushdown, often with a cam that adjusts resistance through the range.
- **Primary targets:** Triceps, all three heads — same correction as Cable Pushdown above: no evidence supports a lateral-head-specific bias for this position.
- **Movement:** Elbow extension.
- **Coverage:** Isolation, low skill demand, low fatigue cost.
- **Best used when:** A user wants a triceps pump stimulus pushed safely to true failure without bracing against a cable's pull to help stabilize the movement.
- **Less suitable when:** The machine's seat or handle position doesn't suit the individual, which can blunt the tension felt regardless of how heavy the stack is loaded.
- **Complements:** An overhead extension, which loads a different position.
- **Overlaps:** Cable pushdown; distinguish by resistance profile.
- **Status:** Draft.

### Triceps Kickback

- **Why this exists:** Holds the upper arm still and extends only the forearm against resistance, isolating the triceps at the end of the range where pressing and pushdowns are already easiest.
- **Primary targets:** Triceps, all three heads — same correction as Close-Grip Bench Press above: no evidence supports a differential lateral/medial-head bias. The shoulder stays extended and roughly still through a kickback, so this movement doesn't put the long head through the stretched, shoulder-flexed position the overhead-extension evidence is actually about either.
- **Movement:** Elbow extension with the shoulder held in extension.
- **Coverage:** Isolation, low fatigue cost, unilateral, low setup with a dumbbell or cable.
- **Best used when:** A user wants a light, low-fatigue, mind-muscle-connection finisher rather than a movement meant to add real mechanical tension.
- **Less suitable when:** The upper arm drops during the set, which turns the movement into a shoulder exercise and loses the isolated triceps stimulus that's the point of the kickback.
- **Complements:** A pressing movement or a pushdown.
- **Overlaps:** Cable pushdown; distinguish by shoulder position and the unilateral setup.
- **Status:** Draft.

### Cable Overhead Extension (Leaning Forward)

- **Why this exists:** Standing away from the stack, facing away from it, and leaning the torso forward while extending overhead keeps constant tension on the triceps through the stretch, unlike a free-weight overhead extension where the load is hardest only partway through the range.
- **Primary targets:** Triceps, long-head-biased — same evidence as Overhead Triceps Extension above (Maeo et al., 2023): the shoulder is flexed here the same way, so the same MRI hypertrophy finding applies. The leaning-forward, constant-tension cable path changes the loading curve, not the shoulder position the evidence is actually about.
- **Movement:** Elbow extension with the shoulder flexed, torso leaning forward away from the stack.
- **Coverage:** Isolation, lengthened-position emphasis, constant-tension resistance profile, moderate setup.
- **Best used when:** A user wants the long head's strongest stretch position combined with pump-oriented constant tension, rather than a free weight's fading top-range load. A rope, straight bar, or V-bar attachment all work; the choice is a grip preference rather than a different movement.
- **Less suitable when:** A user's priority is the heaviest possible loading for a strength-driven stimulus, which free weights deliver more of.
- **Complements:** A pressing movement or a pushdown.
- **Overlaps:** The free-weight overhead triceps extension; distinguish by equipment and resistance profile, not by cable attachment.
- **Status:** Draft.

## Review checklist

Before changing a record to Reviewed:

- Confirm the record answers "when would I choose this over an alternative?"
- Add equipment, setup, fatigue, and relationship fields in the final data format.
- Check terminology against the writing standard.
- Add evidence notes for claims that require them.
- The biceps incline/preacher long-vs-short-head claim and the triceps overhead-vs-neutral long-head claim now carry real evidence notes (see the canonical YAML records in `data/exercises/arms.yaml` for full citations) and no longer need softer framing on that count. Two things surfaced during that pass still need attention before Reviewed: the drag curl's head-bias claim was found to be unsupported and likely backwards, so it's now flagged as contested rather than asserted; and the "lateral- and medial-head-biased" claims on close-grip bench press, dip (triceps-biased), cable pushdown, machine triceps extension, and triceps kickback were corrected to "no evidence of a differential bias" — no research was found supporting a lateral/medial split the way the long-head evidence supports a shoulder-position-driven bias.
