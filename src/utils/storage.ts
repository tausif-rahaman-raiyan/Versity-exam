import { siteConfig } from '../data/siteConfig';
import type { Attempt, FontStyle, ThemeMode, UiSettings } from '../types';

const PREFIX = siteConfig.storagePrefix;

export const STORAGE_KEYS = {
  theme: `${PREFIX}_theme_v2`,
  uiSettings: `${PREFIX}_ui_settings_v2`,
  geminiApiKey: `${PREFIX}_gemini_api_key`,
  examHistory: `${PREFIX}_exam_history_v1`,
  selectedSubjects: `${PREFIX}_selected_subjects_v1`,
  examLanguage: `${PREFIX}_exam_language_v1`
};

export const DEFAULT_UI_SETTINGS: UiSettings = {
  questionFontPx: 16,
  optionFontPx: 14,
  explanationFontPx: 14,
  fontStyle: 'sans'
};

const VALID_FONT_STYLES = new Set<FontStyle>(['sans', 'serif', 'mono', 'bryndan']);

function clampFontPx(val: unknown, fallback: number): number {
  const num = Number(val);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(26, Math.max(12, Math.round(num)));
}

export function loadTheme(): ThemeMode {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.theme);
    if (raw === 'dark' || raw === 'light') return raw;
  } catch {
    // ignore private mode errors
  }
  return siteConfig.defaultTheme;
}

export function saveTheme(theme: ThemeMode): void {
  try {
    localStorage.setItem(STORAGE_KEYS.theme, theme);
  } catch {
    // ignore
  }
}

export function applyThemeToDom(theme: ThemeMode): void {
  if (typeof document === 'undefined') return;
  const html = document.documentElement;
  if (theme === 'dark') {
    html.classList.add('dark');
    html.classList.remove('light-mode');
  } else {
    html.classList.add('light-mode');
    html.classList.remove('dark');
  }
}

export function loadUiSettings(): UiSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.uiSettings);
    if (!raw) return { ...DEFAULT_UI_SETTINGS };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return { ...DEFAULT_UI_SETTINGS };
    const fontStyle: FontStyle = VALID_FONT_STYLES.has(parsed.fontStyle)
      ? parsed.fontStyle
      : DEFAULT_UI_SETTINGS.fontStyle;
    return {
      questionFontPx: clampFontPx(parsed.questionFontPx, DEFAULT_UI_SETTINGS.questionFontPx),
      optionFontPx: clampFontPx(parsed.optionFontPx, DEFAULT_UI_SETTINGS.optionFontPx),
      explanationFontPx: clampFontPx(parsed.explanationFontPx, DEFAULT_UI_SETTINGS.explanationFontPx),
      fontStyle
    };
  } catch {
    return { ...DEFAULT_UI_SETTINGS };
  }
}

export function saveUiSettings(settings: UiSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.uiSettings, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export function loadGeminiApiKey(): string {
  try {
    return (localStorage.getItem(STORAGE_KEYS.geminiApiKey) || '').trim();
  } catch {
    return '';
  }
}

export function saveGeminiApiKey(key: string): void {
  try {
    const trimmed = key.trim();
    if (!trimmed) {
      localStorage.removeItem(STORAGE_KEYS.geminiApiKey);
    } else {
      localStorage.setItem(STORAGE_KEYS.geminiApiKey, trimmed);
    }
  } catch {
    // ignore
  }
}

export function hasValidGeminiKey(key: string): boolean {
  return typeof key === 'string' && key.trim().length > 10;
}

export function loadExamHistory(): Attempt[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.examHistory);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item) =>
          item &&
          typeof item === 'object' &&
          typeof item.id === 'string' &&
          typeof item.sessionId === 'string' &&
          typeof item.score === 'number' &&
          typeof item.totalMarks === 'number'
      )
      .slice(0, 100);
  } catch {
    return [];
  }
}

export function addExamAttempt(attempt: Attempt): Attempt[] {
  try {
    const current = loadExamHistory();
    const updated = [attempt, ...current].slice(0, 100);
    localStorage.setItem(STORAGE_KEYS.examHistory, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function clearExamHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.examHistory);
  } catch {
    // ignore
  }
}

export function getDefaultSelectedSubjects(): string[] {
  const { mandatorySubjects, optionalSubjects, requiredTotal } = siteConfig.subjectPickRules;
  const needed = Math.max(0, requiredTotal - mandatorySubjects.length);
  return [...mandatorySubjects, ...optionalSubjects.slice(0, needed)];
}

export function loadSelectedSubjects(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.selectedSubjects);
    if (!raw) return getDefaultSelectedSubjects();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length !== siteConfig.subjectPickRules.requiredTotal) {
      return getDefaultSelectedSubjects();
    }
    const mandatory = siteConfig.subjectPickRules.mandatorySubjects;
    const valid = mandatory.every((m) => parsed.includes(m)) && parsed.every((s) => typeof s === 'string');
    return valid ? parsed : getDefaultSelectedSubjects();
  } catch {
    return getDefaultSelectedSubjects();
  }
}

export function saveSelectedSubjects(subjects: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.selectedSubjects, JSON.stringify(subjects));
  } catch {
    // ignore
  }
}

export function loadExamLanguage(): 'bn' | 'en' {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.examLanguage);
    if (raw === 'bn' || raw === 'en') return raw;
  } catch {
    // ignore
  }
  return 'bn';
}

export function saveExamLanguage(lang: 'bn' | 'en'): void {
  try {
    localStorage.setItem(STORAGE_KEYS.examLanguage, lang);
  } catch {
    // ignore
  }
}
