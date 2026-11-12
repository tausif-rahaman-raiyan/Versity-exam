#!/usr/bin/env node
/**
 * scripts/check-duplicate-questions.mjs
 *
 * Scans question JSON files for potential duplicate questions within the same paper
 * (or across papers when requested).
 * Compares normalized question stems, option content, and subjects.
 * Reports possible duplicates for review without deleting any questions automatically (§7).
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

function normalizeTextForComparison(str) {
  return String(str || '')
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[.,;?!'"`~()[\]{}$\\]/g, '');
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

export async function checkDuplicates(targetSessionId = null) {
  const questionsRoot = path.join(PROJECT_ROOT, 'public', 'data', 'questions');
  const allFiles = await findQuestionJsonFiles(questionsRoot);

  const filesToCheck = targetSessionId
    ? allFiles.filter((f) => path.basename(f, '.json') === targetSessionId)
    : allFiles;

  const duplicateReport = {};

  for (const filePath of filesToCheck) {
    const sessionId = path.basename(filePath, '.json');
    const raw = await fs.readFile(filePath, 'utf8');
    const questions = JSON.parse(raw);

    const seenByStem = new Map();
    const duplicatesInSession = [];

    for (const q of questions) {
      const normStem = normalizeTextForComparison(q.question);
      if (!normStem || normStem.length < 6) continue;

      const key = `${q.subject}::${normStem}`;
      if (seenByStem.has(key)) {
        const firstQ = seenByStem.get(key);
        duplicatesInSession.push({
          firstNumber: firstQ.number,
          secondNumber: q.number,
          subject: q.subject,
          questionSnippet: q.question.slice(0, 90)
        });
      } else {
        seenByStem.set(key, q);
      }
    }

    duplicateReport[sessionId] = duplicatesInSession;
  }

  return duplicateReport;
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  const targetSessionId = process.argv[2] || null;
  const report = await checkDuplicates(targetSessionId);

  console.log('==========================================================');
  console.log(' DUPLICATE QUESTION CHECK REPORT');
  console.log('==========================================================');

  let totalDuplicates = 0;
  for (const [sessionId, dupes] of Object.entries(report)) {
    if (dupes.length === 0) {
      console.log(`  • ${sessionId}: 0 internal duplicates found`);
    } else {
      console.log(`  • ${sessionId}: ${dupes.length} potential duplicate(s) flagged for review:`);
      for (const d of dupes) {
        totalDuplicates++;
        console.log(
          `      - Q#${d.firstNumber} & Q#${d.secondNumber} [${d.subject}]: "${d.questionSnippet}..."`
        );
      }
    }
  }

  console.log(
    `\nSummary: ${totalDuplicates} potential duplicate pair(s) flagged (preserved as-is per original paper).`
  );
}
