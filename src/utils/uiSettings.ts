export type FontStyleOption = 'sans' | 'serif' | 'mono' | 'bryndan';

export interface UiSettings {
  questionFontPx: number;
  optionFontPx: number;
  explanationFontPx: number;
  fontStyle: FontStyleOption;
}

const STORAGE_KEY = 'varsity_qb_ui_settings_v2';
const THEME_STORAGE_KEY = 'varsity_qb_theme_v2';

export const MIN_FONT_PX = 12;
export const MAX_FONT_PX = 26;

export const DEFAULT_UI_SETTINGS: UiSettings = {
  questionFontPx: 16,
  optionFontPx: 14,
  explanationFontPx: 14,
  fontStyle: 'sans',
};

export function clampFontPx(val: number, fallback: number): number {
  if (typeof val !== 'number' || Number.isNaN(val)) return fallback;
  return Math.max(MIN_FONT_PX, Math.min(MAX_FONT_PX, Math.round(val)));
}

/**
 * Default theme on first visit is White / Light Mode (darkMode = false)
 * until the user changes it in Settings.
 */
export function loadThemeMode(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
  } catch {
    // ignore storage errors
  }
  return false; // First-time visit defaults to White / Light Mode
}

export function saveThemeMode(darkMode: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, darkMode ? 'dark' : 'light');
  } catch {
    // ignore storage errors
  }
}

export function loadUiSettings(): UiSettings {
  if (typeof window === 'undefined') return DEFAULT_UI_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_UI_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      questionFontPx: clampFontPx(Number(parsed.questionFontPx), DEFAULT_UI_SETTINGS.questionFontPx),
      optionFontPx: clampFontPx(Number(parsed.optionFontPx), DEFAULT_UI_SETTINGS.optionFontPx),
      explanationFontPx: clampFontPx(Number(parsed.explanationFontPx), DEFAULT_UI_SETTINGS.explanationFontPx),
      fontStyle: ['sans', 'serif', 'mono', 'bryndan'].includes(parsed.fontStyle)
        ? parsed.fontStyle
        : 'sans',
    };
  } catch {
    return DEFAULT_UI_SETTINGS;
  }
}

export function saveUiSettings(settings: UiSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore storage quota errors
  }
}

export function getFontStyleClass(style: FontStyleOption): string {
  switch (style) {
    case 'serif':
      return 'font-serif';
    case 'mono':
      return 'font-mono';
    case 'bryndan':
      return 'font-bryndan';
    case 'sans':
    default:
      return 'font-sans';
  }
}
