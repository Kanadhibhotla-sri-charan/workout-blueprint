import { Link, useSearchParams } from 'react-router-dom';
import { bodyRegions, exercises } from '../data';
import { ExerciseCard } from '../components/ExerciseCard';
import { humanize } from '../utils/format';

export function ExerciseListPage() {
  const [searchParams] = useSearchParams();
  const region = searchParams.get('region');
  const regionIsValid = region !== null && bodyRegions.includes(region);

  const results = regionIsValid
    ? exercises.filter((exercise) => exercise.body_regions.includes(region))
    : exercises;

  return (
    <div className="exercise-list-page">
      <div className="exercise-list-header">
        <div>
          <h1>{regionIsValid ? humanize(region) : 'All Exercises'}</h1>
          <p className="result-count">
            {results.length} exercise{results.length === 1 ? '' : 's'}
          </p>
        </div>
        {regionIsValid && (
          <Link to="/exercises" className="button button-secondary">
            All regions
          </Link>
        )}
      </div>

      {region !== null && !regionIsValid && (
        <p className="empty-state">
          "{region}" isn't a recognized body region. Showing all exercises instead.
        </p>
      )}

      {results.length === 0 ? (
        <p className="empty-state">No exercises match this view yet.</p>
      ) : (
        <div className="exercise-grid">
          {results.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      )}
    </div>
  );
}
