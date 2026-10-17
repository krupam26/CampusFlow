import { useState } from 'react';
import { Layers, CalendarCheck, ClockAlert, Target, Sliders, Check, X } from 'lucide-react';
import { playClick } from '../utils/sound';

export default function WhyCampusFlow() {
  const [creditHours, setCreditHours] = useState(15);

  const pillars = [
    {
      title: 'One workspace',
      highlight: 'Keep essential academic information together.',
      description:
        'No more toggling across disparate LMS tabs, buried email chains, and separate reminder apps. Your courses, assignments, and notes reside in cohesive order.',
      icon: Layers,
      tag: '// CENTRALIZED',
    },
    {
      title: 'Fewer missed deadlines',
      highlight: 'Make upcoming work easier to see.',
      description:
        'Visual priority indicators and active countdown timers ensure high-stakes problem sets, projects, and midterm papers stay top-of-mind before late penalties kick in.',
      icon: CalendarCheck,
      tag: '// ZERO_OVERLOOKED',
    },
    {
      title: 'Flexible scheduling',
      highlight: 'Account for changes to classes and lab sessions.',
      description:
        'College life is dynamic. When a professor reschedules a lecture to an auditorium or shifts an experimental lab session, CampusFlow immediately keeps your schedule current.',
      icon: ClockAlert,
      tag: '// REALTIME_SYNC',
    },
    {
      title: 'A clearer daily plan',
      highlight: 'Know what needs your attention next.',
      description:
        'Start each day knowing precisely which lecture hall to walk to, what to study between classes, and which personal tasks to complete before evening.',
      icon: Target,
      tag: '// CALM_FOCUS',
    },
  ];

  const estimatedStudyHours = Math.round(creditHours * 1.8);
  const weeklySubmissions = Math.round(creditHours * 0.4);

  return (
    <section id="why-campusflow" className="relative z-20 graph-paper-pattern border-t border-[#e8e2d8] py-24 px-4 sm:px-6 text-slate-900 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-medium text-[#e05842] border border-[#f4d5cc] bg-[#faece8] mb-3">
            <span>// THE STUDENT ADVANTAGE</span>
          </div>

          <h2
            style={{ fontFamily: "'Instrument Serif', serif" }}
            className="text-4xl sm:text-5xl md:text-6xl text-slate-900 font-normal tracking-tight"
          >
            Built around the way students actually work.
          </h2>
          <p className="text-slate-600 text-lg sm:text-xl mt-3 font-light leading-relaxed">
            Engineered to replace scattered notes and frantic campus group chats with quiet, reliable clarity.
          </p>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div
                key={index}
                className="graph-paper-card rounded-2xl p-6 sm:p-8 bg-white border border-[#e8e2d8] shadow-xs flex flex-col justify-between hover:border-[#d0c6b6] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#faece8] border border-[#f4d5cc] flex items-center justify-center text-[#e05842]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 font-bold">{pillar.tag}</span>
                  </div>

                  <h3 className="font-pixel text-xl sm:text-2xl font-bold text-slate-900 mb-1.5">
                    {pillar.title}
                  </h3>
                  <p className="text-sm font-semibold text-[#e05842] mb-2.5">
                    {pillar.highlight}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Semester Workload & Stress Gauge matching the theme */}
        <div className="graph-paper-card rounded-2xl p-6 sm:p-10 mb-16 bg-white border border-[#e8e2d8] shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-md space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#e05842]">
                <Sliders className="w-4 h-4" />
                <span>// SEMESTER LOAD SIMULATOR</span>
              </div>
              <h3
                style={{ fontFamily: "'Instrument Serif', serif" }}
                className="text-3xl sm:text-4xl text-slate-900 font-normal"
              >
                Estimate your weekly academic balance.
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                Adjust your registered credits to see how CampusFlow organizes your out-of-class study blocks, upcoming deliverables, and campus life.
              </p>

              {/* Slider */}
              <div className="pt-2">
                <div className="flex justify-between text-xs font-semibold text-slate-800 mb-2">
                  <span>Enrolled Course Credits:</span>
                  <span className="font-mono text-sm text-[#e05842]">{creditHours} Credits</span>
                </div>
                <input
                  type="range"
                  min="9"
                  max="21"
                  step="1"
                  value={creditHours}
                  onChange={(e) => {
                    playClick();
                    setCreditHours(parseInt(e.target.value, 10));
                  }}
                  className="w-full accent-[#e05842] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>Light (9 cr)</span>
                  <span>Standard (15 cr)</span>
                  <span>Intense (21 cr)</span>
                </div>
              </div>
            </div>

            {/* Live Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:w-1/2">
              <div className="p-4 rounded-xl bg-[#fbf9f5] border border-[#e8e2d8] text-center shadow-2xs">
                <span className="text-2xl sm:text-3xl font-mono font-bold text-slate-900 block">
                  {estimatedStudyHours}h
                </span>
                <span className="text-xs text-slate-500 font-medium">Weekly Study Hours</span>
              </div>
              <div className="p-4 rounded-xl bg-[#fbf9f5] border border-[#e8e2d8] text-center shadow-2xs">
                <span className="text-2xl sm:text-3xl font-mono font-bold text-slate-900 block">
                  {weeklySubmissions}
                </span>
                <span className="text-xs text-slate-500 font-medium">Weekly Deadlines</span>
              </div>
              <div className="p-4 rounded-xl bg-[#ebf5ed] border border-[#d2ebd7] text-center col-span-2 sm:col-span-1 shadow-2xs">
                <span className="text-2xl sm:text-3xl font-mono font-bold text-[#2e7d32] block">
                  100%
                </span>
                <span className="text-xs text-[#2e7d32] font-semibold">Organized in Flow</span>
              </div>
            </div>
          </div>
        </div>

        {/* Clean Comparison Box */}
        <div className="graph-paper-card rounded-2xl p-6 sm:p-10 bg-white border border-[#e8e2d8] shadow-sm">
          <h3
            style={{ fontFamily: "'Instrument Serif', serif" }}
            className="text-3xl text-slate-900 mb-8 text-center"
          >
            A Day in the Life: With vs. Without CampusFlow
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Without */}
            <div className="p-6 rounded-xl bg-[#fdf3f0] border border-[#f5d7ce] space-y-4">
              <div className="flex items-center gap-2 text-[#e05842] text-sm font-semibold pb-2 border-b border-[#f5d7ce]">
                <X className="w-4 h-4 text-[#e05842]" />
                <span className="font-mono uppercase text-xs">Without CampusFlow</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700 font-light">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#e05842] shrink-0 mt-0.5">✕</span>
                  <span>Walking 15 minutes across campus only to find an empty room because an email notice was buried.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#e05842] shrink-0 mt-0.5">✕</span>
                  <span>Remembering a lab report is due at 11:59 PM only while getting ready for bed.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#e05842] shrink-0 mt-0.5">✕</span>
                  <span>Constantly asking classmates &quot;where are we meeting today?&quot; in bloated group chats.</span>
                </li>
              </ul>
            </div>

            {/* With */}
            <div className="p-6 rounded-xl bg-[#ebf5ed] border border-[#d2ebd7] space-y-4">
              <div className="flex items-center gap-2 text-[#2e7d32] text-sm font-semibold pb-2 border-b border-[#d2ebd7]">
                <Check className="w-4 h-4 text-[#2e7d32]" />
                <span className="font-mono uppercase text-xs">With CampusFlow</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-800 font-normal">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2e7d32] shrink-0 mt-0.5">✓</span>
                  <span>Instant schedule shift banners that flag room changes before you leave your dorm.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2e7d32] shrink-0 mt-0.5">✓</span>
                  <span>Sorted, priority-weighted assignment queues with Pomodoro sprint blocks built-in.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2e7d32] shrink-0 mt-0.5">✓</span>
                  <span>One reliable student virtual assistant for answers about office hours, labs, and exam dates.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
