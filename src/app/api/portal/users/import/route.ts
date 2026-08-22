// POST /api/portal/users/import — admin bulk account creation from an Excel
// file. Multipart form: `file` (.xlsx/.xls/.csv) + `sendWelcome` ('0' to skip
// the welcome mails). First sheet, first row = headers (case/spacing
// insensitive):
//   email (required) · password (optional, min 8 — auto-generated when empty)
//   company · contact · phone · vat · country (ISO-2) · city · office
//   type (producer|installer|b2c|architect — default installer)
//   markets ("Installer;B2C", "all" → all markets; architects need none)
// Per row: create the auth user (email pre-confirmed) + ACTIVE profile, then
// send the branded welcome mail with the temporary password. Existing
// addresses are skipped, never overwritten. Max 200 rows per upload.
import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/portal/auth';
import { createServiceClient, isSupabaseConfigured } from '@/lib/portal/supabase';
import { isPortalAllowedHost, portalOrigin } from '@/lib/portal/host';
import { canonicalEmail } from '@/lib/spam/email';
import { parseRows, MAX_ROWS, type ImportRow } from '@/lib/portal/import-users';
import { buildWelcomeEmail } from '@/lib/portal/emails';
import { sendTransactionalEmail, isTransactionalConfigured } from '@/lib/transactional';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  if (!isPortalAllowedHost(req.headers.get('host'))) {
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  }
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });
  if (!isSupabaseConfigured() || session.demo) {
    return NextResponse.json({ ok: true, persisted: false, created: 0, welcomed: 0, skipped: [] });
  }
  const service = createServiceClient();
  if (!service) {
    return NextResponse.json(
      { ok: false, error: 'SUPABASE_SERVICE_ROLE_KEY is not configured on the server.' },
      { status: 500 },
    );
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get('file');
  if (!file || typeof file === 'string') {
    return NextResponse.json({ ok: false, error: 'No file uploaded.' }, { status: 400 });
  }
  const sendWelcome = form?.get('sendWelcome') !== '0' && isTransactionalConfigured();

  let parsed: ReturnType<typeof parseRows>;
  try {
    parsed = parseRows(Buffer.from(await file.arrayBuffer()));
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : 'Could not read the workbook.' },
      { status: 400 },
    );
  }
  const skipped = [...parsed.problems];
  let rows = parsed.rows;
  if (rows.length === 0 && skipped.length === 0) {
    return NextResponse.json({ ok: false, error: 'No rows with an email column found.' }, { status: 400 });
  }
  if (rows.length > MAX_ROWS) {
    skipped.push({ row: 0, email: '', reason: `Only the first ${MAX_ROWS} rows were processed.` });
    rows = rows.slice(0, MAX_ROWS);
  }

  // Duplicates inside the sheet + accounts that already exist (canonical form).
  const seen = new Set<string>();
  rows = rows.filter((r) => {
    const c = canonicalEmail(r.email);
    if (seen.has(c)) {
      skipped.push({ row: 0, email: r.email, reason: 'Duplicate of an earlier row.' });
      return false;
    }
    seen.add(c);
    return true;
  });
  const { data: existing } = await service
    .from('portal_users')
    .select('canonical_email, email')
    .in('canonical_email', [...seen]);
  const existingSet = new Set((existing ?? []).map((e) => e.canonical_email as string));
  rows = rows.filter((r) => {
    if (existingSet.has(canonicalEmail(r.email))) {
      skipped.push({ row: 0, email: r.email, reason: 'Account already exists — skipped.' });
      return false;
    }
    return true;
  });

  const loginUrl = `${portalOrigin(req.nextUrl.origin)}/portal/login`;
  const created: { email: string; row: ImportRow }[] = [];

  for (const row of rows) {
    const { data: authUser, error: authError } = await service.auth.admin.createUser({
      email: row.email,
      password: row.password,
      email_confirm: true,
    });
    if (authError || !authUser.user) {
      skipped.push({
        row: 0,
        email: row.email,
        reason: /already|registered|exists/i.test(authError?.message ?? '')
          ? 'Account already exists — skipped.'
          : authError?.message ?? 'Could not create the login.',
      });
      continue;
    }
    const profile = {
      id: authUser.user.id,
      email: row.email,
      company: row.company,
      role: 'client',
      account_type: row.accountType,
      markets: row.markets,
      all_markets: row.allMarkets,
      active: true,
      country: row.country,
      contact_name: row.contactName,
      vat: row.vat,
      phone: row.phone,
      city: row.city,
      office: row.office,
      canonical_email: canonicalEmail(row.email),
    };
    let { error: profileError } = await service.from('portal_users').insert(profile);
    if (profileError) {
      // Un-migrated database — core columns only.
      ({ error: profileError } = await service.from('portal_users').insert({
        id: authUser.user.id,
        email: row.email,
        company: row.company,
        role: 'client',
        account_type: row.accountType,
        markets: row.markets,
        all_markets: row.allMarkets,
        active: true,
      }));
    }
    if (profileError) {
      await service.auth.admin.deleteUser(authUser.user.id).catch(() => undefined);
      skipped.push({ row: 0, email: row.email, reason: profileError.message });
      continue;
    }
    created.push({ email: row.email, row });
  }

  // Welcome mails — chunked 5-way so 200 accounts stay inside maxDuration,
  // and AWAITED so the serverless freeze cannot swallow them.
  let welcomed = 0;
  const mailFailed: string[] = [];
  if (sendWelcome) {
    for (let i = 0; i < created.length; i += 5) {
      const chunk = created.slice(i, i + 5);
      const results = await Promise.allSettled(
        chunk.map(({ email, row }) => {
          const mail = buildWelcomeEmail({
            name: row.contactName,
            email,
            tempPassword: row.password,
            loginUrl,
          });
          return sendTransactionalEmail({ to: email, subject: mail.subject, html: mail.html, text: mail.text });
        }),
      );
      results.forEach((res, j) => {
        if (res.status === 'fulfilled' && res.value.ok) welcomed += 1;
        else mailFailed.push(chunk[j].email);
      });
    }
  }
  if (mailFailed.length > 0) {
    console.warn(`[users/import] welcome mail failed for: ${mailFailed.join(', ')}`);
  }

  return NextResponse.json({
    ok: true,
    persisted: true,
    created: created.length,
    welcomed,
    mailFailed,
    skipped: skipped.map((s) => ({ email: s.email || `row ${s.row}`, reason: s.reason })),
  });
}
