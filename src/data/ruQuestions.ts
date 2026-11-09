import { Question } from './questionBank';

export const RU_QUESTIONS: Question[] = [
  // --- RU PHYSICS ---
  {
    id: 'ru-p-1',
    university: 'RU',
    session: '24-25',
    subject: 'Physics',
    question: 'কোনো তারের উপাদানের ইয়ং-এর গুণাঙ্ক Y, দৈর্ঘ্য L এবং প্রস্থচ্ছেদের ক্ষেত্রফল A। দৈর্ঘ্য l পরিমাণ বৃদ্ধি করতে কত কাজ করতে হবে?',
    options: ['½ Y A l² / L', 'Y A l / L', '½ Y A l / L²', 'Y A l² / 2L²'],
    correctAnswer: 0,
    explanation: 'কৃতকাজ W = ½ × বল × প্রসারণ = ½ × (Y A l / L) × l = ½ (Y A l² / L)।',
    questionType: 'MCQ',
    marks: 1.25
  },
  {
    id: 'ru-p-2',
    university: 'RU',
    session: '23-24',
    subject: 'Physics',
    question: 'শব্দ তরঙ্গের ক্ষেত্রে একটি খোলা নলের মূল সুরের কম্পাঙ্ক একই দৈর্ঘ্যের বদ্ধ নলের মূল সুরের কম্পাঙ্কের কত গুণ?',
    options: ['অর্ধেক (0.5)', 'দ্বিগুণ (2)', 'সমান (1)', 'চারগুণ (4)'],
    correctAnswer: 1,
    explanation: 'খোলা নলের ক্ষেত্রে f_open = v / 2L এবং বদ্ধ নলের ক্ষেত্রে f_closed = v / 4L। সুতরাং f_open = 2 × f_closed।',
    questionType: 'MCQ',
    marks: 1.25
  },
  {
    id: 'ru-p-3',
    university: 'RU',
    session: '22-23',
    subject: 'Physics',
    question: 'একটি বস্তুকে ভূ-পৃষ্ঠ হতে কত বেগে খাড়া উপরের দিকে নিক্ষেপ করলে তা আর পৃথিবীতে ফিরে আসবে না?',
    options: ['9.8 km/s', '11.2 km/s', '11.2 m/s', '7.9 km/s'],
    correctAnswer: 1,
    explanation: 'পৃথিবীর মুক্তিবেগ (Escape velocity) v_e = √(2gR) ≈ 11.2 km/s বা 11.2 × 10³ m/s।',
    questionType: 'MCQ',
    marks: 1.25
  },
  {
    id: 'ru-p-4',
    university: 'RU',
    session: '21-22',
    subject: 'Physics',
    question: 'একটি গোলীয় তলের বক্রতার ব্যাসার্ধ 40 cm হলে এর ফোকাস দূরত্ব কত?',
    options: ['20 cm', '40 cm', '80 cm', '10 cm'],
    correctAnswer: 0,
    explanation: 'ফোকাস দূরত্ব f = R / 2 = 40 / 2 = 20 cm।',
    questionType: 'MCQ',
    marks: 1.25
  },

  // --- RU CHEMISTRY ---
  {
    id: 'ru-c-1',
    university: 'RU',
    session: '24-25',
    subject: 'Chemistry',
    question: 'Cr (ক্রোমিয়াম, Z = 24) এর সঠিক ইলেকট্রন বিন্যাস কোনটি?',
    options: ['[Ar] 3d⁴ 4s²', '[Ar] 3d⁵ 4s¹', '[Ar] 3d⁶ 4s⁰', '[Ar] 3d³ 4s² 4p¹'],
    correctAnswer: 1,
    explanation: 'অর্ধপূর্ণ d অরবিটাল (d⁵) অধিক স্থিতিশীল হওয়ায় ক্রোমিয়ামের ইলেকট্রন বিন্যাস [Ar] 3d⁵ 4s¹ হয়।',
    questionType: 'MCQ',
    marks: 1.25
  },
  {
    id: 'ru-c-2',
    university: 'RU',
    session: '23-24',
    subject: 'Chemistry',
    question: 'কোন ধরনের আলোক রশ্মি ওজোন স্তর (Ozone Layer) সৃষ্টি ও ধ্বংসে ভূমিকা রাখে?',
    options: ['UV-A', 'UV-B & UV-C', 'Infrared', 'Microwave'],
    correctAnswer: 1,
    explanation: 'সূর্যের ক্ষতিকর উচ্চ শক্তিসম্পন্ন অতিবেগুনি রশ্মি (UV-B ও UV-C) ওজোন স্তরে শোষিত হয়ে O2 অণু ও O পরমাণুর ভাঙ্গন-গঠন নিয়ন্ত্রণ করে।',
    questionType: 'MCQ',
    marks: 1.25
  },
  {
    id: 'ru-c-3',
    university: 'RU',
    session: '22-23',
    subject: 'Chemistry',
    question: 'ইথানোয়িক এসিডের সাথে গাঢ় H₂SO₄ এর উপস্থিতিতে ইথানল উত্তপ্ত করলে কোন সুগন্ধযুক্ত যৌগ উৎপন্ন হয়?',
    options: ['Ethyl acetate (ইস্টার)', 'Diethyl ether', 'Acetaldehyde', 'Ethanenitrile'],
    correctAnswer: 0,
    explanation: 'CH3COOH + C2H5OH --(গাঢ় H2SO4)--> CH3COOC2H5 (ইথাইল ইথানয়েট / সুগন্ধি এস্টার) + H2O।',
    questionType: 'MCQ',
    marks: 1.25
  },
  {
    id: 'ru-c-4',
    university: 'RU',
    session: '21-22',
    subject: 'Chemistry',
    question: 'অনার্দ্র AlCl₃ এর উপস্থিতিতে বেনজিনের সাথে মিথাইল ক্লোরাইডের বিক্রিয়াকে কী বলা হয়?',
    options: ['ফিডেল-ক্রাফটস অ্যালকাইলেশন', 'ক্যানিজারো বিক্রিয়া', 'উর্টজ বিক্রিয়া', 'রাইমার-টাইম্যান'],
    correctAnswer: 0,
    explanation: 'শুষ্ক AlCl3 এর উপস্থিতিতে বেনজিন বলয়ে অ্যালকাইল গ্রুপ প্রতিস্থাপনকে ফ্রিডেল-ক্রাফটস অ্যালকাইলেশন বলে।',
    questionType: 'MCQ',
    marks: 1.25
  },

  // --- RU MATHEMATICS ---
  {
    id: 'ru-m-1',
    university: 'RU',
    session: '24-25',
    subject: 'Mathematics',
    question: '∫ [1 / (1 + cos x)] dx এর মান কোনটি?',
    options: ['tan(x/2) + c', '½ tan(x/2) + c', 'cot(x/2) + c', 'ln|1 + cos x| + c'],
    correctAnswer: 0,
    explanation: '1 + cos x = 2 cos²(x/2)। সুতরাং ∫ ½ sec²(x/2) dx = ½ × [tan(x/2) / (1/2)] + c = tan(x/2) + c।',
    questionType: 'MCQ',
    marks: 1.25
  },
  {
    id: 'ru-m-2',
    university: 'RU',
    session: '23-24',
    subject: 'Mathematics',
    question: 'যদি f(x) = (x - 3) / (2x + 1) হয়, তবে f⁻¹(x) এর মান কত?',
    options: ['(3 + x) / (1 - 2x)', '(x - 3) / (2x - 1)', '(2x + 1) / (x - 3)', '-(x + 3) / (2x - 1)'],
    correctAnswer: 0,
    explanation: 'y = (x - 3)/(2x + 1) => 2xy + y = x - 3 => x(2y - 1) = -3 - y => x = (y + 3)/(1 - 2y)। সুতরাং f⁻¹(x) = (x + 3)/(1 - 2x)।',
    questionType: 'MCQ',
    marks: 1.25
  },
  {
    id: 'ru-m-3',
    university: 'RU',
    session: '22-23',
    subject: 'Mathematics',
    question: 'একটি সরলরেখার ঢাল m = 2 এবং y-অক্ষের ছেদক c = -5 হলে সরলরেখাটির সমীকরণ কোনটি?',
    options: ['2x - y - 5 = 0', '2x + y - 5 = 0', 'x - 2y + 5 = 0', '2x - y + 5 = 0'],
    correctAnswer: 0,
    explanation: 'y = mx + c => y = 2x - 5 => 2x - y - 5 = 0।',
    questionType: 'MCQ',
    marks: 1.25
  },

  // --- RU BIOLOGY ---
  {
    id: 'ru-b-1',
    university: 'RU',
    session: '24-25',
    subject: 'Biology',
    question: 'নিচের কোন ভিটামিন পানিতে দ্রবণীয়?',
    options: ['Vitamin A', 'Vitamin D', 'Vitamin C', 'Vitamin K'],
    correctAnswer: 2,
    explanation: 'ভিটামিন B-complex এবং ভিটামিন C পানিতে দ্রবণীয়। A, D, E, K চর্বিতে দ্রবণীয়।',
    questionType: 'MCQ',
    marks: 1.25
  },
  {
    id: 'ru-b-2',
    university: 'RU',
    session: '23-24',
    subject: 'Biology',
    question: 'ঘাসফড়িংয়ের রক্ত সংবহনতন্ত্র কোন প্রকৃতির?',
    options: ['মুক্ত বা উন্মুক্ত (Open)', 'বদ্ধ (Closed)', 'মিশ্র', 'অর্ধ-বদ্ধ'],
    correctAnswer: 0,
    explanation: 'ঘাসফড়িং ও অন্যান্য পতঙ্গের রক্ত সংবহনতন্ত্র মুক্ত (Open type), রক্ত সাইনাস ও হিমোসিলে উন্মুক্ত প্রবাহিত হয়।',
    questionType: 'MCQ',
    marks: 1.25
  },

  // --- RU ICT ---
  {
    id: 'ru-i-1',
    university: 'RU',
    session: '24-25',
    subject: 'ICT',
    question: 'IPv4 অ্যাড্রেসে মোট কতটি বিট থাকে?',
    options: ['16 bits', '32 bits', '64 bits', '128 bits'],
    correctAnswer: 1,
    explanation: 'IPv4 অ্যাড্রেস 32 বিটের (৪টি অক্টেট) এবং IPv6 অ্যাড্রেস 128 বিটের হয়।',
    questionType: 'MCQ',
    marks: 1.25
  }
];
