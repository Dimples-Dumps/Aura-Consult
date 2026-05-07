import React, { useState, useEffect } from 'react';
import { getAvailabilityByLecturer } from '../../services/availabilityService';
import { DAYS, TIME_SLOTS } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';

const AvailabilityCalendar = ({ lecturerId, onSelectSlot, selectedSlot }) => {
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAvailability = async () => {
      setLoading(true);
      try {
        const data = await getAvailabilityByLecturer(lecturerId);
        console.log('Availability data:', data);
        setAvailability(data.schedule || {});
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (lecturerId) loadAvailability();
  }, [lecturerId]);

  const isSlotAvailable = (day, time) => {
    return availability && availability[day] && availability[day].includes(time);
  };

  const isSlotSelected = (day, time) => {
    return selectedSlot && selectedSlot.day === day && selectedSlot.time === time;
  };

  const handleBookClick = (day, time) => {
    console.log('Book clicked:', day, time);
    if (isSlotAvailable(day, time)) {
      onSelectSlot({ day, time });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Available Time Slots</h2>
        <p className="text-emerald-100 text-sm mt-1">Click on any green button to book</p>
      </div>
      
      <div className="overflow-x-auto p-4">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Time</th>
              {DAYS.map(day => (
                <th key={day} className="p-3 text-left text-sm font-semibold text-gray-600">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map(time => (
              <tr key={time} className="border-t border-gray-100">
                <td className="p-3 text-sm text-gray-600 font-medium bg-gray-50">
                  {time}
                </td>
                {DAYS.map(day => {
                  const available = isSlotAvailable(day, time);
                  const selected = isSlotSelected(day, time);
                  return (
                    <td key={`${day}-${time}`} className="p-2">
                      {available ? (
                        <button
                          onClick={() => handleBookClick(day, time)}
                          className={`w-full px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition ${
                            selected
                              ? 'bg-emerald-600 text-white'
                              : 'bg-emerald-500 text-white hover:bg-emerald-600'
                          }`}
                          type="button"
                        >
                          {selected ? 'Selected' : 'Book'}
                        </button>
                      ) : (
                        <div className="w-full px-3 py-2 rounded-lg text-sm text-gray-400 bg-gray-100 text-center">
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
    </div>
  );
};

export default AvailabilityCalendar;