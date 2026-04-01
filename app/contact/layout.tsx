import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | MediColl24',
  description: 'Contact MediColl24 for AI receptionist solutions for your hospital or clinic in Mumbai. Email: rahul@medicoll24.com | Phone: +91 86557 12707',
  keywords: [
    'contact MediColl24',
    'AI receptionist support',
    'hospital automation contact',
    'MediColl24 Mumbai contact',
  ],
  openGraph: {
    title: 'Contact Us | MediColl24',
    description: 'Get in touch with MediColl24 for AI receptionist solutions for hospitals and clinics.',
    url: 'https://medicoll24.com/contact',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | MediColl24',
    description: 'Get in touch for AI receptionist solutions.',
  },
  alternates: {
    canonical: 'https://medicoll24.com/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
