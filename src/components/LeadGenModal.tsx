'use client';

// Lead modal PROVIDER — context, hook and the mount point. The dialog itself
// (LeadGenModalDialog.tsx: the form, Turnstile, country/phone helpers) is
// loaded on demand with next/dynamic: it is not part of any page's initial
// JavaScript and only downloads on the first click (ModalButton warms the
// chunk on hover/focus).
import dynamic from 'next/dynamic';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { ModalType } from '@/lib/forms-config';

const LeadGenModalDialog = dynamic(() => import('./LeadGenModalDialog'), { ssr: false });

/** Warm the dialog chunk before the click (hover / focus on a ModalButton). */
export function preloadLeadModal(): void {
  void import('./LeadGenModalDialog');
}

export type OpenOptions = {
  /** Tracking source label (e.g. 'hero', 'product_pvc', 'footer'). */
  source?: string;
  /** Product slug for analytics, when opened from a product context. */
  product?: string;
  /** Gated datasheet: delivered by email via /api/datasheet-request. */
  datasheet?: { slug: string; title: string };
  /** Pre-filled default values for matching field names (e.g. from a signed-in
   *  portal profile). The visitor can still edit everything. */
  prefill?: Record<string, string>;
};

type LeadModalContextValue = {
  open: (type: ModalType, options?: OpenOptions) => void;
  close: () => void;
};

const LeadModalContext = createContext<LeadModalContextValue | null>(null);

export function useLeadModal(): LeadModalContextValue {
  const ctx = useContext(LeadModalContext);
  if (!ctx) throw new Error('useLeadModal must be used within <LeadModalProvider>');
  return ctx;
}

export function LeadModalProvider({ children }: { children: ReactNode }) {
  const [type, setType] = useState<ModalType | null>(null);
  const [opts, setOpts] = useState<OpenOptions>({});

  const open = useCallback((t: ModalType, options: OpenOptions = {}) => {
    setOpts(options);
    setType(t);
  }, []);
  const close = useCallback(() => setType(null), []);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <LeadModalContext.Provider value={value}>
      {children}
      {type && <LeadGenModalDialog type={type} options={opts} onClose={close} />}
    </LeadModalContext.Provider>
  );
}
