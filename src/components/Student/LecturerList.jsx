import React, { useState, useEffect } from 'react';
import { getAllLecturers } from '../../services/userService';
import { GraduationCap, ChevronRight } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const LecturerList = ({ onSelectLecturer, selectedLecturerId }) => {
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLecturers = async () => {
      try {
        const data = await getAllLecturers();
        console.log('Loaded lecturers:', data);
        setLecturers(data);
      } catch (error) {
        console.error('Error loading lecturers:', error);
      } finally {
        setLoading(false);
      }
    };
    loadLecturers();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Select a Lecturer</h2>
        <p className="text-emerald-100 text-sm mt-1">Click on any lecturer to view availability</p>
      </div>
      
      <div className="divide-y divide-gray-100">
        {lecturers.map((lecturer) => (
          <div
            key={lecturer.id}
            onClick={() => {
              console.log('Clicked lecturer:', lecturer.name);
              onSelectLecturer(lecturer.id);
            }}
            className={`w-full px-6 py-4 flex items-center justify-between cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
              selectedLecturerId === lecturer.id 
                ? 'bg-emerald-50 border-l-4 border-emerald-600' 
                : 'border-l-4 border-transparent'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-800 text-lg">{lecturer.name}</h3>
                <p className="text-sm text-gray-500">{lecturer.department || 'Academic Staff'}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LecturerList;