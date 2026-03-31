"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-beige border-t border-darkgrey/10">
      <div className="container mx-auto px-6 py-16">
        <div className="mb-12">
          {/* Brand Column */}
          <div>
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
                AI-powered receptionist for hospitals that answers patient calls instantly, schedules appointments 24/7, and reduces no-shows by 40%.
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
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pt-8 border-t border-darkgrey/10 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-darkgrey/60 text-sm">
            © 2025 MediColl24. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
