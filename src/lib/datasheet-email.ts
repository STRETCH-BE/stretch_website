// ============================================================================
// DATASHEET EMAIL — the message a visitor receives after requesting a gated
// datasheet: branded single-column HTML (inline CSS, no external images) with
// one big red download button on the 14-day signed link. Localized through the
// `datasheetEmail` namespace; `extraParagraph` is a hook for campaign content
// (e.g. the architect invite) rendered before the footer.
// ============================================================================
import { getTranslations } from 'next-intl/server';
import { contact, brand } from '@/lib/site-config';
import { DATASHEET_LINK_DAYS } from '@/lib/datasheet-links';

function escapeHtml(v: unknown): string {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export type DatasheetEmailInput = {
  locale: string;
  name: string;
  title: string;
  /** Absolute signed download URL (origin included). */
  url: string;
  extraParagraph?: { html: string; text: string };
};

export async function buildDatasheetEmail(input: DatasheetEmailInput): Promise<{
  subject: string;
  html: string;
  text: string;
}> {
  const t = await getTranslations({ locale: input.locale, namespace: 'datasheetEmail' });

  const subject = t('subject', { title: input.title });
  const greeting = t('greeting', { name: input.name });
  const intro = t('intro', { title: input.title });
  const button = t('button');
  const linkFallback = t('linkFallback');
  const validity = t('validity', { days: DATASHEET_LINK_DAYS });
  const footerCta = t('footerCta');
  const signoff = t('signoff');

  const font = "font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;";

  const html = `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#F4F3F1;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F3F1;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;">
        <tr>
          <td style="background:#0A0A0A;padding:20px 28px;">
            <span style="${font}font-size:19px;font-weight:800;letter-spacing:.04em;color:#ffffff;">STRETCH<span style="color:#FF0000;">&reg;</span></span>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 28px 8px;">
            <p style="${font}font-size:15px;line-height:1.6;color:#0A0A0A;margin:0 0 14px;">${escapeHtml(greeting)}</p>
            <p style="${font}font-size:15px;line-height:1.6;color:#0A0A0A;margin:0 0 22px;">${escapeHtml(intro)}</p>
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">
              <tr><td style="background:#FF0000;">
                <a href="${escapeHtml(input.url)}" style="${font}display:inline-block;padding:15px 30px;font-size:14px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#ffffff;text-decoration:none;">${escapeHtml(button)}</a>
              </td></tr>
            </table>
            <p style="${font}font-size:12.5px;line-height:1.6;color:#6E6B66;margin:0 0 4px;">${escapeHtml(linkFallback)}</p>
            <p style="${font}font-size:12.5px;line-height:1.6;color:#6E6B66;margin:0 0 6px;word-break:break-all;"><a href="${escapeHtml(input.url)}" style="color:#FF0000;">${escapeHtml(input.url)}</a></p>
            <p style="${font}font-size:12.5px;line-height:1.6;color:#6E6B66;margin:0 0 24px;">${escapeHtml(validity)}</p>
            ${input.extraParagraph ? input.extraParagraph.html : ''}
          </td>
        </tr>
        <tr>
          <td style="padding:20px 28px 28px;border-top:1px solid #ECEAE6;">
            <p style="${font}font-size:13px;line-height:1.6;color:#0A0A0A;margin:0 0 10px;">${escapeHtml(footerCta)}</p>
            <p style="${font}font-size:12.5px;line-height:1.7;color:#6E6B66;margin:0;">
              ${escapeHtml(signoff)}<br>
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

  const text = [
    greeting,
    '',
    intro,
    '',
    `${button}: ${input.url}`,
    validity,
    ...(input.extraParagraph ? ['', input.extraParagraph.text] : []),
    '',
    footerCta,
    '',
    signoff,
    `${brand.name} · ${contact.address.street}, ${contact.address.city}`,
    `${contact.email} · ${contact.phoneDisplay}`,
  ].join('\n');

  return { subject, html, text };
}
