import React from 'react';
import { GraduationCap, Users } from 'lucide-react';

const RoleToggle = ({ currentRole, onRoleChange }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 inline-flex gap-1">
      <button
        onClick={() => onRoleChange('student')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
          currentRole === 'student'
            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <GraduationCap className="w-4 h-4" />
        <span className="font-medium">Student</span>
      </button>
      <button
        onClick={() => onRoleChange('lecturer')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
          currentRole === 'lecturer'
            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <Users className="w-4 h-4" />
        <span className="font-medium">Lecturer</span>
      </button>
    </div>
  );
};

export default RoleToggle;