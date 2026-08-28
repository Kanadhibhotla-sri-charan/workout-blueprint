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

  // QA Gate §12: multiple-technique regression — cable-curl has 3 eligible techniques,
  // the UI must render ALL of them, not just the first.
  it('renders ALL eligible intensity techniques when multiple apply (not just the first)', () => {
    renderWithRoute('/exercises/cable-curl');

    expect(screen.getByRole('heading', { level: 2, name: /intensity techniques/i })).toBeInTheDocument();
    // All three canonical techniques must appear as h3 headings
    expect(screen.getByRole('heading', { level: 3, name: /drop set/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /rest-pause/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /myo-reps/i })).toBeInTheDocument();
    // Each technique card must render its full detail group
    expect(screen.getAllByText(/when it may help:/i)).toHaveLength(3);
    expect(screen.getAllByText(/when not to use:/i)).toHaveLength(3);
    expect(screen.getAllByText(/fatigue & time implications:/i)).toHaveLength(3);
  });

  // QA Gate §14: single-technique regression — smith-machine-romanian-deadlift has exactly 1
  it('renders exactly one technique when only one is eligible', () => {
    renderWithRoute('/exercises/smith-machine-romanian-deadlift');

    expect(screen.getByRole('heading', { level: 2, name: /intensity techniques/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /rest-pause/i })).toBeInTheDocument();
    // Only one technique card should render
    expect(screen.getAllByText(/when it may help:/i)).toHaveLength(1);
    // No drop-set or myo-reps headings
    expect(screen.queryByRole('heading', { level: 3, name: /drop set/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 3, name: /myo-reps/i })).not.toBeInTheDocument();
  });

  // QA Gate §13: zero-technique regression — conventional-deadlift has 0 eligible techniques
  it('renders clear empty state when an exercise has no applicable intensity technique', () => {
    renderWithRoute('/exercises/conventional-deadlift');

    expect(screen.getByRole('heading', { level: 1, name: /conventional deadlift/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /intensity techniques/i })).toBeInTheDocument();
    expect(
      screen.getByText(/no specific intensity technique is recommended for this variation/i)
    ).toBeInTheDocument();
    // No technique card headings should appear
    expect(screen.queryByRole('heading', { level: 3, name: /drop set/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 3, name: /rest-pause/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 3, name: /myo-reps/i })).not.toBeInTheDocument();
  });

  // QA Gate §20: video regression — video link is external, not embedded
  it('video link navigates externally with no embedded player infrastructure', () => {
    renderWithRoute('/exercises/cable-curl');

    const videoLink = screen.getByRole('link', { name: /click here for video/i });
    expect(videoLink).toHaveAttribute('href', expect.stringContaining('youtube.com'));
    expect(videoLink).toHaveAttribute('target', '_blank');
    expect(videoLink).toHaveAttribute('rel', 'noopener noreferrer');
    // No iframe, no embedded player
    const container = document.querySelector('.exercise-detail')!;
    expect(container.querySelector('iframe')).toBeNull();
  });

  it('renders not found view for unknown exercise id', () => {
    renderWithRoute('/exercises/non-existent-exercise');

    expect(screen.getByRole('heading', { level: 1, name: /exercise not found/i })).toBeInTheDocument();
  });
});
