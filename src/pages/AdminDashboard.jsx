import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, Edit, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from '../services/userService';

const AdminDashboard = ({ adminId }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalConsultations: 0,
    pendingActions: 0,
    studentsCount: 0,
    lecturersCount: 0,
    adminsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      const allUsers = await getAllUsers();
      const students = allUsers.filter(u => u.role === 'student').length;
      const lecturers = allUsers.filter(u => u.role === 'lecturer').length;
      const admins = allUsers.filter(u => u.role === 'admin').length;
      const totalUsers = allUsers.length;

      // Deduplicate bookings by ID
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
      const pendingActions = allBookings.filter(b => b.status === 'pending').length;

      setStats({
        totalUsers,
        totalConsultations,
        pendingActions,
        studentsCount: students,
        lecturersCount: lecturers,
        adminsCount: admins,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();

    // Listen for localStorage changes (from other tabs/windows)
    const handleStorageChange = (e) => {
      if (e.key === 'aura_users' || (e.key && e.key.startsWith('bookings_'))) {
        loadStats();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom events (same tab)
    const handleCustomUpdate = () => loadStats();
    window.addEventListener('userDataUpdated', handleCustomUpdate);
    window.addEventListener('bookingUpdated', handleCustomUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userDataUpdated', handleCustomUpdate);
      window.removeEventListener('bookingUpdated', handleCustomUpdate);
    };
  }, []);

  const handleCardClick = (type) => {
    if (type === 'users') navigate('/edit-users');
    if (type === 'consultations') navigate('/admin/consultations');
    if (type === 'pending') navigate('/admin/pending');
  };

  if (loading) return <div className="max-w-6xl mx-auto text-center py-12"><div className="loader-sm mx-auto" /><p className="text-gray-500 mt-2">Loading system stats...</p></div>;

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-8"><h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1><p className="text-gray-500 mt-1">System overview and management</p></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div onClick={() => handleCardClick('users')} className="bg-white rounded-xl shadow-md p-6 border-l-8 border-l-honey-500 card-hover cursor-pointer transition transform hover:scale-105">
          <div className="flex items-center justify-between"><div><p className="text-honey-600 text-sm font-medium">Total Users</p><p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p><p className="text-xs text-gray-500 mt-1">{stats.studentsCount} students, {stats.lecturersCount} lecturers, {stats.adminsCount} admins</p></div><Users className="w-12 h-12 text-honey-400" /></div>
        </div>
        <div onClick={() => handleCardClick('consultations')} className="bg-white rounded-xl shadow-md p-6 border-l-8 border-l-tomato-500 card-hover cursor-pointer transition transform hover:scale-105">
          <div className="flex items-center justify-between"><div><p className="text-tomato-600 text-sm font-medium">Consultations</p><p className="text-3xl font-bold text-gray-800">{stats.totalConsultations}</p><p className="text-xs text-gray-500 mt-1">Unique appointments</p></div><ShieldCheck className="w-12 h-12 text-tomato-400" /></div>
        </div>
        <div onClick={() => handleCardClick('pending')} className="bg-white rounded-xl shadow-md p-6 border-l-8 border-l-amber-500 card-hover cursor-pointer transition transform hover:scale-105">
          <div className="flex items-center justify-between"><div><p className="text-amber-600 text-sm font-medium">Pending Actions</p><p className="text-3xl font-bold text-gray-800">{stats.pendingActions}</p><p className="text-xs text-gray-500 mt-1">Awaiting approval</p></div><Settings className="w-12 h-12 text-amber-400" /></div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6 border border-honey-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2"><Edit className="w-5 h-5 text-tomato-500" /> Admin Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button onClick={() => navigate('/edit-users')} className="flex items-center justify-between p-4 bg-honey-50 rounded-lg hover:bg-honey-100 transition group"><div><p className="font-medium text-gray-800">Manage Users</p><p className="text-sm text-gray-500">Edit, add or remove system users</p></div><Users className="w-5 h-5 text-tomato-500 group-hover:translate-x-1 transition" /></button>
          <button onClick={() => navigate('/admin/consultations')} className="flex items-center justify-between p-4 bg-honey-50 rounded-lg hover:bg-honey-100 transition group"><div><p className="font-medium text-gray-800">View All Consultations</p><p className="text-sm text-gray-500">See all appointments</p></div><ShieldCheck className="w-5 h-5 text-tomato-500 group-hover:translate-x-1 transition" /></button>
        </div>
      </div>
      <div className="mt-6 text-center text-xs text-gray-400">Admin ID: {adminId || 'admin'} • Logged in as administrator</div>
    </div>
  );
};

export default AdminDashboard;