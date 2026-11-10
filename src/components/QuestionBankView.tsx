import React, { useEffect, useMemo, useState } from 'react';
import { ExamSession, Question } from '../data/questionBank';
import { ImportedQuestion, loadQuestionsForSession } from '../data/sessionQuestionLoader';
import {
  Search,
  Sparkles,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Loader2,
  Key,
  AlertCircle,
  X,
} from 'lucide-react';
import { InlineAiTutor } from './InlineAiTutor';
import { MathMarkdownRenderer, MathInlineRenderer } from './MathMarkdownRenderer';
import { getSubjectCardStyle } from '../utils/subjectColors';
import {
  UiSettings,
  DEFAULT_UI_SETTINGS,
  getFontStyleClass,
} from '../utils/uiSettings';

interface QuestionBankViewProps {
  session: ExamSession;
  onBack: () => void;
  onStartExam: (sessionId: string) => void;
  customApiKey: string;
  onOpenApiKeyModal: () => void;
  uiSettings?: UiSettings;
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
  onOpenApiKeyModal,
  uiSettings = DEFAULT_UI_SETTINGS,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedAiQuestionIds, setExpandedAiQuestionIds] = useState<Set<string>>(new Set());
  const [apiKeyNotice, setApiKeyNotice] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [session.id]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError('');
    setQuestions([]);
    setSelectedSubject('ALL');
    setExpandedAiQuestionIds(new Set());
    loadQuestionsForSession(session)
      .then((result) => {
        if (!active) return;
        setQuestions(result);
        if (result.length === 0) {
          setLoadError('এই সেশনের জন্য এখনো কোনো প্রশ্ন ডেটাসেটে পাওয়া যায়নি। অন্য সেশনের প্রশ্ন দেখানো হয়নি।');
        }
      })
      .catch((error) => {
        if (!active) return;
        console.error(error);
        setLoadError('প্রশ্ন লোড করা যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [session.id]);

  const subjects = useMemo(
    () => [
      'ALL',
      ...Array.from(new Set(questions.map((question) => question.subject))).sort((a, b) =>
        a.localeCompare(b)
      ),
    ],
    [questions]
  );

  const filteredQuestions = useMemo(
    () =>
      questions.filter((question) => {
        const term = searchTerm.trim().toLowerCase();
        const matchesSubject = selectedSubject === 'ALL' || question.subject === selectedSubject;
        const matchesSearch =
          !term ||
          question.question.toLowerCase().includes(term) ||
          (question.explanation || '').toLowerCase().includes(term) ||
          question.subject.toLowerCase().includes(term);
        return matchesSubject && matchesSearch;
      }),
    [questions, selectedSubject, searchTerm]
  );

  const toggleAiTutor = (id: string) => {
    if (!customApiKey || !customApiKey.trim()) {
      setApiKeyNotice(true);
      return;
    }
    setExpandedAiQuestionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const fontStyleClass = getFontStyleClass(uiSettings.fontStyle);

  return (
    <div className={`max-w-5xl mx-auto space-y-5 sm:space-y-6 pb-24 text-slate-900 dark:text-slate-100 ${fontStyleClass}`}>
      {/* Floating API Key Notification Toast */}
      {apiKeyNotice && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-96 z-50 bg-white dark:bg-[#0D162C] border-2 border-amber-500 rounded-2xl p-4 shadow-2xl flex items-start gap-3 animate-fadeIn">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs space-y-2">
            <h4 className="font-bold text-slate-950 dark:text-white text-sm">
              API Key প্রয়োজন (Add API Key)
            </h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Ask AI Tutor-এর বিস্তারিত ব্যাখ্যা ও শর্টকাট দেখতে অনুগ্রহ করে আপনার ফ্রি Gemini API Key যুক্ত করুন।
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  setApiKeyNotice(false);
                  onOpenApiKeyModal();
                }}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs inline-flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Key className="w-3.5 h-3.5" /> Add API Key
              </button>
              <button
                onClick={() => setApiKeyNotice(false)}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-lg text-xs"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
          <button
            onClick={() => setApiKeyNotice(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-indigo-50/90 via-white to-sky-50/80 dark:from-[#0C152C] dark:via-[#080E1D] dark:to-[#050914] p-5 sm:p-8 rounded-3xl shadow-lg border border-slate-200 dark:border-indigo-900/40 space-y-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-sky-300 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> সকল সেশন ও বিশ্ববিদ্যালয়ে ফিরে যান
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
            {session.university} • {session.session} Session
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-bold">
            {session.questionType}
          </span>
          <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
            {questions.length} questions loaded
          </span>
        </div>
        <h1 className="text-xl sm:text-3xl font-black text-slate-950 dark:text-white leading-tight">
          {session.title}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
          শুধু এই বিশ্ববিদ্যালয় ও সেশনের প্রশ্ন দেখানো হচ্ছে। নিচের বিষয়ভিত্তিক রঙিন বাটনে ক্লিক করে প্রশ্ন ফিল্টার করুন।
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="প্রশ্ন বা বিষয় দিয়ে খুঁজুন..."
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#0B1325] border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 text-xs shadow-inner"
            />
          </div>
          <button
            onClick={() => onStartExam(session.id)}
            disabled={loading || questions.length === 0}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs shadow-md transition-all inline-flex items-center justify-center gap-2 shrink-0"
          >
            <Clock className="w-4 h-4" /> এই সেশনের পরীক্ষা শুরু করুন
          </button>
        </div>
      </div>

      {/* Color-Coded Subject Filter Bar (No Green or Red) */}
      <div className="sticky top-16 z-30 bg-white/95 dark:bg-[#0A1122]/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-indigo-950 shadow-md">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap no-scrollbar">
          {subjects.map((subject) => {
            const isSelected = selectedSubject === subject;
            if (subject === 'ALL') {
              return (
                <button
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  className={
                    'px-3.5 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ' +
                    (isSelected
                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-950 dark:border-white shadow-md'
                      : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200 dark:bg-[#0F172B] dark:text-slate-300 dark:border-slate-800')
                  }
                >
                  ALL ({questions.length})
                </button>
              );
            }
            const style = getSubjectCardStyle(subject);
            return (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={
                  'px-3.5 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ' +
                  (isSelected ? style.filterActive : style.filterInactive)
                }
              >
                {SUBJECT_LABELS[subject] || subject}
              </button>
            );
          })}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-16 text-indigo-600 dark:text-sky-300 text-sm font-semibold">
          <Loader2 className="w-5 h-5 animate-spin" /> প্রশ্ন লোড হচ্ছে...
        </div>
      )}

      {!loading && loadError && (
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-sm">
          {loadError}
        </div>
      )}

      {!loading && questions.length > 0 && (
        <div className="space-y-4 sm:space-y-5">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 px-1">
            <span>
              মোট <strong className="text-slate-950 dark:text-white font-mono">{filteredQuestions.length}</strong> টি প্রশ্ন দেখানো হচ্ছে
            </span>
            <span className="font-semibold">{session.university} • {session.session}</span>
          </div>

          {filteredQuestions.map((q, index) => {
            const imported = q as ImportedQuestion;
            const hasVerifiedAnswer = imported.answerVerified !== false && q.correctAnswer >= 0;
            const cardStyle = getSubjectCardStyle(q.subject);
            const showAnswerBadge = hasVerifiedAnswer && Boolean(q.options[q.correctAnswer]);

            return (
              <article
                key={q.id}
                className={`${cardStyle.bgClass} rounded-2xl p-4 sm:p-6 ${cardStyle.borderClass} transition-all space-y-4`}
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${cardStyle.numBadge}`}>
                      Question {q.number ?? index + 1}
                    </span>
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${cardStyle.badgeBg}`}>
                      {SUBJECT_LABELS[q.subject] || q.subject}
                    </span>
                    {q.questionType === 'Written' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-400 dark:border-amber-800/60">
                        Written
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {session.university} {session.session}
                  </span>
                </div>

                {/* Question Text (Dynamic Question Font Size in px) */}
                <div
                  style={{ fontSize: `${uiSettings.questionFontPx}px` }}
                  className="font-semibold text-slate-950 dark:text-white leading-relaxed"
                >
                  <span className="font-bold text-indigo-700 dark:text-sky-400 mr-1.5">
                    {q.number ?? index + 1}.
                  </span>
                  <MathInlineRenderer
                    text={q.question.replace(/^(\d+\.?\s*)?(\[[^\]]+\]\s*)?/, '').trim()}
                  />
                </div>
                {imported.questionImageUrls
                  ?.filter((url) => {
                    const fileName = url.split('/').pop() || url;
                    return !q.question.includes(fileName);
                  })
                  .map((url, imageIndex) => (
                    <img
                      key={url + imageIndex}
                      src={url}
                      alt="Question attachment"
                      loading="lazy"
                      className="max-w-full max-h-80 object-contain rounded-xl bg-white p-1.5 border border-slate-200 dark:border-slate-700"
                    />
                  ))}

                {/* Options (Dynamic Option Box Font Size in px) */}
                {q.questionType === 'Written' || q.options.length === 0 ? (
                  <div className="p-3.5 rounded-xl bg-amber-50/90 dark:bg-[#080E1B] border border-amber-300 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-300">
                    এটি লিখিত প্রশ্ন। নিচে সমাধান ও ব্যাখ্যা দেওয়া হলো।
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map((option, optionIndex) => {
                      const correct = hasVerifiedAnswer && optionIndex === q.correctAnswer;
                      const optionImages = imported.optionImageUrls?.[optionIndex] || [];
                      return (
                        <div
                          key={optionIndex}
                          style={{ fontSize: `${uiSettings.optionFontPx}px` }}
                          className={
                            'p-3 sm:p-3.5 rounded-xl border flex items-start gap-2.5 transition-all ' +
                            (correct
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-semibold shadow-xs'
                              : 'bg-white/95 dark:bg-[#080E1C] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200')
                          }
                        >
                          <span
                            className={
                              'w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ' +
                              (correct
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300')
                            }
                          >
                            {imported.optionLabels?.[optionIndex] || String.fromCharCode(65 + optionIndex)}
                          </span>
                          <div className="min-w-0 flex-1 leading-snug pt-0.5">
                            <MathInlineRenderer
                              text={option || `Option ${String.fromCharCode(65 + optionIndex)}`}
                            />
                            {optionImages.map((url, imageIndex) => (
                              <img
                                key={url + imageIndex}
                                src={url}
                                alt="Option attachment"
                                loading="lazy"
                                className="mt-2 max-w-full max-h-48 object-contain rounded-lg bg-white p-1 border border-slate-200"
                              />
                            ))}
                          </div>
                          {correct && (
                            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 ml-auto shrink-0 mt-0.5" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Explanation & Ask AI Tutor */}
                <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="p-3.5 sm:p-4 rounded-xl bg-white/95 dark:bg-[#080E1B] border border-slate-200 dark:border-slate-800 text-xs flex-1 space-y-2.5 shadow-2xs">
                    <span className="font-bold text-slate-900 dark:text-slate-200 block">
                      সমাধান ও ব্যাখ্যা:
                    </span>
                    {showAnswerBadge && (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-500/60 text-emerald-950 dark:text-emerald-200 font-bold text-xs">
                        <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] uppercase">
                          Answer
                        </span>
                        <span>
                          [{imported.optionLabels?.[q.correctAnswer] || String.fromCharCode(65 + q.correctAnswer)}]{' '}
                        </span>
                        <MathInlineRenderer text={q.options[q.correctAnswer]} />
                      </div>
                    )}
                    {q.explanation ? (
                      <MathMarkdownRenderer
                        content={q.explanation}
                        stripAnswerHeader={showAnswerBadge}
                      />
                    ) : (
                      <span className="text-slate-600 dark:text-slate-300 font-medium block">
                        ঢাকা বিশ্ববিদ্যালয় ({q.subject}) প্রশ্ন সমাধান ও বিস্তৃত ব্যাখ্যা।
                      </span>
                    )}
                    {!hasVerifiedAnswer && q.questionType !== 'Written' && (
                      <p className="mt-1 text-amber-700 dark:text-amber-300">
                        এই প্রশ্নের answer key যাচাই করা যায়নি; অনুমান করে সঠিক উত্তর দেখানো হয়নি।
                      </p>
                    )}
                    {imported.explanationImageUrls
                      ?.filter((url) => {
                        const fileName = url.split('/').pop() || url;
                        return !(q.explanation || '').includes(fileName);
                      })
                      .map((url, imageIndex) => (
                        <img
                          key={url + imageIndex}
                          src={url}
                          alt="Explanation attachment"
                          loading="lazy"
                          className="mt-2 max-w-full max-h-64 object-contain rounded-lg bg-white p-1.5 border border-slate-200"
                        />
                      ))}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 sm:pt-1">
                    <button
                      onClick={() => toggleAiTutor(q.id)}
                      className={
                        'w-full sm:w-auto justify-center px-4 py-2.5 border rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm ' +
                        (expandedAiQuestionIds.has(q.id)
                          ? 'bg-sky-600 border-sky-400 text-white'
                          : 'bg-indigo-600 hover:bg-indigo-500 border-indigo-500 text-white')
                      }
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>{expandedAiQuestionIds.has(q.id) ? 'Hide AI Tutor' : 'Ask AI Tutor'}</span>
                      {expandedAiQuestionIds.has(q.id) ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {expandedAiQuestionIds.has(q.id) && (
                  <InlineAiTutor
                    question={q}
                    university={q.university}
                    session={q.session}
                    customApiKey={customApiKey}
                    onClose={() => toggleAiTutor(q.id)}
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
