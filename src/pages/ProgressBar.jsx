import React from 'react';

const ProgressBar = () => {
  const progress = 65;
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-honey-100">
      <h1 className="text-2xl font-bold gradient-text mb-4">Progress Tracker</h1>
      <p className="text-gray-600 mb-2">Consultation completion rate</p>
      <div className="w-full bg-honey-100 rounded-full h-4">
        <div className="bg-tomato-500 h-4 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
      <p className="mt-2 text-sm text-gray-500">{progress}% completed</p>
    </div>
  );
};

export default ProgressBar;