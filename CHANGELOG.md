# Changelog

Data changes that matter to apps reading Blueprint (the Workout Logger syncs a snapshot). Each entry lists what changed and any renamed ids. **No id has been renamed so far.**

## 2026-10-27: Time cost per exercise (Logger change request 2.2)

**Added:** a `time` block on all 182 exercises: `setup_minutes`, `seconds_per_set`, `rest_seconds` [low, high], `per_side` and `superset_friendly`. It is derived from each exercise's existing prescription; see SCHEMA.md › `time` for the rules.

- Session estimate: setup + sets × seconds_per_set × (2 if per_side) + rests between sets.
- Example: incline dumbbell press, chest-supported row, lateral raise, overhead triceps extension and hammer curl at 3 sets each comes to about 30–38 minutes before warm-up.

**Unchanged:** every Decide answer (byte-identical). `setup_time` and `fatigue_cost` remain.

## 2026-10-27: Planning rules (Logger change requests 2.1, 2.3, 2.4)

**Added (additive; no id renamed):**
- **2.1:** every `volume-targets.yaml` entry with weekly numbers gains `sessions_per_week` ([2, 3]) and `min_hours_between` (48 h; 24 h for abs, calves, forearms and neck).
  - Frequency spreads the weekly number and never multiplies it.
  - The package engine and package docs no longer present sets × frequency as a muscle's weekly volume. Packages are sample sessions. The Build pages' "sets/week" figures are unchanged and still describe the sample package.
- **2.3:** every aesthetic outcome gains `volume_levels`: a list of `{ target_id, level }` with level `priority`, `efficient` or `bias`.
  - Primary targets → priority; supporting targets → efficient.
  - A child target's level goes to its parent group, and the child is marked `bias`.
- **2.4:** core is split into three qualities:
  - flexion → `rectus-abdominis`;
  - rotation, anti-rotation and anti-lateral flexion → `obliques`;
  - anti-extension → a new volume entry `goal_id: core-anti-extension` (the existing functional goal). It may appear in `target_credit`.
  - Each has efficient 6 / priority 10, at most 6 per session, and 24 h between sessions.
  - Credits changed: plank (`core-anti-extension 1.0`, `rectus-abdominis 0.5`), ab-wheel rollout (+ `core-anti-extension 1.0`), plank shoulder tap (+ `core-anti-extension 0.5`).
  - New exercise field `sport_carryover: [badminton]` on pallof press, plank shoulder tap, suitcase carry and side plank.
- **Generated data:** volume entries may carry `goal_id` instead of `target_id`.

**Unchanged:** every Decide recommendation and answer (byte-identical to the previous release).

## 2026-10-27: Volume data model (Logger change requests 1.1–1.3)

**Added (all additive; no field removed or renamed):**
- `data/programming/volume-targets.yaml` (new):
  - one entry per physique target and per volume group;
  - `weekly_sets` (`minimum` / `efficient` / `priority`), `per_session_max`, `indirect_only` and `rationale`;
  - child targets carry `volume_from_parent` instead of `weekly_sets`.
- `data/programming/physique-targets.yaml`:
  - top-level `volume_groups` (`chest`, `calves`);
  - targets gain optional `parent`, `volume_share` and `min_share`. Children: upper / mid / lower-pec → chest; triceps-long-head → triceps; gastrocnemius / soleus → calves.
- `target_credit` on 138 strength exercises: a mapping of target or group id → weight in (0, 1].
- Generated data: `programming.generated.json` gains `volumeGroups` and `volumeTargets`; exercises gain `target_credit`.

**Units:** weekly numbers are credited hard sets per 7-day week. Credited sets = logged hard sets × `target_credit` weight.

**Unchanged:** every Decide recommendation. Development packages are unchanged and still describe sample sessions. Prose `primary_targets` / `secondary_targets` stay for the UI.
