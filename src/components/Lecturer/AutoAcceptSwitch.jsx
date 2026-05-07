import React, { useState, useEffect } from 'react';
import { getUserById, updateLecturerSettings } from '../../services/userService';
import { Settings, Zap } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const AutoAcceptSwitch = ({ lecturerId }) => {
  const [autoAccept, setAutoAccept] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadSettings();
  }, [lecturerId]);

  const loadSettings = async () => {
    try {
      const user = await getUserById(lecturerId);
      setAutoAccept(user?.settings?.autoAccept || false);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAutoAccept = async () => {
    setUpdating(true);
    try {
      const newValue = !autoAccept;
      await updateLecturerSettings(lecturerId, { autoAccept: newValue });
      setAutoAccept(newValue);
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Error updating settings');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Booking Settings
        </h2>
        <p className="text-purple-100 text-sm mt-1">Configure automatic booking approval</p>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Zap className={`w-5 h-5 ${autoAccept ? 'text-yellow-500' : 'text-gray-400'}`} />
              <h3 className="font-semibold text-gray-800">Auto-Accept Bookings</h3>
            </div>
            <p className="text-sm text-gray-600">
              When enabled, all incoming booking requests will be automatically approved.
              When disabled, you'll need to manually review and approve each request.
            </p>
            <div className="mt-3 text-xs text-gray-500">
              Current: {autoAccept ? 'Auto-approving all requests' : 'Manual approval required'}
            </div>
          </div>
          
          <button
            onClick={toggleAutoAccept}
            disabled={updating}
            className={`relative inline-flex h-12 w-24 items-center rounded-full transition-all duration-300 ${
              autoAccept ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gray-300'
            } ${updating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span
              className={`inline-block h-10 w-10 transform rounded-full bg-white shadow-lg transition-all duration-300 ${
                autoAccept ? 'translate-x-12' : 'translate-x-1'
              }`}
            />
            <span className={`absolute text-xs font-semibold ${
              autoAccept ? 'left-2 text-white' : 'right-2 text-gray-600'
            }`}>
              {autoAccept ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>

        {autoAccept && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              ✅ Auto-accept is enabled. All new booking requests will be automatically approved.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutoAcceptSwitch;