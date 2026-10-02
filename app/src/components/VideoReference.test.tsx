// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { VideoReference } from './VideoReference';
import { ExerciseCard } from './ExerciseCard';
import { exercises } from '../data';
import type { Exercise } from '../types/exercise';

afterEach(cleanup);

const URL = 'https://www.youtube.com/watch?v=aBd6T01PBqw';

// The live dataset currently has no needs-review/broken videos, so these
// states are tested synthetically — the same approach OptionalList.test.tsx
// takes for field combinations the data doesn't happen to contain.
describe('VideoReference', () => {
  it('renders a clickable external link for a verified reference', () => {
    render(<VideoReference videoLink={URL} videoStatus="verified" />);
    const link = screen.getByRole('link', { name: /click here for video/i });
    expect(link).toHaveAttribute('href', URL);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });

  it.each(['needs-review', 'broken'] as const)('shows "under review" and no link for %s', (status) => {
    render(<VideoReference videoLink={null} videoStatus={status} />);
    expect(screen.getByText(/video reference under review/i)).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('never links a non-verified reference even if a stale URL is still present', () => {
    // The validator forbids this combination, but the UI must not rely on
    // that alone to avoid presenting an unconfirmed URL as working.
    render(<VideoReference videoLink={URL} videoStatus="needs-review" />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText(/video reference under review/i)).toBeInTheDocument();
  });

  it('renders nothing for a verified status with no URL', () => {
    const { container } = render(<VideoReference videoLink={null} videoStatus="verified" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when there is no status at all', () => {
    const { container } = render(<VideoReference videoLink={URL} videoStatus={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe('ExerciseCard video state', () => {
  const base = exercises.find((e) => e.id === 'cable-crunch') as Exercise;

  function renderCard(exercise: Exercise) {
    return render(
      <MemoryRouter>
        <ExerciseCard exercise={exercise} />
      </MemoryRouter>
    );
  }

  it('links the video for a verified exercise', () => {
    renderCard(base);
    expect(screen.getByRole('link', { name: /click here for video/i })).toHaveAttribute('href', base.video_link!);
  });

  it('shows "under review" instead of a video link for a needs-review exercise, and the card still opens the exercise', () => {
    renderCard({ ...base, video_status: 'needs-review', video_link: null, video_verified_on: null, video_verification_method: null });
    expect(screen.getByText(/video reference under review/i)).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /click here for video/i })).not.toBeInTheDocument();
    // The only remaining link is the card's own link to the detail page.
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute('href', '/exercises/cable-crunch');
  });
});
