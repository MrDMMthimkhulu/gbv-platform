import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabaseClient';

export default function RightsPage() {
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
        <title>Know Your Rights | SafeHaven</title>
        <meta
          name="description"
          content="Plain-language guide to protection orders and your legal rights under South African law."
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

      <section className="page-header">
        <p className="eyebrow">Know your rights</p>
        <h1>Protection orders &amp; the law</h1>
        <p className="sub">
          This is general information, not legal advice for your specific
          situation. For free legal help, call Legal Aid South Africa on{' '}
          <a href="tel:0800110110">0800 110 110</a> (weekdays, 7am–7pm).
        </p>
        <Link href="/wizard" className="wizard-cta">
          Not sure where to start? Answer 5 quick questions →
        </Link>
      </section>

      {isGirl && (
        <section className="girl-banner">
          <p className="girl-banner-title">Real talk if you&apos;re under 18</p>
          <p className="girl-banner-text">
            You can&apos;t usually do the court thing alone, you&apos;ll
            need an adult on your side. Sounds annoying, but Childline can
            help you work out who that could be, fast and privately.
          </p>
          <a href="tel:116" className="girl-banner-link">Call Childline: 116</a>
        </section>
      )}

      <section className="content">
        <div className="block">
          <h2>What counts as domestic violence</h2>
          <p>
            Under the Domestic Violence Act, abuse isn&apos;t only physical.
            It includes emotional, verbal, sexual, financial, and
            psychological harassment, damage to property, stalking, entering
            your home without consent, and coercive or controlling behaviour.
            You don&apos;t need visible injuries to apply for a protection
            order.
          </p>
          <p>
            It also covers people beyond spouses, partners, ex-partners,
            family members, someone you share a child with, or someone you
            currently or previously lived with.
          </p>
        </div>

        <div className="block">
          <h2>What a protection order does</h2>
          <p>
            A protection order is a court order that legally stops the
            abuser from contacting, threatening, or coming near you. It can
            prevent them from entering your home, your workplace, or a
            specific part of a shared residence, and from getting someone
            else to act on their behalf.
          </p>
        </div>

        <div className="block">
          <h2>How to apply: step by step</h2>
          <ol>
            <li>
              Go to the Magistrate&apos;s Court nearest to where you live or
              work, or your temporary address, if you&apos;ve had to leave
              home. This service is free.
            </li>
            <li>
              Ask to speak to the Clerk of the Court. They will help you
              complete Form 6 (the application) and Form 6A, which keeps
              your personal details confidential from the person you&apos;re
              applying against.
            </li>
            <li>
              You&apos;ll write an affidavit describing what happened:
              dates, incidents, and any evidence such as messages, photos,
              or witnesses. This is a sworn statement, so it needs to be
              accurate.
            </li>
            <li>
              A Magistrate reviews your application. An interim protection
              order can often be granted the same day, and this service is
              available 24 hours in an emergency.
            </li>
            <li>
              The order must then be formally served on the abuser by a
              Sheriff or police officer, not by you personally. Once
              served, it&apos;s legally enforceable.
            </li>
            <li>
              A final hearing follows, where the order can be made
              permanent. It stays in place until a court changes it.
            </li>
          </ol>
        </div>

        <div className="block">
          <h2>Other legal options</h2>
          <p>
            Depending on your situation, you may also be able to apply for
            custody protection for your children, or open a criminal case
            with SAPS in addition to a protection order. These are separate
            legal processes. Legal Aid South Africa can advise which apply
            to you, free of charge if you qualify.
          </p>
        </div>

        <div className="block">
          <h2>Guides to keep</h2>
          <p className="guides-note">
            Downloadable versions of this information are on their way, so
            you can save or print them for reference even without signal.
          </p>
          <div className="guides-grid">
            <div className="guide-card">
              <span className="guide-badge">PDF</span>
              <p className="guide-title">Protection Orders, Step by Step</p>
              <p className="guide-desc">
                How to apply, what it costs (nothing), and what happens in
                court.
              </p>
              <span className="guide-status">Coming soon</span>
            </div>
            <div className="guide-card">
              <span className="guide-badge">PDF</span>
              <p className="guide-title">Your Rights After Sexual Assault</p>
              <p className="guide-desc">
                What to expect at a Thuthuzela Care Centre and your reporting
                options.
              </p>
              <span className="guide-status">Coming soon</span>
            </div>
          </div>
        </div>

        <div className="contacts">
          <h2>Who to contact</h2>
          <div className="contact-grid">
            <div className="contact-card">
              <p className="contact-name">Legal Aid South Africa</p>
              <p className="contact-detail">Free legal advice, weekdays 7am–7pm</p>
              <a href="tel:0800110110">0800 110 110</a>
            </div>
            <div className="contact-card">
              <p className="contact-name">GBV Command Centre</p>
              <p className="contact-detail">24/7 crisis support &amp; referrals</p>
              <a href="tel:0800428428">0800 428 428</a>
            </div>
            <div className="contact-card">
              <p className="contact-name">SAPS Emergency</p>
              <p className="contact-detail">Immediate danger</p>
              <a href="tel:10111">10111</a>
            </div>
          </div>
        </div>
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
          font-size: 1rem;
          line-height: 1.6;
          color: var(--muted);
          max-width: 520px;
          margin: 0 auto;
        }
        .sub :global(a) {
          color: var(--rose-deep);
          font-weight: 700;
        }
        :global(.wizard-cta) {
          display: inline-block;
          margin-top: 22px;
          background: var(--rose);
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 700;
          text-decoration: none;
        }

        .girl-banner {
          max-width: 640px;
          margin: 0 auto 40px;
          padding: 22px 26px;
          background: var(--blush);
          border-radius: 14px;
          text-align: center;
        }
        .girl-banner-title {
          font-size: 0.78rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--rose-deep);
          margin-bottom: 10px;
        }
        .girl-banner-text {
          font-size: 0.92rem;
          line-height: 1.6;
          color: var(--ink);
          margin-bottom: 14px;
        }
        .girl-banner-link {
          display: inline-block;
          background: var(--rose);
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 700;
          text-decoration: none;
        }

        .content {
          max-width: 700px;
          margin: 0 auto;
          padding: 0 24px 60px;
        }
        .block {
          margin-bottom: 48px;
        }
        .block h2 {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 14px;
        }
        .block p {
          font-size: 0.98rem;
          line-height: 1.7;
          color: var(--muted);
          margin-bottom: 12px;
        }
        .block ol {
          padding-left: 20px;
        }
        .block ol li {
          font-size: 0.98rem;
          line-height: 1.7;
          color: var(--muted);
          margin-bottom: 16px;
        }

        .guides-note {
          font-size: 0.92rem;
          color: var(--muted);
          margin-bottom: 20px;
        }
        .guides-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        .guide-card {
          background: var(--blush);
          border-radius: 12px;
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
          font-size: 0.98rem;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 6px;
        }
        .guide-desc {
          font-size: 0.85rem;
          color: var(--muted);
          line-height: 1.55;
          margin-bottom: 16px;
          flex-grow: 1;
        }
        .guide-status {
          align-self: flex-start;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--rose-deep);
          border: 1px solid var(--rose-deep);
          padding: 5px 12px;
          border-radius: 999px;
        }

        @media (max-width: 700px) {
          .guides-grid {
            grid-template-columns: 1fr;
          }
        }

        .contacts {
          margin-top: 60px;
        }
        .contacts h2 {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 20px;
          text-align: center;
        }
        .contact-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .contact-card {
          background: var(--blush);
          border-radius: 12px;
          padding: 22px 18px;
          text-align: center;
        }
        .contact-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 6px;
        }
        .contact-detail {
          font-size: 0.8rem;
          color: var(--muted);
          margin-bottom: 12px;
        }
        .contact-card :global(a) {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--rose-deep);
          text-decoration: none;
        }

        @media (max-width: 700px) {
          .contact-grid {
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
