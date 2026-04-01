"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import { WaitlistModal } from "@/components/WaitlistModal";
import { motion } from "framer-motion";

export default function CookiesPage() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  const handleJoinWaitlist = () => {
    setIsWaitlistOpen(true);
  };
  const cookieTypes = [
    {
      title: "Essential Cookies",
      description: "Required for the website to function properly. Cannot be disabled.",
      examples: [
        "Authentication and security",
        "Session management",
        "Load balancing",
        "Form submissions",
      ],
    },
    {
      title: "Performance Cookies",
      description: "Help us understand how visitors interact with our website.",
      examples: [
        "Page views and traffic sources",
        "Error tracking",
        "Loading times",
        "Popular features",
      ],
    },
    {
      title: "Functional Cookies",
      description: "Enable enhanced functionality and personalization.",
      examples: [
        "Language preferences",
        "Region selection",
        "User interface customization",
        "Chat widget state",
      ],
    },
    {
      title: "Marketing Cookies",
      description: "Track your activity to deliver relevant advertisements.",
      examples: [
        "Ad targeting and retargeting",
        "Campaign effectiveness",
        "Social media integration",
        "Third-party analytics",
      ],
    },
  ];

  const sections = [
    {
      title: "What Are Cookies?",
      content: `Cookies are small text files that are placed on your device when you visit a website. They help websites remember your actions and preferences over time, so you don't have to keep re-entering information whenever you return to a site or browse from one page to another.`,
    },
    {
      title: "How We Use Cookies",
      content: `MediColl24 uses cookies to:

• Keep you signed in to your account
• Remember your preferences and settings
• Understand how you use our platform
• Improve our services and user experience
• Deliver personalized content
• Analyze traffic and usage patterns
• Ensure security and prevent fraud`,
    },
    {
      title: "Third-Party Cookies",
      content: `We may use third-party services that set their own cookies, including:

• Google Analytics for website analytics
• Stripe for payment processing
• Intercom for customer support
• Social media platforms for sharing functionality

These third parties have their own privacy policies and cookie policies.`,
    },
    {
      title: "Managing Cookies",
      content: `You can control and manage cookies in several ways:

Browser Settings: Most browsers allow you to:
• View and delete cookies
• Block cookies from specific websites
• Block all cookies
• Clear cookies when you close the browser

Note: Blocking essential cookies may prevent you from using certain features of our service.

Cookie Preferences: You can update your cookie preferences in your account settings or using the cookie banner when you first visit our site.`,
    },
    {
      title: "Cookie Duration",
      content: `Session Cookies: Temporary cookies that are deleted when you close your browser.

Persistent Cookies: Remain on your device for a set period or until you delete them. We use persistent cookies for:
• Keeping you logged in
• Remembering your preferences
• Analytics and performance tracking

Most of our persistent cookies expire within 1 year.`,
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
              Cookie Policy
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
            >
              <p className="text-lg text-darkgrey/70 mb-12">
                This Cookie Policy explains how MediColl24 uses cookies and similar tracking technologies
                on our website and services.
              </p>
            </motion.div>

            {/* Main Sections */}
            <div className="space-y-12 mb-16">
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

            {/* Cookie Types */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold text-darkgrey mb-8">Types of Cookies We Use</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {cookieTypes.map((type, index) => (
                  <motion.div
                    key={type.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-beige p-6 rounded-2xl"
                  >
                    <h3 className="text-xl font-bold text-darkgrey mb-3">{type.title}</h3>
                    <p className="text-darkgrey/70 mb-4">{type.description}</p>
                    <ul className="space-y-2">
                      {type.examples.map((example) => (
                        <li key={example} className="text-darkgrey/60 flex items-start">
                          <span className="mr-2">•</span>
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 bg-beige rounded-2xl"
            >
              <h2 className="text-2xl font-bold text-darkgrey mb-4">Questions About Cookies?</h2>
              <p className="text-darkgrey/70 mb-4">
                If you have questions about our use of cookies, please contact us at:
              </p>
              <div className="space-y-2 text-darkgrey/70">
                <p>Email: rahul@medicoll24.com</p>
                <p>Phone: +91 86557 12707</p>
              </div>
            </motion.div>

            {/* Browser Help Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-12 p-6 bg-darkgrey/5 backdrop-blur-sm border border-darkgrey/10 rounded-2xl"
            >
              <h3 className="text-xl font-bold text-darkgrey mb-4">
                Browser-Specific Cookie Management
              </h3>
              <p className="text-darkgrey/70 mb-4">
                For instructions on managing cookies in your browser:
              </p>
              <ul className="space-y-2 text-darkgrey/60">
                <li>• Chrome: Settings → Privacy and Security → Cookies</li>
                <li>• Firefox: Settings → Privacy & Security → Cookies</li>
                <li>• Safari: Preferences → Privacy → Cookies</li>
                <li>• Edge: Settings → Privacy → Cookies</li>
              </ul>
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
