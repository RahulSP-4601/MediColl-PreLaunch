import type { Metadata } from 'next';
import './globals.css';
import GoogleAnalytics from '@/components/GoogleAnalytics';

export const metadata: Metadata = {
  metadataBase: new URL('https://medicoll24.com'),
  title: {
    default: 'AI Receptionist for Hospitals & Clinics | MediColl24',
    template: '%s | MediColl24',
  },
  description: 'AI receptionist for hospitals and clinics in Mumbai. Never miss a patient call with 24/7 automated appointment booking. Capture 30% more patients with MediColl24.',
  keywords: [
    'AI receptionist for hospitals',
    'AI receptionist for clinics',
    'medical appointment booking AI',
    'hospital call automation',
    'MediColl24',
    'AI voice receptionist',
    'healthcare automation Mumbai',
    'automated appointment booking',
    '24/7 medical receptionist',
    'clinic patient booking system',
    'hospital phone answering service',
    'medical practice automation India',
  ],
  authors: [{ name: 'MediColl24', url: 'https://medicoll24.com' }],
  creator: 'MediColl24',
  publisher: 'MediColl24',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://medicoll24.com',
    siteName: 'MediColl24',
    title: 'AI Receptionist for Hospitals & Clinics | MediColl24',
    description: 'AI receptionist for hospitals and clinics in Mumbai. Never miss a patient call with 24/7 automated appointment booking.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MediColl24 - AI Receptionist for Healthcare',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Receptionist for Hospitals & Clinics | MediColl24',
    description: 'Never miss a patient call. AI voice receptionist that books appointments 24/7 for hospitals and clinics.',
    images: ['/og-image.jpg'],
    creator: '@medicoll24',
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
  alternates: {
    canonical: 'https://medicoll24.com',
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
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MediColl24',
    url: 'https://medicoll24.com',
    logo: 'https://medicoll24.com/logo.png',
    description: 'AI receptionist for hospitals and clinics. 24/7 automated appointment booking and call handling for healthcare providers.',
    foundingDate: '2026',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-86557-12707',
      contactType: 'Customer Service',
      email: 'rahul@medicoll.com',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi'],
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Mumbai',
      addressCountry: 'IN',
    },
    sameAs: [
      'https://www.linkedin.com/company/medicoll24',
      'https://twitter.com/medicoll24',
    ],
  };

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'MediColl24 AI Receptionist',
    description: 'AI-powered voice receptionist for hospitals and clinics. Automates appointment booking, handles patient calls 24/7, and captures more patients.',
    brand: {
      '@type': 'Brand',
      name: 'MediColl24',
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/PreOrder',
      priceCurrency: 'INR',
      url: 'https://medicoll24.com',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '10',
    },
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Medical Appointment Booking AI',
    provider: {
      '@type': 'Organization',
      name: 'MediColl24',
      url: 'https://medicoll24.com',
    },
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'AI Receptionist Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '24/7 AI Call Handling',
            description: 'Automated phone answering and patient call management',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Appointment Booking',
            description: 'AI-powered appointment scheduling and calendar management',
          },
        },
      ],
    },
  };

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2C3E50" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(serviceSchema),
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
