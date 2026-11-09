/**
 * Subject color definitions strictly avoiding Green (emerald/green) and Red (red/rose)
 * so Green is exclusively reserved for Correct Answers and Red for Wrong Answers.
 */
export function getSubjectCardStyle(subject?: string): {
  borderClass: string;
  bgClass: string;
  badgeBg: string;
  badgeText: string;
  accentBar: string;
  numBadge: string;
  filterActive: string;
  filterInactive: string;
} {
  const sub = (subject || '').trim().toLowerCase();

  // 1. Physics -> Royal Blue
  if (sub.includes('physics') || sub.includes('পদার্থ')) {
    return {
      borderClass: 'border-2 border-l-8 border-blue-500/80 dark:border-blue-500/80 hover:border-blue-400 shadow-md shadow-blue-500/5',
      bgClass: 'bg-gradient-to-br from-blue-50/80 via-white to-sky-50/40 dark:from-blue-950/55 dark:via-[#0B152B] dark:to-[#081020]',
      badgeBg: 'bg-blue-600 text-white border border-blue-400/50 shadow-sm',
      badgeText: 'text-white',
      accentBar: 'bg-blue-500',
      numBadge: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-900/70 dark:text-blue-200 dark:border-blue-500/50',
      filterActive: 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30 ring-2 ring-blue-400/40',
      filterInactive: 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/80 dark:hover:bg-blue-900/60',
    };
  }

  // 2. Chemistry -> Purple / Violet (Not Green!)
  if (sub.includes('chemistry') || sub.includes('রসায়ন') || sub.includes('রসায়ন')) {
    return {
      borderClass: 'border-2 border-l-8 border-purple-500/80 dark:border-purple-500/80 hover:border-purple-400 shadow-md shadow-purple-500/5',
      bgClass: 'bg-gradient-to-br from-purple-50/80 via-white to-violet-50/40 dark:from-purple-950/55 dark:via-[#150E2A] dark:to-[#0C091D]',
      badgeBg: 'bg-purple-600 text-white border border-purple-400/50 shadow-sm',
      badgeText: 'text-white',
      accentBar: 'bg-purple-500',
      numBadge: 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-900/70 dark:text-purple-200 dark:border-purple-500/50',
      filterActive: 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30 ring-2 ring-purple-400/40',
      filterInactive: 'bg-purple-50 text-purple-800 border-purple-300 hover:bg-purple-100 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/80 dark:hover:bg-purple-900/60',
    };
  }

  // 3. Mathematics -> Indigo
  if (sub.includes('math') || sub.includes('গণিত')) {
    return {
      borderClass: 'border-2 border-l-8 border-indigo-500/80 dark:border-indigo-500/80 hover:border-indigo-400 shadow-md shadow-indigo-500/5',
      bgClass: 'bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/40 dark:from-indigo-950/55 dark:via-[#10132E] dark:to-[#090B1C]',
      badgeBg: 'bg-indigo-600 text-white border border-indigo-400/50 shadow-sm',
      badgeText: 'text-white',
      accentBar: 'bg-indigo-500',
      numBadge: 'bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-900/70 dark:text-indigo-200 dark:border-indigo-500/50',
      filterActive: 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400/40',
      filterInactive: 'bg-indigo-50 text-indigo-800 border-indigo-300 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800/80 dark:hover:bg-indigo-900/60',
    };
  }

  // 4. Biology -> Warm Amber / Gold
  if (sub.includes('biology') || sub.includes('জীববিজ্ঞান')) {
    return {
      borderClass: 'border-2 border-l-8 border-amber-500/80 dark:border-amber-500/80 hover:border-amber-400 shadow-md shadow-amber-500/5',
      bgClass: 'bg-gradient-to-br from-amber-50/80 via-white to-yellow-50/40 dark:from-amber-950/50 dark:via-[#1C140B] dark:to-[#120D08]',
      badgeBg: 'bg-amber-600 text-white border border-amber-400/50 shadow-sm',
      badgeText: 'text-white',
      accentBar: 'bg-amber-500',
      numBadge: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-900/70 dark:text-amber-200 dark:border-amber-500/50',
      filterActive: 'bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-600/30 ring-2 ring-amber-400/40',
      filterInactive: 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/80 dark:hover:bg-amber-900/60',
    };
  }

  // 5. Bangla (বাংলা) -> Fuchsia / Magenta (Not Red!)
  if (sub.includes('bangla') || sub.includes('বাংলা')) {
    return {
      borderClass: 'border-2 border-l-8 border-fuchsia-500/80 dark:border-fuchsia-500/80 hover:border-fuchsia-400 shadow-md shadow-fuchsia-500/5',
      bgClass: 'bg-gradient-to-br from-fuchsia-50/80 via-white to-purple-50/40 dark:from-fuchsia-950/55 dark:via-[#200E24] dark:to-[#130818]',
      badgeBg: 'bg-fuchsia-600 text-white border border-fuchsia-400/50 shadow-sm',
      badgeText: 'text-white',
      accentBar: 'bg-fuchsia-500',
      numBadge: 'bg-fuchsia-100 text-fuchsia-900 border-fuchsia-300 dark:bg-fuchsia-900/70 dark:text-fuchsia-200 dark:border-fuchsia-500/50',
      filterActive: 'bg-fuchsia-600 text-white border-fuchsia-500 shadow-md shadow-fuchsia-600/30 ring-2 ring-fuchsia-400/40',
      filterInactive: 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-300 hover:bg-fuchsia-100 dark:bg-fuchsia-950/60 dark:text-fuchsia-300 dark:border-fuchsia-800/80 dark:hover:bg-fuchsia-900/60',
    };
  }

  // 6. English -> Cyan / Sky-Teal
  if (sub.includes('english') || sub.includes('ইংরেজি')) {
    return {
      borderClass: 'border-2 border-l-8 border-cyan-500/80 dark:border-cyan-500/80 hover:border-cyan-400 shadow-md shadow-cyan-500/5',
      bgClass: 'bg-gradient-to-br from-cyan-50/80 via-white to-sky-50/40 dark:from-cyan-950/55 dark:via-[#081826] dark:to-[#06101B]',
      badgeBg: 'bg-cyan-600 text-white border border-cyan-400/50 shadow-sm',
      badgeText: 'text-white',
      accentBar: 'bg-cyan-500',
      numBadge: 'bg-cyan-100 text-cyan-900 border-cyan-300 dark:bg-cyan-900/70 dark:text-cyan-200 dark:border-cyan-500/50',
      filterActive: 'bg-cyan-600 text-white border-cyan-500 shadow-md shadow-cyan-600/30 ring-2 ring-cyan-400/40',
      filterInactive: 'bg-cyan-50 text-cyan-800 border-cyan-300 hover:bg-cyan-100 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800/80 dark:hover:bg-cyan-900/60',
    };
  }

  // 7. ICT / Default -> Sky Blue
  return {
    borderClass: 'border-2 border-l-8 border-sky-500/80 hover:border-sky-400 shadow-md shadow-sky-500/5',
    bgClass: 'bg-gradient-to-br from-sky-50/80 via-white to-slate-50/40 dark:from-sky-950/50 dark:via-[#0B1222] dark:to-[#080E1B]',
    badgeBg: 'bg-sky-600 text-white shadow-sm',
    badgeText: 'text-white',
    accentBar: 'bg-sky-500',
    numBadge: 'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-900/70 dark:text-sky-200 dark:border-sky-500/50',
    filterActive: 'bg-sky-600 text-white border-sky-500 shadow-md shadow-sky-600/30 ring-2 ring-sky-400/40',
    filterInactive: 'bg-sky-50 text-sky-800 border-sky-300 hover:bg-sky-100 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800/80 dark:hover:bg-sky-900/60',
  };
}
