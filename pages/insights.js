import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../components/Layout';
import {
  LAST_UPDATED,
  UNDERREPORTING_NOTE,
  NATIONAL_HEADLINES,
  PROVINCES,
  TREND_FLAGS,
  NATIONAL_CASE_TYPES,
} from '../lib/gbvData';

// Leaflet needs the browser, this must never render on the server.
const HotspotDataMap = dynamic(() => import('../components/HotspotDataMap'), {
  ssr: false,
  loading: () => <p className="map-loading">Loading map…</p>,
});

const CASE_TYPE_COLORS = ['var(--rose-deep)', 'var(--rose)', '#0f6e63', 'var(--plum)', '#eab308'];

export default function InsightsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/insights')
      .then((res) => res.json())
      .then((json) => {
        if (!json.error) setData(json);
      })
      .catch(() => {});
  }, []);

  const provincesByRapeRate = [...PROVINCES].sort((a, b) => b.rape.rate - a.rape.rate);
  const maxRate = provincesByRapeRate[0].rape.rate;

  return (
    <Layout>
      <Head>
        <title>Data Insights | SafeHaven</title>
        <meta
          name="description"
          content="Verified SAPS and HSRC data on GBV in South Africa, and how GBV services are distributed across provinces."
        />
      </Head>

      <section className="page-header">
        <p className="eyebrow">Data intelligence</p>
        <h1>The data behind the crisis</h1>
        <p className="sub">
          Verified figures from SAPS and HSRC, visualised to show where GBV
          is reported most, and where help is hardest to find.
        </p>
      </section>

      <section className="disclaimer">
        <p>{UNDERREPORTING_NOTE}</p>
      </section>

      <section className="content">
        <div className="block">
          <div className="headline-grid">
            {NATIONAL_HEADLINES.map((h) => (
              <div className="headline-card" key={h.label}>
                <p className="headline-value">{h.value}</p>
                <p className="headline-label">{h.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card-grid">
          <div className="card">
            <h2>Reported Cases by Province</h2>
            <p className="card-sub">SAPS Q3 2024/25 · rape rate per 100k</p>
            <div className="bar-list">
              {provincesByRapeRate.map((p) => (
                <div className="bar-row" key={p.name}>
                  <span className="bar-label">{p.name}</span>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ width: `${(p.rape.rate / maxRate) * 100}%` }}
                    />
                  </div>
                  <span className="bar-value">{p.rape.rate}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2>GBV Case Types</h2>
            <p className="card-sub">DV-linked cases · SAPS Q3 2024/25</p>
            <div className="donut-row">
              <div
                className="donut"
                style={{ background: donutGradient(NATIONAL_CASE_TYPES) }}
              >
                <div className="donut-hole" />
              </div>
              <div className="donut-legend">
                {NATIONAL_CASE_TYPES.map((c, i) => (
                  <div className="legend-item" key={c.label}>
                    <span
                      className="legend-dot"
                      style={{ background: CASE_TYPE_COLORS[i % CASE_TYPE_COLORS.length] }}
                    />
                    <span>
                      {c.label} ({c.pct}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="block">
          <h2>What the Trends Show</h2>
          <div className="flag-list">
            {TREND_FLAGS.map((f) => (
              <div className="flag-card" key={f.tag}>
                <p className="flag-tag">{f.tag}</p>
                <p className="flag-text">{f.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="block">
          <h2>Resource Gap Index</h2>
          <p className="card-sub">Cases per verified service · higher = bigger gap</p>
          {data && !data.coverageStats.unavailable ? (
            <GapTiles coverage={data.coverageStats.byProvince} />
          ) : (
            <p className="empty-note">
              Shelter data isn&apos;t connected yet, once linked, this will
              show real service counts against reported cases per province.
            </p>
          )}
        </div>

        <div className="block">
          <h2>GBV Hotspot Map</h2>
          <p className="card-sub">Amber pins mark known hotspot areas</p>
          <HotspotDataMap />
        </div>

        <div className="block sources">
          <p>
            Sources: SAPS Quarterly Crime Statistics (Q3 2024/25, Q3 2025/26,
            Q4 2025/26), SAPS Annual Crime Report, Stats SA GPSJS 2024/25, and
            the HSRC First South African National GBV Study. Last updated{' '}
            {LAST_UPDATED}.
          </p>
        </div>
      </section>

      <style jsx>{`
        .page-header {
          max-width: 720px;
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
          letter-spacing: -0.02em;
        }
        .sub {
          font-size: 1rem;
          line-height: 1.6;
          color: var(--muted);
          max-width: 500px;
          margin: 0 auto;
        }

        .disclaimer {
          max-width: 900px;
          margin: 0 auto 20px;
          padding: 0 24px;
        }
        .disclaimer p {
          background: var(--warm);
          border-left: 3px solid var(--rose);
          border-radius: 8px;
          padding: 14px 18px;
          font-size: 0.85rem;
          line-height: 1.6;
          color: var(--ink);
        }

        .content {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px 24px 100px;
        }
        .block {
          margin-bottom: 48px;
        }
        .block h2 {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 6px;
        }
        .card-sub {
          font-size: 0.82rem;
          color: var(--muted);
          margin-bottom: 18px;
        }
        .empty-note {
          font-size: 0.9rem;
          color: var(--muted);
          background: var(--warm);
          border-radius: 10px;
          padding: 18px 20px;
        }
        :global(.map-loading) {
          text-align: center;
          padding: 60px;
          color: var(--muted);
        }

        .headline-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }
        .headline-card {
          background: var(--blush);
          border-radius: 12px;
          padding: 18px;
        }
        .headline-value {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--rose-deep);
          margin-bottom: 6px;
        }
        .headline-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--ink);
          line-height: 1.4;
        }

        .card-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 48px;
        }
        .card {
          background: white;
          border: 1px solid var(--sand);
          border-radius: 14px;
          padding: 24px;
        }
        .card h2 {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 4px;
        }

        .bar-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .bar-row {
          display: grid;
          grid-template-columns: 100px 1fr 34px;
          align-items: center;
          gap: 8px;
        }
        .bar-label {
          font-size: 0.78rem;
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
          border-radius: 6px;
          background: linear-gradient(90deg, var(--rose) 0%, var(--rose-deep) 100%);
        }
        .bar-value {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--rose-deep);
          text-align: right;
        }

        .donut-row {
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }
        .donut {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .donut-hole {
          width: 62%;
          height: 62%;
          background: white;
          border-radius: 50%;
        }
        .donut-legend {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          color: var(--ink);
        }
        .legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .flag-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .flag-card {
          background: var(--teal-light);
          border-radius: 10px;
          padding: 16px 18px;
        }
        .flag-tag {
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--ink);
          margin-bottom: 6px;
        }
        .flag-text {
          font-size: 0.85rem;
          color: var(--ink);
          line-height: 1.55;
        }

        .sources p {
          font-size: 0.78rem;
          color: var(--muted);
          line-height: 1.6;
          border-top: 1px solid var(--sand);
          padding-top: 20px;
        }

        @media (max-width: 760px) {
          .headline-grid {
            grid-template-columns: 1fr 1fr;
          }
          .card-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </Layout>
  );
}

function donutGradient(caseTypes) {
  let acc = 0;
  const stops = caseTypes.map((c, i) => {
    const start = acc;
    acc += c.pct;
    return `${CASE_TYPE_COLORS[i % CASE_TYPE_COLORS.length]} ${start}% ${acc}%`;
  });
  return `conic-gradient(${stops.join(', ')})`;
}

function GapTiles({ coverage }) {
  const rows = PROVINCES.map((p) => {
    const services = coverage[p.name] || 0;
    const perService = services > 0 ? p.sexualOffences.cases / services : null;
    return { name: p.name, cases: p.sexualOffences.cases, services, perService };
  });

  const ranked = rows.filter((r) => r.perService !== null).sort((a, b) => b.perService - a.perService);
  const tierFor = (r) => {
    const idx = ranked.indexOf(r);
    const pct = idx / Math.max(ranked.length - 1, 1);
    if (pct <= 0.25) return { label: 'Critical gap', className: 'critical' };
    if (pct <= 0.5) return { label: 'High gap', className: 'high' };
    if (pct <= 0.75) return { label: 'Moderate gap', className: 'moderate' };
    return { label: 'Low gap', className: 'low' };
  };

  const sorted = [...rows].sort((a, b) => (b.perService || 0) - (a.perService || 0));

  return (
    <div className="gap-grid">
      {sorted.map((r) => {
        const tier = r.perService !== null ? tierFor(r) : { label: 'No data', className: 'nodata' };
        return (
          <div className="gap-tile" key={r.name}>
            <p className="gap-name">{r.name}</p>
            <p className={`gap-value ${tier.className}`}>
              {r.perService !== null ? r.perService.toFixed(1) : '—'}
            </p>
            <p className="gap-tier">{tier.label}</p>
          </div>
        );
      })}
      <style jsx>{`
        .gap-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }
        .gap-tile {
          background: var(--warm);
          border-radius: 12px;
          padding: 18px 16px;
        }
        .gap-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 8px;
        }
        .gap-value {
          font-size: 1.6rem;
          font-weight: 800;
          margin-bottom: 4px;
        }
        .gap-value.critical {
          color: #b91c1c;
        }
        .gap-value.high {
          color: var(--rose-deep);
        }
        .gap-value.moderate {
          color: #b45309;
        }
        .gap-value.low {
          color: var(--teal);
        }
        .gap-value.nodata {
          color: var(--muted);
        }
        .gap-tier {
          font-size: 0.75rem;
          color: var(--muted);
          font-weight: 600;
        }
        @media (max-width: 600px) {
          .gap-grid {
            grid-template-columns: repeat(2, 1fr);
          }
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
