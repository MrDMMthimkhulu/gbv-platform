import { useEffect, useState } from 'react';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabaseClient';

export default function AboutAbusePage() {
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
        <title>Is This Abuse? | SafeHaven</title>
        <meta
          name="description"
          content="Understand the different forms abuse can take, and recognise the signs, in plain, non-judgmental language."
        />
      </Head>

      <div>

      {isGirl && (
        <div className="mode-badge">
          <span>A space made just for you</span>
        </div>
      )}

      {isGirl ? (
        <section className="page-header">
          <p className="eyebrow">Real talk</p>
          <h1>If it feels wrong, it probably is</h1>
          <p className="sub">
            Yelling isn&apos;t the only kind of abuse. Sometimes it&apos;s
            quiet, confusing, or makes you feel crazy for noticing. You&apos;re
            not crazy. Here&apos;s what it can actually look like.
          </p>
        </section>
      ) : (
        <section className="page-header">
          <p className="eyebrow">Is this abuse?</p>
          <h1>Abuse doesn&apos;t always look like you&apos;d expect</h1>
          <p className="sub">
            Under South African law, abuse isn&apos;t only physical. If
            something here sounds familiar, you&apos;re not overreacting,
            and you&apos;re not alone.
          </p>
        </section>
      )}

      <section className="types">
        <div className="type-card">
          <p className="type-label">Physical</p>
          <p className="type-text">
            Hitting, slapping, pushing, choking, or any use of force against
            you, including threats of physical harm, even if never carried
            out.
          </p>
        </div>
        <div className="type-card">
          <p className="type-label">Emotional &amp; psychological</p>
          <p className="type-text">
            Constant criticism, humiliation, threats, blame, or being made
            to feel like everything is your fault. Isolating you from
            friends and family also falls under this.
          </p>
        </div>
        <div className="type-card">
          <p className="type-label">Financial</p>
          <p className="type-text">
            Controlling your money, stopping you from working, taking your
            income, or keeping you financially dependent so you feel you
            can&apos;t leave.
          </p>
        </div>
        <div className="type-card">
          <p className="type-label">Sexual</p>
          <p className="type-text">
            Any sexual act or contact without your full, freely given
            consent, including within a marriage or relationship.
          </p>
        </div>
        <div className="type-card">
          <p className="type-label">Coercive control</p>
          <p className="type-text">
            A pattern of controlling behaviour, monitoring your phone,
            dictating what you wear, who you see, or where you go, that
            builds fear and dependence over time.
          </p>
        </div>
        <div className="type-card">
          <p className="type-label">Stalking &amp; digital abuse</p>
          <p className="type-text">
            Unwanted tracking, repeated contact after being told to stop,
            monitoring your online activity, or sharing private images
            without consent.
          </p>
        </div>
      </section>

      <section className="patterns">
        <h2>Some things worth paying attention to</h2>
        <ul>
          <li>You feel like you&apos;re constantly walking on eggshells.</li>
          <li>You find yourself apologising for things that aren&apos;t your fault.</li>
          <li>You&apos;ve stopped seeing friends or family as often.</li>
          <li>You feel afraid of how they&apos;ll react to ordinary things.</li>
          <li>You&apos;ve changed your behaviour to avoid conflict, even in small ways.</li>
        </ul>
        <p className="patterns-note">
          None of these on their own prove abuse, and only you know your
          situation. But if several of these feel familiar, it&apos;s worth
          talking to someone. You don&apos;t need to have all the answers
          before you reach out.
        </p>
      </section>

      {isGirl ? (
        <section className="cta">
          <h2>Telling someone isn&apos;t snitching</h2>
          <p>
            A parent, teacher, coach, Childline &mdash; anyone you trust.
            You don&apos;t need the perfect words. Just start talking.
          </p>
          <div className="cta-actions">
            <Link href="/support" className="btn-primary">Call Childline now</Link>
            <Link href="/chat" className="btn-secondary">Ask first, quietly</Link>
          </div>
        </section>
      ) : (
        <section className="cta">
          <h2>You don&apos;t have to figure out what to call it first</h2>
          <p>
            You don&apos;t need a label to deserve support. Whether you want
            to understand your legal options or just talk to someone, both
            are here when you&apos;re ready.
          </p>
          <div className="cta-actions">
            <Link href="/rights" className="btn-primary">Know your rights</Link>
            <Link href="/support" className="btn-secondary">Talk to someone</Link>
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
        .page-header {
          max-width: 720px;
          margin: 0 auto;
          text-align: center;
          padding: 70px 24px 50px;
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
          font-size: 1rem;
          line-height: 1.65;
          color: var(--muted);
          max-width: 500px;
          margin: 0 auto;
        }

        .types {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 24px 70px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .type-card {
          background: var(--warm);
          border-radius: 12px;
          padding: 24px 20px;
        }
        .type-label {
          font-size: 0.98rem;
          font-weight: 800;
          color: var(--rose-deep);
          margin-bottom: 10px;
        }
        .type-text {
          font-size: 0.88rem;
          line-height: 1.6;
          color: var(--muted);
        }

        .patterns {
          max-width: 640px;
          margin: 0 auto;
          padding: 0 24px 70px;
        }
        .patterns h2 {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 20px;
          text-align: center;
        }
        .patterns ul {
          padding-left: 20px;
          margin-bottom: 20px;
        }
        .patterns li {
          font-size: 0.98rem;
          line-height: 1.8;
          color: var(--muted);
        }
        .patterns-note {
          font-size: 0.9rem;
          line-height: 1.65;
          color: var(--muted);
          background: var(--blush);
          border-radius: 10px;
          padding: 18px 20px;
        }

        .cta {
          background: var(--ink);
          color: white;
          text-align: center;
          padding: 80px 24px;
        }
        .cta h2 {
          font-size: 1.6rem;
          font-weight: 800;
          margin-bottom: 14px;
          max-width: 520px;
          margin-left: auto;
          margin-right: auto;
        }
        .cta p {
          font-size: 0.98rem;
          color: var(--sand);
          margin-bottom: 32px;
          max-width: 460px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.6;
        }
        .cta-actions {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .cta-actions :global(.btn-primary) {
          background: var(--rose);
          color: white;
          padding: 15px 30px;
          font-weight: 700;
          font-size: 0.92rem;
          text-decoration: none;
          border-radius: 8px;
        }
        .cta-actions :global(.btn-secondary) {
          background: transparent;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.25);
          padding: 15px 30px;
          font-weight: 700;
          font-size: 0.92rem;
          text-decoration: none;
          border-radius: 8px;
        }

        @media (max-width: 760px) {
          .types {
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
