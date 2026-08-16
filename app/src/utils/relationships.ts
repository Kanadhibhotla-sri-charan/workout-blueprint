// Parses a relationship-field entry (overlaps_with / complements /
// alternatives) into a resolvable exercise reference, if it is one.
//
// Mirrors the two id-reference shapes scripts/lib/validate.js checks
// against the live data (see SCHEMA.md's relationship-field convention):
//   - a bare id, when the referenced exercise is in the same file
//   - "id (module name) — optional trailing note", for a cross-file reference
// Anything else (most `complements` entries) is prose by design and is
// left unresolved — the caller renders it as plain text instead of a link.

export interface RelationshipRef {
  id: string;
  moduleNote?: string;
  trailingNote?: string;
}

const BARE_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const QUOTED_MODULE_REF = /^([a-z0-9]+(?:-[a-z0-9]+)*)\s+\(([^)]*)\)(?:\s+—\s+(.*))?$/;

export function parseRelationshipEntry(entry: string): RelationshipRef | null {
  const trimmed = entry.trim();
  if (BARE_ID.test(trimmed)) {
    return { id: trimmed };
  }
  const match = trimmed.match(QUOTED_MODULE_REF);
  if (match) {
    return { id: match[1], moduleNote: match[2], trailingNote: match[3] };
  }
  return null;
}
