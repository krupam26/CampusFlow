import { X, ShieldCheck, Lock, EyeOff, Server } from 'lucide-react';
import { playClick } from '../utils/sound';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-rise">
      <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900">
        <button
          type="button"
          onClick={() => {
            playClick();
            onClose();
          }}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800">
            <ShieldCheck className="w-5 h-5 text-slate-700" />
          </div>
          <div>
            <h3
              style={{ fontFamily: "'Instrument Serif', serif" }}
              className="text-3xl text-slate-900 font-normal"
            >
              Privacy & Data Ethics
            </h3>
            <p className="text-xs text-slate-500">Student-first confidentiality standards</p>
          </div>
        </div>

        <div className="space-y-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <Lock className="w-4 h-4 text-emerald-600 mt-1 shrink-0" />
            <div>
              <span className="font-semibold text-slate-900 block">Zero Commercial Ad Tracking</span>
              <span>We never sell student data, search queries, schedules, or profile details to third-party ad networks.</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <Server className="w-4 h-4 text-sky-600 mt-1 shrink-0" />
            <div>
              <span className="font-semibold text-slate-900 block">Encrypted Schedule Storage</span>
              <span>Your assignments, to-dos, and timetable adjustments are encrypted on your local client workspace.</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <EyeOff className="w-4 h-4 text-purple-600 mt-1 shrink-0" />
            <div>
              <span className="font-semibold text-slate-900 block">Complete Data Export</span>
              <span>You retain full export and one-click deletion rights for all student data at any time.</span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 text-center">
          <button
            type="button"
            onClick={() => {
              playClick();
              onClose();
            }}
            className="px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
