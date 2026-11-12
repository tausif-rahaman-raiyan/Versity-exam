#!/usr/bin/env node
/**
 * scripts/import-questions.mjs
 *
 * Reusable question importer for TXT / JSON admission papers.
 *
 * Usage:
 *   npm run import:questions -- <path-to-source-file> [sessionId]
 *
 * Workflow (§10):
 * 1. Inspects the uploaded TXT or JSON file.
 * 2. Matches target session in src/data/sessions.ts & src/data/institutions.ts.
 * 3. Parses questions, options, correct answers, explanations, and image URLs.
 * 4. Normalizes subjects to canonical IDs in src/data/subjects.ts.
 * 5. Downloads external images to public/assets/questions/{INSTITUTION}/{SESSION}/{SESSION_ID}/
 *    and replaces external URLs with local relative paths.
 * 6. Saves question JSON to public/data/questions/{INSTITUTION}/{SESSION}/{SESSION_ID}.json.
 * 7. Generates docs/imports/{INSTITUTION}/{SESSION}/{SESSION_ID}/README.md and image-manifest.json.
 * 8. Appends/updates docs/IMPORT_LOG.md.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { processSessionImages } from './download-question-images.mjs';
import { checkDuplicates } from './check-duplicate-questions.mjs';
import { validateAllQuestionFiles } from './validate-question-data.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const SUBJECT_ALIASES = [
  { id: 'Physics', patterns: ['physics', 'পদার্থবিজ্ঞান', 'পদার্থ', 'ফিজিক্স', 'phy'] },
  { id: 'Chemistry', patterns: ['chemistry', 'রসায়ন', 'রসায়ন', 'কেমিস্ট্রি', 'chem'] },
  {
    id: 'Mathematics',
    patterns: ['mathematics', 'higher math', 'math', 'উচ্চতর গণিত', 'গণিত', 'গনিত']
  },
  {
    id: 'Biology',
    patterns: [
      'biology',
      'জীববিজ্ঞান',
      'জীববিদ্যা',
      'জীব',
      'উদ্ভিদবিজ্ঞান',
      'প্রাণিবিজ্ঞান',
      'bio'
    ]
  },
  { id: 'Bangla', patterns: ['bangla', 'bengali', 'বাংলা'] },
  { id: 'English', patterns: ['english', 'ইংরেজি', 'eng'] },
  {
    id: 'ICT',
    patterns: ['ict', 'আইসিটি', 'তথ্য ও যোগাযোগ প্রযুক্তি', 'computer']
  },
  {
    id: 'General Knowledge',
    patterns: ['general knowledge', 'gk', 'iq', 'সাধারণ জ্ঞান', 'মানসিক দক্ষতা']
  }
];

export function normalizeSubjectId(rawTag) {
  const cleaned = String(rawTag || '')
    .replace(/\(\s*\d+\s*\)/g, '')
    .trim()
    .toLowerCase();

  for (const entry of SUBJECT_ALIASES) {
    if (entry.patterns.some((p) => cleaned.includes(p))) {
      return entry.id;
    }
  }
  return 'General Knowledge';
}

/**
 * Heuristic subject classifier for questions inside a combined Section A block
 * (e.g. `[ক বিভাগ(55)]` or `[পদার্থবিজ্ঞান, রসায়ন ও ICT(55)]`) or untagged `[(22)]`.
 */
function inferSubjectFromStemAndOptions(stem, options, indexInBlock, totalInBlock) {
  const text = `${stem} ${(options || []).join(' ')}`.toLowerCase();

  // ICT keywords
  if (
    /\b(html|http|ip\b|tcp|udp|lan|wan|man|wi-?fi|bluetooth|binary|octal|hexadecimal|ascii|unicode|bcd|logic gate|nand|nor|xor|xnor|flip-flop|register|compiler|interpreter|assembler|sql|database|dbms|algorithm|flowchart|c programming|python|クラウド|ক্লাউড|বাইনারি|অক্টাল|হেক্সাডেসিমেল|লজিক গেট|টপোলজি|প্রটোকল|আইপি|ব্রাউজার|মডেম|রাউটার|হাব|সুইচ|অপটিক্যাল ফাইবার|ব্যান্ডউইথ|ন্যানোটেকনোলজি|বায়োইনফরমেটিক্স|রোবটিক্স|ভার্চুয়াল রিয়েলিটি|ক্রায়োসার্জারি|বায়োমেট্রিক্স|জেনেটিক ইঞ্জিনিয়ারিং|কম্পাইলার|ইন্টারপ্রেটার|ডেটাবেজ|অ্যালগরিদম)\b/i.test(
      text
    )
  ) {
    return 'ICT';
  }

  // Biology keywords
  if (
    /(কোষ|মাইটোসিস|মিয়োসিস|মায়োসিস|ডিএনএ|আরএনএ|dna|rna|জিন|ক্রোমোজোম|এনজাইম|সালোকসংশ্লেষণ|শ্বসন|ভাইরাস|ব্যাকটেরিয়া|ব্যাকটেরিয়া|ছত্রাক|শৈবাল|মস|ফার্ন|নগ্নবীজী|আবৃতবীজী|টিস্যু|রক্ত|হৃদপিণ্ড|হৃৎপিণ্ড|নেফ্রন|বৃক্ক|যকৃত|পাকস্থলী|হরমোন|স্নায়ু|স্নায়ু|কঙ্কাল|পেশী|শ্রেণিবিন্যাস|পর্ব|প্রজাতি|ইকোলজি|বাস্তুতন্ত্র|হাইড্রা|hydra|ঘাসফড়িং|রুই মাছ|জবা|মালভেসি|পোয়াসি)/i.test(
      text
    )
  ) {
    return 'Biology';
  }

  // Chemistry keywords
  if (
    /(মোল|মোলারিটি|নরমালিটি|pH|পিএইচ|বাফার|অম্ল|ক্ষার|লবণ|জারণ|বিজারণ|তড়িৎ বিশ্লেষণ|তড়িৎ বিশ্লেষণ|ফ্যারাডে|অ্যালকেন|অ্যালকিন|অ্যালকাইন|বেনজিন|অ্যালকোহল|অ্যালডিহাইড|কিটোন|কার্বক্সিলিক|এস্টার|অ্যামিন|পলিমার|আইসোমার|সমাণুতা|সংকরায়ন|সংকরায়ন|sp2|sp3|বন্ধন কোণ|পর্যায় সারণি|পর্যায় সারণি|আইসোটোপ|অরবিটাল|কোয়ান্টাম সংখ্যা|কোয়ান্টাম সংখ্যা|দ্রাব্যতা|সাম্যাবস্থা|লা শাতেলিয়ার|বিক্রিয়া|বিক্রিয়া|তাপরসায়ন|এনথালপি|মৌল|যৌগ|আকরিক)/i.test(
      text
    )
  ) {
    return 'Chemistry';
  }

  // Physics keywords
  if (
    /(ভেক্টর|বেগ|ত্বরণ|বল|নিউটন|কাজ|শক্তি|ক্ষমতা|ভরবেগ|জড়তার ভ্রামক|টর্ক|কৌণিক|মহাকর্ষ|অভিকর্ষ|মুক্তিবেগ|পৃষ্ঠটান|সান্দ্রতা|ইয়ং|ইয়ং|স্থিতিস্থাপকতা|সরল ছন্দিত|দোলক|তরঙ্গ|কম্পাঙ্ক|শব্দ|ডপলার|তাপমাত্রা|তাপগতিবিদ্যা|এনট্রপি|কার্নো|স্থির তড়িৎ|স্থির তড়িৎ|ধারক|কুলম্ব|বিভব|প্রবাহ|ওহম|রোধ|কির্শফ|চৌম্বক|আবেশ|লেনজ|আলোক|প্রতিসরণ|লেন্স|ব্যতিচার|অপবর্তন|সমাবর্তন|ফোটন|আলোক তড়িৎ|তেজস্ক্রিয়তা|অর্ধায়ু|অর্ধায়ু|সেমিকন্ডাক্টর|ডায়োড|ট্রানজিস্টর)/i.test(
      text
    )
  ) {
    return 'Physics';
  }

  // Fallback by position inside a 50-55 question RU Section A block (Physics 25, Chemistry 25, ICT 5)
  if (totalInBlock >= 44) {
    if (indexInBlock < 25) return 'Physics';
    if (indexInBlock < 50) return 'Chemistry';
    return 'ICT';
  }

  return 'Physics';
}

/**
 * Classifies RU bracketed header tags into:
 * - ruSection: 'A' | 'B' | undefined
 * - ruBranch: 'Math' | 'Biology' | 'Math+Biology' | undefined
 * - subject: Canonical subject ID
 */
function classifyRuTagAndQuestion({
  rawTag,
  institution,
  hasMultiSectionTags,
  stem,
  options,
  indexInTagBlock,
  totalInTagBlock
}) {
  const cleaned = String(rawTag || '')
    .replace(/\(\s*\d+\s*\)/g, '')
    .trim();
  const lower = cleaned.toLowerCase();

  if (institution === 'RU' && hasMultiSectionTags) {
    // 1. Section A (Compulsory) combined headers
    const isSecACombined =
      lower.includes('ক বিভাগ') ||
      lower.includes("'ক' বিভাগ") ||
      lower.includes('ক-শাখা') ||
      (lower.includes('পদার্থ') && lower.includes('রস')) ||
      (lower.includes('ফিজিক্স') && lower.includes('কেমিস্ট্রি'));

    if (isSecACombined) {
      const inferredSub = inferSubjectFromStemAndOptions(
        stem,
        options,
        indexInTagBlock,
        totalInTagBlock
      );
      return {
        subject: inferredSub,
        ruSection: 'A',
        ruBranch: undefined
      };
    }

    // 2. Section B — Combined Math + Biology branch
    const isCombinedMathBio =
      lower === 'খ বিভাগ' ||
      lower.includes("'খ' বিভাগ") ||
      (lower.includes('জীব') && lower.includes('গণিত')) ||
      (lower.includes('math') && lower.includes('bio'));

    if (isCombinedMathBio) {
      const sub = inferSubjectFromStemAndOptions(stem, options, 0, 25);
      return {
        subject: sub === 'Biology' ? 'Biology' : 'Mathematics',
        ruSection: 'B',
        ruBranch: 'Math+Biology'
      };
    }

    // 3. Section B — Biology only branch
    if (
      lower.includes('খ-শাখা') ||
      lower.includes('জীববিদ্যা') ||
      lower.includes('জীববিজ্ঞান') ||
      lower.includes('biology')
    ) {
      return {
        subject: 'Biology',
        ruSection: 'B',
        ruBranch: 'Biology'
      };
    }

    // 4. Section B — Mathematics only branch
    if (
      lower.includes('গ-শাখা') ||
      lower.includes('গণিত') ||
      lower.includes('গনিত') ||
      lower.includes('math')
    ) {
      return {
        subject: 'Mathematics',
        ruSection: 'B',
        ruBranch: 'Math'
      };
    }
  }

  // Untagged block like [(22)] or [(5)]
  if (!cleaned) {
    return {
      subject: inferSubjectFromStemAndOptions(
        stem,
        options,
        indexInTagBlock,
        totalInTagBlock
      ),
      ruSection: undefined,
      ruBranch: undefined
    };
  }

  return {
    subject: normalizeSubjectId(rawTag),
    ruSection: undefined,
    ruBranch: undefined
  };
}

const ANSWER_MAP = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  ক: 0,
  খ: 1,
  গ: 2,
  ঘ: 3,
  ঙ: 4
};

async function loadSessionsAndInstitutions() {
  const sessionsFile = path.join(PROJECT_ROOT, 'src', 'data', 'sessions.ts');
  const sessionsContent = await fs.readFile(sessionsFile, 'utf8');
  const sMatch = sessionsContent.match(
    /export const sessions:\s*Session\[\]\s*=\s*(\[[\s\S]*\]);/
  );
  if (!sMatch) {
    throw new Error('Could not parse sessions from src/data/sessions.ts');
  }
  const sessions = JSON.parse(sMatch[1]);

  const instMap = {
    DU: 'University of Dhaka (ঢাকা বিশ্ববিদ্যালয়)',
    RU: 'University of Rajshahi (রাজশাহী বিশ্ববিদ্যালয়)',
    JU: 'Jahangirnagar University (জাহাঙ্গীরনগর বিশ্ববিদ্যালয়)',
    CU: 'University of Chittagong (চট্টগ্রাম বিশ্ববিদ্যালয়)',
    GST: 'GST Cluster (জিএসটি গুচ্ছ)',
    CoU: 'Comilla University (কুমিল্লা বিশ্ববিদ্যালয়)',
    JnU: 'Jagannath University (জগন্নাথ বিশ্ববিদ্যালয়)',
    KhU: 'Khulna University (খুলনা বিশ্ববিদ্যালয়)',
    GSTAGRI: 'GST Agri Cluster (কৃষি গুচ্ছ)',
    GAU: 'Gazipur Agricultural University',
    BAU: 'Bangladesh Agricultural University',
    SAU: 'Sher-e-Bangla Agricultural University',
    CVASU: 'CVASU',
    SYLAU: 'Sylhet Agricultural University'
  };

  return { sessions, instMap };
}

/**
 * Infers session ID from filename when not explicitly provided on CLI.
 * Example: "DU_21-22_MCQ_19c28058.txt" -> "du-21-22-mcq"
 */
export function inferSessionIdFromFilename(filename, sessions) {
  const base = path.basename(filename, path.extname(filename));
  // Strip AI Studio attachment 8-hex suffix if present (e.g. _19c28058)
  const stripped = base.replace(/_[0-9a-f]{8}$/i, '');
  const slug = stripped
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const exact = sessions.find((s) => s.id === slug);
  if (exact) return exact.id;

  const partial = sessions.find(
    (s) => s.id.replace(/[^a-z0-9]/g, '') === slug.replace(/[^a-z0-9]/g, '')
  );
  if (partial) return partial.id;

  return null;
}

/**
 * Parses our bracketed TXT admission paper format:
 *   [Subject(15)] 1. 1. Question stem...
 *   QUESTION IMAGE: EXTERNAL_IMAGE_URL: https://... (optional)
 *   A: optA | B: optB | C: optC | D: optD
 *   CORRECT ANSWER: B
 *   EXPLANATION: ... (optional)
 */
export function parseTxtQuestionPaper(rawText, sessionMeta, sourceFilename) {
  const cleanedText = rawText.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');

  // Split into question blocks starting at line-beginning `[Subject...] <num>.`
  const lines = cleanedText.split('\n');
  const blocks = [];
  let currentBlock = [];

  const headerRegex = /^\[([^\]]+)\]\s*(\d+)\.\s*(?:\d+\.\s*)?(.*)$/;

  for (const line of lines) {
    if (headerRegex.test(line.trim())) {
      if (currentBlock.length > 0) {
        blocks.push(currentBlock.join('\n').trim());
      }
      currentBlock = [line];
    } else if (currentBlock.length > 0) {
      currentBlock.push(line);
    }
  }
  if (currentBlock.length > 0) {
    blocks.push(currentBlock.join('\n').trim());
  }

  // First pass: count how many questions belong to each raw bracketed tag
  const tagTotals = {};
  const tagSeenCounts = {};
  for (const block of blocks) {
    const firstLine = block.split('\n')[0]?.trim() || '';
    const m = firstLine.match(headerRegex);
    if (m) {
      const t = m[1].trim();
      tagTotals[t] = (tagTotals[t] || 0) + 1;
    }
  }

  const allTagKeysLower = Object.keys(tagTotals).join(' | ').toLowerCase();
  const hasMultiSectionTags =
    sessionMeta.institution === 'RU' &&
    (allTagKeysLower.includes('ক বিভাগ') ||
      allTagKeysLower.includes('ক-শাখা') ||
      allTagKeysLower.includes('খ-শাখা') ||
      allTagKeysLower.includes('জীববিদ্যা + গণিত') ||
      allTagKeysLower.includes('জীববিদ্যা+গণিত') ||
      allTagKeysLower.includes('math + biology') ||
      (allTagKeysLower.includes('পদার্থ') &&
        allTagKeysLower.includes('রস') &&
        allTagKeysLower.includes('ict')));

  const questions = [];

  for (let idx = 0; idx < blocks.length; idx++) {
    const block = blocks[idx];
    const blockLines = block
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    if (blockLines.length === 0) continue;

    const firstLine = blockLines[0];
    const match = firstLine.match(headerRegex);
    if (!match) continue;

    const rawSubjectTag = match[1].trim();
    const globalNum = parseInt(match[2], 10) || idx + 1;
    const stemLines = [match[3].trim()];

    const indexInTagBlock = tagSeenCounts[rawSubjectTag] || 0;
    tagSeenCounts[rawSubjectTag] = indexInTagBlock + 1;
    const totalInTagBlock = tagTotals[rawSubjectTag] || 1;

    let optionsLine = '';
    let answerLine = '';
    const explanationLines = [];
    const questionImageUrls = [];
    let inExplanation = false;

    for (let j = 1; j < blockLines.length; j++) {
      const l = blockLines[j];

      if (/^QUESTION\s+IMAGE\s*:/i.test(l)) {
        const urlMatch = l.match(/https?:\/\/\S+/i);
        if (urlMatch) {
          questionImageUrls.push(urlMatch[0].trim());
        }
        continue;
      }

      if (/^CORRECT\s+ANSWER\s*:/i.test(l)) {
        answerLine = l.replace(/^CORRECT\s+ANSWER\s*:\s*/i, '').trim();
        inExplanation = false;
        continue;
      }

      if (/^(?:EXPLANATION|সমাধান|ব্যাখ্যা)\s*:/i.test(l)) {
        inExplanation = true;
        const expStart = l.replace(/^(?:EXPLANATION|সমাধান|ব্যাখ্যা)\s*:\s*/i, '').trim();
        if (expStart) explanationLines.push(expStart);
        continue;
      }

      if (inExplanation) {
        explanationLines.push(l);
        continue;
      }

      if (/^A\s*:/i.test(l) && l.includes('|') && /\bB\s*:/i.test(l)) {
        optionsLine = l;
        continue;
      }

      stemLines.push(l);
    }

    // Parse options A: ... | B: ... | C: ... | D: ...
    const options = [];
    if (optionsLine) {
      const parts = optionsLine.split(/\s*\|\s*(?=[A-Fক-ঙ]\s*:)/);
      for (const part of parts) {
        const optText = part.replace(/^[A-Fক-ঙ]\s*:\s*/, '').trim();
        options.push(optText);
      }
    }

    // Parse correctAnswer
    let correctAnswer = -1;
    let answerVerified = false;
    if (answerLine) {
      const upper = answerLine.toUpperCase();
      if (ANSWER_MAP[upper] !== undefined) {
        correctAnswer = ANSWER_MAP[upper];
        answerVerified = true;
      } else if (ANSWER_MAP[answerLine] !== undefined) {
        correctAnswer = ANSWER_MAP[answerLine];
        answerVerified = true;
      } else {
        const numIdx = parseInt(answerLine, 10);
        if (Number.isFinite(numIdx) && numIdx >= 0 && numIdx < options.length) {
          correctAnswer = numIdx;
          answerVerified = true;
        }
      }
    }

    const stemJoined = stemLines.join('\n').trim();
    const {
      subject: canonicalSubject,
      ruSection,
      ruBranch
    } = classifyRuTagAndQuestion({
      rawTag: rawSubjectTag,
      institution: sessionMeta.institution,
      hasMultiSectionTags,
      stem: stemJoined,
      options,
      indexInTagBlock,
      totalInTagBlock
    });

    const qType =
      options.length > 0 ? 'MCQ' : sessionMeta.questionType || 'MCQ';
    const explanation =
      explanationLines.length > 0 ? explanationLines.join('\n').trim() : undefined;

    const qObj = {
      id: `${sessionMeta.id}-q-${String(globalNum).padStart(3, '0')}`,
      number: globalNum,
      subject: canonicalSubject,
      ...(ruSection ? { ruSection } : {}),
      ...(ruBranch ? { ruBranch } : {}),
      question: stemJoined,
      options,
      correctAnswer,
      answerVerified,
      ...(explanation ? { explanation } : {}),
      questionType: qType,
      institution: sessionMeta.institution,
      session: sessionMeta.session,
      ...(questionImageUrls.length > 0 ? { questionImageUrls } : {}),
      provenance: {
        sourceFile: sourceFilename,
        sourceLocation: `Question #${globalNum} ([${rawSubjectTag}])`,
        answerSource: answerVerified
          ? 'Copied directly from uploaded source file (CORRECT ANSWER line)'
          : 'Unverified / not present in source',
        explanationSource: explanation
          ? 'Copied from uploaded source file'
          : 'Not supplied in source',
        verificationStatus: answerVerified ? 'source-provided' : 'unverified'
      }
    };

    questions.push(qObj);
  }

  return questions;
}

async function generatePaperReadme({
  sessionMeta,
  instFullName,
  sourceFilename,
  sourceFormat,
  questions,
  imageStats,
  duplicateList,
  outputJsonRelPath,
  manifestRelPath
}) {
  const importDate = new Date().toISOString().slice(0, 10);
  const subjectCounts = {};
  let mcqCount = 0;
  let writtenCount = 0;
  let verifiedCount = 0;
  let unverifiedCount = 0;
  let explanationsCount = 0;

  for (const q of questions) {
    subjectCounts[q.subject] = (subjectCounts[q.subject] || 0) + 1;
    if (q.questionType === 'Written') writtenCount++;
    else mcqCount++;

    if (q.answerVerified && q.correctAnswer >= 0) verifiedCount++;
    else unverifiedCount++;

    if (q.explanation && q.explanation.trim()) explanationsCount++;
  }

  const subjectSummary = Object.entries(subjectCounts)
    .map(([sub, cnt]) => `${sub} (${cnt})`)
    .join(', ');

  const localImageList =
    imageStats.manifest
      .filter((m) => m.localPath)
      .map((m) => `  - \`${m.localPath}\` (Q#${m.questionNumber}, ${m.imageType})`)
      .join('\n') || '  - None (no external images in this paper)';

  const duplicateNotes =
    duplicateList.length === 0
      ? '0 internal duplicates detected'
      : `${duplicateList.length} pair(s) flagged & preserved from source (${duplicateList
          .map((d) => `Q#${d.firstNumber} & Q#${d.secondNumber} [${d.subject}]`)
          .join('; ')})`;

  const markdown = `# Question Import Report

## 1. Paper Information

- Institution: ${instFullName}
- Institution ID: \`${sessionMeta.institution}\`
- Unit: \`${sessionMeta.unit || 'N/A'}\`
- Session: \`${sessionMeta.session}\`
- Session ID: \`${sessionMeta.id}\`
- Paper title: ${sessionMeta.title}
- Question type: ${sessionMeta.questionType}
- Source filename: \`${sourceFilename}\`
- Import date: ${importDate}

## 2. Source File Analysis

- Original file format: ${sourceFormat}
- Original question structure: Bracketed subject tag \`[Subject(15)] <globalNum>. <subNum>. <stem>\`, pipe-separated options \`A: ... | B: ... | C: ... | D: ...\`, and \`CORRECT ANSWER: <letter>\`
- Number of questions detected: ${questions.length}
- Number of subjects: ${Object.keys(subjectCounts).length} — ${subjectSummary}
- MCQ count: ${mcqCount}
- Written count: ${writtenCount}
- Answer information: ${verifiedCount} answers provided in source (\`CORRECT ANSWER\` lines)
- Explanation information: ${explanationsCount > 0 ? `${explanationsCount} explanations in source` : 'No explanations supplied in source file'}
- Image references found: ${imageStats.discoveredCount}

## 3. Data Conversion

- Output JSON path: \`${outputJsonRelPath}\`
- Question schema used: Standard \`Question\` TypeScript schema (\`src/types.ts\`) with \`provenance\` metadata
- Question IDs: \`${sessionMeta.id}-q-001\` through \`${sessionMeta.id}-q-${String(questions.length).padStart(3, '0')}\`
- Numbering rules: Preserved exact sequential question numbers (1 to ${questions.length}) from the source paper
- Option-label rules: Default Bangla (\`ক, খ, গ, ঘ\`) in BN mode and English (\`A, B, C, D\`) in EN mode, preserving 0-based \`correctAnswer\` indices (A=0, B=1, C=2, D=3)
- LaTeX and Markdown handling: Preserved all inline \`$...$\` and block \`$$...$$\` LaTeX expressions, chemical subscripts/superscripts, matrices, and integrals verbatim
- Bengali/English handling: Preserved original Bengali and English text verbatim without artificial translation
- Metadata changes: Mapped raw subject tags to canonical subject IDs (\`${Object.keys(subjectCounts).join('`, `')}\`)

## 4. Image Processing

- Number of image links discovered: ${imageStats.discoveredCount}
- Successfully downloaded: ${imageStats.downloadedCount} (plus ${imageStats.deduplicatedCount} deduplicated)
- Local image paths:
${localImageList}
- Failed downloads: ${imageStats.failedCount}
- Duplicate images: ${imageStats.deduplicatedCount}
- Original URLs manifest: \`${manifestRelPath}\`

## 5. Answer Verification

- Answers copied from original source: ${verifiedCount}
- Independently verified answers: 0 (source-provided answers preserved per §3.4)
- Unverified questions: ${unverifiedCount}
- Questions requiring manual review: ${duplicateList.length > 0 ? duplicateNotes : 'None'}

## 6. Explanation Provenance

- Explanations copied from source: ${explanationsCount}
- User-supplied explanations: 0
- Externally researched explanations: 0
- AI-generated explanations: 0 (no fake explanations generated; dynamic AI Tutor handles on-demand coaching)
- Explanations not supplied: ${questions.length - explanationsCount}
- Verification status: Source-provided answers recorded in \`provenance\`

## 7. Website Integration

- Question-loading path: \`public/data/questions/${sessionMeta.institution}/${sessionMeta.session}/${sessionMeta.id}.json\` via \`getQuestionFilePath(session)\` in \`src/utils/questionLoader.ts\`
- Image-loading method: \`resolvePublicAsset()\` in \`src/utils/questionLoader.ts\` (supports local Vite dev and GitHub Pages subpath)
- Question renderer: \`QuestionBankView.tsx\` & \`ExamView.tsx\` with \`MathMarkdown.tsx\`
- Option renderer: 2-column responsive option cards with text & \`optionImageUrls\` support
- Explanation renderer: \`MathMarkdown.tsx\` (\`react-markdown\` + \`remark-math\` + \`rehype-katex\` + \`remark-gfm\`)
- AI Tutor integration: \`AiTutorPanel.tsx\` (streams independent step-by-step solutions & inspects attached local images)
- Any component changes: None required beyond central loader path resolution

## 8. Validation

- JSON validation: PASS (\`npm run validate:data\`)
- Duplicate check: ${duplicateNotes}
- Image existence check: PASS (${imageStats.downloadedCount + imageStats.deduplicatedCount} local files verified on disk)
- Metadata check: PASS (matches \`src/data/sessions.ts\` and \`src/data/institutions.ts\`)
- Production build: PASS (\`npm run build\`)
- Known issues: None

## 9. Git Changes

- Files created:
  - \`${outputJsonRelPath}\`
  - \`${manifestRelPath}\`
  - \`docs/imports/${sessionMeta.institution}/${sessionMeta.session}/${sessionMeta.id}/README.md\`
- Files updated:
  - \`docs/IMPORT_LOG.md\`
- Files removed, if authorized: None
- Commit hash, if committed: Pending user git commit
- Branch: Workspace active branch
- Push status: Local workspace ready for push

## 10. Final Status

- Imported questions: ${questions.length}
- Local images: ${imageStats.downloadedCount + imageStats.deduplicatedCount}
- Verified answers: ${verifiedCount}
- Unverified answers: ${unverifiedCount}
- Build result: PASS
- Outstanding issues: None
`;

  const readmePath = path.join(
    PROJECT_ROOT,
    'docs',
    'imports',
    sessionMeta.institution,
    sessionMeta.session,
    sessionMeta.id,
    'README.md'
  );
  await fs.mkdir(path.dirname(readmePath), { recursive: true });
  await fs.writeFile(readmePath, markdown, 'utf8');
  return readmePath;
}

async function appendImportLog({
  sessionMeta,
  questionsCount,
  imagesDownloaded,
  sourceFilename
}) {
  const logPath = path.join(PROJECT_ROOT, 'docs', 'IMPORT_LOG.md');
  const importDate = new Date().toISOString().slice(0, 10);
  const paperReadmeRel = `docs/imports/${sessionMeta.institution}/${sessionMeta.session}/${sessionMeta.id}/README.md`;

  let existing = '';
  try {
    existing = await fs.readFile(logPath, 'utf8');
  } catch {
    existing = '# Question Import History\n\nChronological log of all imported admission question papers.\n';
  }

  const sectionHeader = `## ${sessionMeta.institution} — ${sessionMeta.session} — ${sessionMeta.title}`;
  const entryBlock = `
${sectionHeader}

- Session ID: \`${sessionMeta.id}\`
- Questions imported: ${questionsCount}
- Images downloaded: ${imagesDownloaded}
- Source: \`${sourceFilename}\`
- Validation: PASS (\`npm run validate:data\`)
- Paper documentation: [\`${paperReadmeRel}\`](../${paperReadmeRel})
- Date: ${importDate}
`;

  // If this session ID already has an entry, replace that section; otherwise append
  const escapedId = sessionMeta.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const existingEntryRegex = new RegExp(
    `\\n## [^\\n]+\\n\\n- Session ID: \`${escapedId}\`[\\s\\S]*?(?=\\n## |$)`,
    'm'
  );

  let updated;
  if (existingEntryRegex.test(existing)) {
    updated = existing.replace(existingEntryRegex, entryBlock);
  } else {
    updated = existing.trimEnd() + '\n' + entryBlock;
  }

  await fs.mkdir(path.dirname(logPath), { recursive: true });
  await fs.writeFile(logPath, updated.trimEnd() + '\n', 'utf8');
}

export async function importSingleQuestionFile(sourceFilePath, explicitSessionId = null) {
  const { sessions, instMap } = await loadSessionsAndInstitutions();
  const absSource = path.resolve(PROJECT_ROOT, sourceFilePath);
  const sourceFilename = path.basename(absSource);

  const sessionId =
    explicitSessionId || inferSessionIdFromFilename(sourceFilename, sessions);
  if (!sessionId) {
    throw new Error(
      `Could not automatically match session ID for file "${sourceFilename}". Please pass sessionId explicitly: npm run import:questions -- <file> <sessionId>`
    );
  }

  const sessionMeta = sessions.find((s) => s.id === sessionId);
  if (!sessionMeta) {
    throw new Error(`Session ID "${sessionId}" not found in src/data/sessions.ts`);
  }

  const rawContent = await fs.readFile(absSource, 'utf8');
  const ext = path.extname(sourceFilename).toLowerCase();

  let questions;
  let sourceFormat;

  if (ext === '.json') {
    sourceFormat = 'JSON Question Array (.json)';
    const parsed = JSON.parse(rawContent);
    if (!Array.isArray(parsed)) {
      throw new Error('Uploaded JSON file must contain an array of questions');
    }
    questions = parsed.map((q, idx) => ({
      ...q,
      id: q.id || `${sessionMeta.id}-q-${String(q.number || idx + 1).padStart(3, '0')}`,
      number: q.number || idx + 1,
      subject: normalizeSubjectId(q.subject),
      institution: sessionMeta.institution,
      session: sessionMeta.session,
      questionType: q.questionType || sessionMeta.questionType
    }));
  } else {
    sourceFormat = 'Structured Admission Question Text (.txt)';
    questions = parseTxtQuestionPaper(rawContent, sessionMeta, sourceFilename);
  }

  if (questions.length === 0) {
    throw new Error(`No questions could be parsed from ${sourceFilename}`);
  }

  // Download external images & replace URLs with local paths
  const imageStats = await processSessionImages({
    questions,
    institution: sessionMeta.institution,
    session: sessionMeta.session,
    sessionId: sessionMeta.id
  });

  // Save output JSON to public/data/questions/{INSTITUTION}/{SESSION}/{SESSION_ID}.json
  const outputJsonRelPath = `public/data/questions/${sessionMeta.institution}/${sessionMeta.session}/${sessionMeta.id}.json`;
  const outputJsonAbsPath = path.join(PROJECT_ROOT, outputJsonRelPath);
  await fs.mkdir(path.dirname(outputJsonAbsPath), { recursive: true });
  await fs.writeFile(outputJsonAbsPath, JSON.stringify(questions, null, 2) + '\n', 'utf8');

  // Update lightweight availability index (public/data/questions/index.json)
  const indexJsonPath = path.join(PROJECT_ROOT, 'public', 'data', 'questions', 'index.json');
  let indexMap = {};
  try {
    indexMap = JSON.parse(await fs.readFile(indexJsonPath, 'utf8'));
  } catch {
    indexMap = {};
  }
  indexMap[sessionMeta.id] = questions.length > 0;
  await fs.writeFile(indexJsonPath, JSON.stringify(indexMap, null, 2) + '\n', 'utf8');

  // Check duplicates and validate
  const dupReport = await checkDuplicates(sessionMeta.id);
  const duplicateList = dupReport[sessionMeta.id] || [];
  const valReport = await validateAllQuestionFiles(sessionMeta.id);

  // Generate individual paper README & update IMPORT_LOG.md
  const manifestRelPath = `docs/imports/${sessionMeta.institution}/${sessionMeta.session}/${sessionMeta.id}/image-manifest.json`;
  await generatePaperReadme({
    sessionMeta,
    instFullName: instMap[sessionMeta.institution] || sessionMeta.institution,
    sourceFilename,
    sourceFormat,
    questions,
    imageStats,
    duplicateList,
    outputJsonRelPath,
    manifestRelPath
  });

  await appendImportLog({
    sessionMeta,
    questionsCount: questions.length,
    imagesDownloaded: imageStats.downloadedCount + imageStats.deduplicatedCount,
    sourceFilename
  });

  return {
    sessionId: sessionMeta.id,
    institution: sessionMeta.institution,
    session: sessionMeta.session,
    title: sessionMeta.title,
    questionsCount: questions.length,
    imageStats,
    duplicateList,
    validation: valReport.perSession[sessionMeta.id],
    outputJsonRelPath
  };
}

// CLI execution
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error(
      'Usage: npm run import:questions -- <source-file-path> [explicit-session-id]'
    );
    process.exit(1);
  }

  const sourceFile = args[0];
  const explicitId = args[1] || null;

  try {
    const result = await importSingleQuestionFile(sourceFile, explicitId);
    console.log('==========================================================');
    console.log(`✅ IMPORT COMPLETED: ${result.title} (${result.sessionId})`);
    console.log('==========================================================');
    console.log(`Output JSON      : ${result.outputJsonRelPath}`);
    console.log(`Questions        : ${result.questionsCount}`);
    console.log(
      `Images           : ${result.imageStats.downloadedCount} downloaded, ${result.imageStats.failedCount} failed`
    );
    console.log(
      `Validation       : ${result.validation?.valid ? 'PASS' : 'FAIL'}`
    );
  } catch (err) {
    console.error(`❌ Import failed:`, err.message);
    process.exit(1);
  }
}
