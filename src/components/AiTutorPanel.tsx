import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import {
  Sparkles,
  Copy,
  Check,
  X,
  Send,
  KeyRound,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { AI_MODELS, THINKING_LEVEL_SUPPORTED_MODELS } from '../data/aiModels';
import { siteConfig } from '../data/siteConfig';
import { defaultOptionLabelsBn } from '../data/translations';
import type { Question } from '../types';
import { hasValidGeminiKey } from '../utils/storage';
import { MathMarkdown } from './MathMarkdown';

type AiTutorPanelProps = {
  question: Question;
  apiKey: string;
  explanationFontPx: number;
  onOpenApiKeyModal: () => void;
  onClose: () => void;
};

type ChatTurn = {
  id: string;
  userQuestion: string;
  aiResponse: string;
  modelUsed: string;
  isStreaming: boolean;
  error?: string;
};

// §10.6 splitSections(text)
export function splitSections(text: string): string[] {
  const cleaned = text.trim();
  if (!cleaned) return [];

  // Split before lines starting with optional markdown hashes/bold, optional 1./১. numbering, then emoji or numbered lines
  const lines = cleaned.split(/\r?\n/);
  const sections: string[] = [];
  let current: string[] = [];

  const sectionHeaderRegex =
    /^\s*(?:#{1,4}\s*)?(?:\*\*)?(?:[1-9১-৯][.)]\s*)?(?:\*\*)?\s*(?:[🎯📐⚡⚠️💡🔍📌👉]|[1-4১-৪][.)]\s+\*\*)/u;

  for (const line of lines) {
    if (sectionHeaderRegex.test(line) && current.length > 0) {
      sections.push(current.join('\n').trim());
      current = [line];
    } else {
      current.push(line);
    }
  }
  if (current.length > 0) {
    sections.push(current.join('\n').trim());
  }

  const nonEmpty = sections.filter(Boolean);
  if (nonEmpty.length > 1) {
    return nonEmpty;
  }

  // Fallback: split on double blank lines
  const blankSplit = cleaned
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (blankSplit.length > 1) {
    return blankSplit;
  }

  return [cleaned];
}

// §10.6 extractAnswer(text)
export function extractAnswer(text: string): { answer: string | null; sections: string[] } {
  if (!text.trim()) {
    return { answer: null, sections: [] };
  }

  const lines = text.trim().split(/\r?\n/);
  let extractedAnswer: string | null = null;
  const remainingLines: string[] = [];

  const answerLineRegex =
    /^\s*(?:✅\s*)?(?:\*\*)?(?:Correct\s*answer|Answer|সঠিক\s*উত্তর|উত্তর)\s*:?(?:\*\*)?\s*:?\s*(.+)$/iu;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (extractedAnswer === null && i < 4) {
      const match = line.match(answerLineRegex);
      if (match && match[1]) {
        extractedAnswer = match[1].replace(/^\*\*|\*\*$/g, '').trim();
        continue;
      }
    }
    remainingLines.push(line);
  }

  const bodyText = remainingLines.join('\n').trim();
  const sections = splitSections(bodyText);
  return { answer: extractedAnswer, sections };
}

async function fetchImageAttachments(question: Question): Promise<{
  inlineParts: { inlineData: { data: string; mimeType: string } }[];
  svgBlocks: string[];
  totalAttached: number;
}> {
  const urls: { url: string; label: string }[] = [];

  if (Array.isArray(question.questionImageUrls)) {
    question.questionImageUrls.forEach((u, idx) => {
      if (u) urls.push({ url: u, label: `Question Image ${idx + 1}` });
    });
  }

  if (Array.isArray(question.optionImageUrls)) {
    question.optionImageUrls.forEach((arr, optIdx) => {
      if (Array.isArray(arr)) {
        arr.forEach((u) => {
          if (u) urls.push({ url: u, label: `Option ${optIdx + 1} Image` });
        });
      }
    });
  }

  const inlineParts: { inlineData: { data: string; mimeType: string } }[] = [];
  const svgBlocks: string[] = [];

  for (const item of urls) {
    try {
      const res = await fetch(item.url);
      if (!res.ok) continue;
      const contentType = (res.headers.get('content-type') || '').toLowerCase();

      if (contentType.includes('svg') || item.url.toLowerCase().endsWith('.svg')) {
        const svgText = await res.text();
        const clipped = svgText.slice(0, 10000);
        svgBlocks.push(`[Attached SVG Diagram for ${item.label}]\n\`\`\`xml\n${clipped}\n\`\`\``);
      } else {
        const blob = await res.blob();
        const mimeType = blob.type || 'image/png';
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = String(reader.result || '');
            const commaIdx = result.indexOf(',');
            resolve(commaIdx >= 0 ? result.slice(commaIdx + 1) : result);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        if (base64) {
          inlineParts.push({ inlineData: { data: base64, mimeType } });
        }
      }
    } catch {
      // Silently skip failed image fetches (§10.5)
    }
  }

  return {
    inlineParts,
    svgBlocks,
    totalAttached: inlineParts.length + svgBlocks.length
  };
}

// Singleton background-connected Gemini client & fastest-model cache
let cachedClientKey = '';
let cachedGenAiClient: GoogleGenAI | null = null;
let preferredFastModel: string | null = null;
const explanationResponseCache = new Map<string, { text: string; model: string; visionCount: number }>();

export function getOrInitGeminiClient(rawKey: string): GoogleGenAI | null {
  const trimmed = (rawKey || '').trim();
  if (!hasValidGeminiKey(trimmed)) return null;
  if (cachedGenAiClient && cachedClientKey === trimmed) {
    return cachedGenAiClient;
  }
  cachedClientKey = trimmed;
  cachedGenAiClient = new GoogleGenAI({ apiKey: trimmed });
  return cachedGenAiClient;
}

/**
 * Warms up the Gemini connection in the background as soon as an API key is configured,
 * locking onto the fastest responding model so the first question streams immediately.
 */
export function warmUpGeminiConnection(rawKey: string): void {
  const ai = getOrInitGeminiClient(rawKey);
  if (!ai || preferredFastModel) return;

  const candidateModels = AI_MODELS.initialExplanation;
  (async () => {
    for (const modelName of candidateModels) {
      try {
        const useThinking = THINKING_LEVEL_SUPPORTED_MODELS.has(modelName);
        const stream = await ai.models.generateContentStream({
          model: modelName,
          contents: 'Reply with OK',
          config: {
            maxOutputTokens: 4,
            ...(useThinking
              ? { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } }
              : {})
          }
        });
        for await (const chunk of stream) {
          if (chunk.text) {
            preferredFastModel = modelName;
            return;
          }
        }
      } catch {
        // try next model silently in background
      }
    }
  })();
}

function getOrderedModels(defaultList: string[]): string[] {
  if (!preferredFastModel) return defaultList;
  return [preferredFastModel, ...defaultList.filter((m) => m !== preferredFastModel)];
}

function buildUserPrompt(
  question: Question,
  svgBlocks: string[],
  hasImages: boolean,
  userQuestion?: string
): string {
  const { aiConfig } = siteConfig;
  const labels = question.optionLabels?.length ? question.optionLabels : defaultOptionLabelsBn;
  const formattedOptions =
    question.questionType === 'MCQ'
      ? JSON.stringify(
          question.options.map((opt, idx) => `[${labels[idx] || idx + 1}] ${opt}`)
        )
      : '';

  const lines: string[] = [
    'Admission Test Question Analysis:',
    `- Target Institution: ${question.institution} (${question.session})`,
    `- Subject: ${question.subject}`,
    `- Question Type: ${question.questionType}`,
    `- Question Stem: ${question.question}`
  ];

  if (question.questionType === 'MCQ') {
    lines.push(`- Options: ${formattedOptions}`);
  }
  if (question.explanation && question.explanation.trim()) {
    lines.push(`- Reference Context (verify independently): ${question.explanation.slice(0, 900)}`);
  }
  if (hasImages) {
    lines.push('- Attached Images: Inspect all attached question/option images carefully.');
  }
  if (svgBlocks.length > 0) {
    lines.push(svgBlocks.join('\n\n'));
  }

  lines.push('');

  if (userQuestion && userQuestion.trim()) {
    lines.push(
      `Student's follow-up question:\n"${userQuestion.trim()}"\nGive a direct, detailed, and super helpful answer in ${aiConfig.aiLanguage} mixed with English technical terms using LaTeX ($...$). Include an exam-time shortcut if applicable.`
    );
  } else if (question.questionType === 'MCQ') {
    lines.push(
      `Solve this MCQ independently and write a comprehensive, high-yield admission response in ${aiConfig.aiLanguage} following this EXACT 3-part structure:\n\n` +
        `✅ **${aiConfig.correctAnswerLabel}:** [exact option label + option text YOU determined to be correct]\n\n` +
        `${aiConfig.mcqSection1Label}\n` +
        `Provide a clear, detailed conceptual explanation (বিস্তারিত ব্যাখ্যা) of the underlying theory, law, or rule in ${aiConfig.aiLanguage}, state the exact formula in LaTeX ($...$), and explain why the correct option is right and why the other options are incorrect.\n\n` +
        `${aiConfig.mcqSection2Label}\n` +
        `Show the complete, easy-to-follow step-by-step calculation or logical derivation using LaTeX ($...$ and \\frac{a}{b}) so the student understands every step clearly.\n\n` +
        `${aiConfig.mcqSection3Label}\n` +
        `Give the fastest 5–10 second calculator-free MCQ shortcut technique for the admission exam hall (শর্টকাট সূত্র, অপশন এলিমিনেশন ট্রিক, একক/মাত্রা চেক, বা মনে রাখার ছন্দ/টেকনিক) plus 1 common exam-hall mistake to avoid.`
    );
  } else {
    lines.push(
      `Solve this Written question independently and write a complete step-by-step solution in ${aiConfig.aiLanguage} with this EXACT structure:\n` +
        `✅ **${aiConfig.correctAnswerLabel}:** [final result in 1 line]\n` +
        `${aiConfig.writtenSection1Label} (LaTeX)\n` +
        `${aiConfig.writtenSection2Label} clean exam-standard step-by-step derivation ($...$ and $$...$$)\n` +
        `${aiConfig.writtenSection3Label} key marking points + exam-time shortcut check.`
    );
  }

  return lines.join('\n');
}

function buildSystemInstruction(): string {
  const { aiConfig } = siteConfig;
  return `You are an elite, fast, and thorough ${aiConfig.countryExamName} admission coach (AI Tutor Admission Coach). Independently solve every question and verify which option is right. Write in clear ${aiConfig.aiLanguage} mixed with standard English scientific terms. Always format mathematical formulas, fractions (\\frac{a}{b}), and variables in LaTeX enclosed in dollar signs ($...$ for inline and $$...$$ for standalone equations). Always begin your initial solution with the exact first line: ✅ **${aiConfig.correctAnswerLabel}:** followed by the AI-determined answer, then the 3 numbered sections: 1. 🎯 Detailed Explanation (বিস্তারিত ব্যাখ্যা ও মূল তত্ত্ব), 2. 📐 Step-by-Step Solution (ধাপে ধাপে সমাধান), and 3. ⚡ Exam-Time MCQ Shortcut Technique (পরীক্ষার হলের MCQ শর্টকাট টেকনিক).`;
}

export const AiTutorPanel: React.FC<AiTutorPanelProps> = ({
  question,
  apiKey,
  explanationFontPx,
  onOpenApiKeyModal,
  onClose
}) => {
  const [initialText, setInitialText] = useState('');
  const [initialModel, setInitialModel] = useState('');
  const [isInitialStreaming, setIsInitialStreaming] = useState(false);
  const [initialError, setInitialError] = useState<string | null>(null);
  const [visionCount, setVisionCount] = useState(0);
  const [copied, setCopied] = useState(false);

  const [followUpInput, setFollowUpInput] = useState('');
  const [chatTurns, setChatTurns] = useState<ChatTurn[]>([]);

  const abortRef = useRef<AbortController | null>(null);
  const lastRunKeyRef = useRef<string>('');

  const validKey = hasValidGeminiKey(apiKey);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (!validKey) {
      setInitialText('');
      setInitialError(null);
      setIsInitialStreaming(false);
      lastRunKeyRef.current = '';
      return;
    }

    const runSignature = `${question.id}::${apiKey.trim()}`;
    if (lastRunKeyRef.current === runSignature) return;
    lastRunKeyRef.current = runSignature;

    // Instant replay from in-memory cache if this question was already solved in this session
    const cached = explanationResponseCache.get(runSignature);
    if (cached) {
      setInitialText(cached.text);
      setInitialModel(cached.model);
      setVisionCount(cached.visionCount);
      setInitialError(null);
      setIsInitialStreaming(false);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const runInitialExplanation = async () => {
      setInitialText('');
      setInitialError(null);
      setInitialModel('');
      setIsInitialStreaming(true);

      const ai = getOrInitGeminiClient(apiKey);
      if (!ai) {
        setIsInitialStreaming(false);
        return;
      }

      const { inlineParts, svgBlocks, totalAttached } = await fetchImageAttachments(question);
      if (controller.signal.aborted) return;
      setVisionCount(totalAttached);

      const promptText = buildUserPrompt(question, svgBlocks, totalAttached > 0);
      const systemInstruction = buildSystemInstruction();
      const baseModels =
        totalAttached > 0 ? AI_MODELS.withVision : AI_MODELS.initialExplanation;
      const modelsToTry = getOrderedModels(baseModels);

      let succeeded = false;

      for (let i = 0; i < modelsToTry.length; i++) {
        const modelName = modelsToTry[i];
        if (controller.signal.aborted) return;

        try {
          const useThinking =
            i < 2 && THINKING_LEVEL_SUPPORTED_MODELS.has(modelName);
          const stream = await ai.models.generateContentStream({
            model: modelName,
            contents:
              inlineParts.length > 0
                ? { parts: [...inlineParts, { text: promptText }] }
                : promptText,
            config: {
              systemInstruction,
              ...(useThinking
                ? { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } }
                : {})
            }
          });

          let accumulated = '';
          for await (const chunk of stream) {
            if (controller.signal.aborted) return;
            const textChunk = chunk.text || '';
            if (textChunk) {
              if (!succeeded) {
                succeeded = true;
                preferredFastModel = modelName;
                setInitialModel(modelName);
              }
              accumulated += textChunk;
              setInitialText(accumulated);
            }
          }

          if (succeeded) {
            explanationResponseCache.set(runSignature, {
              text: accumulated,
              model: modelName,
              visionCount: totalAttached
            });
            break;
          }
        } catch {
          // Try next fallback model in chain
        }
      }

      if (!controller.signal.aborted) {
        setIsInitialStreaming(false);
        if (!succeeded) {
          setInitialError(
            'Could not generate an answer. Please check your API Key in Settings.'
          );
        }
      }
    };

    runInitialExplanation();
  }, [question, apiKey, validKey]);

  const handleFollowUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = followUpInput.trim();
    if (!trimmed || !validKey || isInitialStreaming) return;

    const turnId = `turn-${Date.now()}`;
    setFollowUpInput('');
    setChatTurns((prev) => [
      ...prev,
      {
        id: turnId,
        userQuestion: trimmed,
        aiResponse: '',
        modelUsed: '',
        isStreaming: true
      }
    ]);

    const controller = new AbortController();
    abortRef.current = controller;

    const ai = getOrInitGeminiClient(apiKey);
    if (!ai) return;

    const { inlineParts, svgBlocks, totalAttached } = await fetchImageAttachments(question);
    const promptText = buildUserPrompt(question, svgBlocks, totalAttached > 0, trimmed);
    const systemInstruction = buildSystemInstruction();
    const modelsToTry = getOrderedModels(AI_MODELS.followUp);

    let succeeded = false;

    for (let i = 0; i < modelsToTry.length; i++) {
      const modelName = modelsToTry[i];
      if (controller.signal.aborted) return;

      try {
        const useThinking =
          i < 2 && THINKING_LEVEL_SUPPORTED_MODELS.has(modelName);
        const stream = await ai.models.generateContentStream({
          model: modelName,
          contents:
            inlineParts.length > 0
              ? { parts: [...inlineParts, { text: promptText }] }
              : promptText,
          config: {
            systemInstruction,
            ...(useThinking
              ? { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } }
              : {})
          }
        });

        let accumulated = '';
        for await (const chunk of stream) {
          if (controller.signal.aborted) return;
          const textChunk = chunk.text || '';
          if (textChunk) {
            succeeded = true;
            accumulated += textChunk;
            setChatTurns((prev) =>
              prev.map((t) =>
                t.id === turnId
                  ? { ...t, aiResponse: accumulated, modelUsed: modelName }
                  : t
              )
            );
          }
        }

        if (succeeded) break;
      } catch {
        // continue fallback
      }
    }

    setChatTurns((prev) =>
      prev.map((t) =>
        t.id === turnId
          ? {
              ...t,
              isStreaming: false,
              error: succeeded
                ? undefined
                : 'Could not generate an answer. Please check your API Key in Settings.'
            }
          : t
      )
    );
  };

  const handleCopy = async () => {
    if (!initialText) return;
    try {
      await navigator.clipboard.writeText(initialText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const { answer: extractedAnswer, sections } = extractAnswer(initialText);

  const anyFollowUpStreaming = chatTurns.some((t) => t.isStreaming);
  const isBusy = isInitialStreaming || anyFollowUpStreaming;

  // Progress message while streaming (§10.2)
  const getStreamingProgressLabel = (cardCount: number): string => {
    if (cardCount === 1) return '2. Solution & explanation being prepared…';
    if (cardCount === 2) return '3. Admission shortcut & tricks being prepared…';
    return 'Loading next part…';
  };

  return (
    <div className="mt-4 rounded-2xl bg-indigo-50/50 dark:bg-gradient-to-b dark:from-[#091124] dark:to-[#060B18] border border-indigo-200 dark:border-indigo-500/40 overflow-hidden shadow-md">
      {/* Header strip (§10.2) */}
      <div className="px-3.5 sm:px-4 py-2.5 bg-indigo-100/80 dark:bg-[#0B152F] border-b border-indigo-200/80 dark:border-indigo-900/60 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
            AI Tutor Admission Coach
          </span>
          <span className="px-2 py-0.5 rounded-md bg-indigo-600/15 dark:bg-indigo-500/20 text-indigo-700 dark:text-sky-300 border border-indigo-400/30 text-[10px] font-bold">
            ⚡ Fast AI
          </span>
          {visionCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-600/15 dark:bg-purple-500/25 text-purple-700 dark:text-purple-300 border border-purple-400/30 text-[10px] font-bold">
              <Eye className="w-3 h-3" />
              <span>Vision ({visionCount})</span>
            </span>
          )}
          {initialModel && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-600/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
              ⚡ Best Model: {initialModel}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {initialText && (
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy AI solution"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/80 dark:bg-[#070D1D] hover:bg-white text-slate-700 dark:text-slate-200 border border-indigo-200 dark:border-indigo-800 text-[11px] font-bold cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/70 text-[11px] font-bold cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>{siteConfig.aiConfig.closeLabel}</span>
          </button>
        </div>
      </div>

      {/* Body */}
      <div
        className="p-3.5 sm:p-4 space-y-3"
        style={{ fontSize: `${explanationFontPx}px` }}
      >
        {!validKey ? (
          <div className="p-4 rounded-xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-amber-800 dark:text-amber-200 text-xs sm:text-sm font-bold">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>
                To use AI Tutor, first add your Gemini API Key from Settings
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenApiKeyModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-xs shrink-0 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Add API Key</span>
            </button>
          </div>
        ) : (
          <>
            {/* AI is thinking row until first text arrives */}
            {isInitialStreaming && !initialText && (
              <div className="p-4 rounded-xl bg-white dark:bg-[#070D1D] border border-indigo-200/80 dark:border-indigo-900/60 flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-sky-400 animate-pulse" />
                  <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-sky-400 animate-pulse [animation-delay:150ms]" />
                  <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-sky-400 animate-pulse [animation-delay:300ms]" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-indigo-700 dark:text-sky-300">
                  AI is thinking… প্রশ্নটি বিশ্লেষণ ও সমাধান করা হচ্ছে...
                </span>
              </div>
            )}

            {/* Error State */}
            {initialError && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-200 text-xs sm:text-sm font-bold flex items-center justify-between gap-3">
                <span>{initialError}</span>
                <button
                  type="button"
                  onClick={onOpenApiKeyModal}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold shrink-0 cursor-pointer"
                >
                  Settings
                </button>
              </div>
            )}

            {/* Top Highlight Card when answer is extracted */}
            {extractedAnswer && (
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#070D1D] border-2 border-indigo-300 dark:border-indigo-500/50 shadow-xs space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-sky-500 text-white text-[11px] font-extrabold uppercase tracking-wide">
                  <span>✅ AI determined answer</span>
                </div>
                <div className="font-bold text-slate-900 dark:text-white pt-0.5">
                  <MathMarkdown content={extractedAnswer} />
                </div>
              </div>
            )}

            {/* Split Section Cards */}
            {sections.map((sec, idx) => {
              const isLast = idx === sections.length - 1;
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white dark:bg-[#070D1D] border border-indigo-200/70 dark:border-indigo-900/60 text-slate-800 dark:text-slate-200 shadow-2xs"
                >
                  <MathMarkdown content={sec} />
                  {isInitialStreaming && isLast && (
                    <span className="inline-block w-2 h-4 ml-1 align-middle bg-indigo-600 dark:bg-sky-400 animate-pulse" />
                  )}
                </div>
              );
            })}

            {/* Pulsing Progress Card while streaming */}
            {isInitialStreaming && initialText && (
              <div className="p-3 rounded-xl bg-indigo-100/60 dark:bg-[#0B152F]/70 border border-indigo-300/60 dark:border-indigo-800/60 flex items-center justify-between gap-2 animate-pulse">
                <span className="text-xs font-bold text-indigo-800 dark:text-sky-300">
                  {getStreamingProgressLabel(sections.length)}
                </span>
                <span className="px-2 py-0.5 rounded bg-indigo-600/15 text-indigo-700 dark:text-sky-300 font-mono text-[10px] font-bold">
                  loading more
                </span>
              </div>
            )}

            {/* Follow-up Chat Thread */}
            {chatTurns.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-indigo-200/60 dark:border-indigo-900/50">
                {chatTurns.map((turn) => (
                  <div key={turn.id} className="space-y-2">
                    {/* User bubble */}
                    <div className="p-3 rounded-xl bg-indigo-100/80 dark:bg-indigo-950/60 border border-indigo-300/70 dark:border-indigo-800/70">
                      <div className="text-[11px] font-extrabold text-indigo-700 dark:text-sky-300 mb-0.5">
                        Your question:
                      </div>
                      <div className="text-slate-900 dark:text-white font-semibold">
                        {turn.userQuestion}
                      </div>
                    </div>

                    {/* AI bubble */}
                    <div className="p-3.5 rounded-xl bg-white dark:bg-[#070D1D] border border-indigo-200/80 dark:border-indigo-900/60 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] font-extrabold text-indigo-700 dark:text-sky-300">
                          AI Coach answer:
                        </span>
                        {turn.modelUsed && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-600/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                            ⚡ Best Model: {turn.modelUsed}
                          </span>
                        )}
                      </div>
                      {turn.error ? (
                        <div className="text-xs font-bold text-rose-600 dark:text-rose-400">
                          {turn.error}
                        </div>
                      ) : turn.aiResponse ? (
                        <div>
                          <MathMarkdown content={turn.aiResponse} />
                          {turn.isStreaming && (
                            <span className="inline-block w-2 h-4 ml-1 align-middle bg-indigo-600 dark:bg-sky-400 animate-pulse" />
                          )}
                        </div>
                      ) : (
                        <div className="text-xs font-bold text-indigo-600 dark:text-sky-400 animate-pulse">
                          AI is thinking…
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Follow-up Input Form */}
            <form onSubmit={handleFollowUpSubmit} className="pt-2 flex items-center gap-2">
              <input
                type="text"
                value={followUpInput}
                onChange={(e) => setFollowUpInput(e.target.value)}
                disabled={isBusy}
                placeholder="Any other shortcut or question about this problem?"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#070D1D] border border-indigo-200 dark:border-indigo-800/80 focus:border-indigo-600 dark:focus:border-sky-400 outline-none text-xs sm:text-sm text-slate-900 dark:text-white disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={isBusy || !followUpInput.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-xs cursor-pointer shrink-0"
              >
                <span>Ask</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
