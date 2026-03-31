"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import { WaitlistModal } from "@/components/WaitlistModal";
import { motion } from "framer-motion";

export default function PrivacyPage() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  const handleJoinWaitlist = () => {
    setIsWaitlistOpen(true);
  };
  const sections = [
    {
      title: "1. Information We Collect",
      content: `We collect information that you provide directly to us, including:

• Personal information (name, email, phone number)
• Healthcare practice information
• Payment and billing information
• Usage data and analytics
• Communication preferences`,
    },
    {
      title: "2. How We Use Your Information",
      content: `We use the information we collect to:

• Provide and improve our AI voice agent services
• Process appointments and bookings
• Send service updates and notifications
• Respond to customer support requests
• Analyze usage patterns to enhance our platform
• Comply with legal obligations`,
    },
    {
      title: "3. Data Security",
      content: `We implement industry-standard security measures to protect your data:

• End-to-end encryption for sensitive data
• Regular security audits and penetration testing
• HIPAA-compliant infrastructure for healthcare data
• Secure data centers with 24/7 monitoring
• Access controls and authentication protocols`,
    },
    {
      title: "4. Data Sharing and Disclosure",
      content: `We do not sell your personal information. We may share data only in these cases:

• With your explicit consent
• To comply with legal obligations
• With trusted service providers under strict confidentiality agreements
• In connection with business transfers or acquisitions
• To protect our rights and prevent fraud`,
    },
    {
      title: "5. Your Rights",
      content: `You have the right to:

• Access your personal data
• Request correction of inaccurate information
• Request deletion of your data
• Opt-out of marketing communications
• Export your data in a portable format
• Withdraw consent at any time`,
    },
    {
      title: "6. Cookies and Tracking",
      content: `We use cookies and similar technologies to:

• Remember your preferences
• Analyze site traffic and usage
• Provide personalized experiences
• Ensure security and prevent fraud

You can control cookie preferences through your browser settings.`,
    },
    {
      title: "7. Data Retention",
      content: `We retain your information for as long as necessary to:

• Provide our services
• Comply with legal obligations
• Resolve disputes and enforce agreements

Healthcare-related data is retained according to applicable regulations.`,
    },
    {
      title: "8. Children's Privacy",
      content: `Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children.`,
    },
    {
      title: "9. International Data Transfers",
      content: `Your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information.`,
    },
    {
      title: "10. Changes to This Policy",
      content: `We may update this Privacy Policy from time to time. We will notify you of significant changes via email or through our platform.`,
    },
  ];

  return (
    <main className="min-h-screen">
      <Navbar onJoinWaitlist={handleJoinWaitlist} />

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
              Privacy Policy
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
                At MediColl24, we take your privacy seriously. This Privacy Policy explains how we collect,
                use, disclose, and safeguard your information when you use our AI voice agent services.
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

              {/* Contact Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mt-16 p-8 bg-beige rounded-2xl"
              >
                <h2 className="text-2xl font-bold text-darkgrey mb-4">Contact Us</h2>
                <p className="text-darkgrey/70 mb-4">
                  If you have questions about this Privacy Policy or our data practices, please contact us at:
                </p>
                <div className="space-y-2 text-darkgrey/70">
                  <p>Email: rahul@medicoll.com</p>
                  <p>Phone: +91 86557 12707</p>
                  <p>Address: Mumbai, India</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />

      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />
    </main>
  );
}
