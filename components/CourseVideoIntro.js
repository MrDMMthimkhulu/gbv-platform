// components/CourseVideoIntro.js
// Reusable component to display YouTube intro video for any course

import { getCourseVideo, getYoutubeEmbedUrl, getYoutubeWatchUrl } from '../lib/courseVideos';

export default function CourseVideoIntro({ courseId, showEmbed = false }) {
  const video = getCourseVideo(courseId);

  if (!video) {
    return null; // Course doesn't have a video
  }

  return (
    <div className="course-video-intro">
      <div className="video-header">
        <h3>📺 Get a Quick Intro</h3>
        <p className="video-tagline">Short video to set the stage before you dive in</p>
      </div>

      {showEmbed ? (
        // Embedded video player (for full-width display)
        <div className="video-embed-container">
          <iframe
            width="100%"
            height="400"
            src={getYoutubeEmbedUrl(video.youtubeId)}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        // Watch button (for course overview/start screen)
        <div className="video-watch-container">
          <a
            href={getYoutubeWatchUrl(video.youtubeId)}
            target="_blank"
            rel="noreferrer"
            className="video-watch-btn"
          >
            <span className="play-icon">▶</span>
            <span className="video-text">
              <span className="video-title">{video.title}</span>
              <span className="video-meta">
                {video.channel} · {video.duration}
              </span>
            </span>
          </a>
          <p className="video-description">{video.description}</p>
        </div>
      )}

      <style jsx>{`
        .course-video-intro {
          margin-bottom: 30px;
          padding: 20px;
          background: var(--warm);
          border-radius: 12px;
          border-left: 4px solid var(--rose);
        }

        .video-header {
          margin-bottom: 20px;
        }

        .video-header h3 {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 4px;
        }

        .video-tagline {
          font-size: 0.85rem;
          color: var(--muted);
        }

        /* Watch Button Style */
        .video-watch-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .video-watch-btn {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          background: white;
          border-radius: 10px;
          text-decoration: none;
          border: 2px solid var(--rose);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .video-watch-btn:hover {
          background: var(--rose);
          transform: translateY(-2px);
        }

        .video-watch-btn:hover .play-icon,
        .video-watch-btn:hover .video-text {
          color: white;
        }

        .play-icon {
          font-size: 1.4rem;
          color: var(--rose);
          font-weight: 800;
          flex-shrink: 0;
        }

        .video-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .video-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--ink);
        }

        .video-meta {
          font-size: 0.8rem;
          color: var(--muted);
        }

        .video-description {
          font-size: 0.82rem;
          color: var(--muted);
          line-height: 1.5;
          margin: 0;
        }

        /* Embedded Video Style */
        .video-embed-container {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%; /* 16:9 aspect ratio */
          height: 0;
          overflow: hidden;
          border-radius: 10px;
          margin-bottom: 15px;
        }

        .video-embed-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 10px;
        }

        /* Mobile Responsive */
        @media (max-width: 600px) {
          .course-video-intro {
            padding: 16px;
          }

          .video-header h3 {
            font-size: 1rem;
          }

          .video-watch-btn {
            padding: 12px 14px;
          }

          .play-icon {
            font-size: 1.2rem;
          }

          .video-title {
            font-size: 0.9rem;
          }

          .video-embed-container {
            padding-bottom: 56.25%;
          }
        }
      `}</style>
    </div>
  );
}
