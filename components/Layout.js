import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import QuickExitButton from './QuickExitButton';
import { supabase } from '../lib/supabaseClient';

export default function Layout({ children }) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      if (data.session?.user) checkAdmin();
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) checkAdmin();
      else setIsAdmin(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const checkAdmin = async () => {
    const { data } = await supabase.rpc('is_admin');
    setIsAdmin(!!data);
  };

  useEffect(() => {
    const closeMenu = () => setMenuOpen(false);
    router.events.on('routeChangeStart', closeMenu);
    return () => router.events.off('routeChangeStart', closeMenu);
  }, [router.events]);

  const changeLanguage = (e) => {
    const locale = e.target.value;
    router.push(router.pathname, router.asPath, { locale });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <>
      <QuickExitButton label={t('quick_exit')} />

      <nav>
        <Link href="/" className="logo">SafeHaven</Link>

        <button
          className="menu-toggle"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </button>

        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li className="dropdown">
            <span className="dropdown-trigger">{t('nav_get_help')} ▾</span>
            <ul className="dropdown-menu">
              <li><Link href="/map">{t('nav_find_help')}</Link></li>
              <li><Link href="/rights">{t('nav_rights')}</Link></li>
              <li><Link href="/support">{t('nav_support')}</Link></li>
            </ul>
          </li>

          <li><Link href="/chat" className="nav-cta">{t('nav_ai_specialist')}</Link></li>

          <li className="dropdown">
            <span className="dropdown-trigger">{t('nav_learn')} ▾</span>
            <ul className="dropdown-menu">
              <li><Link href="/learn">{t('nav_learning_hub')}</Link></li>
              <li><Link href="/library">{t('nav_library')}</Link></li>
            </ul>
          </li>

          <li><Link href="/insights">{t('nav_our_data')}</Link></li>

          {user ? (
            <li className="dropdown">
              <span className="dropdown-trigger auth-link">{t('nav_account')} ▾</span>
              <ul className="dropdown-menu">
                <li><Link href="/profile">{t('nav_profile')}</Link></li>
                <li><Link href="/progress">{t('nav_my_progress')}</Link></li>
                {isAdmin && <li><Link href="/admin">{t('nav_admin')}</Link></li>}
                <li>
                  <button className="auth-btn" onClick={handleLogout}>{t('nav_logout')}</button>
                </li>
              </ul>
            </li>
          ) : (
            <li>
              <Link href="/login" className="auth-link">{t('nav_login')}</Link>
            </li>
          )}

          <li>
            <select
              aria-label="Choose language"
              className="lang-select"
              value={router.locale}
              onChange={changeLanguage}
            >
              <option value="en">English</option>
              <option value="af">Afrikaans</option>
              <option value="nr">isiNdebele</option>
              <option value="xh">isiXhosa</option>
              <option value="zu">isiZulu</option>
              <option value="nso">Sepedi</option>
              <option value="st">Sesotho</option>
              <option value="tn">Setswana</option>
              <option value="ss">siSwati</option>
              <option value="ve">Tshivenda</option>
              <option value="ts">Xitsonga</option>
            </select>
          </li>
        </ul>
      </nav>

      <main>{children}</main>

      <footer>
        <div className="footer-top">
          <div className="footer-brand">
            <p className="footer-logo">SafeHaven</p>
            <p className="footer-tagline">{t('footer_tagline')}</p>
          </div>
          <div className="footer-col">
            <p className="footer-heading">{t('footer_heading_support')}</p>
            <Link href="/map">{t('footer_find_shelter')}</Link>
            <Link href="/rights">{t('footer_legal_rights')}</Link>
            <Link href="/support">{t('footer_talk')}</Link>
            <Link href="/chat">Ask Jennet</Link>
          </div>
          <div className="footer-col">
            <p className="footer-heading">{t('footer_heading_platform')}</p>
            <Link href="/about-abuse">{t('footer_about_abuse')}</Link>
            <Link href="/learn">Learning Hub</Link>
            <Link href="/insights">The data behind the crisis</Link>
            <Link href="/about-us">{t('footer_about')}</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{t('footer_bottom')}</span>
          <span className="footer-emergency">GBV Command Centre: 0800 428 428</span>
        </div>
      </footer>

      <style jsx>{`
        nav {
          background: var(--white);
          padding: 0 5%;
          padding-right: calc(5% + 150px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
          position: sticky;
          top: 0;
          z-index: 1000;
          border-bottom: 1px solid var(--sand);
        }
        nav :global(.logo) {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--rose-deep);
          letter-spacing: -0.02em;
          text-decoration: none;
          flex-shrink: 0;
        }

        .menu-toggle {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
        }
        .menu-toggle span {
          width: 22px;
          height: 2px;
          background: var(--ink);
          display: block;
        }

        .nav-links {
          display: flex;
          gap: 6px;
          list-style: none;
          align-items: center;
          flex-wrap: wrap;
        }
        .nav-links :global(a) {
          text-decoration: none;
          color: var(--muted);
          font-size: 0.88rem;
          font-weight: 600;
          white-space: nowrap;
        }
        .nav-links :global(.nav-cta) {
          background: var(--rose);
          color: white !important;
          padding: 8px 16px;
          border-radius: 999px;
          font-weight: 700;
        }
        :global(.auth-link) {
          color: var(--rose-deep) !important;
        }
        .auth-btn {
          background: none;
          border: none;
          padding: 10px 16px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--ink);
          cursor: pointer;
          white-space: nowrap;
          width: 100%;
          text-align: left;
        }
        .lang-select {
          background: var(--blush);
          border: none;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 0.8rem;
          color: var(--rose-deep);
          font-weight: 600;
        }

        .dropdown {
          position: relative;
          padding: 20px 10px;
        }
        .dropdown-trigger {
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--muted);
          cursor: pointer;
          user-select: none;
        }
        .dropdown-menu {
          display: none;
          list-style: none;
          position: absolute;
          top: 100%;
          left: 10px;
          background: white;
          border: 1px solid var(--sand);
          border-radius: 10px;
          padding: 8px;
          min-width: 170px;
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
        }
        .dropdown-menu li {
          width: 100%;
        }
        .dropdown-menu :global(a),
        .dropdown-menu .auth-btn {
          display: block;
          padding: 8px 10px;
          border-radius: 6px;
          font-size: 0.85rem;
        }
        .dropdown-menu :global(a:hover),
        .dropdown-menu .auth-btn:hover {
          background: var(--blush);
        }
        .dropdown:hover .dropdown-menu {
          display: block;
        }

        @media (max-width: 860px) {
          nav {
            padding: 0 4%;
            padding-right: 90px;
          }
          .menu-toggle {
            display: flex;
          }
          .nav-links {
            display: none;
            position: absolute;
            top: 64px;
            left: 0;
            right: 0;
            background: var(--white);
            border-bottom: 1px solid var(--sand);
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
            padding: 16px 5% 20px;
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
            max-height: calc(100vh - 64px);
            overflow-y: auto;
          }
          .nav-links.open {
            display: flex;
          }
          .nav-links > li {
            width: 100%;
          }
          .nav-links :global(a) {
            display: block;
            padding: 10px 0;
            font-size: 0.95rem;
            width: 100%;
          }
          .nav-links :global(.nav-cta) {
            display: inline-block;
            width: auto;
          }
          .auth-btn,
          .lang-select {
            width: 100%;
            margin: 6px 0;
            text-align: left;
            padding: 10px 12px;
          }

          .dropdown {
            padding: 6px 0;
          }
          .dropdown-trigger {
            display: block;
            padding: 10px 0;
            font-size: 0.95rem;
          }
          .dropdown-menu {
            display: block;
            position: static;
            box-shadow: none;
            border: none;
            padding: 0 0 0 14px;
            background: none;
            min-width: 0;
          }
          .dropdown-menu :global(a) {
            padding: 8px 0;
          }
        }

        footer {
          background: var(--ink);
          padding: 60px 6% 24px;
        }
        .footer-top {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 40px;
          max-width: 1000px;
          margin: 0 auto 40px;
        }
        .footer-logo {
          font-size: 1.2rem;
          font-weight: 800;
          color: white;
          margin-bottom: 10px;
        }
        .footer-tagline {
          font-size: 0.88rem;
          color: var(--sand);
          line-height: 1.6;
          max-width: 300px;
        }
        .footer-heading {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--rose);
          margin-bottom: 14px;
        }
        .footer-col :global(a) {
          display: block;
          color: var(--sand);
          text-decoration: none;
          font-size: 0.88rem;
          margin-bottom: 10px;
        }
        .footer-bottom {
          max-width: 1000px;
          margin: 0 auto;
          border-top: 1px solid #33283c;
          padding-top: 20px;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          font-size: 0.8rem;
          color: var(--sand);
        }
        .footer-emergency {
          color: var(--rose);
          font-weight: 700;
        }

        @media (max-width: 860px) {
          .footer-top {
            grid-template-columns: 1fr;
          }
          .nav-links {
            gap: 12px;
          }
        }
      `}</style>
    </>
  );
}
