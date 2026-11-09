export interface ExamHistoryItem {
  id: string;
  sessionId: string;
  title: string;
  university: string;
  session: string;
  questionType: string;
  timestamp: string;
  score: number;
  totalMarks: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  timeTakenSeconds: number;
}

const STORAGE_KEY = 'varsity_qb_exam_history_v1';

export function getExamHistory(): ExamHistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveExamAttempt(item: Omit<ExamHistoryItem, 'id' | 'timestamp'>): ExamHistoryItem {
  const newItem: ExamHistoryItem = {
    ...item,
    id: `attempt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
  };
  try {
    const existing = getExamHistory();
    const updated = [newItem, ...existing].slice(0, 100);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Could not save exam history to localStorage', e);
  }
  return newItem;
}

export function clearExamHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
