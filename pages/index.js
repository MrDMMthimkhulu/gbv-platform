import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Layout from '../components/Layout';
import JennetChat from '../components/JennetChat';
import MythFactGame from '../components/MythFactGame';
import { supabase } from '../lib/supabaseClient';
import { PROVINCES, NATIONAL_CASE_TYPES, NATIONAL_CASE_TYPES_TOTAL } from '../lib/gbvData';

export default function Home() {
  const { t } = useTranslation('common');
  const [ageGroup, setAgeGroup] = useState(null);
  const [libraryPreview, setLibraryPreview] = useState([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setAgeGroup(data.user?.user_metadata?.age_group ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAgeGroup(session?.user?.user_metadata?.age_group ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(4)
      .then(({ data }) => setLibraryPreview(data || []));
  }, []);

  const isGirl = ageGroup === 'under18';

  return (
    <Layout>
      <Head>
        <title>SafeHaven, GBV Support Platform</title>
        <meta
          name="description"
          content="A free platform providing centralised GBV information, resources, and support for South African women and girls."
        />
      </Head>

      <div
        style={
          isGirl
            ? {
                '--rose': '#f97316',
                '--rose-deep': '#c2410c',
                '--blush': '#ffedd5',
                '--teal': '#eab308',
                '--teal-light': '#fef9c3',
                '--warm': '#fed7aa',
                '--ink': '#7c2d12',
              }
            : undefined
        }
      >

      {isGirl && (
        <div className="mode-badge">
          <span>A space made just for you</span>
        </div>
      )}

      {isGirl ? (
        <section className="hero">
          <p className="eyebrow">Hey, you</p>
          <h1>
            Something feel off at home?
            <span> Let&apos;s figure it out together.</span>
          </h1>
          <p className="hero-desc">
            No judgment, no pressure. Just clear answers about what abuse
            can look like and people who&apos;ll actually listen.
          </p>
          <div className="hero-actions">
            <Link href="/about-abuse" className="btn-primary">Is this abuse?</Link>
            <Link href="/support" className="btn-secondary">Talk to someone</Link>
          </div>
        </section>
      ) : (
        <section className="hero">
          <h1>
            {t('hero_title_1')}
            <span> {t('hero_title_2')}</span>
          </h1>
          <p className="hero-desc">{t('hero_desc')}</p>
          <div className="hero-actions">
            <Link href="/map" className="btn-primary">{t('hero_btn_map')}</Link>
            <Link href="/rights" className="btn-secondary">{t('hero_btn_rights')}</Link>
          </div>
        </section>
      )}

      <section className="stats">
        <div className="stat">
          <p className="stat-num">127+</p>
          <p className="stat-label">{t('stat_shelters')}</p>
        </div>
        <div className="stat">
          <p className="stat-num">9</p>
          <p className="stat-label">{t('stat_provinces')}</p>
        </div>
        <div className="stat">
          <p className="stat-num">11</p>
          <p className="stat-label">{t('stat_languages')}</p>
        </div>
        <div className="stat">
          <p className="stat-num">24/7</p>
          <p className="stat-label">{t('stat_available')}</p>
        </div>
      </section>

      <section className="showcase">
        <div className="showcase-block">
          <div className="showcase-text">
            <p className="section-tag">Jennet AI Agent</p>
            <h2 className="section-title">
              Ask Jennet anything
              <br />
              <strong>about GBV.</strong>
            </h2>
            <p className="section-body">
              Jennet is an AI agent trained on gender-based violence in the
              South African context. She knows the law, she knows the
              resources, and she responds with empathy, no judgement, no
              pressure.
            </p>
            <Link href="/chat" className="btn-primary">
              Ask Jennet
            </Link>
          </div>
          <div className="showcase-visual">
            <JennetChat compact />
          </div>
        </div>

        <div className="showcase-block reverse">
          <div className="showcase-text">
            <p className="section-tag">Find Shelter</p>
            <h2 className="section-title">
              Shelters near you,
              <br />
              <strong>across South Africa.</strong>
            </h2>
            <p className="section-body">
              An interactive map of every verified shelter and safe house
              across all 9 provinces, with contact details you can trust.
            </p>
            <Link href="/map" className="btn-primary">
              Find shelter near me
            </Link>
          </div>
          <div className="showcase-visual">
            <div className="mini-map">
              <p className="mini-map-num">127+</p>
              <p className="mini-map-label">verified shelters &amp; services</p>
              <p className="mini-map-num small">9</p>
              <p className="mini-map-label">provinces covered</p>
            </div>
          </div>
        </div>

        <div className="showcase-block">
          <div className="showcase-text">
            <p className="section-tag">Data Intelligence</p>
            <h2 className="section-title">
              The data behind
              <br />
              <strong>the crisis.</strong>
            </h2>
            <p className="section-body">
              Verified figures on how GBV services are actually distributed
              across South Africa, and exactly where the gaps are, province
              by province.
            </p>
            <Link href="/insights" className="btn-primary">
              View the data
            </Link>
          </div>
          <div className="showcase-visual">
            <DataDashboard />
          </div>
        </div>

        <div className="showcase-block reverse">
          <div className="showcase-text">
            <p className="section-tag">Learning Hub</p>
            <h2 className="section-title">
              A few minutes,
              <br />
              <strong>a lot more clarity.</strong>
            </h2>
            <p className="section-body">
              Short lessons, a myth vs fact game, right here on the page.
            </p>
            <Link href="/learn" className="btn-primary">
              Visit the Learning Hub
            </Link>
          </div>
          <div className="showcase-visual">
            <MythFactGame />
          </div>
        </div>

        <div className="showcase-block">
          <div className="showcase-text">
            <p className="section-tag">Library</p>
            <h2 className="section-title">
              Guides and ebooks,
              <br />
              <strong>ready to download.</strong>
            </h2>
            <p className="section-body">
              New guides added regularly.
            </p>
            <Link href="/library" className="btn-primary">
              Browse the library
            </Link>
          </div>
          <div className="showcase-visual">
            <LibraryPreview documents={libraryPreview} />
          </div>
        </div>
      </section>

      <section className="how">
        <h2>{t('how_title')}</h2>
        <div className="how-grid">
          <div className="how-step">
            <p className="how-num">01</p>
            <p className="how-title">{t('how_1_title')}</p>
            <p className="how-text">{t('how_1_text')}</p>
          </div>
          <div className="how-step">
            <p className="how-num">02</p>
            <p className="how-title">{t('how_2_title')}</p>
            <p className="how-text">{t('how_2_text')}</p>
          </div>
          <div className="how-step">
            <p className="how-num">03</p>
            <p className="how-title">{t('how_3_title')}</p>
            <p className="how-text">{t('how_3_text')}</p>
          </div>
        </div>
      </section>

      {isGirl ? (
        <section className="resources">
          <h2>Pick what you need right now</h2>
          <div className="resource-grid">
            <Link href="/about-abuse" className="resource-card resource-rose">
              <p className="resource-title">Wait, is this actually abuse?</p>
              <p className="resource-sub">Some things are sneaky. Let&apos;s check.</p>
            </Link>
            <Link href="/support" className="resource-card resource-teal">
              <p className="resource-title">Call Childline</p>
              <p className="resource-sub">Free, secret, and they get it &mdash; 116</p>
            </Link>
            <Link href="/chat" className="resource-card resource-plum">
              <p className="resource-title">Just ask, no pressure</p>
              <p className="resource-sub">Chat privately, no one else sees it</p>
            </Link>
            <Link href="/support" className="resource-card resource-rose">
              <p className="resource-title">Who can I actually tell?</p>
              <p className="resource-sub">We&apos;ll help you figure that out</p>
            </Link>
          </div>
        </section>
      ) : (
        <section className="resources">
          <h2>{t('resources_title')}</h2>
          <div className="resource-grid">
            <Link href="/about-abuse" className="resource-card resource-rose">
              <p className="resource-title">{t('resource_abuse_title')}</p>
              <p className="resource-sub">{t('resource_abuse_sub')}</p>
            </Link>
            <Link href="/map" className="resource-card resource-teal">
              <p className="resource-title">{t('resource_map_title')}</p>
              <p className="resource-sub">{t('resource_map_sub')}</p>
            </Link>
            <Link href="/rights" className="resource-card resource-plum">
              <p className="resource-title">{t('resource_rights_title')}</p>
              <p className="resource-sub">{t('resource_rights_sub')}</p>
            </Link>
            <Link href="/support" className="resource-card resource-rose">
              <p className="resource-title">{t('resource_support_title')}</p>
              <p className="resource-sub">{t('resource_support_sub')}</p>
            </Link>
          </div>
        </section>
      )}

      </div>

      <style jsx>{`
        .mode-badge {
          text-align: center;
          padding: 14px 0 0;
        }
        .mode-badge span {
          display: inline-block;
          background: var(--rose-deep);
          color: white;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          padding: 8px 18px;
          border-radius: 999px;
        }
        .hero {
          max-width: 720px;
          margin: 0 auto;
          text-align: center;
          padding: 90px 24px 60px;
        }
        .eyebrow {
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--rose);
          margin-bottom: 20px;
        }
        .hero h1 {
          font-size: clamp(2.2rem, 4.5vw, 3.4rem);
          font-weight: 800;
          line-height: 1.2;
          color: var(--ink);
          margin-bottom: 24px;
          letter-spacing: -0.02em;
        }
        .hero h1 span {
          color: var(--rose-deep);
        }
        .hero-desc {
          font-size: 1.1rem;
          line-height: 1.65;
          color: var(--muted);
          max-width: 520px;
          margin: 0 auto 40px;
          font-weight: 400;
        }
        .hero-actions {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .hero-actions :global(.btn-primary) {
          background: var(--rose);
          color: white;
          padding: 15px 30px;
          font-weight: 700;
          font-size: 0.92rem;
          text-decoration: none;
          border-radius: 8px;
        }
        .hero-actions :global(.btn-secondary) {
          background: var(--white);
          color: var(--ink);
          border: 1px solid var(--sand);
          padding: 15px 30px;
          font-weight: 700;
          font-size: 0.92rem;
          text-decoration: none;
          border-radius: 8px;
        }

        .stats {
          background: var(--ink);
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          padding: 44px 6%;
          gap: 20px;
        }
        .stat {
          text-align: center;
          color: var(--cream);
        }
        .stat-num {
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--rose);
          margin-bottom: 6px;
        }
        .stat-label {
          font-size: 0.85rem;
          color: var(--sand);
          font-weight: 400;
        }

        .showcase {
          max-width: 1080px;
          margin: 0 auto;
          padding: 90px 24px 40px;
          display: flex;
          flex-direction: column;
          gap: 90px;
        }
        .showcase-block {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 56px;
          align-items: center;
        }
        .showcase-block.reverse .showcase-text {
          order: 2;
        }
        .showcase-block.reverse .showcase-visual {
          order: 1;
        }
        .section-tag {
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--rose);
          margin-bottom: 16px;
        }
        .section-title {
          font-size: clamp(1.7rem, 3.4vw, 2.4rem);
          font-weight: 800;
          line-height: 1.2;
          color: var(--ink);
          margin-bottom: 20px;
          letter-spacing: -0.02em;
        }
        .section-title strong {
          color: var(--rose-deep);
        }
        .section-body {
          font-size: 1rem;
          line-height: 1.65;
          color: var(--muted);
          margin-bottom: 28px;
          max-width: 440px;
        }
        .showcase-text :global(.btn-primary) {
          display: inline-block;
          background: var(--rose);
          color: white;
          padding: 14px 28px;
          font-weight: 700;
          font-size: 0.88rem;
          text-decoration: none;
          border-radius: 8px;
        }

        .showcase-visual {
          display: flex;
          justify-content: center;
        }

        .mini-map {
          background: var(--teal-light);
          border-radius: 16px;
          padding: 40px;
          width: 100%;
          max-width: 400px;
          text-align: center;
        }
        .mini-map-num {
          font-size: 2.6rem;
          font-weight: 800;
          color: var(--ink);
        }
        .mini-map-num.small {
          font-size: 2rem;
          margin-top: 20px;
        }
        .mini-map-label {
          font-size: 0.85rem;
          color: var(--muted);
          font-weight: 600;
          margin-bottom: 6px;
        }

        .showcase-visual :global(.jennet-chat) {
          max-width: 400px;
          width: 100%;
        }

        .how {
          max-width: 1000px;
          margin: 0 auto;
          padding: 90px 24px 40px;
        }
        .how h2 {
          font-size: 1.8rem;
          font-weight: 800;
          text-align: center;
          margin-bottom: 48px;
          color: var(--ink);
        }
        .how-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }
        .how-num {
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--rose);
          margin-bottom: 12px;
        }
        .how-title {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 10px;
          color: var(--ink);
        }
        .how-text {
          font-size: 0.92rem;
          line-height: 1.6;
          color: var(--muted);
        }

        .resources {
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px 24px 90px;
        }
        .resources h2 {
          font-size: 1.8rem;
          font-weight: 800;
          text-align: center;
          margin-bottom: 40px;
          color: var(--ink);
        }
        .resource-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }
        .resource-grid :global(.resource-card) {
          display: block;
          padding: 26px 20px;
          border-radius: 12px;
          text-decoration: none;
        }
        .resource-grid :global(.resource-rose) {
          background: var(--blush);
        }
        .resource-grid :global(.resource-teal) {
          background: var(--teal-light);
        }
        .resource-grid :global(.resource-plum) {
          background: var(--warm);
        }
        .resource-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 6px;
        }
        .resource-sub {
          font-size: 0.85rem;
          color: var(--muted);
          line-height: 1.5;
        }

        @media (max-width: 860px) {
          .stats {
            grid-template-columns: repeat(2, 1fr);
          }
          .how-grid,
          .resource-grid {
            grid-template-columns: 1fr;
          }
          .showcase {
            gap: 60px;
          }
          .showcase-block,
          .showcase-block.reverse .showcase-text,
          .showcase-block.reverse .showcase-visual {
            grid-template-columns: 1fr;
            order: initial;
          }
          .showcase-block {
            display: flex;
            flex-direction: column;
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

const PROVINCES_BY_CASES = [...PROVINCES].sort(
  (a, b) => b.sexualOffences.cases - a.sexualOffences.cases
);
const PROVINCES_BY_CHANGE = [...PROVINCES].sort(
  (a, b) => (b.sexualOffences.change || 0) - (a.sexualOffences.change || 0)
);

const TABS = ['Reported GBV Cases per Province', 'Trends', 'Case Types'];

function DataDashboard() {
  const [tab, setTab] = useState(TABS[0]);

  return (
    <div className="dashboard">
      <div className="dash-tabs">
        {TABS.map((label) => (
          <button
            key={label}
            className={`dash-tab ${tab === label ? 'active' : ''}`}
            onClick={() => setTab(label)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'Reported GBV Cases per Province' && (
        <div className="dash-panel">
          <p className="dash-title">Sexual offences by province, Q3 2024/25 (SAPS)</p>
          {(() => {
            const max = PROVINCES_BY_CASES[0].sexualOffences.cases;
            return PROVINCES_BY_CASES.map((p) => (
              <div className="bar-row" key={p.name}>
                <span className="bar-label">{p.name}</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ width: `${(p.sexualOffences.cases / max) * 100}%` }}
                  />
                </div>
                <span className="bar-value">{p.sexualOffences.cases.toLocaleString()}</span>
              </div>
            ));
          })()}
        </div>
      )}

      {tab === 'Trends' && (
        <div className="dash-panel">
          <p className="dash-title">
            Year-on-year change in sexual offences, Q3 2024/25 vs Q3 2023/24
          </p>
          {PROVINCES_BY_CHANGE.map((p) => {
            const change = p.sexualOffences.change || 0;
            const width = Math.min(Math.abs(change) * 4, 100);
            return (
              <div className="bar-row" key={p.name}>
                <span className="bar-label">{p.name}</span>
                <div className="bar-track">
                  <div
                    className={`bar-fill ${change > 0 ? 'rising' : 'falling'}`}
                    style={{ width: `${width}%` }}
                  />
                </div>
                <span className={`bar-value ${change > 0 ? 'rising-text' : ''}`}>
                  {change > 0 ? '+' : ''}
                  {change}%
                </span>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'Case Types' && (
        <div className="dash-panel">
          <p className="dash-title">
            Domestic-violence-linked cases, Q3 2024/25, {NATIONAL_CASE_TYPES_TOTAL.toLocaleString()} total
          </p>
          {NATIONAL_CASE_TYPES.map((c) => (
            <div className="bar-row" key={c.label}>
              <span className="bar-label">{c.label}</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${c.pct}%` }} />
              </div>
              <span className="bar-value">{c.pct}%</span>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .dashboard {
          background: var(--warm);
          border-radius: 16px;
          padding: 24px;
          width: 100%;
          max-width: 420px;
        }
        .dash-tabs {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }
        .dash-tab {
          background: transparent;
          border: none;
          border-radius: 999px;
          padding: 6px 12px;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--muted);
          cursor: pointer;
        }
        .dash-tab.active {
          background: white;
          color: var(--ink);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }
        .dash-title {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 18px;
          line-height: 1.4;
        }
        .bar-row {
          display: grid;
          grid-template-columns: 108px 1fr 52px;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }
        .bar-label {
          font-size: 0.74rem;
          font-weight: 600;
          color: var(--ink);
        }
        .bar-track {
          background: var(--sand);
          border-radius: 6px;
          height: 9px;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          background: var(--rose);
          border-radius: 6px;
        }
        .bar-fill.rising {
          background: #c2410c;
        }
        .bar-fill.falling {
          background: #0e6e65;
        }
        .bar-value {
          font-size: 0.72rem;
          color: var(--muted);
          text-align: right;
        }
        .bar-value.rising-text {
          color: #c2410c;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}

function LibraryPreview({ documents }) {
  const hasDocuments = documents && documents.length > 0;

  return (
    <div className="library-preview">
      {hasDocuments ? (
        <>
          <p className="lib-title">Recently added</p>
          {documents.map((d) => (
            <a href={d.file_url} className="lib-row" key={d.id} target="_blank" rel="noreferrer">
              <span className="lib-icon">{d.doc_type === 'ebook' ? '📕' : '📄'}</span>
              <span className="lib-name">{d.title}</span>
              <span className="lib-arrow">↓</span>
            </a>
          ))}
        </>
      ) : (
        <p className="lib-empty">Library documents will appear here once added.</p>
      )}

      <style jsx>{`
        .library-preview {
          background: var(--warm);
          border-radius: 16px;
          padding: 26px;
          width: 100%;
          max-width: 400px;
        }
        .lib-title {
          font-size: 0.78rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--rose);
          margin-bottom: 16px;
        }
        .lib-row {
          display: flex;
          align-items: center;
          gap: 10px;
          background: white;
          border-radius: 8px;
          padding: 10px 14px;
          margin-bottom: 8px;
          text-decoration: none;
        }
        .lib-icon {
          font-size: 0.95rem;
        }
        .lib-name {
          flex: 1;
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--ink);
        }
        .lib-arrow {
          color: var(--rose-deep);
          font-weight: 800;
        }
        .lib-empty {
          font-size: 0.85rem;
          color: var(--muted);
        }
      `}</style>
    </div>
  );
}
