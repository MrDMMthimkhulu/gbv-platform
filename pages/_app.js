import { useEffect } from 'react';
import '../styles/globals.css';
import 'leaflet/dist/leaflet.css';
import { appWithTranslation } from 'next-i18next';
import { supabase } from '../lib/supabaseClient';

function applyTheme(ageGroup) {
  const theme = ageGroup === 'under18' ? 'girl' : 'default';
  document.documentElement.setAttribute('data-theme', theme);
  try {
    localStorage.setItem('sh-theme', theme);
  } catch (e) {}
}

function App({ Component, pageProps }) {
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      applyTheme(data.session?.user?.user_metadata?.age_group);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      applyTheme(session?.user?.user_metadata?.age_group);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return <Component {...pageProps} />;
}

export default appWithTranslation(App);
