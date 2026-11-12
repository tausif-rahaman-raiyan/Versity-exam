import React, { useMemo, useRef } from 'react';
import {
  Sparkles,
  Search,
  KeyRound,
  Play,
  GraduationCap,
  Clock,
  FileText,
  Award,
  Eye
} from 'lucide-react';
import { institutions } from '../data/institutions';
import { siteConfig } from '../data/siteConfig';
import { toBnDigits, uiTexts } from '../data/translations';
import type { Session, ViewMode } from '../types';
import { getInstitutionCardClasses, getSessionCardPalette } from '../utils/palettes';
import { Footer } from './Footer';
import { UnitInfoSection } from './UnitInfoSection';

type HomeViewProps = {
  sessions: Session[];
  availabilityMap: Record<string, boolean>;
  selectedInstitutionId: string;
  onSelectInstitutionId: (id: string) => void;
  selectedUnit: string;
  onSelectUnit: (unit: string) => void;
  selectedAgriSubId: string;
  onSelectAgriSubId: (id: string) => void;
  searchQuery: string;
  onChangeSearchQuery: (q: string) => void;
  onOpenQuestionBank: (session: Session) => void;
  onStartExam: (session: Session) => void;
  onOpenApiKeyModal: () => void;
  onChangeView: (view: ViewMode) => void;
};

export const HomeView: React.FC<HomeViewProps> = ({
  sessions,
  availabilityMap,
  selectedInstitutionId,
  onSelectInstitutionId,
  selectedUnit,
  onSelectUnit,
  selectedAgriSubId,
  onSelectAgriSubId,
  searchQuery,
  onChangeSearchQuery,
  onOpenQuestionBank,
  onStartExam,
  onOpenApiKeyModal,
  onChangeView
}) => {
  const sessionSectionRef = useRef<HTMLDivElement | null>(null);

  // Top-level institutions (no parent)
  const topLevelInstitutions = useMemo(
    () => institutions.filter((inst) => !inst.parent),
    []
  );

  // Sub-institutions under AGRI
  const agriSubInstitutions = useMemo(
    () => institutions.filter((inst) => inst.parent === 'AGRI'),
    []
  );

  const scrollToSessionCards = () => {
    requestAnimationFrame(() => {
      if (!sessionSectionRef.current) return;

      const startY = window.scrollY;
      const rect = sessionSectionRef.current.getBoundingClientRect();

      // Position the top of the session cards so they rise up into the lower ~1/3 of the screen
      // (top of session cards sits at ~58% from the top of the viewport, i.e. ~42% up from the bottom)
      const desiredTopInViewport = Math.round(window.innerHeight * 0.58);
      const targetY = Math.max(0, startY + rect.top - desiredTopInViewport);

      // Only scroll down (or gently adjust) if the session cards are currently below that 1/3 mark
      const distance = targetY - startY;
      if (distance <= 8) return;

      const durationMs = 550;
      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / durationMs);
        // Smooth cubic ease-out: 1 - (1 - t)^3
        const eased = 1 - Math.pow(1 - progress, 3);
        window.scrollTo(0, startY + distance * eased);
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    });
  };

  const handleSelectTopInstitution = (id: string) => {
    onSelectInstitutionId(id);
    onSelectUnit('A');
    onSelectAgriSubId('ALL');
    scrollToSessionCards();
  };

  const handleSelectAgriSub = (subId: string) => {
    onSelectAgriSubId(subId);
    scrollToSessionCards();
  };

  const filteredSessions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const agriIds = new Set(agriSubInstitutions.map((sub) => sub.id));

    return sessions.filter((s) => {
      // 1. Institution filter
      if (selectedInstitutionId !== 'ALL') {
        if (selectedInstitutionId === 'AGRI') {
          if (selectedAgriSubId === 'ALL') {
            if (!agriIds.has(s.institution)) return false;
          } else if (s.institution !== selectedAgriSubId) {
            return false;
          }
        } else if (s.institution !== selectedInstitutionId) {
          return false;
        }
      }

      // 2. Unit filter (exclusively for JU [A/D] and KhU [A/B])
      if (selectedInstitutionId === 'JU') {
        const activeJuUnit = selectedUnit === 'D' ? 'D' : 'A';
        if (s.unit !== activeJuUnit) return false;
      } else if (selectedInstitutionId === 'KhU') {
        const activeKhuUnit = selectedUnit === 'B' ? 'B' : 'A';
        if (s.unit !== activeKhuUnit) return false;
      }

      // 3. Search query filter
      if (q) {
        const matchTitle = s.title.toLowerCase().includes(q);
        const matchSession = s.session.toLowerCase().includes(q);
        const matchDesc = s.description.toLowerCase().includes(q);
        const matchInst = s.institution.toLowerCase().includes(q);
        if (!matchTitle && !matchSession && !matchDesc && !matchInst) {
          return false;
        }
      }

      return true;
    });
  }, [
    sessions,
    selectedInstitutionId,
    selectedUnit,
    selectedAgriSubId,
    searchQuery,
    agriSubInstitutions
  ]);

  const firstStartableSession = useMemo(() => {
    const withQuestions = filteredSessions.find((s) => availabilityMap[s.id] === true);
    return withQuestions || filteredSessions[0] || sessions[0];
  }, [filteredSessions, availabilityMap, sessions]);

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-10">
        {/* 1. HERO SECTION (§4.1 & §5.1) */}
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-100/80 via-white to-sky-100/70 dark:from-[#0B132B] dark:via-[#080D1A] dark:to-[#040711] py-8 sm:py-12 px-4 sm:px-8 rounded-3xl shadow-xl border border-indigo-200 dark:border-indigo-900/40">
          <div className="max-w-4xl mx-auto text-center space-y-5">
            {/* Top badge pill */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-600/10 dark:bg-indigo-500/10 border border-indigo-500/30 text-indigo-700 dark:text-sky-300 text-[11px] sm:text-xs font-bold uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{siteConfig.heroBadge}</span>
            </div>

            {/* H1 2 lines */}
            <h1 className="text-2xl sm:text-5xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
              <span className="block">{siteConfig.heroTitleLine1}</span>
              <span className="block mt-1 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 dark:from-sky-400 dark:via-indigo-300 dark:to-sky-200 bg-clip-text text-transparent">
                {siteConfig.heroTitleGradientLine2}
              </span>
            </h1>

            {/* Paragraph with 2 highlighted phrases */}
            <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {siteConfig.heroParagraph.prefix}
              <span className="text-indigo-700 dark:text-sky-300 font-bold">
                {siteConfig.heroParagraph.highlight1}
              </span>
              {siteConfig.heroParagraph.middle}
              <span className="text-amber-600 dark:text-amber-300 font-bold">
                {siteConfig.heroParagraph.highlight2}
              </span>
              {siteConfig.heroParagraph.suffix}
            </p>

            {/* Search input + Start Strict Exam + AI Key buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 max-w-3xl mx-auto pt-1">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onChangeSearchQuery(e.target.value)}
                  placeholder={siteConfig.searchPlaceholder}
                  aria-label="Search sessions"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-[#0E172A] border border-slate-300 dark:border-indigo-900/60 focus:border-indigo-600 dark:focus:border-sky-400 outline-none text-xs sm:text-sm text-slate-900 dark:text-white shadow-xs"
                />
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  disabled={!firstStartableSession || availabilityMap[firstStartableSession.id] !== true}
                  onClick={() => firstStartableSession && onStartExam(firstStartableSession)}
                  title={
                    firstStartableSession && availabilityMap[firstStartableSession.id] !== true
                      ? uiTexts.home.comingSoonBtnHint
                      : uiTexts.home.startStrictExamBtn
                  }
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-600/20 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Play className="w-4 h-4" />
                  <span>{uiTexts.home.startStrictExamBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenApiKeyModal}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 dark:bg-[#0E172A] border border-slate-300 dark:border-indigo-900/60 hover:border-indigo-400 text-indigo-700 dark:text-sky-300 rounded-xl font-bold text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{uiTexts.home.aiKeyBtn}</span>
                </button>
              </div>
            </div>

            {/* 4 Hero Stat Boxes (§4.2) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 pt-2">
              {/* 1. Blue */}
              <div className="p-3 rounded-xl border bg-blue-50/90 dark:bg-[#0C1933] border-blue-200 dark:border-blue-800/60">
                <div className="text-base sm:text-xl font-black text-blue-600 dark:text-sky-400 tabular-nums">
                  {siteConfig.heroStats[0].value}
                </div>
                <div className="text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
                  {siteConfig.heroStats[0].label}
                </div>
              </div>

              {/* 2. Amber */}
              <div className="p-3 rounded-xl border bg-amber-50/90 dark:bg-[#231608] border-amber-200 dark:border-amber-800/60">
                <div className="text-base sm:text-xl font-black text-amber-600 dark:text-amber-400 tabular-nums">
                  {siteConfig.heroStats[1].value}
                </div>
                <div className="text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
                  {siteConfig.heroStats[1].label}
                </div>
              </div>

              {/* 3. Purple */}
              <div className="p-3 rounded-xl border bg-purple-50/90 dark:bg-[#1B0F2E] border-purple-200 dark:border-purple-800/60">
                <div className="text-base sm:text-xl font-black text-purple-600 dark:text-purple-400 tabular-nums">
                  {siteConfig.heroStats[2].value}
                </div>
                <div className="text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
                  {siteConfig.heroStats[2].label}
                </div>
              </div>

              {/* 4. Indigo */}
              <div className="p-3 rounded-xl border bg-indigo-50/90 dark:bg-[#121638] border-indigo-200 dark:border-indigo-800/60">
                <div className="text-base sm:text-xl font-black text-indigo-600 dark:text-indigo-400 tabular-nums">
                  {siteConfig.heroStats[3].value}
                </div>
                <div className="text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
                  {siteConfig.heroStats[3].label}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. INSTITUTION SELECTOR (§2.2, §4.3, §5.2) */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-indigo-600 dark:text-sky-400 shrink-0" />
                <span>{uiTexts.home.institutionSectionTitle}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {uiTexts.home.institutionSectionSub}
              </p>
            </div>
          </div>

          {/* 5-column responsive institution grid (wraps 10 top-level cards cleanly to 2 rows) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
            {topLevelInstitutions.map((inst) => {
              const isSelected = selectedInstitutionId === inst.id;
              const classes = getInstitutionCardClasses(inst.colorKey, isSelected);

              return (
                <button
                  key={inst.id}
                  type="button"
                  onClick={() => handleSelectTopInstitution(inst.id)}
                  className={`p-3.5 sm:p-4 rounded-2xl border-2 min-h-[112px] sm:min-h-[126px] flex flex-col justify-between text-left transition-all cursor-pointer ${classes.card}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-xs sm:text-sm font-black px-2.5 py-0.5 rounded-lg uppercase tracking-wider ${classes.chip}`}
                    >
                      {inst.code}
                    </span>
                    {inst.units && inst.units.length > 1 && (
                      <span className={`text-[10px] font-bold ${classes.unitTag}`}>
                        {inst.units.join(' • ')}
                      </span>
                    )}
                  </div>

                  <div className="mt-2">
                    <div className={`text-sm sm:text-base lg:text-lg font-extrabold leading-snug ${classes.title}`}>
                      {inst.nameBn}
                    </div>
                    <div className={`text-[11px] sm:text-xs font-semibold mt-0.5 line-clamp-1 ${classes.desc}`}>
                      {inst.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* AGRI Sub-Institution Filter Chips (§2.2) */}
          {selectedInstitutionId === 'AGRI' && agriSubInstitutions.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-lime-50/70 dark:bg-[#111E08] border border-lime-300 dark:border-lime-800/60 flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold text-lime-900 dark:text-lime-300 mr-1">
                {uiTexts.home.agriGroupFilterLabel}
              </span>
              <button
                type="button"
                onClick={() => handleSelectAgriSub('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  selectedAgriSubId === 'ALL'
                    ? 'bg-lime-600 text-white border-lime-500 shadow-xs'
                    : 'bg-white dark:bg-[#0B1325] text-lime-800 dark:text-lime-300 border-lime-300 dark:border-lime-800 hover:bg-lime-100'
                }`}
              >
                {uiTexts.home.allChip}
              </button>
              {agriSubInstitutions.map((sub) => {
                const active = selectedAgriSubId === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => handleSelectAgriSub(sub.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      active
                        ? 'bg-lime-600 text-white border-lime-500 shadow-xs'
                        : 'bg-white dark:bg-[#0B1325] text-lime-800 dark:text-lime-300 border-lime-300 dark:border-lime-800 hover:bg-lime-100'
                    }`}
                  >
                    {sub.code} — {sub.nameBn}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* 3. SESSION GRID (§4.4 & §5.4) */}
        <div ref={sessionSectionRef}>
          {/* Exclusive Unit Selector & Side-by-Side Mark Distribution for JU and KhU */}
          <UnitInfoSection
            institutionId={selectedInstitutionId}
            selectedUnit={selectedUnit}
            onSelectUnit={onSelectUnit}
          />

          {filteredSessions.length === 0 ? (
            <div className="p-10 rounded-3xl bg-slate-50 dark:bg-[#0B1325] border-2 border-dashed border-slate-300 dark:border-indigo-900/60 text-center space-y-2">
              <div className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-slate-200">
                {uiTexts.home.noSessionsFound}
              </div>
              <button
                type="button"
                onClick={() => {
                  onChangeSearchQuery('');
                  onSelectAgriSubId('ALL');
                }}
                className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold cursor-pointer"
              >
                ফিল্টার রিসেট করুন (Reset Filters)
              </button>
            </div>
          ) : (
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredSessions.map((session, idx) => {
              const palette = getSessionCardPalette(idx);
              const isWritten = session.questionType === 'Written';
              const hasQuestionsLoaded = availabilityMap[session.id] === true;

              return (
                <article
                  key={session.id}
                  className={`p-4 sm:p-5 rounded-3xl flex flex-col justify-between transition-all ${palette.cardBg} ${palette.border}`}
                >
                  <div className="space-y-3">
                    {/* Top row chips */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-lg text-[11px] font-black uppercase tracking-wider ${palette.badge}`}
                        >
                          {session.institution}
                          {session.unit ? `-${session.unit}` : ''} • {session.session}
                        </span>
                        {session.subjectPickMode && (
                          <span className="px-2 py-0.5 rounded-lg bg-violet-600/15 dark:bg-violet-500/25 text-violet-700 dark:text-violet-300 border border-violet-400/40 text-[10px] font-bold">
                            {uiTexts.home.subjectPickChip}
                          </span>
                        )}
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold ${
                          isWritten
                            ? 'bg-amber-500 text-white'
                            : 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800'
                        }`}
                      >
                        {session.questionType}
                      </span>
                    </div>

                    {/* H3 Title & Description */}
                    <div>
                      <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
                        {session.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                        {session.description}
                      </p>
                    </div>

                    {/* 3 Metric Boxes (Time / Questions / Marks) */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <div className={`p-2.5 rounded-xl text-center ${palette.metricBox}`}>
                        <div
                          className={`text-xs sm:text-sm font-black tabular-nums flex items-center justify-center gap-1 ${palette.accentText}`}
                        >
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span>{toBnDigits(session.durationMinutes)}</span>
                        </div>
                        <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                          {uiTexts.home.metricMinutes}
                        </div>
                      </div>

                      <div className={`p-2.5 rounded-xl text-center ${palette.metricBox}`}>
                        <div
                          className={`text-xs sm:text-sm font-black tabular-nums flex items-center justify-center gap-1 ${palette.accentText}`}
                        >
                          <FileText className="w-3.5 h-3.5 shrink-0" />
                          <span>{toBnDigits(session.totalQuestions)}</span>
                        </div>
                        <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                          {uiTexts.home.metricQuestions}
                        </div>
                      </div>

                      <div className={`p-2.5 rounded-xl text-center ${palette.metricBox}`}>
                        <div
                          className={`text-xs sm:text-sm font-black tabular-nums flex items-center justify-center gap-1 ${palette.accentText}`}
                        >
                          <Award className="w-3.5 h-3.5 shrink-0" />
                          <span>{toBnDigits(session.totalMarks)}</span>
                        </div>
                        <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                          {uiTexts.home.metricMarks}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2 Action Buttons: See question & Start Exam (§5.4 & §16.1) */}
                  <div className="grid grid-cols-2 gap-2.5 mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
                    <button
                      type="button"
                      onClick={() => onOpenQuestionBank(session)}
                      className={`inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer min-h-[40px] ${palette.seeBtn}`}
                    >
                      <Eye className="w-4 h-4 shrink-0" />
                      <span>{uiTexts.home.seeQuestionBtn}</span>
                    </button>

                    <button
                      type="button"
                      disabled={!hasQuestionsLoaded}
                      onClick={() => onStartExam(session)}
                      title={!hasQuestionsLoaded ? uiTexts.home.comingSoonBtnHint : uiTexts.home.startExamBtn}
                      className={`inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-colors min-h-[40px] ${
                        hasQuestionsLoaded
                          ? `${palette.startBtn} cursor-pointer`
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
                      }`}
                    >
                      <Play className="w-4 h-4 shrink-0" />
                      <span>{uiTexts.home.startExamBtn}</span>
                    </button>
                  </div>
                </article>
              );
            })}
            </section>
          )}
        </div>
      </div>

      {/* 4. FOOTER (§13) */}
      <Footer onChangeView={onChangeView} onOpenApiKeyModal={onOpenApiKeyModal} />
    </div>
  );
};
