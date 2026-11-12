import React, { useEffect, useMemo, useState } from 'react';
import {
  Atom,
  FlaskConical,
  Cpu,
  Sigma,
  Dna,
  Layers,
  Check,
  X,
  ArrowRight,
  Award,
  ShieldCheck
} from 'lucide-react';
import { toBnDigits } from '../data/translations';
import type { Question, RuBranchOption, Session } from '../types';
import { loadSessionQuestions } from '../utils/questionLoader';

type RuExamModalProps = {
  session: Session | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedBranch: RuBranchOption | null) => void;
};

type BranchCardDef = {
  id: RuBranchOption;
  titleBn: string;
  subtitleBn: string;
  defaultCount: number;
  icon: React.ReactNode;
};

const RU_BRANCH_OPTIONS: BranchCardDef[] = [
  {
    id: 'Math',
    titleBn: 'উচ্চতর গণিত',
    subtitleBn: 'Mathematics Branch',
    defaultCount: 25,
    icon: <Sigma className="w-5 h-5" />
  },
  {
    id: 'Biology',
    titleBn: 'জীববিজ্ঞান',
    subtitleBn: 'Biology Branch',
    defaultCount: 25,
    icon: <Dna className="w-5 h-5" />
  },
  {
    id: 'Math+Biology',
    titleBn: 'জীববিদ্যা + গণিত',
    subtitleBn: 'Combined Math + Biology',
    defaultCount: 25,
    icon: <Layers className="w-5 h-5" />
  }
];

export const RuExamModal: React.FC<RuExamModalProps> = ({
  session,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [selectedBranch, setSelectedBranch] = useState<RuBranchOption | null>(null);
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  useEffect(() => {
    if (isOpen && session) {
      setSelectedBranch(null);
      setLoadingQuestions(true);
      loadSessionQuestions(session.id).then((qs) => {
        setSessionQuestions(qs);
        setLoadingQuestions(false);
      });
    } else {
      setSessionQuestions([]);
      setSelectedBranch(null);
    }
  }, [isOpen, session]);

  // Analyze whether this RU session has explicit Section A & Section B branches
  const paperAnalysis = useMemo(() => {
    const sectionAQuestions = sessionQuestions.filter((q) => q.ruSection === 'A');
    const sectionBQuestions = sessionQuestions.filter((q) => q.ruSection === 'B');

    const branchCounts: Record<RuBranchOption, number> = {
      Math: 0,
      Biology: 0,
      'Math+Biology': 0
    };

    for (const q of sectionBQuestions) {
      if (q.ruBranch && branchCounts[q.ruBranch] !== undefined) {
        branchCounts[q.ruBranch]++;
      }
    }

    const availableBranches = (Object.keys(branchCounts) as RuBranchOption[]).filter(
      (b) => branchCounts[b] > 0
    );

    const hasBranches = availableBranches.length > 0;

    return {
      sectionACount: sectionAQuestions.length,
      sectionBCount: sectionBQuestions.length,
      branchCounts,
      availableBranches,
      hasBranches,
      totalLoaded: sessionQuestions.length
    };
  }, [sessionQuestions]);

  if (!isOpen || !session) return null;

  const isReady = paperAnalysis.hasBranches ? selectedBranch !== null : !loadingQuestions;

  const activeQuestionCount = (() => {
    if (paperAnalysis.hasBranches) {
      if (selectedBranch) {
        return paperAnalysis.sectionACount + (paperAnalysis.branchCounts[selectedBranch] || 25);
      }
      return (paperAnalysis.sectionACount || 55) + 25;
    }
    return paperAnalysis.totalLoaded || session.totalQuestions;
  })();

  const activeTotalMarks = paperAnalysis.hasBranches ? activeQuestionCount : session.totalMarks;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0B1325] border-2 border-amber-300 dark:border-amber-800 shadow-2xl p-3.5 sm:p-6 space-y-3.5 sm:space-y-5 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2.5 border-b border-slate-200 dark:border-indigo-900/60 pb-2.5 sm:pb-3.5">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-extrabold text-amber-600 dark:text-amber-400 mb-0.5">
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="truncate">রাজশাহী বিশ্ববিদ্যালয় (RU)</span>
            </div>
            <h2 className="text-base sm:text-2xl font-black text-slate-900 dark:text-white leading-snug truncate">
              {session.title} Exam
            </h2>
            <p className="text-[11px] sm:text-sm font-semibold text-amber-700 dark:text-amber-300 mt-0.5">
              Section A (Compulsory) + Section B (Optional) · {session.questionType}
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

        {/* Section A: Compulsory Subjects */}
        <div className="space-y-1.5 sm:space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <span className="text-[11px] sm:text-xs font-extrabold text-slate-800 dark:text-slate-200">
              Section A: Compulsory (ক-শাখা: আবশ্যিক)
            </span>
            <span className="text-[10px] sm:text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300">
              Min Pass: ২৫ Marks
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div className="flex items-center justify-between p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/35 border-2 border-emerald-400/80 dark:border-emerald-700/70">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Atom className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                    পদার্থবিজ্ঞান
                  </div>
                  <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 tabular-nums">
                    ২৫টি প্রশ্ন
                  </div>
                </div>
              </div>
              <div className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </div>
            </div>

            <div className="flex items-center justify-between p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/35 border-2 border-emerald-400/80 dark:border-emerald-700/70">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <FlaskConical className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                    রসায়ন
                  </div>
                  <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 tabular-nums">
                    ২৫টি প্রশ্ন
                  </div>
                </div>
              </div>
              <div className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 flex items-center justify-between p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/35 border-2 border-emerald-400/80 dark:border-emerald-700/70">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                    আইসিটি (ICT)
                  </div>
                  <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 tabular-nums">
                    ৫ / ৬টি প্রশ্ন
                  </div>
                </div>
              </div>
              <div className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Section B: Optional / Branch Subjects */}
        <div className="space-y-1.5 sm:space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <span className="text-[11px] sm:text-xs font-extrabold text-slate-800 dark:text-slate-200">
              Section B: Optional (খ-শাখা: যেকোনো ১টি নিন)
            </span>
            <span className="text-[10px] sm:text-[11px] font-extrabold text-amber-700 dark:text-amber-300">
              Min Pass: ১০ Marks
            </span>
          </div>

          {paperAnalysis.hasBranches ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {RU_BRANCH_OPTIONS.map((branch, idx) => {
                const countInPaper = paperAnalysis.branchCounts[branch.id];
                const isAvailable = countInPaper > 0;
                const isSelected = selectedBranch === branch.id;
                const spanClass = idx === 2 ? 'col-span-2 sm:col-span-1' : '';

                return (
                  <button
                    key={branch.id}
                    type="button"
                    disabled={!isAvailable}
                    onClick={() => setSelectedBranch(branch.id)}
                    className={`${spanClass} flex items-center justify-between p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border-2 text-left transition-all ${
                      isSelected
                        ? 'bg-amber-50/90 dark:bg-amber-950/45 border-amber-500 dark:border-amber-400 shadow-sm cursor-pointer'
                        : !isAvailable
                          ? 'bg-slate-50 dark:bg-[#070C18] border-slate-200 dark:border-slate-800 opacity-45 cursor-not-allowed'
                          : 'bg-white dark:bg-[#070C18] border-slate-200 dark:border-indigo-900/60 hover:border-amber-400 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-amber-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {branch.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                          {branch.titleBn}
                        </div>
                        <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tabular-nums">
                          {isAvailable
                            ? `${toBnDigits(countInPaper, true)}টি প্রশ্ন`
                            : 'এই সেশনে নেই'}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`w-4.5 h-4.5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-amber-600 border-amber-600 text-white'
                          : 'border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-amber-50/60 dark:bg-amber-950/25 border border-amber-200 dark:border-amber-900/60 flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                <div className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-200">
                  এই সেশনের প্রশ্নপত্রে সকল বিষয় একত্রে সংযুক্ত রয়েছে (মোট{' '}
                  {toBnDigits(activeQuestionCount, true)}টি প্রশ্ন)। সরাসরি পরীক্ষা শুরু করতে পারবেন।
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RU Circular Passing Rules & Exam Summary */}
        <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-[#070C18] border border-slate-200 dark:border-indigo-900/60 space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] sm:text-xs font-extrabold text-slate-700 dark:text-slate-300">
              Passing Rules & Summary
            </span>
            <span className="text-[11px] sm:text-xs font-black text-amber-600 dark:text-amber-400 tabular-nums">
              Total Pass: ≥ ৪০ Marks
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            <div className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-[#0B1325] border border-slate-200 dark:border-indigo-900/50 text-center">
              <div className="text-xs sm:text-base font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                ≥ ২৫
              </div>
              <div className="text-[9px] sm:text-[10px] font-bold text-slate-500 dark:text-slate-400">
                Sec A Pass
              </div>
            </div>
            <div className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-[#0B1325] border border-slate-200 dark:border-indigo-900/50 text-center">
              <div className="text-xs sm:text-base font-black text-amber-600 dark:text-amber-400 tabular-nums">
                ≥ ১০
              </div>
              <div className="text-[9px] sm:text-[10px] font-bold text-slate-500 dark:text-slate-400">
                Sec B Pass
              </div>
            </div>
            <div className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-[#0B1325] border border-slate-200 dark:border-indigo-900/50 text-center">
              <div className="text-xs sm:text-base font-black text-purple-600 dark:text-purple-400 tabular-nums">
                ≥ ৪০
              </div>
              <div className="text-[9px] sm:text-[10px] font-bold text-slate-500 dark:text-slate-400">
                Total Pass
              </div>
            </div>
            <div className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-[#0B1325] border border-slate-200 dark:border-indigo-900/50 text-center">
              <div className="text-xs sm:text-base font-black text-indigo-600 dark:text-sky-400 tabular-nums">
                {toBnDigits(activeQuestionCount, true)}/{toBnDigits(activeTotalMarks, true)}
              </div>
              <div className="text-[9px] sm:text-[10px] font-bold text-slate-500 dark:text-slate-400">
                Q / Marks
              </div>
            </div>
          </div>

          <div className="text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-400 leading-relaxed">
            • Section A: পদার্থ (২৫) + রসায়ন (২৫) + ICT (৫/৬) [পাস ≥ ২৫] · Section B: গণিত / জীববিজ্ঞান / জীববিদ্যা+গণিত (২৫) [পাস ≥ ১০] · মোট পাস নম্বর: ৪০
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
            onClick={() => onConfirm(selectedBranch)}
            className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold shadow-md shadow-amber-600/20 cursor-pointer"
          >
            <span className="truncate">
              {isReady
                ? 'Start Exam'
                : 'Pick Section B'}
            </span>
            {isReady && <ArrowRight className="w-4 h-4 shrink-0" />}
          </button>
        </div>
      </div>
    </div>
  );
};
