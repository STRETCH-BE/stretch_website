'use client';

// ============================================================================
// RFQ FORM — the site's core conversion feature. Client component: field
// state, drag-and-drop multi-file upload with per-file remove, instant
// validation mirroring the server rules (lib/rfq.ts), honeypot + fill-time
// anti-spam, consent gate, analytics events, redirect to the thank-you page.
// ============================================================================
import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';
import { analytics } from '@/lib/analytics';
import { path, type Locale } from '@/lib/i18n-routes';
import {
  RFQ_ACCEPT_ATTR,
  RFQ_MAX_FILES,
  RFQ_MAX_TOTAL_BYTES,
  formatBytes,
  hasAllowedExtension,
} from '@/lib/rfq';
import type { RfqContent } from '@/content/types';

type Errors = Partial<Record<string, string>>;

export default function RfqForm({ locale, content }: { locale: Locale; content: RfqContent['form'] }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Fill-time floor for the spam check — set once when the form mounts.
  const startedAt = useMemo(() => Date.now(), []);

  const [values, setValues] = useState({
    company: '',
    name: '',
    email: '',
    phone: '',
    country: 'PL',
    material: 'steel',
    quantity: '',
    deadline: '',
    message: '',
    website: '', // honeypot — humans never see or fill this
  });
  const [servicesSel, setServicesSel] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [consent, setConsentChecked] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [fileError, setFileError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);

  const addFiles = (incoming: FileList | File[]) => {
    setFileError(null);
    const next = [...files];
    for (const file of Array.from(incoming)) {
      if (!hasAllowedExtension(file.name)) {
        setFileError(content.errors.fileType);
        continue;
      }
      if (next.some((f) => f.name === file.name && f.size === file.size)) continue;
      next.push(file);
    }
    if (next.length > RFQ_MAX_FILES) {
      setFileError(content.errors.fileCount);
      next.length = RFQ_MAX_FILES;
    }
    if (next.reduce((sum, f) => sum + f.size, 0) > RFQ_MAX_TOTAL_BYTES) {
      setFileError(content.errors.fileSize);
    }
    setFiles(next);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileError(null);
  };

  const toggleService = (key: string) =>
    setServicesSel((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  const validate = (): boolean => {
    const next: Errors = {};
    if (!values.name.trim()) next.name = content.errors.required;
    if (!values.email.trim()) next.email = content.errors.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = content.errors.email;
    if (!values.message.trim()) next.message = content.errors.required;
    if (!consent) next.consent = content.errors.consent;
    if (totalBytes > RFQ_MAX_TOTAL_BYTES) {
      setFileError(content.errors.fileSize);
      next.files = content.errors.fileSize;
    }
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
      fd.set('form', 'rfq');
      fd.set('locale', locale);
      fd.set('startedAt', String(startedAt));
      Object.entries(values).forEach(([k, v]) => fd.set(k, v));
      fd.set('services', servicesSel.join(','));
      files.forEach((file) => fd.append('files', file, file.name));

      const res = await fetch('/api/rfq', { method: 'POST', body: fd });
      if (!res.ok) throw new Error(`rfq_http_${res.status}`);

      analytics.rfqSubmitted({
        services: servicesSel.join(',') || 'none',
        files: files.length,
        locale,
      });
      router.push(path('rfqThanks', locale));
    } catch {
      analytics.rfqError('network_or_server');
      setServerError(content.errors.server);
      setSubmitting(false);
    }
  };

  const fieldError = (key: string) =>
    errors[key] ? (
      <p className="field-error" role="alert">
        {errors[key]}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate>
      {/* Honeypot — visually hidden, tab-skipped; bots fill it, humans don't. */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label>
          Website
          <input type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={set('website')} />
        </label>
      </div>

      <div className="grid gap-5 min-[640px]:grid-cols-2">
        <div>
          <label htmlFor="rfq-company" className="field-label">
            {content.company} <span className="normal-case text-text-faint">({content.optional})</span>
          </label>
          <input id="rfq-company" className="field" autoComplete="organization" value={values.company} onChange={set('company')} />
        </div>
        <div>
          <label htmlFor="rfq-name" className="field-label">
            {content.name} *
          </label>
          <input
            id="rfq-name"
            className="field"
            autoComplete="name"
            required
            aria-invalid={Boolean(errors.name)}
            value={values.name}
            onChange={set('name')}
          />
          {fieldError('name')}
        </div>
        <div>
          <label htmlFor="rfq-email" className="field-label">
            {content.email} *
          </label>
          <input
            id="rfq-email"
            type="email"
            className="field"
            autoComplete="email"
            required
            aria-invalid={Boolean(errors.email)}
            value={values.email}
            onChange={set('email')}
          />
          {fieldError('email')}
        </div>
        <div>
          <label htmlFor="rfq-phone" className="field-label">
            {content.phone} <span className="normal-case text-text-faint">({content.optional})</span>
          </label>
          <input id="rfq-phone" type="tel" className="field" autoComplete="tel" value={values.phone} onChange={set('phone')} />
        </div>
        <div>
          <label htmlFor="rfq-country" className="field-label">
            {content.country}
          </label>
          <select id="rfq-country" className="field" value={values.country} onChange={set('country')}>
            {content.countries.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="rfq-material" className="field-label">
            {content.materialLabel}
          </label>
          <select id="rfq-material" className="field" value={values.material} onChange={set('material')}>
            {content.materials.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="rfq-quantity" className="field-label">
            {content.quantity} <span className="normal-case text-text-faint">({content.optional})</span>
          </label>
          <input
            id="rfq-quantity"
            className="field"
            placeholder={content.quantityPlaceholder}
            value={values.quantity}
            onChange={set('quantity')}
          />
        </div>
        <div>
          <label htmlFor="rfq-deadline" className="field-label">
            {content.deadline} <span className="normal-case text-text-faint">({content.optional})</span>
          </label>
          <input
            id="rfq-deadline"
            className="field"
            placeholder={content.deadlinePlaceholder}
            value={values.deadline}
            onChange={set('deadline')}
          />
        </div>
      </div>

      {/* Service chips */}
      <fieldset className="mt-7 border-0 p-0">
        <legend className="field-label">{content.servicesLabel}</legend>
        <div className="mt-1 flex flex-wrap gap-2">
          {content.services.map((service) => {
            const on = servicesSel.includes(service.key);
            return (
              <label key={service.key} className={`chip${on ? ' chip--on' : ''}`}>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={on}
                  onChange={() => toggleService(service.key)}
                />
                {service.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Message */}
      <div className="mt-7">
        <label htmlFor="rfq-message" className="field-label">
          {content.message} *
        </label>
        <textarea
          id="rfq-message"
          className="field min-h-[130px]"
          required
          aria-invalid={Boolean(errors.message)}
          placeholder={content.messagePlaceholder}
          value={values.message}
          onChange={set('message')}
        />
        {fieldError('message')}
      </div>

      {/* File upload — drag-and-drop zone + list with remove buttons. */}
      <div className="mt-7">
        <span className="field-label" id="rfq-files-label">
          {content.filesLabel}
        </span>
        <div
          role="button"
          tabIndex={0}
          aria-labelledby="rfq-files-label"
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed px-6 py-9 text-center transition-colors ${
            dragOver ? 'border-red bg-surface' : 'border-border-input bg-white'
          }`}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            addFiles(e.dataTransfer.files);
          }}
        >
          <span className="text-[14px] font-bold uppercase tracking-[0.06em]">{content.filesDrop}</span>
          <span className="text-[13px] text-text-muted">{content.filesBrowse}</span>
          <span className="mt-1 text-[12px] text-text-faint">{content.filesHint}</span>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={RFQ_ACCEPT_ATTR}
            className="sr-only"
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = '';
            }}
          />
        </div>
        {fileError ? (
          <p className="field-error" role="alert">
            {fileError}
          </p>
        ) : null}
        {files.length > 0 ? (
          <ul className="mt-3 flex flex-col border border-border-2">
            {files.map((file, i) => (
              <li
                key={`${file.name}-${file.size}`}
                className="flex items-center justify-between gap-4 border-b border-border-2 px-4 py-3 text-[13px] last:border-b-0"
              >
                <span className="truncate font-semibold">{file.name}</span>
                <span className="flex shrink-0 items-center gap-4">
                  <span className="text-text-faint">{formatBytes(file.size)}</span>
                  <button
                    type="button"
                    className="font-bold uppercase tracking-[0.08em] text-red"
                    onClick={() => removeFile(i)}
                    aria-label={`${content.filesRemove}: ${file.name}`}
                  >
                    ✕
                  </button>
                </span>
              </li>
            ))}
            <li className="flex justify-end px-4 py-2 text-[12px] text-text-faint">
              {formatBytes(totalBytes)} / 15 MB
            </li>
          </ul>
        ) : null}
      </div>

      {/* GDPR consent */}
      <div className="mt-7">
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
        {fieldError('consent')}
      </div>

      {serverError ? (
        <p className="field-error mt-5" role="alert">
          {serverError}
        </p>
      ) : null}

      <div className="mt-8">
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? content.submitting : content.submit}
        </Button>
      </div>
    </form>
  );
}
