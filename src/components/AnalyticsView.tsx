import React from 'react';
import { BarChart2, Award, Clock, CheckCircle2, TrendingUp, ShieldCheck } from 'lucide-react';

interface AnalyticsViewProps {
  setCurrentView: (view: 'home' | 'questionBank' | 'exam' | 'analytics') => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ setCurrentView }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 text-slate-100">
      <div className="bg-gradient-to-r from-[#0C152C] via-[#080E1D] to-[#050914] p-6 sm:p-8 rounded-3xl shadow-xl border border-indigo-900/40 space-y-3">
        <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold uppercase tracking-wider">
          <BarChart2 className="w-4 h-4" /> Live Exam Performance & Readiness
        </div>
        <h1 className="text-xl sm:text-3xl font-black text-white">আপনার ভর্তি পরীক্ষার পারফরম্যান্স ড্যাশবোর্ড</h1>
        <p className="text-slate-300 text-xs sm:text-sm">
          Strict Auto-Lock পরীক্ষায় প্রাপ্ত স্কোর, নির্ভুলতার হার ও সময় ব্যবস্থাপনার বিশদ বিশ্লেষণ।
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0B1222] p-5 rounded-2xl border border-slate-800 space-y-2 shadow-sm">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Total Exams Attempted</span>
          <span className="text-3xl font-black text-white block">10+ Sessions Ready</span>
          <span className="text-[11px] text-sky-400 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" /> Full 5 Universities Available
          </span>
        </div>

        <div className="bg-[#0B1222] p-5 rounded-2xl border border-slate-800 space-y-2 shadow-sm">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Auto-Lock Strict Accuracy</span>
          <span className="text-3xl font-black text-emerald-400 block">Strict Mode</span>
          <span className="text-[11px] text-slate-400">Once-clicked permanent lock</span>
        </div>

        <div className="bg-[#0B1222] p-5 rounded-2xl border border-slate-800 space-y-2 shadow-sm">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Gemini 3.8 AI Assistance</span>
          <span className="text-3xl font-black text-indigo-400 block">Active</span>
          <span className="text-[11px] text-slate-400">Step-by-step doubt solver</span>
        </div>
      </div>

      <div className="bg-[#0B1222] rounded-2xl p-10 text-center border border-slate-800 space-y-4">
        <div className="w-14 h-14 bg-[#0F1C38] text-sky-400 border border-indigo-900/50 rounded-2xl mx-auto flex items-center justify-center">
          <Award className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-white">রিয়েল এডমিশন টেস্ট দিতে প্রস্তুত?</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
          DU, RU, JU, CU অথবা GST এর যেকোনো বিগত বছরের পুরো প্রশ্নপত্র এক পেজে অটো-লক সিস্টেমে পরীক্ষা দিয়ে নিজের অবস্থান যাচাই করুন।
        </p>
        <button
          onClick={() => setCurrentView('exam')}
          className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold rounded-xl text-xs shadow-md transition-all inline-flex items-center gap-2 mt-2"
        >
          <Clock className="w-4 h-4" /> Start Strict Auto-Lock Exam
        </button>
      </div>
    </div>
  );
};
