"use client";

import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import Image from "next/image";

interface HeroProps {
  onJoinWaitlist: () => void;
}

export default function Hero({ onJoinWaitlist }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center bg-beige overflow-hidden">
      <div className="container mx-auto px-6 py-32 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT SIDE - Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Headline */}
            <h1 className="text-6xl md:text-7xl font-bold text-darkgrey mb-6 leading-[1.1] tracking-tight">
              AI Receptionist for
              <span className="block mt-2">Hospitals & Clinics</span>
            </h1>

            {/* Subtext */}
            <p className="text-xl md:text-2xl text-darkgrey/70 mb-10 leading-relaxed max-w-xl">
              AI voice receptionist that answers every call, books appointments instantly, and works 24/7 — so you never lose a patient again.
            </p>

            {/* CTA Button */}
            <div className="mb-12">
              <motion.button
                onClick={onJoinWaitlist}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-darkgrey text-beige rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Join Waitlist
              </motion.button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-8 text-sm text-darkgrey/60">
              <div className="flex items-center gap-2">
                <span className="text-darkgrey font-semibold">✓</span>
                <span>500+ calls handled</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-darkgrey font-semibold">✓</span>
                <span>95% booking success</span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDE - Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Main Dashboard Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-darkgrey/10">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-darkgrey">Today's Activity</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-darkgrey/60">Live</span>
                </div>
              </div>

              {/* Appointment Rows */}
              <div className="space-y-4">
                {[
                  { name: "Dr. Sharma - New Patient", time: "10:30 AM", status: "Booked", color: "green" },
                  { name: "Rescheduled: Mrs. Patel", time: "2:00 PM", status: "Updated", color: "blue" },
                  { name: "Dr. Kumar - Checkup", time: "4:15 PM", status: "Confirmed", color: "green" },
                ].map((appointment, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-beige/30 rounded-xl border border-darkgrey/5"
                  >
                    <div>
                      <p className="font-medium text-darkgrey">{appointment.name}</p>
                      <p className="text-sm text-darkgrey/60">{appointment.time}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      appointment.color === 'green'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {appointment.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Floating UI Elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute -top-6 -right-6 bg-darkgrey text-beige px-6 py-4 rounded-2xl shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5" />
                <div>
                  <p className="text-xs opacity-80">Call handled in</p>
                  <p className="font-bold text-lg">45 sec</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-white px-6 py-4 rounded-2xl shadow-2xl border border-darkgrey/10"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-darkgrey">Appointment confirmed</p>
                  <p className="text-xs text-darkgrey/60">Mrs. Singh, 3:00 PM</p>
                </div>
              </div>
            </motion.div>

            {/* Chat Bubble */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute top-1/2 -left-12 bg-white px-5 py-3 rounded-2xl shadow-xl border border-darkgrey/10 max-w-xs"
            >
              <p className="text-sm text-darkgrey/80">"I'd like to book an appointment..."</p>
              <p className="text-xs text-darkgrey/50 mt-1">Patient call at 9:45 AM</p>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
