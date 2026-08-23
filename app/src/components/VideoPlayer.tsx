import { useState } from 'react';
import { getYouTubeVideoId } from '../utils/video';

interface VideoPlayerProps {
  videoLink?: string | null;
  videoTitle?: string | null;
  videoCreator?: string | null;
  exerciseName: string;
}

export function VideoPlayer({
  videoLink,
  videoTitle,
  videoCreator,
  exerciseName,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = getYouTubeVideoId(videoLink);

  if (!videoLink || !videoId) {
    return (
      <div className="video-player-fallback">
        <p className="text-muted">No execution video reference available yet.</p>
      </div>
    );
  }

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;

  return (
    <div className="video-player-container">
      <div className="video-player-frame">
        {isPlaying ? (
          <iframe
            src={embedUrl}
            title={videoTitle || `Execution guide for ${exerciseName}`}
            className="video-iframe"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className="video-preview-button"
            onClick={() => setIsPlaying(true)}
            aria-label={`Watch technique video for ${exerciseName}`}
          >
            <img
              src={thumbnailUrl}
              alt=""
              className="video-thumbnail"
              loading="lazy"
            />
            <div className="video-overlay">
              <div className="video-play-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span className="video-prompt">Watch technique</span>
            </div>
          </button>
        )}
      </div>

      <div className="video-meta-row">
        <div className="video-info">
          {videoCreator && (
            <span className="video-creator">
              <strong>Source:</strong> {videoCreator}
            </span>
          )}
          {videoTitle && <span className="video-title-label">{videoTitle}</span>}
        </div>
        <a
          href={videoLink}
          target="_blank"
          rel="noopener noreferrer"
          className="video-external-link"
          aria-label={`Open execution tutorial for ${exerciseName} on YouTube`}
        >
          Watch on YouTube <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  );
}
