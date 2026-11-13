import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Play,
  Search,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Clock
} from 'lucide-react';
import { findSubjectDef, getSubjectDisplayName, getSubjectTheme } from '../data/subjects';
import {
  defaultOptionLabelsBn,
  defaultOptionLabelsEn,
  extractBilingualText,
  toBnDigits,
  uiTexts
} from '../data/translations';
import type { Question, Session, UiSettings, ViewMode } from '../types';
import { loadSessionQuestions } from '../utils/questionLoader';
import { hasValidGeminiKey } from '../utils/storage';
import { AiTutorPanel } from './AiTutorPanel';
import { ExplanationCard } from './ExplanationCard';
import { Footer } from './Footer';
import { MathMarkdown } from './MathMarkdown';

type QuestionBankViewProps = {
  session: Session;
  uiSettings: UiSettings;
  apiKey: string;
  language: 'bn' | 'en';
  onChangeLanguage: (lang: 'bn' | 'en') => void;
  onBackHome: () => void;
  onStartExam: (session: Session) => void;
  onOpenApiKeyModal: () => void;
  onRequireApiKeyToast: () => void;
  onChangeView: (view: ViewMode) => void;
};

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  session,
  uiSettings,
  apiKey,
  language,
  onChangeLanguage,
  onBackHome,
  onStartExam,
  onOpenApiKeyModal,
  onRequireApiKeyToast,
  onChangeView
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [openTutorIds, setOpenTutorIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setSelectedSubject('ALL');
    setSearchQuery('');
    setOpenTutorIds({});

    loadSessionQuestions(session.id).then((loaded) => {
      if (!cancelled) {
        setQuestions(loaded);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [session.id]);

  // Unique subjects present in loaded questions
  const availableSubjects = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const q of questions) {
      const canonical = findSubjectDef(q.subject).id;
      if (!seen.has(canonical)) {
        seen.add(canonical);
        list.push(canonical);
      }
    }
    return list;
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return questions.filter((item) => {
      if (selectedSubject !== 'ALL') {
        const canonical = findSubjectDef(item.subject).id;
        if (canonical !== selectedSubject) return false;
      }

      if (q) {
        const matchQ = item.question.toLowerCase().includes(q);
        const matchExp = (item.explanation || '').toLowerCase().includes(q);
        const matchSub = item.subject.toLowerCase().includes(q);
        const matchOpt = item.options.some((o) => o.toLowerCase().includes(q));
        if (!matchQ && !matchExp && !matchSub && !matchOpt) return false;
      }

      return true;
    });
  }, [questions, selectedSubject, searchQuery]);

  const handleToggleTutor = (questionId: string) => {
    const currentlyOpen = Boolean(openTutorIds[questionId]);
    if (currentlyOpen) {
      setOpenTutorIds((prev) => ({ ...prev, [questionId]: false }));
      return;
    }

    if (!hasValidGeminiKey(apiKey)) {
      onRequireApiKeyToast();
      return;
    }

    setOpenTutorIds((prev) => ({ ...prev, [questionId]: true }));
  };

  const displayCount = questions.length > 0 ? questions.length : session.totalQuestions;

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Top bar: Back button + Bilingual Toggle + Start Strict Exam */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#0E172A] dark:hover:bg-slate-800 border border-slate-300 dark:border-indigo-900/60 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{uiTexts.questionBank.backToSessions}</span>
          </button>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              disabled={questions.length === 0}
              onClick={() => onStartExam(session)}
              title={
                questions.length === 0
                  ? uiTexts.home.comingSoonBtnHint
                  : uiTexts.questionBank.startStrictExam
              }
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 transition-colors cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>{uiTexts.questionBank.startStrictExam}</span>
            </button>
          </div>
        </div>

        {/* Header Banner */}
        <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-sky-50 dark:from-[#0B1325] dark:via-[#080E1C] dark:to-[#050914] border-2 border-indigo-200 dark:border-indigo-900/60 shadow-md space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs font-black uppercase tracking-wider">
              {session.institution}
              {session.unit ? `-${session.unit}` : ''}
            </span>
            <span className="px-3 py-1 rounded-lg bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-200 border border-sky-300 dark:border-sky-800 text-xs font-bold">
              {uiTexts.questionBank.sessionPrefix} {session.session}
            </span>
            <span className="px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 text-xs font-bold">
              {uiTexts.questionBank.qbBadge}
            </span>
          </div>

          <div>
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {session.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              {uiTexts.questionBank.subtitleTemplate(
                toBnDigits(displayCount, true)
              )}
            </p>
          </div>

          {/* Search input */}
          {questions.length > 0 && (
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={uiTexts.questionBank.searchPlaceholder}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#070C18] border border-slate-300 dark:border-indigo-900/70 focus:border-indigo-600 dark:focus:border-sky-400 outline-none text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>
          )}

          {/* Subject Filter Chips — compact 2 per line on mobile, flex wrap on sm+ */}
          {availableSubjects.length > 0 && (
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setSelectedSubject('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                  selectedSubject === 'ALL'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm ring-2 ring-indigo-500/30'
                    : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200 dark:bg-[#070C18] dark:text-slate-300 dark:border-indigo-900/60'
                }`}
              >
                {uiTexts.questionBank.allSubjects} ({toBnDigits(questions.length, true)})
              </button>

              {availableSubjects.map((subId) => {
                const theme = getSubjectTheme(subId);
                const active = selectedSubject === subId;
                const count = questions.filter(
                  (q) => findSubjectDef(q.subject).id === subId
                ).length;

                return (
                  <button
                    key={subId}
                    type="button"
                    onClick={() => setSelectedSubject(subId)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                      active ? theme.filterActive : theme.filterInactive
                    }`}
                  >
                    {getSubjectDisplayName(subId, 'bn')} ({toBnDigits(count, true)})
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Loading / Empty / Question Cards */}
        {loading ? (
          <div className="p-12 rounded-3xl bg-slate-50 dark:bg-[#0B1325] border-2 border-indigo-200/60 dark:border-indigo-900/50 text-center space-y-3">
            <div className="w-8 h-8 rounded-full border-3 border-indigo-600 border-t-transparent animate-spin mx-auto" />
            <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
              প্রশ্নপত্র লোড হচ্ছে (Loading session questions)...
            </div>
          </div>
        ) : questions.length === 0 ? (
          /* Friendly Coming Soon Empty State (§16.1) */
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-50 dark:bg-[#0B1325] border-2 border-dashed border-indigo-300 dark:border-indigo-800/70 text-center max-w-2xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/20 border border-indigo-500/30 text-indigo-600 dark:text-sky-400 flex items-center justify-center mx-auto">
              <Clock className="w-7 h-7" />
            </div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {uiTexts.questionBank.comingSoonTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {uiTexts.questionBank.comingSoonDesc.replace('<sessionId>', session.id)}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onBackHome}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-sm cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{uiTexts.questionBank.backToSessions}</span>
              </button>
            </div>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="p-10 rounded-3xl bg-slate-50 dark:bg-[#0B1325] border-2 border-dashed border-slate-300 dark:border-indigo-900/60 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
            <div className="text-base font-extrabold text-slate-800 dark:text-slate-200">
              {uiTexts.questionBank.noSearchMatch}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredQuestions.map((q) => {
              const sTheme = getSubjectTheme(q.subject);
              const isWritten = q.questionType === 'Written' || q.options.length === 0;
              const isUnverified =
                !isWritten && (q.answerVerified === false || q.correctAnswer < 0);
              const defaultLabels =
                language === 'en' ? defaultOptionLabelsEn : defaultOptionLabelsBn;
              const optionLabels = q.optionLabels?.length ? q.optionLabels : defaultLabels;
              const isTutorOpen = Boolean(openTutorIds[q.id]);

              const questionStem = extractBilingualText(q.question, language);
              const explanationText = extractBilingualText(q.explanation, language);

              return (
                <article
                  key={q.id}
                  className={`p-4 sm:p-6 rounded-3xl transition-colors ${sTheme.borderClass} ${sTheme.bgClass}`}
                >
                  {/* Top Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-xl text-xs font-extrabold border ${sTheme.numBadge}`}
                      >
                        {uiTexts.questionBank.questionLabel}{' '}
                        {toBnDigits(q.number, language === 'bn')}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-xl text-xs font-bold ${sTheme.badgeBg}`}
                      >
                        {getSubjectDisplayName(q.subject, language)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isWritten && (
                        <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-white text-xs font-bold">
                          {uiTexts.questionBank.writtenBadge}
                        </span>
                      )}
                      {isUnverified && (
                        <span className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-xs font-bold">
                          {uiTexts.questionBank.unverifiedBadge}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Question Stem */}
                  <div
                    className="font-bold text-slate-900 dark:text-white mb-4"
                    style={{ fontSize: `${uiSettings.questionFontPx}px` }}
                  >
                    <MathMarkdown content={questionStem} />
                  </div>

                  {/* Question Images */}
                  {q.questionImageUrls && q.questionImageUrls.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-4">
                      {q.questionImageUrls.map((url, imgIdx) => (
                        <img
                          key={imgIdx}
                          src={url}
                          alt={`Question ${q.number} figure ${imgIdx + 1}`}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="max-w-full max-h-72 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white p-2 object-contain"
                        />
                      ))}
                    </div>
                  )}

                  {/* MCQ Options List */}
                  {!isWritten && q.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = !isUnverified && q.correctAnswer === optIdx;
                        const optText = extractBilingualText(opt, language);
                        const optImages = q.optionImageUrls?.[optIdx] || [];

                        return (
                          <div
                            key={optIdx}
                            style={{ fontSize: `${uiSettings.optionFontPx}px` }}
                            className={`p-3 rounded-2xl border flex items-start justify-between gap-2.5 transition-colors ${
                              isCorrect
                                ? 'border-emerald-500/70 bg-emerald-50 dark:bg-emerald-950/50 ring-1 ring-emerald-500/30'
                                : 'border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#070C18]/90'
                            }`}
                          >
                            <div className="flex items-start gap-2.5 min-w-0 flex-1">
                              <span
                                className={`w-7 h-7 rounded-lg text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5 ${
                                  isCorrect
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                                }`}
                              >
                                {optionLabels[optIdx] || optIdx + 1}
                              </span>
                              <div className="min-w-0 flex-1 space-y-2">
                                <div
                                  className={
                                    isCorrect
                                      ? 'font-bold text-emerald-950 dark:text-emerald-100'
                                      : 'font-medium text-slate-800 dark:text-slate-200'
                                  }
                                >
                                  <MathMarkdown content={optText} />
                                </div>
                                {optImages.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {optImages.map((u, uIdx) => (
                                      <img
                                        key={uIdx}
                                        src={u}
                                        alt={`Option ${optIdx + 1} figure`}
                                        loading="lazy"
                                        referrerPolicy="no-referrer"
                                        className="max-w-full max-h-40 rounded-xl border border-slate-200 dark:border-slate-700 bg-white p-1 object-contain"
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {isCorrect && (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-1" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Explanation & Solution Block */}
                  {(explanationText ||
                    (q.explanationImageUrls && q.explanationImageUrls.length > 0)) && (
                    <div className="mb-3">
                      <ExplanationCard
                        explanationText={explanationText}
                        explanationImageUrls={q.explanationImageUrls}
                        fontSizePx={uiSettings.explanationFontPx}
                      />
                    </div>
                  )}

                  {/* AI Tutor Toggle Button */}
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => handleToggleTutor(q.id)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        isTutorOpen
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                          : 'bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white shadow-sm shadow-indigo-500/20'
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>
                        {isTutorOpen
                          ? uiTexts.questionBank.closeAiTutor
                          : uiTexts.questionBank.openAiTutor}
                      </span>
                    </button>
                  </div>

                  {/* Inline AI Tutor Panel */}
                  {isTutorOpen && (
                    <AiTutorPanel
                      question={q}
                      apiKey={apiKey}
                      explanationFontPx={uiSettings.explanationFontPx}
                      onOpenApiKeyModal={onOpenApiKeyModal}
                      onClose={() =>
                        setOpenTutorIds((prev) => ({ ...prev, [q.id]: false }))
                      }
                    />
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>

      <Footer onChangeView={onChangeView} onOpenApiKeyModal={onOpenApiKeyModal} />
    </div>
  );
};
