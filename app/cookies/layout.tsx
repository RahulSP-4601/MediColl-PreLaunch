import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | MediColl24',
  description: 'MediColl24 cookie policy. Learn how we use cookies and tracking technologies on our AI receptionist platform.',
  keywords: [
    'MediColl24 cookies',
    'cookie policy',
    'website cookies',
  ],
  openGraph: {
    title: 'Cookie Policy | MediColl24',
    description: 'Learn how we use cookies and tracking technologies on our platform.',
    url: 'https://medicoll24.com/cookies',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Cookie Policy | MediColl24',
  },
  alternates: {
    canonical: 'https://medicoll24.com/cookies',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CookiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
