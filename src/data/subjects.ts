// ============================================================================
// EDITABLE SUBJECTS & COLOR THEMES (§4.5)
// Add or edit subjects and their color themes here.
// ============================================================================

export type SubjectDef = {
  id: string;
  nameEn: string;
  nameBn: string;
  colorKey: 'blue' | 'purple' | 'indigo' | 'amber' | 'fuchsia' | 'cyan' | 'emerald' | 'rose' | 'teal' | 'lime' | 'sky';
  iconName: 'Atom' | 'FlaskConical' | 'Sigma' | 'Dna' | 'BookOpen' | 'Languages' | 'Sparkles' | 'Cpu';
  aliases: string[];
};

export type SubjectColorTheme = {
  borderClass: string;
  bgClass: string;
  badgeBg: string;
  badgeText: string;
  accentBar: string;
  numBadge: string;
  filterActive: string;
  filterInactive: string;
};

export const subjects: SubjectDef[] = [
  {
    id: 'Physics',
    nameEn: 'Physics',
    nameBn: 'পদার্থবিজ্ঞান',
    colorKey: 'blue',
    iconName: 'Atom',
    aliases: ['physics', 'পদার্থ', 'পদার্থবিজ্ঞান', 'phy']
  },
  {
    id: 'Chemistry',
    nameEn: 'Chemistry',
    nameBn: 'রসায়ন',
    colorKey: 'purple',
    iconName: 'FlaskConical',
    aliases: ['chemistry', 'রসায়ন', 'রসায়ন', 'chem']
  },
  {
    id: 'Mathematics',
    nameEn: 'Higher Math',
    nameBn: 'উচ্চতর গণিত',
    colorKey: 'indigo',
    iconName: 'Sigma',
    aliases: ['mathematics', 'math', 'higher math', 'গণিত', 'উচ্চতর গণিত']
  },
  {
    id: 'Biology',
    nameEn: 'Biology',
    nameBn: 'জীববিজ্ঞান',
    colorKey: 'amber',
    iconName: 'Dna',
    aliases: ['biology', 'botany', 'zoology', 'জীববিজ্ঞান', 'জীব', 'উদ্ভিদবিজ্ঞান', 'প্রাণিবিজ্ঞান', 'bio']
  },
  {
    id: 'Bangla',
    nameEn: 'Bangla',
    nameBn: 'বাংলা',
    colorKey: 'fuchsia',
    iconName: 'BookOpen',
    aliases: ['bangla', 'bengali', 'বাংলা']
  },
  {
    id: 'English',
    nameEn: 'English',
    nameBn: 'ইংরেজি',
    colorKey: 'cyan',
    iconName: 'Languages',
    aliases: ['english', 'ইংরেজি', 'eng']
  },
  {
    id: 'ICT',
    nameEn: 'ICT',
    nameBn: 'আইসিটি',
    colorKey: 'sky',
    iconName: 'Cpu',
    aliases: ['ict', 'আইসিটি', 'তথ্য ও যোগাযোগ প্রযুক্তি', 'computer']
  },
  {
    id: 'General Knowledge',
    nameEn: 'General Knowledge & IQ',
    nameBn: 'সাধারণ জ্ঞান ও আইকিউ',
    colorKey: 'sky',
    iconName: 'Sparkles',
    aliases: ['gk', 'general knowledge', 'iq', 'সাধারণ জ্ঞান', 'মানসিক দক্ষতা']
  }
];

const SUBJECT_THEME_MAP: Record<string, SubjectColorTheme> = {
  blue: {
    borderClass: 'border-2 border-blue-200/90 dark:border-blue-800/70 hover:border-blue-400 dark:hover:border-blue-600 shadow-xs',
    bgClass: 'bg-blue-50/45 dark:bg-[#0A1428]',
    badgeBg: 'bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-950/90 dark:text-blue-200 dark:border-blue-700/80',
    badgeText: 'text-blue-700 dark:text-blue-300',
    accentBar: 'bg-blue-600',
    numBadge: 'bg-blue-600 text-white border-blue-500',
    filterActive: 'bg-blue-600 text-white border-blue-500 shadow-sm ring-2 ring-blue-500/30',
    filterInactive: 'bg-blue-50/80 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-400 dark:bg-blue-950/45 dark:text-blue-300 dark:border-blue-800/70 dark:hover:bg-blue-900/60'
  },
  purple: {
    borderClass: 'border-2 border-purple-200/90 dark:border-purple-800/70 hover:border-purple-400 dark:hover:border-purple-600 shadow-xs',
    bgClass: 'bg-purple-50/45 dark:bg-[#140E29]',
    badgeBg: 'bg-purple-100 text-purple-800 border border-purple-300 dark:bg-purple-950/90 dark:text-purple-200 dark:border-purple-700/80',
    badgeText: 'text-purple-700 dark:text-purple-300',
    accentBar: 'bg-purple-600',
    numBadge: 'bg-purple-600 text-white border-purple-500',
    filterActive: 'bg-purple-600 text-white border-purple-500 shadow-sm ring-2 ring-purple-500/30',
    filterInactive: 'bg-purple-50/80 text-purple-700 border-purple-200 hover:bg-purple-100 hover:border-purple-400 dark:bg-purple-950/45 dark:text-purple-300 dark:border-purple-800/70 dark:hover:bg-purple-900/60'
  },
  indigo: {
    borderClass: 'border-2 border-indigo-200/90 dark:border-indigo-800/70 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-xs',
    bgClass: 'bg-indigo-50/45 dark:bg-[#0D122B]',
    badgeBg: 'bg-indigo-100 text-indigo-800 border border-indigo-300 dark:bg-indigo-950/90 dark:text-indigo-200 dark:border-indigo-700/80',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    accentBar: 'bg-indigo-600',
    numBadge: 'bg-indigo-600 text-white border-indigo-500',
    filterActive: 'bg-indigo-600 text-white border-indigo-500 shadow-sm ring-2 ring-indigo-500/30',
    filterInactive: 'bg-indigo-50/80 text-indigo-700 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-400 dark:bg-indigo-950/45 dark:text-indigo-300 dark:border-indigo-800/70 dark:hover:bg-indigo-900/60'
  },
  amber: {
    borderClass: 'border-2 border-amber-200/90 dark:border-amber-800/70 hover:border-amber-400 dark:hover:border-amber-600 shadow-xs',
    bgClass: 'bg-amber-50/45 dark:bg-[#1C1409]',
    badgeBg: 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/90 dark:text-amber-200 dark:border-amber-700/80',
    badgeText: 'text-amber-700 dark:text-amber-300',
    accentBar: 'bg-amber-600',
    numBadge: 'bg-amber-600 text-white border-amber-500',
    filterActive: 'bg-amber-600 text-white border-amber-500 shadow-sm ring-2 ring-amber-500/30',
    filterInactive: 'bg-amber-50/80 text-amber-700 border-amber-200 hover:bg-amber-100 hover:border-amber-400 dark:bg-amber-950/45 dark:text-amber-300 dark:border-amber-800/70 dark:hover:bg-amber-900/60'
  },
  fuchsia: {
    borderClass: 'border-2 border-fuchsia-200/90 dark:border-fuchsia-800/70 hover:border-fuchsia-400 dark:hover:border-fuchsia-600 shadow-xs',
    bgClass: 'bg-fuchsia-50/45 dark:bg-[#1E0D24]',
    badgeBg: 'bg-fuchsia-100 text-fuchsia-800 border border-fuchsia-300 dark:bg-fuchsia-950/90 dark:text-fuchsia-200 dark:border-fuchsia-700/80',
    badgeText: 'text-fuchsia-700 dark:text-fuchsia-300',
    accentBar: 'bg-fuchsia-600',
    numBadge: 'bg-fuchsia-600 text-white border-fuchsia-500',
    filterActive: 'bg-fuchsia-600 text-white border-fuchsia-500 shadow-sm ring-2 ring-fuchsia-500/30',
    filterInactive: 'bg-fuchsia-50/80 text-fuchsia-700 border-fuchsia-200 hover:bg-fuchsia-100 hover:border-fuchsia-400 dark:bg-fuchsia-950/45 dark:text-fuchsia-300 dark:border-fuchsia-800/70 dark:hover:bg-fuchsia-900/60'
  },
  cyan: {
    borderClass: 'border-2 border-cyan-200/90 dark:border-cyan-800/70 hover:border-cyan-400 dark:hover:border-cyan-600 shadow-xs',
    bgClass: 'bg-cyan-50/45 dark:bg-[#081A24]',
    badgeBg: 'bg-cyan-100 text-cyan-800 border border-cyan-300 dark:bg-cyan-950/90 dark:text-cyan-200 dark:border-cyan-700/80',
    badgeText: 'text-cyan-700 dark:text-cyan-300',
    accentBar: 'bg-cyan-600',
    numBadge: 'bg-cyan-600 text-white border-cyan-500',
    filterActive: 'bg-cyan-600 text-white border-cyan-500 shadow-sm ring-2 ring-cyan-500/30',
    filterInactive: 'bg-cyan-50/80 text-cyan-700 border-cyan-200 hover:bg-cyan-100 hover:border-cyan-400 dark:bg-cyan-950/45 dark:text-cyan-300 dark:border-cyan-800/70 dark:hover:bg-cyan-900/60'
  },
  sky: {
    borderClass: 'border-2 border-sky-200/90 dark:border-sky-800/70 hover:border-sky-400 dark:hover:border-sky-600 shadow-xs',
    bgClass: 'bg-sky-50/45 dark:bg-[#0B1526]',
    badgeBg: 'bg-sky-100 text-sky-800 border border-sky-300 dark:bg-sky-950/90 dark:text-sky-200 dark:border-sky-700/80',
    badgeText: 'text-sky-700 dark:text-sky-300',
    accentBar: 'bg-sky-600',
    numBadge: 'bg-sky-600 text-white border-sky-500',
    filterActive: 'bg-sky-600 text-white border-sky-500 shadow-sm ring-2 ring-sky-500/30',
    filterInactive: 'bg-sky-50/80 text-sky-700 border-sky-200 hover:bg-sky-100 hover:border-sky-400 dark:bg-sky-950/45 dark:text-sky-300 dark:border-sky-800/70 dark:hover:bg-sky-900/60'
  }
};

export function findSubjectDef(rawSubject: string): SubjectDef {
  const lower = (rawSubject || '').trim().toLowerCase();
  for (const sub of subjects) {
    if (
      sub.id.toLowerCase() === lower ||
      sub.nameEn.toLowerCase().includes(lower) ||
      lower.includes(sub.id.toLowerCase()) ||
      sub.aliases.some((alias) => lower.includes(alias.toLowerCase()))
    ) {
      return sub;
    }
  }
  return {
    id: rawSubject || 'General',
    nameEn: rawSubject || 'General',
    nameBn: rawSubject || 'সাধারণ',
    colorKey: 'sky',
    iconName: 'Sparkles',
    aliases: []
  };
}

export function getSubjectTheme(rawSubject: string): SubjectColorTheme {
  const def = findSubjectDef(rawSubject);
  return SUBJECT_THEME_MAP[def.colorKey] || SUBJECT_THEME_MAP.sky;
}

export function getSubjectDisplayName(rawSubject: string, lang: 'bn' | 'en' = 'bn'): string {
  const def = findSubjectDef(rawSubject);
  return lang === 'en' ? def.nameEn : def.nameBn;
}
