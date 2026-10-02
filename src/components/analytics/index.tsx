// Barrel for analytics components. <AnalyticsScripts /> mounts every platform
// loader; each no-ops when its env var is missing or consent is withheld.
// ConsentModeDefaults + ScrollTracker are mounted separately in the layout
// (ConsentModeDefaults must render into <head> synchronously, before these).
import GoogleAnalytics from './GoogleAnalytics';
import Clarity from './Clarity';
import MetaPixel from './MetaPixel';
import BingUET from './BingUET';
import VercelAnalytics from './VercelAnalytics';

export { default as ConsentModeDefaults } from './ConsentModeDefaults';
export { default as ScrollTracker } from './ScrollTracker';
export { default as GoogleAnalytics } from './GoogleAnalytics';
export { default as Clarity } from './Clarity';
export { default as MetaPixel } from './MetaPixel';
export { default as BingUET } from './BingUET';
export { default as VercelAnalytics } from './VercelAnalytics';

export function AnalyticsScripts() {
  return (
    <>
      <GoogleAnalytics />
      <Clarity />
      <MetaPixel />
      <BingUET />
      {/* Vercel Web Analytics — consent-gated like Clarity (2 Oct 2026). */}
      <VercelAnalytics />
    </>
  );
}
