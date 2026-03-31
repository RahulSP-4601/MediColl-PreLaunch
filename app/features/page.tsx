import Navbar from "@/components/Navbar";
import Features from "@/components/sections/Features";
import Footer from "@/components/sections/Footer";

export const metadata = {
  title: "Features - MediColl24 | AI Voice Agent",
  description: "Discover the powerful features of MediColl24 AI voice agent - 24/7 availability, smart booking, multi-language support, and more.",
};

export default function FeaturesPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24">
        <Features />
      </div>
      <Footer />
    </main>
  );
}
