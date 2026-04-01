import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | MediColl24',
  description: 'MediColl24 privacy policy. Learn how we protect your healthcare data with HIPAA-compliant security. AI receptionist privacy for hospitals and clinics.',
  keywords: [
    'MediColl24 privacy policy',
    'healthcare data privacy',
    'HIPAA compliant AI',
    'medical data security',
  ],
  openGraph: {
    title: 'Privacy Policy | MediColl24',
    description: 'Learn how we protect your healthcare data with HIPAA-compliant security.',
    url: 'https://medicoll24.com/privacy',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy | MediColl24',
  },
  alternates: {
    canonical: 'https://medicoll24.com/privacy',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
