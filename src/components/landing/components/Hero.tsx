import { useRef, useEffect } from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface HeroProps {
  onExploreFeatures: () => void;
}

export default function Hero({ onExploreFeatures }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy handled by muted attribute
      });
    }
  }, []);

  return (
    <section id="home" className="relative min-h-[96vh] flex flex-col justify-between items-center text-center px-6 pt-32 sm:pt-36 pb-16 selection:bg-white/20 selection:text-white">
      {/* Fullscreen Looping Background Video (Page 1 remains dark cinematic) */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
      />

      <div className="relative z-10 my-auto flex flex-col items-center max-w-5xl">
        {/* Original Instrument Serif Headline as in the start */}
        <h1
          style={{ fontFamily: "'Instrument Serif', serif" }}
          className="text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] max-w-7xl font-normal text-white animate-fade-rise"
        >
          Where <em className="not-italic text-slate-400">every day</em>{' '}
          finds its direction.
        </h1>

        {/* Briefed CampusFlow Subtext */}
        <p className="text-slate-300 text-base sm:text-lg md:text-xl max-w-2xl mt-8 leading-relaxed animate-fade-rise-delay font-light">
          CampusFlow unifies your timetable, assignments, and tasks into one calm workspace — so you spend less time tracking and more time flowing.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 animate-fade-rise-delay-2 w-full sm:w-auto">
          <Link
            href="/login"
            className="liquid-glass rounded-full px-10 sm:px-14 py-4 sm:py-5 text-base font-medium text-white hover:scale-[1.03] cursor-pointer transition-transform duration-300 inline-flex items-center justify-center gap-2 group w-full sm:w-auto shadow-2xl"
          >
            <span>Get Started — It&apos;s time to flow.</span>
            <Sparkles className="w-4 h-4 text-cyan-200 group-hover:rotate-12 transition-transform" />
          </Link>

          <button
            type="button"
            onClick={onExploreFeatures}
            className="liquid-glass rounded-full px-8 py-4 sm:py-5 text-sm sm:text-base text-slate-300 hover:text-white hover:scale-[1.02] cursor-pointer transition-all duration-300 inline-flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <span>Explore Academic OS</span>
            <ArrowDown className="w-4 h-4 text-slate-400 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Smooth Transition indicator into Academic OS */}
      <div className="relative z-10 pt-8 text-slate-400/80 text-xs tracking-widest uppercase flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#e05842]" />
        <span>CampusFlow Academic OS Below</span>
      </div>
    </section>
  );
}
