import { Question } from './questionBank';

export const GST_QUESTIONS: Question[] = [
  // --- GST PHYSICS ---
  {
    id: 'gst-p-1',
    university: 'GST',
    session: '24-25',
    subject: 'Physics',
    question: 'একটি ট্রানজিস্টরের ক্ষেত্রে কারেন্ট গেইন α = 0.98 হলে β এর মান কত?',
    options: ['49', '50', '98', '99'],
    correctAnswer: 0,
    explanation: 'β = α / (1 - α) = 0.98 / (1 - 0.98) = 0.98 / 0.02 = 49।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'gst-p-2',
    university: 'GST',
    session: '23-24',
    subject: 'Physics',
    question: 'ফোটনের নিশ্চল ভর (Rest mass of photon) কত?',
    options: ['শূন্য (Zero)', '9.1 × 10⁻³¹ kg', '1.67 × 10⁻²⁷ kg', 'h / c'],
    correctAnswer: 0,
    explanation: 'বিশেষ আপেক্ষিকতা অনুসারে ফোটনের নিশ্চল ভর সর্বদা শূন্য (m0 = 0)।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'gst-p-3',
    university: 'GST',
    session: '22-23',
    subject: 'Physics',
    question: 'শব্দোত্তর তরঙ্গের (Ultrasound) কম্পাঙ্ক কত?',
    options: ['> 20,000 Hz', '< 20 Hz', '20 Hz থেকে 20,000 Hz', 'শূন্য'],
    correctAnswer: 0,
    explanation: 'শ্রাব্যতার সীমা 20 Hz থেকে 20,000 Hz। 20,000 Hz এর বেশি কম্পাঙ্কের শব্দ তরঙ্গকে আলট্রাসাউন্ড বা শব্দোত্তর তরঙ্গ বলে।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'gst-p-4',
    university: 'GST',
    session: '21-22',
    subject: 'Physics',
    question: 'একটি তড়িৎ দ্বিমেরুর অক্ষীয় অবস্থানে r দূরত্বে তড়িৎ প্রাবল্য E এর সাথে দূরত্বের সম্পর্ক কী?',
    options: ['E ∝ 1/r³', 'E ∝ 1/r²', 'E ∝ 1/r', 'E ∝ r'],
    correctAnswer: 0,
    explanation: 'বিন্দু চার্জের ক্ষেত্রে E ∝ 1/r², কিন্তু তড়িৎ দ্বিমেরুর জন্য দূরবর্তী বিন্দুতে E ∝ 1/r³।',
    questionType: 'MCQ',
    marks: 1
  },

  // --- GST CHEMISTRY ---
  {
    id: 'gst-c-1',
    university: 'GST',
    session: '24-25',
    subject: 'Chemistry',
    question: 'একটি প্রথম ক্রম বিক্রিয়ার অর্ধায়ু (Half-life) 20 মিনিট হলে বিক্রিয়াটির হার ধ্রুবক (k) কত min⁻¹?',
    options: ['0.03465', '0.0693', '0.0173', '0.050'],
    correctAnswer: 0,
    explanation: 'প্রথম ক্রম বিক্রিয়ার ক্ষেত্রে k = 0.693 / t½ = 0.693 / 20 = 0.03465 min⁻¹।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'gst-c-2',
    university: 'GST',
    session: '23-24',
    subject: 'Chemistry',
    question: 'কোন এসিডটির তীব্রতা (Acidity) সবচেয়ে বেশি?',
    options: ['HClO₄ (পারক্লোরিক এসিড)', 'HClO₃', 'HClO₂', 'HClO'],
    correctAnswer: 0,
    explanation: 'কেন্দ্রীয় ক্লোরিন পরমাণুর জারণ সংখ্যা HClO4-এ সর্বোচ্চ (+7)। কেন্দ্রীয় পরমাণুর জারণ মান ও ধনাত্মক চার্জের ঘনত্ব যত বেশি, এসিড তত তীব্র হয়।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'gst-c-3',
    university: 'GST',
    session: '22-23',
    subject: 'Chemistry',
    question: 'কাচ খোদাই করতে (Etching of glass) নিচের কোন এসিড ব্যবহৃত হয়?',
    options: ['HF (হাইড্রোফ্লোরিক এসিড)', 'HCl', 'H₂SO₄', 'HNO₃'],
    correctAnswer: 0,
    explanation: 'HF কাচের প্রধান উপাদান সিলিকা (SiO2) এর সাথে বিক্রিয়া করে দ্রবণীয় সিলিকন টেট্রাফ্লোরাইড (SiF4) তৈরি করে, তাই কাচ খোদাইয়ে HF ব্যবহার করা হয়।',
    questionType: 'MCQ',
    marks: 1
  },

  // --- GST MATHEMATICS ---
  {
    id: 'gst-m-1',
    university: 'GST',
    session: '24-25',
    subject: 'Mathematics',
    question: 'sin⁻¹(x) + cos⁻¹(x) এর মান কত (যখন -1 ≤ x ≤ 1)?',
    options: ['π / 2', 'π', '0', '2π'],
    correctAnswer: 0,
    explanation: 'বিপরীত ত্রিকোণমিতিক অভেদ অনুসারে যেকোনো বৈধ x এর জন্য sin⁻¹(x) + cos⁻¹(x) = π/2।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'gst-m-2',
    university: 'GST',
    session: '23-24',
    subject: 'Mathematics',
    question: 'যদি ভেক্টর A = 2i + 3j - k এবং B = -4i - 6j + 2k হয়, তবে ভেক্টরদ্বয় পরস্পরের কেমন?',
    options: ['সমান্তরাল ও বিপরীতমুখী', 'পরস্পর লম্ব', 'সমান', 'অসংজ্ঞায়িত'],
    correctAnswer: 0,
    explanation: 'B = -2 (2i + 3j - k) = -2 A। একটি ভেক্টর অন্য ভেক্টরের ঋণাত্মক গুণিতক হওয়ায় এরা সমান্তরাল ও পরস্পর বিপরীতমুখী।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'gst-m-3',
    university: 'GST',
    session: '22-23',
    subject: 'Mathematics',
    question: '∫ e^(2x) dx এর অনির্দিষ্ট যোগজ কোনটি?',
    options: ['½ e^(2x) + c', '2 e^(2x) + c', 'e^(2x) + c', '¼ e^(2x) + c'],
    correctAnswer: 0,
    explanation: '∫ e^(ax) dx = (1/a) e^(ax) + c। এখানে a = 2, সুতরাং ½ e^(2x) + c।',
    questionType: 'MCQ',
    marks: 1
  },

  // --- GST BIOLOGY ---
  {
    id: 'gst-b-1',
    university: 'GST',
    session: '24-25',
    subject: 'Biology',
    question: 'ডিএনএ (DNA) অণুতে এডেনিন (A) ক্ষারকের সাথে থাইমিন (T) কয়টি হাইড্রোজেন বন্ধন দ্বারা যুক্ত থাকে?',
    options: ['১ টি', '২ টি', '৩ টি', '৪ টি'],
    correctAnswer: 1,
    explanation: 'ওয়াটসন-ক্রিক মডেল অনুসারে A = T (২টি হাইড্রোজেন বন্ধন) এবং G ≡ C (৩টি হাইড্রোজেন বন্ধন)।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'gst-b-2',
    university: 'GST',
    session: '23-24',
    subject: 'Biology',
    question: 'মানুষের করোটি স্নায়ু (Cranial Nerves) কত জোড়া?',
    options: ['১২ জোড়া', '৩১ জোড়া', '১০ জোড়া', '২৪ জোড়া'],
    correctAnswer: 0,
    explanation: 'মানুষের করোটি স্নায়ু ১২ জোড়া এবং সুষুম্না স্নায়ু ৩১ জোড়া।',
    questionType: 'MCQ',
    marks: 1
  },

  // --- GST ICT ---
  {
    id: 'gst-i-1',
    university: 'GST',
    session: '24-25',
    subject: 'ICT',
    question: 'সি (C) ভাষায় কোনো ভেরিয়েবলের মেমোরি অ্যাড্রেস পাওয়ার জন্য কোন অপারেটর ব্যবহৃত হয়?',
    options: ['*', '& (অ্যামপারস্যান্ড)', '%', '#'],
    correctAnswer: 1,
    explanation: '& (Address-of operator) কোনো ভেরিয়েবলের র‍্যাম মেমোরি অ্যাড্রেস প্রকাশ করে। * হলো পয়েন্টার ডিরিফারেন্স অপারেটর।',
    questionType: 'MCQ',
    marks: 1
  },
  {
    id: 'gst-i-2',
    university: 'GST',
    session: '23-24',
    subject: 'ICT',
    question: 'একটি সম্পূর্ণ বাইনারি ট্রিতে (Full Binary Tree) উচ্চতা h = 3 হলে সর্বোচ্চ নোড সংখ্যা কত?',
    options: ['7', '8', '15', '31'],
    correctAnswer: 0,
    explanation: 'উচ্চতা h হলে নোড সংখ্যা 2^(h) - 1 = 2³ - 1 = 8 - 1 = 7 (রুট লেভেল 1 ধরলে)।',
    questionType: 'MCQ',
    marks: 1
  }
];
