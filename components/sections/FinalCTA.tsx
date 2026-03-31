"use client";

import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";

interface FinalCTAProps {
  onJoinWaitlist: () => void;
}

export default function FinalCTA({ onJoinWaitlist }: FinalCTAProps) {
  return (
    <section className="py-32 bg-darkgrey relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-8"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-beige">Launching mid-May 2025</span>
          </motion.div>

          {/* Headline */}
          <h2 className="text-5xl md:text-6xl font-bold text-beige mb-6 leading-tight">
            Never miss a patient
            <span className="block mt-2">call again</span>
          </h2>

          {/* Subtext */}
          <p className="text-xl text-beige/70 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join the waitlist and be among the first clinics to capture 30% more patients automatically.
          </p>

          {/* CTA Button */}
          <motion.button
            onClick={onJoinWaitlist}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-10 py-5 bg-beige text-darkgrey rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 group"
          >
            <Phone className="w-6 h-6" />
            Join Waitlist
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          {/* Trust Line */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-beige/50 text-sm"
          >
            Free for beta users · No credit card required · Cancel anytime
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
