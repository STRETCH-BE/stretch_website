'use client';

// CLIENT PORTAL — admin-only status dropdown on the orders list.
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ORDER_STATUSES, type OrderStatus } from '@/lib/portal/types';

export default function OrderStatusControl({
  id,
  status,
  labels,
}: {
  id: string;
  status: OrderStatus;
  labels: Record<string, string>;
}) {
  const router = useRouter();
  const [value, setValue] = useState<OrderStatus>(status);
  const [busy, setBusy] = useState(false);

  async function change(next: OrderStatus) {
    const prev = value;
    setValue(next);
    setBusy(true);
    try {
      const res = await fetch('/api/portal/designer/order/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: next }),
      });
      const j = await res.json().catch(() => ({ ok: false }));
      if (!j.ok) setValue(prev);
      else router.refresh();
    } catch {
      setValue(prev);
    } finally {
      setBusy(false);
    }
  }

  return (
    <select
      value={value}
      disabled={busy}
      onChange={(e) => change(e.target.value as OrderStatus)}
      style={{ fontSize: 12.5, padding: '5px 8px', border: '1px solid var(--border)', background: '#fff' }}
    >
      {ORDER_STATUSES.map((s) => (
        <option key={s} value={s}>
          {labels[s] ?? s}
        </option>
      ))}
    </select>
  );
}
