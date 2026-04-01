'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface WaitlistLead {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  clinic_name?: string | null;
  created_at: string;
}

export default function FounderDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [waitlistLeads, setWaitlistLeads] = useState<WaitlistLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const isAuth = sessionStorage.getItem('founder_authenticated');
    if (isAuth === 'true') {
      setAuthenticated(true);
      loadWaitlistData();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = process.env.NEXT_PUBLIC_FOUNDER_PASSWORD || 'qb24founder24';

    if (password === correctPassword) {
      setAuthenticated(true);
      sessionStorage.setItem('founder_authenticated', 'true');
      loadWaitlistData();
      setError('');
    } else {
      setError('Invalid password');
      setPassword('');
    }
  };

  const loadWaitlistData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/waitlist', { cache: 'no-store' });
      const data = await res.json();

      if (data.success) {
        // Sort by created_at DESC (newest first)
        const sortedLeads = (data.leads || []).sort((a: WaitlistLead, b: WaitlistLead) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setWaitlistLeads(sortedLeads);
        setCurrentPage(1); // Reset to first page on data load
      }
    } catch (error) {
      console.error('Error loading waitlist:', error);
    } finally {
      setLoading(false);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(waitlistLeads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLeads = waitlistLeads.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const handleRefresh = async () => {
    setLoading(true);
    await loadWaitlistData();
    setLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('founder_authenticated');
    setAuthenticated(false);
    setPassword('');
    setWaitlistLeads([]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Login screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
        >
          <h1 className="text-3xl font-bold text-darkgrey mb-6 text-center">
            🔐 Founder Dashboard
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-darkgrey mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-beige-dark rounded-lg focus:outline-none focus:border-darkgrey"
                placeholder="Enter founder password"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-red-600 text-sm font-medium">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-darkgrey text-white py-3 rounded-lg font-semibold hover:bg-darkgrey/90 transition"
            >
              Login
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Dashboard screen
  return (
    <div className="min-h-screen bg-beige p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold text-darkgrey">
              🚀 Waitlist Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-darkgrey/10 text-darkgrey rounded-lg hover:bg-darkgrey/20 transition font-medium"
            >
              Logout
            </button>
          </div>
          <p className="text-darkgrey/60">People who signed up for early access</p>
        </motion.div>

        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-8 mb-8 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-lg mb-2">Total Signups</p>
              <p className="text-6xl font-bold">{waitlistLeads.length}</p>
            </div>
            <div className="text-8xl opacity-20">✅</div>
          </div>
        </motion.div>

        {/* Refresh Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="bg-orange-500 text-white py-3 px-8 rounded-xl font-semibold hover:bg-orange-600 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '🔄 Loading...' : '🔄 Refresh Data'}
          </button>
        </motion.div>

        {/* Waitlist Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl border border-beige-dark overflow-hidden"
        >
          <div className="p-6 border-b border-beige-dark bg-green-50">
            <h2 className="text-2xl font-bold text-darkgrey">
              ✅ Waitlist Signups ({waitlistLeads.length})
              {totalPages > 1 && (
                <span className="text-base font-normal text-darkgrey/60 ml-2">
                  · Showing {startIndex + 1}-{Math.min(endIndex, waitlistLeads.length)}
                </span>
              )}
            </h2>
            <p className="text-sm text-darkgrey/60 mt-1">
              People who filled out the waitlist form on your website
            </p>
          </div>

          <div className="p-6">
            {waitlistLeads.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-darkgrey/40 text-lg">
                  No signups yet. Share your waitlist link!
                </p>
                <p className="text-darkgrey/60 text-sm mt-2">
                  Link: <span className="font-mono bg-beige px-2 py-1 rounded">
                    https://medicoll24.com
                  </span>
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-darkgrey/60 border-b-2 border-beige-dark">
                      <th className="pb-3 px-4 font-semibold">Name</th>
                      <th className="pb-3 px-4 font-semibold">Email</th>
                      <th className="pb-3 px-4 font-semibold">Phone</th>
                      <th className="pb-3 px-4 font-semibold">City</th>
                      <th className="pb-3 px-4 font-semibold">Clinic Name</th>
                      <th className="pb-3 px-4 font-semibold">Signed Up</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentLeads.map((lead, index) => (
                      <motion.tr
                        key={lead.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-beige-light hover:bg-beige-light/50 transition"
                      >
                        <td className="py-4 px-4 font-medium text-darkgrey">
                          {lead.name}
                        </td>
                        <td className="py-4 px-4">
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-blue-600 hover:underline"
                          >
                            {lead.email}
                          </a>
                        </td>
                        <td className="py-4 px-4 text-darkgrey/60">
                          {lead.phone ? (
                            <a href={`tel:${lead.phone}`} className="hover:underline">
                              {lead.phone}
                            </a>
                          ) : (
                            <span className="text-darkgrey/30">-</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-darkgrey/60">
                          {lead.city || <span className="text-darkgrey/30">-</span>}
                        </td>
                        <td className="py-4 px-4 text-darkgrey/60">
                          {lead.clinic_name || <span className="text-darkgrey/30">-</span>}
                        </td>
                        <td className="py-4 px-4 text-sm text-darkgrey/60">
                          {formatDate(lead.created_at)}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-beige-dark">
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-darkgrey text-white rounded-lg font-medium hover:bg-darkgrey/90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      ← Previous
                    </button>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`w-10 h-10 rounded-lg font-medium transition ${
                            currentPage === page
                              ? 'bg-darkgrey text-white'
                              : 'bg-beige-light text-darkgrey hover:bg-beige-dark'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-darkgrey text-white rounded-lg font-medium hover:bg-darkgrey/90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Export Button */}
        {waitlistLeads.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-center"
          >
            <button
              onClick={() => {
                const csv = [
                  ['Name', 'Email', 'Phone', 'City', 'Clinic Name', 'Signed Up'],
                  ...waitlistLeads.map(lead => [
                    lead.name,
                    lead.email,
                    lead.phone || '',
                    lead.city || '',
                    lead.clinic_name || '',
                    formatDate(lead.created_at)
                  ])
                ].map(row => row.join(',')).join('\n');

                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `waitlist-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
              }}
              className="px-6 py-3 bg-darkgrey text-white rounded-lg font-semibold hover:bg-darkgrey/90 transition"
            >
              📥 Export to CSV
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
