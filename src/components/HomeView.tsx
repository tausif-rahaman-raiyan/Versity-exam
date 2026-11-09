import React, { useState } from 'react';
import { EXAM_SESSIONS, ExamSession } from '../data/questionBank';
import { Search, Clock, Key, GraduationCap, Eye, Sparkles } from 'lucide-react';

interface HomeViewProps {
  onSelectExam: (session: ExamSession, mode: 'exam' | 'qb') => void;
  setCurrentView: (view: 'home' | 'questionBank' | 'exam' | 'analytics') => void;
  onOpenApiKeyModal: () => void;
}

const SESSION_CARD_PALETTES = [
  {
    // 1. Vibrant Sapphire Blue
    cardBg:
      'bg-gradient-to-br from-blue-100/90 via-blue-50/60 to-white dark:from-[#0C1E3E] dark:via-[#09152B] dark:to-[#060D1B]',
    border:
      'border-2 border-blue-300 dark:border-blue-500/50 hover:border-blue-500 dark:hover:border-blue-400 shadow-md shadow-blue-500/10',
    badge: 'bg-blue-600 text-white shadow-xs',
    metricBox: 'bg-blue-50/90 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50',
    accentText: 'text-blue-700 dark:text-blue-300',
    startBtn: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20',
    seeBtn:
      'bg-white hover:bg-blue-50 dark:bg-[#0D1A33] dark:hover:bg-[#13264A] text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700/60',
  },
  {
    // 2. Royal Purple
    cardBg:
      'bg-gradient-to-br from-purple-100/90 via-purple-50/60 to-white dark:from-[#21103B] dark:via-[#160B28] dark:to-[#0B0616]',
    border:
      'border-2 border-purple-300 dark:border-purple-500/50 hover:border-purple-500 dark:hover:border-purple-400 shadow-md shadow-purple-500/10',
    badge: 'bg-purple-600 text-white shadow-xs',
    metricBox: 'bg-purple-50/90 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50',
    accentText: 'text-purple-700 dark:text-purple-300',
    startBtn: 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/20',
    seeBtn:
      'bg-white hover:bg-purple-50 dark:bg-[#1C1032] dark:hover:bg-[#271646] text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700/60',
  },
  {
    // 3. Golden Amber
    cardBg:
      'bg-gradient-to-br from-amber-100/90 via-amber-50/60 to-white dark:from-[#2C1B08] dark:via-[#1D1206] dark:to-[#0F0A04]',
    border:
      'border-2 border-amber-300 dark:border-amber-500/50 hover:border-amber-500 dark:hover:border-amber-400 shadow-md shadow-amber-500/10',
    badge: 'bg-amber-600 text-white shadow-xs',
    metricBox: 'bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50',
    accentText: 'text-amber-800 dark:text-amber-300',
    startBtn: 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20',
    seeBtn:
      'bg-white hover:bg-amber-50 dark:bg-[#261808] dark:hover:bg-[#35210B] text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60',
  },
  {
    // 4. Fuchsia Pink
    cardBg:
      'bg-gradient-to-br from-fuchsia-100/90 via-fuchsia-50/60 to-white dark:from-[#2D0E33] dark:via-[#1E0A22] dark:to-[#100514]',
    border:
      'border-2 border-fuchsia-300 dark:border-fuchsia-500/50 hover:border-fuchsia-500 dark:hover:border-fuchsia-400 shadow-md shadow-fuchsia-500/10',
    badge: 'bg-fuchsia-600 text-white shadow-xs',
    metricBox: 'bg-fuchsia-50/90 dark:bg-fuchsia-950/40 border border-fuchsia-200 dark:border-fuchsia-800/50',
    accentText: 'text-fuchsia-700 dark:text-fuchsia-300',
    startBtn: 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-fuchsia-600/20',
    seeBtn:
      'bg-white hover:bg-fuchsia-50 dark:bg-[#270D2C] dark:hover:bg-[#37123E] text-fuchsia-700 dark:text-fuchsia-300 border border-fuchsia-300 dark:border-fuchsia-700/60',
  },
  {
    // 5. Electric Cyan
    cardBg:
      'bg-gradient-to-br from-cyan-100/90 via-cyan-50/60 to-white dark:from-[#082635] dark:via-[#061A24] dark:to-[#040E15]',
    border:
      'border-2 border-cyan-300 dark:border-cyan-500/50 hover:border-cyan-500 dark:hover:border-cyan-400 shadow-md shadow-cyan-500/10',
    badge: 'bg-cyan-600 text-white shadow-xs',
    metricBox: 'bg-cyan-50/90 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/50',
    accentText: 'text-cyan-800 dark:text-cyan-300',
    startBtn: 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/20',
    seeBtn:
      'bg-white hover:bg-cyan-50 dark:bg-[#092230] dark:hover:bg-[#0D3044] text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-700/60',
  },
  {
    // 6. Deep Indigo Violet
    cardBg:
      'bg-gradient-to-br from-indigo-100/90 via-indigo-50/60 to-white dark:from-[#151842] dark:via-[#0E112E] dark:to-[#07091B]',
    border:
      'border-2 border-indigo-300 dark:border-indigo-500/50 hover:border-indigo-500 dark:hover:border-indigo-400 shadow-md shadow-indigo-500/10',
    badge: 'bg-indigo-600 text-white shadow-xs',
    metricBox: 'bg-indigo-50/90 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50',
    accentText: 'text-indigo-700 dark:text-indigo-300',
    startBtn: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20',
    seeBtn:
      'bg-white hover:bg-indigo-50 dark:bg-[#12163A] dark:hover:bg-[#1A2052] text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700/60',
  },
];

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectExam,
  setCurrentView,
  onOpenApiKeyModal,
}) => {
  const [selectedUni, setSelectedUni] = useState<string>('DU');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<'ALL' | 'MCQ' | 'Written'>('ALL');

  const universities = [
    {
      id: 'DU',
      name: 'ঢাকা বিশ্ববিদ্যালয় (DU)',
      code: 'DU',
      desc: 'A Unit Science • 25+ Sessions',
      color: 'border-blue-400 dark:border-blue-500/50 bg-blue-50/80 dark:bg-[#0D1A33]',
    },
    {
      id: 'RU',
      name: 'রাজশাহী বিশ্ববিদ্যালয় (RU)',
      code: 'RU',
      desc: 'C Unit Science • Last 10 Years',
      color: 'border-amber-400 dark:border-amber-500/50 bg-amber-50/80 dark:bg-[#241608]',
    },
    {
      id: 'JU',
      name: 'জাহাঙ্গীরনগর (JU)',
      code: 'JU',
      desc: 'A Unit Math & Phys • Last 10 Years',
      color: 'border-purple-400 dark:border-purple-500/50 bg-purple-50/80 dark:bg-[#1B0E30]',
    },
    {
      id: 'CU',
      name: 'চট্টগ্রাম বিশ্ববিদ্যালয় (CU)',
      code: 'CU',
      desc: 'A Unit Science • Last 10 Years',
      color: 'border-cyan-400 dark:border-cyan-500/50 bg-cyan-50/80 dark:bg-[#08202E]',
    },
    {
      id: 'GST',
      name: 'জিএসটি গুচ্ছ (GST)',
      code: 'GST',
      desc: 'Cluster 24 Universities • 10 Years',
      color: 'border-fuchsia-400 dark:border-fuchsia-500/50 bg-fuchsia-50/80 dark:bg-[#250C2A]',
    },
    {
      id: 'ALL',
      name: 'সকল বিশ্ববিদ্যালয় (All)',
      code: 'ALL',
      desc: 'All Universities Combined',
      color: 'border-indigo-400 dark:border-indigo-500/50 bg-indigo-50/80 dark:bg-[#121538]',
    },
  ];

  const filteredSessions = EXAM_SESSIONS.filter((session) => {
    const matchesUni = selectedUni === 'ALL' || session.university === selectedUni;
    const matchesSearch =
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.session.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'ALL' || session.questionType === selectedType;
    return matchesUni && matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 sm:space-y-10 pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-100/80 via-white to-sky-100/70 dark:from-[#0B132B] dark:via-[#080D1A] dark:to-[#040711] text-slate-900 dark:text-white py-8 sm:py-12 px-4 sm:px-8 rounded-3xl shadow-xl border border-indigo-200 dark:border-indigo-900/40">
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4 sm:space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-600/10 dark:bg-indigo-500/10 border border-indigo-500/30 text-indigo-700 dark:text-sky-300 text-[11px] sm:text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-sky-400" /> DU, RU, JU, CU, GST • 10-Year Question Bank & Real Exam
          </div>

          <h1 className="text-2xl sm:text-5xl font-black tracking-tight text-slate-950 dark:text-white leading-tight">
            Varsity Science Admission <br />
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 dark:from-sky-400 dark:via-indigo-300 dark:to-sky-200 bg-clip-text text-transparent">
              All 5 Universities (Last 10+ Years)
            </span>
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
            Full individual question papers for each university. Experience genuine admission pressure with{' '}
            <span className="text-indigo-700 dark:text-sky-300 font-bold">All Questions in One Page</span> and{' '}
            <span className="text-amber-600 dark:text-amber-300 font-bold">Instant Auto-Lock</span>.
          </p>

          {/* Quick Search & Actions */}
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="সেশন খুঁজুন (যেমন: 25-26, 22-23, 20-21, 19-20, DU MCQ)..."
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#0B1426] border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 text-xs shadow-inner"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('exam')}
                className="flex-1 sm:flex-initial px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 text-xs shrink-0"
              >
                <Clock className="w-4 h-4" /> Start Strict Exam
              </button>
              <button
                onClick={onOpenApiKeyModal}
                className="px-4 py-3 bg-slate-100 dark:bg-[#0E172A] hover:bg-slate-200 dark:hover:bg-[#1E293B] border border-slate-300 dark:border-indigo-900/60 text-indigo-700 dark:text-sky-300 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shrink-0"
              >
                <Key className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> AI Key
              </button>
            </div>
          </div>

          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-4 text-left max-w-3xl mx-auto border-t border-slate-200 dark:border-slate-800/80">
            <div className="p-3 bg-blue-50/90 dark:bg-[#0C1933] rounded-xl border border-blue-200 dark:border-blue-800/60 shadow-2xs">
              <span className="block text-base sm:text-xl font-black text-blue-600 dark:text-sky-400">5 Universities</span>
              <span className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300">DU, RU, JU, CU, GST</span>
            </div>
            <div className="p-3 bg-amber-50/90 dark:bg-[#231608] rounded-xl border border-amber-200 dark:border-amber-800/60 shadow-2xs">
              <span className="block text-base sm:text-xl font-black text-amber-600 dark:text-amber-400">Auto-Lock</span>
              <span className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300">Click once to lock</span>
            </div>
            <div className="p-3 bg-purple-50/90 dark:bg-[#1B0F2E] rounded-xl border border-purple-200 dark:border-purple-800/60 shadow-2xs">
              <span className="block text-base sm:text-xl font-black text-purple-600 dark:text-purple-400">10+ Years</span>
              <span className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300">Individual papers</span>
            </div>
            <div className="p-3 bg-indigo-50/90 dark:bg-[#121638] rounded-xl border border-indigo-200 dark:border-indigo-800/60 shadow-2xs">
              <span className="block text-base sm:text-xl font-black text-indigo-600 dark:text-indigo-400">AI Tutor</span>
              <span className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300">Step-by-step coach</span>
            </div>
          </div>
        </div>
      </section>

      {/* University Selection Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-sky-400" /> বিশ্ববিদ্যালয় নির্বাচন করুন (Select University)
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              প্রতিটি বিশ্ববিদ্যালয়ের বিগত বছরের পৃথক প্রশ্ন ব্যাংক এবং রিয়েল এক্সাম পোর্টাল।
            </p>
          </div>

          {/* Question Format Filter (All | MCQ | Written) */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#0B1426] p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setSelectedType('ALL')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedType === 'ALL'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedType('MCQ')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedType === 'MCQ'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              MCQ
            </button>
            <button
              onClick={() => setSelectedType('Written')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedType === 'Written'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              Written
            </button>
          </div>
        </div>

        {/* 6 Distinct University Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {universities.map((uni) => {
            const isSelected = selectedUni === uni.id;
            return (
              <button
                key={uni.id}
                onClick={() => setSelectedUni(uni.id)}
                className={`p-3.5 rounded-2xl text-left border-2 transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-100/90 dark:bg-gradient-to-br dark:from-indigo-900/90 dark:via-[#112046] dark:to-[#0A1329] border-indigo-600 dark:border-sky-400 shadow-lg scale-[1.01]'
                    : `${uni.color} hover:border-indigo-500`
                }`}
              >
                <div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider block w-fit mb-1.5 ${
                      isSelected
                        ? 'bg-indigo-600 text-white dark:bg-sky-400 dark:text-slate-950 font-black'
                        : 'bg-white/90 dark:bg-slate-800 text-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {uni.code}
                  </span>
                  <span className="text-xs font-bold text-slate-950 dark:text-white block leading-tight">
                    {uni.name.split(' (')[0]}
                  </span>
                </div>
                <span className="text-[10px] text-slate-600 dark:text-slate-300 mt-2 block">
                  {uni.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sessions Grid with Vibrant Multi-Color Cards */}
      <div className="space-y-4">
        <div className="flex flex-col xs:flex-row xs:items-center justify-between text-xs text-slate-600 dark:text-slate-400 px-1 gap-1">
          <span>
            মোট সেশন: <strong className="text-slate-950 dark:text-white font-mono">{filteredSessions.length}</strong> টি পাওয়া গেছে
          </span>
          <span>সেশন নির্বাচন করে &lsquo;See question&rsquo; অথবা &lsquo;Start Exam&rsquo; চাপুন</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredSessions.map((session, index) => {
            const isWritten = session.questionType === 'Written';
            const palette = SESSION_CARD_PALETTES[index % SESSION_CARD_PALETTES.length];

            return (
              <div
                key={session.id}
                className={`${palette.cardBg} ${palette.border} rounded-2xl p-4 sm:p-5 transition-all flex flex-col justify-between group`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider ${palette.badge}`}>
                      {session.university} • {session.session}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${
                        isWritten
                          ? 'bg-amber-500 text-white border-amber-400 shadow-xs'
                          : 'bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-sky-300 border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {session.questionType}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-slate-950 dark:text-white leading-snug">
                    {session.title}
                  </h3>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                    {session.description}
                  </p>

                  {/* Metrics Box */}
                  <div className={`grid grid-cols-3 gap-2 mt-4 p-2.5 rounded-xl ${palette.metricBox} text-[11px]`}>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px]">সময়</span>
                      <span className={`font-extrabold ${palette.accentText}`}>{session.durationMinutes} মিনিট</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px]">প্রশ্ন</span>
                      <span className={`font-extrabold ${palette.accentText}`}>{session.totalQuestions} টি</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px]">মার্কস</span>
                      <span className={`font-extrabold ${palette.accentText}`}>{session.totalMarks}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2.5 mt-4 pt-3 border-t border-slate-200/80 dark:border-white/10">
                  <button
                    onClick={() => onSelectExam(session, 'qb')}
                    className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${palette.seeBtn}`}
                  >
                    <Eye className="w-3.5 h-3.5" /> See question
                  </button>
                  <button
                    onClick={() => onSelectExam(session, 'exam')}
                    className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 ${palette.startBtn}`}
                  >
                    <Clock className="w-3.5 h-3.5" /> Start Exam
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
