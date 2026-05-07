import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle, XCircle } from 'lucide-react';
import { getBookingsByStudent } from '../services/bookingService';
import { getUserById } from '../services/userService';
import toast from 'react-hot-toast';

const ViewRequests = ({ studentId }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lecturers, setLecturers] = useState({});

  useEffect(() => {
    loadRequests();
  }, [studentId]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await getBookingsByStudent(studentId);
      setBookings(data);
      const lecturerMap = {};
      for (const booking of data) {
        if (!lecturerMap[booking.lecturerId]) {
          const lecturer = await getUserById(booking.lecturerId);
          lecturerMap[booking.lecturerId] = lecturer?.name || 'Unknown';
        }
      }
      setLecturers(lecturerMap);
    } catch (error) {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved': return <span className="flex items-center gap-1 text-green-600 text-sm"><CheckCircle className="w-4 h-4" /> Approved</span>;
      case 'rejected': return <span className="flex items-center gap-1 text-red-600 text-sm"><XCircle className="w-4 h-4" /> Rejected</span>;
      default: return <span className="flex items-center gap-1 text-yellow-600 text-sm"><Clock className="w-4 h-4" /> Pending</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-honey-100">
      <h1 className="text-2xl font-bold gradient-text mb-4">My Consultation Requests</h1>
      {loading ? (
        <div className="text-center py-8"><div className="loader-sm mx-auto"></div></div>
      ) : bookings.length === 0 ? (
        <p className="text-gray-500">No requests found. Book an appointment first.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking.id} className="p-4 border rounded-lg hover:bg-honey-50">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <p className="font-semibold">{lecturers[booking.lecturerId]}</p>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                    <span><Calendar className="w-3 h-3 inline mr-1" />{booking.day}</span>
                    <span><Clock className="w-3 h-3 inline mr-1" />{booking.time}</span>
                  </div>
                  <p className="text-sm mt-1">{booking.type}</p>
                  {booking.notes && <p className="text-xs text-gray-400 italic mt-1">"{booking.notes}"</p>}
                </div>
                {getStatusBadge(booking.status)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewRequests;