import React from 'react';
import { BookOpen, ListOrdered, Zap } from 'lucide-react';
import { uiTexts } from '../data/translations';
import { resolvePublicAsset } from '../utils/questionLoader';
import { MathMarkdown } from './MathMarkdown';

type ExplanationCardProps = {
  explanationText?: string;
  explanationImageUrls?: string[];
  fontSizePx: number;
};

type ParsedSections = {
  explanation: string;
  stepByStep: string;
  shortcut: string;
  isStructured: boolean;
};

export function parseStructuredExplanation(raw: string): ParsedSections {
  const text = raw.trim();
  const expMarker = /(?:^|\n)\s*###?\s*(?:১\.|1\.)\s*[^\n]*বিস্তারিত ব্যাখ্যা[^\n]*/i;
  const stepMarker = /(?:^|\n)\s*###?\s*(?:২\.|2\.)\s*[^\n]*ধাপে ধাপে সমাধান[^\n]*/i;
  const tipMarker = /(?:^|\n)\s*###?\s*(?:৩\.|3\.)\s*[^\n]*(?:MCQ\s*)?শর্টকাট টিপস[^\n]*/i;

  const expMatch = expMarker.exec(text);
  const stepMatch = stepMarker.exec(text);
  const tipMatch = tipMarker.exec(text);

  if (!expMatch && !stepMatch && !tipMatch) {
    return {
      explanation: text,
      stepByStep: '',
      shortcut: '',
      isStructured: false
    };
  }

  const markers: Array<{ key: 'explanation' | 'stepByStep' | 'shortcut'; start: number; end: number }> = [];
  if (expMatch) markers.push({ key: 'explanation', start: expMatch.index, end: expMatch.index + expMatch[0].length });
  if (stepMatch) markers.push({ key: 'stepByStep', start: stepMatch.index, end: stepMatch.index + stepMatch[0].length });
  if (tipMatch) markers.push({ key: 'shortcut', start: tipMatch.index, end: tipMatch.index + tipMatch[0].length });

  markers.sort((a, b) => a.start - b.start);

  const out: ParsedSections = {
    explanation: '',
    stepByStep: '',
    shortcut: '',
    isStructured: true
  };

  for (let i = 0; i < markers.length; i++) {
    const cur = markers[i];
    const nextStart = i + 1 < markers.length ? markers[i + 1].start : text.length;
    out[cur.key] = text.slice(cur.end, nextStart).trim();
  }

  return out;
}

export const ExplanationCard: React.FC<ExplanationCardProps> = ({
  explanationText,
  explanationImageUrls,
  fontSizePx
}) => {
  const hasImages = Boolean(explanationImageUrls && explanationImageUrls.length > 0);
  if (!explanationText && !hasImages) return null;

  const parsed = explanationText ? parseStructuredExplanation(explanationText) : null;

  return (
    <div
      style={{ fontSize: `${fontSizePx}px` }}
      className="p-4 rounded-2xl bg-white/95 dark:bg-[#070C18]/95 border border-slate-200/90 dark:border-indigo-900/50 space-y-3"
    >
      <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
        <BookOpen className="w-4 h-4 shrink-0" />
        <span>{uiTexts.questionBank.explanationTitle}</span>
      </div>

      {parsed && parsed.isStructured ? (
        <div className="space-y-2.5">
          {parsed.explanation && (
            <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/25 border border-emerald-200/80 dark:border-emerald-900/50 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-800 dark:text-emerald-300">
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span>বিস্তারিত ব্যাখ্যা (Explanation)</span>
              </div>
              <div className="text-slate-800 dark:text-slate-200">
                <MathMarkdown content={parsed.explanation} />
              </div>
            </div>
          )}

          {parsed.stepByStep && (
            <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/25 border border-indigo-200/80 dark:border-indigo-900/50 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-800 dark:text-sky-300">
                <ListOrdered className="w-3.5 h-3.5 shrink-0" />
                <span>ধাপে ধাপে সমাধান (Step-by-Step Solution)</span>
              </div>
              <div className="text-slate-800 dark:text-slate-200">
                <MathMarkdown content={parsed.stepByStep} />
              </div>
            </div>
          )}

          {parsed.shortcut && (
            <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/25 border border-amber-200/90 dark:border-amber-900/50 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-800 dark:text-amber-300">
                <Zap className="w-3.5 h-3.5 shrink-0" />
                <span>MCQ শর্টকাট টিপস (Shortcut Tip)</span>
              </div>
              <div className="text-slate-800 dark:text-slate-200">
                <MathMarkdown content={parsed.shortcut} />
              </div>
            </div>
          )}
        </div>
      ) : (
        explanationText && (
          <div className="text-slate-800 dark:text-slate-200">
            <MathMarkdown content={explanationText} />
          </div>
        )
      )}

      {hasImages && (
        <div className="flex flex-wrap gap-3 pt-1">
          {explanationImageUrls!.map((url, idx) => (
            <img
              key={idx}
              src={resolvePublicAsset(url)}
              alt={`Explanation figure ${idx + 1}`}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="max-w-full max-h-72 rounded-xl border border-slate-200 dark:border-slate-800 bg-white p-2 object-contain"
            />
          ))}
        </div>
      )}
    </div>
  );
};
