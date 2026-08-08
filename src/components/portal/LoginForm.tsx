'use client';

// CLIENT PORTAL — credential card with Sign in / Create account tabs.
// mode='live'   → real Supabase login + open B2C self-registration.
// mode='demo'   → demo login; the preview accounts are listed on the card
//                 (only when NEXT_PUBLIC_PORTAL_DEMO=1 — never by default).
// mode='closed' → portal not configured: a "being activated" notice, no form.
import { useMemo, useState, type FormEvent } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowUpRight, Lock, MailCheck, UserRoundPlus } from 'lucide-react';
import { DEMO_USERS } from '@/lib/portal/demo-users';

type Mode = 'live' | 'demo' | 'closed';

// Countries offered in the B2B signup form (ISO 3166-1 alpha-2); labels come
// from the browser's own Intl region names in the visitor's language.
const SIGNUP_COUNTRIES = [
  'BE', 'NL', 'LU', 'FR', 'DE', 'AT', 'CH', 'ES', 'PT', 'IT', 'PL', 'CZ',
  'DK', 'SE', 'NO', 'IS', 'FI', 'GB', 'IE', 'US', 'AE',
] as const;

const BUSINESS_TYPES = ['installer', 'distributor', 'architect', 'contractor', 'other'] as const;

export default function LoginForm({
  mode,
  initialAudience,
}: {
  mode: Mode;
  /** 'architect' opens the signup tab with Architect pre-selected (?signup=architect). */
  initialAudience?: 'client' | 'architect';
}) {
  const t = useTranslations('portal.login');
  const bt = useTranslations('portal.businessTypes');
  const locale = useLocale();
  const router = useRouter();
  const [tab, setTab] = useState<'signin' | 'signup'>(initialAudience ? 'signup' : 'signin');
  const [audience, setAudience] = useState<'client' | 'architect'>(initialAudience ?? 'client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [contactName, setContactName] = useState('');
  const [vat, setVat] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [city, setCity] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signupDone, setSignupDone] = useState(false);
  const architect = audience === 'architect';

  // Localised country names, alphabetical in the visitor's language.
  const countries = useMemo(() => {
    let names: Intl.DisplayNames | null = null;
    try {
      names = new Intl.DisplayNames([locale], { type: 'region' });
    } catch {
      names = null;
    }
    return SIGNUP_COUNTRIES.map((code) => ({ code, label: names?.of(code) ?? code })).sort((a, b) =>
      a.label.localeCompare(b.label, locale),
    );
  }, [locale]);

  async function submitSignin(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/portal/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        router.replace('/portal');
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => null);
      setError(
        data?.error === 'inactive' ? t('inactive') : data?.error === 'unavailable' ? t('unavailableBody') : t('invalid'),
      );
    } catch {
      setError(t('failed'));
    } finally {
      setBusy(false);
    }
  }

  async function submitSignup(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/portal/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          company,
          contactName,
          vat,
          phone,
          country,
          businessType,
          // Architect audience: the company field doubles as the office name.
          accountType: architect ? 'architect' : 'b2c',
          office: architect ? company : undefined,
          city: architect ? city : undefined,
        }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.ok) {
        if (data.confirm) {
          setSignupDone(true);
        } else {
          // No email confirmation required → sign straight in.
          const login = await fetch('/api/portal/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          if (login.ok) {
            router.replace('/portal');
            router.refresh();
            return;
          }
          setSignupDone(true);
        }
        return;
      }
      setError(data?.error === 'exists' ? t('signupExists') : t('failed'));
    } catch {
      setError(t('failed'));
    } finally {
      setBusy(false);
    }
  }

  // --- Portal closed (no Supabase, no demo flag) ---------------------------
  if (mode === 'closed') {
    return (
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ background: '#fff', border: '1px solid var(--border)', padding: 'clamp(26px,3vw,40px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ background: 'var(--black)', color: '#fff', width: 38, height: 38, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={16} />
            </span>
            <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: '.04em', textTransform: 'uppercase' }}>{t('unavailableTitle')}</div>
          </div>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 14.5, lineHeight: 1.6 }}>{t('unavailableBody')}</p>
        </div>
      </div>
    );
  }

  // --- Signup confirmation sent --------------------------------------------
  if (signupDone) {
    return (
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ background: '#fff', border: '1px solid var(--border)', padding: 'clamp(26px,3vw,40px)' }} role="status">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ background: 'var(--red)', color: '#fff', width: 38, height: 38, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <MailCheck size={17} />
            </span>
            <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: '.04em', textTransform: 'uppercase' }}>{t('signupDoneTitle')}</div>
          </div>
          <p style={{ margin: '0 0 18px', color: 'var(--text-muted)', fontSize: 14.5, lineHeight: 1.6 }}>{t('signupDoneBody')}</p>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              setSignupDone(false);
              setTab('signin');
              setPassword('');
            }}
          >
            {t('tabSignIn')}
          </button>
        </div>
      </div>
    );
  }

  const signup = mode === 'live' && tab === 'signup';

  return (
    <div style={{ width: '100%', maxWidth: 440 }}>
      {/* Sign in / Create account tabs (signup only in live mode) */}
      {mode === 'live' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginBottom: -1 }}>
          {(['signin', 'signup'] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => {
                setTab(k);
                setError(null);
              }}
              style={{
                font: 'inherit',
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                padding: '13px 10px',
                cursor: 'pointer',
                background: tab === k ? '#fff' : 'var(--surface)',
                color: tab === k ? 'var(--black)' : 'var(--text-muted-2)',
                border: '1px solid var(--border)',
                borderBottom: tab === k ? '1px solid #fff' : '1px solid var(--border)',
              }}
            >
              {k === 'signin' ? t('tabSignIn') : t('tabSignup')}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={signup ? submitSignup : submitSignin}
        style={{ background: '#fff', border: '1px solid var(--border)', borderTop: mode === 'live' ? 'none' : undefined, padding: 'clamp(26px,3vw,40px)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <span style={{ background: 'var(--black)', color: '#fff', width: 38, height: 38, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            {signup ? <UserRoundPlus size={16} /> : <Lock size={16} />}
          </span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: '.04em', textTransform: 'uppercase' }}>
              {signup ? t('tabSignup') : t('formTitle')}
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--text-muted-2)' }}>{signup ? t('signupSub') : t('formSub')}</div>
          </div>
        </div>

        {signup && (
          <>
            {/* Audience: Client (B2B qualification) vs Architect (office + city). */}
            <div className="portal-field" role="radiogroup" aria-label={t('audienceLabel')}>
              <span className="portal-field-caption">{t('audienceLabel')}</span>
              <div className="portal-audience">
                {(['client', 'architect'] as const).map((a) => (
                  <button
                    key={a}
                    type="button"
                    role="radio"
                    aria-checked={audience === a}
                    className={audience === a ? 'on' : ''}
                    onClick={() => setAudience(a)}
                  >
                    {a === 'client' ? t('audienceClient') : t('audienceArchitect')}
                  </button>
                ))}
              </div>
            </div>

            <label className="portal-field">
              <span>{architect ? t('officeName') : t('company')}</span>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                autoComplete="organization"
                required
                maxLength={120}
                placeholder={architect ? 'Studio A' : 'Company BV'}
              />
            </label>
            <div className="portal-pair">
              <label className="portal-field">
                <span>{t('contactName')}</span>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  autoComplete="name"
                  required
                  maxLength={120}
                />
              </label>
              <label className="portal-field">
                <span>{t('phone')}</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  required
                  minLength={6}
                  maxLength={25}
                  placeholder="+32 …"
                />
              </label>
            </div>
            {architect ? (
              <label className="portal-field">
                <span>{t('city')}</span>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  autoComplete="address-level2"
                  required
                  maxLength={80}
                />
              </label>
            ) : (
              <>
                <div className="portal-pair">
                  <label className="portal-field">
                    <span>{t('vat')}</span>
                    <input
                      type="text"
                      value={vat}
                      onChange={(e) => setVat(e.target.value)}
                      required
                      minLength={6}
                      maxLength={20}
                      placeholder="BE 0123.456.789"
                    />
                  </label>
                  <label className="portal-field">
                    <span>{t('country')}</span>
                    <select value={country} onChange={(e) => setCountry(e.target.value)} required>
                      <option value="" disabled>
                        {t('chooseOption')}
                      </option>
                      {countries.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.label}
                        </option>
                      ))}
                      <option value="OTHER">{t('countryOther')}</option>
                    </select>
                  </label>
                </div>
                <label className="portal-field">
                  <span>{t('businessType')}</span>
                  <select value={businessType} onChange={(e) => setBusinessType(e.target.value)} required>
                    <option value="" disabled>
                      {t('chooseOption')}
                    </option>
                    {BUSINESS_TYPES.map((k) => (
                      <option key={k} value={k}>
                        {bt(k)}
                      </option>
                    ))}
                  </select>
                </label>
              </>
            )}
          </>
        )}

        <label className="portal-field">
          <span>{t('email')}</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
            placeholder="name@company.com"
          />
        </label>
        <label className="portal-field">
          <span>{t('password')}</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={signup ? 'new-password' : 'current-password'}
            required
            minLength={signup ? 8 : undefined}
            placeholder="••••••••••"
          />
          {signup && <em style={{ display: 'block', fontStyle: 'normal', fontSize: 12, color: 'var(--text-faint)', marginTop: 6 }}>{t('passwordHint')}</em>}
        </label>

        {error && (
          <p role="alert" style={{ color: 'var(--red)', fontSize: 13.5, fontWeight: 600, margin: '4px 0 14px' }}>
            {error}
          </p>
        )}

        <button type="submit" className="btn btn--primary" disabled={busy} style={{ width: '100%', justifyContent: 'center' }}>
          {signup ? (busy ? t('signupSubmitting') : t('signupSubmit')) : busy ? t('submitting') : t('submit')} <ArrowUpRight size={15} />
        </button>
      </form>

      {mode === 'demo' && (
        <aside
          style={{ marginTop: 16, border: '1px dashed var(--border-input)', background: '#fff', padding: '16px 18px', fontSize: 13 }}
        >
          <p style={{ margin: '0 0 8px', fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', fontSize: 11.5 }}>
            <span style={{ color: 'var(--red)' }}>●</span> {t('demoTitle')}
          </p>
          <p style={{ margin: '0 0 10px', color: 'var(--text-muted)', lineHeight: 1.55 }}>{t('demoBody')}</p>
          <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--text-body)', lineHeight: 1.7 }}>
            {DEMO_USERS.map((u) => (
              <li key={u.email}>
                <code style={{ fontSize: 12.5 }}>{u.email}</code> / <code style={{ fontSize: 12.5 }}>{u.password}</code>
                <span style={{ color: 'var(--text-faint)' }}> — {u.company}</span>
              </li>
            ))}
          </ul>
        </aside>
      )}

      <style jsx>{`
        .portal-field {
          display: block;
          margin-bottom: 16px;
        }
        .portal-field span {
          display: block;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 7px;
        }
        .portal-field input,
        .portal-field select {
          width: 100%;
          padding: 13px 14px;
          border: 1px solid var(--border-input);
          background: #fff;
          font: inherit;
          font-size: 14.5px;
          border-radius: var(--radius);
        }
        .portal-field input:focus,
        .portal-field select:focus {
          outline: 2px solid var(--black);
          outline-offset: -1px;
        }
        .portal-pair {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0 12px;
        }
        .portal-field-caption {
          display: block;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 7px;
        }
        .portal-audience {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        .portal-audience button {
          font: inherit;
          font-size: 12.5px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 12px 10px;
          cursor: pointer;
          background: #fff;
          color: var(--text-muted-2);
          border: 1px solid var(--border-input);
        }
        .portal-audience button.on {
          background: var(--black);
          border-color: var(--black);
          color: #fff;
        }
        @media (max-width: 420px) {
          .portal-pair {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
