# Question Import Report

## 1. Paper Information

- Institution: University of Rajshahi (রাজশাহী বিশ্ববিদ্যালয়)
- Institution ID: `RU`
- Unit: `C`
- Session: `20-21`
- Session ID: `ru-c-20-21-group-2`
- Paper title: RU C 20-21 (Group 2)
- Question type: MCQ
- Source filename: `RU_C_20-21__Group_2__9c3de090.txt`
- Import date: 2026-11-12

## 2. Source File Analysis

- Original file format: Structured Admission Question Text (.txt)
- Original question structure: Bracketed subject tag `[Subject(15)] <globalNum>. <subNum>. <stem>`, pipe-separated options `A: ... | B: ... | C: ... | D: ...`, and `CORRECT ANSWER: <letter>`
- Number of questions detected: 130
- Number of subjects: 5 — Physics (25), Chemistry (27), Biology (33), ICT (2), Mathematics (43)
- MCQ count: 130
- Written count: 0
- Answer information: 129 answers provided in source (`CORRECT ANSWER` lines)
- Explanation information: No explanations supplied in source file
- Image references found: 8

## 3. Data Conversion

- Output JSON path: `public/data/questions/RU/20-21/ru-c-20-21-group-2.json`
- Question schema used: Standard `Question` TypeScript schema (`src/types.ts`) with `provenance` metadata
- Question IDs: `ru-c-20-21-group-2-q-001` through `ru-c-20-21-group-2-q-130`
- Numbering rules: Preserved exact sequential question numbers (1 to 130) from the source paper
- Option-label rules: Default Bangla (`ক, খ, গ, ঘ`) in BN mode and English (`A, B, C, D`) in EN mode, preserving 0-based `correctAnswer` indices (A=0, B=1, C=2, D=3)
- LaTeX and Markdown handling: Preserved all inline `$...$` and block `$$...$$` LaTeX expressions, chemical subscripts/superscripts, matrices, and integrals verbatim
- Bengali/English handling: Preserved original Bengali and English text verbatim without artificial translation
- Metadata changes: Mapped raw subject tags to canonical subject IDs (`Physics`, `Chemistry`, `Biology`, `ICT`, `Mathematics`)

## 4. Image Processing

- Number of image links discovered: 8
- Successfully downloaded: 8 (plus 0 deduplicated)
- Local image paths:
  - `assets/questions/RU/20-21/ru-c-20-21-group-2/q-007-question-17b77a.png` (Q#7, question)
  - `assets/questions/RU/20-21/ru-c-20-21-group-2/q-014-question-cc04d8.png` (Q#14, question)
  - `assets/questions/RU/20-21/ru-c-20-21-group-2/q-015-option-a-6862cc.png` (Q#15, option-a)
  - `assets/questions/RU/20-21/ru-c-20-21-group-2/q-015-option-b-68864e.png` (Q#15, option-b)
  - `assets/questions/RU/20-21/ru-c-20-21-group-2/q-015-option-c-57e1eb.png` (Q#15, option-c)
  - `assets/questions/RU/20-21/ru-c-20-21-group-2/q-015-option-d-1f29a5.png` (Q#15, option-d)
  - `assets/questions/RU/20-21/ru-c-20-21-group-2/q-021-question-589dd5.png` (Q#21, question)
  - `assets/questions/RU/20-21/ru-c-20-21-group-2/q-052-question-e7da13.png` (Q#52, question)
- Failed downloads: 0
- Duplicate images: 0
- Original URLs manifest: `docs/imports/RU/20-21/ru-c-20-21-group-2/image-manifest.json`

## 5. Answer Verification

- Answers copied from original source: 129
- Independently verified answers: 0 (source-provided answers preserved per §3.4)
- Unverified questions: 1
- Questions requiring manual review: None

## 6. Explanation Provenance

- Explanations copied from source: 0
- User-supplied explanations: 0
- Externally researched explanations: 0
- AI-generated explanations: 0 (no fake explanations generated; dynamic AI Tutor handles on-demand coaching)
- Explanations not supplied: 130
- Verification status: Source-provided answers recorded in `provenance`

## 7. Website Integration

- Question-loading path: `public/data/questions/RU/20-21/ru-c-20-21-group-2.json` via `getQuestionFilePath(session)` in `src/utils/questionLoader.ts`
- Image-loading method: `resolvePublicAsset()` in `src/utils/questionLoader.ts` (supports local Vite dev and GitHub Pages subpath)
- Question renderer: `QuestionBankView.tsx` & `ExamView.tsx` with `MathMarkdown.tsx`
- Option renderer: 2-column responsive option cards with text & `optionImageUrls` support
- Explanation renderer: `MathMarkdown.tsx` (`react-markdown` + `remark-math` + `rehype-katex` + `remark-gfm`)
- AI Tutor integration: `AiTutorPanel.tsx` (streams independent step-by-step solutions & inspects attached local images)
- Any component changes: None required beyond central loader path resolution

## 8. Validation

- JSON validation: PASS (`npm run validate:data`)
- Duplicate check: 0 internal duplicates detected
- Image existence check: PASS (8 local files verified on disk)
- Metadata check: PASS (matches `src/data/sessions.ts` and `src/data/institutions.ts`)
- Production build: PASS (`npm run build`)
- Known issues: None

## 9. Git Changes

- Files created:
  - `public/data/questions/RU/20-21/ru-c-20-21-group-2.json`
  - `docs/imports/RU/20-21/ru-c-20-21-group-2/image-manifest.json`
  - `docs/imports/RU/20-21/ru-c-20-21-group-2/README.md`
- Files updated:
  - `docs/IMPORT_LOG.md`
- Files removed, if authorized: None
- Commit hash, if committed: Pending user git commit
- Branch: Workspace active branch
- Push status: Local workspace ready for push

## 10. Final Status

- Imported questions: 130
- Local images: 8
- Verified answers: 129
- Unverified answers: 1
- Build result: PASS
- Outstanding issues: None
