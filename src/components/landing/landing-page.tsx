"use client";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import WhyCampusFlow from './components/WhyCampusFlow';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import ChatbotModal from './components/ChatbotModal';
import PrivacyModal from './components/PrivacyModal';
import ContactModal from './components/ContactModal';
import {
  INITIAL_SCHEDULE,
  INITIAL_ASSIGNMENTS,
  INITIAL_TODOS,
  INITIAL_NOTIFICATIONS,
} from './data/mockData';
import { Assignment, TodoItem } from './types';
import { Bell, X } from 'lucide-react';
import { playClick } from './utils/sound';

export default function App() {
  // Application Data State
  const [schedule] = useState(INITIAL_SCHEDULE);
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [todos, setTodos] = useState(INITIAL_TODOS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Modal Visibility State
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  // Active Toast Notification State matching screenshot
  const [activeToast, setActiveToast] = useState<{
    title: string;
    message: string;
  } | null>(null);

  // Toast Trigger Helper
  const triggerNotification = (title: string, message: string) => {
    setActiveToast({ title, message });
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title,
        message,
        time: 'Just now',
        type: 'schedule_change',
      },
      ...prev,
    ]);
    setTimeout(() => {
      setActiveToast((current) => (current?.title === title ? null : current));
    }, 4500);
  };

  // Assignment Handlers
  const handleToggleAssignment = (id: string) => {
    setAssignments((prev) =>
      prev.map((asg) => {
        if (asg.id === id) {
          const nextCompleted = !asg.completed;
          if (nextCompleted) {
            triggerNotification('Assignment Complete', `"${asg.title}" marked as completed.`);
          }
          return { ...asg, completed: nextCompleted };
        }
        return asg;
      })
    );
  };

  const handleAddAssignment = (newAsg: Omit<Assignment, 'id' | 'completed'>) => {
    const item: Assignment = {
      ...newAsg,
      id: `asg-${Date.now()}`,
      completed: false,
    };
    setAssignments((prev) => [item, ...prev]);
  };

  // Todo Handlers
  const handleToggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTodo = (text: string, category: 'Academic' | 'Personal' | 'Campus') => {
    const item: TodoItem = {
      id: `todo-${Date.now()}`,
      text,
      completed: false,
      category,
    };
    setTodos((prev) => [item, ...prev]);
  };

  // Use the app's real authentication flow for every sign-in or signup CTA.
  const openLogin = () => window.location.assign('/login');
  const openSignup = () => window.location.assign('/login');

  const scrollToFeatures = () => {
    playClick();
    const el = document.getElementById('features');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col font-sans transition-colors duration-500">
      {/* SECTION 1: Dark Cinematic Looping Video Hero (Kept intact with Instrument Serif font) */}
      <div className="relative bg-[#071724] text-white">
        <Navbar
          currentUser={null}
          onLogout={() => {}}
        />

        <Hero
          onExploreFeatures={scrollToFeatures}
        />
      </div>

      {/* ALTERNATING SECTIONS WITH SMOOTH TRANSITIONS */}
      {/* SECTION 2 (Warm Paper / Graph Pattern Academic OS from Screenshots) */}
      <Features
        schedule={schedule}
        assignments={assignments}
        todos={todos}
        notifications={notifications}
        onToggleAssignment={handleToggleAssignment}
        onAddAssignment={handleAddAssignment}
        onToggleTodo={handleToggleTodo}
        onAddTodo={handleAddTodo}
        onTriggerNotification={triggerNotification}
        onOpenChatbot={() => setChatbotOpen(true)}
      />

      {/* SECTION 3 (Dark / Midnight Academic Grid) */}
      <HowItWorks onGetStarted={openSignup} />

      {/* SECTION 4 (Warm Paper / Graph Pattern Workload Simulator) */}
      <WhyCampusFlow />

      {/* SECTION 5 (Dark / Midnight CTA Card) */}
      <FinalCTA onGetStarted={openSignup} />

      {/* SECTION 6 (Warm Paper / Graph Pattern Footer) */}
      <Footer
        onOpenLogin={openLogin}
        onOpenPrivacy={() => setPrivacyOpen(true)}
        onOpenContact={() => setContactOpen(true)}
      />

      {/* Floating CampusFlow Assistant Launcher with robot icon */}
      <button
        type="button"
        onClick={() => {
          playClick();
          setChatbotOpen(true);
        }}
        className="fixed bottom-6 right-6 z-40 bg-[#e05842] hover:bg-[#cf4a35] text-white rounded-full py-3 px-4 shadow-xl cursor-pointer flex items-center gap-2.5 transition-all hover:scale-105 border border-[#e05842]"
        title="Open Campus AI"
        aria-label="Open student assistant chatbot"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
        </span>
        <span className="text-sm">🤖</span>
        <span className="text-xs font-mono font-bold tracking-wide">
          CAMPUS AI
        </span>
      </button>

      {/* In-App Live Alert Notification Toast (Matching screenshot bottom-right style) */}
      {activeToast && (
        <div className="fixed bottom-20 right-6 z-50 animate-fade-rise max-w-sm w-full">
          <div className="bg-[#fdf3f0] rounded-xl p-4 shadow-xl border border-[#f5d7ce] flex items-start gap-3 text-xs">
            <div className="p-2 rounded-lg bg-[#faece8] text-[#e05842] shrink-0 border border-[#f4d5cc]">
              <Bell className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-mono font-bold text-[#e05842] uppercase">
                {activeToast.title}
              </div>
              <p className="text-slate-800 mt-0.5 leading-relaxed font-light">
                {activeToast.message}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveToast(null)}
              className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Chatbot Modal */}
      <ChatbotModal
        isOpen={chatbotOpen}
        onClose={() => setChatbotOpen(false)}
        studentName="Krupa"
      />

      {/* Privacy Policy Modal */}
      <PrivacyModal
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
      />

      {/* Contact & Support Modal */}
      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        onSubmitted={() => triggerNotification('Feedback Sent', 'Our student support team will be in touch shortly.')}
      />
    </div>
  );
}
