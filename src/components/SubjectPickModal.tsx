import React, { useEffect, useState } from 'react';
import {
  Atom,
  FlaskConical,
  Sigma,
  Dna,
  BookOpen,
  Languages,
  Sparkles,
  Cpu,
  Check,
  X,
  ArrowRight
} from 'lucide-react';
import { siteConfig } from '../data/siteConfig';
import { findSubjectDef } from '../data/subjects';
import { toBnDigits } from '../data/translations';
import type { Question, Session } from '../types';
import { loadSessionQuestions } from '../utils/questionLoader';

type SubjectPickModalProps = {
  session: Session | null;
  isOpen: boolean;
  initialSubjects: string[];
  initialLanguage: 'bn' | 'en';
  onClose: () => void;
  onConfirm: (selectedSubjects: string[], language: 'bn' | 'en') => void;
};

function renderSubjectIcon(iconName: string) {
  switch (iconName) {
    case 'Atom':
      return <Atom className="w-5 h-5" />;
    case 'FlaskConical':
      return <FlaskConical className="w-5 h-5" />;
    case 'Sigma':
      return <Sigma className="w-5 h-5" />;
    case 'Dna':
      return <Dna className="w-5 h-5" />;
    case 'BookOpen':
      return <BookOpen className="w-5 h-5" />;
    case 'Languages':
      return <Languages className="w-5 h-5" />;
    case 'Cpu':
      return <Cpu className="w-5 h-5" />;
    default:
      return <Sparkles className="w-5 h-5" />;
  }
}

export const SubjectPickModal: React.FC<SubjectPickModalProps> = ({
  session,
  isOpen,
  initialLanguage,
  onClose,
  onConfirm
}) => {
  const {
    mandatorySubjects,
    optionalSubjects,
    requiredTotal,
    defaultMcqQuestionsPerSubject,
    writtenQuestionsBySubject
  } = siteConfig.subjectPickRules;

  const requiredOptionalCount = Math.max(0, requiredTotal - mandatorySubjects.length);

  const [pickedOptional, setPickedOptional] = useState<string[]>([]);
  const [, setLanguage] = useState<'bn' | 'en'>(initialLanguage);
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (isOpen && session) {
      // Never pre-select optional subjects; user always picks 2 fresh
      setPickedOptional([]);
      setLanguage('bn');
      loadSessionQuestions(session.id).then((qs) => {
        setSessionQuestions(qs);
      });
    } else {
      setSessionQuestions([]);
    }
  }, [isOpen, session]);

  if (!isOpen || !session) return null;

  const toggleOptionalSubject = (subId: string) => {
    setPickedOptional((prev) => {
      if (prev.includes(subId)) {
        return prev.filter((item) => item !== subId);
      }
      if (prev.length >= requiredOptionalCount) {
        return prev;
      }
      return [...prev, subId];
    });
  };

  const allSelected = [...mandatorySubjects, ...pickedOptional];
  const remainingToPick = Math.max(0, requiredOptionalCount - pickedOptional.length);
  const isReady = pickedOptional.length === requiredOptionalCount;

  // Compute Question Count for Summary (§8.1) dynamically from loaded session questions when available
  const isWritten = session.questionType === 'Written';
  const allowedCanonical = new Set(allSelected.map((s) => findSubjectDef(s).id));
  const matchedLoadedCount = sessionQuestions.filter((q) =>
    allowedCanonical.has(findSubjectDef(q.subject).id)
  ).length;

  const computedQuestionCount = isWritten
    ? allSelected.reduce((acc, sub) => acc + (writtenQuestionsBySubject[sub] ?? 5), 0)
    : matchedLoadedCount > 0 && isReady
      ? matchedLoadedCount
      : requiredTotal * defaultMcqQuestionsPerSubject;

  const computedTotalMarks = isWritten ? session.totalMarks : computedQuestionCount;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0B1325] border-2 border-violet-300 dark:border-violet-800 shadow-2xl p-3.5 sm:p-6 space-y-3.5 sm:space-y-5 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2.5 border-b border-slate-200 dark:border-indigo-900/60 pb-2.5 sm:pb-3.5">
          <div className="min-w-0">
            <h2 className="text-base sm:text-2xl font-black text-slate-900 dark:text-white leading-snug truncate">
              {session.title} Exam
            </h2>
            <p className="text-[11px] sm:text-sm font-semibold text-violet-700 dark:text-violet-300 mt-0.5">
              Choose subjects · 4 subjects required ({session.questionType})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shrink-0"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Mandatory Subjects (2 pre-ticked, non-removable) */}
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] sm:text-xs font-extrabold text-slate-700 dark:text-slate-300">
              Mandatory (বাধ্যতামূলক ২টি বিষয়)
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
              Pre-selected
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {mandatorySubjects.map((subId) => {
              const def = findSubjectDef(subId);
              return (
                <div
                  key={subId}
                  className="flex items-center justify-between p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/35 border-2 border-emerald-400/80 dark:border-emerald-700/70"
                >
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      {renderSubjectIcon(def.iconName)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                        {def.nameBn}
                      </div>
                    </div>
                  </div>
                  <div className="w-4.5 h-4.5 sm:w-6 sm:h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pick exactly 2 more from optionalSubjects */}
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] sm:text-xs font-extrabold text-slate-700 dark:text-slate-300">
              Pick {requiredOptionalCount} More (ঐচ্ছিক যেকোনো ২টি নিন)
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold text-violet-600 dark:text-violet-400 tabular-nums shrink-0">
              {pickedOptional.length}/{requiredOptionalCount} chosen
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {optionalSubjects.map((subId) => {
              const def = findSubjectDef(subId);
              const isSelected = pickedOptional.includes(subId);
              const isDisabled = !isSelected && pickedOptional.length >= requiredOptionalCount;

              return (
                <button
                  key={subId}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => toggleOptionalSubject(subId)}
                  className={`flex items-center justify-between p-2 sm:p-3 rounded-xl sm:rounded-2xl border-2 text-left transition-all ${
                    isSelected
                      ? 'bg-violet-50/90 dark:bg-violet-950/50 border-violet-600 dark:border-violet-400 shadow-sm cursor-pointer'
                      : isDisabled
                        ? 'bg-slate-50 dark:bg-[#070C18] border-slate-200 dark:border-slate-800 opacity-50 cursor-not-allowed'
                        : 'bg-white dark:bg-[#070C18] border-slate-200 dark:border-indigo-900/60 hover:border-violet-400 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <div
                      className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-violet-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {renderSubjectIcon(def.iconName)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                        {def.nameBn}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`w-4.5 h-4.5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-violet-600 border-violet-600 text-white'
                        : 'border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Exam Summary */}
        <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-[#070C18] border border-slate-200 dark:border-indigo-900/60 space-y-2.5 sm:space-y-3">
          <div className="text-[11px] sm:text-xs font-extrabold text-slate-700 dark:text-slate-300">
            Exam Summary
          </div>
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            <div className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-[#0B1325] border border-slate-200 dark:border-indigo-900/50 text-center">
              <div className="text-xs sm:text-base font-black text-indigo-600 dark:text-sky-400 tabular-nums">
                {toBnDigits(computedQuestionCount, true)}
              </div>
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                Questions
              </div>
            </div>
            <div className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-[#0B1325] border border-slate-200 dark:border-indigo-900/50 text-center">
              <div className="text-xs sm:text-base font-black text-purple-600 dark:text-purple-400 tabular-nums">
                {toBnDigits(computedTotalMarks, true)}
              </div>
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                Total Marks
              </div>
            </div>
            <div className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-[#0B1325] border border-slate-200 dark:border-indigo-900/50 text-center">
              <div className="text-xs sm:text-base font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                {toBnDigits(allSelected.length, true)}/{toBnDigits(requiredTotal, true)}
              </div>
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                Subjects
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
            {allSelected.map((subId) => {
              const def = findSubjectDef(subId);
              return (
                <span
                  key={subId}
                  className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-violet-100 dark:bg-violet-950/80 text-violet-800 dark:text-violet-200 border border-violet-300 dark:border-violet-800 text-[10px] sm:text-[11px] font-bold"
                >
                  {def.nameBn}
                </span>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-end gap-2 sm:gap-2.5 pt-0.5 sm:pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 sm:px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold text-center cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!isReady}
            onClick={() => onConfirm(allSelected, 'bn')}
            className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold shadow-md shadow-violet-600/20 cursor-pointer"
          >
            <span className="truncate">
              {isReady
                ? 'Start Exam'
                : `Pick ${remainingToPick} More`}
            </span>
            {isReady && <ArrowRight className="w-4 h-4 shrink-0" />}
          </button>
        </div>
      </div>
    </div>
  );
};
