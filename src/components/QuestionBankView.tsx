import React, { useState } from 'react';
import { SAMPLE_QUESTIONS, Question, EXAM_SESSIONS } from '../data/questionBank';
import { Search, BookOpen, Bookmark, Sparkles, CheckCircle, Filter, Clock, GraduationCap, ChevronDown, ChevronUp } from 'lucide-react';
import { InlineAiTutor } from './InlineAiTutor';
import { MathMarkdownRenderer, MathInlineRenderer } from './MathMarkdownRenderer';

interface QuestionBankViewProps {
  onStartExam: (sessionId: string) => void;
  customApiKey: string;
  setCustomApiKey: (key: string) => void;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  onStartExam,
  customApiKey,
  setCustomApiKey,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [selectedUni, setSelectedUni] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());

  // Accordion state: ID of the question currently showing inline AI Tutor
  const [expandedAiQuestionId, setExpandedAiQuestionId] = useState<string | null>(null);

  const subjects = ['ALL', 'Physics', 'Chemistry', 'Mathematics', 'Biology', 'ICT'];
  const universities = [
    { id: 'ALL', label: 'All (সকল)' },
    { id: 'DU', label: 'DU (ঢাকা)' },
    { id: 'RU', label: 'RU (রাজশাহী)' },
    { id: 'JU', label: 'JU (জাহাঙ্গীরনগর)' },
    { id: 'CU', label: 'CU (চট্টগ্রাম)' },
    { id: 'GST', label: 'GST (গুচ্ছ ২৪)' },
  ];

  const filteredQuestions = SAMPLE_QUESTIONS.filter(q => {
    const matchesSub = selectedSubject === 'ALL' || q.subject === selectedSubject;
    const matchesUni = selectedUni === 'ALL' || q.university === selectedUni;
    const matchesSearch =
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.explanation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSub && matchesUni && matchesSearch;
  });

  const toggleBookmark = (id: string) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAiTutor = (qId: string) => {
    setExpandedAiQuestionId(prev => (prev === qId ? null : qId));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24 text-slate-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0C152C] via-[#080E1D] to-[#050914] p-6 sm:p-8 rounded-3xl shadow-xl border border-indigo-900/40 space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-sky-300 text-[10px] font-bold uppercase tracking-wider">
            All 5 Universities Science QB
          </span>
          <span className="text-[11px] text-slate-400">DU • RU • JU • CU • GST</span>
        </div>

        <h1 className="text-xl sm:text-3xl font-black text-white">
          Admission Question Bank & AI Explanations
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
          প্রতিটি প্রশ্নের বিশদ ব্যাখ্যা, শর্টকাট ট্রিক এবং <span className="text-sky-300 font-semibold">Gemini AI Tutor</span> এর মাধ্যমে যেকোনো সন্দেহ দূর করার সুবিধা।
        </p>

        {/* Search */}
        <div className="relative pt-1">
          <Search className="absolute left-4 top-4.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="প্রশ্ন বা বিষয় দিয়ে খুঁজুন (যেমন: সরল দোলক, অ্যালকোহল, উপবৃত্ত, গ্লাইকোলাইসিস)..."
            className="w-full pl-11 pr-4 py-3 bg-[#0B1325] border border-slate-700/80 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 text-xs shadow-inner"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-[#0A1122] p-5 rounded-2xl border border-indigo-950 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          {/* University selector */}
          <div className="space-y-1.5 flex-1">
            <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-sky-400" /> বিশ্ববিদ্যালয় (University):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {universities.map(uni => (
                <button
                  key={uni.id}
                  onClick={() => setSelectedUni(uni.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedUni === uni.id
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                      : 'bg-[#0F172B] text-slate-300 hover:bg-[#16223D] border border-slate-800'
                  }`}
                >
                  {uni.label}
                </button>
              ))}
            </div>
          </div>

          {/* Subject selector */}
          <div className="space-y-1.5 flex-1">
            <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-indigo-400" /> বিষয় (Subject):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {subjects.map(sub => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedSubject === sub
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-[#0F172B] text-slate-300 hover:bg-[#16223D] border border-slate-800'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>মোট <strong className="text-white font-mono">{filteredQuestions.length}</strong> টি প্রশ্ন দেখানো হচ্ছে</span>
          <span>প্রশ্নভিত্তিক AI ব্যাখ্যার জন্য 'Ask AI Tutor' চাপুন</span>
        </div>

        {filteredQuestions.map((q, idx) => {
          const isBookmarked = bookmarks.has(q.id);

          return (
            <div
              key={q.id}
              className="bg-[#0B1222] rounded-2xl p-5 sm:p-6 border border-slate-800/80 hover:border-slate-700 shadow-sm space-y-4 transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#0F1B35] text-sky-300 border border-indigo-900/50">
                    {q.university} • {q.session}
                  </span>
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#080D1A] text-slate-300 border border-slate-800">
                    {q.subject}
                  </span>
                </div>
                <button
                  onClick={() => toggleBookmark(q.id)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isBookmarked ? 'text-amber-400 bg-amber-950/40' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>
              </div>

              <h3 className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                <span className="font-bold text-sky-400 mr-1.5">{idx + 1}.</span>
                <MathInlineRenderer text={q.question.replace(/^(\d+\.?\s*)?(\[[^\]]+\]\s*)?/, '').trim()} />
              </h3>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {q.options.map((opt, optIdx) => {
                  const isCorrect = optIdx === q.correctAnswer;
                  return (
                    <div
                      key={optIdx}
                      className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 ${
                        isCorrect
                          ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200 font-semibold'
                          : 'bg-[#080E1C] border-slate-800 text-slate-300'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-md text-xs font-bold flex items-center justify-center shrink-0 ${
                          isCorrect ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="leading-snug"><MathInlineRenderer text={opt} /></span>
                      {isCorrect && <CheckCircle className="w-3.5 h-3.5 text-emerald-400 ml-auto shrink-0" />}
                    </div>
                  );
                })}
              </div>

              {/* Solution & AI Tutor Action */}
              <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="p-3.5 rounded-xl bg-[#080E1B] border border-slate-800 text-xs flex-1">
                  <span className="font-bold text-slate-200 block mb-1">সঠিক উত্তর ও মূল পয়েন্ট:</span>
                  <MathMarkdownRenderer content={q.explanation} />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleAiTutor(q.id)}
                    className={`px-4 py-2 border rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm ${
                      expandedAiQuestionId === q.id
                        ? 'bg-sky-600 border-sky-400 text-white shadow-sky-600/30'
                        : 'bg-gradient-to-r from-indigo-900/60 to-sky-950/60 hover:from-indigo-800 hover:to-sky-900 border-sky-500/40 text-sky-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                    <span>{expandedAiQuestionId === q.id ? 'Hide AI Tutor' : 'Ask AI Tutor (Gemini)'}</span>
                    {expandedAiQuestionId === q.id ? (
                      <ChevronUp className="w-3.5 h-3.5 ml-0.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
                    )}
                  </button>
                  <button
                    onClick={() => onStartExam(`du-24-25`)}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium text-xs transition-colors flex items-center gap-1"
                    title="Take Exam on this pattern"
                  >
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> Exam
                  </button>
                </div>
              </div>

              {/* Inline Expandable AI Tutor Accordion */}
              {expandedAiQuestionId === q.id && (
                <InlineAiTutor
                  question={q}
                  university={q.university}
                  session={q.session}
                  customApiKey={customApiKey}
                  onClose={() => setExpandedAiQuestionId(null)}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
