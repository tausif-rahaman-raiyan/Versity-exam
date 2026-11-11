import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { QuestionBankView } from './components/QuestionBankView';
import { StrictExamView } from './components/StrictExamView';
import { AnalyticsView } from './components/AnalyticsView';
import { SubjectSelectionModal } from './components/SubjectSelectionModal';
import { EXAM_SESSIONS, ExamSession, requiresSubjectSelection } from './data/questionBank';
import { Key, Sparkles, X, CheckCircle, ExternalLink, HelpCircle } from 'lucide-react';
import { UiSettings, loadUiSettings, saveUiSettings, loadThemeMode, saveThemeMode } from './utils/uiSettings';
import { ExamLanguage } from './utils/examTranslator';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'questionBank' | 'exam' | 'analytics'>('home');
  const [selectedSession, setSelectedSession] = useState<ExamSession>(EXAM_SESSIONS[0]);
  const [selectedExamSubjects, setSelectedExamSubjects] = useState<string[]>([
    'Physics',
    'Chemistry',
    'Mathematics',
    'Biology',
  ]);
  const [examLanguage, setExamLanguage] = useState<ExamLanguage>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('varsity_qb_exam_lang');
      if (saved === 'en' || saved === 'bn') return saved;
    }
    return 'bn';
  });
  const [pendingSubjectModalSession, setPendingSubjectModalSession] = useState<ExamSession | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(() => loadThemeMode());
  const [homeScrollY, setHomeScrollY] = useState<number>(0);
  const [uiSettings, setUiSettings] = useState<UiSettings>(() => loadUiSettings());

  const handleSetExamLanguage = (lang: ExamLanguage) => {
    setExamLanguage(lang);
    try {
      localStorage.setItem('varsity_qb_exam_lang', lang);
    } catch {
      // ignore storage errors
    }
  };

  const handleUpdateSettings = (next: UiSettings) => {
    setUiSettings(next);
    saveUiSettings(next);
  };

  const handleSetDarkMode = (dark: boolean) => {
    setDarkMode(dark);
    saveThemeMode(dark);
  };

  const navigateTo = (view: 'home' | 'questionBank' | 'exam' | 'analytics') => {
    if (currentView === 'home' && view !== 'home') {
      setHomeScrollY(window.scrollY);
    }
    setCurrentView(view);
  };

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

  // Sync dark class on root document and persist to localStorage
  useEffect(() => {
    saveThemeMode(darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light-mode');
    }
  }, [darkMode]);

  useEffect(() => {
    if (currentView === 'home') {
      window.scrollTo({ top: homeScrollY, behavior: 'auto' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentView]);

  const handleSelectExam = (session: ExamSession, mode: 'exam' | 'qb') => {
    if (mode === 'exam' && requiresSubjectSelection(session)) {
      setPendingSubjectModalSession(session);
      return;
    }

    if (currentView === 'home') {
      setHomeScrollY(window.scrollY);
    }
    setSelectedSession(session);
    if (mode === 'exam') {
      setCurrentView('exam');
    } else {
      setCurrentView('questionBank');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmStartDuExam = (
    session: ExamSession,
    chosenSubjects: string[],
    language: ExamLanguage
  ) => {
    if (currentView === 'home') {
      setHomeScrollY(window.scrollY);
    }
    setSelectedSession(session);
    setSelectedExamSubjects(chosenSubjects);
    handleSetExamLanguage(language);
    setPendingSubjectModalSession(null);
    setCurrentView('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenApiKeyModal = () => {
    setTempKeyInput(customApiKey);
    setIsApiKeyModalOpen(true);
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
    <div className="min-h-screen bg-white dark:bg-[#060913] text-slate-900 dark:text-slate-100 transition-colors flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {currentView !== 'exam' && (
        <Navbar
          currentView={currentView}
          setCurrentView={navigateTo}
          darkMode={darkMode}
          setDarkMode={handleSetDarkMode}
          selectedExamTitle={selectedSession.title}
          onOpenApiKeyModal={handleOpenApiKeyModal}
          hasCustomKey={Boolean(customApiKey)}
          uiSettings={uiSettings}
          onUpdateSettings={handleUpdateSettings}
        />
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {currentView === 'home' && (
          <HomeView
            onSelectExam={handleSelectExam}
            setCurrentView={navigateTo}
            onOpenApiKeyModal={handleOpenApiKeyModal}
          />
        )}
        {currentView === 'questionBank' && (
          <QuestionBankView
            session={selectedSession}
            onBack={() => navigateTo('home')}
            onStartExam={(sessionId) => {
              const found = EXAM_SESSIONS.find((s) => s.id === sessionId) || selectedSession;
              handleSelectExam(found, 'exam');
            }}
            customApiKey={customApiKey}
            onOpenApiKeyModal={handleOpenApiKeyModal}
            uiSettings={uiSettings}
            examLanguage={examLanguage}
            onChangeExamLanguage={handleSetExamLanguage}
          />
        )}
        {currentView === 'exam' && (
          <StrictExamView
            examSession={selectedSession}
            onBack={() => navigateTo('home')}
            customApiKey={customApiKey}
            setCustomApiKey={setCustomApiKey}
            darkMode={darkMode}
            setDarkMode={handleSetDarkMode}
            onOpenApiKeyModal={handleOpenApiKeyModal}
            uiSettings={uiSettings}
            onUpdateSettings={handleUpdateSettings}
            selectedExamSubjects={selectedExamSubjects}
            onChangeSubjects={() => setPendingSubjectModalSession(selectedSession)}
            examLanguage={examLanguage}
            onChangeExamLanguage={handleSetExamLanguage}
          />
        )}
        {currentView === 'analytics' && (
          <AnalyticsView
            setCurrentView={navigateTo}
            onSelectExam={handleSelectExam}
          />
        )}
      </main>

      {/* DU 25-26 to 19-20 MCQ 4/6 Subject Selection & Language Modal */}
      <SubjectSelectionModal
        isOpen={Boolean(pendingSubjectModalSession)}
        session={pendingSubjectModalSession}
        initialSubjects={selectedExamSubjects}
        initialLanguage={examLanguage}
        onClose={() => setPendingSubjectModalSession(null)}
        onConfirmStartExam={handleConfirmStartDuExam}
      />

      {/* Global API Key Configuration Modal */}
      {isApiKeyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#0B1222] border border-slate-200 dark:border-indigo-900/80 rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl space-y-4 text-slate-900 dark:text-slate-100 my-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    Gemini API Key Settings
                  </h3>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Ask AI Tutor Configuration</span>
                </div>
              </div>
              <button
                onClick={() => setIsApiKeyModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Visual 3-Step Guide: How to get Free API Key */}
            <div className="bg-slate-50 dark:bg-[#070D1B] border border-slate-200 dark:border-indigo-950 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold text-indigo-700 dark:text-sky-300 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
                  ফ্রি API Key পাওয়ার ৩টি সহজ ধাপ (100% Free):
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 font-semibold">
                  No Card Required
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-start gap-2.5 bg-white dark:bg-[#091122] p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-sky-500/20 text-indigo-700 dark:text-sky-300 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5 border border-indigo-200 dark:border-sky-500/30">
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
                      className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] transition-colors shadow-sm"
                    >
                      <span>Google AI Studio খুলুন (Get API Key)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-white dark:bg-[#091122] p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-sky-500/20 text-indigo-700 dark:text-sky-300 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5 border border-indigo-200 dark:border-sky-500/30">
                    ২
                  </span>
                  <p className="text-[11px] leading-relaxed flex-1">
                    সেখানে নীল রঙের <strong className="text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">Create API key</strong> বাটনে ক্লিক করুন। এক ক্লিকেই ফ্রি কি তৈরি হয়ে যাবে।
                  </p>
                </div>

                <div className="flex items-start gap-2.5 bg-white dark:bg-[#091122] p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-sky-500/20 text-indigo-700 dark:text-sky-300 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5 border border-indigo-200 dark:border-sky-500/30">
                    ৩
                  </span>
                  <p className="text-[11px] leading-relaxed flex-1">
                    তৈরি হওয়া <code className="text-amber-700 dark:text-amber-300 font-mono text-[10px] bg-amber-50 dark:bg-slate-800 px-1 py-0.5 rounded">AIzaSy...</code> কি-টি কপি করে নিচের বক্সে পেস্ট করে <strong>Save & Activate</strong> চাপুন।
                  </p>
                </div>
              </div>
            </div>

            {/* Input Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] text-slate-700 dark:text-slate-300 font-semibold">
                  আপনার Gemini API Key পেস্ট করুন:
                </label>
                {tempKeyInput.trim().startsWith('AIzaSy') && tempKeyInput.trim().length >= 30 && (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
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
                  className="w-full bg-slate-50 dark:bg-[#080E1C] border border-slate-300 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 dark:focus:border-sky-500 pr-16"
                />
                <button
                  type="button"
                  onClick={() => setShowKeyText(!showKeyText)}
                  className="absolute right-2.5 top-2.5 text-[10px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800"
                >
                  {showKeyText ? 'Hide' : 'Show'}
                </button>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                🔒 এটি আপনার ব্রাউজারের লোকাল স্টোরেজে সুরক্ষিত থাকবে এবং অন্য কোথাও প্রকাশ পাবে না।
              </span>
            </div>

            {savedSuccessMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> API Key সফলভাবে সেভ করা হয়েছে!
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
                className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl text-xs font-medium transition-colors"
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
      <footer className="border-t border-slate-200 dark:border-indigo-950/80 py-8 bg-white dark:bg-[#040711] text-center text-xs text-slate-600 dark:text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 space-y-2.5">
          <p className="font-semibold text-slate-800 dark:text-slate-300">
            © 2026 Varsity Science Admission Question Bank & Exam Portal (DU, RU, JU, CU, GST).
          </p>
          <p className="text-xs font-bold text-indigo-600 dark:text-sky-400">
            developed by Tausif Rahaman Raiyan
          </p>
          <div className="flex items-center justify-center gap-3 pt-1">
            <a
              href="https://www.instagram.com/tausifrahamanraiyan/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Profile"
              title="Instagram - Tausif Rahaman Raiyan"
              className="group inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-950/50 hover:bg-gradient-to-r hover:from-fuchsia-600 hover:to-pink-600 border border-fuchsia-300 dark:border-fuchsia-800/60 hover:border-fuchsia-500 text-fuchsia-700 dark:text-fuchsia-300 hover:text-white font-bold text-xs transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg hover:shadow-fuchsia-500/25"
            >
              <svg className="w-4 h-4 fill-current transition-transform duration-200 group-hover:rotate-6" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span>Instagram</span>
            </a>

            <a
              href="https://tausif-rahaman-raiyan.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Portfolio"
              title="GitHub - Tausif Rahaman Raiyan"
              className="group inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-900 dark:hover:bg-white border border-slate-300 dark:border-slate-700 hover:border-slate-900 dark:hover:border-white text-slate-800 dark:text-slate-200 hover:text-white dark:hover:text-slate-950 font-bold text-xs transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg hover:shadow-slate-500/25"
            >
              <svg className="w-4 h-4 fill-current transition-transform duration-200 group-hover:-rotate-6" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
