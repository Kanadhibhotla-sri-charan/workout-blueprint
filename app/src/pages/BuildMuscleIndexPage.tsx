import { Link } from 'react-router-dom';
import { getMuscleGroups, getPackagesForMuscleGroup, resolvePackage } from '../engine/packageEngine';

// Final spec §12: "Build the Muscle" landing page — a dedicated path
// distinct from the diagnostic Decision Maker. Shows every supported
// muscle group with a real, data-driven preview of its Efficient package
// so the picker itself already answers "roughly how much would this be."
export function BuildMuscleIndexPage() {
  const groups = getMuscleGroups();

  return (
    <div className="build-muscle-index">
      <h1>Build the Muscle</h1>
      <p className="build-muscle-intro">Complete visual development plans.</p>

      <h2 className="build-muscle-section-heading">Choose a muscle group</h2>
      <div className="muscle-group-grid">
        {groups.map((group) => {
          const efficient = getPackagesForMuscleGroup(group.id).find((p) => p.level === 'efficient');
          const resolved = efficient ? resolvePackage(efficient.id) : null;
          return (
            <Link key={group.id} to={`/build/${group.id}`} className="muscle-group-card">
              <span className="muscle-group-card-name">{group.name}</span>
              <span className="muscle-group-card-subtitle">All-round development</span>
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
