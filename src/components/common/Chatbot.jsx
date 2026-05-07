import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { findAnswer } from '../../data/faqData';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm AuraBot. Ask me anything about the system (booking, roles, appointments, etc.)", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
    setInput('');
    try {
      const answer = findAnswer(userMsg);
      setTimeout(() => setMessages(prev => [...prev, { text: answer, sender: 'bot' }]), 500);
    } catch (err) {
      setTimeout(() => setMessages(prev => [...prev, { text: "Sorry, I'm having trouble answering right now.", sender: 'bot' }]), 500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-honey-500 to-tomato-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all z-50"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-xl shadow-2xl flex flex-col z-50 border border-honey-200 animate-slide-up">
          <div className="bg-gradient-to-r from-honey-500 to-tomato-500 text-white p-4 rounded-t-xl flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span className="font-semibold">AuraBot Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-full p-1 transition">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-honey-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${msg.sender === 'user' ? 'bg-tomato-500 text-white rounded-br-none' : 'bg-white border border-honey-200 text-gray-800 rounded-bl-none shadow-sm'}`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-3 border-t border-honey-200 flex gap-2 bg-white rounded-b-xl">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me a question..."
              className="flex-1 px-3 py-2 border border-honey-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tomato-400 text-sm"
            />
            <button onClick={handleSend} className="bg-tomato-500 text-white p-2 rounded-lg hover:bg-tomato-600 transition">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;