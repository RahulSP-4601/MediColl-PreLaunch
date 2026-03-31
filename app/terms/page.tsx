"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import { motion } from "framer-motion";

export default function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: `By accessing and using MediColl24's services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.`,
    },
    {
      title: "2. Description of Service",
      content: `MediColl24 provides an AI-powered voice agent platform for healthcare providers to automate appointment booking and patient communication. Our service includes:

• 24/7 AI voice receptionist
• Automated appointment scheduling
• Calendar management
• SMS notifications
• Analytics and reporting`,
    },
    {
      title: "3. Account Registration",
      content: `To use our services, you must:

• Provide accurate and complete information
• Maintain the security of your account credentials
• Notify us immediately of unauthorized access
• Be at least 18 years old or have legal guardian consent
• Have the authority to enter into this agreement on behalf of your organization`,
    },
    {
      title: "4. User Responsibilities",
      content: `You agree to:

• Use the service only for lawful purposes
• Not attempt to breach security or authentication measures
• Not interfere with the proper functioning of the service
• Comply with all applicable healthcare regulations (HIPAA, etc.)
• Maintain accurate patient and practice information
• Respect intellectual property rights`,
    },
    {
      title: "5. Payment Terms",
      content: `• Subscription fees are billed according to your chosen plan
• Payment is due at the beginning of each billing cycle
• All fees are non-refundable except as required by law
• We reserve the right to change pricing with 30 days notice
• Failure to pay may result in service suspension`,
    },
    {
      title: "6. Service Availability",
      content: `While we strive for 99.9% uptime, we cannot guarantee uninterrupted service. We are not liable for:

• Scheduled maintenance windows
• Force majeure events
• Third-party service disruptions
• Internet connectivity issues
• Temporary service interruptions`,
    },
    {
      title: "7. Data and Privacy",
      content: `• We collect and process data as described in our Privacy Policy
• You retain ownership of your data
• We use industry-standard security measures
• Healthcare data is handled in compliance with HIPAA
• You are responsible for backing up critical data`,
    },
    {
      title: "8. Intellectual Property",
      content: `• MediColl24 retains all rights to our platform, software, and trademarks
• You may not copy, modify, or reverse engineer our service
• You grant us a license to use your data to provide the service
• Any feedback you provide may be used to improve our service`,
    },
    {
      title: "9. Limitation of Liability",
      content: `To the maximum extent permitted by law:

• Our liability is limited to the fees paid in the 12 months prior to the claim
• We are not liable for indirect, incidental, or consequential damages
• We do not guarantee specific results or outcomes
• You use the service at your own risk`,
    },
    {
      title: "10. Indemnification",
      content: `You agree to indemnify and hold MediColl24 harmless from claims arising from:

• Your use of the service
• Your violation of these terms
• Your violation of any third-party rights
• Your violation of applicable laws or regulations`,
    },
    {
      title: "11. Termination",
      content: `• Either party may terminate the agreement with 30 days notice
• We may suspend or terminate service immediately for violations
• Upon termination, your access to the service will cease
• You may export your data before termination
• Certain provisions survive termination`,
    },
    {
      title: "12. Changes to Terms",
      content: `We may update these Terms of Service from time to time. We will notify you of material changes via email or through our platform. Continued use after changes constitutes acceptance.`,
    },
    {
      title: "13. Governing Law",
      content: `These terms are governed by the laws of India. Any disputes shall be resolved in the courts of Mumbai, India.`,
    },
    {
      title: "14. Contact Information",
      content: `For questions about these Terms of Service, contact us at:

Email: rahul@medicoll.com
Phone: +91 86557 12707
Address: Mumbai, India`,
    },
  ];

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-beige via-beige to-sage/20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-darkgrey mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-darkgrey/70 leading-relaxed">
              Last updated: March 31, 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-beige">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="prose prose-lg max-w-none"
            >
              <p className="text-lg text-darkgrey/70 mb-12">
                Please read these Terms of Service carefully before using MediColl24. These terms govern
                your access to and use of our services.
              </p>

              <div className="space-y-12">
                {sections.map((section, index) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                  >
                    <h2 className="text-2xl font-bold text-darkgrey mb-4">{section.title}</h2>
                    <p className="text-darkgrey/70 whitespace-pre-line leading-relaxed">
                      {section.content}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Acknowledgment */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mt-16 p-8 bg-beige rounded-2xl"
              >
                <h2 className="text-2xl font-bold text-darkgrey mb-4">Acknowledgment</h2>
                <p className="text-darkgrey/70">
                  By using MediColl24, you acknowledge that you have read, understood, and agree to be bound
                  by these Terms of Service and our Privacy Policy.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
