import React, { useEffect, useState } from 'react';
import { KeyRound, ExternalLink, Trash2, X, CheckCircle2 } from 'lucide-react';

type ApiKeyModalProps = {
  isOpen: boolean;
  currentKey: string;
  onClose: () => void;
  onSaveKey: (newKey: string) => void;
};

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  currentKey,
  onClose,
  onSaveKey
}) => {
  const [inputKey, setInputKey] = useState(currentKey);

  useEffect(() => {
    if (isOpen) {
      setInputKey(currentKey);
    }
  }, [isOpen, currentKey]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveKey(inputKey.trim());
    onClose();
  };

  const handleRemove = () => {
    onSaveKey('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white dark:bg-[#0B1325] border-2 border-indigo-200 dark:border-indigo-800 shadow-2xl p-5 sm:p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-sky-400 shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                Gemini API Key Setup
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                AI Tutor Admission Coach সক্রিয় করতে আপনার ফ্রি Gemini API Key দিন
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label
              htmlFor="gemini-api-key-input"
              className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Your Gemini API Key (Stored in your browser only)
            </label>
            <input
              id="gemini-api-key-input"
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="AIzaSy..."
              autoComplete="off"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#070C18] border-2 border-slate-300 dark:border-indigo-900/70 focus:border-indigo-600 dark:focus:border-sky-400 outline-none text-sm font-mono text-slate-900 dark:text-white"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-[#070D1D] border border-indigo-200/80 dark:border-indigo-900/60 space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <div className="font-bold text-indigo-800 dark:text-sky-300">
              কিভাবে ফ্রি API Key পাবেন (3-Step Guide):
            </div>
            <ol className="list-decimal pl-4 space-y-1">
              <li>নিচের লিংকে ক্লিক করে Google AI Studio ওপেন করুন।</li>
              <li>আপনার Google অ্যাকাউন্ট দিয়ে লগইন করুন।</li>
              <li>
                <strong>Create API Key</strong> বাটনে ক্লিক করে Key কপি করে উপরে পেস্ট করুন।
              </li>
            </ol>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition-colors"
            >
              <span>Get Free Gemini API Key from Google AI Studio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="flex items-center justify-between gap-2 pt-2">
            {currentKey ? (
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/70 text-rose-600 dark:text-rose-300 border border-rose-300 dark:border-rose-800 text-xs font-bold cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove Key</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save API Key</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
