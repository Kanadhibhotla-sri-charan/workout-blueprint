import { describe, it, expect } from 'vitest';
import { getYouTubeVideoId } from './video';

describe('getYouTubeVideoId', () => {
  it('extracts ID from standard watch URL', () => {
    expect(getYouTubeVideoId('https://www.youtube.com/watch?v=in7PaeYlhrM')).toBe('in7PaeYlhrM');
    expect(getYouTubeVideoId('https://youtube.com/watch?v=8iPEnn-ltC8&t=45s')).toBe('8iPEnn-ltC8');
  });

  it('extracts ID from youtu.be short URL', () => {
    expect(getYouTubeVideoId('https://youtu.be/in7PaeYlhrM')).toBe('in7PaeYlhrM');
    expect(getYouTubeVideoId('https://youtu.be/in7PaeYlhrM?t=10')).toBe('in7PaeYlhrM');
  });

  it('extracts ID from shorts URL', () => {
    expect(getYouTubeVideoId('https://www.youtube.com/shorts/in7PaeYlhrM')).toBe('in7PaeYlhrM');
  });

  it('returns null for invalid or empty inputs', () => {
    expect(getYouTubeVideoId(null)).toBeNull();
    expect(getYouTubeVideoId(undefined)).toBeNull();
    expect(getYouTubeVideoId('')).toBeNull();
    expect(getYouTubeVideoId('https://example.com/video')).toBeNull();
  });
});
