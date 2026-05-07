import { useState, useEffect } from 'react';
import { getUserById, MOCK_USERS } from '../services/userService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('student');

  useEffect(() => {
    // Mock authentication - in real app, this would check Firebase Auth
    const mockLogin = async () => {
      setLoading(true);
      try {
        // Default to student
        const defaultUser = MOCK_USERS.find(u => u.role === 'student');
        setUser(defaultUser);
        setRole(defaultUser.role);
      } catch (error) {
        console.error('Auth error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    mockLogin();
  }, []);

  const switchRole = async (newRole) => {
    const newUser = MOCK_USERS.find(u => u.role === newRole);
    if (newUser) {
      setUser(newUser);
      setRole(newRole);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setRole('student');
  };

  return { user, role, loading, switchRole, logout };
};