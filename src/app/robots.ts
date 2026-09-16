import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.studyinmalaysia.vercel.app').replace(/\/$/, '');

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/programs',
          '/programs/*',
          '/universities',
          '/universities/*',
          '/calculator',
        ],
        disallow: [
          '/admin',
          '/admin/*',
          '/api/*',
          '/login',
          '/_next/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
