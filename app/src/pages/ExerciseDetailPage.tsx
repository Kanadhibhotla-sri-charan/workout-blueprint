import { Link, useParams } from 'react-router-dom';
import { getExerciseById } from '../data';
import { humanize, formatRange } from '../utils/format';
import { OptionalList } from '../components/OptionalList';
import { RelationshipList } from '../components/RelationshipList';
import { buildProgramming, getEligibleIntensityTechniques } from '../engine/programmingEngine';

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

  const programming = buildProgramming(exercise, null);
  const eligibleTechniques = getEligibleIntensityTechniques(exercise);

  return (
    <article className="exercise-detail">
      {/* 1–2: what is this, why does it exist */}
      <p className="breadcrumb">
        <Link to="/exercises">All exercises</Link>
      </p>
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
        <h2>What you'll see</h2>
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

      {/* Execution guide / video reference */}
      {exercise.video_link && (
        <section className="detail-section execution-guide-section">
          <h2>Execution Guide</h2>
          <p className="execution-guide-link-row">
            <a
              href={exercise.video_link}
              target="_blank"
              rel="noopener noreferrer"
              className="video-link-simple"
            >
              🎥 Click here for video
            </a>
          </p>
        </section>
      )}

      {/* Programming Baseline */}
      <section className="detail-section programming-baseline-section">
        <h2>Programming</h2>
        <p className="field-hint">
          <strong>Baseline</strong> — {programming.profile.name}
        </p>
        <dl className="demand-grid">
          <div>
            <dt>Reps</dt>
            <dd>{formatRange(programming.repRange.primaryRange)}</dd>
          </div>
          <div>
            <dt>RIR</dt>
            <dd>{formatRange(programming.rirTypicalRange)}</dd>
          </div>
          <div>
            <dt>Weekly sets</dt>
            <dd>{formatRange(programming.weeklyVolumeSets)}</dd>
          </div>
          <div>
            <dt>Frequency</dt>
            <dd>{formatRange(programming.frequencyPerWeek)}/week</dd>
          </div>
        </dl>
        <p className="field-hint">{programming.repRange.reason}</p>
        <p className="field-hint">{programming.rirGuidance}</p>
        <p className="field-hint">{programming.progressionExplanation}</p>
        {programming.profile.guidance_note && (
          <p className="field-hint">{programming.profile.guidance_note}</p>
        )}
      </section>

      {/* Universal Intensity Techniques */}
      <section className="detail-section intensity-techniques-section">
        <h2>Intensity Techniques</h2>
        {eligibleTechniques.length > 0 ? (
          <div className="intensity-technique-cards">
            {eligibleTechniques.map((technique) => (
              <div key={technique.id} className="intensity-technique-card">
                <h3>{technique.name}</h3>
                <p className="technique-what">{technique.what}</p>
                <div className="technique-detail-group">
                  <p><strong>When it may help:</strong> {technique.when_it_may_help}</p>
                  <p><strong>When not to use:</strong> {technique.when_not_to_use}</p>
                  <p><strong>Fatigue & time implications:</strong> {technique.fatigue_time_implications}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-intensity-technique">
            <p className="text-muted">
              No specific intensity technique is recommended for this variation. Standard progressive overload is the primary progression method.
            </p>
            <p className="field-hint">{programming.intensityTechniqueContext}</p>
          </div>
        )}
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
