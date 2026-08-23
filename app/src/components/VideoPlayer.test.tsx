// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { afterEach, describe, it, expect } from 'vitest';
import { VideoPlayer } from './VideoPlayer';

afterEach(cleanup);

describe('VideoPlayer', () => {
  const defaultProps = {
    videoLink: 'https://www.youtube.com/watch?v=in7PaeYlhrM',
    videoTitle: 'Barbell Curl Technique Guide',
    videoCreator: 'Renaissance Periodization',
    exerciseName: 'Barbell Curl',
  };

  it('renders preview button initially without loading an iframe', () => {
    render(<VideoPlayer {...defaultProps} />);
    const button = screen.getByRole('button', {
      name: /watch technique video for barbell curl/i,
    });
    expect(button).toBeInTheDocument();
    expect(screen.getByText('Renaissance Periodization', { exact: false })).toBeInTheDocument();
    expect(screen.queryByTitle(/execution guide for barbell curl/i)).not.toBeInTheDocument();
  });

  it('loads YouTube iframe on user interaction', () => {
    render(<VideoPlayer {...defaultProps} />);
    const button = screen.getByRole('button', {
      name: /watch technique video for barbell curl/i,
    });
    fireEvent.click(button);

    const iframe = screen.getByTitle(/barbell curl technique guide/i);
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', expect.stringContaining('in7PaeYlhrM'));
  });

  it('renders fallback gracefully when video link is missing or invalid', () => {
    render(
      <VideoPlayer
        videoLink={null}
        videoTitle={null}
        videoCreator={null}
        exerciseName="Missing Exercise"
      />
    );
    expect(
      screen.getByText(/no execution video reference available yet/i)
    ).toBeInTheDocument();
  });
});
