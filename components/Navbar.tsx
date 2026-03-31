"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Phone } from "lucide-react";

interface NavbarProps {
  onJoinWaitlist: () => void;
}

export default function Navbar({ onJoinWaitlist }: NavbarProps) {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-beige/95 backdrop-blur-sm border-b border-darkgrey/10"
    >
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <div className="h-20 md:h-24 relative w-auto flex items-center">
              <Image
                src="/logo.png"
                alt="MediColl24"
                width={320}
                height={98}
                className="h-18 md:h-22 w-auto"
              />
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-darkgrey/70 hover:text-darkgrey font-medium transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-darkgrey/70 hover:text-darkgrey font-medium transition-colors">
              How It Works
            </Link>
          </div>

          {/* CTA Button */}
          <motion.button
            onClick={onJoinWaitlist}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-darkgrey text-beige rounded-full font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            Join Waitlist
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
