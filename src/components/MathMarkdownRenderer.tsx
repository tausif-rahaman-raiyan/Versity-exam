import React from 'react';
import katex from 'katex';

interface MathMarkdownRendererProps {
  content: string;
  className?: string;
  stripAnswerHeader?: boolean;
}

/**
 * Extracts LaTeX annotations from pre-rendered KaTeX HTML blocks (<span class="katex">)
 * and strips HTML wrapper tags (<div class="...">, <p>, <span>, etc.) while preserving
 * line breaks and dollar-delimited math ($...$ and $$...$$).
 */
export const extractMathFromHtml = (input: string): string => {
  if (!input) return '';
  const str = input.trim();

  // Fast path if there are no HTML tags at all
  if (!/<[a-zA-Z!/]/.test(str)) {
    return str;
  }

  if (typeof document !== 'undefined') {
    const temp = document.createElement('div');
    temp.innerHTML = str;

    // Remove decorative buttons, icons, tags, scripts, styles
    temp
      .querySelectorAll('button, .icon-button, .tag, script, style, svg')
      .forEach((el) => el.remove());

    // Convert <span class="katex-display"> and <span class="katex"> into $$...$$ or $...$
    temp.querySelectorAll('.katex-display, .katex').forEach((katexEl) => {
      if (
        katexEl.classList.contains('katex') &&
        katexEl.parentElement?.classList.contains('katex-display')
      ) {
        return;
      }
      const ann = katexEl.querySelector('annotation[encoding="application/x-tex"]');
      if (ann && ann.textContent) {
        const isDisplay = katexEl.classList.contains('katex-display');
        const tex = ann.textContent.trim();
        katexEl.replaceWith(
          document.createTextNode(isDisplay ? ` $$${tex}$$ ` : ` $${tex}$ `)
        );
      } else {
        katexEl.querySelectorAll('.katex-mathml').forEach((m) => m.remove());
      }
    });

    // Handle any standalone <math> elements outside .katex
    temp.querySelectorAll('math').forEach((mathEl) => {
      const ann = mathEl.querySelector('annotation[encoding="application/x-tex"]');
      if (ann && ann.textContent) {
        mathEl.replaceWith(document.createTextNode(` $${ann.textContent.trim()}$ `));
      } else {
        mathEl.remove();
      }
    });

    // Preserve line breaks for block elements
    temp.querySelectorAll('br').forEach((br) => br.replaceWith('\n'));
    temp
      .querySelectorAll('div, p, li, section, h1, h2, h3, h4, tr')
      .forEach((block) => {
        block.prepend(document.createTextNode('\n'));
        block.append(document.createTextNode('\n'));
      });

    const extracted = temp.textContent || '';
    return extracted
      .replace(/\r\n/g, '\n')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n[ \t]+/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  return str
    .replace(
      /<span class="katex">[\s\S]*?<annotation encoding="application\/x-tex">([\s\S]*?)<\/annotation>[\s\S]*?<\/math><\/span><span class="katex-html"[^>]*>[\s\S]*?<\/span><\/span>/g,
      ' $$$1$$ '
    )
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(div|p|li|section|h[1-6])>/gi, '\n')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

// Clean up accidental JS string control characters and Unicode combining math accents
export const sanitizeLatexEscapes = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/\x0crac/g, '\\frac')
    .replace(/\x08eta/g, '\\beta')
    .replace(/\ttheta/g, '\\theta')
    .replace(/\ttimes/g, '\\times')
    .replace(/\ttext/g, '\\text')
    .replace(/\ttau/g, '\\tau')
    .replace(/([a-zA-Z])\u0304/g, '\\bar{$1}')
    .replace(/ı\u0302/g, '\\hat{\\imath}')
    .replace(/ȷ\u0302/g, '\\hat{\\jmath}')
    .replace(/([a-zA-Z])\u0302/g, '\\hat{$1}')
    .replace(/([a-zA-Z])\u20d7/g, '\\vec{$1}')
    .replace(/ı/g, '\\imath ')
    .replace(/ȷ/g, '\\jmath ');
};

// Safely render LaTeX math to string using KaTeX (output: 'html' prevents duplicate MathML text!)
export const renderKaTeX = (math: string, displayMode: boolean): string => {
  try {
    const cleaned = sanitizeLatexEscapes(math.trim());
    return katex.renderToString(cleaned, {
      displayMode,
      throwOnError: false,
      output: 'html',
      strict: false,
    });
  } catch {
    return math;
  }
};

/**
 * Converts naked LaTeX commands (\frac{a}{b}, \sqrt{x}, etc.) and unicode roots/fractions
 * outside $...$ into properly wrapped $...$ inline math tokens.
 */
const enrichPlainSegmentWithMath = (text: string): string => {
  if (!text) return '';
  let result = text;

  // 1. Convert √a/b or a/√b or √(expr) into LaTeX
  result = result.replace(/√\(([^)]+)\)\s*\/\s*([0-9a-zA-Z]+)/g, (_, a, b) => `$\\frac{\\sqrt{${a}}}{${b}}$`);
  result = result.replace(/√([0-9a-zA-Z]+)\s*\/\s*([0-9a-zA-Z]+)/g, (_, a, b) => `$\\frac{\\sqrt{${a}}}{${b}}$`);
  result = result.replace(/([0-9a-zA-Z]+)\s*\/\s*√([0-9a-zA-Z]+)/g, (_, a, b) => `$\\frac{${a}}{\\sqrt{${b}}}$`);
  result = result.replace(/√\(([^)]+)\)/g, (_, a) => `$\\sqrt{${a}}$`);
  result = result.replace(/√([0-9a-zA-Z]+)/g, (_, a) => `$\\sqrt{${a}}$`);

  // 2. Wrap naked \frac{...}{...} and \sqrt{...}
  result = result.replace(
    /(\\frac\{(?:[^{}]|\{[^{}]*\})+\}\{(?:[^{}]|\{[^{}]*\})+\}|\\sqrt(?:\[[^\]]+\])?\{(?:[^{}]|\{[^{}]*\})+\})/g,
    (match) => `$${match}$`
  );

  // 3. Convert simple standalone math fractions like 7/4, 1/2, E/2 (avoiding dates like 2024/25)
  result = result.replace(
    /(^|[\s(+-=])([0-9]{1,2}|[A-Za-z])\s*\/\s*([0-9]{1,2}|[A-Za-z])(?=[\s).,;।?!]|$)/g,
    (full, prefix, num, den) => {
      if (/^\d{2}$/.test(num) && /^\d{2}$/.test(den)) return full;
      if (/^[a-zA-Z]$/.test(num) && /^[a-zA-Z]$/.test(den) && num.toLowerCase() !== 'e' && den.toLowerCase() !== 'g' && den.toLowerCase() !== 'r') {
        return full;
      }
      return `${prefix}$\\frac{${num}}{${den}}$`;
    }
  );

  return result;
};

export const normalizeMathInText = (raw: string): string => {
  if (!raw) return '';
  const htmlCleaned = extractMathFromHtml(raw);
  const sanitized = sanitizeLatexEscapes(htmlCleaned);

  const tokens: Array<{ isMath: boolean; text: string }> = [];
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

  return tokens
    .map((t) => (t.isMath ? t.text : enrichPlainSegmentWithMath(t.text)))
    .join('');
};

export const MathInlineRenderer: React.FC<{ text: string; className?: string }> = ({
  text,
  className = '',
}) => {
  if (!text) return null;

  const normalized = normalizeMathInText(text);
  const mathSplit = normalized.split(/(\$\$[\s\S]*?\$\$|\$[^$]+?\$)/g);

  return (
    <span className={className}>
      {mathSplit.map((segment, mIdx) => {
        if (segment.startsWith('$$') && segment.endsWith('$$') && segment.length > 4) {
          const formula = segment.slice(2, -2);
          const html = renderKaTeX(formula, true);
          return (
            <span
              key={`dmath-${mIdx}`}
              className="inline-math mx-1 align-middle"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }

        if (segment.startsWith('$') && segment.endsWith('$') && segment.length > 2) {
          const formula = segment.slice(1, -1);
          const html = renderKaTeX(formula, false);
          return (
            <span
              key={`math-${mIdx}`}
              className="inline-math mx-0.5 align-baseline"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }

        const boldSplit = segment.split(/(\*\*[^*]+?\*\*)/g);
        return (
          <React.Fragment key={`text-${mIdx}`}>
            {boldSplit.map((bSeg, bIdx) => {
              if (bSeg.startsWith('**') && bSeg.endsWith('**') && bSeg.length > 4) {
                return (
                  <strong key={`b-${bIdx}`} className="font-bold">
                    {bSeg.slice(2, -2)}
                  </strong>
                );
              }

              const codeSplit = bSeg.split(/(`[^`]+?`)/g);
              return codeSplit.map((cSeg, cIdx) => {
                if (cSeg.startsWith('`') && cSeg.endsWith('`') && cSeg.length > 2) {
                  return (
                    <code
                      key={`c-${cIdx}`}
                      className="px-1.5 py-0.5 mx-0.5 rounded bg-slate-100 dark:bg-[#070D1B] text-slate-900 dark:text-sky-300 font-mono text-[11px] border border-slate-300 dark:border-sky-900/40"
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
  stripAnswerHeader = false,
}) => {
  if (!content) return null;

  let preprocessed = normalizeMathInText(content);

  // If stripAnswerHeader is true, remove redundant leading "💡 সঠিক উত্তর: ..." line so Answer isn't shown twice
  if (stripAnswerHeader) {
    preprocessed = preprocessed
      .split('\n')
      .filter((line) => {
        const t = line.trim();
        return !t.startsWith('💡 সঠিক উত্তর') && !t.startsWith('সঠিক উত্তর:');
      })
      .join('\n')
      .trim();
  }

  if (!preprocessed) return null;

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
    <div className={`space-y-2 font-sans leading-relaxed text-slate-900 dark:text-slate-200 ${className}`}>
      {blocks.map((block, bIdx) => {
        if (block.type === 'blockMath') {
          const html = renderKaTeX(block.content, true);
          return (
            <div
              key={`block-${bIdx}`}
              className="my-2.5 py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-[#060B17] border border-slate-200 dark:border-indigo-950/90 overflow-x-auto text-center text-slate-950 dark:text-sky-200 shadow-inner"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }

        const lines = block.content.split('\n');
        return (
          <React.Fragment key={`md-${bIdx}`}>
            {lines.map((line, lIdx) => {
              const trimmed = line.trim();
              if (!trimmed) {
                return <div key={`empty-${bIdx}-${lIdx}`} className="h-1" />;
              }

              if (trimmed === '---' || trimmed === '***') {
                return (
                  <hr
                    key={`hr-${bIdx}-${lIdx}`}
                    className="my-2.5 border-slate-200 dark:border-indigo-900/40"
                  />
                );
              }

              if (trimmed.startsWith('### ')) {
                const text = trimmed.replace(/^###\s+/, '');
                return (
                  <h4
                    key={`h4-${bIdx}-${lIdx}`}
                    className="text-xs sm:text-sm font-bold text-indigo-700 dark:text-sky-300 mt-2.5 mb-1 flex items-center gap-1.5"
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
                    className="text-sm sm:text-base font-bold text-indigo-900 dark:text-indigo-200 mt-3 mb-1.5"
                  >
                    <MathInlineRenderer text={text} />
                  </h3>
                );
              }

              if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
                const bulletText = trimmed.replace(/^[*\-]\s+/, '');
                return (
                  <div
                    key={`li-${bIdx}-${lIdx}`}
                    className="flex items-start gap-2 text-slate-900 dark:text-slate-300 text-xs sm:text-sm pl-2 py-0.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-sky-400 mt-2 shrink-0" />
                    <div className="flex-1 leading-relaxed">
                      <MathInlineRenderer text={bulletText} />
                    </div>
                  </div>
                );
              }

              const numMatch = trimmed.match(/^(\d+[\.\)])\s+(.*)$/);
              if (numMatch) {
                const num = numMatch[1];
                const itemText = numMatch[2];
                return (
                  <div
                    key={`num-${bIdx}-${lIdx}`}
                    className="flex items-start gap-2 text-slate-900 dark:text-slate-300 text-xs sm:text-sm pl-2 py-0.5"
                  >
                    <span className="font-bold text-indigo-700 dark:text-sky-400 text-xs shrink-0 mt-0.5">
                      {num}
                    </span>
                    <div className="flex-1 leading-relaxed">
                      <MathInlineRenderer text={itemText} />
                    </div>
                  </div>
                );
              }

              return (
                <p
                  key={`p-${bIdx}-${lIdx}`}
                  className="text-slate-900 dark:text-slate-200 text-xs sm:text-sm leading-relaxed"
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
