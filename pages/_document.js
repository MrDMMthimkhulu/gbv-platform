import { Html, Head, Main, NextScript } from 'next/document';

// Runs before the page paints. It does two things:
//  1. Applies the saved colour theme (no flash of the wrong colours).
//  2. Back-button protection for Quick Exit: if this tab has just used
//     Quick Exit and the person lands back on the site with the Back or
//     Forward button, send them straight back to the exit page.
//     (Keep EXIT_URL in sync with components/QuickExitButton.js.)
const earlyScript = `
try {
  var t = localStorage.getItem('sh-theme');
  if (t) document.documentElement.setAttribute('data-theme', t);
} catch (e) {}
try {
  var EXIT_URL = 'https://weather.com';
  var nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
  var cameBack = nav && nav.type === 'back_forward';
  if (sessionStorage.getItem('sh-exited')) {
    if (cameBack) { location.replace(EXIT_URL); }
    else { sessionStorage.removeItem('sh-exited'); }
  }
  window.addEventListener('pageshow', function (e) {
    if (e.persisted && sessionStorage.getItem('sh-exited')) location.replace(EXIT_URL);
  });
} catch (e) {}
`;

export default function Document() {
  return (
    <Html>
      <Head>
        <script dangerouslySetInnerHTML={{ __html: earlyScript }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
