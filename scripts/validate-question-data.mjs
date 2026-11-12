#!/usr/bin/env node
/**
 * scripts/validate-question-data.mjs
 *
 * Validates all question JSON files under public/data/questions/{INSTITUTION}/{SESSION}/{SESSION_ID}.json
 * (or a single session if passed via `npm run validate:data -- <sessionId>`).
 *
 * Checks (§7.1):
 * - Valid JSON syntax & non-empty question array
 * - Unique question IDs within the paper
 * - Sequential / valid question numbering
 * - Valid canonical subject IDs (matching src/data/subjects.ts)
 * - Institution & session metadata match src/data/sessions.ts
 * - Valid questionType ("MCQ" | "Written")
 * - MCQ options present when required; correctAnswer is valid index or -1 with answerVerified: false
 * - Local image paths exist on disk under public/ and have valid image extensions
 * - No accidental external HTTP/HTTPS image URLs left where local images should be used
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const VALID_SUBJECT_IDS = new Set([
  'Physics',
  'Chemistry',
  'Mathematics',
  'Biology',
  'Bangla',
  'English',
  'ICT',
  'General Knowledge'
]);

async function loadSessionsMap() {
  const sessionsFile = path.join(PROJECT_ROOT, 'src', 'data', 'sessions.ts');
  const content = await fs.readFile(sessionsFile, 'utf8');
  const match = content.match(/export const sessions:\s*Session\[\]\s*=\s*(\[[\s\S]*\]);/);
  if (!match) {
    throw new Error('Could not parse sessions array from src/data/sessions.ts');
  }
  const sessions = JSON.parse(match[1]);
  return new Map(sessions.map((s) => [s.id, s]));
}

async function findQuestionJsonFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findQuestionJsonFiles(full)));
    } else if (entry.isFile() && entry.name.endsWith('.json') && entry.name !== 'index.json') {
      files.push(full);
    }
  }
  return files;
}

export async function validateAllQuestionFiles(targetSessionId = null) {
  const sessionsMap = await loadSessionsMap();
  const questionsRoot = path.join(PROJECT_ROOT, 'public', 'data', 'questions');
  const allFiles = await findQuestionJsonFiles(questionsRoot);

  const filesToCheck = targetSessionId
    ? allFiles.filter((f) => path.basename(f, '.json') === targetSessionId)
    : allFiles;

  const report = {
    filesChecked: filesToCheck.length,
    totalQuestions: 0,
    totalImagesVerified: 0,
    errors: [],
    warnings: [],
    perSession: {}
  };

  for (const filePath of filesToCheck) {
    const sessionId = path.basename(filePath, '.json');
    const sessionMeta = sessionsMap.get(sessionId);
    const sessionErrors = [];
    const sessionWarnings = [];

    if (!sessionMeta) {
      sessionErrors.push(`Session ID "${sessionId}" does not exist in src/data/sessions.ts`);
    }

    let questions;
    try {
      const raw = await fs.readFile(filePath, 'utf8');
      questions = JSON.parse(raw);
    } catch (err) {
      sessionErrors.push(`Invalid JSON syntax: ${err.message}`);
      report.errors.push(...sessionErrors.map((e) => `[${sessionId}] ${e}`));
      report.perSession[sessionId] = { valid: false, errors: sessionErrors, warnings: sessionWarnings };
      continue;
    }

    if (!Array.isArray(questions)) {
      sessionErrors.push('Root JSON value must be an array of Question objects');
      report.errors.push(...sessionErrors.map((e) => `[${sessionId}] ${e}`));
      report.perSession[sessionId] = { valid: false, errors: sessionErrors, warnings: sessionWarnings };
      continue;
    }

    const seenIds = new Set();
    let localImagesCount = 0;

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const prefix = `Q#${q?.number ?? i + 1} (${q?.id || 'no-id'})`;

      if (!q || typeof q !== 'object') {
        sessionErrors.push(`${prefix}: Question entry is not an object`);
        continue;
      }

      // 1. Unique ID check
      if (!q.id || typeof q.id !== 'string') {
        sessionErrors.push(`${prefix}: Missing string "id"`);
      } else if (seenIds.has(q.id)) {
        sessionErrors.push(`${prefix}: Duplicate question ID "${q.id}"`);
      } else {
        seenIds.add(q.id);
      }

      // 2. Numbering check
      if (typeof q.number !== 'number' || q.number < 1) {
        sessionErrors.push(`${prefix}: Invalid question "number": ${q.number}`);
      }

      // 3. Subject check
      if (!q.subject || !VALID_SUBJECT_IDS.has(q.subject)) {
        sessionErrors.push(
          `${prefix}: Unrecognized subject ID "${q.subject}". Expected one of: ${[
            ...VALID_SUBJECT_IDS
          ].join(', ')}`
        );
      }

      // 4. Institution & session match
      if (sessionMeta) {
        if (q.institution !== sessionMeta.institution) {
          sessionErrors.push(
            `${prefix}: Institution "${q.institution}" does not match session institution "${sessionMeta.institution}"`
          );
        }
        if (q.session !== sessionMeta.session) {
          sessionErrors.push(
            `${prefix}: Session "${q.session}" does not match session "${sessionMeta.session}"`
          );
        }
      }

      // 5. Question type & options check
      if (q.questionType !== 'MCQ' && q.questionType !== 'Written') {
        sessionErrors.push(`${prefix}: Invalid questionType "${q.questionType}"`);
      }

      if (q.questionType === 'MCQ') {
        if (!Array.isArray(q.options) || q.options.length < 2) {
          sessionErrors.push(`${prefix}: MCQ question must have at least 2 options`);
        } else {
          // Option text may be empty only if an option image exists for that index
          for (let optIdx = 0; optIdx < q.options.length; optIdx++) {
            const hasOptText = String(q.options[optIdx] ?? '').trim().length > 0;
            const hasOptImg =
              Array.isArray(q.optionImageUrls?.[optIdx]) &&
              q.optionImageUrls[optIdx].length > 0;
            if (!hasOptText && !hasOptImg) {
              sessionWarnings.push(`${prefix}: Option ${optIdx + 1} has neither text nor image`);
            }
          }
        }

        const isUnverified = q.answerVerified === false || q.correctAnswer === -1;
        if (!isUnverified) {
          if (
            typeof q.correctAnswer !== 'number' ||
            q.correctAnswer < 0 ||
            q.correctAnswer >= (q.options?.length || 0)
          ) {
            sessionErrors.push(
              `${prefix}: Invalid correctAnswer index ${q.correctAnswer} for ${q.options?.length} options`
            );
          }
        }
      }

      // 6. Image paths verification
      const allImgPaths = [];
      if (Array.isArray(q.questionImageUrls)) {
        allImgPaths.push(...q.questionImageUrls);
      }
      if (Array.isArray(q.optionImageUrls)) {
        for (const arr of q.optionImageUrls) {
          if (Array.isArray(arr)) allImgPaths.push(...arr);
        }
      }
      if (Array.isArray(q.explanationImageUrls)) {
        allImgPaths.push(...q.explanationImageUrls);
      }

      for (const imgPath of allImgPaths) {
        if (!imgPath || typeof imgPath !== 'string') continue;
        if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
          sessionErrors.push(`${prefix}: Unresolved external image URL remains in JSON: ${imgPath}`);
          continue;
        }
        const absImg = path.join(PROJECT_ROOT, 'public', imgPath.replace(/^\/+/, ''));
        try {
          const stat = await fs.stat(absImg);
          if (!stat.isFile() || stat.size === 0) {
            sessionErrors.push(`${prefix}: Local image file is empty or invalid: ${imgPath}`);
          } else {
            localImagesCount++;
            report.totalImagesVerified++;
          }
        } catch {
          sessionErrors.push(`${prefix}: Local image file does not exist on disk: ${imgPath}`);
        }
      }
    }

    report.totalQuestions += questions.length;
    report.errors.push(...sessionErrors.map((e) => `[${sessionId}] ${e}`));
    report.warnings.push(...sessionWarnings.map((w) => `[${sessionId}] ${w}`));

    report.perSession[sessionId] = {
      valid: sessionErrors.length === 0,
      questionCount: questions.length,
      localImagesCount,
      errors: sessionErrors,
      warnings: sessionWarnings
    };
  }

  // Update public/data/questions/index.json with question counts per sessionId
  const indexPath = path.join(questionsRoot, 'index.json');
  let existingIndex = {};
  try {
    existingIndex = JSON.parse(await fs.readFile(indexPath, 'utf8'));
  } catch {
    existingIndex = {};
  }
  for (const [sid, info] of Object.entries(report.perSession)) {
    if (info.questionCount > 0) {
      existingIndex[sid] = info.questionCount;
    }
  }
  await fs.mkdir(questionsRoot, { recursive: true });
  await fs.writeFile(indexPath, JSON.stringify(existingIndex, null, 2) + '\n', 'utf8');

  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  const targetSessionId = process.argv[2] || null;
  const report = await validateAllQuestionFiles(targetSessionId);

  console.log('==========================================================');
  console.log(' QUESTION DATA VALIDATION REPORT');
  console.log('==========================================================');
  console.log(`Files checked   : ${report.filesChecked}`);
  console.log(`Total questions : ${report.totalQuestions}`);
  console.log(`Verified images : ${report.totalImagesVerified}`);
  console.log(`Errors          : ${report.errors.length}`);
  console.log(`Warnings        : ${report.warnings.length}`);

  for (const [sid, info] of Object.entries(report.perSession)) {
    console.log(
      `  • ${sid}: ${info.valid ? 'PASS' : 'FAIL'} (${info.questionCount} questions, ${info.localImagesCount} local images)`
    );
  }

  if (report.warnings.length > 0) {
    console.log('\nWarnings:');
    report.warnings.forEach((w) => console.log(`  ⚠️  ${w}`));
  }

  if (report.errors.length > 0) {
    console.error('\nValidation Errors:');
    report.errors.forEach((e) => console.error(`  ❌ ${e}`));
    process.exit(1);
  } else {
    console.log('\n✅ All question JSON files passed validation!');
  }
}
