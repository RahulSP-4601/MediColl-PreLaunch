import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing Plans | MediColl24',
  description: 'Affordable AI receptionist pricing for hospitals and clinics. Join the waitlist for exclusive early bird pricing. MediColl24 - Never miss a patient call.',
  keywords: [
    'AI receptionist pricing',
    'hospital automation pricing',
    'clinic receptionist cost',
    'medical appointment booking pricing',
    'MediColl24 pricing',
  ],
  openGraph: {
    title: 'Pricing Plans | MediColl24',
    description: 'Affordable AI receptionist pricing for hospitals and clinics. Join the waitlist for early bird pricing.',
    url: 'https://medicoll24.com/pricing',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing Plans | MediColl24',
    description: 'Affordable AI receptionist pricing for healthcare providers.',
  },
  alternates: {
    canonical: 'https://medicoll24.com/pricing',
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
