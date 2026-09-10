import { useEffect, useState } from 'react';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabaseClient';

export default function SupportPage() {
  const [ageGroup, setAgeGroup] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setAgeGroup(data.user?.user_metadata?.age_group ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setAgeGroup(session?.user?.user_metadata?.age_group ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const isGirl = ageGroup === 'under18';

  return (
    <Layout>
      <Head>
        <title>Talk to Someone | SafeHaven</title>
        <meta
          name="description"
          content="Free, confidential hotlines and counselling services for GBV survivors in South Africa, available any time."
        />
      </Head>

      <div
      <div>
        }
      >

      {isGirl && (
        <div className="mode-badge">
          <span>A space made just for you</span>
        </div>
      )}

      {isGirl ? (
        <section className="page-header">
          <p className="eyebrow">You don&apos;t have to do this alone</p>
          <h1>Someone&apos;s ready to listen right now</h1>
          <p className="sub">
            Free, secret, and yours to use whenever. If you&apos;re worried
            about anyone seeing this, hit Quick Exit and try again from a
            phone that&apos;s actually yours.
          </p>
        </section>
      ) : (
        <section className="page-header">
          <p className="eyebrow">Talk to someone</p>
          <h1>You don&apos;t have to carry this alone</h1>
          <p className="sub">
            All of the services below are free and confidential.
          </p>
        </section>
      )}

      <section className="urgent">
        {isGirl ? (
          <>
            <div className="urgent-card">
              <p className="urgent-label">Talk to someone right now</p>
              <p className="urgent-name">Childline</p>
              <a href="tel:116" className="urgent-number">116</a>
            </div>
            <div className="urgent-card">
              <p className="urgent-label">In immediate danger</p>
              <p className="urgent-name">SAPS Emergency</p>
              <a href="tel:10111" className="urgent-number">10111</a>
            </div>
          </>
        ) : (
          <>
            <div className="urgent-card">
              <p className="urgent-label">In immediate danger</p>
              <p className="urgent-name">SAPS Emergency</p>
              <a href="tel:10111" className="urgent-number">10111</a>
            </div>
            <div className="urgent-card">
              <p className="urgent-label">24/7 crisis support &amp; referrals</p>
              <p className="urgent-name">GBV Command Centre</p>
              <a href="tel:0800428428" className="urgent-number">0800 428 428</a>
            </div>
          </>
        )}
      </section>

      <section className="content">
        {isGirl && <ChildlineCard isGirl={isGirl} />}

        <div className="group">
          <h2>Counselling &amp; emotional support</h2>
          <div className="contact-list">
            <div className="contact-row">
              <div>
                <p className="c-name">Lifeline South Africa</p>
                <p className="c-desc">24-hour trauma &amp; crisis counselling</p>
              </div>
              <a href="tel:0861322322">0861 322 322</a>
            </div>
            <div className="contact-row">
              <div>
                <p className="c-name">Stop Gender Violence Helpline</p>
                <p className="c-desc">National helpline for abuse survivors</p>
              </div>
              <a href="tel:0800150150">0800 150 150</a>
            </div>
            <div className="contact-row">
              <div>
                <p className="c-name">TEARS Foundation</p>
                <p className="c-desc">24/7 GBV crisis line &amp; support</p>
              </div>
              <a href="tel:0800083277">0800 083 277</a>
            </div>
          </div>
        </div>

        <div className="group">
          <h2>Legal &amp; rights support</h2>
          <div className="contact-list">
            <div className="contact-row">
              <div>
                <p className="c-name">Legal Aid South Africa</p>
                <p className="c-desc">Free legal advice, weekdays 7am–7pm</p>
              </div>
              <a href="tel:0800110110">0800 110 110</a>
            </div>
            <div className="contact-row">
              <div>
                <p className="c-name">POWA</p>
                <p className="c-desc">Counselling, legal support &amp; shelter referrals</p>
              </div>
              <a href="tel:0766945911">076 694 5911</a>
            </div>
          </div>
        </div>

        <div className="group">
          <h2>Guides to keep</h2>
          <p className="guides-note">
            Downloadable versions of this information are on their way, so
            you can save or print them for reference even without signal.
          </p>
          <div className="guides-grid">
            <div className="guide-card">
              <span className="guide-badge">eBook</span>
              <p className="guide-title">Building a Safety Plan</p>
              <p className="guide-desc">
                Covers the leaving period specifically, since danger often
                increases right after you go: recognising escalation, a
                code word with people you trust, where to go immediately,
                evidence to keep for a protection order, money he
                doesn&apos;t know about, and a plan for children and
                devices. Includes a plan for staying safer if you&apos;re
                not able to leave yet.
              </p>
              <span className="guide-status">Coming soon</span>
            </div>
            <div className="guide-card">
              <span className="guide-badge">eBook</span>
              <p className="guide-title">After the Shelter: Rebuilding</p>
              <p className="guide-desc">
                What comes after safety: understanding trauma responses like
                hypervigilance or trauma bonding, rebuilding a support
                network an abuser may have cut you off from, staying safe
                if you share custody, and practical first steps on housing,
                income, and finalising any protection order.
              </p>
              <span className="guide-status">Coming soon</span>
            </div>
          </div>
        </div>

        {!isGirl && <ChildlineCard isGirl={isGirl} />}
      </section>

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
        .page-header {
          max-width: 720px;
          margin: 0 auto;
          text-align: center;
          padding: 70px 24px 40px;
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
          letter-spacing: -0.02em;
        }
        .sub {
          font-size: 0.98rem;
          line-height: 1.65;
          color: var(--muted);
          max-width: 540px;
          margin: 0 auto;
        }

        .urgent {
          max-width: 700px;
          margin: 0 auto;
          padding: 0 24px 50px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .urgent-card {
          background: var(--rose-deep);
          color: white;
          border-radius: 12px;
          padding: 24px 20px;
          text-align: center;
        }
        .urgent-label {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--blush);
          margin-bottom: 10px;
        }
        .urgent-name {
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 10px;
        }
        .urgent-number {
          font-size: 1.5rem;
          font-weight: 800;
          color: white;
          text-decoration: none;
        }

        .content {
          max-width: 700px;
          margin: 0 auto;
          padding: 0 24px 90px;
        }
        .group {
          margin-bottom: 44px;
        }
        .group h2 {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 16px;
        }
        .contact-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .contact-row {
          background: var(--warm);
          border-radius: 10px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .c-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 3px;
        }
        .c-desc {
          font-size: 0.82rem;
          color: var(--muted);
        }
        .contact-row a {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--rose-deep);
          text-decoration: none;
          white-space: nowrap;
        }
        .note {
          font-size: 0.85rem;
          color: var(--muted);
          margin-top: 12px;
          line-height: 1.6;
        }

        .guides-note {
          font-size: 0.88rem;
          color: var(--muted);
          margin-bottom: 16px;
        }
        .guides-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        .guide-card {
          background: var(--warm);
          border-radius: 10px;
          padding: 20px 18px;
          display: flex;
          flex-direction: column;
        }
        .guide-badge {
          align-self: flex-start;
          background: var(--rose-deep);
          color: white;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 999px;
          margin-bottom: 12px;
        }
        .guide-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 6px;
        }
        .guide-desc {
          font-size: 0.82rem;
          color: var(--muted);
          line-height: 1.55;
          margin-bottom: 16px;
          flex-grow: 1;
        }
        .guide-status {
          align-self: flex-start;
          font-size: 0.76rem;
          font-weight: 700;
          color: var(--rose-deep);
          border: 1px solid var(--rose-deep);
          padding: 5px 12px;
          border-radius: 999px;
        }

        @media (max-width: 600px) {
          .urgent {
            grid-template-columns: 1fr;
          }
          .guides-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </Layout>
  );
}

function ChildlineCard({ isGirl }) {
  return (
    <div className="group">
      <h2>{isGirl ? 'Call this first' : "If you're under 18"}</h2>
      <div className="contact-list">
        <div className="contact-row">
          <div>
            <p className="c-name">Childline South Africa</p>
            <p className="c-desc">
              {isGirl
                ? "They won't judge you, and it's totally free"
                : '24/7, free, and confidential, for children and teens facing abuse of any kind'}
            </p>
          </div>
          <a href="tel:116">116</a>
        </div>
      </div>
      <p className="note">
        {isGirl
          ? "They won't force you to do anything. They'll just help you figure out your next move."
          : "Childline will always try to help you talk to a trusted adult. You won't be forced to do anything you're not ready for."}
      </p>

      <style jsx>{`
        .group {
          margin-bottom: 44px;
        }
        .group h2 {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 16px;
        }
        .contact-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .contact-row {
          background: var(--warm);
          border-radius: 10px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .c-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 3px;
        }
        .c-desc {
          font-size: 0.82rem;
          color: var(--muted);
        }
        .contact-row a {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--rose-deep);
          text-decoration: none;
          white-space: nowrap;
        }
        .note {
          font-size: 0.85rem;
          color: var(--muted);
          margin-top: 12px;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
