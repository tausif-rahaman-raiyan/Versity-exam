import React from 'react';
import { Bookmark, Sparkles, BookOpen } from 'lucide-react';

interface BookmarksViewProps {
  setCurrentView: (view: 'home' | 'questionBank' | 'exam' | 'bookmarks' | 'analytics') => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({ setCurrentView }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 text-slate-100">
      <div className="bg-gradient-to-r from-[#0C152C] via-[#080E1D] to-[#050914] p-6 sm:p-8 rounded-3xl shadow-xl border border-indigo-900/40 space-y-3">
        <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold uppercase tracking-wider">
          <Bookmark className="w-4 h-4 fill-current" /> Saved Questions Vault
        </div>
        <h1 className="text-xl sm:text-3xl font-black text-white">সংরক্ষিত প্রশ্নসমূহ (Bookmarked Qs)</h1>
        <p className="text-slate-300 text-xs sm:text-sm">
          পরীক্ষা বা কোশ্চেন ব্যাংক অনুশীলনের সময় যেসব প্রশ্ন কঠিন লেগেছিল সেগুলো পরবর্তীতে রিভিশনের জন্য এখানে সেভ থাকে।
        </p>
      </div>

      <div className="bg-[#0B1222] rounded-2xl p-12 text-center border border-slate-800 space-y-4">
        <div className="w-14 h-14 bg-[#0F1C38] text-sky-400 border border-indigo-900/50 rounded-2xl mx-auto flex items-center justify-center">
          <Bookmark className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-white">এখনো কোনো প্রশ্ন সেভ করা হয়নি</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
          Question Bank বা Auto-Lock Exam দেওয়ার সময় বুকমার্ক আইকনে ক্লিক করে যেকোনো জটিল ফিজিক্স, কেমিস্ট্রি বা ম্যাথ প্রবলেম এখানে জমা রাখতে পারেন।
        </p>
        <button
          onClick={() => setCurrentView('questionBank')}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-md transition-all inline-flex items-center gap-2 mt-2"
        >
          <BookOpen className="w-4 h-4" /> Browse Question Bank
        </button>
      </div>
    </div>
  );
};
