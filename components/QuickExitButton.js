import { useEffect } from 'react';

// Where "quick exit" sends someone. A weather site reads as an ordinary
// thing to have open and doesn't hint at why they navigated away, unlike
// a search engine which can look like a hurried cover story.
const EXIT_URL = 'https://weather.com';

// IMPORTANT LIMIT: browsers give JavaScript no way to delete the browser's
// own history (the history list, address-bar suggestions) or to empty the
// back-button list. Only the person can do that, from their browser's
// "clear browsing data" screen. Pages also cannot push history entries for
// a different website, so the exit uses location.replace, which swaps this
// page out of the current history entry instead of adding to it.
//
// What a page CAN clear is its own data on the device. On exit we remove
// this site's saved login session, cookies, stored settings and cached
// files, so the next person to pick up the phone is not signed in to the
// profile (which holds the trusted contact and saved details).
const CLEAR_SITE_DATA = true;

function clearSiteData() {
  try {
    localStorage.clear(); // includes the Supabase login session
  } catch {}
  try {
    sessionStorage.clear();
  } catch {}
  try {
    document.cookie.split(';').forEach((c) => {
      const name = c.split('=')[0].trim();
      if (name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      }
    });
  } catch {}
  try {
    if (window.caches) {
      caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
    }
  } catch {}
}

// On a phone with weak data, weather.com can take several seconds to load,
// and until then the sensitive page would still be on screen. So we blank
// the screen and rename the tab straight away, then navigate.
function performExit() {
  if (CLEAR_SITE_DATA) clearSiteData();
  try {
    const cover = document.createElement('div');
    cover.style.cssText =
      'position:fixed;top:0;left:0;right:0;bottom:0;background:#ffffff;z-index:2147483647;';
    document.body.appendChild(cover);
    document.title = 'Weather';
  } catch {
    // If anything above fails, still navigate away.
  }
  window.location.replace(EXIT_URL);
}

export default function QuickExitButton({ label = 'Quick Exit' }) {
  // Esc works on laptops and keyboards. Phones have no Esc key, so on
  // mobile the on-screen button is the way out (made large enough to hit
  // quickly with a thumb, see the styles below).
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') performExit();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <>
      <button onClick={performExit} aria-label="Quick exit - leave this site immediately">
        {label}
      </button>
      <style jsx>{`
        button {
          position: fixed;
          top: 16px;
          right: 16px;
          z-index: 9999;
          background: #c41e3a;
          color: white;
          border: none;
          padding: 10px 20px;
          font-weight: 700;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 4px;
          box-shadow: 0 4px 20px rgba(196, 30, 58, 0.4);
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }
        button:hover {
          background: #9c1530;
        }
        @media (max-width: 860px) {
          button {
            top: calc(10px + env(safe-area-inset-top, 0px));
            right: calc(10px + env(safe-area-inset-right, 0px));
            min-height: 44px;
            min-width: 64px;
            padding: 0 12px;
            font-size: 0.7rem;
            letter-spacing: 0.05em;
            border-radius: 8px;
          }
        }
      `}</style>
    </>
  );
}
