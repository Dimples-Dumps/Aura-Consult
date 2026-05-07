import React from 'react';

const CourseView = () => {
  const courses = [
    { id: 1, name: 'Computer Science 101', instructor: 'Dr. Phindulo Mbeki', progress: 75 },
    { id: 2, name: 'Data Structures', instructor: 'Prof. Kamzen Zulu', progress: 40 },
    { id: 3, name: 'Web Development', instructor: 'Dr. Luwanda Johnson', progress: 90 },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-honey-100">
      <h1 className="text-2xl font-bold gradient-text mb-4">My Courses</h1>
      <div className="space-y-4">
        {courses.map(course => (
          <div key={course.id} className="p-4 bg-honey-50 rounded-lg">
            <h3 className="font-semibold text-gray-800">{course.name}</h3>
            <p className="text-sm text-gray-500">{course.instructor}</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-tomato-500 h-2 rounded-full" style={{ width: `${course.progress}%` }} />
            </div>
            <p className="text-xs text-gray-400 mt-1">{course.progress}% complete</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseView;