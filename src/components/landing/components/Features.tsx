import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Bell,
  ListTodo,
  Bot,
  AlertTriangle,
  Plus,
  Send,
  MapPin,
  Check,
  Search,
  SlidersHorizontal,
  ChevronRight,
  Trash2,
  Edit2,
  FileText,
  CheckSquare,
} from 'lucide-react';
import { DaySchedule, Assignment, TodoItem, ReminderNotification } from '../types';
import PixelRobot from './PixelRobot';
import { playChime, playClick } from '../utils/sound';

interface FeaturesProps {
  schedule: DaySchedule[];
  assignments: Assignment[];
  todos: TodoItem[];
  notifications: ReminderNotification[];
  onToggleAssignment: (id: string) => void;
  onAddAssignment: (assignment: Omit<Assignment, 'id' | 'completed'>) => void;
  onToggleTodo: (id: string) => void;
  onAddTodo: (text: string, category: 'Academic' | 'Personal' | 'Campus') => void;
  onTriggerNotification: (title: string, message: string) => void;
  onOpenChatbot: () => void;
}

export default function Features({
  schedule,
  assignments,
  todos,
  notifications,
  onToggleAssignment,
  onAddAssignment,
  onToggleTodo,
  onAddTodo,
  onTriggerNotification,
  onOpenChatbot,
}: FeaturesProps) {
  // Navigation tab in student OS preview
  const [activeTab, setActiveTab] = useState<'overview' | 'timetable' | 'assignments' | 'tasks' | 'assistant'>('overview');
  const [selectedDay, setSelectedDay] = useState<DaySchedule['day']>('Wednesday');
  const [simulatedRelocation, setSimulatedRelocation] = useState(true);

  // New assignment modal inside OS
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState('CS 201');
  const [newDue, setNewDue] = useState('2026-10-20');
  const [newPriority, setNewPriority] = useState<Assignment['priority']>('High');

  // Mini Chatbot inside OS
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string }>>([
    {
      sender: 'assistant',
      text: 'Good evening, Krupa! CN Lab is moved to Tomorrow 11:00 AM, and your CS 201 AVL Tree submission is due soon.',
    },
  ]);

  // Tasks state
  const [taskInput, setTaskInput] = useState('');

  const currentDaySchedule = schedule.find((s) => s.day === selectedDay) || schedule[0];

  const pendingCount = assignments.filter((a) => !a.completed).length;
  const completedCount = assignments.filter((a) => a.completed).length;

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      playClick();
      onAddAssignment({
        title: newTitle.trim(),
        course: newCourse,
        dueDate: `Due ${newDue}`,
        daysRemaining: 3,
        priority: newPriority,
        type: 'Project',
      });
      setNewTitle('');
      setShowAddModal(false);
      onTriggerNotification('Assignment Created', `"${newTitle}" added to Krupa's Academic OS.`);
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskInput.trim()) {
      playClick();
      onAddTodo(taskInput.trim(), 'Academic');
      setTaskInput('');
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    playClick();
    const query = chatInput.trim();
    const q = query.toLowerCase();
    setChatInput('');

    let response = "I've checked your schedule, Krupa. Everything is synced!";
    if (q.includes('lab') || q.includes('cn') || q.includes('fst')) {
      response = 'Tomorrow: FST LAB is at 09:00 AM in LAB 204. CN LAB is rescheduled to 11:00 AM.';
    } else if (q.includes('assignment') || q.includes('due') || q.includes('deadline')) {
      response = 'You have 2 pending assignments. The highest priority is the AVL Tree Implementation due tomorrow.';
    } else if (q.includes('room') || q.includes('change')) {
      response = 'Schedule Change: CN LAB tomorrow at 11:00 AM has been rescheduled.';
    }

    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: query },
      { sender: 'assistant', text: response },
    ]);
  };

  return (
    <section id="features" className="relative z-20 graph-paper-pattern py-24 px-4 sm:px-6 border-t border-[#e8e2d8] text-slate-900 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-medium text-[#e05842] border border-[#f4d5cc] bg-[#faece8] mb-4">
            <span>// CAMPUSFLOW OS PREVIEW</span>
          </div>

          <h2
            style={{ fontFamily: "'Instrument Serif', serif" }}
            className="text-4xl sm:text-5xl md:text-6xl text-slate-900 font-normal tracking-tight"
          >
            Everything you need to stay on track.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-3 font-light leading-relaxed">
            One organized space for your everyday college life.
          </p>
        </div>

        {/* The Academic OS Interface Frame (Directly styled after Krupa's screenshots) */}
        <div className="rounded-2xl border border-[#e8e2d8] bg-[#fcfbf9] shadow-xl overflow-hidden">
          {/* OS Top Navbar */}
          <div className="h-16 border-b border-[#e8e2d8] bg-[#fbf9f5] px-4 sm:px-6 flex items-center justify-between gap-4">
            {/* Logo lockup matching screenshot */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#e05842] flex items-center justify-center text-white shadow-xs">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 3.32L17.7 9 12 11.68 6.3 9 12 6.32zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <div className="font-pixel text-sm font-bold tracking-tight text-slate-900">
                  CAMPUSFLOW
                </div>
                <div className="text-[9px] font-mono tracking-wider text-slate-500 uppercase">
                  YOUR ACADEMIC OS
                </div>
              </div>
            </div>

            {/* Middle Search Bar matching screenshot */}
            <div className="flex-1 max-w-md hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white border border-[#e8e2d8] text-xs text-slate-400 shadow-2xs">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="flex-1 text-slate-500">Search your academic world...</span>
              <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-slate-100 border border-slate-200 text-slate-500 font-mono">
                ⌘ K
              </kbd>
            </div>

            {/* Right Student Profile & Status */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onTriggerNotification('New Notification', 'You have a new CampusFlow update.')}
                className="p-2 rounded-lg bg-white border border-[#e8e2d8] text-slate-600 hover:text-slate-900 cursor-pointer text-xs flex items-center gap-1.5 shadow-2xs"
                title="Notifications"
              >
                <Bell className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline font-mono text-[11px] text-slate-500">WED · SEP 19</span>
              </button>

              <div className="flex items-center gap-2 pl-2 border-l border-[#e8e2d8]">
                <div className="w-7 h-7 rounded bg-[#e05842] text-white flex items-center justify-center font-bold text-xs">
                  K
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-900 leading-tight">KRUPA MEHTA</div>
                  <div className="text-[9px] font-mono text-slate-400">ADMIN, LVL 10</div>
                </div>
              </div>
            </div>
          </div>

          {/* OS Workspace Body Split (Sidebar + Canvas) */}
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[700px]">
            {/* Sidebar (3 cols on desktop) */}
            <div className="md:col-span-3 border-r border-[#e8e2d8] bg-[#fbf9f5] p-4 flex flex-col justify-between">
              <div className="space-y-6">
                {/* Main Menu */}
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2 px-3">
                    // MAIN
                  </div>
                  <nav className="space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        playClick();
                        setActiveTab('overview');
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                        activeTab === 'overview'
                          ? 'bg-[#faece8] text-[#e05842] font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <SlidersHorizontal className="w-4 h-4" />
                        <span>Overview</span>
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        playClick();
                        setActiveTab('timetable');
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                        activeTab === 'timetable'
                          ? 'bg-[#faece8] text-[#e05842] font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Calendar className="w-4 h-4" />
                        <span>Timetable</span>
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        playClick();
                        setActiveTab('assignments');
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                        activeTab === 'assignments'
                          ? 'bg-[#faece8] text-[#e05842] font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Assignments</span>
                      </span>
                      <span className="w-4 h-4 rounded-full bg-[#faece8] text-[#e05842] text-[10px] font-mono flex items-center justify-center font-bold">
                        {pendingCount}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        playClick();
                        setActiveTab('tasks');
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                        activeTab === 'tasks'
                          ? 'bg-[#faece8] text-[#e05842] font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <ListTodo className="w-4 h-4" />
                        <span>Tasks</span>
                      </span>
                      <span className="w-4 h-4 rounded-full bg-[#faece8] text-[#e05842] text-[10px] font-mono flex items-center justify-center font-bold">
                        {todos.filter((t) => !t.completed).length}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        playClick();
                        setActiveTab('assistant');
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                        activeTab === 'assistant'
                          ? 'bg-[#faece8] text-[#e05842] font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Bot className="w-4 h-4" />
                        <span>AI Assistant</span>
                      </span>
                    </button>
                  </nav>
                </div>

                {/* Tools Menu */}
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2 px-3">
                    // TOOLS
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      onTriggerNotification('Campus Alert Verified', 'All class schedule notifications are synced.');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <Bell className="w-4 h-4" />
                    <span>Notifications</span>
                  </button>
                </div>
              </div>

              {/* Campus AI Online Widget Box (Matching Screenshot bottom left) */}
              <div className="mt-6 p-3.5 rounded-xl border border-[#e8e2d8] bg-white shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800">
                    <span className="text-xs">🤖</span>
                    <span>CAMPUS AI</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="text-[9px] font-mono text-emerald-700 uppercase">ONLINE</div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Ask me what you have tomorrow, what&apos;s due, or what you should work on next.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    setActiveTab('assistant');
                  }}
                  className="w-full py-1.5 text-[11px] font-mono text-[#e05842] hover:underline cursor-pointer text-left font-bold"
                >
                  [ ASK CAMPUS AI ]
                </button>
              </div>
            </div>

            {/* Main Stage (9 cols on desktop with graph paper pattern) */}
            <div className="md:col-span-9 p-4 sm:p-8 graph-paper-pattern space-y-6">
              {/* TAB 1: OVERVIEW (Matching Screenshot 1) */}
              {activeTab === 'overview' && (
                <div className="space-y-6 animate-fade-rise">
                  {/* Robot Greeting Card (The iconic hero card from screenshot 1) */}
                  <div className="graph-paper-card rounded-2xl p-6 sm:p-8 bg-white border border-[#e8e2d8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
                    <div className="flex items-start sm:items-center gap-5">
                      {/* Pixel Robot */}
                      <PixelRobot className="w-16 h-16 sm:w-20 sm:h-20 shrink-0" />

                      <div className="space-y-1">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono text-[#e05842] border border-[#f4d5cc] bg-[#faece8] uppercase">
                          # EVENING BRIEFING
                        </span>
                        <h3 className="font-pixel-heading text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                          GOOD EVENING,<br />KRUPA! 👋
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 font-light max-w-md pt-1">
                          Close out the day with a smart next move. Here&apos;s what needs your attention today.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        playClick();
                        setActiveTab('timetable');
                      }}
                      className="px-5 py-2.5 rounded-lg bg-[#e05842] hover:bg-[#cf4a35] text-white text-xs font-semibold tracking-wide flex items-center gap-2 cursor-pointer transition-all shadow-xs shrink-0 self-stretch sm:self-auto justify-center"
                    >
                      <span>VIEW FULL DAY</span>
                      <span>→</span>
                    </button>
                  </div>

                  {/* 3 Metric Summary Cards matching screenshot 1 */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Card 1: FIRST CLASS (Peach) */}
                    <div className="p-4 rounded-xl border border-[#f5d7ce] bg-[#fdf3f0] space-y-1.5 shadow-2xs">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#e05842]">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="uppercase text-[10px] tracking-wider">FIRST CLASS</span>
                      </div>
                      <div className="text-base font-bold text-slate-900 font-mono">FST LAB</div>
                      <div className="text-xs text-slate-600 font-mono">09:00 AM · LAB 204</div>
                    </div>

                    {/* Card 2: PENDING WORK (Mint) */}
                    <div className="p-4 rounded-xl border border-[#d2ebd7] bg-[#f0f8f2] space-y-1.5 shadow-2xs">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#2e7d32]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="uppercase text-[10px] tracking-wider">PENDING WORK</span>
                      </div>
                      <div className="text-base font-bold text-slate-900 font-mono">
                        {pendingCount} ASSIGNMENTS
                      </div>
                      <div className="text-xs text-slate-600 font-mono">1 deadline tomorrow</div>
                    </div>

                    {/* Card 3: SCHEDULE CHANGE (Yellow) */}
                    <div className="p-4 rounded-xl border border-[#faecc4] bg-[#fef9eb] space-y-1.5 shadow-2xs">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#b45309]">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span className="uppercase text-[10px] tracking-wider">SCHEDULE CHANGE</span>
                      </div>
                      <div className="text-base font-bold text-slate-900 font-mono">CN LAB</div>
                      <div className="text-xs text-slate-600 font-mono">Tomorrow · 11:00 AM</div>
                    </div>
                  </div>

                  {/* Two Bottom Panels (TODAY'S CLASSES & QUEST LOG) */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Smart Timetable preview */}
                    <div className="graph-paper-card rounded-2xl p-5 bg-white border border-[#e8e2d8] space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-[#f0ebe3]">
                        <div>
                          <div className="text-[10px] font-mono text-[#e05842] uppercase">TODAY</div>
                          <h4 className="font-pixel text-base font-bold text-slate-900">TODAY&apos;S CLASSES</h4>
                        </div>
                        <span className="text-xs font-mono text-slate-500">Wed, Sep 19</span>
                      </div>

                      <div className="space-y-2.5">
                        {currentDaySchedule.sessions.map((session) => (
                          <div
                            key={session.id}
                            className="p-3 rounded-xl border border-[#e8e2d8] bg-[#fbf9f5] flex items-center justify-between text-xs"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-slate-900">{session.courseCode}</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                  {session.type}
                                </span>
                              </div>
                              <div className="text-slate-600 mt-0.5">{session.courseName}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-mono text-slate-800">{session.time.split('–')[0]}</div>
                              <div className="text-[10px] text-slate-500">{session.room}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Upcoming work quest log */}
                    <div className="graph-paper-card rounded-2xl p-5 bg-white border border-[#e8e2d8] space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-[#f0ebe3]">
                        <div>
                          <div className="text-[10px] font-mono text-[#e05842] uppercase">// QUEST LOG</div>
                          <h4 className="font-pixel text-base font-bold text-slate-900">UPCOMING WORK</h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveTab('assignments')}
                          className="text-xs text-[#e05842] hover:underline cursor-pointer"
                        >
                          View all ({assignments.length})
                        </button>
                      </div>

                      <div className="space-y-2">
                        {assignments.slice(0, 3).map((asg) => (
                          <div
                            key={asg.id}
                            onClick={() => {
                              playChime();
                              onToggleAssignment(asg.id);
                            }}
                            className="p-2.5 rounded-xl border border-[#e8e2d8] bg-[#fbf9f5] flex items-center justify-between text-xs cursor-pointer hover:border-[#d0c6b6]"
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                  asg.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
                                }`}
                              >
                                {asg.completed && <Check className="w-2.5 h-2.5" />}
                              </div>
                              <span className={asg.completed ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}>
                                {asg.title}
                              </span>
                            </div>
                            <span className="font-mono text-[10px] text-slate-500">{asg.dueDate}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: TIMETABLE (Smart Timetable feature) */}
              {activeTab === 'timetable' && (
                <div className="space-y-6 animate-fade-rise">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#e8e2d8]">
                    <div>
                      <div className="text-[10px] font-mono text-[#e05842] uppercase">// WEEKLY TIMETABLE</div>
                      <h3 className="font-pixel text-2xl font-bold text-slate-900">SMART TIMETABLE</h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Keep your weekly class schedule organized and stay informed when lectures or labs change.
                      </p>
                    </div>

                    <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#e8e2d8]">
                      {schedule.map((dayObj) => (
                        <button
                          key={dayObj.day}
                          type="button"
                          onClick={() => {
                            playClick();
                            setSelectedDay(dayObj.day);
                          }}
                          className={`px-3 py-1.5 text-xs font-mono font-medium rounded-md transition-all cursor-pointer ${
                            selectedDay === dayObj.day
                              ? 'bg-[#e05842] text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {dayObj.short}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Relocation simulation notice */}
                  <div className="p-4 rounded-xl border border-[#faecc4] bg-[#fef9eb] flex items-center justify-between text-xs text-[#b45309]">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Notice: MATH 240 on Wednesday moved to Auditorium South (HVAC repairs).</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        playClick();
                        setSimulatedRelocation(!simulatedRelocation);
                        onTriggerNotification(
                          'Schedule Alert',
                          simulatedRelocation ? 'MATH 240 reset to original hall.' : 'MATH 240 moved to Auditorium South.'
                        );
                      }}
                      className="underline font-semibold cursor-pointer"
                    >
                      {simulatedRelocation ? 'Reset Hall' : 'Test Shift'}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {currentDaySchedule.sessions.map((session) => (
                      <div
                        key={session.id}
                        className="p-4 rounded-xl border border-[#e8e2d8] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                      >
                        <div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-mono font-bold text-slate-900">{session.courseCode}</span>
                            <span className="text-slate-300">/</span>
                            <span className="text-slate-500">{session.type}</span>
                          </div>
                          <h4 className="text-base font-semibold text-slate-900 mt-0.5">{session.courseName}</h4>
                          <div className="text-xs text-slate-500 mt-1">Instructor: {session.instructor}</div>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-mono">
                          <span className="flex items-center gap-1 text-slate-700">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{session.time}</span>
                          </span>
                          <span className="flex items-center gap-1 font-bold text-[#e05842]">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{session.room}</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: ASSIGNMENTS (Matching Screenshot 2) */}
              {activeTab === 'assignments' && (
                <div className="space-y-6 animate-fade-rise">
                  {/* Top Heading from screenshot 2 */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e8e2d8]">
                    <div>
                      <div className="text-[10px] font-mono text-[#e05842] uppercase tracking-wider">
                        ACADEMIC WORK
                      </div>
                      <h3 className="font-pixel-heading text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                        ASSIGNMENTS
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Track deadlines, priorities and academic submissions.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowAddModal(!showAddModal)}
                      className="px-4 py-2.5 rounded-lg bg-[#e05842] hover:bg-[#cf4a35] text-white text-xs font-semibold tracking-wide flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ ADD ASSIGNMENT</span>
                    </button>
                  </div>

                  {/* 3 Metric counters from screenshot 2 */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl border border-[#e8e2d8] bg-white flex items-center justify-between shadow-2xs">
                      <div>
                        <div className="text-[10px] font-mono text-slate-400 uppercase">TOTAL</div>
                        <div className="text-3xl font-mono font-bold text-slate-900 mt-1">{assignments.length}</div>
                      </div>
                      <FileText className="w-5 h-5 text-[#e05842]" />
                    </div>

                    <div className="p-4 rounded-xl border border-[#e8e2d8] bg-white flex items-center justify-between shadow-2xs">
                      <div>
                        <div className="text-[10px] font-mono text-slate-400 uppercase">PENDING</div>
                        <div className="text-3xl font-mono font-bold text-slate-900 mt-1">{pendingCount}</div>
                      </div>
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>

                    <div className="p-4 rounded-xl border border-[#e8e2d8] bg-white flex items-center justify-between shadow-2xs">
                      <div>
                        <div className="text-[10px] font-mono text-slate-400 uppercase">COMPLETED</div>
                        <div className="text-3xl font-mono font-bold text-slate-900 mt-1">{completedCount}</div>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                  </div>

                  {/* Add assignment inline form */}
                  {showAddModal && (
                    <form onSubmit={handleCreateAssignment} className="p-4 rounded-xl border border-[#e05842]/30 bg-white space-y-3">
                      <div className="text-xs font-bold text-slate-900">Add Academic Task</div>
                      <input
                        type="text"
                        required
                        placeholder="Assignment Title (e.g. Red-Black Tree Implementation)"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#e8e2d8] focus:outline-none"
                      />
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <input
                          type="text"
                          placeholder="Course (CS 201)"
                          value={newCourse}
                          onChange={(e) => setNewCourse(e.target.value)}
                          className="px-3 py-1.5 rounded-lg border border-[#e8e2d8]"
                        />
                        <input
                          type="date"
                          value={newDue}
                          onChange={(e) => setNewDue(e.target.value)}
                          className="px-3 py-1.5 rounded-lg border border-[#e8e2d8]"
                        />
                        <select
                          value={newPriority}
                          onChange={(e) => setNewPriority(e.target.value as Assignment['priority'])}
                          className="px-3 py-1.5 rounded-lg border border-[#e8e2d8]"
                        >
                          <option value="Urgent">Urgent Priority</option>
                          <option value="High">High Priority</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setShowAddModal(false)}
                          className="px-3 py-1 text-xs text-slate-500"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 text-xs bg-[#e05842] text-white font-medium rounded-lg"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Assignments List (Matching Screenshot 2 rows) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-500 pb-2">
                      <span className="uppercase text-[10px] text-[#e05842] font-bold">
                        ACADEMIC WORKLOAD // YOUR ASSIGNMENTS
                      </span>
                      <span>Sort: Due Date</span>
                    </div>

                    {assignments.map((asg) => (
                      <div
                        key={asg.id}
                        className="p-4 rounded-xl border border-[#e8e2d8] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:border-[#d8d0c2]"
                      >
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              playChime();
                              onToggleAssignment(asg.id);
                            }}
                            className={`w-5 h-5 mt-0.5 rounded-full border flex items-center justify-center cursor-pointer transition-colors ${
                              asg.completed ? 'bg-[#e05842] border-[#e05842] text-white' : 'border-slate-300'
                            }`}
                          >
                            {asg.completed && <Check className="w-3 h-3" />}
                          </button>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                                {asg.course}
                              </span>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                                  asg.completed
                                    ? 'bg-[#ebf5ed] text-[#2e7d32] border border-[#d2ebd7]'
                                    : 'bg-[#fdf6e2] text-[#b45309] border border-[#faecc4]'
                                }`}
                              >
                                {asg.completed ? 'COMPLETED' : 'PENDING'}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-[#faece8] text-[#e05842] border border-[#f4d5cc]">
                                {asg.priority.toUpperCase()} PRIORITY
                              </span>
                            </div>

                            <h4 className={`text-sm font-semibold ${asg.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                              {asg.title}
                            </h4>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-mono self-end sm:self-center">
                          <span className="text-slate-500">{asg.dueDate}</span>
                          <button
                            type="button"
                            onClick={() => onToggleAssignment(asg.id)}
                            className="text-slate-400 hover:text-slate-800 font-mono text-[11px]"
                          >
                            EDIT
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: TASKS (Personal To-Do List) */}
              {activeTab === 'tasks' && (
                <div className="space-y-6 animate-fade-rise">
                  <div className="pb-4 border-b border-[#e8e2d8]">
                    <div className="text-[10px] font-mono text-[#e05842] uppercase">// ACTION ITEMS</div>
                    <h3 className="font-pixel text-2xl font-bold text-slate-900">PERSONAL TO-DO LIST</h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Break your workload into manageable tasks, track progress, and keep your day focused.
                    </p>
                  </div>

                  <form onSubmit={handleCreateTask} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add an academic or personal quest..."
                      value={taskInput}
                      onChange={(e) => setTaskInput(e.target.value)}
                      className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-white border border-[#e8e2d8] text-slate-900 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#e05842] text-white text-xs font-semibold cursor-pointer"
                    >
                      Add Task
                    </button>
                  </form>

                  <div className="space-y-2">
                    {todos.map((todo) => (
                      <div
                        key={todo.id}
                        onClick={() => {
                          playChime();
                          onToggleTodo(todo.id);
                        }}
                        className="p-3.5 rounded-xl border border-[#e8e2d8] bg-white flex items-center justify-between text-xs cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center ${
                              todo.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
                            }`}
                          >
                            {todo.completed && <Check className="w-3 h-3" />}
                          </div>
                          <span className={todo.completed ? 'line-through text-slate-400' : 'text-slate-900 font-medium'}>
                            {todo.text}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                          {todo.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: AI ASSISTANT (CampusFlow Chatbot) */}
              {activeTab === 'assistant' && (
                <div className="space-y-4 animate-fade-rise">
                  <div className="pb-4 border-b border-[#e8e2d8] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-[#e05842] uppercase">// INTEGRATED INTELLIGENCE</div>
                      <h3 className="font-pixel text-2xl font-bold text-slate-900">CAMPUSFLOW CHATBOT</h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Get help navigating your academic tasks and finding information within your student workspace.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onOpenChatbot}
                      className="px-3 py-1.5 rounded-lg border border-[#e8e2d8] bg-white text-xs font-mono text-slate-700 hover:text-black cursor-pointer shadow-2xs"
                    >
                      Expand Window ↗
                    </button>
                  </div>

                  {/* Chat Console */}
                  <div className="h-[280px] overflow-y-auto p-4 rounded-xl bg-white border border-[#e8e2d8] space-y-3">
                    {chatMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed ${
                            msg.sender === 'user'
                              ? 'bg-[#e05842] text-white'
                              : 'bg-[#fbf9f5] text-slate-900 border border-[#e8e2d8]'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleChatSubmit} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ask about tomorrow's schedule, deadlines, or room changes..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-white border border-[#e8e2d8] text-slate-900 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#e05842] text-white text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Send</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
