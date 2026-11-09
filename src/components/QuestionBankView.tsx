import React, { useEffect, useMemo, useState } from 'react';
import { ExamSession, Question } from '../data/questionBank';
import { ImportedQuestion, loadQuestionsForSession } from '../data/sessionQuestionLoader';
import { Search, BookOpen, Bookmark, Sparkles, CheckCircle, Clock, ChevronDown, ChevronUp, ArrowLeft, Loader2 } from 'lucide-react';
import { InlineAiTutor } from './InlineAiTutor';
import { MathMarkdownRenderer, MathInlineRenderer } from './MathMarkdownRenderer';

interface QuestionBankViewProps {
  session: ExamSession;
  onBack: () => void;
  onStartExam: (sessionId: string) => void;
  customApiKey: string;
}

const SUBJECT_LABELS: Record<string, string> = {
  ALL: 'ALL',
  Physics: 'Physics',
  Chemistry: 'Chemistry',
  Mathematics: 'Mathematics',
  Biology: 'Biology',
  ICT: 'ICT',
  Bangla: 'বাংলা',
  English: 'English',
};

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  session,
  onBack,
  onStartExam,
  customApiKey,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [expandedAiQuestionId, setExpandedAiQuestionId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError('');
    setQuestions([]);
    setSelectedSubject('ALL');
    setExpandedAiQuestionId(null);
    loadQuestionsForSession(session)
      .then(result => {
        if (!active) return;
        setQuestions(result);
        if (result.length === 0) {
          setLoadError('এই সেশনের জন্য এখনো কোনো প্রশ্ন ডেটাসেটে পাওয়া যায়নি। অন্য সেশনের প্রশ্ন দেখানো হয়নি।');
        }
      })
      .catch(error => {
        if (!active) return;
        console.error(error);
        setLoadError('প্রশ্ন লোড করা যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [session.id]);

  const subjectValues = Array.from(new Set(questions.map(question => question.subject)));
  const subjectTabs = [
    { id: 'ALL', label: 'ALL' },
    { id: 'Physics', label: 'Physics' },
    { id: 'Chemistry', label: 'Chemistry' },
    { id: 'Mathematics', label: 'Mathematics' },
    { id: 'Biology', label: 'Biology' },
    { id: 'ICT', label: 'ICT' },
  ];
  const displayedSubjectTabs = subjectTabs.filter(tab =>
    tab.id === 'ALL' || subjectValues.includes(tab.id)
  );
  const extraSubjects = subjectValues.filter(subject =>
    !subjectTabs.some(tab => tab.id === subject)
  );

  const filteredQuestions = useMemo(() => questions.filter(question => {
    const term = searchTerm.trim().toLowerCase();
    const matchesSubject = selectedSubject === 'ALL' || question.subject === selectedSubject;
    const matchesSearch = !term ||
      question.question.toLowerCase().includes(term) ||
      (question.explanation || '').toLowerCase().includes(term) ||
      question.subject.toLowerCase().includes(term);
    return matchesSubject && matchesSearch;
  }), [questions, selectedSubject, searchTerm]);

  const toggleBookmark = (id: string) => {
    setBookmarks(previous => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAiTutor = (id: string) => {
    setExpandedAiQuestionId(previous => previous === id ? null : id);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24 text-slate-100">
      <div className="bg-gradient-to-r from-[#0C152C] via-[#080E1D] to-[#050914] p-6 sm:p-8 rounded-3xl shadow-xl border border-indigo-900/40 space-y-4">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-xs font-semibold text-sky-300 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> সকল সেশন ও বিশ্ববিদ্যালয়ে ফিরে যান
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-sky-300 text-[10px] font-bold uppercase tracking-wider">
            {session.university} • {session.session} Session
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-200 text-[10px] font-bold">
            {session.questionType}
          </span>
          <span className="text-[11px] text-slate-400">{questions.length} questions loaded</span>
        </div>
        <h1 className="text-xl sm:text-3xl font-black text-white">{session.title}</h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
          শুধু এই বিশ্ববিদ্যালয় ও সেশনের প্রশ্ন দেখানো হচ্ছে। বিষয় নির্বাচন করে প্রশ্ন অনুশীলন করুন।
        </p>
        <div className="relative pt-1">
          <Search className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={event => setSearchTerm(event.target.value)}
            placeholder="প্রশ্ন বা বিষয় দিয়ে খুঁজুন..."
            className="w-full pl-11 pr-4 py-3 bg-[#0B1325] border border-slate-700/80 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 text-xs shadow-inner"
          />
        </div>
        <button
          onClick={() => onStartExam(session.id)}
          disabled={loading || questions.length === 0}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs shadow-md transition-all inline-flex items-center gap-2"
        >
          <Clock className="w-4 h-4" /> এই সেশনের পরীক্ষা শুরু করুন
        </button>
      </div>

      <div className="sticky top-16 z-30 bg-[#0A1122]/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-indigo-950 shadow-lg">
        <div className="flex flex-wrap gap-2">
          {[...displayedSubjectTabs, ...extraSubjects.map(subject => ({ id: subject, label: subject }))].map(subject => (
            <button
              key={subject.id}
              onClick={() => setSelectedSubject(subject.id)}
              className={'px-3 py-2 rounded-xl text-xs font-semibold transition-all ' + (
                selectedSubject === subject.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-[#0F172B] text-slate-300 hover:bg-[#16223D] border border-slate-800'
              )}
            >
              {subject.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-16 text-sky-300 text-sm">
          <Loader2 className="w-5 h-5 animate-spin" /> প্রশ্ন লোড হচ্ছে...
        </div>
      )}

      {!loading && loadError && (
        <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-800/60 text-amber-200 text-sm">
          {loadError}
        </div>
      )}

      {!loading && questions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>মোট <strong className="text-white font-mono">{filteredQuestions.length}</strong> টি প্রশ্ন দেখানো হচ্ছে</span>
            <span>{session.university} • {session.session}</span>
          </div>

          {filteredQuestions.map((q, index) => {
            const imported = q as ImportedQuestion;
            const isBookmarked = bookmarks.has(q.id);
            const hasVerifiedAnswer = imported.answerVerified !== false && q.correctAnswer >= 0;
            const questionHtml = imported.questionHtml;
            return (
              <article key={q.id} className="bg-[#0B1222] rounded-2xl p-5 sm:p-6 border border-slate-800/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#0F1B35] text-sky-300 border border-indigo-900/50">
                      {session.university} • {session.session}
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#080D1A] text-slate-300 border border-slate-800">
                      {q.subject}
                    </span>
                    {q.questionType === 'Written' && <span className="text-[10px] text-amber-300">Written</span>}
                  </div>
                  <button
                    onClick={() => toggleBookmark(q.id)}
                    className={isBookmarked ? 'p-1.5 rounded-lg text-amber-400 bg-amber-950/40' : 'p-1.5 rounded-lg text-slate-500 hover:text-slate-300'}
                    aria-label="Bookmark question"
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>
                </div>

                <div className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                  {questionHtml
                    ? <div className="question-rich-content" dangerouslySetInnerHTML={{ __html: questionHtml }} />
                    : <><span className="font-bold text-sky-400 mr-1.5">{index + 1}.</span><MathInlineRenderer text={q.question.replace(/^(\d+\.?\s*)?(\[[^\]]+\]\s*)?/, '').trim()} /></>}
                </div>
                {!questionHtml && imported.questionImageUrls?.map((url, imageIndex) => (
                  <img key={url + imageIndex} src={url} alt="Question attachment" loading="lazy" className="max-w-full max-h-80 object-contain rounded-xl" />
                ))}

                {q.questionType === 'Written' || q.options.length === 0 ? (
                  <div className="p-3 rounded-xl bg-[#080E1B] border border-slate-800 text-xs text-slate-300">
                    এটি লিখিত প্রশ্ন। এখানে MCQ অপশন বা স্বয়ংক্রিয় answer key নেই।
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map((option, optionIndex) => {
                      const correct = hasVerifiedAnswer && optionIndex === q.correctAnswer;
                      const optionHtml = imported.optionHtmls?.[optionIndex];
                      const optionImages = imported.optionImageUrls?.[optionIndex] || [];
                      return (
                        <div key={optionIndex} className={'p-3 rounded-xl border text-xs flex items-start gap-2.5 ' + (
                          correct ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200 font-semibold' : 'bg-[#080E1C] border-slate-800 text-slate-300'
                        )}>
                          <span className={'w-5 h-5 rounded-md text-xs font-bold flex items-center justify-center shrink-0 ' + (
                            correct ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                          )}>{imported.optionLabels?.[optionIndex] || String.fromCharCode(65 + optionIndex)}</span>
                          <div className="min-w-0 flex-1 leading-snug">
                            {optionHtml
                              ? <div dangerouslySetInnerHTML={{ __html: optionHtml }} />
                              : <MathInlineRenderer text={option} />}
                            {optionImages.map((url, imageIndex) => (
                              <img key={url + imageIndex} src={url} alt="Option attachment" loading="lazy" className="mt-2 max-w-full max-h-48 object-contain rounded-lg" />
                            ))}
                          </div>
                          {correct && <CheckCircle className="w-3.5 h-3.5 text-emerald-400 ml-auto shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="p-3.5 rounded-xl bg-[#080E1B] border border-slate-800 text-xs flex-1">
                    <span className="font-bold text-slate-200 block mb-1">সমাধান ও ব্যাখ্যা:</span>
                    {imported.explanationHtml
                      ? <div className="rich-explanation" dangerouslySetInnerHTML={{ __html: imported.explanationHtml }} />
                      : q.explanation
                        ? <MathMarkdownRenderer content={q.explanation} />
                        : <span className="text-slate-400">ব্যাখ্যা পাওয়া যায়নি।</span>}
                    {!hasVerifiedAnswer && q.questionType !== 'Written' && (
                      <p className="mt-2 text-amber-300">এই প্রশ্নের answer key যাচাই করা যায়নি; অনুমান করে সঠিক উত্তর দেখানো হয়নি।</p>
                    )}
                    {imported.explanationImageUrls?.map((url, imageIndex) => (
                      <img key={url + imageIndex} src={url} alt="Explanation attachment" loading="lazy" className="mt-2 max-w-full max-h-64 object-contain rounded-lg" />
                    ))}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleAiTutor(q.id)}
                      className={'px-4 py-2 border rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm ' + (
                        expandedAiQuestionId === q.id
                          ? 'bg-sky-600 border-sky-400 text-white'
                          : 'bg-gradient-to-r from-indigo-900/60 to-sky-950/60 hover:from-indigo-800 hover:to-sky-900 border-sky-500/40 text-sky-200'
                      )}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                      {expandedAiQuestionId === q.id ? 'Hide AI Tutor' : 'Ask AI Tutor'}
                      {expandedAiQuestionId === q.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {expandedAiQuestionId === q.id && (
                  <InlineAiTutor
                    question={q}
                    university={q.university}
                    session={q.session}
                    customApiKey={customApiKey}
                    onClose={() => setExpandedAiQuestionId(null)}
                  />
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
