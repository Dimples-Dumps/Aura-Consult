import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginWithEmail, DEMO_ACCOUNTS } from '../services/authService';
import { GraduationCap, Mail, Lock, Eye, EyeOff, Users, UserPlus, Calendar, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDemoInfo, setShowDemoInfo] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await loginWithEmail(email, password);
    if (result.success) {
      toast.success(`Welcome back, ${result.user.name}! 🍯🍅`);
      onLogin(result.user);
      navigate('/');
    } else {
      toast.error('Invalid email or password');
      setLoading(false);
    }
  };

  // Only populate fields, do NOT auto‑login
  const handleDemoClick = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    // Optional: show a small hint that form is filled
    toast.success(`Credentials filled for ${demoEmail}`, { icon: '✏️' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-honey-500 via-tomato-500 to-tomato-600 flex items-center justify-center p-4">
      <div className="relative w-full max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left brand card (glass) */}
          <div className="hidden lg:block">
            <div className="glass rounded-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-white/20 p-2 rounded-xl">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">AuraConsult</h1>
                  <p className="text-honey-100 text-sm">Academic Consultation Portal</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg"><Calendar className="w-5 h-5" /></div>
                  <div><p className="font-semibold">Easy Scheduling</p><p className="text-sm text-honey-100">Book consultations in seconds</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg"><Clock className="w-5 h-5" /></div>
                  <div><p className="font-semibold">Real-time Availability</p><p className="text-sm text-honey-100">See live lecturer schedules</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg"><CheckCircle className="w-5 h-5" /></div>
                  <div><p className="font-semibold">Instant Notifications</p><p className="text-sm text-honey-100">Get updates on your requests</p></div>
                </div>
              </div>
            </div>
          </div>

          {/* Login card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-8 animate-fade-in border border-honey-200">
            <div className="text-center mb-6">
              <div className="inline-flex p-3 bg-gradient-to-r from-honey-500 to-tomato-500 rounded-2xl mb-3">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
              <p className="text-gray-500 text-sm mt-1">Sign in to access your dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-tomato-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tomato-400 focus:border-transparent transition"
                    placeholder="student@example.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-tomato-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tomato-400 focus:border-transparent transition"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-honey-500 to-tomato-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="loader-sm"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Forgot Password & Sign Up links */}
            <div className="text-center mt-4">
              <Link to="/forgot-password" className="text-sm text-tomato-600 hover:text-tomato-700">
                Forgot password?
              </Link>
            </div>
            <div className="text-center text-sm text-gray-500 mt-2">
              Don't have an account?{' '}
              <Link to="/signup" className="text-tomato-600 hover:text-tomato-700 font-medium">
                Sign up
              </Link>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setShowDemoInfo(!showDemoInfo)}
                className="w-full flex items-center justify-center gap-2 text-tomato-600 hover:text-tomato-700 transition text-sm font-medium"
              >
                <Users className="w-4 h-4" />
                {showDemoInfo ? 'Hide Demo Accounts' : 'Show Demo Accounts'}
                <UserPlus className="w-4 h-4" />
              </button>

              {showDemoInfo && (
                <div className="mt-4 space-y-3 animate-fade-in">
                  <div className="bg-honey-50 rounded-xl p-3 border border-honey-200">
                    <p className="text-honey-800 text-sm font-semibold mb-2">🎓 STUDENTS</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {DEMO_ACCOUNTS.students.map((student) => (
                        <button
                          key={student.id}
                          onClick={() => handleDemoClick(student.email, 'password123')}
                          className="text-left text-gray-700 hover:text-tomato-600 hover:bg-honey-100 px-2 py-1 rounded transition text-sm truncate"
                        >
                          {student.email}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-3 border border-tomato-200">
                    <p className="text-tomato-800 text-sm font-semibold mb-2">👨‍🏫 LECTURERS</p>
                    <div className="space-y-1 text-sm">
                      {DEMO_ACCOUNTS.lecturers.map((lecturer) => (
                        <button
                          key={lecturer.id}
                          onClick={() => handleDemoClick(lecturer.email, 'password123')}
                          className="block w-full text-left text-gray-700 hover:text-tomato-600 hover:bg-orange-100 px-2 py-1 rounded transition text-sm truncate"
                        >
                          {lecturer.email}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
                    <p className="text-amber-800 text-sm font-semibold mb-2">👑 ADMINS</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {DEMO_ACCOUNTS.admins?.map((admin) => (
                        <button
                          key={admin.id}
                          onClick={() => handleDemoClick(admin.email, 'password123')}
                          className="text-left text-gray-700 hover:text-tomato-600 hover:bg-amber-100 px-2 py-1 rounded transition text-sm truncate"
                        >
                          {admin.email}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;