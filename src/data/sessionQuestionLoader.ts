import type { ExamSession, Question } from './questionBank';
import { MASTER_QUESTIONS } from './questionBank';

const SESSION_DATA_FILES: Record<string, string> = {
  'du-00-01': '/assets/aistudio/DU_00-01_Questions_eab4b87e.json',
  'du-11-12': '/assets/aistudio/DU_11-12_Questions_6f492934.json',
  'du-12-13': '/assets/aistudio/DU_12-13_Questions_a0fa4ba2.json',
  'du-13-14': '/assets/aistudio/DU_13-14_Questions_ab46949b.json',
  'du-14-15': '/assets/aistudio/DU_14-15_Questions_3ae7e60c.json',
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
  subject?: string;
  question?: string;
  question_html?: string;
  question_math_tex?: unknown[];
  question_image_urls?: string[];
  options?: RawOption[];
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
  return value.replace(/<[^>]*>/g, ' ').replace(/&nbsp;|&#160;/gi, ' ').replace(/\s+/g, ' ').trim();
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
    /^https?:\/\//i.test(value) &&
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
  const optionTexts = options.map(option => typeof option === 'string' ? option : (option.text || stripHtml(option.html || '')));
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
    explicitText = String(rawAnswer.text || '').trim();
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
  const rawOptions = Array.isArray(raw.options) ? raw.options : [];
  const optionTexts = rawOptions.map(option =>
    typeof option === 'string' ? option : (option.text || stripHtml(option.html || ''))
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
  ]);
  const answer = resolveAnswer(raw.correct_answer, rawOptions);
  const isWritten = examType.toLowerCase() === 'written' || rawOptions.length === 0;

  return {
    id: session.id + '-q-' + String(raw.number ?? index + 1),
    university: session.university,
    session: session.session,
    subject: normalizeSubject(raw.subject),
    question: raw.question || stripHtml(questionHtml || ''),
    options: optionTexts,
    correctAnswer: isWritten ? -1 : answer.correctAnswer,
    explanation: raw.explanation || '',
    questionType: isWritten ? 'Written' : 'MCQ',
    marks: typeof raw.marks === 'number' ? raw.marks : 1,
    number: raw.number ?? index + 1,
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

export async function loadQuestionsForSession(session: ExamSession): Promise<Question[]> {
  const fileUrl = SESSION_DATA_FILES[session.id];
  if (fileUrl) {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('Question file request failed: ' + response.status);
      const data = await response.json() as RawExam;
      const rawQuestions = Array.isArray(data.questions) ? data.questions : [];
      if (rawQuestions.length > 0) {
        const normalized = rawQuestions.map((question, index) =>
          normalizeQuestion(question, index, session, data.exam_type || session.questionType)
        );
        return await localizeImageUrls(normalized);
      }
    } catch (error) {
      console.error('Could not load ' + session.id + ' question JSON', error);
    }
  }

  return MASTER_QUESTIONS.filter(question =>
    question.university === session.university &&
    question.session === session.session &&
    question.questionType === session.questionType
  );
}

export function getAvailableQuestionFile(sessionId: string): string | undefined {
  return SESSION_DATA_FILES[sessionId];
}
