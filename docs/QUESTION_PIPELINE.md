# Question Pipeline & Data Specification

This document is the authoritative technical reference for importing, validating, storing, and rendering university admission question papers in this repository. Any human developer or AI assistant adding new question files MUST follow this specification.

---

## 1. Where Question Files Live

Every session defined in `src/data/sessions.ts` maps to a structured path based on its `institution`, `session` (normalized for filesystem safety), and `id`:

```text
public/data/questions/{INSTITUTION}/{SESSION}/{SESSION_ID}.json
```

**Examples:**
- `du-21-22-mcq` → `public/data/questions/DU/21-22/du-21-22-mcq.json`
- `du-23-24-mcq` → `public/data/questions/DU/23-24/du-23-24-mcq.json`
- `du-24-25-mcq` → `public/data/questions/DU/24-25/du-24-25-mcq.json`
- `du-25-26-mcq` → `public/data/questions/DU/25-26/du-25-26-mcq.json`

The frontend loader (`getQuestionFilePath` in `src/utils/questionLoader.ts`) automatically resolves this path from the `SessionItem` metadata and falls back to `public/data/{SESSION_ID}.json` for empty placeholder sessions.

---

## 2. Where Question Images Live

External image URLs are never used at runtime. All question stem images, option images, and explanation images are downloaded locally into:

```text
public/assets/questions/{INSTITUTION}/{SESSION}/{SESSION_ID}/
```

### Naming Convention
- **Question Stem Image**: `q{QUESTION_ID}-stem-{INDEX}.{EXT}` (e.g., `q10-stem-1.png`)
- **Option Image**: `q{QUESTION_ID}-opt-{OPTION_KEY}-{INDEX}.{EXT}` (e.g., `q28-opt-A-1.png`)
- **Explanation Image**: `q{QUESTION_ID}-exp-{INDEX}.{EXT}` (e.g., `q15-exp-1.png`)

In the JSON file, images are referenced using relative public paths (without a leading slash) so `resolvePublicAsset()` in `src/utils/questionLoader.ts` works seamlessly on both local dev (`/`) and GitHub Pages (`/repo-name/`):
- In `image` or `optionImages[key]`: `"assets/questions/DU/25-26/du-25-26-mcq/q10-stem-1.png"`
- Inside markdown strings (`question`, `options[key]`, `explanation`): `![Question 10](assets/questions/DU/25-26/du-25-26-mcq/q10-stem-1.png)`

---

## 3. Where Per-Paper Import Documentation Lives

Every imported session generates an audit directory at:

```text
docs/imports/{INSTITUTION}/{SESSION}/{SESSION_ID}/
├── README.md            # Subject breakdown, answer provenance, duplicate & image summary
└── image-manifest.json  # Exact mapping of original external URL -> local asset path & status
```

Additionally, a single row is appended or updated in the master table at `docs/IMPORT_LOG.md`.

---

## 4. Exact Question JSON Schema (`src/types.ts`)

Each `public/data/questions/{INSTITUTION}/{SESSION}/{SESSION_ID}.json` file contains a JSON array of `Question` objects:

```ts
export interface Question {
  id: number;                                      // Sequential 1-based integer within the paper
  subject: string;                                 // Canonical subject: "Physics" | "Chemistry" | "Math" | "Biology" | "Bangla" | "English" | "ICT" | "GK"
  type?: 'mcq' | 'written';                        // Defaults to 'mcq'
  unit?: string;                                   // e.g. "A"
  marks?: number;                                  // Default 1 for MCQ
  question: string;                                // Question stem (Bangla/English + LaTeX + optional markdown image)
  image?: string;                                  // Optional relative local path: "assets/questions/..."
  options?: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  optionImages?: Partial<Record<'A' | 'B' | 'C' | 'D', string>>; // Optional relative local paths per option
  answer?: 'A' | 'B' | 'C' | 'D';                  // Verbatim uppercase option key for MCQ
  writtenAnswer?: string;                          // Official model answer for written questions
  explanation?: string;                            // Included ONLY if supplied in source or explicitly verified
  provenance?: {
    source_file: string;
    imported_at: string;
    answer_status: 'verified_from_source' | 'verified_corrected' | 'flagged_ambiguous';
    explanation_status: 'from_source' | 'not_supplied_in_source' | 'verified_reference';
    notes?: string;
  };
}
```

---

## 5. How Sessions Connect to Question Files

1. `src/data/sessions.ts` defines the 262 `SessionItem` entries (`id`, `institution`, `session`, `unit`, `title`, `type`, `defaultDurationMinutes`, `negativeMark`).
2. When a user opens a session in `QuestionBankView` or `ExamView` (or when `App.tsx` probes session availability on startup), `loadSessionQuestions(sessionId)` in `src/utils/questionLoader.ts`:
   - Looks up the `SessionItem` in `sessions.ts`.
   - Builds the canonical path `data/questions/{institution}/{session}/{sessionId}.json` via `getQuestionFilePath(session)`.
   - Prepends `import.meta.env.BASE_URL` via `resolvePublicAsset()`.
   - Fetches and caches the parsed `Question[]` in memory.

---

## 6. How Raw TXT / MD / JSON / CSV Files Are Parsed (`scripts/import-questions.mjs`)

The importer script (`scripts/import-questions.mjs`) supports raw `.txt`, `.md`, and `.json` question files. For the standard admission `.txt` format:

1. **Subject Section Headers**:
   - Detects headers matching `SUBJECT: <NAME> (<COUNT> QUESTIONS)` and maps aliases (`Mathematics (Higher Math)` → `Math`, `Bangla` → `Bangla`, `English` → `English`, `Physics` → `Physics`, `Chemistry` → `Chemistry`, `Biology` → `Biology`).
2. **Question Blocks**:
   - Splits on `[QUESTION #<N>]` markers.
   - Extracts optional `QUESTION IMAGE: EXTERNAL_IMAGE_URL: <url>` lines.
   - Extracts the stem lines up to `OPTIONS:`.
   - Extracts options `A:`, `B:`, `C:`, `D:` up to `CORRECT ANSWER:`.
   - Extracts `CORRECT ANSWER: <A|B|C|D>` and optional `EXPLANATION:` blocks.
3. **Inline Option Images**:
   - Detects `[IMAGE: EXTERNAL_IMAGE_URL: <url>]` or `EXTERNAL_IMAGE_URL: <url>` inside option lines, downloads the image locally, stores its local path in `optionImages[optKey]`, and converts the option text into clean markdown `![Option A](assets/questions/...)`.

---

## 7. How Math / LaTeX Is Normalized and Rendered

- Inline math (`$...$`) and block math (`$$...$$`) from the raw source are preserved verbatim.
- `scripts/import-questions.mjs` repairs common raw text artifacts:
  - Normalizes `\r\n` line endings and strips stray trailing spaces.
  - Converts unescaped `\%` inside `$ ... $` or standalone percentages where needed without corrupting LaTeX commands (`\frac`, `\sqrt`, `\int`, `\sum`, `\lim`, `\vec`, `\hat`, `\alpha`, `\beta`, `\theta`, `\pi`, `\Delta`, `\times`, `\cdot`, etc.).
- At runtime, `src/components/MathMarkdown.tsx` passes text through `remark-math`, `remark-gfm`, and `rehype-katex` (`throwOnError: false`) so any minor source quirk renders gracefully instead of crashing the page.

---

## 8. How Bangla Unicode Text Is Preserved

- All file reads and writes use explicit `UTF-8` encoding (`fs.readFileSync(path, 'utf8')`, `fs.writeFileSync(path, data, 'utf8')`).
- Bangla characters, conjuncts (যুক্তবর্ণ), चंद्रबिन्दु (ँ), अनुस्वार (ং), विसर्ग (ঃ), and Bangla digits (`০-৯`) are preserved untouched in stems, options, and explanations.

---

## 9. How External Images Are Downloaded & Rewritten

1. During `npm run import:questions -- <path> [sessionId]` (or standalone `npm run images:download -- <sessionId>`):
   - Every external image URL found in a question stem, option, or explanation is queued for download.
   - The script downloads the binary file using `fetch()` into `public/assets/questions/{INSTITUTION}/{SESSION}/{SESSION_ID}/`.
   - The content-type header or URL extension determines `.png`, `.jpg`, `.webp`, or `.svg`.
   - If the target file already exists and is non-empty, it is reused deterministically without re-downloading.
   - The question JSON is updated with the local relative path (`assets/questions/...`) and `image-manifest.json` records the exact source URL, local path, byte size, and status (`downloaded` or `cached`).

---

## 10. How Duplicate Detection Works (`scripts/check-duplicate-questions.mjs`)

- Normalizes each question stem (lowercased, whitespace collapsed, punctuation trimmed) while keeping option values and image paths in context.
- Checks for identical normalized stems within the same session JSON file.
- If two questions share the same stem (for example, when an official source paper accidentally repeats a question at two different question numbers), the script logs a warning in the console and in the per-paper `README.md` audit report while keeping the original question numbering intact unless verified as an import artifact.

---

## 11. How Answer & Explanation Verification Works

- **Answers**: Extracted directly from the source `CORRECT ANSWER:` field and validated to be one of `A`, `B`, `C`, `D` with a non-empty corresponding option.
- **Explanations**:
  - If the source file contains an explanation, it is stored in `question.explanation` with `explanation_status: "from_source"`.
  - If the source file does not include explanations (such as the DU raw MCQ papers), `question.explanation` is omitted (`explanation_status: "not_supplied_in_source"`). We **never** hallucinate or bulk-fabricate unverified explanations during import.
  - In the UI, when `question.explanation` is absent, students can click **Ask AI Tutor** on any question card to generate an interactive, step-by-step streaming explanation via `@google/genai`.

---

## 12. How Stored Explanations Differ from Live AI Tutor Explanations

| Feature | Stored Explanation (`question.explanation`) | Live AI Tutor (`AiTutorPanel.tsx`) |
| :--- | :--- | :--- |
| **Source** | Pre-verified static text in the session JSON file | Generated on-demand via `@google/genai` using the student's API key |
| **Offline / Zero-Key Support** | Works immediately with no API key | Requires user's Gemini API key in Settings / API Key Modal |
| **Interactivity** | Static markdown + KaTeX box below the question | Full multi-turn chat + quick action buttons (*Step-by-Step*, *Shortcut Trick*, *Explain in Bangla*, *Why Others Wrong*) |
| **Settings Toggle** | Controlled via `Explanation Source` (`Database Only`, `AI Only`, or `Both`) in Settings | Always accessible via the `AI Tutor` button on any question card |

---

## 13. How to Import Future Question Papers Step-by-Step

Whenever new `.txt`, `.md`, or `.json` question files are uploaded:

```bash
# 1. Import a single file (auto-detects session ID from filename or pass explicitly)
npm run import:questions -- path/to/file.txt du-22-23-mcq

# 2. Or import an entire folder of uploaded files at once
npm run import:questions -- path/to/folder/

# 3. Validate all JSON schemas, math delimiters, and local image files
npm run validate:data

# 4. Check for duplicate questions across all imported papers
npm run check:duplicates

# 5. Build the production bundle to verify zero TypeScript or Vite errors
npm run build
```
