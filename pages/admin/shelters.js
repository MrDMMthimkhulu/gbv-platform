import { useEffect, useState } from 'react';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/Layout';
import { supabase } from '../../lib/supabaseClient';

const EMPTY_SHELTER = {
  id: null,
  name: '',
  facility_type: 'shelter',
  province: '',
  district: '',
  address: '',
  phone: '',
  email: '',
  services: '',
  latitude: '',
  longitude: '',
  tooltip: '',
};

const EMPTY_HOTSPOT = {
  id: null,
  station: '',
  province: '',
  district: '',
  latitude: '',
  longitude: '',
  designated_2020: false,
  tooltip: '',
};

// Free geocoding, no API key, runs in the ADMIN'S browser (not a server),
// which is why this works even though the same call isn't reachable from
// a locked-down sandbox. Nominatim's usage policy asks for light traffic;
// fine for occasional admin use, not for bulk automated geocoding.
async function geocode(address) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
      address
    )}`
  );
  const data = await res.json();
  if (data && data[0]) {
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  }
  return null;
}

export default function AdminSheltersPage() {
  const [status, setStatus] = useState('loading');
  const [tab, setTab] = useState('shelters');

  const [shelters, setShelters] = useState([]);
  const [hotspots, setHotspots] = useState([]);

  const [shelterForm, setShelterForm] = useState(EMPTY_SHELTER);
  const [hotspotForm, setHotspotForm] = useState(EMPTY_HOTSPOT);

  const [geocoding, setGeocoding] = useState(false);
  const [geocodeMsg, setGeocodeMsg] = useState('');
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        setStatus('unauthorized');
        return;
      }
      const { data: adminResult } = await supabase.rpc('is_admin');
      if (!adminResult) {
        setStatus('unauthorized');
        return;
      }
      setStatus('ready');
      loadData();
    });
  }, []);

  const loadData = async () => {
    const { data: s } = await supabase.from('shelters').select('*').order('name');
    setShelters(s || []);
    const { data: h } = await supabase.from('hotspots').select('*').order('station');
    setHotspots(h || []);
  };

  // ---------- Shelters ----------

  const handleGeocodeShelter = async () => {
    if (!shelterForm.address) return;
    setGeocoding(true);
    setGeocodeMsg('');
    const result = await geocode(shelterForm.address);
    setGeocoding(false);
    if (result) {
      setShelterForm((f) => ({ ...f, latitude: result.lat, longitude: result.lng }));
      setGeocodeMsg('Found coordinates. Check the pin lands in the right place after saving.');
    } else {
      setGeocodeMsg('Could not find that address, try a more general version (e.g. just the town), or enter coordinates manually.');
    }
  };

  const saveShelter = async (e) => {
    e.preventDefault();
    setSaveMsg('');
    const payload = {
      name: shelterForm.name,
      facility_type: shelterForm.facility_type || 'shelter',
      province: shelterForm.province,
      district: shelterForm.district || null,
      address: shelterForm.address,
      phone: shelterForm.phone || null,
      email: shelterForm.email || null,
      services: shelterForm.services
        ? shelterForm.services.split(',').map((s) => s.trim()).filter(Boolean)
        : null,
      latitude: parseFloat(shelterForm.latitude),
      longitude: parseFloat(shelterForm.longitude),
      tooltip: shelterForm.tooltip || null,
    };

    if (!payload.name || !payload.province || Number.isNaN(payload.latitude) || Number.isNaN(payload.longitude)) {
      setSaveMsg('Name, province, and coordinates are required.');
      return;
    }

    const query = shelterForm.id
      ? supabase.from('shelters').update(payload).eq('id', shelterForm.id)
      : supabase.from('shelters').insert(payload);

    const { error } = await query;
    if (error) {
      setSaveMsg(`Could not save: ${error.message}`);
      return;
    }

    setSaveMsg(shelterForm.id ? 'Shelter updated.' : 'Shelter added.');
    setShelterForm(EMPTY_SHELTER);
    loadData();
  };

  const editShelter = (s) => {
    setShelterForm({
      ...s,
      email: s.email || '',
      facility_type: s.facility_type || 'shelter',
      services: (s.services || []).join(', '),
    });
    setSaveMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteShelter = async (id) => {
    if (!confirm('Delete this shelter? This cannot be undone.')) return;
    await supabase.from('shelters').delete().eq('id', id);
    loadData();
  };

  // ---------- Hotspots ----------

  const handleGeocodeHotspot = async () => {
    const query = `${hotspotForm.station}, ${hotspotForm.province}, South Africa`;
    setGeocoding(true);
    setGeocodeMsg('');
    const result = await geocode(query);
    setGeocoding(false);
    if (result) {
      setHotspotForm((f) => ({ ...f, latitude: result.lat, longitude: result.lng }));
      setGeocodeMsg('Found coordinates. Check the pin lands in the right place after saving.');
    } else {
      setGeocodeMsg('Could not find that place, try entering coordinates manually.');
    }
  };

  const saveHotspot = async (e) => {
    e.preventDefault();
    setSaveMsg('');
    const payload = {
      station: hotspotForm.station,
      province: hotspotForm.province,
      district: hotspotForm.district || null,
      latitude: parseFloat(hotspotForm.latitude),
      longitude: parseFloat(hotspotForm.longitude),
      designated_2020: !!hotspotForm.designated_2020,
      tooltip: hotspotForm.tooltip || null,
    };

    if (!payload.station || !payload.province || Number.isNaN(payload.latitude) || Number.isNaN(payload.longitude)) {
      setSaveMsg('Station name, province, and coordinates are required.');
      return;
    }

    const query = hotspotForm.id
      ? supabase.from('hotspots').update(payload).eq('id', hotspotForm.id)
      : supabase.from('hotspots').insert(payload);

    const { error } = await query;
    if (error) {
      setSaveMsg(`Could not save: ${error.message}`);
      return;
    }

    setSaveMsg(hotspotForm.id ? 'Hotspot updated.' : 'Hotspot added.');
    setHotspotForm(EMPTY_HOTSPOT);
    loadData();
  };

  const editHotspot = (h) => {
    setHotspotForm(h);
    setSaveMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteHotspot = async (id) => {
    if (!confirm('Delete this hotspot? This cannot be undone.')) return;
    await supabase.from('hotspots').delete().eq('id', id);
    loadData();
  };

  if (status === 'loading') {
    return (
      <Layout>
        <div className="msg-wrap">
          <p>Loading…</p>
        </div>
        <style jsx>{`
          .msg-wrap {
            max-width: 500px;
            margin: 0 auto;
            padding: 100px 24px;
            text-align: center;
            color: var(--muted);
          }
        `}</style>
      </Layout>
    );
  }

  if (status === 'unauthorized') {
    return (
      <Layout>
        <div className="msg-wrap">
          <p className="msg-title">Not authorized</p>
          <p className="msg-sub">This page is only visible to admin accounts.</p>
        </div>
        <style jsx>{`
          .msg-wrap {
            max-width: 500px;
            margin: 0 auto;
            padding: 100px 24px;
            text-align: center;
          }
          .msg-title {
            font-size: 1.3rem;
            font-weight: 800;
            color: var(--ink);
            margin-bottom: 10px;
          }
          .msg-sub {
            font-size: 0.9rem;
            color: var(--muted);
            line-height: 1.6;
          }
        `}</style>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Manage Map Data | SafeHaven</title>
      </Head>

      <section className="page-header">
        <p className="eyebrow">Admin</p>
        <h1>Manage shelters &amp; hotspots</h1>
        <p className="sub">Changes here appear on the Find Help map immediately.</p>
      </section>

      <section className="content">
        <div className="tab-row">
          <button
            className={`tab-btn ${tab === 'shelters' ? 'active' : ''}`}
            onClick={() => setTab('shelters')}
          >
            Shelters ({shelters.length})
          </button>
          <button
            className={`tab-btn ${tab === 'hotspots' ? 'active' : ''}`}
            onClick={() => setTab('hotspots')}
          >
            Hotspots ({hotspots.length})
          </button>
        </div>

        {tab === 'shelters' && (
          <>
            <form className="form-card" onSubmit={saveShelter}>
              <p className="form-title">
                {shelterForm.id ? 'Edit shelter' : 'Add a new shelter'}
              </p>

              <div className="form-grid">
                <label>
                  Name
                  <input
                    value={shelterForm.name}
                    onChange={(e) => setShelterForm({ ...shelterForm, name: e.target.value })}
                    required
                  />
                </label>
                <label>
                  Facility type
                  <select
                    value={shelterForm.facility_type}
                    onChange={(e) =>
                      setShelterForm({ ...shelterForm, facility_type: e.target.value })
                    }
                  >
                    <option value="shelter">Shelter / service</option>
                    <option value="tcc">Thuthuzela Care Centre</option>
                    <option value="fcs">SAPS FCS Unit</option>
                  </select>
                </label>
                <label>
                  Province
                  <input
                    value={shelterForm.province}
                    onChange={(e) => setShelterForm({ ...shelterForm, province: e.target.value })}
                    required
                  />
                </label>
                <label>
                  District
                  <input
                    value={shelterForm.district}
                    onChange={(e) => setShelterForm({ ...shelterForm, district: e.target.value })}
                  />
                </label>
                <label>
                  Phone
                  <input
                    value={shelterForm.phone}
                    onChange={(e) => setShelterForm({ ...shelterForm, phone: e.target.value })}
                  />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    value={shelterForm.email}
                    onChange={(e) => setShelterForm({ ...shelterForm, email: e.target.value })}
                  />
                </label>
              </div>

              <label className="full">
                Address (for geocoding)
                <input
                  value={shelterForm.address}
                  onChange={(e) => setShelterForm({ ...shelterForm, address: e.target.value })}
                  placeholder="e.g. Shelter name, Suburb, City, South Africa"
                  required
                />
              </label>

              <label className="full">
                Services (comma separated)
                <input
                  value={shelterForm.services}
                  onChange={(e) => setShelterForm({ ...shelterForm, services: e.target.value })}
                  placeholder="e.g. Shelter, Counselling, Legal aid"
                />
              </label>

              <div className="geocode-row">
                <button
                  type="button"
                  className="geocode-btn"
                  onClick={handleGeocodeShelter}
                  disabled={geocoding || !shelterForm.address}
                >
                  {geocoding ? 'Looking up…' : 'Look up coordinates'}
                </button>
                {geocodeMsg && <p className="geocode-msg">{geocodeMsg}</p>}
              </div>

              <div className="form-grid">
                <label>
                  Latitude
                  <input
                    value={shelterForm.latitude}
                    onChange={(e) => setShelterForm({ ...shelterForm, latitude: e.target.value })}
                    required
                  />
                </label>
                <label>
                  Longitude
                  <input
                    value={shelterForm.longitude}
                    onChange={(e) => setShelterForm({ ...shelterForm, longitude: e.target.value })}
                    required
                  />
                </label>
              </div>

              <label className="full">
                Tooltip (shown in the map popup)
                <textarea
                  rows={2}
                  value={shelterForm.tooltip}
                  onChange={(e) => setShelterForm({ ...shelterForm, tooltip: e.target.value })}
                />
              </label>

              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {shelterForm.id ? 'Save changes' : 'Add shelter'}
                </button>
                {shelterForm.id && (
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShelterForm(EMPTY_SHELTER)}
                  >
                    Cancel edit
                  </button>
                )}
                {saveMsg && <span className="save-msg">{saveMsg}</span>}
              </div>
            </form>

            <div className="list">
              {shelters.map((s) => (
                <div className="list-row" key={s.id}>
                  <div>
                    <p className="list-name">
                      {s.name}
                      {s.facility_type === 'tcc' && (
                        <span className="type-badge tcc"> TCC</span>
                      )}
                      {s.facility_type === 'fcs' && (
                        <span className="type-badge fcs"> FCS</span>
                      )}
                    </p>
                    <p className="list-sub">
                      {s.province} {s.district ? `· ${s.district}` : ''}
                    </p>
                  </div>
                  <div className="list-actions">
                    <button onClick={() => editShelter(s)}>Edit</button>
                    <button className="delete" onClick={() => deleteShelter(s.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'hotspots' && (
          <>
            <form className="form-card" onSubmit={saveHotspot}>
              <p className="form-title">
                {hotspotForm.id ? 'Edit hotspot' : 'Add a new hotspot'}
              </p>

              <div className="form-grid">
                <label>
                  Station / area name
                  <input
                    value={hotspotForm.station}
                    onChange={(e) => setHotspotForm({ ...hotspotForm, station: e.target.value })}
                    required
                  />
                </label>
                <label>
                  Province
                  <input
                    value={hotspotForm.province}
                    onChange={(e) => setHotspotForm({ ...hotspotForm, province: e.target.value })}
                    required
                  />
                </label>
                <label>
                  District
                  <input
                    value={hotspotForm.district || ''}
                    onChange={(e) => setHotspotForm({ ...hotspotForm, district: e.target.value })}
                  />
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={!!hotspotForm.designated_2020}
                    onChange={(e) =>
                      setHotspotForm({ ...hotspotForm, designated_2020: e.target.checked })
                    }
                  />
                  Officially designated (2020)
                </label>
              </div>

              <div className="geocode-row">
                <button
                  type="button"
                  className="geocode-btn"
                  onClick={handleGeocodeHotspot}
                  disabled={geocoding || !hotspotForm.station || !hotspotForm.province}
                >
                  {geocoding ? 'Looking up…' : 'Look up coordinates'}
                </button>
                {geocodeMsg && <p className="geocode-msg">{geocodeMsg}</p>}
              </div>

              <div className="form-grid">
                <label>
                  Latitude
                  <input
                    value={hotspotForm.latitude}
                    onChange={(e) => setHotspotForm({ ...hotspotForm, latitude: e.target.value })}
                    required
                  />
                </label>
                <label>
                  Longitude
                  <input
                    value={hotspotForm.longitude}
                    onChange={(e) => setHotspotForm({ ...hotspotForm, longitude: e.target.value })}
                    required
                  />
                </label>
              </div>

              <label className="full">
                Tooltip (shown in the map popup)
                <textarea
                  rows={2}
                  value={hotspotForm.tooltip || ''}
                  onChange={(e) => setHotspotForm({ ...hotspotForm, tooltip: e.target.value })}
                />
              </label>

              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {hotspotForm.id ? 'Save changes' : 'Add hotspot'}
                </button>
                {hotspotForm.id && (
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setHotspotForm(EMPTY_HOTSPOT)}
                  >
                    Cancel edit
                  </button>
                )}
                {saveMsg && <span className="save-msg">{saveMsg}</span>}
              </div>
            </form>

            <div className="list">
              {hotspots.map((h) => (
                <div className="list-row" key={h.id}>
                  <div>
                    <p className="list-name">{h.station}</p>
                    <p className="list-sub">
                      {h.province} {h.district ? `· ${h.district}` : ''}
                      {h.designated_2020 ? ' · 2020 designated' : ''}
                    </p>
                  </div>
                  <div className="list-actions">
                    <button onClick={() => editHotspot(h)}>Edit</button>
                    <button className="delete" onClick={() => deleteHotspot(h.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <style jsx>{`
        .page-header {
          max-width: 700px;
          margin: 0 auto;
          text-align: center;
          padding: 60px 24px 30px;
        }
        .eyebrow {
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--rose);
          margin-bottom: 16px;
        }
        .page-header h1 {
          font-size: clamp(1.7rem, 3.6vw, 2.3rem);
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 12px;
        }
        .sub {
          font-size: 0.92rem;
          color: var(--muted);
        }

        .content {
          max-width: 720px;
          margin: 0 auto;
          padding: 20px 24px 100px;
        }

        .tab-row {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
        }
        .tab-btn {
          background: var(--warm);
          border: none;
          border-radius: 999px;
          padding: 10px 18px;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--muted);
          cursor: pointer;
        }
        .tab-btn.active {
          background: var(--rose);
          color: white;
        }

        .form-card {
          background: var(--warm);
          border-radius: 16px;
          padding: 26px;
          margin-bottom: 30px;
        }
        .form-title {
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 16px;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 14px;
        }
        label {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--ink);
        }
        label.full {
          margin-bottom: 14px;
        }
        label.checkbox-label {
          flex-direction: row;
          align-items: center;
          gap: 8px;
        }
        input,
        select,
        textarea {
          border: 1px solid var(--sand);
          border-radius: 8px;
          padding: 9px 12px;
          font-size: 0.85rem;
          font-family: inherit;
          color: var(--ink);
        }

        .geocode-row {
          margin-bottom: 14px;
        }
        .geocode-btn {
          background: var(--teal);
          color: white;
          border: none;
          padding: 9px 18px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.82rem;
          cursor: pointer;
        }
        .geocode-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .geocode-msg {
          font-size: 0.78rem;
          color: var(--muted);
          margin-top: 8px;
        }

        .form-actions {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 6px;
        }
        .save-btn {
          background: var(--rose);
          color: white;
          border: none;
          padding: 11px 24px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
        }
        .cancel-btn {
          background: none;
          border: 1px solid var(--sand);
          padding: 11px 18px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.82rem;
          color: var(--muted);
          cursor: pointer;
        }
        .save-msg {
          font-size: 0.8rem;
          color: var(--rose-deep);
          font-weight: 600;
        }

        .list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .list-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          border: 1px solid var(--sand);
          border-radius: 10px;
          padding: 14px 18px;
        }
        .list-name {
          font-weight: 700;
          color: var(--ink);
          font-size: 0.9rem;
        }
        .type-badge {
          font-size: 0.68rem;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 999px;
          letter-spacing: 0.03em;
        }
        .type-badge.tcc {
          background: #fce7f3;
          color: #9d174d;
        }
        .type-badge.fcs {
          background: #dbeafe;
          color: #1e3a8a;
        }
        .list-sub {
          font-size: 0.78rem;
          color: var(--muted);
        }
        .list-actions {
          display: flex;
          gap: 8px;
        }
        .list-actions button {
          background: var(--blush);
          border: none;
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--ink);
          cursor: pointer;
        }
        .list-actions button.delete {
          background: #fde2e2;
          color: #b91c1c;
        }

        @media (max-width: 600px) {
          .form-grid {
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
