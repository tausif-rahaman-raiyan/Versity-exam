#!/usr/bin/env node
/**
 * scripts/batch-import-ju.mjs
 *
 * High-performance batch importer for all 80 Jahangirnagar University (JU)
 * question papers in public/assets/aistudio/JU_*.txt.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const MIME_TO_EXT = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg'
};

const SUBJECT_ALIASES = [
  { id: 'Physics', patterns: ['physics', 'পদার্থবিজ্ঞান', 'পদার্থ', 'ফিজিক্স', 'phy'] },
  { id: 'Chemistry', patterns: ['chemistry', 'রসায়ন', 'রসায়ন', 'কেমিস্ট্রি', 'chem'] },
  {
    id: 'Mathematics',
    patterns: ['mathematics', 'higher math', 'math', 'উচ্চতর গণিত', 'গণিত', 'গনিত', 'গাণিতিক যুক্তি']
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
    patterns: ['general knowledge', 'gk', 'iq', 'সাধারণ জ্ঞান', 'মানসিক দক্ষতা', 'ভূগোল ও দুর্যোগ ব্যবস্থাপনা']
  }
];

function normalizeSubjectId(rawTag) {
  const cleaned = String(rawTag || '')
    .replace(/\(\s*\d+\s*\)/g, '')
    .trim()
    .toLowerCase();

  for (const entry of SUBJECT_ALIASES) {
    if (entry.patterns.some((p) => cleaned.includes(p))) {
      return entry.id;
    }
  }
  return null;
}

function inferSubject(stem, options, unit = 'A') {
  const text = `${stem} ${(options || []).join(' ')}`.toLowerCase();

  // 1. English instructions & vocabulary
  if (
    /\b(choose the|fill in the|synonym|antonym|underlined|preposition|passive form|clause|gerund|participle|spelling|verb|adverb|adjective|noun|pronoun|idiom|phrase|sentence|passage|vocabulary)\b/i.test(
      text
    ) ||
    /^[a-zA-Z0-9\s.,'?!:;()\-_/"]+$/.test(stem.trim()) && !text.includes('omega') && !text.includes('sin') && !text.includes('cos')
  ) {
    return 'English';
  }

  // 2. Bangla grammar & literature
  if (
    /(সমাস|সন্ধি|কারক|উপসর্গ|প্রত্যয়|প্রত্যয়|সমার্থক শব্দ|বিপরীত শব্দ|বানানটি সঠিক|শুদ্ধ বানান|বাগধারা|কোনটি সঠিক নয়|কোনটি অশুদ্ধ|লেখক|কবি|কবিতা|উপন্যাস|নাটক|চরিত্র|বাক্য|শব্দ|উক্তি|ধ্বনি|বর্ণ|যতিচিহ্ন|প্রবন্ধ|অনুবাদ|দ্বিগু|কর্মধারয়|তৎপুরুষ|বহুব্রীহি|দ্বন্দ্ব|অব্যয়ীভাব)/i.test(
      text
    )
  ) {
    return 'Bangla';
  }

  // 3. ICT
  if (
    /\b(html|http|ip\b|ipv6|ipv4|tcp|udp|lan|wan|man|wi-?fi|bluetooth|binary|octal|hexadecimal|ascii|unicode|bcd|logic gate|nand|nor|xor|xnor|flip-flop|register|compiler|interpreter|assembler|sql|database|dbms|algorithm|flowchart|c programming|python|ক্লাউড|বাইনারি|অক্টাল|হেক্সাডেসিমেল|লজিক গেট|টপোলজি|প্রটোকল|আইপি|ব্রাউজার|মডেম|রাউটার|হাব|সুইচ|অপটিক্যাল ফাইবার|ব্যান্ডউইথ|ন্যানোটেকনোলজি|বায়োইনফরমেটিক্স|রোবটিক্স|ভার্চুয়াল রিয়েলিটি|ক্রায়োসার্জারি|বায়োমেট্রিক্স|কম্পাইলার|ইন্টারপ্রেটার|ডেটাবেজ|অ্যালগরিদম|বিট)\b/i.test(
      text
    )
  ) {
    return 'ICT';
  }

  // 4. Biology
  if (
    /(কোষ|মাইটোসিস|মিয়োসিস|মায়োসিস|ডিএনএ|আরএনএ|dna|rna|জিন|ক্রোমোজোম|এনজাইম|সালোকসংশ্লেষণ|শ্বসন|ভাইরাস|ব্যাকটেরিয়া|ব্যাকটেরিয়া|ছত্রাক|শৈবাল|মস|ফার্ন|নগ্নবীজী|আবৃতবীজী|টিস্যু|রক্ত|হৃদপিণ্ড|হৃৎপিণ্ড|নেফ্রন|বৃক্ক|যকৃত|পাকস্থলী|হরমোন|স্নায়ু|স্নায়ু|কঙ্কাল|পেশী|শ্রেণিবিন্যাস|পর্ব|প্রজাতি|ইকোলজি|বাস্তুতন্ত্র|হাইড্রা|hydra|ঘাসফড়িং|রুই মাছ|জবা|মালভেসি|পোয়াসি|অস্টিওব্লাস্ট|অ্যালভিওলাই|ফুসফুস|রেনাল|সাইটোপ্লাজম|মাইটোকন্ড্রিয়া|প্লাস্টিড|গলজি|রাইবোসোম|অভিশ্রবণ|প্রস্বেদন|প্যারেনকাইমা|হৃৎপিন্ড|পেসমেকার)/i.test(
      text
    )
  ) {
    return 'Biology';
  }

  // 5. Chemistry
  if (
    /(মোল|মোলারিটি|নরমালিটি|pH|পিএইচ|বাফার|অম্ল|ক্ষার|লবণ|জারণ|বিজারণ|তড়িৎ বিশ্লেষণ|তড়িৎ বিশ্লেষণ|ফ্যারাডে|অ্যালকেন|অ্যালকিন|অ্যালকাইন|বেনজিন|অ্যালকোহল|অ্যালডিহাইড|কিটোন|কার্বক্সিলিক|এস্টার|অ্যামিন|পলিমার|আইসোমার|সমাণুতা|সংকরায়ন|সংকরায়ন|sp2|sp3|পর্যায় সারণি|পর্যায় সারণি|আইসোটোপ|কোয়ান্টাম|কোয়ান্টাম|দ্রাব্যতা|সাম্যাবস্থা|লা শাতেলিয়ার|বিক্রিয়া|বিক্রিয়া|তাপরসায়ন|এনথালপি|মৌল|যৌগ|আকরিক|ব্যাপন|গ্রাহাম|bod|cod|ppm|ইলেকট্রন বিন্যাস|আয়ন|আয়ন|জারণ সংখ্যা|হাইড্রোজেন|অক্সিজেন|নাইট্রোজেন|ক্ষারক)/i.test(
      text
    )
  ) {
    return 'Chemistry';
  }

  // 6. Mathematics
  if (
    /(ম্যাট্রিক্স|নির্ণায়ক|নির্ণায়ক|সরলরেখা|বৃত্ত|কণিক|পরাবৃত্ত|উপবৃত্ত|অধিবৃত্ত|ত্রিকোণমিতি|দ্বিপদী|বিন্যাস|সমাবেশ|বহুপদী|জটিল সংখ্যা|সম্ভাবনা|ফাংশন|সীমা|অন্তরীকরণ|যোগজীকরণ|সমাকলন|ব্যবকলন|ঢাল|স্পর্শক|dy\/dx|\\int|\\lim|\\sin|\\cos|\\tan|\\sec|\\csc|\\cot|\\log|\\ln|মূলদ্বয়|সমীকরণ|দ্বিঘাত|গুণোত্তর|সমান্তর ধারা)/i.test(
      text
    )
  ) {
    return 'Mathematics';
  }

  // 7. Physics
  if (
    /(ভেক্টর|বেগ|ত্বরণ|বল|নিউটন|কাজ|শক্তি|ক্ষমতা|ভরবেগ|জড়তার ভ্রামক|টর্ক|কৌণিক|মহাকর্ষ|অভিকর্ষ|মুক্তিবেগ|পৃষ্ঠটান|সান্দ্রতা|ইয়ং|ইয়ং|স্থিতিস্থাপকতা|সরল ছন্দিত|দোলক|তরঙ্গ|কম্পাঙ্ক|শব্দ|ডপলার|তাপমাত্রা|তাপগতিবিদ্যা|এনট্রপি|কার্নো|স্থির তড়িৎ|ধারক|কুলম্ব|বিভব|প্রবাহ|ওহম|রোধ|কির্শফ|চৌম্বক|আবেশ|লেনজ|আলোক|প্রতিসরণ|লেন্স|ব্যতিচার|অপবর্তন|সমাবর্তন|ফোটন|আলোক তড়িৎ|তেজস্ক্রিয়তা|অর্ধায়ু|সেমিকন্ডাক্টর|ডায়োড|ট্রানজিস্টর|প্রাসের गति|হুইটস্টোন|গ্যালভানোমিটার)/i.test(
      text
    )
  ) {
    return 'Physics';
  }

  // 8. General Knowledge / Mental Ability
  if (
    /(রাজধানী|মুদ্রা|নোবেল|মুক্তিযুদ্ধ|সংবিধান|বঙ্গবন্ধু|সার্ক|জাতিসংঘ|মানসিক দক্ষতা|ঘড়ির কাঁটা|সিরিজ|পরবর্তী সংখ্যা)/i.test(
      text
    )
  ) {
    return 'General Knowledge';
  }

  // Default fallback based on Unit
  if (unit === 'D') return 'Biology';
  return 'Physics';
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

function shortHash(input) {
  return crypto.createHash('sha1').update(String(input)).digest('hex').slice(0, 6);
}

function guessExt(urlStr, contentType = '') {
  const mime = contentType.split(';')[0].trim().toLowerCase();
  if (MIME_TO_EXT[mime]) return MIME_TO_EXT[mime];
  try {
    const pathname = new URL(urlStr).pathname.toLowerCase();
    const match = pathname.match(/\.(png|jpe?g|webp|gif|svg)$/);
    if (match) return match[1] === 'jpeg' ? 'jpg' : match[1];
  } catch {}
  return 'png';
}

const downloadedImageMap = new Map();

async function downloadImageLocally(url, destFolder, filePrefix) {
  if (downloadedImageMap.has(url)) {
    return downloadedImageMap.get(url);
  }

  await fs.mkdir(destFolder, { recursive: true });

  const hash = shortHash(url);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'VarsityQuestionBankImporter/1.0' }
    });
    clearTimeout(timer);

    if (!res.ok) {
      console.warn(`[WARN] Failed to fetch image ${url}: HTTP ${res.status}`);
      return url;
    }

    const contentType = res.headers.get('content-type') || '';
    const ext = guessExt(url, contentType);
    const filename = `${filePrefix}-${hash}.${ext}`;
    const fullPath = path.join(destFolder, filename);

    const buf = Buffer.from(await res.arrayBuffer());
    await fs.writeFile(fullPath, buf);

    // Compute relative path from public/
    const relFromPublic = path.relative(path.join(PROJECT_ROOT, 'public'), fullPath).replace(/\\/g, '/');
    downloadedImageMap.set(url, relFromPublic);
    return relFromPublic;
  } catch (err) {
    clearTimeout(timer);
    console.warn(`[WARN] Error downloading ${url}:`, err.message);
    return url;
  }
}

async function loadSessions() {
  const sessionsFile = path.join(PROJECT_ROOT, 'src', 'data', 'sessions.ts');
  const content = await fs.readFile(sessionsFile, 'utf8');
  const match = content.match(/export const sessions:\s*Session\[\]\s*=\s*(\[[\s\S]*\]);/);
  if (!match) throw new Error('Failed to parse sessions.ts');
  return JSON.parse(match[1]);
}

export function inferJuSessionId(filename, juSessions) {
  const base = path.basename(filename, path.extname(filename)).replace(/_[0-9a-f]{8}$/i, '');
  const slug = base.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  const exact = juSessions.find((s) => s.id === slug);
  if (exact) return exact;

  const partial = juSessions.find(
    (s) => s.id.replace(/[^a-z0-9]/g, '') === slug.replace(/[^a-z0-9]/g, '')
  );
  if (partial) return partial;

  return null;
}

async function main() {
  console.log('🚀 Starting JU Batch Importer for all 80 papers...');

  const allSessions = await loadSessions();
  const juSessions = allSessions.filter((s) => s.institution === 'JU');
  console.log(`📋 Found ${juSessions.length} JU sessions registered in sessions.ts.`);

  const rawDir = path.join(PROJECT_ROOT, 'public', 'assets', 'aistudio');
  const files = (await fs.readdir(rawDir)).filter((f) => f.startsWith('JU_') && f.endsWith('.txt'));
  console.log(`📂 Found ${files.length} raw JU files in ${rawDir}.`);

  const headerRegex = /^\[([^\]]+)\]\s*(\d+)\.\s*(?:\d+\.\s*)?(.*)$/;

  let totalQuestionsImported = 0;
  let totalPapersProcessed = 0;
  let totalImagesSaved = 0;

  const indexUpdates = {};

  for (const file of files) {
    const rawPath = path.join(rawDir, file);
    const sessionMeta = inferJuSessionId(file, juSessions);

    if (!sessionMeta) {
      console.error(`❌ Could not match session for file: ${file}`);
      continue;
    }

    const rawText = await fs.readFile(rawPath, 'utf8');
    const cleanedText = rawText.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
    const lines = cleanedText.split('\n');

    const blocks = [];
    let currentBlock = [];

    for (const line of lines) {
      if (headerRegex.test(line.trim())) {
        if (currentBlock.length > 0) blocks.push(currentBlock.join('\n').trim());
        currentBlock = [line];
      } else if (currentBlock.length > 0) {
        currentBlock.push(line);
      }
    }
    if (currentBlock.length > 0) blocks.push(currentBlock.join('\n').trim());

    const questions = [];
    const imageDestDir = path.join(
      PROJECT_ROOT,
      'public',
      'assets',
      'questions',
      'JU',
      sessionMeta.session,
      sessionMeta.id
    );

    for (let idx = 0; idx < blocks.length; idx++) {
      const block = blocks[idx];
      const blockLines = block.split('\n').map((l) => l.trim()).filter(Boolean);
      if (blockLines.length === 0) continue;

      const firstLine = blockLines[0];
      const match = firstLine.match(headerRegex);
      if (!match) continue;

      const rawSubjectTag = match[1].trim();
      const globalNum = parseInt(match[2], 10) || idx + 1;
      const stemLines = [match[3].trim()];

      let optionsLine = '';
      let answerLine = '';
      const explanationLines = [];
      const rawQuestionImageUrls = [];
      let inExplanation = false;

      for (let j = 1; j < blockLines.length; j++) {
        const l = blockLines[j];

        if (/^QUESTION\s+IMAGE\s*:/i.test(l)) {
          const urlMatch = l.match(/https?:\/\/\S+/i);
          if (urlMatch) rawQuestionImageUrls.push(urlMatch[0].trim());
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

      const options = [];
      if (optionsLine) {
        const parts = optionsLine.split(/\s*\|\s*(?=[A-Fক-ঙ]\s*:)/);
        for (const part of parts) {
          const optText = part.replace(/^[A-Fক-ঙ]\s*:\s*/, '').trim();
          options.push(optText);
        }
      }

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

      // Subject normalization
      let subject = normalizeSubjectId(rawSubjectTag);
      if (!subject) {
        subject = inferSubject(stemJoined, options, sessionMeta.unit || 'A');
      }

      // Download external question images
      const localQuestionImageUrls = [];
      for (const imgUrl of rawQuestionImageUrls) {
        const localPath = await downloadImageLocally(
          imgUrl,
          imageDestDir,
          `q-${String(globalNum).padStart(3, '0')}-question`
        );
        localQuestionImageUrls.push(localPath);
        totalImagesSaved++;
      }

      // Detect and download any images embedded in options or stem
      const qObj = {
        id: `${sessionMeta.id}-q-${String(globalNum).padStart(3, '0')}`,
        number: globalNum,
        subject,
        question: stemJoined,
        options,
        correctAnswer,
        answerVerified,
        ...(explanationLines.length > 0 ? { explanation: explanationLines.join('\n').trim() } : {}),
        questionType: 'MCQ',
        institution: 'JU',
        session: sessionMeta.session,
        ...(localQuestionImageUrls.length > 0 ? { questionImageUrls: localQuestionImageUrls } : {}),
        provenance: {
          sourceFile: `public/assets/aistudio/${file}`,
          sourceLocation: `Question #${globalNum} ([${rawSubjectTag}])`,
          answerSource: answerVerified
            ? 'Copied directly from uploaded source file (CORRECT ANSWER line)'
            : 'Unverified / not present in source',
          explanationSource:
            explanationLines.length > 0 ? 'Copied from uploaded source file' : 'Not supplied in source',
          verificationStatus: answerVerified ? 'source-provided' : 'unverified'
        }
      };

      questions.push(qObj);
    }

    // Save JSON output
    const outDir = path.join(PROJECT_ROOT, 'public', 'data', 'questions', 'JU', sessionMeta.session);
    await fs.mkdir(outDir, { recursive: true });
    const outPath = path.join(outDir, `${sessionMeta.id}.json`);
    await fs.writeFile(outPath, JSON.stringify(questions, null, 2), 'utf8');

    totalQuestionsImported += questions.length;
    totalPapersProcessed++;
    indexUpdates[sessionMeta.id] = questions.length;
    console.log(`✅ [${totalPapersProcessed}/80] Imported ${sessionMeta.id}: ${questions.length} questions`);
  }

  // Update public/data/questions/index.json so all sessions are immediately startable
  const indexFilePath = path.join(PROJECT_ROOT, 'public', 'data', 'questions', 'index.json');
  try {
    const existingIndex = JSON.parse(await fs.readFile(indexFilePath, 'utf8'));
    const mergedIndex = { ...existingIndex, ...indexUpdates };
    await fs.writeFile(indexFilePath, JSON.stringify(mergedIndex, null, 2), 'utf8');
    console.log('📌 Updated public/data/questions/index.json with JU counts.');
  } catch (err) {
    console.warn('Could not update index.json:', err.message);
  }

  console.log(`\n🎉 JU Import Complete!`);
  console.log(`📊 Total Papers Processed: ${totalPapersProcessed}`);
  console.log(`❓ Total Questions Imported: ${totalQuestionsImported}`);
  console.log(`🖼️  Total Images Saved: ${totalImagesSaved}`);
}

main().catch((err) => {
  console.error('Fatal batch import error:', err);
  process.exit(1);
});
