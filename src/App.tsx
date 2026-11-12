/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { KeyRound, X, AlertTriangle } from 'lucide-react';
import { sessions } from './data/sessions';
import { siteConfig } from './data/siteConfig';
import type { Attempt, RuBranchOption, Session, ThemeMode, UiSettings, ViewMode } from './types';
import { loadAvailabilityIndex, loadSessionQuestions } from './utils/questionLoader';
import {
  addExamAttempt,
  applyThemeToDom,
  clearExamHistory,
  loadExamHistory,
  loadExamLanguage,
  loadGeminiApiKey,
  loadSelectedSubjects,
  loadTheme,
  loadUiSettings,
  saveExamLanguage,
  saveGeminiApiKey,
  saveSelectedSubjects,
  saveTheme,
  saveUiSettings
} from './utils/storage';
import { AnalyticsView } from './components/AnalyticsView';
import { ApiKeyModal } from './components/ApiKeyModal';
import { warmUpGeminiConnection } from './components/AiTutorPanel';
import { ExamView } from './components/ExamView';
import { HomeView } from './components/HomeView';
import { Navbar } from './components/Navbar';
import { QuestionBankView } from './components/QuestionBankView';
import { RuExamModal } from './components/RuExamModal';
import { SubjectPickModal } from './components/SubjectPickModal';

export default function App() {
  const [view, setView] = useState<ViewMode>('home');
  const [activeSession, setActiveSession] = useState<Session>(sessions[0]);

  // Persisted Home filter state so returning from Exam / Question Bank keeps exact University & scroll position
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string>('DU');
  const [selectedUnit, setSelectedUnit] = useState<string>('A');
  const [selectedAgriSubId, setSelectedAgriSubId] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [theme, setTheme] = useState<ThemeMode>(() => loadTheme());
  const [uiSettings, setUiSettings] = useState<UiSettings>(() => loadUiSettings());
  const [apiKey, setApiKey] = useState<string>(() => loadGeminiApiKey());
  const [history, setHistory] = useState<Attempt[]>(() => loadExamHistory());
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(() =>
    loadSelectedSubjects()
  );
  const [selectedRuBranch, setSelectedRuBranch] = useState<RuBranchOption | null>(null);
  const [language, setLanguage] = useState<'bn' | 'en'>(() => loadExamLanguage());

  // Availability map: sessionId -> true if JSON exists and has >=1 question
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, boolean>>({});

  // Modals & Toasts
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [pendingSubjectPickSession, setPendingSubjectPickSession] = useState<Session | null>(
    null
  );
  const [pendingRuSession, setPendingRuSession] = useState<Session | null>(null);
  const [missingKeyToast, setMissingKeyToast] = useState(false);

  // Scroll memory for home view (§5)
  const homeScrollYRef = useRef<number>(0);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync page title & meta description from siteConfig.ts
  useEffect(() => {
    document.title = siteConfig.pageTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', siteConfig.metaDescription);
    }
  }, []);

  // Pre-warm Gemini AI Tutor connection in background as soon as apiKey is available
  useEffect(() => {
    if (apiKey && apiKey.trim().length > 10) {
      warmUpGeminiConnection(apiKey);
    }
  }, [apiKey]);

  // Apply theme to <html>
  useEffect(() => {
    applyThemeToDom(theme);
    saveTheme(theme);
  }, [theme]);

  // Save UI settings
  const handleUpdateUiSettings = useCallback((next: UiSettings) => {
    setUiSettings(next);
    saveUiSettings(next);
  }, []);

  // Save API Key
  const handleSaveApiKey = useCallback((newKey: string) => {
    setApiKey(newKey);
    saveGeminiApiKey(newKey);
    if (newKey.trim().length > 10) {
      setMissingKeyToast(false);
      warmUpGeminiConnection(newKey);
    }
  }, []);

  // Save Language
  const handleUpdateLanguage = useCallback((nextLang: 'bn' | 'en') => {
    setLanguage(nextLang);
    saveExamLanguage(nextLang);
  }, []);

  // Load lightweight session availability index on initial mount (single 1KB request)
  useEffect(() => {
    let cancelled = false;
    loadAvailabilityIndex().then((indexMap) => {
      if (!cancelled && Object.keys(indexMap).length > 0) {
        setAvailabilityMap(indexMap);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Missing API Key Toast (auto-hide after 6 s — §7)
  const triggerMissingKeyToast = useCallback(() => {
    setMissingKeyToast(true);
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setMissingKeyToast(false);
    }, 6000);
  }, []);

  // View navigation with scroll memory (§5)
  const navigateToView = useCallback(
    (nextView: ViewMode) => {
      if (view === 'home' && nextView !== 'home') {
        homeScrollYRef.current = window.scrollY;
      }

      setView(nextView);

      if (nextView === 'home') {
        const savedY = homeScrollYRef.current;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.scrollTo({ top: savedY, behavior: 'instant' as ScrollBehavior });
          });
        });
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      }
    },
    [view]
  );

  // Sync institution selection if user retakes or opens a session from Analytics
  const syncInstitutionForSession = useCallback((session: Session) => {
    const agriIds = new Set(['GSTAGRI', 'GAU', 'BAU', 'SAU', 'CVASU', 'SYLAU']);
    if (agriIds.has(session.institution)) {
      setSelectedInstitutionId('AGRI');
    } else {
      setSelectedInstitutionId(session.institution);
      if ((session.institution === 'JU' || session.institution === 'KhU') && session.unit) {
        setSelectedUnit(session.unit);
      }
    }
  }, []);

  // Open Question Bank for a session
  const handleOpenQuestionBank = useCallback(
    (session: Session) => {
      if (view === 'home') {
        homeScrollYRef.current = window.scrollY;
      }
      syncInstitutionForSession(session);
      setActiveSession(session);
      navigateToView('questionBank');
      loadSessionQuestions(session.id).then((qs) => {
        setAvailabilityMap((prev) => ({ ...prev, [session.id]: qs.length > 0 }));
      });
    },
    [view, navigateToView, syncInstitutionForSession]
  );

  // Start Exam (opens RuExamModal for RU sessions, or SubjectPickModal for DU subjectPickMode sessions — §8.1)
  const handleRequestStartExam = useCallback(
    (session: Session) => {
      if (view === 'home') {
        homeScrollYRef.current = window.scrollY;
      }
      syncInstitutionForSession(session);

      loadSessionQuestions(session.id).then((qs) => {
        const hasQuestions = qs.length > 0;
        setAvailabilityMap((prev) => ({ ...prev, [session.id]: hasQuestions }));

        if (!hasQuestions) {
          // If no questions exist yet, open the Question Bank empty state
          setActiveSession(session);
          navigateToView('questionBank');
          return;
        }

        if (session.institution === 'RU') {
          setPendingRuSession(session);
        } else if (session.subjectPickMode) {
          setPendingSubjectPickSession(session);
        } else {
          setActiveSession(session);
          navigateToView('exam');
        }
      });
    },
    [view, navigateToView, syncInstitutionForSession]
  );

  const handleConfirmSubjectPick = useCallback(
    (pickedSubjects: string[], chosenLang: 'bn' | 'en') => {
      setSelectedSubjects(pickedSubjects);
      saveSelectedSubjects(pickedSubjects);
      setLanguage(chosenLang);
      saveExamLanguage(chosenLang);

      if (pendingSubjectPickSession) {
        setActiveSession(pendingSubjectPickSession);
        setPendingSubjectPickSession(null);
        navigateToView('exam');
      }
    },
    [pendingSubjectPickSession, navigateToView]
  );

  const handleConfirmRuExam = useCallback(
    (chosenBranch: RuBranchOption | null) => {
      setSelectedRuBranch(chosenBranch);
      if (pendingRuSession) {
        setActiveSession(pendingRuSession);
        setPendingRuSession(null);
        navigateToView('exam');
      }
    },
    [pendingRuSession, navigateToView]
  );

  const handleSaveAttempt = useCallback((attempt: Attempt) => {
    const updated = addExamAttempt(attempt);
    setHistory(updated);
  }, []);

  const handleClearHistory = useCallback(() => {
    clearExamHistory();
    setHistory([]);
  }, []);

  const fontClassMap: Record<UiSettings['fontStyle'], string> = {
    sans: 'font-style-sans',
    serif: 'font-style-serif',
    mono: 'font-style-mono',
    bryndan: 'font-style-bryndan'
  };

  return (
    <div
      className={`min-h-screen bg-white dark:bg-[#060913] text-slate-900 dark:text-slate-100 transition-colors duration-200 ${
        fontClassMap[uiSettings.fontStyle] || 'font-style-sans'
      }`}
    >
      {/* Top Navbar (hidden during exam view — §6) */}
      <Navbar
        view={view}
        onChangeView={navigateToView}
        theme={theme}
        onChangeTheme={setTheme}
        uiSettings={uiSettings}
        onChangeUiSettings={handleUpdateUiSettings}
        apiKey={apiKey}
        onOpenApiKeyModal={() => setApiKeyModalOpen(true)}
      />

      {/* Active View */}
      <main>
        {view === 'home' && (
          <HomeView
            sessions={sessions}
            availabilityMap={availabilityMap}
            selectedInstitutionId={selectedInstitutionId}
            onSelectInstitutionId={setSelectedInstitutionId}
            selectedUnit={selectedUnit}
            onSelectUnit={setSelectedUnit}
            selectedAgriSubId={selectedAgriSubId}
            onSelectAgriSubId={setSelectedAgriSubId}
            searchQuery={searchQuery}
            onChangeSearchQuery={setSearchQuery}
            onOpenQuestionBank={handleOpenQuestionBank}
            onStartExam={handleRequestStartExam}
            onOpenApiKeyModal={() => setApiKeyModalOpen(true)}
            onChangeView={navigateToView}
          />
        )}

        {view === 'questionBank' && (
          <QuestionBankView
            session={activeSession}
            uiSettings={uiSettings}
            apiKey={apiKey}
            language={language}
            onChangeLanguage={handleUpdateLanguage}
            onBackHome={() => navigateToView('home')}
            onStartExam={handleRequestStartExam}
            onOpenApiKeyModal={() => setApiKeyModalOpen(true)}
            onRequireApiKeyToast={triggerMissingKeyToast}
            onChangeView={navigateToView}
          />
        )}

        {view === 'exam' && (
          <ExamView
            session={activeSession}
            selectedSubjects={activeSession.subjectPickMode ? selectedSubjects : null}
            selectedRuBranch={activeSession.institution === 'RU' ? selectedRuBranch : null}
            language={language}
            theme={theme}
            onChangeTheme={setTheme}
            uiSettings={uiSettings}
            onChangeUiSettings={handleUpdateUiSettings}
            apiKey={apiKey}
            onOpenApiKeyModal={() => setApiKeyModalOpen(true)}
            onRequireApiKeyToast={triggerMissingKeyToast}
            onSaveAttempt={handleSaveAttempt}
            onExitExam={() => navigateToView('home')}
          />
        )}

        {view === 'analytics' && (
          <AnalyticsView
            history={history}
            sessions={sessions}
            onClearHistory={handleClearHistory}
            onRetakeSession={handleRequestStartExam}
            onChangeView={navigateToView}
            onOpenApiKeyModal={() => setApiKeyModalOpen(true)}
          />
        )}
      </main>

      {/* DU 4-of-6 Subject Pick Modal (§8.1) */}
      <SubjectPickModal
        session={pendingSubjectPickSession}
        isOpen={Boolean(pendingSubjectPickSession)}
        initialSubjects={selectedSubjects}
        initialLanguage={language}
        onClose={() => setPendingSubjectPickSession(null)}
        onConfirm={handleConfirmSubjectPick}
      />

      {/* Rajshahi University (RU) Section A / Section B Exam Setup Modal */}
      <RuExamModal
        session={pendingRuSession}
        isOpen={Boolean(pendingRuSession)}
        onClose={() => setPendingRuSession(null)}
        onConfirm={handleConfirmRuExam}
      />

      {/* Gemini API Key Setup Modal (§10.1) */}
      <ApiKeyModal
        isOpen={apiKeyModalOpen}
        currentKey={apiKey}
        onClose={() => setApiKeyModalOpen(false)}
        onSaveKey={handleSaveApiKey}
      />

      {/* Bottom Floating Toast: API Key Required (§7 & §14) */}
      {missingKeyToast && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-auto z-50">
          <div className="p-3.5 sm:px-4 sm:py-3 rounded-2xl bg-slate-900 dark:bg-[#0B1325] text-white border-2 border-amber-500/80 shadow-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>API Key required — AI Tutor ব্যবহার করতে Gemini API Key যুক্ত করুন</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setMissingKeyToast(false);
                  setApiKeyModalOpen(true);
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Add API Key</span>
              </button>
              <button
                type="button"
                onClick={() => setMissingKeyToast(false)}
                aria-label="Close toast"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
