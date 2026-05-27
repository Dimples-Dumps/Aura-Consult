// src/pages/TotalStats.jsx
import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../services/userService';

const TotalStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalConsultations: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const users = await getAllUsers();
        const totalUsers = users.length;

        // Deduplicate bookings
        const uniqueBookings = new Map();
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('bookings_')) {
            const bookings = JSON.parse(localStorage.getItem(key) || '[]');
            for (const booking of bookings) {
              if (!uniqueBookings.has(booking.id)) {
                uniqueBookings.set(booking.id, booking);
              }
            }
          }
        }
        const allBookings = Array.from(uniqueBookings.values());
        const totalConsultations = allBookings.length;
        const pending = allBookings.filter(b => b.status === 'pending').length;
        const approved = allBookings.filter(b => b.status === 'approved').length;
        const rejected = allBookings.filter(b => b.status === 'rejected').length;

        setStats({ totalUsers, totalConsultations, pending, approved, rejected });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return <div className="text-center py-12"><div className="loader-sm mx-auto" /></div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-honey-100">
      <h1 className="text-2xl font-bold gradient-text mb-4">System Statistics</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
        <div className="p-3 bg-honey-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-800">{stats.totalUsers}</p>
          <p className="text-xs text-gray-500">Total Users</p>
        </div>
        <div className="p-3 bg-honey-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-800">{stats.totalConsultations}</p>
          <p className="text-xs text-gray-500">Total Consultations</p>
        </div>
        <div className="p-3 bg-honey-50 rounded-lg">
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-xs text-gray-500">Pending</p>
        </div>
        <div className="p-3 bg-honey-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          <p className="text-xs text-gray-500">Approved</p>
        </div>
        <div className="p-3 bg-honey-50 rounded-lg">
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          <p className="text-xs text-gray-500">Rejected</p>
        </div>
      </div>
      <p className="text-xs text-gray-400 text-center mt-4">Unique appointments across the system</p>
    </div>
  );
};

export default TotalStats;