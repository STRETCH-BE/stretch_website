'use client';

// CLIENT PORTAL — admin ▸ Training days.
// The editor for public.training_sessions: the Beveren-Waas installer-training
// days shown on /installer-training (every HQ locale), in both booking forms,
// in the architects' events and in Google's Event data. A save revalidates the
// pages at once (no deploy); a day disappears from the sites on its own date.
// A website booking never changes the seats — the team sets seats or "Full"
// here once the pro forma is paid.
//
// Admin-only and EN-only, like the rest of the panel (hardcoded strings).
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarDays, Plus, RefreshCw } from 'lucide-react';
import {
  TRAINING_DEFAULT_LOCATION,
  TRAINING_LANGUAGES,
  TRAINING_TIMEZONE,
  type TrainingStatus,
  type TrainingSystem,
} from '@/lib/training/config';
import type { TrainingRow } from '@/lib/training/types';
import { CARD_CSS } from './admin-css';

type Row = TrainingRow & { note: string | null; requests: number };

const SYSTEM_LABELS: Record<TrainingSystem, string> = {
  polyester: 'Polyester',
  pvc: 'PVC',
  both: 'Polyester + PVC',
};

const FIELD_LABELS: Record<string, string> = {
  starts_on: 'Date',
  ends_on: 'End date',
  system: 'System',
  languages: 'Languages',
  location: 'Location',
  seats_left: 'Seats left',
  status: 'Status',
  published: 'Show on the website',
  note: 'Internal note',
};

type FormState = {
  id: string | null;
  starts_on: string;
  ends_on: string;
  system: TrainingSystem;
  languages: string[];
  location: string;
  seats_left: string;
  status: TrainingStatus;
  published: boolean;
  note: string;
};

const EMPTY_FORM: FormState = {
  id: null,
  starts_on: '',
  ends_on: '',
  system: 'polyester',
  languages: ['NL'],
  location: TRAINING_DEFAULT_LOCATION,
  seats_left: '',
  status: 'open',
  published: true,
  note: '',
};

/** Today (YYYY-MM-DD) in the training time zone — the same "today" the sites use. */
function todayIso(): string {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: TRAINING_TIMEZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

type DateParts = { wd: string; d: string; m: string; y: string };

function parts(iso: string): DateParts {
  const [y, m, d] = iso.split('-').map(Number);
  const p = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).formatToParts(
    new Date(Date.UTC(y, m - 1, d)),
  );
  const get = (t: string) => p.find((x) => x.type === t)?.value ?? '';
  return { wd: get('weekday'), d: get('day'), m: get('month'), y: get('year') };
}

/** "Thu 19 Nov 2026"; a block: "Thu 19 – Fri 20 Nov 2026" (or with both months / years when they differ). */
function formatDay(row: Pick<Row, 'starts_on' | 'ends_on'>): string {
  const a = parts(row.starts_on);
  if (!row.ends_on || row.ends_on === row.starts_on) return `${a.wd} ${a.d} ${a.m} ${a.y}`;
  const b = parts(row.ends_on);
  if (a.y !== b.y) return `${a.wd} ${a.d} ${a.m} ${a.y} – ${b.wd} ${b.d} ${b.m} ${b.y}`;
  if (a.m !== b.m) return `${a.wd} ${a.d} ${a.m} – ${b.wd} ${b.d} ${b.m} ${b.y}`;
  return `${a.wd} ${a.d} – ${b.wd} ${b.d} ${b.m} ${b.y}`;
}

function isFull(row: Pick<Row, 'status' | 'seats_left'>): boolean {
  return row.status === 'full' || row.seats_left === 0;
}

export default function TrainingSessionsCard({ demo }: { demo: boolean }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/portal/training-sessions');
      const data = await res.json().catch(() => null);
      if (data?.ok) setRows((data.sessions ?? []) as Row[]);
      else setError(data?.error ?? 'Could not load the training days.');
    } catch {
      setError('Could not load the training days.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const today = useMemo(() => todayIso(), []);
  const upcoming = useMemo(() => (rows ?? []).filter((r) => r.starts_on >= today), [rows, today]);
  const past = useMemo(() => (rows ?? []).filter((r) => r.starts_on < today).sort((a, b) => b.starts_on.localeCompare(a.starts_on)), [rows, today]);

  /** One request to the API; on success the fresh list replaces the table. */
  async function write(method: 'POST' | 'PATCH' | 'DELETE', body: Record<string, unknown>, okNotice: string): Promise<boolean> {
    setBusy(true);
    setNotice(null);
    setError(null);
    try {
      const res = await fetch('/api/portal/training-sessions', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        const field = typeof data?.error === 'string' ? data.error : '';
        setFormError(FIELD_LABELS[field] ? `${FIELD_LABELS[field]}: please check this field.` : field || 'The change was not saved.');
        return false;
      }
      if (data.persisted === false) {
        setNotice('Demo mode — nothing is persisted.');
        return true;
      }
      setRows((data.sessions ?? []) as Row[]);
      setNotice(okNotice);
      return true;
    } catch {
      setFormError('The change was not saved.');
      return false;
    } finally {
      setBusy(false);
    }
  }

  function openAdd() {
    setFormError(null);
    setForm({ ...EMPTY_FORM });
  }
  function openEdit(r: Row) {
    setFormError(null);
    setForm({
      id: r.id,
      starts_on: r.starts_on,
      ends_on: r.ends_on ?? '',
      system: r.system,
      languages: [...r.languages],
      location: r.location,
      seats_left: r.seats_left === null ? '' : String(r.seats_left),
      status: r.status,
      published: r.published,
      note: r.note ?? '',
    });
  }
  /** Everything but the date — a new day with the same set-up. */
  function openDuplicate(r: Row) {
    setFormError(null);
    setForm({
      id: null,
      starts_on: '',
      ends_on: '',
      system: r.system,
      languages: [...r.languages],
      location: r.location,
      seats_left: r.seats_left === null ? '' : String(r.seats_left),
      status: 'open',
      published: r.published,
      note: r.note ?? '',
    });
  }

  async function save() {
    if (!form || busy) return;
    setFormError(null);
    if (!form.starts_on) return setFormError('Date: pick the day of the training.');
    if (form.ends_on && form.ends_on < form.starts_on) return setFormError('End date: must be on or after the date.');
    if (form.languages.length === 0) return setFormError('Languages: tick at least one.');
    const seats = form.seats_left.trim();
    if (seats && !/^\d{1,2}$/.test(seats)) return setFormError('Seats left: a whole number from 0 to 99, or empty.');
    if (form.note.length > 500) return setFormError('Internal note: 500 characters at most.');
    const payload = {
      starts_on: form.starts_on,
      ends_on: form.ends_on || null,
      system: form.system,
      languages: form.languages,
      location: form.location.trim() || TRAINING_DEFAULT_LOCATION,
      seats_left: seats ? Number(seats) : null,
      status: form.status,
      published: form.published,
      note: form.note.trim() || null,
    };
    const ok = form.id
      ? await write('PATCH', { id: form.id, ...payload }, 'Saved — live on the sites within a minute.')
      : await write('POST', payload, 'Saved — live on the sites within a minute.');
    if (ok) setForm(null);
  }

  async function quick(r: Row, patch: Partial<Pick<Row, 'status' | 'published'>>, okNotice: string) {
    if (busy) return;
    await write('PATCH', { id: r.id, ...patch }, okNotice);
  }

  async function remove(r: Row) {
    if (busy) return;
    if (!window.confirm('Delete this day? Requests already received keep their date text.')) return;
    await write('DELETE', { id: r.id }, 'Deleted — gone from the sites within a minute.');
  }

  const toggleLanguage = (l: string) =>
    setForm((f) => (f ? { ...f, languages: f.languages.includes(l) ? f.languages.filter((x) => x !== l) : [...f.languages, l] } : f));

  const pills = (languages: string[]) => (
    <span style={{ display: 'inline-flex', gap: 4, flexWrap: 'wrap' }}>
      {languages.map((l) => (
        <span key={l} className="padm-pill">
          {l}
        </span>
      ))}
    </span>
  );

  const statusPill = (r: Row) =>
    isFull(r) ? <span className="padm-pill padm-pill--warn">Full</span> : <span className="padm-pill padm-pill--on">Open</span>;

  return (
    <section className="padm-card">
      <div className="head">
        <h2>
          <CalendarDays size={16} /> Training days
        </h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button type="button" className="padm-linkbtn padm-linkbtn--mut" onClick={() => void load()} disabled={loading}>
            <RefreshCw size={12} style={{ verticalAlign: -2, marginRight: 4 }} /> Refresh
          </button>
          <button type="button" className="btn btn--dark btn--sm" onClick={openAdd} disabled={busy}>
            <Plus size={13} /> Add a day
          </button>
        </div>
      </div>
      <p className="body">
        The dates on the installer-training page of every site, in both booking forms, in the architects’ events and in
        Google’s event data. Saved changes are live within a minute — no deploy. A day disappears by itself on its date.
      </p>

      {demo && <p className="padm-note">Demo mode — nothing is persisted.</p>}
      {notice && <p className="padm-note">{notice}</p>}
      {error && (
        <p className="padm-err" role="alert">
          {error}
        </p>
      )}
      {!rows && !error && <p className="padm-note">Loading…</p>}

      {form && (
        <div className="padm-sub" style={{ marginBottom: 16 }}>
          <strong style={{ fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase' }}>{form.id ? 'Edit' : 'Add a day'}</strong>
          <div className="ptr-form">
            <div>
              <label className="lbl" htmlFor="ptr-date">Date *</label>
              <input id="ptr-date" className="padm-inp" type="date" value={form.starts_on} onChange={(e) => setForm({ ...form, starts_on: e.target.value })} />
            </div>
            <div>
              <label className="lbl" htmlFor="ptr-end">End date</label>
              <input id="ptr-end" className="padm-inp" type="date" value={form.ends_on} min={form.starts_on || undefined} onChange={(e) => setForm({ ...form, ends_on: e.target.value })} />
              <div className="padm-meta" style={{ marginTop: 4 }}>Optional — only for a multi-day block.</div>
            </div>
            <div>
              <label className="lbl" htmlFor="ptr-system">System *</label>
              <select id="ptr-system" className="padm-sel" value={form.system} onChange={(e) => setForm({ ...form, system: e.target.value as TrainingSystem })}>
                <option value="polyester">Polyester</option>
                <option value="pvc">PVC</option>
                <option value="both">Polyester + PVC</option>
              </select>
            </div>
            <div>
              <span className="lbl">Languages *</span>
              <div>
                {TRAINING_LANGUAGES.map((l) => (
                  <label key={l} className={`padm-chip${form.languages.includes(l) ? ' on' : ''}`}>
                    <input type="checkbox" checked={form.languages.includes(l)} onChange={() => toggleLanguage(l)} /> {l}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="lbl" htmlFor="ptr-location">Location</label>
              <input id="ptr-location" className="padm-inp" value={form.location} maxLength={80} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder={TRAINING_DEFAULT_LOCATION} />
            </div>
            <div>
              <label className="lbl" htmlFor="ptr-seats">Seats left</label>
              <input id="ptr-seats" className="padm-inp" inputMode="numeric" value={form.seats_left} onChange={(e) => setForm({ ...form, seats_left: e.target.value })} placeholder="—" style={{ width: 80 }} />
              <div className="padm-meta" style={{ marginTop: 4 }}>Optional — empty = no seat count on the site.</div>
            </div>
            <div>
              <label className="lbl" htmlFor="ptr-status">Status</label>
              <select id="ptr-status" className="padm-sel" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as TrainingStatus })}>
                <option value="open">Open</option>
                <option value="full">Full</option>
              </select>
            </div>
            <div>
              <span className="lbl">Website</span>
              <label className="padm-chip" style={{ margin: 0 }}>
                <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Show on the website
              </label>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="lbl" htmlFor="ptr-note">Internal note</label>
              <textarea id="ptr-note" className="padm-inp" rows={2} value={form.note} maxLength={500} onChange={(e) => setForm({ ...form, note: e.target.value })} style={{ width: '100%', resize: 'vertical' }} />
              <div className="padm-meta" style={{ marginTop: 4 }}>Never shown on the site.</div>
            </div>
          </div>
          {formError && (
            <p className="padm-err" role="alert">
              {formError}
            </p>
          )}
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <button type="button" className="btn btn--primary btn--sm" onClick={() => void save()} disabled={busy}>
              Save
            </button>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setForm(null)} disabled={busy}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {rows && upcoming.length === 0 && <p className="padm-note">No upcoming day — the sites show the on-request card and the “new dates are being planned” line.</p>}
      {rows && upcoming.length > 0 && (
        <div className="padm-tablewrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>System</th>
                <th>Languages</th>
                <th>Location</th>
                <th>Seats</th>
                <th>Status</th>
                <th>On site</th>
                <th>Requests</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {upcoming.map((r) => (
                <tr key={r.id} className={r.published ? undefined : 'off'}>
                  <td style={{ whiteSpace: 'nowrap', fontWeight: 700 }}>{formatDay(r)}</td>
                  <td>{SYSTEM_LABELS[r.system] ?? r.system}</td>
                  <td>{pills(r.languages)}</td>
                  <td>{r.location}</td>
                  <td>{r.seats_left === null ? '—' : r.seats_left}</td>
                  <td>{statusPill(r)}</td>
                  <td>{r.published ? 'shown' : 'hidden'}</td>
                  <td>{r.requests}</td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <span style={{ display: 'inline-flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      <button type="button" className="padm-linkbtn" disabled={busy} onClick={() => openEdit(r)}>Edit</button>
                      {r.status === 'full' ? (
                        <button type="button" className="padm-linkbtn padm-linkbtn--mut" disabled={busy} onClick={() => void quick(r, { status: 'open' }, 'Reopened — live on the sites within a minute.')}>Reopen</button>
                      ) : (
                        <button type="button" className="padm-linkbtn padm-linkbtn--mut" disabled={busy} onClick={() => void quick(r, { status: 'full' }, 'Marked full — live on the sites within a minute.')}>Mark full</button>
                      )}
                      {r.published ? (
                        <button type="button" className="padm-linkbtn padm-linkbtn--mut" disabled={busy} onClick={() => void quick(r, { published: false }, 'Hidden — gone from the sites within a minute.')}>Hide</button>
                      ) : (
                        <button type="button" className="padm-linkbtn padm-linkbtn--mut" disabled={busy} onClick={() => void quick(r, { published: true }, 'Shown — live on the sites within a minute.')}>Show</button>
                      )}
                      <button type="button" className="padm-linkbtn padm-linkbtn--mut" disabled={busy} onClick={() => openDuplicate(r)}>Duplicate</button>
                      <button type="button" className="padm-linkbtn padm-linkbtn--mut" disabled={busy} onClick={() => void remove(r)}>Delete</button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {rows && (
        <details style={{ marginTop: 14 }}>
          <summary style={{ cursor: 'pointer', fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Past 90 days ({past.length})
          </summary>
          {past.length === 0 ? (
            <p className="padm-note" style={{ marginTop: 10 }}>No day in the past 90 days.</p>
          ) : (
            <div className="padm-tablewrap" style={{ marginTop: 10 }}>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>System</th>
                    <th>Languages</th>
                    <th>Location</th>
                    <th>Seats</th>
                    <th>Status</th>
                    <th>On site</th>
                    <th>Requests</th>
                  </tr>
                </thead>
                <tbody>
                  {past.map((r) => (
                    <tr key={r.id} className="off">
                      <td style={{ whiteSpace: 'nowrap' }}>{formatDay(r)}</td>
                      <td>{SYSTEM_LABELS[r.system] ?? r.system}</td>
                      <td>{pills(r.languages)}</td>
                      <td>{r.location}</td>
                      <td>{r.seats_left === null ? '—' : r.seats_left}</td>
                      <td>{statusPill(r)}</td>
                      <td>{r.published ? 'shown' : 'hidden'}</td>
                      <td>{r.requests}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </details>
      )}

      <style dangerouslySetInnerHTML={{ __html: CARD_CSS }} />
      <style dangerouslySetInnerHTML={{ __html: `
        .ptr-form { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px 16px; margin-top: 6px; }
        .ptr-form .padm-inp, .ptr-form .padm-sel { width: 100%; box-sizing: border-box; }
        @media (max-width: 900px) { .ptr-form { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 560px) { .ptr-form { grid-template-columns: 1fr; } }
      ` }} />
    </section>
  );
}
