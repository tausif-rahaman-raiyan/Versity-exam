// ============================================================================
// EDITABLE UI TRANSLATIONS & BENGALI DIGIT HELPER
// ============================================================================

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBnDigits(value: number | string, useBn = true): string {
  const str = String(value);
  if (!useBn) return str;
  return str.replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)] ?? d);
}

export function extractBilingualText(rawText: string | undefined, lang: 'bn' | 'en'): string {
  if (!rawText) return '';
  if (!rawText.includes('||EN||')) return rawText;
  const [bnPart, enPart] = rawText.split('||EN||');
  if (lang === 'en') {
    return (enPart || bnPart || '').trim();
  }
  return (bnPart || enPart || '').trim();
}

export const defaultOptionLabelsBn = ['ক', 'খ', 'গ', 'ঘ', 'ঙ', 'চ'];
export const defaultOptionLabelsEn = ['A', 'B', 'C', 'D', 'E', 'F'];

export const uiTexts = {
  nav: {
    questionBank: 'Question Bank',
    analytics: 'Analytics',
    settings: 'Settings',
    menu: 'Menu'
  },
  home: {
    startStrictExamBtn: 'Start Strict Exam',
    aiKeyBtn: 'AI Key',
    institutionSectionTitle: 'বিশ্ববিদ্যালয় ও ইউনিট নির্বাচন করুন',
    institutionSectionSub: 'Select an institution card below to filter admission papers & question banks',
    agriGroupFilterLabel: 'কৃষি বিশ্ববিদ্যালয় সাব-ফিল্টার (Agri Cluster Filter):',
    unitFilterLabel: 'ইউনিট ফিল্টার (Unit Filter):',
    allChip: 'All (সকল)',
    filterAll: 'All',
    filterMcq: 'MCQ',
    filterWritten: 'Written',
    totalSessionsPrefix: 'Total sessions:',
    totalSessionsSuffix: 'found',
    filterHint: 'যেকোনো সেশনের "See question" ক্লিক করে ব্যাখ্যাসহ প্রশ্নব্যাংক দেখুন অথবা "Start Exam" দিয়ে স্ট্রিক্ট এক্সাম শুরু করুন।',
    subjectPickChip: 'Subject-Pick (4 of 6)',
    metricTime: 'সময় (Time)',
    metricMinutes: 'মিনিট',
    metricQuestions: 'প্রশ্ন (Questions)',
    metricMarks: 'মার্কস (Marks)',
    seeQuestionBtn: 'See question',
    startExamBtn: 'Start Exam',
    comingSoonBtnHint: 'প্রশ্ন শীঘ্রই আসছে (Coming Soon)',
    noSessionsFound: 'আপনার সার্চ বা ফিল্টারের সাথে কোনো সেশন পাওয়া যায়নি।'
  },
  questionBank: {
    backToSessions: 'সকল সেশনে ফিরে যান (Back to all sessions)',
    startStrictExam: 'Start Strict Exam',
    sessionPrefix: 'Session',
    qbBadge: 'Question Bank & Solution',
    subtitleTemplate: (count: string) =>
      `মোট ${count}টি প্রশ্ন • সঠিক উত্তর ও বিস্তারিত ব্যাখ্যা • সরাসরি AI Tutor Admission Coach`,
    searchPlaceholder: 'প্রশ্ন, অধ্যায়, বিষয় বা ব্যাখ্যা খুঁজুন (Search questions, options, explanations)...',
    allSubjects: 'সকল বিষয়',
    questionLabel: 'প্রশ্ন',
    writtenBadge: 'Written (লিখিত)',
    unverifiedBadge: 'Unverified',
    explanationTitle: 'Explanation & Solution (ব্যাখ্যা ও সমাধান)',
    openAiTutor: 'AI Tutor (বিস্তারিত বুঝুন)',
    closeAiTutor: 'Close AI Tutor',
    comingSoonTitle: 'Questions for this paper are coming soon',
    comingSoonDesc:
      'এই সেশনের প্রশ্নপত্র খুব শীঘ্রই যুক্ত করা হবে। অনুগ্রহ করে `public/data/<sessionId>.json` ফাইলে প্রশ্ন যুক্ত করুন অথবা অন্য সেশন দেখুন।',
    noSearchMatch: 'আপনার সার্চ বা বিষয় ফিল্টারের সাথে কোনো প্রশ্ন মেলেনি।'
  },
  exam: {
    backBtn: 'Exit',
    answeredLabel: 'উত্তর প্রদান:',
    submitBtn: 'Submit Exam',
    retakeBtn: 'Retake Exam',
    lockedBadge: 'Locked 🔒',
    writtenNote:
      'Written question — solve on paper, then compare with the solution and AI Tutor after the exam. (লিখিত প্রশ্ন — খাতায় সমাধান করুন, পরীক্ষা শেষে সমাধান ও AI Tutor এর সাথে মিলিয়ে নিন।)',
    evalReportTitle: 'Final Result & Analysis (Evaluation Report)',
    negMarkingNotice: (neg: number) =>
      `নেগেটিভ মার্কিং প্রযোজ্য: প্রতিটি ভুল উত্তরের জন্য ${neg} মার্কস কর্তন করা হয়েছে।`,
    writtenOnlyEvalNote:
      'এটি একটি লিখিত (Written) প্রশ্নপত্র। নিচের প্রতিটি প্রশ্নের আদর্শ সমাধান ও AI Tutor ব্যাখ্যার সাথে আপনার খাতার উত্তর মিলিয়ে স্ব-মূল্যায়ন করুন।',
    statScore: 'Score / Total',
    statCorrect: 'Correct (সঠিক)',
    statWrong: 'Wrong (ভুল)',
    statSkipped: 'Skipped (বাকি)',
    statAccuracy: 'Accuracy %',
    statUnverified: 'Unverified',
    badgeCorrect: 'সঠিক',
    badgeWrong: 'ভুল',
    badgeSkipped: 'অনুত্তরিত (Skipped)'
  },
  analytics: {
    title: 'Your Exam Performance & Analytics',
    subtitle:
      'আপনার সকল পরীক্ষার ফলাফল আপনার ব্রাউজারের LocalStorage-এ সংরক্ষিত থাকে (Privacy-first local storage)।',
    deleteHistoryBtn: 'Delete History',
    deleteConfirmTitle: 'ইতিহাস মুছে ফেলতে চান? (Delete Exam History)',
    deleteConfirmDesc: (count: number) =>
      `আপনি কি নিশ্চিত যে আপনার সংরক্ষিত ${count}টি পরীক্ষার ফলাফল মুছে ফেলতে চান? This action cannot be undone.`,
    cancelBtn: 'No, Cancel',
    confirmDeleteBtn: 'Yes, Delete',
    emptyTitle: 'No exams taken yet (এখনো কোনো পরীক্ষা দেওয়া হয়নি)',
    emptyDesc:
      'আপনি এখনো কোনো স্ট্রিক্ট টাইমড এক্সামে অংশ নেননি। প্রশ্নব্যাংক থেকে যেকোনো সেশন বেছে নিয়ে পরীক্ষা দিন এবং এখানে আপনার বিস্তারিত পারফরম্যান্স অ্যানালিটিক্স দেখুন।',
    browseBtn: 'Browse question bank & exam sessions',
    statTotalExams: 'Total exams',
    statAvgScore: 'Average score %',
    statAccuracy: 'Overall accuracy %',
    statCorrectWrong: 'Correct / Wrong',
    recentResultsHeading: 'Recent results'
  }
};
