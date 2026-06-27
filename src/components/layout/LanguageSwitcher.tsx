'use client';

// Language switcher. With a single launch locale it renders a static "EN"
// marker; as soon as another locale is added to i18n/config it becomes a real
// dropdown that fires analytics.languageSwitch and preserves the current path.
import { useState } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { ChevronDown } from 'lucide-react';
import { locales, localeNames, type Locale } from '@/i18n/config';
import { analytics } from '@/lib/analytics';

export default function LanguageSwitcher({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const color = tone === 'dark' ? 'rgba(255,255,255,.7)' : 'var(--text-muted)';

  // Single locale: no menu, just the marker.
  if (locales.length < 2) {
    return (
      <span
        style={{ color, fontSize: 11.5, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase' }}
      >
        {locale.toUpperCase()}
      </span>
    );
  }

  function switchTo(next: Locale) {
    setOpen(false);
    if (next === locale) return;
    analytics.languageSwitch(locale, next, pathname);
    router.replace(pathname, { locale: next });
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color,
          fontSize: 11.5,
          fontWeight: 600,
          letterSpacing: '.12em',
          textTransform: 'uppercase',
        }}
      >
        {locale.toUpperCase()}
        <ChevronDown size={12} />
      </button>
      {open && (
        <ul
          role="listbox"
          style={{
            position: 'absolute',
            right: 0,
            top: '120%',
            background: '#fff',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
            listStyle: 'none',
            margin: 0,
            padding: 6,
            minWidth: 150,
            zIndex: 80,
          }}
        >
          {locales.map((l) => (
            <li key={l}>
              <button
                type="button"
                role="option"
                aria-selected={l === locale}
                onClick={() => switchTo(l)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  background: l === locale ? 'var(--surface)' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '9px 12px',
                  fontSize: 13,
                  color: 'var(--text)',
                }}
              >
                {localeNames[l] ?? l}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
