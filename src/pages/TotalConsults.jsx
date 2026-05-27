import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../services/authService';
import { getBookingsByStudent, getBookingsByLecturer } from '../services/bookingService';

const TotalConsults = () => {
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const currentUser = getCurrentUser();

  useEffect(() => {
    const loadStats = async () => {
      if (!currentUser) return;
      try {
        let bookings = [];
        if (currentUser.role === 'student') {
          bookings = await getBookingsByStudent(currentUser.id);
        } else if (currentUser.role === 'lecturer') {
          bookings = await getBookingsByLecturer(currentUser.id);
        } else if (currentUser.role === 'admin') {
          // For admin: aggregate all bookings from all users
          // Since bookings are stored per user, we need to iterate through all users
          const allUsers = JSON.parse(localStorage.getItem('aura_users') || '[]');
          const allBookings = [];
          for (const user of allUsers) {
            const userBookings = JSON.parse(localStorage.getItem(`bookings_${user.id}`) || '[]');
            allBookings.push(...userBookings);
          }
          bookings = allBookings;
        }
        const total = bookings.length;
        const approved = bookings.filter(b => b.status === 'approved').length;
        const pending = bookings.filter(b => b.status === 'pending').length;
        const rejected = bookings.filter(b => b.status === 'rejected').length;
        setStats({ total, approved, pending, rejected });
      } catch (error) {
        console.error('Failed to load consultation stats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md border border-honey-100 text-center">
        <div className="loader-sm mx-auto"></div>
        <p className="text-gray-500 mt-2">Loading statistics...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-honey-100">
      <h1 className="text-2xl font-bold gradient-text mb-4">Total Consultations</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="p-3 bg-honey-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        <div className="p-3 bg-honey-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          <p className="text-xs text-gray-500">Approved</p>
        </div>
        <div className="p-3 bg-honey-50 rounded-lg">
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-xs text-gray-500">Pending</p>
        </div>
        <div className="p-3 bg-honey-50 rounded-lg">
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          <p className="text-xs text-gray-500">Rejected</p>
        </div>
      </div>
    </div>
  );
};

export default TotalConsults;