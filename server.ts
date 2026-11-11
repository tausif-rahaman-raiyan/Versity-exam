import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { createHash } from 'crypto';
import { mkdir, writeFile, readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// In-memory cache for instant repeat explanations & avoiding 429 rate limits
const explanationCache = new Map<string, string>();

function isValidApiKey(key?: string): boolean {
  if (!key) return false;
  const cleaned = key.trim();
  return cleaned.length > 10 && cleaned !== 'MY_GEMINI_API_KEY' && cleaned !== 'undefined';
}

function buildSmart4SectionFallback(params: {
  question: string;
  options?: string[];
  correctAnswer?: string;
  referenceExplanation?: string;
  subject?: string;
  userQuestion?: string;
}): string {
  const { question, options, correctAnswer, referenceExplanation, subject, userQuestion } = params;
  const cleanRef = (referenceExplanation || '').trim();

  if (userQuestion && userQuestion.trim()) {
    return `১. 🎯 **আপনার প্রশ্নের উত্তর (${subject || 'Science'}):**\n\n${
      cleanRef || `প্রদত্ত প্রশ্নটির সঠিক উত্তর হলো **${correctAnswer || 'সঠিক অপশন'}**।`
    }\n\n⚡ **শর্টকাট টিপস:** প্রশ্নের প্রদত্ত মানগুলো সরাসরি মূল সূত্রে বসিয়ে একক (Unit) ঠিক রেখে তুলনা করলেই দ্রুত উত্তর বের করা যায়।`;
  }

  const optionsList =
    Array.isArray(options) && options.length > 0
      ? options.map((opt) => `- ${opt}`).join('\n')
      : '';

  return `১. 🎯 **সঠিক উত্তর ও মূল যুক্তি:**

**মূল নীতি:** ${
    cleanRef
      ? cleanRef
      : `প্রদত্ত প্রশ্ন (${question.slice(0, 140)}) বিশ্লেষণ করে দেখা যায় সঠিক উত্তর হলো **${
          correctAnswer || 'প্রদত্ত সঠিক অপশন'
        }**।`
  }

২. 📐 **ধাপে ধাপে সমাধান:**

${
  cleanRef
    ? `প্রশ্নের তথ্যের আলোকে গাণিতিক ও তাত্ত্বিক বিশ্লেষণ:\n\n${cleanRef}`
    : `প্রদত্ত অপশনগুলোর তুলনামূলক বিশ্লেষণ:\n${optionsList}\n\nএখানে মূল সূত্র ও শর্ত প্রয়োগ করলে **${
        correctAnswer || 'সঠিক অপশনটি'
      }** সরাসরি সিদ্ধ হয়।`
}

৩. ⚡ **এডমিশন ৩০-সেকেন্ড শর্টকাট:**

ক্যালকুলেটর ছাড়া দ্রুত সমাধানের কৌশল:
- প্রশ্নের প্রদত্ত রাশিগুলোর অনুপাত বা ঘাত (Power/Exponent) সরাসরি তুলনা করুন।
- যে অপশনগুলোর একক বা মাত্রা (Dimension) প্রদত্ত রাশির সাথে মেলে না সেগুলো শুরুতেই বাদ (Eliminate) দিন।
- ফলে সহজেই **${correctAnswer || 'সঠিক উত্তর'}** চিহ্নিত করা যায়।

৪. ⚠️ **পরীক্ষার সতর্কতা:**

- **একক বিভ্রাট:** প্রশ্নে দেওয়া একক (যেমন SI বা CGS একক) খেয়াল না করে মান বসালে ভুল উত্তর আসার সম্ভাবনা থাকে।
- **চিহ্ন ও ঘাত সতর্কতা:** ধনাত্মক/ঋণাত্মক চিহ্ন এবং $10^n$ ঘাত দ্রুত পড়ার সময় বিশেষ সতর্ক থাকুন।`;
}

async function resolveImageToGeminiPart(
  rawUrl: string,
  label: string
): Promise<{ part?: any; textFallback?: string }> {
  try {
    if (!rawUrl || typeof rawUrl !== 'string') return {};
    const trimmed = rawUrl.trim().replace(/^\.\//, '/');
    let bytes: Buffer | null = null;
    let ext = '';

    if (trimmed.startsWith('/')) {
      const safeRelative = trimmed.replace(/^\/+/, '').replace(/\.\./g, '');
      const fullPath = path.join(__dirname, 'public', safeRelative);
      bytes = await readFile(fullPath);
      ext = path.extname(fullPath).toLowerCase().replace('.', '');
    } else if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      const response = await fetch(trimmed, { signal: AbortSignal.timeout(8000) });
      if (!response.ok) return {};
      const contentType = (response.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
      bytes = Buffer.from(await response.arrayBuffer());
      if (contentType.includes('png')) ext = 'png';
      else if (contentType.includes('jpeg') || contentType.includes('jpg')) ext = 'jpg';
      else if (contentType.includes('webp')) ext = 'webp';
      else if (contentType.includes('gif')) ext = 'gif';
      else if (contentType.includes('svg')) ext = 'svg';
    }

    if (!bytes || bytes.length === 0 || bytes.length > 6 * 1024 * 1024) return {};

    if (ext === 'svg') {
      const svgText = bytes.toString('utf8').slice(0, 12000);
      return {
        textFallback: `\n[Attached SVG Diagram for ${label}]:\n\`\`\`xml\n${svgText}\n\`\`\`\n`,
      };
    }

    const mimeMap: Record<string, string> = {
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      webp: 'image/webp',
      gif: 'image/gif',
    };
    const mimeType = mimeMap[ext] || 'image/png';

    return {
      part: {
        inlineData: {
          data: bytes.toString('base64'),
          mimeType,
        },
      },
    };
  } catch {
    return {};
  }
}

function buildPrompt(params: {
  question: string;
  options?: string[];
  correctAnswer?: string;
  referenceExplanation?: string;
  subject?: string;
  university?: string;
  session?: string;
  userQuestion?: string;
  hasAttachedImages?: boolean;
  svgFallbacks?: string[];
}) {
  const {
    question,
    options,
    correctAnswer,
    referenceExplanation,
    subject,
    university,
    session,
    userQuestion,
    hasAttachedImages,
    svgFallbacks,
  } = params;

  let prompt = `Varsity Admission Test Question Analysis:
- Target University: ${university || 'DU'}
- Session: ${session || 'Recent Year'}
- Subject: ${subject || 'Science'}
- Question Stem: ${question}
- Options: ${JSON.stringify(options || [])}
- Official Correct Answer: ${correctAnswer || 'Determine from question/images and options'}
`;

  if (referenceExplanation && referenceExplanation.trim().length > 0) {
    prompt += `- Reference Solution Context: ${referenceExplanation.slice(0, 1500)}\n`;
  }

  if (hasAttachedImages) {
    prompt += `- Attached Images: Inspect all diagrams, circuits, chemical structures, graphs, or mathematical expressions in the attached images to provide an exact solution.\n`;
  }

  if (svgFallbacks && svgFallbacks.length > 0) {
    prompt += svgFallbacks.join('\n');
  }

  prompt += '\n';

  if (userQuestion && userQuestion.trim().length > 0) {
    prompt += `The admission candidate has this specific follow-up doubt about this question:
"${userQuestion}"

Provide a concise, direct answer in encouraging Bengali (Bangla) mixed with standard English technical terms. Give the step-by-step math derivation in LaTeX ($...$ for inline and $$...$$ for display) and the fastest calculator-free shortcut.`;
  } else {
    prompt += `Write a crystal-clear, comprehensive Bangladeshi Varsity Admission explanation in Bengali (Bangla) following this EXACT 4-section structure and headings (do NOT repeat an "Answer:" box at the very top because the UI already displays the Answer box above your text; start directly with Section ১):

১. 🎯 **সঠিক উত্তর ও মূল যুক্তি:**

**মূল নীতি:** State the fundamental scientific law, formula, or concept clearly (e.g., আদর্শ গ্যাস সমীকরণ $PV=nRT$ অনুযায়ী...) and explain in 2-3 lines why the correct option is right.

২. 📐 **ধাপে ধাপে সমাধান:**

Show the complete step-by-step derivation and calculation for the question and options. Always format every mathematical formula, fraction, unit exponent, and variable using LaTeX inside dollar signs ($...$ for inline math such as $PV=nRT$, $T=\\frac{PV}{nR}$, $1\\text{ kPa}=10^3\\text{ Pa}$). Bullet out option-by-option comparisons if applicable, and add a brief *(পুনশ্চ: ...)* note if there is any special case or typo in the original question paper.

৩. ⚡ **এডমিশন ৩০-সেকেন্ড শর্টকাট:**

Explain how to solve this question in under 30 seconds in the exam hall without a calculator (mental math, ratio trick, unit elimination, or direct comparison).

৪. ⚠️ **পরীক্ষার সতর্কতা:**

List 2 to 3 specific common pitfalls or mistakes students make on this exact type of question (e.g., **একক বিভ্রাট:** ..., **ভুল মান পড়া:** ...) using bullet points.`;
  }

  return prompt;
}

const SYSTEM_INSTRUCTION =
  'You are an elite Bangladeshi varsity admission coach (AI Tutor Admission Coach). Write in clear, natural Bengali (Bangla) mixed with standard English scientific terms. When images are provided, inspect them thoroughly to read every symbol, circuit component, graph axis, chemical bond, or math equation. Always format mathematical formulas, fractions, and variables in standard LaTeX enclosed in dollar signs: use $...$ for inline expressions (e.g., $PV=nRT$, $T = \\frac{PV}{nR}$, $10^{-3}\\text{ m}^3$) and $$...$$ for standalone equations. Always format fractions as \\frac{numerator}{denominator} inside dollar signs. Follow the exact 4-section Bengali heading structure requested.';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '4mb' }));

  // Helper function to download and cache a single image locally
  async function downloadAndCacheImage(rawUrl: string): Promise<string | null> {
    try {
      if (!rawUrl || typeof rawUrl !== 'string') return null;
      let target = new URL(rawUrl);
      const allowedHosts = new Set(['assets.chorcha.net', 'chorcha.net']);
      if (target.protocol !== 'https:' || !allowedHosts.has(target.hostname.toLowerCase())) {
        return null;
      }
      if (target.pathname.includes('explanation_icon.svg')) {
        return null;
      }

      let response: Response | null = null;
      for (let redirect = 0; redirect <= 3; redirect++) {
        response = await fetch(target, { redirect: 'manual', signal: AbortSignal.timeout(12000) });
        if ([301, 302, 303, 307, 308].includes(response.status)) {
          const location = response.headers.get('location');
          if (!location || redirect === 3) return null;
          target = new URL(location, target);
          if (target.protocol !== 'https:' || !allowedHosts.has(target.hostname.toLowerCase())) {
            return null;
          }
          continue;
        }
        break;
      }

      if (!response || !response.ok) return null;
      const mime = (response.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
      const supported = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']);
      if (!supported.has(mime)) return null;
      const maxBytes = 8 * 1024 * 1024;

      let bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.length === 0 || bytes.length > maxBytes) return null;
      const extension = mime === 'image/jpeg' ? 'jpg' : mime === 'image/svg+xml' ? 'svg' : mime.split('/')[1];
      if (mime === 'image/svg+xml') {
        let svg = bytes.toString('utf8');
        svg = svg
          .replace(/<script\b[\s\S]*?<\/script\s*>/gi, '')
          .replace(/<foreignObject\b[\s\S]*?<\/foreignObject\s*>/gi, '')
          .replace(/\s(on[a-z]+)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
          .replace(/(?:href|xlink:href)\s*=\s*(["'])\s*(?:javascript:|https?:|\/\/)[\s\S]*?\1/gi, '')
          .replace(/url\s*\(\s*(['"]?)\s*(?:https?:|\/\/)[^)]+\)/gi, 'none');
        bytes = Buffer.from(svg, 'utf8');
      }

      const digest = createHash('sha256').update(bytes).digest('hex');
      const fileName = digest + '.' + extension;
      const directory = path.join(__dirname, 'public', 'assets', 'imported');
      await mkdir(directory, { recursive: true });
      await writeFile(path.join(directory, fileName), bytes, { flag: 'wx' }).catch(async (error: any) => {
        if (error?.code !== 'EEXIST') throw error;
      });
      return '/assets/imported/' + fileName;
    } catch {
      return null;
    }
  }

  app.get('/api/media/localize', async (req, res) => {
    try {
      const rawUrl = String(req.query.url || '');
      const localUrl = await downloadAndCacheImage(rawUrl);
      if (!localUrl) {
        return res.status(400).json({ error: 'Could not localize image or host disallowed' });
      }
      return res.json({ url: localUrl, cached: true });
    } catch (error: any) {
      return res.status(502).json({ error: 'Image localization failed' });
    }
  });

  app.post('/api/media/localize-batch', async (req, res) => {
    try {
      const { urls } = req.body;
      if (!Array.isArray(urls)) {
        return res.status(400).json({ error: 'urls array is required' });
      }
      const uniqueUrls = [...new Set(urls.filter((u) => typeof u === 'string' && u.trim()))];
      const mappings: Record<string, string> = {};

      await Promise.all(
        uniqueUrls.map(async (url) => {
          const local = await downloadAndCacheImage(url);
          if (local) {
            mappings[url] = local;
          }
        })
      );

      return res.json({ mappings, totalProcessed: uniqueUrls.length, downloaded: Object.keys(mappings).length });
    } catch {
      return res.status(500).json({ error: 'Batch localization failed' });
    }
  });

  // SSE Real-Time Multimodal Streaming Endpoint for Ask AI Tutor
  app.post('/api/gemini/explain-stream', async (req, res) => {
    try {
      const {
        questionId,
        question,
        options,
        correctAnswer,
        referenceExplanation,
        questionImageUrls,
        optionImageUrls,
        subject,
        university,
        session,
        userQuestion,
        customApiKey,
      } = req.body;

      if (!question && (!Array.isArray(questionImageUrls) || questionImageUrls.length === 0)) {
        return res.status(400).json({ error: 'Question text or image is required' });
      }

      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      });

      const cacheKey = `${questionId || question.slice(0, 80)}::${(userQuestion || '').trim()}`;
      if (explanationCache.has(cacheKey)) {
        const cachedText = explanationCache.get(cacheKey)!;
        res.write(`data: ${JSON.stringify({ text: cachedText, done: true, cached: true })}\n\n`);
        return res.end();
      }

      // Collect candidate API keys (user key first, then server env key if available)
      const userKey = ((req.headers['x-gemini-api-key'] as string) || customApiKey || '').trim();
      const envKey = (process.env.GEMINI_API_KEY || '').trim();
      const apiKeysToTry = [...new Set([userKey, envKey].filter((k) => isValidApiKey(k)))];

      if (apiKeysToTry.length === 0) {
        const fallback = buildSmart4SectionFallback({
          question,
          options,
          correctAnswer,
          referenceExplanation,
          subject,
          userQuestion,
        });
        res.write(`data: ${JSON.stringify({ text: fallback, done: true })}\n\n`);
        return res.end();
      }

      // Collect multimodal image parts
      const imageParts: any[] = [];
      const svgFallbacks: string[] = [];

      if (Array.isArray(questionImageUrls)) {
        for (let i = 0; i < questionImageUrls.length; i++) {
          const resolved = await resolveImageToGeminiPart(questionImageUrls[i], `Question Stem Image ${i + 1}`);
          if (resolved.part) imageParts.push(resolved.part);
          if (resolved.textFallback) svgFallbacks.push(resolved.textFallback);
        }
      }

      if (Array.isArray(optionImageUrls)) {
        for (let optIdx = 0; optIdx < optionImageUrls.length; optIdx++) {
          const urlsForOpt = optionImageUrls[optIdx];
          if (Array.isArray(urlsForOpt)) {
            for (const u of urlsForOpt) {
              const resolved = await resolveImageToGeminiPart(u, `Option ${optIdx + 1} Image`);
              if (resolved.part) imageParts.push(resolved.part);
              if (resolved.textFallback) svgFallbacks.push(resolved.textFallback);
            }
          }
        }
      }

      const prompt = buildPrompt({
        question: question || '(See attached question image)',
        options,
        correctAnswer,
        referenceExplanation,
        subject,
        university,
        session,
        userQuestion,
        hasAttachedImages: imageParts.length > 0 || svgFallbacks.length > 0,
        svgFallbacks,
      });

      const contentsPayload =
        imageParts.length > 0
          ? [{ role: 'user', parts: [...imageParts, { text: prompt }] }]
          : prompt;

      const candidateModels = [
        'gemini-3.8-flash',
        'gemini-3.1-flash-lite',
        'gemini-2.5-flash-lite',
        'gemini-2.5-flash',
        'gemini-flash-latest',
      ];

      let stream: any = null;
      let usedModel = '';

      outerLoop: for (const activeKey of apiKeysToTry) {
        const ai = new GoogleGenAI({
          apiKey: activeKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        for (const modelName of candidateModels) {
          try {
            const config: any = {
              systemInstruction: SYSTEM_INSTRUCTION,
            };
            if (modelName === 'gemini-3.8-flash') {
              config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
            }
            const s = await ai.models.generateContentStream({
              model: modelName,
              contents: contentsPayload,
              config,
            });
            stream = s;
            usedModel = modelName;
            break outerLoop;
          } catch {
            // Try next model or key silently
          }
        }
      }

      if (!stream) {
        // Graceful 4-section fallback when API key hits 429 rate-limit quota
        const fallback = buildSmart4SectionFallback({
          question,
          options,
          correctAnswer,
          referenceExplanation,
          subject,
          userQuestion,
        });
        res.write(`data: ${JSON.stringify({ text: fallback, done: true })}\n\n`);
        return res.end();
      }

      let fullGenerated = '';
      for await (const chunk of stream) {
        if (chunk.text) {
          fullGenerated += chunk.text;
          res.write(`data: ${JSON.stringify({ text: chunk.text, model: usedModel })}\n\n`);
        }
      }

      if (fullGenerated.trim().length > 40) {
        explanationCache.set(cacheKey, fullGenerated);
      }

      res.write(`data: ${JSON.stringify({ done: true, model: usedModel })}\n\n`);
      res.end();
    } catch {
      const { question = '', options, correctAnswer, referenceExplanation, subject, userQuestion } = req.body || {};
      const fallback = buildSmart4SectionFallback({
        question,
        options,
        correctAnswer,
        referenceExplanation,
        subject,
        userQuestion,
      });
      res.write(`data: ${JSON.stringify({ text: fallback, done: true })}\n\n`);
      res.end();
    }
  });

  const translationCache = new Map<string, { question: string; options: string[]; explanation: string }>();

  app.post('/api/gemini/translate-batch', async (req, res) => {
    try {
      const { items, targetLang = 'en', customApiKey } = req.body || {};
      if (!Array.isArray(items) || items.length === 0) {
        return res.json({ translations: {} });
      }

      const result: Record<string, { question: string; options: string[]; explanation: string }> = {};
      const pendingItems: Array<{
        id: string;
        subject?: string;
        question: string;
        options: string[];
        explanation?: string;
      }> = [];

      for (const item of items) {
        if (!item || !item.id) continue;
        // Keep Bangla subject questions in Bengali
        if (item.subject === 'Bangla' || item.subject === 'English') continue;
        const key = `${targetLang}::${item.id}`;
        if (translationCache.has(key)) {
          result[item.id] = translationCache.get(key)!;
        } else {
          pendingItems.push(item);
        }
      }

      if (pendingItems.length === 0) {
        return res.json({ translations: result });
      }

      const userKey = ((req.headers['x-gemini-api-key'] as string) || customApiKey || '').trim();
      const envKey = (process.env.GEMINI_API_KEY || '').trim();
      const apiKeysToTry = [...new Set([userKey, envKey].filter((k) => isValidApiKey(k)))];

      if (apiKeysToTry.length === 0) {
        return res.json({ translations: result });
      }

      const batchSlice = pendingItems.slice(0, 20);
      const prompt = `Translate the following Bangladeshi university science admission MCQ questions, options, and explanations into clear, standard academic ${
        targetLang === 'en' ? 'English' : 'Bengali'
      }.
CRITICAL RULES:
1. Preserve ALL LaTeX formulas ($...$), mathematical symbols, chemical formulas, numbers, and image markdown exactly as they are.
2. Keep the exact same number of options in the exact same order.
3. Return ONLY valid JSON matching the object map { "[questionId]": { "question": "...", "options": ["...", "..."], "explanation": "..." } }.

Input JSON:
${JSON.stringify(
  batchSlice.map((i) => ({
    id: i.id,
    subject: i.subject,
    question: i.question,
    options: i.options,
    explanation: (i.explanation || '').slice(0, 500),
  }))
)}`;

      const candidateModels = [
        'gemini-3.1-flash-lite',
        'gemini-2.5-flash-lite',
        'gemini-2.5-flash',
        'gemini-3.8-flash',
      ];

      outerTranslate: for (const activeKey of apiKeysToTry) {
        const ai = new GoogleGenAI({ apiKey: activeKey });
        for (const modelName of candidateModels) {
          try {
            const response = await ai.models.generateContent({
              model: modelName,
              contents: prompt,
              config: {
                responseMimeType: 'application/json',
              },
            });
            const rawText = (response.text || '').trim();
            if (rawText) {
              const parsed = JSON.parse(rawText);
              for (const item of batchSlice) {
                const entry = parsed[item.id];
                if (entry && typeof entry.question === 'string' && Array.isArray(entry.options)) {
                  const cleanEntry = {
                    question: entry.question,
                    options: entry.options.map((o: any) => String(o)),
                    explanation: typeof entry.explanation === 'string' ? entry.explanation : (item.explanation || ''),
                  };
                  translationCache.set(`${targetLang}::${item.id}`, cleanEntry);
                  result[item.id] = cleanEntry;
                }
              }
              break outerTranslate;
            }
          } catch {
            // Try next model
          }
        }
      }

      return res.json({ translations: result });
    } catch {
      return res.json({ translations: {} });
    }
  });

  app.get('/api/gemini/status', (_req, res) => {
    const hasEnvKey = isValidApiKey(process.env.GEMINI_API_KEY);
    res.json({
      configured: hasEnvKey,
      model: 'gemini-3.8-flash',
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
