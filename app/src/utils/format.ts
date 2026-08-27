// Small presentation helpers. These only reformat existing field values for
// display (hyphens to spaces, capitalization, truncation) — they never
// invent or alter the underlying knowledge content.

export function humanize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).replaceAll('-', ' ');
}

export function truncate(text: string, maxLength: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength).trimEnd()}…`;
}

export function formatRange(range: [number, number]): string {
  return range[0] === range[1] ? String(range[0]) : `${range[0]}–${range[1]}`;
}
