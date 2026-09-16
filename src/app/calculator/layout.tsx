import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EMGS & Malaysia University Fee Calculator (2026/2027) | Pakistani Students',
  description:
    'Calculate official EMGS visa fees, university upfront registration packages, statutory personal security bonds, and medical health insurance for studying in Malaysia. Compare costs in MYR, PKR & USD.',
  keywords: [
    'EMGS fee calculator',
    'Malaysia student visa cost Pakistan',
    'Malaysia university upfront fees',
    'EMGS medical insurance cost',
    'Malaysia student personal bond Pakistan',
    'Lincoln University initial fee',
    'APU upfront fee',
    'Meezab consultancy Malaysia calculator',
  ],
  openGraph: {
    title: 'EMGS & Malaysia University Fee Calculator 2026/2027',
    description:
      'Instant calculator for Pakistani students: transparent upfront university registration, statutory EMGS visa charges, medical insurance, and refundable bond.',
    url: '/calculator',
    siteName: 'Study In Malaysia By Meezab',
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EMGS & Malaysia University Fee Calculator | Study In Malaysia By Meezab',
    description: 'Calculate upfront EMGS visa fees & university registration packages with zero markup.',
  },
};

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
