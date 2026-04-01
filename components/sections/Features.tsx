"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Phone,
  Calendar,
  MessageSquare,
  Bell,
  BarChart3,
  Globe,
} from "lucide-react";

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}

function FeatureCard({ icon: Icon, title, description, index }: FeatureCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <motion.div
        whileHover={{ y: -10 }}
        className="bg-darkgrey/5 backdrop-blur-sm p-8 rounded-2xl border border-darkgrey/10 hover:border-darkgrey/30 transition-all duration-300 h-full"
      >
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
          className="w-14 h-14 bg-darkgrey rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-lg transition-shadow"
        >
          <Icon className="w-7 h-7 text-beige" />
        </motion.div>

        <h3 className="text-2xl font-bold text-darkgrey mb-4">{title}</h3>
        <p className="text-darkgrey/70 leading-relaxed">{description}</p>
      </motion.div>
    </motion.div>
  );
}

export default function Features() {
  const features = [
    {
      icon: Phone,
      title: "Instant Patient Response",
      description:
        "Answer every patient call in under 2 seconds. No more missed calls or patients waiting on hold during emergencies.",
    },
    {
      icon: Calendar,
      title: "Smart Appointment Scheduling",
      description:
        "Automatically schedule appointments with available doctors, check insurance details, and manage multiple specializations effortlessly.",
    },
    {
      icon: MessageSquare,
      title: "HIPAA-Compliant Conversations",
      description:
        "AI receptionist trained on medical terminology that understands patient needs, handles sensitive information securely, and routes calls appropriately.",
    },
    {
      icon: Bell,
      title: "Patient & Staff Notifications",
      description:
        "Instant SMS/WhatsApp alerts for new appointments, cancellations, and reminders. Reduce no-shows by up to 40%.",
    },
    {
      icon: BarChart3,
      title: "Hospital Analytics Dashboard",
      description:
        "Track patient calls, appointment bookings, doctor availability, and patient satisfaction. Optimize your hospital operations with data.",
    },
    {
      icon: Globe,
      title: "24/7 Patient Support",
      description:
        "Never miss a patient call. MediColl24 works around the clock, handling appointment requests, general inquiries, and emergency routing.",
    },
  ];

  return (
    <section id="features" className="py-24 bg-beige">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
