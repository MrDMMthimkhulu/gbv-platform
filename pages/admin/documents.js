import { useEffect, useState } from 'react';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/Layout';
import { supabase } from '../../lib/supabaseClient';

const AUDIENCE_LABELS = {
  all: 'Everyone',
  under18: 'Under 18',
  '18plus': '18+',
};

const EMPTY = {
  id: null,
  title: '',
  description: '',
  author: '',
  doc_type: 'ebook',
  audience: 'all',
  topics: '',
  estimated_minutes: '',
  cover_image_url: '',
  file_url: '',
};

export default function AdminDocumentsPage() {
  const [status, setStatus] = useState('loading');
  const [documents, setDocuments] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        setStatus('unauthorized');
        return;
      }
      const { data: adminResult } = await supabase.rpc('is_admin');
      if (!adminResult) {
        setStatus('unauthorized');
        return;
      }
      setStatus('ready');
      loadDocuments();
    });
  }, []);

  const loadDocuments = async () => {
    const { data } = await supabase.from('documents').select('*').order('title');
    setDocuments(data || []);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaveMsg('');

    const payload = {
      title: form.title,
      description: form.description || null,
      author: form.author || null,
      doc_type: form.doc_type,
      audience: form.audience || 'all',
      topics: form.topics
        ? form.topics.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean)
        : null,
      estimated_minutes: form.estimated_minutes ? parseInt(form.estimated_minutes, 10) : null,
      cover_image_url: form.cover_image_url || null,
      file_url: form.file_url,
    };

    if (!payload.title || !payload.file_url) {
      setSaveMsg('Title and file URL are required.');
      return;
    }

    const query = form.id
      ? supabase.from('documents').update(payload).eq('id', form.id)
      : supabase.from('documents').insert(payload);

    const { error } = await query;
    if (error) {
      setSaveMsg(`Could not save: ${error.message}`);
      return;
    }

    setSaveMsg(form.id ? 'Document updated.' : 'Document added.');
    setForm(EMPTY);
    loadDocuments();
  };

  const edit = (d) => {
    setForm({
      ...d,
      audience: d.audience || 'all',
      topics: (d.topics || []).join(', '),
      estimated_minutes: d.estimated_minutes || '',
    });
    setSaveMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (id) => {
    if (!confirm('Delete this document? This cannot be undone.')) return;
    await supabase.from('documents').delete().eq('id', id);
    loadDocuments();
  };

  if (status === 'loading') {
    return (
      <Layout>
        <div className="msg-wrap">
          <p>Loading…</p>
        </div>
        <style jsx>{`
          .msg-wrap {
            max-width: 500px;
            margin: 0 auto;
            padding: 100px 24px;
            text-align: center;
            color: var(--muted);
          }
        `}</style>
      </Layout>
    );
  }

  if (status === 'unauthorized') {
    return (
      <Layout>
        <div className="msg-wrap">
          <p className="msg-title">Not authorized</p>
          <p className="msg-sub">This page is only visible to admin accounts.</p>
        </div>
        <style jsx>{`
          .msg-wrap {
            max-width: 500px;
            margin: 0 auto;
            padding: 100px 24px;
            text-align: center;
          }
          .msg-title {
            font-size: 1.3rem;
            font-weight: 800;
            color: var(--ink);
            margin-bottom: 10px;
          }
          .msg-sub {
            font-size: 0.9rem;
            color: var(--muted);
            line-height: 1.6;
          }
        `}</style>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Manage Library | SafeHaven</title>
      </Head>

      <section className="page-header">
        <p className="eyebrow">Admin</p>
        <h1>Manage guides &amp; ebooks</h1>
        <p className="sub">
          Upload the PDF to Supabase Storage first, then paste its public
          URL below. See the note at the bottom for how.
        </p>
      </section>

      <section className="content">
        <form className="form-card" onSubmit={save}>
          <p className="form-title">{form.id ? 'Edit document' : 'Add a new document'}</p>

          <div className="form-grid">
            <label>
              Title
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </label>
            <label>
              Author
              <input
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
              />
            </label>
            <label>
              Type
              <select
                value={form.doc_type}
                onChange={(e) => setForm({ ...form, doc_type: e.target.value })}
              >
                <option value="ebook">Ebook</option>
                <option value="quick_guide">Quick guide</option>
              </select>
            </label>
            <label>
              Estimated read time (minutes)
              <input
                type="number"
                value={form.estimated_minutes}
                onChange={(e) => setForm({ ...form, estimated_minutes: e.target.value })}
              />
            </label>
            <label>
              Audience
              <select
                value={form.audience}
                onChange={(e) => setForm({ ...form, audience: e.target.value })}
              >
                <option value="all">Everyone</option>
                <option value="under18">Under 18</option>
                <option value="18plus">18+</option>
              </select>
            </label>
          </div>
          <p className="audience-hint">
            Controls which section of the Library this shows up in. &quot;Everyone&quot;
            appears in both the Under 18 and 18+ sections; the other two options
            only appear in their matching section.
          </p>

          <label className="full">
            Description
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>

          <label className="full">
            Topics (comma separated, used for search filters)
            <input
              value={form.topics}
              onChange={(e) => setForm({ ...form, topics: e.target.value })}
              placeholder="e.g. rights, legal, children"
            />
          </label>

          <label className="full">
            File URL (the PDF link)
            <input
              value={form.file_url}
              onChange={(e) => setForm({ ...form, file_url: e.target.value })}
              placeholder="https://your-project.supabase.co/storage/v1/object/public/documents/my-ebook.pdf"
              required
            />
          </label>

          <label className="full">
            Cover image URL (optional)
            <input
              value={form.cover_image_url}
              onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })}
            />
          </label>

          <div className="form-actions">
            <button type="submit" className="save-btn">
              {form.id ? 'Save changes' : 'Add document'}
            </button>
            {form.id && (
              <button type="button" className="cancel-btn" onClick={() => setForm(EMPTY)}>
                Cancel edit
              </button>
            )}
            {saveMsg && <span className="save-msg">{saveMsg}</span>}
          </div>
        </form>

        <div className="how-to">
          <p className="how-to-title">How to get a file URL, step by step</p>
          <ol>
            <li>In Supabase, go to Storage (left sidebar)</li>
            <li>
              Create a bucket called <code>documents</code> if it doesn&apos;t exist yet, and
              mark it Public
            </li>
            <li>Upload your PDF into that bucket (drag and drop works)</li>
            <li>Click the uploaded file, choose &quot;Get URL&quot; / copy the public URL</li>
            <li>Paste that URL into the File URL field above</li>
          </ol>
        </div>

        <div className="list">
          {documents.map((d) => (
            <div className="list-row" key={d.id}>
              <div>
                <p className="list-name">{d.title}</p>
                <p className="list-sub">
                  {d.doc_type === 'ebook' ? 'Ebook' : 'Quick guide'}
                  {' · '}
                  {AUDIENCE_LABELS[d.audience] || AUDIENCE_LABELS.all}
                  {d.topics?.length ? ` · ${d.topics.join(', ')}` : ''}
                </p>
              </div>
              <div className="list-actions">
                <button onClick={() => edit(d)}>Edit</button>
                <button className="delete" onClick={() => remove(d.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
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
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--rose);
          margin-bottom: 16px;
        }
        .page-header h1 {
          font-size: clamp(1.7rem, 3.6vw, 2.3rem);
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 12px;
        }
        .sub {
          font-size: 0.9rem;
          color: var(--muted);
          line-height: 1.6;
        }

        .content {
          max-width: 720px;
          margin: 0 auto;
          padding: 20px 24px 100px;
        }

        .form-card {
          background: var(--warm);
          border-radius: 16px;
          padding: 26px;
          margin-bottom: 24px;
        }
        .form-title {
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 16px;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 14px;
        }
        .audience-hint {
          font-size: 0.78rem;
          color: var(--muted);
          margin: -6px 0 14px;
          line-height: 1.5;
        }
        label {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--ink);
        }
        label.full {
          margin-bottom: 14px;
        }
        input,
        textarea,
        select {
          border: 1px solid var(--sand);
          border-radius: 8px;
          padding: 9px 12px;
          font-size: 0.85rem;
          font-family: inherit;
          color: var(--ink);
        }

        .form-actions {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .save-btn {
          background: var(--rose);
          color: white;
          border: none;
          padding: 11px 24px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
        }
        .cancel-btn {
          background: none;
          border: 1px solid var(--sand);
          padding: 11px 18px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.82rem;
          color: var(--muted);
          cursor: pointer;
        }
        .save-msg {
          font-size: 0.8rem;
          color: var(--rose-deep);
          font-weight: 600;
        }

        .how-to {
          background: var(--teal-light);
          border-radius: 12px;
          padding: 20px 24px;
          margin-bottom: 30px;
        }
        .how-to-title {
          font-weight: 800;
          color: var(--ink);
          font-size: 0.88rem;
          margin-bottom: 10px;
        }
        .how-to ol {
          padding-left: 20px;
          font-size: 0.82rem;
          color: var(--ink);
          line-height: 1.8;
        }
        .how-to code {
          background: white;
          padding: 1px 6px;
          border-radius: 4px;
          font-size: 0.8rem;
        }

        .list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .list-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          border: 1px solid var(--sand);
          border-radius: 10px;
          padding: 14px 18px;
        }
        .list-name {
          font-weight: 700;
          color: var(--ink);
          font-size: 0.9rem;
        }
        .list-sub {
          font-size: 0.78rem;
          color: var(--muted);
        }
        .list-actions {
          display: flex;
          gap: 8px;
        }
        .list-actions button {
          background: var(--blush);
          border: none;
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--ink);
          cursor: pointer;
        }
        .list-actions button.delete {
          background: #fde2e2;
          color: #b91c1c;
        }

        @media (max-width: 600px) {
          .form-grid {
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
