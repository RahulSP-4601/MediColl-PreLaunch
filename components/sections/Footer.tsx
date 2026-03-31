"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const links = {
    product: [
      { name: "Features", href: "/features" },
      { name: "Pricing", href: "/pricing" },
      { name: "How it Works", href: "/how-it-works" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
    ],
  };

  return (
    <footer className="bg-beige border-t border-darkgrey/10">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/" className="inline-block mb-4">
                <Image
                  src="/logo.png"
                  alt="MediColl24"
                  width={320}
                  height={98}
                  className="h-18 md:h-22 w-auto"
                />
              </Link>
              <p className="text-darkgrey/70 mb-6 max-w-sm">
                The AI voice agent that never misses a call. Transform your customer
                service and grow your business with intelligent automation.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-darkgrey/70">
                  <Mail className="w-5 h-5" />
                  <a href="mailto:rahul@medicoll.com" className="hover:text-darkgrey transition-colors">
                    rahul@medicoll.com
                  </a>
                </div>
                <div className="flex items-center gap-3 text-darkgrey/70">
                  <Phone className="w-5 h-5" />
                  <a href="tel:+918655712707" className="hover:text-darkgrey transition-colors">
                    +91 86557 12707
                  </a>
                </div>
                <div className="flex items-center gap-3 text-darkgrey/70">
                  <MapPin className="w-5 h-5" />
                  <span>Mumbai, India</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Product Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold text-darkgrey mb-4">Product</h4>
            <ul className="space-y-3">
              {links.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-darkgrey/70 hover:text-darkgrey transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold text-darkgrey mb-4">Company</h4>
            <ul className="space-y-3">
              {links.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-darkgrey/70 hover:text-darkgrey transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold text-darkgrey mb-4">Legal</h4>
            <ul className="space-y-3">
              {links.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-darkgrey/70 hover:text-darkgrey transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pt-8 border-t border-darkgrey/10"
        >
          <p className="text-darkgrey/60 text-sm text-center md:text-left">
            © 2025 MediColl24. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
