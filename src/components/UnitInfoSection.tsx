import React, { useEffect, useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  GraduationCap,
  Info,
  Layers,
  ShieldAlert,
  Users,
  X
} from 'lucide-react';

type UnitInfoSectionProps = {
  institutionId: string;
  selectedUnit: string;
  onSelectUnit: (unit: string) => void;
};

export const UnitInfoSection: React.FC<UnitInfoSectionProps> = ({
  institutionId,
  selectedUnit,
  onSelectUnit
}) => {
  // Tracks which unit's details panel is currently expanded (null = hidden by default)
  const [openDetailsUnit, setOpenDetailsUnit] = useState<string | null>(null);

  // Reset open details when switching institutions
  useEffect(() => {
    setOpenDetailsUnit(null);
  }, [institutionId]);

  if (institutionId !== 'JU' && institutionId !== 'KhU') {
    return null;
  }

  const toggleDetails = (unit: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDetailsUnit((prev) => (prev === unit ? null : unit));
  };

  if (institutionId === 'JU') {
    const activeUnit = selectedUnit === 'D' ? 'D' : 'A';

    return (
      <div className="mb-5 sm:mb-6 space-y-3">
        {/* 1. JU Unit A / Unit D Filter Bar */}
        <div className="p-3 sm:p-4 rounded-2xl bg-purple-50/90 dark:bg-[#160D29] border-2 border-purple-200 dark:border-purple-800/70 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-purple-600 text-white text-xs font-black uppercase tracking-wider">
                JU
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  জাহাঙ্গীরনগর বিশ্ববিদ্যালয় — ইউনিট নির্বাচন করুন
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300">
                  ইউনিট সিলেক্ট করে প্রশ্ন দেখুন এবং মানবণ্টন জানতে <span className="font-bold">Details</span> বাটনে ক্লিক করুন
                </p>
              </div>
            </div>
          </div>

          {/* 2-Tab Unit Switcher with per-unit Details toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Unit A Tab */}
            <div
              className={`p-1.5 sm:p-2 rounded-xl border-2 transition-all flex items-center justify-between gap-2 ${
                activeUnit === 'A'
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/25'
                  : 'bg-white dark:bg-[#0E091C] text-slate-800 dark:text-slate-200 border-purple-200 dark:border-purple-800/60 hover:border-purple-400'
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectUnit('A')}
                aria-pressed={activeUnit === 'A'}
                className="flex-1 min-w-0 px-2 py-1.5 rounded-lg text-left flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2
                  className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${
                    activeUnit === 'A' ? 'text-white' : 'text-purple-400 dark:text-purple-700'
                  }`}
                />
                <span className="text-xs sm:text-sm font-black truncate">
                  JU Unit A — (Science / Math & Physics)
                </span>
              </button>

              <button
                type="button"
                onClick={(e) => toggleDetails('A', e)}
                aria-expanded={openDetailsUnit === 'A'}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold border transition-colors shrink-0 cursor-pointer ${
                  openDetailsUnit === 'A'
                    ? activeUnit === 'A'
                      ? 'bg-white text-purple-700 border-white'
                      : 'bg-purple-600 text-white border-purple-600'
                    : activeUnit === 'A'
                    ? 'bg-purple-700/80 hover:bg-purple-800 text-white border-purple-400/50'
                    : 'bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                }`}
              >
                <Info className="w-3.5 h-3.5" />
                <span>Details</span>
                {openDetailsUnit === 'A' ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Unit D Tab */}
            <div
              className={`p-1.5 sm:p-2 rounded-xl border-2 transition-all flex items-center justify-between gap-2 ${
                activeUnit === 'D'
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/25'
                  : 'bg-white dark:bg-[#0E091C] text-slate-800 dark:text-slate-200 border-purple-200 dark:border-purple-800/60 hover:border-purple-400'
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectUnit('D')}
                aria-pressed={activeUnit === 'D'}
                className="flex-1 min-w-0 px-2 py-1.5 rounded-lg text-left flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2
                  className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${
                    activeUnit === 'D' ? 'text-white' : 'text-purple-400 dark:text-purple-700'
                  }`}
                />
                <span className="text-xs sm:text-sm font-black truncate">
                  JU Unit D — (Biological Sciences)
                </span>
              </button>

              <button
                type="button"
                onClick={(e) => toggleDetails('D', e)}
                aria-expanded={openDetailsUnit === 'D'}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold border transition-colors shrink-0 cursor-pointer ${
                  openDetailsUnit === 'D'
                    ? activeUnit === 'D'
                      ? 'bg-white text-purple-700 border-white'
                      : 'bg-purple-600 text-white border-purple-600'
                    : activeUnit === 'D'
                    ? 'bg-purple-700/80 hover:bg-purple-800 text-white border-purple-400/50'
                    : 'bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                }`}
              >
                <Info className="w-3.5 h-3.5" />
                <span>Details</span>
                {openDetailsUnit === 'D' ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 2. Collapsible JU Unit A Details Card (Shown only when Unit A Details is clicked) */}
        {openDetailsUnit === 'A' && (
          <div className="p-4 sm:p-5 rounded-2xl border-2 bg-purple-50/70 dark:bg-[#170E2C] border-purple-500 dark:border-purple-500 shadow-md space-y-3.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-purple-600 text-white text-[11px] font-black uppercase">
                  JU A Unit Details
                </span>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-1">
                  Unit A — (Science / Math & Physics)
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setOpenDetailsUnit(null)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-600 border border-slate-200 dark:border-slate-700 text-xs font-bold cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Close</span>
              </button>
            </div>

            {/* Key Exam Rules Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-[#0D0818] text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
                <Award className="w-3.5 h-3.5 shrink-0" />
                <span>Total Marks: 80 • Pass Mark: 36 (45%)</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-[#0D0818] text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>Exam Time: 55 Minutes</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-[#0D0818] text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>Negative Marking: –0.20 / wrong answer</span>
              </span>
            </div>

            {/* Faculty, Subjects & Seats Info */}
            <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 bg-white/90 dark:bg-[#0D1426] p-3 rounded-xl border border-purple-200/70 dark:border-purple-900/50">
              <div className="flex items-start gap-2">
                <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-slate-900 dark:text-white">Faculty / Focus: </span>
                  Faculty of Mathematical and Physical Sciences & Institute of Information Technology (IIT) (Pure & Applied Science / Tech)
                </div>
              </div>
              <div className="flex items-start gap-2">
                <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-slate-900 dark:text-white">Subjects (8): </span>
                  CSE, Mathematics, Physics, Chemistry, Statistics, Geological/Environmental Sciences, IIT
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 border-t border-slate-200/70 dark:border-slate-800">
                <span className="inline-flex items-center gap-1 font-bold text-purple-700 dark:text-purple-300">
                  <Users className="w-3.5 h-3.5" />
                  <span>Total Seats: 426 seats</span>
                </span>
                <span className="inline-flex items-center gap-1 font-bold text-indigo-700 dark:text-indigo-300">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Core Focus: Physics, Higher Math & Chemistry</span>
                </span>
              </div>
            </div>

            {/* A Unit Mark Distribution */}
            <div>
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-800 dark:text-slate-200 mb-2">
                <span>A Unit Mark Distribution</span>
                <span className="text-purple-700 dark:text-purple-300">
                  Total: 80 • Pass Mark: 36 (45%)
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { subject: 'Mathematics', marks: 22 },
                  { subject: 'Physics', marks: 22 },
                  { subject: 'Chemistry', marks: 22 },
                  { subject: 'ICT', marks: 8 },
                  { subject: 'Bangla', marks: 3 },
                  { subject: 'English', marks: 3 }
                ].map((item) => (
                  <div
                    key={item.subject}
                    className="px-2.5 py-2 rounded-xl bg-white dark:bg-[#0D1426] border border-purple-200/80 dark:border-purple-900/50 flex items-center justify-between gap-1.5"
                  >
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                      {item.subject}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 text-xs font-black tabular-nums shrink-0">
                      {item.marks}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. Collapsible JU Unit D Details Card (Shown only when Unit D Details is clicked) */}
        {openDetailsUnit === 'D' && (
          <div className="p-4 sm:p-5 rounded-2xl border-2 bg-purple-50/70 dark:bg-[#170E2C] border-purple-500 dark:border-purple-500 shadow-md space-y-3.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-purple-600 text-white text-[11px] font-black uppercase">
                  JU D Unit Details
                </span>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-1">
                  Unit D — (Biological Sciences)
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setOpenDetailsUnit(null)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-600 border border-slate-200 dark:border-slate-700 text-xs font-bold cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Close</span>
              </button>
            </div>

            {/* Key Exam Rules Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-[#0D0818] text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
                <Award className="w-3.5 h-3.5 shrink-0" />
                <span>Total Marks: 80 • Pass Mark: 36 (45%)</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-[#0D0818] text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>Exam Time: 55 Minutes</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-[#0D0818] text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>Negative Marking: –0.20 / wrong answer</span>
              </span>
            </div>

            {/* Faculty, Subjects & Seats Info */}
            <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 bg-white/90 dark:bg-[#0D1426] p-3 rounded-xl border border-purple-200/70 dark:border-purple-900/50">
              <div className="flex items-start gap-2">
                <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-slate-900 dark:text-white">Faculty / Focus: </span>
                  Faculty of Biological Sciences (Life Sciences)
                </div>
              </div>
              <div className="flex items-start gap-2">
                <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-slate-900 dark:text-white">Subjects (7): </span>
                  Botany, Zoology, Biochemistry & Molecular Biology, Microbiology, Biotechnology & Genetic Engineering, Public Health & Informatics, Pharmacy
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 border-t border-slate-200/70 dark:border-slate-800">
                <span className="inline-flex items-center gap-1 font-bold text-purple-700 dark:text-purple-300">
                  <Users className="w-3.5 h-3.5" />
                  <span>Total Seats: 310 (155 Male + 155 Female)</span>
                </span>
                <span className="inline-flex items-center gap-1 font-bold text-indigo-700 dark:text-indigo-300">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Core Focus: Botany, Zoology & Chemistry</span>
                </span>
              </div>
            </div>

            {/* D Unit Mark Distribution */}
            <div>
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-800 dark:text-slate-200 mb-2">
                <span>D Unit Mark Distribution</span>
                <span className="text-purple-700 dark:text-purple-300">
                  Total: 80 • Pass Mark: 36 (45%)
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { subject: 'Botany', marks: 22 },
                  { subject: 'Zoology', marks: 22 },
                  { subject: 'Chemistry', marks: 24 },
                  { subject: 'Bangla', marks: 4 },
                  { subject: 'English', marks: 4 },
                  { subject: 'IQ (Intelligence)', marks: 4 }
                ].map((item) => (
                  <div
                    key={item.subject}
                    className="px-2.5 py-2 rounded-xl bg-white dark:bg-[#0D1426] border border-purple-200/80 dark:border-purple-900/50 flex items-center justify-between gap-1.5"
                  >
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                      {item.subject}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 text-xs font-black tabular-nums shrink-0">
                      {item.marks}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Khulna University (KhU / KU)
  const activeUnit = selectedUnit === 'B' ? 'B' : 'A';

  return (
    <div className="mb-5 sm:mb-6 space-y-3">
      {/* 1. KU Unit A / Unit B Filter Bar */}
      <div className="p-3 sm:p-4 rounded-2xl bg-teal-50/90 dark:bg-[#071D1D] border-2 border-teal-200 dark:border-teal-800/70 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-teal-600 text-white text-xs font-black uppercase tracking-wider">
              KhU
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                খুলনা বিশ্ববিদ্যালয় — ইউনিট নির্বাচন করুন
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300">
                ইউনিট সিলেক্ট করে প্রশ্ন দেখুন এবং মানবণ্টন জানতে <span className="font-bold">Details</span> বাটনে ক্লিক করুন
              </p>
            </div>
          </div>
        </div>

        {/* 2-Tab Unit Switcher with per-unit Details toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Unit A Tab */}
          <div
            className={`p-1.5 sm:p-2 rounded-xl border-2 transition-all flex items-center justify-between gap-2 ${
              activeUnit === 'A'
                ? 'bg-teal-600 text-white border-teal-500 shadow-md shadow-teal-600/25'
                : 'bg-white dark:bg-[#071618] text-slate-800 dark:text-slate-200 border-teal-200 dark:border-teal-800/60 hover:border-teal-400'
            }`}
          >
            <button
              type="button"
              onClick={() => onSelectUnit('A')}
              aria-pressed={activeUnit === 'A'}
              className="flex-1 min-w-0 px-2 py-1.5 rounded-lg text-left flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2
                className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${
                  activeUnit === 'A' ? 'text-white' : 'text-teal-400 dark:text-teal-700'
                }`}
              />
              <span className="text-xs sm:text-sm font-black truncate">
                KU Unit A — (Science, Engineering and Technology)
              </span>
            </button>

            <button
              type="button"
              onClick={(e) => toggleDetails('A', e)}
              aria-expanded={openDetailsUnit === 'A'}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold border transition-colors shrink-0 cursor-pointer ${
                openDetailsUnit === 'A'
                  ? activeUnit === 'A'
                    ? 'bg-white text-teal-700 border-white'
                    : 'bg-teal-600 text-white border-teal-600'
                  : activeUnit === 'A'
                  ? 'bg-teal-700/80 hover:bg-teal-800 text-white border-teal-400/50'
                  : 'bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Details</span>
              {openDetailsUnit === 'A' ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Unit B Tab */}
          <div
            className={`p-1.5 sm:p-2 rounded-xl border-2 transition-all flex items-center justify-between gap-2 ${
              activeUnit === 'B'
                ? 'bg-teal-600 text-white border-teal-500 shadow-md shadow-teal-600/25'
                : 'bg-white dark:bg-[#071618] text-slate-800 dark:text-slate-200 border-teal-200 dark:border-teal-800/60 hover:border-teal-400'
            }`}
          >
            <button
              type="button"
              onClick={() => onSelectUnit('B')}
              aria-pressed={activeUnit === 'B'}
              className="flex-1 min-w-0 px-2 py-1.5 rounded-lg text-left flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2
                className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${
                  activeUnit === 'B' ? 'text-white' : 'text-teal-400 dark:text-teal-700'
                }`}
              />
              <span className="text-xs sm:text-sm font-black truncate">
                KU Unit B — (Biological Sciences)
              </span>
            </button>

            <button
              type="button"
              onClick={(e) => toggleDetails('B', e)}
              aria-expanded={openDetailsUnit === 'B'}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold border transition-colors shrink-0 cursor-pointer ${
                openDetailsUnit === 'B'
                  ? activeUnit === 'B'
                    ? 'bg-white text-teal-700 border-white'
                    : 'bg-teal-600 text-white border-teal-600'
                  : activeUnit === 'B'
                  ? 'bg-teal-700/80 hover:bg-teal-800 text-white border-teal-400/50'
                  : 'bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Details</span>
              {openDetailsUnit === 'B' ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Collapsible KU Unit A Details Card (Shown only when Unit A Details is clicked) */}
      {openDetailsUnit === 'A' && (
        <div className="p-4 sm:p-5 rounded-2xl border-2 bg-teal-50/70 dark:bg-[#082224] border-teal-500 dark:border-teal-500 shadow-md space-y-3.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-teal-600 text-white text-[11px] font-black uppercase">
                KU A Unit Details
              </span>
              <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-1">
                A Unit: School of Science, Engineering and Technology
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setOpenDetailsUnit(null)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-600 border border-slate-200 dark:border-slate-700 text-xs font-bold cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Close</span>
            </button>
          </div>

          {/* Key Exam Rules Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-[#051414] text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60">
              <Award className="w-3.5 h-3.5 shrink-0" />
              <span>Total Marks: 100 (MCQ 60 + Written 40)</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-[#051414] text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60">
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span>Per Question Mark: 1 mark</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-[#051414] text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>Negative Marking: –0.25 / wrong answer</span>
            </span>
          </div>

          {/* MCQ Breakdown */}
          <div>
            <div className="flex items-center justify-between text-xs font-extrabold text-slate-800 dark:text-slate-200 mb-2">
              <span>Subjects & Mark Distribution (MCQ — 60 Marks)</span>
              <span className="text-teal-700 dark:text-teal-300">1 Mark / Question • –0.25 Neg</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { subject: 'Physics (MCQ)', marks: '20' },
                { subject: 'Chemistry (MCQ)', marks: '20' },
                { subject: 'Math (MCQ)', marks: '20' }
              ].map((item) => (
                <div
                  key={item.subject}
                  className="px-2.5 py-2 rounded-xl bg-white dark:bg-[#0D1624] border border-teal-200/80 dark:border-teal-900/50 flex items-center justify-between gap-1"
                >
                  <span className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                    {item.subject}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 text-xs font-black tabular-nums shrink-0">
                    {item.marks}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
              * Note: Some curriculum updates or circulars include English/ICT variations depending on the exact year.
            </p>
          </div>

          {/* Written & Additional Note */}
          <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 bg-white/90 dark:bg-[#0D1624] p-3 rounded-xl border border-teal-200/70 dark:border-teal-900/50">
            <div className="flex items-start gap-2">
              <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  Written Exam (40 Marks):{' '}
                </span>
                5 questions × 8 marks = 40 marks covering subjects like English, Physics, Chemistry, Math, and ICT.
              </div>
            </div>
            <div className="flex items-start gap-2 pt-1.5 border-t border-slate-200/70 dark:border-slate-800">
              <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-amber-700 dark:text-amber-300">
                  Additional Note:{' '}
                </span>
                Architecture discipline under A Unit requires an additional 50-mark drawing test.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Collapsible KU Unit B Details Card (Shown only when Unit B Details is clicked) */}
      {openDetailsUnit === 'B' && (
        <div className="p-4 sm:p-5 rounded-2xl border-2 bg-teal-50/70 dark:bg-[#082224] border-teal-500 dark:border-teal-500 shadow-md space-y-3.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-teal-600 text-white text-[11px] font-black uppercase">
                KU B Unit Details
              </span>
              <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-1">
                B Unit: School of Biological Science
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setOpenDetailsUnit(null)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-600 border border-slate-200 dark:border-slate-700 text-xs font-bold cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Close</span>
            </button>
          </div>

          {/* Key Exam Rules Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-[#051414] text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60">
              <Award className="w-3.5 h-3.5 shrink-0" />
              <span>Total Marks: 100 (MCQ 60 + Written 40)</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-[#051414] text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60">
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span>Per Question Mark: 1 mark</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-[#051414] text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>Negative Marking: –0.25 / wrong answer</span>
            </span>
          </div>

          {/* MCQ Breakdown */}
          <div>
            <div className="flex items-center justify-between text-xs font-extrabold text-slate-800 dark:text-slate-200 mb-2">
              <span>Mark Distribution (MCQ — 60 Marks Total)</span>
              <span className="text-teal-700 dark:text-teal-300">1 Mark / Question • –0.25 Neg</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { subject: 'Biology', marks: '15' },
                { subject: 'Chemistry', marks: '12' },
                { subject: 'Math', marks: '12' },
                { subject: 'Physics', marks: '12' },
                { subject: 'English', marks: '9' }
              ].map((item) => (
                <div
                  key={item.subject}
                  className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#0D1624] border border-teal-200/80 dark:border-teal-900/50 flex items-center justify-between gap-1.5"
                >
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                    {item.subject}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 text-xs font-black tabular-nums shrink-0">
                    {item.marks}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Written Breakdown */}
          <div className="bg-white/90 dark:bg-[#0D1624] p-3 rounded-xl border border-teal-200/70 dark:border-teal-900/50 space-y-2">
            <div className="flex items-center justify-between text-xs font-extrabold text-slate-900 dark:text-white">
              <span>Mark Distribution (Written — 40 Marks Total)</span>
              <span className="text-[11px] font-bold text-teal-700 dark:text-teal-300">
                Typically 2-mark questions
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[11px]">
              {[
                { subject: 'Biology', detail: '10 (5×2)' },
                { subject: 'Chemistry', detail: '8 (4×2)' },
                { subject: 'Math', detail: '8 (4×2)' },
                { subject: 'Physics', detail: '8 (4×2)' },
                { subject: 'English', detail: '6 marks' }
              ].map((item) => (
                <div
                  key={item.subject}
                  className="px-2 py-1 rounded-lg bg-slate-50 dark:bg-[#08101C] border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-1"
                >
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {item.subject}
                  </span>
                  <span className="font-extrabold text-teal-700 dark:text-teal-300 tabular-nums">
                    {item.detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
