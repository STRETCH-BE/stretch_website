'use client';

// CLIENT PORTAL — admin panel:
//   1. Pricelist Excel sync (unchanged).
//   2. Blocklist — blocked_senders management.
//   3. Client accounts — search/filter/pending review, approve/reject,
//      delete / mark-as-spam (single + bulk), signup metadata.
//   4. Leads — flagged review, "Deliver now", CSV export.
// The panel is admin-only and EN-only (like the whole portal): the strings
// introduced by the anti-spam work are deliberately hardcoded English —
// only pre-existing keys keep using the portal.admin messages namespace.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  Ban,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CloudUpload,
  Download,
  Plus,
  RefreshCw,
  ShieldX,
  TriangleAlert,
  UserRound,
} from 'lucide-react';
import type { SyncReport } from '@/lib/portal/types';
import { PRICE_MARKETS } from '@/lib/portal/types';
import { signupCountryOptions } from '@/lib/signup-countries';

type PortalUserRow = {
  id: string;
  email: string;
  company: string | null;
  role: 'client' | 'admin';
  accountType?: 'producer' | 'installer' | 'b2c' | 'architect';
  markets: string[];
  allMarkets: boolean;
  active: boolean;
  createdAt?: string | null;
  contactName?: string | null;
  vat?: string | null;
  phone?: string | null;
  country?: string | null;
  businessType?: string | null;
  office?: string | null;
  city?: string | null;
  pendingReason?: string | null;
  canonicalEmail?: string | null;
  signupIp?: string | null;
  signupHost?: string | null;
  signupUa?: string | null;
  signupLocale?: string | null;
  emailConfirmed?: boolean | null;
};

type LeadRow = {
  id: string;
  created_at: string;
  source: string | null;
  name: string | null;
  company: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  host: string | null;
  spam_score: number | null;
  spam_reasons: string[] | null;
  flagged: boolean;
  delivered: boolean;
  delivery_method: string | null;
  delivered_at: string | null;
  payload?: Record<string, unknown> | null;
};

type BlockEntry = { id: string; kind: 'email' | 'domain'; value: string; reason: string | null; created_at: string };

const BUSINESS_TYPE_KEYS = ['installer', 'distributor', 'architect', 'contractor', 'other'] as const;
const REJECT_REASONS = [
  ['not_a_business', 'Not a business'],
  ['spam', 'Spam'],
  ['duplicate', 'Duplicate account'],
  ['other', 'Other'],
] as const;

export default function AdminPanel({ demo }: { demo: boolean }) {
  const t = useTranslations('portal.admin');

  return (
    <div className="container" style={{ padding: 'clamp(26px,3.5vw,48px) 0 64px' }}>
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          textTransform: 'uppercase',
          fontSize: 'clamp(26px,3.4vw,42px)',
          margin: '0 0 6px',
        }}
      >
        {t('title')}
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 14.5, margin: '0 0 30px', maxWidth: 640 }}>{t('sub')}</p>

      {demo && (
        <p
          style={{
            border: '1px dashed var(--border-input)',
            background: '#fff',
            padding: '12px 16px',
            fontSize: 13,
            color: 'var(--text-muted)',
            margin: '0 0 24px',
          }}
        >
          <TriangleAlert size={14} style={{ verticalAlign: -2, color: 'var(--red)' }} /> {t('demoNote')}
        </p>
      )}

      <div className="adm-grid">
        <SyncCard demo={demo} />
        <BlocklistCard demo={demo} />
      </div>
      <div style={{ marginTop: 18 }}>
        <UsersCard demo={demo} />
      </div>
      <div style={{ marginTop: 18 }}>
        <LeadsCard demo={demo} />
      </div>

      <style jsx>{`
        .adm-grid {
          display: grid;
          grid-template-columns: 5fr 7fr;
          gap: 18px;
          align-items: start;
        }
        @media (max-width: 1020px) {
          .adm-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Shared card styles (plain CSS string, injected once per card)
 * ------------------------------------------------------------------------ */
const CARD_CSS = `
  .padm-card { background: #fff; border: 1px solid var(--border); padding: clamp(20px, 2.2vw, 28px); }
  .padm-card h2 { display: flex; align-items: center; gap: 10px; margin: 0 0 8px; font-size: 15px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; }
  .padm-card .body { color: var(--text-muted); font-size: 13.5px; line-height: 1.6; margin: 0 0 18px; }
  .padm-card .head { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
  .padm-tablewrap { overflow-x: auto; }
  .padm-card table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .padm-card th { text-align: left; font-size: 10.5px; letter-spacing: 0.09em; text-transform: uppercase; color: var(--text-muted-2); font-weight: 700; padding: 8px 10px; border-bottom: 2px solid var(--black); white-space: nowrap; }
  .padm-card td { padding: 9px 10px; border-bottom: 1px solid var(--border); vertical-align: top; }
  .padm-card tr.off td { opacity: 0.55; }
  .padm-pill { font-size: 10px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; padding: 3px 8px; background: var(--surface); border: 1px solid var(--border-2); color: var(--text-muted-2); white-space: nowrap; display: inline-block; }
  .padm-pill--on { background: #eaf6ef; border-color: #bfe3cd; color: #0c7a43; }
  .padm-pill--pending { background: #fff7e6; border-color: #f2dfb3; color: #9a6b00; }
  .padm-pill--warn { background: #fdeaea; border-color: #f3c2c2; color: var(--red); }
  .padm-linkbtn { border: 0; background: none; font: inherit; font-size: 12px; font-weight: 700; color: var(--red); cursor: pointer; text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap; }
  .padm-linkbtn:hover { text-decoration: underline; }
  .padm-linkbtn--mut { color: var(--text-muted); }
  .padm-sel { font: inherit; font-size: 12px; padding: 4px 6px; border: 1px solid var(--border-2); background: #fff; color: var(--text); cursor: pointer; }
  .padm-inp { font: inherit; font-size: 13px; padding: 7px 10px; border: 1px solid var(--border-input); background: #fff; }
  .padm-note { font-size: 13px; color: var(--text-muted); margin: 0 0 12px; }
  .padm-err { color: var(--red); font-size: 13px; font-weight: 600; margin: 10px 0 0; }
  .padm-meta { font-size: 11px; color: var(--text-faint); }
  .padm-sub { border: 1px solid var(--border-2); background: var(--surface); padding: 14px; margin: 6px 0 4px; }
  .padm-sub .lbl { display: block; font-size: 10.5px; font-weight: 700; letter-spacing: .09em; text-transform: uppercase; color: var(--text-muted); margin: 10px 0 5px; }
  .padm-chip { display: inline-flex; align-items: center; gap: 7px; font-size: 12.5px; font-weight: 600; border: 1px solid var(--border-input); background: #fff; padding: 6px 9px; cursor: pointer; margin: 3px 6px 3px 0; }
  .padm-chip.on { border-color: var(--black); background: var(--black); color: #fff; }
  .padm-chip input { accent-color: var(--red); }
  .padm-tabs { display: flex; gap: 0; margin: 0 0 14px; border-bottom: 2px solid var(--black); }
  .padm-tab { font: inherit; font-size: 12px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; padding: 9px 16px; cursor: pointer; background: var(--surface); color: var(--text-muted-2); border: 1px solid var(--border); border-bottom: none; }
  .padm-tab.on { background: var(--black); color: #fff; border-color: var(--black); }
`;

/* ---------------------------------------------------------------------------
 * Pricelist sync (unchanged behaviour)
 * ------------------------------------------------------------------------ */
function SyncCard({ demo }: { demo: boolean }) {
  const t = useTranslations('portal.admin');
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState<SyncReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function upload() {
    const file = fileRef.current?.files?.[0];
    if (!file || busy) return;
    setBusy(true);
    setError(null);
    setReport(null);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/portal/sync', { method: 'POST', body: form });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setError(data?.error ?? t('syncFailed'));
      } else {
        setReport(data.report as SyncReport);
      }
    } catch {
      setError(t('syncFailed'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="padm-card">
      <h2>
        <CloudUpload size={16} /> {t('syncTitle')}
      </h2>
      <p className="body">{t('syncBody')}</p>

      <label className="drop">
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xlsm,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
        />
        <span className="drop__name">{fileName ?? t('chooseFile')}</span>
        <span className="drop__hint">Alto Pricing System .xlsx</span>
      </label>

      <button type="button" className="btn btn--dark btn--sm" onClick={upload} disabled={busy || !fileName}>
        {busy ? <RefreshCw size={13} className="spin" /> : <CloudUpload size={13} />}
        {busy ? t('syncing') : t('syncButton')}
      </button>

      {error && (
        <p className="msg msg--err" role="alert">
          <TriangleAlert size={14} /> {error}
        </p>
      )}

      {report && (
        <div className="report">
          <p className="msg msg--ok">
            <CheckCircle2 size={14} />
            {report.persisted ? t('syncDone') : t('notPersisted')}
          </p>
          <dl>
            <div>
              <dt>{t('total')}</dt>
              <dd>{report.total}</dd>
            </div>
            <div>
              <dt>{t('added')}</dt>
              <dd>+{report.added}</dd>
            </div>
            <div>
              <dt>{t('changed')}</dt>
              <dd>{report.changed}</dd>
            </div>
            <div>
              <dt>{t('removed')}</dt>
              <dd>−{report.removed}</dd>
            </div>
            <div>
              <dt>{t('unchanged')}</dt>
              <dd>{report.unchanged}</dd>
            </div>
          </dl>
          {report.skipped.length > 0 && (
            <details>
              <summary>
                {t('skipped')} ({report.skipped.length})
              </summary>
              <ul>
                {report.skipped.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}

      <style jsx>{`
        .padm-card {
          background: #fff;
          border: 1px solid var(--border);
          padding: clamp(20px, 2.2vw, 28px);
        }
        .padm-card h2 {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0 0 8px;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .body {
          color: var(--text-muted);
          font-size: 13.5px;
          line-height: 1.6;
          margin: 0 0 18px;
        }
        .drop {
          display: block;
          border: 1px dashed var(--border-input);
          background: var(--surface);
          padding: 22px 18px;
          text-align: center;
          cursor: pointer;
          margin-bottom: 14px;
        }
        .drop input {
          display: none;
        }
        .drop__name {
          display: block;
          font-weight: 700;
          font-size: 13.5px;
          margin-bottom: 4px;
          word-break: break-all;
        }
        .drop__hint {
          font-size: 11.5px;
          color: var(--text-faint);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .msg {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          margin: 14px 0 0;
        }
        .msg--err {
          color: var(--red);
        }
        .msg--ok {
          color: #0c7a43;
        }
        .report dl {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
          margin: 14px 0 0;
        }
        .report dl div {
          background: var(--surface);
          border: 1px solid var(--border-2);
          padding: 10px 8px;
          text-align: center;
        }
        .report dt {
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted-2);
        }
        .report dd {
          margin: 4px 0 0;
          font-size: 16px;
          font-weight: 800;
          font-variant-numeric: tabular-nums;
        }
        .report details {
          margin-top: 12px;
          font-size: 12.5px;
          color: var(--text-muted);
        }
        .report summary {
          cursor: pointer;
          font-weight: 700;
        }
        .report ul {
          margin: 8px 0 0;
          padding-left: 18px;
          max-height: 160px;
          overflow: auto;
        }
        :global(.spin) {
          animation: adm-spin 1s linear infinite;
        }
        @keyframes adm-spin {
          to {
            transform: rotate(360deg);
          }
        }
        @media (max-width: 560px) {
          .report dl {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * Blocklist — blocked_senders management
 * ------------------------------------------------------------------------ */
function BlocklistCard({ demo }: { demo: boolean }) {
  const [entries, setEntries] = useState<BlockEntry[] | null>(null);
  const [kind, setKind] = useState<'email' | 'domain'>('email');
  const [value, setValue] = useState('');
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/portal/blocklist');
      const data = await res.json().catch(() => null);
      if (data?.ok) setEntries((data.entries ?? []) as BlockEntry[]);
      else setError('Could not load the blocklist.');
    } catch {
      setError('Could not load the blocklist.');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function add() {
    if (busy || !value.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/portal/blocklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, value, reason }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) setError(data?.error ?? 'Could not add the entry.');
      else {
        setValue('');
        setReason('');
        void load();
      }
    } catch {
      setError('Could not add the entry.');
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    await fetch('/api/portal/blocklist', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).catch(() => undefined);
    void load();
  }

  return (
    <section className="padm-card">
      <h2>
        <Ban size={16} /> Blocklist
      </h2>
      <p className="body">
        Blocked senders never get a portal account, and their form submissions are stored as flagged and never
        delivered. Emails match on their canonical form (gmail dots and +suffixes collapsed).
      </p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        <select className="padm-sel" value={kind} onChange={(e) => setKind(e.target.value === 'domain' ? 'domain' : 'email')} aria-label="Kind">
          <option value="email">Email</option>
          <option value="domain">Domain</option>
        </select>
        <input
          className="padm-inp"
          style={{ flex: '1 1 180px' }}
          placeholder={kind === 'email' ? 'spammer@example.com' : 'example.com'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <input
          className="padm-inp"
          style={{ flex: '1 1 120px' }}
          placeholder="Reason (optional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <button type="button" className="btn btn--dark btn--sm" onClick={add} disabled={busy || !value.trim()}>
          <Plus size={13} /> Block
        </button>
      </div>
      {demo && <p className="padm-note">Demo mode — nothing is persisted.</p>}
      {error && (
        <p className="padm-err" role="alert">
          {error}
        </p>
      )}

      {entries && entries.length === 0 && <p className="padm-note">Nothing blocked yet.</p>}
      {entries && entries.length > 0 && (
        <div className="padm-tablewrap" style={{ maxHeight: 260, overflowY: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Kind</th>
                <th>Value</th>
                <th>Reason</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id}>
                  <td>
                    <span className="padm-pill">{e.kind}</span>
                  </td>
                  <td style={{ wordBreak: 'break-all' }}>{e.value}</td>
                  <td>{e.reason ?? '—'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button type="button" className="padm-linkbtn padm-linkbtn--mut" onClick={() => remove(e.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <style dangerouslySetInnerHTML={{ __html: CARD_CSS }} />
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * Client accounts
 * ------------------------------------------------------------------------ */
type StatusFilter = 'all' | 'active' | 'pending' | 'deactivated' | 'unconfirmed';

function statusOf(u: PortalUserRow): { key: StatusFilter | 'admin'; label: string; cls: string } {
  if (u.role === 'admin') return { key: 'admin', label: 'Admin', cls: 'padm-pill padm-pill--on' };
  if (u.emailConfirmed === false) return { key: 'unconfirmed', label: 'Email unconfirmed', cls: 'padm-pill padm-pill--warn' };
  if (!u.active && u.pendingReason) return { key: 'pending', label: `Pending: ${u.pendingReason}`, cls: 'padm-pill padm-pill--pending' };
  if (!u.active) return { key: 'deactivated', label: 'Deactivated', cls: 'padm-pill' };
  return { key: 'active', label: 'Active', cls: 'padm-pill padm-pill--on' };
}

function UsersCard({ demo }: { demo: boolean }) {
  const t = useTranslations('portal.admin');
  const bt = useTranslations('portal.businessTypes');
  const [users, setUsers] = useState<PortalUserRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState<'all' | 'pending'>('all');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'producer' | 'installer' | 'b2c' | 'architect'>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState<{ id: string; mode: 'approve' | 'reject' } | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);

  const countryOptions = useMemo(
    () => Array.from(new Set((users ?? []).map((u) => u.country).filter((c): c is string => Boolean(c)))).sort(),
    [users],
  );
  const pendingCount = useMemo(
    () => (users ?? []).filter((u) => !u.active && u.pendingReason).length,
    [users],
  );

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/portal/users');
      const data = await res.json().catch(() => null);
      if (data?.ok) setUsers(data.users as PortalUserRow[]);
      else setError(data?.error ?? 'error');
    } catch {
      setError('error');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function toggleActive(u: PortalUserRow) {
    setNotice(null);
    const res = await fetch('/api/portal/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: u.id, active: !u.active }),
    });
    const data = await res.json().catch(() => null);
    if (data?.ok) {
      if (!data.persisted) setNotice(t('demoNote'));
      setUsers((prev) => prev?.map((x) => (x.id === u.id ? { ...x, active: !u.active } : x)) ?? null);
    }
  }

  async function setType(u: PortalUserRow, next: 'producer' | 'installer' | 'b2c' | 'architect') {
    setNotice(null);
    const res = await fetch('/api/portal/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: u.id, accountType: next }),
    });
    const data = await res.json().catch(() => null);
    if (data?.ok) {
      if (!data.persisted) setNotice(t('demoNote'));
      setUsers((prev) => prev?.map((x) => (x.id === u.id ? { ...x, accountType: next } : x)) ?? null);
    }
  }

  async function deleteUsers(ids: string[], markSpam: boolean) {
    if (busy || ids.length === 0) return;
    const what = ids.length === 1 ? 'this account' : `${ids.length} accounts`;
    if (!window.confirm(markSpam ? `Mark ${what} as spam? This deletes the login(s) and blocks the address(es).` : `Delete ${what}? The login(s) and profile(s) are removed permanently.`)) {
      return;
    }
    const blockDomain = markSpam ? window.confirm('Also block the whole email domain(s)? Cancel = block only the address(es).') : false;
    setBusy(true);
    setNotice(null);
    try {
      const res = await fetch('/api/portal/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, markSpam, blockDomain }),
      });
      const data = await res.json().catch(() => null);
      if (data?.ok) {
        setNotice(data.persisted ? `${markSpam ? 'Marked as spam' : 'Deleted'}: ${data.deleted} account(s).` : t('demoNote'));
        setSelected(new Set());
        void load();
      } else {
        setNotice(data?.error ?? 'The action failed.');
      }
    } finally {
      setBusy(false);
    }
  }

  const list = (users ?? [])
    .filter((u) => (tab === 'pending' ? !u.active && Boolean(u.pendingReason) : true))
    .filter((u) => statusFilter === 'all' || statusOf(u).key === statusFilter)
    .filter((u) => typeFilter === 'all' || (u.accountType ?? 'installer') === typeFilter)
    .filter((u) => countryFilter === 'all' || u.country === countryFilter)
    .filter((u) => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return [u.email, u.company, u.contactName, u.office, u.canonicalEmail]
        .some((v) => (v ?? '').toLowerCase().includes(q));
    });

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <section className="padm-card">
      <div className="head">
        <h2>
          <UserRound size={16} /> {t('usersTitle')}
        </h2>
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => setShowForm((v) => !v)}>
          <Plus size={13} /> {t('createTitle')}
        </button>
      </div>
      <p className="body">{t('usersBody')}</p>

      {showForm && (
        <CreateForm
          demo={demo}
          onCreated={(msg) => {
            setNotice(msg);
            setShowForm(false);
            void load();
          }}
        />
      )}

      <div className="padm-tabs">
        <button type="button" className={tab === 'all' ? 'padm-tab on' : 'padm-tab'} onClick={() => setTab('all')}>
          All accounts
        </button>
        <button type="button" className={tab === 'pending' ? 'padm-tab on' : 'padm-tab'} onClick={() => setTab('pending')}>
          Pending ({pendingCount})
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        <input
          className="padm-inp"
          style={{ flex: '1 1 200px' }}
          placeholder="Search email / company / name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="padm-sel" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)} aria-label="Status">
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="deactivated">Deactivated</option>
          <option value="unconfirmed">Email unconfirmed</option>
        </select>
        <select className="padm-sel" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)} aria-label={t('colType')}>
          <option value="all">{t('filterAllTypes')}</option>
          <option value="producer">{t('typeProducer')}</option>
          <option value="installer">{t('typeInstaller')}</option>
          <option value="b2c">Private client</option>
          <option value="architect">{t('typeArchitect')}</option>
        </select>
        {countryOptions.length > 1 && (
          <select className="padm-sel" value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} aria-label={t('colCountry')}>
            <option value="all">{t('filterAllCountries')}</option>
            {countryOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}
      </div>

      {selected.size > 0 && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12.5, fontWeight: 700 }}>{selected.size} selected</span>
          <button type="button" className="btn btn--dark btn--sm" disabled={busy} onClick={() => deleteUsers([...selected], false)}>
            Delete
          </button>
          <button type="button" className="btn btn--primary btn--sm" disabled={busy} onClick={() => deleteUsers([...selected], true)}>
            <ShieldX size={13} /> Mark as spam
          </button>
        </div>
      )}

      {notice && <p className="padm-note">{notice}</p>}
      {error && (
        <p className="padm-note" role="alert" style={{ color: 'var(--red)' }}>
          {t('loadFailed')}
        </p>
      )}
      {!users && !error && <p className="padm-note">{t('loading')}</p>}

      {users && (
        <div className="padm-tablewrap">
          <table>
            <thead>
              <tr>
                <th />
                <th>{t('colEmail')}</th>
                <th>{t('colCompany')}</th>
                <th>Created</th>
                <th>{t('colType')}</th>
                <th>{t('colCountry')}</th>
                <th>{t('colMarkets')}</th>
                <th>{t('colStatus')}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {list.map((u) => {
                const st = statusOf(u);
                const isPending = st.key === 'pending';
                const open = expanded === u.id;
                return (
                  <FragmentRow
                    key={u.id}
                    u={u}
                    st={st}
                    open={open}
                    isPending={isPending}
                    selected={selected.has(u.id)}
                    reviewing={reviewing?.id === u.id ? reviewing.mode : null}
                    busy={busy}
                    bt={(k) => ((BUSINESS_TYPE_KEYS as readonly string[]).includes(k) ? bt(k as (typeof BUSINESS_TYPE_KEYS)[number]) : k)}
                    t={t}
                    onToggleSelect={() => toggleSelect(u.id)}
                    onToggleExpand={() => setExpanded(open ? null : u.id)}
                    onToggleActive={() => toggleActive(u)}
                    onSetType={(next) => setType(u, next)}
                    onDelete={() => deleteUsers([u.id], false)}
                    onMarkSpam={() => deleteUsers([u.id], true)}
                    onReview={(mode) => setReviewing(reviewing?.id === u.id && reviewing.mode === mode ? null : { id: u.id, mode })}
                    onReviewed={(msg) => {
                      setReviewing(null);
                      setNotice(msg);
                      void load();
                    }}
                  />
                );
              })}
            </tbody>
          </table>
          {list.length === 0 && <p className="padm-note" style={{ marginTop: 12 }}>No accounts match.</p>}
        </div>
      )}
      <style dangerouslySetInnerHTML={{ __html: CARD_CSS }} />
    </section>
  );
}

function FragmentRow(props: {
  u: PortalUserRow;
  st: { label: string; cls: string };
  open: boolean;
  isPending: boolean;
  selected: boolean;
  reviewing: 'approve' | 'reject' | null;
  busy: boolean;
  bt: (k: string) => string;
  t: ReturnType<typeof useTranslations>;
  onToggleSelect: () => void;
  onToggleExpand: () => void;
  onToggleActive: () => void;
  onSetType: (next: 'producer' | 'installer' | 'b2c' | 'architect') => void;
  onDelete: () => void;
  onMarkSpam: () => void;
  onReview: (mode: 'approve' | 'reject') => void;
  onReviewed: (msg: string) => void;
}) {
  const { u, st, open, isPending, selected, reviewing, busy, bt, t } = props;
  const created = u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-GB') : '—';
  return (
    <>
      <tr className={u.active || isPending ? '' : 'off'}>
        <td>
          {u.role !== 'admin' && (
            <input type="checkbox" checked={selected} onChange={props.onToggleSelect} style={{ accentColor: 'var(--red)' }} aria-label={`Select ${u.email}`} />
          )}
        </td>
        <td style={{ wordBreak: 'break-all' }}>
          {u.email}
          <button
            type="button"
            className="padm-linkbtn padm-linkbtn--mut"
            style={{ display: 'block', marginTop: 2, textTransform: 'none', letterSpacing: 0 }}
            onClick={props.onToggleExpand}
          >
            {open ? <ChevronUp size={11} style={{ verticalAlign: -1 }} /> : <ChevronDown size={11} style={{ verticalAlign: -1 }} />} details
          </button>
        </td>
        <td>
          <div>{u.company ?? u.office ?? '—'}</div>
          {(u.contactName || u.phone || u.vat || u.businessType || u.city) && (
            <div className="padm-meta" style={{ maxWidth: 240 }}>
              {[u.city, u.contactName, u.phone, u.vat, u.businessType ? bt(u.businessType) : null].filter(Boolean).join(' · ')}
            </div>
          )}
        </td>
        <td style={{ whiteSpace: 'nowrap' }}>{created}</td>
        <td>
          {u.role === 'admin' ? (
            t('roleAdmin')
          ) : (
            <select className="padm-sel" value={u.accountType ?? 'installer'} onChange={(e) => props.onSetType(e.target.value as 'producer' | 'installer' | 'b2c' | 'architect')}>
              <option value="producer">{t('typeProducer')}</option>
              <option value="installer">{t('typeInstaller')}</option>
              <option value="b2c">Private client</option>
              <option value="architect">{t('typeArchitect')}</option>
            </select>
          )}
        </td>
        <td>{u.country ?? '—'}</td>
        <td style={{ maxWidth: 200 }}>{u.allMarkets ? t('allMarketsLabel') : u.markets.join(', ') || '—'}</td>
        <td>
          <span className={st.cls}>{st.label}</span>
        </td>
        <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
          {u.role !== 'admin' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
              {isPending && (
                <>
                  <button type="button" className="padm-linkbtn" onClick={() => props.onReview('approve')}>
                    Approve
                  </button>
                  <button type="button" className="padm-linkbtn padm-linkbtn--mut" onClick={() => props.onReview('reject')}>
                    Reject
                  </button>
                </>
              )}
              {!isPending && (
                <button type="button" className="padm-linkbtn" onClick={props.onToggleActive}>
                  {u.active ? t('deactivate') : t('activate')}
                </button>
              )}
              <button type="button" className="padm-linkbtn padm-linkbtn--mut" disabled={busy} onClick={props.onDelete}>
                Delete
              </button>
              <button type="button" className="padm-linkbtn padm-linkbtn--mut" disabled={busy} onClick={props.onMarkSpam}>
                Mark as spam
              </button>
            </div>
          )}
        </td>
      </tr>
      {open && (
        <tr>
          <td colSpan={9} style={{ background: 'var(--surface)' }}>
            <div className="padm-meta" style={{ fontSize: 12, lineHeight: 1.7 }}>
              <strong>Canonical email:</strong> {u.canonicalEmail ?? '—'} · <strong>Signed up:</strong>{' '}
              {u.createdAt ? new Date(u.createdAt).toLocaleString('en-GB') : '—'}
              <br />
              <strong>Signup IP:</strong> {u.signupIp ?? '—'} · <strong>Host:</strong> {u.signupHost ?? '—'} ·{' '}
              <strong>Locale:</strong> {u.signupLocale ?? '—'}
              <br />
              <strong>User agent:</strong> {u.signupUa ? u.signupUa.slice(0, 140) : '—'}
            </div>
          </td>
        </tr>
      )}
      {reviewing && (
        <tr>
          <td colSpan={9}>
            <InlineReview u={u} mode={reviewing} onDone={props.onReviewed} />
          </td>
        </tr>
      )}
    </>
  );
}

/** Inline approve/reject — same POST contract as the signed review page. */
function InlineReview({ u, mode, onDone }: { u: PortalUserRow; mode: 'approve' | 'reject'; onDone: (msg: string) => void }) {
  const locale = useLocale();
  const isArchitect = (u.accountType ?? 'installer') === 'architect';
  const [markets, setMarkets] = useState<string[]>(u.markets);
  const [allMarkets, setAllMarkets] = useState(u.allMarkets);
  const [country, setCountry] = useState(u.country ?? '');
  const [accountType, setAccountType] = useState(u.accountType ?? 'installer');
  const [reason, setReason] = useState('not_a_business');
  const [block, setBlock] = useState(false);
  const [blockDomain, setBlockDomain] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const countries = useMemo(() => signupCountryOptions(locale), [locale]);

  async function post(payload: Record<string, unknown>) {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/portal/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: u.id, ...payload }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setError(
          data?.error === 'markets_required'
            ? 'Select at least one market (or all markets) first.'
            : data?.error ?? 'The action failed.',
        );
        return;
      }
      onDone(data.action === 'approved' ? `${u.email} approved — the approval email is on its way.` : `${u.email} rejected and deleted.`);
    } catch {
      setError('The action failed.');
    } finally {
      setBusy(false);
    }
  }

  if (mode === 'reject') {
    return (
      <div className="padm-sub">
        <span className="lbl">Reject {u.email}</span>
        <select className="padm-sel" value={reason} onChange={(e) => setReason(e.target.value)}>
          {REJECT_REASONS.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
        <label className="padm-chip">
          <input type="checkbox" checked={block} onChange={(e) => setBlock(e.target.checked)} /> Block this address
        </label>
        <label className="padm-chip">
          <input type="checkbox" checked={blockDomain} onChange={(e) => setBlockDomain(e.target.checked)} /> Block the domain
        </label>
        <div style={{ marginTop: 10 }}>
          <button type="button" className="btn btn--dark btn--sm" disabled={busy} onClick={() => post({ action: 'reject', reason, block, blockDomain })}>
            {busy ? 'Working…' : 'Reject and delete'}
          </button>
        </div>
        {error && <p className="padm-err">{error}</p>}
      </div>
    );
  }

  return (
    <div className="padm-sub">
      <span className="lbl">Approve {u.email}</span>
      {!isArchitect && (
        <>
          <select className="padm-sel" value={accountType} onChange={(e) => setAccountType(e.target.value as typeof accountType)}>
            <option value="producer">Producer / Reseller</option>
            <option value="installer">Installer</option>
            <option value="b2c">Private client</option>
          </select>
          <span className="lbl">Markets</span>
          <label className="padm-chip">
            <input type="checkbox" checked={allMarkets} onChange={(e) => setAllMarkets(e.target.checked)} /> All markets
          </label>
          {!allMarkets &&
            PRICE_MARKETS.map((m) => (
              <label key={m} className={markets.includes(m) ? 'padm-chip on' : 'padm-chip'}>
                <input
                  type="checkbox"
                  checked={markets.includes(m)}
                  onChange={() => setMarkets((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]))}
                />
                {m}
              </label>
            ))}
          <span className="lbl">Country</span>
          <select className="padm-sel" value={country} onChange={(e) => setCountry(e.target.value)}>
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
      {isArchitect && <p className="padm-note" style={{ margin: '4px 0 0' }}>Architect account — approval needs no markets.</p>}
      <div style={{ marginTop: 10 }}>
        <button
          type="button"
          className="btn btn--primary btn--sm"
          disabled={busy}
          onClick={() => post({ action: 'approve', markets, allMarkets, country, ...(isArchitect ? {} : { accountType }) })}
        >
          {busy ? 'Working…' : 'Approve account'}
        </button>
      </div>
      {error && <p className="padm-err">{error}</p>}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Leads
 * ------------------------------------------------------------------------ */
function LeadsCard({ demo }: { demo: boolean }) {
  const [leads, setLeads] = useState<LeadRow[] | null>(null);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState<'all' | 'flagged' | 'delivered'>('all');
  const [page, setPage] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const pageSize = 50;

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/portal/leads?filter=${filter}&page=${page}`);
      const data = await res.json().catch(() => null);
      if (data?.ok) {
        setLeads((data.leads ?? []) as LeadRow[]);
        setTotal(Number(data.total ?? 0));
      }
    } catch {
      /* keep previous state */
    }
  }, [filter, page]);

  useEffect(() => {
    void load();
  }, [load]);

  async function act(id: string, action: 'deliver' | 'delete') {
    if (busy) return;
    if (action === 'delete' && !window.confirm('Delete this lead permanently?')) return;
    setBusy(true);
    setNotice(null);
    try {
      const res = await fetch('/api/portal/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });
      const data = await res.json().catch(() => null);
      if (data?.ok) {
        setNotice(
          action === 'delete'
            ? 'Lead deleted.'
            : data.already
              ? 'Already delivered — nothing sent again.'
              : data.delivered
                ? `Delivered via ${data.method}.`
                : 'No delivery method configured — the lead stays stored.',
        );
        void load();
      } else {
        setNotice(data?.error ?? 'The action failed.');
      }
    } finally {
      setBusy(false);
    }
  }

  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <section className="padm-card">
      <div className="head">
        <h2>
          <Download size={16} /> Leads
        </h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            className="padm-sel"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value as typeof filter);
              setPage(0);
            }}
            aria-label="Filter"
          >
            <option value="all">All</option>
            <option value="flagged">Flagged</option>
            <option value="delivered">Delivered</option>
          </select>
          <a className="btn btn--ghost btn--sm" href={`/api/portal/leads?filter=${filter}&format=csv`}>
            <Download size={13} /> Export CSV
          </a>
        </div>
      </div>
      <p className="body">
        Every form submission, newest first. Flagged leads were stored but not delivered — review the reasons and use
        “Deliver now” for false positives.
      </p>
      {demo && <p className="padm-note">Demo mode — no leads database.</p>}
      {notice && <p className="padm-note">{notice}</p>}

      {leads && (
        <div className="padm-tablewrap">
          <table>
            <thead>
              <tr>
                <th>Created</th>
                <th>Source</th>
                <th>Name</th>
                <th>Company</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Host</th>
                <th>Score</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => {
                const open = expanded === l.id;
                return (
                  <LeadRowView
                    key={l.id}
                    l={l}
                    open={open}
                    busy={busy}
                    onToggle={() => setExpanded(open ? null : l.id)}
                    onDeliver={() => act(l.id, 'deliver')}
                    onDelete={() => act(l.id, 'delete')}
                  />
                );
              })}
            </tbody>
          </table>
          {leads.length === 0 && <p className="padm-note" style={{ marginTop: 12 }}>No leads in this view.</p>}
        </div>
      )}

      {pages > 1 && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 14 }}>
          <button type="button" className="btn btn--ghost btn--sm" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
            ← Newer
          </button>
          <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
            Page {page + 1} of {pages} · {total} leads
          </span>
          <button type="button" className="btn btn--ghost btn--sm" disabled={page + 1 >= pages} onClick={() => setPage((p) => p + 1)}>
            Older →
          </button>
        </div>
      )}
      <style dangerouslySetInnerHTML={{ __html: CARD_CSS }} />
    </section>
  );
}

function LeadRowView({
  l,
  open,
  busy,
  onToggle,
  onDeliver,
  onDelete,
}: {
  l: LeadRow;
  open: boolean;
  busy: boolean;
  onToggle: () => void;
  onDeliver: () => void;
  onDelete: () => void;
}) {
  const status = l.flagged ? (
    <span className="padm-pill padm-pill--warn">Flagged</span>
  ) : l.delivered ? (
    <span className="padm-pill padm-pill--on">Delivered</span>
  ) : (
    <span className="padm-pill">Stored</span>
  );
  return (
    <>
      <tr>
        <td style={{ whiteSpace: 'nowrap' }}>{new Date(l.created_at).toLocaleString('en-GB')}</td>
        <td>{l.source ?? '—'}</td>
        <td>{l.name ?? '—'}</td>
        <td>{l.company ?? '—'}</td>
        <td style={{ wordBreak: 'break-all' }}>{l.email ?? '—'}</td>
        <td style={{ whiteSpace: 'nowrap' }}>{l.phone ?? '—'}</td>
        <td>{l.host ?? '—'}</td>
        <td style={{ fontVariantNumeric: 'tabular-nums' }}>{l.spam_score ?? '—'}</td>
        <td>{status}</td>
        <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
            <button type="button" className="padm-linkbtn padm-linkbtn--mut" onClick={onToggle}>
              {open ? 'Hide' : 'Details'}
            </button>
            {l.flagged && (
              <button type="button" className="padm-linkbtn" disabled={busy} onClick={onDeliver}>
                Deliver now
              </button>
            )}
            <button type="button" className="padm-linkbtn padm-linkbtn--mut" disabled={busy} onClick={onDelete}>
              Delete
            </button>
          </div>
        </td>
      </tr>
      {open && (
        <tr>
          <td colSpan={10} style={{ background: 'var(--surface)' }}>
            <div className="padm-meta" style={{ fontSize: 12, lineHeight: 1.7 }}>
              {l.spam_reasons && l.spam_reasons.length > 0 && (
                <>
                  <strong>Spam reasons:</strong> {l.spam_reasons.join(', ')}
                  <br />
                </>
              )}
              {l.message && (
                <>
                  <strong>Message:</strong> {l.message.slice(0, 600)}
                  <br />
                </>
              )}
              <strong>Delivery:</strong> {l.delivered ? `${l.delivery_method ?? 'yes'}${l.delivered_at ? ` at ${new Date(l.delivered_at).toLocaleString('en-GB')}` : ''}` : l.delivery_method ?? 'not delivered'}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

/* ---------------------------------------------------------------------------
 * Create account (unchanged behaviour; "Private client" label)
 * ------------------------------------------------------------------------ */
function CreateForm({ demo, onCreated }: { demo: boolean; onCreated: (msg: string) => void }) {
  const t = useTranslations('portal.admin');
  const locale = useLocale();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState<'client' | 'admin'>('client');
  const [accountType, setAccountType] = useState<'producer' | 'installer' | 'b2c' | 'architect'>('installer');
  const [country, setCountry] = useState('');
  const [allMarkets, setAllMarkets] = useState(false);
  const [markets, setMarkets] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const countries = useMemo(() => signupCountryOptions(locale), [locale]);

  function toggleMarket(m: string) {
    setMarkets((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  }

  async function submit() {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/portal/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, company, role, accountType, country, markets, allMarkets }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setError(data?.error ?? t('createFailed'));
      } else {
        onCreated(data.persisted ? t('createdOk', { email }) : t('demoNote'));
      }
    } catch {
      setError(t('createFailed'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="form">
      <div className="grid">
        <label>
          <span>{t('colEmail')}</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="client@company.com" />
        </label>
        <label>
          <span>{t('tempPassword')}</span>
          <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="min. 8" />
        </label>
        <label>
          <span>{t('colCompany')}</span>
          <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} />
        </label>
        <label>
          <span>{t('colRole')}</span>
          <select value={role} onChange={(e) => setRole(e.target.value === 'admin' ? 'admin' : 'client')}>
            <option value="client">{t('roleClient')}</option>
            <option value="admin">{t('roleAdmin')}</option>
          </select>
        </label>
        <label>
          <span>{t('colType')}</span>
          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value as 'producer' | 'installer' | 'b2c' | 'architect')}
            disabled={role === 'admin'}
          >
            <option value="producer">{t('typeProducer')}</option>
            <option value="installer">{t('typeInstaller')}</option>
            <option value="b2c">Private client</option>
            <option value="architect">{t('typeArchitect')}</option>
          </select>
        </label>
        <label>
          <span>{t('colCountry')}</span>
          <select value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="">—</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
            <option value="OTHER">{t('countryOther')}</option>
          </select>
        </label>
      </div>

      {(role === 'admin' || (accountType !== 'b2c' && accountType !== 'architect')) && (
        <div className="markets">
          <span className="lbl">{t('colMarkets')}</span>
          <label className="chk chk--all">
            <input type="checkbox" checked={allMarkets || role === 'admin'} onChange={(e) => setAllMarkets(e.target.checked)} disabled={role === 'admin'} />
            {t('allMarketsLabel')}
          </label>
          {!allMarkets && role !== 'admin' && (
            <div className="chips">
              {PRICE_MARKETS.map((m) => (
                <label key={m} className={markets.includes(m) ? 'chk on' : 'chk'}>
                  <input type="checkbox" checked={markets.includes(m)} onChange={() => toggleMarket(m)} />
                  {m}
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="err" role="alert">
          {error}
        </p>
      )}

      <button type="button" className="btn btn--primary btn--sm" onClick={submit} disabled={busy}>
        {busy ? t('creating') : t('create')}
      </button>
      {demo && <span className="demohint">{t('demoNote')}</span>}

      <style jsx>{`
        .form {
          border: 1px solid var(--border-2);
          background: var(--surface);
          padding: 16px;
          margin: 0 0 18px;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        label span,
        .lbl {
          display: block;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 5px;
        }
        input[type='email'],
        input[type='text'],
        select {
          width: 100%;
          padding: 10px 11px;
          border: 1px solid var(--border-input);
          background: #fff;
          font: inherit;
          font-size: 13.5px;
        }
        .markets {
          margin: 14px 0;
        }
        .chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
        }
        .chk {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 12.5px;
          font-weight: 600;
          border: 1px solid var(--border-input);
          background: #fff;
          padding: 7px 10px;
          cursor: pointer;
        }
        .chk.on {
          border-color: var(--black);
          background: var(--black);
          color: #fff;
        }
        .chk input {
          accent-color: var(--red);
        }
        .chk--all {
          margin-top: 2px;
        }
        .err {
          color: var(--red);
          font-size: 13px;
          font-weight: 600;
          margin: 0 0 10px;
        }
        .demohint {
          margin-left: 12px;
          font-size: 12px;
          color: var(--text-faint);
        }
        @media (max-width: 640px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
