import { Metadata } from 'next';

export const homeMetadata: Metadata = {
  title: 'AI Receptionist for Hospitals & Clinics | MediColl24',
  description: 'Never miss a patient call with MediColl24. AI receptionist for hospitals and clinics in Mumbai. 24/7 automated appointment booking. Capture 30% more patients.',
  keywords: [
    'AI receptionist for hospitals',
    'AI receptionist for clinics',
    'medical appointment booking AI',
    'hospital call automation',
    'MediColl24',
    'healthcare automation Mumbai',
    'automated patient booking',
    '24/7 medical receptionist AI',
  ],
  openGraph: {
    title: 'AI Receptionist for Hospitals & Clinics | MediColl24',
    description: 'Never miss a patient call with MediColl24. 24/7 AI receptionist for hospitals and clinics in Mumbai.',
    url: 'https://medicoll24.com',
    siteName: 'MediColl24',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MediColl24 AI Receptionist',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Receptionist for Hospitals & Clinics | MediColl24',
    description: 'Never miss a patient call. 24/7 AI voice receptionist for healthcare.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://medicoll24.com',
  },
};
