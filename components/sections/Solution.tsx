"use client";

import { motion } from "framer-motion";
import { Phone, Calendar, MessageSquare, Globe } from "lucide-react";

export default function Solution() {
  const features = [
    {
      icon: Phone,
      title: "Answers calls instantly",
      description: "AI picks up in under 2 seconds, no waiting",
    },
    {
      icon: Calendar,
      title: "Books appointments",
      description: "Checks availability and schedules automatically",
    },
    {
      icon: MessageSquare,
      title: "Reschedules automatically",
      description: "Handles changes and cancellations instantly",
    },
    {
      icon: Globe,
      title: "Speaks multiple languages",
      description: "Hindi, English, and regional languages",
    },
  ];

  return (
    <section className="py-24 bg-beige">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-darkgrey mb-6 leading-tight">
              MediColl24 handles it all
            </h2>
            <p className="text-xl text-darkgrey/70 mb-10 leading-relaxed">
              Your AI receptionist that never sleeps, never takes breaks, and never misses a call.
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-darkgrey rounded-xl flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-beige" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-darkgrey mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-darkgrey/60">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-darkgrey/10">
              <div className="space-y-4">
                {/* Call Flow Visualization */}
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-darkgrey">Incoming Call</p>
                    <p className="text-sm text-darkgrey/60">+91 98765 43210</p>
                  </div>
                  <span className="text-xs text-blue-600 font-medium">9:45 AM</span>
                </div>

                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-darkgrey">AI Understanding</p>
                    <p className="text-sm text-darkgrey/60">"Book appointment for checkup"</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-darkgrey">Appointment Booked</p>
                    <p className="text-sm text-darkgrey/60">Tomorrow, 3:00 PM with Dr. Sharma</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">Done</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-darkgrey/5 rounded-xl text-center">
                <p className="text-sm text-darkgrey/60">Total time: <span className="font-bold text-darkgrey">45 seconds</span></p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
