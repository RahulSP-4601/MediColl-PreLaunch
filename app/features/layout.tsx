import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Receptionist Features | MediColl24',
  description: '24/7 call handling, automated appointment booking, calendar sync, and patient notifications. Discover all MediColl24 AI receptionist features for hospitals and clinics in Mumbai.',
  keywords: [
    'AI receptionist features',
    'automated appointment booking',
    'hospital call automation features',
    'medical receptionist AI capabilities',
    '24/7 patient call handling',
    'clinic automation features',
  ],
  openGraph: {
    title: 'AI Receptionist Features | MediColl24',
    description: '24/7 call handling, automated appointment booking, and more features for hospitals and clinics.',
    url: 'https://medicoll24.com/features',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Receptionist Features | MediColl24',
    description: '24/7 call handling, automated appointment booking for healthcare providers.',
  },
  alternates: {
    canonical: 'https://medicoll24.com/features',
  },
};

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
