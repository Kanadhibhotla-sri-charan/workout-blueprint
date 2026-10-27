import { functionalGoals, programming } from '../data';
import type { Exercise } from '../types/exercise';
import { SAMPLE_SETS, sampleMinutes } from '../utils/readout';

// HUD readout on the exercise page: how much one hard set counts toward
// each muscle (target_credit) and what three working sets cost in time
// (the `time` block). Display only — both numbers come straight from the
// data; nothing here ranks or recommends.

function creditName(id: string): string {
  return (
    programming.physiqueTargets.find((t) => t.id === id)?.name ??
    programming.volumeGroups.find((g) => g.id === id)?.name ??
    functionalGoals.find((g) => g.id === id)?.name ??
    id
  );
}

function creditLabel(weight: number): string {
  if (weight >= 1) return 'Full set';
  if (weight >= 0.5) return 'Partial';
  return 'Minor';
}

export function ExerciseReadout({ exercise }: { exercise: Exercise }) {
  const credit = Object.entries(exercise.target_credit ?? {}).sort((a, b) => b[1] - a[1]);
  const time = exercise.time;
  if (credit.length === 0 && !time) return null;
  const [low, high] = time ? sampleMinutes(time) : [0, 0];

  return (
    <section className="detail-section exercise-readout" aria-label="Exercise readout">
      <h2>Readout</h2>
      <div className="exercise-readout-grid">
        {credit.length > 0 && (
          <div className="exercise-readout-panel">
            <p className="exercise-readout-heading">Muscle credit per hard set</p>
            <ul className="credit-list">
              {credit.map(([id, weight]) => (
                <li key={id} className="credit-row">
                  <span className="credit-name">{creditName(id)}</span>
                  <span className="credit-track" aria-hidden="true">
                    <span className="credit-fill" style={{ width: `${Math.round(weight * 100)}%` }} />
                  </span>
                  <span className="credit-value">
                    {weight.toFixed(2).replace(/0$/, '')} <span className="credit-tag">{creditLabel(weight)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {time && (
          <div className="exercise-readout-panel">
            <p className="exercise-readout-heading">Time cost</p>
            <p className="readout-big">
              {low === high ? low : `${low}–${high}`}
              <span className="readout-unit"> min</span>
            </p>
            <p className="readout-caption">
              for {SAMPLE_SETS} working sets{time.per_side ? ', each side' : ''}, including rest
            </p>
            <dl className="readout-stats">
              <div>
                <dt>Set</dt>
                <dd>{time.seconds_per_set}s</dd>
              </div>
              <div>
                <dt>Rest</dt>
                <dd>
                  {time.rest_seconds[0]}–{time.rest_seconds[1]}s
                </dd>
              </div>
              <div>
                <dt>Setup</dt>
                <dd>{time.setup_minutes} min</dd>
              </div>
              <div>
                <dt>Superset</dt>
                <dd>{time.superset_friendly ? 'Yes' : 'No'}</dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </section>
  );
}
