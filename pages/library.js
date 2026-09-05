import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabaseClient';

const TYPE_LABELS = {
  quick_guide: 'Quick guide',
  ebook: 'Ebook',
};

function DocSection({ title, docs }) {
  if (docs.length === 0) return null;
  return (
    <div className="doc-section">
      <h2 className="section-title">{title}</h2>
      <div className="doc-grid">
        {docs.map((d) => (
          <a href={d.file_url} className="doc-card-link" key={d.id} target="_blank" rel="noreferrer">
            <div className="doc-card">
              <div className="doc-cover">
                {d.cover_image_url ? (
                  <img src={d.cover_image_url} alt="" />
                ) : (
                  <span>{d.doc_type === 'ebook' ? '📕' : '📄'}</span>
                )}
              </div>
              <div className="doc-body">
                <span className="doc-type-tag">{TYPE_LABELS[d.doc_type] || d.doc_type}</span>
                <p className="doc-title">{d.title}</p>
                {d.author && <p className="doc-author">by {d.author}</p>}
                {d.description && <p className="doc-desc">{d.description}</p>}
                <div className="doc-meta">
                  {d.estimated_minutes && <span>{d.estimated_minutes} min read</span>}
                  {(d.topics || []).slice(0, 3).map((t) => (
                    <span className="doc-topic" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <span className="doc-download">↓</span>
            </div>
          </a>
        ))}
      </div>
      <style jsx>{`
        .doc-section {
          margin-bottom: 36px;
        }
        .section-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 14px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--sand);
        }
        .doc-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        :global(.doc-card-link) {
          text-decoration: none;
          display: block;
        }
        .doc-card {
          display: flex;
          align-items: center;
          gap: 16px;
          background: white;
          border: 1px solid var(--sand);
          border-radius: 14px;
          padding: 18px 20px;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        :global(.doc-card-link:hover) .doc-card {
          border-color: var(--rose);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
        }
        .doc-cover {
          width: 100px;
          height: 100px;
          border-radius: 10px;
          background: var(--warm);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.2rem;
          flex-shrink: 0;
          overflow: hidden;
        }
        .doc-cover img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .doc-body {
          flex: 1;
        }
        .doc-type-tag {
          font-size: 0.68rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--rose-deep);
        }
        .doc-title {
          font-size: 0.98rem;
          font-weight: 800;
          color: var(--ink);
          margin: 4px 0 2px;
        }
        .doc-author {
          font-size: 0.78rem;
          color: var(--muted);
          margin-bottom: 6px;
        }
        .doc-desc {
          font-size: 0.85rem;
          color: var(--muted);
          line-height: 1.5;
          margin-bottom: 10px;
        }
        .doc-meta {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          font-size: 0.72rem;
          color: var(--muted);
        }
        .doc-topic {
          background: var(--teal-light);
          padding: 2px 8px;
          border-radius: 999px;
        }
        .doc-download {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--rose-deep);
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}

export default function LibraryPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTopic, setActiveTopic] = useState('All');
  const [activeType, setActiveType] = useState('All');
  const [showAllTopics, setShowAllTopics] = useState(false);

  useEffect(() => {
    supabase
      .from('documents')
      .select('*')
      .order('title')
      .then(({ data }) => {
        setDocuments(data || []);
        setLoading(false);
      });
  }, []);

  const allTopics = useMemo(() => {
    const set = new Set();
    documents.forEach((d) => (d.topics || []).forEach((t) => set.add(t)));
    return ['All', ...Array.from(set).sort()];
  }, [documents]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return documents.filter((d) => {
      if (activeType !== 'All' && d.doc_type !== activeType) return false;
      if (activeTopic !== 'All' && !(d.topics || []).includes(activeTopic)) return false;
      if (q) {
        const haystack = `${d.title} ${d.description || ''} ${d.author || ''}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [documents, search, activeTopic, activeType]);

  // Each document is tagged all / under18 / 18plus in the admin panel.
  // "all" belongs in both sections since it's written for any reader;
  // the other two only show up in their matching section, so an under-18
  // reader never lands on 18+ material (or the reverse) while browsing.
  const under18Docs = useMemo(
    () => filtered.filter((d) => (d.audience || 'all') !== '18plus'),
    [filtered]
  );
  const over18Docs = useMemo(
    () => filtered.filter((d) => (d.audience || 'all') !== 'under18'),
    [filtered]
  );

  return (
    <Layout>
      <Head>
        <title>Library | SafeHaven</title>
        <meta
          name="description"
          content="Search guides and ebooks on gender-based violence, rights, and support."
        />
      </Head>

      <section className="page-header">
        <p className="eyebrow">Library</p>
        <h1>Guides &amp; ebooks</h1>
      </section>

      <section className="content">
        <div className="search-row">
          <input
            className="search-input"
            type="text"
            placeholder="Search by title, topic, or author…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-row">
          <div className="filter-group">
            <span className="filter-label">Type</span>
            {['All', 'quick_guide', 'ebook'].map((t) => (
              <button
                key={t}
                className={`chip ${activeType === t ? 'active' : ''}`}
                onClick={() => setActiveType(t)}
              >
                {t === 'All' ? 'All' : TYPE_LABELS[t]}
              </button>
            ))}
          </div>

          {allTopics.length > 1 && (
            <div className="filter-group">
              <span className="filter-label">Topic</span>
              {(showAllTopics ? allTopics : allTopics.slice(0, 8)).map((t) => (
                <button
                  key={t}
                  className={`chip ${activeTopic === t ? 'active' : ''}`}
                  onClick={() => setActiveTopic(t)}
                >
                  {t}
                </button>
              ))}
              {allTopics.length > 8 && (
                <button
                  className="chip chip-toggle"
                  onClick={() => setShowAllTopics((v) => !v)}
                >
                  {showAllTopics ? 'Show less' : `+${allTopics.length - 8} more`}
                </button>
              )}
            </div>
          )}
        </div>

        {loading && <p className="empty-note">Loading…</p>}

        {!loading && filtered.length === 0 && (
          <p className="empty-note">
            No documents match your search. Try a different word or clear the filters.
          </p>
        )}

        {!loading && filtered.length > 0 && (
          <>
            <DocSection title="Under 18" docs={under18Docs} />
            <DocSection title="18 and over" docs={over18Docs} />
          </>
        )}
      </section>

      <style jsx>{`
        .page-header {
          max-width: 700px;
          margin: 0 auto;
          text-align: center;
          padding: 70px 24px 30px;
        }
        .eyebrow {
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--rose);
          margin-bottom: 18px;
        }
        .page-header h1 {
          font-size: clamp(1.9rem, 4vw, 2.6rem);
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 18px;
        }
        .sub {
          font-size: 1rem;
          color: var(--muted);
        }

        .content {
          max-width: 800px;
          margin: 0 auto;
          padding: 10px 24px 100px;
        }

        .search-row {
          margin-bottom: 20px;
        }
        .search-input {
          width: 100%;
          border: 1px solid var(--sand);
          border-radius: 10px;
          padding: 14px 18px;
          font-size: 0.95rem;
          font-family: inherit;
          color: var(--ink);
        }

        .filter-row {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 30px;
        }
        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .filter-label {
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--muted);
          margin-right: 4px;
        }
        .chip {
          background: var(--warm);
          border: none;
          border-radius: 999px;
          padding: 6px 14px;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--muted);
          cursor: pointer;
        }
        .chip.active {
          background: var(--rose);
          color: white;
        }
        .chip-toggle {
          background: transparent;
          border: 1px solid var(--sand);
          color: var(--rose-deep);
          font-weight: 700;
        }

        .empty-note {
          font-size: 0.9rem;
          color: var(--muted);
          background: var(--warm);
          border-radius: 10px;
          padding: 16px 18px;
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
