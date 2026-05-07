import React from 'react';

const LiveSession = () => {
  const sessions = [
    { id: 1, title: 'AI in Healthcare', lecturer: 'Dr. Phindulo Mbeki', time: 'Today, 14:00', link: '#' },
    { id: 2, title: 'Calculus Review', lecturer: 'Prof. Kamzen Zulu', time: 'Tomorrow, 10:00', link: '#' },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-honey-100">
      <h1 className="text-2xl font-bold gradient-text mb-4">Live Sessions</h1>
      <div className="space-y-3">
        {sessions.map(session => (
          <div key={session.id} className="flex justify-between items-center p-3 bg-honey-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-800">{session.title}</h3>
              <p className="text-sm text-gray-500">{session.lecturer} • {session.time}</p>
            </div>
            <button className="px-3 py-1 bg-tomato-500 text-white text-sm rounded-lg hover:bg-tomato-600">Join</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveSession;