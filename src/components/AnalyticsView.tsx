import React, { useState, useEffect } from 'react';
import { BarChart2, Award, Clock, CheckCircle2, XCircle, Trash2, Calendar, Play, Eye } from 'lucide-react';
import { getExamHistory, clearExamHistory, ExamHistoryItem } from '../utils/examHistory';
import { EXAM_SESSIONS, ExamSession } from '../data/questionBank';

interface AnalyticsViewProps {
  setCurrentView: (view: 'home' | 'questionBank' | 'exam' | 'analytics') => void;
  onSelectExam?: (session: ExamSession, mode: 'exam' | 'qb') => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ setCurrentView, onSelectExam }) => {
  const [history, setHistory] = useState<ExamHistoryItem[]>([]);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    setHistory(getExamHistory());
  }, []);

  const totalAttempts = history.length;
  const totalCorrect = history.reduce((sum, item) => sum + item.correctCount, 0);
  const totalWrong = history.reduce((sum, item) => sum + item.incorrectCount, 0);
  const totalAnswered = totalCorrect + totalWrong;
  const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const avgScorePercent =
    totalAttempts > 0
      ? Math.round(
          history.reduce(
            (sum, item) => sum + (item.totalMarks > 0 ? (item.score / item.totalMarks) * 100 : 0),
            0
          ) / totalAttempts
        )
      : 0;

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}m ${secs}s`;
  };

  const handleClear = () => {
    clearExamHistory();
    setHistory([]);
    setConfirmClear(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-4 sm:py-6 text-slate-900 dark:text-slate-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-50 via-white to-sky-50 dark:from-[#0C152C] dark:via-[#080E1D] dark:to-[#050914] p-5 sm:p-8 rounded-3xl shadow-lg border border-slate-200 dark:border-indigo-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-sky-400 text-xs font-bold uppercase tracking-wider">
            <BarChart2 className="w-4 h-4" /> Local Exam History & Performance
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-slate-950 dark:text-white">
            আপনার পরীক্ষার ফলাফল ও ইতিহাস (Exam History)
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
            আপনার সবগুলো পরীক্ষার স্কোর, সঠিক ও ভুল উত্তরের হিসাব স্বয়ংক্রিয়ভাবে আপনার ব্রাউজারে সেভ থাকে।
          </p>
        </div>

        {totalAttempts > 0 && (
          <div className="shrink-0">
            {!confirmClear ? (
              <button
                onClick={() => setConfirmClear(true)}
                className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900/60 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-800/60 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear History
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/60 p-2 rounded-xl border border-red-300 dark:border-red-800">
                <span className="text-[11px] font-bold text-red-700 dark:text-red-300 px-1">মুছে ফেলবেন?</span>
                <button
                  onClick={handleClear}
                  className="px-2.5 py-1 bg-red-600 text-white rounded-lg text-[11px] font-bold"
                >
                  হ্যাঁ
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-[11px] font-semibold"
                >
                  না
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-[#0B1222] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block">
            মোট পরীক্ষা (Exams)
          </span>
          <span className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-sky-400 mt-1 block">
            {totalAttempts}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            Locally saved attempts
          </span>
        </div>

        <div className="bg-white dark:bg-[#0B1222] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block">
            গড় নম্বর (Avg Score)
          </span>
          <span className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 mt-1 block">
            {avgScorePercent}%
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            Across all sessions
          </span>
        </div>

        <div className="bg-white dark:bg-[#0B1222] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block">
            সঠিকতার হার (Accuracy)
          </span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
            {overallAccuracy}%
          </span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 block font-medium">
            {totalCorrect} সঠিক / {totalWrong} ভুল
          </span>
        </div>

        <div className="bg-white dark:bg-[#0B1222] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block">
            সর্বমোট উত্তর (Answered)
          </span>
          <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-1 block">
            {totalAnswered}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            Questions locked
          </span>
        </div>
      </div>

      {/* Exam History List */}
      {history.length === 0 ? (
        <div className="bg-white dark:bg-[#0B1222] rounded-2xl p-8 sm:p-12 text-center border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="w-14 h-14 bg-indigo-50 dark:bg-[#0F1C38] text-indigo-600 dark:text-sky-400 border border-indigo-200 dark:border-indigo-900/50 rounded-2xl mx-auto flex items-center justify-center">
            <Award className="w-7 h-7" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            এখনো কোনো পরীক্ষার রেকর্ড নেই
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            হোম পেজ থেকে যেকোনো বিশ্ববিদ্যালয়ের সেশনে &ldquo;Start Exam&rdquo; দিয়ে পরীক্ষা সাবমিট করলেই আপনার ফলাফল এখানে স্বয়ংক্রিয়ভাবে জমা হবে।
          </p>
          <button
            onClick={() => setCurrentView('home')}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-md transition-all inline-flex items-center gap-2 mt-2"
          >
            <Clock className="w-4 h-4" /> সেশন নির্বাচন করুন (Go to Universities)
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white px-1">
            বিগত পরীক্ষার তালিকা ({history.length})
          </h2>
          {history.map((item) => {
            const matchedSession = EXAM_SESSIONS.find((s) => s.id === item.sessionId);
            const dateStr = new Date(item.timestamp).toLocaleString('bn-BD', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-[#0B1222] rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-600 text-white">
                      {item.university} • {item.session}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {dateStr}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> সময়: {formatDuration(item.timeTakenSeconds)}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white">
                    {item.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> সঠিক: {item.correctCount}
                    </span>
                    <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 font-semibold">
                      <XCircle className="w-3.5 h-3.5" /> ভুল: {item.incorrectCount}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      বাকি ছিল: {item.unattemptedCount}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                  <div className="text-left md:text-right">
                    <span className="block text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      {item.score.toFixed(2)}{' '}
                      <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                        / {item.totalMarks}
                      </span>
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                      Obtained Marks
                    </span>
                  </div>

                  {matchedSession && onSelectExam && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectExam(matchedSession, 'qb')}
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#111C35] dark:hover:bg-[#19284A] text-slate-800 dark:text-sky-300 text-xs font-semibold flex items-center gap-1 border border-slate-300 dark:border-indigo-900/50 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> সমাধান
                      </button>
                      <button
                        onClick={() => onSelectExam(matchedSession, 'exam')}
                        className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-colors"
                      >
                        <Play className="w-3.5 h-3.5" /> আবার দিন
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
