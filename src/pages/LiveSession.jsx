import React, { useState, useEffect } from 'react';
import { X, Video, Clock, User } from 'lucide-react';
import { getCurrentUser } from '../services/authService';
import { getBookingsByStudent, getBookingsByLecturer } from '../services/bookingService';
import { getUserById } from '../services/userService';

const LiveSession = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const currentUser = getCurrentUser();

  useEffect(() => {
    loadApprovedBookings();
  }, []);

  const loadApprovedBookings = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      let bookings = [];
      if (currentUser.role === 'student')
        bookings = await getBookingsByStudent(currentUser.id);
      else if (currentUser.role === 'lecturer')
        bookings = await getBookingsByLecturer(currentUser.id);
      const approved = bookings.filter(b => b.status === 'approved');
      const enhanced = await Promise.all(approved.map(async (booking) => {
        let otherName = '';
        if (currentUser.role === 'student') {
          const lecturer = await getUserById(booking.lecturerId);
          otherName = lecturer?.name || 'Unknown';
        } else {
          const student = await getUserById(booking.studentId);
          otherName = student?.name || 'Unknown';
        }
        return {
          id: booking.id,
          title: `${booking.type || 'Consultation'} with ${otherName}`,
          lecturer: otherName,
          time: `${booking.day} at ${booking.time}`,
          description: booking.notes || 'No additional notes',
        };
      }));
      setSessions(enhanced);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = (session) => {
    setSelectedSession(session);
    setShowModal(true);
  };

  const handleStartMeeting = () => {
    // Opens Google Meet to create a new meeting (always works)
    window.open('https://meet.google.com/new', '_blank');
    setShowModal(false);
  };

  if (loading) return <div className="text-center p-6"><div className="loader-sm mx-auto" /></div>;

  return (
    <>
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">Live Sessions</h1>
        {sessions.length === 0 ? (
          <p className="text-gray-500 text-center">No approved appointments yet.</p>
        ) : (
          <div className="space-y-3">
            {sessions.map(s => (
              <div key={s.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div><h3 className="font-semibold">{s.title}</h3><p className="text-sm text-gray-500">{s.lecturer} • {s.time}</p></div>
                <button onClick={() => handleJoin(s)} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Join</button>
              </div>
            ))}
          </div>
        )}
      </div>
      {showModal && selectedSession && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Join {selectedSession.title}</h3>
              <button onClick={() => setShowModal(false)}><X /></button>
            </div>
            <p><Clock className="inline mr-1" /> {selectedSession.time}</p>
            <p className="text-gray-500 mt-2">{selectedSession.description}</p>
            <div className="mt-5 flex gap-3">
              <button onClick={handleStartMeeting} className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Start Meeting (Google Meet)
              </button>
              <button onClick={() => setShowModal(false)} className="flex-1 border py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveSession;