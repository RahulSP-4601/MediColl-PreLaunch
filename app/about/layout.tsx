import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | MediColl24',
  description: 'MediColl24 is revolutionizing healthcare communication with AI receptionist technology. Based in Mumbai, India, we help hospitals and clinics never miss a patient call.',
  keywords: [
    'MediColl24 about',
    'AI healthcare company Mumbai',
    'medical receptionist AI company',
    'healthcare automation India',
  ],
  openGraph: {
    title: 'About Us | MediColl24',
    description: 'Revolutionizing healthcare communication with AI receptionist technology for hospitals and clinics in Mumbai.',
    url: 'https://medicoll24.com/about',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | MediColl24',
    description: 'Revolutionizing healthcare communication with AI technology.',
  },
  alternates: {
    canonical: 'https://medicoll24.com/about',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
