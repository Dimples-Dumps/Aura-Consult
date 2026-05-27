import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle, XCircle } from 'lucide-react';
import { getUserById } from '../services/userService';

const AllConsultations = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userNames, setUserNames] = useState({});

  useEffect(() => {
    const loadAllBookings = async () => {
      const uniqueMap = new Map(); // deduplicate by id
      const nameMap = {};

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('bookings_')) {
          const list = JSON.parse(localStorage.getItem(key) || '[]');
          for (const booking of list) {
            if (!uniqueMap.has(booking.id)) {
              uniqueMap.set(booking.id, booking);
            }
          }
        }
      }
      const uniqueBookings = Array.from(uniqueMap.values());
      uniqueBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBookings(uniqueBookings);

      // Fetch names for students and lecturers
      for (const booking of uniqueBookings) {
        if (booking.studentId && !nameMap[booking.studentId]) {
          const student = await getUserById(booking.studentId);
          nameMap[booking.studentId] = student?.name || 'Unknown';
        }
        if (booking.lecturerId && !nameMap[booking.lecturerId]) {
          const lecturer = await getUserById(booking.lecturerId);
          nameMap[booking.lecturerId] = lecturer?.name || 'Unknown';
        }
      }
      setUserNames(nameMap);
      setLoading(false);
    };
    loadAllBookings();
  }, []);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved': return <span className="flex items-center gap-1 text-green-600 text-sm"><CheckCircle className="w-4 h-4" /> Approved</span>;
      case 'rejected': return <span className="flex items-center gap-1 text-red-600 text-sm"><XCircle className="w-4 h-4" /> Rejected</span>;
      default: return <span className="flex items-center gap-1 text-yellow-600 text-sm"><Clock className="w-4 h-4" /> Pending</span>;
    }
  };

  if (loading) return <div className="bg-white rounded-xl p-6 text-center"><div className="loader-sm mx-auto" /></div>;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-honey-100">
      <h1 className="text-2xl font-bold gradient-text mb-4">All Consultations</h1>
      <p className="text-gray-500 mb-4">Total: {bookings.length} unique appointments</p>
      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {bookings.length === 0 ? <p className="text-gray-500">No consultations yet.</p>
        : bookings.map((booking) => (
          <div key={booking.id} className="border border-honey-200 rounded-lg p-4 hover:bg-honey-50">
            <div className="flex justify-between items-start flex-wrap gap-2">
              <div>
                <p className="font-semibold">Student: {userNames[booking.studentId] || booking.studentName || 'Unknown'}</p>
                <p className="text-sm text-gray-600">Lecturer: {userNames[booking.lecturerId] || booking.lecturerName || 'Unknown'}</p>
                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                  <span><Calendar className="w-3 h-3 inline mr-1" /> {booking.day}</span>
                  <span><Clock className="w-3 h-3 inline mr-1" /> {booking.time}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{booking.type}</p>
                {booking.notes && <p className="text-xs text-gray-400 italic mt-1">"{booking.notes}"</p>}
              </div>
              {getStatusBadge(booking.status)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllConsultations;