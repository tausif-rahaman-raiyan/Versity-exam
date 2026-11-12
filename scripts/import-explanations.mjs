#!/usr/bin/env node
/**
 * scripts/import-explanations.mjs
 *
 * Reusable University / Session-Wise Explanation Merger.
 * Allows uploading explanation files (.txt or .json) later for any session
 * and merging explanations + explanation images into the existing session JSON:
 *   public/data/questions/{INSTITUTION}/{SESSION}/{SESSION_ID}.json
 *
 * Usage:
 *   npm run import:explanations -- <path-to-explanation-file> [sessionId]
 *
 * Supported TXT formats:
 *   Format A:
 *     [Physics(15)] 1. ...
 *     EXPLANATION: ...
 *   Format B:
 *     1. EXPLANATION: ... (or Q1: ... / প্রশ্ন ১: ... / সমাধান: ...)
 *   Format C (JSON):
 *     [{ "number": 1, "explanation": "...", "explanationImageUrls": [...] }]
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { inferSessionIdFromFilename } from './import-questions.mjs';
import { processSessionImages } from './download-question-images.mjs';
import { validateAllQuestionFiles } from './validate-question-data.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

async function loadSessions() {
  const sessionsFile = path.join(PROJECT_ROOT, 'src', 'data', 'sessions.ts');
  const content = await fs.readFile(sessionsFile, 'utf8');
  const match = content.match(/export const sessions:\s*Session\[\]\s*=\s*(\[[\s\S]*\]);/);
  if (!match) {
    throw new Error('Could not parse sessions from src/data/sessions.ts');
  }
  return JSON.parse(match[1]);
}

export function parseExplanationTxt(rawText) {
  const cleaned = rawText.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  const lines = cleaned.split('\n');
  const explanationsByNumber = new Map();

  let currentNum = null;
  let currentLines = [];
  let inExpBlock = false;

  const flushCurrent = () => {
    if (currentNum !== null && currentLines.length > 0) {
      const text = currentLines.join('\n').trim();
      if (text) {
        explanationsByNumber.set(currentNum, text);
      }
    }
    currentLines = [];
    inExpBlock = false;
  };

  const bracketHeaderRegex = /^\[([^\]]+)\]\s*(\d+)\.\s*(?:\d+\.\s*)?(.*)$/;
  const numberedExpRegex = /^(?:Q|Question|প্রশ্ন)?\s*(\d+)[.):]\s*(?:(?:EXPLANATION|সমাধান|ব্যাখ্যা)\s*:\s*)?(.*)$/i;
  const expPrefixRegex = /^(?:EXPLANATION|সমাধান|ব্যাখ্যা)\s*:\s*(.*)$/i;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const bMatch = line.match(bracketHeaderRegex);
    if (bMatch) {
      flushCurrent();
      currentNum = parseInt(bMatch[2], 10);
      inExpBlock = false;
      continue;
    }

    const expMatch = line.match(expPrefixRegex);
    if (expMatch && currentNum !== null) {
      inExpBlock = true;
      if (expMatch[1]) currentLines.push(expMatch[1].trim());
      continue;
    }

    if (!inExpBlock) {
      const nMatch = line.match(numberedExpRegex);
      if (nMatch && !/^A\s*:/i.test(line) && !/^CORRECT\s+ANSWER/i.test(line)) {
        flushCurrent();
        currentNum = parseInt(nMatch[1], 10);
        inExpBlock = true;
        if (nMatch[2]) currentLines.push(nMatch[2].trim());
        continue;
      }
    }

    if (inExpBlock && currentNum !== null) {
      if (/^CORRECT\s+ANSWER\s*:/i.test(line)) continue;
      currentLines.push(line);
    }
  }

  flushCurrent();
  return explanationsByNumber;
}

export async function mergeExplanationsFromFile(sourceFilePath, explicitSessionId = null) {
  const sessions = await loadSessions();
  const absSource = path.resolve(PROJECT_ROOT, sourceFilePath);
  const sourceFilename = path.basename(absSource);

  const sessionId =
    explicitSessionId || inferSessionIdFromFilename(sourceFilename, sessions);
  if (!sessionId) {
    throw new Error(
      `Could not infer sessionId from "${sourceFilename}". Pass it explicitly: npm run import:explanations -- <file> <sessionId>`
    );
  }

  const sessionMeta = sessions.find((s) => s.id === sessionId);
  if (!sessionMeta) {
    throw new Error(`Session ID "${sessionId}" not found in src/data/sessions.ts`);
  }

  const questionJsonRel = `public/data/questions/${sessionMeta.institution}/${sessionMeta.session}/${sessionMeta.id}.json`;
  const questionJsonAbs = path.join(PROJECT_ROOT, questionJsonRel);

  const existingRaw = await fs.readFile(questionJsonAbs, 'utf8');
  const questions = JSON.parse(existingRaw);
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error(
      `Target session JSON (${questionJsonRel}) is empty. Import the questions first before merging explanations.`
    );
  }

  const rawSource = await fs.readFile(absSource, 'utf8');
  const ext = path.extname(sourceFilename).toLowerCase();
  let explanationsMap = new Map();

  if (ext === '.json') {
    const parsed = JSON.parse(rawSource);
    if (Array.isArray(parsed)) {
      for (const item of parsed) {
        const num = Number(item.number);
        if (num && item.explanation) {
          explanationsMap.set(num, String(item.explanation).trim());
        }
      }
    }
  } else {
    explanationsMap = parseExplanationTxt(rawSource);
  }

  let updatedCount = 0;
  for (const q of questions) {
    if (explanationsMap.has(q.number)) {
      q.explanation = explanationsMap.get(q.number);
      q.provenance = {
        ...(q.provenance || {}),
        explanationSource: `Merged from ${sourceFilename}`
      };
      updatedCount++;
    }
  }

  // Download any external images inside newly merged explanations
  const imageStats = await processSessionImages({
    questions,
    institution: sessionMeta.institution,
    session: sessionMeta.session,
    sessionId: sessionMeta.id
  });

  await fs.writeFile(questionJsonAbs, JSON.stringify(questions, null, 2) + '\n', 'utf8');
  const valReport = await validateAllQuestionFiles(sessionMeta.id);

  return {
    sessionId: sessionMeta.id,
    title: sessionMeta.title,
    updatedCount,
    totalQuestions: questions.length,
    imageStats,
    valid: valReport.perSession[sessionMeta.id]?.valid ?? false
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  const [sourceFile, explicitId] = process.argv.slice(2);
  if (!sourceFile) {
    console.error(
      'Usage: npm run import:explanations -- <explanation-file-path> [sessionId]'
    );
    process.exit(1);
  }

  try {
    const res = await mergeExplanationsFromFile(sourceFile, explicitId || null);
    console.log('==========================================================');
    console.log(`✅ EXPLANATIONS MERGED: ${res.title} (${res.sessionId})`);
    console.log('==========================================================');
    console.log(`Questions updated : ${res.updatedCount} / ${res.totalQuestions}`);
    console.log(`Images downloaded : ${res.imageStats.downloadedCount}`);
    console.log(`Validation        : ${res.valid ? 'PASS' : 'FAIL'}`);
  } catch (err) {
    console.error('❌ Explanation import failed:', err.message);
    process.exit(1);
  }
}
