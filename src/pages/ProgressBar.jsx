import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../services/authService';
import { getBookingsByStudent, getBookingsByLecturer } from '../services/bookingService';

const ProgressBar = () => {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const currentUser = getCurrentUser();

  useEffect(() => {
    const fetchProgress = async () => {
      if (!currentUser) return;
      try {
        let bookings = [];
        if (currentUser.role === 'student') {
          bookings = await getBookingsByStudent(currentUser.id);
        } else if (currentUser.role === 'lecturer') {
          bookings = await getBookingsByLecturer(currentUser.id);
        } else {
          setProgress(0);
          setLoading(false);
          return;
        }
        const total = bookings.length;
        const approved = bookings.filter(b => b.status === 'approved').length;
        const percentage = total === 0 ? 0 : Math.round((approved / total) * 100);
        setProgress(percentage);
      } catch (error) {
        console.error('Failed to load progress:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md border border-honey-100 text-center">
        <div className="loader-sm mx-auto"></div>
        <p className="text-gray-500 mt-2">Loading progress...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-honey-100">
      <h1 className="text-2xl font-bold gradient-text mb-4">Consultation Progress</h1>
      <p className="text-gray-600 mb-2">
        {currentUser?.role === 'student' ? 'Your approved consultations rate' : 'Lecturer approval rate'}
      </p>
      <div className="w-full bg-honey-100 rounded-full h-4">
        <div className="bg-tomato-500 h-4 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
      <p className="mt-2 text-sm text-gray-500">{progress}% completed</p>
      <p className="text-xs text-gray-400 mt-2">
        Based on approved consultations out of total requests.
      </p>
    </div>
  );
};

export default ProgressBar;