// src/context/NotificationContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children, currentUserId }) => {
  const [notifications, setNotifications] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    if (!currentUserId) return;
    const stored = localStorage.getItem(`notifications_${currentUserId}`);
    if (stored) {
      setNotifications(JSON.parse(stored));
    }
  }, [currentUserId]);

  // Save to localStorage whenever notifications change
  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem(`notifications_${currentUserId}`, JSON.stringify(notifications));
    }
  }, [notifications, currentUserId]);

  const addNotification = (message, type = 'info', link = null) => {
    const newNotif = {
      id: Date.now(),
      message,
      type, // 'info', 'success', 'warning'
      link,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead
    }}>
      {children}
    </NotificationContext.Provider>
  );
};