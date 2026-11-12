import { sessions } from '../data/sessions';
import type { Question, Session } from '../types';

const questionCache = new Map<string, Question[]>();
const inFlightRequests = new Map<string, Promise<Question[]>>();
const availabilityCache = new Map<string, boolean>();

const sessionLookup = new Map<string, Session>(sessions.map((s) => [s.id, s]));

/**
 * Central asset resolver for GitHub Pages and local Vite dev (§4.6).
 * Converts relative public paths (e.g. "assets/questions/DU/25-26/...")
 * into base-aware URLs using import.meta.env.BASE_URL.
 */
export function resolvePublicAsset(assetPath: string): string {
  if (!assetPath) return '';
  const trimmed = assetPath.trim();
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }
  const baseUrl = import.meta.env.BASE_URL || '/';
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const cleanRel = trimmed.replace(/^\/+/, '');
  return `${normalizedBase}${cleanRel}`;
}

/**
 * Central helper for locating a session's question JSON file (§2.1):
 * public/data/questions/{institution}/{session}/{sessionId}.json
 */
export function getQuestionFilePath(sessionOrId: Session | string): string {
  const s =
    typeof sessionOrId === 'string'
      ? sessionLookup.get(sessionOrId)
      : sessionOrId;

  if (!s) {
    const id = typeof sessionOrId === 'string' ? sessionOrId : '';
    return resolvePublicAsset(`data/${encodeURIComponent(id)}.json`);
  }

  return resolvePublicAsset(
    `data/questions/${encodeURIComponent(s.institution)}/${encodeURIComponent(
      s.session
    )}/${encodeURIComponent(s.id)}.json`
  );
}

function preloadImage(url: string): void {
  if (!url || typeof window === 'undefined') return;
  try {
    const img = new Image();
    img.decoding = 'sync';
    img.referrerPolicy = 'no-referrer';
    img.src = resolvePublicAsset(url);
  } catch {
    // ignore image preload failures
  }
}

function preloadSessionImages(questions: Question[]): void {
  if (typeof window === 'undefined' || !questions.length) return;

  const primaryUrls: string[] = [];
  const secondaryUrls: string[] = [];

  for (const q of questions) {
    if (Array.isArray(q.questionImageUrls)) {
      primaryUrls.push(...q.questionImageUrls.filter(Boolean));
    }
    if (Array.isArray(q.optionImageUrls)) {
      for (const optImgs of q.optionImageUrls) {
        if (Array.isArray(optImgs)) {
          primaryUrls.push(...optImgs.filter(Boolean));
        }
      }
    }
    if (Array.isArray(q.explanationImageUrls)) {
      secondaryUrls.push(...q.explanationImageUrls.filter(Boolean));
    }
  }

  primaryUrls.forEach(preloadImage);

  if (secondaryUrls.length > 0) {
    setTimeout(() => {
      secondaryUrls.forEach(preloadImage);
    }, 350);
  }
}

function normalizeQuestion(raw: Record<string, unknown>, idx: number, sessionId: string): Question {
  const options = Array.isArray(raw.options) ? raw.options.map((o) => String(o ?? '')) : [];
  const qType = raw.questionType === 'Written' ? 'Written' : 'MCQ';
  const rawCorrect = typeof raw.correctAnswer === 'number' ? raw.correctAnswer : -1;
  const answerVerified =
    typeof raw.answerVerified === 'boolean'
      ? raw.answerVerified
      : qType === 'MCQ'
        ? rawCorrect >= 0 && rawCorrect < options.length
        : true;

  const provenance =
    raw.provenance && typeof raw.provenance === 'object'
      ? (raw.provenance as Question['provenance'])
      : undefined;

  return {
    id: typeof raw.id === 'string' && raw.id ? raw.id : `${sessionId}-q-${idx + 1}`,
    number: typeof raw.number === 'number' ? raw.number : idx + 1,
    subject: typeof raw.subject === 'string' && raw.subject ? raw.subject : 'General',
    question: typeof raw.question === 'string' ? raw.question : '',
    options,
    correctAnswer: rawCorrect,
    answerVerified,
    explanation: typeof raw.explanation === 'string' ? raw.explanation : undefined,
    questionType: qType,
    institution: typeof raw.institution === 'string' ? raw.institution : '',
    session: typeof raw.session === 'string' ? raw.session : '',
    questionImageUrls: Array.isArray(raw.questionImageUrls)
      ? raw.questionImageUrls
          .filter((u): u is string => typeof u === 'string' && Boolean(u))
          .map(resolvePublicAsset)
      : undefined,
    optionImageUrls: Array.isArray(raw.optionImageUrls)
      ? raw.optionImageUrls.map((arr) =>
          Array.isArray(arr)
            ? arr
                .filter((u): u is string => typeof u === 'string' && Boolean(u))
                .map(resolvePublicAsset)
            : []
        )
      : undefined,
    explanationImageUrls: Array.isArray(raw.explanationImageUrls)
      ? raw.explanationImageUrls
          .filter((u): u is string => typeof u === 'string' && Boolean(u))
          .map(resolvePublicAsset)
      : undefined,
    optionLabels: Array.isArray(raw.optionLabels)
      ? raw.optionLabels.filter((l): l is string => typeof l === 'string')
      : undefined,
    provenance
  };
}

async function fetchJsonQuestionArray(url: string): Promise<Record<string, unknown>[] | null> {
  try {
    const response = await fetch(url, { cache: 'no-cache' });
    if (!response.ok) return null;

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html')) return null;

    const text = await response.text();
    if (!text || text.trim().startsWith('<!doctype') || text.trim().startsWith('<html')) {
      return null;
    }

    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter((item) => item && typeof item === 'object') as Record<string, unknown>[];
  } catch {
    return null;
  }
}

export async function loadSessionQuestions(
  sessionOrId: Session | string,
  options: { preloadImages?: boolean } = { preloadImages: true }
): Promise<Question[]> {
  const sessionId = typeof sessionOrId === 'string' ? sessionOrId : sessionOrId.id;
  if (!sessionId) return [];

  if (questionCache.has(sessionId)) {
    const cached = questionCache.get(sessionId)!;
    if (options.preloadImages && cached.length > 0) {
      preloadSessionImages(cached);
    }
    return cached;
  }

  if (inFlightRequests.has(sessionId)) {
    return inFlightRequests.get(sessionId)!;
  }

  const primaryUrl = getQuestionFilePath(sessionOrId);
  const legacyUrl = resolvePublicAsset(`data/${encodeURIComponent(sessionId)}.json`);

  const promise = (async (): Promise<Question[]> => {
    try {
      let rawItems = await fetchJsonQuestionArray(primaryUrl);
      if (!rawItems && primaryUrl !== legacyUrl) {
        rawItems = await fetchJsonQuestionArray(legacyUrl);
      }

      if (!rawItems) {
        questionCache.set(sessionId, []);
        availabilityCache.set(sessionId, false);
        return [];
      }

      const normalized = rawItems.map((item, idx) => normalizeQuestion(item, idx, sessionId));
      questionCache.set(sessionId, normalized);
      availabilityCache.set(sessionId, normalized.length > 0);
      if (options.preloadImages) {
        preloadSessionImages(normalized);
      }
      return normalized;
    } catch {
      questionCache.set(sessionId, []);
      availabilityCache.set(sessionId, false);
      return [];
    } finally {
      inFlightRequests.delete(sessionId);
    }
  })();

  inFlightRequests.set(sessionId, promise);
  return promise;
}

/**
 * Loads the lightweight availability index (`public/data/questions/index.json`)
 * in a single 1 KB request so the Home view knows immediately which sessions
 * have questions without firing 262 separate fetch requests.
 */
export async function loadAvailabilityIndex(): Promise<Record<string, boolean>> {
  try {
    const indexUrl = resolvePublicAsset('data/questions/index.json');
    const res = await fetch(indexUrl, { cache: 'no-cache' });
    if (res.ok) {
      const data = (await res.json()) as Record<string, number | boolean>;
      const result: Record<string, boolean> = {};
      for (const [sid, val] of Object.entries(data)) {
        const hasQ = typeof val === 'number' ? val > 0 : Boolean(val);
        result[sid] = hasQ;
        availabilityCache.set(sid, hasQ);
      }
      return result;
    }
  } catch {
    // fallback below
  }
  return {};
}

export function getCachedAvailability(sessionId: string): boolean | undefined {
  return availabilityCache.get(sessionId);
}
