// src/services/authService.js
export const DEMO_ACCOUNTS = {
  students: [
    { id: 'student1', email: 'vuyelwa@student.com', password: 'password123', name: 'Vuyelwa Nkosi', role: 'student', department: 'Computer Science' },
    { id: 'student2', email: 'buhle@student.com', password: 'password123', name: 'Buhle Dlamini', role: 'student', department: 'Engineering' },
    { id: 'student3', email: 'samke@student.com', password: 'password123', name: 'Samke Mkhize', role: 'student', department: 'Business' },
    { id: 'student4', email: 'petunia@student.com', password: 'password123', name: 'Petunia Ngcobo', role: 'student', department: 'Data Science' },
    { id: 'student5', email: 'emily@student.com', password: 'password123', name: 'Emily Molefe', role: 'student', department: 'Psychology' },
    { id: 'student6', email: 'thembelihle@student.com', password: 'password123', name: 'Thembelihle Ndlovu', role: 'student', department: 'Physics' }
  ],
  lecturers: [
    { id: 'lecturer1', email: 'phindulo@aura.edu', password: 'password123', name: 'Dr. Phindulo Mbeki', role: 'lecturer', department: 'Computer Science', settings: { autoAccept: false } },
    { id: 'lecturer2', email: 'kamzen@aura.edu', password: 'password123', name: 'Prof. Kamzen Zulu', role: 'lecturer', department: 'Mathematics', settings: { autoAccept: true } }
  ],
  admins: [
    { id: 'admin1', email: 'mpho@aura.edu', password: 'password123', name: 'Mpho Makgopa', role: 'admin', department: 'Administration' },
    { id: 'admin2', email: 'tania@aura.edu', password: 'password123', name: 'Tania Morake', role: 'admin', department: 'Administration' }
  ]
};

// Load users from localStorage or initialize with demo
const getStoredUsers = () => {
  const stored = localStorage.getItem('aura_users');
  if (stored) return JSON.parse(stored);
  const allUsers = [...DEMO_ACCOUNTS.students, ...DEMO_ACCOUNTS.lecturers, ...DEMO_ACCOUNTS.admins];
  localStorage.setItem('aura_users', JSON.stringify(allUsers));
  return allUsers;
};

const saveUsers = (users) => {
  localStorage.setItem('aura_users', JSON.stringify(users));
};

export const loginWithEmail = async (email, password) => {
  const users = getStoredUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return { success: true, user, error: null };
  }
  return { success: false, user: null, error: 'Invalid email or password' };
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
};

export const logout = () => {
  localStorage.removeItem('currentUser');
};

export const isAuthenticated = () => {
  return localStorage.getItem('currentUser') !== null;
};

// Sign up new user
export const signup = (userData) => {
  const users = getStoredUsers();
  // Check if email already exists
  if (users.find(u => u.email === userData.email)) {
    return { success: false, error: 'Email already registered' };
  }
  const newUser = {
    id: `${userData.role}_${Date.now()}`,
    ...userData
  };
  users.push(newUser);
  saveUsers(users);
  // Auto-login after signup
  localStorage.setItem('currentUser', JSON.stringify(newUser));
  return { success: true, user: newUser };
};

// Reset password
export const resetPassword = (email, newPassword) => {
  const users = getStoredUsers();
  const userIndex = users.findIndex(u => u.email === email);
  if (userIndex === -1) {
    return { success: false, error: 'Email not found' };
  }
  users[userIndex].password = newPassword;
  saveUsers(users);
  return { success: true };
};

// Check if email exists (for forgot password flow)
export const checkEmailExists = (email) => {
  const users = getStoredUsers();
  return users.some(u => u.email === email);
};