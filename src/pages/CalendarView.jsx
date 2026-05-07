import React from 'react';

const CalendarView = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const appointments = [
    { day: 'Mon', time: '10:00', title: 'Project discussion' },
    { day: 'Wed', time: '14:00', title: 'Thesis review' },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-honey-100">
      <h1 className="text-2xl font-bold gradient-text mb-4">Calendar</h1>
      <div className="grid grid-cols-5 gap-2">
        {days.map(day => (
          <div key={day} className="text-center font-semibold text-gray-700 p-2 bg-honey-50 rounded">{day}</div>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        {appointments.map((apt, idx) => (
          <div key={idx} className="p-2 border-l-4 border-tomato-500 bg-honey-50 rounded">
            <p className="text-sm font-medium">{apt.day} at {apt.time}</p>
            <p className="text-xs text-gray-600">{apt.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;