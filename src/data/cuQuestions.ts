import { Question } from './questionBank';

export const CU_QUESTIONS: Question[] = [
  // --- CU PHYSICS ---
  {
    id: 'cu-p-1',
    university: 'CU',
    session: '24-25',
    subject: 'Physics',
    question: 'ভূ-পৃষ্ঠ থেকে কত উচ্চতায় অভিকর্ষজ ত্বরণের মান ভূ-পৃষ্ঠের মানের এক-চতুর্থাংশ (1/4) হবে? (R = পৃথিবীর ব্যাসার্ধ)',
    options: ['R / 2', 'R', '2R', '4R'],
    correctAnswer: 1,
    explanation: 'g\' = g [R / (R + h)]²। g\' = g/4 হলে R / (R + h) = 1/2 => R + h = 2R => h = R।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'cu-p-2',
    university: 'CU',
    session: '23-24',
    subject: 'Physics',
    question: '10 μF ধারকত্বের একটি ধারককে 100 V এ চার্জিত করলে এতে সঞ্চিত শক্তির পরিমাণ কত জুল?',
    options: ['0.05 J', '0.5 J', '0.1 J', '1.0 J'],
    correctAnswer: 0,
    explanation: 'U = ½ C V² = ½ × (10 × 10⁻⁶) × (100)² = 5 × 10⁻⁶ × 10000 = 0.05 Joule।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'cu-p-3',
    university: 'CU',
    session: '22-23',
    subject: 'Physics',
    question: 'একটি কণা r ব্যাসার্ধের বৃত্তাকার পথে সমদ্রুতিতে ঘুরছে। একবার পূর্ণ আবর্তনে কণাটির গড় সরণ কত?',
    options: ['শূন্য (0)', '2πr', '2r', 'πr'],
    correctAnswer: 0,
    explanation: 'একবার পূর্ণ আবর্তন শেষে কণাটি তার আদি অবস্থানে ফিরে আসে। সুতরাং প্রারম্ভিক ও চূড়ান্ত বিন্দুর দূরত্ব বা সরণ শূন্য।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'cu-p-4',
    university: 'CU',
    session: '21-22',
    subject: 'Physics',
    question: 'রূদ্ধতাপীয় প্রক্রিয়ায় (Adiabatic Process) চাপ ও আয়তনের মধ্যকার সঠিক সম্পর্ক কোনটি?',
    options: ['PV^γ = ধ্রুবক', 'P/V = ধ্রুবক', 'TV = ধ্রুবক', 'P^γ V = ধ্রুবক'],
    correctAnswer: 0,
    explanation: 'রূদ্ধতাপীয় পরিবর্তনে গ্যাস সমীকরণ হলো PV^γ = constant, যেখানে γ = Cp / Cv।',
    questionType: 'MCQ',
    marks: 1
  },

  // --- CU CHEMISTRY ---
  {
    id: 'cu-c-1',
    university: 'CU',
    session: '24-25',
    subject: 'Chemistry',
    question: 'নিচের কোনটি ক্যানিজারো (Cannizzaro) বিক্রিয়া প্রদর্শন করে?',
    options: ['Acetaldehyde (CH₃CHO)', 'Formaldehyde (HCHO)', 'Acetone (CH₃COCH₃)', 'Propionaldehyde'],
    correctAnswer: 1,
    explanation: 'যেসব অ্যালডিহাইডে আলফা-হাইড্রোজেন (α-H) অনুপস্থিত থাকে, তারা তীব্র ক্ষারের উপস্থিতিতে স্বতঃজারণ-বিজারণ (ক্যানিজারো) বিক্রিয়া দেয়। HCHO-তে আলফা-কার্বন বা আলফা-হাইড্রোজেন নেই।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'cu-c-2',
    university: 'CU',
    session: '23-24',
    subject: 'Chemistry',
    question: 'নিচের কোন অরবিটালটির অস্তিত্ব নেই?',
    options: ['2d', '3p', '4f', '2s'],
    correctAnswer: 0,
    explanation: 'প্রধান কোয়ান্টাম সংখ্যা n=2 হলে সহকারী কোয়ান্টাম সংখ্যা l = 0, 1 হতে পারে (2s ও 2p সম্ভব)। d অরবিটালের জন্য l=2 হতে হয় যা n=3 থেকে শুরু হয়, তাই 2d অসম্ভব।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'cu-c-3',
    university: 'CU',
    session: '22-23',
    subject: 'Chemistry',
    question: 'প্রোপানল-১ এবং প্রোপানল-২ পরস্পরের কী ধরনের সমাণু?',
    options: ['অবস্থান সমাণু (Positional)', 'চেইন সমাণু', 'কার্যকরী মূলক সমাণু', 'মেটামারিজম'],
    correctAnswer: 0,
    explanation: 'একই কার্বন শিকলে -OH কার্যকরী মূলকের অবস্থান ১ ও ২ নম্বর কার্বনে ভিন্ন হওয়ায় এরা অবস্থান সমাণু।',
    questionType: 'MCQ',
    marks: 1
  },

  // --- CU MATHEMATICS ---
  {
    id: 'cu-m-1',
    university: 'CU',
    session: '24-25',
    subject: 'Mathematics',
    question: 'উপবৃত্ত x² / 16 + y² / 9 = 1 এর উৎকেন্দ্রিকতা (Eccentricity e) কত?',
    options: ['√7 / 4', '3/4', '7/16', '√7 / 3'],
    correctAnswer: 0,
    explanation: 'এখানে a² = 16, b² = 9 (যেখানে a > b)। e = √[1 - (b²/a²)] = √[1 - 9/16] = √(7/16) = √7 / 4।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'cu-m-2',
    university: 'CU',
    session: '23-24',
    subject: 'Mathematics',
    question: 'd/dx [ln(sec x + tan x)] এর মান কত?',
    options: ['sec x', 'tan x', 'sec² x', 'sec x tan x'],
    correctAnswer: 0,
    explanation: 'd/dx [ln(sec x + tan x)] = [1 / (sec x + tan x)] × (sec x tan x + sec² x) = [sec x (tan x + sec x)] / (sec x + tan x) = sec x।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'cu-m-3',
    university: 'CU',
    session: '22-23',
    subject: 'Mathematics',
    question: 'x² + 5x + 6 = 0 সমীকরণের মূলদ্বয়ের গুণফল কত?',
    options: ['6', '-5', '5', '-6'],
    correctAnswer: 0,
    explanation: 'দ্বিঘাত সমীকরণ ax² + bx + c = 0 এর মূলদ্বয়ের গুণফল αβ = c / a = 6 / 1 = 6।',
    questionType: 'MCQ',
    marks: 1
  },

  // --- CU BIOLOGY ---
  {
    id: 'cu-b-1',
    university: 'CU',
    session: '24-25',
    subject: 'Biology',
    question: 'শালোকসংশ্লেষণের আলোক নিরপেক্ষ পর্যায়ে CO₂ এর প্রথম গ্রাহক কোনটি (C3 উদ্ভিদে)?',
    options: ['PEP (ফসফোএনল পাইরুভেট)', 'RuBP (রাইবুলোজ ১,৫-বিসফসফেট)', 'PGA', 'Glucose'],
    correctAnswer: 1,
    explanation: 'C3 চক্রে ৫ কার্বনযুক্ত রাইবুলোজ-১,৫-বিসফসফেট (RuBP) রুবিকসো এনজাইমের সহায়তায় বায়ুমণ্ডলের CO₂ গ্রহণ করে।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'cu-b-2',
    university: 'CU',
    session: '23-24',
    subject: 'Biology',
    question: 'রক্তের সার্বজনীন দাতা (Universal Donor) বলা হয় কোন রক্ত গ্রুপকে?',
    options: ['O (Rh নেগেটিভ)', 'AB (Rh পজিটিভ)', 'A', 'B'],
    correctAnswer: 0,
    explanation: 'O নেগেটিভ রক্তে লোহিত কণিকায় A বা B কোনো অ্যান্টিজেন এবং Rh অ্যান্টিজেন থাকে না, তাই এটি যেকোনো গ্রুপে দেওয়া যায়।',
    questionType: 'MCQ',
    marks: 1
  },

  // --- CU ICT ---
  {
    id: 'cu-i-1',
    university: 'CU',
    session: '24-25',
    subject: 'ICT',
    question: 'ক্লাউড কম্পিউটিংয়ের সার্ভিস মডেল নিচের কোনটি?',
    options: ['SaaS, PaaS, IaaS', 'LAN, WAN, MAN', 'HTTP, FTP, SMTP', 'TCP, IP, UDP'],
    correctAnswer: 0,
    explanation: 'ক্লাউড কম্পিউটিংয়ের তিনটি প্রধান সার্ভিস মডেল হলো: Software as a Service (SaaS), Platform as a Service (PaaS), এবং Infrastructure as a Service (IaaS)।',
    questionType: 'MCQ',
    marks: 1
  }
];
