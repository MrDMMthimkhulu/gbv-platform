import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../../../components/Layout';
import { supabase } from '../../../../lib/supabaseClient';
import { ADVANCED_COURSES } from '../../../../lib/allyCourseData';

export default function CourseOverviewPage() {
  const router = useRouter();
  const { courseId } = router.query;
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [certificate, setCertificate] = useState(null);

  const course = ADVANCED_COURSES.find((c) => c.id === courseId);
  const allLessons = course
    ? course.modules.flatMap((m) => m.lessons.map((l) => l.id))
    : [];

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAccessToken(data.session?.access_token ?? null);
    });
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      if (data.user && courseId) loadStatus(data.user.id, courseId);
    });
  }, [courseId]);

  const loadStatus = async (userId, cId) => {
    const { data: progressRows } = await supabase
      .from('course_progress')
      .select('lesson_id')
      .eq('user_id', userId)
      .eq('course_id', cId);
    setCompletedLessons(new Set((progressRows || []).map((r) => r.lesson_id)));

    const { data: certRows } = await supabase
      .from('certificates')
      .select('final_score, issued_at')
      .eq('user_id', userId)
      .eq('course_id', cId)
      .maybeSingle();
    setCertificate(certRows || null);
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

  const done = allLessons.filter((id) => completedLessons.has(id)).length;
  const pct = Math.round((done / allLessons.length) * 100);
  const started = done > 0;

  return (
    <Layout>
      <Head>
        <title>{course.title} | SafeHaven</title>
        <meta name="description" content={course.description} />
      </Head>

      <section className="overview">
        <p className="eyebrow">
          <Link href="/learn">Learning hub</Link> / Advanced course
        </p>
        <h1>{course.title}</h1>
        <p className="subtitle">{course.subtitle}</p>

        <div className="meta-row">
          <span className="meta-item">{course.level}</span>
          <span className="meta-dot">·</span>
          <span className="meta-item">{course.estimatedMinutes} min</span>
          <span className="meta-dot">·</span>
          <span className="meta-item">{course.modules.length} modules</span>
        </div>

        <p className="description">{course.description}</p>

        {user && started && (
          <div className="progress-box">
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <p className="progress-label">{pct}% complete</p>
          </div>
        )}

        {certificate ? (
          <div className="cert-box">
            <p className="cert-title">Certificate earned</p>
            <p className="cert-sub">
              Scored {certificate.final_score}/5 on the final assessment.
            </p>
            <a
              className="cert-download"
              href={`/api/certificate?courseId=${course.id}&token=${accessToken}`}
              target="_blank"
              rel="noreferrer"
            >
              Download certificate
            </a>
          </div>
        ) : (
          <Link href={`/learn/course/${course.id}/learn`} className="enroll-btn">
            {started ? 'Continue course' : 'Start course'}
          </Link>
        )}

        {!user && (
          <p className="login-note">
            <Link href="/login">Log in</Link> to save your progress and earn a
            certificate.
          </p>
        )}

        <div className="learn-block">
          <h2>What you&apos;ll learn</h2>
          <ul className="learn-list">
            {course.whatYoullLearn.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="syllabus-block">
          <h2>Course content</h2>
          <div className="module-list">
            {course.modules.map((m, i) => (
              <div className="module-item" key={m.id}>
                <p className="module-num">Module {i + 1}</p>
                <p className="module-title">{m.title}</p>
                <p className="module-count">
                  {m.lessons.length} lessons · 1 quiz
                </p>
              </div>
            ))}
            <div className="module-item final">
              <p className="module-num">Final</p>
              <p className="module-title">Final Assessment</p>
              <p className="module-count">
                {course.finalAssessment.questions.length} questions · Certificate on passing
              </p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .overview {
          max-width: 700px;
          margin: 0 auto;
          padding: 60px 24px 100px;
        }
        .eyebrow {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--rose);
          margin-bottom: 16px;
        }
        .eyebrow :global(a) {
          color: var(--rose);
        }
        .overview h1 {
          font-size: clamp(1.9rem, 4vw, 2.5rem);
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 8px;
        }
        .subtitle {
          font-size: 1.05rem;
          color: var(--muted);
          margin-bottom: 18px;
        }
        .meta-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }
        .meta-item {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--rose-deep);
        }
        .meta-dot {
          color: var(--muted);
        }
        .description {
          font-size: 0.98rem;
          line-height: 1.65;
          color: var(--ink);
          margin-bottom: 24px;
        }

        .progress-box {
          margin-bottom: 20px;
        }
        .progress-track {
          background: var(--sand);
          border-radius: 6px;
          height: 10px;
          overflow: hidden;
          margin-bottom: 6px;
        }
        .progress-fill {
          height: 100%;
          background: var(--rose);
          border-radius: 6px;
        }
        .progress-label {
          font-size: 0.8rem;
          color: var(--muted);
          font-weight: 600;
        }

        :global(.enroll-btn) {
          display: inline-block;
          background: var(--rose);
          color: white;
          padding: 14px 32px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.92rem;
          text-decoration: none;
          margin-bottom: 12px;
        }
        .login-note {
          font-size: 0.85rem;
          color: var(--muted);
          margin-bottom: 30px;
        }
        .login-note :global(a) {
          color: var(--rose-deep);
          font-weight: 700;
        }

        .cert-box {
          background: var(--teal-light);
          border-radius: 12px;
          padding: 20px 22px;
          margin-bottom: 30px;
        }
        .cert-title {
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 4px;
        }
        .cert-sub {
          font-size: 0.85rem;
          color: var(--muted);
          margin-bottom: 12px;
        }
        .cert-download {
          display: inline-block;
          background: var(--ink);
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.85rem;
          text-decoration: none;
        }

        .learn-block,
        .syllabus-block {
          margin-top: 40px;
        }
        .learn-block h2,
        .syllabus-block h2 {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 16px;
        }
        .learn-list {
          padding-left: 20px;
          color: var(--ink);
          font-size: 0.92rem;
          line-height: 1.9;
        }

        .module-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .module-item {
          background: var(--blush);
          border-radius: 10px;
          padding: 14px 18px;
        }
        .module-item.final {
          background: var(--warm);
        }
        .module-num {
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--rose-deep);
          margin-bottom: 3px;
        }
        .module-title {
          font-weight: 700;
          color: var(--ink);
          font-size: 0.95rem;
        }
        .module-count {
          font-size: 0.78rem;
          color: var(--muted);
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
