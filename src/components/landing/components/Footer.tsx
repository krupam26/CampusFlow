import { ArrowUp } from 'lucide-react';
import { playClick } from '../utils/sound';

interface FooterProps {
  onOpenLogin: () => void;
  onOpenPrivacy: () => void;
  onOpenContact: () => void;
}

export default function Footer({
  onOpenLogin,
  onOpenPrivacy,
  onOpenContact,
}: FooterProps) {
  const scrollToSection = (id: string) => {
    playClick();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-20 border-t border-[#e8e2d8] graph-paper-pattern pt-16 pb-12 px-6 text-slate-800 transition-colors duration-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Brand & Slogan */}
        <div className="text-center md:text-left space-y-1.5">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <div className="w-6 h-6 rounded bg-[#e05842] flex items-center justify-center text-white text-xs font-bold">
              K
            </div>
            <span className="font-pixel text-xl text-slate-900 font-bold tracking-tight">
              CAMPUSFLOW
            </span>
          </div>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">
            Your campus. Your schedule. Your flow.
          </p>
        </div>

        {/* Links: Home · Features · Sign in · Privacy · Contact */}
        <nav className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToTop();
            }}
            className="text-slate-600 hover:text-[#e05842] transition-colors"
          >
            Home
          </a>
          <span className="text-slate-300">·</span>
          <a
            href="#features"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('features');
            }}
            className="text-slate-600 hover:text-[#e05842] transition-colors"
          >
            Features
          </a>
          <span className="text-slate-300">·</span>
          <button
            type="button"
            onClick={() => {
              playClick();
              onOpenLogin();
            }}
            className="text-slate-600 hover:text-[#e05842] transition-colors cursor-pointer"
          >
            Sign in
          </button>
          <span className="text-slate-300">·</span>
          <button
            type="button"
            onClick={() => {
              playClick();
              onOpenPrivacy();
            }}
            className="text-slate-600 hover:text-[#e05842] transition-colors cursor-pointer"
          >
            Privacy
          </button>
          <span className="text-slate-300">·</span>
          <button
            type="button"
            onClick={() => {
              playClick();
              onOpenContact();
            }}
            className="text-slate-600 hover:text-[#e05842] transition-colors cursor-pointer"
          >
            Contact
          </button>
        </nav>

        {/* Back to Top */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={scrollToTop}
            className="p-2.5 rounded-lg border border-[#e8e2d8] bg-white text-slate-600 hover:text-slate-900 transition-all cursor-pointer shadow-2xs"
            title="Scroll back to top"
            aria-label="Back to top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-[#e8e2d8] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-4">
        <span>© {new Date().getFullYear()} CampusFlow. Academic OS for Krupa Mehta & students worldwide.</span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>CAMPUS AI ONLINE</span>
        </div>
      </div>
    </footer>
  );
}
