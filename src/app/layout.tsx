import type { Metadata } from 'next';
import { Montserrat, Jost } from 'next/font/google';
import './globals.css';
import { CounselingProvider } from '@/components/CounselingContext';
import { PageLoader } from '@/components/PageLoader';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
});

const jost = Jost({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-jost',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.studyinmalaysia.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Study In Malaysia By Meezab | Meezab Future Consulting Official Portal',
    template: '%s | Study In Malaysia By Meezab',
  },
  description:
    'Study In Malaysia By Meezab — Official higher education admissions & EMGS visa portal by Meezab Future Consulting. Compare university fees, upfront statutory visa costs, and apply directly with zero consultant markup.',
  icons: {
    icon: 'https://meezabfuture.com/wp-content/uploads/2025/03/cropped-fav-32x32.png',
    apple: 'https://meezabfuture.com/wp-content/uploads/2025/03/cropped-fav-192x192.png',
  },
  keywords: [
    'Study In Malaysia By Meezab',
    'Meezab Future Consulting',
    'Study in Malaysia Meezab',
    'Meezab consultancy Lahore Islamabad Karachi',
    'Malaysia University fees for Pakistani students',
    'EMGS visa calculator',
    'Lincoln University College admissions',
    'APU Malaysia admissions',
    'UCSI University admissions',
    'Study in Malaysia free consultation',
  ],
  openGraph: {
    title: 'Study In Malaysia By Meezab | Meezab Future Consulting',
    description:
      'Official admissions and EMGS fee portal by Meezab Future Consulting. Explore 1,200+ accredited Malaysian university courses with verified upfront visa packages.',
    url: siteUrl,
    siteName: 'Study In Malaysia By Meezab',
    locale: 'en_PK',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200&q=85',
        width: 1200,
        height: 630,
        alt: 'Study In Malaysia By Meezab - Meezab Future Consulting',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Study In Malaysia By Meezab | Meezab Future Consulting',
    description:
      'Compare 1,200+ accredited Malaysian degrees and calculate official upfront EMGS visa fees with zero consultant markup.',
    images: ['https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200&q=85'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLdOrg = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Meezab Future Consulting',
  url: siteUrl,
  logo: 'https://meezabfuture.com/wp-content/uploads/2023/11/Meezab-Logo-new.png',
  description:
    'Official education consultancy and admissions portal for Malaysian universities, providing transparent fee schedules and EMGS visa assistance.',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'Pakistan',
    addressLocality: 'Lahore & Islamabad',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+92-334-6596725',
    contactType: 'customer service',
    availableLanguage: ['English', 'Urdu'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${jost.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
      </head>
      <body className={`${montserrat.className} min-h-screen flex flex-col bg-[#F9F9F9] text-[#1F2937] antialiased selection:bg-[#0B2553] selection:text-[#E8A300]`}>
        <PageLoader />
        <CounselingProvider>
          {children}
        </CounselingProvider>
      </body>
    </html>
  );
}
