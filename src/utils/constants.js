export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', 
  '14:00', '15:00', '16:00', '17:00'
];

export const BOOKING_TYPES = [
  'Consultation',
  'Project Review',
  'Thesis Discussion',
  'Exam Preparation',
  'Research Guidance'
];

export const BOOKING_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

export const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  approved: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200'
};

export const STATUS_BADGES = {
  pending: '🕒 Pending',
  approved: '✅ Approved',
  rejected: '❌ Rejected'
};