// Renders an exercise's video reference according to its video_status.
// `verified` is the only status allowed to render as a clickable "watch
// this" link — anything else (needs-review, broken, or a missing status)
// must never be presented as though it were a working, checked reference
// (Video Reference Remediation spec §7-§9).
export function VideoReference({
  videoLink,
  videoStatus,
}: {
  videoLink?: string | null;
  videoStatus?: 'verified' | 'needs-review' | 'broken' | null;
}) {
  if (videoStatus === 'verified' && videoLink) {
    return (
      <a href={videoLink} target="_blank" rel="noopener noreferrer" className="video-link-simple">
        🎥 Click here for video
      </a>
    );
  }
  if (videoStatus === 'needs-review' || videoStatus === 'broken') {
    return <span className="video-link-pending">🎥 Video reference under review</span>;
  }
  return null;
}
