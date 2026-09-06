import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/Layout';
import { supabase } from '../../lib/supabaseClient';

const LANGUAGE_LABELS = {
  en: 'English',
  zu: 'isiZulu',
  xh: 'isiXhosa',
  af: 'Afrikaans',
  nso: 'Sepedi',
  tn: 'Setswana',
  st: 'Sesotho',
  ts: 'Xitsonga',
  ss: 'siSwati',
  ve: 'Tshivenda',
  nr: 'isiNdebele',
};

const TYPE_LABELS = {
  quick_guide: 'Quick guide',
  ebook: 'Ebook',
};

export default function DocumentDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en');

  useEffect(() => {
    if (!id) return;
    supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound(true);
        } else {
          setDoc(data);
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="state-wrap">
          <p>Loading…</p>
        </div>
      </Layout>
    );
  }

  if (notFound || !doc) {
    return (
      <Layout>
        <div className="state-wrap">
          <p>We couldn&apos;t find that document.</p>
          <Link href="/library" className="back-link">
            ← Back to the Library
          </Link>
        </div>
        <style jsx>{`
          .state-wrap {
            max-width: 600px;
            margin: 0 auto;
            padding: 100px 24px;
            text-align: center;
          }
          .back-link {
            display: inline-block;
            margin-top: 16px;
            color: var(--rose-deep);
            font-weight: 700;
          }
        `}</style>
      </Layout>
    );
  }

  // file_url is always the original/default version; translations holds
  // any extra language versions as { language_code: url }. Together they
  // form the full list of versions someone can actually pick from.
  const availableLanguages = [
    { code: 'en', url: doc.file_url, isOriginal: true },
    ...Object.entries(doc.translations || {}).map(([code, url]) => ({ code, url })),
  ];
  // If the original wasn't actually English, still show it as the first,
  // default option, just labelled by whatever language code it is if we
  // don't have a translation entry duplicating that slot.
  const current = availableLanguages.find((l) => l.code === selectedLang) || availableLanguages[0];

  return (
    <Layout>
      <Head>
        <title>{doc.title} | Library | SafeHaven</title>
      </Head>

      <div className="detail-wrap">
        <Link href="/library" className="back-link">
          ← Back to the Library
        </Link>

        <div className="detail-card">
          <div className="detail-cover">
            {doc.cover_image_url ? (
              <img src={doc.cover_image_url} alt="" />
            ) : (
              <span>{doc.doc_type === 'ebook' ? '📕' : '📄'}</span>
            )}
          </div>

          <div className="detail-body">
            <span className="doc-type-tag">{TYPE_LABELS[doc.doc_type] || doc.doc_type}</span>
            <h1>{doc.title}</h1>
            {doc.author && <p className="doc-author">by {doc.author}</p>}
            {doc.description && <p className="doc-desc">{doc.description}</p>}

            <div className="doc-meta">
              {doc.estimated_minutes && <span>{doc.estimated_minutes} min read</span>}
              {(doc.topics || []).map((t) => (
                <span className="doc-topic" key={t}>
                  {t}
                </span>
              ))}
            </div>

            {availableLanguages.length > 1 && (
              <div className="lang-picker">
                <label htmlFor="lang-select">Version</label>
                <select
                  id="lang-select"
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                >
                  {availableLanguages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {LANGUAGE_LABELS[l.code] || l.code}
                      {l.isOriginal ? ' (original)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="action-row">
              <a href={current.url} target="_blank" rel="noreferrer" className="btn-view">
                View
              </a>
              <a href={current.url} download className="btn-download">
                Download
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .detail-wrap {
          max-width: 760px;
          margin: 0 auto;
          padding: 60px 24px 100px;
        }
        .back-link {
          display: inline-block;
          margin-bottom: 24px;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--muted);
          text-decoration: none;
        }
        .back-link:hover {
          color: var(--rose-deep);
        }
        .detail-card {
          display: flex;
          gap: 32px;
          background: white;
          border: 1px solid var(--sand);
          border-radius: 18px;
          padding: 36px;
        }
        .detail-cover {
          width: 180px;
          height: 180px;
          border-radius: 14px;
          background: var(--warm);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3.5rem;
          flex-shrink: 0;
          overflow: hidden;
        }
        .detail-cover img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .detail-body {
          flex: 1;
          min-width: 0;
        }
        .doc-type-tag {
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--rose-deep);
        }
        .detail-body h1 {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--ink);
          margin: 6px 0 4px;
        }
        .doc-author {
          font-size: 0.85rem;
          color: var(--muted);
          margin-bottom: 12px;
        }
        .doc-desc {
          font-size: 0.92rem;
          color: var(--muted);
          line-height: 1.6;
          margin-bottom: 16px;
        }
        .doc-meta {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          font-size: 0.75rem;
          color: var(--muted);
          margin-bottom: 20px;
        }
        .doc-topic {
          background: var(--teal-light);
          padding: 3px 10px;
          border-radius: 999px;
        }
        .lang-picker {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 22px;
        }
        .lang-picker label {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--ink);
        }
        .lang-picker select {
          border: 1px solid var(--sand);
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 0.85rem;
          font-family: inherit;
          color: var(--ink);
        }
        .action-row {
          display: flex;
          gap: 12px;
        }
        .btn-view,
        .btn-download {
          padding: 12px 24px;
          border-radius: 10px;
          font-size: 0.88rem;
          font-weight: 700;
          text-decoration: none;
          text-align: center;
        }
        .btn-view {
          background: var(--rose);
          color: white;
        }
        .btn-download {
          background: var(--warm);
          border: 1px solid var(--sand);
          color: var(--ink);
        }

        @media (max-width: 600px) {
          .detail-card {
            flex-direction: column;
            padding: 24px;
          }
          .detail-cover {
            width: 100%;
            height: 160px;
          }
          .action-row {
            flex-direction: column;
          }
        }
      `}</style>
    </Layout>
  );
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' };
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
