import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import type { PackageLevel } from '../types/packages';
import { getMuscleGroupById, getPackagesForMuscleGroup, resolvePackage, type ResolvedPackage } from '../engine/packageEngine';
import { NotFoundPage } from './NotFoundPage';

const DEMAND_FILL: Record<'low' | 'medium' | 'high', number> = { low: 1, medium: 2, high: 3 };
const ROLE_LABELS: Record<string, string> = {
  primary: 'Primary builder',
  direct: 'Direct',
  secondary: 'Secondary',
  supporting: 'Supporting',
};

function DemandBar({ level, label }: { level: 'low' | 'medium' | 'high'; label: string }) {
  const fill = DEMAND_FILL[level];
  return (
    <div className="demand-bar-row">
      <span className="demand-bar-label">{label}</span>
      <span className="demand-bar-track" role="img" aria-label={`${label}: ${level}`}>
        {[1, 2, 3].map((segment) => (
          <span key={segment} className={segment <= fill ? 'demand-bar-segment filled' : 'demand-bar-segment'} />
        ))}
      </span>
      <span className="demand-bar-value">{level}</span>
    </div>
  );
}

function CoverageRow({ targetName, covered }: { targetName: string; covered: boolean }) {
  return (
    <div className="coverage-row">
      <span className="coverage-row-name">{targetName}</span>
      <span className={covered ? 'coverage-row-track' : 'coverage-row-track coverage-row-track-empty'} role="img" aria-label={covered ? 'Covered' : 'Not directly covered'}>
        <span className="coverage-row-fill" style={{ width: covered ? '100%' : '0%' }} />
      </span>
    </div>
  );
}

function LevelTabs({ muscleGroupId, activeLevel }: { muscleGroupId: string; activeLevel: PackageLevel }) {
  return (
    <div className="package-level-tabs" role="tablist" aria-label="Package level">
      {(['efficient', 'complete'] as const).map((level) => (
        <Link
          key={level}
          to={`/build/${muscleGroupId}?level=${level}`}
          role="tab"
          aria-selected={level === activeLevel}
          className={level === activeLevel ? 'package-level-tab package-level-tab-active' : 'package-level-tab'}
        >
          {level === 'efficient' ? 'Efficient' : 'Complete'}
        </Link>
      ))}
    </div>
  );
}

function PackageComparison({ efficient, complete }: { efficient: ResolvedPackage; complete: ResolvedPackage }) {
  const efficientCovered = efficient.targetCoverage.filter((t) => t.covered).length;
  const completeCovered = complete.targetCoverage.filter((t) => t.covered).length;
  return (
    <table className="package-comparison">
      <caption>Efficient vs. Complete</caption>
      <thead>
        <tr>
          <th scope="col"></th>
          <th scope="col">Efficient</th>
          <th scope="col">Complete</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Exercises</th>
          <td>{efficient.exercises.length}</td>
          <td>{complete.exercises.length}</td>
        </tr>
        <tr>
          <th scope="row">Weekly direct sets</th>
          <td>{efficient.weeklyDirectSets}</td>
          <td>{complete.weeklyDirectSets}</td>
        </tr>
        <tr>
          <th scope="row">Targets covered</th>
          <td>{efficientCovered}/{efficient.targetCoverage.length}</td>
          <td>{completeCovered}/{complete.targetCoverage.length}</td>
        </tr>
        <tr>
          <th scope="row">Time</th>
          <td>Lower</td>
          <td>Higher</td>
        </tr>
      </tbody>
    </table>
  );
}

export function BuildMusclePackagePage() {
  const { muscleGroupId } = useParams<{ muscleGroupId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const muscleGroup = muscleGroupId ? getMuscleGroupById(muscleGroupId) : null;
  if (!muscleGroupId || !muscleGroup) return <NotFoundPage />;

  const requestedLevel = searchParams.get('level');
  const level: PackageLevel = requestedLevel === 'complete' ? 'complete' : 'efficient';

  const packages = getPackagesForMuscleGroup(muscleGroupId);
  const activePackage = packages.find((p) => p.level === level);
  if (!activePackage) return <NotFoundPage />;

  const resolved = resolvePackage(activePackage.id);
  if (!resolved) return <NotFoundPage />;

  const otherLevel: PackageLevel = level === 'efficient' ? 'complete' : 'efficient';
  const otherPackage = packages.find((p) => p.level === otherLevel);
  const otherResolved = otherPackage ? resolvePackage(otherPackage.id) : null;

  return (
    <div className="build-muscle-package">
      <p className="build-muscle-breadcrumb">
        <button type="button" className="link-button" onClick={() => navigate('/build')}>
          Build the Muscle
        </button>
        {' / '}
        {muscleGroup.name}
      </p>

      <p className="build-muscle-eyebrow">{muscleGroup.name.toUpperCase()} — ALL-ROUND DEVELOPMENT</p>
      <h1>{resolved.pkg.display_name}</h1>
      <p className="build-muscle-objective">{resolved.pkg.objective}</p>

      <LevelTabs muscleGroupId={muscleGroupId} activeLevel={level} />

      <div className="package-summary-grid">
        <section className="package-summary-card">
          <h2>Visual coverage</h2>
          <div className="coverage-list">
            {resolved.targetCoverage.map((coverage) => (
              <CoverageRow key={coverage.targetId} targetName={coverage.targetName} covered={coverage.covered} />
            ))}
          </div>
        </section>

        <section className="package-summary-card">
          <h2>Volume &amp; frequency</h2>
          <dl className="package-stats">
            <div>
              <dt>Weekly direct volume</dt>
              <dd>{resolved.weeklyDirectSets} sets</dd>
            </div>
            <div>
              <dt>Session direct volume</dt>
              <dd>{resolved.sessionDirectSets} sets</dd>
            </div>
            <div>
              <dt>Frequency</dt>
              <dd>{resolved.pkg.frequency.sessions_per_week}&times; / week</dd>
            </div>
          </dl>
        </section>
      </div>

      {otherResolved && (
        <section className="package-comparison-section">
          <PackageComparison
            efficient={level === 'efficient' ? resolved : otherResolved}
            complete={level === 'complete' ? resolved : otherResolved}
          />
        </section>
      )}

      <h2 className="build-muscle-section-heading">Exercises</h2>
      <ol className="package-exercise-list">
        {resolved.exercises.map((resolvedExercise) => (
          <li key={resolvedExercise.exercise.id} className="package-exercise-card">
            <div className="package-exercise-header">
              <span className="package-exercise-order">{String(resolvedExercise.entry.order).padStart(2, '0')}</span>
              <Link to={`/exercises/${resolvedExercise.exercise.id}`} className="package-exercise-name">
                {resolvedExercise.exercise.name}
              </Link>
            </div>

            <p className="package-exercise-prescription">
              {resolvedExercise.entry.sets} &times; {resolvedExercise.entry.reps}
              <span className="package-exercise-rir"> RIR {resolvedExercise.entry.rir}</span>
            </p>

            <p className="package-exercise-role">{ROLE_LABELS[resolvedExercise.entry.role] ?? resolvedExercise.entry.role}</p>
            <p className="package-exercise-contribution">{resolvedExercise.entry.contribution}</p>

            <DemandBar level={resolvedExercise.exercise.fatigue_cost} label="Fatigue" />

            <details className="package-exercise-details">
              <summary>Why this exercise?</summary>
              <p>{resolvedExercise.intensityTechniqueContext}</p>
            </details>
          </li>
        ))}
      </ol>

      <section className="package-rationale">
        <h2>Why these exercises together</h2>
        <p>{resolved.pkg.rationale}</p>
      </section>

      <details className="package-progression">
        <summary>Progression</summary>
        <p>{resolved.progressionExplanation}</p>
      </details>
    </div>
  );
}
