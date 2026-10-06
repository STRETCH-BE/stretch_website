// One open position in the careers listing (and the "other positions" block
// on a vacancy page). The whole card is the link to /careers/[slug]; the
// labels come from the page so the card itself reads no messages.
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { Vacancy } from '@/lib/careers';

export type VacancyCardLabels = {
  location: string;
  contract: string;
  employer: string;
  view: string;
  mfx: string;
};

export type VacancyCardText = {
  title: string;
  location: string;
  contract: string;
  summary: string;
};

export default function VacancyCard({
  vacancy,
  text,
  labels,
}: {
  vacancy: Vacancy;
  text: VacancyCardText;
  labels: VacancyCardLabels;
}) {
  return (
    <Link
      href={`/careers/${vacancy.slug}`}
      className="vc-card"
      style={{
        display: 'grid',
        gridTemplateColumns: '1.6fr 1fr 1fr auto',
        gap: 'clamp(16px,2.4vw,36px)',
        alignItems: 'center',
        background: '#fff',
        border: '1px solid var(--border)',
        padding: 'clamp(22px,2.6vw,32px)',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <div>
        <div
          style={{
            fontSize: 11.5,
            fontWeight: 700,
            letterSpacing: '.16em',
            textTransform: 'uppercase',
            color: 'var(--red)',
            marginBottom: 10,
          }}
        >
          {vacancy.address.country} · {vacancy.address.city}
        </div>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: 'clamp(22px,2.4vw,30px)',
            lineHeight: 1,
            letterSpacing: '-.02em',
            textTransform: 'uppercase',
            margin: '0 0 10px',
          }}
        >
          {text.title}{' '}
          <span style={{ fontSize: '.5em', fontWeight: 600, color: 'var(--text-faint-2)', letterSpacing: 0, textTransform: 'none' }}>
            {labels.mfx}
          </span>
        </h3>
        <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--text-muted)', margin: 0, maxWidth: 520 }}>{text.summary}</p>
      </div>
      <Meta label={labels.location} value={text.location} sub={text.contract} subLabel={labels.contract} />
      <Meta label={labels.employer} value={vacancy.employer.name} />
      <span className="btn btn--ghost btn--sm vc-btn" style={{ justifySelf: 'end' }}>
        {labels.view} <ArrowRight size={14} className="btn__arrow" />
      </span>
    </Link>
  );
}

function Meta({ label, value, sub, subLabel }: { label: string; value: string; sub?: string; subLabel?: string }) {
  return (
    <div style={{ fontSize: 14, lineHeight: 1.5 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--text-faint-2)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontWeight: 600, color: 'var(--text)' }}>{value}</div>
      {sub && (
        <>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--text-faint-2)', margin: '12px 0 4px' }}>{subLabel}</div>
          <div style={{ fontWeight: 600, color: 'var(--text)' }}>{sub}</div>
        </>
      )}
    </div>
  );
}
