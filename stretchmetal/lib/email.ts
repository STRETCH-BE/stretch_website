// ============================================================================
// EMAIL — send mail via Microsoft Graph (client credentials), with attachment
// support for RFQ drawing files. Ported from the STRETCH group mailer and
// extended with fileAttachment payloads (base64 contentBytes).
//
// The preferred transport for a Microsoft-first organisation: mail goes out
// through the company's own Exchange Online mailbox — no third-party e-mail
// service, no npm dependency (plain fetch), and messages land in Sent Items.
//
// SETUP (once, in Microsoft Entra admin center — entra.microsoft.com):
//   1. Identity → Applications → App registrations → New registration
//      (e.g. "StretchMetal Website Mailer"; single tenant; no redirect URI).
//   2. API permissions → Add → Microsoft Graph → APPLICATION permissions →
//      Mail.Send → Add, then "Grant admin consent".
//   3. Certificates & secrets → New client secret → copy the VALUE.
//   4. Environment variables (Vercel):
//        MS_GRAPH_TENANT_ID     = Directory (tenant) ID from the app Overview
//        MS_GRAPH_CLIENT_ID     = Application (client) ID
//        MS_GRAPH_CLIENT_SECRET = the secret value from step 3
//        MS_GRAPH_FROM_ADDRESS  = mailbox to send from (a shared mailbox
//                                 works and needs no licence)
//   Optional hardening: scope the app to that one mailbox with an
//   ApplicationAccessPolicy (Exchange Online PowerShell) so Mail.Send cannot
//   be used for any other mailbox.
//
// Without these variables isMailConfigured() is false and the API routes log
// submissions to the server console instead — the site works with zero config.
// ============================================================================

export type MailAttachment = { filename: string; content: Buffer };

export function isMailConfigured(): boolean {
  return Boolean(
    process.env.MS_GRAPH_TENANT_ID &&
      process.env.MS_GRAPH_CLIENT_ID &&
      process.env.MS_GRAPH_CLIENT_SECRET &&
      process.env.MS_GRAPH_FROM_ADDRESS,
  );
}

// Token cache survives warm serverless invocations.
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) return cachedToken.token;
  const tenant = process.env.MS_GRAPH_TENANT_ID!;
  const res = await fetch(`https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.MS_GRAPH_CLIENT_ID!,
      client_secret: process.env.MS_GRAPH_CLIENT_SECRET!,
      scope: 'https://graph.microsoft.com/.default',
      grant_type: 'client_credentials',
    }),
  });
  if (!res.ok) {
    throw new Error(`Graph token request failed (${res.status}): ${(await res.text()).slice(0, 300)}`);
  }
  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return data.access_token;
}

/** Content type by extension — covers every format the RFQ form accepts. */
function mimeFor(filename: string): string {
  const lower = filename.toLowerCase();
  if (lower.endsWith('.pdf')) return 'application/pdf';
  if (lower.endsWith('.dxf')) return 'application/dxf';
  if (lower.endsWith('.dwg')) return 'application/acad';
  if (lower.endsWith('.step') || lower.endsWith('.stp')) return 'application/step';
  if (lower.endsWith('.iges') || lower.endsWith('.igs')) return 'application/iges';
  if (lower.endsWith('.zip')) return 'application/zip';
  return 'application/octet-stream';
}

/** Send one e-mail via Graph as MS_GRAPH_FROM_ADDRESS. Throws on failure. */
export async function sendMail(msg: {
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
  attachments?: MailAttachment[];
}): Promise<void> {
  const token = await getToken();
  const sender = process.env.MS_GRAPH_FROM_ADDRESS!;
  const body = {
    message: {
      subject: msg.subject,
      body: { contentType: 'HTML', content: msg.html },
      toRecipients: [{ emailAddress: { address: msg.to } }],
      ...(msg.replyTo ? { replyTo: [{ emailAddress: { address: msg.replyTo } }] } : {}),
      attachments: (msg.attachments ?? []).map((a) => ({
        '@odata.type': '#microsoft.graph.fileAttachment',
        name: a.filename,
        contentType: mimeFor(a.filename),
        contentBytes: a.content.toString('base64'),
      })),
    },
    saveToSentItems: true,
  };
  const res = await fetch(
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(sender)}/sendMail`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  );
  if (res.status !== 202) {
    throw new Error(`Graph sendMail failed (${res.status}): ${(await res.text()).slice(0, 300)}`);
  }
}

/** Minimal escaping for interpolating user input into HTML mail bodies. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
