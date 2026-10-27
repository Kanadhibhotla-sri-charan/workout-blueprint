// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { CommandPalette } from './CommandPalette';
import { buildPaletteItems, searchPalette } from '../utils/commandPalette';
import { sampleMinutes } from '../utils/readout';
import { getExerciseById } from '../data';

afterEach(cleanup);

describe('command palette search', () => {
  const items = buildPaletteItems();

  it('finds an exercise by name, ranking a name match first', () => {
    expect(searchPalette(items, 'hammer curl')[0].to).toBe('/exercises/hammer-curl');
  });

  it('finds a look-to-fix from how people describe it, and links to Decide', () => {
    const hit = searchPalette(items, 'upper chest').find((i) => i.kind === 'Fix a look')!;
    expect(hit.to).toBe('/decide?outcome=chest-upper-shelf&goal=build-base');
  });

  it('shows pages, looks and muscle groups (not every exercise) for an empty query', () => {
    const kinds = new Set(searchPalette(items, '').map((i) => i.kind));
    expect(kinds.has('Page')).toBe(true);
    expect(kinds.has('Exercise')).toBe(false);
  });

  it('returns nothing for gibberish', () => {
    expect(searchPalette(items, 'zzqxj')).toEqual([]);
  });
});

function Where() {
  return <p data-testid="where">{useLocation().pathname}</p>;
}

describe('CommandPalette', () => {
  it('opens on the search box, moves with the arrow keys and opens with Enter', () => {
    let closed = false;
    render(
      <MemoryRouter initialEntries={['/']}>
        <CommandPalette onClose={() => (closed = true)} />
        <Routes>
          <Route path="*" element={<Where />} />
        </Routes>
      </MemoryRouter>
    );
    const input = screen.getByRole('combobox');
    expect(input).toHaveFocus();
    fireEvent.change(input, { target: { value: 'hammer curl' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByTestId('where')).toHaveTextContent('/exercises/hammer-curl');
    expect(closed).toBe(true);
  });

  it('closes on Escape', () => {
    let closed = false;
    render(
      <MemoryRouter>
        <CommandPalette onClose={() => (closed = true)} />
      </MemoryRouter>
    );
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Escape' });
    expect(closed).toBe(true);
  });
});

describe('exercise readout time estimate', () => {
  it('counts both sides for unilateral exercises', () => {
    const one = sampleMinutes({ setup_minutes: 1, seconds_per_set: 40, rest_seconds: [60, 90], per_side: false, superset_friendly: true });
    const two = sampleMinutes({ setup_minutes: 1, seconds_per_set: 40, rest_seconds: [60, 90], per_side: true, superset_friendly: true });
    expect(one).toEqual([5, 6]);
    expect(two[0]).toBeGreaterThan(one[0]);
  });

  it('every exercise gets a readout time', () => {
    expect(sampleMinutes(getExerciseById('back-squat')!.time!)[1]).toBeGreaterThan(0);
  });
});
