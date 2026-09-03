'use client';

// ============================================================================
// LEAD MODAL — the core conversion component. A context provider renders ONE
// modal instance; any CTA calls useLeadModal().open(type) to show it. The modal
// matches the CtaModal mockup (7 types). On success it fires Enhanced
// Conversions (hashed, marketing-consent only), the unified generateLead event,
// and Clarity tags — then posts to /api/lead.
// ============================================================================
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { isSwissLocale, type Locale } from '@/i18n/config';
import { Link } from '@/i18n/navigation';
import { X, ArrowRight, Check } from 'lucide-react';
import {
  MODAL_CONFIGS,
  defaultCountryForLocale,
  TRAINING_DATE_DETAIL,
  trainingSessionsFor,
  type ModalType,
  type FormField,
} from '@/lib/forms-config';
import { localizeModalConfig, type ModalMessages, type SharedFieldMessages } from '@/lib/localize-content';
import { analytics, sha256, normalizeEmail, normalizePhone } from '@/lib/analytics';
import { getConsent } from '@/lib/consent';
import TurnstileWidget from '@/components/ui/TurnstileWidget';
import { useFormSecurity } from '@/lib/use-form-security';
import type { OpenOptions } from './LeadGenModal';

/** Programmatically download a same-origin file (dev fallback delivery). */
function triggerDownload(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// --- Returning-visitor memory (datasheet requests only, 30 days) ------------
type SavedContact = {
  v: 1;
  savedAt: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  city: string;
  /** ISO country code — optional: records saved before the field existed. */
  country?: string;
};

const CONTACT_KEY = 'datasheet-contact';

const CONTACT_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

function loadSavedContact(): SavedContact | null {
  try {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem(CONTACT_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw) as Partial<SavedContact>;
    if (d?.v !== 1) return null;
    if (!Number.isFinite(d.savedAt) || Date.now() - Number(d.savedAt) > CONTACT_MAX_AGE_MS) return null;
    if (!d.name || !d.role || !d.email || !d.phone || !d.city) return null;
    return d as SavedContact;
  } catch {
    return null;
  }
}

function saveContact(c: Omit<SavedContact, 'v' | 'savedAt'>) {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(CONTACT_KEY, JSON.stringify({ v: 1, savedAt: Date.now(), ...c }));
  } catch {
    /* storage unavailable — no-op */
  }
}

type Status = 'form' | 'confirm' | 'sending' | 'sent' | 'error';

// ---------------------------------------------------------------------------

export default function LeadGenModal({
  type,
  options,
  onClose,
}: {
  type: ModalType;
  options: OpenOptions;
  onClose: () => void;
}) {
  const t = useTranslations('forms');
  const tm = useTranslations('modals');
  const tsec = useTranslations('security');
  const locale = useLocale();
  const tModals = useTranslations('modals');
  const cfg = localizeModalConfig(
    MODAL_CONFIGS[type],
    tm.raw(type) as ModalMessages,
    tm.raw('shared') as SharedFieldMessages,
  );
  // Partner-run locale (QuinLay AG on ch): the partner's courses replace the
  // Beveren-Waas dates — in the cards AND in the preferred-date select.
  const { sessions: partnerSessions, partnerRun } = trainingSessionsFor(locale);
  const dateCards = partnerRun
    ? partnerSessions.map((d) => ({ date: d.date, note: d.note }))
    : TRAINING_DATE_DETAIL.map((d, i) => ({
        date: (tm.raw('trainingDates') as string[])[i] ?? d.date,
        note: (tm.raw('trainingDateNotes') as string[])[i] ?? d.note,
      }));
  const fields = partnerRun
    ? cfg.fields.map((f) => (f.name === 'preferredDate' ? { ...f, options: partnerSessions.map((d) => d.date), optionValues: partnerSessions.map((d) => d.date) } : f))
    : cfg.fields;
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const titleId = useId();
  const descId = useId();

  const isDatasheet = type === 'datasheet' && Boolean(options.datasheet);
  // Returning visitor (datasheet only): a valid saved record skips the form.
  const [savedContact, setSavedContact] = useState<SavedContact | null>(() =>
    isDatasheet ? loadSavedContact() : null,
  );
  const [status, setStatus] = useState<Status>(savedContact ? 'confirm' : 'form');
  // Bot defences: signed form token + Turnstile (both no-op without env vars).
  const security = useFormSecurity();
  const [consentChecked, setConsentChecked] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [prefill, setPrefill] = useState<Record<string, string> | null>(options.prefill ?? null);
  const [sentRole, setSentRole] = useState('');
  const [confirmBusy, setConfirmBusy] = useState(false);
  const [sentEmail, setSentEmail] = useState('');
  // 'download' = dev/runtime fallback: the API returned a signed URL instead
  // of emailing (no transactional provider) — old-style instant download.
  const [sentMode, setSentMode] = useState<'email' | 'download'>('email');
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);

  // ESC to close + body scroll lock + focus into the dialog.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const firstField = dialogRef.current?.querySelector<HTMLElement>(
      'input, select, textarea, button',
    );
    firstField?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  // Simple focus trap.
  const onKeyDownTrap = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])',
    );
    if (!focusables || focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  function validate(data: Record<string, string>): boolean {
    const next: Record<string, string> = {};
    for (const f of fields) {
      if (f.required && !data[f.name]?.trim()) {
        next[f.name] = t('validation.required');
      }
      if (f.inputType === 'email' && data[f.name] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data[f.name])) {
        next[f.name] = t('validation.email');
      }
    }
    if (!consentChecked) next.__consent = t('validation.consent');
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  // ---- Conversion events (best-effort, never block the UI) — identical for
  // the /api/lead and /api/datasheet-request branches.
  async function fireAnalytics(data: Record<string, string>, source: string) {
    const consent = getConsent();
    const email = data.email;
    try {
      if (consent?.marketing && window.gtag && email) {
        await window.gtag('set', 'user_data', {
          sha256_email_address: await sha256(normalizeEmail(email)),
          sha256_phone_number: data.phone ? await sha256(normalizePhone(data.phone)) : undefined,
        });
      }
    } catch {
      /* no-op */
    }
    analytics.generateLead({ product: options.product, source });
    if (type === 'samples') {
      analytics.sampleRequest(data.colours || '', data.productLine || '');
    }
    try {
      window.clarity?.('set', 'lead_status', 'submitted');
      if (options.product) window.clarity?.('set', 'lead_product', options.product);
      if (data.company || data.companyName) {
        window.clarity?.('set', 'company', data.company || data.companyName);
      }
      if (email) window.clarity?.('identify', email);
      window.clarity?.('upgrade', 'submitted_lead');
    } catch {
      /* no-op */
    }
  }

  // Datasheet flow: post the five fields; the PDF arrives by email (or, when
  // no mail provider is configured, as an instant-download fallback).
  // Returns true on success. Used by BOTH the form and the one-click confirm —
  // every send posts a full lead so each requested document is captured.
  async function postDatasheetRequest(
    data: { name: string; role: string; email: string; phone: string; city: string; country?: string },
    gotcha: string,
    quickConfirm = false,
    retried = false,
  ): Promise<boolean> {
    const source = options.source || type;
    const sheet = options.datasheet!;
    try {
      const turnstileToken = await security.waitForTurnstile();
      const res = await fetch('/api/datasheet-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          slug: sheet.slug,
          locale,
          source,
          _gotcha: gotcha,
          formToken: security.formToken,
          turnstileToken,
          quickConfirm,
        }),
      });
      if (res.status === 429) {
        setErrors({ __rate: tm('datasheet.rateLimited') });
        setSavedContact(null);
        setPrefill(data);
        setStatus('form');
        return false;
      }
      if (res.status === 400) {
        const err = (await res.clone().json().catch(() => null)) as { error?: string } | null;
        if (err?.error === 'stale_token' && !retried) {
          // Token older than its window — refetch silently and retry once.
          await security.refreshFormToken();
          return postDatasheetRequest(data, gotcha, quickConfirm, true);
        }
        if (err?.error === 'captcha') {
          security.resetTurnstile();
          setErrors({ __captcha: tsec('captchaFailed') });
          setPrefill(data);
          setStatus('form');
          return false;
        }
      }
      const json = (await res.json().catch(() => null)) as
        | { ok: boolean; mode?: 'email' | 'download'; url?: string }
        | null;
      if (!res.ok || !json?.ok) throw new Error('Request failed');

      saveContact(data);
      await fireAnalytics(data, source);
      setSentEmail(data.email);
      setSentRole(data.role);
      if (json.mode === 'download' && json.url) {
        triggerDownload(json.url, `${sheet.slug}.pdf`);
        setFallbackUrl(json.url);
        setSentMode('download');
      } else {
        setSentMode('email');
      }
      setStatus('sent');
      return true;
    } catch {
      setPrefill(data);
      setStatus('error');
      return false;
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data: Record<string, string> = {};
    for (const f of fields) {
      data[f.name] = String(fd.get(f.name) ?? '').trim();
    }
    if (!validate(data)) return;

    setStatus('sending');
    const gotcha = String(fd.get('_gotcha') ?? '');

    if (isDatasheet) {
      await postDatasheetRequest(
        { name: data.name, role: data.role, email: data.email, phone: data.phone, city: data.city, country: data.country },
        gotcha,
      );
      return;
    }

    const source = options.source || type;
    const postLead = async (retried: boolean): Promise<void> => {
      const turnstileToken = await security.waitForTurnstile();
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          source,
          product: options.product,
          // Honeypot — /api/lead silently drops submissions where this is set.
          _gotcha: gotcha,
          formToken: security.formToken,
          turnstileToken,
        }),
      });
      if (res.status === 429) {
        setErrors({ __rate: tsec('tooManyRequests') });
        setStatus('form');
        return;
      }
      if (res.status === 400) {
        const err = (await res.clone().json().catch(() => null)) as { error?: string } | null;
        if (err?.error === 'stale_token' && !retried) {
          await security.refreshFormToken();
          return postLead(true);
        }
        if (err?.error === 'captcha') {
          security.resetTurnstile();
          setErrors({ __captcha: tsec('captchaFailed') });
          setStatus('form');
          return;
        }
      }
      if (!res.ok) throw new Error('Request failed');

      await fireAnalytics(data, source);

      setStatus('sent');
    };
    try {
      await postLead(false);
    } catch {
      setStatus('error');
    }
  }

  // One-click resend for a remembered visitor.
  async function handleConfirmSend() {
    if (!savedContact || confirmBusy) return;
    setConfirmBusy(true);
    const { name, role, email, phone, city, country } = savedContact;
    await postDatasheetRequest(
      { name, role, email, phone, city, country: country ?? defaultCountryForLocale(locale) },
      '',
      true, // returning-visitor one-click confirm — exempt from the too-fast rule
    );
    setConfirmBusy(false);
  }

  return (
    <div
      onClick={onClose}
      onKeyDown={onKeyDownTrap}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(10,10,10,.55)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
        animation: 'ctamFade .18s ease',
      }}
    >
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        style={{
          background: '#fff',
          width: '100%',
          maxWidth: 560,
          maxHeight: '92vh',
          overflow: 'auto',
          position: 'relative',
          boxShadow: 'var(--shadow-lg)',
          animation: 'ctamRise .22s ease',
        }}
      >
        <button
          onClick={onClose}
          aria-label={tm('close')}
          className="ctam-x"
          style={{
            position: 'absolute',
            right: 12,
            top: 12,
            width: 40,
            height: 40,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: 'var(--black)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
          }}
        >
          <X size={22} strokeWidth={2} />
        </button>

        <div style={{ padding: 'clamp(26px,4vw,44px)' }}>
          {status === 'sent' ? (
            <div style={{ textAlign: 'center', padding: 'clamp(22px,3vw,44px) 6px' }}>
              <div
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: '50%',
                  background: 'var(--red)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 22px',
                }}
              >
                <Check size={28} strokeWidth={2.5} />
              </div>
              <h3
                id={titleId}
                className="h2 h2--sm"
                style={{ fontSize: 26, marginBottom: 12 }}
              >
                {isDatasheet && sentMode === 'download' ? tm('datasheet.fallback.sentTitle') : cfg.sentTitle}
              </h3>
              <p
                style={{
                  fontSize: 14.5,
                  lineHeight: 1.6,
                  color: 'var(--text-muted)',
                  maxWidth: 340,
                  margin: '0 auto 24px',
                }}
              >
                {isDatasheet
                  ? sentMode === 'email'
                    ? tm('datasheet.sentMsg', { email: sentEmail })
                    : tm('datasheet.fallback.sentMsg')
                  : cfg.sentMsg}
              </p>
              {/* Architects: one-line invite into the architect area. */}
              {isDatasheet && sentMode === 'email' && sentRole === 'architect' && (
                <p style={{ fontSize: 13, lineHeight: 1.55, background: 'var(--surface)', padding: '12px 16px', maxWidth: 380, margin: '0 auto 22px' }}>
                  <Link href="/architects" style={{ color: 'inherit', textDecoration: 'none' }}>
                    {tm('datasheet.architectInvite')}{' '}
                    <span style={{ color: 'var(--red)', fontWeight: 700, textDecoration: 'underline' }}>→</span>
                  </Link>
                </p>
              )}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                {isDatasheet && sentMode === 'download' && fallbackUrl && (
                  <a
                    href={fallbackUrl}
                    download={`${options.datasheet!.slug}.pdf`}
                    className="btn btn--primary btn--sm"
                    style={{ textDecoration: 'none' }}
                  >
                    {tm('downloadDatasheet')} <ArrowRight size={15} />
                  </a>
                )}
                <button onClick={onClose} className="btn btn--dark btn--sm">
                  {tm('close')}
                </button>
              </div>
            </div>
          ) : status === 'confirm' && savedContact && options.datasheet ? (
            /* Returning visitor: one-click send to the remembered address. */
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 12 }}>
                <span style={{ width: 26, height: 2, background: 'var(--red)' }} />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '.18em',
                    textTransform: 'uppercase',
                    color: 'var(--text-faint-2)',
                  }}
                >
                  STRETCH&reg;
                </span>
              </div>
              <h2
                id={titleId}
                className="h2 h2--sm"
                style={{ fontSize: 'clamp(23px,3vw,30px)', lineHeight: 1.02, marginBottom: 10 }}
              >
                {tm('datasheet.confirm.title', { title: options.datasheet.title })}
              </h2>
              <p
                id={descId}
                style={{ fontSize: 14.5, lineHeight: 1.55, color: 'var(--text-muted)', margin: '0 0 24px' }}
              >
                {tm('datasheet.confirm.msg', { email: savedContact.email })}
              </p>
              <TurnstileWidget ref={security.widgetRef} onToken={security.setTurnstileToken} />
              <button
                type="button"
                onClick={handleConfirmSend}
                className="btn btn--primary"
                disabled={confirmBusy}
                style={{ width: '100%', justifyContent: 'center', opacity: confirmBusy ? 0.7 : 1 }}
              >
                {confirmBusy ? t('sending') : tm('datasheet.confirm.sendLabel')}
                {!confirmBusy && <ArrowRight size={16} />}
              </button>
              <button
                type="button"
                onClick={() => {
                  const { name, role, email, phone, city } = savedContact;
                  setPrefill({ name, role, email, phone, city });
                  setStatus('form');
                }}
                style={{
                  display: 'block',
                  margin: '14px auto 0',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  font: 'inherit',
                  fontSize: 12.5,
                  color: 'var(--text-muted)',
                  textDecoration: 'underline',
                }}
              >
                {tm('datasheet.confirm.editLabel')}
              </button>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 12 }}>
                <span style={{ width: 26, height: 2, background: 'var(--red)' }} />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '.18em',
                    textTransform: 'uppercase',
                    color: 'var(--text-faint-2)',
                  }}
                >
                  STRETCH&reg;
                </span>
              </div>
              <h2
                id={titleId}
                className="h2 h2--sm"
                style={{ fontSize: 'clamp(24px,3.2vw,33px)', lineHeight: 0.98, marginBottom: 10 }}
              >
                {cfg.title}
              </h2>
              <p
                id={descId}
                style={{
                  fontSize: 14.5,
                  lineHeight: 1.55,
                  color: 'var(--text-muted)',
                  margin: '0 0 24px',
                }}
              >
                {cfg.subtitle}
              </p>
              {/* ch: every Swiss enquiry is answered by QuinLay AG (STRETCH in copy). */}
              {isSwissLocale(locale as Locale) && (
                <p style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--text-muted)', margin: '-12px 0 22px', padding: '10px 12px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  {tModals('swissPartnerNote')}
                </p>
              )}

              {/* The item this request is about (materials / product CTAs / datasheet) */}
              {(options.product || options.datasheet) && (
                <p style={{ display: 'inline-block', background: 'var(--surface)', border: '1px solid var(--border)', padding: '8px 12px', fontSize: 12.5, fontWeight: 700, letterSpacing: '.04em', margin: '-10px 0 22px' }}>
                  <span style={{ color: 'var(--red)', marginRight: 8 }}>●</span>
                  {options.product || options.datasheet?.title}
                </p>
              )}

              {cfg.showDates && (
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}
                >
                  {dateCards.map((d) => (
                    <div
                      key={d.date}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12,
                        border: '1px solid var(--border)',
                        padding: '13px 16px',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontWeight: 800,
                          fontSize: 15,
                          letterSpacing: '-.01em',
                        }}
                      >
                        {d.date}
                      </span>
                      <span style={{ fontSize: 12.5, color: 'var(--text-faint)' }}>{d.note}</span>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Honeypot field (bots fill it, humans never see it) */}
                <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 15,
                    marginBottom: 18,
                  }}
                >
                  {fields.map((f) => (
                    <Field
                      key={f.name}
                      field={f}
                      error={errors[f.name]}
                      defaultValue={
                        prefill?.[f.name] ??
                        (f.name === 'country' ? defaultCountryForLocale(locale) : undefined)
                      }
                    />
                  ))}
                </div>

                <ConsentRow
                  checked={consentChecked}
                  onChange={setConsentChecked}
                  error={errors.__consent}
                  privacyLabel={t('consentPrivacy')}
                  consentPrefix={t('consentPrefix')}
                />

                <TurnstileWidget ref={security.widgetRef} onToken={security.setTurnstileToken} />
                {errors.__captcha && (
                  <p className="field-error" role="alert" style={{ marginBottom: 12 }}>
                    {errors.__captcha}
                  </p>
                )}
                {errors.__rate && (
                  <p className="field-error" role="alert" style={{ marginBottom: 12 }}>
                    {errors.__rate}
                  </p>
                )}

                {status === 'error' && (
                  <p className="field-error" role="alert" style={{ marginBottom: 12 }}>
                    {t('errorMessage')}
                  </p>
                )}

                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={status === 'sending'}
                  style={{ width: '100%', justifyContent: 'center', opacity: status === 'sending' ? 0.7 : 1 }}
                >
                  {status === 'sending' ? t('sending') : cfg.submitLabel}
                  {status !== 'sending' && <ArrowRight size={16} />}
                </button>
                <p
                  style={{
                    fontSize: 11.5,
                    color: 'var(--text-faint-2)',
                    textAlign: 'center',
                    margin: '14px 0 0',
                  }}
                >
                  {t('reassurance')}
                </p>
              </form>
            </>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes ctamFade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes ctamRise {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .ctam-x:hover {
          color: var(--red) !important;
        }
      `}</style>
    </div>
  );
}

function Field({
  field,
  error,
  defaultValue,
}: {
  field: FormField;
  error?: string;
  defaultValue?: string;
}) {
  const tm = useTranslations('modals');
  const id = `f-${field.name}`;
  const invalid = Boolean(error);
  const describedBy = invalid ? `${id}-err` : undefined;
  return (
    <div style={{ gridColumn: field.full ? '1 / -1' : 'auto' }}>
      <label htmlFor={id} className="field-label">
        {field.label}
        {field.required && <span style={{ color: 'var(--red)' }}> *</span>}
      </label>
      {field.kind === 'text' && (
        <input
          id={id}
          name={field.name}
          className="field"
          type={field.inputType || 'text'}
          placeholder={field.placeholder}
          defaultValue={defaultValue}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          required={field.required}
        />
      )}
      {field.kind === 'select' && (
        <select
          id={id}
          name={field.name}
          className="field"
          defaultValue={defaultValue ?? ''}
          aria-invalid={invalid}
          aria-describedby={describedBy}
        >
          <option value="" disabled>
            {tm('select')}
          </option>
          {/* Submit the stable optionValues[i] (server logic) while showing
              the localized options[i] label. */}
          {field.options?.map((o, i) => (
            <option key={o} value={field.optionValues?.[i] ?? o}>
              {o}
            </option>
          ))}
        </select>
      )}
      {field.kind === 'area' && (
        <textarea
          id={id}
          name={field.name}
          className="field"
          placeholder={field.placeholder}
          defaultValue={defaultValue}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          style={{ minHeight: 92, resize: 'vertical' }}
        />
      )}
      {invalid && (
        <p id={`${id}-err`} className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}

function ConsentRow({
  checked,
  onChange,
  error,
  privacyLabel,
  consentPrefix,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string;
  privacyLabel: string;
  consentPrefix: string;
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
          fontSize: 12.5,
          lineHeight: 1.5,
          color: 'var(--text-muted)',
          cursor: 'pointer',
        }}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={Boolean(error)}
          style={{ marginTop: 3, width: 16, height: 16, accentColor: 'var(--red)', flex: '0 0 auto' }}
        />
        <span>
          {consentPrefix}{' '}
          <Link href="/privacy" prefetch={false} target="_blank" rel="noreferrer" style={{ color: 'var(--red)', textDecoration: 'underline' }}>
            {privacyLabel}
          </Link>
          .
        </span>
      </label>
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
