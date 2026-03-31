import Navbar from "@/components/Navbar";
import HowItWorks from "@/components/sections/HowItWorks";
import Footer from "@/components/sections/Footer";

export const metadata = {
  title: "How It Works - MediColl24 | AI Voice Agent",
  description: "Learn how MediColl24 AI voice agent works - from setup to automated bookings in minutes.",
};

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24">
        <HowItWorks />
      </div>
      <Footer />
    </main>
  );
}
