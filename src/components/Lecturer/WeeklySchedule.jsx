import React, { useState, useEffect } from 'react';
import { DAYS, TIME_SLOTS } from '../../utils/constants';
import { getAvailabilityByLecturer, saveAvailability } from '../../services/availabilityService';
import { Calendar, Save, Clock } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const WeeklySchedule = ({ lecturerId }) => {
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (lecturerId) {
      loadSchedule();
    }
  }, [lecturerId]);

  const loadSchedule = async () => {
    try {
      const data = await getAvailabilityByLecturer(lecturerId);
      if (data.schedule) {
        setSchedule(data.schedule);
      } else {
        const emptySchedule = {};
        DAYS.forEach(day => { emptySchedule[day] = [...TIME_SLOTS]; });
        setSchedule(emptySchedule);
      }
    } catch (error) {
      console.error('Error loading schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTimeSlot = (day, time) => {
    setSchedule(prev => {
      const daySlots = [...(prev[day] || [])];
      if (daySlots.includes(time)) {
        return { ...prev, [day]: daySlots.filter(slot => slot !== time) };
      } else {
        return { ...prev, [day]: [...daySlots, time].sort() };
      }
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveAvailability(lecturerId, schedule);
      alert('Schedule saved successfully!');
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert('Error saving schedule');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Weekly Schedule Configuration
            </h2>
            <p className="text-purple-100 text-sm mt-1">Click on time slots to toggle availability</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-white text-purple-600 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Schedule'}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto p-4">
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 bg-gray-50 rounded-l-lg">Time</th>
              {DAYS.map(day => (
                <th key={day} className="px-4 py-3 text-left text-sm font-semibold text-gray-600 bg-gray-50">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map(time => (
              <tr key={time} className="border-b border-gray-100">
                <td className="px-4 py-2 text-sm text-gray-600 font-medium bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    {time}
                  </div>
                </td>
                {DAYS.map(day => {
                  const isAvailable = schedule[day]?.includes(time);
                  return (
                    <td key={`${day}-${time}`} className="px-4 py-2">
                      <button
                        onClick={() => toggleTimeSlot(day, time)}
                        className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isAvailable
                            ? 'bg-green-500 text-white hover:bg-green-600 shadow-md'
                            : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                        }`}
                      >
                        {isAvailable ? 'Available' : 'Unavailable'}
                      </button>
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

export default WeeklySchedule;