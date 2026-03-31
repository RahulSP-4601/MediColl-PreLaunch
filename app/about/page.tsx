"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import { WaitlistModal } from "@/components/WaitlistModal";
import { motion } from "framer-motion";
import { Target, Users, Zap, Heart } from "lucide-react";

export default function AboutPage() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  const handleJoinWaitlist = () => {
    setIsWaitlistOpen(true);
  };
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To revolutionize customer service with AI that never sleeps, ensuring no patient call goes unanswered.",
    },
    {
      icon: Users,
      title: "Customer First",
      description: "We build technology that puts your patients first, making healthcare more accessible 24/7.",
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Constantly pushing boundaries in AI voice technology to deliver the best experience.",
    },
    {
      icon: Heart,
      title: "Care & Trust",
      description: "Built with healthcare in mind, maintaining the highest standards of data security and privacy.",
    },
  ];

  return (
    <main className="min-h-screen">
      <Navbar onJoinWaitlist={handleJoinWaitlist} />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-beige via-beige to-sage/20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-darkgrey mb-6">
              About MediColl24
            </h1>
            <p className="text-xl text-darkgrey/70 leading-relaxed">
              We&apos;re on a mission to transform healthcare communication with intelligent AI voice agents
              that ensure no patient call ever goes unanswered.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-beige">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-darkgrey mb-6">Our Story</h2>
              <div className="space-y-4 text-lg text-darkgrey/70 leading-relaxed">
                <p>
                  MediColl24 was born from a simple observation: healthcare providers were losing
                  patients and revenue simply because they couldn&apos;t answer every phone call. Busy reception
                  desks, after-hours calls, and overwhelming patient volumes meant missed opportunities.
                </p>
                <p>
                  We built MediColl24 to solve this problem using cutting-edge AI voice technology.
                  Our AI agent handles appointments with the warmth of a human receptionist and the
                  reliability of automation that never sleeps.
                </p>
                <p>
                  Today, we&apos;re preparing to serve hundreds of clinics and hospitals across India, helping them provide
                  better patient care while growing their practice. Every call answered is a patient served,
                  and we&apos;re proud to be making healthcare more accessible.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-beige">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-darkgrey mb-4">Our Values</h2>
            <p className="text-xl text-darkgrey/70 max-w-2xl mx-auto">
              The principles that guide everything we build
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-darkgrey/5 backdrop-blur-sm p-8 rounded-2xl border border-darkgrey/10 hover:border-darkgrey/30 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-darkgrey rounded-2xl flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-beige" />
                </div>
                <h3 className="text-xl font-semibold text-darkgrey mb-3">{value.title}</h3>
                <p className="text-darkgrey/70 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-darkgrey text-beige">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-5xl font-bold mb-2">Coming Soon</div>
              <div className="text-beige/70 text-lg">Healthcare Providers</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="text-5xl font-bold mb-2">AI-Powered</div>
              <div className="text-beige/70 text-lg">Appointment Booking</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-5xl font-bold mb-2">24/7</div>
              <div className="text-beige/70 text-lg">Always Available</div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />

      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />
    </main>
  );
}
