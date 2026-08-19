import { Link, useParams } from 'react-router-dom';
import { getExerciseById } from '../data';
import { humanize } from '../utils/format';
import { OptionalList } from '../components/OptionalList';
import { RelationshipList } from '../components/RelationshipList';

export function ExerciseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const exercise = id ? getExerciseById(id) : undefined;

  if (!exercise) {
    return (
      <div className="not-found">
        <h1>Exercise not found</h1>
        <p>There's no exercise with that id in the current dataset.</p>
        <Link to="/exercises" className="button button-secondary">
          Back to all exercises
        </Link>
      </div>
    );
  }

  return (
    <article className="exercise-detail">
      {/* 1–2: what is this, why does it exist */}
      <p className="breadcrumb">
        <Link to="/exercises">&larr; Explore</Link>
      </p>
      <p className="eyebrow">{humanize(exercise.body_regions[0])}</p>
      <h1>{exercise.name}</h1>
      <p className="detail-summary">{exercise.summary}</p>
      <p className="detail-why">{exercise.why_this_exists}</p>
      <p className="detail-targets">
        <strong>Primary targets:</strong> {exercise.primary_targets.join(', ')}
        {exercise.secondary_targets && exercise.secondary_targets.length > 0 && (
          <>
            {' '}
            <span className="text-muted">
              (secondary: {exercise.secondary_targets.join(', ')})
            </span>
          </>
        )}
      </p>
      {exercise.coverage_categories.length > 0 && (
        <div className="exercise-card-tags">
          {exercise.coverage_categories.map((category) => (
            <span key={category} className="tag">
              {humanize(category)}
            </span>
          ))}
        </div>
      )}

      {/* 3: what will I see / what does it help develop */}
      <section className="detail-section mirror-effect-section">
        <h2>Visual effect</h2>
        <p>{exercise.mirror_effect}</p>
      </section>

      {/* 4–5: when to use it, what it demands */}
      <section className="detail-section">
        <h2>Decision context</h2>
        <OptionalList title="Best used when" items={exercise.best_used_when} />
        <OptionalList title="Less suitable when" items={exercise.less_suitable_when} />
        <OptionalList title="Limitations" items={exercise.limitations} />

        <h3>Demands</h3>
        <dl className="demand-grid">
          <div>
            <dt>Type</dt>
            <dd>{humanize(exercise.exercise_type)}</dd>
          </div>
          <div>
            <dt>Laterality</dt>
            <dd>{humanize(exercise.laterality)}</dd>
          </div>
          <div>
            <dt>Movement pattern</dt>
            <dd>{exercise.movement_patterns.join(', ')}</dd>
          </div>
          <div>
            <dt>Equipment</dt>
            <dd>{exercise.equipment.join(', ')}</dd>
          </div>
          <div>
            <dt>Setup time</dt>
            <dd>{humanize(exercise.setup_time)}</dd>
          </div>
          <div>
            <dt>Fatigue cost</dt>
            <dd>{humanize(exercise.fatigue_cost)}</dd>
          </div>
          <div>
            <dt>Stability demand</dt>
            <dd>{humanize(exercise.stability_demand)}</dd>
          </div>
          <div>
            <dt>Skill demand</dt>
            <dd>{humanize(exercise.skill_demand)}</dd>
          </div>
        </dl>
      </section>

      {/* 6–8: relationships */}
      {(exercise.alternatives?.length ||
        exercise.complements?.length ||
        exercise.overlaps_with?.length) && (
        <section className="detail-section">
          <h2>Related exercises</h2>
          <RelationshipList
            title="Alternatives"
            description="Fill approximately the same role if you can't or don't want to use this exercise."
            entries={exercise.alternatives}
          />
          <RelationshipList
            title="Complements"
            description="Add materially different coverage alongside this exercise."
            entries={exercise.complements}
          />
          <RelationshipList
            title="Overlaps with"
            description="Already covers substantially similar ground."
            entries={exercise.overlaps_with}
          />
        </section>
      )}

      {/* 9: technical detail, progressively disclosed */}
      <details className="detail-section technical-detail">
        <summary>Technical details</summary>
        <div className="technical-detail-body">
          <div className="optional-list">
            <h3>Resistance profile</h3>
            <p>{exercise.resistance_profile}</p>
          </div>
          <OptionalList title="Technique cues" items={exercise.technique_cues} />
          <OptionalList title="Common mistakes" items={exercise.common_mistakes} />
          <OptionalList title="Programming notes" items={exercise.programming_notes} />
          <OptionalList title="Evidence notes" items={exercise.evidence_notes} />
        </div>
      </details>
    </article>
  );
}
