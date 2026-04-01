import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | MediColl24',
  description: 'MediColl24 terms of service. Legal terms and conditions for using our AI receptionist platform for hospitals and clinics.',
  keywords: [
    'MediColl24 terms',
    'AI receptionist terms of service',
    'healthcare AI legal terms',
  ],
  openGraph: {
    title: 'Terms of Service | MediColl24',
    description: 'Legal terms and conditions for using MediColl24 AI receptionist platform.',
    url: 'https://medicoll24.com/terms',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Terms of Service | MediColl24',
  },
  alternates: {
    canonical: 'https://medicoll24.com/terms',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
