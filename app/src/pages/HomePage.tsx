import { Link } from 'react-router-dom';
import { bodyRegions, getExercisesByBodyRegion } from '../data';
import { humanize } from '../utils/format';

export function HomePage() {
  return (
    <div className="home-page">
      <h1>Physique Blueprint</h1>
      <p className="home-tagline">
        Turn structured exercise knowledge into practical exercise decisions.
      </p>

      <div className="home-actions">
        <Link to="/exercises" className="button button-primary">
          Explore Exercises
        </Link>
        <Link to="/decide" className="button button-secondary">
          Make a Decision
        </Link>
      </div>

      <h2 className="home-section-heading">Browse by body region</h2>
      <div className="region-grid">
        {bodyRegions.map((region) => (
          <Link key={region} to={`/exercises?region=${region}`} className="region-tile">
            <span className="region-name">{humanize(region)}</span>
            <span className="region-count">{getExercisesByBodyRegion(region).length}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
