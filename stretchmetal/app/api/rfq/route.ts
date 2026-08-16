// ============================================================================
// RFQ API — receives multipart/form-data from the RFQ form (with files) and
// the contact form (form=contact, no files). Pipeline:
//   1. anti-spam: honeypot field + minimum-fill-time (reject < 3 s)
//   2. rate limit per IP (in-memory sliding window — fine per warm lambda)
//   3. authoritative validation (required fields, file types, 15 MB total)
//   4. delivery: Microsoft Graph mail with attachments to RFQ_DESTINATION +
//      an auto-reply to the submitter (PL/EN by form locale). Without mail
//      env vars, the submission is logged (file names + sizes, NEVER file
//      contents) and the request still succeeds — zero-config safe.
// Spam and rate-limit rejections return 200 on purpose: bots learn nothing.
// ============================================================================
import { NextResponse } from 'next/server';
import { escapeHtml, isMailConfigured, sendMail, type MailAttachment } from '@/lib/email';
import { rfqDestination, contact, brand } from '@/lib/site-config';
import {
  RFQ_MAX_FILES,
  RFQ_MAX_TOTAL_BYTES,
  RFQ_MIN_FILL_MS,
  hasAllowedExtension,
} from '@/lib/rfq';

export const runtime = 'nodejs';

// --- Rate limiting ----------------------------------------------------------
// Sliding window per IP. In-memory is acceptable on Vercel: each warm lambda
// keeps its own map, which still stops naive flooding; a Redis-backed limiter
// can drop in later without touching the handler.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= MAX_PER_WINDOW) {
    hits.set(ip, list);
    return true;
  }
  list.push(now);
  hits.set(ip, list);
  // Opportunistic cleanup so the map cannot grow unbounded.
  if (hits.size > 1000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

// --- Helpers ----------------------------------------------------------------
const str = (fd: FormData, key: string, max = 2000): string => {
  const value = fd.get(key);
  return typeof value === 'string' ? value.slice(0, max).trim() : '';
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Submission = {
  form: 'rfq' | 'contact';
  locale: 'pl' | 'en';
  company: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  services: string;
  material: string;
  quantity: string;
  deadline: string;
  message: string;
};

function adminMailHtml(s: Submission, files: { name: string; size: number }[]): string {
  const rows: [string, string][] = [
    ['Form', s.form],
    ['Locale', s.locale],
    ['Company', s.company],
    ['Name', s.name],
    ['E-mail', s.email],
    ['Phone', s.phone],
    ['Country', s.country],
    ['Services', s.services],
    ['Material', s.material],
    ['Quantity', s.quantity],
    ['Deadline', s.deadline],
  ];
  const table = rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#54514b"><b>${k}</b></td><td>${escapeHtml(v)}</td></tr>`)
    .join('');
  const fileList = files.length
    ? `<p><b>Files (${files.length})</b><br>${files
        .map((f) => `${escapeHtml(f.name)} — ${(f.size / 1024).toFixed(0)} KB`)
        .join('<br>')}</p>`
    : '';
  return `
    <div style="font-family:Arial,sans-serif;font-size:14px;color:#0a0a0a">
      <h2 style="text-transform:uppercase">New ${s.form === 'rfq' ? 'RFQ' : 'contact'} submission</h2>
      <table>${table}</table>
      <p><b>Message</b><br>${escapeHtml(s.message).replace(/\n/g, '<br>')}</p>
      ${fileList}
    </div>`;
}

function autoReplyHtml(s: Submission): { subject: string; html: string } {
  if (s.locale === 'pl') {
    return {
      subject: `Otrzymaliśmy Twoje zapytanie — ${brand.name}`,
      html: `
        <div style="font-family:Arial,sans-serif;font-size:14px;color:#0a0a0a">
          <p>Dzień dobry,</p>
          <p>dziękujemy za zapytanie przesłane do ${brand.name}. Nasz technolog analizuje dokumentację —
          wycenę z ceną i terminem wyślemy w ciągu <b>48 godzin roboczych</b>.</p>
          <p>Jeśli chcesz coś dodać do zapytania, po prostu odpowiedz na tę wiadomość.</p>
          <p>${brand.name}<br>${contact.phone} · ${contact.email}</p>
        </div>`,
    };
  }
  return {
    subject: `We received your enquiry — ${brand.name}`,
    html: `
      <div style="font-family:Arial,sans-serif;font-size:14px;color:#0a0a0a">
        <p>Hello,</p>
        <p>thank you for your enquiry to ${brand.name}. Our engineer is reviewing your documentation —
        the quote with price and lead time will follow within <b>48 business hours</b>.</p>
        <p>If you want to add anything, simply reply to this e-mail.</p>
        <p>${brand.name}<br>${contact.phone} · ${contact.email}</p>
      </div>`,
  };
}

// --- Handler ----------------------------------------------------------------
export async function POST(request: Request) {
  let fd: FormData;
  try {
    fd = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_request' }, { status: 400 });
  }

  // 1. Anti-spam: honeypot filled or submitted faster than a human can type.
  const honeypot = str(fd, 'website');
  const startedAt = Number(str(fd, 'startedAt', 30));
  const tooFast = Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < RFQ_MIN_FILL_MS;
  if (honeypot || tooFast) {
    // Pretend success — give bots nothing to iterate against.
    return NextResponse.json({ ok: true });
  }

  // 2. Rate limit by IP.
  const ip = (request.headers.get('x-forwarded-for') ?? 'unknown').split(',')[0].trim();
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: true });
  }

  // 3. Validate fields.
  const submission: Submission = {
    form: str(fd, 'form', 20) === 'contact' ? 'contact' : 'rfq',
    locale: str(fd, 'locale', 5) === 'en' ? 'en' : 'pl',
    company: str(fd, 'company', 200),
    name: str(fd, 'name', 200),
    email: str(fd, 'email', 200),
    phone: str(fd, 'phone', 50),
    country: str(fd, 'country', 20),
    services: str(fd, 'services', 200),
    material: str(fd, 'material', 50),
    quantity: str(fd, 'quantity', 100),
    deadline: str(fd, 'deadline', 200),
    message: str(fd, 'message', 5000),
  };
  if (!submission.name || !submission.message || !EMAIL_RE.test(submission.email)) {
    return NextResponse.json({ ok: false, error: 'validation' }, { status: 422 });
  }

  // 3b. Validate files (RFQ only).
  const files: File[] = [];
  if (submission.form === 'rfq') {
    for (const entry of fd.getAll('files')) {
      if (entry instanceof File && entry.size > 0) files.push(entry);
    }
    if (files.length > RFQ_MAX_FILES) {
      return NextResponse.json({ ok: false, error: 'too_many_files' }, { status: 422 });
    }
    const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
    if (totalBytes > RFQ_MAX_TOTAL_BYTES) {
      return NextResponse.json({ ok: false, error: 'files_too_large' }, { status: 413 });
    }
    for (const file of files) {
      if (!hasAllowedExtension(file.name)) {
        return NextResponse.json({ ok: false, error: 'file_type' }, { status: 422 });
      }
    }
  }

  const fileMeta = files.map((f) => ({ name: f.name, size: f.size }));

  // 4. Deliver — or log when mail is not configured.
  if (!isMailConfigured()) {
    console.log(
      `[${submission.form}] submission (mail not configured — logging only)`,
      JSON.stringify({ ...submission, files: fileMeta }, null, 2),
    );
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const attachments: MailAttachment[] = await Promise.all(
      files.map(async (file) => ({
        filename: file.name,
        content: Buffer.from(await file.arrayBuffer()),
      })),
    );

    const subjectPrefix = submission.form === 'rfq' ? 'RFQ' : 'Contact';
    const who = submission.company || submission.name;
    await sendMail({
      to: rfqDestination,
      replyTo: submission.email,
      subject: `[${subjectPrefix}] ${who} — ${submission.services || submission.locale.toUpperCase()}`,
      html: adminMailHtml(submission, fileMeta),
      attachments,
    });

    // Confirmation auto-reply to the submitter; a failure here must not fail
    // the submission (the enquiry itself is already delivered).
    try {
      const reply = autoReplyHtml(submission);
      await sendMail({ to: submission.email, subject: reply.subject, html: reply.html });
    } catch (err) {
      console.error('[rfq] auto-reply failed', err);
    }

    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error('[rfq] delivery failed', err);
    return NextResponse.json({ ok: false, error: 'delivery' }, { status: 500 });
  }
}
