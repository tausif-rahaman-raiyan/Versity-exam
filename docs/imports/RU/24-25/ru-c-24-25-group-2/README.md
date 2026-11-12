# Question Import Report

## 1. Paper Information

- Institution: University of Rajshahi (রাজশাহী বিশ্ববিদ্যালয়)
- Institution ID: `RU`
- Unit: `C`
- Session: `24-25`
- Session ID: `ru-c-24-25-group-2`
- Paper title: RU C 24-25 (Group 2)
- Question type: MCQ
- Source filename: `RU_C_24-25__Group_2__d9370ab4.txt`
- Import date: 2026-11-12

## 2. Source File Analysis

- Original file format: Structured Admission Question Text (.txt)
- Original question structure: Bracketed subject tag `[Subject(15)] <globalNum>. <subNum>. <stem>`, pipe-separated options `A: ... | B: ... | C: ... | D: ...`, and `CORRECT ANSWER: <letter>`
- Number of questions detected: 130
- Number of subjects: 5 — Physics (24), Biology (35), Chemistry (24), ICT (4), Mathematics (43)
- MCQ count: 130
- Written count: 0
- Answer information: 130 answers provided in source (`CORRECT ANSWER` lines)
- Explanation information: No explanations supplied in source file
- Image references found: 11

## 3. Data Conversion

- Output JSON path: `public/data/questions/RU/24-25/ru-c-24-25-group-2.json`
- Question schema used: Standard `Question` TypeScript schema (`src/types.ts`) with `provenance` metadata
- Question IDs: `ru-c-24-25-group-2-q-001` through `ru-c-24-25-group-2-q-130`
- Numbering rules: Preserved exact sequential question numbers (1 to 130) from the source paper
- Option-label rules: Default Bangla (`ক, খ, গ, ঘ`) in BN mode and English (`A, B, C, D`) in EN mode, preserving 0-based `correctAnswer` indices (A=0, B=1, C=2, D=3)
- LaTeX and Markdown handling: Preserved all inline `$...$` and block `$$...$$` LaTeX expressions, chemical subscripts/superscripts, matrices, and integrals verbatim
- Bengali/English handling: Preserved original Bengali and English text verbatim without artificial translation
- Metadata changes: Mapped raw subject tags to canonical subject IDs (`Physics`, `Biology`, `Chemistry`, `ICT`, `Mathematics`)

## 4. Image Processing

- Number of image links discovered: 11
- Successfully downloaded: 11 (plus 0 deduplicated)
- Local image paths:
  - `assets/questions/RU/24-25/ru-c-24-25-group-2/q-016-question-3e0b52.png` (Q#16, question)
  - `assets/questions/RU/24-25/ru-c-24-25-group-2/q-023-question-b2b399.png` (Q#23, question)
  - `assets/questions/RU/24-25/ru-c-24-25-group-2/q-027-option-a-eafba0.png` (Q#27, option-a)
  - `assets/questions/RU/24-25/ru-c-24-25-group-2/q-027-option-b-3957fd.png` (Q#27, option-b)
  - `assets/questions/RU/24-25/ru-c-24-25-group-2/q-027-option-c-f38e95.png` (Q#27, option-c)
  - `assets/questions/RU/24-25/ru-c-24-25-group-2/q-027-option-d-6ceb12.png` (Q#27, option-d)
  - `assets/questions/RU/24-25/ru-c-24-25-group-2/q-032-option-d-714af2.png` (Q#32, option-d)
  - `assets/questions/RU/24-25/ru-c-24-25-group-2/q-033-option-a-a41423.png` (Q#33, option-a)
  - `assets/questions/RU/24-25/ru-c-24-25-group-2/q-033-option-b-1ad067.png` (Q#33, option-b)
  - `assets/questions/RU/24-25/ru-c-24-25-group-2/q-033-option-c-0b1b0b.png` (Q#33, option-c)
  - `assets/questions/RU/24-25/ru-c-24-25-group-2/q-033-option-d-94ddca.png` (Q#33, option-d)
- Failed downloads: 0
- Duplicate images: 0
- Original URLs manifest: `docs/imports/RU/24-25/ru-c-24-25-group-2/image-manifest.json`

## 5. Answer Verification

- Answers copied from original source: 130
- Independently verified answers: 0 (source-provided answers preserved per §3.4)
- Unverified questions: 0
- Questions requiring manual review: None

## 6. Explanation Provenance

- Explanations copied from source: 0
- User-supplied explanations: 0
- Externally researched explanations: 0
- AI-generated explanations: 0 (no fake explanations generated; dynamic AI Tutor handles on-demand coaching)
- Explanations not supplied: 130
- Verification status: Source-provided answers recorded in `provenance`

## 7. Website Integration

- Question-loading path: `public/data/questions/RU/24-25/ru-c-24-25-group-2.json` via `getQuestionFilePath(session)` in `src/utils/questionLoader.ts`
- Image-loading method: `resolvePublicAsset()` in `src/utils/questionLoader.ts` (supports local Vite dev and GitHub Pages subpath)
- Question renderer: `QuestionBankView.tsx` & `ExamView.tsx` with `MathMarkdown.tsx`
- Option renderer: 2-column responsive option cards with text & `optionImageUrls` support
- Explanation renderer: `MathMarkdown.tsx` (`react-markdown` + `remark-math` + `rehype-katex` + `remark-gfm`)
- AI Tutor integration: `AiTutorPanel.tsx` (streams independent step-by-step solutions & inspects attached local images)
- Any component changes: None required beyond central loader path resolution

## 8. Validation

- JSON validation: PASS (`npm run validate:data`)
- Duplicate check: 0 internal duplicates detected
- Image existence check: PASS (11 local files verified on disk)
- Metadata check: PASS (matches `src/data/sessions.ts` and `src/data/institutions.ts`)
- Production build: PASS (`npm run build`)
- Known issues: None

## 9. Git Changes

- Files created:
  - `public/data/questions/RU/24-25/ru-c-24-25-group-2.json`
  - `docs/imports/RU/24-25/ru-c-24-25-group-2/image-manifest.json`
  - `docs/imports/RU/24-25/ru-c-24-25-group-2/README.md`
- Files updated:
  - `docs/IMPORT_LOG.md`
- Files removed, if authorized: None
- Commit hash, if committed: Pending user git commit
- Branch: Workspace active branch
- Push status: Local workspace ready for push

## 10. Final Status

- Imported questions: 130
- Local images: 11
- Verified answers: 130
- Unverified answers: 0
- Build result: PASS
- Outstanding issues: None
