import type { Metadata } from 'next';
import { Montserrat, Jost } from 'next/font/google';
import './globals.css';
import { CounselingProvider } from '@/components/CounselingContext';
import { Footer } from '@/components/layout/Footer';
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

export const metadata: Metadata = {
  title: 'Meezab Future Consulting | Study in Malaysia Official Admissions & EMGS Portal',
  description:
    'Meezab Future Consulting official admissions portal for Malaysian higher education institutions. Compare university fees, upfront EMGS visa costs, and apply directly with zero consultant markup.',
  icons: {
    icon: 'https://meezabfuture.com/wp-content/uploads/2025/03/cropped-fav-32x32.png',
    apple: 'https://meezabfuture.com/wp-content/uploads/2025/03/cropped-fav-192x192.png',
  },
  keywords: [
    'Meezab Future Consulting',
    'Study in Malaysia Meezab',
    'Meezab consultancy Lahore Islamabad Karachi',
    'Malaysia University fees for Pakistani students',
    'EMGS visa calculator',
    'Lincoln University College admissions',
    'APU Malaysia admissions',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${jost.variable} scroll-smooth`}>
      <body className={`${montserrat.className} min-h-screen flex flex-col bg-[#F9F9F9] text-[#1F2937] antialiased selection:bg-[#0B2553] selection:text-[#E8A300]`}>
        <PageLoader />
        <CounselingProvider>
          <main className="flex-1">{children}</main>
        </CounselingProvider>
        <Footer />
      </body>
    </html>
  );
}
