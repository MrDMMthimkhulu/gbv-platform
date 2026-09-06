// pages/certificates/verify.js
// PUBLIC verification page - anyone can verify a certificate

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function VerifyCertificate() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(!!id);
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [verifying, setVerifying] = useState(false);

  // Auto-verify if ID in URL
  useEffect(() => {
    if (id) {
      verifyCertificate(id);
    }
  }, [id]);

  const verifyCertificate = async (certificateId) => {
    setLoading(true);
    setError(null);
    setCertificate(null);

    try {
      const res = await fetch(`/api/certificates/verify?certificateId=${certificateId}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Certificate not found');
        setCertificate(null);
      } else {
        setCertificate(data.certificate);
        // Update URL without page reload
        window.history.replaceState({}, '', `/certificates/verify?id=${certificateId}`);
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('Failed to verify certificate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      setError('Please enter a certificate ID');
      return;
    }
    setVerifying(true);
    await verifyCertificate(searchInput.trim());
    setVerifying(false);
  };

  return (
    <Layout>
      <Head>
        <title>Verify Certificate | SafeHaven</title>
        <meta name="description" content="Verify the authenticity of a SafeHaven course certificate" />
      </Head>

      <section className="verify-page">
        <div className="verify-container">
          {!certificate && !error && !loading && (
            <>
              <h1>Verify a Certificate</h1>
              <p className="subtitle">
                Enter a certificate ID to verify its authenticity
              </p>

              <form onSubmit={handleSearch} className="search-form">
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="e.g. SH-2026-01-15-A1B2-C3D4"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="cert-input"
                  />
                  <button
                    type="submit"
                    disabled={verifying}
                    className="search-btn"
                  >
                    {verifying ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
              </form>

              <div className="info-box">
                <h3>Where to find the Certificate ID</h3>
                <p>
                  The Certificate ID is printed at the bottom of your SafeHaven course certificate PDF.
                  It looks like: <span className="example">SH-2026-01-15-A1B2-C3D4</span>
                </p>
                <p>
                  You can also click the "Verify at: safehaven.org/verify" link on the certificate to automatically load your ID.
                </p>
              </div>
            </>
          )}

          {loading && (
            <div className="loading-state">
              <div className="spinner" />
              <p>Verifying certificate...</p>
            </div>
          )}

          {certificate && !error && (
            <div className="verification-success">
              <div className="success-header">
                <div className="checkmark">✓</div>
                <h1>Certificate Verified</h1>
              </div>

              <div className="cert-details">
                <div className="detail-row">
                  <span className="label">Learner Name</span>
                  <span className="value">{certificate.learnerName}</span>
                </div>

                <div className="detail-row">
                  <span className="label">Course</span>
                  <span className="value">{certificate.courseTitle}</span>
                </div>

                <div className="detail-row">
                  <span className="label">Subtitle</span>
                  <span className="value">{certificate.courseSubtitle}</span>
                </div>

                <div className="detail-row">
                  <span className="label">Assessment Score</span>
                  <span className="value">{certificate.score}/5</span>
                </div>

                <div className="detail-row">
                  <span className="label">Issued Date</span>
                  <span className="value">{certificate.issuedDate}</span>
                </div>

                <div className="detail-row">
                  <span className="label">Certificate ID</span>
                  <span className="value id">{certificate.certificateId}</span>
                </div>
              </div>

              <div className="badge-box">
                <div className="badge">
                  🎓 Verified Certificate
                </div>
              </div>

              <p className="disclaimer">
                This certificate confirms completion of the <strong>{certificate.courseTitle}</strong> course
                offered by SafeHaven. It does not confer academic credit or a professional qualification.
              </p>

              <button
                onClick={() => {
                  setSearchInput('');
                  setCertificate(null);
                  setError(null);
                  window.history.replaceState({}, '', '/certificates/verify');
                }}
                className="verify-another-btn"
              >
                ← Verify Another Certificate
              </button>
            </div>
          )}

          {error && (
            <div className="verification-error">
              <div className="error-header">
                <div className="error-icon">✗</div>
                <h1>Certificate Not Found</h1>
              </div>

              <p className="error-message">
                {error}
              </p>

              <div className="error-box">
                <p>
                  <strong>What could be wrong:</strong>
                </p>
                <ul>
                  <li>The Certificate ID may be typed incorrectly</li>
                  <li>The Certificate ID may be invalid</li>
                  <li>This certificate may not have been registered in our system</li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setSearchInput('');
                  setCertificate(null);
                  setError(null);
                  window.history.replaceState({}, '', '/certificates/verify');
                }}
                className="try-again-btn"
              >
                ← Try Another ID
              </button>
            </div>
          )}

          <div className="verify-footer">
            <Link href="/learn">← Back to Learning Hub</Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .verify-page {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--blush) 0%, white 100%);
          padding: 60px 24px 100px;
        }

        .verify-container {
          max-width: 600px;
          margin: 0 auto;
        }

        h1 {
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--ink);
          text-align: center;
          margin-bottom: 12px;
        }

        .subtitle {
          font-size: 1rem;
          color: var(--muted);
          text-align: center;
          margin-bottom: 40px;
        }

        .search-form {
          margin-bottom: 40px;
        }

        .input-group {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .cert-input {
          flex: 1;
          padding: 14px 18px;
          font-size: 0.95rem;
          border: 2px solid var(--sand);
          border-radius: 8px;
          font-family: 'Courier New', monospace;
          background: white;
          transition: all 0.3s ease;
        }

        .cert-input:focus {
          outline: none;
          border-color: var(--rose);
          box-shadow: 0 0 0 3px rgba(168, 56, 96, 0.1);
        }

        .search-btn {
          padding: 14px 32px;
          background: var(--rose);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .search-btn:hover:not(:disabled) {
          background: var(--rose-deep);
          transform: translateY(-2px);
        }

        .search-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .info-box {
          background: white;
          border-left: 4px solid var(--rose);
          padding: 24px;
          border-radius: 8px;
          margin-bottom: 40px;
        }

        .info-box h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 12px;
        }

        .info-box p {
          font-size: 0.9rem;
          color: var(--muted);
          line-height: 1.6;
          margin-bottom: 10px;
        }

        .example {
          background: var(--sand);
          padding: 4px 8px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-weight: 600;
          color: var(--ink);
        }

        .loading-state {
          text-align: center;
          padding: 60px 24px;
        }

        .spinner {
          width: 48px;
          height: 48px;
          margin: 0 auto 20px;
          border: 4px solid var(--sand);
          border-top-color: var(--rose);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .verification-success {
          background: white;
          border-radius: 12px;
          padding: 40px;
          text-align: center;
        }

        .success-header {
          margin-bottom: 30px;
        }

        .checkmark {
          width: 64px;
          height: 64px;
          background: #e8f5e9;
          border: 3px solid #4caf50;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          color: #4caf50;
          margin: 0 auto 16px;
          font-weight: bold;
        }

        .success-header h1 {
          color: #4caf50;
          margin: 0;
        }

        .cert-details {
          background: var(--warm);
          border-radius: 8px;
          padding: 24px;
          margin-bottom: 24px;
          text-align: left;
        }

        .detail-row {
          display: grid;
          grid-template-columns: 150px 1fr;
          gap: 16px;
          padding: 12px 0;
          border-bottom: 1px solid var(--sand);
          align-items: center;
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .label {
          font-weight: 700;
          color: var(--rose-deep);
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .value {
          color: var(--ink);
          font-size: 0.95rem;
        }

        .value.id {
          font-family: 'Courier New', monospace;
          font-weight: 600;
          background: white;
          padding: 8px 12px;
          border-radius: 4px;
          border: 1px solid var(--sand);
        }

        .badge-box {
          margin-bottom: 24px;
        }

        .badge {
          display: inline-block;
          background: #e8f5e9;
          border: 2px solid #4caf50;
          color: #2e7d32;
          padding: 12px 24px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .disclaimer {
          font-size: 0.85rem;
          color: var(--muted);
          line-height: 1.6;
          margin: 24px 0;
        }

        .verify-another-btn,
        .try-again-btn {
          background: var(--rose);
          color: white;
          padding: 12px 28px;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .verify-another-btn:hover,
        .try-again-btn:hover {
          background: var(--rose-deep);
          transform: translateY(-2px);
        }

        .verification-error {
          background: white;
          border-radius: 12px;
          padding: 40px;
          text-align: center;
        }

        .error-header {
          margin-bottom: 30px;
        }

        .error-icon {
          width: 64px;
          height: 64px;
          background: #ffebee;
          border: 3px solid #f44336;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          color: #f44336;
          margin: 0 auto 16px;
          font-weight: bold;
        }

        .error-header h1 {
          color: #f44336;
          margin: 0;
        }

        .error-message {
          font-size: 1rem;
          color: var(--ink);
          margin-bottom: 24px;
        }

        .error-box {
          background: #ffebee;
          border-left: 4px solid #f44336;
          padding: 20px;
          border-radius: 8px;
          text-align: left;
          margin-bottom: 24px;
        }

        .error-box p {
          font-weight: 600;
          color: #f44336;
          margin-bottom: 12px;
        }

        .error-box ul {
          margin: 0;
          padding-left: 20px;
        }

        .error-box li {
          color: var(--ink);
          line-height: 1.6;
          margin-bottom: 8px;
        }

        .verify-footer {
          text-align: center;
          margin-top: 40px;
        }

        .verify-footer :global(a) {
          color: var(--rose);
          font-weight: 700;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .verify-footer :global(a:hover) {
          color: var(--rose-deep);
        }

        @media (max-width: 600px) {
          .verify-page {
            padding: 40px 16px 60px;
          }

          h1 {
            font-size: 1.6rem;
          }

          .detail-row {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .label {
            display: block;
            margin-bottom: 4px;
          }

          .cert-details {
            padding: 16px;
          }

          .input-group {
            flex-direction: column;
          }
        }
      `}</style>
    </Layout>
  );
}
