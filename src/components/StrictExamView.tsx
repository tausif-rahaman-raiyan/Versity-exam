import React, { useState, useEffect } from 'react';
import { Question, ExamSession, getQuestionsForSession, EXAM_SESSIONS } from '../data/questionBank';
import { Clock, AlertTriangle, CheckCircle, XCircle, Award, RefreshCw, Bookmark, Sparkles, Lock, ArrowLeft, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { InlineAiTutor } from './InlineAiTutor';
import { MathMarkdownRenderer, MathInlineRenderer } from './MathMarkdownRenderer';

interface StrictExamViewProps {
  examSession: ExamSession;
  onBack: () => void;
  customApiKey: string;
  setCustomApiKey: (key: string) => void;
}

export const StrictExamView: React.FC<StrictExamViewProps> = ({
  examSession,
  onBack,
  customApiKey,
  setCustomApiKey,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  // selectedAnswers: questionId -> optionIndex (0-3)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  // lockedQuestions: set of question IDs that have been clicked and permanently locked
  const [lockedQuestions, setLockedQuestions] = useState<Set<string>>(new Set());
  // bookmarks
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());

  // Timer in seconds
  const [timeLeft, setTimeLeft] = useState<number>(examSession.durationMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  // Accordion state: ID of question currently showing inline AI Tutor
  const [expandedAiQuestionId, setExpandedAiQuestionId] = useState<string | null>(null);

  useEffect(() => {
    const loaded = getQuestionsForSession(examSession.id);
    setQuestions(loaded);
    setTimeLeft(examSession.durationMinutes * 60);
    setSelectedAnswers({});
    setLockedQuestions(new Set());
    setIsSubmitted(false);
    setExpandedAiQuestionId(null);
  }, [examSession]);

  // Countdown timer
  useEffect(() => {
    if (isSubmitted) return;
    if (timeLeft <= 0) {
      handleSubmitExam();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // STRICT AUTO-LOCK: Once clicked, locked forever!
  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return;
    // If already locked, strictly refuse any change!
    if (lockedQuestions.has(questionId)) return;

    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    setLockedQuestions(prev => {
      const next = new Set(prev);
      next.add(questionId);
      return next;
    });
  };

  const toggleBookmark = (questionId: string) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  };

  const handleSubmitExam = () => {
    setIsSubmitted(true);
    setShowConfirmModal(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculations
  let correctCount = 0;
  let incorrectCount = 0;
  let unattemptedCount = 0;

  questions.forEach(q => {
    const ans = selectedAnswers[q.id];
    if (ans === undefined) {
      unattemptedCount++;
    } else if (ans === q.correctAnswer) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  });

  const negativePenalty = examSession.university === 'JU' ? 0.20 : 0.25;
  const totalMarksEarned = Math.max(0, (correctCount * 1) - (incorrectCount * negativePenalty));

  const toggleAiTutor = (qId: string) => {
    setExpandedAiQuestionId(prev => (prev === qId ? null : qId));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24 text-slate-100">
      {/* Sticky Real-Time Exam Control Bar */}
      <div className="sticky top-16 z-40 bg-[#070C18]/95 backdrop-blur-md border border-indigo-950/90 p-4 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <button
            onClick={onBack}
            className="text-[11px] text-sky-400 font-semibold flex items-center gap-1 hover:underline mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> বিশ্ববিদ্যালয় ও সেশন পরিবর্তন
          </button>
          <h1 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            {examSession.title}
          </h1>
          <p className="text-[11px] text-slate-400">
            {isSubmitted
              ? '✅ পরীক্ষা সমাপ্ত ও ফলাফল মূল্যায়িত হয়েছে।'
              : '🔒 Strict Auto-Lock Enabled: একবার অপশনে ক্লিক করলে তা লক হয়ে যাবে, পরিবর্তন করা যাবে না।'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isSubmitted && (
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-bold ${
                timeLeft < 300
                  ? 'bg-red-950/60 text-red-400 border border-red-800 animate-pulse'
                  : 'bg-[#0B152B] text-sky-300 border border-indigo-900/60'
              }`}
            >
              <Clock className="w-4 h-4 text-sky-400" />
              <span>অবশিষ্ট সময়: {formatTime(timeLeft)}</span>
            </div>
          )}

          {!isSubmitted ? (
            <button
              onClick={() => setShowConfirmModal(true)}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-1.5"
            >
              Submit Exam
            </button>
          ) : (
            <button
              onClick={() => {
                setIsSubmitted(false);
                setSelectedAnswers({});
                setLockedQuestions(new Set());
                setTimeLeft(examSession.durationMinutes * 60);
                setExpandedAiQuestionId(null);
              }}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retake Exam
            </button>
          )}
        </div>
      </div>

      {/* Result Card after Submission */}
      {isSubmitted && (
        <div className="bg-gradient-to-br from-[#0B1428] via-[#080D1A] to-[#040711] text-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-sky-500/30 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-sky-300 text-[10px] font-bold uppercase tracking-wider">
                Official Result Sheet
              </span>
              <h2 className="text-xl sm:text-2xl font-bold mt-2">ফলাফল সারাংশ (Performance Summary)</h2>
            </div>
            <div className="sm:text-right">
              <span className="block text-3xl sm:text-4xl font-black text-emerald-400">
                {totalMarksEarned.toFixed(2)}{' '}
                <span className="text-xs text-slate-400">/ {examSession.totalMarks} Marks</span>
              </span>
              <span className="text-[11px] text-slate-400">
                (+1 সঠিক, -{negativePenalty} ভুল উত্তর নেগেটিভ মার্কস)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-[#0B1222] p-4 rounded-xl border border-slate-800">
              <span className="block text-[11px] text-slate-400">Total Questions</span>
              <span className="text-lg font-bold text-white">{questions.length}</span>
            </div>
            <div className="bg-[#0B1222] p-4 rounded-xl border border-slate-800">
              <span className="block text-[11px] text-emerald-400">সঠিক (+1)</span>
              <span className="text-lg font-bold text-emerald-400">{correctCount}</span>
            </div>
            <div className="bg-[#0B1222] p-4 rounded-xl border border-slate-800">
              <span className="block text-[11px] text-red-400">ভুল উত্তর (-{negativePenalty})</span>
              <span className="text-lg font-bold text-red-400">{incorrectCount}</span>
            </div>
            <div className="bg-[#0B1222] p-4 rounded-xl border border-slate-800">
              <span className="block text-[11px] text-amber-400">উত্তর দেননি (0)</span>
              <span className="text-lg font-bold text-amber-400">{unattemptedCount}</span>
            </div>
          </div>
        </div>
      )}

      {/* Strict Mode Info Strip */}
      <div className="bg-[#0A1120] p-4 rounded-2xl border border-indigo-950 flex flex-wrap items-center justify-between text-xs font-medium text-slate-300 shadow-sm gap-2">
        <div className="flex items-center gap-4">
          <span>মোট প্রশ্ন: <strong className="text-white font-mono">{questions.length}</strong></span>
          <span>লক করা হয়েছে: <strong className="text-amber-400 font-mono">{lockedQuestions.size}</strong></span>
          <span>বাকি আছে: <strong className="text-sky-400 font-mono">{questions.length - lockedQuestions.size}</strong></span>
        </div>
        <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-[11px]">
          <Lock className="w-3.5 h-3.5" /> Auto-Lock Policy: একবার কোনো অপশনে ক্লিক করলেই সাথে সাথে লক!
        </div>
      </div>

      {/* ALL QUESTIONS IN ONE PAGE */}
      <div className="space-y-5">
        {questions.map((q, idx) => {
          const userSelected = selectedAnswers[q.id];
          const isLocked = lockedQuestions.has(q.id);
          const isBookmarked = bookmarks.has(q.id);

          return (
            <div
              key={q.id}
              id={`q-${q.id}`}
              className={`bg-[#0B1222] rounded-2xl p-5 sm:p-6 border transition-all shadow-sm ${
                isSubmitted
                  ? userSelected === q.correctAnswer
                    ? 'border-emerald-500/60 bg-emerald-950/10'
                    : userSelected !== undefined
                    ? 'border-red-500/60 bg-red-950/10'
                    : 'border-slate-800'
                  : isLocked
                  ? 'border-indigo-500/70 shadow-md shadow-indigo-500/5'
                  : 'border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Question Top Bar */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#0F1B35] text-sky-400 border border-indigo-900/40">
                    Question {idx + 1}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#070D1A] text-slate-300 border border-slate-800">
                    {q.subject}
                  </span>
                  {isLocked && !isSubmitted && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950/70 text-amber-300 flex items-center gap-1 border border-amber-800/60">
                      <Lock className="w-3 h-3" /> Locked 🔒
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleBookmark(q.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isBookmarked ? 'text-amber-400 bg-amber-950/40' : 'text-slate-500 hover:text-slate-300'
                    }`}
                    title="Bookmark Question"
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <h3 className="text-sm sm:text-base font-semibold text-white mb-4 leading-relaxed">
                <span className="font-bold text-sky-400 mr-1.5">{idx + 1}.</span>
                <MathInlineRenderer text={q.question.replace(/^(\d+\.?\s*)?(\[[^\]]+\]\s*)?/, '').trim()} />
              </h3>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {q.options.map((opt, optIdx) => {
                  const isSelected = userSelected === optIdx;
                  const isCorrectOpt = optIdx === q.correctAnswer;

                  let btnStyle = 'bg-[#080E1C] border-slate-800 hover:border-indigo-500 text-slate-300';

                  if (isSubmitted) {
                    if (isCorrectOpt) {
                      btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold';
                    } else if (isSelected && !isCorrectOpt) {
                      btnStyle = 'bg-red-950/60 border-red-500 text-red-200 font-semibold';
                    }
                  } else {
                    if (isSelected) {
                      btnStyle = 'bg-indigo-600 text-white border-indigo-500 font-semibold shadow-lg shadow-indigo-600/30';
                    } else if (isLocked) {
                      btnStyle = 'bg-[#070B16] border-slate-900 text-slate-600 cursor-not-allowed opacity-50';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isLocked || isSubmitted}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-white text-indigo-700'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="leading-snug"><MathInlineRenderer text={opt} /></span>
                      </div>
                      {isSubmitted && isCorrectOpt && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                      {isSubmitted && isSelected && !isCorrectOpt && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Post-Submission Details & AI Tutor Action */}
              {isSubmitted && (
                <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-3">
                  <div className="p-3.5 rounded-xl bg-[#080E1B] border border-slate-800 text-xs space-y-1">
                    <span className="font-bold text-slate-200 block mb-1">সঠিক উত্তর ও মূল ব্যাখ্যা:</span>
                    <MathMarkdownRenderer content={q.explanation} />
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => toggleAiTutor(q.id)}
                      className={`px-4 py-2 border rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-sm ${
                        expandedAiQuestionId === q.id
                          ? 'bg-sky-600 border-sky-400 text-white shadow-sky-600/30'
                          : 'bg-gradient-to-r from-indigo-900/60 to-sky-950/60 hover:from-indigo-800 hover:to-sky-900 border-sky-500/40 text-sky-200'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                      <span>{expandedAiQuestionId === q.id ? 'Hide AI Tutor' : 'Ask AI Tutor (Gemini 3.8)'}</span>
                      {expandedAiQuestionId === q.id ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Inline Expandable AI Tutor Accordion */}
                  {expandedAiQuestionId === q.id && (
                    <InlineAiTutor
                      question={q}
                      university={examSession.university}
                      session={examSession.session}
                      customApiKey={customApiKey}
                      onClose={() => setExpandedAiQuestionId(null)}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1222] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-indigo-900/60 shadow-2xl space-y-5 text-center">
            <div className="w-14 h-14 bg-amber-950/80 text-amber-400 border border-amber-800/60 rounded-2xl mx-auto flex items-center justify-center">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">পরীক্ষা জমা দিতে চান? (Submit Exam)</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                আপনি {questions.length} টির মধ্যে {lockedQuestions.size} টি প্রশ্নের উত্তর দিয়ে লক করেছেন।
                জমা দেওয়ার পর স্বয়ংক্রিয়ভাবে ফলাফল ও সঠিক উত্তর প্রদর্শিত হবে।
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold text-xs transition-colors"
              >
                বাতিল (Cancel)
              </button>
              <button
                onClick={handleSubmitExam}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition-all"
              >
                নিশ্চিত জমা দিন (Submit)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
