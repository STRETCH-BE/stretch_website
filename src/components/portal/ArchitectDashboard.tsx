// CLIENT PORTAL — the architect dashboard (server component). Everything an
// architect needs to SPECIFY a stretch ceiling in one place: the document
// library (datasheets, spec texts, CAD/BIM, photo sets, measured case
// studies), project tools (budget guide, project registration, sample box),
// upcoming events and the advisor card. NO pricing-shaped content here beyond
// the link to the budget guide (src/lib/budget-bands.ts) — never import
// pricebook / portal pricing data into this tree.
import { existsSync } from 'node:fs';
import path from 'node:path';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import {
  ArrowRight,
  CalendarDays,
  Camera,
  Download,
  Euro,
  FileText,
  FolderOpen,
  Layers,
  LineChart,
  Package,
  PhoneCall,
  Ruler,
} from 'lucide-react';
import { datasheetsByCategory } from '@/lib/datasheets';
import { architectResourcesByCategory, type ArchitectResource } from '@/lib/architect-resources';
import { upcomingEvents } from '@/lib/events';
import { contact } from '@/lib/site-config';
import { ModalButton } from '@/components/ui/ModalButton';
import type { PortalProfile } from '@/lib/portal/types';

function resourceAvailable(r: ArchitectResource): boolean {
  return existsSync(path.join(process.cwd(), 'architect-private', r.file));
}

function datasheetAvailable(file: string): boolean {
  return existsSync(path.join(process.cwd(), 'datasheets-private', file));
}

function DownloadButton({
  href,
  available,
  demo,
  label,
  soonLabel,
}: {
  href: string;
  available: boolean;
  demo: boolean;
  label: string;
  soonLabel: string;
}) {
  if (!available || demo) {
    return (
      <span className="btn btn--ghost btn--sm" aria-disabled style={{ opacity: 0.55, pointerEvents: 'none', flexShrink: 0 }}>
        {available ? label : soonLabel}
      </span>
    );
  }
  return (
    <a href={href} download className="btn btn--primary btn--sm" style={{ flexShrink: 0 }}>
      {label} <Download size={14} />
    </a>
  );
}

function ResourceRows({
  items,
  demo,
  t,
}: {
  items: ArchitectResource[];
  demo: boolean;
  t: Awaited<ReturnType<typeof getTranslations>>;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((r) => {
        const available = resourceAvailable(r);
        return (
          <div key={r.slug} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '13px 16px', border: '1px solid var(--border)', background: '#fff' }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                {r.title}
                {r.lang && <span className="arch-chip">{r.lang}</span>}
                {!available && <span className="arch-chip arch-chip--soon">{t('comingSoon')}</span>}
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.5 }}>{r.description}</div>
              <div style={{ fontSize: 11, color: 'var(--text-faint-2)', marginTop: 4, letterSpacing: '.04em' }}>
                {[r.format, r.sizeLabel, r.updated, r.rightsNote].filter(Boolean).join(' · ')}
              </div>
            </div>
            <DownloadButton
              href={`/api/architect/file/${r.slug}`}
              available={available}
              demo={demo}
              label={t('download')}
              soonLabel={t('comingSoon')}
            />
          </div>
        );
      })}
    </div>
  );
}

export default async function ArchitectDashboard({
  profile,
  demo,
}: {
  profile: PortalProfile;
  demo: boolean;
}) {
  const t = await getTranslations('portal.architect');

  const specs = architectResourcesByCategory('spec');
  const cad = architectResourcesByCategory('cad');
  const photos = architectResourcesByCategory('photos');
  const cases = architectResourcesByCategory('case-study');
  const events = upcomingEvents();
  const sheetGroups = datasheetsByCategory();

  const office = profile.office ?? profile.company ?? profile.email;
  const prefill = {
    email: profile.email,
    phone: profile.phone ?? '',
    company: office,
  };

  const sectionHead = (icon: React.ReactNode, title: string, body?: string) => (
    <div style={{ margin: '0 0 16px' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: 10, margin: 0, fontSize: 16, fontWeight: 800, letterSpacing: '.04em', textTransform: 'uppercase' }}>
        {icon} {title}
      </h2>
      {body && <p style={{ margin: '6px 0 0', color: 'var(--text-muted)', fontSize: 13.5, lineHeight: 1.6, maxWidth: 640 }}>{body}</p>}
    </div>
  );

  return (
    <div className="container" style={{ padding: 'clamp(28px,4vw,56px) 0 clamp(40px,5vw,72px)' }}>
      <p className="eyebrow">
        <span style={{ background: 'var(--red)', width: 10, height: 10, display: 'inline-block', marginRight: 12 }} />
        {t('eyebrow')}
      </p>
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          textTransform: 'uppercase',
          fontSize: 'clamp(30px,4.4vw,54px)',
          lineHeight: 1,
          margin: '14px 0 10px',
        }}
      >
        {t('welcome')}
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 15.5, margin: '0 0 12px', maxWidth: 680 }}>
        {t('intro', { office })}
      </p>
      {demo && (
        <p style={{ border: '1px dashed var(--border-input)', background: '#fff', padding: '10px 14px', fontSize: 12.5, color: 'var(--text-muted)', margin: '0 0 24px', maxWidth: 680 }}>
          {t('demoNote')}
        </p>
      )}

      {/* ---- Your advisor — always visible, right under the heading ----------- */}
      <div className="arch-advisor">
        <div className="arch-advisor__who">
          <PhoneCall size={18} />
          <div>
            <strong>{t('advisorTitle')}</strong>
            <span>{t('advisorBody')}</span>
          </div>
        </div>
        <div className="arch-advisor__contact">
          <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
          <a href={`mailto:${contact.email}`} className="arch-advisor__mail">{contact.email}</a>
        </div>
        <ModalButton type="call" source="architect_advisor" prefill={prefill} className="btn btn--primary btn--sm">
          {t('advisorCta')} <ArrowRight size={14} />
        </ModalButton>
      </div>

      {/* ---- Project tools ---------------------------------------------------- */}
      <section style={{ margin: '26px 0 40px' }}>
        {sectionHead(<Ruler size={17} />, t('toolsTitle'))}
        <div className="arch-tiles">
          <Link href="/portal/budget-guide" className="arch-tile arch-tile--link">
            <div className="arch-tile__head"><Euro size={19} /></div>
            <h3>{t('budgetTileTitle')}</h3>
            <p>{t('budgetTileBody')}</p>
            <span className="arch-tile__cta">{t('budgetTileCta')} <ArrowRight size={14} /></span>
          </Link>
          <div className="arch-tile">
            <div className="arch-tile__head"><LineChart size={19} /></div>
            <h3>{t('projectTileTitle')}</h3>
            <p>{t('projectTileBody')}</p>
            <ModalButton
              type="project"
              source="architect_project"
              prefill={prefill}
              className="btn btn--primary btn--sm"
              style={{ alignSelf: 'flex-start' }}
            >
              {t('projectTileCta')} <ArrowRight size={14} />
            </ModalButton>
          </div>
          <div className="arch-tile">
            <div className="arch-tile__head"><Package size={19} /></div>
            <h3>{t('samplesTileTitle')}</h3>
            <p>{t('samplesTileBody')}</p>
            <ModalButton
              type="samples"
              source="architect_samples"
              prefill={prefill}
              className="btn btn--dark btn--sm"
              style={{ alignSelf: 'flex-start' }}
            >
              {t('samplesTileCta')} <ArrowRight size={14} />
            </ModalButton>
          </div>
        </div>
      </section>

      {/* ---- Library ---------------------------------------------------------- */}
      <section style={{ margin: '0 0 40px' }}>
        {sectionHead(<FolderOpen size={17} />, t('libraryTitle'), t('libraryBody'))}

        {/* a) Datasheets — one-click, logged per download (closed by default:
            the fold bars act as a compact index, keeping the page short) */}
        <details className="arch-fold">
          <summary>
            <FileText size={15} /> {t('docsTitle')} <span className="arch-count">{sheetGroups.reduce((n, g) => n + g.items.length, 0)}</span>
          </summary>
          <p className="arch-fold__body">{t('docsBody')}</p>
          {sheetGroups.map((group) => (
            <div key={group.category} style={{ margin: '0 0 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13, margin: '14px 0 10px' }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--text-faint-2)' }}>{group.category}</span>
                <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {group.items.map((sheet) => (
                  <div key={sheet.slug} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 14px', border: '1px solid var(--border)', background: '#fff' }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700 }}>{sheet.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-faint-2)', marginTop: 2, letterSpacing: '.04em' }}>
                        {[sheet.format, sheet.sizeLabel, sheet.updated].filter(Boolean).join(' · ')}
                      </div>
                    </div>
                    <DownloadButton
                      href={`/api/architect/datasheet/${sheet.slug}`}
                      available={datasheetAvailable(sheet.file)}
                      demo={demo}
                      label={t('download')}
                      soonLabel={t('comingSoon')}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </details>

        {/* b) Specification texts */}
        <details className="arch-fold">
          <summary><FileText size={15} /> {t('specTitle')} <span className="arch-count">{specs.length}</span></summary>
          <p className="arch-fold__body">{t('specBody')}</p>
          <ResourceRows items={specs} demo={demo} t={t} />
        </details>

        {/* c) CAD & BIM */}
        <details className="arch-fold">
          <summary><Layers size={15} /> {t('cadTitle')} <span className="arch-count">{cad.length}</span></summary>
          <p className="arch-fold__body">{t('cadBody')}</p>
          <ResourceRows items={cad} demo={demo} t={t} />
        </details>

        {/* d) Project photos */}
        <details className="arch-fold">
          <summary><Camera size={15} /> {t('photosTitle')} <span className="arch-count">{photos.length}</span></summary>
          <p className="arch-fold__body">{t('photosBody')}</p>
          <ResourceRows items={photos} demo={demo} t={t} />
        </details>

        {/* e) Technical case studies — measured results */}
        <details className="arch-fold">
          <summary><LineChart size={15} /> {t('casesTitle')} <span className="arch-count">{cases.length}</span></summary>
          <p className="arch-fold__body">{t('casesBody')}</p>
          <div className="arch-cases">
            {cases.map((c) => {
              const available = resourceAvailable(c);
              return (
                <article key={c.slug} style={{ border: '1px solid var(--border)', background: '#fff', padding: 'clamp(16px,2vw,22px)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <h3 style={{ margin: 0, fontSize: 15.5, fontWeight: 800, letterSpacing: '.01em' }}>{c.title}</h3>
                  <div style={{ fontSize: 12, color: 'var(--text-faint-2)', letterSpacing: '.04em' }}>
                    {[c.system, c.location].filter(Boolean).join(' · ')}
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55 }}>{c.description}</p>
                  <div>
                    {(c.results ?? []).map((row) => (
                      <div key={row.k} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, padding: '9px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                        <span style={{ color: 'var(--text-muted)' }}>{row.k}</span>
                        <span style={{ fontWeight: 700, textAlign: 'right' }}>{row.v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 4 }}>
                    <DownloadButton
                      href={`/api/architect/file/${c.slug}`}
                      available={available}
                      demo={demo}
                      label={t('download')}
                      soonLabel={t('comingSoon')}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </details>
      </section>

      {/* ---- Events — a fold like the library, keeps the page short ----------- */}
      <section style={{ margin: '0 0 12px' }}>
        <details className="arch-fold">
          <summary><CalendarDays size={15} /> {t('eventsTitle')} <span className="arch-count">{events.length}</span></summary>
          <p className="arch-fold__body">{t('eventsBody')}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {events.map((e) => (
              <div key={e.slug} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '13px 16px', border: '1px solid var(--border)', background: '#fff', flexWrap: 'wrap' }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{e.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-faint-2)', marginTop: 3, letterSpacing: '.03em' }}>
                    {e.dateLabel} · {e.location}
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.5 }}>{e.blurb}</div>
                </div>
                {e.open && (
                  <ModalButton
                    type={e.kind === 'training' ? 'training' : 'call'}
                    source={`architect_event_${e.slug}`}
                    product={e.kind === 'training' ? e.title : undefined}
                    prefill={prefill}
                    className="btn btn--ghost btn--sm"
                  >
                    {t('register')} <ArrowRight size={13} />
                  </ModalButton>
                )}
              </div>
            ))}
          </div>
        </details>
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .arch-advisor { display: flex; align-items: center; gap: 22px; flex-wrap: wrap; background: var(--black); color: #fff; padding: 16px 20px; margin: 0 0 30px; }
        .arch-advisor__who { display: flex; align-items: center; gap: 12px; flex: 1 1 320px; min-width: 0; }
        .arch-advisor__who strong { display: block; font-size: 12px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
        .arch-advisor__who span { display: block; font-size: 12px; color: var(--on-dark-muted); line-height: 1.45; margin-top: 2px; }
        .arch-advisor__contact { display: flex; flex-direction: column; line-height: 1.5; }
        .arch-advisor__contact a { color: #fff; text-decoration: none; font-size: 13.5px; font-weight: 700; white-space: nowrap; }
        .arch-advisor__mail { color: var(--red-bright) !important; }
        .arch-tiles { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .arch-tile { background: #fff; border: 1px solid var(--border); padding: clamp(18px,2vw,24px); display: flex; flex-direction: column; gap: 9px; color: var(--text); text-decoration: none; }
        .arch-tile--link:hover { border-color: var(--black); }
        .arch-tile--link:hover .arch-tile__cta { color: var(--red); }
        .arch-tile__head { color: var(--black); }
        .arch-tile h3 { margin: 0; font-size: 15px; font-weight: 800; letter-spacing: .03em; text-transform: uppercase; }
        .arch-tile p { margin: 0; color: var(--text-muted); font-size: 13px; line-height: 1.55; flex: 1; }
        .arch-tile__cta { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
        .arch-fold { border: 1px solid var(--border); background: #fff; margin: 0 0 12px; }
        .arch-fold summary { display: flex; align-items: center; gap: 10px; padding: 14px 16px; cursor: pointer; font-size: 13px; font-weight: 800; letter-spacing: .05em; text-transform: uppercase; list-style: none; }
        .arch-fold summary::-webkit-details-marker { display: none; }
        .arch-fold[open] summary { border-bottom: 1px solid var(--border); }
        .arch-fold > *:not(summary) { margin-left: 16px; margin-right: 16px; }
        .arch-fold > div:last-child, .arch-fold > .arch-cases { margin-bottom: 16px; }
        .arch-fold__body { color: var(--text-muted); font-size: 13px; line-height: 1.55; margin: 12px 16px; max-width: 640px; }
        .arch-count { font-size: 10.5px; font-weight: 700; color: var(--text-faint-2); background: var(--surface); border: 1px solid var(--border-2); padding: 2px 7px; }
        .arch-chip { font-size: 10px; font-weight: 800; letter-spacing: .07em; text-transform: uppercase; color: var(--text-muted-2); border: 1px solid var(--border-2); background: var(--surface); padding: 2px 6px; }
        .arch-chip--soon { color: #fff; background: var(--black); border-color: var(--black); }
        .arch-cases { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 900px) { .arch-tiles { grid-template-columns: 1fr; } .arch-cases { grid-template-columns: 1fr; } }
      `,
        }}
      />
    </div>
  );
}
