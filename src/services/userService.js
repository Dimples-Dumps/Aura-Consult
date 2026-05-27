// src/services/userService.js
import { DEMO_ACCOUNTS } from './authService';

// Helper: Get all users from localStorage (includes both demo copies and new signups)
const getAllStoredUsers = () => {
  const stored = localStorage.getItem('aura_users');
  return stored ? JSON.parse(stored) : [];
};

// Helper: Save all users to localStorage
const saveAllStoredUsers = (users) => {
  localStorage.setItem('aura_users', JSON.stringify(users));
};

// Initialize: copy all demo users into localStorage if not already present
export const initializeAllUsers = () => {
  const existing = getAllStoredUsers();
  if (existing.length > 0) return existing; // already initialized

  const allDemo = [
    ...(DEMO_ACCOUNTS.students || []),
    ...(DEMO_ACCOUNTS.lecturers || []),
    ...(DEMO_ACCOUNTS.admins || [])
  ];
  saveAllStoredUsers(allDemo);
  return allDemo;
};

// Get all users (for admin)
export const getAllUsers = async () => {
  return getAllStoredUsers();
};

// Get all lecturers (demo + registered) – used in booking
export const getAllLecturers = async () => {
  const allUsers = getAllStoredUsers();
  return allUsers.filter(u => u.role === 'lecturer');
};

// Get all students
export const getAllStudents = async () => {
  const allUsers = getAllStoredUsers();
  return allUsers.filter(u => u.role === 'student');
};

// Get user by ID
export const getUserById = async (userId) => {
  const allUsers = getAllStoredUsers();
  return allUsers.find(u => u.id === userId) || null;
};

// Update user (admin)
export const updateUser = async (userId, updatedData) => {
  const users = getAllStoredUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index !== -1) {
    users[index] = { ...users[index], ...updatedData };
    saveAllStoredUsers(users);
    return users[index];
  }
  return null;
};

// Delete user (admin)
export const deleteUser = async (userId) => {
  const users = getAllStoredUsers();
  const filtered = users.filter(u => u.id !== userId);
  saveAllStoredUsers(filtered);
  return true;
};

// Add new user (admin)
export const addUser = async (userData) => {
  const users = getAllStoredUsers();
  const newId = `${userData.role}_${Date.now()}`;
  const newUser = { ...userData, id: newId };
  users.push(newUser);
  saveAllStoredUsers(users);
  return newUser;
};

// For consistency, also export the save function if needed
export { getAllStoredUsers as getRawAllUsers };