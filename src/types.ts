import type { Session } from './data/sessions';

export type { Session };

export type ViewMode = 'home' | 'questionBank' | 'exam' | 'analytics';

export type ThemeMode = 'light' | 'dark';

export type FontStyle = 'sans' | 'serif' | 'mono' | 'bryndan';

export type UiSettings = {
  questionFontPx: number;
  optionFontPx: number;
  explanationFontPx: number;
  fontStyle: FontStyle;
};

export type RuBranchOption = 'Math' | 'Biology' | 'Math+Biology';

export type Question = {
  id: string;
  number: number;
  subject: string;
  ruSection?: 'A' | 'B';
  ruBranch?: RuBranchOption;
  question: string;
  options: string[];
  correctAnswer: number;
  answerVerified?: boolean;
  explanation?: string;
  questionType: 'MCQ' | 'Written';
  institution: string;
  session: string;
  questionImageUrls?: string[];
  optionImageUrls?: string[][];
  explanationImageUrls?: string[];
  optionLabels?: string[];
  provenance?: {
    sourceFile?: string;
    sourceLocation?: string;
    answerSource?: string;
    explanationSource?: string;
    verificationStatus?: string;
    notes?: string;
  };
};

export type Attempt = {
  id: string;
  timestamp: string;
  sessionId: string;
  title: string;
  institution: string;
  session: string;
  questionType: 'MCQ' | 'Written';
  score: number;
  totalMarks: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  timeTakenSeconds: number;
};
