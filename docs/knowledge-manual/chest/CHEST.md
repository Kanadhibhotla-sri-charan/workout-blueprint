# Chest — Draft Knowledge Module

**Status:** Draft  
**Purpose:** Define the first chest records in the canonical Blueprint format. These records are a starting dataset and must be reconciled with the original Blueprint cards before the status is changed to Reviewed.

**A note on Best used when / Less suitable when:** these two fields describe training stimulus — growth demand, pump, intensity fit, and the practical result an exercise tends to produce — not equipment or time logistics. Setup and equipment details live in Coverage instead.

## Region map

The chest module is organized around practical exercise roles, not a claim that any movement completely isolates one visual "section." Where a bias toward the upper (clavicular), mid (sternal), or lower (costal) chest is commonly cited, records name it — but these are regions of one muscle, not separate muscles, and no exercise trains one region in true isolation.

- **Incline-oriented pressing:** commonly cited as upper/clavicular-biased. Barbell, dumbbell, machine, and cable all cover this role with different resistance profiles.
- **Horizontal pressing:** commonly cited as mid/sternal-biased, with substantial triceps and anterior-deltoid contribution. Barbell, dumbbell, machine, and cable all cover this role with different resistance profiles.
- **Fly / adduction work:** an option that can be useful when a user wants lower-load, single-joint-style chest work with a strong stretch component. Cable, dumbbell, and machine each offer a different resistance profile for the same role; for dumbbell flies, bench angle shifts the bias the same way it does for presses.
- **Squeeze / adduction-under-load pressing:** pressing while actively squeezing the hands or dumbbells together, which layers constant isometric adduction tension onto a normal press.
- **Overhead-arc pullover work:** a shoulder-extension movement that reaches a range no press or fly does; how much the elbows bend decides whether it lands on the chest or the lats.
- **Lengthened and shortened context:** labels that describe where an exercise tends to feel most challenging, not a guarantee of a specific adaptation.
- **Lower-chest dip pressing:** a forward-leaning dip commonly cited as lower/costal-biased, one of the few ways to load that region heavily.

## Draft records

### Incline Dumbbell Press

- **Why this exists:** A freely moving incline press for users who want an incline-oriented chest press and can control independent dumbbells.
- **Primary targets:** Chest, upper/clavicular-biased — strongly supported: Chaves et al. (2020, PMC7449336) found a large MRI-measured upper-chest growth advantage for incline vs. flat pressing over 8 weeks, backed by EMG (Rodríguez-Ridao et al., 2020, PMC7579505) showing clavicular-head activation rising with incline angle. See the canonical YAML record's evidence_notes for the full citations.
- **Movement:** Incline horizontal press.
- **Coverage:** Heavy compound, unilateral-capable bilateral work, moderate-to-high stability demand.
- **Best used when:** A user wants a strong mechanical-tension stimulus for the upper chest along with a deeper stretch at the bottom than a barbell allows, since each arm can drop past where a fixed bar would stop — a meaningful lengthened-position growth driver.
- **Less suitable when:** The stability demand of controlling two independent dumbbells caps how much weight can be used, which limits the raw mechanical-tension ceiling this movement can deliver for a stronger lifter.
- **Complements:** Cable fly variations or a stable machine press, depending on the rest of the routine.
- **Overlaps:** Other incline press variants.
- **Status:** Draft.

### Incline Barbell Press

- **Why this exists:** A fixed-path incline press that allows the heaviest loading of the incline options, at the cost of the independent-arm freedom a dumbbell allows.
- **Primary targets:** Chest, upper/clavicular-biased — same evidence as Incline Dumbbell Press above; anterior deltoids and triceps contribute.
- **Movement:** Incline horizontal press.
- **Coverage:** Heavy compound, moderate stability demand, moderate setup.
- **Best used when:** A user wants the single heaviest, most mechanical-tension-driven upper-chest builder available — the fixed bar path lets more absolute load go up than any other incline variant.
- **Less suitable when:** The fixed grip width and bar path cap the stretch at the bottom below what a dumbbell allows, so it delivers less lengthened-position stimulus per rep.
- **Complements:** A fly variation or a dumbbell press selected for a distinct role.
- **Overlaps:** Incline dumbbell, machine, and cable presses.
- **Status:** Draft.

### Incline Machine Press

- **Why this exists:** A stable incline-oriented press that lets the user focus on output without managing as much free-weight balance.
- **Primary targets:** Chest, upper/clavicular-biased — same evidence as Incline Dumbbell Press above; anterior deltoids and triceps contribute.
- **Movement:** Incline horizontal press.
- **Coverage:** Stable compound, lower setup complexity than dumbbells for many users.
- **Best used when:** A user wants to push an upper-chest set to true failure, or into a drop set or partial reps afterward — removing the balance demand means the last hard reps come from the chest giving out, not the shoulders losing control of the bar.
- **Less suitable when:** The fixed cam path doesn't match a user's shoulder mechanics, which can blunt the tension the chest actually feels regardless of how heavy the stack is loaded.
- **Complements:** A fly variation or a free-weight press with a distinct role.
- **Overlaps:** Incline dumbbell, barbell, cable, and Smith presses.
- **Status:** Draft.

### Smith Machine Incline Press

- **Why this exists:** A barbell constrained to a fixed vertical or near-vertical rail, which removes most of the balance demand of a free barbell incline press while still allowing a fixed-bar loading path.
- **Primary targets:** Chest, upper/clavicular-biased — same evidence as Incline Dumbbell Press above; anterior deltoids and triceps contribute.
- **Movement:** Incline horizontal press.
- **Coverage:** Stable compound, low-to-moderate skill demand, moderate setup.
- **Best used when:** A user wants to push an upper-chest set past what they could safely handle unspotted with a free barbell, training closer to true failure on a heavy, barbell-style press.
- **Less suitable when:** The fixed rail's path doesn't match a user's natural press arc, which can shift stress onto the shoulder joint rather than the chest.
- **Complements:** A fly variation or a free-weight press with a distinct role.
- **Overlaps:** Incline dumbbell, barbell, machine, and cable presses.
- **Status:** Draft.

### Incline Cable Press

- **Why this exists:** A standing incline-angled cable press keeps constant tension through the range, unlike a free-weight incline press where the load is easiest at lockout.
- **Primary targets:** Chest, upper/clavicular-biased — same evidence as Incline Dumbbell Press above; anterior deltoids and triceps contribute.
- **Movement:** Incline horizontal press.
- **Coverage:** Isolation-oriented compound, constant-tension resistance profile, moderate setup.
- **Best used when:** A user wants a metabolic-stress, pump-oriented upper-chest stimulus rather than raw mechanical tension — the constant cable tension keeps the muscle working hardest exactly where a free-weight press goes slack, near the top.
- **Less suitable when:** A user's priority is the heaviest possible loading for a strength-driven stimulus, which free weights deliver more of.
- **Complements:** A heavier free-weight or machine incline press.
- **Overlaps:** Incline dumbbell, barbell, and machine presses; distinguish by resistance profile.
- **Status:** Draft.

### Flat Barbell Bench Press

- **Why this exists:** The reference horizontal chest press, loadable with small increments and the most common way to build and track chest pressing strength.
- **Primary targets:** Chest, mid/sternal-biased — a more circumstantial claim than the upper-chest one: the sternocostal head is simply the largest portion of the pec and the one every horizontal press loads by default, rather than a bias flat pressing specifically creates. EMG (Rodríguez-Ridao et al., 2020) found greater sternocostal activation at 0° than at incline angles; Chaves et al. (2020) found mid-chest growth was statistically similar across flat, incline, and combined training groups. See the canonical YAML record's evidence_notes for the full citations.
- **Movement:** Horizontal press.
- **Coverage:** Heavy compound, moderate stability demand, moderate setup.
- **Best used when:** A user wants the primary mechanical-tension and strength-building stimulus for the mid chest — this is the movement most routines build their pressing progression around, and the one where absolute load climbs fastest over time.
- **Less suitable when:** The routine already has a heavy pressing movement covering mechanical tension, and what's actually missing is a pump-oriented finisher or a stretch-biased stimulus a flat barbell press does not provide.
- **Complements:** A fly variation or an incline press selected for a distinct role.
- **Overlaps:** Flat dumbbell press, machine chest press, cable chest press, and Smith machine bench press.
- **Status:** Draft.

### Smith Machine Bench Press

- **Why this exists:** A barbell constrained to a fixed vertical or near-vertical rail, which removes most of the balance demand of a free barbell bench press while still allowing a fixed-bar loading path.
- **Primary targets:** Chest, mid/sternal-biased — same evidence as Flat Barbell Bench Press above; anterior deltoids and triceps contribute.
- **Movement:** Horizontal press.
- **Coverage:** Stable compound, low-to-moderate skill demand, moderate setup.
- **Best used when:** A user wants to push a mid-chest press past what they could handle unspotted with a free barbell, training closer to true failure or running rest-pause sets on a heavy, barbell-style press.
- **Less suitable when:** The fixed rail's path doesn't match a user's natural press arc, which can shift stress onto the shoulder joint rather than the chest.
- **Complements:** A fly variation or an incline press selected for a distinct role.
- **Overlaps:** Flat barbell, dumbbell, machine, and cable presses.
- **Status:** Draft.

### Flat Dumbbell Press

- **Why this exists:** A general horizontal chest press with independently moving arms.
- **Primary targets:** Chest, mid/sternal-biased — same evidence as Flat Barbell Bench Press above; anterior deltoids and triceps contribute.
- **Movement:** Horizontal press.
- **Coverage:** Heavy compound, moderate-to-high stability demand.
- **Best used when:** A user wants a mechanical-tension stimulus for the mid chest with a deeper stretch at the bottom than a barbell allows, since each arm can drop past where a fixed bar would stop.
- **Less suitable when:** The stability demand of controlling two independent dumbbells caps how much weight can be used, which limits the raw mechanical-tension ceiling this movement can deliver for a stronger lifter.
- **Complements:** A stable press or fly variation selected for a distinct role.
- **Overlaps:** Other horizontal chest presses.
- **Status:** Draft.

### Machine Chest Press

- **Why this exists:** A stable, fixed-path horizontal press that lets a user focus on output without managing free-weight balance, and often allows loading close to failure alone.
- **Primary targets:** Chest, mid/sternal-biased — same evidence as Flat Barbell Bench Press above; anterior deltoids and triceps contribute.
- **Movement:** Horizontal press.
- **Coverage:** Stable compound, low skill demand, low setup where the machine is free.
- **Best used when:** A user wants to push a mid-chest set to true failure, or into a drop set or partial reps afterward — removing the balance demand means the last hard reps come from the chest giving out, not the shoulders losing control of the bar.
- **Less suitable when:** The fixed cam path doesn't match a user's shoulder mechanics, which can blunt the tension the chest actually feels regardless of how heavy the stack is loaded.
- **Complements:** A fly variation or a free-weight press with a distinct role.
- **Overlaps:** Flat barbell, dumbbell, and Smith machine presses.
- **Status:** Draft.

### Cable Chest Press

- **Why this exists:** A standing cable press keeps constant tension through the range, unlike a free-weight press where the load is easiest at lockout, and also allows a converging path free weights and machines don't.
- **Primary targets:** Chest, mid/sternal-biased — same evidence as Flat Barbell Bench Press above; anterior deltoids and triceps contribute.
- **Movement:** Horizontal press.
- **Coverage:** Isolation-oriented compound, constant-tension resistance profile, moderate setup.
- **Best used when:** A user wants a metabolic-stress, pump-oriented mid-chest stimulus rather than raw mechanical tension — the constant cable tension keeps the muscle working hardest exactly where a free-weight press goes slack, near the top.
- **Less suitable when:** A user's priority is the heaviest possible loading for a strength-driven stimulus, which free weights deliver more of.
- **Complements:** A heavier free-weight or machine press.
- **Overlaps:** Flat barbell, dumbbell, and machine presses; distinguish by resistance profile.
- **Status:** Draft.

### Hex Press

- **Why this exists:** Pressing two dumbbells while actively squeezing them together adds constant isometric adduction tension throughout the rep, on top of the press itself — a stimulus most standard presses don't provide.
- **Primary targets:** Chest, mid/sternal-biased — same evidence as Flat Barbell Bench Press above. The "extra emphasis toward the inner chest" claim is separate and unresolved: no research isolates an "inner chest" as a distinct region within the sternocostal head, and no study of the squeeze-adduction effect was located — it's a coaching cue based on where lifters report feeling the squeeze, not a settled finding; triceps and anterior deltoids contribute.
- **Movement:** Horizontal press with continuous shoulder adduction.
- **Coverage:** Isolation-oriented compound, low-to-moderate stability demand, low setup.
- **Best used when:** A user wants a strong mind-muscle-connection and metabolic-stress, pump-oriented stimulus for the inner chest, often as a finisher after heavier pressing — the constant squeeze keeps real tension on the chest even near the top of the rep, where a standard press mostly hands the load off to the triceps and shoulders.
- **Less suitable when:** A user's priority is maximal loading for a mechanical-tension stimulus — the squeeze demand caps how heavy this can realistically be loaded compared to a standard press.
- **Complements:** A heavier press movement.
- **Overlaps:** Flat dumbbell press and dumbbell fly; distinguish by the continuous squeeze.
- **Status:** Draft.

### Flat Dumbbell Fly

- **Why this exists:** A free-weight chest adduction option performed flat; the load is hardest around the mid-range and eases at the top, the opposite feel from a cable fly.
- **Primary targets:** Chest, mid-biased — same evidence tier as Flat Barbell Bench Press above, extrapolated from press studies to a fly pattern since no fly-specific study was located.
- **Movement:** Shoulder horizontal adduction.
- **Coverage:** Isolation-oriented, moderate-to-high stability demand, low setup.
- **Best used when:** A user wants a strong stretch-mediated growth stimulus for the mid chest at the bottom of the range — the resistance loads the chest hardest exactly where the muscle is most lengthened, which a press does not replicate. This general framing is grounded in the broader stretch-mediated hypertrophy literature (Schoenfeld & Grgic, 2020; Wolf et al., 2023, 2025) — see the canonical YAML record's evidence_notes for citations.
- **Less suitable when:** A user wants tension held through the top of the range too, which this movement's resistance profile gives up as the arms come together — a cable fly holds that tension where a dumbbell fly cannot.
- **Complements:** A pressing movement.
- **Overlaps:** Incline and decline dumbbell fly, and cable and machine fly variations; distinguish by bench angle and resistance profile.
- **Status:** Draft.

### Incline Dumbbell Fly

- **Why this exists:** Angling the bench up shifts a free-weight fly's stretch and tension toward the upper chest, the fly equivalent of what an incline press does for pressing.
- **Primary targets:** Chest, upper/clavicular-biased — same evidence as Incline Dumbbell Press above, extrapolated from press studies to a fly pattern; anterior deltoids contribute less than in a press.
- **Movement:** Shoulder horizontal adduction on an incline.
- **Coverage:** Isolation-oriented, moderate-to-high stability demand, low setup.
- **Best used when:** A user wants a stretch-mediated growth stimulus specifically for the upper chest, rather than the mid-chest bias a flat fly delivers. Same general stretch-mediated hypertrophy grounding as Flat Dumbbell Fly above.
- **Less suitable when:** Shoulder comfort at the bottom of the range is limiting, which shows up more often at steeper bench angles than on a flat fly.
- **Complements:** An incline pressing movement.
- **Overlaps:** Flat and decline dumbbell fly; distinguish by bench angle and which pec region is stretched hardest.
- **Status:** Draft.

### Decline Dumbbell Fly

- **Why this exists:** Angling the bench down shifts a free-weight fly's stretch and tension toward the lower chest, a region most fly variations don't reach.
- **Primary targets:** Chest, lower/costal-biased — weaker evidence than the upper-chest claim: EMG only (Rodríguez-Ridao et al., 2020; Barnett et al., 1995) found greater lower-pec activation during decline vs. incline/flat pressing, but no MRI or ultrasound hypertrophy trial isolating a decline-specific lower-chest growth effect was located; anterior deltoids contribute less than in a press.
- **Movement:** Shoulder horizontal adduction on a decline.
- **Coverage:** Isolation-oriented, moderate-to-high stability demand, moderate setup.
- **Best used when:** A user wants a stretch-mediated growth stimulus specifically for the lower chest, as an isolation-style complement to a heavier compound like the dip. Same general stretch-mediated hypertrophy grounding as Flat Dumbbell Fly above.
- **Less suitable when:** Shoulder comfort in the decline position is limiting, or a user already has the dip covering lower-chest work and wants a distinct role instead of an overlapping one.
- **Complements:** A dip or other lower-chest-biased movement.
- **Overlaps:** Flat and incline dumbbell fly; distinguish by bench angle and which pec region is stretched hardest.
- **Status:** Draft.

### Machine Fly (Pec Deck)

- **Why this exists:** A fixed-path fly that removes the balance demand of a dumbbell fly, letting a user isolate the chest closer to failure.
- **Primary targets:** Chest, mid-biased — same evidence tier as Flat Barbell Bench Press above, extrapolated from press studies to a fly pattern.
- **Movement:** Shoulder horizontal adduction.
- **Coverage:** Isolation, low skill demand, low fatigue cost.
- **Best used when:** A user wants a pump-oriented finisher that's safe to push to true failure or into a drop set — there's no stability demand competing for effort, so every bit of output goes into the chest.
- **Less suitable when:** A user wants the deep bottom-range stretch a dumbbell fly delivers, since the machine's arc and pad position usually stop short of that range.
- **Complements:** A pressing movement.
- **Overlaps:** Cable fly and the flat, incline, and decline dumbbell fly; distinguish by resistance profile.
- **Status:** Draft.

### Cable Fly

- **Why this exists:** A cable-based chest adduction option with flexible line-of-pull and lower systemic fatigue than a heavy press for many users.
- **Primary targets:** Chest; pulley height is commonly claimed to change the bias — a low-to-high path toward upper, a high-to-low path toward lower, mid-height most even — but this is unresolved: no study directly tests cable-fly pulley height against measured regional pec activation or growth. It's a reasonable inference from the incline/decline press evidence, not a tested finding for the fly pattern specifically.
- **Movement:** Shoulder horizontal adduction.
- **Coverage:** Isolation-oriented, lower setup-to-fatigue cost when a cable station is available.
- **Best used when:** A user wants constant tension through the whole range for a metabolic-stress, pump-oriented finisher, or wants to specifically target the upper or lower chest by adjusting pulley height in a way free-weight flies cannot.
- **Less suitable when:** A user wants the single deepest stretch position a dumbbell fly's lower resistance point allows, or wants a movement that can be loaded as heavily as a press for raw mechanical tension.
- **Complements:** A pressing movement.
- **Overlaps:** Machine fly and the flat, incline, and decline dumbbell fly; distinguish by resistance profile and cable path.
- **Status:** Draft.

### Dumbbell Pullover (Chest-Biased)

- **Why this exists:** A straight-to-slightly-bent-arm arc that extends overhead loads the chest in a shoulder-extension role that no press or fly reaches, and is commonly associated with rib-cage and serratus involvement as well.
- **Primary targets:** Chest, general/costal-biased in this straighter-arm form — unresolved: no research was found on the pullover's regional pec bias specifically, so this is an inference from the movement's shoulder-extension arc rather than a tested finding; serratus anterior and the long head of the triceps contribute.
- **Movement:** Shoulder extension through an overhead arc.
- **Coverage:** Isolation-oriented, moderate stability demand, low setup with a bench and one dumbbell.
- **Best used when:** A user wants a strong stretch-mediated stimulus at the top of an overhead arc, a range no press or fly reaches, or wants a chest movement that also brings the serratus into play. Same general stretch-mediated hypertrophy grounding as Flat Dumbbell Fly above; no pullover-specific study was found.
- **Less suitable when:** The elbows bend enough that the movement shifts toward a lat-dominant pullover instead — see the back module's version, which uses more elbow bend specifically to bias the lats.
- **Complements:** A pressing movement.
- **Overlaps:** The lat-biased dumbbell pullover recorded in the back module; elbow bend is what separates the two.
- **Status:** Draft.

### Dip (Chest-Biased, Forward Lean)

- **Why this exists:** A bodyweight press that, with a forward torso lean, biases the lower chest more than flat or incline pressing does.
- **Primary targets:** Chest, lower/costal-biased — same evidence tier as Decline Dumbbell Fly above: EMG shows high lower-pec activation with a forward-leaning dip, but no MRI or ultrasound hypertrophy trial isolating the dip's lower-chest effect was located; triceps and anterior deltoids contribute.
- **Movement:** Horizontal-to-vertical press.
- **Coverage:** Heavy-for-bodyweight compound, high stability and shoulder-mobility demand.
- **Best used when:** A user wants one of the few genuinely heavy, mechanical-tension-driven options for the lower chest, with a deep stretch at the bottom that most pressing angles don't reach.
- **Less suitable when:** Shoulder range or tolerance limits how deep the dip can go, which caps the stretch that gives this movement its main growth value — a shallow dip gives up most of what makes it distinct from a flat press.
- **Complements:** An incline press, which covers the opposite end of the chest.
- **Overlaps:** The triceps-biased dip recorded in the arms module; torso angle is what separates the two.
- **Status:** Draft.

### Push-Up

- **Why this exists:** An accessible horizontal press that scales with leverage, loading, range, and execution.
- **Primary targets:** Chest, mid-biased, similar to a flat press — same evidence as Flat Barbell Bench Press above; anterior deltoids, triceps, and trunk musculature contribute.
- **Movement:** Horizontal press.
- **Coverage:** Low-equipment compound and scalable home-gym option.
- **Best used when:** A user wants high-rep, pump-oriented chest volume, a technique or warm-up tool, or a genuine mechanical-tension stimulus once loaded with a weight vest or band — bodyweight alone caps how much raw tension it can deliver for a trained lifter.
- **Less suitable when:** A user's set can be done for very high reps without real difficulty, which signals the stimulus has dropped closer to muscular endurance than the tension needed to drive further growth.
- **Complements:** Loaded press or cable work where available.
- **Overlaps:** Horizontal presses.
- **Status:** Draft.

## Review checklist

Before changing a record to Reviewed:

- Compare wording and intent with the original Blueprint card.
- Add equipment, setup, fatigue, and relationship fields in the final data format.
- Check terminology against the writing standard.
- Add evidence notes for claims that require them.
- The fly and pullover records' general "stretch-mediated growth stimulus" claims now carry evidence notes citing the broader stretch-mediated hypertrophy literature (see `data/exercises/chest.yaml`), on top of their region-bias-specific citations below.
- Upper/mid/lower pec bias claims now carry real evidence notes (see the canonical YAML records in `data/exercises/chest.yaml` for full citations). Evidence quality differs by region: the upper-chest claim has strong support (an MRI hypertrophy trial plus EMG), the mid-chest claim is more circumstantial (it's the default region every press loads, not a bias a specific technique creates), and the lower-chest claim is EMG-only (no hypertrophy trial isolating that region was found). The cable fly's pulley-height claim and the pullover's general/costal claim remain unresolved coaching cues — flagged, not asserted.
