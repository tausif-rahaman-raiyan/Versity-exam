import React, { useMemo, useState } from 'react';
import {
  BarChart3,
  Trash2,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  BookOpen,
  AlertTriangle
} from 'lucide-react';
import { toBnDigits, uiTexts } from '../data/translations';
import type { Attempt, Session, ViewMode } from '../types';
import { Footer } from './Footer';

type AnalyticsViewProps = {
  history: Attempt[];
  sessions: Session[];
  onClearHistory: () => void;
  onRetakeSession: (session: Session) => void;
  onChangeView: (view: ViewMode) => void;
  onOpenApiKeyModal: () => void;
};

function formatDuration(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins}m ${secs}s`;
}

function formatBnDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('bn-BD', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return iso;
  }
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  history,
  sessions,
  onClearHistory,
  onRetakeSession,
  onChangeView,
  onOpenApiKeyModal
}) => {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const stats = useMemo(() => {
    const totalExams = history.length;
    if (totalExams === 0) {
      return {
        totalExams: 0,
        avgScorePct: 0,
        overallAccuracyPct: 0,
        totalCorrect: 0,
        totalWrong: 0
      };
    }

    let sumScorePct = 0;
    let totalCorrect = 0;
    let totalWrong = 0;

    for (const att of history) {
      const pct = att.totalMarks > 0 ? (att.score / att.totalMarks) * 100 : 0;
      sumScorePct += pct;
      totalCorrect += att.correctCount;
      totalWrong += att.incorrectCount;
    }

    const avgScorePct = Math.round((sumScorePct / totalExams) * 10) / 10;
    const overallAccuracyPct =
      totalCorrect + totalWrong > 0
        ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 1000) / 10
        : 0;

    return {
      totalExams,
      avgScorePct,
      overallAccuracyPct,
      totalCorrect,
      totalWrong
    };
  }, [history]);

  const handleConfirmDelete = () => {
    onClearHistory();
    setConfirmDeleteOpen(false);
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-sky-50 dark:from-[#0B1325] dark:via-[#080E1C] dark:to-[#050914] border-2 border-indigo-200 dark:border-indigo-900/60 shadow-sm">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
              <BarChart3 className="w-7 h-7 text-indigo-600 dark:text-sky-400 shrink-0" />
              <span>{uiTexts.analytics.title}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {uiTexts.analytics.subtitle}
            </p>
          </div>

          {history.length > 0 && (
            <button
              type="button"
              onClick={() => setConfirmDeleteOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/70 text-rose-600 dark:text-rose-300 border border-rose-300 dark:border-rose-800 text-xs sm:text-sm font-bold shrink-0 cursor-pointer self-start sm:self-auto"
            >
              <Trash2 className="w-4 h-4" />
              <span>{uiTexts.analytics.deleteHistoryBtn}</span>
            </button>
          )}
        </div>

        {/* Empty State or Analytics Dashboard */}
        {history.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-50 dark:bg-[#0B1325] border-2 border-dashed border-indigo-300 dark:border-indigo-800/70 text-center max-w-2xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/20 border border-indigo-500/30 text-indigo-600 dark:text-sky-400 flex items-center justify-center mx-auto">
              <BarChart3 className="w-7 h-7" />
            </div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {uiTexts.analytics.emptyTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {uiTexts.analytics.emptyDesc}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onChangeView('home')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>{uiTexts.analytics.browseBtn}</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* 4 Stat Cards (§12) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/90 dark:bg-[#0C1933] border-2 border-blue-200 dark:border-blue-800/60">
                <div className="text-xl sm:text-3xl font-black text-blue-600 dark:text-sky-400 tabular-nums">
                  {toBnDigits(stats.totalExams)}
                </div>
                <div className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-1">
                  {uiTexts.analytics.statTotalExams}
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-purple-50/90 dark:bg-[#1B0F2E] border-2 border-purple-200 dark:border-purple-800/60">
                <div className="text-xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 tabular-nums">
                  {toBnDigits(stats.avgScorePct)}%
                </div>
                <div className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-1">
                  {uiTexts.analytics.statAvgScore}
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 dark:bg-[#231608] border-2 border-amber-200 dark:border-amber-800/60">
                <div className="text-xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 tabular-nums">
                  {toBnDigits(stats.overallAccuracyPct)}%
                </div>
                <div className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-1">
                  {uiTexts.analytics.statAccuracy}
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/90 dark:bg-[#072219] border-2 border-emerald-200 dark:border-emerald-800/60">
                <div className="text-xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {toBnDigits(stats.totalCorrect)} /{' '}
                  <span className="text-rose-600 dark:text-rose-400">
                    {toBnDigits(stats.totalWrong)}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-1">
                  {uiTexts.analytics.statCorrectWrong}
                </div>
              </div>
            </div>

            {/* Recent Results List */}
            <div className="space-y-3">
              <h2 className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-white">
                {uiTexts.analytics.recentResultsHeading} ({toBnDigits(history.length)})
              </h2>

              <div className="space-y-3">
                {history.map((att) => {
                  const matchedSession = sessions.find((s) => s.id === att.sessionId);

                  return (
                    <div
                      key={att.id}
                      className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0B1325] border-2 border-slate-200 dark:border-indigo-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
                    >
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-lg bg-indigo-600 text-white text-[11px] font-black uppercase">
                            {att.institution} • {att.session}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{formatBnDate(att.timestamp)}</span>
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{formatDuration(att.timeTakenSeconds)}</span>
                          </span>
                        </div>

                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                          {att.title}
                        </h3>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                        <div className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-[#070C18] border border-indigo-200 dark:border-indigo-800 text-xs sm:text-sm font-black text-indigo-700 dark:text-sky-300 tabular-nums">
                          Score: {toBnDigits(att.score)} / {toBnDigits(att.totalMarks)}
                        </div>

                        <div className="flex items-center gap-3 text-xs sm:text-sm font-bold tabular-nums">
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{toBnDigits(att.correctCount)}</span>
                          </span>
                          <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400">
                            <XCircle className="w-4 h-4" />
                            <span>{toBnDigits(att.incorrectCount)}</span>
                          </span>
                        </div>

                        {matchedSession && (
                          <button
                            type="button"
                            onClick={() => onRetakeSession(matchedSession)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Retake</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete History Confirmation Modal (§12) */}
      {confirmDeleteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
          onClick={() => setConfirmDeleteOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white dark:bg-[#0B1325] border-2 border-rose-300 dark:border-rose-800 shadow-2xl p-5 sm:p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                {uiTexts.analytics.deleteConfirmTitle}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {uiTexts.analytics.deleteConfirmDesc(history.length)}
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer"
              >
                {uiTexts.analytics.cancelBtn}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-sm cursor-pointer"
              >
                {uiTexts.analytics.confirmDeleteBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer onChangeView={onChangeView} onOpenApiKeyModal={onOpenApiKeyModal} />
    </div>
  );
};
