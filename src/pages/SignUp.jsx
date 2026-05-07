import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, User, Mail, Lock, Building, BookOpen, ArrowLeft, CheckCircle, Briefcase, Calendar, Award, Shield } from 'lucide-react';
import { signup, getCurrentUser } from '../services/authService';
import toast from 'react-hot-toast';

const SignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    studentId: '',
    specialization: '',
    adminCode: ''
  });
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (getCurrentUser()) navigate('/');
  }, [navigate]);

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    // Validate step 2 fields
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.department) {
      toast.error('Please fill all required fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setStep(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate role-specific fields
    if (role === 'student' && !formData.studentId) {
      toast.error('Please enter your Student ID');
      return;
    }
    if (role === 'lecturer' && !formData.specialization) {
      toast.error('Please enter your specialization');
      return;
    }
    if (role === 'admin' && formData.adminCode !== 'ADMIN123') {
      toast.error('Invalid admin code');
      return;
    }

    setLoading(true);
    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: role,
      department: formData.department,
      studentId: formData.studentId,
      specialization: formData.specialization
    };
    const result = signup(userData);
    if (result.success) {
      toast.success('Account created successfully! Welcome!');
      setTimeout(() => navigate('/'), 1500);
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  const roles = [
    {
      value: 'student',
      title: 'Student',
      icon: <User className="w-12 h-12" />,
      description: 'Book appointments, view timetable, track requests',
      color: 'from-honey-400 to-tomato-500'
    },
    {
      value: 'lecturer',
      title: 'Lecturer',
      icon: <BookOpen className="w-12 h-12" />,
      description: 'Manage students, approve appointments, view schedule',
      color: 'from-honey-500 to-tomato-600'
    },
    {
      value: 'admin',
      title: 'Administrator',
      icon: <Shield className="w-12 h-12" />,
      description: 'Manage users, system settings, oversee platform',
      color: 'from-tomato-500 to-tomato-700'
    }
  ];

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
            step >= s ? 'bg-tomato-500 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            {s}
          </div>
          {s < 3 && <div className={`w-12 h-0.5 mx-2 ${step > s ? 'bg-tomato-500' : 'bg-gray-200'}`} />}
        </div>
      ))}
    </div>
  );

  const renderRoleSelection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center">Choose your role</h2>
      <p className="text-gray-500 text-center text-sm">Select the account type that matches your position</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {roles.map((r) => (
          <button
            key={r.value}
            onClick={() => handleRoleSelect(r.value)}
            className={`group p-6 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-xl ${
              role === r.value
                ? 'border-tomato-500 bg-gradient-to-br from-honey-50 to-white shadow-md'
                : 'border-honey-200 hover:border-tomato-300 bg-white'
            }`}
          >
            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${r.color} text-white mb-4 group-hover:scale-105 transition`}>
              {r.icon}
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">{r.title}</h3>
            <p className="text-sm text-gray-500">{r.description}</p>
          </button>
        ))}
      </div>
    </div>
  );

  const renderBasicInfo = () => (
    <form onSubmit={handleNext} className="space-y-5">
      <h2 className="text-2xl font-bold text-gray-800">Your details</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-tomato-400" />
          <input type="text" name="name" value={formData.name} onChange={handleChange} required
            className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tomato-400"
            placeholder="e.g., Thabo Nkosi" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-tomato-400" />
          <input type="email" name="email" value={formData.email} onChange={handleChange} required
            className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tomato-400"
            placeholder="you@example.com" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
        <div className="relative">
          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-tomato-400" />
          <select name="department" value={formData.department} onChange={handleChange} required
            className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tomato-400">
            <option value="">Select department</option>
            <option>Computer Science</option><option>Engineering</option><option>Business</option>
            <option>Data Science</option><option>Psychology</option><option>Physics</option>
            <option>Mathematics</option><option>Administration</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-tomato-400" />
          <input type="password" name="password" value={formData.password} onChange={handleChange} required
            className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tomato-400" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-tomato-400" />
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required
            className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tomato-400" />
        </div>
      </div>
      <button type="submit" className="w-full bg-gradient-to-r from-honey-500 to-tomato-500 text-white py-2 rounded-lg font-semibold hover:shadow-md transition">
        Continue →
      </button>
    </form>
  );

  const renderRoleSpecificQuestions = () => (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-2xl font-bold text-gray-800">Additional information</h2>
      {role === 'student' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Student ID / Year</label>
          <div className="relative">
            <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-tomato-400" />
            <input type="text" name="studentId" value={formData.studentId} onChange={handleChange} required
              className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tomato-400"
              placeholder="e.g., S12345 or 3rd Year" />
          </div>
        </div>
      )}
      {role === 'lecturer' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Specialization / Research Area</label>
          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-tomato-400" />
            <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} required
              className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tomato-400"
              placeholder="e.g., Machine Learning, Quantum Physics" />
          </div>
        </div>
      )}
      {role === 'admin' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Admin Code</label>
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-tomato-400" />
            <input type="password" name="adminCode" value={formData.adminCode} onChange={handleChange} required
              className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tomato-400"
              placeholder="Enter admin code" />
          </div>
          <p className="text-xs text-gray-400 mt-1">Hint: ADMIN123</p>
        </div>
      )}
      <button type="submit" disabled={loading}
        className="w-full bg-gradient-to-r from-honey-500 to-tomato-500 text-white py-2 rounded-lg font-semibold hover:shadow-md transition disabled:opacity-50">
        {loading ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-honey-500 to-tomato-600 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 animate-fade-in">
        <div className="text-center mb-4">
          <div className="inline-flex p-3 bg-gradient-to-r from-honey-500 to-tomato-500 rounded-2xl mb-2">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Join AuraConsult</h2>
          <p className="text-gray-500 text-sm">Create your account in three easy steps</p>
        </div>

        {renderStepIndicator()}

        {step === 1 && renderRoleSelection()}
        {step === 2 && renderBasicInfo()}
        {step === 3 && renderRoleSpecificQuestions()}

        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-tomato-600 hover:text-tomato-700 font-medium">Sign in</Link>
        </div>
        {step > 1 && (
          <div className="text-center mt-3">
            <button onClick={() => setStep(step - 1)} className="text-xs text-gray-400 hover:text-gray-600">
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;