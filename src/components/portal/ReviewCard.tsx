'use client';

// CLIENT PORTAL — the approve/reject card rendered by /portal/review.
// All mutations POST to /api/portal/review (token- or admin-authorized);
// the page that renders this card never changes anything on GET.
import { useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import { CheckCircle2, ShieldX, TriangleAlert } from 'lucide-react';
import { PRICE_MARKETS } from '@/lib/portal/types';
import { signupCountryOptions } from '@/lib/signup-countries';

export type ReviewProfile = {
  id: string;
  email: string;
  canonicalEmail: string;
  company: string | null;
  accountType: 'producer' | 'installer' | 'b2c' | 'architect';
  markets: string[];
  allMarkets: boolean;
  active: boolean;
  pendingReason: string | null;
  contactName: string | null;
  vat: string | null;
  phone: string | null;
  country: string | null;
  businessType: string | null;
  office: string | null;
  city: string | null;
  createdAt: string | null;
  signupIp: string | null;
  signupHost: string | null;
  signupUa: string | null;
  signupLocale: string | null;
  emailConfirmed: boolean | null;
};

const REASONS = [
  ['not_a_business', 'Not a business'],
  ['spam', 'Spam'],
  ['duplicate', 'Duplicate account'],
  ['other', 'Other'],
] as const;

export default function ReviewCard({ profile, token }: { profile: ReviewProfile; token: string | null }) {
  const locale = useLocale();
  const isArchitect = profile.accountType === 'architect';
  const [markets, setMarkets] = useState<string[]>(profile.markets);
  const [allMarkets, setAllMarkets] = useState(profile.allMarkets);
  const [country, setCountry] = useState(profile.country ?? '');
  const [accountType, setAccountType] = useState(profile.accountType);
  const [reason, setReason] = useState<string>('not_a_business');
  const [block, setBlock] = useState(false);
  const [blockDomain, setBlockDomain] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<'approved' | 'rejected' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const countries = useMemo(() => signupCountryOptions(locale), [locale]);

  function toggleMarket(m: string) {
    setMarkets((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  }

  async function post(payload: Record<string, unknown>) {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/portal/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...(token ? { t: token } : { userId: profile.id }), ...payload }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setError(
          data?.error === 'markets_required'
            ? 'Select at least one market (or all markets) — approval assigns the pricing this account may see.'
            : data?.error ?? 'The action failed. Try again or use the admin panel.',
        );
        return;
      }
      setDone(data.action === 'approved' ? 'approved' : 'rejected');
    } catch {
      setError('The action failed. Try again or use the admin panel.');
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="rvw done">
        <span className={done === 'approved' ? 'ic ok' : 'ic no'}>
          {done === 'approved' ? <CheckCircle2 size={26} /> : <ShieldX size={26} />}
        </span>
        <div className="ttl">{done === 'approved' ? 'Account approved.' : 'Account rejected.'}</div>
        <p className="sub">
          {done === 'approved'
            ? `${profile.email} now has access — the approval email is on its way.`
            : `${profile.email} was deleted${block || blockDomain ? ' and added to the blocklist' : ''}. Nothing was sent to the applicant.`}
        </p>
        <style dangerouslySetInnerHTML={{ __html: styles }} />
      </div>
    );
  }

  const meta: [string, string | null][] = [
    ['Type', profile.accountType],
    ['Contact', profile.contactName],
    ['Company / office', profile.company ?? profile.office],
    ['City', profile.city],
    ['Country', profile.country],
    ['VAT', profile.vat],
    ['Phone', profile.phone],
    ['Business type', profile.businessType],
    ['Email', profile.canonicalEmail !== profile.email.toLowerCase() ? `${profile.email} (canonical: ${profile.canonicalEmail})` : profile.email],
    ['Email confirmed', profile.emailConfirmed === null ? null : profile.emailConfirmed ? 'yes' : 'not yet'],
    ['Pending reason', profile.pendingReason],
    ['Signed up', profile.createdAt ? new Date(profile.createdAt).toLocaleString('en-GB') : null],
    ['Signup host / locale', [profile.signupHost, profile.signupLocale].filter(Boolean).join(' · ') || null],
    ['Signup IP', profile.signupIp],
    ['User agent', profile.signupUa ? profile.signupUa.slice(0, 120) : null],
  ];

  return (
    <div className="rvw">
      <div className="ttl">
        Review signup<span style={{ color: 'var(--red)' }}>.</span>
      </div>
      {profile.active && !profile.pendingReason && (
        <p className="note">
          <TriangleAlert size={14} /> This account is already active — approving again is harmless.
        </p>
      )}

      <dl className="meta">
        {meta
          .filter(([, v]) => v)
          .map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
      </dl>

      {/* --- Approve ---------------------------------------------------- */}
      <div className="sect">
        <div className="sect__t">Approve</div>
        {!isArchitect && (
          <>
            <label className="lbl">Account tier</label>
            <select className="sel" value={accountType} onChange={(e) => setAccountType(e.target.value as typeof accountType)}>
              <option value="producer">Producer / Reseller</option>
              <option value="installer">Installer</option>
              <option value="b2c">Private client</option>
            </select>
            <label className="lbl">Markets (what pricing this account sees)</label>
            <label className="chk">
              <input type="checkbox" checked={allMarkets} onChange={(e) => setAllMarkets(e.target.checked)} />
              All markets
            </label>
            {!allMarkets && (
              <div className="chips">
                {PRICE_MARKETS.map((m) => (
                  <label key={m} className={markets.includes(m) ? 'chk on' : 'chk'}>
                    <input type="checkbox" checked={markets.includes(m)} onChange={() => toggleMarket(m)} />
                    {m}
                  </label>
                ))}
              </div>
            )}
            <label className="lbl">Country</label>
            <select className="sel" value={country} onChange={(e) => setCountry(e.target.value)}>
              <option value="">—</option>
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
              <option value="OTHER">Other</option>
            </select>
          </>
        )}
        {isArchitect && <p className="sub">Architect account — no markets needed; approval unlocks the architect area.</p>}
        <button
          type="button"
          className="btn btn--primary"
          disabled={busy}
          onClick={() => post({ action: 'approve', markets, allMarkets, country, ...(isArchitect ? {} : { accountType }) })}
        >
          {busy ? 'Working…' : 'Approve account'}
        </button>
      </div>

      {/* --- Reject ----------------------------------------------------- */}
      <div className="sect sect--danger">
        <div className="sect__t">Reject</div>
        <label className="lbl">Reason</label>
        <select className="sel" value={reason} onChange={(e) => setReason(e.target.value)}>
          {REASONS.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
        <label className="chk">
          <input type="checkbox" checked={block} onChange={(e) => setBlock(e.target.checked)} />
          Also block this email address
        </label>
        <label className="chk">
          <input type="checkbox" checked={blockDomain} onChange={(e) => setBlockDomain(e.target.checked)} />
          Also block the whole domain ({profile.email.split('@')[1] ?? '—'})
        </label>
        <p className="sub">Rejecting deletes the login and profile. The applicant is not notified.</p>
        <button type="button" className="btn btn--dark" disabled={busy} onClick={() => post({ action: 'reject', reason, block, blockDomain })}>
          {busy ? 'Working…' : 'Reject and delete'}
        </button>
      </div>

      {error && (
        <p className="err" role="alert">
          {error}
        </p>
      )}
      <style dangerouslySetInnerHTML={{ __html: styles }} />
    </div>
  );
}

const styles = `
  .rvw {
    border: 1px solid var(--border);
    background: #fff;
    padding: clamp(24px, 3.4vw, 40px);
  }
  .rvw.done { text-align: center; }
  .ic { display: inline-flex; width: 56px; height: 56px; border-radius: 50%; align-items: center; justify-content: center; color: #fff; margin-bottom: 16px; }
  .ic.ok { background: #0c7a43; }
  .ic.no { background: var(--black); }
  .ttl {
    font-family: var(--font-display);
    font-weight: 900;
    font-size: clamp(22px, 3vw, 30px);
    text-transform: uppercase;
    letter-spacing: -0.01em;
    margin-bottom: 14px;
  }
  .sub { color: var(--text-muted); font-size: 13.5px; line-height: 1.6; margin: 0 0 14px; }
  .note { display: flex; gap: 8px; align-items: center; color: var(--red); font-size: 13px; font-weight: 600; margin: 0 0 14px; }
  .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 18px; margin: 0 0 24px; }
  .meta div { min-width: 0; }
  .meta dt { font-size: 10px; font-weight: 700; letter-spacing: .09em; text-transform: uppercase; color: var(--text-muted-2); }
  .meta dd { margin: 2px 0 0; font-size: 13.5px; word-break: break-word; }
  .sect { border: 1px solid var(--border-2); background: var(--surface); padding: 18px; margin: 0 0 14px; }
  .sect--danger { border-color: var(--border); background: #fff; }
  .sect__t { font-size: 12px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; margin-bottom: 12px; }
  .lbl { display: block; font-size: 10.5px; font-weight: 700; letter-spacing: .09em; text-transform: uppercase; color: var(--text-muted); margin: 12px 0 5px; }
  .sel { width: 100%; max-width: 320px; padding: 9px 10px; border: 1px solid var(--border-input); background: #fff; font: inherit; font-size: 13.5px; display: block; margin-bottom: 4px; }
  .chips { display: flex; flex-wrap: wrap; gap: 8px; margin: 8px 0; }
  .chk { display: inline-flex; align-items: center; gap: 7px; font-size: 12.5px; font-weight: 600; border: 1px solid var(--border-input); background: #fff; padding: 7px 10px; cursor: pointer; margin: 4px 8px 4px 0; }
  .chk.on { border-color: var(--black); background: var(--black); color: #fff; }
  .chk input { accent-color: var(--red); }
  .err { color: var(--red); font-size: 13.5px; font-weight: 600; margin: 12px 0 0; }
  .btn { margin-top: 12px; }
  @media (max-width: 560px) { .meta { grid-template-columns: 1fr; } }
`;
