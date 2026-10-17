import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { playClick } from '../utils/sound';

interface FinalCTAProps {
  onGetStarted: () => void;
}

export default function FinalCTA({ onGetStarted }: FinalCTAProps) {
  return (
    <section className="relative z-20 dark-grid-pattern border-t border-slate-800 py-24 sm:py-32 px-4 sm:px-6 transition-colors duration-500">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-3xl p-8 sm:p-14 md:p-18 bg-slate-900 border border-slate-800 text-white text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            <span className="text-xs uppercase tracking-widest text-[#e05842] font-mono mb-4 font-bold">
              // YOUR ACADEMIC OS
            </span>

            <h2
              style={{ fontFamily: "'Instrument Serif', serif" }}
              className="text-4xl sm:text-6xl md:text-7xl text-white font-normal tracking-tight leading-[1.05]"
            >
              Make every college day count.
            </h2>

            <p className="text-slate-300 text-base sm:text-lg md:text-xl mt-6 max-w-2xl leading-relaxed font-light">
              A more organized semester starts with a better plan. Bring your academic schedule, assignments, and tasks together with CampusFlow.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  playClick();
                  onGetStarted();
                }}
                className="w-full sm:w-auto px-10 py-4 text-base font-semibold text-white bg-[#e05842] hover:bg-[#cf4a35] rounded-full transition-all cursor-pointer shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <span>Get Started — It&apos;s time to flow.</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero clutter, no advertisements</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#e05842]" />
                <span>Instant timetable sync</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
