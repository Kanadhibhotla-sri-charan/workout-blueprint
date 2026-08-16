export function SearchBox({
  value,
  onChange,
  placeholder = 'Search exercises…',
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="search"
      className="search-box"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      aria-label="Search exercises"
    />
  );
}
