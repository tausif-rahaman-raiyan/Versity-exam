// ============================================================================
// COLOR / GRADIENT SYSTEM (§4.3 & §4.4)
// Exact Tailwind classes for Institution cards and Session (paper) cards
// ============================================================================

export function getInstitutionCardClasses(colorKey: string, isSelected: boolean): {
  card: string;
  chip: string;
  title: string;
  desc: string;
  unitTag: string;
} {
  if (isSelected) {
    const selectedMap: Record<
      string,
      { card: string; chip: string; title: string; desc: string; unitTag: string }
    > = {
      blue: {
        card: 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 border-blue-300 dark:border-blue-400 shadow-xl shadow-blue-600/30 ring-2 ring-blue-500/40 scale-[1.02]',
        chip: 'bg-white text-blue-700 shadow-xs',
        title: 'text-white',
        desc: 'text-blue-100',
        unitTag: 'text-blue-100'
      },
      amber: {
        card: 'bg-gradient-to-br from-amber-500 via-amber-600 to-orange-700 border-amber-200 dark:border-amber-300 shadow-xl shadow-amber-500/30 ring-2 ring-amber-500/40 scale-[1.02]',
        chip: 'bg-white text-amber-800 shadow-xs',
        title: 'text-white',
        desc: 'text-amber-50',
        unitTag: 'text-amber-100'
      },
      purple: {
        card: 'bg-gradient-to-br from-purple-600 via-purple-700 to-violet-800 border-purple-300 dark:border-purple-400 shadow-xl shadow-purple-600/30 ring-2 ring-purple-500/40 scale-[1.02]',
        chip: 'bg-white text-purple-700 shadow-xs',
        title: 'text-white',
        desc: 'text-purple-100',
        unitTag: 'text-purple-100'
      },
      cyan: {
        card: 'bg-gradient-to-br from-cyan-600 via-cyan-700 to-sky-800 border-cyan-300 dark:border-cyan-400 shadow-xl shadow-cyan-600/30 ring-2 ring-cyan-500/40 scale-[1.02]',
        chip: 'bg-white text-cyan-800 shadow-xs',
        title: 'text-white',
        desc: 'text-cyan-100',
        unitTag: 'text-cyan-100'
      },
      fuchsia: {
        card: 'bg-gradient-to-br from-fuchsia-600 via-fuchsia-700 to-pink-800 border-fuchsia-300 dark:border-fuchsia-400 shadow-xl shadow-fuchsia-600/30 ring-2 ring-fuchsia-500/40 scale-[1.02]',
        chip: 'bg-white text-fuchsia-700 shadow-xs',
        title: 'text-white',
        desc: 'text-fuchsia-100',
        unitTag: 'text-fuchsia-100'
      },
      emerald: {
        card: 'bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 border-emerald-300 dark:border-emerald-400 shadow-xl shadow-emerald-600/30 ring-2 ring-emerald-500/40 scale-[1.02]',
        chip: 'bg-white text-emerald-800 shadow-xs',
        title: 'text-white',
        desc: 'text-emerald-100',
        unitTag: 'text-emerald-100'
      },
      rose: {
        card: 'bg-gradient-to-br from-rose-600 via-rose-700 to-red-800 border-rose-300 dark:border-rose-400 shadow-xl shadow-rose-600/30 ring-2 ring-rose-500/40 scale-[1.02]',
        chip: 'bg-white text-rose-700 shadow-xs',
        title: 'text-white',
        desc: 'text-rose-100',
        unitTag: 'text-rose-100'
      },
      teal: {
        card: 'bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 border-teal-300 dark:border-teal-400 shadow-xl shadow-teal-600/30 ring-2 ring-teal-500/40 scale-[1.02]',
        chip: 'bg-white text-teal-800 shadow-xs',
        title: 'text-white',
        desc: 'text-teal-100',
        unitTag: 'text-teal-100'
      },
      lime: {
        card: 'bg-gradient-to-br from-lime-600 via-green-600 to-emerald-700 border-lime-300 dark:border-lime-400 shadow-xl shadow-lime-600/30 ring-2 ring-lime-500/40 scale-[1.02]',
        chip: 'bg-white text-lime-800 shadow-xs',
        title: 'text-white',
        desc: 'text-lime-100',
        unitTag: 'text-lime-100'
      },
      indigo: {
        card: 'bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 border-indigo-300 dark:border-indigo-400 shadow-xl shadow-indigo-600/30 ring-2 ring-indigo-500/40 scale-[1.02]',
        chip: 'bg-white text-indigo-700 shadow-xs',
        title: 'text-white',
        desc: 'text-indigo-100',
        unitTag: 'text-indigo-100'
      }
    };

    return selectedMap[colorKey] || selectedMap.indigo;
  }

  const unselectedMap: Record<
    string,
    { card: string; chip: string; title: string; desc: string; unitTag: string }
  > = {
    blue: {
      card: 'border-blue-300 dark:border-blue-500/40 bg-blue-50/60 dark:bg-[#0D1A33]/80 hover:border-blue-500',
      chip: 'bg-blue-600/15 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border border-blue-400/40',
      title: 'text-slate-900 dark:text-slate-100',
      desc: 'text-blue-800/80 dark:text-blue-300/80',
      unitTag: 'text-slate-500 dark:text-slate-400'
    },
    amber: {
      card: 'border-amber-300 dark:border-amber-500/40 bg-amber-50/60 dark:bg-[#241608]/80 hover:border-amber-500',
      chip: 'bg-amber-600/15 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-400/40',
      title: 'text-slate-900 dark:text-slate-100',
      desc: 'text-amber-900/80 dark:text-amber-300/80',
      unitTag: 'text-slate-500 dark:text-slate-400'
    },
    purple: {
      card: 'border-purple-300 dark:border-purple-500/40 bg-purple-50/60 dark:bg-[#1B0E30]/80 hover:border-purple-500',
      chip: 'bg-purple-600/15 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 border border-purple-400/40',
      title: 'text-slate-900 dark:text-slate-100',
      desc: 'text-purple-800/80 dark:text-purple-300/80',
      unitTag: 'text-slate-500 dark:text-slate-400'
    },
    cyan: {
      card: 'border-cyan-300 dark:border-cyan-500/40 bg-cyan-50/60 dark:bg-[#08202E]/80 hover:border-cyan-500',
      chip: 'bg-cyan-600/15 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-300 border border-cyan-400/40',
      title: 'text-slate-900 dark:text-slate-100',
      desc: 'text-cyan-900/80 dark:text-cyan-300/80',
      unitTag: 'text-slate-500 dark:text-slate-400'
    },
    fuchsia: {
      card: 'border-fuchsia-300 dark:border-fuchsia-500/40 bg-fuchsia-50/60 dark:bg-[#250C2A]/80 hover:border-fuchsia-500',
      chip: 'bg-fuchsia-600/15 text-fuchsia-700 dark:bg-fuchsia-500/20 dark:text-fuchsia-300 border border-fuchsia-400/40',
      title: 'text-slate-900 dark:text-slate-100',
      desc: 'text-fuchsia-800/80 dark:text-fuchsia-300/80',
      unitTag: 'text-slate-500 dark:text-slate-400'
    },
    emerald: {
      card: 'border-emerald-300 dark:border-emerald-500/40 bg-emerald-50/60 dark:bg-[#082419]/80 hover:border-emerald-500',
      chip: 'bg-emerald-600/15 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-400/40',
      title: 'text-slate-900 dark:text-slate-100',
      desc: 'text-emerald-900/80 dark:text-emerald-300/80',
      unitTag: 'text-slate-500 dark:text-slate-400'
    },
    rose: {
      card: 'border-rose-300 dark:border-rose-500/40 bg-rose-50/60 dark:bg-[#290B16]/80 hover:border-rose-500',
      chip: 'bg-rose-600/15 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 border border-rose-400/40',
      title: 'text-slate-900 dark:text-slate-100',
      desc: 'text-rose-800/80 dark:text-rose-300/80',
      unitTag: 'text-slate-500 dark:text-slate-400'
    },
    teal: {
      card: 'border-teal-300 dark:border-teal-500/40 bg-teal-50/60 dark:bg-[#072222]/80 hover:border-teal-500',
      chip: 'bg-teal-600/15 text-teal-800 dark:bg-teal-500/20 dark:text-teal-300 border border-teal-400/40',
      title: 'text-slate-900 dark:text-slate-100',
      desc: 'text-teal-900/80 dark:text-teal-300/80',
      unitTag: 'text-slate-500 dark:text-slate-400'
    },
    lime: {
      card: 'border-lime-300 dark:border-lime-500/40 bg-lime-50/60 dark:bg-[#142208]/80 hover:border-lime-500',
      chip: 'bg-lime-600/15 text-lime-800 dark:bg-lime-500/20 dark:text-lime-300 border border-lime-400/40',
      title: 'text-slate-900 dark:text-slate-100',
      desc: 'text-lime-900/80 dark:text-lime-300/80',
      unitTag: 'text-slate-500 dark:text-slate-400'
    },
    indigo: {
      card: 'border-indigo-300 dark:border-indigo-500/40 bg-indigo-50/60 dark:bg-[#121538]/80 hover:border-indigo-500',
      chip: 'bg-indigo-600/15 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-400/40',
      title: 'text-slate-900 dark:text-slate-100',
      desc: 'text-indigo-800/80 dark:text-indigo-300/80',
      unitTag: 'text-slate-500 dark:text-slate-400'
    }
  };

  return unselectedMap[colorKey] || unselectedMap.indigo;
}

export type SessionCardPalette = {
  cardBg: string;
  border: string;
  badge: string;
  metricBox: string;
  accentText: string;
  startBtn: string;
  seeBtn: string;
};

export const SESSION_PALETTES: SessionCardPalette[] = [
  // 0: blue
  {
    cardBg: 'bg-gradient-to-br from-blue-100/90 via-blue-50/60 to-white dark:from-[#0C1E3E] dark:via-[#09152B] dark:to-[#060D1B]',
    border: 'border-2 border-blue-300 dark:border-blue-500/50 hover:border-blue-500 dark:hover:border-blue-400 shadow-md shadow-blue-500/10',
    badge: 'bg-blue-600 text-white shadow-xs',
    metricBox: 'bg-blue-50/90 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50',
    accentText: 'text-blue-700 dark:text-blue-300',
    startBtn: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20',
    seeBtn: 'bg-white hover:bg-blue-50 dark:bg-[#09152B] text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700/60'
  },
  // 1: purple
  {
    cardBg: 'bg-gradient-to-br from-purple-100/90 via-purple-50/60 to-white dark:from-[#21103B] dark:via-[#160B28] dark:to-[#0B0616]',
    border: 'border-2 border-purple-300 dark:border-purple-500/50 hover:border-purple-500 dark:hover:border-purple-400 shadow-md shadow-purple-500/10',
    badge: 'bg-purple-600 text-white shadow-xs',
    metricBox: 'bg-purple-50/90 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50',
    accentText: 'text-purple-700 dark:text-purple-300',
    startBtn: 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/20',
    seeBtn: 'bg-white hover:bg-purple-50 dark:bg-[#160B28] text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700/60'
  },
  // 2: amber
  {
    cardBg: 'bg-gradient-to-br from-amber-100/90 via-amber-50/60 to-white dark:from-[#2C1B08] dark:via-[#1D1206] dark:to-[#0F0A04]',
    border: 'border-2 border-amber-300 dark:border-amber-500/50 hover:border-amber-500 dark:hover:border-amber-400 shadow-md shadow-amber-500/10',
    badge: 'bg-amber-600 text-white shadow-xs',
    metricBox: 'bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50',
    accentText: 'text-amber-800 dark:text-amber-300',
    startBtn: 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20',
    seeBtn: 'bg-white hover:bg-amber-50 dark:bg-[#1D1206] text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60'
  },
  // 3: fuchsia
  {
    cardBg: 'bg-gradient-to-br from-fuchsia-100/90 via-fuchsia-50/60 to-white dark:from-[#2D0E33] dark:via-[#1E0A22] dark:to-[#100514]',
    border: 'border-2 border-fuchsia-300 dark:border-fuchsia-500/50 hover:border-fuchsia-500 dark:hover:border-fuchsia-400 shadow-md shadow-fuchsia-500/10',
    badge: 'bg-fuchsia-600 text-white shadow-xs',
    metricBox: 'bg-fuchsia-50/90 dark:bg-fuchsia-950/40 border border-fuchsia-200 dark:border-fuchsia-800/50',
    accentText: 'text-fuchsia-700 dark:text-fuchsia-300',
    startBtn: 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-fuchsia-600/20',
    seeBtn: 'bg-white hover:bg-fuchsia-50 dark:bg-[#1E0A22] text-fuchsia-700 dark:text-fuchsia-300 border border-fuchsia-300 dark:border-fuchsia-700/60'
  },
  // 4: cyan
  {
    cardBg: 'bg-gradient-to-br from-cyan-100/90 via-cyan-50/60 to-white dark:from-[#082635] dark:via-[#061A24] dark:to-[#040E15]',
    border: 'border-2 border-cyan-300 dark:border-cyan-500/50 hover:border-cyan-500 dark:hover:border-cyan-400 shadow-md shadow-cyan-500/10',
    badge: 'bg-cyan-600 text-white shadow-xs',
    metricBox: 'bg-cyan-50/90 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/50',
    accentText: 'text-cyan-800 dark:text-cyan-300',
    startBtn: 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/20',
    seeBtn: 'bg-white hover:bg-cyan-50 dark:bg-[#061A24] text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-700/60'
  },
  // 5: emerald
  {
    cardBg: 'bg-gradient-to-br from-emerald-100/90 via-emerald-50/60 to-white dark:from-[#07261C] dark:via-[#051A13] dark:to-[#030E0A]',
    border: 'border-2 border-emerald-300 dark:border-emerald-500/50 hover:border-emerald-500 dark:hover:border-emerald-400 shadow-md shadow-emerald-500/10',
    badge: 'bg-emerald-600 text-white shadow-xs',
    metricBox: 'bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50',
    accentText: 'text-emerald-700 dark:text-emerald-300',
    startBtn: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20',
    seeBtn: 'bg-white hover:bg-emerald-50 dark:bg-[#051A13] text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60'
  }
];

export function getSessionCardPalette(index: number): SessionCardPalette {
  return SESSION_PALETTES[Math.abs(index) % SESSION_PALETTES.length];
}
