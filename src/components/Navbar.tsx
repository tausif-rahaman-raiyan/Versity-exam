import React from 'react';
import { BarChart2, ShieldCheck, Sparkles, Home } from 'lucide-react';
import { SettingsDropdown } from './SettingsDropdown';
import { UiSettings } from '../utils/uiSettings';

interface NavbarProps {
  currentView: 'home' | 'questionBank' | 'exam' | 'analytics';
  setCurrentView: (view: 'home' | 'questionBank' | 'exam' | 'analytics') => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  selectedExamTitle?: string;
  onOpenApiKeyModal: () => void;
  hasCustomKey: boolean;
  uiSettings: UiSettings;
  onUpdateSettings: (next: UiSettings) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  darkMode,
  setDarkMode,
  onOpenApiKeyModal,
  hasCustomKey,
  uiSettings,
  onUpdateSettings,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#070B14]/95 backdrop-blur-md border-b border-slate-200 dark:border-indigo-950/80 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-2.5 cursor-pointer shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-sky-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className="text-sm sm:text-lg font-extrabold tracking-tight text-slate-950 dark:text-white block leading-none">
              Varsity Science QB
            </span>
            <span className="text-[10px] sm:text-[11px] text-indigo-600 dark:text-sky-400 font-semibold">
              DU • RU • JU • CU • GST
            </span>
          </div>
        </div>

        {/* Zone 2: Streamlined Navigation Links */}
        <nav className="flex items-center gap-1.5 sm:gap-3 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setCurrentView('home')}
            className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              currentView === 'home'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#0F172A]'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden xs:inline sm:inline">Universities</span>
          </button>
          <button
            onClick={() => setCurrentView('analytics')}
            className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              currentView === 'analytics'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#0F172A]'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Analytics</span>
          </button>
        </nav>

        {/* Zone 3: AI Key & Settings Dropdown (Theme + Question/Option Font Sizes) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <button
            onClick={onOpenApiKeyModal}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#0F172A] hover:bg-slate-200 dark:hover:bg-[#1E293B] border border-slate-300 dark:border-indigo-900/60 text-xs font-semibold text-indigo-700 dark:text-sky-300 transition-all shadow-xs"
            title="Configure Gemini API Key"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-sky-400" />
            <span className="hidden sm:inline">AI Key</span>
            <span
              className={`w-2 h-2 rounded-full ${
                hasCustomKey
                  ? 'bg-emerald-500 ring-2 ring-emerald-500/30'
                  : 'bg-amber-400'
              }`}
            />
          </button>

          <SettingsDropdown
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            uiSettings={uiSettings}
            onUpdateSettings={onUpdateSettings}
          />
        </div>
      </div>
    </header>
  );
};
