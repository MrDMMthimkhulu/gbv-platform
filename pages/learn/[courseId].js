import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/Layout';
import LessonAudio from '../../components/LessonAudio';
import CourseVideoIntro from '../../components/CourseVideoIntro';
import { supabase } from '../../lib/supabaseClient';
import { COURSES, UNDER18_COURSES } from '../../lib/courseData';

export default function CoursePage() {
  const router = useRouter();
  const { courseId } = router.query;
  const [user, setUser] = useState(null);
  const [completed, setCompleted] = useState(new Set());
  const [activeLesson, setActiveLesson] = useState(null);
  const [saving, setSaving] = useState(false);
  const [goalsOpen, setGoalsOpen] = useState(true);

  const course = COURSES.find((c) => c.id === courseId) || UNDER18_COURSES.find((c) => c.id === courseId);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      if (data.user && courseId) loadProgress(data.user.id, courseId);
    });
  }, [courseId]);

  useEffect(() => {
    if (course && !activeLesson) setActiveLesson(course.lessons[0].id);
  }, [course]);

  const loadProgress = async (userId, cId) => {
    const { data } = await supabase
      .from('course_progress')
      .select('lesson_id')
      .eq('user_id', userId)
      .eq('course_id', cId);
    setCompleted(new Set((data || []).map((r) => r.lesson_id)));
  };

  const markComplete = async (lessonId) => {
    if (!user) {
      router.push('/login');
      return;
    }
    setSaving(true);
    await supabase.from('course_progress').upsert({
      user_id: user.id,
      course_id: courseId,
      lesson_id: lessonId,
    });
    setCompleted((prev) => new Set(prev).add(lessonId));
    setSaving(false);
  };

  if (!course) {
    return (
      <Layout>
        <section className="page-header">
          <h1>Course not found</h1>
          <Link href="/learn">Back to Learning Hub</Link>
        </section>
      </Layout>
    );
  }

  const lessonIndex = course.lessons.findIndex((l) => l.id === activeLesson);
  const lesson = course.lessons[lessonIndex] || course.lessons[0];
  const isDone = completed.has(lesson.id);
  const doneCount = completed.size;
  const isLastLesson = lessonIndex === course.lessons.length - 1;
  const nextLesson = !isLastLesson ? course.lessons[lessonIndex + 1] : null;

  const goToNext = () => {
    if (nextLesson) setActiveLesson(nextLesson.id);
  };

  return (
    <Layout>
      <Head>
        <title>{course.title} | SafeHaven</title>
        <meta name="description" content={course.tagline} />
      </Head>

      <section className="page-header">
        <p className="eyebrow">
          <Link href="/learn">Learning hub</Link> / {course.title}
        </p>
        <h1>{course.title}</h1>
        <p className="sub">{course.tagline}</p>
        {!user && (
          <p className="login-note">
            <Link href="/login">Log in</Link> to save your progress.
          </p>
        )}
      </section>

      <section className="video-section">
        <div className="video-container">
          <CourseVideoIntro courseId={courseId} showEmbed={false} />
        </div>
      </section>

      <section className="course-layout">
        <aside className="sidebar">
          <div className="goals-card">
            <button
              className="goals-header"
              onClick={() => setGoalsOpen((o) => !o)}
            >
              <span>Your progress</span>
              <span className={`chevron ${goalsOpen ? 'open' : ''}`}>▾</span>
            </button>
            {goalsOpen && (
              <div className="goals-body">
                <p className="goals-line">
                  {doneCount} of {course.lessons.length} lessons complete
                </p>
                <div className="goals-bar">
                  <div
                    className="goals-bar-fill"
                    style={{
                      width: `${(doneCount / course.lessons.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="lesson-list">
            {course.lessons.map((l, i) => (
              <button
                key={l.id}
                className={`lesson-item ${activeLesson === l.id ? 'active' : ''}`}
                onClick={() => setActiveLesson(l.id)}
              >
                <span className="lesson-num">
                  {completed.has(l.id) ? '✓' : i + 1}
                </span>
                <span>{l.title}</span>
              </button>
            ))}
          </div>
        </aside>

        <div className="lesson-body">
          <LessonAudio
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/lesson-audio/${course.id}/${lesson.id}.mp3`}
            key={lesson.id}
          />

          <h2>{lesson.title}</h2>
          {lesson.content.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}

          <div className="lesson-actions">
            <button
              className={`complete-btn ${isDone ? 'done' : ''}`}
              onClick={() => markComplete(lesson.id)}
              disabled={isDone || saving}
            >
              {isDone ? 'Completed' : 'Mark as complete'}
            </button>

            {nextLesson && (
              <button
                className="next-btn"
                onClick={goToNext}
                disabled={!isDone}
              >
                Go to next item →
              </button>
            )}

            {isLastLesson && isDone && (
              <Link href="/learn" className="finish-link">
                Back to Learning Hub
              </Link>
            )}
          </div>
        </div>
      </section>

      <style jsx>{`
        .page-header {
          max-width: 700px;
          margin: 0 auto;
          text-align: center;
          padding: 60px 24px 30px;
        }
        .eyebrow {
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          color: var(--rose);
          margin-bottom: 16px;
        }
        .eyebrow :global(a) {
          color: var(--rose);
        }
        .page-header h1 {
          font-size: clamp(1.7rem, 3.6vw, 2.3rem);
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 12px;
        }
        .sub {
          font-size: 0.95rem;
          color: var(--muted);
        }
        .login-note {
          font-size: 0.85rem;
          color: var(--muted);
          margin-top: 14px;
        }
        .login-note :global(a) {
          color: var(--rose-deep);
          font-weight: 700;
        }

        .video-section {
          max-width: 700px;
          margin: 0 auto;
          padding: 0 24px 30px;
        }
        .video-container {
          background: white;
          border-radius: 12px;
          padding: 20px;
        }

        .course-layout {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px 24px 100px;
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 40px;
        }

        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .goals-card {
          border: 1px solid var(--sand);
          border-radius: 12px;
          overflow: hidden;
        }
        .goals-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--blush);
          border: none;
          padding: 10px 14px;
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--ink);
          cursor: pointer;
        }
        .chevron {
          transition: transform 0.15s ease;
        }
        .chevron.open {
          transform: rotate(180deg);
        }
        .goals-body {
          padding: 12px 14px;
        }
        .goals-line {
          font-size: 0.78rem;
          color: var(--muted);
          margin-bottom: 8px;
        }
        .goals-bar {
          height: 6px;
          background: var(--sand);
          border-radius: 4px;
          overflow: hidden;
        }
        .goals-bar-fill {
          height: 100%;
          background: var(--rose);
          border-radius: 4px;
          transition: width 0.2s ease;
        }

        .lesson-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .lesson-item {
          display: flex;
          align-items: center;
          gap: 10px;
          background: none;
          border: none;
          text-align: left;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--muted);
          cursor: pointer;
        }
        .lesson-item.active {
          background: var(--blush);
          color: var(--ink);
        }
        .lesson-num {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--sand);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.72rem;
          font-weight: 700;
          flex-shrink: 0;
        }
        .lesson-item.active .lesson-num {
          background: var(--rose);
          color: white;
        }

        .lesson-body h2 {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 18px;
        }
        .lesson-body p {
          font-size: 0.95rem;
          line-height: 1.7;
          color: var(--ink);
          margin-bottom: 16px;
        }

        .lesson-actions {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 10px;
          flex-wrap: wrap;
        }
        .complete-btn {
          background: var(--rose);
          color: white;
          border: none;
          padding: 12px 26px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.88rem;
          cursor: pointer;
        }
        .complete-btn.done {
          background: var(--teal);
          cursor: default;
        }
        .complete-btn:disabled {
          opacity: 0.7;
        }
        .next-btn {
          background: var(--ink);
          color: white;
          border: none;
          padding: 12px 22px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.88rem;
          cursor: pointer;
        }
        .next-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        .finish-link {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--rose-deep);
        }

        @media (max-width: 700px) {
          .course-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </Layout>
  );
}

export async function getStaticPaths() {
  return {
    paths: [...COURSES, ...UNDER18_COURSES].map((c) => ({ params: { courseId: c.id } })),
    fallback: false,
  };
}

export async function getStaticProps({ locale, params }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
