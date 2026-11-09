import React, { useState, useEffect } from 'react';
import { Question } from '../data/questionBank';
import { Sparkles, X, Send, Key, CheckCircle, AlertCircle, Copy, Volume2, ShieldCheck, HelpCircle } from 'lucide-react';
import { MathMarkdownRenderer, MathInlineRenderer } from './MathMarkdownRenderer';

interface AiTutorModalProps {
  question: Question | null;
  university?: string;
  session?: string;
  isOpen: boolean;
  onClose: () => void;
  customApiKey: string;
  setCustomApiKey: (key: string) => void;
}

export const AiTutorModal: React.FC<AiTutorModalProps> = ({
  question,
  university,
  session,
  isOpen,
  onClose,
  customApiKey,
  setCustomApiKey,
}) => {
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [userQuery, setUserQuery] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);
  const [tempKey, setTempKey] = useState<string>(customApiKey);
  const [keySavedMessage, setKeySavedMessage] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (isOpen && question) {
      setChatHistory([]);
      setUserQuery('');
      setErrorMsg('');
      fetchInitialExplanation(question);
    }
  }, [isOpen, question]);

  const fetchInitialExplanation = async (q: Question) => {
    setLoading(true);
    setExplanation('');
    setErrorMsg('');

    try {
      const res = await fetch('/api/gemini/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': customApiKey || '',
        },
        body: JSON.stringify({
          question: q.question,
          options: q.options,
          correctAnswer: q.options[q.correctAnswer],
          subject: q.subject,
          university: university || q.university,
          session: session || q.session,
          customApiKey: customApiKey || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.explanation && !data.error) {
        setExplanation(data.explanation);
      } else {
        if (data.isKeyError) {
          setErrorMsg('Gemini API Key missing or invalid. You can enter your personal Gemini API key in the API Key settings above or in AI Studio Secrets.');
        } else if (data.error && typeof data.error === 'string' && data.error.includes('503')) {
          setErrorMsg('Gemini model is currently experiencing high demand. Showing textbook admission solution below.');
        } else {
          setErrorMsg('Showing standard textbook solution with derivation below.');
        }
        // Fallback to textbook explanation
        setExplanation(`**সরাসরি সমাধান (Textbook Solution):**\n${q.explanation}\n\nসঠিক উত্তর: Option ${String.fromCharCode(65 + q.correctAnswer)}: ${q.options[q.correctAnswer]}`);
      }
    } catch (err: any) {
      setErrorMsg('Network error connecting to AI Tutor.');
      setExplanation(`**বিকল্প সমাধান (Standard Solution):**\n${q.explanation}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAskFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim() || !question || loading) return;

    const currentQuery = userQuery.trim();
    setUserQuery('');
    setChatHistory(prev => [...prev, { sender: 'user', text: currentQuery }]);
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': customApiKey || '',
        },
        body: JSON.stringify({
          question: question.question,
          options: question.options,
          correctAnswer: question.options[question.correctAnswer],
          subject: question.subject,
          university: university || question.university,
          session: session || question.session,
          userQuestion: currentQuery,
          customApiKey: customApiKey || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.explanation) {
        setChatHistory(prev => [...prev, { sender: 'ai', text: data.explanation }]);
      } else {
        setChatHistory(prev => [
          ...prev,
          {
            sender: 'ai',
            text: data.error || 'ক্ষমা করবেন, উত্তর তৈরিতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
          },
        ]);
      }
    } catch (err) {
      setChatHistory(prev => [
        ...prev,
        { sender: 'ai', text: 'Error connecting to Gemini API. Please check connection.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*#]/g, ''));
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSaveKey = () => {
    const trimmed = tempKey.trim();
    setCustomApiKey(trimmed);
    try {
      localStorage.setItem('custom_gemini_api_key', trimmed);
      document.cookie = `custom_gemini_api_key=${encodeURIComponent(trimmed)}; path=/; max-age=31536000; SameSite=Strict`;
    } catch (e) {
      console.warn('Storage warning:', e);
    }
    setKeySavedMessage(true);
    setTimeout(() => setKeySavedMessage(false), 3000);
    if (question) {
      fetchInitialExplanation(question);
    }
  };

  if (!isOpen || !question) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#0B1222] border border-indigo-500/30 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-[#0E172E] to-slate-900 p-5 border-b border-indigo-900/40 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  Ask AI Tutor (Gemini 3.8)
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Live
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {question.subject} • {university || question.university} ({session || question.session})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center gap-1.5"
              title="Configure API Key"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">API Key</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* API Key Panel (Collapsible) */}
        {showKeyInput && (
          <div className="bg-[#080D1A] p-4 border-b border-slate-800 text-xs space-y-3">
            <div className="flex items-center justify-between text-slate-300">
              <span className="font-semibold flex items-center gap-1.5">
                <Key className="w-4 h-4 text-amber-400" /> Gemini API Key Configuration
              </span>
              <span className="text-slate-500">Auto-injected via AI Studio Secrets</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              The app automatically uses the server environment API key from AI Studio. If you prefer to use your own personal Google AI Studio key, enter it below:
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                placeholder="AIzaSy..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleSaveKey}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition-colors"
              >
                Save Key
              </button>
            </div>
            {keySavedMessage && (
              <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                <CheckCircle className="w-3.5 h-3.5" /> API Key saved successfully! Reloading explanation...
              </span>
            )}
          </div>
        )}

        {/* Question Context Banner */}
        <div className="bg-[#0C152B] p-4 border-b border-slate-800/80 text-xs space-y-2 shrink-0">
          <div className="text-slate-200 font-medium leading-relaxed">
            <MathInlineRenderer text={question.question.replace(/^(\d+\.?\s*)?(\[[^\]]+\]\s*)?/, '').trim()} />
          </div>
          <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 font-semibold inline-flex items-center gap-1">
              <span>Correct: Option {String.fromCharCode(65 + question.correctAnswer)}</span>
              <span>(<MathInlineRenderer text={question.options[question.correctAnswer]} />)</span>
            </span>
          </div>
        </div>

        {/* Explanation & Chat Scroll Area */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs leading-relaxed">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Primary AI Explanation */}
          <div className="bg-[#0E182F] rounded-2xl p-5 border border-indigo-900/40 text-slate-200 space-y-3 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-indigo-300 flex items-center gap-1.5 text-xs">
                <Sparkles className="w-4 h-4 text-sky-400" /> Complete Analysis & Shortcuts
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSpeak(explanation)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  title="Read Aloud"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleCopyText(explanation)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  title="Copy Solution"
                >
                  {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {loading && !explanation ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-slate-400 font-medium">Gemini AI Tutor is formulating admission shortcut & concept...</p>
              </div>
            ) : (
              <MathMarkdownRenderer content={explanation} />
            )}
          </div>

          {/* Follow-up Chat History */}
          {chatHistory.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border ${
                item.sender === 'user'
                  ? 'bg-indigo-950/60 border-indigo-500/40 ml-8 text-indigo-100'
                  : 'bg-[#0E182F] border-slate-800 mr-8 text-slate-200'
              }`}
            >
              <div className="font-semibold text-[11px] mb-1 text-slate-400">
                {item.sender === 'user' ? 'আপনার প্রশ্ন (Your Question):' : 'AI Tutor Response:'}
              </div>
              <MathMarkdownRenderer content={item.text} />
            </div>
          ))}

          {loading && chatHistory.length > 0 && (
            <div className="p-3 text-slate-400 italic flex items-center gap-2">
              <span className="w-3 h-3 bg-indigo-500 rounded-full animate-ping"></span>
              AI Tutor is analyzing your doubt...
            </div>
          )}
        </div>

        {/* Input Bar for Follow-up Doubt */}
        <form onSubmit={handleAskFollowUp} className="p-4 bg-[#080D1A] border-t border-slate-800 flex gap-2 shrink-0">
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="কোনো সন্দেহ আছে? যেমন: 'ক্যালকুলেটর ছাড়া কিভাবে করব?' বা 'শর্টকাট ট্রিক কী?'"
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
          />
          <button
            type="submit"
            disabled={loading || !userQuery.trim()}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/30 shrink-0"
          >
            <Send className="w-3.5 h-3.5" /> Ask
          </button>
        </form>
      </div>
    </div>
  );
};
