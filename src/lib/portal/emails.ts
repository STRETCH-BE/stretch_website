// ============================================================================
// PORTAL APPROVAL EMAILS (EN-only — the portal is EN-only and noindexed).
//   buildApprovalEmail      → to the USER when an admin approves the account.
//   buildAdminReviewEmail   → to PORTAL_ADMIN_EMAIL on every pending signup,
//                             with the full profile + a signed review link.
// Same identity as datasheet-email.ts: single column, inline CSS, black/
// white/red, no external images, text/plain alternative.
// ============================================================================
import { contact, brand } from '@/lib/site-config';

function escapeHtml(v: unknown): string {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const FONT = "font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;";

function shell(bodyHtml: string): string {
  return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#F4F3F1;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F3F1;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;">
        <tr>
          <td style="background:#0A0A0A;padding:20px 28px;">
            <span style="${FONT}font-size:19px;font-weight:800;letter-spacing:.04em;color:#ffffff;">STRETCH<span style="color:#FF0000;">&reg;</span></span>
          </td>
        </tr>
        ${bodyHtml}
        <tr>
          <td style="padding:20px 28px 28px;border-top:1px solid #ECEAE6;">
            <p style="${FONT}font-size:12.5px;line-height:1.7;color:#6E6B66;margin:0;">
              <strong style="color:#0A0A0A;">${escapeHtml(brand.name)}</strong> · ${escapeHtml(contact.address.street)}, ${escapeHtml(contact.address.city)}<br>
              <a href="mailto:${escapeHtml(contact.email)}" style="color:#FF0000;text-decoration:none;">${escapeHtml(contact.email)}</a> · <a href="${escapeHtml(contact.phoneHref)}" style="color:#FF0000;text-decoration:none;">${escapeHtml(contact.phoneDisplay)}</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function button(url: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">
    <tr><td style="background:#FF0000;">
      <a href="${escapeHtml(url)}" style="${FONT}display:inline-block;padding:15px 30px;font-size:14px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#ffffff;text-decoration:none;">${escapeHtml(label)}</a>
    </td></tr>
  </table>`;
}

/** "Confirm your STRETCH portal account" — WE send this instead of Supabase
 *  (its own SMTP send made the signup request exceed the gateway timeout). */
export function buildConfirmEmail(input: { name: string | null; confirmUrl: string }): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = 'Confirm your STRETCH portal account';
  const greeting = input.name ? `Hello ${input.name},` : 'Hello,';
  const intro =
    'You created a STRETCH client-portal account with this email address. Confirm it to finish setting up your access.';
  const note =
    'If you did not create this account, you can safely ignore this email — nothing happens without confirmation.';

  const html = shell(`<tr>
    <td style="padding:32px 28px 8px;">
      <p style="${FONT}font-size:15px;line-height:1.6;color:#0A0A0A;margin:0 0 14px;">${escapeHtml(greeting)}</p>
      <p style="${FONT}font-size:15px;line-height:1.6;color:#0A0A0A;margin:0 0 22px;">${escapeHtml(intro)}</p>
      ${button(input.confirmUrl, 'Confirm my email')}
      <p style="${FONT}font-size:12.5px;line-height:1.6;color:#6E6B66;margin:0 0 6px;word-break:break-all;">If the button does not work, open this link: <a href="${escapeHtml(input.confirmUrl)}" style="color:#FF0000;">${escapeHtml(input.confirmUrl)}</a></p>
      <p style="${FONT}font-size:12.5px;line-height:1.6;color:#6E6B66;margin:0 0 24px;">${escapeHtml(note)}</p>
    </td>
  </tr>`);

  const text = [
    greeting,
    '',
    intro,
    '',
    `Confirm my email: ${input.confirmUrl}`,
    '',
    note,
    '',
    `${brand.name} · ${contact.address.street}, ${contact.address.city}`,
    `${contact.email} · ${contact.phoneDisplay}`,
  ].join('\n');

  return { subject, html, text };
}

/** "Your STRETCH account is approved" — sent to the user on approval. */
export function buildApprovalEmail(input: { name: string | null; loginUrl: string }): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = 'Your STRETCH account is approved';
  const greeting = input.name ? `Hello ${input.name},` : 'Hello,';
  const intro =
    'Good news — your STRETCH portal account has been reviewed and approved. You can now sign in and access your pricing, documents and ordering tools.';

  const html = shell(`<tr>
    <td style="padding:32px 28px 8px;">
      <p style="${FONT}font-size:15px;line-height:1.6;color:#0A0A0A;margin:0 0 14px;">${escapeHtml(greeting)}</p>
      <p style="${FONT}font-size:15px;line-height:1.6;color:#0A0A0A;margin:0 0 22px;">${escapeHtml(intro)}</p>
      ${button(input.loginUrl, 'Sign in to the portal')}
      <p style="${FONT}font-size:12.5px;line-height:1.6;color:#6E6B66;margin:0 0 24px;word-break:break-all;">Or open this link: <a href="${escapeHtml(input.loginUrl)}" style="color:#FF0000;">${escapeHtml(input.loginUrl)}</a></p>
    </td>
  </tr>`);

  const text = [
    greeting,
    '',
    intro,
    '',
    `Sign in: ${input.loginUrl}`,
    '',
    `${brand.name} · ${contact.address.street}, ${contact.address.city}`,
    `${contact.email} · ${contact.phoneDisplay}`,
  ].join('\n');

  return { subject, html, text };
}

export type ReviewNotification = {
  accountType: string;
  contactName: string | null;
  company: string | null;
  office: string | null;
  city: string | null;
  country: string | null;
  email: string;
  canonicalEmail: string;
  phone: string | null;
  pendingReason: string;
  spamScore: number | null;
  spamReasons: string[];
  signupHost: string | null;
  signupLocale: string | null;
  signupIp: string | null;
  signupUserAgent: string | null;
  reviewUrl: string;
};

/** New-pending-signup notification for the admin, with the signed review link. */
export function buildAdminReviewEmail(n: ReviewNotification): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `STRETCH portal — new ${n.accountType} signup awaiting review (${n.pendingReason})`;
  const rows: [string, string][] = [
    ['Type', n.accountType],
    ['Name', n.contactName ?? '—'],
    ['Company / office', n.company ?? n.office ?? '—'],
    ['City', n.city ?? '—'],
    ['Country', n.country ?? '—'],
    ['Email', n.canonicalEmail !== n.email.toLowerCase() ? `${n.email} (canonical: ${n.canonicalEmail})` : n.email],
    ['Phone', n.phone ?? '—'],
    ['Pending reason', n.pendingReason],
    ['Spam score', n.spamScore === null ? '—' : `${n.spamScore}${n.spamReasons.length ? ` (${n.spamReasons.join(', ')})` : ''}`],
    ['Signup host', n.signupHost ?? '—'],
    ['Signup locale', n.signupLocale ?? '—'],
    ['Signup IP', n.signupIp ?? '—'],
    ['User agent', n.signupUserAgent ? n.signupUserAgent.slice(0, 160) : '—'],
  ];

  const table = rows
    .map(
      ([k, v]) => `<tr>
        <td style="${FONT}font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#6E6B66;padding:7px 14px 7px 0;white-space:nowrap;vertical-align:top;">${escapeHtml(k)}</td>
        <td style="${FONT}font-size:13.5px;line-height:1.5;color:#0A0A0A;padding:7px 0;word-break:break-word;">${escapeHtml(v)}</td>
      </tr>`,
    )
    .join('');

  const html = shell(`<tr>
    <td style="padding:32px 28px 8px;">
      <p style="${FONT}font-size:15px;line-height:1.6;color:#0A0A0A;margin:0 0 18px;">A new portal signup is awaiting your review:</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 22px;width:100%;">${table}</table>
      ${button(n.reviewUrl, 'Review this account')}
      <p style="${FONT}font-size:12.5px;line-height:1.6;color:#6E6B66;margin:0 0 24px;word-break:break-all;">Or open: <a href="${escapeHtml(n.reviewUrl)}" style="color:#FF0000;">${escapeHtml(n.reviewUrl)}</a><br>The link is valid for 7 days; the page changes nothing until you press Approve or Reject.</p>
    </td>
  </tr>`);

  const text = [
    'A new portal signup is awaiting your review:',
    '',
    ...rows.map(([k, v]) => `${k}: ${v}`),
    '',
    `Review: ${n.reviewUrl}`,
    '(valid 7 days; the page changes nothing until you press Approve or Reject)',
  ].join('\n');

  return { subject, html, text };
}
