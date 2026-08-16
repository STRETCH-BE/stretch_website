'use client';

// Mini contact form — reuses the RFQ API (form=contact, no files). Success is
// shown inline; the RFQ funnel keeps its own dedicated thank-you page.
import { useMemo, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/button';
import { analytics } from '@/lib/analytics';
import { path, type Locale } from '@/lib/i18n-routes';
import type { ContactContent } from '@/content/types';

export default function ContactForm({ locale, content }: { locale: Locale; content: ContactContent['form'] }) {
  const startedAt = useMemo(() => Date.now(), []);
  const [values, setValues] = useState({ name: '', email: '', message: '', website: '' });
  const [consent, setConsentChecked] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const validate = () => {
    const next: Partial<Record<string, string>> = {};
    if (!values.name.trim()) next.name = content.errors.required;
    if (!values.email.trim()) next.email = content.errors.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = content.errors.email;
    if (!values.message.trim()) next.message = content.errors.required;
    if (!consent) next.consent = content.errors.consent;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.set('form', 'contact');
      fd.set('locale', locale);
      fd.set('startedAt', String(startedAt));
      fd.set('name', values.name);
      fd.set('email', values.email);
      fd.set('message', values.message);
      fd.set('website', values.website);
      const res = await fetch('/api/rfq', { method: 'POST', body: fd });
      if (!res.ok) throw new Error(`contact_http_${res.status}`);
      analytics.contactSubmitted(locale);
      setSent(true);
    } catch {
      setServerError(content.errors.server);
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <p className="border-2 border-black bg-surface p-6 text-[14.5px] font-semibold" role="status">
        {content.success}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label>
          Website
          <input type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={set('website')} />
        </label>
      </div>

      <div className="flex flex-col gap-5">
        <div>
          <label htmlFor="ct-name" className="field-label">
            {content.name} *
          </label>
          <input
            id="ct-name"
            className="field"
            autoComplete="name"
            required
            aria-invalid={Boolean(errors.name)}
            value={values.name}
            onChange={set('name')}
          />
          {errors.name ? (
            <p className="field-error" role="alert">
              {errors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="ct-email" className="field-label">
            {content.email} *
          </label>
          <input
            id="ct-email"
            type="email"
            className="field"
            autoComplete="email"
            required
            aria-invalid={Boolean(errors.email)}
            value={values.email}
            onChange={set('email')}
          />
          {errors.email ? (
            <p className="field-error" role="alert">
              {errors.email}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="ct-message" className="field-label">
            {content.message} *
          </label>
          <textarea
            id="ct-message"
            className="field min-h-[120px]"
            required
            aria-invalid={Boolean(errors.message)}
            value={values.message}
            onChange={set('message')}
          />
          {errors.message ? (
            <p className="field-error" role="alert">
              {errors.message}
            </p>
          ) : null}
        </div>
        <label className="flex items-start gap-3 text-[13px] leading-relaxed text-text-muted">
          <input
            type="checkbox"
            className="mt-[3px] h-4 w-4 shrink-0 accent-red"
            checked={consent}
            aria-invalid={Boolean(errors.consent)}
            onChange={(e) => setConsentChecked(e.target.checked)}
          />
          <span>
            {content.consent}{' '}
            <Link href={path('privacy', locale)} className="underline">
              {content.consentLinkLabel}
            </Link>
            . *
          </span>
        </label>
        {errors.consent ? (
          <p className="field-error" role="alert">
            {errors.consent}
          </p>
        ) : null}
        {serverError ? (
          <p className="field-error" role="alert">
            {serverError}
          </p>
        ) : null}
        <div>
          <Button type="submit" disabled={submitting}>
            {submitting ? content.submitting : content.submit}
          </Button>
        </div>
      </div>
    </form>
  );
}
