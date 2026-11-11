import React, { useState, useEffect, useMemo } from 'react';
import { Question, ExamSession, requiresSubjectSelection } from '../data/questionBank';
import { ImportedQuestion, loadQuestionsForSession } from '../data/sessionQuestionLoader';
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Sparkles,
  Lock,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Key,
  AlertCircle,
  X,
  SlidersHorizontal,
  Globe,
} from 'lucide-react';
import { InlineAiTutor } from './InlineAiTutor';
import { MathMarkdownRenderer, MathInlineRenderer } from './MathMarkdownRenderer';
import { getSubjectCardStyle } from '../utils/subjectColors';
import { saveExamAttempt } from '../utils/examHistory';
import { SettingsDropdown } from './SettingsDropdown';
import {
  UiSettings,
  DEFAULT_UI_SETTINGS,
  getFontStyleClass,
} from '../utils/uiSettings';
import {
  ExamLanguage,
  getLocalizedQuestion,
  getOptionLabelForLang,
  getSubjectLabelForLang,
  toBengaliNumber,
} from '../utils/examTranslator';

interface StrictExamViewProps {
  examSession: ExamSession;
  onBack: () => void;
  customApiKey: string;
  setCustomApiKey: (key: string) => void;
  darkMode?: boolean;
  setDarkMode?: (dark: boolean) => void;
  onOpenApiKeyModal?: () => void;
  uiSettings?: UiSettings;
  onUpdateSettings?: (next: UiSettings) => void;
  selectedExamSubjects?: string[] | null;
  onChangeSubjects?: () => void;
  examLanguage?: ExamLanguage;
  onChangeExamLanguage?: (lang: ExamLanguage) => void;
}

export const StrictExamView: React.FC<StrictExamViewProps> = ({
  examSession,
  onBack,
  customApiKey,
  darkMode = true,
  setDarkMode,
  onOpenApiKeyModal,
  uiSettings = DEFAULT_UI_SETTINGS,
  onUpdateSettings,
  selectedExamSubjects,
  onChangeSubjects,
  examLanguage = 'bn',
  onChangeExamLanguage,
}) => {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [questionLoadError, setQuestionLoadError] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [lockedQuestions, setLockedQuestions] = useState<Set<string>>(new Set());

  const [timeLeft, setTimeLeft] = useState<number>(examSession.durationMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showExitModal, setShowExitModal] = useState<boolean>(false);
  const [apiKeyNotice, setApiKeyNotice] = useState<boolean>(false);

  const [expandedAiQuestionIds, setExpandedAiQuestionIds] = useState<Set<string>>(new Set());
  const [aiTranslations, setAiTranslations] = useState<
    Record<string, { question?: string; options?: string[]; explanation?: string }>
  >(() => {
    try {
      const saved = localStorage.getItem('varsity_qb_en_translations_v1');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const isBn = examLanguage === 'bn';
  const isDu4Of6 = requiresSubjectSelection(examSession);

  const active4Subjects = useMemo(() => {
    if (!isDu4Of6) return null;
    if (selectedExamSubjects && selectedExamSubjects.length === 4) {
      return selectedExamSubjects;
    }
    return ['Physics', 'Chemistry', 'Mathematics', 'Biology'];
  }, [isDu4Of6, selectedExamSubjects]);

  // Filter 90 questions down to 60 questions for the 4 selected subjects in DU 25-26 to 19-20 MCQ
  // and localize question text, options, option labels, and explanations based on examLanguage ('bn' | 'en')
  const baseQuestions = useMemo(() => {
    if (!isDu4Of6 || !active4Subjects) return allQuestions;
    const filtered = allQuestions.filter((q) => active4Subjects.includes(q.subject));
    return filtered.map((q, idx) => ({
      ...q,
      number: idx + 1,
    }));
  }, [allQuestions, isDu4Of6, active4Subjects]);

  const questions = useMemo(() => {
    return baseQuestions.map((q) =>
      getLocalizedQuestion(q, examLanguage, aiTranslations[q.id])
    );
  }, [baseQuestions, examLanguage, aiTranslations]);

  // Background batch AI translation enhancement when English is selected
  useEffect(() => {
    if (examLanguage !== 'en' || baseQuestions.length === 0) return;

    const untranslated = baseQuestions.filter(
      (q) =>
        q.subject !== 'Bangla' &&
        q.subject !== 'English' &&
        !aiTranslations[q.id] &&
        /[\u0980-\u09FF]/.test(q.question + q.options.join(' '))
    );
    if (untranslated.length === 0) return;

    let cancelled = false;
    (async () => {
      for (let i = 0; i < untranslated.length; i += 15) {
        if (cancelled) break;
        const chunk = untranslated.slice(i, i + 15);
        try {
          const res = await fetch('/api/gemini/translate-batch', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(customApiKey ? { 'x-gemini-api-key': customApiKey } : {}),
            },
            body: JSON.stringify({
              targetLang: 'en',
              customApiKey,
              items: chunk.map((q) => ({
                id: q.id,
                subject: q.subject,
                question: q.question,
                options: q.options,
                explanation: q.explanation,
              })),
            }),
          });
          if (!res.ok || cancelled) continue;
          const data = (await res.json()) as {
            translations?: Record<string, { question: string; options: string[]; explanation: string }>;
          };
          if (data.translations && Object.keys(data.translations).length > 0 && !cancelled) {
            setAiTranslations((prev) => {
              const next = { ...prev, ...data.translations };
              try {
                localStorage.setItem('varsity_qb_en_translations_v1', JSON.stringify(next));
              } catch {
                // ignore quota errors
              }
              return next;
            });
          }
        } catch {
          // Instant offline dictionary translation from getLocalizedQuestion remains active
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [examLanguage, baseQuestions, customApiKey]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [examSession.id]);

  // Reset exam state when user changes the 4 selected subjects
  useEffect(() => {
    if (isDu4Of6) {
      setSelectedSubject('ALL');
      setSelectedAnswers({});
      setLockedQuestions(new Set());
      setIsSubmitted(false);
      setTimeLeft(examSession.durationMinutes * 60);
    }
  }, [selectedExamSubjects, isDu4Of6, examSession.durationMinutes]);

  useEffect(() => {
    let active = true;
    setIsLoadingQuestions(true);
    setQuestionLoadError('');
    setAllQuestions([]);
    setTimeLeft(examSession.durationMinutes * 60);
    setSelectedAnswers({});
    setLockedQuestions(new Set());
    setIsSubmitted(false);
    setExpandedAiQuestionIds(new Set());
    setSelectedSubject('ALL');
    loadQuestionsForSession(examSession)
      .then((loaded) => {
        if (!active) return;
        setAllQuestions(loaded);
        if (loaded.length === 0) {
          setQuestionLoadError(
            isBn
              ? 'এই সেশনের জন্য কোনো প্রশ্ন পাওয়া যায়নি। অন্য সেশনের প্রশ্ন দিয়ে পরীক্ষা তৈরি করা হয়নি।'
              : 'No questions were found for this session.'
          );
        }
      })
      .catch((error) => {
        if (!active) return;
        console.error(error);
        setQuestionLoadError(
          isBn
            ? 'প্রশ্ন লোড করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।'
            : 'Could not load questions. Please try again.'
        );
      })
      .finally(() => {
        if (active) setIsLoadingQuestions(false);
      });
    return () => {
      active = false;
    };
  }, [examSession.id]);

  // Calculations
  let correctCount = 0;
  let incorrectCount = 0;
  let unattemptedCount = 0;
  let unverifiedCount = 0;

  questions.forEach((q) => {
    if (q.questionType === 'Written' || q.options.length === 0) {
      return;
    }
    const ans = selectedAnswers[q.id];
    if (ans === undefined) {
      unattemptedCount++;
    } else if ((q as ImportedQuestion).answerVerified === false || q.correctAnswer < 0) {
      unverifiedCount++;
    } else if (ans === q.correctAnswer) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  });

  const negativePenalty = examSession.university === 'JU' ? 0.2 : 0.25;
  const mcqQuestionCount = questions.filter((q) => q.questionType !== 'Written' && q.options.length > 0).length;
  const effectiveTotalMarks = isDu4Of6 ? (mcqQuestionCount || 60) : examSession.totalMarks;
  const markPerQuestion = mcqQuestionCount > 0 ? effectiveTotalMarks / mcqQuestionCount : 1;
  const totalMarksEarned = Math.max(
    0,
    correctCount * markPerQuestion - incorrectCount * negativePenalty * markPerQuestion
  );

  const handleSubmitExam = () => {
    if (!isSubmitted) {
      const durationSec = Math.max(1, examSession.durationMinutes * 60 - timeLeft);
      saveExamAttempt({
        sessionId: examSession.id,
        title:
          isDu4Of6 && active4Subjects
            ? `${examSession.title} (${active4Subjects
                .map((s) => getSubjectLabelForLang(s, examLanguage))
                .join(', ')})`
            : examSession.title,
        university: examSession.university,
        session: examSession.session,
        questionType: examSession.questionType,
        score: totalMarksEarned,
        totalMarks: effectiveTotalMarks,
        totalQuestions: questions.length,
        correctCount,
        incorrectCount,
        unattemptedCount,
        timeTakenSeconds: durationSec,
      });
    }
    setIsSubmitted(true);
    setShowConfirmModal(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Countdown timer
  useEffect(() => {
    if (isSubmitted || isLoadingQuestions || questions.length === 0) return;
    if (timeLeft <= 0) {
      handleSubmitExam();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted, isLoadingQuestions, questions.length]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const formatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return isBn ? toBengaliNumber(formatted) : formatted;
  };

  // STRICT AUTO-LOCK: Once clicked, locked forever!
  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (isSubmitted || isLoadingQuestions) return;
    if (lockedQuestions.has(questionId)) return;

    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    setLockedQuestions((prev) => {
      const next = new Set(prev);
      next.add(questionId);
      return next;
    });
  };

  const toggleAiTutor = (qId: string) => {
    if (!customApiKey || !customApiKey.trim()) {
      setApiKeyNotice(true);
      return;
    }
    setExpandedAiQuestionIds((prev) => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const subjects = useMemo(
    () => [
      'ALL',
      ...Array.from(new Set(questions.map((q) => q.subject))).sort((a, b) => a.localeCompare(b)),
    ],
    [questions]
  );

  const filteredQuestions = useMemo(() => {
    if (selectedSubject === 'ALL') return questions;
    return questions.filter((q) => q.subject === selectedSubject);
  }, [questions, selectedSubject]);

  const selectedCount = lockedQuestions.size;
  const totalCount = questions.length;
  const selectedPercent = totalCount > 0 ? Math.min(100, Math.round((selectedCount / totalCount) * 100)) : 0;

  const fontStyleClass = getFontStyleClass(uiSettings.fontStyle);

  return (
    <div className={`max-w-5xl mx-auto space-y-4 sm:space-y-5 pb-24 text-slate-900 dark:text-slate-100 ${fontStyleClass}`}>
      {/* Floating API Key Notification Toast */}
      {apiKeyNotice && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-96 z-50 bg-white dark:bg-[#0D162C] border-2 border-amber-500 rounded-2xl p-4 shadow-2xl flex items-start gap-3 animate-fadeIn">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs space-y-2">
            <h4 className="font-bold text-slate-950 dark:text-white text-sm">
              {isBn ? 'API Key প্রয়োজন (Add API Key)' : 'Gemini API Key Required'}
            </h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {isBn
                ? 'Ask AI Tutor-এর বিস্তারিত ব্যাখ্যা ও শর্টকাট দেখতে অনুগ্রহ করে আপনার ফ্রি Gemini API Key যুক্ত করুন।'
                : 'Please add your free Gemini API Key to unlock step-by-step AI Tutor explanations and shortcuts.'}
            </p>
            <div className="flex items-center gap-2 pt-1">
              {onOpenApiKeyModal && (
                <button
                  onClick={() => {
                    setApiKeyNotice(false);
                    onOpenApiKeyModal();
                  }}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs inline-flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Key className="w-3.5 h-3.5" /> Add API Key
                </button>
              )}
              <button
                onClick={() => setApiKeyNotice(false)}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-lg text-xs"
              >
                {isBn ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
          <button
            onClick={() => setApiKeyNotice(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Simplified Sticky Exam Control Bar + Selected Progress Bar */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-[#070C18]/95 backdrop-blur-md border border-slate-200 dark:border-indigo-950/90 rounded-b-2xl sm:rounded-2xl shadow-lg">
        {/* Bar 1: Exit Exam | Timer (44:18) | Submit Exam | Settings */}
        <div className="px-3 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between gap-2">
          <button
            onClick={() => {
              if (!isSubmitted) {
                setShowExitModal(true);
              } else {
                onBack();
              }
            }}
            className="px-3 sm:px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors shadow-xs inline-flex items-center gap-1.5 shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isBn ? 'পরীক্ষা ত্যাগ' : 'Exit Exam'}</span>
          </button>

          {/* Center Timer */}
          {!isSubmitted && !isLoadingQuestions && questions.length > 0 ? (
            <div
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-mono font-extrabold tabular-nums ${
                timeLeft < 300
                  ? 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-400 dark:border-red-800 animate-pulse'
                  : 'bg-slate-100 dark:bg-[#0B152B] text-indigo-700 dark:text-sky-300 border border-slate-300 dark:border-indigo-900/60'
              }`}
            >
              <Clock className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          ) : (
            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
              {examSession.title}
            </span>
          )}

          {/* Right: Language Pill + Submit Exam + Settings Dropdown */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {onChangeExamLanguage && (
              <div className="hidden xs:flex items-center bg-slate-100 dark:bg-[#0B152B] p-0.5 rounded-xl border border-slate-300 dark:border-indigo-900/60 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => onChangeExamLanguage('bn')}
                  className={`px-2 py-1 rounded-lg transition-all ${
                    isBn
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  বাংলা
                </button>
                <button
                  type="button"
                  onClick={() => onChangeExamLanguage('en')}
                  className={`px-2 py-1 rounded-lg transition-all ${
                    !isBn
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  EN
                </button>
              </div>
            )}

            {!isSubmitted ? (
              <button
                onClick={() => setShowConfirmModal(true)}
                className="px-3.5 sm:px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                {isBn ? 'পরীক্ষা জমা দিন' : 'Submit Exam'}
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setSelectedAnswers({});
                  setLockedQuestions(new Set());
                  setTimeLeft(examSession.durationMinutes * 60);
                  setExpandedAiQuestionIds(new Set());
                }}
                className="px-3.5 sm:px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> {isBn ? 'আবার দিন' : 'Retake'}
              </button>
            )}

            {setDarkMode && onUpdateSettings && (
              <SettingsDropdown
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                uiSettings={uiSettings}
                onUpdateSettings={onUpdateSettings}
                compact
              />
            )}
          </div>
        </div>

        {/* Bar 2: Selected Questions Counter & Progress Bar */}
        {!isLoadingQuestions && questions.length > 0 && (
          <div className="bg-slate-100/90 dark:bg-[#0B1325] px-3 sm:px-5 py-2 border-t border-slate-200 dark:border-indigo-950/80 rounded-b-2xl flex items-center justify-between gap-3 text-[11px] sm:text-xs">
            <div className="flex items-center gap-3 shrink-0 font-semibold">
              <span className="text-slate-700 dark:text-slate-300">
                {isBn ? 'উত্তর দিয়েছেন:' : 'Selected:'}{' '}
                <strong className="text-indigo-600 dark:text-sky-400 font-mono text-xs sm:text-sm">
                  {isBn ? toBengaliNumber(selectedCount) : selectedCount}
                </strong>{' '}
                /{' '}
                <span className="font-mono">
                  {isBn ? toBengaliNumber(totalCount) : totalCount}
                </span>
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600 dark:text-slate-400">
                {isBn ? 'বাকি:' : 'Remaining:'}{' '}
                <strong className="font-mono text-slate-900 dark:text-white">
                  {isBn
                    ? toBengaliNumber(totalCount - selectedCount)
                    : totalCount - selectedCount}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-2 flex-1 max-w-xs">
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-600 to-sky-500 transition-all duration-300"
                  style={{ width: `${selectedPercent}%` }}
                />
              </div>
              <span className="font-mono font-bold text-indigo-600 dark:text-sky-400 text-[10px] w-8 text-right">
                {isBn ? `${toBengaliNumber(selectedPercent)}%` : `${selectedPercent}%`}
              </span>
            </div>
          </div>
        )}
      </div>

      {isLoadingQuestions && (
        <div className="p-8 rounded-2xl bg-white dark:bg-[#0B1222] border border-slate-200 dark:border-indigo-900/50 text-center text-indigo-600 dark:text-sky-300 font-semibold">
          {isBn ? 'প্রশ্নপত্র লোড হচ্ছে...' : 'Loading exam question paper...'}
        </div>
      )}
      {!isLoadingQuestions && questionLoadError && (
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-sm">
          {questionLoadError}
        </div>
      )}

      {/* Result Card after Submission */}
      {isSubmitted && (
        <div className="bg-gradient-to-br from-indigo-50 via-white to-sky-50 dark:from-[#0B1428] dark:via-[#080D1A] dark:to-[#040711] text-slate-900 dark:text-white p-5 sm:p-8 rounded-3xl shadow-xl border border-indigo-200 dark:border-sky-500/30 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider">
                {isBn
                  ? 'অফিসিয়াল ফলাফল শিট • Analytics-এ সেভ হয়েছে'
                  : 'Official Result Sheet • Saved to Analytics'}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold mt-2 text-slate-950 dark:text-white">
                {isBn ? 'ফলাফল সারাংশ (Performance Summary)' : 'Performance Summary'}
              </h2>
            </div>
            <div className="sm:text-right">
              <span className="block text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
                {isBn
                  ? toBengaliNumber(totalMarksEarned.toFixed(2))
                  : totalMarksEarned.toFixed(2)}{' '}
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  / {isBn ? toBengaliNumber(effectiveTotalMarks) : effectiveTotalMarks}{' '}
                  {isBn ? 'মার্কস' : 'Marks'}
                </span>
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400">
                {isBn
                  ? `(+${toBengaliNumber(markPerQuestion.toFixed(2))} সঠিক, -${toBengaliNumber(
                      (negativePenalty * markPerQuestion).toFixed(2)
                    )} ভুল উত্তর নেগেটিভ মার্কস)`
                  : `(+${markPerQuestion.toFixed(2)} per correct, -${(
                      negativePenalty * markPerQuestion
                    ).toFixed(2)} negative mark per wrong)`}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            <div className="bg-white dark:bg-[#0B1222] p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                {isBn ? 'মোট প্রশ্ন' : 'Total Questions'}
              </span>
              <span className="text-lg font-bold text-slate-950 dark:text-white">
                {isBn ? toBengaliNumber(questions.length) : questions.length}
              </span>
            </div>
            <div className="bg-emerald-50/70 dark:bg-[#0B1222] p-4 rounded-xl border border-emerald-200 dark:border-slate-800">
              <span className="block text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                {isBn ? 'সঠিক (+১)' : 'Correct (+1)'}
              </span>
              <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                {isBn ? toBengaliNumber(correctCount) : correctCount}
              </span>
            </div>
            <div className="bg-red-50/70 dark:bg-[#0B1222] p-4 rounded-xl border border-red-200 dark:border-slate-800">
              <span className="block text-[11px] text-red-700 dark:text-red-400 font-semibold">
                {isBn
                  ? `ভুল উত্তর (-${toBengaliNumber(negativePenalty)})`
                  : `Wrong (-${negativePenalty})`}
              </span>
              <span className="text-lg font-bold text-red-700 dark:text-red-400">
                {isBn ? toBengaliNumber(incorrectCount) : incorrectCount}
              </span>
            </div>
            <div className="bg-amber-50/70 dark:bg-[#0B1222] p-4 rounded-xl border border-amber-200 dark:border-slate-800">
              <span className="block text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
                {isBn ? 'উত্তর দেননি (০)' : 'Unattempted (0)'}
              </span>
              <span className="text-lg font-bold text-amber-700 dark:text-amber-400">
                {isBn ? toBengaliNumber(unattemptedCount) : unattemptedCount}
              </span>
            </div>
            <div className="bg-white dark:bg-[#0B1222] p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                {isBn ? 'যাচাই হয়নি' : 'Unverified'}
              </span>
              <span className="text-lg font-bold text-slate-700 dark:text-slate-300">
                {isBn ? toBengaliNumber(unverifiedCount) : unverifiedCount}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Color-Coded Subject Filter Toolbar (No Green or Red) */}
      {!isLoadingQuestions && questions.length > 0 && (
        <div className="bg-white dark:bg-[#0A1122] p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-indigo-950 shadow-sm space-y-3">
          {isDu4Of6 && active4Subjects && (
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-200 dark:border-slate-800/80 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-600/10 dark:bg-sky-400/15 text-indigo-700 dark:text-sky-300 font-extrabold text-[11px] border border-indigo-400/30">
                  {isBn ? '৪/৬ বিষয় • ৬০ / ৯০ টি MCQ' : '4/6 Subjects • 60 / 90 MCQs'}
                </span>
                <span className="text-slate-600 dark:text-slate-300 text-[11px] font-medium">
                  {isBn ? 'নির্বাচিত ৪টি বিষয়:' : 'Selected 4 Subjects:'}{' '}
                  <strong className="text-slate-900 dark:text-white">
                    {active4Subjects
                      .map((s) => getSubjectLabelForLang(s, examLanguage))
                      .join(', ')}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {onChangeExamLanguage && (
                  <button
                    type="button"
                    onClick={() => onChangeExamLanguage(isBn ? 'en' : 'bn')}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-bold inline-flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-sky-400" />
                    <span>{isBn ? 'ভাষা: বাংলা (Switch to EN)' : 'Language: English (বাংলায় দেখুন)'}</span>
                  </button>
                )}
                {!isSubmitted && onChangeSubjects && (
                  <button
                    type="button"
                    onClick={onChangeSubjects}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/70 text-indigo-700 dark:text-sky-300 border border-indigo-300 dark:border-indigo-700/60 text-[11px] font-bold inline-flex items-center gap-1.5 transition-colors"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>
                      {isBn ? 'বিষয় ও ভাষা পরিবর্তন (৪/৬)' : 'Change Subjects & Language (4/6)'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap no-scrollbar">
            {subjects.map((subject) => {
              const isSelected = selectedSubject === subject;
              const subjectCount =
                subject === 'ALL'
                  ? questions.length
                  : questions.filter((q) => q.subject === subject).length;
              const formattedCount = isBn ? toBengaliNumber(subjectCount) : subjectCount;
              if (subject === 'ALL') {
                return (
                  <button
                    key={subject}
                    onClick={() => setSelectedSubject(subject)}
                    className={
                      'px-3.5 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ' +
                      (isSelected
                        ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-950 dark:border-white shadow-md'
                        : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200 dark:bg-[#0F172B] dark:text-slate-300 dark:border-slate-800')
                    }
                  >
                    {isBn ? `সকল (${formattedCount})` : `ALL (${formattedCount})`}
                  </button>
                );
              }
              const style = getSubjectCardStyle(subject);
              return (
                <button
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  className={
                    'px-3.5 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ' +
                    (isSelected ? style.filterActive : style.filterInactive)
                  }
                >
                  {getSubjectLabelForLang(subject, examLanguage)} ({formattedCount})
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ALL QUESTIONS IN ONE PAGE */}
      {!isLoadingQuestions && filteredQuestions.length > 0 && (
        <div className="space-y-4 sm:space-y-5">
          {filteredQuestions.map((q, idx) => {
            const imported = q as ImportedQuestion;
            const answerIsVerified = imported.answerVerified !== false && q.correctAnswer >= 0;
            const userSelected = selectedAnswers[q.id];
            const isLocked = lockedQuestions.has(q.id);
            const isWritten = q.questionType === 'Written' || q.options.length === 0;
            const isAiExpanded = expandedAiQuestionIds.has(q.id);
            const cardStyle = getSubjectCardStyle(q.subject);
            const showAnswerBadge = answerIsVerified && Boolean(q.options[q.correctAnswer]);
            const rawNum = q.number ?? idx + 1;
            const displayNum = isBn ? toBengaliNumber(rawNum) : rawNum;

            return (
              <div
                key={q.id}
                id={`q-${q.id}`}
                className={`${cardStyle.bgClass} rounded-2xl p-4 sm:p-6 transition-all ${
                  isSubmitted
                    ? userSelected === q.correctAnswer
                      ? 'border-2 border-l-8 border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20'
                      : userSelected !== undefined
                      ? 'border-2 border-l-8 border-red-500 bg-red-50/40 dark:bg-red-950/20'
                      : cardStyle.borderClass
                    : cardStyle.borderClass
                }`}
              >
                {/* Question Top Bar */}
                <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${cardStyle.numBadge}`}>
                      {isBn ? `প্রশ্ন ${displayNum}` : `Question ${displayNum}`}
                    </span>
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${cardStyle.badgeBg}`}>
                      {getSubjectLabelForLang(q.subject, examLanguage)}
                    </span>
                    {isWritten && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-400 dark:border-amber-800/60">
                        {isBn ? 'লিখিত প্রশ্ন' : 'Written Question'}
                      </span>
                    )}
                    {isLocked && !isSubmitted && !isWritten && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300 flex items-center gap-1 border border-amber-400 dark:border-amber-800/60">
                        <Lock className="w-3 h-3" /> {isBn ? 'লক করা হয়েছে 🔒' : 'Locked 🔒'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Text (Dynamic Question Font Size in px) */}
                <div
                  style={{ fontSize: `${uiSettings.questionFontPx}px` }}
                  className="font-semibold text-slate-950 dark:text-white mb-4 leading-relaxed"
                >
                  <span className="font-bold text-indigo-700 dark:text-sky-400 mr-1.5">
                    {displayNum}.
                  </span>
                  <MathInlineRenderer
                    text={q.question.replace(/^([০-৯\d]+\.?\s*)?(\[[^\]]+\]\s*)?/, '').trim()}
                  />
                </div>
                {imported.questionImageUrls
                  ?.filter((url) => {
                    const fileName = url.split('/').pop() || url;
                    return !q.question.includes(fileName);
                  })
                  .map((url, imageIndex) => (
                    <img
                      key={url + imageIndex}
                      src={url}
                      alt="Question attachment"
                      loading="lazy"
                      className="mb-3 max-w-full max-h-80 object-contain rounded-xl bg-white p-1.5 border border-slate-200 dark:border-slate-700"
                    />
                  ))}

                {/* Options or Written Question Notice (Dynamic Option Font Size in px) */}
                {isWritten ? (
                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-[#080E1C] border border-amber-300 dark:border-amber-900/40 text-amber-900 dark:text-amber-300 text-xs flex items-center justify-between flex-wrap gap-2">
                    <span>
                      {isBn
                        ? '✍️ লিখিত প্রশ্ন (অপশন নির্বাচনের প্রয়োজন নেই)'
                        : '✍️ Written Question (Option Selection Not Required)'}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400 text-[11px]">
                      {isBn
                        ? 'জমা দেওয়ার পর মূল সমাধান দেখা যাবে'
                        : 'Full solution will be shown after submission'}
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = userSelected === optIdx;
                      const isCorrectOpt = answerIsVerified && optIdx === q.correctAnswer;
                      const optionImages = imported.optionImageUrls?.[optIdx] || [];
                      const optLabel = getOptionLabelForLang(optIdx, examLanguage);

                      let btnStyle =
                        'bg-white/95 dark:bg-[#080E1C] border-slate-300 dark:border-slate-800 hover:border-indigo-500 text-slate-900 dark:text-slate-200';

                      if (isSubmitted) {
                        if (isCorrectOpt) {
                          btnStyle =
                            'bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-semibold';
                        } else if (isSelected && !isCorrectOpt) {
                          btnStyle =
                            'bg-red-50 dark:bg-red-950/60 border-2 border-red-500 text-red-950 dark:text-red-200 font-semibold';
                        }
                      } else {
                        if (isSelected) {
                          btnStyle =
                            'bg-indigo-600 text-white border-indigo-500 font-semibold shadow-md shadow-indigo-600/20';
                        } else if (isLocked) {
                          btnStyle =
                            'bg-slate-100/80 dark:bg-[#070B16] border-slate-200 dark:border-slate-900 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={isLocked || isSubmitted}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          style={{ fontSize: `${uiSettings.optionFontPx}px` }}
                          className={`text-left p-3 sm:p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <span
                              className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                                isSubmitted && isCorrectOpt
                                  ? 'bg-emerald-600 text-white'
                                  : isSubmitted && isSelected && !isCorrectOpt
                                  ? 'bg-red-600 text-white'
                                  : isSelected
                                  ? 'bg-white text-indigo-700'
                                  : 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-300'
                              }`}
                            >
                              {optLabel}
                            </span>
                            <div className="leading-snug flex-1 text-left min-w-0">
                              {(opt || optionImages.length === 0) && (
                                <MathInlineRenderer
                                  text={opt || `Option ${optLabel}`}
                                />
                              )}
                              {optionImages.map((url, imageIndex) => (
                                <img
                                  key={url + imageIndex}
                                  src={url}
                                  alt="Option attachment"
                                  loading="lazy"
                                  className="mt-2 max-w-full max-h-48 object-contain rounded-lg bg-white p-1 border border-slate-200"
                                />
                              ))}
                            </div>
                          </div>
                          {isSubmitted && isCorrectOpt && (
                            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          )}
                          {isSubmitted && isSelected && !isCorrectOpt && (
                            <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Post-Submission Details & AI Tutor Action */}
                {isSubmitted && (
                  <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 space-y-3">
                    <div
                      className="p-3.5 sm:p-4 rounded-xl bg-white/95 dark:bg-[#080E1B] border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-2xs"
                      style={{ fontSize: `${uiSettings.explanationFontPx}px` }}
                    >
                      <span
                        className="font-bold text-slate-900 dark:text-slate-200 block"
                        style={{ fontSize: `${Math.max(13, uiSettings.explanationFontPx + 1)}px` }}
                      >
                        {isBn ? 'সঠিক উত্তর ও মূল ব্যাখ্যা:' : 'Correct Answer & Explanation:'}
                      </span>
                      {showAnswerBadge && (
                        <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-500/60 text-emerald-950 dark:text-emerald-200 font-bold text-xs">
                          <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] uppercase">
                            {isBn ? 'উত্তর' : 'Answer'}
                          </span>
                          <span>
                            [{getOptionLabelForLang(q.correctAnswer, examLanguage)}]{' '}
                          </span>
                          {q.options[q.correctAnswer] && (
                            <MathInlineRenderer text={q.options[q.correctAnswer]} />
                          )}
                          {imported.optionImageUrls?.[q.correctAnswer]?.map((url, idx) => (
                            <img
                              key={url + idx}
                              src={url}
                              alt="Correct option diagram"
                              className="h-10 w-auto object-contain rounded bg-white p-0.5 border border-emerald-400/50"
                            />
                          ))}
                        </div>
                      )}
                      {q.explanation ? (
                        <MathMarkdownRenderer
                          content={q.explanation}
                          stripAnswerHeader={showAnswerBadge}
                          fontSizePx={uiSettings.explanationFontPx}
                        />
                      ) : (
                        <span className="text-slate-700 dark:text-slate-300 font-medium block">
                          {isBn
                            ? `ঢাকা বিশ্ববিদ্যালয় (${getSubjectLabelForLang(q.subject, 'bn')}) প্রশ্ন সমাধান ও বিস্তৃত ব্যাখ্যা।`
                            : `Official ${examSession.university} (${q.subject}) question solution and explanation.`}
                        </span>
                      )}
                      {!answerIsVerified && q.questionType !== 'Written' && (
                        <p className="mt-1 text-amber-700 dark:text-amber-300">
                          {isBn
                            ? 'এই প্রশ্নের answer key যাচাই করা যায়নি; অনুমান করে উত্তর দেখানো হয়নি।'
                            : 'The answer key for this question could not be verified.'}
                        </p>
                      )}
                      {imported.explanationImageUrls
                        ?.filter((url) => {
                          const fileName = url.split('/').pop() || url;
                          return !(q.explanation || '').includes(fileName);
                        })
                        .map((url, imageIndex) => (
                          <img
                            key={url + imageIndex}
                            src={url}
                            alt="Explanation attachment"
                            loading="lazy"
                            className="mt-2 max-w-full max-h-64 object-contain rounded-lg bg-white p-1.5 border border-slate-200"
                          />
                        ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => toggleAiTutor(q.id)}
                        className={`w-full sm:w-auto justify-center px-4 py-2.5 border rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-sm ${
                          isAiExpanded
                            ? 'bg-sky-600 border-sky-400 text-white shadow-sky-600/30'
                            : 'bg-indigo-600 hover:bg-indigo-500 border-indigo-500 text-white'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>
                          {isAiExpanded
                            ? isBn
                              ? 'AI Tutor লুকান'
                              : 'Hide AI Tutor'
                            : 'Ask AI Tutor'}
                        </span>
                        {isAiExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {isAiExpanded && (
                      <InlineAiTutor
                        question={q}
                        university={examSession.university}
                        session={examSession.session}
                        customApiKey={customApiKey}
                        onClose={() => toggleAiTutor(q.id)}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Exit Exam Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0B1222] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-red-300 dark:border-red-900/60 shadow-2xl space-y-5 text-center">
            <div className="w-14 h-14 bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800/60 rounded-2xl mx-auto flex items-center justify-center">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                {isBn ? 'পরীক্ষা ত্যাগ করতে চান?' : 'Exit the exam?'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {isBn
                  ? 'এখন বের হয়ে গেলে আপনার উত্তর ও অগ্রগতি সেভ হবে না।'
                  : 'If you exit now, your answers and progress will not be saved.'}
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowExitModal(false)}
                className="flex-1 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-300 rounded-xl font-semibold text-xs transition-colors"
              >
                {isBn ? 'ফিরে যান (Cancel)' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  setShowExitModal(false);
                  onBack();
                }}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs shadow-md transition-all"
              >
                {isBn ? 'হ্যাঁ, বের হবো' : 'Yes, Exit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submission Confirmation Modal */}
      {showConfirmModal && !isLoadingQuestions && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0B1222] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-indigo-900/60 shadow-2xl space-y-5 text-center">
            <div className="w-14 h-14 bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-800/60 rounded-2xl mx-auto flex items-center justify-center">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                {isBn ? 'পরীক্ষা জমা দিতে চান? (Submit Exam)' : 'Submit Exam Now?'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                {isBn
                  ? `আপনি ${toBengaliNumber(questions.length)} টির মধ্যে ${toBengaliNumber(
                      lockedQuestions.size
                    )} টি প্রশ্নের উত্তর দিয়ে লক করেছেন। জমা দেওয়ার পর ফলাফল আপনার ইতিহাসে (Analytics) সেভ হবে।`
                  : `You have answered and locked ${lockedQuestions.size} out of ${questions.length} questions. Your result will be saved to Analytics upon submission.`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-300 rounded-xl font-semibold text-xs transition-colors"
              >
                {isBn ? 'বাতিল (Cancel)' : 'Cancel'}
              </button>
              <button
                onClick={handleSubmitExam}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition-all"
              >
                {isBn ? 'নিশ্চিত জমা দিন (Submit)' : 'Confirm Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
