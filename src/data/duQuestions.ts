import { Question } from './questionBank';

export const DU_QUESTIONS: Question[] = [
  // --- DU 25-26 & 24-25 ---
  {
    id: 'du-p-1',
    university: 'DU',
    session: '25-26',
    subject: 'Physics',
    question: 'একটি সরল দোলকের দৈর্ঘ্য 4 গুণ করা হলে এর দোলনকাল কত গুণ হবে?',
    options: ['অর্ধেক (0.5 গুণ)', 'দ্বিগুণ (2 গুণ)', 'চারগুণ (4 গুণ)', 'অপরিবর্তিত'],
    correctAnswer: 1,
    explanation: 'দোলনকাল T = 2π√(L/g)। সুতরাং T ∝ √L। দৈর্ঘ্য L কে 4 গুণ করলে দোলনকাল √4 = 2 গুণ বৃদ্ধি পাবে।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'du-p-2',
    university: 'DU',
    session: '24-25',
    subject: 'Physics',
    question: 'পানির ত্রৈধ বিন্দু (Triple Point of Water) এর পরম তাপমাত্রা কত?',
    options: ['273.15 K', '273.16 K', '373.15 K', '0.01 K'],
    correctAnswer: 1,
    explanation: 'পানির ত্রৈধ বিন্দুতে বরফ, পানি ও বাষ্প সাম্যাবস্থায় থাকে এবং এর নিখুঁত তাপমাত্রা 273.16 K (বা 0.01 °C)।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'du-p-3',
    university: 'DU',
    session: '23-24',
    subject: 'Physics',
    question: 'একটি প্রাসকে অনুভূমিকের সাথে 45° কোণে v বেগে নিক্ষেপ করা হলে এর সর্বাধিক অনুভূমিক পাল্লা (Maximum Range) কত?',
    options: ['v² / g', 'v² / 2g', '2v² / g', 'v / g'],
    correctAnswer: 0,
    explanation: 'পাল্লা R = (v² sin 2θ) / g। θ = 45° হলে sin(90°) = 1, ফলে সর্বোচ্চ পাল্লা R_max = v² / g।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'du-p-4',
    university: 'DU',
    session: '22-23',
    subject: 'Physics',
    question: 'কোনো কণার সরণ x = 4 sin(3t + π/3) হলে এর সর্বোচ্চ বেগ (Maximum Velocity) কত m/s?',
    options: ['4', '12', '7', '3'],
    correctAnswer: 1,
    explanation: 'সরল ছন্দিত স্পন্দনে সর্বোচ্চ বেগ v_max = ωA = 3 × 4 = 12 m/s।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'du-p-5',
    university: 'DU',
    session: '21-22',
    subject: 'Physics',
    question: 'একটি কৃত্রিম উপগ্রহ ভূ-পৃষ্ঠের অতি নিকটে বৃত্তাকার কক্ষপথে ঘুরলে এর বেগ কত?',
    options: ['11.2 km/s', '7.9 km/s', '9.8 km/s', '5.6 km/s'],
    correctAnswer: 1,
    explanation: 'কক্ষীয় বেগ v_o = √(gR) = √(9.8 × 6.4 × 10⁶) ≈ 7.92 km/s। মুক্তিবেগ v_e = √(2gR) ≈ 11.2 km/s।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'du-p-6',
    university: 'DU',
    session: '20-21',
    subject: 'Physics',
    question: 'ইয়ং-এর দ্বি-চির পরীক্ষায় ডোরার প্রস্থ (Fringe Width) দ্বিগুণ করতে হলে চির ও পর্দার দূরত্ব কত করতে হবে?',
    options: ['অর্ধেক', 'দ্বিগুণ', 'চারগুণ', 'অপরিবর্তিত'],
    correctAnswer: 1,
    explanation: 'ডোরার প্রস্থ β = λD / 2d। সুতরাং β ∝ D (পর্দার দূরত্ব)। D দ্বিগুণ করলে β দ্বিগুণ হবে।',
    questionType: 'MCQ',
    marks: 1
  },

  // --- DU CHEMISTRY ---
  {
    id: 'du-c-1',
    university: 'DU',
    session: '25-26',
    subject: 'Chemistry',
    question: 'নিচের কোন অ্যালকোহলটি লুকাস বিকারকের সাথে কক্ষ তাপমাত্রায় তাৎক্ষণিকভাবে সাদা অধঃক্ষেপ ফেলে?',
    options: ['1-butanol (১° অ্যালকোহল)', '2-butanol (২° অ্যালকোহল)', '2-methylpropan-2-ol (৩° অ্যালকোহল)', 'Methanol'],
    correctAnswer: 2,
    explanation: 'টারশিয়ারি (৩°) অ্যালকোহল লুকাস বিকারক (গার্হ HCl + নির্জল ZnCl2) এর সাথে কক্ষ তাপমাত্রায় অতি দ্রুত ৩-ডিগ্রি কার্বোক্যাটায়ন তৈরি করে তাৎক্ষণিক তৈলাক্ত অধঃক্ষেপ উৎপন্ন করে।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'du-c-2',
    university: 'DU',
    session: '24-25',
    subject: 'Chemistry',
    question: '0.005 M H₂SO₄ জলীয় দ্রবণের pH এর মান কত?',
    options: ['2.0', '1.7', '2.3', '3.0'],
    correctAnswer: 0,
    explanation: 'H2SO4 একটি দ্বি-ক্ষারকীয় তীব্র এসিড। ফলে [H⁺] = 2 × 0.005 M = 0.01 M = 10⁻² M। অতএব, pH = -log(10⁻²) = 2.0।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'du-c-3',
    university: 'DU',
    session: '23-24',
    subject: 'Chemistry',
    question: 'নিচের কোন যৌগে কার্বন-কার্বন বন্ধন দূরত্ব সবচেয়ে কম?',
    options: ['Ethane (ইথেন)', 'Ethene (ইথিন)', 'Ethyne (ইথাইন)', 'Benzene (বেনজিন)'],
    correctAnswer: 2,
    explanation: 'ত্রিবন্ধনযুক্ত ইথাইনের C≡C বন্ধন দৈর্ঘ্য সবচেয়ে ছোট (0.120 nm), ইথিনের 0.134 nm, বেনজিনের 0.139 nm এবং ইথেনের C-C 0.154 nm।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'du-c-4',
    university: 'DU',
    session: '22-23',
    subject: 'Chemistry',
    question: 'Fe²⁺ আয়নে বিজোড় ইলেকট্রন সংখ্যা কতটি?',
    options: ['2', '3', '4', '5'],
    correctAnswer: 2,
    explanation: 'Fe (Z=26): [Ar] 3d⁶ 4s²। Fe²⁺ এর বিন্যাস [Ar] 3d⁶। হুন্ডের নিয়ম অনুসারে d অরবিটালে ৫টি কক্ষের মধ্যে ১টিতে জোড় ও বাকি ৪টিতে ৪টি একক অযুগ্ম ইলেকট্রন থাকে।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'du-c-5',
    university: 'DU',
    session: '20-21',
    subject: 'Chemistry',
    question: 'নিচের কোনটিতে জ্যামিতিক সমাণুতা (Cis-Trans Isomerism) দেখা যায়?',
    options: ['Propene', 'But-1-ene', 'But-2-ene', '2-methylpropene'],
    correctAnswer: 2,
    explanation: 'But-2-ene (CH3-CH=CH-CH3) এ প্রতি দ্বিবন্ধনযুক্ত কার্বনে দুটি ভিন্ন গ্রুপ (H এবং CH3) যুক্ত থাকায় এটি Cis এবং Trans সমাণু প্রদর্শন করে।',
    questionType: 'MCQ',
    marks: 1
  },

  // --- DU MATHEMATICS ---
  {
    id: 'du-m-1',
    university: 'DU',
    session: '25-26',
    subject: 'Mathematics',
    question: 'lim (x → 0) [(sin 5x) / (tan 2x)] এর মান কত?',
    options: ['5/2', '2/5', '1', '10'],
    correctAnswer: 0,
    explanation: 'L\'Hôpital নিয়ম অনুসারে লব ও হরের অন্তরীকরণ করলে: lim (x→0) [5 cos 5x / (2 sec² 2x)] = (5 × 1) / (2 × 1) = 5/2।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'du-m-2',
    university: 'DU',
    session: '24-25',
    subject: 'Mathematics',
    question: 'y = x² বক্ররেখা এবং y = 4 সরলরেখা দ্বারা আবদ্ধ ক্ষেত্রের ক্ষেত্রফল কত বর্গ একক?',
    options: ['16/3', '32/3', '8/3', '64/3'],
    correctAnswer: 1,
    explanation: 'প্রতিসাম্যতার কারণে ক্ষেত্রফল = 2 × ∫ (4 - x²) dx [সীমা 0 থেকে 2] = 2 × [4(2) - (8/3)] = 2 × [8 - 8/3] = 2 × 16/3 = 32/3 বর্গ একক।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'du-m-3',
    university: 'DU',
    session: '23-24',
    subject: 'Mathematics',
    question: 'একটি বৃত্তের সমীকরণ x² + y² - 4x + 6y - 12 = 0 হলে এর ব্যাসার্ধ কত একক?',
    options: ['3', '4', '5', '6'],
    correctAnswer: 2,
    explanation: 'কেন্দ্র (-g, -f) = (2, -3) এবং c = -12। ব্যাসার্ধ r = √(g² + f² - c) = √(4 + 9 - (-12)) = √(25) = 5 একক।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'du-m-4',
    university: 'DU',
    session: '22-23',
    subject: 'Mathematics',
    question: 'x² / 16 - y² / 9 = 1 অধিবৃত্তের অসীমতটদ্বয়ের (Asymptotes) সমীকরণ কোনটি?',
    options: ['y = ± (3/4) x', 'y = ± (4/3) x', 'y = ± (9/16) x', 'y = ± (16/9) x'],
    correctAnswer: 0,
    explanation: 'অধিবৃত্ত x²/a² - y²/b² = 1 এর অসীমতট সমীকরণ y = ± (b/a) x। এখানে a=4, b=3, সুতরাং y = ± (3/4)x।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'du-m-5',
    university: 'DU',
    session: '20-21',
    subject: 'Mathematics',
    question: '∫ (ln x / x) dx এর সমাকলিত মান কোনটি?',
    options: ['½ (ln x)² + c', 'ln(ln x) + c', '1/x² + c', 'x ln x - x + c'],
    correctAnswer: 0,
    explanation: 'z = ln x ধরলে dz = (1/x) dx। ফলে ∫ z dz = z²/2 + c = ½ (ln x)² + c।',
    questionType: 'MCQ',
    marks: 1
  },

  // --- DU BIOLOGY ---
  {
    id: 'du-b-1',
    university: 'DU',
    session: '25-26',
    subject: 'Biology',
    question: 'মায়োসিস-১ এর কোন উপপর্যায়ে ক্রসিং ওভার (Crossing over) সংঘটিত হয়?',
    options: ['লেপটোটিন', 'জাইগোটিন', 'প্যাকাইটিন', 'ডিপ্লোটিন'],
    correctAnswer: 2,
    explanation: 'প্রোফেজ-১ এর প্যাকাইটিন (Pachytene) উপপর্যায়ে নন-সিস্টার ক্রোমাটিডের মধ্যে অংশের বিনিময় বা ক্রসিং ওভার ঘটে।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'du-b-2',
    university: 'DU',
    session: '24-25',
    subject: 'Biology',
    question: 'মানুষের হৃদপিণ্ডের স্বাভাবিক পেসমেকার (Pacemaker) কোনটি?',
    options: ['SA Node (সাইনোট্রিয়াল নোড)', 'AV Node', 'Bundle of His', 'Purkinje Fiber'],
    correctAnswer: 0,
    explanation: 'SA নোড স্বয়ংক্রিয়ভাবে অ্যাকশন পটেনশিয়াল তৈরি করে হৃদস্পন্দন শুরু করে, তাই একে প্রাকৃতিক পেসমেকার বলে।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'du-b-3',
    university: 'DU',
    session: '23-24',
    subject: 'Biology',
    question: 'মাইটোকন্ড্রিয়ার অন্তর্বর্তী পর্দার ভাঁজগুলোকে কী বলা হয়?',
    options: ['ক্রিস্টি (Cristae)', 'ম্যাট্রিক্স (Matrix)', 'অক্সিজোম', 'সিস্টার্নি'],
    correctAnswer: 0,
    explanation: 'মাইটোকন্ড্রিয়ার ভেতরের পর্দা ভেতরের দিকে আঙুলের মতো অসংখ্য ভাঁজ সৃষ্টি করে, একে ক্রিস্টি বলা হয়।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'du-b-4',
    university: 'DU',
    session: '22-23',
    subject: 'Biology',
    question: 'রক্তে গ্লুকোজের মাত্রা নিয়ন্ত্রণে কোন হরমোন সরাসরি ভূমিকা রাখে?',
    options: ['ইনসুলিন ও গ্লুকাগন', 'থাইরক্সিন', 'অ্যাড্রেনালিন', 'ইস্ট্রোজেন'],
    correctAnswer: 0,
    explanation: 'অগ্ন্যাশয়ের আইলেটস অব ল্যাঙ্গারহ্যান্সের বিটা কোষ থেকে ক্ষরিত ইনসুলিন রক্তের গ্লুকোজ কমায় এবং আলফা কোষের গ্লুকাগন রক্তে গ্লুকোজ বাড়ায়।',
    questionType: 'MCQ',
    marks: 1
  },

  // --- DU ICT ---
  {
    id: 'du-i-1',
    university: 'DU',
    session: '24-25',
    subject: 'ICT',
    question: 'হেক্সাডেসিমেল সংখ্যা (2F)₁₆ এর সমতুল্য বাইনারি মান কোনটি?',
    options: ['(00101111)₂', '(00111110)₂', '(00101101)₂', '(00011111)₂'],
    correctAnswer: 0,
    explanation: '2 = 0010 এবং F = 1111। সুতরাং (2F)₁₆ = (00101111)₂।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'du-i-2',
    university: 'DU',
    session: '23-24',
    subject: 'ICT',
    question: 'এইচটিএমএল (HTML) ডকুমেন্টে হাইপারলিংক তৈরির সঠিক ট্যাগ কোনটি?',
    options: ['<a>', '<link>', '<href>', '<url>'],
    correctAnswer: 0,
    explanation: 'HTML এ হাইপারলিংক তৈরি করতে অ্যানকর ট্যাগ <a href="...">...</a> ব্যবহৃত হয়।',
    questionType: 'MCQ',
    marks: 1
  }
];
