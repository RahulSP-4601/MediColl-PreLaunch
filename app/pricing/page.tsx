"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import { WaitlistModal } from "@/components/WaitlistModal";

export default function PricingPage() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  const handleJoinWaitlist = () => {
    setIsWaitlistOpen(true);
  };

  return (
    <main className="min-h-screen">
      <Navbar onJoinWaitlist={handleJoinWaitlist} />
      <div className="pt-24">
        <div className="container mx-auto px-6 py-20 bg-gradient-to-br from-beige via-beige to-sage/20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-darkgrey mb-6">
              AI Receptionist Pricing for Hospitals & Clinics
            </h1>
            <p className="text-xl text-darkgrey/70 leading-relaxed">
              Join our waitlist to be the first to know when we launch with exclusive early bird pricing. Affordable automation for medical practices in Mumbai.
            </p>
          </div>
        </div>
      </div>
      <Footer />

      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />
    </main>
  );
}
