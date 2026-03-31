"use client";

import { motion } from "framer-motion";
import { PhoneOff, Users, Moon } from "lucide-react";

export default function Problem() {
  const problems = [
    {
      icon: PhoneOff,
      title: "Missed calls = lost patients",
      description: "30% of patient calls go unanswered during peak hours",
    },
    {
      icon: Users,
      title: "Busy receptionists",
      description: "Staff overwhelmed with calls, bookings, and admin work",
    },
    {
      icon: Moon,
      title: "After-hours calls lost",
      description: "Patients call outside business hours with no response",
    },
  ];

  return (
    <section className="py-24 bg-darkgrey">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-beige mb-6">
            You're losing patients every day
          </h2>
          <p className="text-xl text-beige/70 max-w-2xl mx-auto">
            Every missed call is a patient going to your competitor
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-beige/10 p-8 rounded-2xl border border-beige/10 hover:border-beige/20 transition-all duration-300 h-full">
                <div className="w-14 h-14 bg-beige/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-beige/15 transition-colors">
                  <problem.icon className="w-7 h-7 text-beige" />
                </div>
                <h3 className="text-xl font-bold text-beige mb-3">
                  {problem.title}
                </h3>
                <p className="text-beige/70 leading-relaxed">
                  {problem.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
