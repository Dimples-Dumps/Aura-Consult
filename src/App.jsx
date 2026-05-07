// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { getCurrentUser, logout } from './services/authService';
import Login from './pages/Login';
import Layout from './components/Layout/Layout';
import StudentDashboard from './pages/StudentDashboard';
import LecturerDashboard from './pages/LecturerDashboard';
import BookAppointment from './pages/BookAppointment';
import AdminDashboard from './pages/AdminDashboard';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';

// New feature pages
import CourseView from './pages/CourseView';
import LiveSession from './pages/LiveSession';
import CalendarView from './pages/CalendarView';
import TotalConsults from './pages/TotalConsults';
import ProgressBar from './pages/ProgressBar';
import TotalStats from './pages/TotalStats';
import LiveSessionsWeekly from './pages/LiveSessionsWeekly';
import EditUsers from './pages/EditUsers';
import ViewAppointments from './pages/ViewAppointments';
import ManageStudents from './pages/ManageStudents';
import ViewRequests from './pages/ViewRequests';

// Placeholders for any missing features (if needed)
// (The above imports cover all needed pages)

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) setUser(currentUser);
    setLoading(false);
  }, []);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-honey-500 to-tomato-500 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white font-medium">Loading AuraConsult...</p>
        </div>
      </div>
    );
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Toaster position="top-right" />
      <Routes>
        {/* Public routes – accessible without login */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* Protected routes – require login */}
        <Route
          path="/*"
          element={user ? <Layout user={user} logout={handleLogout} /> : <Navigate to="/login" replace />}
        >
          {/* Role‑specific home dashboard */}
          <Route index element={
            user?.role === 'student' ? <StudentDashboard studentId={user.id} /> :
            user?.role === 'lecturer' ? <LecturerDashboard lecturerId={user.id} /> :
            user?.role === 'admin' ? <AdminDashboard adminId={user.id} /> :
            <Navigate to="/login" replace />
          } />

          {/* Common routes for students & lecturers */}
          <Route path="courses" element={<CourseView />} />
          <Route path="live-session" element={<LiveSession />} />
          <Route path="calendar" element={<CalendarView />} />
          <Route path="total-consults" element={<TotalConsults />} />
          <Route path="progress" element={<ProgressBar />} />

          {/* Student‑only routes */}
          <Route path="book-appointment" element={<BookAppointment studentId={user?.id} studentName={user?.name} />} />
          {user?.role === 'student' && (
            <Route path="view-requests" element={<ViewRequests studentId={user.id} />} />
          )}

          {/* Lecturer‑only routes */}
          {user?.role === 'lecturer' && (
            <>
              <Route path="manage-students" element={<ManageStudents />} />
              <Route path="view-appointments" element={<ViewAppointments lecturerId={user.id} />} />
            </>
          )}

          {/* Admin‑only routes */}
          {user?.role === 'admin' && (
            <>
              <Route path="edit-users" element={<EditUsers />} />
              <Route path="total-stats" element={<TotalStats />} />
              <Route path="live-sessions-weekly" element={<LiveSessionsWeekly />} />
            </>
          )}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;