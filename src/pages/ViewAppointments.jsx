import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle, XCircle } from 'lucide-react';
import { getBookingsByLecturer, updateBookingStatus } from '../services/bookingService';
import { getUserById } from '../services/userService';
import toast from 'react-hot-toast';
import { useNotifications } from '../context/NotificationContext';

const ViewAppointments = ({ lecturerId }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState({});
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
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (bookingId, status) => {
    try {
      await updateBookingStatus(bookingId, status);
      const booking = bookings.find(b => b.id === bookingId);
      const studentName = students[booking?.studentId] || 'Student';
      addNotification(`You ${status} ${studentName}'s appointment on ${booking?.day} at ${booking?.time}`, status === 'approved' ? 'success' : 'warning');
      toast.success(`Appointment ${status}`);
      loadBookings();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-honey-100">
      <h1 className="text-2xl font-bold gradient-text mb-4">View Appointments</h1>
      {loading ? (
        <div className="text-center py-8"><div className="loader-sm mx-auto"></div></div>
      ) : bookings.length === 0 ? (
        <p className="text-gray-500">No appointments found.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking.id} className="p-4 border rounded-lg hover:bg-honey-50">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <p className="font-semibold">{students[booking.studentId]}</p>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                    <span><Calendar className="w-3 h-3 inline mr-1" />{booking.day}</span>
                    <span><Clock className="w-3 h-3 inline mr-1" />{booking.time}</span>
                  </div>
                  <p className="text-sm mt-1">{booking.type}</p>
                  {booking.notes && <p className="text-xs text-gray-400 italic mt-1">"{booking.notes}"</p>}
                  <p className="text-xs mt-1 capitalize">Status: <span className={`font-medium ${booking.status === 'approved' ? 'text-green-600' : booking.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>{booking.status}</span></p>
                </div>
                {booking.status === 'pending' && (
                  <div className="flex gap-2">
                    <button onClick={() => handleStatus(booking.id, 'approved')} className="px-3 py-1 bg-green-500 text-white rounded text-sm">Approve</button>
                    <button onClick={() => handleStatus(booking.id, 'rejected')} className="px-3 py-1 bg-red-500 text-white rounded text-sm">Reject</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewAppointments;