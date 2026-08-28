import { Link } from 'react-router-dom';
import type { Exercise } from '../types/exercise';
import { humanize, truncate } from '../utils/format';

// The exercise-list card. Per PHASE-3-MVP.md §9: enough to decide whether
// to open the exercise, not every metadata field — progressive disclosure,
// the rest lives on the detail page.
export function ExerciseCard({ exercise }: { exercise: Exercise }) {
  return (
    <div className="exercise-card">
      <Link to={`/exercises/${exercise.id}`} className="exercise-card-link">
        <p className="exercise-card-region">{humanize(exercise.body_regions[0])}</p>
        <div className="exercise-card-head">
          <h3>{exercise.name}</h3>
          <span className="exercise-card-type">{humanize(exercise.exercise_type)}</span>
        </div>
        <p className="exercise-card-target">{exercise.primary_targets.join(', ')}</p>
        {exercise.coverage_categories.length > 0 && (
          <div className="exercise-card-tags">
            {exercise.coverage_categories.slice(0, 2).map((category) => (
              <span key={category} className="tag">
                {humanize(category)}
              </span>
            ))}
          </div>
        )}
        <p className="exercise-card-mirror">{truncate(exercise.mirror_effect, 110)}</p>
      </Link>
      {exercise.video_link && (
        // Sibling of the card's <Link>, not nested inside it — an <a> inside
        // an <a> is invalid HTML and breaks focus/AT semantics.
        <div className="exercise-card-video-hint">
          <a
            href={exercise.video_link}
            target="_blank"
            rel="noopener noreferrer"
            className="video-link-simple"
          >
            🎥 Click here for video
          </a>
        </div>
      )}
    </div>
  );
}
