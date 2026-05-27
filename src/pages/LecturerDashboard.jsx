import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, Calendar, User } from 'lucide-react';
import { getBookingsByLecturer, updateBookingStatus } from '../services/bookingService';
import { getUserById } from '../services/userService';
import toast from 'react-hot-toast';
import { useNotifications } from '../context/NotificationContext';

const LecturerDashboard = ({ lecturerId }) => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState({});
  const [activeTab, setActiveTab] = useState('pending');
  const { addNotification } = useNotifications();

  useEffect(() => {
    loadBookings();
  }, [lecturerId]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await getBookingsByLecturer(lecturerId);
      setBookings(data);
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
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (bookingId, status) => {
    try {
      await updateBookingStatus(bookingId, status);
      toast.success(`Booking ${status}`);
      const booking = bookings.find((b) => b.id === bookingId);
      const studentName = students[booking?.studentId] || 'Student';
      const date = `${booking?.day} at ${booking?.time}`;
      addNotification(
        `You ${status} ${studentName}'s appointment on ${date}`,
        status === 'approved' ? 'success' : 'warning'
      );
      await loadBookings();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update booking');
    }
  };

  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const approvedBookings = bookings.filter((b) => b.status === 'approved');
  const displayedBookings = activeTab === 'pending' ? pendingBookings : approvedBookings;

  const total = bookings.length;
  const pending = pendingBookings.length;
  const approved = approvedBookings.length;
  const rejected = bookings.filter((b) => b.status === 'rejected').length;

  return (
    <div className="container mx-auto px-4">
      <div className="bg-gradient-to-r from-honey-500 to-honey-600 rounded-2xl p-6 mb-8 text-white">
        <h1 className="text-3xl font-bold">Lecturer Dashboard</h1>
        <p className="text-gray-100 mt-1">Manage your consultation requests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-l-gray-400">
          <p className="text-gray-500 text-sm">Total Appointments</p>
          <p className="text-2xl font-bold text-gray-800">{loading ? '...' : total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-l-yellow-500">
          <p className="text-gray-500 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{loading ? '...' : pending}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-l-green-500">
          <p className="text-gray-500 text-sm">Approved</p>
          <p className="text-2xl font-bold text-green-600">{loading ? '...' : approved}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-l-red-500">
          <p className="text-gray-500 text-sm">Rejected</p>
          <p className="text-2xl font-bold text-red-600">{loading ? '...' : rejected}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="border-b border-gray-200 flex">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition ${
              activeTab === 'pending'
                ? 'text-honey-600 border-b-2 border-honey-600 bg-honey-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Pending ({pending})
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition ${
              activeTab === 'upcoming'
                ? 'text-honey-600 border-b-2 border-honey-600 bg-honey-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Approved ({approved})
          </button>
        </div>

        <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-honey-500 rounded-full animate-spin mx-auto" />
            </div>
          ) : displayedBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📭</div>
              <p className="text-gray-500">No {activeTab} requests</p>
            </div>
          ) : (
            displayedBookings.map((booking) => (
              <div key={booking.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <h3 className="font-semibold text-gray-800 text-lg">
                        {students[booking.studentId]}
                      </h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {booking.day}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {booking.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{booking.type}</p>
                    {booking.notes && (
                      <p className="text-sm text-gray-500 italic">"{booking.notes}"</p>
                    )}
                  </div>
                  {activeTab === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(booking.id, 'approved')}
                        className="flex items-center gap-1 px-4 py-2 bg-honey-500 text-white rounded-lg hover:bg-honey-600 transition"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(booking.id, 'rejected')}
                        className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  )}
                  {activeTab === 'upcoming' && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Approved
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LecturerDashboard;