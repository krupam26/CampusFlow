import { useState, useEffect } from 'react';
import { Menu, X, User, LogOut, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { playClick } from '../utils/sound';

interface NavbarProps {
  currentUser: { name: string; university: string; major: string } | null;
  onLogout: () => void;
}

export default function Navbar({
  currentUser,
  onLogout,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    playClick();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 selection:bg-white/20 selection:text-white ${
        scrolled
          ? 'bg-[#071724]/90 backdrop-blur-md border-b border-white/10 shadow-lg py-3 sm:py-3.5'
          : 'bg-transparent py-5 sm:py-6'
      }`}
    >
      <div className="flex row justify-between items-center px-6 sm:px-8 max-w-7xl mx-auto">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            playClick();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90 group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#e05842] flex items-center justify-center text-white shadow-xs">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 3.32L17.7 9 12 11.68 6.3 9 12 6.32zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
            </svg>
          </div>
          <span
            style={{ fontFamily: "'Instrument Serif', serif" }}
            className="text-2xl sm:text-3xl tracking-tight text-white font-normal"
          >
            CampusFlow
          </span>
          <sup className="text-xs font-mono text-slate-400 font-normal">OS</sup>
        </a>

        {/* Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center space-x-7">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              playClick();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-sm text-white transition-colors hover:text-slate-200"
          >
            Home
          </a>
          <a
            href="#features"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('features');
            }}
            className="text-sm text-slate-300 hover:text-white transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('how-it-works');
            }}
            className="text-sm text-slate-300 hover:text-white transition-colors"
          >
            How it works
          </a>
          <a
            href="#why-campusflow"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('why-campusflow');
            }}
            className="text-sm text-slate-300 hover:text-white transition-colors"
          >
            Why CampusFlow
          </a>
          {!currentUser ? (
            <Link
              href="/login"
              onClick={playClick}
              className="text-sm text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Sign in
            </Link>
          ) : null}
        </nav>

        {/* Action Button & User Info */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="hidden sm:flex items-center gap-2 liquid-glass rounded-full px-4 py-2 text-xs text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <User className="w-3.5 h-3.5 text-slate-300" />
              <span className="font-medium">{currentUser.name}</span>
              <button
                type="button"
                onClick={() => {
                  playClick();
                  onLogout();
                }}
                className="ml-2 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={playClick}
              className="liquid-glass rounded-full px-6 py-2.5 text-sm text-white hover:scale-[1.03] transition-transform duration-300 cursor-pointer hidden sm:inline-flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            </Link>
          )}

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden liquid-glass rounded-full p-2.5 text-white cursor-pointer focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-6 pt-2 pb-6 max-w-7xl mx-auto animate-fade-rise">
          <div className="liquid-glass rounded-2xl p-6 flex flex-col space-y-4 bg-[#071724]/95 border border-white/10 shadow-2xl">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-base text-white font-medium"
            >
              Home
            </a>
            <a
              href="#features"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('features');
              }}
              className="text-base text-slate-300 hover:text-white"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('how-it-works');
              }}
              className="text-base text-slate-300 hover:text-white"
            >
              How it works
            </a>
            <a
              href="#why-campusflow"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('why-campusflow');
              }}
              className="text-base text-slate-300 hover:text-white"
            >
              Why CampusFlow
            </a>

            {currentUser ? (
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-white">{currentUser.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-300 hover:underline"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-2 flex flex-col gap-2.5 border-t border-white/10">
                <Link
                  href="/login"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    playClick();
                  }}
                  className="w-full text-center py-2.5 text-sm text-slate-300 hover:text-white"
                >
                  Sign in
                </Link>
                <Link
                  href="/login"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    playClick();
                  }}
                  className="w-full liquid-glass rounded-full py-3 text-sm text-white text-center"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
