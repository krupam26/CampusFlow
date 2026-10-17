import { useState } from 'react';
import { Compass, RefreshCw, Zap, ArrowRight, CheckCircle2, FileUp, BellRing, CheckSquare } from 'lucide-react';
import { playClick } from '../utils/sound';

interface HowItWorksProps {
  onGetStarted: () => void;
}

export default function HowItWorks({ onGetStarted }: HowItWorksProps) {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  const steps = [
    {
      num: 1,
      stepLabel: 'STEP 01',
      title: 'Set up your space',
      description: 'Sign in and organize your timetable, assignments, and tasks.',
      icon: Compass,
      subtext: 'Add your courses once, import syllabus deadlines, and connect your semester rhythm in minutes.',
    },
    {
      num: 2,
      stepLabel: 'STEP 02',
      title: 'Stay in the loop',
      description: 'Keep track of deadlines and changes to your schedule.',
      icon: RefreshCw,
      subtext: 'Receive instant visual alerts when lecture halls are moved or submission windows are closing.',
    },
    {
      num: 3,
      stepLabel: 'STEP 03',
      title: 'Get things done',
      description: "See what's coming up and manage your priorities from one dashboard.",
      icon: Zap,
      subtext: 'Start every morning with a single calm itinerary and focused priority breakdown.',
    },
  ];

  return (
    <section id="how-it-works" className="relative z-20 dark-grid-pattern border-t border-slate-800 py-24 px-4 sm:px-6 text-white transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-medium text-[#e05842] border border-[#e05842]/30 bg-[#e05842]/10 mb-3">
            <span>// 3-STEP FLOW</span>
          </div>

          <h2
            style={{ fontFamily: "'Instrument Serif', serif" }}
            className="text-4xl sm:text-5xl md:text-6xl text-white font-normal tracking-tight"
          >
            Your academic life, simplified in three steps.
          </h2>
          <p className="text-slate-400 text-lg sm:text-xl mt-3 font-light leading-relaxed">
            From the first day of orientation to final exams — designed to eliminate chaos.
          </p>
        </div>

        {/* Interactive Step Switcher & Live Visual Sandbox */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Step Selection Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {steps.map((step) => {
              const Icon = step.icon;
              const isSelected = activeStep === step.num;
              return (
                <div
                  key={step.num}
                  onClick={() => {
                    playClick();
                    setActiveStep(step.num as 1 | 2 | 3);
                  }}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-slate-900 border-[#e05842] shadow-lg shadow-black/40 scale-[1.01]'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-mono font-medium ${isSelected ? 'text-[#e05842]' : 'text-slate-500'}`}>
                      {step.stepLabel}
                    </span>
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-[#e05842]' : 'text-slate-500'}`} />
                  </div>

                  <h3 className="text-xl font-semibold mb-2 text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm mb-3 font-medium text-slate-200">
                    {step.description}
                  </p>
                  <p className="text-xs leading-relaxed text-slate-400 font-light">
                    {step.subtext}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right: Interactive Sandbox Stage (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl p-6 sm:p-8 bg-slate-900/90 border border-slate-800 flex flex-col justify-between min-h-[440px] shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <span className="text-xs font-mono text-slate-400">
                  // Interactive Preview: Step {activeStep} in Action
                </span>
                <span className="text-xs font-medium text-emerald-400 flex items-center gap-1.5 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>SYNCHRONIZED</span>
                </span>
              </div>

              {/* Step 1 Interactive Preview */}
              {activeStep === 1 && (
                <div className="space-y-4 animate-fade-rise">
                  <div className="p-6 rounded-xl bg-slate-950/80 border border-dashed border-slate-700 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-[#e05842] mx-auto">
                      <FileUp className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">1-Click Syllabus & Timetable Import</h4>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 font-light">
                        Upload your university registrar schedule or .ics file. CampusFlow automatically extracts lecture halls, recitation times, and lab sessions.
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 text-slate-200 text-xs font-mono border border-slate-700">
                      <span>✓ Fall_Semester_Schedule.ics</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-emerald-400">3 Courses Loaded</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center text-xs">
                    <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                      <span className="font-mono font-semibold text-white block">CS 201</span>
                      <span className="text-[11px] text-slate-400 font-mono">Hall 204</span>
                    </div>
                    <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                      <span className="font-mono font-semibold text-white block">MATH 240</span>
                      <span className="text-[11px] text-slate-400 font-mono">Euler 302</span>
                    </div>
                    <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                      <span className="font-mono font-semibold text-white block">PHYS 150L</span>
                      <span className="text-[11px] text-slate-400 font-mono">Newton B12</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2 Interactive Preview */}
              {activeStep === 2 && (
                <div className="space-y-4 animate-fade-rise">
                  <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-600/40 text-xs space-y-2">
                    <div className="flex items-center justify-between text-amber-300 font-semibold">
                      <span className="flex items-center gap-1.5">
                        <BellRing className="w-4 h-4 text-amber-400" />
                        <span>Live Schedule Intercept Notice</span>
                      </span>
                      <span className="text-[10px] text-amber-400 font-mono">8:45 AM</span>
                    </div>
                    <p className="text-amber-200/90 leading-relaxed font-light">
                      Prof. Marcus Chen sent an urgent notice: MATH 240 today is moved to <strong>Auditorium South</strong>. Your daily walking route and schedule were updated automatically.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                    <span className="font-semibold text-slate-200 block">Upcoming Submission Countdown</span>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-300 font-medium">CS 201 AVL Tree Implementation</span>
                      <span className="font-mono text-rose-400 font-semibold">Due in 24h</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 Interactive Preview */}
              {activeStep === 3 && (
                <div className="space-y-3 animate-fade-rise">
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
                    <div className="flex items-center justify-between text-white font-semibold">
                      <span className="flex items-center gap-1.5">
                        <CheckSquare className="w-4 h-4 text-emerald-400" />
                        <span>Single-Dashboard Daily Prioritization</span>
                      </span>
                      <span className="text-emerald-400 font-mono text-[11px]">3 of 4 Done</span>
                    </div>

                    <div className="space-y-2 pt-1">
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <span className="line-through text-slate-500">09:00 AM — Data Structures Lecture</span>
                        <span className="text-emerald-400 font-mono text-[11px]">Attended</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <span className="line-through text-slate-500">11:00 AM — Calculus (Auditorium South)</span>
                        <span className="text-emerald-400 font-mono text-[11px]">Attended</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#e05842]/10 border border-[#e05842]/30 flex items-center justify-between">
                        <span className="text-white font-medium">02:30 PM — Physics Experimental Lab</span>
                        <span className="text-[#e05842] font-mono text-[11px] font-bold">Next Up</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Ready to test with your own classes?</span>
              <button
                type="button"
                onClick={() => {
                  playClick();
                  onGetStarted();
                }}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#e05842] hover:bg-[#cf4a35] rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Set Up My Semester</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
