import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, BookOpen, Send, ArrowLeft, CheckCircle, X } from 'lucide-react';
import { createBooking } from '../services/bookingService';
import { getAllLecturers } from '../services/userService';
import toast from 'react-hot-toast';
import { useNotifications } from '../context/NotificationContext';

const BookAppointment = ({ studentId, studentName }) => {
  const [lecturers, setLecturers] = useState([]);
  const [selectedLecturer, setSelectedLecturer] = useState(null);
  const [step, setStep] = useState(1);
  const [sessionType, setSessionType] = useState('Consultation');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tempSlot, setTempSlot] = useState(null);
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
  const sessionTypes = ['Consultation', 'Project Review', 'Thesis Discussion', 'Exam Preparation', 'Research Guidance'];

  useEffect(() => {
    const loadLecturers = async () => {
      const list = await getAllLecturers();
      setLecturers(list);
    };
    loadLecturers();
  }, []);

  const handleSelectLecturer = (lecturer) => {
    setSelectedLecturer(lecturer);
    setStep(2);
  };

  const handleSlotClick = (day, time) => {
    setTempSlot({ day, time });
    setShowModal(true);
  };

  const confirmBooking = async () => {
    if (!tempSlot) return;
    setLoading(true);
    try {
      await createBooking({
        studentId,
        studentName,
        lecturerId: selectedLecturer.id,
        lecturerName: selectedLecturer.name,
        day: tempSlot.day,
        time: tempSlot.time,
        type: sessionType,
        notes,
      });
      addNotification(
        `Your appointment request with ${selectedLecturer.name} on ${tempSlot.day} at ${tempSlot.time} has been sent.`,
        'info',
        '/view-requests'
      );
      toast.success('Booking request sent successfully!');
      setShowModal(false);
      setTempSlot(null);
      setStep(1);
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error(error);
      toast.error('Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = () => {
    setShowModal(false);
    setTempSlot(null);
  };

  return (
    <div className="container mx-auto px-4 max-w-4xl">
      <div className="mb-6">
        <button
          onClick={() => (step === 1 ? navigate('/') : setStep(step - 1))}
          className="flex items-center gap-2 text-honey-600 hover:text-honey-700 mb-4 transition"
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
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= s ? 'bg-honey-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`flex-1 h-1 mx-2 ${step > s ? 'bg-honey-500' : 'bg-gray-200'}`}
              />
            )}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-honey-500" />
            Step 1: Select a Lecturer
          </h2>
          <div className="space-y-3">
            {lecturers.map((lecturer) => (
              <button
                key={lecturer.id}
                onClick={() => handleSelectLecturer(lecturer)}
                className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-honey-400 hover:shadow-md transition flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">{lecturer.name}</h3>
                  <p className="text-sm text-gray-500">
                    {lecturer.department || 'Academic Staff'}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-honey-500" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && selectedLecturer && (
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 overflow-x-auto">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-honey-500" />
            Step 2: Select a Time Slot with {selectedLecturer.name}
          </h2>
          <p className="text-sm text-gray-500 mb-3">Click on any cell to book that time slot.</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-left">Time</th>
                {days.map((day) => (
                  <th key={day} className="p-3 text-left">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time) => (
                <tr key={time} className="border-t border-gray-100">
                  <td className="p-3 font-medium">{time}</td>
                  {days.map((day) => (
                    <td key={day} className="p-2">
                      <button
                        onClick={() => handleSlotClick(day, time)}
                        className="w-full px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-honey-100 hover:text-honey-700 transition text-xs"
                      >
                        Book
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && tempSlot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="bg-gradient-to-r from-honey-500 to-honey-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <h3 className="font-semibold">Confirm Booking</h3>
              </div>
              <button onClick={cancelBooking} className="hover:bg-white/20 rounded-full p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <p className="text-gray-700 mb-2">
                You are booking with <strong>{selectedLecturer?.name}</strong>
              </p>
              <p className="text-gray-700 mb-4">
                <strong>{tempSlot.day}</strong> at <strong>{tempSlot.time}</strong>
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Session Type
                </label>
                <select
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  {sessionTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="2"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Any additional information for the lecturer?"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={confirmBooking}
                  disabled={loading}
                  className="flex-1 bg-honey-500 text-white py-2 rounded-lg hover:bg-honey-600 transition disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Confirm Booking'}
                </button>
                <button
                  onClick={cancelBooking}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;