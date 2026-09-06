// CLIENT PORTAL — order history (/portal/orders).
// TWO sources, because the portal has two ordering surfaces: the kit
// configurator (portal_orders, with a frozen line snapshot) and the ceiling
// designer (designer_orders). Dealers see their own; admins see every order
// and can update a designer order's status. Trade only.
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getPortalSession } from '@/lib/portal/auth';
import { hasTradeAccess } from '@/lib/portal/types';
import { listOrders, type DesignerOrderRow, type OrderStatus } from '@/lib/portal/designer-store';
import { listOrders as listConfiguratorOrders } from '@/lib/portal/configurator/order-store';
import OrderStatusControl from '@/components/portal/OrderStatusControl';

const CFG_STATUS_TONE: Record<string, { bg: string; fg: string }> = {
  received: { bg: '#eef2f7', fg: '#334' },
  confirmed: { bg: '#e6f0fd', fg: '#1a4fa3' },
  in_production: { bg: '#fdf3e2', fg: '#8a5b12' },
  shipped: { bg: '#e8f6ec', fg: '#1c6b34' },
  cancelled: { bg: '#fbe9e9', fg: '#8f1f1f' },
};

const STATUS_TONE: Record<OrderStatus, { bg: string; fg: string }> = {
  received: { bg: '#eef2f7', fg: '#334' },
  confirmed: { bg: '#e6f0fd', fg: '#1a4fa3' },
  in_production: { bg: '#fdf3e2', fg: '#8a5b12' },
  delivered: { bg: '#e8f6ec', fg: '#1c6b34' },
  cancelled: { bg: '#fbe9e9', fg: '#8f1f1f' },
};

function num(v: unknown): number | null {
  return typeof v === 'number' && isFinite(v) ? v : null;
}

export default async function PortalOrdersPage({ params }: { params: { locale: string } }) {
  const locale = (isValidLocale(params.locale) ? params.locale : 'en') as Locale;
  setRequestLocale(locale);

  const session = await getPortalSession();
  if (!session) return null; // (app) layout already redirects
  if (!hasTradeAccess(session.profile)) redirect({ href: '/portal', locale });
  const t = await getTranslations('portal.orders');

  const isAdmin = session.profile.role === 'admin';
  const orders = session.demo ? [] : await listOrders(session.profile);
  const configuratorOrders = session.demo ? [] : ((await listConfiguratorOrders(session.profile)) ?? []);
  const unavailable = !session.demo && orders === null;
  const rows: DesignerOrderRow[] = orders ?? [];

  const statusLabels: Record<string, string> = {
    received: t('statuses.received'),
    confirmed: t('statuses.confirmed'),
    in_production: t('statuses.in_production'),
    delivered: t('statuses.delivered'),
    cancelled: t('statuses.cancelled'),
  };

  return (
    <div className="container" style={{ padding: 'clamp(28px,4vw,56px) 0 clamp(40px,5vw,72px)' }}>
      <p className="eyebrow">
        <span style={{ background: 'var(--red)', width: 10, height: 10, display: 'inline-block', marginRight: 12 }} />
        {t('title')}
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
        {t('title')}
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 15.5, margin: '0 0 30px', maxWidth: 640 }}>{t('intro')}</p>

      {configuratorOrders.length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <h2
            style={{
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: '.09em',
              textTransform: 'uppercase',
              margin: '0 0 12px',
            }}
          >
            Kit configurator
          </h2>
          <div style={{ overflowX: 'auto', border: '1px solid var(--border)', background: '#fff' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
                  {['Ref', t('thDate'), ...(isAdmin ? ['Account'] : []), 'Foil', 'm²', t('thTotal'), t('thStatus')].map(
                    (hd) => (
                      <th
                        key={hd}
                        style={{
                          padding: '12px 14px',
                          fontSize: 11.5,
                          letterSpacing: '.08em',
                          textTransform: 'uppercase',
                          color: 'var(--text-faint-2)',
                        }}
                      >
                        {hd}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {configuratorOrders.map((o) => {
                  const cfg = (o.config ?? {}) as Record<string, unknown>;
                  const area =
                    typeof cfg.length === 'number' && typeof cfg.width === 'number'
                      ? (cfg.length * cfg.width).toFixed(2)
                      : '—';
                  const tone = CFG_STATUS_TONE[o.status] ?? CFG_STATUS_TONE.received;
                  return (
                    <tr key={o.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '11px 14px', fontWeight: 700, whiteSpace: 'nowrap' }}>{o.reference}</td>
                      <td style={{ padding: '11px 14px', whiteSpace: 'nowrap' }}>
                        {new Date(o.created_at).toLocaleDateString(locale)}
                      </td>
                      {isAdmin && <td style={{ padding: '11px 14px' }}>{o.company || o.email}</td>}
                      <td style={{ padding: '11px 14px' }}>
                        {o.foil_product ?? '—'}
                        {o.weld_required && (
                          <span style={{ color: 'var(--red)', fontSize: 11, fontWeight: 700 }}> · welded</span>
                        )}
                      </td>
                      <td style={{ padding: '11px 14px', whiteSpace: 'nowrap' }}>{area}</td>
                      <td style={{ padding: '11px 14px', whiteSpace: 'nowrap', fontWeight: 600 }}>
                        {o.needs_manual_pricing ? 'from ' : ''}
                        {o.currency === 'PLN' ? 'PLN ' : '€ '}
                        {Number(o.subtotal).toFixed(2)}
                      </td>
                      <td style={{ padding: '11px 14px' }}>
                        <span
                          style={{
                            background: tone.bg,
                            color: tone.fg,
                            fontSize: 11.5,
                            fontWeight: 700,
                            letterSpacing: '.05em',
                            textTransform: 'uppercase',
                            padding: '4px 9px',
                          }}
                        >
                          {o.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {configuratorOrders.length > 0 && rows.length > 0 && (
        <h2
          style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.09em', textTransform: 'uppercase', margin: '0 0 12px' }}
        >
          Ceiling designer
        </h2>
      )}

      {rows.length === 0 && configuratorOrders.length > 0 ? null : rows.length === 0 ? (
        <div style={{ border: '1px solid var(--border)', background: '#fff', padding: 'clamp(24px,3vw,36px)', maxWidth: 720, fontSize: 14.5, lineHeight: 1.6, color: 'var(--text-muted)' }}>
          {session.demo ? t('demoNote') : unavailable ? t('unavailable') : t('empty')}
        </div>
      ) : (
        <div style={{ overflowX: 'auto', border: '1px solid var(--border)', background: '#fff' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
                {['Ref', t('thDate'), ...(isAdmin ? [t('thDealer')] : []), t('thClient'), 'm²', t('thTotal'), t('thStatus')].map((hd) => (
                  <th key={hd} style={{ padding: '12px 14px', fontSize: 11.5, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text-faint-2)' }}>{hd}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => {
                const area = num((o.specification as Record<string, unknown>)?.ceilingAreaNetM2);
                const total = num((o.quote as Record<string, unknown>)?.total);
                const clientName = typeof o.client?.name === 'string' && o.client.name ? (o.client.name as string) : '—';
                const tone = STATUS_TONE[o.status] ?? STATUS_TONE.received;
                return (
                  <tr key={o.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '11px 14px', fontWeight: 700, whiteSpace: 'nowrap' }}>{o.ref}</td>
                    <td style={{ padding: '11px 14px', whiteSpace: 'nowrap' }}>
                      {new Date(o.created_at).toLocaleDateString(locale)}
                    </td>
                    {isAdmin && (
                      <td style={{ padding: '11px 14px' }}>{o.company || o.user_email}</td>
                    )}
                    <td style={{ padding: '11px 14px' }}>{clientName}</td>
                    <td style={{ padding: '11px 14px', whiteSpace: 'nowrap' }}>{area != null ? area.toFixed(2) : '—'}</td>
                    <td style={{ padding: '11px 14px', whiteSpace: 'nowrap', fontWeight: 600 }}>
                      {total != null ? `€ ${total.toFixed(2)}` : '—'}
                    </td>
                    <td style={{ padding: '11px 14px' }}>
                      {isAdmin ? (
                        <OrderStatusControl id={o.id} status={o.status} labels={statusLabels} />
                      ) : (
                        <span style={{ background: tone.bg, color: tone.fg, fontSize: 11.5, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', padding: '4px 9px' }}>
                          {statusLabels[o.status] ?? o.status}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
