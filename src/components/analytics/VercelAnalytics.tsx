'use client';

// Vercel Web Analytics (pageviews by country / path in the Vercel project —
// Michael enables "Web Analytics" in Project → Analytics; nothing else to
// configure, no env var, the script is served by the deployment itself at
// /_vercel/insights/script.js). Gated on the ANALYTICS consent category
// exactly like Clarity: nothing is mounted until analytics consent is
// granted, and `beforeSend` drops every event once consent is withdrawn
// mid-session (the script, once loaded, cannot be unloaded). Added with the
// Switzerland 1-month review (2 Oct 2026).
import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { getConsent, CONSENT_UPDATE_EVENT, type ConsentPreferences } from '@/lib/consent';

export default function VercelAnalytics() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const sync = () => setAllowed(Boolean(getConsent()?.analytics));
    sync();
    const onUpdate = (e: Event) => {
      const detail = (e as CustomEvent<ConsentPreferences>).detail;
      setAllowed(Boolean(detail?.analytics ?? getConsent()?.analytics));
    };
    window.addEventListener(CONSENT_UPDATE_EVENT, onUpdate);
    return () => window.removeEventListener(CONSENT_UPDATE_EVENT, onUpdate);
  }, []);

  if (!allowed) return null;
  // Re-checked per event: a revoke after the script loaded still sends nothing.
  return <Analytics beforeSend={(event) => (getConsent()?.analytics ? event : null)} />;
}
