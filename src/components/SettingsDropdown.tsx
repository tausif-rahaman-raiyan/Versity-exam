import React, { useState, useRef, useEffect } from 'react';
import { Settings, Sun, Moon, Type, RotateCcw, ChevronDown, Minus, Plus } from 'lucide-react';
import {
  UiSettings,
  FontStyleOption,
  DEFAULT_UI_SETTINGS,
  MIN_FONT_PX,
  MAX_FONT_PX,
  clampFontPx,
} from '../utils/uiSettings';

interface SettingsDropdownProps {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  uiSettings: UiSettings;
  onUpdateSettings: (next: UiSettings) => void;
  compact?: boolean;
}

const FONT_STYLES: Array<{ id: FontStyleOption; label: string; sampleClass: string }> = [
  { id: 'sans', label: 'Sans', sampleClass: 'font-sans' },
  { id: 'serif', label: 'Serif', sampleClass: 'font-serif' },
  { id: 'mono', label: 'Mono', sampleClass: 'font-mono' },
  { id: 'bryndan', label: 'Bryndan Write', sampleClass: 'font-bryndan text-sm' },
];

export const SettingsDropdown: React.FC<SettingsDropdownProps> = ({
  darkMode,
  setDarkMode,
  uiSettings,
  onUpdateSettings,
  compact = false,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const adjustQuestionPx = (delta: number) => {
    const nextPx = clampFontPx(uiSettings.questionFontPx + delta, DEFAULT_UI_SETTINGS.questionFontPx);
    onUpdateSettings({ ...uiSettings, questionFontPx: nextPx });
  };

  const adjustOptionPx = (delta: number) => {
    const nextPx = clampFontPx(uiSettings.optionFontPx + delta, DEFAULT_UI_SETTINGS.optionFontPx);
    onUpdateSettings({ ...uiSettings, optionFontPx: nextPx });
  };

  const adjustExplanationPx = (delta: number) => {
    const nextPx = clampFontPx(uiSettings.explanationFontPx + delta, DEFAULT_UI_SETTINGS.explanationFontPx);
    onUpdateSettings({ ...uiSettings, explanationFontPx: nextPx });
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#0F172A] hover:bg-slate-200 dark:hover:bg-[#1E293B] border border-slate-300 dark:border-indigo-900/60 text-xs font-bold text-slate-900 dark:text-slate-200 transition-all shadow-xs whitespace-nowrap"
        title="Settings: Theme & Font Size (px)"
      >
        <Settings className="w-3.5 h-3.5 text-indigo-600 dark:text-sky-400" />
        <span className={compact ? 'hidden sm:inline' : 'hidden xs:inline'}>Settings</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-[#0B1325] border-2 border-indigo-200 dark:border-indigo-800 shadow-2xl p-4 z-50 space-y-4 text-xs text-slate-900 dark:text-slate-100">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
            <span className="font-bold text-slate-950 dark:text-white flex items-center gap-1.5 text-xs sm:text-sm">
              <Settings className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
              Settings &amp; Font Options
            </span>
            <button
              type="button"
              onClick={() => onUpdateSettings(DEFAULT_UI_SETTINGS)}
              className="text-[11px] font-semibold text-indigo-600 dark:text-sky-400 hover:underline flex items-center gap-1"
              title="Reset font settings"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* 1. Theme Color Toggle */}
          <div className="space-y-1.5">
            <span className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
              1. Theme Color
            </span>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-[#070C18] p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setDarkMode(false)}
                className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                  !darkMode
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" /> White / Light
              </button>
              <button
                type="button"
                onClick={() => setDarkMode(true)}
                className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                  darkMode
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5" /> Dark
              </button>
            </div>
          </div>

          {/* 2. Question Font Size (px with - / + buttons) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Type className="w-3.5 h-3.5 text-indigo-600 dark:text-sky-400" />
                2. Question Font Size
              </span>
              <span className="text-[11px] font-mono font-bold text-indigo-600 dark:text-sky-400">
                {uiSettings.questionFontPx}px
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 bg-slate-100 dark:bg-[#070C18] p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                disabled={uiSettings.questionFontPx <= MIN_FONT_PX}
                onClick={() => adjustQuestionPx(-1)}
                className="w-9 h-8 rounded-lg bg-white dark:bg-[#0F172A] hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 border border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title="Decrease Question Font Size"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono font-extrabold text-sm text-slate-950 dark:text-white tabular-nums">
                {uiSettings.questionFontPx}px
              </span>
              <button
                type="button"
                disabled={uiSettings.questionFontPx >= MAX_FONT_PX}
                onClick={() => adjustQuestionPx(1)}
                className="w-9 h-8 rounded-lg bg-white dark:bg-[#0F172A] hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 border border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title="Increase Question Font Size"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3. Option Box Font Size (px with - / + buttons) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Type className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                3. Option Box Font Size
              </span>
              <span className="text-[11px] font-mono font-bold text-purple-600 dark:text-purple-400">
                {uiSettings.optionFontPx}px
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 bg-slate-100 dark:bg-[#070C18] p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                disabled={uiSettings.optionFontPx <= MIN_FONT_PX}
                onClick={() => adjustOptionPx(-1)}
                className="w-9 h-8 rounded-lg bg-white dark:bg-[#0F172A] hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 border border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title="Decrease Option Font Size"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono font-extrabold text-sm text-slate-950 dark:text-white tabular-nums">
                {uiSettings.optionFontPx}px
              </span>
              <button
                type="button"
                disabled={uiSettings.optionFontPx >= MAX_FONT_PX}
                onClick={() => adjustOptionPx(1)}
                className="w-9 h-8 rounded-lg bg-white dark:bg-[#0F172A] hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 border border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title="Increase Option Font Size"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 4. Explanation Font Size (px with - / + buttons) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Type className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                4. Explanation & AI Tutor Font Size
              </span>
              <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {uiSettings.explanationFontPx}px
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 bg-slate-100 dark:bg-[#070C18] p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                disabled={uiSettings.explanationFontPx <= MIN_FONT_PX}
                onClick={() => adjustExplanationPx(-1)}
                className="w-9 h-8 rounded-lg bg-white dark:bg-[#0F172A] hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 border border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title="Decrease Explanation Font Size"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono font-extrabold text-sm text-slate-950 dark:text-white tabular-nums">
                {uiSettings.explanationFontPx}px
              </span>
              <button
                type="button"
                disabled={uiSettings.explanationFontPx >= MAX_FONT_PX}
                onClick={() => adjustExplanationPx(1)}
                className="w-9 h-8 rounded-lg bg-white dark:bg-[#0F172A] hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 border border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title="Increase Explanation Font Size"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 5. Font Style Option (Sans, Serif, Mono, Bryndan Write) */}
          <div className="space-y-1.5">
            <span className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
              5. Font Style
            </span>
            <div className="grid grid-cols-2 gap-1.5 bg-slate-100 dark:bg-[#070C18] p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
              {FONT_STYLES.map((item) => {
                const active = uiSettings.fontStyle === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      onUpdateSettings({ ...uiSettings, fontStyle: item.id })
                    }
                    className={`py-2 px-2.5 rounded-lg font-bold text-xs transition-all ${item.sampleClass} ${
                      active
                        ? 'bg-cyan-600 text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-white/60 dark:bg-slate-900/50'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
