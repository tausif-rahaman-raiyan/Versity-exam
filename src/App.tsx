import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { QuestionBankView } from './components/QuestionBankView';
import { StrictExamView } from './components/StrictExamView';
import { BookmarksView } from './components/BookmarksView';
import { AnalyticsView } from './components/AnalyticsView';
import { EXAM_SESSIONS, ExamSession } from './data/questionBank';
import { Key, Sparkles, X, CheckCircle, ShieldCheck, ExternalLink, HelpCircle } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'questionBank' | 'exam' | 'bookmarks' | 'analytics'>('home');
  const [selectedSession, setSelectedSession] = useState<ExamSession>(EXAM_SESSIONS[0]);
  // Default to Dark Navy / Midnight Black as requested
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Helper to read cookie
  const getCookieKey = () => {
    if (typeof document === 'undefined') return '';
    const match = document.cookie.match(/(?:^|;\s*)custom_gemini_api_key=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : '';
  };

  // Gemini API Key state - read from localStorage with cookie fallback
  const [customApiKey, setCustomApiKey] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('custom_gemini_api_key');
      if (stored) return stored;
      const cookieVal = getCookieKey();
      if (cookieVal) return cookieVal;
    }
    return '';
  });
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [tempKeyInput, setTempKeyInput] = useState<string>('');
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<boolean>(false);
  const [showKeyText, setShowKeyText] = useState<boolean>(false);

  // Sync dark class on root document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSelectExam = (session: ExamSession, mode: 'exam' | 'qb') => {
    setSelectedSession(session);
    if (mode === 'exam') {
      setCurrentView('exam');
    } else {
      setCurrentView('questionBank');
    }
  };

  const handleSaveApiKey = () => {
    const trimmed = tempKeyInput.trim();
    setCustomApiKey(trimmed);
    try {
      localStorage.setItem('custom_gemini_api_key', trimmed);
      document.cookie = `custom_gemini_api_key=${encodeURIComponent(trimmed)}; path=/; max-age=31536000; SameSite=Strict`;
    } catch (e) {
      console.warn('Storage warning:', e);
    }
    setSavedSuccessMsg(true);
    setTimeout(() => {
      setSavedSuccessMsg(false);
      setIsApiKeyModalOpen(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 transition-colors flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        selectedExamTitle={selectedSession.title}
        onOpenApiKeyModal={() => {
          setTempKeyInput(customApiKey);
          setIsApiKeyModalOpen(true);
        }}
        hasCustomKey={Boolean(customApiKey)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentView === 'home' && (
          <HomeView
            onSelectExam={handleSelectExam}
            setCurrentView={setCurrentView}
            onOpenApiKeyModal={() => {
              setTempKeyInput(customApiKey);
              setIsApiKeyModalOpen(true);
            }}
          />
        )}
        {currentView === 'questionBank' && (
          <QuestionBankView
            session={selectedSession}
            onBack={() => setCurrentView('home')}
            onStartExam={(sessionId) => {
              const found = EXAM_SESSIONS.find(s => s.id === sessionId);
              if (found) setSelectedSession(found);
              setCurrentView('exam');
            }}
            customApiKey={customApiKey}
          />
        )}
        {currentView === 'exam' && (
          <StrictExamView
            examSession={selectedSession}
            onBack={() => setCurrentView('home')}
            customApiKey={customApiKey}
            setCustomApiKey={setCustomApiKey}
          />
        )}
        {currentView === 'bookmarks' && (
          <BookmarksView setCurrentView={setCurrentView} />
        )}
        {currentView === 'analytics' && (
          <AnalyticsView setCurrentView={setCurrentView} />
        )}
      </main>

      {/* Global API Key Configuration Modal */}
      {isApiKeyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#0B1222] border border-indigo-900/80 rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl space-y-4 text-slate-100 my-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    Gemini API Key Settings
                  </h3>
                  <span className="text-[10px] text-slate-400">Ask AI Tutor Configuration</span>
                </div>
              </div>
              <button
                onClick={() => setIsApiKeyModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Visual 3-Step Guide: How to get Free API Key */}
            <div className="bg-[#070D1B] border border-indigo-950 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-sky-400" />
                  ফ্রি API Key পাওয়ার ৩টি সহজ ধাপ (100% Free):
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                  No Card Required
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-start gap-2.5 bg-[#091122] p-2.5 rounded-xl border border-slate-800/80">
                  <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5 border border-sky-500/30">
                    ১
                  </span>
                  <div className="flex-1">
                    <p className="text-[11px] leading-relaxed">
                      গুগল এআই স্টুডিওতে যান এবং আপনার গুগল অ্যাকাউন্ট দিয়ে সাইন ইন করুন:
                    </p>
                    <a
                      href="https://aistudio.google.com/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-[11px] transition-colors shadow-sm"
                    >
                      <span>Google AI Studio খুলুন (Get API Key)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-[#091122] p-2.5 rounded-xl border border-slate-800/80">
                  <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5 border border-sky-500/30">
                    ২
                  </span>
                  <p className="text-[11px] leading-relaxed flex-1">
                    সেখানে নীল রঙের <strong className="text-white bg-slate-800 px-1.5 py-0.5 rounded">Create API key</strong> বাটনে ক্লিক করুন। এক ক্লিকেই ফ্রি কি তৈরি হয়ে যাবে।
                  </p>
                </div>

                <div className="flex items-start gap-2.5 bg-[#091122] p-2.5 rounded-xl border border-slate-800/80">
                  <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5 border border-sky-500/30">
                    ৩
                  </span>
                  <p className="text-[11px] leading-relaxed flex-1">
                    তৈরি হওয়া <code className="text-amber-300 font-mono text-[10px] bg-slate-800 px-1 py-0.5 rounded">AIzaSy...</code> কি-টি কপি করে নিচের বক্সে পেস্ট করে <strong>Save & Activate</strong> চাপুন।
                  </p>
                </div>
              </div>
            </div>

            {/* Input Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] text-slate-300 font-semibold">
                  আপনার Gemini API Key পেস্ট করুন:
                </label>
                {tempKeyInput.trim().startsWith('AIzaSy') && tempKeyInput.trim().length >= 30 && (
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                    <CheckCircle className="w-3 h-3" /> Valid Key Format
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showKeyText ? 'text' : 'password'}
                  value={tempKeyInput}
                  onChange={(e) => setTempKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-[#080E1C] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 pr-16"
                />
                <button
                  type="button"
                  onClick={() => setShowKeyText(!showKeyText)}
                  className="absolute right-2.5 top-2.5 text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800"
                >
                  {showKeyText ? 'Hide' : 'Show'}
                </button>
              </div>
              <span className="text-[10px] text-slate-400 block">
                🔒 এটি আপনার ব্রাউজারের লোকাল স্টোরেজে সুরক্ষিত থাকবে এবং অন্য কোথাও প্রকাশ পাবে না।
              </span>
            </div>

            {savedSuccessMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> API Key সফলভাবে সেভ করা হয়েছে!
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  setTempKeyInput('');
                  setCustomApiKey('');
                  try {
                    localStorage.removeItem('custom_gemini_api_key');
                    document.cookie = 'custom_gemini_api_key=; path=/; max-age=0;';
                  } catch (e) {
                    // ignore
                  }
                  setSavedSuccessMsg(true);
                  setTimeout(() => {
                    setSavedSuccessMsg(false);
                    setIsApiKeyModalOpen(false);
                  }, 1000);
                }}
                className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-medium transition-colors"
              >
                Clear Key
              </button>
              <button
                onClick={handleSaveApiKey}
                className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> Save & Activate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-indigo-950/80 py-8 bg-[#040711] text-center text-xs text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 space-y-1.5">
          <p className="font-semibold text-slate-300">
            © 2026 Varsity Science Admission Question Bank & Exam Portal (DU, RU, JU, CU, GST).
          </p>
          <p className="text-[11px] text-slate-500">
            Last 10+ Years Full Individual Exam Papers • Strict One-Page Auto-Lock Mode • Powered by Google Gemini 3.8
          </p>
        </div>
      </footer>
    </div>
  );
}
