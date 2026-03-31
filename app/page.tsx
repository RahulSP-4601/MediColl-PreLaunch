'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/sections/Hero';
import Problem from '@/components/sections/Problem';
import Solution from '@/components/sections/Solution';
import HowItWorks from '@/components/sections/HowItWorks';
import ProductPreview from '@/components/sections/ProductPreview';
import Stats from '@/components/sections/Stats';
import Footer from '@/components/sections/Footer';
import { WaitlistModal } from '@/components/WaitlistModal';

export default function Home() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  const handleJoinWaitlist = () => {
    setIsWaitlistOpen(true);
  };

  return (
    <div className="min-h-screen bg-beige">
      <Navbar onJoinWaitlist={handleJoinWaitlist} />
      <Hero onJoinWaitlist={handleJoinWaitlist} />
      <Problem />
      <Solution />
      <HowItWorks />
      <ProductPreview />
      <Stats />
      <Footer />

      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />
    </div>
  );
}
