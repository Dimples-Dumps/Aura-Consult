export const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatTime = (timeString) => {
  return timeString;
};

export const generateId = () => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const validateBooking = (booking) => {
  const errors = [];
  if (!booking.lecturerId) errors.push('Please select a lecturer');
  if (!booking.day) errors.push('Please select a day');
  if (!booking.time) errors.push('Please select a time');
  if (!booking.type) errors.push('Please select a session type');
  return errors;
};