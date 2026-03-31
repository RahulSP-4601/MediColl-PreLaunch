import type { Metadata } from 'next';
import './globals.css';
import GoogleAnalytics from '@/components/GoogleAnalytics';

export const metadata: Metadata = {
  title: 'AI Receptionist for Clinics & Hospitals | MediColl24 - Never Miss a Patient Call',
  description: 'AI voice receptionist that answers every call, books appointments 24/7, and captures 30% more patients automatically. Perfect for clinics and hospitals.',
  keywords: [
    'AI receptionist for clinics',
    'hospital appointment booking system',
    'medical receptionist AI',
    'clinic missed call solution',
    'automated appointment booking',
    '24/7 clinic receptionist',
    'healthcare voice AI',
    'patient call handling',
  ],
  authors: [{ name: 'MediColl24' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.medicoll24.com',
    siteName: 'MediColl24',
    title: 'AI Receptionist for Clinics & Hospitals | Never Miss a Patient Call',
    description: 'AI voice receptionist that answers every call, books appointments 24/7, and captures 30% more patients automatically.',
    images: [
      {
        url: 'https://www.medicoll24.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MediColl24 AI Receptionist',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Receptionist for Clinics & Hospitals | MediColl24',
    description: 'Never miss a patient call again. AI voice receptionist that books appointments 24/7.',
    images: ['https://www.medicoll24.com/og-image.jpg'],
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
  verification: {
    google: 'your-google-verification-code-here',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://www.medicoll24.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'MediColl24',
              applicationCategory: 'BusinessApplication',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              description: 'AI voice receptionist for clinics and hospitals that handles calls, books appointments, and works 24/7',
              operatingSystem: 'Web',
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                ratingCount: '50',
              },
            }),
          }}
        />
      </head>
      <body>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
