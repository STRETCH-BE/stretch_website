// EN layout — wraps everything under /en with the English nav, footer and
// mobile bar, and corrects <html lang> to "en" (the root layout can only set
// one static lang; SetHtmlLang flips it client-side for this subtree).
import Nav from '@/components/sections/nav';
import Footer from '@/components/sections/footer';
import MobileStickyCta from '@/components/sections/mobile-sticky-cta';
import SetHtmlLang from '@/components/set-html-lang';
import { getContent } from '@/content';

export default function EnLayout({ children }: { children: React.ReactNode }) {
  const { chrome } = getContent('en');
  return (
    <>
      <SetHtmlLang lang="en" />
      <a href="#content" className="skip-link">
        {chrome.skipLink}
      </a>
      <Nav locale="en" chrome={chrome} />
      <main id="content">{children}</main>
      <Footer locale="en" chrome={chrome} />
      <MobileStickyCta locale="en" chrome={chrome} />
    </>
  );
}
