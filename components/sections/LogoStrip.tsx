"use client";

import { motion } from "framer-motion";

export default function LogoStrip() {
  const logos = [
    "Clinic A",
    "Hospital B",
    "Wellness C",
    "Care Plus",
    "MediCenter",
  ];

  return (
    <section className="py-20 bg-beige border-y border-darkgrey/10">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-darkgrey/50 mb-12 font-medium uppercase tracking-wider"
        >
          Trusted by clinics and healthcare teams
        </motion.p>

        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16">
          {logos.map((logo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="opacity-40 hover:opacity-70 transition-opacity"
            >
              <div className="text-xl font-bold text-darkgrey">
                {logo}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
