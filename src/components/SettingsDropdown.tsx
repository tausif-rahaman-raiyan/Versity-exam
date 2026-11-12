import React, { useEffect, useRef, useState } from 'react';
import { Settings, ChevronDown, Sun, Moon, Minus, Plus, KeyRound, RotateCcw } from 'lucide-react';
import type { FontStyle, ThemeMode, UiSettings } from '../types';
import { DEFAULT_UI_SETTINGS, hasValidGeminiKey } from '../utils/storage';

type SettingsDropdownProps = {
  theme: ThemeMode;
  onChangeTheme: (theme: ThemeMode) => void;
  uiSettings: UiSettings;
  onChangeUiSettings: (settings: UiSettings) => void;
  apiKey: string;
  onOpenApiKeyModal: () => void;
  compact?: boolean;
  inline?: boolean;
  onCloseParent?: () => void;
};

const FONT_STYLE_OPTIONS: { id: FontStyle; label: string; className: string }[] = [
  { id: 'sans', label: 'Sans (Default)', className: 'font-style-sans' },
  { id: 'serif', label: 'Serif (Book)', className: 'font-style-serif' },
  { id: 'mono', label: 'Mono (Code)', className: 'font-style-mono' },
  { id: 'bryndan', label: 'Bryndan Write ✍️', className: 'font-style-bryndan' }
];

export const SettingsDropdown: React.FC<SettingsDropdownProps> = ({
  theme,
  onChangeTheme,
  uiSettings,
  onChangeUiSettings,
  apiKey,
  onOpenApiKeyModal,
  compact = false,
  inline = false,
  onCloseParent
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inline) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [inline]);

  const hasCustomKey = hasValidGeminiKey(apiKey);

  const updateFontSize = (
    field: 'questionFontPx' | 'optionFontPx' | 'explanationFontPx',
    delta: number
  ) => {
    const nextVal = Math.min(26, Math.max(12, uiSettings[field] + delta));
    onChangeUiSettings({ ...uiSettings, [field]: nextVal });
  };

  const handleResetFonts = () => {
    onChangeUiSettings({ ...DEFAULT_UI_SETTINGS });
  };

  const panelContent = (
    <div
      className={
        inline
          ? 'w-full pt-2.5 border-t border-slate-200 dark:border-indigo-900/60 space-y-3'
          : 'absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-[#0B1325] border-2 border-indigo-200 dark:border-indigo-800 shadow-2xl p-4 z-50 space-y-4'
      }
    >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-indigo-900/60 pb-2.5">
            <span className="text-sm font-extrabold text-slate-900 dark:text-white">
              Settings & Options
            </span>
            <button
              type="button"
              onClick={handleResetFonts}
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-sky-400 hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* 0. AI Tutor Gemini Key button */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onCloseParent?.();
              onOpenApiKeyModal();
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#070C18] border border-slate-200 dark:border-indigo-900/70 hover:border-indigo-400 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                AI Tutor Gemini Key
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  hasCustomKey
                    ? 'bg-emerald-500 ring-2 ring-emerald-500/30'
                    : 'bg-amber-500 ring-2 ring-amber-500/30'
                }`}
              />
              <span
                className={`text-[11px] font-bold ${
                  hasCustomKey
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-amber-600 dark:text-amber-400'
                }`}
              >
                {hasCustomKey ? 'Custom Key' : 'Default'}
              </span>
            </div>
          </button>

          {/* 1. Theme Color */}
          <div className="space-y-1.5">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
              1. Theme Color
            </div>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100 dark:bg-[#070C18] border border-slate-200 dark:border-indigo-950">
              <button
                type="button"
                onClick={() => onChangeTheme('light')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  theme === 'light'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>White / Light</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeTheme('dark')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          {/* 2. Question Font Size */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              2. Question Font Size
            </span>
            <div className="inline-flex items-center gap-1.5">
              <button
                type="button"
                disabled={uiSettings.questionFontPx <= 12}
                onClick={() => updateFontSize('questionFontPx', -1)}
                aria-label="Decrease question font size"
                className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 flex items-center justify-center disabled:opacity-40 cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-12 text-center text-xs font-extrabold text-indigo-700 dark:text-indigo-300 tabular-nums">
                {uiSettings.questionFontPx} px
              </span>
              <button
                type="button"
                disabled={uiSettings.questionFontPx >= 26}
                onClick={() => updateFontSize('questionFontPx', 1)}
                aria-label="Increase question font size"
                className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 flex items-center justify-center disabled:opacity-40 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3. Option Box Font Size */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              3. Option Box Font Size
            </span>
            <div className="inline-flex items-center gap-1.5">
              <button
                type="button"
                disabled={uiSettings.optionFontPx <= 12}
                onClick={() => updateFontSize('optionFontPx', -1)}
                aria-label="Decrease option font size"
                className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 flex items-center justify-center disabled:opacity-40 cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-12 text-center text-xs font-extrabold text-purple-700 dark:text-purple-300 tabular-nums">
                {uiSettings.optionFontPx} px
              </span>
              <button
                type="button"
                disabled={uiSettings.optionFontPx >= 26}
                onClick={() => updateFontSize('optionFontPx', 1)}
                aria-label="Increase option font size"
                className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 flex items-center justify-center disabled:opacity-40 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 4. Explanation Font Size */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              4. Explanation Font Size
            </span>
            <div className="inline-flex items-center gap-1.5">
              <button
                type="button"
                disabled={uiSettings.explanationFontPx <= 12}
                onClick={() => updateFontSize('explanationFontPx', -1)}
                aria-label="Decrease explanation font size"
                className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 flex items-center justify-center disabled:opacity-40 cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-12 text-center text-xs font-extrabold text-emerald-700 dark:text-emerald-300 tabular-nums">
                {uiSettings.explanationFontPx} px
              </span>
              <button
                type="button"
                disabled={uiSettings.explanationFontPx >= 26}
                onClick={() => updateFontSize('explanationFontPx', 1)}
                aria-label="Increase explanation font size"
                className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 flex items-center justify-center disabled:opacity-40 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 5. Font Style */}
          <div className="space-y-1.5">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
              5. Font Style
            </div>
            <div className="grid grid-cols-2 gap-2">
              {FONT_STYLE_OPTIONS.map((opt) => {
                const active = uiSettings.fontStyle === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onChangeUiSettings({ ...uiSettings, fontStyle: opt.id })}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      opt.className
                    } ${
                      active
                        ? 'bg-cyan-600 text-white border-cyan-500 shadow-xs'
                        : 'bg-slate-50 dark:bg-[#070C18] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-indigo-900/60 hover:border-cyan-400'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
  );

  if (inline) {
    return panelContent;
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label="Settings and Options"
        className={`inline-flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-300 dark:border-indigo-900/60 text-slate-800 dark:text-slate-100 text-xs sm:text-sm font-bold hover:border-indigo-400 transition-colors cursor-pointer min-h-[38px] ${
          compact ? 'px-2.5 sm:px-3.5 py-2' : 'px-3 sm:px-3.5 py-2'
        }`}
      >
        <Settings className="w-4 h-4 text-indigo-600 dark:text-sky-400 shrink-0" />
        <span className={compact ? 'hidden sm:inline' : 'inline'}>Settings</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && panelContent}
    </div>
  );
};
