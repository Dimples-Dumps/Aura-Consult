import React, { useState, useEffect } from 'react';
import { getBookingsByLecturer, updateBookingStatus } from '../../services/bookingService';
import { getUserById } from '../../services/userService';
import { BOOKING_STATUS } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';

const LecturerRequests = ({ lecturerId, autoAccept, onStatsUpdate }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [students, setStudents] = useState({});

  useEffect(() => {
    if (lecturerId) {
      loadBookings();
    }
  }, [lecturerId]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await getBookingsByLecturer(lecturerId);
      console.log('Lecturer bookings:', data);
      setBookings(data);
      
      const pending = data.filter(b => b.status === BOOKING_STATUS.PENDING).length;
      const approved = data.filter(b => b.status === BOOKING_STATUS.APPROVED).length;
      if (onStatsUpdate) onStatsUpdate(pending, approved);
      
      const studentMap = {};
      for (const booking of data) {
        if (!studentMap[booking.studentId]) {
          const student = await getUserById(booking.studentId);
          studentMap[booking.studentId] = student?.name || 'Unknown';
        }
      }
      setStudents(studentMap);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookingId) => {
    try {
      await updateBookingStatus(bookingId, BOOKING_STATUS.APPROVED);
      alert('Booking approved!');
      await loadBookings();
    } catch (error) {
      console.error(error);
      alert('Failed to approve');
    }
  };

  const handleReject = async (bookingId) => {
    try {
      await updateBookingStatus(bookingId, BOOKING_STATUS.REJECTED);
      alert('Booking rejected');
      await loadBookings();
    } catch (error) {
      console.error(error);
      alert('Failed to reject');
    }
  };

  const pendingBookings = bookings.filter(b => b.status === BOOKING_STATUS.PENDING);
  const approvedBookings = bookings.filter(b => b.status === BOOKING_STATUS.APPROVED);
  const displayedBookings = activeTab === 'pending' ? pendingBookings : approvedBookings;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Incoming Requests</h2>
        <p className="text-emerald-100 text-sm mt-1">
          {pendingBookings.length} pending • {approvedBookings.length} approved
        </p>
      </div>

      <div className="border-b border-gray-200 flex">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 px-6 py-3 text-sm font-medium ${
            activeTab === 'pending'
              ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Pending ({pendingBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 px-6 py-3 text-sm font-medium ${
            activeTab === 'upcoming'
              ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Approved ({approvedBookings.length})
        </button>
      </div>

      <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
        {displayedBookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No {activeTab} requests</p>
          </div>
        ) : (
          displayedBookings.map((booking) => (
            <div key={booking.id} className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800">{students[booking.studentId]}</h3>
                  <p className="text-sm text-gray-500">{booking.day} at {booking.time}</p>
                  <p className="text-sm text-gray-600 mt-1">{booking.type}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                  booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {booking.status}
                </span>
              </div>
              
              {booking.notes && (
                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded mb-3">{booking.notes}</p>
              )}
              
              {activeTab === 'pending' && (
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => handleApprove(booking.id)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(booking.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LecturerRequests;