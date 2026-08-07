'use client';

// MATERIALS — cross-item inquiry list (the "cart without a checkout").
// Visitors collect item families across the /materials pages, then send ONE
// combined request through /api/lead (source `materials_inquiry`). State lives
// in React context + sessionStorage (survives reloads within the tab; nothing
// server-side). No prices, no payments — the reply comes by email.
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowRight, Check, ClipboardList, Plus, X } from 'lucide-react';

type InquiryItem = { group: string; name: string; variants?: string[] };

type InquiryCtx = {
  items: InquiryItem[];
  has: (name: string) => boolean;
  toggle: (item: InquiryItem) => void;
  remove: (name: string) => void;
  clear: () => void;
};

const Ctx = createContext<InquiryCtx | null>(null);
const STORE = 'stretch_inquiry_v1';

export function InquiryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<InquiryItem[]>([]);
  const [ready, setReady] = useState(false);

  // Hydrate from sessionStorage after mount (avoids SSR mismatch).
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORE);
      if (raw) setItems(JSON.parse(raw) as InquiryItem[]);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(STORE, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, ready]);

  const has = useCallback((name: string) => items.some((i) => i.name === name), [items]);
  const toggle = useCallback((item: InquiryItem) => {
    setItems((prev) => (prev.some((i) => i.name === item.name) ? prev.filter((i) => i.name !== item.name) : [...prev, item]));
  }, []);
  const remove = useCallback((name: string) => setItems((prev) => prev.filter((i) => i.name !== name)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(() => ({ items, has, toggle, remove, clear }), [items, has, toggle, remove, clear]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useInquiry(): InquiryCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useInquiry outside InquiryProvider');
  return ctx;
}

/** Ghost "add to inquiry" toggle shown on every item card. */
export function AddToInquiryButton({ group, name }: { group: string; name: string }) {
  const t = useTranslations('materials');
  const { has, toggle } = useInquiry();
  const on = has(name);
  return (
    <button
      type="button"
      onClick={() => toggle({ group, name })}
      aria-pressed={on}
      className={on ? 'btn btn--sm inq-on' : 'btn btn--ghost btn--sm'}
      style={on ? { background: 'var(--black)', color: '#fff', borderColor: 'var(--black)' } : undefined}
    >
      {on ? (
        <>
          <Check size={14} /> {t('inList')}
        </>
      ) : (
        <>
          <Plus size={14} /> {t('addToList')}
        </>
      )}
    </button>
  );
}

/** Floating bar + slide-over panel with the combined send form. */
export function InquiryBar() {
  const t = useTranslations('materials');
  const { items, remove, clear } = useInquiry();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    setError(false);
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'materials_inquiry',
          name: String(fd.get('name') ?? ''),
          company: String(fd.get('company') ?? ''),
          email: String(fd.get('email') ?? ''),
          phone: String(fd.get('phone') ?? ''),
          message: String(fd.get('message') ?? ''),
          colour: String(fd.get('colour') ?? ''),
          colourCode: String(fd.get('colourCode') ?? ''),
          items: items
            .map((i) => `${i.name}${i.variants?.length ? ` [${i.variants.join(', ')}]` : ''} (${i.group})`)
            .join(' | '),
          _gotcha: String(fd.get('_gotcha') ?? ''),
        }),
      });
      if (!res.ok) throw new Error('send failed');
      setSent(true);
      clear();
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  if (items.length === 0 && !open) return null;

  return (
    <>
      {/* Floating bar */}
      {items.length > 0 && (
        <button type="button" className="inq-bar" onClick={() => { setOpen(true); setSent(false); }}>
          <ClipboardList size={17} />
          <span>{t('barLabel')}</span>
          <span className="inq-bar__count">{items.length}</span>
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="inq-overlay" role="dialog" aria-modal="true" aria-label={t('inquiryTitle')} onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div className="inq-panel">
            <button type="button" className="inq-close" onClick={() => setOpen(false)} aria-label={t('closeLabel')}>
              <X size={18} />
            </button>

            {sent ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <span style={{ background: 'var(--red)', color: '#fff', width: 38, height: 38, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={18} />
                  </span>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22, textTransform: 'uppercase', margin: 0 }}>{t('sentTitle')}</h2>
                </div>
                <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--text-muted)', margin: '0 0 20px' }}>{t('sentBody')}</p>
                <button type="button" className="btn btn--ghost" onClick={() => setOpen(false)}>{t('closeLabel')}</button>
              </div>
            ) : (
              <>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(20px,2.4vw,26px)', textTransform: 'uppercase', letterSpacing: '-.01em', margin: '0 0 6px' }}>
                  {t('inquiryTitle')}
                </h2>
                <p style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--text-muted)', margin: '0 0 16px' }}>{t('inquirySub')}</p>

                <ul className="inq-items">
                  {items.map((i) => (
                    <li key={i.name}>
                      <span>
                        <strong>{i.name}</strong>
                        <em>{i.group}{i.variants?.length ? ` · ${i.variants.join(', ')}` : ''}</em>
                      </span>
                      <button type="button" onClick={() => remove(i.name)} aria-label={`${t('removeLabel')}: ${i.name}`}>
                        <X size={14} />
                      </button>
                    </li>
                  ))}
                </ul>

                <form onSubmit={submit}>
                  <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
                  {/* Colour chart choice — travels with the lead as `colour` / `colourCode`. */}
                  <div className="inq-row2">
                    <label className="inq-field">
                      <span>{t('colourLabel')}</span>
                      <select name="colour" defaultValue="">
                        <option value="">{t('colourNone')}</option>
                        <option value={t('colourWhite')}>{t('colourWhite')}</option>
                        <option value={t('colourMatteColour')}>{t('colourMatteColour')}</option>
                        <option value={t('colourSatin')}>{t('colourSatin')}</option>
                        <option value={t('colourGloss')}>{t('colourGloss')}</option>
                        <option value={t('colourTranslucent')}>{t('colourTranslucent')}</option>
                        <option value={t('colourPrinted')}>{t('colourPrinted')}</option>
                      </select>
                    </label>
                    <label className="inq-field"><span>{t('colourCodeLabel')}</span><input name="colourCode" placeholder={t('colourCodePlaceholder')} /></label>
                  </div>
                  <div className="inq-row2">
                    <label className="inq-field"><span>{t('formName')} *</span><input name="name" required autoComplete="name" /></label>
                    <label className="inq-field"><span>{t('formCompany')}</span><input name="company" autoComplete="organization" /></label>
                  </div>
                  <div className="inq-row2">
                    <label className="inq-field"><span>{t('formEmail')} *</span><input type="email" name="email" required autoComplete="email" /></label>
                    <label className="inq-field"><span>{t('formPhone')}</span><input type="tel" name="phone" autoComplete="tel" /></label>
                  </div>
                  <label className="inq-field"><span>{t('formMessage')}</span><textarea name="message" rows={3} /></label>

                  <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 12.5, lineHeight: 1.5, color: 'var(--text-muted)', margin: '4px 0 16px', cursor: 'pointer' }}>
                    <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ marginTop: 2, accentColor: 'var(--red)' }} />
                    <span>
                      {t('consent')}{' '}
                      <Link href="/privacy" style={{ color: 'var(--red)' }}>{t('privacyLabel')}</Link>
                    </span>
                  </label>

                  {error && (
                    <p role="alert" style={{ color: 'var(--red)', fontSize: 13.5, fontWeight: 600, margin: '0 0 12px' }}>{t('sendError')}</p>
                  )}

                  <button type="submit" className="btn btn--primary" disabled={busy || items.length === 0} style={{ width: '100%', justifyContent: 'center' }}>
                    {busy ? t('sending') : t('send')} <ArrowRight size={15} />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .inq-bar {
          position: fixed;
          right: clamp(14px, 2.5vw, 30px);
          bottom: clamp(14px, 2.5vw, 30px);
          z-index: 60;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: var(--black);
          color: #fff;
          border: none;
          font: inherit;
          font-size: 12.5px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 15px 18px;
          cursor: pointer;
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.28);
        }
        .inq-bar:hover { background: #000; }
        .inq-bar__count {
          background: var(--red);
          min-width: 22px;
          height: 22px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          padding: 0 6px;
        }
        .inq-overlay {
          position: fixed;
          inset: 0;
          z-index: 70;
          background: rgba(10, 10, 10, 0.55);
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
          padding: clamp(10px, 2vw, 24px);
        }
        .inq-panel {
          position: relative;
          background: #fff;
          width: min(460px, 100%);
          max-height: calc(100vh - 40px);
          overflow: auto;
          padding: clamp(22px, 3vw, 30px);
          border: 1px solid var(--border);
        }
        .inq-close {
          position: absolute;
          top: 12px;
          right: 12px;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-muted);
          padding: 6px;
        }
        .inq-close:hover { color: var(--black); }
        .inq-items {
          list-style: none;
          margin: 0 0 18px;
          padding: 0;
          border-top: 1px solid var(--border);
        }
        .inq-items li {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 10px 2px;
          border-bottom: 1px solid var(--border);
        }
        .inq-items strong { display: block; font-size: 13.5px; }
        .inq-items em { display: block; font-style: normal; font-size: 11.5px; color: var(--text-faint); }
        .inq-items button {
          background: none;
          border: 1px solid var(--border);
          cursor: pointer;
          color: var(--text-muted);
          width: 26px;
          height: 26px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
        }
        .inq-items button:hover { color: var(--red); border-color: var(--red); }
        .inq-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .inq-field { display: block; margin-bottom: 12px; }
        .inq-field span {
          display: block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 6px;
        }
        .inq-field input,
        .inq-field select,
        .inq-field textarea {
          width: 100%;
          padding: 11px 12px;
          border: 1px solid var(--border-input);
          background: #fff;
          font: inherit;
          font-size: 14px;
          border-radius: var(--radius);
        }
        .inq-field select { appearance: auto; cursor: pointer; }
        .inq-field input:focus,
        .inq-field select:focus,
        .inq-field textarea:focus { outline: 2px solid var(--black); outline-offset: -1px; }
        @media (max-width: 560px) {
          .inq-row2 { grid-template-columns: 1fr; }
          .inq-overlay { align-items: stretch; padding: 0; }
          .inq-panel { width: 100%; max-height: 100vh; }
        }
      `}</style>
    </>
  );
}
