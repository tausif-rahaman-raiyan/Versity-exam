import React, { useState, useEffect } from 'react';
import { ExamSession, DU_MCQ_6_SUBJECTS } from '../data/questionBank';
import { getSubjectCardStyle } from '../utils/subjectColors';
import { ExamLanguage, toBengaliNumber } from '../utils/examTranslator';
import { CheckCircle2, Sparkles, X, BookOpen, Play, Globe } from 'lucide-react';

interface SubjectSelectionModalProps {
  isOpen: boolean;
  session: ExamSession | null;
  initialSubjects?: string[];
  initialLanguage?: ExamLanguage;
  onClose: () => void;
  onConfirmStartExam: (
    session: ExamSession,
    selectedSubjects: string[],
    language: ExamLanguage
  ) => void;
}

const PRESET_COMBOS: { labelBn: string; labelEn: string; subjects: string[] }[] = [
  {
    labelBn: 'পদার্থ + রসায়ন + গণিত + জীববিজ্ঞান',
    labelEn: 'Phy + Chem + Math + Bio',
    subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
  },
  {
    labelBn: 'পদার্থ + রসায়ন + গণিত + ইংরেজি',
    labelEn: 'Phy + Chem + Math + Eng',
    subjects: ['Physics', 'Chemistry', 'Mathematics', 'English'],
  },
  {
    labelBn: 'পদার্থ + রসায়ন + জীববিজ্ঞান + ইংরেজি',
    labelEn: 'Phy + Chem + Bio + Eng',
    subjects: ['Physics', 'Chemistry', 'Biology', 'English'],
  },
  {
    labelBn: 'পদার্থ + রসায়ন + জীববিজ্ঞান + বাংলা',
    labelEn: 'Phy + Chem + Bio + Bangla',
    subjects: ['Physics', 'Chemistry', 'Biology', 'Bangla'],
  },
];

const SUBJECT_NAMES: Record<string, { bn: string; en: string }> = {
  Bangla: { bn: 'বাংলা', en: 'Bangla (বাংলা)' },
  Biology: { bn: 'জীববিজ্ঞান (Biology)', en: 'Biology' },
  Chemistry: { bn: 'রসায়ন (Chemistry)', en: 'Chemistry' },
  English: { bn: 'ইংরেজি (English)', en: 'English' },
  Mathematics: { bn: 'গণিত (Mathematics)', en: 'Mathematics' },
  Physics: { bn: 'পদার্থবিজ্ঞান (Physics)', en: 'Physics' },
};

export const SubjectSelectionModal: React.FC<SubjectSelectionModalProps> = ({
  isOpen,
  session,
  initialSubjects,
  initialLanguage = 'bn',
  onClose,
  onConfirmStartExam,
}) => {
  const [selected, setSelected] = useState<string[]>(
    initialSubjects && initialSubjects.length === 4
      ? initialSubjects
      : ['Physics', 'Chemistry', 'Mathematics', 'Biology']
  );
  const [examLang, setExamLang] = useState<ExamLanguage>(initialLanguage);

  useEffect(() => {
    if (isOpen) {
      if (initialSubjects && initialSubjects.length === 4) {
        setSelected(initialSubjects);
      } else {
        setSelected(['Physics', 'Chemistry', 'Mathematics', 'Biology']);
      }
      if (initialLanguage) {
        setExamLang(initialLanguage);
      }
    }
  }, [isOpen, session?.id, initialSubjects, initialLanguage]);

  if (!isOpen || !session) return null;

  const toggleSubject = (subjectId: string) => {
    setSelected((prev) => {
      if (prev.includes(subjectId)) {
        return prev.filter((id) => id !== subjectId);
      }
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, subjectId];
    });
  };

  const isReady = selected.length === 4;
  const totalSelectedMcqs = selected.length * 15;
  const isBn = examLang === 'bn';

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#0B1222] border-2 border-indigo-300 dark:border-indigo-800/80 rounded-3xl p-5 sm:p-7 max-w-xl w-full shadow-2xl space-y-4 sm:space-y-5 text-slate-900 dark:text-slate-100 my-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600/10 dark:bg-indigo-500/15 border border-indigo-500/30 text-indigo-700 dark:text-sky-300 text-[11px] font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> {session.title} •{' '}
              {isBn ? 'বিষয় ও ভাষা নির্বাচন (৪/৬)' : 'Subject & Language (4/6)'}
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white leading-snug pt-1">
              {isBn
                ? 'যেকোনো ৪টি বিষয় নির্বাচন করুন (Select 4/6 Subjects)'
                : 'Select Any 4 Out of 6 Subjects (60 MCQs)'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {isBn ? (
                <>
                  ৯০টি MCQ (৬টি বিষয় × ১৫টি প্রশ্ন) থেকে পরীক্ষার জন্য আপনার পছন্দমতো{' '}
                  <strong className="text-indigo-600 dark:text-sky-400">
                    ৪টি বিষয় (মোট ৬০টি MCQ)
                  </strong>{' '}
                  এবং পরীক্ষার ভাষা নির্বাচন করুন।
                </>
              ) : (
                <>
                  Choose your preferred{' '}
                  <strong className="text-indigo-600 dark:text-sky-400">
                    4 subjects (60 MCQs total)
                  </strong>{' '}
                  out of 90 MCQs (6 subjects × 15 questions) and select your exam language below.
                </>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Exam Language Selector (Bengali vs English) */}
        <div className="bg-indigo-50/70 dark:bg-[#091326] border border-indigo-200 dark:border-indigo-900/70 rounded-2xl p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-slate-950 dark:text-white block">
                {isBn ? 'পরীক্ষার ভাষা (Exam Language)' : 'Exam Language (প্রশ্ন ও অপশনের ভাষা)'}
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400 block">
                {isBn
                  ? 'বাংলা ভার্সন (ক, খ, গ, ঘ) নাকি English Version (A, B, C, D)'
                  : 'Show all questions, options & labels in Bengali or English'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 bg-white dark:bg-[#060B16] p-1 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0">
            <button
              type="button"
              onClick={() => setExamLang('bn')}
              className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                examLang === 'bn'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <span>বাংলা (Bengali)</span>
            </button>
            <button
              type="button"
              onClick={() => setExamLang('en')}
              className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                examLang === 'en'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <span>English</span>
            </button>
          </div>
        </div>

        {/* Live Selection Status Bar */}
        <div className="bg-slate-100 dark:bg-[#070D1B] border border-slate-200 dark:border-indigo-950 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span
              className={`px-3 py-1 rounded-xl text-xs font-black font-mono ${
                isReady
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-amber-500 text-white shadow-sm'
              }`}
            >
              {isBn
                ? `${toBengaliNumber(selected.length)} / ৬ টি বিষয় (৪টি প্রয়োজন)`
                : `${selected.length} / 6 Subjects (Need 4)`}
            </span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              {isBn ? 'মোট প্রশ্ন:' : 'Total Questions:'}{' '}
              <strong className="text-indigo-600 dark:text-sky-400 font-mono">
                {isBn
                  ? `${toBengaliNumber(totalSelectedMcqs)} / ৬০ MCQ`
                  : `${totalSelectedMcqs} / 60 MCQ`}
              </strong>
            </span>
          </div>

          <button
            type="button"
            onClick={() => setSelected([])}
            className="text-[11px] font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white underline cursor-pointer"
          >
            {isBn ? 'রিসেট করুন (Clear)' : 'Reset (Clear)'}
          </button>
        </div>

        {/* Quick Preset Combinations */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
            {isBn
              ? 'দ্রুত নির্বাচন (Quick 4-Subject Combos):'
              : 'Quick 4-Subject Combinations:'}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_COMBOS.map((combo) => {
              const isComboActive =
                selected.length === 4 &&
                combo.subjects.every((sub) => selected.includes(sub));
              return (
                <button
                  key={combo.labelEn}
                  type="button"
                  onClick={() => setSelected(combo.subjects)}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
                    isComboActive
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 dark:bg-[#0F172B] dark:hover:bg-[#16223D] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800'
                  }`}
                >
                  {isBn ? combo.labelBn : combo.labelEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* 6 Subject Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {DU_MCQ_6_SUBJECTS.map((sub) => {
            const isSelected = selected.includes(sub.id);
            const isDisabled = !isSelected && selected.length >= 4;
            const style = getSubjectCardStyle(sub.id);
            const displayTitle = isBn
              ? SUBJECT_NAMES[sub.id]?.bn || sub.label
              : SUBJECT_NAMES[sub.id]?.en || sub.id;

            return (
              <button
                key={sub.id}
                type="button"
                disabled={isDisabled}
                onClick={() => toggleSubject(sub.id)}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? `${style.bgClass} border-indigo-600 dark:border-sky-400 ring-2 ring-indigo-500/30 shadow-md`
                    : isDisabled
                    ? 'bg-slate-100/60 dark:bg-[#080D18] border-slate-200 dark:border-slate-800/60 opacity-45 cursor-not-allowed'
                    : 'bg-white hover:bg-slate-50 dark:bg-[#0D162B] dark:hover:bg-[#13203D] border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                      isSelected
                        ? style.badgeBg
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-extrabold text-slate-950 dark:text-white block truncate">
                      {displayTitle}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                      {isBn
                        ? `${toBengaliNumber(sub.questionsCount)}টি MCQ • ${toBengaliNumber(sub.questionsCount)} মার্কস`
                        : `${sub.questionsCount} MCQs • ${sub.questionsCount} Marks`}
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  {isSelected ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 dark:bg-sky-500 text-white dark:text-slate-950 text-[11px] font-black shadow-2xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />{' '}
                      {isBn ? 'নির্বাচিত' : 'Selected'}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-semibold">
                      {isDisabled
                        ? isBn
                          ? 'সর্বোচ্চ ৪টি'
                          : 'Max 4'
                        : isBn
                        ? 'নির্বাচন'
                        : 'Select'}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
          >
            {isBn ? 'বাতিল করুন (Cancel)' : 'Cancel'}
          </button>

          <button
            type="button"
            disabled={!isReady}
            onClick={() => {
              if (isReady) {
                onConfirmStartExam(session, selected, examLang);
              }
            }}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-xs shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>
              {isReady
                ? isBn
                  ? `পরীক্ষা শুরু করুন (${toBengaliNumber(selected.length)}/৬ বিষয় • ৬০টি MCQ • বাংলা)`
                  : `Start Exam (${selected.length}/6 Subjects • 60 MCQs • English)`
                : isBn
                ? `আরও ${toBengaliNumber(4 - selected.length)}টি বিষয় নির্বাচন করুন (${toBengaliNumber(selected.length)}/৪)`
                : `Select ${4 - selected.length} more subject(s) (${selected.length}/4)`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
