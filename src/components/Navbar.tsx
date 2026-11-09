import React from 'react';
import { BookOpen, Bookmark, BarChart2, Moon, Sun, ShieldCheck, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'questionBank' | 'exam' | 'bookmarks' | 'analytics';
  setCurrentView: (view: 'home' | 'questionBank' | 'exam' | 'bookmarks' | 'analytics') => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  selectedExamTitle?: string;
  onOpenApiKeyModal: () => void;
  hasCustomKey: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  darkMode,
  setDarkMode,
  onOpenApiKeyModal,
  hasCustomKey,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#070B14]/90 backdrop-blur-md border-b border-indigo-950/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div 
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-3 cursor-pointer shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-sky-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-white block leading-none">
              Varsity Science QB
            </span>
            <span className="text-[11px] text-sky-400 font-medium">
              DU • RU • JU • CU • GST 10-Year Bank
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Clean & uncluttered) */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-300">
          <button 
            onClick={() => setCurrentView('home')}
            className={`hover:text-sky-400 transition-colors whitespace-nowrap ${currentView === 'home' ? 'text-sky-400 font-semibold' : ''}`}
          >
            All 5 Universities
          </button>
          <button 
            onClick={() => setCurrentView('questionBank')}
            className={`hover:text-sky-400 transition-colors whitespace-nowrap flex items-center gap-1.5 ${currentView === 'questionBank' ? 'text-sky-400 font-semibold' : ''}`}
          >
            <BookOpen className="w-4 h-4" /> Question Bank
          </button>
          <button 
            onClick={() => setCurrentView('bookmarks')}
            className={`hover:text-sky-400 transition-colors whitespace-nowrap flex items-center gap-1.5 ${currentView === 'bookmarks' ? 'text-sky-400 font-semibold' : ''}`}
          >
            <Bookmark className="w-4 h-4" /> Saved Qs
          </button>
          <button 
            onClick={() => setCurrentView('analytics')}
            className={`hover:text-sky-400 transition-colors whitespace-nowrap flex items-center gap-1.5 ${currentView === 'analytics' ? 'text-sky-400 font-semibold' : ''}`}
          >
            <BarChart2 className="w-4 h-4" /> Analytics
          </button>
        </nav>

        {/* Zone 3: AI Tutor Key & Theme Toggle */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenApiKeyModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] border border-indigo-900/60 text-xs font-semibold text-sky-300 transition-all shadow-sm"
            title="Configure Gemini API Key"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">AI Tutor</span>
            <span className={`w-2 h-2 rounded-full ${hasCustomKey ? 'bg-emerald-400 ring-2 ring-emerald-500/30' : 'bg-sky-400'}`}></span>
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle Theme"
            className="p-2 rounded-xl text-slate-300 hover:bg-[#0F172A] border border-transparent hover:border-slate-800 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-300" />}
          </button>
        </div>
      </div>
    </header>
  );
};
