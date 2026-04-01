import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works | MediColl24',
  description: 'Learn how MediColl24 AI receptionist works for hospitals and clinics. Simple 3-step setup for 24/7 automated appointment booking and call handling.',
  keywords: [
    'how AI receptionist works',
    'hospital automation process',
    'AI appointment booking system',
    'MediColl24 setup',
    'medical receptionist AI workflow',
  ],
  openGraph: {
    title: 'How It Works | MediColl24',
    description: 'Learn how MediColl24 AI receptionist automates appointment booking and call handling for healthcare providers.',
    url: 'https://medicoll24.com/how-it-works',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How It Works | MediColl24',
    description: 'Simple 3-step setup for 24/7 automated patient call handling.',
  },
  alternates: {
    canonical: 'https://medicoll24.com/how-it-works',
  },
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
