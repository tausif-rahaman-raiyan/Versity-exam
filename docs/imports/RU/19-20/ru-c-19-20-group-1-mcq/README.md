# Question Import Report

## 1. Paper Information

- Institution: University of Rajshahi (রাজশাহী বিশ্ববিদ্যালয়)
- Institution ID: `RU`
- Unit: `C`
- Session: `19-20`
- Session ID: `ru-c-19-20-group-1-mcq`
- Paper title: RU C 19-20 (Group 1) MCQ
- Question type: MCQ
- Source filename: `RU_C_19-20__Group_1__MCQ_1be8729c.txt`
- Import date: 2026-11-12

## 2. Source File Analysis

- Original file format: Structured Admission Question Text (.txt)
- Original question structure: Bracketed subject tag `[Subject(15)] <globalNum>. <subNum>. <stem>`, pipe-separated options `A: ... | B: ... | C: ... | D: ...`, and `CORRECT ANSWER: <letter>`
- Number of questions detected: 92
- Number of subjects: 5 — Physics (22), Chemistry (19), Biology (23), ICT (3), Mathematics (25)
- MCQ count: 92
- Written count: 0
- Answer information: 91 answers provided in source (`CORRECT ANSWER` lines)
- Explanation information: No explanations supplied in source file
- Image references found: 5

## 3. Data Conversion

- Output JSON path: `public/data/questions/RU/19-20/ru-c-19-20-group-1-mcq.json`
- Question schema used: Standard `Question` TypeScript schema (`src/types.ts`) with `provenance` metadata
- Question IDs: `ru-c-19-20-group-1-mcq-q-001` through `ru-c-19-20-group-1-mcq-q-092`
- Numbering rules: Preserved exact sequential question numbers (1 to 92) from the source paper
- Option-label rules: Default Bangla (`ক, খ, গ, ঘ`) in BN mode and English (`A, B, C, D`) in EN mode, preserving 0-based `correctAnswer` indices (A=0, B=1, C=2, D=3)
- LaTeX and Markdown handling: Preserved all inline `$...$` and block `$$...$$` LaTeX expressions, chemical subscripts/superscripts, matrices, and integrals verbatim
- Bengali/English handling: Preserved original Bengali and English text verbatim without artificial translation
- Metadata changes: Mapped raw subject tags to canonical subject IDs (`Physics`, `Chemistry`, `Biology`, `ICT`, `Mathematics`)

## 4. Image Processing

- Number of image links discovered: 5
- Successfully downloaded: 5 (plus 0 deduplicated)
- Local image paths:
  - `assets/questions/RU/19-20/ru-c-19-20-group-1-mcq/q-003-option-a-3c8b0d.png` (Q#3, option-a)
  - `assets/questions/RU/19-20/ru-c-19-20-group-1-mcq/q-003-option-b-b743f9.png` (Q#3, option-b)
  - `assets/questions/RU/19-20/ru-c-19-20-group-1-mcq/q-003-option-c-3c6b8c.png` (Q#3, option-c)
  - `assets/questions/RU/19-20/ru-c-19-20-group-1-mcq/q-003-option-d-74219a.png` (Q#3, option-d)
  - `assets/questions/RU/19-20/ru-c-19-20-group-1-mcq/q-022-question-a1cce3.png` (Q#22, question)
- Failed downloads: 0
- Duplicate images: 0
- Original URLs manifest: `docs/imports/RU/19-20/ru-c-19-20-group-1-mcq/image-manifest.json`

## 5. Answer Verification

- Answers copied from original source: 91
- Independently verified answers: 0 (source-provided answers preserved per §3.4)
- Unverified questions: 1
- Questions requiring manual review: 1 pair(s) flagged & preserved from source (Q#58 & Q#79 [Mathematics])

## 6. Explanation Provenance

- Explanations copied from source: 0
- User-supplied explanations: 0
- Externally researched explanations: 0
- AI-generated explanations: 0 (no fake explanations generated; dynamic AI Tutor handles on-demand coaching)
- Explanations not supplied: 92
- Verification status: Source-provided answers recorded in `provenance`

## 7. Website Integration

- Question-loading path: `public/data/questions/RU/19-20/ru-c-19-20-group-1-mcq.json` via `getQuestionFilePath(session)` in `src/utils/questionLoader.ts`
- Image-loading method: `resolvePublicAsset()` in `src/utils/questionLoader.ts` (supports local Vite dev and GitHub Pages subpath)
- Question renderer: `QuestionBankView.tsx` & `ExamView.tsx` with `MathMarkdown.tsx`
- Option renderer: 2-column responsive option cards with text & `optionImageUrls` support
- Explanation renderer: `MathMarkdown.tsx` (`react-markdown` + `remark-math` + `rehype-katex` + `remark-gfm`)
- AI Tutor integration: `AiTutorPanel.tsx` (streams independent step-by-step solutions & inspects attached local images)
- Any component changes: None required beyond central loader path resolution

## 8. Validation

- JSON validation: PASS (`npm run validate:data`)
- Duplicate check: 1 pair(s) flagged & preserved from source (Q#58 & Q#79 [Mathematics])
- Image existence check: PASS (5 local files verified on disk)
- Metadata check: PASS (matches `src/data/sessions.ts` and `src/data/institutions.ts`)
- Production build: PASS (`npm run build`)
- Known issues: None

## 9. Git Changes

- Files created:
  - `public/data/questions/RU/19-20/ru-c-19-20-group-1-mcq.json`
  - `docs/imports/RU/19-20/ru-c-19-20-group-1-mcq/image-manifest.json`
  - `docs/imports/RU/19-20/ru-c-19-20-group-1-mcq/README.md`
- Files updated:
  - `docs/IMPORT_LOG.md`
- Files removed, if authorized: None
- Commit hash, if committed: Pending user git commit
- Branch: Workspace active branch
- Push status: Local workspace ready for push

## 10. Final Status

- Imported questions: 92
- Local images: 5
- Verified answers: 91
- Unverified answers: 1
- Build result: PASS
- Outstanding issues: None
