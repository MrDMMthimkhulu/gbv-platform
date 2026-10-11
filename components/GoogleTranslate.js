import { useEffect, useState } from 'react';

// Languages offered in the picker. First one is the site's own language.
const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'zu', label: 'isiZulu' },
  { code: 'xh', label: 'isiXhosa' },
  { code: 'af', label: 'Afrikaans' },
  { code: 'nso', label: 'Sepedi' },
  { code: 'tn', label: 'Setswana' },
  { code: 'st', label: 'Sesotho' },
  { code: 'ts', label: 'Xitsonga' },
  { code: 'ss', label: 'siSwati' },
  { code: 've', label: 'Tshivenda' },
  { code: 'nr', label: 'isiNdebele' },
];

const COOKIE = 'googtrans';

function readLang() {
  try {
    const m = document.cookie.match(/(?:^|;\s*)googtrans=\/[^/]*\/([^;]+)/);
    return m ? decodeURIComponent(m[1]) : 'en';
  } catch (e) {
    return 'en';
  }
}

function writeLang(code) {
  const host = window.location.hostname;
  if (code === 'en') {
    const past = 'expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    document.cookie = `${COOKIE}=; ${past}`;
    document.cookie = `${COOKIE}=; ${past}; domain=${host}`;
  } else {
    document.cookie = `${COOKIE}=/en/${code}; path=/`;
  }
}

export default function GoogleTranslate() {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    setLang(readLang());

    // Google rewrites text nodes, which can make React throw when it later
    // removes or inserts nodes. These two patches are the standard fix.
    if (!window.__ghTranslatePatched) {
      window.__ghTranslatePatched = true;
      const origRemove = Node.prototype.removeChild;
      Node.prototype.removeChild = function (child) {
        if (child.parentNode !== this) return child;
        return origRemove.apply(this, arguments);
      };
      const origInsert = Node.prototype.insertBefore;
      Node.prototype.insertBefore = function (newNode, ref) {
        if (ref && ref.parentNode !== this) return newNode;
        return origInsert.apply(this, arguments);
      };
    }

    if (readLang() === 'en') return; // nothing to translate, skip loading Google

    window.googleTranslateInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: 'en', autoDisplay: false },
        'google_translate_element'
      );
    };
    if (!document.getElementById('google-translate-script')) {
      const s = document.createElement('script');
      s.id = 'google-translate-script';
      s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateInit';
      s.async = true;
      document.body.appendChild(s);
    }
  }, []);

  const onChange = (e) => {
    const code = e.target.value;
    setLang(code);
    writeLang(code);
    window.location.reload();
  };

  return (
    <>
      <select
        aria-label="Choose language (automatic translation)"
        className="lang-select notranslate"
        value={lang}
        onChange={onChange}
        translate="no"
      >
        {LANGS.map((l) => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
      <div id="google_translate_element" style={{ display: 'none' }} />
    </>
  );
}
