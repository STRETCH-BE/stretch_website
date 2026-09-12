// /akoestiek — Dutch acoustics guide (be, nl). Thin route: the locale set comes from
// src/lib/page-slugs.json, the content from src/lib/acoustics/<locale>.ts and
// the rendering from AcousticsRoute. Any other locale: no page (404).
import { acousticsParams, acousticsMetadata, AcousticsView } from '@/components/sections/AcousticsRoute';

const SLUG = 'akoestiek';

export const dynamicParams = false;

export function generateStaticParams() {
  return acousticsParams(SLUG);
}

export function generateMetadata({ params }: { params: { locale: string } }) {
  return acousticsMetadata(params.locale, SLUG);
}

export default function AcousticsPage({ params }: { params: { locale: string } }) {
  return <AcousticsView localeParam={params.locale} slug={SLUG} />;
}
