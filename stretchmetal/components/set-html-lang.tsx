'use client';

// Sets <html lang> for a subtree. The App Router allows exactly one root
// <html> (lang="pl" here), so the /en layout mounts this to correct the
// attribute for screen readers and translation tools.
import { useEffect } from 'react';

export default function SetHtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    const previous = document.documentElement.lang;
    document.documentElement.lang = lang;
    return () => {
      document.documentElement.lang = previous;
    };
  }, [lang]);
  return null;
}
