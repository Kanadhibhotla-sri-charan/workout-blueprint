import { describe, expect, it } from 'vitest';
import { exercises, programming } from './index';

// Workout Logger change requests 1.1-1.3. validate-data.js enforces the
// same rules on the YAML; these pin the generated data the logger syncs.
describe('volume model', () => {
  const targetIds = programming.physiqueTargets.map((t) => t.id);
  const groupIds = programming.volumeGroups.map((g) => g.id);
  const parentOf = new Map(programming.physiqueTargets.filter((t) => t.parent).map((t) => [t.id, t.parent!]));

  it('every physique target and volume group has exactly one volume entry', () => {
    const ids = programming.volumeTargets.filter((v) => v.target_id).map((v) => v.target_id!).sort();
    expect(ids).toEqual([...targetIds, ...groupIds].sort());
  });

  it('children take their parent\'s number; everything else states minimum <= efficient <= priority', () => {
    for (const entry of programming.volumeTargets) {
      const id = (entry.target_id ?? entry.goal_id)!;
      if (parentOf.has(id)) {
        expect(entry.volume_from_parent, id).toBe(parentOf.get(id));
        expect(entry.weekly_sets).toBeUndefined();
      } else {
        const w = entry.weekly_sets!;
        expect(w.minimum, id).toBeLessThanOrEqual(w.efficient);
        expect(w.efficient, id).toBeLessThanOrEqual(w.priority);
        expect(w.priority, id).toBeLessThanOrEqual(programming.globalPrinciples.weekly_volume.practical_range_sets[1]);
        // 2.1: frequency spreads the number; the top frequency can always reach priority.
        expect(entry.sessions_per_week![1] * entry.per_session_max!, id).toBeGreaterThanOrEqual(w.priority);
        expect([24, 48]).toContain(entry.min_hours_between);
      }
    }
  });

  it('children of one parent share at most 1.0 of its volume', () => {
    for (const parent of new Set(parentOf.values())) {
      const children = programming.physiqueTargets.filter((t) => t.parent === parent);
      expect(children.reduce((sum, t) => sum + (t.volume_share ?? 0), 0), parent).toBeLessThanOrEqual(1.0001);
    }
  });

  it('every strength exercise with a physique target has target_credit, and credits only known ids in (0, 1]', () => {
    const goalEntries = programming.volumeTargets.filter((v) => v.goal_id).map((v) => v.goal_id!);
    const known = new Set([...targetIds, ...groupIds, ...goalEntries]);
    for (const exercise of exercises.filter((e) => !e.training_mode && (e.physique_targets ?? []).length > 0)) {
      const credit = exercise.target_credit!;
      expect(credit, exercise.id).toBeDefined();
      for (const [id, weight] of Object.entries(credit)) {
        expect(known.has(id), `${exercise.id} → ${id}`).toBe(true);
        expect(weight).toBeGreaterThan(0);
        expect(weight).toBeLessThanOrEqual(1);
      }
    }
  });

  it('a press credits the front delt, so pressing alone can reach its efficient number', () => {
    expect(getCredit('flat-barbell-bench-press', 'front-delt')).toBe(0.5);
    expect(getCredit('incline-barbell-press', 'upper-pec')).toBe(1.0);
    expect(getCredit('incline-barbell-press', 'chest')).toBe(1.0);
    expect(getCredit('overhead-triceps-extension', 'triceps-long-head')).toBe(1.0);
  });
});

describe('planning rules (change requests 2.1, 2.3, 2.4)', () => {
  it('every aesthetic outcome states a volume level for each of its targets', () => {
    for (const outcome of programming.aestheticOutcomes) {
      const listed = new Set((outcome.volume_levels ?? []).map((v) => v.target_id));
      for (const t of [...outcome.primary_targets, ...(outcome.supporting_targets ?? [])]) {
        expect(listed.has(t), `${outcome.id} → ${t}`).toBe(true);
      }
    }
    const arm = programming.aestheticOutcomes.find((o) => o.id === 'arm-side-thickness')!;
    expect(arm.volume_levels).toEqual([
      { target_id: 'brachialis-arm-thickness', level: 'priority' },
      { target_id: 'triceps', level: 'efficient' },
    ]);
  });

  it('core is split into flexion, rotation and anti-extension, each at 6-10 sets with 24 h recovery', () => {
    for (const id of ['rectus-abdominis', 'obliques', 'core-anti-extension']) {
      const entry = programming.volumeTargets.find((v) => (v.target_id ?? v.goal_id) === id)!;
      expect(entry.weekly_sets!.efficient, id).toBe(6);
      expect(entry.weekly_sets!.priority, id).toBe(10);
      expect(entry.per_session_max, id).toBe(6);
      expect(entry.min_hours_between, id).toBe(24);
    }
  });

  it('anti-rotation and anti-lateral-flexion exercises are flagged as badminton carryover', () => {
    const flagged = exercises.filter((e) => e.sport_carryover?.includes('badminton')).map((e) => e.id).sort();
    expect(flagged).toEqual(['pallof-press', 'plank-shoulder-tap', 'side-plank', 'suitcase-carry']);
  });
});

describe('time cost (change request 2.2)', () => {
  it('every exercise has a time block in sensible ranges', () => {
    for (const e of exercises) {
      const t = e.time!;
      expect(t, e.id).toBeDefined();
      expect(t.setup_minutes, e.id).toBeGreaterThanOrEqual(0);
      expect(t.setup_minutes, e.id).toBeLessThanOrEqual(5);
      expect(t.seconds_per_set, e.id).toBeGreaterThanOrEqual(10);
      expect(t.seconds_per_set, e.id).toBeLessThanOrEqual(180);
      expect(t.rest_seconds[0], e.id).toBeLessThanOrEqual(t.rest_seconds[1]);
      expect(t.rest_seconds[1], e.id).toBeLessThanOrEqual(180);
      expect(t.per_side, e.id).toBe(e.laterality === 'unilateral');
    }
  });

  it('strength rest follows the profile family: isolations 60-90 s, heavy free-weight compounds longest', () => {
    expect(exercises.find((e) => e.id === 'dumbbell-lateral-raise')!.time!.rest_seconds).toEqual([60, 90]);
    expect(exercises.find((e) => e.id === 'back-squat')!.time!.rest_seconds).toEqual([120, 180]);
    expect(exercises.find((e) => e.id === 'back-squat')!.time!.superset_friendly).toBe(false);
  });

  it('a typical 5-exercise, 15-set session estimates inside 60-90 minutes at the upper rest bound', () => {
    const ids = ['incline-dumbbell-press', 'chest-supported-row', 'dumbbell-lateral-raise', 'overhead-triceps-extension', 'hammer-curl'];
    const minutes = ids.reduce((sum, id) => {
      const t = exercises.find((e) => e.id === id)!.time!;
      const sides = t.per_side ? 2 : 1;
      return sum + t.setup_minutes + (3 * t.seconds_per_set * sides + 2 * t.rest_seconds[1]) / 60;
    }, 0);
    expect(minutes).toBeGreaterThan(20);
    expect(minutes).toBeLessThan(90);
  });
});

describe('logging quality (change requests 3.1-3.3, release checks)', () => {
  it('variants are unique, named after their record, and use the record\'s own equipment', () => {
    const seen = new Set<string>();
    for (const e of exercises.filter((x) => x.variants)) {
      for (const v of e.variants!) {
        expect(v.id.startsWith(`${e.id}.`), v.id).toBe(true);
        expect(e.equipment, v.id).toContain(v.equipment);
        expect(seen.has(v.id), v.id).toBe(false);
        seen.add(v.id);
      }
    }
    const rdl = exercises.find((e) => e.id === 'romanian-deadlift')!.variants!;
    expect(rdl.map((v) => [v.id, v.load])).toEqual([
      ['romanian-deadlift.barbell', 'total'],
      ['romanian-deadlift.dumbbell', 'per_hand'],
      ['romanian-deadlift.smith-machine', 'total'],
    ]);
  });

  it('the decline press family links the two existing decline records without renaming them', () => {
    const family = programming.exerciseFamilies.find((f) => f.id === 'decline-press')!;
    expect(family.members).toEqual(['decline-barbell-bench-press', 'decline-dumbbell-press']);
    const ids = new Set(exercises.map((e) => e.id));
    for (const f of programming.exerciseFamilies) for (const m of f.members) expect(ids.has(m), m).toBe(true);
  });

  it('every mobility and soft-tissue drill has a when tag; dynamic drills are warm-ups', () => {
    for (const e of exercises.filter((x) => ['mobility-hold', 'mobility-dynamic', 'soft-tissue'].includes(x.training_mode ?? ''))) {
      expect(e.when?.length, e.id).toBeGreaterThan(0);
      if (e.training_mode === 'mobility-dynamic') expect(e.when, e.id).toEqual(['warm_up']);
    }
    expect(programming.mobilityTargets.find((m) => m.goal_id === 'upper-body-mobility')).toEqual({
      goal_id: 'upper-body-mobility', weekly_minutes: 10, sessions_per_week: [3, 5],
    });
  });

  it('the snapshot carries a schema version', () => {
    expect(programming.schemaVersion).toBe(2);
  });
});

function getCredit(id: string, target: string): number | undefined {
  return exercises.find((e) => e.id === id)?.target_credit?.[target];
}
