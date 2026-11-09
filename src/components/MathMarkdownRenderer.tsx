import React from 'react';
import katex from 'katex';

interface MathMarkdownRendererProps {
  content: string;
  className?: string;
}

// Clean up accidental JS string control characters that may have been escaped (e.g. \f in \frac -> form-feed)
export const sanitizeLatexEscapes = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/\x0crac/g, '\\frac')
    .replace(/\x08eta/g, '\\beta')
    .replace(/\ttheta/g, '\\theta')
    .replace(/\ttimes/g, '\\times')
    .replace(/\ttext/g, '\\text')
    .replace(/\ttau/g, '\\tau');
};

// Safely render LaTeX math to string using KaTeX
export const renderKaTeX = (math: string, displayMode: boolean): string => {
  try {
    const cleaned = sanitizeLatexEscapes(math.trim());
    return katex.renderToString(cleaned, {
      displayMode,
      throwOnError: false,
      output: 'htmlAndMathml',
      strict: false,
    });
  } catch (e) {
    return math;
  }
};

/**
 * Pre-processes text to ensure any naked LaTeX fractions and expressions
 * like \frac{a}{b} or \sqrt{x} not inside $...$ or $$...$$ are safely wrapped in $...$
 */
export const normalizeMathInText = (raw: string): string => {
  if (!raw) return '';
  const sanitized = sanitizeLatexEscapes(raw);

  // Protect already dollar-wrapped math $$...$$ and $...$
  const tokens: Array<{ isMath: boolean; text: string }> = [];
  let remaining = raw;

  // Match $$...$$ or $...$
  const mathPattern = /(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$)/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = mathPattern.exec(sanitized)) !== null) {
    if (match.index > lastIdx) {
      tokens.push({ isMath: false, text: sanitized.slice(lastIdx, match.index) });
    }
    tokens.push({ isMath: true, text: match[0] });
    lastIdx = match.index + match[0].length;
  }
  if (lastIdx < sanitized.length) {
    tokens.push({ isMath: false, text: sanitized.slice(lastIdx) });
  }

  // In non-math tokens, find unbracketed \frac{...}{...} or \sqrt{...}
  // and wrap them with $
  const enrichedTokens = tokens.map((t) => {
    if (t.isMath) return t.text;
    // Replace standalone \frac{...}{...} or \sqrt{...} with $...$
    return t.text.replace(
      /(\\frac\{[^{}]+\}\{[^{}]+\}|\\sqrt(?:\[[^\]]+\])?\{[^{}]+\})/g,
      '$$1$'
    );
  });

  return enrichedTokens.join('');
};

/**
 * Renders inline text containing math ($...$), bold (**...**), code (`...`), and plain text
 */
export const MathInlineRenderer: React.FC<{ text: string; className?: string }> = ({
  text,
  className = '',
}) => {
  if (!text) return null;

  const normalized = normalizeMathInText(text);

  // Split by inline math $...$
  const mathSplit = normalized.split(/(\$[^$]+?\$)/g);

  return (
    <span className={className}>
      {mathSplit.map((segment, mIdx) => {
        if (segment.startsWith('$') && segment.endsWith('$') && segment.length > 2) {
          const formula = segment.slice(1, -1);
          const html = renderKaTeX(formula, false);
          return (
            <span
              key={`math-${mIdx}`}
              className="inline-math mx-0.5 align-baseline text-sky-200"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }

        // Parse markdown bold **...**
        const boldSplit = segment.split(/(\*\*[^*]+?\*\*)/g);
        return (
          <React.Fragment key={`text-${mIdx}`}>
            {boldSplit.map((bSeg, bIdx) => {
              if (bSeg.startsWith('**') && bSeg.endsWith('**') && bSeg.length > 4) {
                return (
                  <strong key={`b-${bIdx}`} className="font-bold text-white">
                    {bSeg.slice(2, -2)}
                  </strong>
                );
              }

              // Parse code `...`
              const codeSplit = bSeg.split(/(`[^`]+?`)/g);
              return codeSplit.map((cSeg, cIdx) => {
                if (cSeg.startsWith('`') && cSeg.endsWith('`') && cSeg.length > 2) {
                  return (
                    <code
                      key={`c-${cIdx}`}
                      className="px-1.5 py-0.5 mx-0.5 rounded bg-[#070D1B] text-sky-300 font-mono text-[11px] border border-sky-900/40"
                    >
                      {cSeg.slice(1, -1)}
                    </code>
                  );
                }
                return <React.Fragment key={`p-${cIdx}`}>{cSeg}</React.Fragment>;
              });
            })}
          </React.Fragment>
        );
      })}
    </span>
  );
};

export const MathMarkdownRenderer: React.FC<MathMarkdownRendererProps> = ({
  content,
  className = '',
}) => {
  if (!content) return null;

  // Normalize standalone naked fractions into $...$
  const preprocessed = normalizeMathInText(content);

  // Split by block display math $$...$$
  const blockMathRegex = /\$\$([\s\S]*?)\$\$/g;
  const blocks: Array<{ type: 'blockMath' | 'markdown'; content: string }> = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = blockMathRegex.exec(preprocessed)) !== null) {
    if (match.index > lastIndex) {
      blocks.push({
        type: 'markdown',
        content: preprocessed.slice(lastIndex, match.index),
      });
    }
    blocks.push({
      type: 'blockMath',
      content: match[1],
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < preprocessed.length) {
    blocks.push({
      type: 'markdown',
      content: preprocessed.slice(lastIndex),
    });
  }

  return (
    <div className={`space-y-3 font-sans leading-relaxed text-slate-200 ${className}`}>
      {blocks.map((block, bIdx) => {
        if (block.type === 'blockMath') {
          const html = renderKaTeX(block.content, true);
          return (
            <div
              key={`block-${bIdx}`}
              className="my-3 py-3 px-4 rounded-xl bg-[#060B17] border border-indigo-950/90 overflow-x-auto text-center text-sky-200 shadow-inner"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }

        // Process markdown lines
        const lines = block.content.split('\n');
        return (
          <React.Fragment key={`md-${bIdx}`}>
            {lines.map((line, lIdx) => {
              const trimmed = line.trim();
              if (!trimmed) {
                return <div key={`empty-${bIdx}-${lIdx}`} className="h-1" />;
              }

              // Divider
              if (trimmed === '---' || trimmed === '***') {
                return (
                  <hr
                    key={`hr-${bIdx}-${lIdx}`}
                    className="my-3 border-indigo-900/40"
                  />
                );
              }

              // Headings
              if (trimmed.startsWith('### ')) {
                const text = trimmed.replace(/^###\s+/, '');
                return (
                  <h4
                    key={`h4-${bIdx}-${lIdx}`}
                    className="text-xs sm:text-sm font-bold text-sky-300 mt-3 mb-1 flex items-center gap-1.5"
                  >
                    <MathInlineRenderer text={text} />
                  </h4>
                );
              }

              if (trimmed.startsWith('## ')) {
                const text = trimmed.replace(/^##\s+/, '');
                return (
                  <h3
                    key={`h3-${bIdx}-${lIdx}`}
                    className="text-sm sm:text-base font-bold text-indigo-200 mt-4 mb-1.5"
                  >
                    <MathInlineRenderer text={text} />
                  </h3>
                );
              }

              // Bullet points
              if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
                const bulletText = trimmed.replace(/^[*\-]\s+/, '');
                return (
                  <div
                    key={`li-${bIdx}-${lIdx}`}
                    className="flex items-start gap-2 text-slate-300 text-xs sm:text-sm pl-2 py-0.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 shrink-0" />
                    <div className="flex-1 leading-relaxed">
                      <MathInlineRenderer text={bulletText} />
                    </div>
                  </div>
                );
              }

              // Numbered list
              const numMatch = trimmed.match(/^(\d+[\.\)])\s+(.*)$/);
              if (numMatch) {
                const num = numMatch[1];
                const itemText = numMatch[2];
                return (
                  <div
                    key={`num-${bIdx}-${lIdx}`}
                    className="flex items-start gap-2 text-slate-300 text-xs sm:text-sm pl-2 py-0.5"
                  >
                    <span className="font-bold text-sky-400 text-xs shrink-0 mt-0.5">
                      {num}
                    </span>
                    <div className="flex-1 leading-relaxed">
                      <MathInlineRenderer text={itemText} />
                    </div>
                  </div>
                );
              }

              // Regular paragraph
              return (
                <p
                  key={`p-${bIdx}-${lIdx}`}
                  className="text-slate-300 text-xs sm:text-sm leading-relaxed"
                >
                  <MathInlineRenderer text={line} />
                </p>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
};
