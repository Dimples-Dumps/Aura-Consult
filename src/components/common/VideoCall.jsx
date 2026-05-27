// src/components/common/VideoCall.jsx
import React from 'react';
import { DailyProvider, useDaily, useDailyEvent } from '@daily-co/daily-react';
import { X } from 'lucide-react';

const Call = ({ roomUrl, onLeave }) => {
  const callObject = useDaily();
  useDailyEvent('left-meeting', onLeave);
  useDailyEvent('left-room', onLeave);

  return roomUrl ? (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="bg-gray-900 text-white p-3 flex justify-between items-center">
        <span className="font-semibold">Live Consultation</span>
        <button onClick={onLeave} className="hover:bg-gray-700 p-1 rounded">
          <X className="w-5 h-5" />
        </button>
      </div>
      <iframe
        title="Video Call"
        src={roomUrl}
        className="w-full flex-1 border-0"
        allow="camera; microphone; fullscreen; display-capture"
      />
    </div>
  ) : null;
};

const VideoCall = ({ roomUrl, onLeave }) => (
  <DailyProvider url={roomUrl}>
    <Call roomUrl={roomUrl} onLeave={onLeave} />
  </DailyProvider>
);

export default VideoCall;