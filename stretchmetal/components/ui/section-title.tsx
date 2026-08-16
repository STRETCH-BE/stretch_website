// Section heading block: eyebrow (red number + label) above an uppercase
// display h2. `title` is a HeroLine[] so any word can carry the single red
// accent the identity allows per heading.
import Eyebrow from '@/components/ui/eyebrow';
import type { HeroLine } from '@/content/types';

type SectionTitleProps = {
  num?: string;
  eyebrow: string;
  title: HeroLine[] | string;
  lead?: string;
  tone?: 'light' | 'dark';
  small?: boolean;
};

export function TitleLines({ lines, tone = 'light' }: { lines: HeroLine[] | string; tone?: 'light' | 'dark' }) {
  if (typeof lines === 'string') return <>{lines}</>;
  return (
    <>
      {lines.map((line, i) => (
        <span key={i} className={line.accent ? (tone === 'dark' ? 'text-red-bright' : 'text-red') : undefined}>
          {line.text}
          {i < lines.length - 1 ? ' ' : ''}
        </span>
      ))}
    </>
  );
}

export default function SectionTitle({
  num,
  eyebrow,
  title,
  lead,
  tone = 'light',
  small = false,
}: SectionTitleProps) {
  return (
    <div className="max-w-[900px]">
      <Eyebrow num={num} label={eyebrow} tone={tone} />
      <h2 className={`h2${small ? ' h2--sm' : ''}`}>
        <TitleLines lines={title} tone={tone} />
      </h2>
      {lead ? (
        <p className={`lead mt-6 max-w-[640px] ${tone === 'dark' ? 'text-on-dark-soft' : 'text-text-body'}`}>
          {lead}
        </p>
      ) : null}
    </div>
  );
}
