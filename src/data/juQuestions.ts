import { Question } from './questionBank';

export const JU_QUESTIONS: Question[] = [
  // --- JU PHYSICS ---
  {
    id: 'ju-p-1',
    university: 'JU',
    session: '24-25',
    subject: 'Physics',
    question: 'একটি সমবাহু প্রিজমের প্রতিসরাঙ্ক √3 হলে ন্যূনতম বিচ্যুতি কোণ (Angle of Minimum Deviation) কত?',
    options: ['30°', '45°', '60°', '90°'],
    correctAnswer: 2,
    explanation: 'সমবাহু প্রিজমের A = 60°। সূত্র: μ = sin[(A + δm)/2] / sin(A/2) => √3 = sin[(60° + δm)/2] / sin(30°) => sin[(60° + δm)/2] = √3/2 => (60° + δm)/2 = 60° => δm = 60°।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'ju-p-2',
    university: 'JU',
    session: '23-24',
    subject: 'Physics',
    question: 'একটি কার্নো ইঞ্জিন 500 K ও 300 K তাপমাত্রার মধ্যে কাজ করে। ইঞ্জিনটির দক্ষতা (Efficiency) কত?',
    options: ['60%', '40%', '20%', '50%'],
    correctAnswer: 1,
    explanation: 'দক্ষতা η = 1 - (T2 / T1) = 1 - (300 / 500) = 1 - 0.60 = 0.40 বা 40%।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'ju-p-3',
    university: 'JU',
    session: '22-23',
    subject: 'Physics',
    question: 'একটি সমান্তরাল পাত ধারকের পাতদ্বয়ের মধ্যবর্তী দূরত্ব অর্ধেক এবং ক্ষেত্রফল দ্বিগুণ করলে ধারকত্ব কত গুণ হবে?',
    options: ['দ্বিগুণ (2 গুণ)', 'চারগুণ (4 গুণ)', 'অপরিবর্তিত', 'অর্ধেক'],
    correctAnswer: 1,
    explanation: 'ধারকত্ব C = ε₀A / d। A কে 2A এবং d কে d/2 করলে নতুন ধারকত্ব C\' = ε₀(2A)/(d/2) = 4 (ε₀A/d) = 4C।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'ju-p-4',
    university: 'JU',
    session: '21-22',
    subject: 'Physics',
    question: 'কোনো কণার গতিশক্তি ও রৈখিক ভরবেগের সাংখ্যমান সমান হলে কণাটির বেগ কত m/s?',
    options: ['1 m/s', '2 m/s', '4 m/s', '0.5 m/s'],
    correctAnswer: 1,
    explanation: 'গতিশক্তি E_k = ½ m v² এবং ভরবেগ p = m v। প্রশ্নমতে ½ m v² = m v => ½ v = 1 => v = 2 m/s।',
    questionType: 'MCQ',
    marks: 1
  },

  // --- JU CHEMISTRY ---
  {
    id: 'ju-c-1',
    university: 'JU',
    session: '24-25',
    subject: 'Chemistry',
    question: 'মার্বেল পাথরের উপর লঘু হাইড্রোক্লোরিক এসিড দিলে কোন গ্যাস বুদবুদ আকারে নির্গত হয়?',
    options: ['CO (কার্বন মনোক্সাইড)', 'CO₂ (কার্বন ডাইঅক্সাইড)', 'Cl₂ (ক্লোরিন)', 'H₂ (হাইড্রোজেন)'],
    correctAnswer: 1,
    explanation: 'CaCO3 + 2HCl → CaCl2 + H2O + CO2↑। নির্গত গ্যাসটি হলো কার্বন ডাইঅক্সাইড।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'ju-c-2',
    university: 'JU',
    session: '23-24',
    subject: 'Chemistry',
    question: 'কোন যৌগে sp³d সংকরণ (Hybridization) বিদ্যমান?',
    options: ['CH₄', 'PCl₅', 'SF₆', 'NH₃'],
    correctAnswer: 1,
    explanation: 'PCl5 এ ফসফরাসের যোজ্যতা স্তরে ৫টি সংকরিত অরবিটাল প্রয়োজন, যা একটি s, তিনটি p ও একটি d অরবিটালের মিশ্রণে sp³d সংকরণ তৈরি করে (ত্রিকোণীয় দ্বি-পিরামিডীয়)।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'ju-c-3',
    university: 'JU',
    session: '22-23',
    subject: 'Chemistry',
    question: 'নিচের কোন আয়নটির আকার সবচেয়ে ছোট?',
    options: ['Na⁺', 'Mg²⁺', 'Al³⁺', 'F⁻'],
    correctAnswer: 2,
    explanation: 'সম-ইলেকট্রনীয় আয়নগুলোর ক্ষেত্রে নিউক্লিয়াসের কার্যকর ধনাত্মক চার্জ যত বেশি হয়, ইলেকট্রন মেঘ তত কাছে সংকুচিত হয়। Al³⁺ এর নিউক্লিয়াসে ১৩টি প্রোটন থাকায় এর ব্যাসার্ধ ক্ষুদ্রতম।',
    questionType: 'MCQ',
    marks: 1
  },

  // --- JU MATHEMATICS ---
  {
    id: 'ju-m-1',
    university: 'JU',
    session: '24-25',
    subject: 'Mathematics',
    question: 'যদি A = [[2, 4], [1, 3]] হয়, তবে A⁻¹ (ইনভার্স ম্যাট্রিক্স) কোনটি?',
    options: ['[[1.5, -2], [-0.5, 1]]', '[[3, -4], [-1, 2]]', '½ [[3, -4], [-1, 2]]', '[[2, -1], [-4, 3]]'],
    correctAnswer: 2,
    explanation: 'det(A) = (2×3) - (4×1) = 6 - 4 = 2। Adjugate(A) = [[3, -4], [-1, 2]]। ফলে A⁻¹ = (1/2) [[3, -4], [-1, 2]]।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'ju-m-2',
    university: 'JU',
    session: '23-24',
    subject: 'Mathematics',
    question: 'sin(2 sin⁻¹(3/5)) এর মান কত?',
    options: ['24/25', '12/25', '6/5', '16/25'],
    correctAnswer: 0,
    explanation: 'θ = sin⁻¹(3/5) হলে sin θ = 3/5 এবং cos θ = 4/5। সূত্র sin(2θ) = 2 sin θ cos θ = 2 × (3/5) × (4/5) = 24/25।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'ju-m-3',
    university: 'JU',
    session: '22-23',
    subject: 'Mathematics',
    question: 'যদি ω এককের একটি কাল্পনিক ঘনমূল হয়, তবে (1 - ω + ω²)⁵ + (1 + ω - ω²)⁵ এর মান কত?',
    options: ['32', '-32', '64', '-64'],
    correctAnswer: 0,
    explanation: '1 + ω + ω² = 0। সুতরাং 1 + ω² = -ω, ফলে (-2ω)⁵ = -32ω⁵ = -32ω²। আবার 1 + ω = -ω², ফলে (-2ω²)⁵ = -32ω¹⁰ = -32ω। যোগফল = -32(ω² + ω) = -32(-1) = 32।',
    questionType: 'MCQ',
    marks: 1
  },

  // --- JU BIOLOGY ---
  {
    id: 'ju-b-1',
    university: 'JU',
    session: '24-25',
    subject: 'Biology',
    question: 'কোষের শক্তিঘর (Powerhouse of the Cell) বলা হয় কোন অঙ্গাণুকে?',
    options: ['মাইটোকন্ড্রিয়া', 'রাইবোজোম', 'গলগি বস্তু', 'লাইসোজোম'],
    correctAnswer: 0,
    explanation: 'মাইটোকন্ড্রিয়ায় ক্রেবস চক্র এবং অক্সিডেটিভ ফসফোরাইলেশনের মাধ্যমে এটিপি (শক্তি) উৎপাদিত হয়, তাই একে পাওয়ার হাউজ বলে।',
    questionType: 'MCQ',
    marks: 1
  },

  // --- JU ICT ---
  {
    id: 'ju-i-1',
    university: 'JU',
    session: '24-25',
    subject: 'ICT',
    question: 'নিচের কোনটি সার্বজনীন লজিক গেট (Universal Logic Gate)?',
    options: ['AND ও OR', 'NAND ও NOR', 'XOR ও XNOR', 'NOT'],
    correctAnswer: 1,
    explanation: 'NAND এবং NOR গেট দিয়ে যেকোনো মৌলিক বা যৌগিক ডিজিটাল লজিক সার্কিট তৈরি করা যায়, তাই এদেরকে সার্বজনীন গেট বলা হয়।',
    questionType: 'MCQ',
    marks: 1
  }
];
