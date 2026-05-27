import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, CheckCircle, XCircle, User, BookOpen, ArrowRight } from 'lucide-react';
import { getBookingsByStudent } from '../services/bookingService';
import { getUserById } from '../services/userService';

const StudentDashboard = ({ studentId }) => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lecturers, setLecturers] = useState({});

  useEffect(() => {
    loadBookings();
  }, [studentId]);

  const loadBookings = async () => {
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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved':
        return <span className="flex items-center gap-1 px-2 py-1 bg-tomato-100 text-tomato-800 rounded-full text-xs"><CheckCircle className="w-3 h-3" /> Approved</span>;
      case 'rejected':
        return <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs"><XCircle className="w-3 h-3" /> Rejected</span>;
      default:
        return <span className="flex items-center gap-1 px-2 py-1 bg-honey-100 text-honey-800 rounded-full text-xs"><Clock className="w-3 h-3" /> Pending</span>;
    }
  };

  const total = bookings.length;
  const pending = bookings.filter(b => b.status === 'pending').length;
  const approved = bookings.filter(b => b.status === 'approved').length;
  const rejected = bookings.filter(b => b.status === 'rejected').length;

  return (
    <div className="container mx-auto px-4">
      <div onClick={() => navigate('/book-appointment')} className="bg-gradient-to-r from-honey-500 to-tomato-500 rounded-2xl p-8 mb-8 text-white shadow-xl cursor-pointer transform transition hover:scale-[1.02]">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2"><BookOpen className="w-8 h-8" /><h1 className="text-3xl font-bold">Book an Appointment</h1></div>
            <p className="text-honey-100 text-lg">Schedule a consultation with your lecturers</p>
            <div className="flex items-center gap-2 mt-4 text-honey-100"><span>Click here to book</span><ArrowRight className="w-4 h-4" /></div>
          </div>
          <div className="hidden md:block"><Calendar className="w-24 h-24 text-white/20" /></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-l-gray-400"><p className="text-gray-500 text-sm">Total Requests</p><p className="text-2xl font-bold text-gray-800">{loading ? '...' : total}</p></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-l-yellow-500"><p className="text-gray-500 text-sm">Pending</p><p className="text-2xl font-bold text-yellow-600">{loading ? '...' : pending}</p></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-l-green-500"><p className="text-gray-500 text-sm">Approved</p><p className="text-2xl font-bold text-green-600">{loading ? '...' : approved}</p></div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-l-red-500"><p className="text-gray-500 text-sm">Rejected</p><p className="text-2xl font-bold text-red-600">{loading ? '...' : rejected}</p></div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2"><Clock className="w-6 h-6 text-tomato-500" /> My Consultation Requests</h2>
        {loading ? (
          <div className="text-center py-12"><div className="w-12 h-12 border-4 border-honey-200 border-t-tomato-600 rounded-full animate-spin mx-auto"></div></div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12"><div className="text-gray-400 text-6xl mb-4">📅</div><p className="text-gray-500">No bookings yet</p><button onClick={() => navigate('/book-appointment')} className="mt-4 px-4 py-2 bg-tomato-500 text-white rounded-lg hover:bg-tomato-600 transition">Book Your First Appointment</button></div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="border border-honey-200 rounded-lg p-4 hover:shadow-md transition hover:bg-honey-50">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">{lecturers[booking.lecturerId]}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600"><span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-tomato-400" /> {booking.day}</span><span className="flex items-center gap-1"><Clock className="w-3 h-3 text-tomato-400" /> {booking.time}</span></div>
                    <p className="text-sm text-gray-600 mt-1">{booking.type}</p>
                    {booking.notes && <p className="text-sm text-gray-500 mt-2 italic">"{booking.notes}"</p>}
                  </div>
                  {getStatusBadge(booking.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;