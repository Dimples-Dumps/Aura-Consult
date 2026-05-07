import React from 'react';

const TotalStats = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-honey-100">
      <h1 className="text-2xl font-bold gradient-text mb-4">System Statistics</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-honey-50 rounded"><p className="text-2xl font-bold text-tomato-600">12</p><p>Total Users</p></div>
        <div className="p-4 bg-honey-50 rounded"><p className="text-2xl font-bold text-tomato-600">42</p><p>Consultations</p></div>
        <div className="p-4 bg-honey-50 rounded"><p className="text-2xl font-bold text-tomato-600">8</p><p>Lecturers</p></div>
        <div className="p-4 bg-honey-50 rounded"><p className="text-2xl font-bold text-tomato-600">95%</p><p>Satisfaction</p></div>
      </div>
    </div>
  );
};

export default TotalStats;