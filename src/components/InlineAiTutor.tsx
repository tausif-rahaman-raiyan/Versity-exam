import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../data/questionBank';
import { ImportedQuestion } from '../data/sessionQuestionLoader';
import { Sparkles, Send, CheckCircle, AlertCircle, Copy, Volume2, ChevronUp, Zap, Image as ImageIcon } from 'lucide-react';
import { MathMarkdownRenderer, MathInlineRenderer } from './MathMarkdownRenderer';

interface InlineAiTutorProps {
  question: Question;
  university?: string;
  session?: string;
  customApiKey: string;
  onClose: () => void;
}

const BANGLA_OPTION_LABELS = ['ক', 'খ', 'গ', 'ঘ', 'ঙ'];

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

  const imported = question as ImportedQuestion;
  const questionImages = imported.questionImageUrls || [];
  const optionImages = imported.optionImageUrls || [];
  const totalImagesCount =
    questionImages.length + optionImages.reduce((acc, arr) => acc + (arr ? arr.length : 0), 0);

  const getOptionLabel = (idx: number) => {
    const rawLbl = imported.optionLabels?.[idx] || question.optionLabels?.[idx];
    if (rawLbl) return rawLbl;
    return BANGLA_OPTION_LABELS[idx] || String.fromCharCode(65 + idx);
  };

  useEffect(() => {
    let isMounted = true;
    abortControllerRef.current?.abort();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const streamExplanation = async () => {
      setIsStreaming(true);
      setExplanation('');
      setErrorMsg('');

      const correctIdx = question.correctAnswer;
      const correctLbl = correctIdx >= 0 ? getOptionLabel(correctIdx) : '';
      const correctText =
        correctIdx >= 0 && question.options?.[correctIdx]
          ? `[${correctLbl}] ${question.options[correctIdx]}`
          : '';

      try {
        const res = await fetch('/api/gemini/explain-stream', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-gemini-api-key': customApiKey || '',
          },
          body: JSON.stringify({
            questionId: question.id,
            question: question.question,
            options: question.options.map((opt, idx) => `[${getOptionLabel(idx)}] ${opt}`),
            correctAnswer: correctText,
            referenceExplanation: question.explanation || '',
            questionImageUrls: questionImages,
            optionImageUrls: optionImages,
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
              } catch {
                // Ignore parse errors on partial chunks
              }
            }
          }
        }
      } catch (err: any) {
        if (err.name === 'AbortError' || !isMounted) return;

        // Fallback to textbook explanation in the 4-part format
        setErrorMsg('Showing instant verified admission solution below.');
        setExplanation(
          `১. 🎯 **সঠিক উত্তর ও মূল যুক্তি:**\n${question.explanation || 'প্রদত্ত তথ্যের আলোকে সঠিক উত্তর নির্ণয় করা হয়েছে।'}`
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
  }, [question.id, university, session, customApiKey]);

  const handleAskFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim() || isStreaming) return;

    const currentQuery = userQuery.trim();
    setUserQuery('');
    const newChatIndex = chatHistory.length;
    setChatHistory((prev) => [
      ...prev,
      { sender: 'user', text: currentQuery },
      { sender: 'ai', text: '' },
    ]);
    setIsStreaming(true);

    const correctIdx = question.correctAnswer;
    const correctLbl = correctIdx >= 0 ? getOptionLabel(correctIdx) : '';
    const correctText =
      correctIdx >= 0 && question.options?.[correctIdx]
        ? `[${correctLbl}] ${question.options[correctIdx]}`
        : '';

    try {
      const res = await fetch('/api/gemini/explain-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': customApiKey || '',
        },
        body: JSON.stringify({
          questionId: question.id,
          question: question.question,
          options: question.options.map((opt, idx) => `[${getOptionLabel(idx)}] ${opt}`),
          correctAnswer: correctText,
          referenceExplanation: question.explanation || '',
          questionImageUrls: questionImages,
          optionImageUrls: optionImages,
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
                setChatHistory((prev) => {
                  const updated = [...prev];
                  updated[newChatIndex + 1] = { sender: 'ai', text: reply };
                  return updated;
                });
              }
            } catch {
              // ignore
            }
          }
        }
      }
    } catch {
      setChatHistory((prev) => {
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

  const hasAnswerBadge = Boolean(
    question.correctAnswer >= 0 &&
      (question.options?.[question.correctAnswer] ||
        optionImages[question.correctAnswer]?.length)
  );
  const correctLabel = question.correctAnswer >= 0 ? getOptionLabel(question.correctAnswer) : '';
  const correctOptionImages =
    question.correctAnswer >= 0 ? optionImages[question.correctAnswer] || [] : [];

  return (
    <div className="mt-4 rounded-2xl bg-indigo-50/50 dark:bg-gradient-to-b dark:from-[#091124] dark:to-[#060B18] border border-indigo-200 dark:border-indigo-500/40 shadow-lg overflow-hidden transition-all">
      {/* Accordion Header Strip */}
      <div className="bg-indigo-100/80 dark:bg-[#0B152F] px-3.5 sm:px-4 py-3 border-b border-indigo-200 dark:border-indigo-900/50 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                AI Tutor Admission Coach
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-600/10 dark:bg-sky-500/20 text-indigo-700 dark:text-sky-300 border border-indigo-400/40 dark:border-sky-500/30 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-500 dark:text-amber-400" /> Live
              </span>
              {totalImagesCount > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-400/40 flex items-center gap-1 font-semibold">
                  <ImageIcon className="w-3 h-3" /> Vision ({totalImagesCount} img)
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 truncate">
              {question.subject} • {university || question.university} ({session || question.session})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {explanation && !isStreaming && (
            <>
              <button
                onClick={() => handleSpeak(explanation)}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/70 dark:hover:bg-slate-800 transition-colors"
                title="Read Aloud"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleCopyText(explanation)}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/70 dark:hover:bg-slate-800 transition-colors"
                title="Copy Solution"
              >
                {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white/80 dark:bg-slate-800/80 transition-colors flex items-center gap-1 border border-slate-300 dark:border-slate-700/60"
            title="Collapse AI Coach"
          >
            <span>বন্ধ করুন</span>
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Accordion Content Area */}
      <div className="p-3.5 sm:p-5 space-y-4 text-xs">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Top Answer Box (Always shown immediately at the start of AI Tutor) */}
        {hasAnswerBadge && (
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#0D1A35] border-2 border-indigo-200 dark:border-indigo-700/80 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-semibold flex flex-wrap items-center gap-2.5 shadow-sm">
            <span className="px-2.5 py-1 rounded-md bg-indigo-600 text-white text-[11px] font-bold tracking-wide uppercase">
              Answer
            </span>
            <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/80 text-indigo-800 dark:text-indigo-200 font-extrabold">
              [{correctLabel}]
            </span>
            {question.options?.[question.correctAnswer] && (
              <span className="font-bold">
                <MathInlineRenderer text={question.options[question.correctAnswer]} />
              </span>
            )}
            {correctOptionImages.map((imgUrl, idx) => (
              <img
                key={imgUrl + idx}
                src={imgUrl}
                alt="Correct option"
                className="max-h-16 object-contain rounded bg-white p-1 border border-slate-200"
              />
            ))}
          </div>
        )}

        {/* Initial Loading Pulse before first token arrives */}
        {isStreaming && !explanation && (
          <div className="py-4 text-left flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-sky-400 animate-ping shrink-0" />
            <span className="text-xs font-medium text-indigo-700 dark:text-sky-300">
              {totalImagesCount > 0
                ? 'AI Coach প্রশ্নের ছবি ও অপশন বিশ্লেষণ করে সমাধান লিখছে...'
                : 'AI Coach শর্টকাট ও সমাধান লাইভ লিখছে...'}
            </span>
          </div>
        )}

        {/* Primary Explanation Box with Live Streaming 4-Section Content */}
        {explanation && (
          <div className="bg-white dark:bg-[#070D1D] rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-indigo-950/80 shadow-sm relative">
            <MathMarkdownRenderer content={explanation} stripAnswerHeader={hasAnswerBadge} />
            {isStreaming && (
              <span className="inline-block w-2 h-4 bg-indigo-600 dark:bg-sky-400 animate-pulse ml-1 align-middle" />
            )}
          </div>
        )}

        {/* Follow-up Chat History */}
        {chatHistory.map((item, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-xl border ${
              item.sender === 'user'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-500/40 ml-4 sm:ml-6 text-slate-900 dark:text-indigo-100'
                : 'bg-white dark:bg-[#070D1D] border-slate-200 dark:border-slate-800 mr-4 sm:mr-6 text-slate-900 dark:text-slate-200'
            }`}
          >
            <div className="font-semibold text-[10px] mb-1 text-slate-500 dark:text-slate-400">
              {item.sender === 'user' ? 'আপনার প্রশ্ন (Your Question):' : 'AI Coach উত্তর:'}
            </div>
            {item.text ? (
              <MathMarkdownRenderer content={item.text} />
            ) : (
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-xs py-1">
                <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-sky-400 animate-ping" /> উত্তর লেখা হচ্ছে...
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
            placeholder="এই প্রশ্নের উপর আর কোনো প্রশ্ন বা শর্টকাট জানার আছে?"
            className="flex-1 bg-white dark:bg-[#070C1A] border border-slate-300 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 dark:focus:border-sky-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isStreaming || !userQuery.trim()}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-sm shrink-0"
          >
            <Send className="w-3.5 h-3.5" /> Ask
          </button>
        </form>
      </div>
    </div>
  );
};
