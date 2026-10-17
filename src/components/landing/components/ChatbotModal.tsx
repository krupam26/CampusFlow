import React, { useState } from 'react';
import { X, Send, Bot, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import { playClick } from '../utils/sound';

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
}

export default function ChatbotModal({
  isOpen,
  onClose,
  studentName,
}: ChatbotModalProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Hello ${studentName}! I am your CampusFlow Academic Assistant. I have live access to your timetable, assignment deadlines, and classroom relocation notices. How can I support your schedule today?`,
      timestamp: 'Just now',
      quickActions: [
        'What classes do I have today?',
        'Any room change alerts?',
        'What assignments are due next?',
        'Give me a study plan for tonight',
      ],
    },
  ]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    playClick();
    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');

    setTimeout(() => {
      const q = query.toLowerCase();
      let botResponse = "I've checked your student workspace. Everything is synchronized with your weekly timetable!";

      if (q.includes('class') || q.includes('today') || q.includes('schedule')) {
        botResponse = `Here is your current daily itinerary:
• 09:00 AM — CS 201: Data Structures (Science Complex 204)
• 11:00 AM — MATH 240: Multivariate Calculus [⚠️ RELOCATED to Auditorium South]
• 02:30 PM — PHYS 150L: Physics Experimental Lab (Newton Wing B12)
Make sure to arrive 5 minutes early for Auditorium South!`;
      } else if (q.includes('room') || q.includes('relocation') || q.includes('alert') || q.includes('change')) {
        botResponse = `⚠️ Active Relocation Alert:
MATH 240 (Multivariate Calculus) with Prof. Marcus Chen at 11:00 AM has been temporarily moved from Euler Building 302 to Auditorium South due to emergency HVAC repairs. All other classes remain in their standard halls.`;
      } else if (q.includes('assignment') || q.includes('due') || q.includes('urgent') || q.includes('homework')) {
        botResponse = `Upcoming Submission Deadlines:
1. 🔴 URGENT: AVL & Red-Black Tree Implementation (CS 201) — Due Tomorrow at 11:59 PM.
2. 🟡 HIGH: Problem Set 5: Eigenvalues (MATH 240) — Due in 3 days (Friday).
3. 🟢 MEDIUM: Lab Report: Angular Momentum (PHYS 150L) — Due Monday at 5:00 PM.
Recommendation: Finish testing your AVL rotations before starting the physics report!`;
      } else if (q.includes('study plan') || q.includes('plan') || q.includes('tonight')) {
        botResponse = `Here is your optimal 3-hour focus block for tonight:
• 07:00 PM – 08:15 PM: CS 201 AVL Tree edge cases (unit tests for double rotations).
• 08:15 PM – 08:30 PM: 15-minute break (stretch & hydrate).
• 08:30 PM – 09:30 PM: MATH 240 Eigenvalues problems 1 through 4.
• 09:30 PM – 09:45 PM: Daily review & tick off your CampusFlow to-dos.`;
      } else if (q.includes('lab') || q.includes('physics')) {
        botResponse = `PHYS 150L Experimental Lab is scheduled for 02:30 PM – 04:30 PM in Newton Wing B12.
Safety checklist: Closed-toe shoes required, safety goggles provided in drawer 4, and your pre-lab handout signed.`;
      }

      const assistantMessage: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-rise">
      <div className="relative w-full max-w-2xl h-[620px] max-h-[90vh] bg-white rounded-2xl flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-slate-900">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-800">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900 text-base">CampusFlow Assistant</h3>
                <span className="text-[11px] font-mono text-emerald-700 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  Synced
                </span>
              </div>
              <p className="text-xs text-slate-500">Connected to {studentName}&apos;s schedule</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playClick();
              onClose();
            }}
            className="p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label="Close assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat message stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-br-none shadow-xs'
                    : 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-1 px-1">
                {msg.timestamp}
              </span>

              {msg.quickActions && msg.quickActions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 max-w-[95%]">
                  {msg.quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSend(action)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                      <span>{action}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Form */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about exams, rooms, deadlines, or study strategy..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-5 py-3 rounded-xl bg-slate-900 text-white font-medium text-xs sm:text-sm hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
