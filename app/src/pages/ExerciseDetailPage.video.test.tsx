// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ExerciseDetailPage } from './ExerciseDetailPage';

// The live dataset has no needs-review videos today, so serve one exercise
// from the real data with its video downgraded to needs-review — everything
// else about the page (programming, intensity techniques) stays real.
vi.mock('../data', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../data')>();
  return {
    ...actual,
    getExerciseById: (id: string) => {
      const exercise = actual.getExerciseById(id);
      if (id !== 'cable-crunch' || !exercise) return exercise;
      return { ...exercise, video_status: 'needs-review', video_link: null, video_verified_on: null, video_verification_method: null };
    },
  };
});

afterEach(cleanup);

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/exercises/:id" element={<ExerciseDetailPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ExerciseDetailPage — non-verified video', () => {
  it('keeps the Execution Guide section but shows "under review" instead of a link', () => {
    renderAt('/exercises/cable-crunch');
    expect(screen.getByRole('heading', { level: 2, name: /execution guide/i })).toBeInTheDocument();
    expect(screen.getByText(/video reference under review/i)).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /click here for video/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /youtube/i })).not.toBeInTheDocument();
  });

  it('still renders the rest of the page normally', () => {
    renderAt('/exercises/cable-crunch');
    expect(screen.getByRole('heading', { level: 1, name: /cable crunch/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /programming/i })).toBeInTheDocument();
  });

  it('leaves other, verified exercises linking normally', () => {
    renderAt('/exercises/cable-curl');
    expect(screen.getByRole('link', { name: /click here for video/i })).toHaveAttribute('href', expect.stringContaining('youtube.com'));
  });
});
