'use client';

// Google Maps embed for the contact page — consent-aware. The iframe (which
// sets Google cookies) is only loaded when the visitor has granted marketing
// consent in the cookie banner, or clicks "Load map" here. Until then the slot
// shows a dark striped panel with the button and a plain link to Google Maps
// (no cookies). Keyless embed URL — no API key or billing account. The box
// grows to fill its column (flex: 1) and is at least 380px tall.
import { useEffect, useState } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { getConsent, CONSENT_UPDATE_EVENT, type ConsentPreferences } from '@/lib/consent';

type Props = {
  /** Free-text place query, e.g. "Gentseweg 309 A3, 9120 Beveren-Waas, Belgium". */
  query: string;
  /** UI language of the map tiles/labels (BCP 47 language subtag, e.g. "de"). */
  lang: string;
  /** Accessible title for the iframe / label for the panel. */
  title: string;
  loadLabel: string;
  note: string;
  openLabel: string;
};

export default function ContactMap({ query, lang, title, loadLabel, note, openLabel }: Props) {
  const [loaded, setLoaded] = useState(false);

  // Marketing consent (now or later via the banner) loads the map by itself.
  useEffect(() => {
    if (getConsent()?.marketing) setLoaded(true);
    const onUpdate = (e: Event) => {
      const detail = (e as CustomEvent<ConsentPreferences>).detail;
      if (detail?.marketing ?? getConsent()?.marketing) setLoaded(true);
    };
    window.addEventListener(CONSENT_UPDATE_EVENT, onUpdate);
    return () => window.removeEventListener(CONSENT_UPDATE_EVENT, onUpdate);
  }, []);

  const q = encodeURIComponent(query);
  const embedSrc = `https://www.google.com/maps?q=${q}&z=15&hl=${encodeURIComponent(lang)}&output=embed`;
  const openHref = `https://www.google.com/maps/search/?api=1&query=${q}`;

  return (
    <div className="ct-map" style={{ position: 'relative', flex: '1 1 auto', minHeight: 380 }}>
      {loaded ? (
        <iframe
          src={embedSrc}
          title={title}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, filter: 'grayscale(.15)' }}
        />
      ) : (
        <div
          aria-label={title}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            padding: 24,
            textAlign: 'center',
            color: '#fff',
            background: 'repeating-linear-gradient(135deg, #171717 0 14px, #1d1d1d 14px 28px)',
          }}
        >
          <MapPin size={28} style={{ color: 'var(--red-bright)' }} />
          <button type="button" className="btn btn--primary btn--sm" onClick={() => setLoaded(true)}>
            {loadLabel}
          </button>
          <p style={{ fontSize: 12.5, lineHeight: 1.5, color: 'rgba(255,255,255,.7)', margin: 0, maxWidth: 320 }}>{note}</p>
          <a
            href={openHref}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#fff' }}
          >
            {openLabel} <ExternalLink size={14} />
          </a>
        </div>
      )}
    </div>
  );
}
