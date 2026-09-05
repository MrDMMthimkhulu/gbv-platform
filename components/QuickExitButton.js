import { useEffect } from 'react';

// Where "quick exit" sends someone. A weather site reads as an ordinary
// thing to have open and doesn't hint at why they navigated away, unlike
// a search engine which can look like a hurried cover story.
const EXIT_URL = 'https://weather.com';

// Browsers give JavaScript no API to delete existing history entries or
// address-bar autocomplete — that's a browser-level privacy control, only
// changeable by the person themselves (their browser's "clear history"
// screen), never by a page. What a page CAN do is stop new back-button
// presses from ever landing on this site again: push several extra history
// entries that all point at the exit destination before we leave, so the
// back button just replays the same harmless page instead of returning
// here. Pairs well with reminding survivors, outside the app, to also
// clear their browser history/autocomplete by hand if a device is shared.
const HISTORY_OVERWRITE_STEPS = 6;

function performExit() {
  try {
    for (let i = 0; i < HISTORY_OVERWRITE_STEPS; i++) {
      window.history.pushState(null, '', EXIT_URL);
    }
  } catch {
    // If pushState is blocked for any reason, fall back to just navigating.
  }
  window.location.replace(EXIT_URL);
}

export default function QuickExitButton({ label = 'Quick Exit' }) {
  // Esc is bound site-wide so leaving doesn't depend on finding and
  // accurately clicking a small fixed button while under stress.
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
        }
        button:hover {
          background: #9c1530;
        }
        @media (max-width: 860px) {
          button {
            top: 10px;
            right: 10px;
            padding: 7px 12px;
            font-size: 0.65rem;
            letter-spacing: 0.05em;
          }
        }
      `}</style>
    </>
  );
}
