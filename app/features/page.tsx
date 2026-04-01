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
      <div className="pt-32 pb-8 bg-gradient-to-br from-beige via-beige to-sage/20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-darkgrey mb-6">
              AI Receptionist Features for Hospitals & Clinics
            </h1>
            <p className="text-xl text-darkgrey/70 leading-relaxed">
              Discover how MediColl24 transforms patient communication with 24/7 automated call handling, appointment booking, and comprehensive healthcare features.
            </p>
          </div>
        </div>
      </div>
      <div>
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
