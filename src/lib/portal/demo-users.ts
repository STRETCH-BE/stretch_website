// CLIENT PORTAL — demo-mode accounts (client-safe module: no server imports).
// These exist ONLY while Supabase is not configured, so the whole portal can
// be previewed with zero setup. They are listed on the demo login screen on
// purpose: demo mode is a preview feature, not a security boundary.
import type { PortalProfile } from './types';

export const DEMO_USERS: Array<PortalProfile & { password: string }> = [
  {
    id: 'demo-admin',
    email: 'admin@stretch.be',
    password: 'stretch2026',
    company: 'STRETCH HQ',
    role: 'admin',
    accountType: 'installer',
    markets: [],
    allMarkets: true,
    active: true,
  },
  {
    id: 'demo-client-west',
    email: 'demo@stretch.be',
    password: 'stretch2026',
    company: 'Demo Client BV (Installer)',
    role: 'client',
    accountType: 'installer',
    markets: [],
    allMarkets: false,
    active: true,
  },
  {
    id: 'demo-client-east',
    email: 'klient@stretch.pl',
    password: 'stretch2026',
    company: 'Demo Klient Sp. z o.o. (Producer/Reseller)',
    role: 'client',
    accountType: 'producer',
    markets: [],
    allMarkets: false,
    active: true,
  },
  {
    id: 'demo-architect',
    email: 'architect@stretch.be',
    password: 'stretch2026',
    company: 'Demo Architecten BV',
    role: 'client',
    accountType: 'architect',
    markets: [],
    allMarkets: false,
    active: true,
    office: 'Demo Architecten BV',
    city: 'Antwerpen',
  },
];

export function findDemoUser(email: string, password: string) {
  const e = email.trim().toLowerCase();
  return DEMO_USERS.find((u) => u.email === e && u.password === password) ?? null;
}
