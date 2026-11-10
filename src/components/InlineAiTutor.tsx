import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Question } from '../data/questionBank';
import { ImportedQuestion } from '../data/sessionQuestionLoader';
import { Sparkles, Send, CheckCircle, AlertCircle, Copy, Volume2, ChevronUp, Zap, Image as ImageIcon } from 'lucide-react';
import { MathMarkdownRenderer, MathInlineRenderer } from './MathMarkdownRenderer';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

interface InlineAiTutorProps {
  question: Question;
  university?: string;
  session?: string;
  customApiKey: string;
  onClose: () => void;
  fontSizePx?: number;
}

const BANGLA_OPTION_LABELS = ['ক', 'খ', 'গ', 'ঘ', 'ঙ'];

const CLIENT_SYSTEM_INSTRUCTION =
  'You are an elite Bangladeshi varsity admission coach (AI Tutor Admission Coach). Write in clear, natural Bengali (Bangla) mixed with standard English scientific terms. When images are provided, inspect them thoroughly to read every symbol, circuit component, graph axis, chemical bond, or math equation. Always format mathematical formulas, fractions, and variables in standard LaTeX enclosed in dollar signs: use $...$ for inline expressions (e.g., $PV=nRT$, $T = \\frac{PV}{nR}$, $10^{-3}\\text{ m}^3$) and $$...$$ for standalone equations. Always format fractions as \\frac{numerator}{denominator} inside dollar signs. Follow the exact 4-section Bengali heading structure requested.';

async function fetchBrowserImagePart(url: string, label: string): Promise<{ part?: any; svgText?: string }> {
  try {
    const res = await fetch(url);
    if (!res.ok) return {};
    const contentType = (res.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
    if (contentType.includes('svg') || url.toLowerCase().endsWith('.svg')) {
      const text = (await res.text()).slice(0, 10000);
      return { svgText: `\n[Attached SVG Diagram for ${label}]:\n\`\`\`xml\n${text}\n\`\`\`\n` };
    }
    const blob = await res.blob();
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = String(reader.result || '');
        const comma = result.indexOf(',');
        resolve(comma >= 0 ? result.slice(comma + 1) : result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    return {
      part: {
        inlineData: {
          data: base64,
          mimeType: contentType || 'image/png',
        },
      },
    };
  } catch {
    return {};
  }
}

function buildClientPrompt(params: {
  question: string;
  options: string[];
  correctAnswer: string;
  referenceExplanation: string;
  subject: string;
  university: string;
  session: string;
  userQuestion?: string;
  hasImages: boolean;
  svgTexts: string[];
}): string {
  const {
    question,
    options,
    correctAnswer,
    referenceExplanation,
    subject,
    university,
    session,
    userQuestion,
    hasImages,
    svgTexts,
  } = params;

  let prompt = `Varsity Admission Test Question Analysis:
- Target University: ${university}
- Session: ${session}
- Subject: ${subject}
- Question Stem: ${question}
- Options: ${JSON.stringify(options)}
- Official Correct Answer: ${correctAnswer || 'Determine from question/images and options'}
`;

  if (referenceExplanation) {
    prompt += `- Reference Solution Context: ${referenceExplanation.slice(0, 1500)}\n`;
  }
  if (hasImages) {
    prompt += `- Attached Images: Inspect all attached question/option images carefully.\n`;
  }
  if (svgTexts.length > 0) {
    prompt += svgTexts.join('\n');
  }
  prompt += '\n';

  if (userQuestion && userQuestion.trim()) {
    prompt += `The admission candidate has this specific follow-up doubt:
"${userQuestion}"
Provide a concise, direct answer in encouraging Bengali (Bangla) mixed with English technical terms using LaTeX ($...$).`;
  } else {
    prompt += `Write a crystal-clear, comprehensive Bangladeshi Varsity Admission explanation in Bengali (Bangla) following this EXACT 4-section structure and headings (do NOT repeat an "Answer:" box at the very top; start directly with Section ১):

১. 🎯 **সঠিক উত্তর ও মূল যুক্তি:**

**মূল নীতি:** State the fundamental scientific law, formula, or concept clearly and explain in 2-3 lines why the correct option is right.

২. 📐 **ধাপে ধাপে সমাধান:**

Show the complete step-by-step derivation and calculation for the question and options using LaTeX inside dollar signs ($...$).

৩. ⚡ **এডমিশন ৩০-সেকেন্ড শর্টকাট:**

Explain how to solve this question in under 30 seconds in the exam hall without a calculator.

৪. ⚠️ **পরীক্ষার সতর্কতা:**

List 2 to 3 specific common pitfalls or mistakes students make on this exact type of question using bullet points.`;
  }

  return prompt;
}

/**
 * Splits the streamed explanation into progressive visual sections
 * (Section ১, Section ২, Section ৩, Section ৪) so each part displays
 * cleanly in its own card as soon as tokens arrive.
 */
function splitExplanationSections(raw: string): string[] {
  if (!raw || !raw.trim()) return [];
  const parts = raw
    .split(/(?=(?:^|\n)\s*(?:[১২৩৪1234][.)]\s*)?(?:🎯|📐|⚡|⚠️))/g)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : [raw];
}

export const InlineAiTutor: React.FC<InlineAiTutorProps> = ({
  question,
  university,
  session,
  customApiKey,
  onClose,
  fontSizePx,
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

  // Fallback for static deployments (e.g. GitHub Pages) where /api/gemini/explain-stream is not running
  const streamDirectOnStaticHost = async (
    onChunk: (fullText: string) => void,
    userFollowUp?: string,
    signal?: AbortSignal
  ) => {
    const ai = new GoogleGenAI({ apiKey: customApiKey.trim() });
    const correctIdx = question.correctAnswer;
    const correctLbl = correctIdx >= 0 ? getOptionLabel(correctIdx) : '';
    const correctText =
      correctIdx >= 0 && question.options?.[correctIdx]
        ? `[${correctLbl}] ${question.options[correctIdx]}`
        : '';

    const imageParts: any[] = [];
    const svgTexts: string[] = [];

    for (let i = 0; i < questionImages.length; i++) {
      const resolved = await fetchBrowserImagePart(questionImages[i], `Question Image ${i + 1}`);
      if (resolved.part) imageParts.push(resolved.part);
      if (resolved.svgText) svgTexts.push(resolved.svgText);
    }

    for (let optIdx = 0; optIdx < optionImages.length; optIdx++) {
      const urls = optionImages[optIdx] || [];
      for (const u of urls) {
        const resolved = await fetchBrowserImagePart(u, `Option ${optIdx + 1} Image`);
        if (resolved.part) imageParts.push(resolved.part);
        if (resolved.svgText) svgTexts.push(resolved.svgText);
      }
    }

    const prompt = buildClientPrompt({
      question: question.question || '(See attached question image)',
      options: question.options.map((opt, idx) => `[${getOptionLabel(idx)}] ${opt}`),
      correctAnswer: correctText,
      referenceExplanation: question.explanation || '',
      subject: question.subject,
      university: university || question.university,
      session: session || question.session,
      userQuestion: userFollowUp,
      hasImages: imageParts.length > 0 || svgTexts.length > 0,
      svgTexts,
    });

    const contentsPayload =
      imageParts.length > 0
        ? [{ role: 'user', parts: [...imageParts, { text: prompt }] }]
        : prompt;

    const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-2.5-flash'];
    let stream: any = null;

    for (const modelName of candidateModels) {
      try {
        const config: any = { systemInstruction: CLIENT_SYSTEM_INSTRUCTION };
        if (modelName === 'gemini-3.8-flash') {
          config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
        }
        stream = await ai.models.generateContentStream({
          model: modelName,
          contents: contentsPayload,
          config,
        });
        break;
      } catch {
        // try next model
      }
    }

    if (!stream) throw new Error('Model unavailable');

    let accumulated = '';
    for await (const chunk of stream) {
      if (signal?.aborted) break;
      if (chunk.text) {
        accumulated += chunk.text;
        onChunk(accumulated);
      }
    }
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

        const contentType = res.headers.get('content-type') || '';
        if (!res.ok || !res.body || !contentType.includes('text/event-stream')) {
          // Running on static GitHub Pages or backend unreachable -> stream directly
          await streamDirectOnStaticHost((txt) => {
            if (isMounted) setExplanation(txt);
          }, undefined, abortController.signal);
          return;
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

        try {
          await streamDirectOnStaticHost((txt) => {
            if (isMounted) setExplanation(txt);
          }, undefined, abortController.signal);
          return;
        } catch {
          const cleanRef = (question.explanation || '').trim();
          const optSummary = question.options
            .map((opt, idx) => `- [${getOptionLabel(idx)}] ${opt}`)
            .join('\n');
          setExplanation(
            `১. 🎯 **সঠিক উত্তর ও মূল যুক্তি:**\n\n**মূল নীতি:** ${
              cleanRef ||
              `প্রদত্ত প্রশ্ন বিশ্লেষণ করে দেখা যায় সঠিক উত্তর হলো **${correctText || 'সঠিক অপশন'}**।`
            }\n\n২. 📐 **ধাপে ধাপে সমাধান:**\n\n${
              cleanRef
                ? `প্রশ্নের তথ্যের আলোকে গাণিতিক ও তাত্ত্বিক বিশ্লেষণ:\n\n${cleanRef}`
                : `প্রদত্ত অপশনগুলোর তুলনামূলক বিশ্লেষণ:\n${optSummary}\n\nএখানে মূল সূত্র প্রয়োগ করলে **${
                    correctText || 'সঠিক অপশনটি'
                  }** সরাসরি সিদ্ধ হয়।`
            }\n\n৩. ⚡ **এডমিশন ৩০-সেকেন্ড শর্টকাট:**\n\nক্যালকুলেটর ছাড়া দ্রুত সমাধানের জন্য প্রদত্ত রাশিগুলোর অনুপাত ও একক (Unit) সরাসরি তুলনা করুন। অমিল এককগুলো বাদ দিলে তাৎক্ষণিকভাবে **${
              correctText || 'সঠিক উত্তর'
            }** বের করা যায়।\n\n৪. ⚠️ **পরীক্ষার সতর্কতা:**\n\n- **একক বিভ্রাট:** প্রশ্নে দেওয়া একক (SI বা CGS) খেয়াল না করে মান বসালে ভুল উত্তর আসতে পারে।\n- **চিহ্ন ও ঘাত সতর্কতা:** ধনাত্মক/ঋণাত্মক চিহ্ন এবং ঘাত ($10^n$) দ্রুত পড়ার সময় বিশেষ সতর্ক থাকুন।`
          );
        }
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

      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !res.body || !contentType.includes('text/event-stream')) {
        await streamDirectOnStaticHost((reply) => {
          setChatHistory((prev) => {
            const updated = [...prev];
            updated[newChatIndex + 1] = { sender: 'ai', text: reply };
            return updated;
          });
        }, currentQuery);
        return;
      }

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
      try {
        await streamDirectOnStaticHost((reply) => {
          setChatHistory((prev) => {
            const updated = [...prev];
            updated[newChatIndex + 1] = { sender: 'ai', text: reply };
            return updated;
          });
        }, currentQuery);
      } catch {
        setChatHistory((prev) => {
          const updated = [...prev];
          updated[newChatIndex + 1] = {
            sender: 'ai',
            text: 'Error generating follow-up response. Please check your API key or network connection.',
          };
          return updated;
        });
      }
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

  const splitSections = useMemo(() => splitExplanationSections(explanation), [explanation]);

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
      <div
        className="p-3.5 sm:p-5 space-y-3 leading-relaxed"
        style={{ fontSize: fontSizePx ? `${fontSizePx}px` : undefined }}
      >
        {errorMsg && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Top Answer Box (Always shown immediately at the start of AI Tutor) */}
        {hasAnswerBadge && (
          <div
            className="p-3.5 rounded-xl bg-white dark:bg-[#0D1A35] border-2 border-indigo-200 dark:border-indigo-700/80 text-slate-900 dark:text-slate-100 font-semibold flex flex-wrap items-center gap-2.5 shadow-sm"
            style={{ fontSize: fontSizePx ? `${Math.max(12, fontSizePx)}px` : undefined }}
          >
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
          <div className="py-3 text-left flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-sky-400 animate-ping shrink-0" />
            <span className="font-medium text-indigo-700 dark:text-sky-300" style={{ fontSize: fontSizePx ? `${fontSizePx}px` : undefined }}>
              {totalImagesCount > 0
                ? 'AI Coach প্রশ্নের ছবি ও অপশন বিশ্লেষণ করে সমাধান লিখছে...'
                : 'AI Coach শর্টকাট ও সমাধান লাইভ লিখছে...'}
            </span>
          </div>
        )}

        {/* Split-Wise Progressive Section Cards */}
        {splitSections.length > 0 && (
          <div className="space-y-2.5">
            {splitSections.map((sectionText, idx) => {
              const isLastSection = idx === splitSections.length - 1;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#070D1D] rounded-xl p-3.5 sm:p-4 border border-slate-200 dark:border-indigo-950/80 shadow-xs relative transition-all"
                  style={{ fontSize: fontSizePx ? `${fontSizePx}px` : undefined }}
                >
                  <MathMarkdownRenderer
                    content={sectionText}
                    stripAnswerHeader={idx === 0 && hasAnswerBadge}
                    fontSizePx={fontSizePx}
                  />
                  {isStreaming && isLastSection && (
                    <span className="inline-block w-2 h-4 bg-indigo-600 dark:bg-sky-400 animate-pulse ml-1 align-middle" />
                  )}
                </div>
              );
            })}
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
            style={{ fontSize: fontSizePx ? `${fontSizePx}px` : undefined }}
          >
            <div className="font-semibold text-[10px] mb-1 text-slate-500 dark:text-slate-400">
              {item.sender === 'user' ? 'আপনার প্রশ্ন (Your Question):' : 'AI Coach উত্তর:'}
            </div>
            {item.text ? (
              <MathMarkdownRenderer content={item.text} fontSizePx={fontSizePx} />
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
