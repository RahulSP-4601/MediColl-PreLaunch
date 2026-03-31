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
            <div className="h-12 relative w-auto flex items-center">
              <Image
                src="/logo.png"
                alt="MediColl24"
                width={200}
                height={62}
                className="h-12 w-auto"
              />
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-darkgrey/80 hover:text-darkgrey font-semibold text-lg transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-darkgrey/80 hover:text-darkgrey font-semibold text-lg transition-colors">
              How It Works
            </Link>
          </div>

          {/* CTA Button */}
          <motion.button
            onClick={onJoinWaitlist}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 md:px-8 py-2.5 md:py-3 bg-darkgrey text-beige rounded-full font-bold text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          >
            <Phone className="w-5 h-5" />
            Join Waitlist
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
