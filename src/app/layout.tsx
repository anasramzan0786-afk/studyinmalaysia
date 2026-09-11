import type { Metadata } from 'next';
import './globals.css';
import { CounselingProvider } from '@/components/CounselingContext';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Study in Malaysia | Official Degree Admissions & EMGS Visa Calculator',
  description:
    'Comprehensive Malaysian higher education directory, verified university fee structures, upfront payments, and EMGS visa cost calculator for Pakistani students by Meezab Future Consulting.',
  keywords: [
    'Study in Malaysia',
    'Malaysia University fees for Pakistani students',
    'EMGS visa calculator',
    'Lincoln University College fee structure',
    'APU Malaysia admissions',
    'Meezab consultancy',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-blue-900 selection:text-white">
        <CounselingProvider>
          <main className="flex-1">{children}</main>
        </CounselingProvider>
        <Footer />
      </body>
    </html>
  );
}

