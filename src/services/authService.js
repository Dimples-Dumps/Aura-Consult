// src/services/authService.js
import { 
  auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signOut 
} from './firebase';

// ---------- Demo Accounts (keep as is) ----------
export const DEMO_ACCOUNTS = {
  students: [
    { id: 'student1', email: 'vuyelwa@student.com', password: 'password123', name: 'Vuyelwa Bennett', role: 'student', department: 'Computer Science' },
    { id: 'student2', email: 'buhle@student.com', password: 'password123', name: 'Buhle Molefe', role: 'student', department: 'Engineering' },
    { id: 'student3', email: 'samke@student.com', password: 'password123', name: 'Samke Khubeka', role: 'student', department: 'Business' },
    { id: 'student4', email: 'emily@student.com', password: 'password123', name: 'Emily Ngcoko', role: 'student', department: 'Data Science' },
    { id: 'student5', email: 'petunia@student.com', password: 'password123', name: 'Petunia Pogolle', role: 'student', department: 'Psychology' },
    { id: 'student6', email: 'thembelihle@student.com', password: 'password123', name: 'Thembelihle Shabangu', role: 'student', department: 'Physics' }
  ],
  lecturers: [
    { id: 'lecturer1', email: 'phindulo@aura.edu', password: 'password123', name: 'Dr. Phindulo Mavhungu', role: 'lecturer', department: 'Computer Science', settings: { autoAccept: false } },
    { id: 'lecturer2', email: 'kamzen@aura.edu', password: 'password123', name: 'Prof. Kamzen Chauke', role: 'lecturer', department: 'Mathematics', settings: { autoAccept: true } }
  ],
  admins: [
    { id: 'admin1', email: 'mpho@aura.edu', password: 'password123', name: 'Mpho Mudao', role: 'admin', department: 'Administration' },
    { id: 'admin2', email: 'tania@aura.edu', password: 'password123', name: 'Tania Pitjeng', role: 'admin', department: 'Administration' }
  ]
};

// ---------- User Storage Helpers for aura_users (global list) ----------
const getStoredUsers = () => {
  const stored = localStorage.getItem('aura_users');
  return stored ? JSON.parse(stored) : [];
};

const saveUsers = (users) => {
  localStorage.setItem('aura_users', JSON.stringify(users));
  // Dispatch event to notify admin dashboard (or any listener) that user data changed
  window.dispatchEvent(new Event('userDataUpdated'));
};

// Initialize demo users into aura_users (only once)
export const initializeAllUsers = () => {
  const existing = getStoredUsers();
  if (existing.length === 0) {
    const allDemo = [
      ...DEMO_ACCOUNTS.students,
      ...DEMO_ACCOUNTS.lecturers,
      ...DEMO_ACCOUNTS.admins
    ];
    saveUsers(allDemo);
  }
};

// Helper functions
const findDemoUser = (email, password) => {
  const allDemo = [...DEMO_ACCOUNTS.students, ...DEMO_ACCOUNTS.lecturers, ...DEMO_ACCOUNTS.admins];
  return allDemo.find(u => u.email === email && u.password === password);
};

const isDemoEmail = (email) => {
  const allDemo = [...DEMO_ACCOUNTS.students, ...DEMO_ACCOUNTS.lecturers, ...DEMO_ACCOUNTS.admins];
  return allDemo.some(u => u.email === email);
};

const storeUserProfile = (userData) => {
  try {
    localStorage.setItem('currentUser', JSON.stringify(userData));
    if (userData.uid) {
      localStorage.setItem(`user_${userData.uid}`, JSON.stringify(userData));
    }
  } catch (e) {
    console.error('LocalStorage error:', e);
    throw new Error('Failed to save user data locally');
  }
};

// ---------- Public API ----------
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    let userData = localStorage.getItem(`user_${firebaseUser.uid}`);
    if (userData) {
      userData = JSON.parse(userData);
    } else {
      userData = {
        uid: firebaseUser.uid,
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.email.split('@')[0],
        role: 'student',
        department: 'General'
      };
      localStorage.setItem(`user_${firebaseUser.uid}`, JSON.stringify(userData));
    }
    storeUserProfile(userData);
    return { success: true, user: userData, error: null };
  } catch (firebaseError) {
    const demoUser = findDemoUser(email, password);
    if (demoUser) {
      storeUserProfile(demoUser);
      return { success: true, user: demoUser, error: null };
    }
    let friendlyMessage = 'Invalid email or password';
    if (firebaseError.code === 'auth/user-not-found') friendlyMessage = 'No account found with this email.';
    if (firebaseError.code === 'auth/wrong-password') friendlyMessage = 'Incorrect password.';
    if (firebaseError.code === 'auth/too-many-requests') friendlyMessage = 'Too many failed attempts.';
    return { success: false, user: null, error: friendlyMessage };
  }
};

export const signup = async (userData) => {
  if (isDemoEmail(userData.email)) {
    return { success: false, error: 'This email is reserved for demo accounts. Please use a different email address.' };
  }

  try {
    // Create Firebase user
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
    const firebaseUser = userCredential.user;
    // Build user profile
    const fullUser = {
      uid: firebaseUser.uid,
      id: firebaseUser.uid,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      department: userData.department || 'General',
      studentId: userData.studentId || null,
      specialization: userData.specialization || null
    };
    // Store in localStorage (individual profile)
    localStorage.setItem(`user_${firebaseUser.uid}`, JSON.stringify(fullUser));
    storeUserProfile(fullUser);

    // --- ADD TO GLOBAL aura_users ---
    const allUsers = getStoredUsers();
    allUsers.push(fullUser);
    saveUsers(allUsers); // this also dispatches 'userDataUpdated' event

    return { success: true, user: fullUser };
  } catch (error) {
    console.error('Signup error:', error.code, error.message);
    let friendlyMessage = 'Signup failed. Please try again.';
    if (error.code === 'auth/email-already-in-use') friendlyMessage = 'This email is already registered. Please log in.';
    if (error.code === 'auth/weak-password') friendlyMessage = 'Password too weak (min 6 characters).';
    if (error.code === 'auth/invalid-email') friendlyMessage = 'Invalid email format.';
    return { success: false, error: friendlyMessage };
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    let friendlyMessage = 'Failed to send reset email.';
    if (error.code === 'auth/user-not-found') friendlyMessage = 'No account found with this email.';
    if (error.code === 'auth/invalid-email') friendlyMessage = 'Invalid email address.';
    return { success: false, error: friendlyMessage };
  }
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (e) {}
  localStorage.removeItem('currentUser');
};

export const isAuthenticated = () => !!localStorage.getItem('currentUser');