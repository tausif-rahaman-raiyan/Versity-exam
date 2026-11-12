# Admission Question Bank & Strict Exam Simulator

A comprehensive, bilingual (Bangla & English) **Bangladesh University Admission Question Bank, Strict Timed Exam Simulator, and AI Tutor Platform** built with React 19, TypeScript, Tailwind CSS v4, KaTeX, and the Google Gemini SDK (`@google/genai`).

---

## 1. Key Features

- **16 Institutions & 262 Session Papers**:
  - Covers **DU, RU, JU, CU, GST, CoU, JnU, KhU**, and the **Agriculture Admission Cluster (AGRI)** with 7 agricultural universities (**GST-Agri, GAU, BAU, SAU, CVASU, SYLAU, KAU**).
- **University / Session Structured Question & Asset Storage**:
  - Question JSON files live at `public/data/questions/{INSTITUTION}/{SESSION}/{SESSION_ID}.json`.
  - Question, option, and explanation images are stored locally inside `public/assets/questions/{INSTITUTION}/{SESSION}/{SESSION_ID}/` with zero dependency on fragile external image URLs.
- **Interactive Question Bank Mode**:
  - Filter by subject, question type (`MCQ` / `Written`), bookmarked status, or keyword search.
  - Instant option verification, answer reveal, bookmarking, and one-click **AI Tutor** slide-over panel.
- **Strict Timed Exam Simulator**:
  - **Single-Click Auto-Lock**: Clicking an MCQ option immediately locks that question for the remainder of the exam—mirroring real OMR sheet constraints.
  - **DU 4-of-6 Subject-Pick Modal**: Mandatory **Physics** & **Chemistry**, plus any **2 optional subjects** chosen from **Math, Biology, Bangla, English**.
  - Official negative marking (`-0.25` per wrong MCQ) and post-exam subject-wise breakdown.
- **AI Tutor Slide-Over Panel (`@google/genai`)**:
  - Streaming LaTeX + Bangla/English explanations, shortcut tricks, concept breakdowns, and multi-turn follow-up chat using the student's local Gemini API key.
- **Analytics, Mistake Log & Bookmarks**:
  - Persistent local tracking (`localStorage`) of exam attempts, subject accuracy bars, wrong answers, and bookmarked questions.

---

## 2. Project Structure

```text
/
├── public/
│   ├── data/
│   │   ├── questions/{INSTITUTION}/{SESSION}/{SESSION_ID}.json
│   │   └── *.json (empty fallback placeholders)
│   └── assets/
│       └── questions/{INSTITUTION}/{SESSION}/{SESSION_ID}/
├── scripts/
│   ├── import-questions.mjs           # Incremental question parser & image downloader
│   ├── download-question-images.mjs   # Standalone local image downloader
│   ├── validate-question-data.mjs     # JSON schema, LaTeX, and local image validator
│   └── check-duplicate-questions.mjs  # Duplicate stem detector
├── docs/
│   ├── ARCHITECTURE.md                # Full system architecture guide
│   ├── QUESTION_PIPELINE.md           # Question & image import pipeline specification
│   ├── IMPORT_LOG.md                  # Master table of all imported question papers
│   └── imports/{INSTITUTION}/{SESSION}/{SESSION_ID}/
│       ├── README.md                  # Per-paper audit report
│       └── image-manifest.json        # Source URL -> local file manifest
└── src/
    ├── components/                    # Navbar, HomeView, QuestionBankView, ExamView, AnalyticsView, AiTutorPanel, MathMarkdown
    ├── data/                          # institutions.ts, sessions.ts, subjects.ts, siteConfig.ts, translations.ts
    ├── utils/                         # questionLoader.ts, storage.ts, palettes.ts
    └── types.ts                       # TypeScript interfaces
```

---

## 3. Imported Question Papers Summary

| Institution | Session | Session ID | Questions | Subjects | Local Images | Status |
| :--- | :--- | :--- | :---: | :--- | :---: | :--- |
| **DU** | `21-22` | `du-21-22-mcq` | 90 | Bangla (15), English (15), Physics (15), Chemistry (15), Math (15), Biology (15) | 0 | Verified |
| **DU** | `23-24` | `du-23-24-mcq` | 90 | Bangla (15), English (15), Physics (15), Chemistry (15), Math (15), Biology (15) | 0 | Verified |
| **DU** | `24-25` | `du-24-25-mcq` | 90 | Bangla (15), English (15), Physics (15), Chemistry (15), Math (15), Biology (15) | 8 | Verified |
| **DU** | `25-26` | `du-25-26-mcq` | 90 | Bangla (15), English (15), Physics (15), Chemistry (15), Math (15), Biology (15) | 5 | Verified |

See [`docs/IMPORT_LOG.md`](docs/IMPORT_LOG.md) and [`docs/QUESTION_PIPELINE.md`](docs/QUESTION_PIPELINE.md) for detailed per-paper reports and provenance logs.

---

## 4. CLI Commands & Question Import Workflow

```bash
# Start local development server on port 3000
npm run dev

# Import a raw TXT/MD/JSON question file into public/data/questions/{INSTITUTION}/{SESSION}/{SESSION_ID}.json
# Automatically downloads all external images into public/assets/questions/...
npm run import:questions -- <path-to-raw-file> [optional-session-id]

# Re-verify or download any external images referenced in imported JSON files
npm run images:download -- [optional-session-id]

# Validate all imported question JSON files, subject tags, LaTeX delimiters, and local image files
npm run validate:data

# Check for duplicate question stems within each paper
npm run check:duplicates

# Run production TypeScript + Vite build
npm run build
```

---

## 5. GitHub Pages Auto-Deployment

This repository includes `.github/workflows/deploy.yml` configured for **GitHub Pages**:
- On every push to `main`, GitHub Actions runs:
  1. `npm ci`
  2. `npm run validate:data`
  3. `npm run check:duplicates`
  4. `npm run build` (with `vite.config.ts` automatically resolving the repository base path)
  5. Deploys `dist/` to GitHub Pages via `actions/deploy-pages@v4`.
