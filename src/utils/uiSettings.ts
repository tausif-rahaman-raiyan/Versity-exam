export type FontSizeOption = 'S' | 'M' | 'L' | 'XL';
export type FontStyleOption = 'sans' | 'serif' | 'mono' | 'bryndan';

export interface UiSettings {
  questionFontSize: FontSizeOption;
  optionFontSize: FontSizeOption;
  fontStyle: FontStyleOption;
}

const STORAGE_KEY = 'varsity_qb_ui_settings_v1';
const THEME_STORAGE_KEY = 'varsity_qb_theme_mode';

export const DEFAULT_UI_SETTINGS: UiSettings = {
  questionFontSize: 'M',
  optionFontSize: 'M',
  fontStyle: 'sans',
};

export function loadThemeMode(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light') return false;
    if (saved === 'dark') return true;
  } catch {
    // ignore storage errors
  }
  return true;
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
      questionFontSize: ['S', 'M', 'L', 'XL'].includes(parsed.questionFontSize)
        ? parsed.questionFontSize
        : 'M',
      optionFontSize: ['S', 'M', 'L', 'XL'].includes(parsed.optionFontSize)
        ? parsed.optionFontSize
        : 'M',
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

export function getQuestionFontClass(size: FontSizeOption): string {
  switch (size) {
    case 'S':
      return 'text-xs sm:text-sm';
    case 'M':
      return 'text-sm sm:text-base';
    case 'L':
      return 'text-base sm:text-lg';
    case 'XL':
      return 'text-lg sm:text-xl';
    default:
      return 'text-sm sm:text-base';
  }
}

export function getOptionFontClass(size: FontSizeOption): string {
  switch (size) {
    case 'S':
      return 'text-[11px] sm:text-xs';
    case 'M':
      return 'text-xs sm:text-sm';
    case 'L':
      return 'text-sm sm:text-base';
    case 'XL':
      return 'text-base sm:text-lg';
    default:
      return 'text-xs sm:text-sm';
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
