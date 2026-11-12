// ============================================================================
// EDITABLE SITE CONFIGURATION
// Change any branding, hero texts, developer info, storage prefix, or social
// links here without touching any React components.
// ============================================================================

export type HeroStat = {
  value: string;
  label: string;
};

export type SiteConfig = {
  storagePrefix: string;
  repoName: string;
  siteName: string;
  siteSubtitle: string;
  pageTitle: string;
  metaDescription: string;
  logoPath: string;
  defaultTheme: 'light' | 'dark';
  heroBadge: string;
  heroTitleLine1: string;
  heroTitleGradientLine2: string;
  heroParagraph: {
    prefix: string;
    highlight1: string;
    middle: string;
    highlight2: string;
    suffix: string;
  };
  searchPlaceholder: string;
  heroStats: [HeroStat, HeroStat, HeroStat, HeroStat];
  subjectPickRules: {
    mandatorySubjects: string[];
    optionalSubjects: string[];
    requiredTotal: number;
    defaultMcqQuestionsPerSubject: number;
    writtenQuestionsBySubject: Record<string, number>;
  };
  aiConfig: {
    countryExamName: string;
    aiLanguage: string;
    closeLabel: string;
    correctAnswerLabel: string;
    mcqSection1Label: string;
    mcqSection2Label: string;
    mcqSection3Label: string;
    writtenSection1Label: string;
    writtenSection2Label: string;
    writtenSection3Label: string;
  };
  footer: {
    brand: string;
    subtitle: string;
    description: string;
    developerName: string;
    instagramUrl: string;
    githubUrl: string;
    bottomTags: [string, string, string];
  };
};

export const siteConfig: SiteConfig = {
  storagePrefix: 'varsity_qb',
  repoName: 'varsity-question-bank',
  siteName: 'Varsity Question Bank',
  siteSubtitle: 'DU • RU • JU • CU • GST • AGRI',
  pageTitle: 'Varsity Question Bank & AI Tutor — ভর্তি প্রশ্নব্যাংক ও কঠোর পরীক্ষা সিমুলেটর',
  metaDescription:
    'Bangladesh University Admission Question Bank, Strict Timed Exam Simulator, and AI Tutor for DU, RU, JU, CU, GST, CoU, JnU, KhU, and Agriculture Cluster.',
  logoPath: 'logo.png',
  defaultTheme: 'light',

  heroBadge: 'Bangladesh Varsity Admission Question Bank & AI Coach',
  heroTitleLine1: 'বিশ্ববিদ্যালয় ভর্তি প্রস্তুতির',
  heroTitleGradientLine2: 'পূর্ণাঙ্গ প্রশ্নব্যাংক ও স্ট্রিক্ট এক্সাম',
  heroParagraph: {
    prefix: 'বিগত বছরের সকল বিশ্ববিদ্যালয়ের আসল প্রশ্নপত্র, ',
    highlight1: 'অটো-লক স্ট্রিক্ট টাইমড এক্সাম সিমুলেটর',
    middle: ' এবং প্রতিটি প্রশ্নের তাৎক্ষণিক ব্যাখ্যার জন্য রয়েছে ',
    highlight2: 'AI Tutor Admission Coach',
    suffix: ' — সবকিছু এক প্ল্যাটফর্মে।'
  },
  searchPlaceholder: 'সেশন বা বিশ্ববিদ্যালয় খুঁজুন (যেমন: DU 25-26, RU C, JU A, GST, BAU)...',
  heroStats: [
    { value: '২৬২+', label: 'সেশন ও প্রশ্নপত্র (Sessions)' },
    { value: '১৫+', label: 'বিশ্ববিদ্যালয় ও গুচ্ছ (Institutions)' },
    { value: '১০০%', label: 'অটো-লক রিয়েল এক্সাম (Strict Mode)' },
    { value: '২৪/৭', label: 'তাৎক্ষণিক AI Tutor সাপোর্ট' }
  ],

  // DU 4-of-6 Subject Pick Mode rules (sessions with subjectPickMode: true)
  subjectPickRules: {
    mandatorySubjects: ['Physics', 'Chemistry'],
    optionalSubjects: ['Mathematics', 'Biology', 'Bangla', 'English'],
    requiredTotal: 4,
    defaultMcqQuestionsPerSubject: 15, // 4 * 15 = 60 MCQ
    writtenQuestionsBySubject: {
      Physics: 6,
      Chemistry: 6,
      Mathematics: 5,
      Biology: 5,
      Bangla: 5,
      English: 5
    }
  },

  // AI Tutor language & section header configuration
  aiConfig: {
    countryExamName: 'Bangladesh University (DU, RU, JU, CU, GST, Agri)',
    aiLanguage: 'Bangla (বাংলা)',
    closeLabel: 'বন্ধ করুন',
    correctAnswerLabel: 'সঠিক উত্তর',
    mcqSection1Label: '১. 🎯 **বিস্তারিত ব্যাখ্যা ও মূল তত্ত্ব (Detailed Explanation):**',
    mcqSection2Label: '২. 📐 **ধাপে ধাপে সমাধান (Step-by-Step Solution):**',
    mcqSection3Label: '৩. ⚡ **পরীক্ষার হলের MCQ শর্টকাট টেকনিক (Exam-Time Shortcut):**',
    writtenSection1Label: '১. 🎯 **মূল সূত্র ও তত্ত্ব (Core Theory):**',
    writtenSection2Label: '২. 📐 **ধাপে ধাপে পূর্ণাঙ্গ সমাধান:**',
    writtenSection3Label: '৩. ⚡ **পরীক্ষার হলের শর্টকাট ও টিপস:**'
  },

  footer: {
    brand: 'Varsity Question Bank',
    subtitle: 'DU • RU • JU • CU • GST • CoU • JnU • KhU • AGRI',
    description:
      'বাংলাদেশের সকল পাবলিক বিশ্ববিদ্যালয় ও কৃষি গুচ্ছ ভর্তি পরীক্ষার বিগত বছরের প্রশ্নব্যাংক, নির্ভুল সমাধান, কঠোর সময়ভিত্তিক মডেল টেস্ট এবং AI Tutor প্ল্যাটফর্ম।',
    developerName: 'Tausif Rahaman Raiyan',
    instagramUrl: 'https://www.instagram.com/tausifrahamanraiyan/',
    githubUrl: 'https://tausif-rahaman-raiyan.github.io/',
    bottomTags: [
      'Bangladesh Varsity Admission',
      'Privacy-First Local Storage',
      'Educational Fair Use'
    ]
  }
};
