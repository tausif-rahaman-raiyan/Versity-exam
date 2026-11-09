import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { createHash } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function isValidApiKey(key?: string): boolean {
  if (!key) return false;
  const cleaned = key.trim();
  return cleaned.length > 10 && cleaned !== 'MY_GEMINI_API_KEY' && cleaned !== 'undefined';
}

function buildPrompt(params: {
  question: string;
  options?: string[];
  correctAnswer?: string;
  subject?: string;
  university?: string;
  session?: string;
  userQuestion?: string;
}) {
  const { question, options, correctAnswer, subject, university, session, userQuestion } = params;

  let prompt = `Varsity Admission Test Context:
- Target University: ${university || 'General Science Admission'}
- Session: ${session || 'Recent Year'}
- Subject: ${subject || 'Science'}
- Question: ${question}
- Options: ${JSON.stringify(options || [])}
- Correct Answer: ${correctAnswer || 'Indicated in options'}

`;

  if (userQuestion && userQuestion.trim().length > 0) {
    prompt += `The admission candidate has this specific follow-up doubt:
"${userQuestion}"

Provide a concise, direct answer in encouraging Bengali mixed with English technical terms. Give the step-by-step math derivation in LaTeX and the fastest calculator-free shortcut.`;
  } else {
    prompt += `Provide a concise, razor-sharp admission explanation structured into 4 compact sections:

1. 🎯 **সঠিক উত্তর ও মূল যুক্তি (Correct Option & Core Rationale)**:
State the correct option and the fundamental scientific law/concept in 2 lines.

2. 📐 **ধাপে ধাপে সমাধান (Step-by-Step Derivation)**:
Show the exact formula and calculation. Always use standard LaTeX enclosed in dollar signs: $$...$$ for display formulas and $...$ for inline terms (e.g. $T = 2\\pi \\sqrt{\\frac{L}{g}}$, $\\frac{1}{2}$).

3. ⚡ **এডমিশন ৩০-সেকেন্ড শর্টকাট (Admission Shortcut without Calculator)**:
Give the mental math shortcut, unit analysis, or ratio trick to solve this in under 30 seconds.

4. ⚠️ **পরীক্ষার সতর্কতা (Common Pitfalls)**:
Briefly list the most common trap students fall into on this question.`;
  }

  return prompt;
}

const SYSTEM_INSTRUCTION =
  'You are an elite Bangladeshi varsity admission coach. Write in clear, structured Bengali (Bangla) mixed with standard English scientific terms. Keep responses concise, direct, and fast. Always format mathematical formulas, fractions, and variables in standard LaTeX enclosed in dollar signs: use $$...$$ for display formulas and $...$ for inline expressions (e.g., $T = 2\\pi \\sqrt{\\frac{L}{g}}$, $\\frac{1}{2}$). Always format fractions as \\frac{numerator}{denominator} inside dollar signs so they render with authentic vertical fraction bars. Avoid filler text.';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

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
        return null; // Skip decorative icons
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
      let extension = mime === 'image/jpeg' ? 'jpg' : mime === 'image/svg+xml' ? 'svg' : mime.split('/')[1];
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

  // Single Image Localizer API
  app.get('/api/media/localize', async (req, res) => {
    try {
      const rawUrl = String(req.query.url || '');
      const localUrl = await downloadAndCacheImage(rawUrl);
      if (!localUrl) {
        return res.status(400).json({ error: 'Could not localize image or host disallowed' });
      }
      return res.json({ url: localUrl, cached: true });
    } catch (error: any) {
      console.error('Image localization failed:', error?.message || error);
      return res.status(502).json({ error: 'Image localization failed' });
    }
  });

  // Batch Image Localizer API
  app.post('/api/media/localize-batch', async (req, res) => {
    try {
      const { urls } = req.body;
      if (!Array.isArray(urls)) {
        return res.status(400).json({ error: 'urls array is required' });
      }
      const uniqueUrls = [...new Set(urls.filter(u => typeof u === 'string' && u.trim()))];
      const mappings: Record<string, string> = {};

      await Promise.all(uniqueUrls.map(async (url) => {
        const local = await downloadAndCacheImage(url);
        if (local) {
          mappings[url] = local;
        }
      }));

      return res.json({ mappings, totalProcessed: uniqueUrls.length, downloaded: Object.keys(mappings).length });
    } catch (error: any) {
      console.error('Batch localization failed:', error?.message || error);
      return res.status(500).json({ error: 'Batch localization failed' });
    }
  });

  // Chorcha Exam JSON Importer Endpoint
  app.post('/api/json/import', async (req, res) => {
    try {
      const examData = req.body;
      if (!examData || typeof examData !== 'object' || !Array.isArray(examData.questions)) {
        return res.status(400).json({ error: 'Invalid exam JSON schema. "questions" array is required.' });
      }

      const jsonStr = JSON.stringify(examData);
      const imageUrlRegex = /https?:\/\/(?:assets\.chorcha\.net|chorcha\.net)\/[^\s"'>\\]+/gi;
      const matchedUrls = jsonStr.match(imageUrlRegex) || [];
      const uniqueImageUrls = [...new Set(matchedUrls.map(u => u.replace(/\\/g, '')))].filter(u => !u.includes('explanation_icon.svg'));

      const urlReplacements: Record<string, string> = {};
      let downloadedImagesCount = 0;

      await Promise.all(uniqueImageUrls.map(async (url) => {
        const local = await downloadAndCacheImage(url);
        if (local) {
          urlReplacements[url] = local;
          downloadedImagesCount++;
        }
      }));

      let processedJsonStr = jsonStr;
      for (const [orig, local] of Object.entries(urlReplacements)) {
        processedJsonStr = processedJsonStr.split(orig).join(local);
      }

      const processedExam = JSON.parse(processedJsonStr);
      let mcqCount = 0;
      let writtenCount = 0;
      let verifiedAnswersCount = 0;
      let unverifiedAnswersCount = 0;
      let missingExplanationsCount = 0;

      processedExam.questions = processedExam.questions.map((q: any) => {
        const isWritten = (processedExam.exam_type || '').toLowerCase() === 'written' || !q.options || q.options.length === 0;
        if (isWritten) {
          writtenCount++;
        } else {
          mcqCount++;
        }

        if (!q.explanation && !q.explanation_html) {
          missingExplanationsCount++;
        }

        let isVerified = false;
        let finalAnswerIndex = -1;

        if (!isWritten && Array.isArray(q.options)) {
          const explicit = q.correct_answer;
          const options = q.options;

          const flagged = options
            .map((opt: any, i: number) => (typeof opt === 'object' && opt.is_correct ? i : -1))
            .filter((i: number) => i >= 0);

          let expIndex = -1;
          if (explicit && typeof explicit === 'object') {
            const lbl = (explicit.label || '').trim().toLowerCase().replace(/[.)\s]/g, '');
            expIndex = options.findIndex((opt: any) => {
              const optLbl = (typeof opt === 'object' ? opt.label : '').trim().toLowerCase().replace(/[.)\s]/g, '');
              return optLbl === lbl;
            });
          } else if (typeof explicit === 'number' && Number.isInteger(explicit)) {
            if (explicit >= 0 && explicit < options.length) expIndex = explicit;
          } else if (typeof explicit === 'string') {
            const cleanStr = explicit.trim().toLowerCase().replace(/[.)\s]/g, '');
            expIndex = options.findIndex((opt: any) => {
              const optLbl = (typeof opt === 'object' ? opt.label : '').trim().toLowerCase().replace(/[.)\s]/g, '');
              return optLbl === cleanStr;
            });
          }

          if (expIndex >= 0 && flagged.length === 0) {
            finalAnswerIndex = expIndex;
            isVerified = true;
          } else if (expIndex >= 0 && flagged.length === 1 && flagged[0] === expIndex) {
            finalAnswerIndex = expIndex;
            isVerified = true;
          } else if (expIndex < 0 && flagged.length === 1) {
            finalAnswerIndex = flagged[0];
            isVerified = true;
          } else if (expIndex >= 0 && flagged.length > 0 && flagged.includes(expIndex)) {
            finalAnswerIndex = expIndex;
            isVerified = true;
          }

          if (isVerified) {
            verifiedAnswersCount++;
          } else {
            unverifiedAnswersCount++;
          }
        }

        return {
          ...q,
          verifiedAnswerIndex: finalAnswerIndex,
          isAnswerVerified: isVerified,
        };
      });

      const report = {
        totalQuestions: processedExam.questions.length,
        declaredCount: processedExam.question_count || processedExam.questions.length,
        mcqCount,
        writtenCount,
        verifiedAnswersCount,
        unverifiedAnswersCount,
        totalImagesFound: uniqueImageUrls.length,
        downloadedImagesCount,
        missingExplanationsCount,
        university: processedExam.university || 'DU',
        session: processedExam.exam_year || '25-26',
        examTitle: processedExam.exam_title || 'Imported Varsity Admission Exam',
      };

      return res.json({
        success: true,
        exam: processedExam,
        report,
      });
    } catch (error: any) {
      console.error('JSON Exam Import Failed:', error);
      return res.status(500).json({ error: error.message || 'Failed to import exam JSON' });
    }
  });



  // SSE Real-Time Streaming Endpoint for Instant AI Responses (<1s time-to-first-token)
  app.post('/api/gemini/explain-stream', async (req, res) => {
    try {
      const { question, options, correctAnswer, subject, university, session, userQuestion, customApiKey } = req.body;
      const clientApiKey = ((req.headers['x-gemini-api-key'] as string) || customApiKey || process.env.GEMINI_API_KEY || '').trim();

      if (!question) {
        return res.status(400).json({ error: 'Question is required' });
      }

      // Initialize Server-Sent Events headers
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      });

      if (!isValidApiKey(clientApiKey)) {
        const guidance = `🎯 **সঠিক উত্তর (Official Answer):**\n${correctAnswer || 'সঠিক অপশন'}\n\n🔑 **Gemini 3.8 AI Tutor সক্রিয় করতে:**\nআপনি যে কোনো প্রশ্নের ক্যালকুলেটর ছাড়া এডমিশন শর্টকাট ট্রিক এবং ফলো-আপ প্রশ্ন করার জন্য আপনার ব্যক্তিগত Gemini API Key যুক্ত করতে পারেন।\n\n📌 **কিভাবে যুক্ত করবেন:**\n১. উপরের নেভিগেশন বারের **'API Key'** বাটনে ক্লিক করুন।\n২. আপনার Google AI Studio API Key (AIzaSy...) পেস্ট করে **'Save Key'** চাপুন।\n*(এটি সম্পূর্ণ ফ্রি এবং কোনো ক্রেডিট কার্ড লাগে না)*`;
        res.write(`data: ${JSON.stringify({ text: guidance, done: true, needsKey: true })}\n\n`);
        return res.end();
      }

      const ai = new GoogleGenAI({
        apiKey: clientApiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const prompt = buildPrompt({ question, options, correctAnswer, subject, university, session, userQuestion });

      // Candidate model chain with fast fallback if any model experiences 503 demand spikes
      const candidateModels = ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite', 'gemini-3.8-flash'];
      let stream: any = null;
      let usedModel = '';

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
            contents: prompt,
            config,
          });
          stream = s;
          usedModel = modelName;
          break;
        } catch (e: any) {
          console.warn(`Streaming on ${modelName} encountered: ${e?.message?.slice(0, 60)}, trying next...`);
        }
      }

      if (!stream) {
        throw new Error('All candidate models are temporarily busy. Please retry in a few moments.');
      }

      for await (const chunk of stream) {
        if (chunk.text) {
          res.write(`data: ${JSON.stringify({ text: chunk.text, model: usedModel })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ done: true, model: usedModel })}\n\n`);
      res.end();
    } catch (error: any) {
      console.error('Gemini streaming error:', error);
      const isKeyError = error?.status === 400 || error?.status === 403 || error?.message?.includes('API_KEY');
      res.write(
        `data: ${JSON.stringify({
          error: error.message || 'Error generating AI explanation',
          isKeyError,
          done: true,
        })}\n\n`
      );
      res.end();
    }
  });

  // Fallback non-streaming API endpoint with fast ThinkingLevel.LOW
  app.post('/api/gemini/explain', async (req, res) => {
    try {
      const { question, options, correctAnswer, subject, university, session, userQuestion, customApiKey } = req.body;
      const clientApiKey = ((req.headers['x-gemini-api-key'] as string) || customApiKey || process.env.GEMINI_API_KEY || '').trim();

      if (!question) {
        return res.status(400).json({ error: 'Question is required' });
      }

      if (!isValidApiKey(clientApiKey)) {
        return res.json({
          explanation: `🎯 **সঠিক উত্তর (Official Answer):**\n${correctAnswer || 'সঠিক অপশন'}\n\n🔑 **Gemini 3.8 AI Tutor সক্রিয় করতে:**\nআপনি যে কোনো প্রশ্নের ক্যালকুলেটর ছাড়া এডমিশন শর্টকাট ট্রিক এবং ফলো-আপ প্রশ্ন করার জন্য আপনার ব্যক্তিগত Gemini API Key যুক্ত করতে পারেন।\n\n📌 **কিভাবে যুক্ত করবেন:**\n১. উপরের নেভিগেশন বারের **'API Key'** বাটনে ক্লিক করুন।\n২. আপনার Google AI Studio API Key (AIzaSy...) পেস্ট করে **'Save Key'** চাপুন।`,
          needsKey: true,
          model: 'gemini-3.8-flash',
        });
      }

      const ai = new GoogleGenAI({
        apiKey: clientApiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const prompt = buildPrompt({ question, options, correctAnswer, subject, university, session, userQuestion });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      res.json({
        explanation: response.text || 'No explanation generated.',
        model: 'gemini-3.8-flash',
        hasCustomKey: Boolean(clientApiKey && clientApiKey !== process.env.GEMINI_API_KEY),
      });
    } catch (error: any) {
      console.error('Gemini explanation error:', error);
      const isKeyError = error?.status === 400 || error?.status === 403 || error?.message?.includes('API_KEY');
      res.status(500).json({
        error: error.message || 'Failed to generate AI explanation',
        isKeyError,
        tip: 'Check your Gemini API Key in the settings.',
      });
    }
  });

  // Health check endpoint for Gemini API status
  app.get('/api/gemini/status', (req, res) => {
    const hasEnvKey = isValidApiKey(process.env.GEMINI_API_KEY);
    res.json({
      configured: hasEnvKey,
      model: 'gemini-3.8-flash',
    });
  });

  // Vite middleware for development
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
