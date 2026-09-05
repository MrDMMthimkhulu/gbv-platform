import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../../../components/Layout';
import QuizBlock from '../../../../components/QuizBlock';
import CourseVideoIntro from '../../../../components/CourseVideoIntro';
import { supabase } from '../../../../lib/supabaseClient';
import { ADVANCED_COURSES } from '../../../../lib/allyCourseData';

// Flatten the course into an ordered list of steps: lesson, lesson, quiz,
// lesson, lesson, quiz, ..., final assessment. Makes "next step" simple.
function buildSteps(course) {
  const steps = [];
  course.modules.forEach((m) => {
    m.lessons.forEach((l) => steps.push({ type: 'lesson', moduleId: m.id, moduleTitle: m.title, ...l }));
    steps.push({ type: 'quiz', moduleId: m.id, moduleTitle: m.title, ...m.quiz });
  });
  steps.push({ type: 'final', ...course.finalAssessment, title: 'Final Assessment' });
  return steps;
}

export default function CoursePlayerPage() {
  const router = useRouter();
  const { courseId } = router.query;
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [completed, setCompleted] = useState(new Set());
  const [quizResults, setQuizResults] = useState({});
  const [stepIndex, setStepIndex] = useState(0);
  const [certAwarded, setCertAwarded] = useState(false);

  const course = ADVANCED_COURSES.find((c) => c.id === courseId);
  const steps = course ? buildSteps(course) : [];
  const step = steps[stepIndex];

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAccessToken(data.session?.access_token ?? null);
    });
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login');
        return;
      }
      setUser(data.user);
      loadProgress(data.user.id);
    });
  }, [courseId]);

  const loadProgress = async (userId) => {
    const { data: progressRows } = await supabase
      .from('course_progress')
      .select('lesson_id')
      .eq('user_id', userId)
      .eq('course_id', courseId);
    setCompleted(new Set((progressRows || []).map((r) => r.lesson_id)));

    const { data: quizRows } = await supabase
      .from('quiz_scores')
      .select('quiz_id, score, total, passed')
      .eq('user_id', userId)
      .eq('course_id', courseId);
    const byQuiz = {};
    (quizRows || []).forEach((r) => {
      byQuiz[r.quiz_id] = r;
    });
    setQuizResults(byQuiz);
  };

  const markLessonComplete = async (lessonId) => {
    await supabase.from('course_progress').upsert({
      user_id: user.id,
      course_id: courseId,
      lesson_id: lessonId,
    });
    setCompleted((prev) => new Set(prev).add(lessonId));
  };

  const recordQuiz = async (quizId, result) => {
    await supabase.from('quiz_scores').upsert({
      user_id: user.id,
      course_id: courseId,
      quiz_id: quizId,
      score: result.score,
      total: result.total,
      passed: result.passed,
    });
    setQuizResults((prev) => ({ ...prev, [quizId]: { ...result, quiz_id: quizId } }));

    if (step.type === 'final' && result.passed) {
      await supabase.from('certificates').upsert({
        user_id: user.id,
        course_id: courseId,
        final_score: result.score,
      });
      setCertAwarded(true);
    }
  };

  const goNext = () => {
    if (stepIndex + 1 < steps.length) setStepIndex(stepIndex + 1);
  };

  if (!course || !step) {
    return (
      <Layout>
        <section className="page-header">
          <h1>{!user ? 'Loading…' : 'Course not found'}</h1>
        </section>
      </Layout>
    );
  }

  const canAdvance =
    step.type === 'lesson'
      ? completed.has(step.id)
      : quizResults[step.id]?.passed;

  return (
    <Layout>
      <Head>
        <title>{course.title} | SafeHaven</title>
      </Head>

      <div className="player">
        <aside className="sidebar">
          <p className="sidebar-title">{course.title}</p>
          {steps.map((s, i) => {
            const isDone =
              s.type === 'lesson' ? completed.has(s.id) : quizResults[s.id]?.passed;
            return (
              <button
                key={i}
                className={`step-item ${i === stepIndex ? 'active' : ''}`}
                onClick={() => setStepIndex(i)}
              >
                <span className="step-icon">{isDone ? '✓' : i + 1}</span>
                <span className="step-label">
                  {s.type === 'final' ? 'Final Assessment' : s.title}
                </span>
              </button>
            );
          })}
        </aside>

        <div className="main">
          {step.type === 'lesson' && (
            <>
              <p className="module-tag">{step.moduleTitle}</p>
              <h1>{step.title}</h1>
              
              {stepIndex === 0 && (
                <div className="first-lesson-video">
                  <CourseVideoIntro courseId={courseId} showEmbed={true} />
                </div>
              )}

              {step.content.split('\n\n').map((p, i) => (
                <p key={i} className="body-text">
                  {p}
                </p>
              ))}
              <button
                className="complete-btn"
                onClick={() => markLessonComplete(step.id)}
                disabled={completed.has(step.id)}
              >
                {completed.has(step.id) ? 'Completed' : 'Mark as complete'}
              </button>
            </>
          )}

          {step.type === 'quiz' && (
            <>
              <p className="module-tag">{step.moduleTitle}</p>
              <h1>Module quiz</h1>
              <QuizBlock
                key={step.id}
                questions={step.questions}
                passScore={step.passScore}
                onComplete={(result) => recordQuiz(step.id, result)}
              />
            </>
          )}

          {step.type === 'final' && (
            <>
              <p className="module-tag">Final assessment</p>
              <h1>Show what you've learned</h1>
              <p className="body-text">
                Score {step.passScore} or more out of {step.questions.length} to
                earn your certificate.
              </p>
              <QuizBlock
                key={step.id}
                questions={step.questions}
                passScore={step.passScore}
                onComplete={(result) => recordQuiz(step.id, result)}
              />
              {certAwarded && (
                <div className="cert-earned">
                  <p className="cert-earned-title">Certificate earned</p>
                  <a
                    className="cert-earned-link"
                    href={`/api/certificate?courseId=${course.id}&token=${accessToken}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Download your certificate
                  </a>
                </div>
              )}
            </>
          )}

          {step.type !== 'final' && (
            <button className="next-btn" onClick={goNext} disabled={!canAdvance}>
              Next
            </button>
          )}

          <Link href={`/learn/course/${course.id}`} className="back-link">
            Back to course overview
          </Link>
        </div>
      </div>

      <style jsx>{`
        .player {
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 24px 100px;
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 40px;
        }
        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .sidebar-title {
          font-weight: 800;
          color: var(--ink);
          font-size: 0.95rem;
          margin-bottom: 14px;
        }
        .step-item {
          display: flex;
          align-items: center;
          gap: 10px;
          background: none;
          border: none;
          text-align: left;
          padding: 9px 10px;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--muted);
          cursor: pointer;
        }
        .step-item.active {
          background: var(--blush);
          color: var(--ink);
        }
        .step-icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--sand);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.68rem;
          font-weight: 700;
          flex-shrink: 0;
        }
        .step-item.active .step-icon {
          background: var(--rose);
          color: white;
        }

        .main h1 {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 16px;
        }
        .module-tag {
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--rose);
          margin-bottom: 10px;
        }

        .first-lesson-video {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 30px;
          border: 1px solid var(--sand);
        }

        .body-text {
          font-size: 0.95rem;
          line-height: 1.7;
          color: var(--ink);
          margin-bottom: 16px;
        }
        .complete-btn,
        .next-btn {
          background: var(--rose);
          color: white;
          border: none;
          padding: 12px 26px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.88rem;
          cursor: pointer;
          margin-top: 10px;
        }
        .next-btn {
          margin-top: 24px;
          margin-right: 16px;
        }
        .complete-btn:disabled {
          background: var(--teal);
          cursor: default;
        }
        .next-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        :global(.back-link) {
          display: block;
          margin-top: 20px;
          font-size: 0.82rem;
          color: var(--muted);
        }

        .cert-earned {
          background: var(--teal-light);
          border-radius: 12px;
          padding: 20px 22px;
          margin-top: 20px;
        }
        .cert-earned-title {
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 10px;
        }
        .cert-earned-link {
          display: inline-block;
          background: var(--ink);
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.85rem;
          text-decoration: none;
        }

        @media (max-width: 700px) {
          .player {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </Layout>
  );
}

export async function getStaticPaths() {
  return {
    paths: ADVANCED_COURSES.map((c) => ({ params: { courseId: c.id } })),
    fallback: false,
  };
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
