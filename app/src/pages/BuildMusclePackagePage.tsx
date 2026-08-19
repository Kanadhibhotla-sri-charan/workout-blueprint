import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import type { PackageLevel } from '../types/packages';
import {
  comparePackageLevels,
  buildExerciseProgressionNote,
  getMuscleGroupById,
  getPackagesForMuscleGroup,
  resolvePackage,
  type ResolvedPackage,
} from '../engine/packageEngine';
import { programming } from '../data';
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

function targetSummaryLine(exercise: ResolvedPackage['exercises'][number]['exercise']): string {
  const targetIds = exercise.physique_targets?.length ? exercise.physique_targets : exercise.primary_targets;
  const names = targetIds
    .map((id) => programming.physiqueTargets.find((t) => t.id === id)?.name)
    .filter((name): name is string => Boolean(name));
  return names.length > 0 ? names.join(' • ') : exercise.primary_targets.join(' • ');
}

function CoverageRow({ targetName, covered }: { targetName: string; covered: boolean }) {
  return (
    <div className="coverage-row">
      <span className="coverage-row-name">{targetName}</span>
      <span
        className={covered ? 'coverage-row-track' : 'coverage-row-track coverage-row-track-empty'}
        role="img"
        aria-label={covered ? 'Covered' : 'Not directly covered'}
      >
        <span className="coverage-row-fill" style={{ width: covered ? '100%' : '0%' }} />
      </span>
    </div>
  );
}

function FrequencyDots({ sessionsPerWeek }: { sessionsPerWeek: number }) {
  // Reuses the app's own existing frequency range upper bound
  // (global-principles.yaml) as the dot track's max — never a hardcoded
  // "3 is the ceiling" assumption invented for this visual.
  const max = programming.globalPrinciples.frequency.typical_starting_range_per_week[1];
  return (
    <span className="frequency-dots" role="img" aria-label={`${sessionsPerWeek} times per week`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < sessionsPerWeek ? 'frequency-dot filled' : 'frequency-dot'} />
      ))}
    </span>
  );
}

function VolumeBar({ resolved }: { resolved: ResolvedPackage }) {
  const [rangeLow, rangeHigh] = resolved.weeklyVolumeTargetRange;
  // Axis runs to a real, derived ceiling (never an invented constant): the
  // higher of this package's own value or 1.2x the typical range's top, so
  // every package's bar fits on-scale without clipping or fake precision.
  const axisMax = Math.max(resolved.weeklyDirectSets, Math.round(rangeHigh * 1.2));
  const valuePct = Math.min(100, (resolved.weeklyDirectSets / axisMax) * 100);
  const bandStartPct = (rangeLow / axisMax) * 100;
  const bandWidthPct = ((rangeHigh - rangeLow) / axisMax) * 100;

  return (
    <div className="volume-bar-wrap">
      <div className="volume-bar-value-label">
        {resolved.weeklyDirectSets} sets
        {resolved.isHighVolume && <span className="high-volume-badge">High-volume</span>}
      </div>
      <div className="volume-bar-track">
        <span className="volume-bar-band" style={{ left: `${bandStartPct}%`, width: `${bandWidthPct}%` }} />
        <span className="volume-bar-fill" style={{ width: `${valuePct}%` }} />
      </div>
      <div className="volume-bar-caption">
        Typical range: {rangeLow}–{rangeHigh} sets/week
      </div>
    </div>
  );
}

function LevelSelector({
  muscleGroupId,
  activeLevel,
  efficient,
  complete,
}: {
  muscleGroupId: string;
  activeLevel: PackageLevel;
  efficient: ResolvedPackage;
  complete: ResolvedPackage;
}) {
  const comparison = comparePackageLevels(efficient, complete);

  return (
    <div className="level-selector">
      <Link
        to={`/build/${muscleGroupId}?level=efficient`}
        className={activeLevel === 'efficient' ? 'level-card level-card-active' : 'level-card'}
        aria-current={activeLevel === 'efficient' ? 'true' : undefined}
      >
        <span className="level-card-title">Efficient</span>
        <p className="level-card-summary">Essential coverage — the smallest combination that stays broad.</p>
        <ul className="level-card-list">
          <li>{efficient.exercises.length} exercises</li>
          <li>{efficient.weeklyDirectSets} weekly sets</li>
        </ul>
        <p className="level-card-best-when">Best when time or recovery is limited.</p>
      </Link>

      <Link
        to={`/build/${muscleGroupId}?level=complete`}
        className={activeLevel === 'complete' ? 'level-card level-card-active' : 'level-card'}
        aria-current={activeLevel === 'complete' ? 'true' : undefined}
      >
        <span className="level-card-title">
          Complete
          {complete.isHighVolume && <span className="high-volume-badge">High-volume</span>}
        </span>
        <p className="level-card-summary">Comprehensive coverage — for this muscle as a priority.</p>
        <ul className="level-card-list">
          <li>{complete.exercises.length} exercises</li>
          <li>{complete.weeklyDirectSets} weekly sets</li>
        </ul>
        {(comparison.addedExercises.length > 0 || comparison.addedTargetNames.length > 0) && (
          <>
            <p className="level-card-adds-heading">What Complete adds</p>
            <ul className="level-card-list level-card-adds">
              {comparison.addedTargetNames.map((name) => (
                <li key={name}>Additional {name} coverage</li>
              ))}
              {comparison.addedExercises.map((ex) => (
                <li key={ex.id}>{ex.name}</li>
              ))}
            </ul>
          </>
        )}
        <p className="level-card-best-when">
          Best when this muscle is a priority and you have the recovery capacity.
        </p>
      </Link>
    </div>
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
  const efficientPkg = packages.find((p) => p.level === 'efficient');
  const completePkg = packages.find((p) => p.level === 'complete');
  if (!efficientPkg || !completePkg) return <NotFoundPage />;

  const efficient = resolvePackage(efficientPkg.id);
  const complete = resolvePackage(completePkg.id);
  if (!efficient || !complete) return <NotFoundPage />;

  const resolved = level === 'efficient' ? efficient : complete;
  const coveredCount = resolved.targetCoverage.filter((t) => t.covered).length;
  const coveragePct = Math.round((coveredCount / resolved.targetCoverage.length) * 100);

  return (
    <div className="build-muscle-package">
      <button type="button" className="back-nav" onClick={() => navigate('/build')}>
        ← Build the Muscle
      </button>

      <p className="build-muscle-eyebrow">{muscleGroup.name}</p>
      <h1>All-Round Development</h1>
      <p className="build-muscle-objective">{resolved.pkg.objective}</p>

      <div className="muscle-hero-metrics">
        <div className="muscle-hero-metric">
          <span className="muscle-hero-metric-value">{resolved.weeklyDirectSets}</span>
          <span className="muscle-hero-metric-label">Sets / wk</span>
        </div>
        <div className="muscle-hero-metric">
          <span className="muscle-hero-metric-value">{resolved.pkg.frequency.sessions_per_week}&times;</span>
          <span className="muscle-hero-metric-label">/ week</span>
        </div>
        <div className="muscle-hero-metric">
          <span className="muscle-hero-metric-value">{coveragePct}%</span>
          <span className="muscle-hero-metric-label">Coverage</span>
        </div>
      </div>

      <section className="package-summary-card">
        <h2>Visual coverage</h2>
        <div className="coverage-list">
          {resolved.targetCoverage.map((coverage) => (
            <CoverageRow key={coverage.targetId} targetName={coverage.targetName} covered={coverage.covered} />
          ))}
        </div>
      </section>

      <h2 className="build-muscle-section-heading">Choose a package</h2>
      <LevelSelector muscleGroupId={muscleGroupId} activeLevel={level} efficient={efficient} complete={complete} />

      <section className="package-summary-card package-summary-selected">
        <h2>{resolved.pkg.display_name}</h2>
        <dl className="package-stats">
          <div>
            <dt>Weekly volume</dt>
            <dd>{resolved.weeklyDirectSets} direct sets</dd>
          </div>
          <div>
            <dt>Frequency</dt>
            <dd>
              {resolved.pkg.frequency.sessions_per_week}&times; / week <FrequencyDots sessionsPerWeek={resolved.pkg.frequency.sessions_per_week} />
            </dd>
          </div>
          <div>
            <dt>Exercises</dt>
            <dd>{resolved.exercises.length}</dd>
          </div>
          <div>
            <dt>Session volume</dt>
            <dd>{resolved.sessionDirectSets} sets</dd>
          </div>
        </dl>
        <VolumeBar resolved={resolved} />
      </section>

      <h2 className="build-muscle-section-heading">Exercise sequence</h2>
      <ol className="package-exercise-list">
        {resolved.exercises.map((resolvedExercise) => (
          <li key={resolvedExercise.exercise.id} className="package-exercise-card">
            <div className="package-exercise-header">
              <span className="package-exercise-order">{String(resolvedExercise.entry.order).padStart(2, '0')}</span>
              <div>
                <Link to={`/exercises/${resolvedExercise.exercise.id}`} className="package-exercise-name">
                  {resolvedExercise.exercise.name}
                </Link>
                <p className="package-exercise-role">{ROLE_LABELS[resolvedExercise.entry.role] ?? resolvedExercise.entry.role}</p>
              </div>
            </div>

            <p className="package-exercise-prescription">
              {resolvedExercise.entry.sets} &times; {resolvedExercise.entry.reps}
              <span className="package-exercise-rir"> RIR {resolvedExercise.entry.rir}</span>
            </p>
            <p className="package-exercise-target-line">{targetSummaryLine(resolvedExercise.exercise)}</p>

            <details className="package-exercise-details">
              <summary>Why this exercise?</summary>
              <p>{resolvedExercise.entry.contribution}</p>
            </details>

            <details className="package-exercise-details">
              <summary>Intensity technique</summary>
              <p className="package-exercise-technique-name">
                {resolvedExercise.intensityTechnique ? resolvedExercise.intensityTechnique.name : 'None'}
              </p>
              <p>{resolvedExercise.intensityTechniqueContext}</p>
            </details>

            <details className="package-exercise-details">
              <summary>Progression</summary>
              <p>{buildExerciseProgressionNote(resolvedExercise.entry.reps)}</p>
            </details>

            <DemandBar level={resolvedExercise.exercise.fatigue_cost} label="Fatigue" />
          </li>
        ))}
      </ol>

      <section className="weekly-plan-panel">
        <h2>Weekly plan</h2>
        {resolved.pkg.frequency.sessions_per_week > 1 && (
          <p className="field-hint">
            Every session is the same combination, run {resolved.pkg.frequency.sessions_per_week} times a week.
          </p>
        )}
        <ul className="weekly-plan-list">
          {resolved.exercises.map((resolvedExercise) => (
            <li key={resolvedExercise.exercise.id}>
              <span>{resolvedExercise.exercise.name}</span>
              <span>{resolvedExercise.entry.sets}</span>
            </li>
          ))}
        </ul>
        <p className="weekly-plan-total">
          Total: {resolved.weeklyDirectSets} direct sets/week
        </p>
      </section>

      <section className="package-rationale">
        <h2>Why this package works</h2>
        <p>{resolved.pkg.rationale}</p>
      </section>
    </div>
  );
}
