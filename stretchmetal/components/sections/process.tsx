// Process section — the numbered steps from drawing to delivery. Reused on
// the home page (5 steps) and, in shorter form, on service and RFQ pages.
import FadeIn from '@/components/ui/fade-in';
import SectionTitle from '@/components/ui/section-title';
import type { ProcessStep } from '@/content/types';

export default function Process({
  num,
  eyebrow,
  title,
  lead,
  steps,
  tone = 'light',
}: {
  num?: string;
  eyebrow: string;
  title: string;
  lead?: string;
  steps: ProcessStep[];
  tone?: 'light' | 'dark';
}) {
  return (
    <section className={`section ${tone === 'dark' ? 'section--dark' : ''}`}>
      <div className="container-sm">
        <FadeIn>
          <SectionTitle num={num} eyebrow={eyebrow} title={title} lead={lead} tone={tone} small />
        </FadeIn>
        <div
          className={`grid-lines mt-10 ${tone === 'dark' ? 'grid-lines--dark' : ''} min-[640px]:grid-cols-2 min-[1100px]:grid-cols-5`}
        >
          {steps.map((step, i) => (
            <FadeIn key={step.title} delay={i * 70} className="h-full">
              <div className={`flex h-full flex-col p-6 ${tone === 'dark' ? 'bg-black' : 'bg-white'}`}>
                <span
                  className={`wdth-125 text-[28px] font-black leading-none ${
                    tone === 'dark' ? 'text-red-bright' : 'text-red'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 text-[15.5px] font-extrabold uppercase leading-snug tracking-[0.02em]">
                  {step.title}
                </h3>
                <p
                  className={`mt-3 text-[13px] leading-relaxed ${
                    tone === 'dark' ? 'text-on-dark-muted' : 'text-text-muted'
                  }`}
                >
                  {step.text}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
