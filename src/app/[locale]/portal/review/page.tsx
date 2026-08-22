// CLIENT PORTAL — signed account review (/portal/review?t=<token>).
// Opened from the admin notification email; also reachable signed-in as an
// admin (?id=<userId>, no token needed). The page itself is a GET and changes
// NOTHING — mail scanners pre-fetch links, so every mutation is a POST from
// the buttons on the card (/api/portal/review). A tampered or expired token
// renders a tiny branded "link expired" page pointing to /portal/admin.
import { setRequestLocale } from 'next-intl/server';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getAdminSession } from '@/lib/portal/auth';
import { createServiceClient, isSupabaseConfigured } from '@/lib/portal/supabase';
import { checkReviewToken } from '@/lib/portal/review-token';
import { canonicalEmail } from '@/lib/spam/email';
import { normalizeAccountType } from '@/lib/portal/types';
import ReviewCard, { type ReviewProfile } from '@/components/portal/ReviewCard';
import PortalLink from '@/components/ui/PortalLink';

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <section className="container" style={{ padding: 'clamp(40px,6vw,80px) 0' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>{children}</div>
    </section>
  );
}

function ExpiredNotice() {
  return (
    <Shell>
      <div style={{ border: '1px solid var(--border)', background: '#fff', padding: 'clamp(26px,4vw,44px)', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 24, textTransform: 'uppercase', letterSpacing: '-.01em', marginBottom: 10 }}>
          Link expired<span style={{ color: 'var(--red)' }}>.</span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 14.5, lineHeight: 1.6, margin: '0 0 22px' }}>
          This review link is no longer valid. Sign in to the portal and open the account list instead.
        </p>
        <PortalLink href="/portal/admin" className="btn btn--primary">
          Open the admin panel
        </PortalLink>
      </div>
    </Shell>
  );
}

export default async function PortalReviewPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: { t?: string; id?: string };
}) {
  const locale = (isValidLocale(params.locale) ? params.locale : 'en') as Locale;
  setRequestLocale(locale);

  if (!isSupabaseConfigured()) return <ExpiredNotice />;

  // Authorization mirror of the API: valid token OR admin session.
  const tokenUserId = checkReviewToken(searchParams?.t);
  let userId = tokenUserId;
  if (!userId) {
    const session = await getAdminSession();
    if (!session || session.demo) return <ExpiredNotice />;
    userId = String(searchParams?.id ?? '');
  }
  if (!userId) return <ExpiredNotice />;

  const service = createServiceClient();
  if (!service) return <ExpiredNotice />;

  const { data: p } = await service
    .from('portal_users')
    .select(
      'id, email, company, role, account_type, markets, all_markets, active, pending_reason, contact_name, vat, phone, country, business_type, office, city, created_at, signup_ip, signup_host, signup_ua, signup_locale',
    )
    .eq('id', userId)
    .maybeSingle();

  if (!p || p.role === 'admin') {
    // Already handled (rejected accounts are deleted) — or not reviewable.
    return (
      <Shell>
        <div style={{ border: '1px solid var(--border)', background: '#fff', padding: 'clamp(26px,4vw,44px)', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 24, textTransform: 'uppercase', marginBottom: 10 }}>
            Nothing to review<span style={{ color: 'var(--red)' }}>.</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14.5, lineHeight: 1.6, margin: '0 0 22px' }}>
            This account no longer exists — it was probably already handled.
          </p>
          <PortalLink href="/portal/admin" className="btn btn--primary">
            Open the admin panel
          </PortalLink>
        </div>
      </Shell>
    );
  }

  // Email confirmation state from the auth user (best effort).
  let emailConfirmed: boolean | null = null;
  try {
    const { data: au } = await service.auth.admin.getUserById(userId);
    emailConfirmed = au?.user ? Boolean(au.user.email_confirmed_at) : null;
  } catch {
    emailConfirmed = null;
  }

  const profile: ReviewProfile = {
    id: p.id,
    email: p.email,
    canonicalEmail: canonicalEmail(p.email),
    company: p.company ?? null,
    accountType: normalizeAccountType(p.account_type),
    markets: (p.markets as string[] | null) ?? [],
    allMarkets: Boolean(p.all_markets),
    active: Boolean(p.active),
    pendingReason: (p.pending_reason as string | null) ?? null,
    contactName: (p.contact_name as string | null) ?? null,
    vat: (p.vat as string | null) ?? null,
    phone: (p.phone as string | null) ?? null,
    country: (p.country as string | null) ?? null,
    businessType: (p.business_type as string | null) ?? null,
    office: (p.office as string | null) ?? null,
    city: (p.city as string | null) ?? null,
    createdAt: (p.created_at as string | null) ?? null,
    signupIp: (p.signup_ip as string | null) ?? null,
    signupHost: (p.signup_host as string | null) ?? null,
    signupUa: (p.signup_ua as string | null) ?? null,
    signupLocale: (p.signup_locale as string | null) ?? null,
    emailConfirmed,
  };

  return (
    <Shell>
      <ReviewCard profile={profile} token={tokenUserId ? searchParams?.t ?? null : null} />
    </Shell>
  );
}
