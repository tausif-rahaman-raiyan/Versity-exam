import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../data/questionBank';
import { Sparkles, Send, CheckCircle, AlertCircle, Copy, Volume2, ShieldCheck, ChevronUp, Zap } from 'lucide-react';
import { MathMarkdownRenderer } from './MathMarkdownRenderer';

interface InlineAiTutorProps {
  question: Question;
  university?: string;
  session?: string;
  customApiKey: string;
  onClose: () => void;
}

export const InlineAiTutor: React.FC<InlineAiTutorProps> = ({
  question,
  university,
  session,
  customApiKey,
  onClose,
}) => {
  const [explanation, setExplanation] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [userQuery, setUserQuery] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let isMounted = true;
    abortControllerRef.current?.abort();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const streamExplanation = async () => {
      setIsStreaming(true);
      setExplanation('');
      setErrorMsg('');

      try {
        const res = await fetch('/api/gemini/explain-stream', {
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
            customApiKey: customApiKey || undefined,
          }),
          signal: abortController.signal,
        });

        if (!res.ok || !res.body) {
          throw new Error('Streaming failed, falling back to instant answer.');
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let fullText = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('data: ')) {
              try {
                const payload = JSON.parse(trimmed.slice(6));
                if (payload.text && isMounted) {
                  fullText += payload.text;
                  setExplanation(fullText);
                }
                if (payload.error && isMounted) {
                  setErrorMsg(payload.error);
                }
              } catch (e) {
                // Ignore parse errors on partial chunks
              }
            }
          }
        }
      } catch (err: any) {
        if (err.name === 'AbortError' || !isMounted) return;

        // Fallback to textbook explanation
        setErrorMsg('Showing instant verified admission solution below.');
        setExplanation(
          `**সরাসরি সমাধান (Textbook Solution):**\n${question.explanation}\n\nসঠিক উত্তর: Option ${String.fromCharCode(
            65 + question.correctAnswer
          )}: ${question.options[question.correctAnswer]}`
        );
      } finally {
        if (isMounted) setIsStreaming(false);
      }
    };

    streamExplanation();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [question, university, session, customApiKey]);

  const handleAskFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim() || isStreaming) return;

    const currentQuery = userQuery.trim();
    setUserQuery('');
    const newChatIndex = chatHistory.length;
    setChatHistory(prev => [
      ...prev,
      { sender: 'user', text: currentQuery },
      { sender: 'ai', text: '' },
    ]);
    setIsStreaming(true);

    try {
      const res = await fetch('/api/gemini/explain-stream', {
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

      if (!res.ok || !res.body) throw new Error('Network error');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let reply = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            try {
              const payload = JSON.parse(trimmed.slice(6));
              if (payload.text) {
                reply += payload.text;
                setChatHistory(prev => {
                  const updated = [...prev];
                  updated[newChatIndex + 1] = { sender: 'ai', text: reply };
                  return updated;
                });
              }
            } catch (e) {}
          }
        }
      }
    } catch (err) {
      setChatHistory(prev => {
        const updated = [...prev];
        updated[newChatIndex + 1] = {
          sender: 'ai',
          text: 'Error generating follow-up response. Please check your network connection.',
        };
        return updated;
      });
    } finally {
      setIsStreaming(false);
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
      const clean = text.replace(/[*#$]/g, '').replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1 divided by $2');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="mt-4 rounded-2xl bg-gradient-to-b from-[#091124] to-[#060B18] border border-indigo-500/40 shadow-xl overflow-hidden animate-fadeIn transition-all">
      {/* Accordion Header Strip */}
      <div className="bg-[#0B152F] px-4 py-3 border-b border-indigo-900/50 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                AI Tutor (Gemini 3.8) Admission Coach
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" /> Fast Stream
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              {question.subject} • {university || question.university} ({session || question.session})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {explanation && !isStreaming && (
            <>
              <button
                onClick={() => handleSpeak(explanation)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Read Aloud"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleCopyText(explanation)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Copy Solution"
              >
                {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors flex items-center gap-1 border border-slate-700/60"
            title="Collapse AI Coach"
          >
            <span>বন্ধ করুন</span>
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Accordion Content Area */}
      <div className="p-4 sm:p-5 space-y-4 text-xs">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Initial Loading Pulse before first token arrives */}
        {isStreaming && !explanation && (
          <div className="py-4 text-left flex items-center gap-2.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping shrink-0" />
            <span className="text-xs font-medium text-sky-300">
              Gemini AI Coach শর্টকাট ও সমাধান লাইভ লিখছে...
            </span>
          </div>
        )}

        {/* Primary Explanation Box with Live Streaming Content */}
        {explanation && (
          <div className="bg-[#070D1D] rounded-xl p-4 sm:p-5 border border-indigo-950/80 shadow-inner relative">
            <MathMarkdownRenderer content={explanation} />
            {isStreaming && (
              <span className="inline-block w-2 h-4 bg-sky-400 animate-pulse ml-1 align-middle" />
            )}
          </div>
        )}

        {/* Follow-up Chat History */}
        {chatHistory.map((item, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-xl border ${
              item.sender === 'user'
                ? 'bg-indigo-950/60 border-indigo-500/40 ml-6 text-indigo-100'
                : 'bg-[#070D1D] border-slate-800 mr-6 text-slate-200'
            }`}
          >
            <div className="font-semibold text-[10px] mb-1 text-slate-400">
              {item.sender === 'user' ? 'আপনার প্রশ্ন (Your Question):' : 'AI Coach উত্তর:'}
            </div>
            {item.text ? (
              <MathMarkdownRenderer content={item.text} />
            ) : (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-1">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" /> উত্তর লেখা হচ্ছে...
              </div>
            )}
          </div>
        ))}

        {/* Inline Follow-up Doubt Form */}
        <form onSubmit={handleAskFollowUp} className="pt-2 flex gap-2">
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            disabled={isStreaming}
            placeholder="এই প্রশ্নের উপর আর কোনো প্রশ্ন বা শর্টকাট জানার আছে? যেমন: 'ক্যালকুলেটর ছাড়া কিভাবে করব?'"
            className="flex-1 bg-[#070C1A] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isStreaming || !userQuery.trim()}
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white font-semibold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-md shadow-sky-600/30 shrink-0"
          >
            <Send className="w-3.5 h-3.5" /> Ask
          </button>
        </form>
      </div>
    </div>
  );
};
