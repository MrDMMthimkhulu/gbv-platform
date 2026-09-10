import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/Layout';
import MythFactGame from '../../components/MythFactGame';
import { supabase } from '../../lib/supabaseClient';
import { COURSES } from '../../lib/courseData';
import { ADVANCED_COURSES } from '../../lib/allyCourseData';

const COURSE_ICONS = {
  'gbv-awareness': '📖',
  'healthy-relationships': '💛',
  consent: '🤝',
  'online-safety': '🔒',
};

function greetingForNow() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function LearnPage() {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [progress, setProgress] = useState({});
  const [certifiedCourses, setCertifiedCourses] = useState(new Set());
  const [ageGroup, setAgeGroup] = useState(null);
  const [tab, setTab] = useState('progress');
  const [quickGuides, setQuickGuides] = useState([]);

  useEffect(() => {
    supabase
      .from('documents')
      .select('*')
      .eq('doc_type', 'quick_guide')
      .then(({ data }) => setQuickGuides(data || []));
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAccessToken(data.session?.access_token ?? null);
    });
    supabase.auth.getUser().then(({ data }) => {
      setAgeGroup(data.user?.user_metadata?.age_group ?? null);
      setUser(data.user ?? null);
      if (data.user) loadData(data.user.id);
    });
  }, []);

  const isGirl = ageGroup === 'under18';

  const loadData = async (userId) => {
    const { data: progressRows } = await supabase
      .from('course_progress')
      .select('course_id, lesson_id')
      .eq('user_id', userId);

    const byCourse = {};
    (progressRows || []).forEach((row) => {
      byCourse[row.course_id] = byCourse[row.course_id] || new Set();
      byCourse[row.course_id].add(row.lesson_id);
    });
    setProgress(byCourse);

    const { data: certRows } = await supabase
      .from('certificates')
      .select('course_id')
      .eq('user_id', userId);
    setCertifiedCourses(new Set((certRows || []).map((r) => r.course_id)));
  };

  // Build one unified, generic course list (works for future courses too)
  const allCourses = [
    ...COURSES.map((c) => ({
      id: c.id,
      title: c.title,
      tagline: c.tagline,
      icon: COURSE_ICONS[c.id] || '📘',
      total: c.lessons.length,
      firstLessonId: c.lessons[0]?.id,
      overviewHref: `/learn/${c.id}`,
      advanced: false,
    })),
    ...(!isGirl
      ? ADVANCED_COURSES.map((c) => ({
          id: c.id,
          title: c.title,
          tagline: c.subtitle,
          icon: '🎓',
          total: c.modules.reduce((sum, m) => sum + m.lessons.length, 0),
          overviewHref: `/learn/course/${c.id}`,
          advanced: true,
        }))
      : []),
  ].map((c) => {
    const done = progress[c.id]?.size || 0;
    const isCertified = certifiedCourses.has(c.id);
    let status = 'not_started';
    if (isCertified || (!c.advanced && done >= c.total && c.total > 0)) {
      status = 'completed';
    } else if (done > 0) {
      status = 'in_progress';
    }
    return { ...c, done, status };
  });

  const inProgressList = allCourses.filter((c) => c.status !== 'completed');
  const completedList = allCourses.filter((c) => c.status === 'completed');
  const certificatesList = allCourses.filter((c) => certifiedCourses.has(c.id));

  const lessonsCompleted = Object.values(progress).reduce((sum, s) => sum + s.size, 0);
  const coursesStarted = allCourses.filter((c) => c.done > 0).length;

  const displayName =
    user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there';

  const visibleList =
    tab === 'progress' ? inProgressList : tab === 'completed' ? completedList : certificatesList;

  return (
    <Layout>
      <Head>
        <title>Learning Hub | SafeHaven</title>
        <meta
          name="description"
          content="Interactive lessons, a myth vs fact game, and downloadable guides on gender-based violence."
        />
      </Head>

      <section className="header-band">
        <p className="greeting">
          {user ? `${greetingForNow()}, ${displayName}` : 'Learning Hub'}
        </p>
        <h1>Learn at your own pace</h1>
        {!user && (
          <p className="login-note">
            <Link href="/login">Log in</Link> to save your progress and earn
            certificates. You can still browse without an account.
          </p>
        )}
      </section>

      <section className="dashboard">
        <div className="main-col">
          <div className="tab-row">
            <button
              className={`tab-btn ${tab === 'progress' ? 'active' : ''}`}
              onClick={() => setTab('progress')}
            >
              In Progress
            </button>
            <button
              className={`tab-btn ${tab === 'completed' ? 'active' : ''}`}
              onClick={() => setTab('completed')}
            >
              Completed
            </button>
            <button
              className={`tab-btn ${tab === 'certificates' ? 'active' : ''}`}
              onClick={() => setTab('certificates')}
            >
              Certificates
            </button>
          </div>

          {visibleList.length === 0 && (
            <p className="empty-note">
              {tab === 'progress' && 'Nothing here, browse the courses below to get started.'}
              {tab === 'completed' && "You haven't completed a course yet."}
              {tab === 'certificates' && "You haven't earned a certificate yet."}
            </p>
          )}

          <div className="course-list">
            {visibleList.map((c) => {
              const pct = c.total > 0 ? Math.round((c.done / c.total) * 100) : 0;
              return (
                <div className="course-row" key={c.id}>
                  <div className="course-row-top">
                    <div className="course-badge">{c.icon}</div>
                    <div className="course-row-info">
                      <p className="course-provider">
                        SafeHaven {c.advanced ? '· Advanced' : ''}
                      </p>
                      <p className="course-row-title">{c.title}</p>
                      <p className="course-row-meta">
                        Course · {pct}% complete
                      </p>
                    </div>
                  </div>

                  <div className="course-row-track">
                    <div className="course-row-fill" style={{ width: `${pct}%` }} />
                  </div>

                  <div className="course-row-action">
                    <p className="course-row-tagline">{c.tagline}</p>
                    <Link href={c.overviewHref} className="resume-btn">
                      {c.done > 0 ? 'Continue' : 'Start'}
                    </Link>
                  </div>

                  {certifiedCourses.has(c.id) && (
                    <a
                      className="cert-link"
                      href={`/api/certificate?courseId=${c.id}&token=${accessToken}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View certificate ↓
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="side-col">
          {user && (
            <div className="stats-card">
              <p className="stats-title">Your activity</p>
              <div className="stats-grid">
                <div>
                  <p className="stat-num">{lessonsCompleted}</p>
                  <p className="stat-label">Lessons done</p>
                </div>
                <div>
                  <p className="stat-num">{coursesStarted}</p>
                  <p className="stat-label">Courses started</p>
                </div>
                <div>
                  <p className="stat-num">{certifiedCourses.size}</p>
                  <p className="stat-label">Certificates</p>
                </div>
              </div>
            </div>
          )}

          <div className="side-card">
            <p className="side-title">Myth or fact?</p>
            <p className="side-sub">Tap an answer to see if you're right.</p>
            <MythFactGame />
          </div>

          <div className="side-card">
            <p className="side-title">Guides to download</p>
            <div className="download-list">
              {quickGuides.map((d) => (
                <a href={d.file_url} className="download-row" key={d.id} download>
                  <span className="download-icon">{d.doc_type === 'ebook' ? '📕' : '📄'}</span>
                  <span className="download-title">{d.title}</span>
                  <span className="download-arrow">↓</span>
                </a>
              ))}
            </div>
            <Link href="/library" className="library-link">
              Browse the full library →
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .header-band {
          max-width: 1000px;
          margin: 0 auto;
          padding: 50px 24px 20px;
        }
        .greeting {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--rose);
          margin-bottom: 6px;
        }
        .header-band h1 {
          font-size: clamp(1.7rem, 3.6vw, 2.3rem);
          font-weight: 800;
          color: var(--ink);
        }
        .login-note {
          font-size: 0.85rem;
          color: var(--muted);
          margin-top: 12px;
        }
        .login-note :global(a) {
          color: var(--rose-deep);
          font-weight: 700;
        }

        .dashboard {
          max-width: 1000px;
          margin: 0 auto;
          padding: 10px 24px 100px;
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 32px;
        }

        .tab-row {
          display: flex;
          gap: 8px;
          border-bottom: 1px solid var(--sand);
          margin-bottom: 24px;
        }
        .tab-btn {
          background: none;
          border: none;
          padding: 10px 4px;
          margin-right: 20px;
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--muted);
          cursor: pointer;
          border-bottom: 2px solid transparent;
        }
        .tab-btn.active {
          color: var(--ink);
          border-bottom-color: var(--rose);
        }

        .empty-note {
          font-size: 0.9rem;
          color: var(--muted);
          background: var(--warm);
          border-radius: 10px;
          padding: 16px 18px;
        }

        .course-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .course-row {
          background: white;
          border: 1px solid var(--sand);
          border-radius: 14px;
          padding: 22px;
        }
        .course-row-top {
          display: flex;
          gap: 14px;
          margin-bottom: 14px;
        }
        .course-badge {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: var(--warm);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.15rem;
          flex-shrink: 0;
        }
        .course-provider {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--rose-deep);
          margin-bottom: 3px;
        }
        .course-row-title {
          font-size: 1.02rem;
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 3px;
        }
        .course-row-meta {
          font-size: 0.8rem;
          color: var(--muted);
        }

        .course-row-track {
          background: var(--warm);
          border-radius: 6px;
          height: 7px;
          overflow: hidden;
          margin-bottom: 16px;
        }
        .course-row-fill {
          height: 100%;
          background: var(--rose);
          border-radius: 6px;
        }

        .course-row-action {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--warm);
          border-radius: 10px;
          padding: 12px 16px;
        }
        .course-row-tagline {
          font-size: 0.82rem;
          color: var(--muted);
        }
        :global(.resume-btn) {
          background: var(--rose);
          color: white;
          padding: 9px 20px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.82rem;
          text-decoration: none;
          flex-shrink: 0;
        }

        .cert-link {
          display: inline-block;
          margin-top: 12px;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--teal);
        }

        .side-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .stats-card,
        .side-card {
          background: var(--warm);
          border-radius: 14px;
          padding: 20px;
        }
        .stats-title,
        .side-title {
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 4px;
        }
        .side-sub {
          font-size: 0.78rem;
          color: var(--muted);
          margin-bottom: 14px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-top: 12px;
        }
        .stat-num {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--rose-deep);
        }
        .stat-label {
          font-size: 0.68rem;
          color: var(--muted);
          font-weight: 600;
        }

        .download-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .download-row {
          display: flex;
          align-items: center;
          gap: 10px;
          background: white;
          border-radius: 8px;
          padding: 10px 12px;
          text-decoration: none;
        }
        .download-icon {
          font-size: 1rem;
        }
        .download-title {
          flex: 1;
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--ink);
        }
        .download-arrow {
          color: var(--rose-deep);
          font-weight: 800;
        }
        .library-link {
          display: block;
          margin-top: 14px;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--rose-deep);
        }

        @media (max-width: 800px) {
          .dashboard {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </Layout>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
