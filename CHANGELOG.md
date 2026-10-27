# Changelog

Data changes that matter to apps reading Blueprint (the Workout Logger syncs a snapshot). Each entry lists what changed and any renamed ids. **No id has been renamed so far.**

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
