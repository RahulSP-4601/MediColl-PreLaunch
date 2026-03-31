"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface StatItemProps {
  value: string;
  label: string;
  delay: number;
}

function StatItem({ value, label, delay }: StatItemProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay }}
      className="text-center"
    >
      <div className="text-5xl md:text-6xl font-bold text-white mb-3">
        {value}
      </div>
      <div className="text-base text-white/60">{label}</div>
    </motion.div>
  );
}

export default function Stats() {
  const stats = [
    { value: "2s", label: "Response Time" },
    { value: "24/7", label: "Always Available" },
    { value: "99%", label: "Booking Accuracy" },
    { value: "30%", label: "Revenue Increase" },
  ];

  return (
    <section className="py-20 bg-darkgrey">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Results That Speak
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div key={index}>
              <StatItem {...stat} delay={index * 0.1} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
