// src/components/common/GroqChat.jsx
import React, { useState, useRef, useEffect } from 'react';
import Groq from 'groq-sdk';
import { MessageCircle, X, Send, Minimize2, Maximize2, Bot } from 'lucide-react';
import { getCurrentUser } from '../../services/authService';
import { getBookingsByStudent, getBookingsByLecturer } from '../../services/bookingService';
import { getUserById } from '../../services/userService';

const GroqChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "🍯🍅 Hi! I'm AuraBot AI with **real‑time access** to your AuraConsult data. Ask me about your appointments, course schedules, system stats, or how to use the platform.", sender: 'bot', timestamp: new Date().toLocaleTimeString() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [groq, setGroq] = useState(null);

  // Get current user from your authService
  const currentUser = getCurrentUser();
  const isAuthenticated = !!currentUser;
  const userRole = currentUser?.role;
  const userId = currentUser?.id;

  // Initialize Groq client once
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (apiKey) {
      const client = new Groq({ apiKey, dangerouslyAllowBrowser: true });
      setGroq(client);
    } else {
      console.error('Groq API key missing. Add VITE_GROQ_API_KEY to .env');
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ----- REAL DATA FETCHERS (using your existing services) -----
  const getUserAppointments = async () => {
    if (!isAuthenticated) return [];
    try {
      if (userRole === 'student') {
        const bookings = await getBookingsByStudent(userId);
        return bookings.map(apt => ({
          id: apt.id,
          lecturer: apt.lecturerName,
          day: apt.day,
          time: apt.time,
          status: apt.status,
          type: apt.type,
          notes: apt.notes
        }));
      } else if (userRole === 'lecturer') {
        const bookings = await getBookingsByLecturer(userId);
        // For each booking, fetch student name if needed
        const enriched = await Promise.all(bookings.map(async apt => {
          let studentName = apt.studentName;
          if (!studentName && apt.studentId) {
            const student = await getUserById(apt.studentId);
            studentName = student?.name || 'Unknown';
          }
          return {
            id: apt.id,
            student: studentName,
            day: apt.day,
            time: apt.time,
            status: apt.status,
            type: apt.type,
            notes: apt.notes
          };
        }));
        return enriched;
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      return [];
    }
  };

  const getUserInfo = () => {
    if (!isAuthenticated) return null;
    return {
      name: currentUser.name,
      role: currentUser.role,
      email: currentUser.email,
      department: currentUser.department,
      id: currentUser.id
    };
  };

  const getSystemStats = () => {
    if (userRole !== 'admin') return null;
    const allUsers = getAllUsers(); // from your userService
    const students = allUsers.filter(u => u.role === 'student').length;
    const lecturers = allUsers.filter(u => u.role === 'lecturer').length;
    const admins = allUsers.filter(u => u.role === 'admin').length;
    // You can also fetch total bookings count if you have a global function
    return {
      totalUsers: allUsers.length,
      students,
      lecturers,
      admins,
    };
  };

  const getCourseSchedule = (courseName = null) => {
    // Hardcoded schedule (same as your FAQ data)
    const schedule = {
      calculus: { day: "Monday & Wednesday", time: "10:00 AM - 11:30 AM", venue: "Room 201" },
      algebra: { day: "Tuesday & Thursday", time: "9:00 AM - 10:30 AM", venue: "Room 105" },
      physics: { day: "Monday & Wednesday", time: "2:00 PM - 3:30 PM", venue: "Science Lab B" },
      chemistry: { day: "Tuesday & Friday", time: "11:00 AM - 12:30 PM", venue: "Chem Lab 3" },
      "computer science": { day: "Monday & Thursday", time: "1:00 PM - 2:30 PM", venue: "CS Lab 101" },
      programming: { day: "Wednesday & Friday", time: "10:00 AM - 12:00 PM", venue: "CS Lab 102" },
      "data science": { day: "Tuesday & Thursday", time: "3:00 PM - 4:30 PM", venue: "Data Studio" },
      engineering: { day: "Monday & Friday", time: "9:00 AM - 11:00 AM", venue: "Engineering Hall" },
      business: { day: "Tuesday & Thursday", time: "1:00 PM - 2:30 PM", venue: "Business School Room 3" },
      psychology: { day: "Monday & Wednesday", time: "11:00 AM - 12:30 PM", venue: "Social Sciences 201" },
      mathematics: { day: "Monday, Wednesday, Friday", time: "8:00 AM - 9:00 AM", venue: "Math Building 101" },
      english: { day: "Tuesday & Thursday", time: "10:00 AM - 11:30 AM", venue: "Humanities 301" },
      history: { day: "Wednesday & Friday", time: "2:00 PM - 3:30 PM", venue: "Humanities 205" },
      biology: { day: "Monday & Thursday", time: "9:00 AM - 10:30 AM", venue: "Life Sciences 110" },
    };
    if (courseName) {
      const key = Object.keys(schedule).find(k => courseName.toLowerCase().includes(k));
      return key ? schedule[key] : null;
    }
    return schedule;
  };

  // ----- TOOL DEFINITIONS (functions the AI can call) -----
  const tools = [
    {
      type: "function",
      function: {
        name: "get_user_appointments",
        description: "Retrieve the current user's upcoming appointments with details: date, time, status, purpose, and the other party's name.",
        parameters: { type: "object", properties: {} }
      }
    },
    {
      type: "function",
      function: {
        name: "get_user_info",
        description: "Get the current user's profile: name, role, email, department, and ID.",
        parameters: { type: "object", properties: {} }
      }
    },
    {
      type: "function",
      function: {
        name: "get_system_stats",
        description: "Get overall system statistics. Only available for admin users.",
        parameters: { type: "object", properties: {} }
      }
    },
    {
      type: "function",
      function: {
        name: "get_course_schedule",
        description: "Get the weekly schedule for a specific course (e.g., calculus, physics, computer science). If no course name provided, returns all course schedules.",
        parameters: {
          type: "object",
          properties: {
            course_name: { type: "string", description: "Name of the course (e.g., 'calculus', 'physics')" }
          },
          required: []
        }
      }
    },
    {
      type: "function",
      function: {
        name: "get_help",
        description: "Provide general help about using AuraConsult: booking appointments, viewing requests, managing students, etc.",
        parameters: { type: "object", properties: {} }
      }
    }
  ];

  // Execute the tool call and return data
  const executeTool = async (toolName, toolArgs) => {
    switch (toolName) {
      case 'get_user_appointments':
        return JSON.stringify(await getUserAppointments());
      case 'get_user_info':
        return JSON.stringify(getUserInfo());
      case 'get_system_stats':
        return JSON.stringify(getSystemStats());
      case 'get_course_schedule': {
        const courseName = toolArgs?.course_name;
        const schedule = getCourseSchedule(courseName);
        if (!schedule) return courseName ? `No schedule found for "${courseName}".` : JSON.stringify(getCourseSchedule());
        return JSON.stringify(schedule);
      }
      case 'get_help':
        return `AuraConsult helps you manage academic consultations. 
- Students: Book appointments, view requests, track progress.
- Lecturers: Manage students, approve/reject appointments.
- Admins: Edit users, view system stats.
To book an appointment: go to sidebar → Book Appointment → pick lecturer and time slot.
To view your appointments: use the 'View Requests' (student) or 'View Appointments' (lecturer) page.`;
      default:
        return "Tool not recognized.";
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    if (!groq) {
      setMessages(prev => [...prev, { id: Date.now(), text: "AI assistant is unavailable. Check your Groq API key.", sender: 'bot', timestamp: new Date().toLocaleTimeString() }]);
      return;
    }

    const userMessage = { id: Date.now(), text: inputText, sender: 'user', timestamp: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Build conversation (last 12 messages)
      const conversation = messages.slice(-12).concat(userMessage).map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      // Initial call with tools
      let response = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: `You are AuraBot, an AI assistant for AuraConsult, an academic consultation platform. You have real‑time access to the user's data via function calls. Use the tools to answer questions about appointments, user info, system stats (admin only), and course schedules. If the user asks about their personal data, call the appropriate function. Be friendly, concise, and always use honey/tomato emojis 🍯🍅 where appropriate. Current user role: ${userRole || 'none'}.` },
          ...conversation
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        tools: tools,
        tool_choice: 'auto'
      });

      let assistantMessage = response.choices[0].message;
      let finalReply = assistantMessage.content || '';

      // Handle tool calls (may loop if multiple tool calls)
      while (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
        conversation.push(assistantMessage);
        for (const toolCall of assistantMessage.tool_calls) {
          const toolName = toolCall.function.name;
          let args = {};
          try {
            args = JSON.parse(toolCall.function.arguments);
          } catch(e) { /* ignore */ }
          const toolResult = await executeTool(toolName, args);
          conversation.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: toolResult
          });
        }
        const secondResponse = await groq.chat.completions.create({
          messages: conversation,
          model: 'llama-3.3-70b-versatile',
          temperature: 0.7,
        });
        assistantMessage = secondResponse.choices[0].message;
        finalReply = assistantMessage.content || 'Here is the information you requested.';
      }

      const botMessage = { id: Date.now() + 1, text: finalReply, sender: 'bot', timestamp: new Date().toLocaleTimeString() };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Groq error:', error);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: `Error: ${error.message}. Please check your API key or network.`, sender: 'bot', timestamp: new Date().toLocaleTimeString() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "Show my appointments",
    "What is my role?",
    "How do I book an appointment?",
    "Show system stats (admin only)",
    "What time is calculus class?",
    "Help me with the dashboard"
  ];

  // Floating button (closed state)
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-honey-500 to-tomato-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all z-50 group"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          AI Assistant (real‑time data)
        </span>
      </button>
    );
  }

  // Chat window (open state)
  return (
    <div className={`fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl border border-honey-200 flex flex-col z-50 transition-all duration-300 ${isMinimized ? 'w-80 h-14' : 'w-96 h-[550px]'}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-honey-500 to-tomato-500 text-white p-4 rounded-t-2xl flex justify-between items-center cursor-pointer" onClick={() => isMinimized && setIsMinimized(false)}>
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <span className="font-semibold">AuraBot AI (Live Data)</span>
          <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full ml-2">Groq</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
            className="hover:bg-white/20 p-1 rounded transition"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
            className="hover:bg-white/20 p-1 rounded transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-honey-50">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl ${message.sender === 'user' ? 'bg-tomato-500 text-white rounded-br-sm' : 'bg-white border border-honey-200 text-gray-800 rounded-bl-sm shadow-sm'}`}>
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-honey-100' : 'text-gray-400'}`}>{message.timestamp}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-honey-200 p-3 rounded-2xl rounded-bl-sm shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick questions */}
          <div className="p-3 border-t border-honey-100 bg-honey-50">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => { setInputText(q); sendMessage(); }}
                  className="text-xs bg-white border border-honey-200 rounded-full px-3 py-1 hover:bg-honey-100 hover:border-tomato-300 transition whitespace-nowrap"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input area */}
          <div className="p-4 border-t border-honey-200 bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about your appointments, courses, or anything..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tomato-400 resize-none"
                rows="1"
              />
              <button
                onClick={sendMessage}
                disabled={!inputText.trim()}
                className="bg-tomato-500 text-white p-2 rounded-lg hover:bg-tomato-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">Has real‑time access to your AuraConsult data</p>
          </div>
        </>
      )}
    </div>
  );
};

export default GroqChat;