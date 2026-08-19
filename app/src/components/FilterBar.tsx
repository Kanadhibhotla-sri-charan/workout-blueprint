import { DEMAND_LEVELS, type Filters } from '../utils/filters';
import { humanize } from '../utils/format';

interface FilterOptions {
  regions: string[];
  equipment: string[];
  exerciseTypes: string[];
  laterality: string[];
  coverageCategories: string[];
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string | null;
  options: string[];
  onChange: (value: string | null) => void;
}) {
  const id = `filter-${label.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <div className="filter-field">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value === '' ? null : event.target.value)}
      >
        <option value="">Any</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {humanize(option)}
          </option>
        ))}
      </select>
    </div>
  );
}

// Composable filters per PHASE-3-MVP.md §12. Each select applies
// immediately on change (no submit step) and every active filter is
// AND-combined by utils/filters.ts's applyFilters — "Chest + Cable +
// Isolation + Low fatigue" narrows the same way the spec's example does.
// Region itself is filtered via the pill row above this panel
// (ExerciseListPage) — omitted here to avoid a second, redundant control
// for the same field.
export function FilterBar({
  filters,
  options,
  onChange,
  onClear,
}: {
  filters: Filters;
  options: FilterOptions;
  onChange: (patch: Partial<Filters>) => void;
  onClear: () => void;
}) {
  const activeCount = Object.values(filters).filter((v) => v !== null).length;

  return (
    <div className="filter-bar">
      <FilterSelect
        label="Equipment"
        value={filters.equipment}
        options={options.equipment}
        onChange={(value) => onChange({ equipment: value })}
      />
      <FilterSelect
        label="Exercise type"
        value={filters.exerciseType}
        options={options.exerciseTypes}
        onChange={(value) => onChange({ exerciseType: value })}
      />
      <FilterSelect
        label="Laterality"
        value={filters.laterality}
        options={options.laterality}
        onChange={(value) => onChange({ laterality: value })}
      />
      <FilterSelect
        label="Setup time"
        value={filters.setupTime}
        options={[...DEMAND_LEVELS]}
        onChange={(value) => onChange({ setupTime: value })}
      />
      <FilterSelect
        label="Fatigue cost"
        value={filters.fatigueCost}
        options={[...DEMAND_LEVELS]}
        onChange={(value) => onChange({ fatigueCost: value })}
      />
      <FilterSelect
        label="Coverage role"
        value={filters.coverageCategory}
        options={options.coverageCategories}
        onChange={(value) => onChange({ coverageCategory: value })}
      />
      {activeCount > 0 && (
        <button type="button" className="button button-secondary filter-clear" onClick={onClear}>
          Clear filters ({activeCount})
        </button>
      )}
    </div>
  );
}
