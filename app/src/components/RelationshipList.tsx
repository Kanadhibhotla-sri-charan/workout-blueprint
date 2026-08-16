import { Link } from 'react-router-dom';
import { getExerciseById } from '../data';
import { parseRelationshipEntry } from '../utils/relationships';

// Renders one relationship field (alternatives / complements / overlaps_with).
// Entries that resolve to a real exercise id become links; everything else
// (prose, by design for `complements` — see SCHEMA.md) renders as plain text.
// Per §23, missing optional metadata hides the section rather than showing
// an empty heading.
export function RelationshipList({
  title,
  description,
  entries,
}: {
  title: string;
  description: string;
  entries: string[] | null;
}) {
  if (!entries || entries.length === 0) return null;

  return (
    <div className="relationship-group">
      <h3>{title}</h3>
      <p className="relationship-description">{description}</p>
      <ul className="relationship-list">
        {entries.map((entry) => {
          const ref = parseRelationshipEntry(entry);
          const resolved = ref ? getExerciseById(ref.id) : undefined;

          if (ref && resolved) {
            return (
              <li key={entry}>
                <Link to={`/exercises/${resolved.id}`}>{resolved.name}</Link>
                {ref.trailingNote ? ` — ${ref.trailingNote}` : null}
              </li>
            );
          }

          return <li key={entry}>{entry}</li>;
        })}
      </ul>
    </div>
  );
}
