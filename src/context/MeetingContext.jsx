// src/context/MeetingContext.jsx
import React, { createContext, useContext, useState } from 'react';

const MeetingContext = createContext();

export const useMeeting = () => useContext(MeetingContext);

export const MeetingProvider = ({ children }) => {
  const [roomUrl, setRoomUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const createMeetingRoom = async (sessionId, title) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api.daily.co/v1/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_DAILY_API_KEY}`
        },
        body: JSON.stringify({
          name: `${title.replace(/\s/g, '-')}-${sessionId}-${Date.now()}`,
          privacy: 'public',
          properties: {
            enable_chat: true,
            enable_screenshare: true,
            start_video_off: false,
            start_audio_off: false,
            lang: 'en',
            exp: Math.floor(Date.now() / 1000) + 3600 // expires in 1 hour
          }
        })
      });
      const data = await response.json();
      setRoomUrl(data.url);
      return data.url;
    } catch (error) {
      console.error('Failed to create meeting room:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const endMeeting = () => {
    setRoomUrl(null);
  };

  return (
    <MeetingContext.Provider value={{ roomUrl, isLoading, createMeetingRoom, endMeeting }}>
      {children}
    </MeetingContext.Provider>
  );
};