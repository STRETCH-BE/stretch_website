// Projects grid — case cards with image placeholder, services used, material
// and finish. Shared by the home teaser (first N entries) and the projects
// page (all entries). Sample entries carry a visible "sample" note.
import FadeIn from '@/components/ui/fade-in';
import Placeholder from '@/components/ui/placeholder';
import type { Project, ProjectsContent } from '@/content/types';

export default function ProjectsGrid({
  entries,
  metaLabels,
  sampleNote,
}: {
  entries: Project[];
  metaLabels: ProjectsContent['metaLabels'];
  sampleNote: string;
}) {
  return (
    <div className="grid-lines min-[640px]:grid-cols-2 min-[1000px]:grid-cols-3">
      {entries.map((project, i) => (
        <FadeIn key={project.title} delay={i * 60} className="h-full">
          <article className="flex h-full flex-col bg-white">
            <Placeholder label={project.imageLabel} ratio="16/10" />
            <div className="flex grow flex-col p-6">
              <h3 className="text-[15.5px] font-extrabold uppercase leading-snug tracking-[0.01em]">
                {project.title}
              </h3>
              <dl className="mt-4 flex flex-col gap-2 text-[12.5px]">
                <div className="flex gap-2">
                  <dt className="shrink-0 font-bold uppercase tracking-[0.08em] text-text-faint">
                    {metaLabels.services}:
                  </dt>
                  <dd className="text-text-muted">{project.services.join(' · ')}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="shrink-0 font-bold uppercase tracking-[0.08em] text-text-faint">
                    {metaLabels.material}:
                  </dt>
                  <dd className="text-text-muted">{project.material}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="shrink-0 font-bold uppercase tracking-[0.08em] text-text-faint">
                    {metaLabels.finish}:
                  </dt>
                  <dd className="text-text-muted">{project.finish}</dd>
                </div>
              </dl>
              {project.sample ? (
                <p className="mt-auto pt-4 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-text-faint">
                  {sampleNote}
                </p>
              ) : null}
            </div>
          </article>
        </FadeIn>
      ))}
    </div>
  );
}
