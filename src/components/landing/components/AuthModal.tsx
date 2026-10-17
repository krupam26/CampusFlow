import React, { useState } from 'react';
import { X, Sparkles, User, Lock, Mail, GraduationCap, Building } from 'lucide-react';
import { playClick } from '../utils/sound';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'signup';
  onClose: () => void;
  onSuccess: (user: { name: string; university: string; major: string }) => void;
}

export default function AuthModal({
  isOpen,
  initialMode,
  onClose,
  onSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [university, setUniversity] = useState('Stanford University');
  const [major, setMajor] = useState('Computer Science');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    if (mode === 'signup') {
      onSuccess({
        name: name.trim() || 'Alex Rivera',
        university: university || 'State University',
        major: major || 'Computer Science',
      });
    } else {
      onSuccess({
        name: 'Alex Rivera',
        university: 'Pacific Coast University',
        major: 'Computer Science \'27',
      });
    }
    onClose();
  };

  const handleDemoLogin = () => {
    playClick();
    onSuccess({
      name: 'Alex Rivera',
      university: 'Pacific Coast University',
      major: 'Computer Science \'27',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-rise">
      <div className="relative w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900">
        <button
          type="button"
          onClick={() => {
            playClick();
            onClose();
          }}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 mb-6 bg-slate-100 p-1 rounded-lg border border-slate-200 max-w-[220px]">
          <button
            type="button"
            onClick={() => {
              playClick();
              setMode('login');
            }}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              playClick();
              setMode('signup');
            }}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Get Started
          </button>
        </div>

        <div className="mb-6">
          <h3
            style={{ fontFamily: "'Instrument Serif', serif" }}
            className="text-3xl text-slate-900 font-normal"
          >
            {mode === 'login' ? 'Welcome back to CampusFlow' : 'Create your student workspace'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {mode === 'login'
              ? 'Access your timetable, assignment priorities, and schedule alerts.'
              : 'Bring your academic schedule and daily assignments together.'}
          </p>
        </div>

        {/* 1-Click Demo Shortcut */}
        <div className="mb-5 p-3 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-between">
          <div className="text-xs">
            <span className="font-semibold text-slate-900 block">Instant Student Preview</span>
            <span className="text-[11px] text-slate-500">Alex Rivera (CS &apos;27)</span>
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
          >
            <Sparkles className="w-3 h-3 text-sky-300" />
            <span>1-Click Demo</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan Lee"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    University / College
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-3 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="University"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Major & Year
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3.5 top-3 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. Biology '26"
                      value={major}
                      onChange={(e) => setMajor(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-medium text-slate-700 mb-1">
              University Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all cursor-pointer shadow-md"
          >
            {mode === 'login' ? 'Sign In to Workspace' : "Get Started — It's time to flow"}
          </button>
        </form>

        <p className="text-[11px] text-center text-slate-500 mt-4">
          {mode === 'login' ? (
            <>
              Don&apos;t have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setMode('signup');
                }}
                className="text-slate-900 font-semibold hover:underline cursor-pointer"
              >
                Sign up free
              </button>
            </>
          ) : (
            <>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setMode('login');
                }}
                className="text-slate-900 font-semibold hover:underline cursor-pointer"
              >
                Sign in here
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
