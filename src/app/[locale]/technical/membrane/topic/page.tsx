// Technical hub — one dynamic route renders all membrane × topic pages
// (e.g. /technical/polyester/datasheet). Params + content live in
// TechnicalRoute / technical.ts. dynamicParams=false so only the 12 valid
// combinations exist; anything else 404s.
import type { Metadata } from 'next';
import { technicalMetadata, TechnicalView, technicalParams } from '@/components/sections/TechnicalRoute';

export const dynamicParams = false;

export function generateStaticParams() {
  return technicalParams();
}

export function generateMetadata({
  params,
}: {
  params: { locale: string; membrane: string; topic: string };
}): Metadata {
  return technicalMetadata(params.membrane, params.topic, params.locale);
}

export default function Page({
  params,
}: {
  params: { locale: string; membrane: string; topic: string };
}) {
  return <TechnicalView membrane={params.membrane} topic={params.topic} locale={params.locale} />;
}
