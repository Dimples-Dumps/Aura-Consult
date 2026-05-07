// src/pages/AdminDashboard.jsx
import React from 'react';
import { Users, ShieldCheck, Edit, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = ({ adminId }) => {
  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">System overview and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-8 border-l-honey-500 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-honey-600 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold text-gray-800">10</p>
              <p className="text-xs text-gray-500 mt-1">6 students, 2 lecturers, 2 admins</p>
            </div>
            <Users className="w-12 h-12 text-honey-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-8 border-l-tomato-500 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-tomato-600 text-sm font-medium">Consultations</p>
              <p className="text-3xl font-bold text-gray-800">24</p>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </div>
            <ShieldCheck className="w-12 h-12 text-tomato-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-8 border-l-amber-500 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 text-sm font-medium">Pending Actions</p>
              <p className="text-3xl font-bold text-gray-800">3</p>
              <p className="text-xs text-gray-500 mt-1">Require attention</p>
            </div>
            <Settings className="w-12 h-12 text-amber-400" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-honey-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Edit className="w-5 h-5 text-tomato-500" />
          Admin Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/edit-users"
            className="flex items-center justify-between p-4 bg-honey-50 rounded-lg hover:bg-honey-100 transition group"
          >
            <div>
              <p className="font-medium text-gray-800">Manage Users</p>
              <p className="text-sm text-gray-500">Edit, add or remove system users</p>
            </div>
            <Users className="w-5 h-5 text-tomato-500 group-hover:translate-x-1 transition" />
          </Link>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg opacity-60">
            <div>
              <p className="font-medium text-gray-800">System Settings</p>
              <p className="text-sm text-gray-500">Coming soon</p>
            </div>
            <Settings className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-gray-400">
        Admin ID: {adminId || 'admin'} • Logged in as administrator
      </div>
    </div>
  );
};

export default AdminDashboard;