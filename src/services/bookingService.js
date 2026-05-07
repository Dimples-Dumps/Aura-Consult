const getBookingsKey = (userId) => `bookings_${userId}`;

export const createBooking = async (bookingData) => {
  const newBooking = {
    id: Date.now().toString(),
    ...bookingData,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  // Save for student
  const studentBookings = JSON.parse(localStorage.getItem(getBookingsKey(bookingData.studentId)) || '[]');
  studentBookings.push(newBooking);
  localStorage.setItem(getBookingsKey(bookingData.studentId), JSON.stringify(studentBookings));
  
  // Save for lecturer
  const lecturerBookings = JSON.parse(localStorage.getItem(getBookingsKey(bookingData.lecturerId)) || '[]');
  lecturerBookings.push({ ...newBooking, studentName: bookingData.studentName });
  localStorage.setItem(getBookingsKey(bookingData.lecturerId), JSON.stringify(lecturerBookings));
  
  return newBooking;
};

export const getBookingsByStudent = async (studentId) => {
  return JSON.parse(localStorage.getItem(getBookingsKey(studentId)) || '[]');
};

export const getBookingsByLecturer = async (lecturerId) => {
  return JSON.parse(localStorage.getItem(getBookingsKey(lecturerId)) || '[]');
};

export const updateBookingStatus = async (bookingId, status) => {
  // Update in all places
  const allUsers = [...JSON.parse(localStorage.getItem('students_backup') || '[]'), ...JSON.parse(localStorage.getItem('lecturers_backup') || '[]')];
  
  // For simplicity, we'll update by iterating through localStorage keys
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('bookings_')) {
      const bookings = JSON.parse(localStorage.getItem(key) || '[]');
      const updated = bookings.map(b => b.id === bookingId ? { ...b, status } : b);
      localStorage.setItem(key, JSON.stringify(updated));
    }
  }
  return { id: bookingId, status };
};

export const getAvailabilityByLecturer = async (lecturerId) => {
  const defaultSchedule = {
    Monday: ['09:00', '10:00', '11:00', '14:00', '15:00'],
    Tuesday: ['09:00', '10:00', '13:00', '14:00'],
    Wednesday: ['11:00', '13:00', '15:00', '16:00'],
    Thursday: ['09:00', '10:00', '11:00', '14:00'],
    Friday: ['09:00', '10:00', '13:00']
  };
  
  const saved = localStorage.getItem(`availability_${lecturerId}`);
  return saved ? JSON.parse(saved) : { schedule: defaultSchedule };
};

export const saveAvailability = async (lecturerId, schedule) => {
  localStorage.setItem(`availability_${lecturerId}`, JSON.stringify({ schedule }));
  return { schedule };
};

export const initializeLecturerAvailability = async (lecturerId) => {
  const existing = await getAvailabilityByLecturer(lecturerId);
  if (!existing.schedule) {
    return saveAvailability(lecturerId, {});
  }
  return existing;
};

export const initializeMockData = async () => {
  // Initialize empty bookings for all users
  const allUsers = [...DEMO_ACCOUNTS.students, ...DEMO_ACCOUNTS.lecturers];
  for (const user of allUsers) {
    if (!localStorage.getItem(`bookings_${user.id}`)) {
      localStorage.setItem(`bookings_${user.id}`, JSON.stringify([]));
    }
  }
  return true;
};