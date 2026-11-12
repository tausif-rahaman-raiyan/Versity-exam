import React from 'react';
import { siteConfig } from '../data/siteConfig';
import type { ViewMode } from '../types';

type FooterProps = {
  onChangeView: (view: ViewMode) => void;
  onOpenApiKeyModal: () => void;
};

export const Footer: React.FC<FooterProps> = ({ onChangeView, onOpenApiKeyModal }) => {
  const currentYear = new Date().getFullYear();
  const baseUrl = import.meta.env.BASE_URL || '/';
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const logoSrc = `${normalizedBase}${siteConfig.logoPath.replace(/^\//, '')}`;

  const handleNavClick = (targetView: ViewMode) => {
    onChangeView(targetView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-10 sm:mt-12 border-t border-slate-200 dark:border-indigo-950/80 bg-slate-50/90 dark:bg-[#070C18] text-slate-600 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
          {/* Column 1: Brand + Description */}
          <div className="space-y-2.5 sm:space-y-3 pb-4 md:pb-0 border-b border-slate-200/80 dark:border-indigo-950/60 md:border-b-0">
            <div className="flex items-center gap-2.5">
              <img
                src={logoSrc}
                alt={siteConfig.footer.brand}
                referrerPolicy="no-referrer"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-indigo-300 dark:border-indigo-500/40 object-cover shrink-0"
              />
              <div className="min-w-0">
                <div className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">
                  {siteConfig.footer.brand}
                </div>
                <div className="text-[10px] sm:text-[11px] font-bold text-indigo-600 dark:text-sky-400 truncate">
                  {siteConfig.footer.subtitle}
                </div>
              </div>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {siteConfig.footer.description}
            </p>
          </div>

          {/* Column 2: Quick Navigation (2x2 compact grid on phone, vertical list on desktop) */}
          <div className="space-y-2.5 sm:space-y-3 pb-4 md:pb-0 border-b border-slate-200/80 dark:border-indigo-950/60 md:border-b-0">
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              Quick Navigation
            </h3>
            <ul className="grid grid-cols-2 gap-2 md:block md:space-y-2 text-xs sm:text-sm font-semibold">
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('home')}
                  className="w-full md:w-auto text-left px-3 py-2 md:p-0 rounded-xl md:rounded-none bg-white md:bg-transparent dark:bg-[#0B1325] md:dark:bg-transparent border border-slate-200/80 dark:border-indigo-900/50 md:border-0 hover:text-indigo-600 dark:hover:text-sky-400 transition-colors cursor-pointer truncate"
                >
                  Home & All Sessions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('home')}
                  className="w-full md:w-auto text-left px-3 py-2 md:p-0 rounded-xl md:rounded-none bg-white md:bg-transparent dark:bg-[#0B1325] md:dark:bg-transparent border border-slate-200/80 dark:border-indigo-900/50 md:border-0 hover:text-indigo-600 dark:hover:text-sky-400 transition-colors cursor-pointer truncate"
                >
                  Question Bank
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('analytics')}
                  className="w-full md:w-auto text-left px-3 py-2 md:p-0 rounded-xl md:rounded-none bg-white md:bg-transparent dark:bg-[#0B1325] md:dark:bg-transparent border border-slate-200/80 dark:border-indigo-900/50 md:border-0 hover:text-indigo-600 dark:hover:text-sky-400 transition-colors cursor-pointer truncate"
                >
                  Performance Analytics
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenApiKeyModal}
                  className="w-full md:w-auto text-left px-3 py-2 md:p-0 rounded-xl md:rounded-none bg-white md:bg-transparent dark:bg-[#0B1325] md:dark:bg-transparent border border-slate-200/80 dark:border-indigo-900/50 md:border-0 hover:text-indigo-600 dark:hover:text-sky-400 transition-colors cursor-pointer truncate"
                >
                  Configure AI Key
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Developer & Social Links */}
          <div className="space-y-2.5 sm:space-y-3">
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              Developer & Community
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Crafted & Maintained for Admission Aspirants — Developed by{' '}
              <strong className="font-extrabold text-indigo-600 dark:text-sky-400">
                {siteConfig.footer.developerName}
              </strong>
            </p>
            <div className="grid grid-cols-2 sm:flex items-center gap-2.5 sm:gap-3 pt-1">
              <a
                href={siteConfig.footer.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex items-center justify-center sm:justify-start gap-2 px-3.5 py-2.5 sm:py-2 rounded-xl bg-white dark:bg-[#0B1325] border border-slate-200 dark:border-indigo-900/60 hover:border-pink-400 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-2xs transition-colors"
              >
                <svg
                  className="w-4 h-4 text-pink-600 dark:text-pink-400 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <span>Instagram</span>
              </a>

              <a
                href={siteConfig.footer.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="inline-flex items-center justify-center sm:justify-start gap-2 px-3.5 py-2.5 sm:py-2 rounded-xl bg-white dark:bg-[#0B1325] border border-slate-200 dark:border-indigo-900/60 hover:border-indigo-400 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-2xs transition-colors"
              >
                <svg
                  className="w-4 h-4 text-slate-800 dark:text-slate-200 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-200/80 dark:border-indigo-950/60 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 text-center sm:text-left text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
          <div className="font-semibold text-slate-600 dark:text-slate-300">
            © {currentYear} {siteConfig.siteName}. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px] sm:text-xs">
            <span>{siteConfig.footer.bottomTags[0]}</span>
            <span aria-hidden="true">·</span>
            <span>{siteConfig.footer.bottomTags[1]}</span>
            <span aria-hidden="true">·</span>
            <span>{siteConfig.footer.bottomTags[2]}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
