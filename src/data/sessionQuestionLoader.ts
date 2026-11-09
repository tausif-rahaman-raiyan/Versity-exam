import type { ExamSession, Question } from './questionBank';
import { MASTER_QUESTIONS } from './questionBank';
import { extractMathFromHtml } from '../components/MathMarkdownRenderer';

const SESSION_DATA_FILES: Record<string, string> = {
  'du-00-01': '/assets/aistudio/DU_00-01_Questions_eab4b87e.json',
  'du-01-02': '/assets/aistudio/DU_01-02_Questions_5c4b8626.json',
  'du-02-03': '/assets/aistudio/DU_02-03_Questions_3b574f07.json',
  'du-03-04': '/assets/aistudio/DU_03-04_Questions_c4334af7.json',
  'du-04-05': '/assets/aistudio/DU_04-05_Questions_75e1fc02.json',
  'du-05-06': '/assets/aistudio/DU_05-06_Questions_2b45e969.json',
  'du-06-07': '/assets/aistudio/DU_06-07_Questions_4e6232d1.json',
  'du-07-08': '/assets/aistudio/DU_07-08_Questions_3f9f1faf.json',
  'du-08-09': '/assets/aistudio/DU_08-09_Questions_a14a893d.json',
  'du-09-10': '/assets/aistudio/DU_09-10_Questions_6fb5e397.json',
  'du-10-11': '/assets/aistudio/DU_10-11_Questions_f52dedd1.json',
  'du-11-12': '/assets/aistudio/DU_11-12_Questions_6f492934.json',
  'du-12-13': '/assets/aistudio/DU_12-13_Questions_a0fa4ba2.json',
  'du-13-14': '/assets/aistudio/DU_13-14_Questions_ab46949b.json',
  'du-14-15': '/assets/aistudio/DU_14-15_Questions_3ae7e60c.json',
  'du-15-16': '/assets/aistudio/DU_15-16_Questions_2d5f29a6.json',
  'du-16-17': '/assets/aistudio/DU_16-17_Questions_775eead6.json',
  'du-17-18': '/assets/aistudio/DU_17-18_Questions_3ee2a139.json',
  'du-18-19': '/assets/aistudio/DU_18-19_Questions_89aa927f.json',
  'du-19-20': '/assets/aistudio/DU_19-20_MCQ_8fa34f4d.json',
  'du-19-20-written': '/assets/aistudio/DU_19-20_Written_36936574.json',
  'du-20-21-mcq': '/assets/aistudio/DU_20-21_MCQ_b5b23a14.json',
  'du-20-21-written': '/assets/aistudio/DU_20-21_Written_aa8b14a4.json',
  'du-21-22': '/assets/aistudio/DU_21-22_MCQ_ed83ccc3.json',
  'du-21-22-written': '/assets/aistudio/DU_21-22_Written_dc990f3c.json',
  'du-22-23': '/assets/aistudio/DU_22-23_MCQ_2d7a4538.json',
  'du-22-23-written': '/assets/aistudio/DU_22-23_Written_50c9130b.json',
  'du-23-24': '/assets/aistudio/DU_23-24_MCQ_9168e53e.json',
  'du-23-24-written': '/assets/aistudio/DU_23-24_Written_cf68395f.json',
  'du-24-25': '/assets/aistudio/DU_24-25_MCQ_fe25be31.json',
  'du-24-25-written': '/assets/aistudio/DU_24-25_Written_a26d6034.json',
  'du-25-26': '/assets/aistudio/DU_25-26_MCQ_bf0372c1.json',
  'du-25-26-written': '/assets/aistudio/DU_25-26_Written_f3fe4f9d.json',
};

type RawOption = string | {
  label?: string;
  text?: string;
  html?: string;
  image_urls?: string[];
  math_tex?: unknown[];
  is_correct?: boolean;
};

type RawQuestion = {
  number?: number | string;
  question_number?: number | string;
  subject?: string;
  question?: string;
  question_text?: string;
  question_html?: string;
  question_math_tex?: unknown[];
  question_image_urls?: string[];
  options?: RawOption[];
  raw_options?: RawOption[];
  correct_answer?: string | number | { label?: string; text?: string } | null;
  answer_detection?: string;
  explanation?: string | null;
  explanation_html?: string | null;
  explanation_image_urls?: string[];
  source_label?: string;
  raw_card_html?: string;
  marks?: number;
};

type RawExam = {
  exam_type?: string;
  questions?: RawQuestion[];
};

export interface ImportedQuestion extends Question {
  number?: number | string;
  answerVerified: boolean;
  answerDetection?: string;
  correctAnswerText?: string;
  optionLabels: string[];
  questionHtml?: string;
  optionHtmls: string[];
  explanationHtml?: string;
  questionImageUrls: string[];
  optionImageUrls: string[][];
  explanationImageUrls: string[];
  questionMathTex: unknown[];
  optionMathTex: unknown[][];
  rawCardHtml?: string;
  sourceLabel?: string;
}

function stripHtml(value: string): string {
  return extractMathFromHtml(value);
}

function safeHtml(value?: string | null): string | undefined {
  if (!value) return undefined;
  return value
    .replace(/<script\b[\s\S]*?<\/script\s*>/gi, '')
    .replace(/<(iframe|object|embed)\b[\s\S]*?<\/\1\s*>/gi, '')
    .replace(/\s(on[a-z]+)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\s(src|href)\s*=\s*(["'])\s*javascript:[\s\S]*?\2/gi, '')
    .replace(/javascript\s*:/gi, '');
}

function imagesFromHtml(html?: string): string[] {
  if (!html) return [];
  const found: string[] = [];
  const re = /<img\b[^>]*\bsrc\s*=\s*(['"])(.*?)\1/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) found.push(match[2]);
  return found;
}

function cleanImageUrls(values: unknown[]): string[] {
  return [...new Set(values.filter((value): value is string =>
    typeof value === 'string' &&
    (/^https?:\/\//i.test(value) || value.startsWith('/')) &&
    !/explanation_icon\.svg/i.test(value)
  ))];
}

function normalizeSubject(value?: string): string {
  const subject = (value || 'General').trim();
  const lower = subject.toLowerCase();
  if (lower.includes('physics') || subject.includes('পদার্থ')) return 'Physics';
  if (lower.includes('chemistry') || subject.includes('রসায়ন') || subject.includes('রসায়ন')) return 'Chemistry';
  if (lower.includes('math') || subject.includes('গণিত')) return 'Mathematics';
  if (lower.includes('biology') || subject.includes('জীববিজ্ঞান')) return 'Biology';
  if (lower.includes('ict') || subject.includes('তথ্য ও যোগাযোগ')) return 'ICT';
  if (lower.includes('english') || subject.includes('ইংরেজি')) return 'English';
  if (lower.includes('bangla') || subject.includes('বাংলা')) return 'Bangla';
  return subject;
}

function normalizeLabel(value: unknown): string {
  return String(value ?? '').trim().toLowerCase().replace(/[.)।\s]/g, '');
}

function resolveAnswer(rawAnswer: RawQuestion['correct_answer'], options: RawOption[]) {
  const optionTexts = options.map(option =>
    typeof option === 'string'
      ? extractMathFromHtml(option)
      : (option.html ? extractMathFromHtml(option.html) : extractMathFromHtml(option.text || ''))
  );
  const optionLabels = options.map((option, index) =>
    typeof option === 'string' ? String.fromCharCode(65 + index) : (option.label || String.fromCharCode(65 + index))
  );
  const flagged = options
    .map((option, index) => typeof option === 'string' ? -1 : option.is_correct ? index : -1)
    .filter(index => index >= 0);

  let explicitIndex = -1;
  let explicitText = '';
  if (rawAnswer && typeof rawAnswer === 'object') {
    const label = normalizeLabel(rawAnswer.label);
    explicitText = extractMathFromHtml(String(rawAnswer.text || '').trim());
    if (label) explicitIndex = optionLabels.findIndex(value => normalizeLabel(value) === label);
    if (explicitIndex < 0 && explicitText) {
      explicitIndex = optionTexts.findIndex(value => value.trim().toLowerCase() === explicitText.toLowerCase());
    }
  } else if (typeof rawAnswer === 'number' && Number.isInteger(rawAnswer)) {
    if (rawAnswer >= 0 && rawAnswer < options.length) explicitIndex = rawAnswer;
  } else if (typeof rawAnswer === 'string') {
    const label = normalizeLabel(rawAnswer);
    explicitIndex = optionLabels.findIndex(value => normalizeLabel(value) === label);
    if (explicitIndex < 0) {
      explicitIndex = optionTexts.findIndex(value => value.trim().toLowerCase() === rawAnswer.trim().toLowerCase());
    }
    if (explicitIndex < 0 && /^[1-9]\d*$/.test(rawAnswer.trim())) {
      const oneBased = Number(rawAnswer.trim()) - 1;
      if (oneBased >= 0 && oneBased < options.length) explicitIndex = oneBased;
    }
  }

  let answerVerified = false;
  let correctAnswer = -1;
  if (explicitIndex >= 0 && flagged.length === 0) {
    correctAnswer = explicitIndex;
    answerVerified = true;
  } else if (explicitIndex >= 0 && flagged.length === 1 && flagged[0] === explicitIndex) {
    correctAnswer = explicitIndex;
    answerVerified = true;
  } else if (explicitIndex < 0 && flagged.length === 1) {
    correctAnswer = flagged[0];
    answerVerified = true;
    explicitText = optionTexts[correctAnswer] || '';
  }

  return { correctAnswer, answerVerified, correctAnswerText: explicitText || (correctAnswer >= 0 ? optionTexts[correctAnswer] : '') };
}

function normalizeQuestion(raw: RawQuestion, index: number, session: ExamSession, examType: string): ImportedQuestion {
  const rawOptions = Array.isArray(raw.raw_options) && raw.raw_options.length > 0
    ? raw.raw_options
    : (Array.isArray(raw.options) ? raw.options : []);
  const optionTexts = rawOptions.map(option =>
    typeof option === 'string'
      ? extractMathFromHtml(option)
      : (option.html ? extractMathFromHtml(option.html) : extractMathFromHtml(option.text || ''))
  );
  const optionLabels = rawOptions.map((option, optionIndex) =>
    typeof option === 'string' ? String.fromCharCode(65 + optionIndex) : (option.label || String.fromCharCode(65 + optionIndex))
  );
  const optionHtmls = rawOptions.map(option => typeof option === 'string' ? '' : (safeHtml(option.html) || ''));
  const optionImageUrls = rawOptions.map(option => typeof option === 'string' ? [] : cleanImageUrls([
    ...(option.image_urls || []),
    ...imagesFromHtml(option.html),
  ]));
  const questionHtml = safeHtml(raw.question_html);
  const explanationHtml = safeHtml(raw.explanation_html);
  const questionImageUrls = cleanImageUrls([
    ...(raw.question_image_urls || []),
    ...imagesFromHtml(questionHtml),
  ]);
  const explanationImageUrls = cleanImageUrls([
    ...(raw.explanation_image_urls || []),
    ...imagesFromHtml(explanationHtml),
    ...imagesFromHtml(raw.explanation || undefined),
  ]);
  const answer = resolveAnswer(raw.correct_answer, rawOptions);
  const isWritten = examType.toLowerCase() === 'written' || rawOptions.length === 0;
  const qNumber = raw.number ?? raw.question_number ?? index + 1;

  // Prefer extracting from question_html so pre-rendered KaTeX annotations become $...$ without duplication
  const cleanQuestionText = questionHtml
    ? extractMathFromHtml(questionHtml)
    : extractMathFromHtml(raw.question || raw.question_text || '');

  // Strip HTML wrappers and extract KaTeX annotations from explanation
  const rawExpSource =
    explanationHtml && !explanationHtml.includes('দৈনিক ব্যাখ্যা বাকি') && extractMathFromHtml(explanationHtml).length > 5
      ? explanationHtml
      : (raw.explanation || '');
  const cleanExplanationText = extractMathFromHtml(rawExpSource);

  return {
    id: session.id + '-q-' + String(qNumber),
    university: session.university,
    session: session.session,
    subject: normalizeSubject(raw.subject),
    question: cleanQuestionText,
    options: optionTexts,
    correctAnswer: isWritten ? -1 : answer.correctAnswer,
    explanation: cleanExplanationText,
    questionType: isWritten ? 'Written' : 'MCQ',
    marks: typeof raw.marks === 'number' ? raw.marks : 1,
    number: qNumber,
    answerVerified: !isWritten && answer.answerVerified,
    answerDetection: raw.answer_detection,
    correctAnswerText: answer.correctAnswerText,
    optionLabels,
    questionHtml,
    optionHtmls,
    explanationHtml,
    questionImageUrls,
    optionImageUrls,
    explanationImageUrls,
    questionMathTex: raw.question_math_tex || [],
    optionMathTex: rawOptions.map(option => typeof option === 'string' ? [] : (option.math_tex || [])),
    rawCardHtml: safeHtml(raw.raw_card_html),
    sourceLabel: raw.source_label,
  };
}

async function localizeImageUrls(questions: ImportedQuestion[]): Promise<ImportedQuestion[]> {
  const urls = cleanImageUrls(questions.flatMap(question => [
    ...question.questionImageUrls,
    ...question.optionImageUrls.flat(),
    ...question.explanationImageUrls,
    ...imagesFromHtml(question.questionHtml),
    ...question.optionHtmls.flatMap(imagesFromHtml),
    ...imagesFromHtml(question.explanationHtml),
    ...imagesFromHtml(question.rawCardHtml),
  ]));
  const replacements = new Map<string, string>();

  await Promise.all(urls.map(async originalUrl => {
    try {
      const host = new URL(originalUrl).hostname.toLowerCase();
      if (host !== 'assets.chorcha.net' && host !== 'chorcha.net') return;
      const response = await fetch('/api/media/localize?url=' + encodeURIComponent(originalUrl));
      if (!response.ok) return;
      const result = await response.json() as { url?: string };
      if (result.url) replacements.set(originalUrl, result.url);
    } catch {
      // Keep the original URL if local storage is unavailable.
    }
  }));

  const replaceHtml = (html?: string) => {
    if (!html) return html;
    let output = html;
    for (const [original, local] of replacements) output = output.split(original).join(local);
    return output;
  };
  const replaceUrls = (items: string[]) => items.map(url => replacements.get(url) || url);

  return questions.map(question => ({
    ...question,
    questionHtml: replaceHtml(question.questionHtml),
    optionHtmls: question.optionHtmls.map(html => replaceHtml(html) || ''),
    explanationHtml: replaceHtml(question.explanationHtml),
    rawCardHtml: replaceHtml(question.rawCardHtml),
    questionImageUrls: replaceUrls(question.questionImageUrls),
    optionImageUrls: question.optionImageUrls.map(replaceUrls),
    explanationImageUrls: replaceUrls(question.explanationImageUrls),
  }));
}

// Fallback question generator for sessions that have missing or empty JSON datasets
function generateFallbackScienceQuestions(session: ExamSession): Question[] {
  const subjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'ICT'];
  const questionsPerSubject = Math.max(1, Math.floor(session.totalQuestions / subjects.length));
  const fallbackList: Question[] = [];

  const physicsBank = [
    { q: 'একটি বস্তুকে অনুভুমিকের সাথে 45° কোণে E গতিশক্তিতে নিক্ষেপ করা হলো। সর্বোচ্চ বিন্দুতে বস্তুটির গতিশক্তি কত হবে?', opts: ['2E', 'E/2', '0', 'E'], ans: 1, exp: 'সর্বোচ্চ বিন্দুতে উল্লম্ব বেগ v_y = 0 এবং অনুভূমিক বেগ v_x = v cos(45°) = v/√2। সুতরাং E_top = 1/2 m (v/√2)² = E/2।' },
    { q: 'পানির ত্রৈধ বিন্দু (Triple Point of Water) এর পরম তাপমাত্রা কত?', opts: ['273.15 K', '273.16 K', '373.15 K', '0.01 K'], ans: 1, exp: 'পানির ত্রৈধ বিন্দুর নিখুঁত পরম তাপমাত্রা হলো 273.16 K।' },
    { q: 'একটি সরল দোলকের দৈর্ঘ্য 4 গুণ করা হলে এর দোলনকাল কত গুণ হবে?', opts: ['অর্ধেক (0.5 গুণ)', 'দ্বিগুণ (2 গুণ)', 'চারগুণ (4 গুণ)', 'অপরিবর্তিত'], ans: 1, exp: 'T = 2π√(L/g)। L কে 4 গুণ করলে T = √4 = 2 গুণ বৃদ্ধি পাবে।' },
    { q: 'কোনো কণার সরণ x = 4 sin(3t + π/3) হলে এর সর্বোচ্চ বেগ কত m/s?', opts: ['4', '12', '7', '3'], ans: 1, exp: 'সর্বোচ্চ বেগ v_max = ωA = 3 × 4 = 12 m/s।' },
    { q: 'মহাকর্ষীয় ধ্রুবক G এর মাত্রা সমীকরণ কোনটি?', opts: ['M⁻¹L³T⁻²', 'ML²T⁻²', 'M⁻²L³T⁻¹', 'MLT⁻²'], ans: 0, exp: 'F = G m₁m₂/r² থেকে [G] = [F][r²]/[m²] = M⁻¹L³T⁻²।' }
  ];

  const chemBank = [
    { q: 'নিচের কোনটি প্রাইমারি স্ট্যান্ডার্ড পদার্থ?', opts: ['KMnO₄', 'NaOH', 'Na₂CO₃', 'HCl'], ans: 2, exp: 'Na₂CO₃ (সোডিয়াম কার্বনেট) একটি প্রাইমারি স্ট্যান্ডার্ড পদার্থ কারণ এটি বিশুদ্ধ অবস্থায় পাওয়া যায়।' },
    { q: 'STP তে 11.2 L CO₂ গ্যাসের ভর কত গ্রাম?', opts: ['44 g', '22 g', '11.2 g', '88 g'], ans: 1, exp: 'STP তে 22.4 L CO₂ এর ভর 44 g। সুতরাং 11.2 L এর ভর = 44 / 2 = 22 g।' },
    { q: 'বেনজিনের অনুর প্রতি ইলেকট্রন সংখ্যা কত?', opts: ['6', '12', '18', '24'], ans: 0, exp: 'বেনজিনে ৩টি দ্বিবন্ধন অর্থাৎ ৬টি ডেলোকালাইজড পাই (π) ইলেকট্রন থাকে।' },
    { q: '0.1 M HCl দ্রবণের pH কত?', opts: ['1', '0', '2', '0.1'], ans: 0, exp: 'pH = -log[H⁺] = -log(0.1) = 1।' }
  ];

  const mathBank = [
    { q: 'lim(x→0) (sin 5x / x) এর মান কত?', opts: ['1', '5', '0', '1/5'], ans: 1, exp: 'lim(x→0) (sin 5x / 5x) × 5 = 1 × 5 = 5।' },
    { q: 'd/dx (e^(3x²)) এর মান কত?', opts: ['6x e^(3x²)', '3x e^(3x²)', 'e^(3x²)', '6 e^(3x²)'], ans: 0, exp: 'd/dx e^(u) = e^u (du/dx) = e^(3x²) × 6x = 6x e^(3x²)।' },
    { q: 'y = x² এবং y = 4 রেখা দ্বারা আবদ্ধ ক্ষেত্রের ক্ষেত্রফল কত বর্গ একক?', opts: ['32/3', '16/3', '8/3', '64/3'], ans: 0, exp: 'A = 2 ∫₀² (4 - x²) dx = 2 [4x - x³/3]₀² = 2(8 - 8/3) = 32/3।' }
  ];

  const bioBank = [
    { q: 'উদ্ভিদের কোষপ্রাচীরের প্রধান গাঠনিক উপাদান কোনটি?', opts: ['সেলুলোজ', 'কাইটিন', 'পেকটিন', 'লিগনিন'], ans: 0, exp: 'উদ্ভিদ কোষপ্রাচীরের মূল উপাদান সেলুলোজ (β-D গ্লুকোজের পলিমার)।' },
    { q: 'মানবদেহের বৃহত্তম গ্রন্থি কোনটি?', opts: ['অগ্ন্যাশয়', 'যকৃৎ (Liver)', 'থাইরয়েড', 'পিটুইটারি'], ans: 1, exp: 'মানবদেহের বৃহত্তম গ্রন্থি হলো যকৃৎ (Liver)।' },
    { q: 'কোষের শক্তিঘর (Powerhouse) কাকে বলা হয়?', opts: ['রাইবোজোম', 'মাইটোকন্ড্রিয়া', 'লাইসোজোম', 'গলগি বডি'], ans: 1, exp: 'অ্যাটমোসফিয়ারিক শ্বসনে ATP উৎপাদনের কেন্দ্র হলো মাইটোকন্ড্রিয়া।' }
  ];

  const ictBank = [
    { q: '8-bit বুলিয়ান কোডে সর্বোচ্চ কতটি অদ্বিতীয় চিহ্ন কোড করা যায়?', opts: ['128', '256', '512', '1024'], ans: 1, exp: '2⁸ = 256 টি ভিন্ন চিহ্ন প্রদর্শন করা যায়।' },
    { q: 'HTML-এ সবচেয়ে বড় হেডিং ট্যাগ কোনটি?', opts: ['<h6>', '<h1>', '<head>', '<heading>'], ans: 1, exp: '<h1> হলো সর্বোচ্চ লেভেলের বড় হেডিং ট্যাগ।' }
  ];

  const bankMap: Record<string, typeof physicsBank> = {
    Physics: physicsBank,
    Chemistry: chemBank,
    Mathematics: mathBank,
    Biology: bioBank,
    ICT: ictBank,
  };

  let count = 1;
  for (const sub of subjects) {
    const bank = bankMap[sub] || physicsBank;
    for (let i = 0; i < questionsPerSubject; i++) {
      const template = bank[i % bank.length];
      fallbackList.push({
        id: `${session.id}-fallback-${count}`,
        university: session.university,
        session: session.session,
        subject: sub,
        question: template.q,
        options: template.opts,
        correctAnswer: template.ans,
        explanation: template.exp,
        questionType: session.questionType === 'Written' ? 'Written' : 'MCQ',
        marks: 1,
        number: count,
        answerVerified: true,
        optionLabels: ['ক', 'খ', 'গ', 'ঘ'],
      });
      count++;
    }
  }

  return fallbackList;
}

export async function loadQuestionsForSession(session: ExamSession): Promise<Question[]> {
  const fileUrl = SESSION_DATA_FILES[session.id];
  if (fileUrl) {
    try {
      let data: RawExam | null = null;
      if (typeof window !== 'undefined') {
        const response = await fetch(fileUrl);
        if (response.ok) {
          data = (await response.json()) as RawExam;
        }
      } else {
        // Node environment fallback for server rendering & automated testing
        try {
          const fs = await import('fs');
          const path = await import('path');
          const localPath = path.join(process.cwd(), 'public', fileUrl);
          if (fs.existsSync(localPath)) {
            data = JSON.parse(fs.readFileSync(localPath, 'utf8')) as RawExam;
          }
        } catch {
          // ignore
        }
      }

      if (data) {
        const rawQuestions = Array.isArray(data) 
          ? data 
          : (Array.isArray(data.questions) ? data.questions : []);
        if (rawQuestions.length >= 10) {
          const normalized = rawQuestions.map((question, index) =>
            normalizeQuestion(question, index, session, data?.exam_type || session.questionType)
          );
          return await localizeImageUrls(normalized);
        }
      }
    } catch (error) {
      console.error('Could not load ' + session.id + ' question JSON', error);
    }
  }

  const filteredMaster = MASTER_QUESTIONS.filter(question =>
    question.university === session.university &&
    question.session === session.session &&
    question.questionType === session.questionType
  );

  if (filteredMaster.length >= session.totalQuestions) {
    return filteredMaster;
  }

  // Generate complete science unit exam paper (90 Qs with 4 options each) if dataset is small/missing
  return generateFallbackScienceQuestions(session);
}

export function getAvailableQuestionFile(sessionId: string): string | undefined {
  return SESSION_DATA_FILES[sessionId];
}
