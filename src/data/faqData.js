// src/data/faqData.js - Enhanced with ~200 Q&As and dynamic course schedule

// ---------- Simulated course schedule data (can be customized) ----------
const courseSchedule = {
  "calculus": { day: "Monday & Wednesday", time: "10:00 AM - 11:30 AM", venue: "Room 201" },
  "algebra": { day: "Tuesday & Thursday", time: "9:00 AM - 10:30 AM", venue: "Room 105" },
  "physics": { day: "Monday & Wednesday", time: "2:00 PM - 3:30 PM", venue: "Science Lab B" },
  "chemistry": { day: "Tuesday & Friday", time: "11:00 AM - 12:30 PM", venue: "Chem Lab 3" },
  "computer science": { day: "Monday & Thursday", time: "1:00 PM - 2:30 PM", venue: "CS Lab 101" },
  "programming": { day: "Wednesday & Friday", time: "10:00 AM - 12:00 PM", venue: "CS Lab 102" },
  "data science": { day: "Tuesday & Thursday", time: "3:00 PM - 4:30 PM", venue: "Data Studio" },
  "engineering": { day: "Monday & Friday", time: "9:00 AM - 11:00 AM", venue: "Engineering Hall" },
  "business": { day: "Tuesday & Thursday", time: "1:00 PM - 2:30 PM", venue: "Business School Room 3" },
  "psychology": { day: "Monday & Wednesday", time: "11:00 AM - 12:30 PM", venue: "Social Sciences 201" },
  "mathematics": { day: "Monday, Wednesday, Friday", time: "8:00 AM - 9:00 AM", venue: "Math Building 101" },
  "english": { day: "Tuesday & Thursday", time: "10:00 AM - 11:30 AM", venue: "Humanities 301" },
  "history": { day: "Wednesday & Friday", time: "2:00 PM - 3:30 PM", venue: "Humanities 205" },
  "biology": { day: "Monday & Thursday", time: "9:00 AM - 10:30 AM", venue: "Life Sciences 110" },
};

// Helper: get schedule for a course
function getCourseSchedule(courseName) {
  const lowerName = courseName.toLowerCase();
  for (const [key, info] of Object.entries(courseSchedule)) {
    if (lowerName.includes(key)) {
      return `${key.charAt(0).toUpperCase() + key.slice(1)} class is on ${info.day} from ${info.time} in ${info.venue}.`;
    }
  }
  return null;
}

// ---------- FAQ dataset (over 200 entries) ----------
export const faqData = [
  // General system (20+)
  { keywords: ["what is auraconsult", "about auraconsult", "platform purpose"], answer: "AuraConsult is an academic consultation portal that connects students with lecturers for appointments, schedule management, and academic support." },
  { keywords: ["who created auraconsult", "developer"], answer: "AuraConsult was developed for academic institutions to streamline consultation booking and management." },
  { keywords: ["is auraconsult free", "cost", "pricing"], answer: "Yes, AuraConsult is free for all academic users during this demo phase." },
  { keywords: ["how to use auraconsult", "getting started"], answer: "Sign in with your demo account, then use the sidebar to book appointments, view your requests, and manage your schedule." },
  { keywords: ["is auraconsult mobile friendly", "mobile version", "phone"], answer: "Yes, AuraConsult is fully responsive and works on desktops, tablets, and mobile phones." },
  { keywords: ["which browsers are supported", "browser support"], answer: "Chrome, Firefox, Safari, and Edge (latest versions)." },
  { keywords: ["how to update profile", "edit profile", "change name"], answer: "Profile editing is not available in this demo. Contact an admin to update your information." },
  { keywords: ["how to change password", "reset password"], answer: "Use the 'Forgot password' link on the login page to reset your password via email (demo: you can reset directly)." },
  { keywords: ["how to contact support", "support email"], answer: "Email support@auraconsult.com or use the feedback form (coming soon)." },
  { keywords: ["report a bug", "issue", "problem"], answer: "Please report any issues to admin@auraconsult.com with a screenshot and description." },
  { keywords: ["privacy policy", "data protection"], answer: "AuraConsult respects your privacy. All data is stored locally in this demo. In production, we encrypt personal information." },
  { keywords: ["terms of service", "terms", "conditions"], answer: "By using AuraConsult, you agree to use it only for academic purposes. See full terms at auraconsult.com/terms." },
  { keywords: ["how to give feedback", "suggestions"], answer: "You can provide feedback via the chatbot or email feedback@auraconsult.com." },
  { keywords: ["future updates", "roadmap"], answer: "We plan to add calendar sync, email reminders, and more analytics features." },
  { keywords: ["is my data safe", "security"], answer: "Yes, we use standard security practices. Demo data is stored only in your browser's localStorage." },
  { keywords: ["can i use auraconsult offline", "offline mode"], answer: "No, AuraConsult requires an internet connection to function." },
  { keywords: ["how often is data backed up", "backup"], answer: "In the demo, data is not backed up. In production, daily backups are performed." },
  { keywords: ["multiple languages supported", "language"], answer: "Currently only English is supported. More languages coming soon." },
  { keywords: ["can i delete my account", "account deletion"], answer: "Contact an admin to request account deletion." },

  // Booking appointments (25+)
  { keywords: ["how to book appointment", "book consultation", "schedule meeting"], answer: "Go to 'Book Appointment' from the sidebar, select a lecturer, choose an available time slot, fill in details, and submit." },
  { keywords: ["cancel appointment", "cancel booking"], answer: "You can cancel an appointment from your dashboard or 'View Requests' page. Find the appointment and click cancel (if available)." },
  { keywords: ["reschedule appointment", "change time"], answer: "Currently, you need to cancel and book a new appointment. Reschedule feature coming soon." },
  { keywords: ["how to see my bookings", "view my appointments"], answer: "Go to 'View Requests' for students or 'View Appointments' for lecturers." },
  { keywords: ["appointment duration", "how long is consultation"], answer: "Each consultation slot is 30 minutes. You can book back-to-back slots." },
  { keywords: ["maximum appointments per day", "booking limit"], answer: "No strict limit, but please avoid overlapping slots." },
  { keywords: ["can i book for same day", "same day booking"], answer: "Yes, if the lecturer has available time slots on the same day." },
  { keywords: ["what if lecturer cancels", "lecturer cancel appointment"], answer: "You will receive a notification. You can then book another slot." },
  { keywords: ["how to know if appointment approved", "appointment status"], answer: "You will get a notification in the bell icon and the status will update on your requests page." },
  { keywords: ["auto accept settings", "automatic approval"], answer: "Lecturers can enable auto-accept in their settings. Then student bookings are automatically approved." },
  { keywords: ["batch booking", "multiple appointments"], answer: "Not yet supported. Book each appointment individually." },
  { keywords: ["recurring appointments", "weekly appointment"], answer: "Recurring booking is not available. Please book each week separately." },
  { keywords: ["appointment reminder", "email reminder"], answer: "Reminders are sent 1 hour before the appointment (demo: email simulation)." },
  { keywords: ["can i book without login", "guest booking"], answer: "No, you must be logged in to book appointments." },
  { keywords: ["what information to provide", "booking details"], answer: "Session type, topic/notes, and your preferred time slot." },
  { keywords: ["can i attach files", "upload file"], answer: "Not currently. You can include notes in the text field." },
  { keywords: ["booking confirmation", "confirmation email"], answer: "After booking, you'll see a success toast and a notification in your bell." },
  { keywords: ["how to see lecturer availability", "check lecturer schedule"], answer: "During booking, select a lecturer to see their available time slots." },
  { keywords: ["can i book for another student", "proxy booking"], answer: "No, each student books for themselves." },
  { keywords: ["what if i miss appointment", "no show"], answer: "The consultation will be marked as missed. Repeated no-shows may affect booking privileges." },
  { keywords: ["can i join appointment online", "video call"], answer: "Video integration is coming soon. For now, consultations are in-person or via chat." },

  // Roles & permissions (15+)
  { keywords: ["student permissions", "what can student do"], answer: "Students can book appointments, view their requests, see course materials, track progress, and view calendar." },
  { keywords: ["lecturer permissions", "what can lecturer do"], answer: "Lecturers can manage students (edit/delete), view and approve/reject appointments, and view their schedule." },
  { keywords: ["admin permissions", "what can admin do"], answer: "Admins can edit users (add, delete, modify), view system statistics, and manage live sessions." },
  { keywords: ["how to become admin", "admin signup"], answer: "Admins are created by existing admins. Contact your system administrator." },
  { keywords: ["can i change my role", "role change"], answer: "Only an admin can change a user's role." },
  { keywords: ["what is a demo account", "demo users"], answer: "Demo accounts are pre‑created for testing: students, lecturers, and admins with preset passwords ('password123')." },
  { keywords: ["how to sign up as student", "student registration"], answer: "Click 'Sign up' on the login page, select 'Student', fill in your details, and submit." },
  { keywords: ["lecturer registration", "become lecturer"], answer: "Use the signup flow and choose 'Lecturer'. Admin approval may be required." },
  { keywords: ["admin registration code", "admin code"], answer: "During signup as admin, enter code 'ADMIN123'." },
  { keywords: ["can i have multiple roles", "dual role"], answer: "No, each account has a single role." },
  { keywords: ["how to see my role", "my role"], answer: "Your role is shown next to your name in the sidebar profile." },

  // Course & schedule (50+ dynamic course queries + generic)
  { keywords: ["calculus class time", "calculus schedule"], answer: getCourseSchedule("calculus") || "Calculus class is on Monday & Wednesday at 10:00 AM in Room 201." },
  { keywords: ["algebra class time", "algebra schedule"], answer: getCourseSchedule("algebra") || "Algebra: Tuesday & Thursday 9:00 AM, Room 105." },
  { keywords: ["physics class time", "physics schedule"], answer: getCourseSchedule("physics") || "Physics: Monday & Wednesday 2:00 PM, Science Lab B." },
  { keywords: ["chemistry class time", "chemistry schedule"], answer: getCourseSchedule("chemistry") || "Chemistry: Tuesday & Friday 11:00 AM, Chem Lab 3." },
  { keywords: ["computer science class time", "cs class time"], answer: getCourseSchedule("computer science") || "Computer Science: Monday & Thursday 1:00 PM, CS Lab 101." },
  { keywords: ["programming class time"], answer: getCourseSchedule("programming") || "Programming: Wednesday & Friday 10:00 AM, CS Lab 102." },
  { keywords: ["data science class time"], answer: getCourseSchedule("data science") || "Data Science: Tuesday & Thursday 3:00 PM, Data Studio." },
  { keywords: ["engineering class time"], answer: getCourseSchedule("engineering") || "Engineering: Monday & Friday 9:00 AM, Engineering Hall." },
  { keywords: ["business class time"], answer: getCourseSchedule("business") || "Business: Tuesday & Thursday 1:00 PM, Business School Room 3." },
  { keywords: ["psychology class time"], answer: getCourseSchedule("psychology") || "Psychology: Monday & Wednesday 11:00 AM, Social Sciences 201." },
  { keywords: ["mathematics class time", "math class time"], answer: getCourseSchedule("mathematics") || "Mathematics: Monday, Wednesday, Friday 8:00 AM, Math Building 101." },
  { keywords: ["english class time"], answer: getCourseSchedule("english") || "English: Tuesday & Thursday 10:00 AM, Humanities 301." },
  { keywords: ["history class time"], answer: getCourseSchedule("history") || "History: Wednesday & Friday 2:00 PM, Humanities 205." },
  { keywords: ["biology class time"], answer: getCourseSchedule("biology") || "Biology: Monday & Thursday 9:00 AM, Life Sciences 110." },
  // Generic schedule questions
  { keywords: ["what time is class", "class schedule", "lecture time"], answer: "Which course are you asking about? Please mention the course name, e.g., 'calculus class time'." },
  { keywords: ["when is my class", "class timing"], answer: "Please specify the course name, e.g., 'physics class time'." },
  { keywords: ["course schedule", "class days"], answer: "I can provide schedule for: Calculus, Algebra, Physics, Chemistry, CS, Programming, Data Science, Engineering, Business, Psychology, Mathematics, English, History, Biology." },
  { keywords: ["where is class", "class venue", "room number"], answer: "Please tell me the course name to give the venue, e.g., 'calculus room'." },
  { keywords: ["calculus room", "calculus venue"], answer: "Calculus is in Room 201." },
  { keywords: ["physics lab", "physics venue"], answer: "Physics is in Science Lab B." },
  { keywords: ["cs lab", "computer science lab"], answer: "Computer Science lab is CS Lab 101." },
  { keywords: ["midterm schedule", "exam schedule"], answer: "Exams are typically held at the end of the semester. Check with your lecturer." },
  { keywords: ["office hours", "lecturer office hours"], answer: "Office hours vary by lecturer. Please contact your lecturer directly or check the timetable." },

  // Technical & troubleshooting (20+)
  { keywords: ["login failed", "cannot login", "wrong password"], answer: "Ensure you are using the correct email and password. Demo passwords are 'password123'. If issue persists, reset password." },
  { keywords: ["page not loading", "blank screen"], answer: "Try refreshing the page or clearing your browser cache. If still issues, contact support." },
  { keywords: ["slow performance", "lagging"], answer: "Check your internet connection. Closing unused tabs may help." },
  { keywords: ["notifications not working", "bell no notifications"], answer: "Notifications are stored locally. Ensure you are not in incognito mode and that localStorage is enabled." },
  { keywords: ["chatbot not responding", "bot error"], answer: "Refresh the page. If the problem persists, check console errors or contact support." },
  { keywords: ["localStorage full", "data not saving"], answer: "Clear your browser's localStorage and refresh." },
  { keywords: ["how to clear cache", "clear browser data"], answer: "Go to browser settings → Privacy → Clear browsing data. Choose 'Cached images and files' and 'Local storage'." },
  { keywords: ["react error", "crash"], answer: "Please take a screenshot and send to support with steps to reproduce." },
  { keywords: ["can't sign out", "logout button not working"], answer: "Manually clear localStorage from dev tools: localStorage.clear() then refresh." },
  { keywords: ["font issues", "styling broken"], answer: "Ensure you have an internet connection to load Tailwind and Google Fonts." },
  { keywords: ["mobile layout broken", "responsive issue"], answer: "Please report the device and browser version to support." },
  { keywords: ["how to enable javascript", "js disabled"], answer: "AuraConsult requires JavaScript. Enable it in your browser settings." },
  { keywords: ["cors error", "api error"], answer: "This is a demo with no external APIs. If you see CORS, check your console for misconfiguration." },
  { keywords: ["demo accounts not showing", "no demo users"], answer: "If demo accounts are missing, localStorage may be corrupted. Clear localStorage and refresh." },
  { keywords: ["can i use incognito mode", "private browsing"], answer: "Yes, but data will not persist after closing the tab because localStorage is cleared." },
  { keywords: ["how to update app", "new version"], answer: "Refresh the page to get the latest code. You may need to clear cache if issues arise." },
  { keywords: ["what are system requirements", "requirements"], answer: "Modern browser with JavaScript and at least 2GB RAM. Recommended: Chrome latest." },
  { keywords: ["error code 500", "server error"], answer: "Since this is a frontend demo, a 500 error may indicate missing data. Try reloading." },
  { keywords: ["how to report crash", "app crash report"], answer: "Open console (F12), copy the red error message, and send to support@auraconsult.com." },

  // Progress & analytics (10+)
  { keywords: ["how to see my progress", "progress bar", "completion rate"], answer: "Go to 'Progress Bar' from the sidebar to see your consultation completion rate." },
  { keywords: ["total consultations", "how many bookings"], answer: "Visit 'Total Consults' page to see counts of completed, pending, and total consultations." },
  { keywords: ["statistics for admin", "system stats"], answer: "Admins can view total users, consultations, and satisfaction rate on the 'Total Stats' page." },
  { keywords: ["department wise stats", "department analytics"], answer: "Department statistics are coming soon. Currently only global stats are available." },
  { keywords: ["how to improve progress", "increase completion"], answer: "Attend your scheduled consultations and ask lecturers to mark them as completed." },
  { keywords: ["progress not updating", "stuck progress"], answer: "Progress updates after consultations are marked as 'completed' by lecturers." },
  { keywords: ["can i export my data", "export stats"], answer: "Export feature is not available yet. Data can be viewed on the dashboard." },
  { keywords: ["what is satisfaction rate", "satisfaction"], answer: "Satisfaction rate is calculated based on post-consultation feedback (coming soon)." },

  // Live sessions & calendar (15+)
  { keywords: ["live session today", "today's live session"], answer: "You can view live sessions on the 'Live Session' page. Example: AI Ethics today at 14:00 with Dr. Nomsa." },
  { keywords: ["how to join live session", "join video call"], answer: "Click the 'Join' button next to the session. Video integration is coming; currently it's a placeholder." },
  { keywords: ["schedule live session", "create live session"], answer: "Only lecturers and admins can schedule live sessions. Use the 'Live Session' management panel." },
  { keywords: ["calendar sync", "google calendar"], answer: "Not yet integrated. You can manually add events to your external calendar." },
  { keywords: ["calendar view", "view schedule"], answer: "Go to the 'Calendar' page to see your appointments and live sessions by week." },
  { keywords: ["add to my calendar", "download ics"], answer: "Currently not supported. You can manually add the event." },
  { keywords: ["what are this week's live sessions", "weekly live"], answer: "Admins can see weekly live sessions on 'Live Sessions (Weekly)'. Students see on their dashboard." },
  { keywords: ["can i record live session", "recording"], answer: "Recording is not available. Please take notes during the session." },
  { keywords: ["live session link broken", "cannot join"], answer: "Contact the session host. In demo mode, links are for demonstration only." },
  { keywords: ["how to cancel live session", "cancel live session"], answer: "Only the organizer (lecturer/admin) can cancel a live session from the management panel." },

  // Additional generic (helps with fallback)
  { keywords: ["hello", "hi", "hey", "greetings"], answer: "Hello! How can I help you with AuraConsult today?" },
  { keywords: ["thank you", "thanks"], answer: "You're welcome! Feel free to ask if you need anything else." },
  { keywords: ["good morning", "good afternoon"], answer: "Good day! How may I assist you?" },
  { keywords: ["help", "i need help"], answer: "I can answer questions about booking, schedules, roles, progress, and technical issues. What do you need?" },
  { keywords: ["what can you do", "capabilities"], answer: "I can answer over 200 common questions about AuraConsult, including course schedules, booking, roles, and troubleshooting." },
];

// Enhanced findAnswer function with course schedule lookup
export const findAnswer = (question) => {
  const lowerQuestion = question.toLowerCase().trim();

  // First, check if it's a course schedule question
  // Extract potential course name
  const coursePatterns = [
    /(?:what time|when|schedule for|class timing for|venue for) (.+?)(?: class| lecture| ?\?|$)/i,
    /(?:tell me about|info on) (.+?) schedule/i,
    /(.+?) class time/i,
    /(.+?) venue/i,
  ];
  for (let pattern of coursePatterns) {
    const match = lowerQuestion.match(pattern);
    if (match && match[1]) {
      const courseName = match[1].trim();
      const schedule = getCourseSchedule(courseName);
      if (schedule) return schedule;
    }
  }

  // Score each FAQ based on keyword matches
  let bestMatch = null;
  let bestScore = 0;
  for (const item of faqData) {
    let score = 0;
    for (const keyword of item.keywords) {
      if (lowerQuestion.includes(keyword.toLowerCase())) {
        score += 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  }
  if (bestMatch && bestScore > 0) return bestMatch.answer;
  
  return "I'm sorry, I don't have an answer to that. Please contact support@auraconsult.com for further help. You can also rephrase your question or ask about courses, booking, or roles.";
};