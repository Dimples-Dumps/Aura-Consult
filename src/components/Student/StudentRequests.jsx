import React, { useState, useEffect } from 'react';
import { getBookingsByStudent } from '../../services/bookingService';
import { getUserById } from '../../services/userService';
import { BOOKING_STATUS, STATUS_COLORS, STATUS_BADGES } from '../../utils/constants';
import { Clock, CheckCircle, XCircle, Filter, RefreshCw } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const StudentRequests = ({ studentId }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [lecturers, setLecturers] = useState({});

  useEffect(() => {
    if (studentId) {
      loadBookings();
    }
  }, [studentId]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await getBookingsByStudent(studentId);
      setBookings(data);
      
      // Fetch lecturer names
      const lecturerMap = {};
      for (const booking of data) {
        if (!lecturerMap[booking.lecturerId]) {
          const lecturer = await getUserById(booking.lecturerId);
          lecturerMap[booking.lecturerId] = lecturer?.name || 'Unknown';
        }
      }
      setLecturers(lecturerMap);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const getStatusIcon = (status) => {
    switch(status) {
      case BOOKING_STATUS.PENDING: return <Clock className="w-4 h-4" />;
      case BOOKING_STATUS.APPROVED: return <CheckCircle className="w-4 h-4" />;
      case BOOKING_STATUS.REJECTED: return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">My Requests</h2>
            <p className="text-purple-100 text-sm mt-1">Track your consultation requests</p>
          </div>
          <button
            onClick={loadBookings}
            className="text-white hover:text-purple-200 transition"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="px-6 pt-4 pb-2 border-b border-gray-100">
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                filter === status
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && (
                <span className="ml-1 text-xs">
                  ({bookings.filter(b => b.status === status).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">📋</div>
            <p className="text-gray-500">No booking requests found</p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div key={booking.id} className="p-4 hover:bg-gray-50 transition">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-800">{lecturers[booking.lecturerId]}</h3>
                  <p className="text-sm text-gray-500">{booking.type}</p>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[booking.status]}`}>
                  {getStatusIcon(booking.status)}
                  <span>{STATUS_BADGES[booking.status]}</span>
                </div>
              </div>
              <div className="flex gap-4 text-sm text-gray-600 mt-2">
                <span>{booking.day}</span>
                <span>{booking.time}</span>
              </div>
              {booking.notes && (
                <p className="text-sm text-gray-500 mt-2 bg-gray-50 p-2 rounded">
                  💬 {booking.notes}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentRequests;