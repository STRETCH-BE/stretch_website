// Robots — open to all crawlers including the AI/LLM ones (an explicit allow
// list mirrors the stretch-sufit policy: being quotable by assistants is a
// lead channel for a B2B workshop). The API route is the only disallow.
import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site-config';

const AI_CRAWLERS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'Bytespider',
  'meta-externalagent',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/'] },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: '/' as const })),
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
