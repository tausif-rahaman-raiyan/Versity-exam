#!/usr/bin/env node
/**
 * scripts/download-question-images.mjs
 *
 * Reusable utility and CLI script to detect external image URLs in question objects
 * (including questionImageUrls, optionImageUrls, explanationImageUrls, and inline
 * [IMAGE: EXTERNAL_IMAGE_URL: ...], Markdown ![](...), and HTML <img src="...">),
 * download them locally into:
 *   public/assets/questions/{INSTITUTION}/{SESSION}/{SESSION_ID}/
 * with collision-resistant hashed filenames:
 *   q-001-question-<hash>.png
 *   q-001-option-a-<hash>.png
 *   q-001-explanation-<hash>.webp
 * and generate/update the traceability manifest:
 *   docs/imports/{INSTITUTION}/{SESSION}/{SESSION_ID}/image-manifest.json
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const PROJECT_ROOT = path.resolve(__dirname, '..');

const MIME_TO_EXT = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg'
};

const OPTION_LETTERS = ['a', 'b', 'c', 'd', 'e', 'f'];

function shortHash(input) {
  return crypto.createHash('sha1').update(String(input)).digest('hex').slice(0, 6);
}

function isPrivateOrLocalUrl(urlStr) {
  try {
    const parsed = new URL(urlStr);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return true;
    const host = parsed.hostname.toLowerCase();
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '0.0.0.0' ||
      host === '::1' ||
      host.startsWith('10.') ||
      host.startsWith('192.168.') ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)
    ) {
      return true;
    }
    return false;
  } catch {
    return true;
  }
}

function guessExtFromUrl(urlStr) {
  try {
    const pathname = new URL(urlStr).pathname.toLowerCase();
    const match = pathname.match(/\.(png|jpe?g|webp|gif|svg)$/);
    if (match) {
      return match[1] === 'jpeg' ? 'jpg' : match[1];
    }
  } catch {
    // ignore
  }
  return 'png';
}

async function fetchImageBuffer(url, maxRetries = 2, timeoutMs = 15000) {
  if (isPrivateOrLocalUrl(url)) {
    throw new Error(`Rejected non-public or invalid URL: ${url}`);
  }

  let lastErr = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'VarsityQuestionBankImporter/1.0'
        }
      });
      clearTimeout(timer);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }

      const contentType = (res.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
      const arrayBuf = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuf);

      if (buffer.length === 0) {
        throw new Error('Empty response body');
      }

      // Verify valid image content-type or magic bytes
      let ext = MIME_TO_EXT[contentType];
      if (!ext) {
        if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
          ext = 'png';
        } else if (buffer[0] === 0xff && buffer[1] === 0xd8) {
          ext = 'jpg';
        } else if (buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP') {
          ext = 'webp';
        } else if (buffer.subarray(0, 3).toString('ascii') === 'GIF') {
          ext = 'gif';
        } else if (buffer.subarray(0, 200).toString('utf8').includes('<svg')) {
          ext = 'svg';
        } else {
          throw new Error(`Response is not a recognized image format (Content-Type: ${contentType || 'unknown'})`);
        }
      }

      return { buffer, ext: ext || guessExtFromUrl(url) };
    } catch (err) {
      clearTimeout(timer);
      lastErr = err;
    }
  }
  throw lastErr || new Error('Download failed');
}

/**
 * Extracts inline image markers from text:
 * - [IMAGE: EXTERNAL_IMAGE_URL: https://...]
 * - QUESTION IMAGE: EXTERNAL_IMAGE_URL: https://...
 * - ![](https://...)
 * - <img src="https://...">
 * Returns { cleanedText, extractedUrls }
 */
export function extractInlineImageUrls(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return { cleanedText: rawText || '', extractedUrls: [] };
  }

  const extractedUrls = [];
  let cleaned = rawText;

  // 1. [IMAGE: EXTERNAL_IMAGE_URL: https://...] or [IMAGE: https://...]
  cleaned = cleaned.replace(
    /\[\s*IMAGE\s*:\s*(?:EXTERNAL_IMAGE_URL\s*:\s*)?(https?:\/\/[^\s\]]+)\s*\]/gi,
    (_, url) => {
      extractedUrls.push(url.trim());
      return '';
    }
  );

  // 2. QUESTION IMAGE: EXTERNAL_IMAGE_URL: https://... or QUESTION IMAGE: https://...
  cleaned = cleaned.replace(
    /(?:QUESTION|EXPLANATION|OPTION)\s+IMAGE\s*:\s*(?:EXTERNAL_IMAGE_URL\s*:\s*)?(https?:\/\/\S+)/gi,
    (_, url) => {
      extractedUrls.push(url.trim());
      return '';
    }
  );

  // 3. Markdown image syntax ![alt](https://...)
  cleaned = cleaned.replace(
    /!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/gi,
    (fullMatch, url) => {
      extractedUrls.push(url.trim());
      return '';
    }
  );

  // 4. HTML <img src="https://...">
  cleaned = cleaned.replace(
    /<img\b[^>]*?\bsrc=["'](https?:\/\/[^"']+)["'][^>]*>/gi,
    (fullMatch, url) => {
      extractedUrls.push(url.trim());
      return '';
    }
  );

  // 5. Bare non-URL scraper placeholders like [IMAGE: Q164_OPTD_1.png] or QUESTION IMAGE: Q139_QUESTION_1.png
  cleaned = cleaned.replace(
    /\[\s*IMAGE\s*:\s*(?!https?:\/\/)([^\]]+)\]/gi,
    '[চিত্র সংযুক্ত নেই]'
  );
  cleaned = cleaned.replace(
    /(?:QUESTION|EXPLANATION|OPTION)\s+IMAGE\s*:\s*(?!https?:\/\/)(\S+)/gi,
    ''
  );

  return {
    cleanedText: cleaned.replace(/\s+\n/g, '\n').trim(),
    extractedUrls
  };
}

/**
 * Processes all questions for a session, downloads external images, replaces
 * external URLs with local paths ("assets/questions/{INSTITUTION}/{SESSION}/{SESSION_ID}/..."),
 * and writes docs/imports/{INSTITUTION}/{SESSION}/{SESSION_ID}/image-manifest.json.
 */
export async function processSessionImages({
  questions,
  institution,
  session,
  sessionId
}) {
  const relAssetDir = `assets/questions/${institution}/${session}/${sessionId}`;
  const absAssetDir = path.join(PROJECT_ROOT, 'public', relAssetDir);
  const absManifestDir = path.join(
    PROJECT_ROOT,
    'docs',
    'imports',
    institution,
    session,
    sessionId
  );

  const manifest = [];
  const urlDedupeMap = new Map(); // originalUrl -> localPath

  for (const q of questions) {
    const qNumPad = String(q.number || 1).padStart(3, '0');

    // A. Extract inline images from question stem
    const qInline = extractInlineImageUrls(q.question);
    q.question = qInline.cleanedText;
    const rawQImgs = [
      ...(Array.isArray(q.questionImageUrls) ? q.questionImageUrls : []),
      ...qInline.extractedUrls
    ].filter(Boolean);

    const resolvedQImgs = [];
    for (const url of rawQImgs) {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        resolvedQImgs.push(url);
        continue;
      }

      if (urlDedupeMap.has(url)) {
        const cachedLocal = urlDedupeMap.get(url);
        resolvedQImgs.push(cachedLocal);
        manifest.push({
          questionNumber: q.number,
          imageType: 'question',
          originalUrl: url,
          localPath: cachedLocal,
          downloadStatus: 'deduplicated'
        });
        continue;
      }

      try {
        await fs.mkdir(absAssetDir, { recursive: true });
        const { buffer, ext } = await fetchImageBuffer(url);
        const hash = shortHash(url);
        const fileName = `q-${qNumPad}-question-${hash}.${ext}`;
        const localRelPath = `${relAssetDir}/${fileName}`;
        await fs.writeFile(path.join(absAssetDir, fileName), buffer);

        urlDedupeMap.set(url, localRelPath);
        resolvedQImgs.push(localRelPath);
        manifest.push({
          questionNumber: q.number,
          imageType: 'question',
          originalUrl: url,
          localPath: localRelPath,
          downloadStatus: 'success'
        });
      } catch (err) {
        manifest.push({
          questionNumber: q.number,
          imageType: 'question',
          originalUrl: url,
          localPath: null,
          downloadStatus: 'failed',
          error: err instanceof Error ? err.message : String(err)
        });
      }
    }
    if (resolvedQImgs.length > 0) {
      q.questionImageUrls = resolvedQImgs;
    } else {
      delete q.questionImageUrls;
    }

    // B. Extract and download option images
    if (Array.isArray(q.options) && q.options.length > 0) {
      const rawOptImgMatrix = Array.isArray(q.optionImageUrls)
        ? q.optionImageUrls
        : q.options.map(() => []);

      const resolvedOptMatrix = [];
      let anyOptionHasImage = false;

      for (let optIdx = 0; optIdx < q.options.length; optIdx++) {
        const optLetter = OPTION_LETTERS[optIdx] || String(optIdx + 1);
        const optInline = extractInlineImageUrls(q.options[optIdx]);
        q.options[optIdx] = optInline.cleanedText;

        const existingOptUrls = Array.isArray(rawOptImgMatrix[optIdx])
          ? rawOptImgMatrix[optIdx]
          : [];
        const combinedOptUrls = [...existingOptUrls, ...optInline.extractedUrls].filter(
          Boolean
        );

        const resolvedForOpt = [];
        for (const url of combinedOptUrls) {
          if (!url.startsWith('http://') && !url.startsWith('https://')) {
            resolvedForOpt.push(url);
            anyOptionHasImage = true;
            continue;
          }

          if (urlDedupeMap.has(url)) {
            const cachedLocal = urlDedupeMap.get(url);
            resolvedForOpt.push(cachedLocal);
            anyOptionHasImage = true;
            manifest.push({
              questionNumber: q.number,
              imageType: `option-${optLetter}`,
              originalUrl: url,
              localPath: cachedLocal,
              downloadStatus: 'deduplicated'
            });
            continue;
          }

          try {
            await fs.mkdir(absAssetDir, { recursive: true });
            const { buffer, ext } = await fetchImageBuffer(url);
            const hash = shortHash(url);
            const fileName = `q-${qNumPad}-option-${optLetter}-${hash}.${ext}`;
            const localRelPath = `${relAssetDir}/${fileName}`;
            await fs.writeFile(path.join(absAssetDir, fileName), buffer);

            urlDedupeMap.set(url, localRelPath);
            resolvedForOpt.push(localRelPath);
            anyOptionHasImage = true;
            manifest.push({
              questionNumber: q.number,
              imageType: `option-${optLetter}`,
              originalUrl: url,
              localPath: localRelPath,
              downloadStatus: 'success'
            });
          } catch (err) {
            manifest.push({
              questionNumber: q.number,
              imageType: `option-${optLetter}`,
              originalUrl: url,
              localPath: null,
              downloadStatus: 'failed',
              error: err instanceof Error ? err.message : String(err)
            });
          }
        }
        resolvedOptMatrix.push(resolvedForOpt);
      }

      if (anyOptionHasImage) {
        q.optionImageUrls = resolvedOptMatrix;
      } else {
        delete q.optionImageUrls;
      }
    }

    // C. Extract and download explanation images
    if (q.explanation) {
      const expInline = extractInlineImageUrls(q.explanation);
      q.explanation = expInline.cleanedText;
      const rawExpImgs = [
        ...(Array.isArray(q.explanationImageUrls) ? q.explanationImageUrls : []),
        ...expInline.extractedUrls
      ].filter(Boolean);

      const resolvedExpImgs = [];
      for (const url of rawExpImgs) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          resolvedExpImgs.push(url);
          continue;
        }

        if (urlDedupeMap.has(url)) {
          const cachedLocal = urlDedupeMap.get(url);
          resolvedExpImgs.push(cachedLocal);
          manifest.push({
            questionNumber: q.number,
            imageType: 'explanation',
            originalUrl: url,
            localPath: cachedLocal,
            downloadStatus: 'deduplicated'
          });
          continue;
        }

        try {
          await fs.mkdir(absAssetDir, { recursive: true });
          const { buffer, ext } = await fetchImageBuffer(url);
          const hash = shortHash(url);
          const fileName = `q-${qNumPad}-explanation-${hash}.${ext}`;
          const localRelPath = `${relAssetDir}/${fileName}`;
          await fs.writeFile(path.join(absAssetDir, fileName), buffer);

          urlDedupeMap.set(url, localRelPath);
          resolvedExpImgs.push(localRelPath);
          manifest.push({
            questionNumber: q.number,
            imageType: 'explanation',
            originalUrl: url,
            localPath: localRelPath,
            downloadStatus: 'success'
          });
        } catch (err) {
          manifest.push({
            questionNumber: q.number,
            imageType: 'explanation',
            originalUrl: url,
            localPath: null,
            downloadStatus: 'failed',
            error: err instanceof Error ? err.message : String(err)
          });
        }
      }

      if (resolvedExpImgs.length > 0) {
        q.explanationImageUrls = resolvedExpImgs;
      } else {
        delete q.explanationImageUrls;
      }
    }
  }

  // Write image-manifest.json
  await fs.mkdir(absManifestDir, { recursive: true });
  const manifestPath = path.join(absManifestDir, 'image-manifest.json');
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');

  return {
    manifest,
    manifestPath,
    discoveredCount: manifest.length,
    downloadedCount: manifest.filter((m) => m.downloadStatus === 'success').length,
    deduplicatedCount: manifest.filter((m) => m.downloadStatus === 'deduplicated').length,
    failedCount: manifest.filter((m) => m.downloadStatus === 'failed').length
  };
}

// CLI entrypoint when invoked directly: `npm run images:download -- [sessionId]`
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  const targetSessionId = process.argv[2];
  const questionsRoot = path.join(PROJECT_ROOT, 'public', 'data', 'questions');

  async function findJsonFiles(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
    const results = [];
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...(await findJsonFiles(fullPath)));
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        results.push(fullPath);
      }
    }
    return results;
  }

  const allFiles = await findJsonFiles(questionsRoot);
  const filtered = targetSessionId
    ? allFiles.filter((f) => path.basename(f, '.json') === targetSessionId)
    : allFiles;

  console.log(`Scanning ${filtered.length} question JSON file(s) for external images...`);
  for (const filePath of filtered) {
    const rel = path.relative(questionsRoot, filePath);
    const parts = rel.split(path.sep);
    const institution = parts[0];
    const session = parts[1];
    const sessionId = path.basename(filePath, '.json');

    const raw = await fs.readFile(filePath, 'utf8');
    const questions = JSON.parse(raw);
    const stats = await processSessionImages({
      questions,
      institution,
      session,
      sessionId
    });
    await fs.writeFile(filePath, JSON.stringify(questions, null, 2) + '\n', 'utf8');
    console.log(
      `[${sessionId}] Discovered: ${stats.discoveredCount}, Downloaded: ${stats.downloadedCount}, Failed: ${stats.failedCount}`
    );
  }
}
