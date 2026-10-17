import React, { useState } from 'react';
import { X, Send, CheckCircle2, MessageSquare, Mail } from 'lucide-react';
import { playClick } from '../utils/sound';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: () => void;
}

export default function ContactModal({
  isOpen,
  onClose,
  onSubmitted,
}: ContactModalProps) {
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Campus Integration');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    setSent(true);
    onSubmitted();
    setTimeout(() => {
      setSent(false);
      setEmail('');
      setMessage('');
      onClose();
    }, 1800);
  };

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

        {!sent ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800">
                <MessageSquare className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <h3
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                  className="text-3xl text-slate-900 font-normal"
                >
                  Reach CampusFlow
                </h3>
                <p className="text-xs text-slate-500">Student support, campus partnerships & feature suggestions</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  Your Student / Faculty Email
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
                  Topic
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white"
                >
                  <option value="Campus Integration">Bring CampusFlow to my university</option>
                  <option value="Feature Request">Request a new feature</option>
                  <option value="Bug Report">Report a timetable sync issue</option>
                  <option value="Student Ambassador">Student Ambassador program</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us what you need or how we can make your semester smoother..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 text-xs rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 mt-4 shadow-xs"
              >
                <span>Send Message</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        ) : (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <h4
              style={{ fontFamily: "'Instrument Serif', serif" }}
              className="text-3xl text-slate-900"
            >
              Message Received
            </h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Thank you! Our student support team will reply to <span className="font-semibold text-slate-900">{email}</span> within 24 hours.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
