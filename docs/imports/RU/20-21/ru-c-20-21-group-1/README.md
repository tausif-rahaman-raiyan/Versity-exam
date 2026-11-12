# Question Import Report

## 1. Paper Information

- Institution: University of Rajshahi (রাজশাহী বিশ্ববিদ্যালয়)
- Institution ID: `RU`
- Unit: `C`
- Session: `20-21`
- Session ID: `ru-c-20-21-group-1`
- Paper title: RU C 20-21 (Group 1)
- Question type: MCQ
- Source filename: `RU_C_20-21__Group_1__e235a271.txt`
- Import date: 2026-11-12

## 2. Source File Analysis

- Original file format: Structured Admission Question Text (.txt)
- Original question structure: Bracketed subject tag `[Subject(15)] <globalNum>. <subNum>. <stem>`, pipe-separated options `A: ... | B: ... | C: ... | D: ...`, and `CORRECT ANSWER: <letter>`
- Number of questions detected: 130
- Number of subjects: 5 — Mathematics (47), Physics (26), Biology (31), Chemistry (24), ICT (2)
- MCQ count: 130
- Written count: 0
- Answer information: 130 answers provided in source (`CORRECT ANSWER` lines)
- Explanation information: No explanations supplied in source file
- Image references found: 7

## 3. Data Conversion

- Output JSON path: `public/data/questions/RU/20-21/ru-c-20-21-group-1.json`
- Question schema used: Standard `Question` TypeScript schema (`src/types.ts`) with `provenance` metadata
- Question IDs: `ru-c-20-21-group-1-q-001` through `ru-c-20-21-group-1-q-130`
- Numbering rules: Preserved exact sequential question numbers (1 to 130) from the source paper
- Option-label rules: Default Bangla (`ক, খ, গ, ঘ`) in BN mode and English (`A, B, C, D`) in EN mode, preserving 0-based `correctAnswer` indices (A=0, B=1, C=2, D=3)
- LaTeX and Markdown handling: Preserved all inline `$...$` and block `$$...$$` LaTeX expressions, chemical subscripts/superscripts, matrices, and integrals verbatim
- Bengali/English handling: Preserved original Bengali and English text verbatim without artificial translation
- Metadata changes: Mapped raw subject tags to canonical subject IDs (`Mathematics`, `Physics`, `Biology`, `Chemistry`, `ICT`)

## 4. Image Processing

- Number of image links discovered: 7
- Successfully downloaded: 7 (plus 0 deduplicated)
- Local image paths:
  - `assets/questions/RU/20-21/ru-c-20-21-group-1/q-041-question-8da8bc.png` (Q#41, question)
  - `assets/questions/RU/20-21/ru-c-20-21-group-1/q-044-question-c1f89a.png` (Q#44, question)
  - `assets/questions/RU/20-21/ru-c-20-21-group-1/q-046-option-a-8aee1b.png` (Q#46, option-a)
  - `assets/questions/RU/20-21/ru-c-20-21-group-1/q-046-option-b-d29ddb.png` (Q#46, option-b)
  - `assets/questions/RU/20-21/ru-c-20-21-group-1/q-046-option-c-c116a0.png` (Q#46, option-c)
  - `assets/questions/RU/20-21/ru-c-20-21-group-1/q-046-option-d-f7df94.png` (Q#46, option-d)
  - `assets/questions/RU/20-21/ru-c-20-21-group-1/q-076-question-b1a2ba.svg` (Q#76, question)
- Failed downloads: 0
- Duplicate images: 0
- Original URLs manifest: `docs/imports/RU/20-21/ru-c-20-21-group-1/image-manifest.json`

## 5. Answer Verification

- Answers copied from original source: 130
- Independently verified answers: 0 (source-provided answers preserved per §3.4)
- Unverified questions: 0
- Questions requiring manual review: 1 pair(s) flagged & preserved from source (Q#24 & Q#25 [Mathematics])

## 6. Explanation Provenance

- Explanations copied from source: 0
- User-supplied explanations: 0
- Externally researched explanations: 0
- AI-generated explanations: 0 (no fake explanations generated; dynamic AI Tutor handles on-demand coaching)
- Explanations not supplied: 130
- Verification status: Source-provided answers recorded in `provenance`

## 7. Website Integration

- Question-loading path: `public/data/questions/RU/20-21/ru-c-20-21-group-1.json` via `getQuestionFilePath(session)` in `src/utils/questionLoader.ts`
- Image-loading method: `resolvePublicAsset()` in `src/utils/questionLoader.ts` (supports local Vite dev and GitHub Pages subpath)
- Question renderer: `QuestionBankView.tsx` & `ExamView.tsx` with `MathMarkdown.tsx`
- Option renderer: 2-column responsive option cards with text & `optionImageUrls` support
- Explanation renderer: `MathMarkdown.tsx` (`react-markdown` + `remark-math` + `rehype-katex` + `remark-gfm`)
- AI Tutor integration: `AiTutorPanel.tsx` (streams independent step-by-step solutions & inspects attached local images)
- Any component changes: None required beyond central loader path resolution

## 8. Validation

- JSON validation: PASS (`npm run validate:data`)
- Duplicate check: 1 pair(s) flagged & preserved from source (Q#24 & Q#25 [Mathematics])
- Image existence check: PASS (7 local files verified on disk)
- Metadata check: PASS (matches `src/data/sessions.ts` and `src/data/institutions.ts`)
- Production build: PASS (`npm run build`)
- Known issues: None

## 9. Git Changes

- Files created:
  - `public/data/questions/RU/20-21/ru-c-20-21-group-1.json`
  - `docs/imports/RU/20-21/ru-c-20-21-group-1/image-manifest.json`
  - `docs/imports/RU/20-21/ru-c-20-21-group-1/README.md`
- Files updated:
  - `docs/IMPORT_LOG.md`
- Files removed, if authorized: None
- Commit hash, if committed: Pending user git commit
- Branch: Workspace active branch
- Push status: Local workspace ready for push

## 10. Final Status

- Imported questions: 130
- Local images: 7
- Verified answers: 130
- Unverified answers: 0
- Build result: PASS
- Outstanding issues: None
