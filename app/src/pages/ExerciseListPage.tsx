import { useSearchParams } from 'react-router-dom';
import {
  bodyRegions,
  coverageCategoryOptions,
  equipmentOptions,
  exerciseTypeOptions,
  exercises,
  lateralityOptions,
} from '../data';
import { ExerciseCard } from '../components/ExerciseCard';
import { SearchBox } from '../components/SearchBox';
import { FilterBar } from '../components/FilterBar';
import { searchExercises } from '../utils/search';
import { applyFilters, EMPTY_FILTERS, type Filters } from '../utils/filters';
import { humanize } from '../utils/format';

const PARAM_KEYS: Record<keyof Filters, string> = {
  region: 'region',
  equipment: 'equipment',
  exerciseType: 'type',
  laterality: 'laterality',
  setupTime: 'setup',
  fatigueCost: 'fatigue',
  coverageCategory: 'coverage',
};

function readFilters(searchParams: URLSearchParams): Filters {
  const filters = { ...EMPTY_FILTERS };
  for (const key of Object.keys(PARAM_KEYS) as (keyof Filters)[]) {
    filters[key] = searchParams.get(PARAM_KEYS[key]);
  }
  return filters;
}

export function ExerciseListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const filters = readFilters(searchParams);
  const regionIsValid = filters.region === null || bodyRegions.includes(filters.region);

  // 123 records — filtering on every render is cheap enough that memoizing
  // would add complexity without a measurable benefit.
  const filtered = applyFilters(exercises, {
    ...filters,
    region: regionIsValid ? filters.region : null,
  });
  const results = searchExercises(filtered, query);

  function updateParams(patch: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(patch)) {
      if (value === null || value === '') {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    }
    setSearchParams(next, { replace: true });
  }

  function handleFilterChange(patch: Partial<Filters>) {
    const paramPatch: Record<string, string | null> = {};
    for (const [key, value] of Object.entries(patch) as [keyof Filters, string | null][]) {
      paramPatch[PARAM_KEYS[key]] = value;
    }
    updateParams(paramPatch);
  }

  function handleClearFilters() {
    const next = new URLSearchParams(searchParams);
    for (const paramKey of Object.values(PARAM_KEYS)) next.delete(paramKey);
    setSearchParams(next, { replace: true });
  }

  const heading =
    filters.region && regionIsValid && !query ? humanize(filters.region) : 'All Exercises';

  return (
    <div className="exercise-list-page">
      <div className="exercise-list-header">
        <div>
          <h1>{heading}</h1>
          <p className="result-count">
            {results.length} exercise{results.length === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      <SearchBox value={query} onChange={(value) => updateParams({ q: value })} />

      <FilterBar
        filters={filters}
        options={{
          regions: bodyRegions,
          equipment: equipmentOptions,
          exerciseTypes: exerciseTypeOptions,
          laterality: lateralityOptions,
          coverageCategories: coverageCategoryOptions,
        }}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      {filters.region !== null && !regionIsValid && (
        <p className="empty-state">
          "{filters.region}" isn't a recognized body region. Showing other results instead.
        </p>
      )}

      {results.length === 0 ? (
        <p className="empty-state">No exercises match this combination yet. Try clearing a filter.</p>
      ) : (
        <div className="exercise-grid">
          {results.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      )}
    </div>
  );
}
