// A labeled bullet list that renders nothing when the field is empty or
// null — per §23, missing optional metadata should hide its section
// gracefully rather than show an empty heading.
export function OptionalList({ title, items }: { title: string; items: string[] | null }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="optional-list">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
