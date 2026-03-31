"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import HowItWorks from "@/components/sections/HowItWorks";
import Footer from "@/components/sections/Footer";
import { WaitlistModal } from "@/components/WaitlistModal";

export default function HowItWorksPage() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  const handleJoinWaitlist = () => {
    setIsWaitlistOpen(true);
  };

  return (
    <main className="min-h-screen">
      <Navbar onJoinWaitlist={handleJoinWaitlist} />
      <div className="pt-24">
        <HowItWorks />
      </div>
      <Footer />

      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />
    </main>
  );
}
