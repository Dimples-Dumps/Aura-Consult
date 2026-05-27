// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, ArrowLeft, CheckCircle, MailCheck } from 'lucide-react';
import { resetPassword } from '../services/authService';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheckEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await resetPassword(email);
    if (result.success) {
      setStep(2);
      toast.success('Reset link sent to your email!');
    } else {
      toast.error(result.error || 'Failed to send reset email');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-honey-500 to-tomato-500 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 animate-fade-in">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-gradient-to-r from-honey-500 to-tomato-500 rounded-2xl mb-3">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
          <p className="text-gray-500 text-sm">
            {step === 1 ? 'Enter your email to receive a reset link' : 'Check your inbox'}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleCheckEmail} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-tomato-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tomato-400"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-honey-500 to-tomato-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <MailCheck className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Reset link sent!</h3>
            <p className="text-gray-600 text-sm">
              We've sent a password reset link to <strong>{email}</strong>.
              Please check your inbox and follow the instructions.
              The link will expire in 1 hour.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Didn't receive the email? Check your spam folder or{' '}
              <button
                onClick={() => setStep(1)}
                className="text-tomato-600 hover:underline"
              >
                try again
              </button>
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-tomato-600 hover:text-tomato-700 flex items-center justify-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;