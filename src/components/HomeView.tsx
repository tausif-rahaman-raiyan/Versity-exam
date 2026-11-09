import React, { useState } from 'react';
import { EXAM_SESSIONS, ExamSession } from '../data/questionBank';
import { Search, BookOpen, Clock, ShieldCheck, CheckCircle2, Award, Sparkles, Filter, ChevronRight, Key, GraduationCap } from 'lucide-react';

interface HomeViewProps {
  onSelectExam: (session: ExamSession, mode: 'exam' | 'qb') => void;
  setCurrentView: (view: 'questionBank' | 'exam') => void;
  onOpenApiKeyModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onSelectExam, setCurrentView, onOpenApiKeyModal }) => {
  const [selectedUni, setSelectedUni] = useState<string>('DU'); // Default to DU
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<'ALL' | 'MCQ' | 'Written'>('ALL');

  const universities = [
    { id: 'DU', name: 'ঢাকা বিশ্ববিদ্যালয় (DU)', code: 'DU', desc: 'A Unit Science • 25+ Sessions' },
    { id: 'RU', name: 'রাজশাহী বিশ্ববিদ্যালয় (RU)', code: 'RU', desc: 'C Unit Science • Last 10 Years' },
    { id: 'JU', name: 'জাহাঙ্গীরনগর (JU)', code: 'JU', desc: 'A Unit Math & Phys • Last 10 Years' },
    { id: 'CU', name: 'চট্টগ্রাম বিশ্ববিদ্যালয় (CU)', code: 'CU', desc: 'A Unit Science • Last 10 Years' },
    { id: 'GST', name: 'জিএসটি গুচ্ছ (GST)', code: 'GST', desc: 'Cluster 24 Universities • 10 Years' },
    { id: 'ALL', name: 'সকল বিশ্ববিদ্যালয় (All)', code: 'ALL', desc: 'All Universities Combined' },
  ];

  const filteredSessions = EXAM_SESSIONS.filter(session => {
    const matchesUni = selectedUni === 'ALL' || session.university === selectedUni;
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          session.session.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          session.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'ALL' || session.questionType === selectedType;
    return matchesUni && matchesSearch && matchesType;
  });

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Banner in Dark Navy / Midnight Black */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B132B] via-[#080D1A] to-[#040711] text-white py-14 px-5 sm:px-8 rounded-3xl shadow-2xl border border-indigo-900/40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.12),transparent_60%)]"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-sky-300 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" /> DU, RU, JU, CU, GST • 10-Year Question Bank & Real Exam
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Varsity Science Admission <br />
            <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-sky-200 bg-clip-text text-transparent">
              All 5 Universities (Last 10+ Years)
            </span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
            Full individual question papers for each university. Experience genuine admission pressure with 
            <span className="text-sky-300 font-semibold"> All Questions in One Page</span> and 
            <span className="text-amber-300 font-semibold"> Instant Auto-Lock</span> (cannot change option once clicked). Powered by <span className="text-indigo-300 font-semibold">Gemini 3.8 AI Tutor</span>.
          </p>

          {/* Quick Search & AI Tutor Actions */}
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 pt-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="সেশন খুঁজুন (যেমন: 24-25, 23-24, DU Written, RU C Unit, JU A Unit)..."
                className="w-full pl-11 pr-4 py-3 bg-[#0B1426] border border-slate-700/80 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 text-xs shadow-inner"
              />
            </div>
            <button
              onClick={() => setCurrentView('exam')}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 text-xs shrink-0"
            >
              <Clock className="w-4 h-4" /> Start Strict Exam
            </button>
            <button
              onClick={onOpenApiKeyModal}
              className="px-4 py-3 bg-[#0E172A] hover:bg-[#1E293B] border border-indigo-900/60 text-sky-300 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shrink-0"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" /> AI Key
            </button>
          </div>

          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-left max-w-3xl mx-auto border-t border-slate-800/80">
            <div className="p-3 bg-[#0A1122]/70 rounded-xl border border-indigo-950/60">
              <span className="block text-xl font-bold text-sky-400">5 Universities</span>
              <span className="text-[11px] text-slate-400">DU, RU, JU, CU, GST</span>
            </div>
            <div className="p-3 bg-[#0A1122]/70 rounded-xl border border-indigo-950/60">
              <span className="block text-xl font-bold text-amber-400">Auto-Lock</span>
              <span className="text-[11px] text-slate-400">Click once to lock permanently</span>
            </div>
            <div className="p-3 bg-[#0A1122]/70 rounded-xl border border-indigo-950/60">
              <span className="block text-xl font-bold text-emerald-400">10+ Years</span>
              <span className="text-[11px] text-slate-400">Individual papers per uni</span>
            </div>
            <div className="p-3 bg-[#0A1122]/70 rounded-xl border border-indigo-950/60">
              <span className="block text-xl font-bold text-indigo-400">Gemini AI</span>
              <span className="text-[11px] text-slate-400">Step-by-step & Shortcuts</span>
            </div>
          </div>
        </div>
      </section>

      {/* University Selection Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-sky-400" /> বিশ্ববিদ্যালয় নির্বাচন করুন (Select University)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              প্রতিটি বিশ্ববিদ্যালয়ের গত ১০ বছরের পৃথক প্রশ্ন ব্যাংক এবং রিয়েল এক্সাম পোর্টাল।
            </p>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1 bg-[#0B1426] p-1 rounded-xl border border-slate-800 self-start">
            <button
              onClick={() => setSelectedType('ALL')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${selectedType === 'ALL' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedType('MCQ')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${selectedType === 'MCQ' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              MCQ
            </button>
            <button
              onClick={() => setSelectedType('Written')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${selectedType === 'Written' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              Written
            </button>
          </div>
        </div>

        {/* 5 Distinct University Cards / Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {universities.map(uni => {
            const isSelected = selectedUni === uni.id;
            return (
              <button
                key={uni.id}
                onClick={() => setSelectedUni(uni.id)}
                className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-br from-indigo-950 via-[#0E1A38] to-[#0A1329] border-sky-500 shadow-lg shadow-sky-500/10'
                    : 'bg-[#0B1222] border-slate-800/80 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider block w-fit mb-1.5 ${
                    isSelected ? 'bg-sky-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {uni.code}
                  </span>
                  <span className="text-xs font-bold text-white block leading-tight">
                    {uni.name.split(' (')[0]}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-2 block">
                  {uni.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sessions Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>মোট সেশন: <strong className="text-white font-mono">{filteredSessions.length}</strong> টি পাওয়া গেছে</span>
          <span>সেশন নির্বাচন করে 'Start Exam' বা 'Question Bank' চাপুন</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSessions.map(session => (
            <div
              key={session.id}
              className="bg-[#0B1324] hover:bg-[#0E1830] rounded-2xl p-5 border border-slate-800/80 hover:border-indigo-500/50 transition-all shadow-sm flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider ${
                    session.university === 'DU' ? 'bg-blue-950/80 text-sky-300 border border-blue-800/60' :
                    session.university === 'GST' ? 'bg-purple-950/80 text-purple-300 border border-purple-800/60' :
                    session.university === 'RU' ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60' :
                    session.university === 'JU' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60' :
                    'bg-cyan-950/80 text-cyan-300 border border-cyan-800/60'
                  }`}>
                    {session.university} • {session.session}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 bg-[#070C18] px-2 py-0.5 rounded border border-slate-800">
                    {session.questionType}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors leading-snug">
                  {session.title}
                </h3>
                <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {session.description}
                </p>

                {/* Badges / Metrics */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">সময়</span>
                    <span className="font-bold text-slate-200">{session.durationMinutes} মিনিট</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">প্রশ্ন</span>
                    <span className="font-bold text-slate-200">{session.totalQuestions} টি</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">মার্কস</span>
                    <span className="font-bold text-slate-200">{session.totalMarks}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-5 pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => onSelectExam(session, 'qb')}
                  className="flex-1 py-2 px-3 bg-[#0F192E] hover:bg-[#162444] text-slate-200 rounded-xl font-medium text-xs transition-colors flex items-center justify-center gap-1.5 border border-slate-700/60"
                >
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" /> Question Bank
                </button>
                <button
                  onClick={() => onSelectExam(session, 'exam')}
                  className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5" /> Start Exam
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
