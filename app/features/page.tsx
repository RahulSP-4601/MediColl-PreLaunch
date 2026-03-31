"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Features from "@/components/sections/Features";
import Footer from "@/components/sections/Footer";
import { WaitlistModal } from "@/components/WaitlistModal";

export default function FeaturesPage() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  const handleJoinWaitlist = () => {
    setIsWaitlistOpen(true);
  };

  return (
    <main className="min-h-screen">
      <Navbar onJoinWaitlist={handleJoinWaitlist} />
      <div className="pt-24">
        <Features />
      </div>
      <Footer />

      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />
    </main>
  );
}
