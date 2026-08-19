import { Link } from 'react-router-dom';
import { getMuscleGroups, getPackagesForMuscleGroup, resolvePackage } from '../engine/packageEngine';

// Phase 5 §11-13: "Build the Muscle" entry point — a dedicated path
// distinct from the diagnostic Decision Maker. Shows every supported
// muscle group with a one-line preview of its Efficient package so the
// picker itself already answers "roughly how much would this be."
export function BuildMuscleIndexPage() {
  const groups = getMuscleGroups();

  return (
    <div className="build-muscle-index">
      <p className="build-muscle-eyebrow">All-Round Development</p>
      <h1>Build the Muscle</h1>
      <p className="build-muscle-intro">
        Pick a muscle group for a complete, coverage-driven exercise combination — sets, reps, frequency,
        and why each exercise earns its place — rather than a single fix for one visual problem.
      </p>

      <div className="muscle-group-grid">
        {groups.map((group) => {
          const efficient = getPackagesForMuscleGroup(group.id).find((p) => p.level === 'efficient');
          const resolved = efficient ? resolvePackage(efficient.id) : null;
          return (
            <Link key={group.id} to={`/build/${group.id}`} className="muscle-group-card">
              <span className="muscle-group-card-name">{group.name}</span>
              {resolved && (
                <span className="muscle-group-card-meta">
                  {resolved.exercises.length} exercises &middot; {resolved.weeklyDirectSets} sets/week
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
