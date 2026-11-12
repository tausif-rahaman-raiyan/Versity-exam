# Architecture Overview

This document explains the internal system architecture of the **Admission Question Bank & Strict Exam Simulator** for developers and AI coding assistants maintaining or extending the repository.

---

## 1. High-Level Stack & Design Principles

- **Frontend Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 (`@import "tailwindcss";` in `src/index.css`), supporting Light/Dark modes and Bilingual (`bn`/`en`) UI.
- **Math & Markdown Rendering**: `react-markdown` + `remark-math` + `remark-gfm` + `rehype-katex` + `katex` (`src/components/MathMarkdown.tsx`).
- **AI Tutor Integration**: `@google/genai` SDK (`src/components/AiTutorPanel.tsx`) using user-supplied Gemini API keys stored locally in `localStorage` (`qb_api_key`).
- **Static-First Data Layer**: All 262 session papers are served as static JSON files under `public/data/questions/{INSTITUTION}/{SESSION}/{SESSION_ID}.json` with locally downloaded images under `public/assets/questions/{INSTITUTION}/{SESSION}/{SESSION_ID}/`. No backend database is required for core Question Bank, Strict Exam, or Analytics functionality.

---

## 2. Directory Structure

```text
/
├── public/
│   ├── logo.svg
│   ├── data/
│   │   ├── questions/
│   │   │   └── {INSTITUTION}/
│   │   │       └── {SESSION}/
│   │   │           └── {SESSION_ID}.json    # Canonical session question bank JSON
│   │   └── *.json                           # Empty placeholder fallback JSONs
│   └── assets/
│       └── questions/
│           └── {INSTITUTION}/
│               └── {SESSION}/
│                   └── {SESSION_ID}/        # Local downloaded question & option images
│                       ├── q10-stem-1.png
│                       ├── q28-opt-A-1.png
│                       └── ...
├── scripts/
│   ├── import-questions.mjs                 # Incremental parser, normalizer, image downloader & report generator
│   ├── download-question-images.mjs         # Standalone image downloader & manifest updater
│   ├── validate-question-data.mjs           # Schema, math, subject, and local image validator
│   └── check-duplicate-questions.mjs        # Normalized LaTeX/Bangla duplicate stem detector
├── docs/
│   ├── ARCHITECTURE.md                      # System architecture reference (this file)
│   ├── QUESTION_PIPELINE.md                 # End-to-end question import & rendering specification
│   ├── IMPORT_LOG.md                        # Cumulative chronological table of all imported papers
│   └── imports/
│       └── {INSTITUTION}/
│           └── {SESSION}/
│               └── {SESSION_ID}/
│                   ├── README.md            # Per-paper audit report
│                   └── image-manifest.json  # Source URL -> local file mapping
└── src/
    ├── types.ts                             # Central TypeScript interfaces (Question, SessionItem, ExamAttempt, etc.)
    ├── data/
    │   ├── siteConfig.ts                    # Site branding, social links, developer profile
    │   ├── institutions.ts                  # 16 institutions (DU, RU, JU, CU, GST, CoU, JnU, KhU, AGRI + 7 sub-universities)
    │   ├── sessions.ts                      # 262 session metadata records
    │   ├── subjects.ts                      # Canonical subject colors & bilingual labels
    │   ├── aiModels.ts                      # Supported Gemini models for AI Tutor
    │   └── translations.ts                  # Bilingual dictionary (Bangla & English)
    ├── utils/
    │   ├── questionLoader.ts                # Session JSON fetcher, memory cache & resolvePublicAsset()
    │   ├── storage.ts                       # Typed localStorage wrapper for bookmarks, mistakes, attempts, API key
    │   └── palettes.ts                      # Dynamic Tailwind color palette lookup for institution cards
    └── components/
        ├── Navbar.tsx                       # Sticky navigation bar with Home, Analytics, Settings, API Key
        ├── Footer.tsx                       # Developer profile & social links footer
        ├── HomeView.tsx                     # Institution grid, Agri Cluster drill-down, session timeline & search
        ├── QuestionBankView.tsx             # Interactive practice mode, filters, bookmarks, AI Tutor trigger
        ├── ExamView.tsx                     # Strict Timed Exam simulator with auto-lock & post-exam review
        ├── SubjectPickModal.tsx             # DU 4-of-6 subject selector before Strict Exam starts
        ├── AnalyticsView.tsx                # Performance dashboard, subject accuracy, mistakes & bookmarks review
        ├── AiTutorPanel.tsx                 # Slide-over streaming AI Tutor powered by @google/genai
        ├── MathMarkdown.tsx                 # Markdown + KaTeX + local image resolver component
        ├── SettingsDropdown.tsx             # Language, theme, and explanation source preferences
        └── ApiKeyModal.tsx                  # Local Gemini API key configuration modal
```

---

## 3. Application State Machine (`src/App.tsx`)

The single-page application uses a clean view state machine in `src/App.tsx`:
1. **`home` (`HomeView`)**:
   - Displays top-level institutions (and expands `AGRI` into its 7 agricultural universities when selected).
   - Lists all sessions for the selected institution with unit filter chips, search, and mode toggles (`Question Bank` vs `Strict Exam`).
   - Automatically probes session JSON files in the background so `Start Exam` buttons activate as soon as a session has imported questions.
2. **`bank` (`QuestionBankView`)**:
   - Loads questions via `loadSessionQuestions(sessionId)` from `src/utils/questionLoader.ts`.
   - Supports filtering by Subject, Type (`All`, `MCQ`, `Written`), Bookmarks, and search query.
   - Allows interactive option clicking with immediate green/red feedback, answer reveal, bookmarking, mistake tracking, and opening the AI Tutor slide-over panel.
3. **`exam` (`ExamView`)**:
   - For `DU` MCQ papers with ≥4 subjects (`Physics`, `Chemistry`, plus 2 chosen from `Math`, `Biology`, `Bangla`, `English`), launches `SubjectPickModal` before starting the timer.
   - Enforces **Strict Exam Rules**:
     - Countdown timer (`defaultDurationMinutes`, e.g., 60 minutes for DU MCQ).
     - **Single-Click Auto-Lock**: Once a student clicks an MCQ option, that question is locked immediately and cannot be changed or deselected (`lockedAnswers[q.id]` is immutable).
     - Negative marking (`-0.25` per wrong MCQ) and `+1.0` per correct MCQ.
     - Written questions (if present) provide a self-graded rubric after submission.
     - Automatically records completed attempts into `qb_attempts` and wrong MCQ IDs into `qb_mistakes`.
4. **`analytics` (`AnalyticsView`)**:
   - Aggregates all `ExamAttempt` records from `localStorage`.
   - Displays total exams taken, average accuracy, net score history, subject-by-subject accuracy bars, and dedicated tabs to review Bookmarked Questions and Mistake Log items across all imported sessions.

---

## 4. Path Resolution for Local Dev & GitHub Pages

To ensure compatibility both at `/` (local Vite dev server or custom domain) and `/<repo-name>/` (GitHub Pages project sites):
- `vite.config.ts` dynamically computes `base` from `GITHUB_PAGES_BASE` or `GITHUB_ACTIONS` + `GITHUB_REPOSITORY`.
- `src/utils/questionLoader.ts` exports `resolvePublicAsset(assetPath)` which prepends `import.meta.env.BASE_URL` to any relative asset path (`assets/questions/...` or `data/questions/...`).
- Neither question JSON files nor image paths hardcode a leading `/` that would break subpath deployments.
