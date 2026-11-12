import React, { useEffect, useRef, useState } from 'react';
import { BookOpen, BarChart3, Menu, X } from 'lucide-react';
import { siteConfig } from '../data/siteConfig';
import { uiTexts } from '../data/translations';
import type { ThemeMode, UiSettings, ViewMode } from '../types';
import { SettingsDropdown } from './SettingsDropdown';

type NavbarProps = {
  view: ViewMode;
  onChangeView: (view: ViewMode) => void;
  theme: ThemeMode;
  onChangeTheme: (theme: ThemeMode) => void;
  uiSettings: UiSettings;
  onChangeUiSettings: (settings: UiSettings) => void;
  apiKey: string;
  onOpenApiKeyModal: () => void;
};

export const Navbar: React.FC<NavbarProps> = ({
  view,
  onChangeView,
  theme,
  onChangeTheme,
  uiSettings,
  onChangeUiSettings,
  apiKey,
  onOpenApiKeyModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  if (view === 'exam') {
    return null;
  }

  const baseUrl = import.meta.env.BASE_URL || '/';
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const logoSrc = `${normalizedBase}${siteConfig.logoPath.replace(/^\//, '')}`;

  const isQuestionBankActive = view === 'home' || view === 'questionBank';
  const isAnalyticsActive = view === 'analytics';

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#070B14]/95 backdrop-blur-md border-b border-slate-200 dark:border-indigo-950/80">
      <div className="max-w-7xl mx-auto h-16 px-3 sm:px-6 lg:px-8 relative flex items-center justify-between">
        {/* Left: Brand Logo + Name + Subtitle */}
        <button
          type="button"
          onClick={() => onChangeView('home')}
          className="flex items-center gap-2.5 text-left cursor-pointer group"
        >
          <img
            src={logoSrc}
            alt={siteConfig.siteName}
            referrerPolicy="no-referrer"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl border border-indigo-300 dark:border-indigo-500/40 object-cover shrink-0 shadow-xs"
          />
          <div>
            <div className="text-sm sm:text-lg font-extrabold text-slate-900 dark:text-white leading-tight group-hover:text-indigo-600 dark:group-hover:text-sky-400 transition-colors">
              {siteConfig.siteName}
            </div>
            <div className="text-[10px] sm:text-[11px] font-bold text-indigo-600 dark:text-sky-400 tracking-wide">
              {siteConfig.siteSubtitle}
            </div>
          </div>
        </button>

        {/* Center Desktop Pill Nav */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-[#0E172A] border border-slate-200 dark:border-indigo-900/60 absolute left-1/2 -translate-x-1/2"
        >
          <button
            type="button"
            onClick={() => onChangeView('home')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
              isQuestionBankActive
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-sky-400'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{uiTexts.nav.questionBank}</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeView('analytics')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
              isAnalyticsActive
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-sky-400'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>{uiTexts.nav.analytics}</span>
          </button>
        </nav>

        {/* Right: Desktop Settings Dropdown */}
        <div className="hidden md:flex items-center gap-2">
          <SettingsDropdown
            theme={theme}
            onChangeTheme={onChangeTheme}
            uiSettings={uiSettings}
            onChangeUiSettings={onChangeUiSettings}
            apiKey={apiKey}
            onOpenApiKeyModal={onOpenApiKeyModal}
          />
        </div>

        {/* Mobile (< md) Menu (with Settings inside Menu) */}
        <div ref={mobileMenuRef} className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-300 dark:border-indigo-900/60 text-xs font-bold text-slate-800 dark:text-slate-100 min-h-[38px] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            <span>{uiTexts.nav.menu}</span>
          </button>

          {mobileMenuOpen && (
            <div className="absolute right-3 top-16 w-72 sm:w-80 max-h-[82vh] overflow-y-auto rounded-2xl bg-white dark:bg-[#0B1325] border-2 border-indigo-200 dark:border-indigo-800 shadow-2xl p-3.5 z-50 space-y-2.5">
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onChangeView('home');
                  }}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer ${
                    isQuestionBankActive
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>{uiTexts.nav.questionBank}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onChangeView('analytics');
                  }}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer ${
                    isAnalyticsActive
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 shrink-0" />
                  <span>{uiTexts.nav.analytics}</span>
                </button>
              </div>

              <SettingsDropdown
                theme={theme}
                onChangeTheme={onChangeTheme}
                uiSettings={uiSettings}
                onChangeUiSettings={onChangeUiSettings}
                apiKey={apiKey}
                onOpenApiKeyModal={onOpenApiKeyModal}
                inline
                onCloseParent={() => setMobileMenuOpen(false)}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
