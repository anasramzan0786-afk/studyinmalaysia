import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Study In Malaysia By Meezab',
    short_name: 'Meezab Portal',
    description: 'Official higher education admissions and EMGS visa portal by Meezab Future Consulting.',
    start_url: '/',
    display: 'standalone',
    background_color: '#08182B',
    theme_color: '#0B2553',
    orientation: 'portrait-primary',
    categories: ['education', 'business'],
    icons: [
      {
        src: '/meezab-square-logo.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
        purpose: 'maskable',
      },
      {
        src: '/meezab-square-logo.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
        purpose: 'any',
      },
    ],
  };
}

