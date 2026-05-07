import React from 'react';

const TotalConsults = () => {
  const stats = { total: 24, completed: 18, pending: 6 };
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-honey-100">
      <h1 className="text-2xl font-bold gradient-text mb-4">Total Consultations</h1>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-honey-50 rounded"><p className="text-2xl font-bold text-tomato-600">{stats.total}</p><p className="text-xs">Total</p></div>
        <div className="p-3 bg-honey-50 rounded"><p className="text-2xl font-bold text-green-600">{stats.completed}</p><p className="text-xs">Completed</p></div>
        <div className="p-3 bg-honey-50 rounded"><p className="text-2xl font-bold text-yellow-600">{stats.pending}</p><p className="text-xs">Pending</p></div>
      </div>
    </div>
  );
};

export default TotalConsults;