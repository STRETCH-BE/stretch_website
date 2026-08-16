// Barrel for analytics components. <AnalyticsScripts /> mounts every platform
// loader; each no-ops when its env var is missing or consent is withheld.
// ConsentModeDefaults is mounted separately in the root layout (it must render
// into <head> synchronously, before any of these).
import GoogleAnalytics from './google-analytics';
import Clarity from './clarity';
import MetaPixel from './meta-pixel';
import PostHog from './posthog';

export { default as ConsentModeDefaults } from './consent-mode-defaults';

export function AnalyticsScripts() {
  return (
    <>
      <GoogleAnalytics />
      <Clarity />
      <MetaPixel />
      <PostHog />
    </>
  );
}
