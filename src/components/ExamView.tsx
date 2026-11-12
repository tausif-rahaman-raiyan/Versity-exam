import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  Lock,
  RotateCcw,
  Send,
  Sparkles,
  BookOpen,
  Award
} from 'lucide-react';
import { findSubjectDef, getSubjectDisplayName, getSubjectTheme } from '../data/subjects';
import {
  defaultOptionLabelsBn,
  defaultOptionLabelsEn,
  extractBilingualText,
  toBnDigits,
  uiTexts
} from '../data/translations';
import type { Attempt, Question, RuBranchOption, Session, ThemeMode, UiSettings } from '../types';
import { loadSessionQuestions } from '../utils/questionLoader';
import { hasValidGeminiKey } from '../utils/storage';
import { AiTutorPanel } from './AiTutorPanel';
import { MathMarkdown } from './MathMarkdown';
import { SettingsDropdown } from './SettingsDropdown';

type ExamViewProps = {
  session: Session;
  selectedSubjects: string[] | null;
  selectedRuBranch?: RuBranchOption | null;
  language: 'bn' | 'en';
  theme: ThemeMode;
  onChangeTheme: (theme: ThemeMode) => void;
  uiSettings: UiSettings;
  onChangeUiSettings: (settings: UiSettings) => void;
  apiKey: string;
  onOpenApiKeyModal: () => void;
  onRequireApiKeyToast: () => void;
  onSaveAttempt: (attempt: Attempt) => void;
  onExitExam: () => void;
};

function formatTimer(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const hrs = Math.floor(safe / 3600);
  const mins = Math.floor((safe % 3600) / 60);
  const secs = safe % 60;
  const mm = String(mins).padStart(2, '0');
  const ss = String(secs).padStart(2, '0');
  if (hrs > 0) {
    return `${hrs}:${mm}:${ss}`;
  }
  return `${mm}:${ss}`;
}

export const ExamView: React.FC<ExamViewProps> = ({
  session,
  selectedSubjects,
  selectedRuBranch,
  language,
  theme,
  onChangeTheme,
  uiSettings,
  onChangeUiSettings,
  apiKey,
  onOpenApiKeyModal,
  onRequireApiKeyToast,
  onSaveAttempt,
  onExitExam
}) => {
  const [rawQuestions, setRawQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [subjectFilter, setSubjectFilter] = useState<string>('ALL');

  // Auto-locked answers: questionId -> selected option index
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(session.durationMinutes * 60);
  const [openTutorIds, setOpenTutorIds] = useState<Record<string, boolean>>({});
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false);

  const submittedOnceRef = useRef(false);

  // Load questions on mount
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    loadSessionQuestions(session.id).then((loaded) => {
      if (!cancelled) {
        setRawQuestions(loaded);
        setLoading(false);
        setRemainingSeconds(session.durationMinutes * 60);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [session.id, session.durationMinutes]);

  // Filter by chosen subjects (DU 4-of-6) or chosen RU Section B branch (§8.2)
  const examQuestions = useMemo(() => {
    if (
      session.institution === 'RU' &&
      selectedRuBranch &&
      rawQuestions.some((q) => q.ruSection === 'B')
    ) {
      return rawQuestions.filter(
        (q) => q.ruSection !== 'B' || q.ruBranch === selectedRuBranch
      );
    }

    if (!session.subjectPickMode || !selectedSubjects || selectedSubjects.length === 0) {
      return rawQuestions;
    }
    const allowedSet = new Set(selectedSubjects.map((s) => findSubjectDef(s).id));
    return rawQuestions.filter((q) => allowedSet.has(findSubjectDef(q.subject).id));
  }, [rawQuestions, session.institution, session.subjectPickMode, selectedSubjects, selectedRuBranch]);

  // Subjects present in this exam
  const examSubjects = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const q of examQuestions) {
      const canonical = findSubjectDef(q.subject).id;
      if (!seen.has(canonical)) {
        seen.add(canonical);
        list.push(canonical);
      }
    }
    return list;
  }, [examQuestions]);

  const visibleQuestions = useMemo(() => {
    if (subjectFilter === 'ALL') return examQuestions;
    return examQuestions.filter((q) => findSubjectDef(q.subject).id === subjectFilter);
  }, [examQuestions, subjectFilter]);

  // Scoring Calculation (§8.3)
  const evaluation = useMemo(() => {
    const mcqQuestions = examQuestions.filter(
      (q) => q.questionType === 'MCQ' && q.options.length > 0
    );
    const mcqCount = mcqQuestions.length;
    const isFilteredExam =
      session.subjectPickMode ||
      (session.institution === 'RU' && Boolean(selectedRuBranch));
    const effectiveTotalMarks = isFilteredExam
      ? mcqCount > 0
        ? mcqCount
        : session.totalMarks
      : session.totalMarks;
    const perMark = mcqCount > 0 ? effectiveTotalMarks / mcqCount : 1;
    const negative = session.negativeMarking ?? 0.25;

    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    let unverified = 0;

    let secACorrect = 0;
    let secAWrong = 0;
    let secATotal = 0;
    let secBCorrect = 0;
    let secBWrong = 0;
    let secBTotal = 0;

    const hasExplicitRuSections = mcqQuestions.some((q) => q.ruSection === 'A' || q.ruSection === 'B');

    for (const q of mcqQuestions) {
      const isUnv = q.answerVerified === false || q.correctAnswer < 0;
      const chosen = answers[q.id];

      const canonicalSub = findSubjectDef(q.subject).id;
      const isSecA = hasExplicitRuSections
        ? q.ruSection !== 'B'
        : canonicalSub === 'Physics' || canonicalSub === 'Chemistry' || canonicalSub === 'ICT';

      if (isSecA) secATotal++;
      else secBTotal++;

      if (isUnv) {
        unverified++;
        continue;
      }

      if (chosen === undefined) {
        skipped++;
      } else if (chosen === q.correctAnswer) {
        correct++;
        if (isSecA) secACorrect++;
        else secBCorrect++;
      } else {
        wrong++;
        if (isSecA) secAWrong++;
        else secBWrong++;
      }
    }

    const rawScore = Math.max(0, correct * perMark - wrong * negative * perMark);
    const score = Math.round(rawScore * 100) / 100;
    const accuracy =
      correct + wrong > 0
        ? Math.round((correct / (correct + wrong)) * 1000) / 10
        : 0;

    const secAScore = Math.round(
      Math.max(0, secACorrect * perMark - secAWrong * negative * perMark) * 100
    ) / 100;
    const secBScore = Math.round(
      Math.max(0, secBCorrect * perMark - secBWrong * negative * perMark) * 100
    ) / 100;
    const secAMarks = Math.round(secATotal * perMark * 100) / 100;
    const secBMarks = Math.round(secBTotal * perMark * 100) / 100;

    const ruSectionBreakdown =
      session.institution === 'RU' && secATotal > 0 && secBTotal > 0
        ? {
            secAScore,
            secAMarks,
            secAPassed: secAScore >= 25,
            secBScore,
            secBMarks,
            secBPassed: secBScore >= 10,
            combinedPassed: secAScore >= 25 && secBScore >= 10 && score >= 40
          }
        : null;

    return {
      mcqCount,
      effectiveTotalMarks,
      perMark: Math.round(perMark * 100) / 100,
      negative,
      correct,
      wrong,
      skipped,
      unverified,
      score,
      accuracy,
      ruSectionBreakdown
    };
  }, [
    examQuestions,
    answers,
    session.institution,
    session.subjectPickMode,
    session.totalMarks,
    session.negativeMarking,
    selectedRuBranch
  ]);

  // Handle Submit (§8.2 & §8.3)
  const handleSubmitExam = useCallback(() => {
    if (submittedOnceRef.current) return;
    submittedOnceRef.current = true;
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const timeTakenSeconds = Math.max(
      0,
      session.durationMinutes * 60 - remainingSeconds
    );
    const rand5 = Math.random().toString(36).slice(2, 7);
    const attempt: Attempt = {
      id: `attempt-${Date.now()}-${rand5}`,
      timestamp: new Date().toISOString(),
      sessionId: session.id,
      title: session.title,
      institution: session.institution,
      session: session.session,
      questionType: session.questionType,
      score: evaluation.score,
      totalMarks: evaluation.effectiveTotalMarks,
      totalQuestions: examQuestions.length,
      correctCount: evaluation.correct,
      incorrectCount: evaluation.wrong,
      unattemptedCount: evaluation.skipped,
      timeTakenSeconds
    };
    onSaveAttempt(attempt);
  }, [
    session,
    remainingSeconds,
    evaluation,
    examQuestions.length,
    onSaveAttempt
  ]);

  // Countdown Timer Effect
  useEffect(() => {
    if (loading || isSubmitted || examQuestions.length === 0) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, isSubmitted, examQuestions.length]);

  // Auto-submit when timer hits 0
  useEffect(() => {
    if (!loading && !isSubmitted && examQuestions.length > 0 && remainingSeconds === 0) {
      handleSubmitExam();
    }
  }, [remainingSeconds, loading, isSubmitted, examQuestions.length, handleSubmitExam]);

  // Auto-lock option selection (§8.2): first click permanently locks that question
  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (isSubmitted) return;
    setAnswers((prev) => {
      if (prev[questionId] !== undefined) {
        // Already locked! Cannot change.
        return prev;
      }
      return { ...prev, [questionId]: optionIdx };
    });
  };

  // Retake Exam (§8.2)
  const handleRetake = () => {
    submittedOnceRef.current = false;
    setAnswers({});
    setIsSubmitted(false);
    setOpenTutorIds({});
    setRemainingSeconds(session.durationMinutes * 60);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleTutor = (questionId: string) => {
    const isOpen = Boolean(openTutorIds[questionId]);
    if (isOpen) {
      setOpenTutorIds((prev) => ({ ...prev, [questionId]: false }));
      return;
    }
    if (!hasValidGeminiKey(apiKey)) {
      onRequireApiKeyToast();
      return;
    }
    setOpenTutorIds((prev) => ({ ...prev, [questionId]: true }));
  };

  const answeredCount = Object.keys(answers).length;
  const isLowTime = !isSubmitted && remainingSeconds <= Math.min(300, session.durationMinutes * 60 * 0.2);

  const handleExitClick = () => {
    if (isSubmitted) {
      onExitExam();
    } else {
      setExitConfirmOpen(true);
    }
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Exit Confirmation Modal */}
      {exitConfirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs"
          onClick={() => setExitConfirmOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white dark:bg-[#0B1325] border-2 border-rose-300 dark:border-rose-800 shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Are you sure to exit?
              </h3>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
              Are you sure to exit? You already selected{' '}
              <span className="font-black text-rose-600 dark:text-rose-400 tabular-nums">
                {answeredCount} / {examQuestions.length}
              </span>{' '}
              MCQ.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setExitConfirmOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold cursor-pointer"
              >
                No
              </button>
              <button
                type="button"
                onClick={() => {
                  setExitConfirmOpen(false);
                  onExitExam();
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-600/20 cursor-pointer"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Exam Header (§8.2) */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#070B14]/95 backdrop-blur-md border-b border-slate-200 dark:border-indigo-950/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          {/* Left: Red Exit Button + Title */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={handleExitClick}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 border border-rose-500 text-xs sm:text-sm font-extrabold text-white shadow-sm shadow-rose-600/20 shrink-0 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Exit</span>
            </button>
            <div className="truncate">
              <div className="text-xs sm:text-base font-extrabold text-slate-900 dark:text-white truncate">
                {session.title}
              </div>
              <div className="text-[10px] sm:text-xs font-bold text-indigo-600 dark:text-sky-400">
                {uiTexts.exam.answeredLabel}{' '}
                <span className="tabular-nums">
                  {toBnDigits(answeredCount, language === 'bn')}/
                  {toBnDigits(examQuestions.length, language === 'bn')}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Timer + Submit/Retake + Compact Settings */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Timer Chip */}
            <div
              className={`inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-black tabular-nums ${
                isLowTime
                  ? 'bg-rose-50 text-rose-600 border-rose-300 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-700 animate-pulse'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-[#0E172A] dark:text-sky-300 dark:border-indigo-800'
              }`}
            >
              <Clock className="w-4 h-4 shrink-0" />
              <span>{formatTimer(remainingSeconds)}</span>
            </div>

            {/* Submit or Retake button */}
            {!isSubmitted ? (
              <button
                type="button"
                disabled={examQuestions.length === 0}
                onClick={handleSubmitExam}
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-sm shadow-emerald-600/20 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{uiTexts.exam.submitBtn}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRetake}
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-sm shadow-indigo-600/20 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{uiTexts.exam.retakeBtn}</span>
              </button>
            )}

            <SettingsDropdown
              theme={theme}
              onChangeTheme={onChangeTheme}
              uiSettings={uiSettings}
              onChangeUiSettings={onChangeUiSettings}
              apiKey={apiKey}
              onOpenApiKeyModal={onOpenApiKeyModal}
              compact
            />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Evaluation Report Card after Submit (§8.3) */}
        {isSubmitted && examQuestions.length > 0 && (
          <section className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-emerald-50/70 dark:from-[#0B1325] dark:via-[#080E1C] dark:to-[#061814] border-2 border-indigo-300 dark:border-indigo-700 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">
                    {uiTexts.exam.evalReportTitle}
                  </h2>
                  {evaluation.mcqCount > 0 && evaluation.negative > 0 && (
                    <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                      {uiTexts.exam.negMarkingNotice(evaluation.negative)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {evaluation.mcqCount === 0 ? (
              <div className="p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-200">
                {uiTexts.exam.writtenOnlyEvalNote}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="p-3.5 rounded-2xl bg-indigo-50/90 dark:bg-[#0D1630] border border-indigo-200 dark:border-indigo-800 text-center">
                  <div className="text-lg sm:text-2xl font-black text-indigo-600 dark:text-sky-400 tabular-nums">
                    {toBnDigits(evaluation.score, language === 'bn')} /{' '}
                    {toBnDigits(evaluation.effectiveTotalMarks, language === 'bn')}
                  </div>
                  <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mt-0.5">
                    {uiTexts.exam.statScore}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
                  <div className="text-lg sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {toBnDigits(evaluation.correct, language === 'bn')}
                  </div>
                  <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mt-0.5">
                    {uiTexts.exam.statCorrect}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-50/90 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-center">
                  <div className="text-lg sm:text-2xl font-black text-rose-600 dark:text-rose-400 tabular-nums">
                    {toBnDigits(evaluation.wrong, language === 'bn')}
                  </div>
                  <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mt-0.5">
                    {uiTexts.exam.statWrong}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center">
                  <div className="text-lg sm:text-2xl font-black text-amber-600 dark:text-amber-400 tabular-nums">
                    {toBnDigits(evaluation.skipped, language === 'bn')}
                  </div>
                  <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mt-0.5">
                    {uiTexts.exam.statSkipped}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50/90 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-center">
                  <div className="text-lg sm:text-2xl font-black text-purple-600 dark:text-purple-400 tabular-nums">
                    {toBnDigits(evaluation.accuracy, language === 'bn')}%
                  </div>
                  <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mt-0.5">
                    {uiTexts.exam.statAccuracy}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-center">
                  <div className="text-lg sm:text-2xl font-black text-slate-700 dark:text-slate-300 tabular-nums">
                    {toBnDigits(evaluation.unverified, language === 'bn')}
                  </div>
                  <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mt-0.5">
                    {uiTexts.exam.statUnverified}
                  </div>
                </div>
              </div>
            )}

            {/* Rajshahi University Section A / Section B Pass/Fail Breakdown */}
            {evaluation.ruSectionBreakdown && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-indigo-200/70 dark:border-indigo-900/60">
                <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-[#0B1325] border border-slate-200 dark:border-indigo-900/60 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                      Section A (ক-শাখা: আবশ্যিক)
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      Min Pass: ২৫ Marks
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white tabular-nums">
                      {toBnDigits(evaluation.ruSectionBreakdown.secAScore, true)} /{' '}
                      {toBnDigits(evaluation.ruSectionBreakdown.secAMarks, true)}
                    </div>
                    <div
                      className={`text-[11px] font-extrabold ${
                        evaluation.ruSectionBreakdown.secAPassed
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {evaluation.ruSectionBreakdown.secAPassed ? 'PASSED (≥ ২৫)' : 'FAILED (< ২৫)'}
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-[#0B1325] border border-slate-200 dark:border-indigo-900/60 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                      Section B (খ-শাখা: ঐচ্ছিক)
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      Min Pass: ১০ Marks
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white tabular-nums">
                      {toBnDigits(evaluation.ruSectionBreakdown.secBScore, true)} /{' '}
                      {toBnDigits(evaluation.ruSectionBreakdown.secBMarks, true)}
                    </div>
                    <div
                      className={`text-[11px] font-extrabold ${
                        evaluation.ruSectionBreakdown.secBPassed
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {evaluation.ruSectionBreakdown.secBPassed ? 'PASSED (≥ ১০)' : 'FAILED (< ১০)'}
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-[#0B1325] border border-slate-200 dark:border-indigo-900/60 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                      Total Combined Status
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      Min Combined: ৪০ Marks
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white tabular-nums">
                      {toBnDigits(evaluation.score, true)} /{' '}
                      {toBnDigits(evaluation.effectiveTotalMarks, true)}
                    </div>
                    <div
                      className={`text-[11px] font-extrabold ${
                        evaluation.ruSectionBreakdown.combinedPassed
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {evaluation.ruSectionBreakdown.combinedPassed
                        ? 'QUALIFIED (≥ ৪০)'
                        : 'NOT QUALIFIED'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Subject Filter Chips — compact 2 per line on mobile */}
        {examSubjects.length > 0 && (
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSubjectFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                subjectFilter === 'ALL'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm ring-2 ring-indigo-500/30'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200 dark:bg-[#0B1325] dark:text-slate-300 dark:border-indigo-900/60'
              }`}
            >
              {uiTexts.questionBank.allSubjects} ({toBnDigits(examQuestions.length, true)})
            </button>

            {examSubjects.map((subId) => {
              const sTheme = getSubjectTheme(subId);
              const active = subjectFilter === subId;
              const count = examQuestions.filter(
                (q) => findSubjectDef(q.subject).id === subId
              ).length;

              return (
                <button
                  key={subId}
                  type="button"
                  onClick={() => setSubjectFilter(subId)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                    active ? sTheme.filterActive : sTheme.filterInactive
                  }`}
                >
                  {getSubjectDisplayName(subId, 'bn')} ({toBnDigits(count, true)})
                </button>
              );
            })}
          </div>
        )}

        {/* Loading / Empty / Exam Question List */}
        {loading ? (
          <div className="p-12 rounded-3xl bg-slate-50 dark:bg-[#0B1325] border-2 border-indigo-200/60 dark:border-indigo-900/50 text-center space-y-3">
            <div className="w-8 h-8 rounded-full border-3 border-indigo-600 border-t-transparent animate-spin mx-auto" />
            <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
              পরীক্ষার প্রশ্নপত্র প্রস্তুত হচ্ছে (Loading exam paper)...
            </div>
          </div>
        ) : examQuestions.length === 0 ? (
          <div className="p-10 rounded-3xl bg-slate-50 dark:bg-[#0B1325] border-2 border-dashed border-indigo-300 dark:border-indigo-800 text-center max-w-xl mx-auto space-y-3">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              {uiTexts.questionBank.comingSoonTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {uiTexts.questionBank.comingSoonDesc.replace('<sessionId>', session.id)}
            </p>
            <button
              type="button"
              onClick={onExitExam}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold cursor-pointer"
            >
              {uiTexts.questionBank.backToSessions}
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {visibleQuestions.map((q) => {
              const sTheme = getSubjectTheme(q.subject);
              const isWritten = q.questionType === 'Written' || q.options.length === 0;
              const isUnverified =
                !isWritten && (q.answerVerified === false || q.correctAnswer < 0);
              const chosenOption = answers[q.id];
              const isLocked = chosenOption !== undefined;
              const defaultLabels =
                language === 'en' ? defaultOptionLabelsEn : defaultOptionLabelsBn;
              const optionLabels = q.optionLabels?.length ? q.optionLabels : defaultLabels;
              const isTutorOpen = Boolean(openTutorIds[q.id]);

              const questionStem = extractBilingualText(q.question, language);
              const explanationText = extractBilingualText(q.explanation, language);

              return (
                <article
                  key={q.id}
                  className={`p-4 sm:p-6 rounded-3xl transition-colors ${sTheme.borderClass} ${sTheme.bgClass}`}
                >
                  {/* Top Row Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-xl text-xs font-extrabold border ${sTheme.numBadge}`}
                      >
                        {uiTexts.questionBank.questionLabel}{' '}
                        {toBnDigits(q.number, language === 'bn')}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-xl text-xs font-bold ${sTheme.badgeBg}`}
                      >
                        {getSubjectDisplayName(q.subject, language)}
                      </span>
                    </div>

                    {/* Status Badges before/after submit */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {!isSubmitted && isLocked && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-xs font-bold">
                          <Lock className="w-3 h-3" />
                          <span>{uiTexts.exam.lockedBadge}</span>
                        </span>
                      )}

                      {isSubmitted && isWritten && (
                        <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-white text-xs font-bold">
                          {uiTexts.questionBank.writtenBadge}
                        </span>
                      )}

                      {isSubmitted && !isWritten && isUnverified && (
                        <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-white text-xs font-bold">
                          {uiTexts.questionBank.unverifiedBadge}
                        </span>
                      )}

                      {isSubmitted && !isWritten && !isUnverified && chosenOption === undefined && (
                        <span className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
                          {uiTexts.exam.badgeSkipped}
                        </span>
                      )}

                      {isSubmitted &&
                        !isWritten &&
                        !isUnverified &&
                        chosenOption !== undefined &&
                        chosenOption === q.correctAnswer && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>
                              {uiTexts.exam.badgeCorrect} (+{evaluation.perMark})
                            </span>
                          </span>
                        )}

                      {isSubmitted &&
                        !isWritten &&
                        !isUnverified &&
                        chosenOption !== undefined &&
                        chosenOption !== q.correctAnswer && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>
                              {uiTexts.exam.badgeWrong} (−
                              {Math.round(evaluation.perMark * evaluation.negative * 100) / 100})
                            </span>
                          </span>
                        )}
                    </div>
                  </div>

                  {/* Question Stem */}
                  <div
                    className="font-bold text-slate-900 dark:text-white mb-4"
                    style={{ fontSize: `${uiSettings.questionFontPx}px` }}
                  >
                    <MathMarkdown content={questionStem} />
                  </div>

                  {/* Question Images */}
                  {q.questionImageUrls && q.questionImageUrls.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-4">
                      {q.questionImageUrls.map((url, idx) => (
                        <img
                          key={idx}
                          src={url}
                          alt={`Question ${q.number} figure`}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="max-w-full max-h-72 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white p-2 object-contain"
                        />
                      ))}
                    </div>
                  )}

                  {/* Written Note or MCQ Options */}
                  {isWritten ? (
                    <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/35 border border-amber-300 dark:border-amber-800/70 text-xs sm:text-sm font-semibold text-amber-900 dark:text-amber-200 mb-3">
                      {uiTexts.exam.writtenNote}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = chosenOption === optIdx;
                        const isCorrect = !isUnverified && q.correctAnswer === optIdx;
                        const optText = extractBilingualText(opt, language);
                        const optImages = q.optionImageUrls?.[optIdx] || [];

                        // Compute option box classes before & after submit (§8.2)
                        let boxClasses =
                          'border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#070C18]/90 hover:border-indigo-400 cursor-pointer';
                        let labelClasses =
                          'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700';

                        if (!isSubmitted) {
                          if (isLocked) {
                            if (isChosen) {
                              boxClasses =
                                'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 ring-1 ring-indigo-500/40 cursor-not-allowed';
                              labelClasses = 'bg-indigo-600 text-white';
                            } else {
                              boxClasses =
                                'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#070C18]/70 opacity-60 cursor-not-allowed';
                            }
                          }
                        } else {
                          // After submit
                          if (isUnverified) {
                            if (isChosen) {
                              boxClasses =
                                'border-amber-500/70 bg-amber-50 dark:bg-amber-950/50 ring-1 ring-amber-500/30 cursor-default';
                              labelClasses = 'bg-amber-600 text-white';
                            } else {
                              boxClasses =
                                'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-[#070C18]/60 opacity-60 cursor-default';
                            }
                          } else if (isCorrect) {
                            boxClasses =
                              'border-emerald-500/70 bg-emerald-50 dark:bg-emerald-950/50 ring-1 ring-emerald-500/30 cursor-default';
                            labelClasses = 'bg-emerald-600 text-white';
                          } else if (isChosen && !isCorrect) {
                            boxClasses =
                              'border-rose-500/70 bg-rose-50 dark:bg-rose-950/50 ring-1 ring-rose-500/30 cursor-default';
                            labelClasses = 'bg-rose-600 text-white';
                          } else {
                            boxClasses =
                              'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-[#070C18]/60 opacity-60 cursor-default';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={isSubmitted || isLocked}
                            onClick={() => handleSelectOption(q.id, optIdx)}
                            style={{ fontSize: `${uiSettings.optionFontPx}px` }}
                            className={`p-3 rounded-2xl border flex items-start justify-between gap-2.5 text-left transition-all ${boxClasses}`}
                          >
                            <div className="flex items-start gap-2.5 min-w-0 flex-1">
                              <span
                                className={`w-7 h-7 rounded-lg text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5 ${labelClasses}`}
                              >
                                {optionLabels[optIdx] || optIdx + 1}
                              </span>
                              <div className="min-w-0 flex-1 space-y-2">
                                <div className="font-semibold text-slate-900 dark:text-slate-100">
                                  <MathMarkdown content={optText} />
                                </div>
                                {optImages.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {optImages.map((u, uIdx) => (
                                      <img
                                        key={uIdx}
                                        src={u}
                                        alt={`Option ${optIdx + 1} figure`}
                                        loading="lazy"
                                        referrerPolicy="no-referrer"
                                        className="max-w-full max-h-40 rounded-xl border border-slate-200 dark:border-slate-700 bg-white p-1 object-contain"
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {isSubmitted && !isUnverified && isCorrect && (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-1" />
                            )}
                            {isSubmitted && !isUnverified && isChosen && !isCorrect && (
                              <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-1" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* After Submit: Reveal Explanation & AI Tutor (§8.2) */}
                  {isSubmitted && (
                    <div className="mt-4 pt-3 border-t border-slate-200/70 dark:border-indigo-900/50 space-y-3">
                      {(explanationText ||
                        (q.explanationImageUrls && q.explanationImageUrls.length > 0)) && (
                        <div
                          style={{ fontSize: `${uiSettings.explanationFontPx}px` }}
                          className="p-4 rounded-2xl bg-white/90 dark:bg-[#070C18]/90 border border-slate-200/90 dark:border-indigo-900/50 space-y-2.5"
                        >
                          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                            <BookOpen className="w-4 h-4" />
                            <span>{uiTexts.questionBank.explanationTitle}</span>
                          </div>
                          {explanationText && (
                            <div className="text-slate-800 dark:text-slate-200">
                              <MathMarkdown content={explanationText} />
                            </div>
                          )}
                          {q.explanationImageUrls && q.explanationImageUrls.length > 0 && (
                            <div className="flex flex-wrap gap-3 pt-1">
                              {q.explanationImageUrls.map((url, idx) => (
                                <img
                                  key={idx}
                                  src={url}
                                  alt={`Explanation figure ${idx + 1}`}
                                  loading="lazy"
                                  referrerPolicy="no-referrer"
                                  className="max-w-full max-h-72 rounded-xl border border-slate-200 dark:border-slate-800 bg-white p-2 object-contain"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => handleToggleTutor(q.id)}
                          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                            isTutorOpen
                              ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                              : 'bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white shadow-sm'
                          }`}
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>
                            {isTutorOpen
                              ? uiTexts.questionBank.closeAiTutor
                              : uiTexts.questionBank.openAiTutor}
                          </span>
                        </button>
                      </div>

                      {isTutorOpen && (
                        <AiTutorPanel
                          question={q}
                          apiKey={apiKey}
                          explanationFontPx={uiSettings.explanationFontPx}
                          onOpenApiKeyModal={onOpenApiKeyModal}
                          onClose={() =>
                            setOpenTutorIds((prev) => ({ ...prev, [q.id]: false }))
                          }
                        />
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
