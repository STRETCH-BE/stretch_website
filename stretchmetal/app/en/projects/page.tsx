// Projects — EN. Thin route wrapper: metadata from the typed
// content file + the shared screen component (see components/screens/).
import type { Metadata } from 'next';
import ProjectsScreen from '@/components/screens/projects-screen';
import { getContent } from '@/content';
import { pageMetadata } from '@/lib/seo';

const { projects } = getContent('en');

export const metadata: Metadata = pageMetadata({
  route: 'projects',
  locale: 'en',
  title: projects.metaTitle,
  description: projects.metaDescription,
});

export default function Page() {
  return <ProjectsScreen locale="en" />;
}
