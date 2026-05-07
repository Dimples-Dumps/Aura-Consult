import { DEMO_ACCOUNTS } from './authService';

export const getAllLecturers = async () => {
  return DEMO_ACCOUNTS.lecturers;
};

export const getUserById = async (userId) => {
  const allUsers = [...DEMO_ACCOUNTS.students, ...DEMO_ACCOUNTS.lecturers];
  return allUsers.find(u => u.id === userId) || null;
};

export const updateLecturerSettings = async (lecturerId, settings) => {
  const lecturer = DEMO_ACCOUNTS.lecturers.find(l => l.id === lecturerId);
  if (lecturer) {
    lecturer.settings = { ...lecturer.settings, ...settings };
    return lecturer;
  }
  return null;
};