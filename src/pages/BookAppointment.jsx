import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, BookOpen, Send, ArrowLeft, CheckCircle } from 'lucide-react';
import { getAllLecturers } from '../services/userService';
import { getAvailabilityByLecturer, createBooking } from '../services/bookingService';
import toast from 'react-hot-toast';
import { useNotifications } from '../context/NotificationContext';

const BookAppointment = ({ studentId, studentName }) => {
  const [lecturers, setLecturers] = useState([]);
  const [selectedLecturer, setSelectedLecturer] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [step, setStep] = useState(1);
  const [sessionType, setSessionType] = useState('Consultation');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
  const sessionTypes = ['Consultation', 'Project Review', 'Thesis Discussion', 'Exam Preparation', 'Research Guidance'];

  useEffect(() => {
    loadLecturers();
  }, []);

  const loadLecturers = async () => {
    try {
      const data = await getAllLecturers();
      setLecturers(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load lecturers');
    }
  };

  const handleSelectLecturer = async (lecturer) => {
    setSelectedLecturer(lecturer);
    setStep(2);
    try {
      const data = await getAvailabilityByLecturer(lecturer.id);
      setAvailability(data.schedule || {});
    } catch (error) {
      console.error(error);
    }
  };

  const isSlotAvailable = (day, time) => {
    return availability && availability[day] && availability[day].includes(time);
  };

  const handleSelectSlot = (day, time) => {
    setSelectedSlot({ day, time });
    setStep(3);
  };

  const handleSubmitBooking = async () => {
    setLoading(true);
    try {
      await createBooking({
        studentId: studentId,
        studentName: studentName,
        lecturerId: selectedLecturer.id,
        lecturerName: selectedLecturer.name,
        day: selectedSlot.day,
        time: selectedSlot.time,
        type: sessionType,
        notes: notes
      });
      
      addNotification(
        `Your appointment request with ${selectedLecturer.name} on ${selectedSlot.day} at ${selectedSlot.time} has been sent.`,
        'info',
        '/view-requests'
      );
      
      toast.success('Booking request sent successfully!');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error('Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-4xl">
      <div className="mb-6">
        <button 
          onClick={() => step === 1 ? navigate('/') : setStep(step - 1)}
          className="flex items-center gap-2 text-tomato-600 hover:text-tomato-700 mb-4 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Book an Appointment</h1>
        <p className="text-gray-500 mt-1">Follow the steps below to schedule your consultation</p>
      </div>

      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step >= s ? 'bg-tomato-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {s}
            </div>
            {s < 3 && <div className={`flex-1 h-1 mx-2 ${step > s ? 'bg-tomato-500' : 'bg-gray-200'}`}></div>}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-honey-100">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-tomato-500" />
            Step 1: Select a Lecturer
          </h2>
          <div className="space-y-3">
            {lecturers.map((lecturer) => (
              <button
                key={lecturer.id}
                onClick={() => handleSelectLecturer(lecturer)}
                className="w-full text-left p-4 rounded-xl border border-honey-200 hover:border-tomato-400 hover:shadow-md transition flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">{lecturer.name}</h3>
                  <p className="text-sm text-gray-500">{lecturer.department || 'Academic Staff'}</p>
                </div>
                <div className="w-10 h-10 bg-honey-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-tomato-500" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && selectedLecturer && (
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-honey-100 overflow-x-auto">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-tomato-500" />
            Step 2: Select a Time Slot with {selectedLecturer.name}
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-honey-50">
                <th className="p-3 text-left">Time</th>
                {days.map(day => <th key={day} className="p-3 text-left">{day}</th>)}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map(time => (
                <tr key={time} className="border-t border-honey-100">
                  <td className="p-3 font-medium">{time}</td>
                  {days.map(day => {
                    const available = isSlotAvailable(day, time);
                    return (
                      <td key={day} className="p-2">
                        {available ? (
                          <button
                            onClick={() => handleSelectSlot(day, time)}
                            className="w-full px-3 py-2 bg-tomato-500 text-white rounded-lg hover:bg-tomato-600 transition text-xs"
                          >
                            Book
                          </button>
                        ) : (
                          <div className="w-full px-3 py-2 bg-gray-100 text-gray-400 rounded-lg text-center text-xs">
                            N/A
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {step === 3 && selectedSlot && (
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-honey-100">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-tomato-500" />
            Step 3: Confirm Your Booking
          </h2>
          
          <div className="bg-honey-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Booking Details</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-600">Lecturer:</span> <strong>{selectedLecturer.name}</strong></p>
              <p><span className="text-gray-600">Day:</span> <strong>{selectedSlot.day}</strong></p>
              <p><span className="text-gray-600">Time:</span> <strong>{selectedSlot.time}</strong></p>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Session Type</label>
            <select
              value={sessionType}
              onChange={(e) => setSessionType(e.target.value)}
              className="w-full p-3 border border-honey-200 rounded-lg focus:ring-2 focus:ring-tomato-400 focus:border-transparent"
            >
              {sessionTypes.map(type => <option key={type}>{type}</option>)}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
              className="w-full p-3 border border-honey-200 rounded-lg focus:ring-2 focus:ring-tomato-400 focus:border-transparent"
              placeholder="Tell your lecturer what you'd like to discuss..."
            />
          </div>

          <button
            onClick={handleSubmitBooking}
            disabled={loading}
            className="w-full bg-gradient-to-r from-honey-500 to-tomato-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Booking Request
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;