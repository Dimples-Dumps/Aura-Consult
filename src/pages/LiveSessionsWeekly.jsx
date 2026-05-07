import React from 'react';

const LiveSessionsWeekly = () => {
  const sessions = [
    { day: 'Monday', time: '10:00', lecturer: 'Dr. Phindulo', topic: 'AI Ethics' },
    { day: 'Wednesday', time: '14:00', lecturer: 'Prof. Kamzen', topic: 'Calculus' },
    { day: 'Friday', time: '11:00', lecturer: 'Dr. Luwanda', topic: 'Web Dev' },
  ];
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-honey-100">
      <h1 className="text-2xl font-bold gradient-text mb-4">Weekly Live Sessions</h1>
      <table className="w-full text-sm">
        <thead><tr className="bg-honey-50"><th className="p-2 text-left">Day</th><th>Time</th><th>Lecturer</th><th>Topic</th></tr></thead>
        <tbody>
          {sessions.map((s, idx) => (
            <tr key={idx} className="border-t"><td className="p-2">{s.day}</td><td>{s.time}</td><td>{s.lecturer}</td><td>{s.topic}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LiveSessionsWeekly;