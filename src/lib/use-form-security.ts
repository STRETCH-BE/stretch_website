'use client';

// ============================================================================
// useFormSecurity — one hook every public form uses for its bot defences:
//   • fetches the signed form token (GET /api/form-token) when the form
//     mounts; exposes refreshFormToken() for the 'stale_token' retry;
//   • holds the current Turnstile token (fed by <TurnstileWidget
//     ref={sec.widgetRef} onToken={sec.setTurnstileToken} />);
//   • waitForTurnstile() lets a submit handler wait a few seconds for the
//     invisible challenge — never indefinitely: after the timeout the submit
//     proceeds and the server answers with the clear 'captcha' message.
// With none of the env vars set, everything here no-ops (zero-config rule).
// ============================================================================
import { useCallback, useEffect, useRef, useState } from 'react';
import { isTurnstileEnabled } from '@/lib/turnstile';
import type { TurnstileHandle } from '@/components/ui/TurnstileWidget';

const WAIT_MS = 6000;

export function useFormSecurity() {
  const [formToken, setFormToken] = useState<string | null>(null);
  const turnstileToken = useRef<string | null>(null);
  const waiters = useRef<((t: string | null) => void)[]>([]);
  const widgetRef = useRef<TurnstileHandle | null>(null);

  const refreshFormToken = useCallback(async (): Promise<string | null> => {
    try {
      const res = await fetch('/api/form-token', { cache: 'no-store' });
      const json = (await res.json().catch(() => null)) as { token?: string | null } | null;
      const token = json?.token ?? null;
      setFormToken(token);
      return token;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    void refreshFormToken();
  }, [refreshFormToken]);

  const setTurnstileToken = useCallback((token: string | null) => {
    turnstileToken.current = token;
    if (token) {
      for (const resolve of waiters.current.splice(0)) resolve(token);
    }
  }, []);

  /** Resolve with a token as soon as one exists, or null after the wait —
   *  the caller submits either way (server-side message handles the rest). */
  const waitForTurnstile = useCallback(async (): Promise<string | null> => {
    if (!isTurnstileEnabled()) return null;
    if (turnstileToken.current) return turnstileToken.current;
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        waiters.current = waiters.current.filter((w) => w !== wrapped);
        resolve(turnstileToken.current);
      }, WAIT_MS);
      const wrapped = (t: string | null) => {
        clearTimeout(timer);
        resolve(t);
      };
      waiters.current.push(wrapped);
    });
  }, []);

  const resetTurnstile = useCallback(() => {
    widgetRef.current?.reset();
  }, []);

  return { formToken, refreshFormToken, setTurnstileToken, waitForTurnstile, resetTurnstile, widgetRef };
}
