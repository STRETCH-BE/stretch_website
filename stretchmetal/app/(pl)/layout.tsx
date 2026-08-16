// PL layout — wraps every Polish route (the root tree) with the Polish nav,
// footer and mobile sticky bar. The (pl) route group keeps URLs unprefixed.
import Nav from '@/components/sections/nav';
import Footer from '@/components/sections/footer';
import MobileStickyCta from '@/components/sections/mobile-sticky-cta';
import { getContent } from '@/content';

export default function PlLayout({ children }: { children: React.ReactNode }) {
  const { chrome } = getContent('pl');
  return (
    <>
      <a href="#tresc" className="skip-link">
        {chrome.skipLink}
      </a>
      <Nav locale="pl" chrome={chrome} />
      <main id="tresc">{children}</main>
      <Footer locale="pl" chrome={chrome} />
      <MobileStickyCta locale="pl" chrome={chrome} />
    </>
  );
}
