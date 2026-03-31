"use client";

import { motion } from "framer-motion";
import { Phone, Brain, CheckCircle } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      icon: Phone,
      title: "Patient calls",
      description: "Your patient dials your clinic number",
    },
    {
      number: "2",
      icon: Brain,
      title: "AI answers & understands",
      description: "MediColl24 picks up instantly, understands the request in Hindi or English",
    },
    {
      number: "3",
      icon: CheckCircle,
      title: "Appointment booked",
      description: "Patient gets confirmation SMS, appointment added to your calendar",
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
            How it works
          </h2>
          <p className="text-xl text-beige/70 max-w-2xl mx-auto">
            From call to confirmed appointment in seconds
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
          {/* Connecting Lines */}
          <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-beige/20"></div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              {/* Step Number Circle */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-beige rounded-full flex items-center justify-center text-2xl font-bold text-darkgrey shadow-lg">
                    {step.number}
                  </div>
                  <div className="absolute inset-0 bg-beige rounded-full animate-ping opacity-20"></div>
                </div>
              </div>

              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-14 h-14 bg-beige/10 rounded-xl flex items-center justify-center">
                  <step.icon className="w-7 h-7 text-beige" />
                </div>
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-beige mb-3">
                  {step.title}
                </h3>
                <p className="text-beige/70 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Time Indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-beige/10 rounded-full">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-beige font-medium">
              Average booking time: <span className="font-bold">45 seconds</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
