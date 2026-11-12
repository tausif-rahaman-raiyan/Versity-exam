# Question Import Report

## 1. Paper Information

- Institution: University of Rajshahi (রাজশাহী বিশ্ববিদ্যালয়)
- Institution ID: `RU`
- Unit: `C`
- Session: `25-26`
- Session ID: `ru-c-25-26-group-2`
- Paper title: RU C 25-26 (Group-2)
- Question type: MCQ
- Source filename: `RU_C_25-26__Group-2__81d2ff0e.txt`
- Import date: 2026-11-12

## 2. Source File Analysis

- Original file format: Structured Admission Question Text (.txt)
- Original question structure: Bracketed subject tag `[Subject(15)] <globalNum>. <subNum>. <stem>`, pipe-separated options `A: ... | B: ... | C: ... | D: ...`, and `CORRECT ANSWER: <letter>`
- Number of questions detected: 130
- Number of subjects: 5 — Physics (29), Chemistry (22), ICT (4), Mathematics (44), Biology (31)
- MCQ count: 130
- Written count: 0
- Answer information: 129 answers provided in source (`CORRECT ANSWER` lines)
- Explanation information: No explanations supplied in source file
- Image references found: 2

## 3. Data Conversion

- Output JSON path: `public/data/questions/RU/25-26/ru-c-25-26-group-2.json`
- Question schema used: Standard `Question` TypeScript schema (`src/types.ts`) with `provenance` metadata
- Question IDs: `ru-c-25-26-group-2-q-001` through `ru-c-25-26-group-2-q-130`
- Numbering rules: Preserved exact sequential question numbers (1 to 130) from the source paper
- Option-label rules: Default Bangla (`ক, খ, গ, ঘ`) in BN mode and English (`A, B, C, D`) in EN mode, preserving 0-based `correctAnswer` indices (A=0, B=1, C=2, D=3)
- LaTeX and Markdown handling: Preserved all inline `$...$` and block `$$...$$` LaTeX expressions, chemical subscripts/superscripts, matrices, and integrals verbatim
- Bengali/English handling: Preserved original Bengali and English text verbatim without artificial translation
- Metadata changes: Mapped raw subject tags to canonical subject IDs (`Physics`, `Chemistry`, `ICT`, `Mathematics`, `Biology`)

## 4. Image Processing

- Number of image links discovered: 2
- Successfully downloaded: 2 (plus 0 deduplicated)
- Local image paths:
  - `assets/questions/RU/25-26/ru-c-25-26-group-2/q-025-question-a09c41.png` (Q#25, question)
  - `assets/questions/RU/25-26/ru-c-25-26-group-2/q-044-question-8261cf.png` (Q#44, question)
- Failed downloads: 0
- Duplicate images: 0
- Original URLs manifest: `docs/imports/RU/25-26/ru-c-25-26-group-2/image-manifest.json`

## 5. Answer Verification

- Answers copied from original source: 129
- Independently verified answers: 0 (source-provided answers preserved per §3.4)
- Unverified questions: 1
- Questions requiring manual review: 2 pair(s) flagged & preserved from source (Q#77 & Q#108 [Mathematics]; Q#76 & Q#115 [Mathematics])

## 6. Explanation Provenance

- Explanations copied from source: 0
- User-supplied explanations: 0
- Externally researched explanations: 0
- AI-generated explanations: 0 (no fake explanations generated; dynamic AI Tutor handles on-demand coaching)
- Explanations not supplied: 130
- Verification status: Source-provided answers recorded in `provenance`

## 7. Website Integration

- Question-loading path: `public/data/questions/RU/25-26/ru-c-25-26-group-2.json` via `getQuestionFilePath(session)` in `src/utils/questionLoader.ts`
- Image-loading method: `resolvePublicAsset()` in `src/utils/questionLoader.ts` (supports local Vite dev and GitHub Pages subpath)
- Question renderer: `QuestionBankView.tsx` & `ExamView.tsx` with `MathMarkdown.tsx`
- Option renderer: 2-column responsive option cards with text & `optionImageUrls` support
- Explanation renderer: `MathMarkdown.tsx` (`react-markdown` + `remark-math` + `rehype-katex` + `remark-gfm`)
- AI Tutor integration: `AiTutorPanel.tsx` (streams independent step-by-step solutions & inspects attached local images)
- Any component changes: None required beyond central loader path resolution

## 8. Validation

- JSON validation: PASS (`npm run validate:data`)
- Duplicate check: 2 pair(s) flagged & preserved from source (Q#77 & Q#108 [Mathematics]; Q#76 & Q#115 [Mathematics])
- Image existence check: PASS (2 local files verified on disk)
- Metadata check: PASS (matches `src/data/sessions.ts` and `src/data/institutions.ts`)
- Production build: PASS (`npm run build`)
- Known issues: None

## 9. Git Changes

- Files created:
  - `public/data/questions/RU/25-26/ru-c-25-26-group-2.json`
  - `docs/imports/RU/25-26/ru-c-25-26-group-2/image-manifest.json`
  - `docs/imports/RU/25-26/ru-c-25-26-group-2/README.md`
- Files updated:
  - `docs/IMPORT_LOG.md`
- Files removed, if authorized: None
- Commit hash, if committed: Pending user git commit
- Branch: Workspace active branch
- Push status: Local workspace ready for push

## 10. Final Status

- Imported questions: 130
- Local images: 2
- Verified answers: 129
- Unverified answers: 1
- Build result: PASS
- Outstanding issues: None
