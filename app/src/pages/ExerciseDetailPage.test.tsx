// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ExerciseDetailPage } from './ExerciseDetailPage';

afterEach(cleanup);

function renderWithRoute(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/exercises/:id" element={<ExerciseDetailPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ExerciseDetailPage — Programming & Universal Intensity Techniques', () => {
  it('renders programming baseline and eligible intensity techniques for an isolation exercise', () => {
    renderWithRoute('/exercises/cable-curl');

    expect(screen.getByRole('heading', { level: 1, name: /cable curl/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /execution guide/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /click here for video/i })).toHaveAttribute(
      'href',
      expect.stringContaining('youtube.com')
    );

    // Programming section
    expect(screen.getByRole('heading', { level: 2, name: /programming/i })).toBeInTheDocument();
    expect(screen.getByText(/weekly sets/i)).toBeInTheDocument();

    // Intensity techniques section
    expect(screen.getByRole('heading', { level: 2, name: /intensity techniques/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /drop set/i })).toBeInTheDocument();
    expect(screen.getAllByText(/when it may help:/i).length).toBeGreaterThan(0);
  });

  it('renders clear empty state when an exercise has no applicable intensity technique', () => {
    renderWithRoute('/exercises/conventional-deadlift');

    expect(screen.getByRole('heading', { level: 1, name: /conventional deadlift/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /intensity techniques/i })).toBeInTheDocument();
    expect(
      screen.getByText(/no specific intensity technique is recommended for this variation/i)
    ).toBeInTheDocument();
  });

  it('renders not found view for unknown exercise id', () => {
    renderWithRoute('/exercises/non-existent-exercise');

    expect(screen.getByRole('heading', { level: 1, name: /exercise not found/i })).toBeInTheDocument();
  });
});
