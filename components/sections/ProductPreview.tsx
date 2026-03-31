"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Calendar, Clock, Users, TrendingUp, Phone } from "lucide-react";

// Realistic dummy data
const appointments = [
  {
    id: 1,
    patientName: "Priya Sharma",
    initials: "PS",
    phone: "9821456789",
    service: "Routine Check-up",
    duration: "30 minutes",
    date: "Apr 2, 2026",
    time: "10:30 AM",
    status: "confirmed",
  },
  {
    id: 2,
    patientName: "Amit Patel",
    initials: "AP",
    phone: "9876543210",
    service: "Follow-up Visit",
    duration: "30 minutes",
    date: "Apr 2, 2026",
    time: "2:00 PM",
    status: "confirmed",
  },
  {
    id: 3,
    patientName: "Neha Desai",
    initials: "ND",
    phone: "9123456789",
    service: "Specialist Consultation",
    duration: "45 minutes",
    date: "Apr 3, 2026",
    time: "11:00 AM",
    status: "confirmed",
  },
  {
    id: 4,
    patientName: "Rajesh Kumar",
    initials: "RK",
    phone: "9234567890",
    service: "Dental Cleaning",
    duration: "30 minutes",
    date: "Apr 3, 2026",
    time: "3:30 PM",
    status: "pending",
  },
];

export default function ProductPreview() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "bookings">("dashboard");

  return (
    <section className="py-24 bg-beige">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-darkgrey mb-6">
            Your clinic/hospital dashboard, simplified
          </h2>
          <p className="text-xl text-darkgrey/60 max-w-2xl mx-auto">
            See real-time appointments, stats, and call logs in one place
          </p>
        </motion.div>

        {/* Dashboard/Bookings Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-2xl border border-darkgrey/10 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Doctor <span className="text-blue-600">Dashboard</span>
                </h3>
                <p className="text-sm text-gray-500 mt-1">Member of Andheri Hospital</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
                    activeTab === "dashboard"
                      ? "bg-gray-900 text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Today's Appointments
                </button>
                <button className="p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Dashboard View */}
            {activeTab === "dashboard" && (
              <>
                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">24</p>
                    <p className="text-sm text-gray-500">TOTAL BOOKINGS</p>
                    <p className="text-xs text-gray-400 mt-1">All time</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">4</p>
                    <p className="text-sm text-gray-500">TODAY</p>
                    <p className="text-xs text-gray-400 mt-1">Appointments today</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">18</p>
                    <p className="text-sm text-gray-500">THIS MONTH</p>
                    <p className="text-xs text-gray-400 mt-1">Total this month</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">92%</p>
                    <p className="text-sm text-gray-500">SUCCESS RATE</p>
                    <p className="text-xs text-green-600 mt-1">Confirmed appointments</p>
                  </motion.div>
                </div>

                {/* Bookings List Preview */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">Recent Bookings</h4>
                    <button
                      onClick={() => setActiveTab("bookings")}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {appointments.slice(0, 3).map((apt, index) => (
                      <motion.div
                        key={apt.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="px-6 py-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center text-white font-semibold">
                            {apt.initials}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-gray-900">{apt.patientName}</p>
                              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                                Confirmed
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Phone className="w-3.5 h-3.5" />
                                {apt.phone}
                              </span>
                              <span>•</span>
                              <span>{apt.service}</span>
                              <span>•</span>
                              <span>{apt.duration}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{apt.date}</p>
                            <p className="text-sm text-gray-500">{apt.time}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}

            {/* Bookings List View */}
            {activeTab === "bookings" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900">Bookings</h3>
                  <p className="text-sm text-gray-500 mt-1">Manage all your appointments</p>
                </div>

                {/* Table Header */}
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                  <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-600 uppercase">
                    <div className="col-span-3">Customer</div>
                    <div className="col-span-2">Contact</div>
                    <div className="col-span-3">Service</div>
                    <div className="col-span-2">Date & Time</div>
                    <div className="col-span-2">Status</div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-100">
                  {appointments.map((apt, index) => (
                    <motion.div
                      key={apt.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-3 flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
                            {apt.initials}
                          </div>
                          <span className="font-medium text-gray-900">{apt.patientName}</span>
                        </div>
                        <div className="col-span-2">
                          <div className="flex items-center gap-1.5 text-sm text-blue-600">
                            <Phone className="w-3.5 h-3.5" />
                            <span>{apt.phone}</span>
                          </div>
                        </div>
                        <div className="col-span-3">
                          <p className="font-medium text-gray-900 text-sm">{apt.service}</p>
                          <p className="text-xs text-gray-500">{apt.duration}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="font-medium text-gray-900 text-sm">{apt.date}</p>
                          <p className="text-xs text-gray-500">{apt.time}</p>
                        </div>
                        <div className="col-span-2">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              apt.status === "confirmed"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {apt.status === "confirmed" ? "Confirmed" : "Pending"}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
