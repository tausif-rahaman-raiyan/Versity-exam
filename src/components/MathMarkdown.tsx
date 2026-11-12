import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import { resolvePublicAsset } from '../utils/questionLoader';

type MathMarkdownProps = {
  content: string;
  className?: string;
  inline?: boolean;
};

export const MathMarkdown: React.FC<MathMarkdownProps> = React.memo(({ content, className = '', inline = false }) => {
  if (!content) return null;

  return (
    <div className={`math-markdown max-w-full overflow-visible break-words no-scrollbar leading-relaxed ${inline ? 'inline' : ''} ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[[rehypeKatex, { strict: false, throwOnError: false }]]}
        components={{
          p: ({ children }) =>
            inline ? <span className="inline">{children}</span> : <p className="mb-2 last:mb-0">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          strong: ({ children }) => <strong className="font-bold text-slate-900 dark:text-white">{children}</strong>,
          img: ({ src, alt }) => (
            <img
              src={resolvePublicAsset(src || '')}
              alt={alt || 'Diagram'}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="max-w-full max-h-72 rounded-xl border border-slate-200 dark:border-slate-700 bg-white p-1.5 my-2 object-contain"
            />
          ),
          code: ({ children, className: codeClass }) => {
            const isBlock = Boolean(codeClass && codeClass.includes('language-'));
            if (isBlock) {
              return (
                <pre className="p-3 my-2 rounded-xl bg-slate-900 text-slate-100 text-xs overflow-x-auto font-mono">
                  <code>{children}</code>
                </pre>
              );
            }
            return (
              <code className="px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-indigo-700 dark:text-sky-300 font-mono text-[0.9em]">
                {children}
              </code>
            );
          },
          table: ({ children }) => (
            <div className="overflow-x-auto my-2">
              <table className="min-w-full border-collapse border border-slate-300 dark:border-slate-700 text-sm">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-slate-300 dark:border-slate-700 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 font-bold text-left">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-slate-300 dark:border-slate-700 px-3 py-1.5">{children}</td>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});
