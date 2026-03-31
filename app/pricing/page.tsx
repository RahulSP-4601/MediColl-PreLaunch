import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";

export const metadata = {
  title: "Pricing - MediColl24 | AI Voice Agent",
  description: "Simple, transparent pricing for MediColl24. Choose the plan that fits your business needs. Start with a free trial.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-darkgrey mb-6">
              Pricing
            </h1>
            <p className="text-xl text-darkgrey/70 leading-relaxed">
              Join our waitlist to be the first to know when we launch with exclusive early bird pricing.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
