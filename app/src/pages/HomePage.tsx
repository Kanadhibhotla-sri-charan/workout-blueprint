import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { bodyRegions, getExercisesByBodyRegion } from '../data';
import { humanize } from '../utils/format';

export function HomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  function handleSearchSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `/exercises?q=${encodeURIComponent(trimmed)}` : '/exercises');
  }

  return (
    <div className="home-page">
      <h1>Physique Blueprint</h1>
      <p className="home-tagline">
        Turn structured exercise knowledge into practical exercise decisions.
      </p>

      <div className="home-path-picker">
        <Link to="/decide" className="home-path-card">
          <span className="home-path-card-title">Fix a Visual Problem</span>
          <span className="home-path-card-desc">Find what may be limiting a specific aesthetic — one problem, one explainable recommendation.</span>
        </Link>
        <Link to="/build" className="home-path-card">
          <span className="home-path-card-title">Build the Muscle</span>
          <span className="home-path-card-desc">Complete, coverage-driven all-round development packages for a whole muscle group.</span>
        </Link>
      </div>

      <div className="home-actions">
        <Link to="/exercises" className="button button-secondary">
          Explore Exercises
        </Link>
      </div>

      <form className="home-search" onSubmit={handleSearchSubmit} role="search">
        <label htmlFor="home-search-input">Search exercises</label>
        <div className="home-search-row">
          <input
            id="home-search-input"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="upper chest, rear delt, cable…"
          />
          <button type="submit" className="button button-primary">
            Search
          </button>
        </div>
      </form>

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
