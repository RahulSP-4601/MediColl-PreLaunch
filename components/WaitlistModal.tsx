'use client';

import { useState } from 'react';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    clinicName: '',
    city: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Call the waitlist endpoint
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
          setFormData({
            name: '',
            email: '',
            phone: '',
            clinicName: '',
            city: '',
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting waitlist:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-darkgrey/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-beige rounded-3xl border border-darkgrey/20 shadow-2xl shadow-darkgrey/50 animate-slide-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-darkgrey/60 hover:text-darkgrey transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="p-8">
          {!isSuccess ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2 text-darkgrey">
                  Join the Waitlist
                </h2>
                <p className="text-darkgrey/70">
                  Get early access to MediColl24
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-darkgrey mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-darkgrey/5 border border-darkgrey/20 rounded-xl text-darkgrey placeholder-darkgrey/50 focus:outline-none focus:border-darkgrey/40 transition-colors"
                    placeholder="Dr. Your Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-darkgrey mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-darkgrey/5 border border-darkgrey/20 rounded-xl text-darkgrey placeholder-darkgrey/50 focus:outline-none focus:border-darkgrey/40 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-darkgrey mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-darkgrey/5 border border-darkgrey/20 rounded-xl text-darkgrey placeholder-darkgrey/50 focus:outline-none focus:border-darkgrey/40 transition-colors"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-darkgrey mb-2">
                    Clinic/Hospital Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.clinicName}
                    onChange={(e) =>
                      setFormData({ ...formData, clinicName: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-darkgrey/5 border border-darkgrey/20 rounded-xl text-darkgrey placeholder-darkgrey/50 focus:outline-none focus:border-darkgrey/40 transition-colors"
                    placeholder="Your Clinic/Hospital Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-darkgrey mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-darkgrey/5 border border-darkgrey/20 rounded-xl text-darkgrey placeholder-darkgrey/50 focus:outline-none focus:border-darkgrey/40 transition-colors"
                    placeholder="Mumbai"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-4 bg-darkgrey text-beige rounded-xl font-semibold hover:bg-darkgrey-light transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-3"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Joining...
                    </span>
                  ) : (
                    'Join Waitlist'
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-darkgrey/60 mt-6">
                🚀 Launching mid-May 2026 · Limited spots available
              </p>
            </>
          ) : (
            <div className="text-center py-8 animate-fade-in">
              <div className="w-20 h-20 bg-darkgrey rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-beige"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-darkgrey mb-2">
                Welcome to MediColl24! 🎉
              </h3>
              <p className="text-darkgrey/70">
                You are on the waitlist. We will notify you when we launch!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
