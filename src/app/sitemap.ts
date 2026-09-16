import type { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.studyinmalaysia.vercel.app').replace(/\/$/, '');

  // 1. Core Static Landing Pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/programs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/universities`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/calculator`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
  ];

  try {
    const [universities, programs] = await Promise.all([
      db.university.findMany({
        select: { slug: true, updatedAt: true },
      }),
      db.program.findMany({
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const universityPages: MetadataRoute.Sitemap = universities.map((uni) => ({
      url: `${baseUrl}/universities/${encodeURIComponent(uni.slug)}`,
      lastModified: uni.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    const programPages: MetadataRoute.Sitemap = programs.map((prog) => ({
      url: `${baseUrl}/programs/${encodeURIComponent(prog.slug)}`,
      lastModified: prog.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    return [...staticPages, ...universityPages, ...programPages];
  } catch (err) {
    console.error('Error generating dynamic sitemap:', err);
    return staticPages;
  }
}
